import { DeferredValuesResponse } from "../../../../../types/token_response";

export interface IResultsPaymentProps {
  getToken: () => void;
  deferredValues: DeferredValuesResponse | undefined;
  token: string;
  errorHostedFields: boolean;
  disablePaymentButton: boolean;
}

const ResultsPayment = ({
  getToken,
  deferredValues,
  token,
  errorHostedFields,
  disablePaymentButton
}: IResultsPaymentProps) => {
  const hasToken: boolean = token !== "";
  const hasDeferredValues =
    deferredValues && deferredValues.hasOwnProperty("creditType");

  return (
    <>
      <div className={"content-buttons"}>
        <button
          className={"mui-btn mui-btn--primary mui-btn--small button-border"}
          data-testid="tokenRequestBtn"
          onClick={() => getToken()}
          disabled={errorHostedFields || disablePaymentButton}
        >
          Pagar
        </button>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        {hasToken && (
          <div className="mui--text-body2 mui-text-result">Token: {token}</div>
        )}
        {hasDeferredValues && (
          <>
            <div className="mui--text-body2 mui-text-result">
              Tipo de diferido: {deferredValues?.creditType}
            </div>
            <div className="mui--text-body2 mui-text-result">
              Meses: {deferredValues?.months}
            </div>
            <div className="mui--text-body2 mui-text-result">
              Meses de gracia: {deferredValues?.graceMonths}
            </div>
          </>
        )}
        <hr />
      </div>
    </>
  );
};

export default ResultsPayment;
