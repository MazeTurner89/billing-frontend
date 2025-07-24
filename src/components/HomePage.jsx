import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';

export default function HomePage() {
  const [formData, setFormData] = useState({
    provider: '', city: '', area: '', unitsConsumed: '', totalAmount: '', billingCycle: '',
  });
  const [analysisResult, setAnalysisResult] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setAnalysisResult(null);
    setMessage('');
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setAnalysisResult(null);

    try {const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/bills`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Submission failed');
      
      setMessage(`Success! Your bill was saved. Analyzing...`);

      const queryParams = new URLSearchParams({
        provider: formData.provider,
        city: formData.city,
        units: formData.unitsConsumed,
        amount: formData.totalAmount,
      }).toString();

      const compareResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/compare?${queryParams}`);
      const compareResult = await compareResponse.json();
      if (!compareResponse.ok) throw new Error(compareResult.message || 'Comparison failed');

      setAnalysisResult(compareResult);
      setMessage('');

      setFormData({
        provider: '', city: '', area: '', unitsConsumed: '', totalAmount: '', billingCycle: '',
      });

    } catch (error) {
      setMessage(`Error: ${error.message}`);
      setAnalysisResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const chartData = analysisResult && analysisResult.comparison ? [
    { name: 'Cost Per Unit', 'Your Bill': parseFloat(analysisResult.userCostPerUnit.toFixed(2)), 'Average Bill': parseFloat(analysisResult.comparison.averageCostPerUnit.toFixed(2)) }
  ] : [];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <header className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Utility Bill Transparency</h1>
        <p className="text-md text-gray-600 mt-2">Is your electricity bill fair? Enter your details to find out.</p>
      </header>

      <main className="bg-white rounded-lg shadow-md p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input name="provider" value={formData.provider} onChange={handleChange} placeholder="Provider (e.g., Adani)" required className="p-3 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"/>
            <input name="city" value={formData.city} onChange={handleChange} placeholder="City (e.g., Mumbai)" required className="p-3 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"/>
          </div>
          <input name="area" value={formData.area} onChange={handleChange} placeholder="Area (e.g., Santacruz)" required className="p-3 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"/>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input name="unitsConsumed" value={formData.unitsConsumed} onChange={handleChange} placeholder="Units Consumed (kWh)" type="number" required className="p-3 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"/>
            <input name="totalAmount" value={formData.totalAmount} onChange={handleChange} placeholder="Total Amount (INR)" type="number" required className="p-3 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"/>
          </div>
          <input name="billingCycle" value={formData.billingCycle} onChange={handleChange} placeholder="Billing Cycle (YYYY-MM)" type="month" required className="p-3 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"/>
          
          <button type="submit" disabled={isLoading} className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors duration-300">
            {isLoading ? 'Analyzing...' : 'Submit & Compare'}
          </button>
        </form>

        {message && <p className="text-center mt-4 text-sm font-medium text-red-600">{message}</p>}
      </main>

      {analysisResult && (
        <section className="bg-white rounded-lg shadow-md p-6 sm:p-8 mt-8">
          <h2 className="text-2xl font-bold text-center mb-4">Analysis Results</h2>
          <div className="text-center space-y-2">
            <p className="text-lg">Your Cost Per Unit: <strong className="text-indigo-600">₹{analysisResult.userCostPerUnit.toFixed(2)}</strong></p>
            {analysisResult.comparison ? (
              <>
                <p className="text-lg">Average in your city: <strong className="text-green-600">₹{analysisResult.comparison.averageCostPerUnit.toFixed(2)}</strong></p>
                <p className="text-sm text-gray-500">(Based on {analysisResult.comparison.count} similar bill(s))</p>
                <div className="w-full h-80 pt-4">
                  <ResponsiveContainer>
                    <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => `₹${value}`} />
                      <Legend />
                      <Bar dataKey="Your Bill" fill="#4f46e5" />
                      <Bar dataKey="Average Bill" fill="#16a34a" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </>
            ) : (
              <p className="text-gray-600 mt-4">Could not find enough similar bills to create a comparison.</p>
            )}
          </div>
        </section>
      )}
    </div>
  );
}