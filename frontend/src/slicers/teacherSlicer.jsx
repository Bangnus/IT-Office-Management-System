import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import AxiosInstance from '../hooks/AxiosInstance'

export const CreateTeacher = createAsyncThunk('/teacher/CreateTeacher', async (formData) => {
    try {
        const res = await AxiosInstance.post('/addteacher', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
        return { status: true, data: res.data.body }
    } catch (error) {
        return { status: false, error: error.message };
    }
})

export const FetchTeacher = createAsyncThunk('teacher/FetchTeacher', async () => {
    try {
        const res = await AxiosInstance.get('/teacher')
        return { status: true, data: res.data.body }
    } catch (error) {
        return { status: false, error: error.message };
    }
})

export const EditTeacher = createAsyncThunk('teacher/EditTeacher', async ({ formData, id }) => {
    try {
        const res = await AxiosInstance.put(`/editTeacher/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
        return { status: true, data: res.data.body }
    } catch (error) {
        return { status: false, error: error.message };
    }
})

export const deleteTeaher = createAsyncThunk('/teacher/deleteTeaher', async (id) => {
    try {
        const res = await AxiosInstance.delete(`/deleteTeacher/${id}`, {

        })
        return { status: true, data: res.data.body }
    } catch (error) {
        return { status: false, error: error.message };
    }
})

export const FetchTeacherID = createAsyncThunk('teacher/FetchTeacher', async (id) => {
    try {
        const res = await AxiosInstance.get(`/teacher/${id}`)
        return { status: true, data: res.data.body }
    } catch (error) {
        return { status: false, error: error.message };
    }
})


const teacherSlicer = createSlice({
    name: 'teacher',
    initialState: {
        currenteacher: null,
        teacher: [],
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
                    if (action.type.includes('CreateTeacher')) {
                        state.teacher = action.payload.data !== undefined ? action.payload.data : [];
                    } else if (action.type.includes('FetchTeacher')) {
                        state.teacher = action.payload.data !== undefined ? action.payload.data : [];
                    } else if (action.type.includes('EditTeacher')) {
                        state.teacher = action.payload.data !== undefined ? action.payload.data : [];
                    } else if (action.type.includes('deleteTeaher')) {
                        state.teacher = action.payload.data !== undefined ? action.payload.data : [];
                    } else if (action.type.includes('FetchTeacherID')) {
                        state.teacher = action.payload.data !== undefined ? action.payload.data : [];
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

export default teacherSlicer.reducer