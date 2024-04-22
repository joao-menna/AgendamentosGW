import { useEffect } from "react"
import SystemService from "../../services/system"
import { useNavigate } from "react-router-dom"
import { useAppDispatch } from "../../hooks"
import { setFirstTimeState } from "../../slices/firstTimeSlice"

export default function IndexPage() {
  const dispatch = useAppDispatch()
  const redirect = useNavigate()

  useEffect(() => {
    (async () => {
      const token = sessionStorage.getItem("token")
      if (token) {
        redirect("/schedule")
        return
      }

      const systemService = new SystemService()
      const firstTimeReq = await systemService.isFirstTime()
      if (firstTimeReq.firstTime) {
        dispatch(setFirstTimeState(firstTimeReq))
        redirect("/first-time")
        return
      }

      redirect("/login")
    })()
  }, [])

  return <></>
}