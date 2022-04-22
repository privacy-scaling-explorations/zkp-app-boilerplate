import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ChainId, DAppProvider, Config } from "@usedapp/core";

const localhostMulticall = process.env["REACT_APP_MULTICALL_LOCALHOST"];
const config: Config = localhostMulticall
  ? {
      multicallVersion: 2,
      multicallAddresses: {
        [ChainId.Localhost]: localhostMulticall,
      },
    }
  : {};
ReactDOM.render(
  <DAppProvider config={config}>
    <App />
  </DAppProvider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
