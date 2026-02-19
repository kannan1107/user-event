import { useEffect } from "react";
import { useFetchTicketQuery, useFetchAllTicketsQuery, useCancelTicketMutation } from "../../features/ApplicationApi";
import { useSelector } from "react-redux";

const Ticket = () => {
  const user = useSelector((state) => state.auth.user);
  const isAdmin = user?.role === 'admin';
  
  const { data: userTickets, isLoading: userLoading, isError: userError } = useFetchTicketQuery(undefined, { skip: isAdmin });
  const { data: allTickets, isLoading: adminLoading, isError: adminError } = useFetchAllTicketsQuery(undefined, { skip: !isAdmin });
  const [cancelTicket] = useCancelTicketMutation();
  
  const tickets = isAdmin ? allTickets : userTickets;
  const isLoading = isAdmin ? adminLoading : userLoading;
  const isError = isAdmin ? adminError : userError;

  useEffect(() => {
    console.log("Fetched tickets:", tickets);
    console.log("Is loading:", isLoading);
    if (tickets?.payments) {
      console.log("Payments array:", tickets.payments);
      console.log("First payment:", tickets.payments[0]);
    }
  }, [tickets]);

  if (isLoading) return <p>Loading tickets...</p>;
  if (isError) return <p>Failed to load tickets.</p>;

  const payments = tickets?.payments || [];
  
  const handleCancel = async (ticket) => {
    const eventTitle = ticket.Title || 'Unknown Event';
    const currentTicketCount = Number(ticket.ticketCount);
    let cancelCount = currentTicketCount;

    if (currentTicketCount > 1) {
      const input = window.prompt(`You have ${currentTicketCount} tickets. How many do you want to cancel?`, currentTicketCount);
      if (input === null) return;
      cancelCount = Number(input);
      if (!cancelCount || cancelCount < 1 || cancelCount > currentTicketCount) return alert('Invalid quantity');
    } else if (!window.confirm(`Cancel booking for "${eventTitle}"?`)) return;

    try {
      // Pass as query string to avoid [object Object] error
      await cancelTicket(`${ticket._id}?cancelCount=${cancelCount}`).unwrap();
      alert('Ticket cancelled successfully!');
    } catch (error) {
      alert('Failed to cancel ticket.');
    }
  };
  
  // Group tickets by event for admin
  const groupedByEvent = payments.reduce((acc, ticket) => {
    const eventTitle = ticket.Title || 'Unknown Event';
    if (!acc[eventTitle]) acc[eventTitle] = [];
    acc[eventTitle].push(ticket);
    return acc;
  }, {});

  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold mb-6">{user?.role === 'admin' ? 'All Bookings' : 'Your Booking Details'}</h3>
      
      {user?.role === 'admin' ? (
        // Admin view: grouped by event
        Object.keys(groupedByEvent).length > 0 ? (
          Object.entries(groupedByEvent).map(([eventTitle, eventTickets]) => (
            <div key={eventTitle} className="mb-8">
              <h4 className="text-xl font-semibold bg-blue-100 p-3 rounded mb-4">
                {eventTitle} ({eventTickets.length} bookings)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {eventTickets.map((ticket) => (
                  <div key={ticket._id} className="bg-white p-4 rounded-lg shadow border">
                    <p className="font-semibold text-blue-600 mb-2">Customer: {ticket.name}</p>
                    <p className="text-gray-600">Email: {ticket.email || ticket.userId?.email || 'N/A'}</p>
                    <p className="text-gray-600">Payment: {ticket.paymentMethod}</p>
                    <p className="text-gray-600">Amount: ${(ticket.totalAmount / 100).toFixed(2)}</p>
                    <p className="text-gray-600">Tickets: {ticket.ticketCount}</p>
                    <p className="text-gray-600">Ticket Type: {ticket.ticketType || 'N/A'}</p>
                    <p className="text-gray-600">Status: <span className="font-semibold text-green-600">{ticket.status}</span></p>
                    {ticket.eventId && (
                      <div className="mt-2 pt-2 border-t">
                        <p className="text-sm text-gray-500">Event Date: {ticket.eventId.date ? new Date(ticket.eventId.date).toLocaleDateString() : 'N/A'}</p>
                        <p className="text-sm text-gray-500">Location: {ticket.eventId.location || 'N/A'}</p>
                      </div>
                    )}
                    <button 
                      onClick={() => handleCancel(ticket)}
                      className="mt-2 w-full bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Cancel
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p>No bookings found.</p>
        )
      ) : (
        // User view: their tickets only
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {payments.length > 0 ? (
            payments.map((ticket) => (
              <div key={ticket._id} className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-center text-green-600 mb-4">{ticket.Title || ticket.name}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <p className="text-gray-600">Name: {ticket.name}</p>
                  <p className="text-gray-600">Payment: {ticket.paymentMethod}</p>
                  <p className="text-gray-600">Amount Paid: ${(ticket.totalAmount / 100).toFixed(2)}</p>
                  <p className="text-gray-600">Ticket Count: {ticket.ticketCount}</p>
                  <p className="text-gray-600">Payment Status: {ticket.status}</p>
                </div>
                <button 
                  onClick={() => handleCancel(ticket)}
                  className="mt-4 w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Cancel Booking
                </button>
              </div>
            ))
          ) : (
            <p>No tickets found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Ticket;
