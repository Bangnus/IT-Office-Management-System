import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AxiosInstance from "../hooks/AxiosInstance";
import Cookies from 'js-cookie';

export const createAgency = createAsyncThunk('authenticate/createAgency', async (data) => {
    try {
        const response = await AxiosInstance.post('/authenticate/createagentcy', {
            email: data.email,
            password: data.password,
            firstName: data.firstName,
            lastName: data.lastName
        });

        return { status: true, data: response.data.body };
    } catch (error) {
        return { status: false, error: error.response.data.error };
    }
});

export const authenticateAgency = createAsyncThunk('authenticate/authenticateAgency', async (data) => {
    try {
        const response = await AxiosInstance.post('/authenticate/signin', {
            email: data.email,
            password: data.password
        });

        await Cookies.set('authToken', response.data.authToken);

        return { status: true, data: response.data.body };
    } catch (error) {
        return { status: false, error: error.response.data.error };
    }
});

export const fecthCurrentAgency = createAsyncThunk('authenticate/fecthCurrentAgency', async () => {
    try {
        const response = await AxiosInstance.get('/currentagentcy');
        return { status: true, data: response.data.body.user };
    } catch (error) {
        return { status: false, error: error.message };
    }
});

const authenticateSlice = createSlice({
    name: 'authenticate',
    initialState: {
        currentAgency: null,
        loading: false,
        error: null,
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
                if (action.type.includes('createAgency')) {
                    state.currentAgency = null;
                } else if (action.type.includes('authenticateAgency')) {
                    state.currentAgency = action.payload;
                } else if (action.type.includes('fecthCurrentAgency')) {
                    state.currentAgency = action.payload;
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
});

export default authenticateSlice.reducer;