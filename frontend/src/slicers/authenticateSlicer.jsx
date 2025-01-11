import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AxiosInstance from "../hooks/AxiosInstance";
import Cookies from 'js-cookie';

export const createUser = createAsyncThunk('authenticate/createUser', async (data) => {
    try {
        const response = await AxiosInstance.post('/auth/signup', {
            username: data.username,
            firstName: data.firstName,
            lastName: data.lastName,
            password: data.password
        });

        return { status: true, data: response.data.body };
    } catch (error) {
        return { status: false, error: error.response.data.error };
    }
});

export const authenticateUser = createAsyncThunk('authenticate/authenticateUser', async (data) => {
    try {
        const response = await AxiosInstance.post('/auth/signin', {
            username: data.username,
            password: data.password
        });

        await Cookies.set('authToken', response.data.authToken);

        return { status: true, data: response.data.body };
    } catch (error) {
        return { status: false, error: error.response.data.error };
    }
});

export const fetchCurrentUser = createAsyncThunk('authenticate/fetchCurrentUser', async () => {
    try {
        const response = await AxiosInstance.get('/auth/currenuser');
        return { status: true, data: response.data.body.user };
    } catch (error) {
        return { status: false, error: error.message };
    }
});

const authenticateSlice = createSlice({
    name: 'authenticate',
    initialState: {
        currentUser: null,
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
                if (action.type.includes('createUser')) {
                    state.currentUser = null;
                } else if (action.type.includes('authenticateUser')) {
                    state.currentUser = action.payload;
                } else if (action.type.includes('fetchCurrentUser')) {
                    state.currentUser = action.payload;
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