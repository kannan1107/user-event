import { useState } from "react";
import { useSelector } from "react-redux";
import { useCreateEventMutation } from "../../features/ApplicationApi";
import Loading from "../../components/Loading";

const CreateEvent = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  const defaultState = {
    title: "",
    date: "",
    organizer: "",
    category: "",
    location: "",
    image: null,
    video: null,
    description: "",
    viptickets: "",
    regulartickets: "",
    totalSeats: ""
  };
  const [data, setData] = useState({ ...defaultState });
  const [createEventMutation, { isLoading }] = useCreateEventMutation();


  const handleChange = (event) => {
    // Special handling for file inputs
    if ((event.target.name === "image" || event.target.name === "video") && event.target.files) {
      setData((state) => ({
        ...state,
        [event.target.name]: event.target.files[0],
      }));
    } else {
      setData((state) => ({
        ...state,
        [event.target.name]: event.target.value,
      }));
    }
  };


  const handleSubmit = (event) => {
    event.preventDefault();
    
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('date', data.date);
    formData.append('organizer', data.organizer);
    formData.append('category', data.category);
    formData.append('location', data.location);
    formData.append('description', data.description);
    formData.append('viptickets', data.viptickets);
    formData.append('regulartickets', data.regulartickets);
    formData.append('totalSeats', data.totalSeats);
    formData.append('image', data.image);
    formData.append('video', data.video);
    

    
    if (data.image) {
      formData.append('image', data.image);
    }
    if (data.video) {
      formData.append('video', data.video);
    }

    if (!isAuthenticated) {
      alert('Please login first to create events');
      return;
    }

    createEventMutation(formData)
      .unwrap()
      .then((res) => {
        setData({ ...defaultState });
        console.log('Event created:', res);
        alert('Event created successfully!');
      })
      .catch((error) => {
        console.error("Failed to create event:", error);
        const errorMsg = error?.data?.message || error?.message || JSON.stringify(error);
        alert(`Failed to create event: ${errorMsg}`);
      });
  };

  if (isLoading) return <Loading />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 ">
      <div className="max-w-7xl bg-white p-8 rounded-lg shadow-md ">
        <h2 className="text-2xl font-bold text-center mb-6">Create EventS</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="columns-2">
            <label>Event Title</label>
            <input
              type="text"
              placeholder="Event Title"
              name="title"
              id="title"
              value={data.title} // Corrected
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label>Event Date & Time</label>
            <input
              type="datetime-local"
              placeholder="Event Date & Time"
              name="date"
              id="date"
              value={data.date} // Corrected
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label>Eventer/Organization</label>
            <input
              type="text"
              placeholder="Eventer/Organization"
              name="organizer"
              id="organizer"
              value={data.organizer} // Corrected
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label>Event Type</label>
            <input
              type="text"
              placeholder="Event Type"
              name="category"
              id="category"
              value={data.category} // Corrected
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div><label>Event Place</label>
            <input
              type="text"
              name="location"
              id="location"
              placeholder="Event Place"
              value={data.location} // Corrected
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            /></div>
            <label>Image</label>
            <input
              type="file"
              name="image"
              id="image"
              accept="image/*"
              // value={data.image}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label>Video (Optional)</label>
            <input
              type="file"
              name="video"
              id="video"
              accept="video/*"
              // value={data.video}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label>Event Details</label>
            <input
              type="text"
              name="description"
              id="description"
              placeholder="Description"
              value={data.description} // Corrected (this one was already correct)
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label>Total Seat</label>
            <input
              type="number"
              placeholder="totalSeats"
              step="1" // Step should usually be 1 for seats, not 0.01
              name="totalSeats"
              id="totalSeats"
              value={data.totalSeats} // Corrected
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>


          <div className="border border-gray-300 rounded-md columns-2 text-center">
            <label>VIP Tickets</label>
            <input
              type="number"
              placeholder="VIP Ticket Price"
              name="viptickets"
              id="viptickets"
              value={data.viptickets}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <label>Regular Tickets</label> {/* Clarified label */}
            <input
              type="number"
              placeholder="Regular Ticket Price" // Clarified placeholder
              step="0.01"
              name="regulartickets"
              id="regulartickets"
              value={data.regulartickets} // Corrected
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit" disabled={isLoading}
            className="w-md bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700"
          >
            {isLoading ? "Creating..." : "Create Event"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;