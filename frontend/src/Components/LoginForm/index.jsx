import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  FaGoogle,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaSpinner,
} from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import { showNotification } from "../Common/Notification";
import useStore from "../../hooks/useStore";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function LoginForm({
  comesFrom = "",
  checkout = null,
  onLogin,
}) {
  const { setUiState, setSelectedPage } = useStore();
  const { localLogin, googleLogin, localRegister } = useAuth(false);
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // Register form state
  const [name, setName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Form validation state
  const [errors, setErrors] = useState({});

  const validateLoginForm = () => {
    const newErrors = {};

    if (!loginEmail) newErrors.loginEmail = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(loginEmail))
      newErrors.loginEmail = "Email is invalid";

    if (!loginPassword) newErrors.loginPassword = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRegisterForm = () => {
    const newErrors = {};

    if (!name) newErrors.name = "Name is required";

    if (!registerEmail) newErrors.registerEmail = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(registerEmail))
      newErrors.registerEmail = "Email is invalid";

    if (!registerPassword) newErrors.registerPassword = "Password is required";
    else if (registerPassword.length < 6)
      newErrors.registerPassword = "Password must be at least 6 characters";

    if (!confirmPassword)
      newErrors.confirmPassword = "Please confirm your password";
    else if (confirmPassword !== registerPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (!agreeTerms)
      newErrors.agreeTerms = "You must agree to the terms and conditions";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();

    if (validateLoginForm()) {
      setIsLoading(true);
      localLogin(loginEmail, loginPassword)
        .then((response) => {
          showNotification({
            message: "Login successful",
            type: "success",
          });
          navigate("/");
          setSelectedPage("upload");

          setIsLoading(false);
          setUiState({
            login: {
              comesFrom: {
                pathname: "",
                search: "",
                key: "",
              },
            },
          });
        })
        .catch((error) => {
          console.error("Login failed:", error);
          showNotification({
            message: error.response?.data?.error || "Login failed",
            type: "error",
          });
          setIsLoading(false);
        });
    }
  };

  const handleGoogleLogin = async (redirectTo = "/upload") => {
    setSelectedPage("upload");
    window.location.href = `${apiUrl}/auth/google?redirectTo=${encodeURIComponent(
      redirectTo
    )}`;
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();

    if (validateRegisterForm()) {
      setIsLoading(true);

      // Simulate API call
      localRegister(name, registerEmail, registerPassword, phone)
        .then((response) => {
          showNotification({
            message: "Registration successful",
            type: "success",
          });
          setIsLoading(false);
          localLogin(registerEmail, registerPassword)
            .then(() => {
              if (comesFrom.pathname === "/booking") {
              } else {
                setSelectedPage("upload");
                navigate("/upload");
                setIsLoading(false);
                setUiState({
                  login: {
                    comesFrom: {
                      pathname: "",
                      search: "",
                      key: "",
                    },
                  },
                });
              }
            })
            .catch((error) => {
              showNotification({
                message: "Error loggin in",
                type: "error",
              });
              setIsLoading(false);
            });
        })
        .catch((error) => {
          showNotification({
            message: error.response.data.error || "Registration failed",
            type: "error",
          });
          setIsLoading(false);
        });
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden text-black">
      {/* Tab Navigation */}
      <div className="flex border-b">
        <button
          className={`flex-1 py-4 px-6 text-center font-medium ${
            isLogin
              ? "text-green-600 border-b-2 border-green-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setIsLogin(true)}
        >
          Login
        </button>
        <button
          className={`flex-1 py-4 px-6 text-center font-medium ${
            !isLogin
              ? "text-green-600 border-b-2 border-green-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setIsLogin(false)}
        >
          Register
        </button>
      </div>

      {/* Login Form */}
      {isLogin ? (
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Login</h2>
          <p className="text-sm text-gray-600 mb-6">
            Enter your credentials to access your account
          </p>

          <form onSubmit={handleLoginSubmit}>
            <div className="space-y-4">
              {/* Email Input */}
              <div>
                <label
                  htmlFor="email-login"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email-login"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className={`block w-full pl-10 pr-3 py-2 border ${
                      errors.loginEmail ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500`}
                    placeholder="name@example.com"
                  />
                </div>
                {errors.loginEmail && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.loginEmail}
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <label
                  htmlFor="password-login"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password-login"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className={`block w-full pl-10 pr-3 py-2 border ${
                      errors.loginPassword
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500`}
                    placeholder="••••••••"
                  />
                </div>
                {errors.loginPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.loginPassword}
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Remember me
                  </label>
                </div>
                <a
                  href="#"
                  className="text-sm font-medium text-green-600 hover:text-green-500"
                >
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2 h-4 w-4" /> Signing
                    in...
                  </>
                ) : (
                  "Sign in"
                )}
              </button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Google Button */}
              <button
                onClick={() => {
                  handleGoogleLogin();
                }}
                type="button"
                className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <FaGoogle className="h-5 w-5 text-red-500 mr-2" />
                Sign in with Google
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Registration Form */
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Create an account
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Enter your information to create an account
          </p>

          <form onSubmit={handleRegisterSubmit}>
            <div className="space-y-4">
              {/* Name Input */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`block w-full pl-10 pr-3 py-2 border ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500`}
                    placeholder="John Doe"
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Email Input */}
              <div>
                <label
                  htmlFor="email-register"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email-register"
                    type="email"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    className={`block w-full pl-10 pr-3 py-2 border ${
                      errors.registerEmail
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500`}
                    placeholder="name@example.com"
                  />
                </div>
                {errors.registerEmail && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.registerEmail}
                  </p>
                )}
              </div>

              {/* Phone Input */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPhone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label
                  htmlFor="password-register"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password-register"
                    type="password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    className={`block w-full pl-10 pr-3 py-2 border ${
                      errors.registerPassword
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500`}
                    placeholder="••••••••"
                  />
                </div>
                {errors.registerPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.registerPassword}
                  </p>
                )}
              </div>

              {/* Confirm Password Input */}
              <div>
                <label
                  htmlFor="confirm-password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`block w-full pl-10 pr-3 py-2 border ${
                      errors.confirmPassword
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500`}
                    placeholder="••••••••"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Terms and Conditions */}
              <div>
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className={`h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded ${
                        errors.agreeTerms ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="terms"
                      className="font-medium text-gray-700"
                    >
                      I agree to the{" "}
                      <a
                        href="#"
                        className="text-green-600 hover:text-green-500"
                      >
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a
                        href="#"
                        className="text-green-600 hover:text-green-500"
                      >
                        Privacy Policy
                      </a>
                    </label>
                  </div>
                </div>
                {errors.agreeTerms && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.agreeTerms}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2 h-4 w-4" /> Creating
                    account...
                  </>
                ) : (
                  "Create account"
                )}
              </button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Google Button */}
              <button
                type="button"
                className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <FaGoogle className="h-5 w-5 text-red-500 mr-2" />
                Sign up with Google
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
