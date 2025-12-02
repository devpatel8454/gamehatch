import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App.jsx";
import { store } from "./Redux/store.js";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./Context/Authcontext.jsx";
import { GamesProvider } from "./Context/GamesContext";
import { WishlistProvider } from "./Context/WishlistContext";
import { GoogleOAuthProvider } from '@react-oauth/google';

// Replace with your actual Google Client ID
const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID_HERE";

createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <Provider store={store}>
      <GamesProvider>
        <AuthProvider>
          <WishlistProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </WishlistProvider>
        </AuthProvider>
      </GamesProvider>
    </Provider>
  </GoogleOAuthProvider>
);
