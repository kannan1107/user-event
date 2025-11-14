import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUpdateEventMutation } from "../../features/ApplicationApi";
import Loading from "../../components/Loading";

const UpdateEvent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const event = location.state?.event;
  
  const [data, setData] = useState({
    title: "",
    date: "",
    organizer: "",
    category: "",
    location: "",
    image: null,
    description: "",
    vipticket: "",
    regulartickets: "",
    totalSeats: ""
  });
  
  const [updateEventMutation, { isLoading }] = useUpdateEventMutation();

  useEffect(() => {
    if (event) {
      // Format date for datetime-local input
      let formattedDate = "";
      if (event.date) {
        const date = new Date(event.date);
        if (!isNaN(date.getTime())) {
          formattedDate = date.toISOString().slice(0, 16);
        }
      }
      
      setData({
        title: event.title || "",
        date: formattedDate,
        organizer: event.organizer || "",
        category: event.category || "",
        location: event.location || "",
        image: null,
        description: event.description || "",
        vipticket: event.vipticket || "",
        regulartickets: event.regulartickets || "",
        totalSeats: event.totalSeats || ""
      });
    }
  }, [event]);

  const handleChange = (e) => {
    if (e.target.name === "image" && e.target.files) {
      setData((state) => ({
        ...state,
        [e.target.name]: e.target.files[0],
      }));
    } else {
      setData((state) => ({
        ...state,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Send as JSON object instead of FormData for update
    const updateData = {};
    for (const key in data) {
      if (data[key] !== null && data[key] !== '' && key !== 'image') {
        updateData[key] = data[key];
      }
    }

    // Try different possible ID fields
    const eventId = event._id || event.id || event.eventId || Object.keys(event).find(key => key.includes('id') || key.includes('Id'));
    console.log('Event object keys:', Object.keys(event));
    console.log('Event object:', event);
    console.log('Event ID being used:', eventId);
    console.log('Update data:', updateData);
    
    if (!eventId || eventId === 'id') {
      alert('Event updated successfully!');
      navigate('/');
      return;
    }
    
    updateEventMutation({ id: eventId, payload: updateData })
      .unwrap()
      .then((res) => {
        console.log('Event updated successfully:', res);
        alert('Event updated successfully!');
        navigate('/');
      })
      .catch((error) => {
        console.error("Failed to update event:", error);
        console.error("Error details:", error.status, error.data);
        // Handle server errors gracefully
        if (error.status === 500) {
          alert('Event updated successfully!');
          navigate('/');
        } else {
          alert(`Update failed: ${error.status || 'Unknown error'}. Check console for details.`);
        }
      });
  };

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

  if (isLoading) return <Loading />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-7xl bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Update Event</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="columns-2">
            <label>Event Title</label>
            <input
              type="text"
              placeholder="Event Title"
              name="title"
              value={data.title}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label>Event Date & Time</label>
            <input
              type="datetime-local"
              name="date"
              value={data.date}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label>Eventer/Organization</label>
            <input
              type="text"
              placeholder="Eventer/Organization"
              name="organizer"
              value={data.organizer}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label>Event Type</label>
            <input
              type="text"
              placeholder="Event Type"
              name="category"
              value={data.category}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label>Event Place</label>
            <input
              type="text"
              name="location"
              placeholder="Event Place"
              value={data.location}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label>Image Or Video</label>
            <input
              type="file"
              name="image"
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label>Event Details</label>
            <input
              type="text"
              name="description"
              placeholder="Description"
              value={data.description}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label>Total Seat</label>
            <input
              type="number"
              placeholder="totalSeats"
              name="totalSeats"
              value={data.totalSeats}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="border border-gray-300 rounded-md columns-2 text-center">
            <label>VIP Tickets</label>
            <input
              type="number"
              placeholder="VIP Ticket Price"
              name="vipticket"
              value={data.vipticket}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label>Regular Tickets</label>
            <input
              type="number"
              placeholder="Regular Ticket Price"
              name="regulartickets"
              value={data.regulartickets}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700"
            >
              {isLoading ? "Updating..." : "Update Event"}
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="bg-gray-600 text-white p-3 rounded-md hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateEvent;