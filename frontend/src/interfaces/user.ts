import { UserType } from "../slices/userSlice"

export interface UserInsertBody {
  name: string
  email: string
  password: string
  type: UserType
}

export interface UserUpdateBody {
  name?: string
  email?: string
  password?: string
  type?: UserType
}

export interface UserLoginBody {
  email: string
  password: string
}
