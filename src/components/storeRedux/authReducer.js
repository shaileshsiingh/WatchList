import { createSlice } from "@reduxjs/toolkit";

const initialAuthState = {
    isAuthenticated: !!localStorage.getItem('token'),
    userEmail: localStorage.getItem('userEmail') || ''
}

const authSlice = createSlice({
    name: 'authentication',
    initialState: initialAuthState,
    reducers: {
        login(state, action) {
            state.isAuthenticated = true;
            state.userEmail = action.payload.email;
        },
        logout(state) {
            localStorage.removeItem('token');
            localStorage.removeItem('userEmail');
            state.isAuthenticated = false;
            state.userEmail = '';
        }
    }
});

export const authAction = authSlice.actions;
export default authSlice.reducer;
