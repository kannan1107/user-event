import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { useRateEventMutation } from '../../features/ApplicationApi';

const EventDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const event = location.state?.event;
  const imageBaseUrl = import.meta.env.VITE_IMAGE_BASE_URL || 'http://localhost:5000/uploads/';

  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(0);
  const [review, setReview] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [rateEvent, { isLoading: rating }] = useRateEventMutation();

  const userRating = event?.ratings?.find((r) => r.userId === user?._id || r.userId === user?.id);

  const avgRating = event?.ratings?.length
    ? (event.ratings.reduce((a, r) => a + r.rating, 0) / event.ratings.length).toFixed(1)
    : 0;

  const handleRatingSubmit = async () => {
    if (!selected) return;
    try {
      await rateEvent({ id: event._id, rating: selected, review }).unwrap();
      setSubmitted(true);
    } catch (e) {
      console.error(e);
    }
  };

  console.log('Event data:', event);
  console.log('Guests:', event?.guests);
  console.log('Organizer:', event?.organizer);

  if (!event) {
    return <div className="p-6 text-center text-white">Event not found</div>;
  }

  return (
    <div className="min-h-screen p-6 relative overflow-hidden" style={{ background: 'linear-gradient(to bottom, #0a0a1a, #0d0d2b, #0a0a1a)' }}>
      <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
        {Array.from({ length: 120 }).map((_, i) => (
          <div key={i} className="absolute rounded-full bg-white" style={{ width: `${Math.random() * 2.5 + 0.5}px`, height: `${Math.random() * 2.5 + 0.5}px`, top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, opacity: Math.random() * 0.7 + 0.3, animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`, animationDelay: `${Math.random() * 4}s` }} />
        ))}
      </div>
      <style>{`@keyframes twinkle { 0%, 100% { opacity: 0.3; transform: scale(1); } 50% { opacity: 1; transform: scale(1.4); } } @keyframes shootingStar { 0% { transform: translateX(0) translateY(0); opacity: 1; width: 0; } 100% { transform: translateX(300px) translateY(300px); opacity: 0; width: 150px; } }`}</style>
      {[...Array(4)].map((_, i) => (
        <div key={i} className="fixed h-px bg-gradient-to-r from-transparent via-white to-transparent pointer-events-none" style={{ top: `${10 + i * 20}%`, left: `${5 + i * 15}%`, animation: `shootingStar ${3 + i * 2}s linear infinite`, animationDelay: `${i * 3}s`, zIndex: 0 }} />
      ))}
      <div className="max-w-6xl mx-auto rounded-2xl overflow-hidden relative" style={{ zIndex: 1, background: 'rgba(15, 15, 40, 0.85)', border: '1px solid rgba(139, 92, 246, 0.3)', backdropFilter: 'blur(10px)', boxShadow: '0 0 40px rgba(139, 92, 246, 0.2)' }}>
        {event.image && (
          <img 
            src={event.image.startsWith('http') ? event.image : `${imageBaseUrl}${event.image}`}
            alt={event.title} 
            className="w-full h-96 object-cover"
          />
        )}
        
        <div className="p-8">
          <h1 className="text-4xl font-bold mb-4 text-center" style={{ background: 'linear-gradient(to right, #a78bfa, #60a5fa, #f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{event.title}</h1>
          <h3 className="text-2xl font-bold mb-4 text-center text-purple-300">{event.organizer}</h3>

          <p className="text-gray-300 text-lg mb-6">{event.description}</p>

          {/* Calendar Schedule View */}
          <div className="p-6 rounded-xl mb-8" style={{ background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
            <h2 className="text-2xl font-bold mb-4 text-center text-purple-300">✦ Event Schedule ✦</h2>
            <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
              <div className="p-6 rounded-xl text-center min-w-[200px]" style={{ background: 'rgba(30, 20, 60, 0.8)', border: '1px solid rgba(139, 92, 246, 0.4)', boxShadow: '0 0 20px rgba(139, 92, 246, 0.2)' }}>
                <div className="text-sm text-purple-400 uppercase mb-2">{new Date(event.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</div>
                <div className="text-6xl font-bold text-purple-300">{new Date(event.date).getDate()}</div>
                <div className="text-lg font-semibold text-blue-300 mt-2">{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long' })}</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-pink-300">{new Date(event.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
                <div className="text-sm text-gray-400 mt-2">Event Time</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
              </svg>
              <div>
                <p className="text-sm text-purple-400">Date & Time</p>
                <p className="font-semibold text-gray-200">{new Date(event.date).toLocaleDateString('en-US', {
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                })} at {new Date(event.date).toLocaleTimeString('en-US', {
                  hour: '2-digit', minute: '2-digit'
                })}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-pink-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              <div>
                <p className="text-sm text-purple-400">Location</p>
                <p className="font-semibold text-gray-200">{event.location}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-violet-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <div>
                <p className="text-sm text-purple-400">Category</p>
                <p className="font-semibold text-gray-200">{event.category}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
              </svg>
              <div>
                <p className="text-sm text-purple-400">Organizer</p>
                <p className="font-semibold text-gray-200">{event.organizer}</p>
              </div>
            </div>
          </div>

          <div className="pt-6 mb-8" style={{ borderTop: '1px solid rgba(139, 92, 246, 0.3)' }}>
            <h2 className="text-2xl font-bold mb-4 text-purple-300">✦ Ticket Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl" style={{ background: 'rgba(251, 191, 36, 0.1)', border: '1px solid rgba(251, 191, 36, 0.3)' }}>
                <p className="text-sm text-yellow-400">VIP Seats</p>
                <p className="text-2xl font-bold text-yellow-300">{event.vipSeats}</p>
                <p className="text-lg font-semibold text-yellow-200">${event.vipTicketPrice}</p>
              </div>
              <div className="p-4 rounded-xl" style={{ background: 'rgba(96, 165, 250, 0.1)', border: '1px solid rgba(96, 165, 250, 0.3)' }}>
                <p className="text-sm text-blue-400">Regular Seats</p>
                <p className="text-2xl font-bold text-blue-300">{event.regularSeats}</p>
                <p className="text-lg font-semibold text-blue-200">${event.regularTicketPrice}</p>
              </div>
              <div className="p-4 rounded-xl" style={{ background: 'rgba(167, 139, 250, 0.1)', border: '1px solid rgba(167, 139, 250, 0.3)' }}>
                <p className="text-sm text-purple-400">Total Seats</p>
                <p className="text-2xl font-bold text-purple-300">{event.totalSeats}</p>
              </div>
            </div>
          </div>

          <div className="pt-6 mb-8" style={{ borderTop: '1px solid rgba(139, 92, 246, 0.3)' }}>
            <h2 className="text-2xl font-bold mb-4 text-purple-300">✦ Event Guests</h2>
            {event.guests && event.guests.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {event.guests.map((guest, index) => (
                  <div key={index} className="p-4 rounded-xl text-center" style={{ background: 'rgba(30, 20, 60, 0.6)', border: '1px solid rgba(139, 92, 246, 0.3)', boxShadow: '0 0 15px rgba(139, 92, 246, 0.1)' }}>
                    {guest.photo && (
                      <img 
                        src={guest.photo.startsWith('http') ? guest.photo : `${imageBaseUrl}${guest.photo}`}
                        alt={guest.name}
                        className="w-24 h-24 rounded-full mx-auto mb-3 object-cover"
                      />
                    )}
                    <h3 className="font-bold text-lg text-purple-200">{guest.name}</h3>
                    <p className="text-purple-400 text-sm">{guest.position}</p>
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
                    state: { event, ticketType: 'VIP', price: event.vipTicketPrice }
                  })}
                  className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-8 py-3 rounded-full font-bold hover:shadow-lg"
                >
                  Book VIP Ticket - ${event.vipTicketPrice}
                </button>
              )}
              {event.regularSeats > 0 && (
                <button 
                  onClick={() => navigate('/payment', { 
                    state: { event, ticketType: 'Regular', price: event.regularTicketPrice }
                  })}
                  className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-8 py-3 rounded-full font-bold hover:shadow-lg"
                >
                  Book Regular Ticket - ${event.regularTicketPrice}
                </button>
              )}
            </div>
          )}

          {/* Rating Display */}
          <div className="pt-6 mb-6" style={{ borderTop: '1px solid rgba(139, 92, 246, 0.3)' }}>
            <h2 className="text-2xl font-bold mb-3 text-purple-300">✦ Event Rating</h2>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex">
                {[1,2,3,4,5].map((star) => (
                  <svg key={star} className={`w-7 h-7 ${star <= Math.round(avgRating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
              </div>
              <span className="text-xl font-bold text-yellow-500">{avgRating}</span>
              <span className="text-gray-400 text-sm">({event?.ratings?.length || 0} reviews)</span>
              <span className="text-gray-400 text-sm">- Your rating: {userRating ? `${userRating.rating} ★` : 'Not rated yet'}</span>
              <div className="ml-auto">{userRating?.review && <p className="text-sm text-purple-300 italic">Your review: "{userRating.review}"</p>}</div>
            </div>

            {/* Submit Rating - only for logged-in non-admin users */}
            {user && user.role !== 'admin' && (
              submitted || userRating ? (
                <p className="text-green-600 font-semibold">✓ You rated this event {userRating?.rating || selected} ★</p>
              ) : (
                <div className="p-4 rounded-xl" style={{ background: 'rgba(30, 20, 60, 0.6)', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
                  <p className="font-semibold mb-2 text-purple-300">Rate this event:</p>
                  <div className="flex gap-1 mb-3">
                    {[1,2,3,4,5].map((star) => (
                      <svg
                        key={star}
                        className={`w-9 h-9 cursor-pointer transition-colors ${
                          star <= (hovered || selected) ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        onMouseEnter={() => setHovered(star)}
                        onMouseLeave={() => setHovered(0)}
                        onClick={() => setSelected(star)}
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    ))}
                  </div>
                  <textarea
                    className="w-full rounded p-2 text-sm mb-3 text-gray-200"
                    style={{ background: 'rgba(15, 15, 40, 0.8)', border: '1px solid rgba(139, 92, 246, 0.4)' }}
                    rows={2}
                    placeholder="Write a review (optional)"
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                  />
                  <button
                    onClick={handleRatingSubmit}
                    disabled={!selected || rating}
                    className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-6 py-2 rounded-full disabled:opacity-50"
                  >
                    {rating ? 'Submitting...' : 'Submit Rating'}
                  </button>
                </div>
              )
            )}
          </div>

          {/* All Reviews List */}
          {event?.ratings?.length > 0 && (
            <div className="pt-6 mb-6" style={{ borderTop: '1px solid rgba(139, 92, 246, 0.3)' }}>
              <h2 className="text-2xl font-bold mb-4 text-purple-300">✦ What others are saying</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {event.ratings.map((r, index) => (
                  <div key={index} className="p-4 rounded-xl" style={{ background: 'rgba(30, 20, 60, 0.6)', border: '1px solid rgba(139, 92, 246, 0.25)' }}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg key={star} className={`w-4 h-4 ${star <= r.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                          </svg>
                        ))}
                      </div>
                      <span className="text-xs font-bold text-purple-400 uppercase">
                        {r.userName || "Verified Attendee"}
                      </span>
                    </div>
                    {r.review ? (
                      <p className="text-gray-300 italic text-sm">"{r.review}"</p>
                    ) : (
                      <p className="text-gray-500 text-xs italic">No comment provided.</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <button 
            onClick={() => navigate('/home')}
            className="mt-6 text-purple-400 hover:text-purple-200 hover:underline transition-colors"
          >
            ← Back to Events
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
