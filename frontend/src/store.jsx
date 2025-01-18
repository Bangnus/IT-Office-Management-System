import { configureStore } from "@reduxjs/toolkit";
import authenticateSlice from "./slicers/authenticateSlicer";
import classSlicer from "./slicers/classSlicer";
import studentSlicer from "./slicers/studentSlicer";
import imageSlicer from "./slicers/imageSlicer";
import teacherSlicer from './slicers/teacherSlicer'
import classroomSlicer from "./slicers/classroomSlicer";
import equipmentSlicer from "./slicers/equipmentSlicer";
export const store = configureStore({
    reducer: {
        auth: authenticateSlice,
        class: classSlicer,
        student: studentSlicer,
        image: imageSlicer,
        teacher: teacherSlicer,
        classroom: classroomSlicer,
        equipment: equipmentSlicer,
    }
});