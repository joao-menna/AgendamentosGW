import { BrowserRouter, Route, Routes } from "react-router-dom"
import { setUserToken } from "./slices/userSlice"
import { SESSION_TOKEN_KEY } from "./services"
import FirstTimePage from "./pages/first-time"
import SchedulePage from "./pages/schedule"
import ResourcePage from "./pages/resource"
import { useAppDispatch } from "./hooks"
import ClassesPage from "./pages/classes"
import RootLayout from "./layouts/root"
import MainLayout from "./layouts/main"
import LogOffPage from "./pages/logoff"
import LoginPage from "./pages/login"
import IndexPage from "./pages/index"
import UsersPage from "./pages/users"
import { useEffect } from "react"

function App() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const token = sessionStorage.getItem(SESSION_TOKEN_KEY);
    if (token) {
      dispatch(setUserToken(token))
      return;
    }
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<IndexPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/first-time" element={<FirstTimePage />} />
          <Route path="/logoff" element={<LogOffPage />} />
          <Route element={<MainLayout />}>
            <Route path="/schedule" element={<SchedulePage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/classes" element={<ClassesPage />} />
            <Route path="/resource" element={<ResourcePage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
