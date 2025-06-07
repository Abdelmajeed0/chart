import { useState } from "react";
import SunburstChart from "./components/SunburstChart";

const sampleData = {
  name: "Company Sales",
  children: [
    {
      name: "Electronics",
      children: [
        {
          name: "Computers",
          children: [
            { name: "Laptops", value: 120 },
            { name: "Desktops", value: 80 },
          ],
        },
        {
          name: "Mobile Devices",
          children: [
            { name: "Smartphones", value: 200 },
            { name: "Tablets", value: 50 },
          ],
        },
      ],
    },
    {
      name: "Home Appliances",
      children: [
        { name: "Refrigerators", value: 60 },
        { name: "Washers", value: 40 },
      ],
    },
    { name: "Furniture", value: 90 },
  ],
};

function App() {
  const [filter, setFilter] = useState("");
  const [currentRoot, setCurrentRoot] = useState(sampleData);
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [selectedSegment, setSelectedSegment] = useState(null);

  const handleSegmentClick = (segment) => {
    setSelectedSegment(segment);

    if (segment.originalNode?.data?.children) {
      setCurrentRoot(segment.originalNode.data);
      setBreadcrumbs([
        ...breadcrumbs,
        {
          name: segment.label,
          data: segment.originalNode.data,
        },
      ]);
    }
  };

  const handleResetView = () => {
    setCurrentRoot(sampleData);
    setFilter("");
    setBreadcrumbs([]);
    setSelectedSegment(null);
  };

  const handleBreadcrumbClick = (index) => {
    if (index === -1) {
      setCurrentRoot(sampleData);
      setBreadcrumbs([]);
    } else {
      setCurrentRoot(breadcrumbs[index].data);
      setBreadcrumbs(breadcrumbs.slice(0, index));
    }
    setSelectedSegment(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Sunburst Chart Explorer
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <input
              type="text"
              placeholder="Filter by keyword..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
            <button
              onClick={handleResetView}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              Reset View
            </button>
          </div>

          {/* Breadcrumbs */}
          {breadcrumbs.length > 0 && (
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <button
                onClick={() => handleBreadcrumbClick(-1)}
                className="text-blue-600 hover:underline text-sm"
              >
                Home
              </button>
              {breadcrumbs.map((crumb, index) => (
                <div key={index} className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <button
                    onClick={() => handleBreadcrumbClick(index)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    {crumb.name}
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Chart Container - takes full width on mobile, 2/3 on desktop */}
            <div className="lg:flex-1 h-[500px]">
              <SunburstChart
                data={currentRoot}
                onSegmentClick={handleSegmentClick}
                filterKeyword={filter}
              />
            </div>

            {/* Details Panel - hidden on mobile unless segment selected, always visible on desktop */}
            <div
              className={`lg:w-1/3 ${
                selectedSegment ? "block" : "hidden lg:block"
              }`}
            >
              <div className="bg-white p-4 rounded-lg border border-gray-200 h-full">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Segment Details
                </h2>
                {selectedSegment ? (
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {selectedSegment.label}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Level {selectedSegment.depth}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Value</p>
                        <p className="font-medium">
                          {selectedSegment.value.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Parent</p>
                        <p className="font-medium">
                          {selectedSegment.parent || "None"}
                        </p>
                      </div>
                    </div>
                    {selectedSegment.originalNode?.data?.children ? (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-blue-700 text-sm">
                          Contains{" "}
                          {selectedSegment.originalNode.data.children.length}{" "}
                          sub-categories
                        </p>
                        <p className="text-blue-600 text-xs mt-1">
                          Click on this segment to drill down
                        </p>
                      </div>
                    ) : (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-gray-700 text-sm">
                          This is a leaf node with no sub-categories
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500 text-center">
                      {window.innerWidth < 1024
                        ? "Select a segment to view details"
                        : "No segment selected. Click on a segment to view details."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Chart Legend
          </h2>
          <div className="flex flex-wrap gap-3">
            {["Level 1", "Level 2", "Level 3", "Level 4", "Level 5"].map(
              (level, index) => (
                <div key={level} className="flex items-center">
                  <div
                    className="w-4 h-4 rounded-full mr-2"
                    style={{
                      backgroundColor: [
                        "#FF6384",
                        "#36A2EB",
                        "#FFCE56",
                        "#4BC0C0",
                        "#9966FF",
                      ][index],
                    }}
                  ></div>
                  <span className="text-sm text-gray-700">{level}</span>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
