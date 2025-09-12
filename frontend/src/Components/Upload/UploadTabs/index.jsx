import UploadHistory from "../../History/UploadHistory";
import FileUpload from "../../Upload/FileUpload";
import { Tab } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
function UploadTabs({ children, initialTab = 0, onUpload }) {
  const navigate = useNavigate();
  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }
  const handleNewUpload = (upload) => {
    addUpload(upload);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Tab.Group defaultIndex={initialTab}>
        <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1 mb-8">
          <Tab
            onClick={() => navigate("/upload")}
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
            onClick={() => navigate("/history")}
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
            <UploadHistory />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </main>
  );
}

export default UploadTabs;
