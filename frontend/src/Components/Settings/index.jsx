import { useEffect } from "react";
import { Tab, TabPanel, TabPanels, TabGroup, TabList } from "@headlessui/react";
import useUser from "../../hooks/useUser";
import { FaUser, FaCog } from "react-icons/fa";
import useStore from "../../hooks/useStore";
import PreferencesForm from "./PreferencesForm";
import DetailsForm from "./DetailsForm";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Settings() {
  const { user: userStore } = useStore();
  const { getUser, user, loading } = useUser();

  const onUpdateUser = (user) => {
    getUser(user.id);
  };

  useEffect(() => {
    if (userStore.id) {
      getUser(userStore.id);
    }
  }, [userStore.id]);

  return (
    <div className=" mx-auto">
      <div className="bg-white  shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="flex gap-2 text-3xl font-bold text-white mb-2 items-center">
              <FaCog className="" /> Settings
            </h1>
            <p className="text-green-100">
              Manage your account and application preferences
            </p>
          </div>
        </div>

        {/* Tabs */}
        <TabGroup>
          <TabList className="flex border-b border-gray-200 bg-gray-50">
            <Tab
              className={({ selected }) =>
                classNames(
                  "flex-1 py-4 px-6 text-sm font-medium focus:outline-none cursor-pointer",
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
                  "flex-1 py-4 px-6 text-sm font-medium focus:outline-none cursor-pointer",
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
          </TabList>

          <TabPanels>
            {/* User Settings Panel */}
            <TabPanel className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <DetailsForm
                user={user}
                loading={loading}
                onUpdate={onUpdateUser}
              />
            </TabPanel>

            {/* Preferences Panel */}
            <TabPanel className="p-6">
              <PreferencesForm user={user} />
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </div>
    </div>
  );
}
