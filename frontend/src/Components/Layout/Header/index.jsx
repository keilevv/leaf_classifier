import { FaLeaf, FaSignOutAlt } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import useStore from "../../../hooks/useStore";
import useAuth from "../../../hooks/useAuth";
import { Fragment } from "react";
import { FaUser } from "react-icons/fa";
import { showNotification } from "../../Common/Notification";

let defaultPages = [
  {
    title: "Home",
    key: "home",
    url: "/",
  },
  {
    title: "About",
    key: "about",
    url: "/about",
  },
];

function Header({ className = "" }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [pages, setPages] = useState(defaultPages);
  const {
    setSelectedPage,
    uiState,
    user,
    logout: logoutFromStore,
    setUiState
  } = useStore();
  const { logout } = useAuth();

  const navigate = useNavigate();
  const LogoButton = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };
  const handleSettings = () => {
    setSelectedPage("settings");
    navigate("/settings");
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      await logoutFromStore();
      showNotification({ type: "success", message: "Logged out successfully" });
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    // Update pages based on user authentication status
    if (user) {
      // User is authenticated
      setPages([
        ...defaultPages,
        { title: "Upload", key: "upload", url: "/upload" },
      ]); // Add upload link

      if (user.role === "ADMIN") {
        setPages((prevPages) => [
          ...prevPages,
          { title: "Admin", key: "admin", url: "/admin" },
        ]); // Add dashboard link for admin
      }
    } else {
      // User is not authenticated or not logged in
      setPages(defaultPages); // Reset to default pages
    }
  }, [user]);

  return (
    <header
      className={` w-full ${
        className === ""
          ? "bg-white shadow-sm border-b border-gray-200"
          : className
      } `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between  h-16 w-full items-center ">
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => {
              LogoButton();
            }}
          >
            <div className="p-2 bg-green-100 rounded-lg">
              <FaLeaf className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                SAPS<span className="text-green-600">AI</span> Dataset
              </h1>
              {user && (
                <p className="text-sm text-gray-500">{user?.fullName}</p>
              )}
            </div>
          </div>
          <div>
            {/* Desktop Menu & User Dropdown */}
            <div className="hidden md:flex items-center gap-6">
              <ul className="flex space-x-8 font-medium">
                {pages.map((page) => (
                  <li key={page.key}>
                    <Link
                      to={page.url}
                      className={`text-gray-600 hover:text-green-300 font-bold ${
                        uiState.selectedPage === page.key
                          ? "text-green-600"
                          : ""
                      }`}
                      onClick={(e) => {
                        setSelectedPage(page.key);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    >
                      {page.title}
                    </Link>
                  </li>
                ))}
              </ul>

              {!user && (
                <div className="relative inline-flex group cursor-pointer">
                  <div className="absolute transitiona-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt"></div>
                  <a
                    className={`relative inline-flex items-center justify-center px-4 py-2 text-md font-semibold text-green-700 transition-all duration-200 bg-white border-2  font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 ${
                      uiState.selectedPage === "booking"
                        ? "outline outline-2"
                        : ""
                    }`}
                    role="button"
                    onClick={() => {
                      navigate("/login");
                      setUiState({ selectedPage: "login" });
                    }}
                  >
                    Login
                  </a>
                </div>
              )}

              {/* User Dropdown */}
              {user && (
                <Menu as="div" className="relative inline-block text-left">
                  <div
                    className={`${
                      uiState.selectedPage === "settings"
                        ? "text-green-600"
                        : "text-gray-600"
                    } flex items-center hover:outline-2 hover:text-green-600 outline-green-600  rounded-md px-4 py-2`}
                  >
                    <Menu.Button
                      className={`cursor-pointer inline-flex items-center justify-center w-full  text-sm font-medium hover:text-green-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
                    >
                      {/* Display user's name, email, or an icon */}
                      {user.displayName || user.email || "Account"}
                    </Menu.Button>
                    <FaUser className="h-5 w-5 ml-2" />
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="z-10 absolute right-0 mt-2 w-48 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="px-1 py-1 ">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleSettings}
                              className={`${
                                active
                                  ? "bg-blue-500 text-white"
                                  : "text-gray-900"
                              } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                            >
                              Settings
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                      <div className="px-1 py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleLogout}
                              className={`${
                                active
                                  ? "bg-blue-500 text-white"
                                  : "text-gray-900"
                              } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                            >
                              Logout
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center">
              {" "}
              {/* Container for mobile button and potential future mobile dropdown trigger */}
              {user &&
                !isMenuOpen /* Optionally show a small user indicator or avatar here if desired when menu is closed */ && (
                  <div className="mr-2">
                    {/* You could place a small avatar or user icon here that could also trigger the dropdown or just be an indicator */}
                  </div>
                )}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                type="button"
                className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-600 rounded-lg hover:bg-green-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-600"
                aria-controls="navbar-sticky"
                aria-expanded={isMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className="w-5 h-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 17 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M1 1h15M1 7h15M1 13h15"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div>
          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden bg-slate-100 m-2 rounded-lg">
              {" "}
              {/* Added margin and rounded for aesthetics */}
              <ul className="flex flex-col p-4 space-y-2 font-medium">
                {pages.map(
                  (
                    page // Iterate over 'pages' state for dynamic links
                  ) => (
                    <li key={page.key}>
                      <Link
                        to={page.url}
                        className="block py-2 px-3 text-gray-600 hover:text-white rounded hover:bg-green-300"
                        onClick={() => {
                          window.scrollTo({ top: 0, behavior: "smooth" });
                          setIsMenuOpen(false); // Close menu on link click
                        }}
                      >
                        {page.title}
                      </Link>
                    </li>
                  )
                )}
                {/* User-specific links for mobile */}
                {user && (
                  <>
                    <li>
                      <button
                        onClick={handleSettings}
                        className="block w-full text-left py-2 px-3 text-gray-600 hover:text-white rounded hover:bg-green-300"
                      >
                        Settings
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left py-2 px-3 text-gray-600 hover:text-white rounded hover:bg-green-300"
                      >
                        Logout
                      </button>
                    </li>
                  </>
                )}
                {!user && (
                  <li>
                    <button
                      onClick={() => {
                        navigate("/login");
                        setIsMenuOpen(false); // Close menu on button click
                      }}
                      type="button"
                      className="w-full mt-2 text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-2.5 text-center bg-emerald-600 hover:bg-blue-700 focus:ring-blue-800"
                    >
                      Login
                    </button>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
export default Header;
