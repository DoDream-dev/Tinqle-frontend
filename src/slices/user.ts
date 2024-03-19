import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accessToken: '',
  id: '',
  deleted: false,
  notis: false,
  msgCnt: 0,
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
    },
    setDeleted(state, action) {
      state.deleted = action.payload.deleted;
    },
    setNotis(state, action) {
      state.notis = action.payload.notis;
    },
    setMsg(state, action) {
      state.msgCnt = action.payload.msgCnt;
    },
  },
  extraReducers: builder => {},
});

export const { setToken } = userSlice.actions;
export default userSlice;