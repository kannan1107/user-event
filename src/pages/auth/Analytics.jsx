import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useFetchAllTicketsQuery, useFetchTicketQuery, useFetchUserQuery, useFetchEventsQuery } from '../../features/ApplicationApi';
import Chart from '../../components/Chart';
import Loading from '../../components/Loading';

const COLORS = [
    'rgba(99,102,241,0.7)', 'rgba(16,185,129,0.7)', 'rgba(245,158,11,0.7)',
    'rgba(239,68,68,0.7)', 'rgba(59,130,246,0.7)', 'rgba(236,72,153,0.7)',
    'rgba(20,184,166,0.7)', 'rgba(251,146,60,0.7)', 'rgba(139,92,246,0.7)',
];
const BORDERS = COLORS.map(c => c.replace('0.7', '1'));

const StatCard = ({ label, value, color }) => (
    <div className={`bg-white rounded-xl shadow p-5 border-l-4 ${color}`}>
        <p className="text-sm text-gray-500 mb-1">{label}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
);

const ChartCard = ({ title, children }) => (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5">
        <h2 className="text-base font-semibold text-gray-700 mb-4">{title}</h2>
        {children}
    </div>
);

const EmptyState = () => (
    <div className="h-56 flex items-center justify-center text-gray-400 text-sm">No data available</div>
);

const baseOpts = (title) => ({
    responsive: true,
    plugins: { legend: { position: 'top' }, title: { display: false } },
    scales: { y: { beginAtZero: true } },
});

