import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { AppShell, Burger, MantineProvider } from "@mantine/core";
import Header from "./components/header";
import { Provider } from "react-redux";
import store from "./store/index";
import AuthProtector from "./components/auth/protector";
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <MantineProvider>
        <BrowserRouter>
          <AuthProtector>
            <AppShell header={{ height: 70 }}>
              <AppShell.Header
                style={{
                  borderBottom: "none",
                }}
              >
                <Header />
              </AppShell.Header>
              <AppShell.Main>
                <App />
              </AppShell.Main>
            </AppShell>
          </AuthProtector>
        </BrowserRouter>
      </MantineProvider>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
