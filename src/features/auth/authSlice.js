import { createSlice } from "@reduxjs/toolkit";
import { forgotPassword, loginUser, registerUser } from "./authThunks";
import { LoacalVariables, setLocalValues } from "../../common/commonFunction";

const userStorage = localStorage.getItem("user");

let userFromStorage = null;

if (userStorage && userStorage !== "undefined" && userStorage !== "null") {
  try {
    userFromStorage = JSON.parse(userStorage);
  } catch (error) {
    console.error("Invalid user data:", error);
    localStorage.removeItem("user");
  }
}

const initialState = {
  user: userFromStorage,
  accessToken: null,

  loading: false,
  error: null,
  success: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // SET NEW ACCESS TOKEN
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },

    // LOGOUT
    logout: (state) => {
      state.user = null;
      state.accessToken = null;

      localStorage.clear();
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

      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(registerUser.fulfilled, (state, action) => {
        const payload = action.payload.data;

        state.loading = false;
        state.success = message;
      })

      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        const payload = action.payload.data;

        state.loading = false;

        const user = payload.user;

        // access token
        const accessToken = payload.accessToken;

        const message = action.payload.message;

        state.user = user;
        state.accessToken = accessToken;

        localStorage.setItem("user", JSON.stringify(user));

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

      // FORGOT PASSWORD
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
      });
  },
});

export const { setAccessToken, logout, clearAuthError, clearAuthSuccess } =
  authSlice.actions;
export default authSlice.reducer;
