// Loading function on window load

window.addEventListener('load', getISSData);

// Setting custom zoom level and interval
const zoomLevel = 5;
const interval = 3000;

// Global variable to API URL
const api_url = 'https://api.wheretheiss.at/v1/satellites/25544';

// Creating the map with various options
const myMap = L.map('issMap', {
  zoomDelta : 0.5,
  minZoom   : 2,
  maxZoom   : 8,
  zoomSnap  : 0.5,
}).setView([ 0, 0 ], zoomLevel);

// Adding attributions!
const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tiles = L.tileLayer(tileUrl, { attribution });
tiles.addTo(myMap);

// Creating ISS Icon
const iss = L.icon({
  iconUrl    : 'iss.png',
  iconSize   : [ 50, 32 ],
  iconAnchor : [ 25, 16 ],
});
const marker = L.marker([ 0, 0 ], { icon: iss }, zoomLevel).addTo(myMap);

// Function to call API and get the location for the ISS.
async function getISSData () {
  const response = await fetch(api_url); // Fetched data using await fetch
  const issData = await response.json(); // Convert response into JSON (JavaScriptObjectNotation)

  // Created shortened versions of the variables via destructuring!
  const { latitude, longitude, velocity, altitude } = issData;

  // Setting position for both marker and the map to always be centerd
  marker.setLatLng([ latitude, longitude ]);
  myMap.setView([ latitude, longitude ]);

  // Adding location and velocity to DOM
  document.querySelector('#lat').textContent = `${latitude.toFixed(2)}°`;
  document.querySelector('#lon').textContent = `${longitude.toFixed(2)}°`;
  document.querySelector('#vel').textContent = `${velocity.toFixed(2)} km/h`;
  document.querySelector('#alt').textContent = `${altitude.toFixed(2)} km`;
}

// Calling the function every so often with setInterval (set to 3 seconds!)
const refreshISSLocation = window.setInterval(getISSData, interval);
