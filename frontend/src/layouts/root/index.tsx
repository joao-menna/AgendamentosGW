import { Outlet, useNavigate } from "react-router-dom"
import { SESSION_TOKEN_KEY } from "../../services"
import { useEffect } from "react"
import { useAppDispatch } from "../../hooks"
import { setUserToken, setUserType } from "../../slices/userSlice"
import UserService from "../../services/users"

export default function RootLayout() {
  const dispatch = useAppDispatch()
  const redirect = useNavigate()

  useEffect(() => {
    (async () => {
      const token = sessionStorage.getItem(SESSION_TOKEN_KEY)
      if (!token) {
        redirect("/login")
        return
      }

      const userService = new UserService(token)
      const user = await userService.getOneByToken()

      dispatch(setUserToken(token))
      dispatch(setUserType(user.type))
    })()
  }, [])

  return (
    <>
      <Outlet />
    </>
  )
}