import { FC, ReactNode } from "react";
import "./ContainerDemo.css";
interface ContainerDemoProps {
  children: ReactNode;
}

export const ContainerDemo: FC<ContainerDemoProps> = ({ children }) => {
  return (
    <div className={"mui-container"}>
      <div className="mui-container-fluid">
        <div className="mui-row demo-container">
          <div className="mui-col-xs-5 mui-col-md-5">
            <div className="mui-panel">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
