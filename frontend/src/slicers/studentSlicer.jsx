import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import AxiosInstance from "../hooks/AxiosInstance";

export const fetchStudent = createAsyncThunk('/student/fetchStudent', async () => {
    try {
        const res = await AxiosInstance.get('/students')
        return { status: true, data: res.data.body }
    } catch (error) {
        return { status: false, error: error.message };
    }
})

export const createStudent = createAsyncThunk('/student/createStudent', async (data) => {
    try {
        const formData = new FormData();
        formData.append('studentID', data.studentID);
        formData.append('firstname', data.firstname);
        formData.append('lastname', data.lastname);
        formData.append('classroom', data.classroom);
        if (data.image) {
            formData.append('image', data.image);
        }

        const res = await AxiosInstance.post('/addstudent', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return { status: true, data: res.data.body };
    } catch (error) {
        return { status: false, error: error.message };
    }
});

export const fetchStudentID = createAsyncThunk('/student/fetchStudentID', async (id) => {
    try {
        const res = await AxiosInstance.get(`/students/${id}`)
        return { status: true, data: res.data.body }
    } catch (error) {
        return { status: false, error: error.message };
    }
})
const classSlice = createSlice({
    name: 'student',
    initialState: {
        currenclass: null,
        student: [],
        delete: [],
        loading: false,
        error: null
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(
                (action) => action.type.endsWith("/pending"),
                (state) => {
                    state.loading = true;
                    state.error = null;
                },
            )
            .addMatcher(
                (action) => action.type.endsWith("/fulfilled"),
                (state, action) => {
                    state.loading = false;
                    if (action.type.includes('fetchStudent')) {
                        state.student = action.payload.data !== undefined ? action.payload.data : [];
                    } else if (action.type.includes('createStudent')) {
                        state.currenclass = action.payload.data !== undefined ? action.payload.data : [];
                    } else if (action.type.includes('fetchStudentID')) {
                        state.student = action.payload.data !== undefined ? action.payload.data : [];
                    }
                }
            )
            .addMatcher(
                (action) => action.type.endsWith("/rejected"),
                (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                }
            )
    }
})

export default classSlice.reducer;