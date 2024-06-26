import "./ResponseBox.css";

interface ResponseBoxProps {
  response: string;
}

export const ResponseBox = (props: ResponseBoxProps) => {
  return (
    <div className={"mui--divider-top response-container"}>
      <div className="mui--text-body1">Respuesta: </div>
      <pre className={"response-content"}>{props.response}</pre>
    </div>
  );
};
