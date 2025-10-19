import { Tab } from "@headlessui/react";
import { useState, useEffect } from "react";
import { FaUsers, FaDatabase } from "react-icons/fa";
import AdminHeader from "./Header";
import ClassificationsTable from "./Classifications";
import UsersTable from "./Users";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function AdminPage() {
  const [headerClassifications, setHeaderClassifications] = useState([]);
  const [headerUsers, setHeaderUsers] = useState([]);

  return (
    <div>
      <AdminHeader
        classifications={headerClassifications}
        users={headerUsers}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tabs */}
        <Tab.Group>
          <Tab.List className="flex space-x-1 rounded-xl bg-green-900/20 p-1 mb-8">
            <Tab
              className={({ selected }) =>
                classNames(
                  "flex-1 rounded-lg py-2.5 text-sm font-medium leading-5 cursor-pointer ",
                  "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                  selected
                    ? "bg-white text-blue-700 shadow"
                    : "text-gray-700 hover:bg-white/[0.12] hover:text-blue-700"
                )
              }
            >
              <div className="flex items-center justify-center space-x-2">
                <FaDatabase className="h-4 w-4" />
                <span className="font-bold">Classifications</span>
              </div>
            </Tab>
            <Tab
              className={({ selected }) =>
                classNames(
                  "flex-1 rounded-lg py-2.5 text-sm font-medium leading-5 cursor-pointer",
                  "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                  selected
                    ? "bg-white text-blue-700 shadow"
                    : "text-gray-700 hover:bg-white/[0.12] hover:text-blue-700"
                )
              }
            >
              <div className="flex items-center justify-center space-x-2">
                <FaUsers className="h-4 w-4" />
                <span className="font-bold">Users</span>
              </div>
            </Tab>
          </Tab.List>

          <Tab.Panels>
            {/* Classifications Panel */}
            <Tab.Panel>
              <ClassificationsTable
                setHeaderClassifications={setHeaderClassifications}
              />
            </Tab.Panel>

            {/* Users Panel */}
            <Tab.Panel>
              <UsersTable setHeaderUsers={setHeaderUsers} />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
}
