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
        <div className={"card-number-help"}>
          <div className="mui--text-caption card-number-help-text">
            Dato de prueba
          </div>
          <div className="mui--text-caption card-number-help-text">
            {cardNumberHelper}
            <img
              src={CopyIcon}
              alt=""
              className={"img-copy"}
              onClick={() => clipboard(cardNumberHelper)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default CardNumberHelper;
