import { BrowserRouter, Route, Routes } from "react-router"
import HomePage from "./pages/HomePage"
import DeclarationPage from "./pages/DeclarationPage"
import AuthPage from "./pages/AuthPage"
import AdminDashboard from "./pages/AdminDasboardPage"
import LoginPage from "./pages/OfficierLoginPage"
import OfficerDashboard from "./pages/OfficierDashboardPage"
import BancPublication from "./pages/BancPublication"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/banc" element={<BancPublication />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/admin" element={<AdminDashboard  />} />
        <Route path="/officier/login" element={<LoginPage />} />
        <Route path="/officier/dashboard" element={<OfficerDashboard />} />
        <Route path="/declaration" element={<DeclarationPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
