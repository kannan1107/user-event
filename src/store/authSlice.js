import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token')
  },
  reducers: {
    createUser: (state, action) => {
      state.user = action.payload.user || action.payload
      state.token = action.payload.token
      state.isAuthenticated = true
      localStorage.setItem('user', JSON.stringify(action.payload.user || action.payload))
      localStorage.setItem('token', action.payload.token)
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    }

  }
})

export const { createUser, logout } = authSlice.actions
export default authSlice.reducer