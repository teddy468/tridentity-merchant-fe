import * as icons from "../../commons/resources";
import { useEffect, useRef, useState } from "react";
import styles from "./Icons.module.scss";
import CustomIcon from "../../commons/components/CustomIcon/CustomIcon";
import { Input, Modal } from "antd";

interface StyleItem {
  width: number;
  color?: "green" | "secondary" | string;
  fill?: "currentColor" | "green" | "yellow" | string;
  stroke?: "currentColor" | "green" | "yellow" | string;
}

const styleList: StyleItem[] = [
  { width: 20 },
  { width: 40 },
  { width: 60 },
  { width: 60, fill: "currentColor" },
  { width: 60, color: "green", fill: "currentColor" },
  { width: 60, color: "yellow", fill: "currentColor" },
  { width: 60, fill: "yellow" },
  { width: 60, fill: "green" },
  { width: 60, fill: "red" },
  { width: 60, color: "yellow", stroke: "currentColor" },
  { width: 60, stroke: "currentColor" },
  { width: 60, stroke: "yellow" },
  { width: 60, stroke: "green" },
  { width: 60, stroke: "red" },
];

const Item = ({ name, Icon }: { name: string; Icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>> }) => {
  const [open, setOpen] = useState(false);
  const [props, setProps] = useState<StyleItem>({
    width: 60,
  });

  let stringify = `<CustomIcon icon={${name}} width={${props.width}}`;
  switch (props.fill) {
    case undefined:
      break;
    default:
      stringify += ` fill="${props.fill}"`;
  }
  switch (props.stroke) {
    case undefined:
      break;
    default:
      stringify += ` stroke="${props.stroke}"`;
  }
  switch (props.color) {
    case undefined:
      break;
    default:
      stringify += `color="${props.color}"`;
  }
  stringify += ` />`;

  return (
    <div className={styles.box}>
      <CustomIcon icon={Icon} title={name} width={60} onClick={() => setOpen(!open)} style={{ cursor: "pointer" }} />
      <Modal
        open={open}
        onCancel={() => setOpen(!open)}
        style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <div>
          <div style={{ background: "#FFF", padding: "30px", width: 700 }}>
            <Input.TextArea
              value={stringify}
              style={{
                width: "calc(100% - 30px)",
                marginBottom: "20px",
                fontSize: 14,
                padding: 15,
                resize: "vertical",
              }}
              rows={3}
            />
            <div style={{ background: "#dfdfdf", padding: "30px", display: "flex", flexWrap: "wrap", gap: "20px" }}>
              {styleList.map(item => {
                let color: string | undefined = item.color;
                let fill: string | undefined = item.fill;
                let stroke: string | undefined = item.stroke;
                return (
                  <div
                    className={styles.box}
                    style={{ border: `1px solid ${Object.is(props, item) ? "blue" : "none"}` }}
                    title="Click to view code"
                    onClick={() => setProps(item)}
                  >
                    <CustomIcon icon={Icon} width={item.width} color={color} fill={fill} stroke={stroke} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const ItemConvert = ({ name, Icon }: { name: string; Icon: string }) => {
  const [open, setOpen] = useState(false);
  const svgName = Icon.split("/").slice(-1)[0];
  const svgNameArray = svgName.split(".");
  const svgOriginName = svgNameArray[0] + "." + svgNameArray[2];
  const stringify = `export { ReactComponent as ${name} } from "./icons/${svgOriginName}";`;
  return (
    <div className={styles.box} key={name}>
      <img
        className={styles.img}
        width={60}
        src={Icon}
        title={"svg " + name + ": " + Icon}
        onClick={() => setOpen(!open)}
      />
      <Modal
        open={open}
        onCancel={() => setOpen(!open)}
        style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <div>
          <div style={{ background: "#FFF", padding: "30px", width: 700 }}>
            <Input.TextArea
              value={stringify}
              style={{
                width: "calc(100% - 30px)",
                marginBottom: "20px",
                fontSize: 14,
                padding: 15,
                resize: "vertical",
              }}
              rows={3}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

const Icons: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.group}>
        <h3 className={styles.title}>Introduction CustomIcon</h3>
        <p style={{ color: "red" }}>
          Chỉ nên áp dụng với icon đơn giản, 1-2 màu (2 màu gồm cả stroke và fill), các Icon có kích thước lớn nhiều màu
          thì sử dụng luôn ảnh gốc
        </p>
        <p>
          + Yêu cầu phải truyền ít nhất <b>width</b> hoặc <b>height</b>.
        </p>
        <p>
          + Nếu biết trước width và height gốc thì truyền vào originWidth, originHeight sẽ hiển thị ảnh ngay lần đầu
          render, nếu không sẽ phải chờ sau lần render để kiểm tra size ảnh mới hiển thị.
        </p>
        <p>+ Sử dụng fill hoặc stroke (tùy vào svg) = "currentColor" để lấy màu theo color của parent</p>
        <p>+ Sử dụng fill hoặc stroke = {"{color}"} để hiển thị màu, có thể sử dụng useTheme() để lấy màu theo theme</p>
        <p>+ Có thể sử dụng fill | stroke = "currentColor" color={"{theme=> string}"} để hiển thị màu theo theme.</p>
      </div>
      <div className={styles.group}>
        <div className={styles.title}>SVG active</div>
        <div className={styles.list}>
          {Object.entries(icons).map(([name, Icon]) => {
            if (typeof Icon !== "string") return <Item key={name} name={name} Icon={Icon} />;
            return null;
          })}
        </div>
      </div>
      <div className={styles.group}>
        <div className={styles.title}>SVG pending</div>
        <div className={styles.list}>
          {Object.entries(icons).map(([name, Icon]) => {
            if (typeof Icon === "string")
              if (Icon.includes(".svg")) return <ItemConvert key={name} name={name} Icon={Icon} />;
            return null;
          })}
        </div>
      </div>
      <div className={styles.group}>
        <div className={styles.title}>Image</div>
        <div className={styles.list}>
          {Object.entries(icons).map(([name, Icon]) => {
            if (typeof Icon === "string")
              if (!Icon.includes(".svg"))
                return (
                  <div className={styles.box} key={name}>
                    <img className={styles.img} width={60} src={Icon} title={"img " + name + ": " + Icon} />{" "}
                  </div>
                );
            return null;
          })}
        </div>
      </div>
    </div>
  );
};

export default Icons;
