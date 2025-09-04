import Dashboard from "../../Components/Layout";
import useStore from "../../hooks/useStore";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Upload() {
  const user = useStore((state) => state.user);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return <Dashboard user={user} onLogout={handleLogout} initialTab={0} />;
}
