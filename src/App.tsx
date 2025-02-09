import { BrowserRouter, Route, Routes } from "react-router"
import HomePage from "./pages/HomePage"
import DeclarationPage from "./pages/DeclarationPage"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/declaration" element={<DeclarationPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
