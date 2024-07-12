import { createSlice } from '@reduxjs/toolkit';

interface IState {
  email: string;
  permission: boolean;
  refreshToken: string;
  accessToken: string;
  id: string;
  username: string
}

const initialState: IState = {
  email: '',
  permission: false,
  refreshToken: '',
  accessToken: '',
  id: '',
  username: ''
};

export const sessionSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
     setEmail: (state, action) => {
      state.email = action.payload;
    },
    setPermission: (state, action) => {
      state.permission = action.payload;
    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    setRefreshToken: (state, action) => {
      state.refreshToken = action.payload;
    },
    setId: (state, action) => {
      state.id = action.payload;
    },
     setUsername: (state, action) => {
      state.username = action.payload;
    },
    reset:(state) =>{
      state.email = '';
      state.permission = false;
      state.accessToken = '';
      state.refreshToken = '';
      state.id = ''
      state.username = ''
    },
  },
});

export const { setEmail, setPermission, setAccessToken, setRefreshToken, setId, setUsername} = sessionSlice.actions;
export default sessionSlice.reducer;