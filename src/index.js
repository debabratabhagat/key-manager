import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { AuthProvider } from "./components/auth";
import { Toaster } from "react-hot-toast";

const root = ReactDOM.createRoot(document.getElementById("root"));
try {
  root.render(
    <React.StrictMode>
      <Toaster position="top-right" reverseOrder={false} />
      <AuthProvider>
        <App />
      </AuthProvider>
    </React.StrictMode>
  );
} catch (error) {
  alert(error);
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
