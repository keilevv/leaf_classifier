import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Upload from "./Pages/Upload";
import History from "./Pages/History";
import Login from "./Pages/Login";
import About from "./Pages/About";
import Settings from "./Pages/Settings";
import ProtectedRoute from "./Components/ProtectedRoute";
import { Notification } from "./Components/Common/Notification";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/settings" element={<Settings />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Upload />
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <Upload />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Notification />
    </BrowserRouter>
  );
}

export default App;
