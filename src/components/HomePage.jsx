import { useState } from 'react';

// Define the live API endpoints from your Render deployment
const ADD_BILL_URL = 'https://billing-backend-MazeTurner89.onrender.com/api/bills';
const COMPARE_URL = 'https://billing-backend-MazeTurner89.onrender.com/api/compare';

export default function HomePage() {
  // State for the "Add Bill" form
  const [newBill, setNewBill] = useState({
    provider: '',
    city: '',
    totalAmount: '',
    unitsConsumed: '',
    dueDate: ''
  });

  // State for the "Compare Bill" form
  const [comparisonData, setComparisonData] = useState({
    provider: '',
    city: '',
    amount: '',
    units: ''
  });

  // State for handling messages and loading for the "Add Bill" form
  const [addBillMessage, setAddBillMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State for handling messages and results for the "Compare" form
  const [comparisonResult, setComparisonResult] = useState(null);
  const [isComparing, setIsComparing] = useState(false);
  const [compareMessage, setCompareMessage] = useState('');

  // --- HANDLER FUNCTIONS ---

  // Handles input changes for the "Add Bill" form
  const handleNewBillChange = (e) => {
    const { name, value } = e.target;
    setNewBill(prevState => ({ ...prevState, [name]: value }));
  };

  // Handles input changes for the "Compare Bill" form
  const handleComparisonChange = (e) => {
    const { name, value } = e.target;
    setComparisonData(prevState => ({ ...prevState, [name]: value }));
  };

  // Handles submission of the "Add Bill" form
  const handleAddBillSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAddBillMessage('');
    try {
      const response = await fetch(ADD_BILL_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBill)
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Submission failed.');
      }
      setAddBillMessage('Success! Your bill was added to the dataset.');
      setNewBill({ provider: '', city: '', totalAmount: '', unitsConsumed: '', dueDate: '' }); // Reset form
    } catch (err) {
      setAddBillMessage(`Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handles submission of the "Compare Bill" form
  const handleCompareSubmit = async (e) => {
    e.preventDefault();
    setIsComparing(true);
    setCompareMessage('');
    setComparisonResult(null);
    const queryParams = new URLSearchParams(comparisonData).toString();
    try {
      const response = await fetch(`${COMPARE_URL}?${queryParams}`);
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Comparison failed.');
      }
      setComparisonResult(result);
    } catch (err) {
      setCompareMessage(`Error: ${err.message}`);
    } finally {
      setIsComparing(false);
    }
  };

  // --- RENDER ---

  return (
    <div className="space-y-12">
      {/* Section 1: Add a Bill */}
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Contribute Your Bill Data</h2>
        <form onSubmit={handleAddBillSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input type="text" name="provider" value={newBill.provider} onChange={handleNewBillChange} placeholder="Provider (e.g., Tata Power)" required className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
          <input type="text" name="city" value={newBill.city} onChange={handleNewBillChange} placeholder="City (e.g., Mumbai)" required className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
          <input type="number" name="totalAmount" value={newBill.totalAmount} onChange={handleNewBillChange} placeholder="Total Amount (₹)" required className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
          <input type="number" name="unitsConsumed" value={newBill.unitsConsumed} onChange={handleNewBillChange} placeholder="Units Consumed (kWh)" required className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
          <input type="date" name="dueDate" value={newBill.dueDate} onChange={handleNewBillChange} required className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 md:col-span-2" />
          <button type="submit" disabled={isSubmitting} className="md:col-span-2 bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition duration-300 disabled:bg-gray-400">
            {isSubmitting ? 'Submitting...' : 'Add My Bill'}
          </button>
        </form>
        {addBillMessage && <p className={`mt-4 text-center p-3 rounded-lg ${addBillMessage.startsWith('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{addBillMessage}</p>}
      </div>

      {/* Section 2: Compare Your Bill */}
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Compare Your Bill</h2>
        <form onSubmit={handleCompareSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input type="text" name="provider" value={comparisonData.provider} onChange={handleComparisonChange} placeholder="Your Provider" required className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          <input type="text" name="city" value={comparisonData.city} onChange={handleComparisonChange} placeholder="Your City" required className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          <input type="number" name="amount" value={comparisonData.amount} onChange={handleComparisonChange} placeholder="Your Bill Amount (₹)" required className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          <input type="number" name="units" value={comparisonData.units} onChange={handleComparisonChange} placeholder="Your Units Consumed" required className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          <button type="submit" disabled={isComparing} className="md:col-span-2 bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300 disabled:bg-gray-400">
            {isComparing ? 'Analyzing...' : 'Compare Now'}
          </button>
        </form>
        {compareMessage && <p className="mt-4 text-center p-3 rounded-lg bg-red-100 text-red-700">{compareMessage}</p>}
        {comparisonResult && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-700 mb-3">Analysis Complete:</h3>
            <p className="text-lg">Your cost per unit: <span className="font-bold text-blue-600">₹{comparisonResult.userCostPerUnit.toFixed(2)}</span></p>
            {comparisonResult.comparison ? (
              <div className="mt-2 space-y-1">
                <p>For {comparisonResult.comparison.count} other bills in your area:</p>
                <p>The average cost per unit is <span className="font-bold">₹{comparisonResult.comparison.averageCostPerUnit.toFixed(2)}</span>.</p>
                <p>The lowest cost per unit was <span className="font-bold text-green-600">₹{comparisonResult.comparison.minCostPerUnit.toFixed(2)}</span>.</p>
                <p>The highest cost per unit was <span className="font-bold text-red-600">₹{comparisonResult.comparison.maxCostPerUnit.toFixed(2)}</span>.</p>
              </div>
            ) : (
              <p className="mt-2">{comparisonResult.message}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
