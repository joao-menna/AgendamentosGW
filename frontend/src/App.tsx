import { BrowserRouter, Route, Routes } from "react-router-dom"
import MainLayout from "./layouts/main"
import LoginPage from "./pages/login"
import IndexPage from "./pages/index"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route element={<MainLayout />}>

        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
