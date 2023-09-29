import { Avatar, Input, Skeleton, message } from "antd";
import { useContext, useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useParams } from "react-router-dom";
import { AppContext } from "../../contexts/AppContext";
import styles from "./index.module.scss";
import useFetchInfinit from "../../commons/hooks/useFetchInfinit";
import { CONVERSATION_DETAIL, SEND_MESSAGE, UPLOAD_FILE_URL } from "../../commons/constants/api-urls";
import moment from "moment";
import defaultAxios, { uploadAxios } from "../../commons/utils/axios";
import CustomIcon from "../../commons/components/CustomIcon/CustomIcon";
import { GalleryIcon, SendIcon, TrashIcon } from "../../commons/resources";
import { IMAGE_TYPE_ALLOW } from "../../commons/constants";
import { AxiosResponse } from "axios";
import { IMAGE } from "../../commons/constants/message";
import { getKey } from "../../commons/utils/functions/filterDuplicate";
import ReadedIcon from "../../assets/icons/readed.svg";
import SeenIcon from "../../assets/icons/SeenIcon.svg";

const perPage = 10;

declare interface Props {
  conversation: Conversation;
}
const { SVG, JPG, JPEG, PNG } = IMAGE_TYPE_ALLOW;
const ACCEPTEDS = [SVG, JPG, JPEG, PNG].join(",");
const matchKeys: (keyof Message)[] = ["speaker_id", "timestamp", "message"];

