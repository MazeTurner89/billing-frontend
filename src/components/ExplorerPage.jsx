import { useState, useEffect } from 'react';
// For the chart, we'll use Recharts, a popular charting library for React.
// If you haven't already, install it in your frontend folder: npm install recharts
import { PieChart, Pie, Cell, Legend, ResponsiveContainer, Tooltip } from 'recharts';

// Define the live API endpoint from your Render deployment
const API_URL = 'https://billing-backend-MazeTurner89.onrender.com/api/bills';

// Define some colors for our pie chart slices
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

export default function ExplorerPage() {
  // State for storing all fetched data (bills, summary, etc.)
  const [data, setData] = useState(null);
  // State for managing the loading status
  const [loading, setLoading] = useState(true);
  // State for holding any potential error messages
  const [error, setError] = useState(null);

  useEffect(() => {
    // This function fetches all the data from our backend
    const fetchData = async () => {
      try {
        setLoading(true); // Set loading to true before the request
        setError(null);   // Clear any previous errors
        
        const response = await fetch(API_URL);
        
        if (!response.ok) {
          throw new Error('Failed to fetch data from the server. It might be spinning up.');
        }
        
        const result = await response.json();
        setData(result); // Store the successful result in state
      } catch (err) {
        setError(err.message);
        console.error("Fetch error:", err);
      } finally {
        setLoading(false); // Set loading to false after the request is complete
      }
    };

    fetchData();
  }, []); // The empty dependency array [] ensures this effect runs only once when the component mounts

  // Show a loading message while data is being fetched
  if (loading) {
    return <div className="text-center mt-10 text-lg text-gray-600 animate-pulse">Loading Data Explorer...</div>;
  }

  // Show an error message if the fetch request failed
  if (error) {
    return <div className="text-center mt-10 text-red-600 bg-red-100 p-4 rounded-lg shadow-md">Error: {error}</div>;
  }

  // Render the main content once the data has been successfully fetched
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 tracking-tight">Data Explorer</h1>
        <p className="mt-2 text-lg text-gray-500">
          An overview of the collective billing data contributed by the community.
        </p>
      </div>

      {/* Stats and Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stats Summary Section */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg space-y-4">
            <h2 className="text-2xl font-semibold text-gray-700 border-b pb-2">Summary</h2>
            <div className="flex justify-between items-center text-lg">
                <span className="text-gray-600">Total Bills:</span>
                <span className="font-bold text-2xl text-indigo-600">{data?.summary?.totalBills || 0}</span>
            </div>
            <div className="flex justify-between items-center text-lg">
                <span className="text-gray-600">Avg. Cost / Unit:</span>
                <span className="font-bold text-2xl text-indigo-600">
                    ₹{data?.summary?.overallAverageCost?.toFixed(2) || '0.00'}
                </span>
            </div>
        </div>
        
        {/* Provider Distribution Chart Section */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">Provider Distribution</h2>
            <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                    <Pie
                        data={data?.providerCounts}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                        {data?.providerCounts?.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value} bills`} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
      </div>

      {/* Raw Data Table Section */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Raw Data Entries</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount (₹)</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.bills?.map((bill) => (
                <tr key={bill._id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{bill.provider}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bill.city}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bill.totalAmount.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bill.unitsConsumed}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(bill.dueDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
