const axios = require('axios');
const { execSync } = require('child_process');
const fs = require('fs');

async function sendRequest() {
  const accessToken = execSync('gcloud auth application-default print-access-token', { encoding: 'utf8' }).trim();

  const data = {
    origin: {
      location: {
        latLng: {
          latitude: 42.340173523716736,
          longitude: -71.05997968330408,
        },
      },
    },
    destination: {
      location: {
        latLng: {
          latitude: 42.075698891472804,
          longitude: -72.59806562080408,
        },
      },
    },
    travelMode: 'DRIVE',
    routingPreference:"TRAFFIC_AWARE",
    computeAlternativeRoutes: true
  };

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
    'X-Goog-User-Project': 'allure-ai-mlops',
    'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.routeLabels,routes.polyline,routes.legs',
  };

  const url = 'https://routes.googleapis.com/directions/v2:computeRoutes';

  try {
    const response = await axios.post(url, data, { headers });
    console.log(response.data);

    // Save the response to a JSON file
    fs.writeFileSync('response.json', JSON.stringify(response.data, null, 2));
    console.log('Response saved to response.json');
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

sendRequest();
