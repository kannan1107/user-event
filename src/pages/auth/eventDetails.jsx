import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const EventDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const event = location.state?.event;
  const imageBaseUrl = import.meta.env.VITE_IMAGE_BASE_URL || 'http://localhost:5000/uploads/';

  console.log('Event data:', event);
  console.log('Guests:', event?.guests);
  console.log('Organizer:', event?.organizer);

  if (!event) {
    return <div className="p-6 text-center">Event not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {event.image && (
          <img 
            src={event.image.startsWith('http') ? event.image : `${imageBaseUrl}${event.image}`}
            alt={event.title} 
            className="w-full h-96 object-cover"
          />
        )}
        
        <div className="p-8">
          <h1 className="text-4xl font-bold mb-4 text-center text-green-500">{event.title}</h1>
          <h3 className="text-4xl font-bold mb-4 text-center text-blue-500">{event.organizer}</h3>

          <p className="text-gray-700 text-lg mb-6">{event.description}</p>

          {/* Calendar Schedule View */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg mb-8 border-2 border-blue-200">
            <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">Event Schedule</h2>
            <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
              <div className="bg-white p-6 rounded-lg shadow-lg text-center min-w-[200px]">
                <div className="text-sm text-gray-500 uppercase mb-2">{new Date(event.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</div>
                <div className="text-6xl font-bold text-blue-600">{new Date(event.date).getDate()}</div>
                <div className="text-lg font-semibold text-gray-700 mt-2">{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long' })}</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600">{new Date(event.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
                <div className="text-sm text-gray-600 mt-2">Event Time</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
              </svg>
              <div>
                <p className="text-sm text-gray-500">Date & Time</p>
                <p className="font-semibold">{new Date(event.date).toLocaleDateString('en-US', {
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                })} at {new Date(event.date).toLocaleTimeString('en-US', {
                  hour: '2-digit', minute: '2-digit'
                })}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-semibold">{event.location}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-purple-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <p className="font-semibold">{event.category}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
              </svg>
              <div>
                <p className="text-sm text-gray-500">Organizer</p>
                <p className="font-semibold">{event.organizer}</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Ticket Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">VIP Seats</p>
                <p className="text-2xl font-bold text-yellow-600">{event.vipSeats}</p>
                <p className="text-lg font-semibold">${event.viptickets}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Regular Seats</p>
                <p className="text-2xl font-bold text-blue-600">{event.regularSeats}</p>
                <p className="text-lg font-semibold">${event.regulartickets}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Total Seats</p>
                <p className="text-2xl font-bold text-purple-600">{event.totalSeats}</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Event Guests</h2>
            {event.guests && event.guests.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {event.guests.map((guest, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg text-center">
                    {guest.photo && (
                      <img 
                        src={guest.photo.startsWith('http') ? guest.photo : `${imageBaseUrl}${guest.photo}`}
                        alt={guest.name}
                        className="w-24 h-24 rounded-full mx-auto mb-3 object-cover"
                      />
                    )}
                    <h3 className="font-bold text-lg">{guest.name}</h3>
                    <p className="text-gray-600 text-sm">{guest.position}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No guests added for this event</p>
            )}
          </div>

          {user && user.role !== "admin" && new Date(event.date) >= new Date() && (
            <div className="flex gap-4 justify-center">
              {event.vipSeats > 0 && (
                <button 
                  onClick={() => navigate('/payment', { 
                    state: { event, ticketType: 'VIP', price: event.viptickets }
                  })}
                  className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-8 py-3 rounded-full font-bold hover:shadow-lg"
                >
                  Book VIP Ticket - ${event.viptickets}
                </button>
              )}
              {event.regularSeats > 0 && (
                <button 
                  onClick={() => navigate('/payment', { 
                    state: { event, ticketType: 'Regular', price: event.regulartickets }
                  })}
                  className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-8 py-3 rounded-full font-bold hover:shadow-lg"
                >
                  Book Regular Ticket - ${event.regulartickets}
                </button>
              )}
            </div>
          )}

          <button 
            onClick={() => navigate('/home')}
            className="mt-6 text-blue-500 hover:underline"
          >
            ← Back to Events
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
