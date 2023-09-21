import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { AuthProvider } from "./components/auth";
import { Toaster } from "react-hot-toast";
import NetworkError from "./network-error/networkerror";

const root = ReactDOM.createRoot(document.getElementById("root"));

function CheckConnection() {
  const [isConnectedToInternet, setIsConnectedToInternet] = useState(
    navigator.onLine
  );

  useEffect(() => {
    setIsConnectedToInternet(navigator.onLine);
  }, [navigator.onLine]);

  return isConnectedToInternet;
}
try {
  root.render(
    <React.StrictMode>
      {navigator.onLine ? (
        <>
          <Toaster position="top-right" reverseOrder={false} />
          <AuthProvider>
            <App />
          </AuthProvider>
        </>
      ) : (
        <NetworkError />
      )}
    </React.StrictMode>
  );
} catch (error) {
  alert(error);
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