const Analytics = () => {
    const { user } = useSelector((state) => state.auth);
    const isAdmin = user?.role === 'admin';

    const { data: allTicketsData, isLoading: allTicketsLoading } = useFetchAllTicketsQuery(undefined, { skip: !isAdmin });
    const { data: myTicketsData, isLoading: myTicketsLoading } = useFetchTicketQuery(undefined, { skip: isAdmin });
    const { data: userData, isLoading: usersLoading } = useFetchUserQuery(undefined, { skip: !isAdmin });
    const { data: eventsData, isLoading: eventsLoading } = useFetchEventsQuery(undefined, { skip: !isAdmin });

    const tickets = isAdmin ? (allTicketsData?.payments || []) : (myTicketsData?.payments || []);
    const users = userData?.users || userData?.data || [];
    const events = eventsData?.events || eventsData?.data || eventsData || [];

    // ── Admin Summary Stats ────────────────────────────────────────
    const totalEvents = events.length;
    const totalTicketsSold = tickets.reduce((s, t) => s + (t.ticketCount || 0), 0);
    const totalBookings = tickets.length;
    const totalIncome = tickets.reduce((s, t) => s + (t.totalAmount || 0), 0) / 100;
    const uniqueOrganizers = [...new Set(events.map(e => e.organizer).filter(Boolean))];

    // ── Admin Chart 1: Events by Category ─────────────────────────
    const eventsByCategoryData = useMemo(() => {
        const map = {};
        events.forEach(e => { const c = e.category || 'Uncategorized'; map[c] = (map[c] || 0) + 1; });
        return {
            labels: Object.keys(map),
            datasets: [{ label: 'Events', data: Object.values(map), backgroundColor: COLORS, borderColor: BORDERS, borderWidth: 1 }]
        };
    }, [events]);

    // ── Admin Chart 2: Tickets Sold per Event ──────────────────────
    const ticketsPerEventData = useMemo(() => {
        const map = {};
        tickets.forEach(t => { const title = t.Title || 'Unknown'; map[title] = (map[title] || 0) + (t.ticketCount || 0); });
        return {
            labels: Object.keys(map),
            datasets: [{ label: 'Tickets Sold', data: Object.values(map), backgroundColor: COLORS, borderColor: BORDERS, borderWidth: 1 }]
        };
    }, [tickets]);

    // ── Admin Chart 3: Bookings Over Time ─────────────────────────
    const bookingsOverTimeData = useMemo(() => {
        const map = {};
        tickets.forEach(t => {
            const d = new Date(t.paymentDate || t.createdAt);
            if (isNaN(d)) return;
            const key = d.toLocaleString('default', { month: 'short', year: 'numeric' });
            map[key] = (map[key] || 0) + 1;
        });
        const sorted = Object.keys(map).sort((a, b) => new Date(a) - new Date(b));
        return {
            labels: sorted,
            datasets: [{ label: 'Bookings', data: sorted.map(k => map[k]), borderColor: 'rgba(99,102,241,1)', backgroundColor: 'rgba(99,102,241,0.15)', fill: true, tension: 0.4, pointRadius: 4 }]
        };
    }, [tickets]);

    // ── Admin Chart 4: Total Income per Event ─────────────────────
    const incomePerEventData = useMemo(() => {
        const map = {};
        tickets.forEach(t => { const title = t.Title || 'Unknown'; map[title] = (map[title] || 0) + (t.totalAmount || 0) / 100; });
        return {
            labels: Object.keys(map),
            datasets: [{ label: 'Income ($)', data: Object.values(map), backgroundColor: COLORS, borderColor: BORDERS, borderWidth: 1 }]
        };
    }, [tickets]);

    // ── Admin Chart 5: Revenue by Organizer ───────────────────────
    const revenueByOrganizerData = useMemo(() => {
        const map = {};
        tickets.forEach(t => { const org = t.eventId?.organizer || 'Unknown'; map[org] = (map[org] || 0) + (t.totalAmount || 0) / 100; });
        return {
            labels: Object.keys(map),
            datasets: [{ data: Object.values(map), backgroundColor: COLORS, borderColor: BORDERS, borderWidth: 2 }]
        };
    }, [tickets]);

    // ── User Chart 1: My Tickets per Event (Bar) ──────────────────
    const myTicketsPerEventData = useMemo(() => {
        const map = {};
        tickets.forEach(t => { const title = t.Title || 'Unknown'; map[title] = (map[title] || 0) + (t.ticketCount || 0); });
        return {
            labels: Object.keys(map),
            datasets: [{ label: 'My Tickets', data: Object.values(map), backgroundColor: COLORS, borderColor: BORDERS, borderWidth: 1 }]
        };
    }, [tickets]);

    // ── User Chart 2: My Spending Over Time (Line) ────────────────
    const mySpendingOverTimeData = useMemo(() => {
        const map = {};
        tickets.forEach(t => {
            const d = new Date(t.paymentDate || t.createdAt);
            if (isNaN(d)) return;
            const key = d.toLocaleString('default', { month: 'short', year: 'numeric' });
            map[key] = (map[key] || 0) + (t.totalAmount || 0) / 100;
        });
        const sorted = Object.keys(map).sort((a, b) => new Date(a) - new Date(b));
        return {
            labels: sorted,
            datasets: [{ label: 'Amount Spent ($)', data: sorted.map(k => map[k]), borderColor: 'rgba(16,185,129,1)', backgroundColor: 'rgba(16,185,129,0.15)', fill: true, tension: 0.4, pointRadius: 4 }]
        };
    }, [tickets]);

    // ── User Chart 3: My Ticket Type Breakdown (Doughnut) ─────────
    const myTicketTypeData = useMemo(() => {
        const map = {};
        tickets.forEach(t => { const type = t.ticketType || 'Unknown'; map[type] = (map[type] || 0) + (t.ticketCount || 0); });
        return {
            labels: Object.keys(map),
            datasets: [{ data: Object.values(map), backgroundColor: COLORS, borderColor: BORDERS, borderWidth: 2 }]
        };
    }, [tickets]);

    if (allTicketsLoading || myTicketsLoading || usersLoading || eventsLoading) return <Loading />;

    // ── User View ─────────────────────────────────────────────────
    if (!isAdmin) {
        const myTotalTickets = tickets.reduce((s, t) => s + (t.ticketCount || 0), 0);
        const myTotalSpent = tickets.reduce((s, t) => s + (t.totalAmount || 0), 0) / 100;
        const myTotalBookings = tickets.length;

        return (
            <div className="p-6 max-w-5xl mx-auto min-h-screen bg-gray-50">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">My Booking Analytics</h1>

                {/* User Summary Cards */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <StatCard label="My Bookings" value={myTotalBookings} color="border-indigo-500" />
                    <StatCard label="Total Tickets" value={myTotalTickets} color="border-emerald-500" />
                    <StatCard label="Total Spent" value={`$${myTotalSpent.toFixed(2)}`} color="border-amber-500" />
                </div>

                {/* User Charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <ChartCard title="My Tickets per Event">
                        {myTicketsPerEventData.labels.length > 0
                            ? <Chart type="bar" data={myTicketsPerEventData} options={{ ...baseOpts(), plugins: { legend: { display: false } } }} />
                            : <EmptyState />}
                    </ChartCard>

                    <ChartCard title="My Spending Over Time">
                        {mySpendingOverTimeData.labels.length > 0
                            ? <Chart type="line" data={mySpendingOverTimeData} options={{ ...baseOpts(), scales: { y: { beginAtZero: true, ticks: { callback: v => `$${v}` } } } }} />
                            : <EmptyState />}
                    </ChartCard>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ChartCard title="My Ticket Type Breakdown">
                        {myTicketTypeData.labels.length > 0
                            ? (
                                <div className="flex justify-center">
                                    <div style={{ maxWidth: 300, width: '100%' }}>
                                        <Chart type="doughnut" data={myTicketTypeData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
                                    </div>
                                </div>
                            )
                            : <EmptyState />}
                    </ChartCard>
                </div>
            </div>
        );
    }

    // ── Admin View ────────────────────────────────────────────────
    return (
        <div className="p-6 max-w-7xl mx-auto min-h-screen bg-gray-50">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Analytics Dashboard</h1>

            {/* Admin Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                <StatCard label="Total Events" value={totalEvents} color="border-indigo-500" />
                <StatCard label="Tickets Sold" value={totalTicketsSold} color="border-emerald-500" />
                <StatCard label="Total Bookings" value={totalBookings} color="border-amber-500" />
                <StatCard label="Total Income" value={`$${totalIncome.toFixed(2)}`} color="border-blue-500" />
                <StatCard label="Organizers" value={uniqueOrganizers.length} color="border-pink-500" />
            </div>

            {/* Admin Charts Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <ChartCard title="Events by Category">
                    {eventsByCategoryData.labels.length > 0
                        ? <Chart type="bar" data={eventsByCategoryData} options={baseOpts()} />
                        : <EmptyState />}
                </ChartCard>

                <ChartCard title="Tickets Sold per Event">
                    {ticketsPerEventData.labels.length > 0
                        ? <Chart type="bar" data={ticketsPerEventData} options={{ ...baseOpts(), indexAxis: 'y', plugins: { legend: { display: false } } }} />
                        : <EmptyState />}
                </ChartCard>
            </div>

            {/* Admin Charts Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <ChartCard title="Ticket Bookings Over Time">
                    {bookingsOverTimeData.labels.length > 0
                        ? <Chart type="line" data={bookingsOverTimeData} options={baseOpts()} />
                        : <EmptyState />}
                </ChartCard>

                <ChartCard title="Total Income per Event">
                    {incomePerEventData.labels.length > 0
                        ? <Chart type="bar" data={incomePerEventData} options={{ ...baseOpts(), plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { callback: v => `$${v}` } } } }} />
                        : <EmptyState />}
                </ChartCard>
            </div>

            {/* Admin Charts Row 3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ChartCard title="Revenue by Organizer">
                    {revenueByOrganizerData.labels.length > 0
                        ? (
                            <div className="flex justify-center">
                                <div style={{ maxWidth: 320, width: '100%' }}>
                                    <Chart type="doughnut" data={revenueByOrganizerData} options={{ responsive: true, plugins: { legend: { position: 'bottom' }, tooltip: { callbacks: { label: ctx => ` $${ctx.parsed.toFixed(2)}` } } } }} />
                                </div>
                            </div>
                        )
                        : <EmptyState />}
                </ChartCard>

                <ChartCard title="User Role Distribution">
                    {users.length > 0 ? (() => {
                        const map = {};
                        users.forEach(u => { const r = u.role || 'user'; map[r] = (map[r] || 0) + 1; });
                        const data = {
                            labels: Object.keys(map).map(r => r.charAt(0).toUpperCase() + r.slice(1)),
                            datasets: [{ data: Object.values(map), backgroundColor: COLORS, borderColor: BORDERS, borderWidth: 2 }]
                        };
                        return (
                            <div className="flex justify-center">
                                <div style={{ maxWidth: 320, width: '100%' }}>
                                    <Chart type="pie" data={data} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
                                </div>
                            </div>
                        );
                    })() : <EmptyState />}
                </ChartCard>
            </div>
        </div>
    );
};

export default Analytics;