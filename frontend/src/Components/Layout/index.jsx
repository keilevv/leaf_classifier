import Header from "./Header";

import useClassifier from "../../hooks/useClassifier";
import UploadTabs from "../Upload/UploadTabs";

export default function Layout({
  user,
  initialTab = 0,
  children,
  headerClassnames,
}) {
  const { addUpload } = useClassifier();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header user={user} classNames={headerClassnames} />

      {/* Main Content */}
      {children ? children : <UploadTabs initialTab={initialTab} />}
    </div>
  );
}
