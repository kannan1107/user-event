import { useEffect } from "react";
import { useFetchTicketQuery } from "../../features/ApplicationApi";

const Ticket = () => {
  const { data: tickets, isLoading, isError } = useFetchTicketQuery();

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

  return (
    <>
      <div className="shadow-2xs min-w-full divide-y divide-gray-200 bg-white">
        <h3 className="text-xl font-bold my-4">Your Booking Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tickets?.payments && tickets.payments.length > 0 ? (
  tickets.payments.map((ticket) => (
              <div key={ticket._id} className="bg-white p-4 rounded-lg shadow-md ">
                <h3 className="text-lg font-semibold text-center text-green-600 mb-4">{ticket.Title || ticket.name}</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 ">
               <p className="text-gray-600">Name: {ticket.name}</p>
              <p className="text-gray-600">Payment:{ticket.paymentMethod}</p>
              <p className="text-gray-600">Amount Paid: ${(ticket.totalAmount /100).toFixed(2)}</p>
              <p className="text-gray-600">Ticket Count: {ticket.ticketCount}</p>
              <p className="text-gray-600">Payment States: {ticket.status}</p>
                </div>


              
              </div>
            ))
          ) : (
            <p>No tickets found.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Ticket;
