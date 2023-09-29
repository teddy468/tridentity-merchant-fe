interface MessageMoreData {
  image_url?: string;
  video_url?: string;
  order_id?: number;
  product_id?: number;
}

interface Message {
  speaker: "store" | "customer";
  speaker_id: number;
  message: string;
  timestamp: string;
  store_detail: Store;
  data?: MessageMoreData;
}

interface CreateMessageBody {
  message?: string;
  user_id?: string;
  data?: MessageMoreData;
}

interface CreateMessageResponse extends SuccessResponse {
  data: Message;
}

interface Conversation {
  create_time: string;
  update_time: string;
  id: number;
  merchant_store_id: number;
  user_id: string;
  data: Message[];
  meta: MixObject;
  latest_message: Message;
  user_unread_count: number;
  store_unread_count: number;
  user: {
    id: number;
    username: string;
    full_name: string;
    avatar: string;
  };
}

declare interface UnreadConversation {
  unread_conversations: string;
}
