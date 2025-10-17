function AdminHeader({ classifications, users }) {
  return (
    <>
      {" "}
      {/* Header */}
      <div className="bg-white shadow-lg overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600">
          <div className="px-6 py-8 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-2">
              Admin Dashboard
            </h1>
            <p className="text-green-100">Manage users and classifications</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 border-b border-gray-200">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {classifications.length}
            </div>
            <div className="text-sm text-gray-600">Total Classifications</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {users.length}
            </div>
            <div className="text-sm text-gray-600">Total Users</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {classifications.filter((c) => c.status === "verified").length}
            </div>
            <div className="text-sm text-gray-600">Verified</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600">
              {classifications.filter((c) => c.status === "pending").length}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
        </div>
      </div>
    </>
  );
}
export default AdminHeader;
