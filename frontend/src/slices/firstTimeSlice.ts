import { PayloadAction, createSlice } from "@reduxjs/toolkit"

export interface FirstTimeState {
  firstTime: boolean
  id?: number
  name?: string
  email?: string
  type?: "owner" | "admin"
  createdAt?: string
  updatedAt?: string
}

const initialState: FirstTimeState = {
  firstTime: false
}

export const firstTimeSlice = createSlice({
  name: "firstTime",
  initialState,
  reducers: {
    setFirstTimeState: (state, action: PayloadAction<FirstTimeState>) => {
      const payload = action.payload

      state.firstTime = payload.firstTime
      state.id = payload.id
      state.name = payload.name
      state.email = payload.email
      state.type = payload.type
      state.createdAt = payload.createdAt
      state.updatedAt = payload.updatedAt
    }
  }
})

export const { setFirstTimeState } = firstTimeSlice.actions
export default firstTimeSlice.reducer
