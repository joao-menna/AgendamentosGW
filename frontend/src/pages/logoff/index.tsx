import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAppDispatch } from "../../hooks"
import { SESSION_TOKEN_KEY } from "../../services"
import { setUserToken, setUserType } from "../../slices/userSlice"

export default function LogOffPage() {
  const redirect = useNavigate()
  const dispatch = useAppDispatch()

  useEffect(() => {
    sessionStorage.removeItem(SESSION_TOKEN_KEY)

    dispatch(setUserToken(""))
    dispatch(setUserType("common"))

    redirect('/')
  }, [])

  return (
    <></>
  )
}