import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accessToken:'',
  id:'',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.accessToken = action.payload.accessToken;
      state.id = action.payload.id;
    },
    setToken(state, action) {
      state.accessToken = action.payload.accessToken;
    }
  },
  extraReducers: builder => {},
});

export default userSlice;