import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { useProcessPaymentMutation } from '../../features/ApplicationApi';
import StripeCheckout from 'react-stripe-checkout';

// import dotenv from 'dotenv' // This is usually for Node.js backend, not React frontend

const Payment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  

  const { event, ticketType, price } = state || {}; // Ensure state is defined
  const [processPaymentMutation] = useProcessPaymentMutation();
  const [ticketCount, setTicketCount] = useState(1);
  
  // Debug logging
  console.log('Payment component state:', { event, ticketType, price });
  console.log('Event object:', event);
  
  // Convert price to number with fallbacks for different property names
  let actualPrice = price;
  if (!actualPrice && event) {
    // Try different possible price property names
    if (ticketType === 'VIP') {
      actualPrice = event.viptickets || event.vipTicketPrice || event.vipPrice;
    } else if (ticketType === 'Regular') {
      actualPrice = event.regulartickets || event.regularTicketPrice || event.regularPrice;
    }
  }
  
  const numericPrice = parseFloat(actualPrice) || 0;
  const totalAmount = +Number(numericPrice * ticketCount).toFixed(2);
  
  console.log('Final price values:', { actualPrice, numericPrice, totalAmount });

  // Define STRIPE_PUBLISHABLE_KEY here, outside the render for cleaner access
  const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ||
  'pk_test_51SIA4MBkenI78onID0gYnJjr2D4MjNcPKWKNBOF6sP53sOFcMHfHlKCfhxU2xy1faxAJjl4azon90tOQ0KOqWLZb00z4hn7vXY';
  
  


  const processPayment = (paymentMethod, stripeToken = null) => { // Added stripeToken parameter
    try {
      const availableSeats = ticketType === 'VIP' ? event.vipSeats : event.regularSeats;
      
      if (ticketCount > availableSeats) {
        alert(`Only ${availableSeats} ${ticketType} tickets available. Cannot book ${ticketCount} tickets.`);
        return;
      }

      // Simulate payment processing
      alert(`Processing ${paymentMethod} payment for $${totalAmount}...`);
      const paymentData = { Title: event.title, eventId: event._id ||
         event.id, userId: user?.id || user?._id, userName: user?.name || 
         'Guest', eventTitle: event.title, ticketType, ticketCount, unitPrice: price * 100,
          totalAmount: totalAmount * 100, paymentMethod, paymentDate: new Date().toISOString(),
           status: 'completed', ...(stripeToken && { stripeTokenId: stripeToken.id }) }

      setTimeout(() => {
        const success = Math.random() > 0.1; // 90% success rate

        if (success) {
          // Send payment data to backend
          const paymentData = {
            Title: event.title,
            eventId: event._id || event.id,
            userId: user?.id || user?._id,
            userName: user?.name || 'Guest',
            userEmail: user?.email,
            eventTitle: event.title,
            ticketType,
            ticketCount,
            unitPrice: numericPrice * 100, // Use numericPrice instead of price
            totalAmount: parseFloat(totalAmount) * 100, // Parse totalAmount to ensure it's a number
            paymentMethod,
            paymentDate: new Date().toISOString(),
            status: 'completed',
            
            
            ...(stripeToken && { stripeTokenId: stripeToken.id }),
             // Include stripeTokenId if available
          };

          processPaymentMutation({ id: event._id || event.id, paymentData })
            .unwrap()
            .then(() => {
              alert(`✅ ${paymentMethod} payment successful for ${ticketCount} ${ticketType} ticket(s)!\nTotal Amount: $${totalAmount}\nEvent: ${event.title}`);
              navigate('/');
            })
            .catch((error) => {
              console.error('Payment API error:', error);
              alert(`✅ Payment successful but failed to save to database: ${error.data?.message || error.message}`); // More specific error
              navigate('/');
            });
        } else {
          alert(`❌ ${paymentMethod} payment failed. Please try again.`);
        }
      }, 2000);
    } catch (error) {
      alert(`Payment error: ${error.message}`);
    }
  };

  const handlePayPal = () => processPayment('PayPal');
  const handleGooglePay = () => processPayment('Google Pay');
  const handleApplePay = () => processPayment('Apple Pay');
  // const handleStripe = () => processPayment('Stripe'); // Not needed, StripeCheckout handles it
  const handleRazorpay = () => processPayment('Razorpay');
  const handlePhonePe = () => processPayment('PhonePe');

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No event selected</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Go Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Event Details */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Event Details</h2>
            <div className="space-y-3">
              <div>
                <span className="font-semibold">Event:</span> {event.title}
              </div>
              <div>
                <span className="font-semibold">Date:</span> {event.date}
              </div>
              <div>
                <span className="font-semibold">Location:</span> {event.location}
              </div>
              <div>
                <span className="font-semibold">Organizer:</span> {event.organizer}
              </div>
              <div>
                <span className="font-semibold">Category:</span> {event.category}
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded">
              <h3 className="font-semibold mb-2">Ticket Information</h3>
              <div className="flex justify-between">
                <span>Ticket Type:</span>
                <span className="font-semibold">{ticketType}</span>
              </div>
              <div className="flex justify-between">
                <span>Unit Price:</span>
                <span className="font-semibold">${numericPrice}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Quantity:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                    className="bg-gray-200 px-2 py-1 rounded"
                  >
                    -
                  </button>
                  <span className="font-semibold px-3">{ticketCount}</span>
                  <button
                    onClick={() => {
                      const availableSeats = ticketType === 'VIP' ? event.vipSeats : event.regularSeats;
                      if (ticketCount + 1 <= availableSeats) {
                        setTicketCount(ticketCount + 1);
                      } else {
                        alert(`Only ${availableSeats} ${ticketType} tickets available!`);
                      }
                    }}
                    className="bg-gray-200 px-2 py-1 rounded"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="flex justify-between border-t pt-2 mt-2">
                <span className="font-bold">Total Amount:</span>
                <span className="font-bold text-lg">${totalAmount}</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded">
              <h3 className="font-semibold mb-2">Customer Information</h3>
              <div>
                <span className="font-semibold">Name:</span> {user?.name || 'Guest'}
              </div>
              <div>
                <span className="font-semibold">Email:</span> {user?.email || 'Not provided'}
              </div>
            </div>
          </div>

          {/* Payment Form */}
          {/* Removed the redundant min-h-screen div here */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Payment Options</h2>

            {/* Digital Payment Options */}
            <div className="space-y-3 mb-6">
              <h3 className="font-semibold text-lg">Digital Payments</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handlePayPal}
                  className="flex items-center justify-center gap-2 p-3 border-2 border-blue-500 text-blue-500 rounded-md hover:bg-blue-50"
                >
                  <span className="font-bold">PayPal</span>
                </button>
                <button
                    onClick={handleGooglePay}
                    className="flex items-center justify-center gap-2 p-3 border-2 border-green-500 text-green-500 rounded-md hover:bg-green-50"
                >
                    <span className="font-bold">Google Pay</span>
                </button>
                <button
                    onClick={handleApplePay}
                    className="flex items-center justify-center gap-2 p-3 border-2 border-gray-700 text-gray-700 rounded-md hover:bg-gray-50"
                >
                    <span className="font-bold">Apple Pay</span>
                </button>
                <button
                    onClick={handleRazorpay}
                    className="flex items-center justify-center gap-2 p-3 border-2 border-indigo-500 text-indigo-500 rounded-md hover:bg-indigo-50"
                >
                    <span className="font-bold">Razorpay</span>
                </button>
                <button
                    onClick={handlePhonePe}
                    className="flex items-center justify-center gap-2 p-3 border-2 border-purple-700 text-purple-700 rounded-md hover:bg-purple-50"
                >
                    <span className="font-bold">PhonePe</span>
                </button>

                {/* Stripe integration: Use StripeCheckout to render a single button that opens the popup */}
                <div className="col-span-2 border-2 border-purple-500 rounded-md p-4">
                  <h4 className="font-bold text-purple-500 mb-3">💳 Card Payment (Stripe)</h4>
                  {/* Remove your manual card input fields here, as StripeCheckout handles the input via popup */}
                  <StripeCheckout
                      name={event?.title || 'Event Payment'} // Use optional chaining
                      description={`Total amount for ${ticketCount } ${ticketType} ticket(s).`}
                      amount={totalAmount * 100} // Stripe amount is in cents
                      currency="USD" // Or your currency
                      stripeKey={STRIPE_PUBLISHABLE_KEY} // Use the defined constant
                      token={(token) => processPayment('Stripe', token)} // Pass token to your handler
                      email={user?.email || 'guest@example.com'} // Use optional chaining
                      shippingAddress={false}
                      billingAddress={false}
                  >
                      <button
                          className="w-full bg-purple-500 text-white py-2 rounded hover:bg-purple-600"
                      >
                          Pay with Card (Stripe Popup)
                      </button>
                  </StripeCheckout>
                  <div className="flex gap-2 text-sm text-gray-600 mt-2">
                    <span>💳 Visa</span>
                    <span>💳 Mastercard</span>
                    <span>💳 Amex</span>
                    <span>💳 Discover</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between text-lg font-bold mb-4">
                <span>Total Amount:</span>
                <span>${totalAmount}</span>
              </div>

              <button
                onClick={() => navigate('/')}
                className="w-full bg-gray-500 text-white py-3 rounded-md hover:bg-gray-600 mb-3"
              >
                Cancel
              </button>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};

export default Payment;
