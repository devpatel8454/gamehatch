import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App.jsx";
import './utils/clearWishlist.js';
import { ToastContainer } from "react-toastify";
import { store } from "./Redux/store.js";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./Context/Authcontext.jsx";
import { GamesProvider } from "./Context/GamesContext";
import { WishlistProvider } from "./Context/WishlistContext";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <GamesProvider>
      <AuthProvider>
        <WishlistProvider>
          <BrowserRouter>
            <App />
            <ToastContainer />
          </BrowserRouter>
        </WishlistProvider>
      </AuthProvider>
    </GamesProvider>
  </Provider>
);
