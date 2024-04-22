import firstTimeSlice from '../slices/firstTimeSlice'
import { configureStore } from '@reduxjs/toolkit'
import userSlice from '../slices/userSlice'

export const store = configureStore({
  reducer: {
    firstTime: firstTimeSlice,
    user: userSlice
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
