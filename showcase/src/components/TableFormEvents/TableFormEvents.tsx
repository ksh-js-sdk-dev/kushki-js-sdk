import { FieldTypeEnum } from "../../../../types/form_validity";
import { TableDemoGeneral } from "../Tables/TableDemoGeneral.tsx";
import { TableDemoField } from "../Tables/TableDemoField.tsx";
import { Card } from "../../../../src/module/Payment.index.ts";
export interface ITableFormEventsProps {
  cardInstance?: Card;
}

const TableFormEvents = ({ cardInstance }: ITableFormEventsProps) => {
  return (
    <>
      <button
        className={"button-error"}
        onClick={async () => {
          try {
            await cardInstance?.focus("cardName" as FieldTypeEnum);
          } catch (error: any) {
            alert(error.message);
          }
        }}
      >
        Error Focus
      </button>
      <button
        className={"button-error"}
        onClick={async () => {
          try {
            await cardInstance?.reset("cardName" as FieldTypeEnum);
          } catch (error: any) {
            alert(error.message);
          }
        }}
      >
        Error Reset
      </button>
      <div className={"content-buttons"}>
        <button
          className={"table-buttons"}
          onClick={async () => await cardInstance?.focus("cardholderName")}
        >
          Focus cardHolderName
        </button>
        <button
          className={"table-buttons"}
          onClick={async () => await cardInstance?.focus("cardNumber")}
        >
          Focus cardNumber
        </button>
        <button
          className={"table-buttons"}
          onClick={async () => await cardInstance?.focus("expirationDate")}
        >
          Focus expirationDate
        </button>
        <button
          className={"table-buttons"}
          onClick={async () => await cardInstance?.focus("cvv")}
        >
          Focus cvv
        </button>
      </div>
      <div className={"content-buttons"}>
        <button
          className={"table-buttons"}
          onClick={async () => await cardInstance?.reset("cardholderName")}
        >
          Reset cardHolderName
        </button>
        <button
          className={"table-buttons"}
          onClick={async () => await cardInstance?.reset("cardNumber")}
        >
          Reset cardNumber
        </button>
        <button
          className={"table-buttons"}
          onClick={async () => await cardInstance?.reset("expirationDate")}
        >
          Reset expirationDate
        </button>
        <button
          className={"table-buttons"}
          onClick={async () => await cardInstance?.reset("cvv")}
        >
          Reset cvv
        </button>
      </div>
      {cardInstance && <TableDemoGeneral cardInstance={cardInstance} />}
      <br />
      {cardInstance && (
        <TableDemoField
          fieldType="cardholderName"
          cardInstance={cardInstance}
        />
      )}
      <br />
      {cardInstance && (
        <TableDemoField fieldType="cardNumber" cardInstance={cardInstance} />
      )}
      <br />
      {cardInstance && (
        <TableDemoField
          fieldType="expirationDate"
          cardInstance={cardInstance}
        />
      )}
      <br />
      {cardInstance && (
        <TableDemoField fieldType="cvv" cardInstance={cardInstance} />
      )}
    </>
  );
};

export default TableFormEvents;
