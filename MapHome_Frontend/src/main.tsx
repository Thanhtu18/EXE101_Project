
import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

// Filter out unavoidable COOP warnings from the console in development
if ((import.meta as any).env.MODE === 'development') {
  const originalError = console.error;
  console.error = (...args) => {
    const msg = typeof args[0] === 'string' ? args[0] : '';
    if (msg.includes('Cross-Origin-Opener-Policy')) return;
    originalError.apply(console, args);
  };
}

const clientId = (import.meta as any).env.VITE_GOOGLE_CLIENT_ID || "";

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId={clientId}>
    <App />
  </GoogleOAuthProvider>
);


  