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
        const res = await AxiosInstance.post('/addstudent', {
            studentID: data.studentID,
            firstname: data.firstname,
            lastname: data.lastname,
            classroom: data.classroom
        })
        return { status: true, data: res.data.body }
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

export const deleteStudent = createAsyncThunk('/student/deltetStudent', async (id) => {
    try {
        const res = await AxiosInstance.delete(`/deletestudent/${id}`)
        return { status: true, data: res.data.body }
    } catch (error) {
        return { status: false, error: error.message };
    }
})

export const editStudent = createAsyncThunk('/student/editStudent', async ({ id, data }) => {
    try {
        const res = await AxiosInstance.put(`/editstudent/${id}`, {
            studentID: data.studentID,
            firstname: data.firstname,
            lastname: data.lastname,
        })
        return { status: true, data: res.data.body }
    } catch (error) {
        return { status: false, error: error.message };
    }

})

export const fetchEditStudentID = createAsyncThunk('/student/fetchEditStudentID', async (id) => {
    try {
        const res = await AxiosInstance.get(`/fetchEditstudent/${id}`)
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
                    } else if (action.type.includes('deleteStudent')) {
                        state.delete = action.payload.data !== undefined ? action.payload.data : [];
                    } else if (action.type.includes('editStudent')) {
                        state.student = action.payload.data !== undefined ? action.payload.data : [];
                    } else if (action.type.includes('fetchEditStudentID')) {
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