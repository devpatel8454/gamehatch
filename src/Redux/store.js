import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./Slice/Cart/cartSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});
