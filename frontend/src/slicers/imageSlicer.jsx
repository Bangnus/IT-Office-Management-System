import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import AxiosInstance from "../hooks/AxiosInstance"

export const uploadimage = createAsyncThunk('image/uploadimage', async (formData) => {
    try {
        const res = await AxiosInstance.post(`/uploadimage`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return { status: true, data: res.data.body }
    } catch (error) {
        return { status: false, error: error.message };
    }
});


export const fetchImageID = createAsyncThunk('/image/fetcgImageID', async (id) => {
    try {
        const res = await AxiosInstance.get(`/previewimage/${id}`)
        return { status: true, data: res.data.body }
    } catch (error) {
        return { status: false, error: error.message };
    }
})

const imageSlicer = createSlice({
    name: 'image',
    initialState: {
        currenImage: null,
        image: [],
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
                    if (action.type.includes('uploadimage')) {
                        state.currenImage = action.payload.data !== undefined ? action.payload.data : [];
                    } else if (action.type.includes('fetcgImageID')) {
                        state.image = action.payload.data !== undefined ? action.payload.data : [];
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

export default imageSlicer.reducer