import Dashboard from "../../Components/Dashboard";
import useStore from "../../hooks/useStore";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Home() {
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

  return <Dashboard user={user} onLogout={handleLogout} />;
}
