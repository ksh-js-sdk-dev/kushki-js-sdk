import { useState } from "react";
import { ICard } from "Kushki/Card";
import { Fields, FormValidity } from "../../../../types/form_validity";

export interface ITableDemoGeneral {
  cardInstance: ICard;
}

export const tableComponentStyles = {
  head: {
    height: "30px"
  },
  table: {
    width: "100%"
  },
  td: {
    padding: "8px",
    textAlign: "center",
    width: "50%"
  },
  th: {
    padding: "8px",
    textAlign: "center",
    width: "50%"
  }
};

const TableDemoGeneral = ({ cardInstance }: ITableDemoGeneral) => {
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [errorsTypes, setErrorsTypes] = useState<string>("");
  const [validFields, setValidFields] = useState<string>("");
  const [triggeredByFields, setTriggeredBy] = useState<string>("");

  const buildErrorsTypesFields = (fieldsValidity: Fields) => {
    let result = "";

    for (const key in fieldsValidity) {
      if (fieldsValidity.hasOwnProperty(key)) {
        const errorType = fieldsValidity[key].errorType || "success";

        result += `${key} : ${errorType}\n`;
      }
    }

    setErrorsTypes(result);
  };

  const buildInfoValidFields = (fieldsValidity: Fields) => {
    let result = "";

    for (const key in fieldsValidity) {
      if (fieldsValidity.hasOwnProperty(key)) {
        const isValid = fieldsValidity[key].isValid || "false";

        result += `${key} : ${isValid}\n`;
      }
    }

    setValidFields(result);
  };

  cardInstance.onFieldValidity((event: FormValidity) => {
    setIsFormValid(event.isFormValid);
    buildErrorsTypesFields(event.fields);
    buildInfoValidFields(event.fields);
    setTriggeredBy(event.triggeredBy!);
  });

  return (
    <table border="1" style={tableComponentStyles.table}>
      <thead>
        <tr>
          <th colSpan="2" style={tableComponentStyles.head}>
            Form
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th style={tableComponentStyles.th}>Evento</th>
          <th style={tableComponentStyles.th}>Valor</th>
        </tr>
        <tr>
          <td style={tableComponentStyles.td}>isFormValid</td>
          <td style={tableComponentStyles.td}>{isFormValid.toString()}</td>
        </tr>
        <tr>
          <td style={tableComponentStyles.td}>isValid</td>
          <td style={tableComponentStyles.td}>{validFields}</td>
        </tr>
        <tr>
          <td style={tableComponentStyles.td}>errorType</td>
          <td style={tableComponentStyles.td}>{errorsTypes}</td>
        </tr>
        <tr>
          <td style={tableComponentStyles.td}>triggeredBy</td>
          <td style={tableComponentStyles.td}>{triggeredByFields}</td>
        </tr>
      </tbody>
    </table>
  );
};

export { TableDemoGeneral };
