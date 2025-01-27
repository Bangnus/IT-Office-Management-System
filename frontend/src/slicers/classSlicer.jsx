import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import AxiosInstance from "../hooks/AxiosInstance";
import { act } from "react";

export const fetchclassVC = createAsyncThunk('class/fetchclassVC', async () => {
    try {
        const res = await AxiosInstance.get('/fetchVC');
        // console.log(res.data.body)
        return { status: true, data: Array.isArray(res.data.body) ? res.data.body : [] };
    } catch (error) {
        return { status: false, error: error.message };
    }
});

export const createClassRoom = createAsyncThunk('class/createClassRoom', async (data) => {
    try {
        const res = await AxiosInstance.post('/addclass', {
            className: data.className,
            vcID: data.vcID,
            advisor: data.advisor
        });
        return { status: true, data: res.data.body };
    } catch (error) {
        return { status: false, error: error.res.data.error };
    }
})

export const fetchClassRoom = createAsyncThunk('class/fetchClassRoom', async () => {
    try {
        const res = await AxiosInstance.get('/fetchclass');
        return { status: true, data: Array.isArray(res.data.body) ? res.data.body : [] };
    } catch (error) {
        return { status: false, error: error.message };
    }
})

export const editclassroom = createAsyncThunk('class/editclassroom', async ({ id, className, advisor }) => {
    try {
        const res = await AxiosInstance.put(`/editclass/${id}`, {
            className,
            advisor
        });
        return { status: true, data: res.data.body };
    } catch (error) {
        return { status: false, error: error.message };
    }
});

export const fetchClassRoomID = createAsyncThunk('class/fetchClassRoom', async (id) => {
    try {
        const res = await AxiosInstance.get(`/fetchclass/${id}`);
        return { status: true, data: Array.isArray(res.data.body) ? res.data.body : [] };
    } catch (error) {
        return { status: false, error: error.message };
    }
})

export const deleteClassRoom = createAsyncThunk('class/deleteClassRoom', async (id) => {
    try {
        const res = await AxiosInstance.delete(`deleteclass/${id}`)
        return { status: true, data: res.data.body };
    } catch (error) {
        return { status: false, error: error.message };
    }
})
const classSlice = createSlice({
    name: 'class',
    initialState: {
        currenclass: null,
        class: [],
        classroom: [],
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
                    if (action.type.includes('fetchclassVC')) {
                        state.class = action.payload.data !== undefined ? action.payload.data : [];
                    } else if (action.type.includes('createClassRoom')) {
                        state.class = action.payload.data !== undefined ? action.payload.data : [];
                    } else if (action.type.includes('fetchClassRoom')) {
                        state.classroom = action.payload.data !== undefined ? action.payload.data : [];
                    } else if (action.type.includes('editclassroom')) {
                        state.currenclass = action.payload.data !== undefined ? action.payload.data : [];
                    } else if (action.type.includes('fetchClassRoomID')) {
                        state.classroom = action.payload.data !== undefined ? action.payload.data : [];
                    } else if (action.type.includes('deleteClassRoom')) {
                        state.delete = action.payload.data !== undefined ? action.payload.data : [];

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