import { PayloadAction, createSlice } from "@reduxjs/toolkit"

export type UserType = "owner" | "admin" | "common"

export interface UserState {
  token: string
  type: UserType
}

const initialState: UserState = {
  token: "",
  type: "common"
}

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
    },
    setUserType: (state, action: PayloadAction<UserType>) => {
      state.type = action.payload
    }
  }
})

export const { setUserToken, setUserType } = userSlice.actions
export default userSlice.reducer
