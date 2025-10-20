import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import Login from "../../Pages/Login";
import { useNavigate } from "react-router-dom";
import { FaLeaf } from "react-icons/fa";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [isValidSession, setIsValidSession] = useState(false);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, userState } = useAuth(true);

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
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isValidSession) {
      checkAuthentication();
    }
  }, [isValidSession]);

  if (loading)
    return (
      <div className="w-full flex justify-center items-center h-screen flex-col font-bold bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-green-100 rounded-full border-2 border-green-200 shadow-md">
            <FaLeaf className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <h1 className="text-2xl">Loading...</h1>
      </div>
    );
  if (!isValidSession) return <Login />;

  return <>{children}</>;
};

export default ProtectedRoute;
