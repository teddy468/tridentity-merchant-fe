import BigNumber from "bignumber.js";
import "./total-info.scss";

type IBigNumberArg = string | number | BigNumber;

export const formatRoundFloorDisplay = (
  value: IBigNumberArg,
  decimalPlace = 4,
  shiftedBy = 0,
): string => {
  return new BigNumber(value || 0)
    .shiftedBy(-shiftedBy)
    .decimalPlaces(decimalPlace, BigNumber.ROUND_FLOOR)
    .toFormat();
};
interface TotalInfoProps extends React.HTMLAttributes<HTMLDivElement> {
  amount: string;
  image: string;
  percent: string;
  isIncrease: boolean;
  title: string;
  isFiat?: boolean;
  lp?: string;
}
const TotalInfo: React.FC<TotalInfoProps> = (props: TotalInfoProps) => {
  const { image, amount, title, isFiat, lp } = props;
  return (
    <div className="wrapper" {...props}>
      <div className="includes">
        <div>
          <img src={image} alt="total-info" className="image" />
        </div>
        <div className="info">
          <div className="info__title">{title}</div>
          {isFiat ? (
            <>
              <div className="info__amount">FIAT: {amount}</div>
              <div className="info__amount">LP: {lp}</div>
            </>
          ) : (
            <div className="info__amount">{amount}</div>
          )}
          {/* <div className="info__rate">
            <div className="price-difference">
              {isIncrease ? (
                <>
                  <div>
                    <img src="/images/up-price.svg" alt="icon" className="image2" />
                  </div>
                  <div className="text-increase">{percent}</div>
                </>
              ) : (
                <>
                  <div>
                    <img src="/images/down-price.svg" alt="icon" className="image2" />
                  </div>
                  <div className="text-decrease">{percent}</div>
                </>
              )}
            </div>
            <div style={{ marginLeft: 12, marginRight: 12 }}>.</div>
            <div>Since last week</div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default TotalInfo;
