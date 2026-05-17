import { createSlice } from "@reduxjs/toolkit";
import {
  forgotPassword,
  loginUser,
  refreshTokenOnLoad,
  registerUser,
} from "./authThunks";
import authService from "../../api/auth";
import { LoacalVariables, setLocalValues } from "../../common/commonFunction";

const initialState = {
  user: null,
  accessToken: null,

  loading: false,
  error: null,
  success: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // LOGOUT
    logout: (state) => {
      state.user = null;
      state.accessToken = null;

      authService.clearAuth();
      localStorage.clear();
      sessionStorage.clear();
    },

    clearAuthError: (state) => {
      state.error = null;
    },

    clearAuthSuccess: (state) => {
      state.success = null;
    },
  },

  extraReducers: (builder) => {
    builder

      //register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(registerUser.fulfilled, (state, action) => {
        const payload = action.payload;
        const message = action.payload.message;

        state.loading = false;
        state.success = message;
      })

      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        const payload = action.payload;

        state.loading = false;

        const user = payload.user;

        // access token
        const accessToken = payload.accessToken;

        const message = action.payload.message;

        state.user = user;
        state.accessToken = accessToken;

        setLocalValues(LoacalVariables.UserId, user.id || "");

        setLocalValues(LoacalVariables.UserType, user.role || "patient");

        setLocalValues(LoacalVariables.Name, user.username || "");

        setLocalValues(LoacalVariables.Email, user.email || "");

        setLocalValues(LoacalVariables.Phone, user.phone || "");

        setLocalValues(LoacalVariables.Address, "");

        state.success = message;
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // forgot password
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
      })

      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // refresh token
      .addCase(refreshTokenOnLoad.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshTokenOnLoad.fulfilled, (state, action) => {
        if (action.payload) {
          const payload = action.payload;

          state.loading = false;

          const user = payload.user;

          // access token
          const accessToken = payload.accessToken;

          const message = action.payload.message;

          state.user = user;
          state.accessToken = accessToken;

          setLocalValues(LoacalVariables.UserId, user.id || "");

          setLocalValues(LoacalVariables.UserType, user.role || "patient");

          setLocalValues(LoacalVariables.Name, user.username || "");

          setLocalValues(LoacalVariables.Email, user.email || "");

          setLocalValues(LoacalVariables.Phone, user.phone || "");

          setLocalValues(LoacalVariables.Address, "");
        }
        state.loading = false;
      })
      .addCase(refreshTokenOnLoad.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.accessToken = null;
        // Don't set error for session expiration, it's not an error
        if (action.payload !== null) {
          state.error = action.payload;
        }
      });
  },
});

export const { logout, clearAuthError, clearAuthSuccess } = authSlice.actions;
export default authSlice.reducer;
