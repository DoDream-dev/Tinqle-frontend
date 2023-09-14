import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name:'',
  accessToken:'',
  // oauthAccessToken: '',
  // authorizationCode: "",
  // socialType: "",
  // fcmToken: "",
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.name = action.payload.name;
      state.accessToken = action.payload.id;
      // state.oauthAccessToken = action.payload.oauthAccessToken;
      // state.authorizationCode = action.payload.authorizationCode;
      // state.socialType = action.payload.socialType;
      // state.fcmToken = action.payload.fcmToken;
    },
    setName(state, action) {
      state.name = action.payload;
    },
  },
  extraReducers: builder => {},
});

export default userSlice;