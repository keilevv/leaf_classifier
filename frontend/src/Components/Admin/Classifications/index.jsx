import { FaSearch, FaImages, FaFilter } from "react-icons/fa";
import { useState, useEffect, useCallback } from "react";
import _debounce from "lodash/debounce";
import useAdmin from "../../../hooks/useAdmin";
import useStore from "../../../hooks/useStore";
import RangePicker from "../../Common/RangePicker";
import ClassificationsTable from "./ClassificationsTable";

function Classifications({ setClassificationsCount = () => {} }) {
  const { preferences } = useStore();
  const {
    getClassifications,
    classifications: classificationsData,
    pages,
    shapes,
    classificationsCount,
  } = useAdmin();
  // Classifications state
  const [classifications, setClassifications] = useState([]);
  const [searchString, setSearchString] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = preferences?.pageSize || 6;
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isArchived, setIsArchived] = useState(false);
  const [filters, setFilters] = useState({});

  const totalPages = pages;
  const [rangeFilter, setRangeFilter] = useState({ start: null, end: null });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (classificationsData) {
      setClassifications(classificationsData);
      setClassificationsCount(classificationsCount);
    }
  }, [classificationsData, classificationsCount]);

  useEffect(() => {
    const filters = {};
    if (searchString.length) {
      filters.search = searchString;
    }
    if (rangeFilter.start && rangeFilter.end) {
      filters.createdAt_gte = rangeFilter.start;
      filters.createdAt_lte = rangeFilter.end;
    }
    filters.status = statusFilter;
    filters.isArchived = isArchived;
    setFilters(filters);
  }, [searchString, statusFilter, isArchived, rangeFilter]);

  useEffect(() => {
    getClassifications(page, pageSize, "createdAt", "desc", filters);
  }, [page, pageSize, filters]);

  function handleSearch(inputValue) {
    setSearchString(inputValue);
    setPage(1);
  }

  function onUpdateClassification(classification) {
    getClassifications(page, pageSize, "createdAt", "desc", filters);
  }

  const debouncedSearch = useCallback(_debounce(handleSearch, 300), []);

  return (
    <>
      {" "}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
        {/* Search and Filters */}
        <div className="p-6 border-b border-gray-200">
          <h2 className=" flex gap-2 border-b border-gray-200 text-2xl font-bold mb-4 pb-2 text-green-700 items-center">
            <FaImages />
            Classifications
          </h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex gap-2 items-center text-green-700 mt-1 border cursor-pointer border-green-700 px-2 py-1 w-fit hover:bg-green-100 rounded"
          >
            <FaFilter /> Filters
          </button>
          <div
            className="transition-all duration-300 max-h-0 overflow-hidden mt-4"
            style={{ maxHeight: showFilters ? "500px" : "0px" }}
          >
            <RangePicker
              rangeFilter={rangeFilter}
              setRangeFilter={setRangeFilter}
              className="mb-4"
            />
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search by username or classification..."
                  onChange={(e) => {
                    debouncedSearch(e.target.value);
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => {
                  if (e.target.value === "ARCHIVED") {
                    setIsArchived(true);
                  } else {
                    setIsArchived(false);
                    setStatusFilter(e.target.value);
                  }
                  setPage(1);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="ALL">All Status</option>
                <option value="VERIFIED">Verified</option>
                <option value="PENDING">Pending</option>
                <option value="REJECTED">Rejected</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
          </div>
        </div>
        <ClassificationsTable
          classifications={classifications}
          setClassifications={setClassifications}
          shapes={shapes}
          totalPages={totalPages}
          page={page}
          pageSize={pageSize}
          classificationsCount={classificationsCount}
          onUpdateClassification={onUpdateClassification}
          setPage={setPage}
        />
      </div>
    </>
  );
}
export default Classifications;
