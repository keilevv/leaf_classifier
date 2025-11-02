import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Upload from "./Pages/Upload";
import History from "./Pages/History";
import Login from "./Pages/Login";
import About from "./Pages/About";
import Settings from "./Pages/Settings";
import Admin from "./Pages/Admin";
import AdminClassificationDetails from "./Pages/Admin/Classifications/ClassificationDetails";
import AdminUserDetails from "./Pages/Admin/Users/UserDetails";
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
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin initialTab={0} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/classifications"
          element={
            <ProtectedRoute>
              <Admin initialTab={0} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/classification/:id"
          element={
            <ProtectedRoute>
              <AdminClassificationDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <Admin initialTab={1} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/user/:id"
          element={
            <ProtectedRoute>
              <AdminUserDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings/request-to-contribute"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
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
