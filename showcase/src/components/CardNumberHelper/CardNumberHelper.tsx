// @ts-ignore
import CopyIcon from "../../../assets/images/copy.svg";
import { clipboard } from "../../shared/utils/clipboard.ts";

export interface ICardNumberHelperProps {
  displayHostedFields: boolean;
  cardNumberHelper: string;
}

const CardNumberHelper = ({
  displayHostedFields,
  cardNumberHelper
}: ICardNumberHelperProps) => {
  return (
    <>
      {displayHostedFields && (
        <div className={"cardNumberHelp"}>
          <div className="mui--text-caption">Dato de prueba</div>
          <div className="mui--text-caption imgCopy">
            {cardNumberHelper}
            <img
              src={CopyIcon}
              alt=""
              style={{ cursor: "pointer" }}
              onClick={() => clipboard(cardNumberHelper)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default CardNumberHelper;
