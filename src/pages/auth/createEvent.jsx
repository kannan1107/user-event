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
    totalSeats: "",
    vipSeats: "",
    regularSeats: "",
    guests: [{ name: "", photo: null, position: "" }],
  };

  const [data, setData] = useState({ ...defaultState });
  const [createEventMutation, { isLoading }] = useCreateEventMutation();

  const handleChange = (event) => {
    if (
      (event.target.name === "image" || event.target.name === "video") &&
      event.target.files
    ) {
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

  const addGuest = () => {
    setData((state) => ({
      ...state,
      guests: [...state.guests, { name: "", photo: null, position: "" }],
    }));
  };

  const removeGuest = (index) => {
    setData((state) => ({
      ...state,
      guests: state.guests.filter((_, i) => i !== index),
    }));
  };

  const handleGuestChange = (index, field, value) => {
    setData((state) => {
      const newGuests = [...state.guests];
      newGuests[index][field] = value;
      return { ...state, guests: newGuests };
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!isAuthenticated) {
      alert("Please login first to create events");
      return;
    }

    const validGuests = data.guests.filter(g => g.name.trim() && g.position.trim());

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("date", data.date);
    formData.append("organizer", data.organizer);
    formData.append("category", data.category);
    formData.append("location", data.location);
    formData.append("description", data.description);
    formData.append("viptickets", data.viptickets);
    formData.append("regulartickets", data.regulartickets);
    formData.append("totalSeats", data.totalSeats);
    formData.append("vipSeats", data.vipSeats);
    formData.append("regularSeats", data.regularSeats);
    formData.append("guests", JSON.stringify(validGuests));

    if (data.image) {
      formData.append("image", data.image);
    }
    if (data.video) {
      formData.append("video", data.video);
    }

    validGuests.forEach((guest, index) => {
      formData.append(`guests[${index}][name]`, guest.name);
      formData.append(`guests[${index}][position]`, guest.position);
      if (guest.photo) {
        formData.append(`guestPhotos`, guest.photo);
      }
    });

    createEventMutation(formData)
      .unwrap()
      .then((res) => {
        setData({ ...defaultState });
        // Safely clear file inputs
        const imageInput = document.getElementById("image");
        const videoInput = document.getElementById("video");
        if (imageInput) imageInput.value = "";
        if (videoInput) videoInput.value = "";
        
        console.log("Event created:", res);
        alert("Event created successfully!");
      })
      .catch((error) => {
        console.error("Failed to create event:", error);
        console.error("Error details:", error?.data);
        const errorMsg =
          error?.data?.message || error?.data?.error || error?.message || "Unknown error";
        alert(`Failed to create event: ${errorMsg}`);
      });
  };

  if (isLoading) return <Loading />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 ">
      <div className="max-w-7xl bg-white p-8 rounded-lg shadow-md ">
        <h2 className="text-2xl font-bold text-center mb-6">Create Event</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Changed columns-2 to grid for better mobile responsiveness and form flow */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Event Title</label>
              <input
                type="text"
                placeholder="Event Title"
                name="title"
                id="title"
                value={data.title}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block mb-1">Event Date & Time</label>
              <input
                type="datetime-local"
                name="date"
                id="date"
                value={data.date}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block mb-1">Eventer/Organization</label>
              <input
                type="text"
                placeholder="Eventer/Organization"
                name="organizer"
                id="organizer"
                value={data.organizer}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block mb-1">Event Type</label>
              <input
                type="text"
                placeholder="Event Type"
                name="category"
                id="category"
                value={data.category}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block mb-1">Event Place</label>
              <input
                type="text"
                name="location"
                id="location"
                placeholder="Event Place"
                value={data.location}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block mb-1">Image</label>
              <input
                type="file"
                name="image"
                id="image"
                accept="image/*"
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block mb-1">Video (Optional)</label>
              <input
                type="file"
                name="video"
                id="video"
                accept="video/*"
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block mb-1">Event Details</label>
              <input
                type="text"
                name="description"
                id="description"
                placeholder="Description"
                value={data.description}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block mb-1">Total Seats</label>
              <input
                type="number"
                placeholder="Total Seats"
                step="1"
                name="totalSeats"
                id="totalSeats"
                value={data.totalSeats}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* FIXED: Name was regulartickets, changed to regularSeats */}
            <div>
              <label className="block mb-1">Regular Seats Qty</label>
              <input
                type="number"
                placeholder="Number of Regular Seats"
                step="1"
                name="regularSeats" 
                id="regularSeats"
                value={data.regularSeats}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* FIXED: Name was regulartickets, changed to vipSeats */}
            <div>
              <label className="block mb-1">VIP Seats Qty</label>
              <input
                type="number"
                placeholder="Number of VIP Seats"
                step="1"
                name="vipSeats"
                id="vipSeats"
                value={data.vipSeats}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Guests Section */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <label className="block font-semibold">Event Guests</label>
              <button
                type="button"
                onClick={addGuest}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              >
                + Add Guest
              </button>
            </div>
            {data.guests.map((guest, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3 p-3 border rounded">
                <input
                  type="text"
                  placeholder="Guest Name"
                  value={guest.name}
                  onChange={(e) => handleGuestChange(index, "name", e.target.value)}
                  className="p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Position/Role"
                  value={guest.position}
                  onChange={(e) => handleGuestChange(index, "position", e.target.value)}
                  className="p-2 border rounded"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleGuestChange(index, "photo", e.target.files[0])}
                  className="p-2 border rounded"
                />
                <button
                  type="button"
                  onClick={() => removeGuest(index)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Pricing Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
            <div>
              <label className="block mb-1">VIP Ticket Price</label>
              <input
                type="number"
                placeholder="VIP Ticket Price"
                step="0.01"
                name="viptickets"
                id="viptickets"
                value={data.viptickets}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block mb-1">Regular Ticket Price</label>
              <input
                type="number"
                placeholder="Regular Ticket Price"
                step="0.01"
                name="regulartickets"
                id="regulartickets"
                value={data.regulartickets}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition duration-200"
          >
            {isLoading ? "Creating..." : "Create Event"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;