import { useSelector } from 'react-redux';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { useFetchEventsQuery, useDeleteEventMutation } from "../../features/ApplicationApi";
import Loading from '../../components/Loading';
import EventFilter from '../../components/EventFilter';
import { useNavigate } from 'react-router-dom';
import { Roles } from "../../constants/Roles";

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

    const now = new Date();
    const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const upcomingEvents = eventList
        .filter(e => new Date(e.date) > in30Days)
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    const [slideIndex, setSlideIndex] = useState(0);
    const [visible, setVisible] = useState(true);
    const slideTimer = useRef(null);

    useEffect(() => {
        if (upcomingEvents.length <= 1) return;
        slideTimer.current = setInterval(() => {
            setVisible(false);
            setTimeout(() => {
                setSlideIndex(prev => (prev + 1) % upcomingEvents.length);
                setVisible(true);
            }, 400);
        }, 4000);
        return () => clearInterval(slideTimer.current);
    }, [upcomingEvents.length]);

    const getDaysLeft = (date) => Math.ceil((new Date(date) - now) / (1000 * 60 * 60 * 24));

    const sortEvents = (evts) => [...evts].sort((a, b) => {
        const dA = new Date(a.date), dB = new Date(b.date);
        const aF = dA >= now, bF = dB >= now;
        if (aF && !bF) return -1;
        if (!aF && bF) return 1;
        return dA - dB;
    });

    const eventsToShow = filteredEvents.length > 0 ? filteredEvents : eventList;
    const sortedEvents = sortEvents(eventsToShow);
    const totalPages = Math.ceil(sortedEvents.length / eventsPerPage);
    const startIndex = (currentPage - 1) * eventsPerPage;
    const currentEvents = sortedEvents.slice(startIndex, startIndex + eventsPerPage);

    const handleDelete = (event) => {
        if (window.confirm(`Are you sure you want to delete "${event.title}"?`)) {
            deleteEventMutation(event._id || event.id)
                .unwrap()
                .then(() => toast.success('Event deleted successfully!'))
                .catch(() => toast.error('Failed to delete event.'));
        }
    };

    const imgSrc = (img) => img?.startsWith('http') ? img : `${imageBaseUrl}${img}`;

    if (isLoading) return <Loading />;
    if (error) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-red-400 gap-3">
            <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-xl font-bold">Connection Error</h2>
            <p className="text-slate-400 text-sm">{error.status === 'FETCH_ERROR' ? 'Cannot connect to the server.' : `Error: ${error.status}`}</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-950">
            {/* Hero Banner */}
            <div className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border-b border-white/5">
                <div className="absolute inset-0 opacity-20"
                    style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #6366f1 0%, transparent 50%), radial-gradient(circle at 80% 20%, #8b5cf6 0%, transparent 40%)' }} />
                <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center">
                    <span className="inline-block text-xs font-semibold tracking-widest uppercase text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1 mb-4">
                        Live Events Platform
                    </span>
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3 tracking-tight">
                        Discover &amp; Book <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Events</span>
                    </h1>
                    <p className="text-slate-400 text-lg max-w-xl mx-auto">
                        Browse upcoming concerts, conferences, and experiences. Secure your seat in seconds.
                    </p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                {/* Upcoming Events Slider */}
                {upcomingEvents.length > 0 && (
                    <div className="rounded-2xl overflow-hidden border border-indigo-500/20 shadow-2xl shadow-indigo-950/50">
                        <div className="flex items-center gap-3 px-5 py-2.5 bg-indigo-600/20 border-b border-indigo-500/20">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-white text-xs font-semibold tracking-widest uppercase">Upcoming — 30+ Days Away</span>
                            <span className="ml-auto text-slate-400 text-xs">{slideIndex + 1} / {upcomingEvents.length}</span>
                        </div>
                        <div
                            className="flex items-center gap-5 px-6 py-5 bg-slate-900 cursor-pointer hover:bg-slate-800/70 transition-colors"
                            style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.4s ease' }}
                            onClick={() => navigate('/eventDetails', { state: { event: upcomingEvents[slideIndex] } })}
                        >
                            {upcomingEvents[slideIndex]?.image && (
                                <img
                                    src={imgSrc(upcomingEvents[slideIndex].image)}
                                    alt={upcomingEvents[slideIndex].title}
                                    className="w-20 h-20 rounded-xl object-cover flex-shrink-0 ring-2 ring-indigo-500/30"
                                />
                            )}
                            <div className="flex-1 min-w-0">
                                <h3 className="text-white text-lg font-bold truncate">{upcomingEvents[slideIndex]?.title}</h3>
                                <p className="text-slate-400 text-sm truncate mt-0.5">
                                    {upcomingEvents[slideIndex]?.location} &bull; {upcomingEvents[slideIndex]?.category}
                                </p>
                                <p className="text-slate-500 text-sm mt-1">
                                    {new Date(upcomingEvents[slideIndex]?.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                </p>
                            </div>
                            <div className="flex-shrink-0 text-center bg-indigo-500/10 border border-indigo-500/20 rounded-xl px-5 py-3">
                                <div className="text-3xl font-extrabold text-indigo-300">{getDaysLeft(upcomingEvents[slideIndex]?.date)}</div>
                                <div className="text-slate-400 text-xs font-semibold uppercase tracking-wide mt-0.5">Days Left</div>
                            </div>
                        </div>
                        {upcomingEvents.length > 1 && (
                            <div className="flex justify-center gap-2 py-3 bg-slate-900 border-t border-white/5">
                                {upcomingEvents.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => { setVisible(false); setTimeout(() => { setSlideIndex(i); setVisible(true); }, 400); }}
                                        className={`h-1.5 rounded-full transition-all duration-300 ${i === slideIndex ? 'w-6 bg-indigo-400' : 'w-1.5 bg-slate-600 hover:bg-slate-400'}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Filter + Create Button */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                        <EventFilter events={eventList} onFilterChange={setFilteredEvents} />
                    </div>
                    {(user?.role === Roles.ADMIN || user?.role === Roles.ORGANIZER) && (
                        <button
                            onClick={() => navigate('/createEvent')}
                            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors shadow-lg shadow-indigo-900/40 flex-shrink-0"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                            Create Event
                        </button>
                    )}
                </div>

                {/* Events Grid */}
                {currentEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {currentEvents.map((event) => {
                            const isPast = new Date(event.date) < now;
                            return (
                                <div
                                    key={event._id || event.id}
                                    className="group relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-950/50 transition-all duration-300 cursor-pointer flex flex-col"
                                    onClick={() => navigate('/eventDetails', { state: { event } })}
                                >
                                    {/* Admin Menu */}
                                    {user?.role === Roles.ADMIN && (
                                        <div className="absolute top-3 right-3 z-10" onClick={(e) => e.stopPropagation()}>
                                            <div className="relative group/menu">
                                                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-black/40 hover:bg-black/70 transition-colors backdrop-blur-sm">
                                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                                                    </svg>
                                                </button>
                                                <div className="absolute right-0 top-9 w-36 bg-slate-800 border border-slate-700 rounded-xl shadow-xl hidden group-hover/menu:block overflow-hidden">
                                                    <button
                                                        className="flex items-center gap-2 px-4 py-2.5 hover:bg-slate-700 w-full text-left text-sm text-slate-200 transition-colors"
                                                        onClick={() => navigate('/updateEvent', { state: { event } })}
                                                    >
                                                        <svg className="w-4 h-4 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                                                        </svg>
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="flex items-center gap-2 px-4 py-2.5 hover:bg-red-500/10 w-full text-left text-sm text-red-400 transition-colors"
                                                        onClick={() => handleDelete(event)}
                                                    >
                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                                                        </svg>
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Image */}
                                    {event.image && (
                                        <div className="relative">
                                            <img
                                                src={imgSrc(event.image)}
                                                alt={event.title}
                                                className="w-full h-44 object-cover"
                                                onError={(e) => { e.target.style.display = 'none'; }}
                                            />
                                            {/* Date badge */}
                                            <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-sm rounded-lg px-3 py-1.5 text-center min-w-[52px] border border-white/10">
                                                <div className="text-indigo-400 text-xs font-bold uppercase leading-none">
                                                    {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                                                </div>
                                                <div className="text-white text-xl font-extrabold leading-tight">
                                                    {new Date(event.date).getDate()}
                                                </div>
                                            </div>
                                            {isPast && (
                                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                    <span className="bg-red-500/90 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">Expired</span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div className="p-5 flex flex-col flex-1 gap-3">
                                        {/* Title + Category */}
                                        <div>
                                            <div className="flex items-start justify-between gap-2 mb-1">
                                                <h3 className="text-white font-bold text-base leading-snug line-clamp-2 flex-1">{event.title || event.name}</h3>
                                                {event.category && (
                                                    <span className="text-xs text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-2 py-0.5 whitespace-nowrap flex-shrink-0">
                                                        {event.category}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-slate-500 text-sm line-clamp-2">{event.description || event.details}</p>
                                        </div>

                                        {/* Meta info */}
                                        <div className="space-y-1.5 text-sm text-slate-400">
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                                </svg>
                                                <span className="truncate">{event.location}</span>
                                            </div>
                                            <div className={`flex items-center gap-2 ${isPast ? 'text-red-400' : ''}`}>
                                                <svg className={`w-4 h-4 flex-shrink-0 ${isPast ? 'text-red-400' : 'text-indigo-400'}`} fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                                                </svg>
                                                <span>
                                                    {new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                                                    {' at '}
                                                    {new Date(event.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Seat counts */}
                                        <div className="flex items-center gap-3 text-xs text-slate-500 border-t border-slate-800 pt-3">
                                            <span className="flex items-center gap-1">
                                                <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5z" />
                                                </svg>
                                                {event.vipSeats} VIP
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <svg className="w-3.5 h-3.5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V6H1v15h2v-3h18v3h2V10c0-1.66-1.34-3-3-3z" />
                                                </svg>
                                                {event.regularSeats} Regular
                                            </span>
                                            <span className="ml-auto flex items-center gap-1">
                                                <svg className="w-3.5 h-3.5 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M4 18v3h3v-3h10v3h3v-3h1c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h1zm0-8h16v6H4v-6z" />
                                                </svg>
                                                {event.totalSeats} Total
                                            </span>
                                        </div>

                                        {/* Ticket Buttons */}
                                        {user && user.role !== Roles.ADMIN && (
                                            <div className="flex flex-wrap gap-2 mt-auto" onClick={(e) => e.stopPropagation()}>
                                                {event.vipSeats > 0 && (
                                                    <button
                                                        disabled={isPast}
                                                        onClick={() => !isPast && navigate('/payment', { state: { event, ticketType: 'VIP', price: event.viptickets } })}
                                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${isPast ? 'bg-slate-800 text-slate-600 cursor-not-allowed' : 'bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500 hover:text-black'}`}
                                                    >
                                                        <i className="fa-solid fa-crown text-xs" />
                                                        VIP ${event.vipTicketPrice}
                                                    </button>
                                                )}
                                                {event.regularSeats > 0 && (
                                                    <button
                                                        disabled={isPast}
                                                        onClick={() => !isPast && navigate('/payment', { state: { event, ticketType: 'Regular', price: event.regulartickets } })}
                                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${isPast ? 'bg-slate-800 text-slate-600 cursor-not-allowed' : 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500 hover:text-white'}`}
                                                    >
                                                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h16v12z" />
                                                        </svg>
                                                        Regular ${event.regularTicketPrice}
                                                    </button>
                                                )}
                                                {event.vipSeats === 0 && event.regularSeats === 0 && (
                                                    <span className="text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-1.5">
                                                        Sold Out
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-20 text-slate-500">
                        <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p>No events available</p>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 pt-4">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 text-sm bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors border border-slate-700"
                        >
                            Previous
                        </button>
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`w-9 h-9 text-sm rounded-lg font-medium transition-colors border ${currentPage === i + 1 ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'}`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 text-sm bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors border border-slate-700"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
