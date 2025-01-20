import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import AxiosInstance from "../hooks/AxiosInstance";

export const createEquipment = createAsyncThunk('/equipment/createEquipment', async (formData) => {
    try {
        const res = await AxiosInstance.post('/addequipment', formData, {
            headers: {
                'Content-Type': 'Multipart/form-data'
            }
        })
        return { status: true, data: res.data.body }
    } catch (error) {
        return { status: false, error: error.message };
    }
})
export const editEquipment = createAsyncThunk('/equipment/editEquipment', async ({ formData, id }) => {
    try {
        const res = await AxiosInstance.put(`/updateEquipment/${id}`, formData, {
            headers: {
                'Content-Type': 'Multipart/form-data'
            }
        })
        return { status: true, data: res.data.body }
    } catch (error) {
        return { status: false, error: error.message };
    }
})

export const fetchEquipment = createAsyncThunk('/equipment/fetchEquipment', async () => {
    try {
        const res = await AxiosInstance.get('/equipment')
        return { status: true, data: res.data.body }
    } catch (error) {
        return { status: false, error: error.message };
    }
})

export const deleteEquipment = createAsyncThunk('/equipment/deleteEquipment', async (id) => {
    try {
        const res = await AxiosInstance.delete(`/deleteEqupment/${id}`)
        return { status: true, data: res.data.body }
    } catch (error) {
        return { status: false, error: error.message };
    }
})


const equipmentSlice = createSlice({
    name: 'equipment',
    initialState: {
        currenEquipment: null,
        equipnent: [],
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
                    if (action.type.includes('createEquipment')) {
                        state.equipnent = action.payload.data !== undefined ? action.payload.data : [];
                    } else if (action.type.includes('editEquipment')) {
                        state.equipnent = action.payload.data !== undefined ? action.payload.data : [];
                    } else if (action.type.includes('fetchEquipment')) {
                        state.equipnent = action.payload.data !== undefined ? action.payload.data : [];
                    } else if (action.type.includes('deleteEquipment')) {
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

export default equipmentSlice.reducer;