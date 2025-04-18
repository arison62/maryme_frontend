import { BrowserRouter, Route, Routes } from "react-router"
import HomePage from "./pages/HomePage"
import DeclarationPage from "./pages/DeclarationPage"
import AuthPage from "./pages/AuthPage"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/declaration" element={<DeclarationPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
