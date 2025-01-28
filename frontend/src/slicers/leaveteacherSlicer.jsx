import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AxiosInstance from "../hooks/AxiosInstance";

export const CreateLeaveTeacher = createAsyncThunk('/leave/CreateLeaveTeacher', async (data) => {
    try {
        const res = await AxiosInstance.post('/addLeave', {
            description: data.description,
            date: data.date,
            teacherID: data.teacherID
        })
        return { status: true, data: res.data.body }
    } catch (error) {
        return { status: false, error: error.message };
    }
})

export const fetchleaveTeacherID = createAsyncThunk('/leave/fetchleaveTeacherID', async (id) => {
    try {
        const res = await AxiosInstance.get(`/fetchleave/${id}`)
        return { status: true, data: res.data.body }
    } catch (error) {
        return { status: false, error: error.message };
    }
})

export const deleteLeave = createAsyncThunk('/leave/deleteLeave', async (id) => {
    try {
        const res = await AxiosInstance.delete(`/deleteleave/${id}`)
        return { status: true, data: res.data.body }
    } catch (error) {
        return { status: false, error: error.message };
    }
})

export const editLeave = createAsyncThunk('/leave/editLeave', async ({ id, data }) => {
    try {
        const res = await AxiosInstance.put(`/editleave/${id}`, {
            description: data.description,
            date: data.date,
        })
        return { status: true, data: res.data.body }
    } catch (error) {
        return { status: false, error: error.message };
    }
})


export const fetchLeaveID = createAsyncThunk('/leave/fetchLeaveID', async (id) => {
    try {
        const res = await AxiosInstance.get(`/fetchleaveID/${id}`)
        return { status: true, data: res.data.body }
    } catch (error) {
        return { status: false, error: error.message };
    }
})
const leaveteacherSlice = createSlice({
    name: 'leave',
    initialState: {
        currenleave: null,
        leave: [],
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
                    if (action.type.includes('CreateLeaveTeacher')) {
                        state.leave = action.payload.data !== undefined ? action.payload.data : [];
                    } else if (action.type.includes('fetchleaveTeacherID')) {
                        state.leave = action.payload.data !== undefined ? action.payload.data : [];
                    } else if (action.type.includes('deleteLeave')) {
                        state.delete = action.payload.data !== undefined ? action.payload.data : [];
                    } else if (action.type.includes('editLeave')) {
                        state.leave = action.payload.data !== undefined ? action.payload.data : [];
                    } else if (action.type.includes('fetchLeaveID')) {
                        state.leave = action.payload.data !== undefined ? action.payload.data : [];
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

export default leaveteacherSlice.reducer;
