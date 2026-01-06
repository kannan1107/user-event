// Test backend connection
console.log('Testing backend connection...');

fetch('http://localhost:5000/api/events', {
  method: 'GET',
})
.then(response => {
  console.log('Response status:', response.status);
  console.log('Response ok:', response.ok);
  return response.text();
})
.then(data => {
  console.log('Response data:', data);
})
.catch(error => {
  console.error('Connection failed:', error);
});