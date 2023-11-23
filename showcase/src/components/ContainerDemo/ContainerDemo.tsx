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
          <div className="mui-col-lg-5 mui-col-md-7 mui-col-sm-8 mui-col-xs-10 ">
            <div className="mui-panel">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
