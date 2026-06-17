import { useNavigate } from 'react-router-dom';

const PaymentFailed = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-lg shadow-md p-10 text-center">
        <div className="text-red-500 text-6xl mb-4">❌</div>
        <h2 className="text-2xl font-bold mb-2">Payment Cancelled</h2>
        <p className="text-gray-600 mb-6">Your payment was not completed. No charges were made.</p>
        <button onClick={() => navigate(-1)} className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 mr-3">
          Try Again
        </button>
        <button onClick={() => navigate('/home')} className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600">
          Go Home
        </button>
      </div>
    </div>
  );
};

export default PaymentFailed;
