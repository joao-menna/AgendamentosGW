import { BrowserRouter, Route, Routes } from "react-router-dom"
import FirstTimePage from "./pages/first-time"
import SchedulePage from "./pages/schedule"
import RootLayout from "./layouts/root"
import MainLayout from "./layouts/main"
import LoginPage from "./pages/login"
import IndexPage from "./pages/index"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<IndexPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/first-time" element={<FirstTimePage />} />
          <Route element={<MainLayout />}>
            <Route path="/schedule" element={<SchedulePage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
