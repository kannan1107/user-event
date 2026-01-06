// Basic Stripe checkout session creation
// Note: This should be implemented on your backend server

export const createCheckoutSession = async (eventData) => {
  // This is a mock implementation - replace with actual backend call
  const response = await fetch("/api/create-checkout-session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      eventId: eventData.eventId,
      eventTitle: eventData.eventTitle,
      ticketType: eventData.ticketType,
      price: eventData.price,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create checkout session");
  }

  return response.json();
};
