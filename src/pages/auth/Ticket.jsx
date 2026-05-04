import { useEffect, useState } from "react";
import { useFetchTicketQuery, useFetchAllTicketsQuery, useCancelTicketMutation } from "../../features/ApplicationApi";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const statusColor = (status) => {
  if (status === 'completed') return 'bg-green-100 text-green-700';
  if (status === 'pending') return 'bg-yellow-100 text-yellow-700';
  if (status === 'cancelled') return 'bg-red-100 text-red-700';
  return 'bg-gray-100 text-gray-600';
};

const typeColor = (type) => {
  if ((type || '').toLowerCase() === 'vip') return 'bg-yellow-400 text-black';
  return 'bg-blue-100 text-blue-700';
};

const Ticket = () => {
  const user = useSelector((state) => state.auth.user);
  const isAdmin = user?.role === 'admin';

  const { data: userTickets, isLoading: userLoading, isError: userError } = useFetchTicketQuery(undefined, { skip: isAdmin });
  const { data: allTickets, isLoading: adminLoading, isError: adminError } = useFetchAllTicketsQuery(undefined, { skip: !isAdmin });
  const [cancelTicket] = useCancelTicketMutation();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  const tickets = isAdmin ? allTickets : userTickets;
  const isLoading = isAdmin ? adminLoading : userLoading;
  const isError = isAdmin ? adminError : userError;

  useEffect(() => {
    if (tickets?.payments) {
      console.log("Payments array:", tickets.payments);
    }
  }, [tickets]);

  if (isLoading) return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-indigo-600 font-medium">Loading tickets...</p>
      </div>
    </div>
  );

  if (isError) return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
      <p className="text-red-500 font-medium">Failed to load tickets.</p>
    </div>
  );

  const payments = tickets?.payments || [];

  const handleCancel = (ticket) => {
    const eventTitle = ticket.Title || 'Unknown Event';
    const currentTicketCount = Number(ticket.ticketCount);
    const ticketId = ticket._id || ticket.id;

    if (!ticketId) { toast.error('Ticket information is incomplete.'); return; }

    if (currentTicketCount > 1) {
      // Ask quantity via toast with input
      let inputValue = String(currentTicketCount);
      toast(
        ({ closeToast }) => (
          <div>
            <p className="font-medium mb-2">You have {currentTicketCount} tickets.<br/>How many do you want to cancel?</p>
            <input
              type="number"
              defaultValue={currentTicketCount}
              min={1}
              max={currentTicketCount}
              onChange={(e) => { inputValue = e.target.value; }}
              className="border rounded px-2 py-1 w-full mb-3 text-sm"
            />
            <div className="flex gap-2">
              <button
                className="flex-1 bg-red-500 text-white rounded py-1 text-sm font-medium hover:bg-red-600"
                onClick={async () => {
                  closeToast();
                  const cancelCount = Number(inputValue);
                  if (!cancelCount || cancelCount < 1 || cancelCount > currentTicketCount) {
                    toast.error('Invalid quantity'); return;
                  }
                  try {
                    await cancelTicket({ id: ticketId, cancelCount }).unwrap();
                    const remaining = currentTicketCount - cancelCount;
                    remaining > 0
                      ? toast.success(`${cancelCount} ticket(s) cancelled. ${remaining} remaining.`)
                      : toast.success('Booking cancelled successfully!');
                  } catch {
                    toast.error('Failed to cancel ticket.');
                  }
                }}
              >Confirm</button>
              <button className="flex-1 bg-gray-200 rounded py-1 text-sm" onClick={closeToast}>Back</button>
            </div>
          </div>
        ),
        { autoClose: false, closeOnClick: false, draggable: false }
      );
    } else {
      toast(
        ({ closeToast }) => (
          <div>
            <p className="font-medium mb-3">Cancel booking for <strong>"{eventTitle}"</strong>?</p>
            <div className="flex gap-2">
              <button
                className="flex-1 bg-red-500 text-white rounded py-1 text-sm font-medium hover:bg-red-600"
                onClick={async () => {
                  closeToast();
                  try {
                    await cancelTicket({ id: ticketId, cancelCount: 1 }).unwrap();
                    toast.success('Booking cancelled successfully!');
                  } catch {
                    toast.error('Failed to cancel ticket.');
                  }
                }}
              >Yes, Cancel</button>
              <button className="flex-1 bg-gray-200 rounded py-1 text-sm" onClick={closeToast}>Keep</button>
            </div>
          </div>
        ),
        { autoClose: false, closeOnClick: false, draggable: false }
      );
    }
  };

  const filteredPayments = payments.filter((ticket) => {
    const matchSearch =
      (ticket.Title || '').toLowerCase().includes(search.toLowerCase()) ||
      (ticket.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (ticket.email || '').toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'All' || (ticket.ticketType || '').toLowerCase() === filterType.toLowerCase();
    const matchStatus = filterStatus === 'All' || ticket.status === filterStatus;
    return matchSearch && matchType && matchStatus;
  });

  const groupedByEvent = filteredPayments.reduce((acc, ticket) => {
    const eventTitle = ticket.Title || 'Unknown Event';
    if (!acc[eventTitle]) acc[eventTitle] = [];
    acc[eventTitle].push(ticket);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 px-6 py-10 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-1">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 12c0-1.1.9-2 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v4c1.1 0 2 .9 2 2s-.9 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2zm-2 3.5H6v-3h12v3zm0-6.5H6v-3h12v3z"/>
            </svg>
            <h1 className="text-3xl font-bold">{isAdmin ? 'All Bookings' : 'My Tickets'}</h1>
          </div>
          <p className="text-white/70 ml-11">
            {isAdmin ? 'Manage and view all customer bookings' : 'View and manage your event bookings'}
          </p>
          <div className="mt-4 ml-11 flex gap-6 text-sm">
            <span className="bg-white/20 rounded-full px-4 py-1">
              Total: <strong>{payments.length}</strong>
            </span>
            <span className="bg-white/20 rounded-full px-4 py-1">
              Showing: <strong>{filteredPayments.length}</strong>
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl shadow-md p-4 mb-8 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
            <input
              type="text"
              placeholder={isAdmin ? 'Search by event, customer or email...' : 'Search by event name...'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            <option value="All">All Types</option>
            <option value="VIP">VIP</option>
            <option value="Regular">Regular</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            <option value="All">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
          {(search || filterType !== 'All' || filterStatus !== 'All') && (
            <button
              onClick={() => { setSearch(''); setFilterType('All'); setFilterStatus('All'); }}
              className="px-3 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 text-sm font-medium"
            >
              ✕ Clear
            </button>
          )}
        </div>

        {isAdmin ? (
          Object.keys(groupedByEvent).length > 0 ? (
            Object.entries(groupedByEvent).map(([eventTitle, eventTickets]) => (
              <div key={eventTitle} className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-1 w-1 rounded-full bg-indigo-500"></div>
                  <h4 className="text-lg font-bold text-indigo-700">{eventTitle}</h4>
                  <span className="bg-indigo-100 text-indigo-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                    {eventTickets.length} bookings
                  </span>
                  <div className="flex-1 h-px bg-indigo-100"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {eventTickets.map((ticket) => (
                    <TicketCard key={ticket._id} ticket={ticket} onCancel={handleCancel} />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <EmptyState />
          )
        ) : (
          filteredPayments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {filteredPayments.map((ticket) => (
                <TicketCard key={ticket._id} ticket={ticket} onCancel={handleCancel} />
              ))}
            </div>
          ) : (
            <EmptyState />
          )
        )}
      </div>
    </div>
  );
};

const TicketCard = ({ ticket, onCancel }) => (
  <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
    {/* Ticket top color bar */}
    <div className={`h-2 w-full ${(ticket.ticketType || '').toLowerCase() === 'vip' ? 'bg-gradient-to-r from-yellow-400 to-orange-400' : 'bg-gradient-to-r from-indigo-400 to-purple-500'}`}></div>

    <div className="p-4">
      {/* Event title + badges */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-bold text-gray-800 text-base leading-tight flex-1 pr-2">{ticket.Title || ticket.name}</h3>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${typeColor(ticket.ticketType)}`}>
          {(ticket.ticketType || 'N/A').toUpperCase()}
        </span>
      </div>

      {/* Dashed divider (torn ticket effect) */}
      <div className="border-t-2 border-dashed border-gray-200 my-3 relative">
        <div className="absolute -left-5 -top-2.5 w-5 h-5 bg-indigo-50 rounded-full border border-gray-100"></div>
        <div className="absolute -right-5 -top-2.5 w-5 h-5 bg-indigo-50 rounded-full border border-gray-100"></div>
      </div>

      {/* Details */}
      <div className="space-y-1.5 text-sm text-gray-600">
        <div className="flex justify-between">
          <span className="text-gray-400">Customer</span>
          <span className="font-medium text-gray-700">{ticket.name}</span>
        </div>
        {ticket.email && (
          <div className="flex justify-between">
            <span className="text-gray-400">Email</span>
            <span className="font-medium text-gray-700 truncate max-w-[150px]">{ticket.email || ticket.userId?.email}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-gray-400">Tickets</span>
          <span className="font-medium text-gray-700">{ticket.ticketCount}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Amount</span>
          <span className="font-bold text-indigo-600">${(ticket.totalAmount / 100).toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Payment</span>
          <span className="font-medium text-gray-700">{ticket.paymentMethod}</span>
        </div>
        {ticket.eventId && (
          <>
            {ticket.eventId.date && (
              <div className="flex justify-between">
                <span className="text-gray-400">Event Date</span>
                <span className="font-medium text-gray-700">{new Date(ticket.eventId.date).toLocaleDateString()}</span>
              </div>
            )}
            {ticket.eventId.location && (
              <div className="flex justify-between">
                <span className="text-gray-400">Location</span>
                <span className="font-medium text-gray-700">{ticket.eventId.location}</span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Status + Cancel */}
      <div className="mt-4 flex items-center justify-between">
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColor(ticket.status)}`}>
          {(ticket.status || 'N/A').toUpperCase()}
        </span>
        <button
          onClick={() => onCancel(ticket)}
          className="text-sm bg-red-50 text-red-500 border border-red-200 px-3 py-1 rounded-lg hover:bg-red-500 hover:text-white transition-colors font-medium"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
);

const EmptyState = () => (
  <div className="text-center py-20">
    <svg className="w-16 h-16 text-indigo-200 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20 12c0-1.1.9-2 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v4c1.1 0 2 .9 2 2s-.9 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2z"/>
    </svg>
    <p className="text-gray-400 text-lg font-medium">No tickets found</p>
    <p className="text-gray-300 text-sm mt-1">Try adjusting your search or filters</p>
  </div>
);

export default Ticket;
