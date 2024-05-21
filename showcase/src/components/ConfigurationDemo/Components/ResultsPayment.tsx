import { TokenResponse } from "Kushki/Card";
import { ResponseBox } from "../../ResponseBox/ResponseBox.tsx";
import { useEffect, useState } from "react";

export interface IResultsPaymentProps {
  token?: TokenResponse;
  errorMessage?: string;
}

const ResultsPayment = ({ token, errorMessage }: IResultsPaymentProps) => {
  const [message, setMessage] = useState<string>("");

  const buildDeferredMessage = (token: TokenResponse): string => {
    let deferredMessage = "";

    if (token.deferred) {
      if (token.deferred.creditType)
        deferredMessage += `\nTipo de diferido: ${token.deferred.creditType}`;
      if (token.deferred.months)
        deferredMessage += `\nMeses: ${token.deferred.months}`;
      if (token.deferred.graceMonths)
        deferredMessage += `\nMeses de gracia:: ${token.deferred.graceMonths}`;
    }

    return deferredMessage;
  };

  const buildCardInfoMessage = (token: TokenResponse): string => {
    if (token.cardInfo)
      return `\nCard Info:
      expirationDate: ${token.cardInfo.expirationDate}
      bin: ${token.cardInfo.bin}
      lastFourDigits: ${token.cardInfo.lastFourDigits}
      brand: ${token.cardInfo.brand}`;

    return "";
  };

  useEffect(() => {
    if (token) {
      setMessage(
        token.token + buildDeferredMessage(token) + buildCardInfoMessage(token)
      );
    }
  }, [token]);

  return (
    <>
      {errorMessage && <ResponseBox response={errorMessage} />}
      {token && <ResponseBox response={message} />}
    </>
  );
};

export default ResultsPayment;
