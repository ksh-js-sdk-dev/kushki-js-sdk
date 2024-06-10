import { RequestInitAntiFraud } from "./containers/AntiFraud/InitAntiFarud/RequestInitAntiFraud.tsx";
import { RequestBrandsByMerchant } from "./containers/Card/RequestBrandsByMerchant/RequestBrandsByMerchant.tsx";
import { CheckoutContainer } from "./containers/Card/RequestCardToken/Checkout.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RoutesEnum } from "./shared/enums/Routes.enum.ts";
import { GetBankList } from "./containers/Transfer/GetBankList/GetBankList.tsx";
import { RequestCommissionConfiguration } from "./containers/Merchant/RequestCommissionConfiguration/RequestCommissionConfiguration.tsx";
import { Validation3DS } from "./containers/AntiFraud/Validation3DS/Validation3DS.tsx";
import { RequestDeviceToken } from "./containers/Card/RequestDeviceToken/RequestDeviceToken.tsx";
import { RequestSecureDeviceToken } from "./containers/Card/RequestSecureDeviceToken/RequestSecureDeviceToken.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={RoutesEnum.INDEX} element={<CheckoutContainer />} />
        {/* TODO: Aqui cambiar redireccion a los otros demos*/}
        <Route path={RoutesEnum.VALIDATE_3DS} element={<Validation3DS />} />
        <Route
          path={RoutesEnum.DEVICE_TOKEN}
          element={<RequestDeviceToken />}
        />
        <Route
          path={RoutesEnum.SECURE_DEVICE_TOKEN}
          element={<RequestSecureDeviceToken />}
        />
        <Route path={RoutesEnum.BANK_LIST} element={<GetBankList />} />
        <Route
          path={RoutesEnum.COMMISSION_CONFIG}
          element={<RequestCommissionConfiguration />}
        />
        <Route
          path={RoutesEnum.INIT_ANTI_FRAUD}
          element={<RequestInitAntiFraud />}
        />
        <Route
          path={RoutesEnum.CARD_ANIMATION}
          element={<>{"CARD_ANIMATION"}</>}
        />
        <Route path={RoutesEnum.BRANDS} element={<RequestBrandsByMerchant />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
