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
    <div className="mt-4">
      <h3 className="mb-2 text-lg font-bold">{jsonData.class}</h3>
      <table className="divide-gray-200 min-w-full divide-y border">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-gray-500 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Feature Name
            </th>
            <th className="text-gray-500 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Importance
            </th>
            <th className="text-gray-500 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Description
            </th>
          </tr>
        </thead>
        <tbody className="divide-gray-200 divide-y bg-white">
          {jsonData.top_features.map((feature, index) => (
            <tr key={index}>
              <td className="text-gray-900 whitespace-nowrap px-6 py-4 text-sm">
                {feature.feature_name}
              </td>
              <td className="text-gray-900 whitespace-nowrap px-6 py-4 text-sm">
                {feature.importance}
              </td>
              <td className="text-gray-900 whitespace-nowrap px-6 py-4 text-sm">
                {feature.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JsonTable;
