import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import AxiosInstance from '../hooks/AxiosInstance'


export const createClassroom = createAsyncThunk('classroom/createClassroom', async (data) => {
    try {
        const res = await AxiosInstance.post('/addclassroom', {
            roomID: data.roomID,
            roomname: data.roomname
        })
        return { status: true, data: res.data.body }
    } catch (error) {
        return { status: false, error: error.message };
    }
})
export const editClassroom = createAsyncThunk('classroom/editClassroom', async ({ data, id }) => {
    try {
        const res = await AxiosInstance.put(`/editclassroom/${id}`, {
            roomID: data.roomID,
            roomname: data.roomname
        })
        return { status: true, data: res.data.body }
    } catch (error) {
        return { status: false, error: error.message };
    }
})

export const fetchClassroom = createAsyncThunk('/classroom/fetchClassroom', async () => {
    try {
        const res = await AxiosInstance.get('/classroom')
        return { status: true, data: res.data.body }
    } catch (error) {
        return { status: false, error: error.message };
    }
})

export const deleteClassroom = createAsyncThunk('/classroom/deleteClassroom', async (id) => {
    try {
        const res = await AxiosInstance.delete(`/deleteTeacher/${id}`)
        return { status: true, data: res.data.body }
    } catch (error) {
        return { status: false, error: error.message };
    }
})

const ClassRoomSlice = createSlice({
    name: 'classroom',
    initialState: {
        currenclassroom: null,
        classroom: [],
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
                    if (action.type.includes('createClassroom')) {
                        state.classroom = action.payload.data !== undefined ? action.payload.data : [];
                    } else if (action.type.includes('editClassroom')) {
                        state.classroom = action.payload.data !== undefined ? action.payload.data : [];
                    } else if (action.type.includes('fetchClassroom')) {
                        state.classroom = action.payload.data !== undefined ? action.payload.data : [];
                    } else if (action.type.includes('deleteClassroom')) {
                        state.classroom = action.payload.data !== undefined ? action.payload.data : [];
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

export default ClassRoomSlice.reducer