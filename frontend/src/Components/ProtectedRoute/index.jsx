import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import Login from "../../Pages/Login";
import { useNavigate } from "react-router-dom";
import { FaLeaf, FaBrain } from "react-icons/fa";
import backgroundImage from "../../assets/images/splash-background.webp";
import useStore from "../../hooks/useStore";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [isValidSession, setIsValidSession] = useState(false);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, userState } = useAuth(true);
  const { uiState, setUiState } = useStore();

  const checkAuthentication = async () => {
    try {
      const authResult = await isAuthenticated();
      if (authResult) {
        setIsValidSession(true);
      } else {
        setIsValidSession(false);
        navigate("/login");
      }
    } catch (error) {
      setIsValidSession(false);
      navigate("/login");
    } finally {
      if (uiState.showLoginAnimation) {
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      } else {
        setLoading(false);
      }
      setUiState({ showLoginAnimation: false });
    }
  };

  useEffect(() => {
    if (!isValidSession) {
      checkAuthentication();
    }
  }, [isValidSession]);

  if (loading)
    return (
      <div
        className="w-full flex justify-center items-center h-screen flex-col font-bold bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="p-6 bg-green-100 rounded-full">
              <FaLeaf className="h-16 w-16 text-green-600" />
            </div>
            <div className="absolute -top-2 -right-2 p-2 bg-blue-100 rounded-full">
              <FaBrain className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        <h1 className="text-2xl text-green-100">Loading...</h1>
      </div>
    );
  if (!isValidSession) return <Login />;

  return <>{children}</>;
};

export default ProtectedRoute;
