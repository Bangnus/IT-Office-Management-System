import { configureStore } from "@reduxjs/toolkit";
import authenticateSlice from "./slicers/authenticateSlicer";
import classSlicer from "./slicers/classSlicer";
import studentSlicer from "./slicers/studentSlicer";
import imageSlicer from "./slicers/imageSlicer";

export const store = configureStore({
    reducer: {
        auth: authenticateSlice,
        class: classSlicer,
        student: studentSlicer,
        image: imageSlicer,
    }
});