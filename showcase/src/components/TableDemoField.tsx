import React, { useState } from "react";
import { Payment } from "../../../src/module";
import { Fields } from "../../../types/form_validity";

export interface ITableDemoField {
  fieldType: string;
  cardInstance: Payment;
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
      <thead>
        <tr>
          <th colSpan="2" style={tableComponentStyles.head}>
            {fieldType}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th style={tableComponentStyles.th}>Evento</th>
          <th style={tableComponentStyles.th}>Valor</th>
        </tr>
        <tr>
          <td style={tableComponentStyles.td}>triggeredBy</td>
          <td style={tableComponentStyles.td}>{fieldType}</td>
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
      </tbody>
    </table>
  );
};

export { TableDemoField };
