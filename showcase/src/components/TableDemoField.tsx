import React, { useState } from "react";
import { Payment } from "../../../src/module";
import { Fields } from "../../../types/form_validity";

export interface ITableDemoField {
  fieldType: string;
  cardInstance: Payment;
}

export const tableComponentStyles = {
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

const TableDemoField = ({ fieldType, cardInstance }: ITableDemoField) => {
  const [focusField, setFocusField] = useState<string>("");
  const [validityField, setValidityField] = useState<string>("");
  const [submitField, setSubmitField] = useState<string>("");
  const [blurField, setBlurField] = useState<string>("");

  const buildValidatedField = (fieldsValidity: Fields) => {
    return JSON.stringify(fieldsValidity, null, 4);
  };

  cardInstance.onFieldValidity((event) => {
    setValidityField(buildValidatedField(event));
  }, fieldType);

  cardInstance.onFieldFocus((event) => {
    setFocusField(buildValidatedField(event));
  }, fieldType);

  cardInstance.onFieldBlur((event) => {
    setBlurField(buildValidatedField(event));
  }, fieldType);

  cardInstance.onFieldSubmit((event) => {
    setSubmitField(buildValidatedField(event));
  }, fieldType);

  return (
    <table border="1" style={tableComponentStyles.table}>
      <tr>
        <th style={tableComponentStyles.th}>Evento</th>
        <th style={tableComponentStyles.th}>Campo</th>
      </tr>
      <tr>
        <td style={tableComponentStyles.td}>triggeredBy</td>
        <td style={tableComponentStyles.td}>cardholderName</td>
      </tr>
      <tr>
        <td style={tableComponentStyles.td}>onFieldValidity</td>
        <td style={tableComponentStyles.td}>{validityField}</td>
      </tr>
      <tr>
        <td style={tableComponentStyles.td}>onFieldFocus</td>
        <td style={tableComponentStyles.td}>{focusField}</td>
      </tr>
      <tr>
        <td style={tableComponentStyles.td}>onFieldBlur</td>
        <td style={tableComponentStyles.td}>{blurField}</td>
      </tr>
      <tr>
        <td style={tableComponentStyles.td}>onFieldSubmit</td>
        <td style={tableComponentStyles.td}>{submitField}</td>
      </tr>
    </table>
  );
};

export { TableDemoField };
