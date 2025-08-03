import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosClient from '../utils/axiosClient'
import axios from 'axios';

export const userRegister=createAsyncThunk(
    'auth/register',
    async(dataUser,{rejectWithValue})=>{
        try{
        const response=await axiosClient.post('/user/register', dataUser);
        return response.data.user
        }
        catch(error){
            return rejectWithValue(error.response?.data?.message || error.message);
        }

    }
)

export const userLogin=createAsyncThunk(
    'auth/login',
    async(credentials,{rejectWithValue})=>{
        try{
        const response=await axiosClient.post('/user/login', credentials);
        return response.data.user
        }
        catch(error){
            return rejectWithValue(error.response?.data?.message || error.message);
        }

    }
)

export const userCheck = createAsyncThunk(
    "auth/check",
    async (_, { rejectWithValue }) => {
        
        try {
            const response = await axiosClient.get("/user/check", { withCredentials: true });
            
            // If this log appears, the API call was successful
          
            
            return response.data.user;
        }
        catch (err) {
            // If this log appears, the API call failed
            console.error("4. API call FAILED! Error:", err);
            
            if (err.response?.status === 401 || err.response?.status === 403) {
                return rejectWithValue({ message: "Unauthorized", forceLogout: true });
            }
            return rejectWithValue({ message: "Server error", forceLogout: false });
        }
    }
);
export const userLogout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await axiosClient.post('/user/logout');
      return null;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const socialLogin = createAsyncThunk(
  'auth/socialLogin',
  async (idToken, { rejectWithValue }) => {
    try {
      
      const response=await axiosClient.post('/user/social-login', {idToken});
      
      console.log("hello")
      // The backend sends back user data and a message.
      // We return the user data to be stored in the state.
      return response.data.user; 
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      return rejectWithValue(errorMessage);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: true,
    error: null
  },
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      // Register User Cases
      .addCase(userRegister.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userRegister.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = !!action.payload;
        state.user = action.payload;
      })
      .addCase(userRegister.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Something went wrong';
        state.isAuthenticated = false;
        state.user = null;
      })
  
      // Login User Cases
      .addCase(userLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = !!action.payload;
        state.user = action.payload;
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Something went wrong';
        state.isAuthenticated = false;
        state.user = null;
      })
  
      // Check Auth Cases
      .addCase(userCheck.pending, (state) => {
        state.loading = true; // Loading starts
        state.error = null;
      })
      .addCase(userCheck.fulfilled, (state, action) => {
        state.loading = false; // Loading ENDS on success
        state.isAuthenticated = !!action.payload;
        state.user = action.payload;
      })
      .addCase(userCheck.rejected, (state, action) => {
  
        state.loading = false; // Set loading to false
 
  
        state.error = action.payload?.message || 'Something went wrong';
        state.isAuthenticated = false;
        state.user = null;
})

      // --- UPDATED SECTION ---
      // Add cases for the socialLogin thunk
      .addCase(socialLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(socialLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = !!action.payload;
        state.user = action.payload;
      })
      .addCase(socialLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Social login failed';
        state.isAuthenticated = false;
        state.user = null;
      })
  
      // Logout User Cases
      .addCase(userLogout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userLogout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(userLogout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Something went wrong';
        // Keep isAuthenticated and user cleared on logout failure too
        state.isAuthenticated = false; 
        state.user = null;
      });
  }
});

export default authSlice.reducer;