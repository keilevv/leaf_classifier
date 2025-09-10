import { useState, useEffect } from "react";
import { Tab } from "@headlessui/react";
import {
  FaUser,
  FaCog,
  FaSave,
  FaEye,
  FaEyeSlash,
  FaMoon,
  FaSun,
  FaList,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaUniversity,
  FaCheckCircle,
} from "react-icons/fa";
import useStore from "../../hooks/useStore";
import { showNotification } from "../../Components/Common/Notification";
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Settings() {
  const { user } = useStore();
  // User Settings State
  const [userForm, setUserForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    institution: "",
    department: "",
    location: "",
    bio: "",
  });

  const onUserUpdate = (updatedUser) => {
    console.log("User updated:", updatedUser);
  };

  const [originalUserForm, setOriginalUserForm] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Preferences State
  const [preferences, setPreferences] = useState({
    pageSize: 12,
    darkMode: false,
    emailNotifications: true,
    autoSave: true,
    language: "en",
  });

  const [originalPreferences, setOriginalPreferences] = useState({});

  // Initialize original states
  useEffect(() => {
    const initialUserForm = {
      name: user?.fullName || "",
      email: user?.email || "",
      phone: user?.telephone || "",
      institution: "",
      department: "",
      location: "",
      bio: "",
    };
    setUserForm(initialUserForm);
    setOriginalUserForm(initialUserForm);

    const initialPreferences = {
      pageSize: 12,
      darkMode: false,
      emailNotifications: true,
      autoSave: true,
      language: "en",
    };
    setPreferences(initialPreferences);
    setOriginalPreferences(initialPreferences);
  }, [user]);

  // Check if user form has changes
  const hasUserChanges = () => {
    return (
      JSON.stringify(userForm) !== JSON.stringify(originalUserForm) ||
      password !== "" ||
      confirmPassword !== ""
    );
  };

  // Check if preferences have changes
  const hasPreferencesChanges = () => {
    return JSON.stringify(preferences) !== JSON.stringify(originalPreferences);
  };

  // Handle user form changes
  const handleUserFormChange = (field, value) => {
    setUserForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle preferences changes
  const handlePreferencesChange = (field, value) => {
    setPreferences((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Submit user settings
  const handleUserSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords if they're being changed
    if (password || confirmPassword) {
      if (password !== confirmPassword) {
        showNotification({ message: "Passwords do not match", type: "error" });
        return;
      }
      if (password.length < 6) {
        showNotification({
          message: "Password must be at least 6 characters",
          type: "error",
        });

        return;
      }
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userForm.email)) {
      showNotification({
        message: "Please enter a valid email address",
        type: "error",
      });
      return;
    }

    try {
      showNotification({ message: "Updating user settings...", type: "info" });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Update user data
      const updatedUser = {
        ...user,
        ...userForm,
      };

      if (onUserUpdate) {
        onUserUpdate(updatedUser);
      }

      // Reset form states
      setOriginalUserForm(userForm);
      setPassword("");
      setConfirmPassword("");
      showNotification({
        message: "User settings updated successfully!",
      });
    } catch (error) {
      showNotification({
        message: "Failed to update user settings",
        type: "error",
      });
    }
  };

  // Submit preferences
  const handlePreferencesSubmit = async (e) => {
    e.preventDefault();

    try {
      showNotification({ message: "Updating preferences...", type: "info" });
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Apply dark mode immediately
      if (preferences.darkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }

      // Reset preferences state
      setOriginalPreferences(preferences);

      showNotification({
        message: "Preferences updated successfully!",
        type: "success",
      });
    } catch (error) {
      showNotification({
        message: "Failed to update preferences",
        type: "error",
      });
    }
  };

  const pageSizeOptions = [
    { value: 6, label: "6 items per page" },
    { value: 12, label: "12 items per page" },
    { value: 24, label: "24 items per page" },
    { value: 48, label: "48 items per page" },
  ];

  return (
    <div className=" mx-auto">
      <div className="bg-white  shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-8">
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-green-100">
            Manage your account and application preferences
          </p>
        </div>

        {/* Tabs */}
        <Tab.Group>
          <Tab.List className="flex border-b border-gray-200 bg-gray-50">
            <Tab
              className={({ selected }) =>
                classNames(
                  "flex-1 py-4 px-6 text-sm font-medium focus:outline-none",
                  selected
                    ? "text-green-600 border-b-2 border-green-600 bg-white"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                )
              }
            >
              <div className="flex items-center justify-center space-x-2">
                <FaUser className="h-4 w-4" />
                <span>User Settings</span>
              </div>
            </Tab>
            <Tab
              className={({ selected }) =>
                classNames(
                  "flex-1 py-4 px-6 text-sm font-medium focus:outline-none",
                  selected
                    ? "text-green-600 border-b-2 border-green-600 bg-white"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                )
              }
            >
              <div className="flex items-center justify-center space-x-2">
                <FaCog className="h-4 w-4" />
                <span>Preferences</span>
              </div>
            </Tab>
          </Tab.List>

          <Tab.Panels>
            {/* User Settings Panel */}
            <Tab.Panel className="p-6">
              <form onSubmit={handleUserSubmit} className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Personal Information
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        <FaUser className="inline h-4 w-4 mr-2" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={userForm.name}
                        onChange={(e) =>
                          handleUserFormChange("name", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        <FaEnvelope className="inline h-4 w-4 mr-2" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={userForm.email}
                        onChange={(e) =>
                          handleUserFormChange("email", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Enter your email"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        <FaPhone className="inline h-4 w-4 mr-2" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        value={userForm.phone}
                        onChange={(e) =>
                          handleUserFormChange("phone", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Enter your phone number"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="location"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        <FaMapMarkerAlt className="inline h-4 w-4 mr-2" />
                        Location
                      </label>
                      <input
                        type="text"
                        id="location"
                        value={userForm.location}
                        onChange={(e) =>
                          handleUserFormChange("location", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="City, Country"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="institution"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        <FaUniversity className="inline h-4 w-4 mr-2" />
                        Institution
                      </label>
                      <input
                        type="text"
                        id="institution"
                        value={userForm.institution}
                        onChange={(e) =>
                          handleUserFormChange("institution", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="University or Organization"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="department"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Department/Field
                      </label>
                      <input
                        type="text"
                        id="department"
                        value={userForm.department}
                        onChange={(e) =>
                          handleUserFormChange("department", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Biology, Agriculture, etc."
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <label
                      htmlFor="bio"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      rows={4}
                      value={userForm.bio}
                      onChange={(e) =>
                        handleUserFormChange("bio", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Tell us about yourself and your interest in plant research..."
                    />
                  </div>
                </div>

                {/* Password Section */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Change Password
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          id="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          placeholder="Enter new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showPassword ? (
                            <FaEyeSlash className="h-4 w-4 text-gray-400" />
                          ) : (
                            <FaEye className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Confirm Password
                      </label>
                      <input
                        type={showPassword ? "text" : "password"}
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                {hasUserChanges() && (
                  <div className="flex justify-end pt-6 border-t border-gray-200">
                    <button
                      type="submit"
                      className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-md transition-colors flex items-center"
                    >
                      <FaSave className="h-4 w-4 mr-2" />
                      Save Changes
                    </button>
                  </div>
                )}
              </form>
            </Tab.Panel>

            {/* Preferences Panel */}
            <Tab.Panel className="p-6">
              <form onSubmit={handlePreferencesSubmit} className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Application Preferences
                  </h2>

                  {/* Page Size Setting */}
                  <div className="mb-6">
                    <label
                      htmlFor="pageSize"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      <FaList className="inline h-4 w-4 mr-2" />
                      Classifications Page Size
                    </label>
                    <select
                      id="pageSize"
                      value={preferences.pageSize}
                      onChange={(e) =>
                        handlePreferencesChange(
                          "pageSize",
                          Number.parseInt(e.target.value)
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      {pageSizeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <p className="text-sm text-gray-500 mt-1">
                      Number of classification results to display per page
                    </p>
                  </div>

                  {/* Dark Mode Setting */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <label
                          htmlFor="darkMode"
                          className="text-sm font-medium text-gray-700 flex items-center"
                        >
                          {preferences.darkMode ? (
                            <FaMoon className="h-4 w-4 mr-2" />
                          ) : (
                            <FaSun className="h-4 w-4 mr-2" />
                          )}
                          Dark Mode
                        </label>
                        <p className="text-sm text-gray-500">
                          Enable dark theme for better viewing in low light
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handlePreferencesChange(
                            "darkMode",
                            !preferences.darkMode
                          )
                        }
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          preferences.darkMode ? "bg-green-600" : "bg-gray-200"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            preferences.darkMode
                              ? "translate-x-6"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Email Notifications */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <label
                          htmlFor="emailNotifications"
                          className="text-sm font-medium text-gray-700 flex items-center"
                        >
                          <FaEnvelope className="h-4 w-4 mr-2" />
                          Email Notifications
                        </label>
                        <p className="text-sm text-gray-500">
                          Receive updates about your classifications and project
                          news
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handlePreferencesChange(
                            "emailNotifications",
                            !preferences.emailNotifications
                          )
                        }
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          preferences.emailNotifications
                            ? "bg-green-600"
                            : "bg-gray-200"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            preferences.emailNotifications
                              ? "translate-x-6"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Auto Save */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <label
                          htmlFor="autoSave"
                          className="text-sm font-medium text-gray-700 flex items-center"
                        >
                          <FaCheckCircle className="h-4 w-4 mr-2" />
                          Auto Save
                        </label>
                        <p className="text-sm text-gray-500">
                          Automatically save your work as you type
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handlePreferencesChange(
                            "autoSave",
                            !preferences.autoSave
                          )
                        }
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          preferences.autoSave ? "bg-green-600" : "bg-gray-200"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            preferences.autoSave
                              ? "translate-x-6"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Language Setting */}
                  <div className="mb-6">
                    <label
                      htmlFor="language"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Language
                    </label>
                    <select
                      id="language"
                      value={preferences.language}
                      onChange={(e) =>
                        handlePreferencesChange("language", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="pt">Português</option>
                    </select>
                    <p className="text-sm text-gray-500 mt-1">
                      Choose your preferred language for the interface
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                {hasPreferencesChanges() && (
                  <div className="flex justify-end pt-6 border-t border-gray-200">
                    <button
                      type="submit"
                      className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-md transition-colors flex items-center"
                    >
                      <FaSave className="h-4 w-4 mr-2" />
                      Save Preferences
                    </button>
                  </div>
                )}
              </form>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
}
