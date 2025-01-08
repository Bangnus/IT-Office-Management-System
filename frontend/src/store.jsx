import { configureStore } from "@reduxjs/toolkit";
import authenticateSlice from "./slicers/authenticateSlicer";

export const store = configureStore({
    reducer: {
        auth: authenticateSlice,
    }
});