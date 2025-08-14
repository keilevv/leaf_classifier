"use client";

import { useState, useEffect } from "react";
import { Tab } from "@headlessui/react";
import { FaLeaf, FaSignOutAlt } from "react-icons/fa";
import FileUpload from "../../Components/FileUpload";
import UploadHistory from "../../Components/UploadHistory";
import useClassifier from "../../hooks/useClassifier";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Dashboard({ user, onLogout }) {
  const { getUploads, addUpload, uploads, isLoading, error } = useClassifier();

  const handleNewUpload = (upload) => {
    addUpload(upload);
  };

  useEffect(() => {
    getUploads(1, 10, "createdAt", "desc");
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FaLeaf className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Plant Classifier
                </h1>
                <p className="text-sm text-gray-500">
                  Welcome, {user?.fullName}
                </p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <FaSignOutAlt className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tab.Group>
          <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1 mb-8">
            <Tab
              className={({ selected }) =>
                classNames(
                  "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
                  "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                  selected
                    ? "bg-white text-blue-700 shadow"
                    : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
                )
              }
            >
              Upload & Classify
            </Tab>
            <Tab
              className={({ selected }) =>
                classNames(
                  "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
                  "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                  selected
                    ? "bg-white text-blue-700 shadow"
                    : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
                )
              }
            >
              Upload History
            </Tab>
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel>
              <FileUpload onUpload={handleNewUpload} />
            </Tab.Panel>
            <Tab.Panel>
              <UploadHistory uploads={uploads} />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </main>
    </div>
  );
}
