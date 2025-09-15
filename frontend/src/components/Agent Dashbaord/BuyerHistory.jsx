import React from "react";
import { useSelector } from "react-redux";
import { Clock, User } from "lucide-react"; // optional icons

const BuyerHistory = ({ history }) => {
  const userDetails = useSelector((state) => state.user.userDetails);

  return (
    <div className="mt-2 max-w-6xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
        <Clock className="w-5 h-5 text-blue-600" />
        Recent Changes
      </h2>

      {history?.length === 0 ? (
        <div className="p-6 text-center text-gray-500 bg-gray-50 rounded-lg border">
          No history available
        </div>
      ) : (
        <div className="overflow-hidden border rounded-lg shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <tr>
                <th className="px-4 py-3">Field</th>
                <th className="px-4 py-3">Old Value</th>
                <th className="px-4 py-3">New Value</th>
                <th className="px-4 py-3">Changed By</th>
                <th className="px-4 py-3">Changed At</th>
              </tr>
            </thead>
            <tbody>
              {history?.slice(0, 5).map((entry, idx) =>
                Object.keys(entry.diff)
                  .filter((field) => field !== "tags") // 🚫 skip tags field
                  .map((field, i) => (
                    <tr
                      key={`${idx}-${field}`}
                      className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-4 py-3 font-medium text-gray-700">
                        {field}
                      </td>
                      <td className="px-4 py-3 text-red-500 line-through">
                        {entry.diff[field].old || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 text-green-700 bg-green-100 rounded-full text-xs font-medium">
                          {entry.diff[field].new || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3 flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span>
                          {entry.changedBy === userDetails?.id
                            ? userDetails?.fullName || "You"
                            : entry.changedBy}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {new Date(entry.changedAt).toLocaleString()}
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BuyerHistory;
