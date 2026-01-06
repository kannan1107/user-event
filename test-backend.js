// Test if backend is running
fetch('http://localhost:5000/api/events')
  .then(response => {
    console.log('Backend status:', response.status);
    return response.json();
  })
  .then(data => console.log('Backend response:', data))
  .catch(error => console.error('Backend connection failed:', error));