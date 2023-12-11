import { CheckoutContainer } from "./containers/Card/Checkout.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RoutesEnum } from "./shared/enums/Routes.enum.ts";
import { GetBankList } from "./containers/Transfer/GetBankList/GetBankList.tsx";
import { RequestCommissionConfiguration } from "./containers/Merchant/RequestCommissionConfiguration/RequestCommissionConfiguration.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={RoutesEnum.INDEX} element={<CheckoutContainer />} />
        {/*TODO: Aqui cambiar redireccion a los otros demos*/}
        <Route path={RoutesEnum.VALIDATE_3DS} element={<>{"VALIDATE_3DS"}</>} />
        <Route path={RoutesEnum.DEVICE_TOKEN} element={<>{"DEVICE_TOKEN"}</>} />
        <Route path={RoutesEnum.BANK_LIST} element={<GetBankList />} />
        <Route
          path={RoutesEnum.COMMISSION_CONFIG}
          element={<RequestCommissionConfiguration />}
        />
        <Route
          path={RoutesEnum.INIT_ANTI_FRAUD}
          element={<>{"INIT_ANTI_FRAUD"}</>}
        />
        <Route
          path={RoutesEnum.CARD_ANIMATION}
          element={<>{"CARD_ANIMATION"}</>}
        />
        <Route path={RoutesEnum.BRANDS} element={<>{"BRANDS"}</>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
