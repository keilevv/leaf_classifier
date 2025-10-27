import UploadHistory from "../../History/UploadHistory";
import FileUpload from "../../Upload/FileUpload";
import { Tab } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import useClassifier from "../../../hooks/useClassifier";
import { FaUpload, FaHistory } from "react-icons/fa";
function UploadTabs({ children, initialTab = 0, onUpload }) {
  const navigate = useNavigate();
  const { addUpload } = useClassifier();
  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }
  const handleNewUpload = (upload) => {
    addUpload(upload);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4 py-8">
      <Tab.Group defaultIndex={initialTab}>
        <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20  mb-8">
          <Tab
            onClick={() => navigate("/upload")}
            className={({ selected }) =>
              classNames(
                "w-full rounded-lg py-2.5 text-sm font-bold leading-5 cursor-pointer",
                "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                selected
                  ? "bg-white text-blue-700 shadow"
                  : "text-gray-600 hover:bg-white/[0.12] hover:text-blue-600"
              )
            }
          >
            <div className="flex items-center justify-center space-x-2">
              <FaUpload className="h-4 w-4" />
              <span className="font-bold">Upload & Classify</span>
            </div>
          </Tab>
          <Tab
            onClick={() => navigate("/history")}
            className={({ selected }) =>
              classNames(
                "w-full rounded-lg py-2.5 text-sm font-bold leading-5 cursor-pointer",
                "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                selected
                  ? "bg-white text-blue-700 shadow"
                  : "text-gray-600 hover:bg-white/[0.12] hover:text-blue-600"
              )
            }
          >
            <div className="flex items-center justify-center space-x-2">
              <FaHistory className="h-4 w-4" />
              <span className="font-bold">Upload History</span>
            </div>
          </Tab>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            <FileUpload onUpload={handleNewUpload} />
          </Tab.Panel>
          <Tab.Panel>
            <UploadHistory />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </main>
  );
}

export default UploadTabs;
