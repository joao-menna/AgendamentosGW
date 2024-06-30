import { PayloadAction, createSlice } from "@reduxjs/toolkit"

export type UserType = "owner" | "admin" | "common"

export interface UserState {
  userId: number
  token: string
  type: UserType
}

const initialState: UserState = {
  userId: 0,
  token: "",
  type: "common"
}

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserId: (state, action: PayloadAction<number>) => {
      state.userId = action.payload
    },
    setUserToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
    },
    setUserType: (state, action: PayloadAction<UserType>) => {
      state.type = action.payload
    }
  }
})

export const { setUserId, setUserToken, setUserType } = userSlice.actions
export default userSlice.reducer
