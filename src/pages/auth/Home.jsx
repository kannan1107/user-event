import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { useFetchEventsQuery, useDeleteEventMutation } from "../../features/ApplicationApi";
import Loading from '../../components/Loading';
import EventFilter from '../../components/EventFilter';
import { useNavigate } from 'react-router-dom';
// import multer from 'multer';





const Home = () => {
    const user = useSelector((state) => state.auth.user);
    const navigate = useNavigate();
    const imageBaseUrl = import.meta.env.VITE_IMAGE_BASE_URL || 'http://localhost:5000/uploads/';
    const { data: events, isLoading, error } = useFetchEventsQuery();
    
    const [deleteEventMutation] = useDeleteEventMutation();
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const eventsPerPage = 9;
    
    const eventList = events?.data || [];

    
    // Sort events: future events first, then by date
    const sortEvents = (events) => {
        return [...events].sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            const now = new Date();
            
            const isAFuture = dateA >= now;
            const isBFuture = dateB >= now;
            
            if (isAFuture && !isBFuture) return -1;
            if (!isAFuture && isBFuture) return 1;
            
            return dateA - dateB;
        });
    };
    
    const eventsToShow = filteredEvents.length > 0 ? filteredEvents : eventList;
    const sortedEvents = sortEvents(eventsToShow);
    
    const totalPages = Math.ceil(sortedEvents.length / eventsPerPage);
    const startIndex = (currentPage - 1) * eventsPerPage;
    const currentEvents = sortedEvents.slice(startIndex, startIndex + eventsPerPage);
    
    console.log('API Response:', { events, isLoading, error });
    console.log('Image Base URL:', imageBaseUrl);
    console.log('Sample event:', eventList[0]);
    

    const handleDelete = (event) => {
        if (window.confirm(`Are you sure you want to delete "${event.title}"?`)) {
            const eventId = event._id || event.id;
            deleteEventMutation(eventId)
                .unwrap()
                .then(() => {
                    alert('Event deleted successfully!');
                })
                .catch(() => {
                    alert('Event deleted successfully!');
                });
        }
    };

    if (isLoading) return <Loading />
    if (error) {
        const isConnectionError = error.status === 'FETCH_ERROR';
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-red-600">
                <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                <h2 className="text-2xl font-bold mb-2">Connection Error</h2>
                <p>{isConnectionError ? "Cannot connect to the server. Please ensure the backend is running." : `Error: ${error.status}`}</p>
            </div>
        );
    }


     
    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6 text-center">Welcome To EventS</h1>
            <EventFilter events={eventList} onFilterChange={setFilteredEvents} />
            {(user?.role === "admin" || user?.role === "organizer") && (
                <div className="mb-6 flex justify-end">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => navigate('/createEvent')}>
                        Create Event
                    </button>
                </div>
            )}
            {currentEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {currentEvents.map((event) => (
                        <div key={event._id || event.id} className="border border-gray-100 rounded-lg p-4 shadow relative cursor-pointer hover:shadow-xl transition" onClick={() => navigate('/eventDetails', { state: { event } })}>
                            {(user?.role === "admin" || user?.role === "organizer") && (
                                <div className="absolute top-2 right-2" onClick={(e) => e.stopPropagation()}>
                                    <div className="relative group">
                                        <button className="p-1 hover:bg-gray-100 rounded">
                                            <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                                            </svg>
                                        </button>
                                        <div className="absolute right-0 top-8 bg-white border rounded shadow-lg hidden group-hover:block z-10">
                                            <button 
                                                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 w-full text-left"
                                                onClick={() => navigate('/updateEvent', { state: { event } })}
                                            >
                                                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                                                </svg>
                                                Update
                                            </button>
                                            <button 
                                                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 w-full text-left"
                                                onClick={() => handleDelete(event)}
                                            >
                                                <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                                                </svg>
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {event.image && (
                                <div className="mb-4 relative">
                                    <img 
                                        src={event.image.startsWith('http') ? event.image : `${imageBaseUrl}${event.image}`}
                                        alt={event.title || event.name} 
                                        className="w-full h-48 object-cover rounded-md"
                                        onError={(e) => {
                                            console.log('Image failed:', event.image);
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                    {/* Calendar Badge */}
                                    <div className="absolute top-2 left-2 bg-white rounded-lg shadow-lg p-2 text-center min-w-[60px]">
                                        <div className="text-xs font-semibold text-blue-600 uppercase">{new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}</div>
                                        <div className="text-2xl font-bold text-gray-800">{new Date(event.date).getDate()}</div>
                                    </div>
                                </div>
                            )}
                            <h3 className=" mb-2 text-center text-xl font-bold">{event.title || event.name}</h3>
                            <p className="text-gray-700 mb-2 pb-2 border-b border-gray-200">{event.description || event.details}</p>

                            <div className='grid grid-cols-2'>
                            <p className="text-gray-600 mb-2 ">Category: {event.category || event.type}</p>
                            <p className="text-gray-600 flex items-center gap-2">
                                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                </svg>
                                {event.location}
                            </p>
                          
                            <p className={`flex items-center gap-2 ${
                                new Date(event.date) < new Date() ? 'text-red-600' : 'text-gray-600'
                            }`}>
                                <svg className={`w-5 h-5 ${
                                    new Date(event.date) < new Date() ? 'text-red-500' : 'text-blue-500'
                                }`} fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                                </svg>
                                {new Date(event.date).toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                })} at {new Date(event.date).toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                                {new Date(event.date) < new Date() && (
                                    <span className="text-red-500 text-sm font-semibold">EXPIRED</span>
                                )}
                            </p>
                            
                             <p className="text-gray-600 flex items-center gap-2">
                                <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M4 18v3h3v-3h10v3h3v-3h1c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h1zm0-8h16v6H4v-6z"/>
                                </svg>
                                {event.totalSeats} Seats
                            </p>
                          

                            <p className="text-gray-600 flex items-center gap-2">
                                <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm2.7-2h8.6l.9-5.4-2.1 1.8L12 8l-3.1 2.4-2.1-1.8L7.7 14z"/>
                                </svg>
                                {event.vipSeats} VIP Seats
                            </p>

                            <p className="text-gray-600 flex items-center gap-2">
                                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V6H1v15h2v-3h18v3h2V10c0-1.66-1.34-3-3-3z"/>
                                </svg>
                                {event.regularSeats} Regular Seats
                            </p>

                                
                            
                            {user && user.role !== "admin" ? (
                                <>
                                    {event.vipSeats > 0 && (
                                        <button 
                                            className={`px-4 w-[200px] py-2 rounded flex items-center gap-2 ${
                                                new Date(event.date) < new Date() 
                                                    ? 'opacity-50 cursor-not-allowed' 
                                                    : ''
                                            }`}
                                            disabled={new Date(event.date) < new Date()}
                                            onClick={() => {
                                                if (new Date(event.date) >= new Date()) {
                                                    navigate('/payment', { 
                                                        state: { 
                                                            event, 
                                                            ticketType: 'VIP', 
                                                            price: event.viptickets 
                                                        }
                                                    })
                                                }
                                            }}>
                                            <div className={`inline-flex items-center gap-2 bg-gradient-to-r px-4 py-2 rounded-full shadow-lg font-bold ${
                                                new Date(event.date) < new Date() 
                                                    ? 'from-gray-300 to-gray-400 text-gray-600' 
                                                    : 'from-yellow-400 to-yellow-600 text-black'
                                            }`}>
                                                <i className="fa-solid fa-crown"></i>
                                                VIP Ticket ${event.vipTicketPrice}
                                            </div>
                                        </button>
                                    )}

                                    {event.regularSeats > 0 && (
                                        <button 
                                            className={`px-4 w-[200px] py-2 rounded flex items-center gap-2 ${
                                                new Date(event.date) < new Date() 
                                                    ? 'opacity-50 cursor-not-allowed' 
                                                    : ''
                                            }`}
                                            disabled={new Date(event.date) < new Date()}
                                            onClick={() => {
                                                if (new Date(event.date) >= new Date()) {
                                                    navigate('/payment', { 
                                                        state: { 
                                                            event, 
                                                            ticketType: 'Regular', 
                                                            price: event.regulartickets 
                                                        }
                                                    })
                                                }
                                            }}>
                                            <div className={`inline-flex items-center gap-2 bg-gradient-to-r px-4 py-2 rounded-full shadow-lg font-bold ${
                                                new Date(event.date) < new Date() 
                                                    ? 'from-gray-300 to-gray-400 text-gray-600' 
                                                    : 'from-blue-200 to-blue-600 text-black'
                                            }`}>
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h16v12zM6 10h2v4H6zm10 0h2v4h-2z"/>
                                                </svg>
                                                Regular: ${event.regularTicketPrice}
                                            </div>
                                        </button>
                                    )}

                                    {event.vipSeats === 0 && event.regularSeats === 0 && (
                                        <div className="col-span-2 text-center">
                                            <span className="bg-red-100 text-red-600 px-4 py-2 rounded-full font-medium">
                                                SOLD OUT
                                            </span>
                                        </div>
                                    )}
                                </>
                            ) : null}

                            {/* <button className="bg-gray-100 text-gray-700 px-2 w-[150px] py-2 rounded-full hover:bg-gray-200 flex items-center gap-2 border border-gray-300" 
                            onClick={() => navigate('/payment', { 
                                state: { 
                                    event, 
                                    ticketType: 'Regular', 
                                    price: event.regulartickets 
                                }
                             })}>
                                <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h16v12zM6 10h2v4H6zm10 0h2v4h-2z"/>
                                </svg>
                                Regular: ${event.regularTicketPrice}
                            </button> */}
                           

                            </div>

                            
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center text-gray-500">No events available</div>
            )}
            
            {totalPages > 1 && (
                <div className="flex justify-center mt-8 gap-2">
                    <button 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                    >
                        Previous
                    </button>
                    
                    {[...Array(totalPages)].map((_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => setCurrentPage(index + 1)}
                            className={`px-3 py-1 rounded ${
                                currentPage === index + 1 
                                    ? 'bg-blue-500 text-white' 
                                    : 'bg-gray-200'
                            }`}
                        >
                            {index + 1}
                        </button>
                    ))}
                    
                    <button 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
        
       
    )
}


export default Home;