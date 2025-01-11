import { configureStore } from "@reduxjs/toolkit";
import authenticateSlice from "./slicers/authenticateSlicer";
import classSlicer from "./slicers/classSlicer";
import studentSlicer from "./slicers/studentSlicer";

export const store = configureStore({
    reducer: {
        auth: authenticateSlice,
        class: classSlicer,
        student: studentSlicer
    }
});