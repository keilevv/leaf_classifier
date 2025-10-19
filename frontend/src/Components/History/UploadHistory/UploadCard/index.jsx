import { FaCalendarAlt, FaArchive, FaEye } from "react-icons/fa";
import { formatDate, getConfidenceColor } from "../../../../utils";
import ClassificationBadge from "../../../Common/Classifications/ClassificationBadge";
function UploadCard({ upload, openModal, openConfirmModal }) {
  return (
    <div
      key={upload.id}
      className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
    >
      <div className="relative" style={{ height: "200px" }}>
        <img
          src={upload.imageUrl}
          alt={upload.originalFilename}
          className="w-full h-full object-cover"
          style={{ border: "1px solid #ccc" }}
        />
      </div>
      <div className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-medium text-gray-900 truncate">
              {upload.originalFilename}
            </h3>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <FaCalendarAlt className="h-3 w-3 mr-1" />
              {formatDate(upload.createdAt)}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 mb-1">Species:</p>
            <ClassificationBadge
              classification={upload.species}
              confidence={upload.speciesConfidence}
            />
          </div>

          <div>
            <p className="text-sm font-medium text-gray-900 mb-1">Shape:</p>
            <ClassificationBadge
              classification={upload.shape}
              confidence={upload.shapeConfidence}
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div className="flex space-x-2">
              <button
                onClick={() => openConfirmModal(upload)}
                className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-700 hover:text-red-400 transition-colors cursor-pointer"
              >
                <FaArchive className="h-4 w-4" />
                <span>Archive</span>
              </button>
              <button
                onClick={() => openModal(upload)}
                className="flex items-center space-x-1 px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <FaEye className="h-4 w-4" />
                <span>View</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadCard;
