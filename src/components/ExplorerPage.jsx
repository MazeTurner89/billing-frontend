import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip as PieTooltip, Legend as PieLegend, ResponsiveContainer as PieResponsiveContainer } from 'recharts';

export default function ExplorerPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/bills');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []); // Empty dependency array means this runs once when the component mounts.

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  if (isLoading) return <p className="text-center mt-8">Loading data...</p>;
  if (error) return <p className="text-center mt-8 text-red-600">Error: {error}</p>;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <header className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Data Explorer</h1>
        <p className="text-md text-gray-600 mt-2">Browse the anonymized dataset.</p>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-lg font-semibold text-gray-500">Total Bills Submitted</h3>
          <p className="text-4xl font-bold text-indigo-600">{data.summary.totalBills}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-lg font-semibold text-gray-500">Overall Average Cost/Unit</h3>
          <p className="text-4xl font-bold text-green-600">₹{data.summary.overallAverageCost.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Provider Distribution Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-center mb-4">Provider Distribution</h3>
          <div className="w-full h-80">
            <PieResponsiveContainer>
              <PieChart>
                <Pie data={data.providerCounts} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {data.providerCounts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <PieTooltip />
                <PieLegend />
              </PieChart>
            </PieResponsiveContainer>
          </div>
        </div>

        {/* Raw Data Table */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-center mb-4">Raw Data</h3>
          <div className="overflow-x-auto h-96">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.bills.map(bill => (
                  <tr key={bill._id}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">{bill.provider}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">{bill.city}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">₹{bill.totalAmount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}