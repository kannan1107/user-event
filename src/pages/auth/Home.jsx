import { useDispatch } from 'react-redux';
import { useFetchEventsQuery } from "../../features/ApplicationApi";
import Loading from '../../components/Loading';





const Home = () => {
    const { data: events, isLoading, error } = useFetchEventsQuery()
    console.log('API Response:', { events, isLoading, error });


   

    if (isLoading) return <Loading />
    if (error) return <div>Error: {error.status}</div>

     const eventList = events?.data || []; // Safely access .data, default to empty array

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Events</h1>
            {eventList.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {eventList.map((event) => (
                        <div key={event._id || event.id} className="border border-gray-300 rounded-lg p-4 shadow ">
                            <h3 className="text-xl font-semibold mb-2 text-center">{event.title || event.name}</h3>
                            <div className='grid grid-cols-2'>

                            <p className="text-gray-600 mb-2">{event.category || event.type}</p>
                            <p className="text-gray-700 mb-2">{event.description || event.details}</p>
                            <p className="text-gray-600 flex items-center gap-2">
                                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                </svg>
                                {event.location}
                            </p>
                            <p className="text-gray-600">{event.image}</p>
                            <p className="text-gray-600 flex items-center gap-2">
                                <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                                </svg>
                                {event.date}
                            </p>
                             <p className="text-gray-600">{event.totalSeats}</p>
                            <p className="text-gray-600 flex items-center gap-2">
                                <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm2.7-2h8.6l.9-5.4-2.1 1.4L12 8l-3.1 2L6.8 8.6L7.7 14z"/>
                                </svg>
                                VIP: {event.viptickets}
                            </p>
                            <p className="text-gray-600 flex items-center gap-2">
                                <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M22 10V6a2 2 0 00-2-2H4a2 2 0 00-2 2v4c1.1 0 2 .9 2 2s-.9 2-2 2v4a2 2 0 002 2h16a2 2 0 002-2v-4c-1.1 0-2-.9-2-2s.9-2 2-2zm-2-2v1.54c-1.19.69-2 1.99-2 3.46s.81 2.77 2 3.46V18H4v-1.54c1.19-.69 2-1.99 2-3.46S5.19 10.23 4 9.54V8h16z"/>
                                </svg>
                                 {event.regulartickets}
                            </p>
                           

                            </div>

                            
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center text-gray-500">No events available</div>
            )}
        </div>
        
       
    )
}


export default Home;