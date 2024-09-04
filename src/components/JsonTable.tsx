import React from "react";

interface JsonData {
  class: string;
  top_features: Array<{
    feature_name: string;
    importance: number;
    description: string;
  }>;
}

interface JsonTableProps {
  jsonData: JsonData;
}

const JsonTable: React.FC<JsonTableProps> = ({ jsonData }) => {
  if (!jsonData) return null;

  return (
    <div className="mt-6 p-6 bg-white rounded-lg shadow-lg border border-gray-300 dark:bg-gray-800 dark:border-gray-700">
      <h3 className="mb-4 text-2xl font-bold text-gray-700 dark:text-white">{jsonData.class}</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border border-gray-300 dark:border-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300 border-r border-gray-300 dark:border-gray-700">
                Feature Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300 border-r border-gray-300 dark:border-gray-700">
                Importance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                Description
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
            {jsonData.top_features.map((feature, index) => (
              <tr key={index} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300 border-r border-gray-300 dark:border-gray-700">
                  {feature.feature_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300 border-r border-gray-300 dark:border-gray-700">
                  {feature.importance}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                  {feature.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JsonTable;