const ConversationDetail: React.FC<Props> = ({ conversation }) => {
  const { setCurrentStore, store, currentStore } = useContext(AppContext);
  const { storeId } = useParams<{ storeId: string }>();
  const [text, setText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [loadingSend, setLoadingSend] = useState(false);
  const imageInput = useRef<HTMLInputElement | null>(null);

  const { initialized, data, loading, hasMore, next, refresh } = useFetchInfinit<Message>(
    currentStore?.id ? CONVERSATION_DETAIL(currentStore.id, conversation.user_id) : "",
    { perPage },
    matchKeys
  );

  useEffect(() => {
    setCurrentStore(store.data.find(item => item.id.toString() === storeId) || null);
  }, [storeId, setCurrentStore, store]);

  useEffect(() => {
    const interval = setInterval(() => {
      refresh();
    }, 2000);
    return () => clearInterval(interval);
  }, [refresh]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const code = e.keyCode ? e.keyCode : e.which;
    if (code === 13 && !e.shiftKey) handleSubmit();
  };

  const handleChangeFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files: File[] = Array.from(e.target.files);
      if (files.some(({ size }) => size >= 1024 * 1024 * 2)) {
        message.error(IMAGE.NOT_EXCEED_2MB);
        return handleRemoveFile();
      }
      setFiles(files);
    }
  };

  const handleRemoveFile = () => {
    if (imageInput.current) imageInput.current.value = "";
    setFiles([]);
  };

  const handleSubmit = async () => {
    if (!currentStore?.id) return;
    if (loadingSend) return;
    if (!text.trim() && !files.length) return;
    setLoadingSend(true);
    try {
      const urls = await Promise.all(
        files.map(async file => {
          try {
            const formData = new FormData();
            formData.append("file", file);
            const result = await uploadAxios.post<FormData, AxiosResponse<ImageItem>>(UPLOAD_FILE_URL, formData);
            return result?.data.file_url;
          } catch (error) {
            return null;
          }
        })
      );
      const failedCount = urls.filter(item => !item).length;
      if (failedCount) message.error(`Update failed ${failedCount} picture`);
      else {
        const body: CreateMessageBody = {
          message: text,
          user_id: conversation.user_id,
        };
        if (urls.length) body.data = { image_url: urls.filter(item => item).join(",") };
        await defaultAxios.post(SEND_MESSAGE(currentStore.id), body);
        setText("");
        handleRemoveFile();
        refresh();
      }
    } catch (error) {
      message.error("Send message failed");
      console.log(error);
    }
    setLoadingSend(false);
  };

  const readMessage = async () => {
    // if (!conversation || !Number(conversation.user_unread_count)) return;
    // try {
    //   await defaultAxios.get(READ_MESSAGE(conversation.user_id));
    //   refresh();
    // } catch (error) {
    //   console.log(error);
    // }
    // setLoadingSend(false);
  };

  const reverses = [...data].reverse();

  return (
    <div className={styles.chatForm} onClick={readMessage}>
      <div className={styles.title}>
        <div>{conversation.user?.username}</div>
        <div>
          <img className={styles.notify} src="/images/notification.svg" alt="icon" />
        </div>
      </div>
      <div id="scrollableDiv2" className={styles.messages}>
        {initialized && !data.length && <div className={styles.empty}>The conversation hasn't started yet!</div>}
        <InfiniteScroll
          dataLength={data.length}
          next={() => !loading && next()}
          hasMore={hasMore}
          loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
          scrollableTarget="scrollableDiv2"
          inverse={true}
        >
          {!!currentStore?.id &&
            reverses.map((message, index) => {
              const createdTime = message.timestamp;
              const lastMessage = reverses[index - 1];
              const nextMessage = reverses[index + 1];
              const isSender = message.speaker !== "customer";
              const showAvatar = nextMessage?.speaker !== "customer";
              const images = message.data?.image_url?.split(",") || [];
              return (
                <div key={getKey(message, matchKeys)}>
                  {index > 0 && !moment(createdTime).isSame(lastMessage.timestamp, "day") && (
                    <div className={styles.dateMessage}>{moment(createdTime).format("DD/MM/YYYY")}</div>
                  )}
                  {index === 0 && !moment(createdTime).isSame(new Date(), "day") && (
                    <div className={styles.dateMessage}>{moment(createdTime).format("DD/MM/YYYY")}</div>
                  )}
                  {isSender ? (
                    <div className={styles.messageItem + " " + styles.sender}>
                      {!message.data?.image_url && (
                        <div className={styles.time}>{moment(createdTime).format("HH:mm")}</div>
                      )}
                      <div className={`${styles.messageContent} ${message.data?.image_url ? styles.hasImage : ""}`}>
                        {message.message && <div className={styles.text}>{message.message}</div>}
                        {images.map(image => (
                          <div className={styles.timeImageWrapper}>
                            <img className={styles.preview} src={image} alt="preview" />
                            <div className={styles.timeImage}>{moment(createdTime).format("HH:mm")}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className={styles.messageItem}>
                      <div className={styles.avatar}>
                        {showAvatar && conversation.user?.avatar && (
                          <Avatar src={conversation.user?.avatar} alt={"avatar"} />
                        )}
                      </div>
                      <div className={`${styles.messageContent} ${message.data?.image_url ? styles.hasImage : ""}`}>
                        {message.message && <div className={styles.text}>{message.message}</div>}
                        {images.map(image => (
                          <div className={styles.timeImageWrapper}>
                            <img className={styles.preview} src={image} alt="preview" />
                            <div className={styles.timeImage}>{moment(createdTime).format("HH:mm")}</div>
                          </div>
                        ))}
                      </div>
                      {!message.data?.image_url && (
                        <div className={styles.time}>{moment(createdTime).format("HH:mm")}</div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          {initialized && reverses.at(-1)?.speaker !== "customer" && (
            <>
              {conversation.user_unread_count === 0 ? (
                <div className={styles.readed}>
                  <img src={SeenIcon} alt="readed" className={styles.iconSeen} />
                </div>
              ) : (
                <div className={styles.readed}>
                  <img src={ReadedIcon} alt="readed" className={styles.iconSent} />
                </div>
              )}
            </>
          )}

          {initialized && !data.length && <div className={styles.empty}>The conversation hasn't started yet!</div>}
        </InfiniteScroll>
      </div>
      <div className={styles.typing}>
        <div className={`${styles.imageInput} ${files.length ? styles.active : ""}`}>
          <label htmlFor="image-input">
            <CustomIcon icon={GalleryIcon} width={24} fill="currentColor" />
            <input
              ref={imageInput}
              id="image-input"
              accept={ACCEPTEDS}
              type="file"
              hidden
              multiple
              onChange={handleChangeFile}
            />
            {!!files.length && <div className={styles.imageCount}>{files.length}</div>}
          </label>
          {!!files.length && (
            <CustomIcon
              icon={TrashIcon}
              width={16}
              stroke="#F25A5A"
              className={styles.delete}
              title="Delete"
              onClick={handleRemoveFile}
            />
          )}
        </div>
        <Input.TextArea
          value={text}
          onChange={handleChange}
          className={styles.messageInput}
          placeholder="Aa"
          onKeyDown={onKeyDown}
          autoSize={{ maxRows: 4 }}
        />
        <button
          className={`${styles.submit} ${text ? styles.active : ""}`}
          disabled={!(files.length || text)}
          onClick={handleSubmit}
        >
          <CustomIcon icon={SendIcon} width={24} fill="currentColor" />
        </button>
      </div>
    </div>
  );
};

export default ConversationDetail;
