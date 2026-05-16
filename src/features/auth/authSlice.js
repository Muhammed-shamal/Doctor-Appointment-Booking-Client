import { createSlice } from '@reduxjs/toolkit';
import { loginUser } from './authThunks';
import { LoacalVariables, setLocalValues } from '../../common/commonFunction';

const tokenFromStorage = localStorage.getItem('token');
let userFromStorage = null;

const userStorage = localStorage.getItem('user');
if (userStorage && userStorage !== 'undefined' && userStorage !== 'null') {
  try {
    userFromStorage = JSON.parse(userStorage);
  } catch (error) {
    console.error('❌ Invalid user data in localStorage:', error);
    localStorage.removeItem('user');
  }
}

const initialState = {
  user: userFromStorage,
  token: tokenFromStorage || null,
  loading: false,
  error: null,
  success: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.clear();
    },
    clearAuthError: (state) => { state.error = null },
    clearAuthSuccess: (state) => { state.success = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        const payload = action.payload.data; // ✅ Your API: {status, message, data: {user, token}}
        state.loading = false;
        
        const user = payload.user;
        const token = payload.token.access; // ✅ Use access token
        const message = action.payload.message;
        
        state.user = user;
        state.token = token;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        // ✅ Safe access - your API has these fields
        setLocalValues(LoacalVariables.UserId, user.id || '');
        setLocalValues(LoacalVariables.UserType, user.is_superuser ? 'superuser' : user.is_staff ? 'staff' : 'user');
        setLocalValues(LoacalVariables.Permissions, []);
        setLocalValues(LoacalVariables.SystemUser, user.is_staff || false);
        setLocalValues(LoacalVariables.Name, user.username || '');
        setLocalValues(LoacalVariables.Email, user.email || '');
        setLocalValues(LoacalVariables.Address, '');

        state.success = message;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearAuthError, clearAuthSuccess } = authSlice.actions;
export default authSlice.reducer;
