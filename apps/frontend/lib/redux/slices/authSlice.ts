import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    token: string | null;
    name?: string;
    userId?: string;
    email?: string;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    token: null,
    isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
        state.token = action.payload;
        state.name = action.payload;
        state.email = action.payload;
        state.userId = action.payload;
        state.isAuthenticated = true;
    },
    logout: (state, action: PayloadAction<void>) => {
        state.token = null;
        state.isAuthenticated = false;
        state.name = undefined;
        state.email = undefined;    
        state.userId = undefined;
        localStorage.removeItem("token");
    },
    restoreToken: (state, action: PayloadAction<string>) => {
        state.token = action.payload;
        state.isAuthenticated = true;
    }
  },
});

export const { setToken, logout, restoreToken } = authSlice.actions;
export default authSlice.reducer;
