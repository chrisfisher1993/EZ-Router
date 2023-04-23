main.js
function initMap() {
  const directionsRenderer = new google.maps.DirectionsRenderer();
  const directionsService = new google.maps.DirectionsService();
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 14,
    center: { lat: 37.77, lng: -122.447 },
  });

  directionsRenderer.setMap(map);

  document.getElementById("submit").addEventListener("click", () => {
    const startingAddress = document.getElementById("startingaddress").value;
    const destinationAddress = document.getElementById("destinationaddress").value;
    const selectedMode = document.getElementById("mode").value;

    if (!startingAddress || !destinationAddress || !selectedMode) {
      window.alert("Please enter starting and destination addresses and select a mode of travel");
      return;
    }

    calculateAndDisplayRoute(directionsService, directionsRenderer);
  });
}

function calculateAndDisplayRoute(directionsService, directionsRenderer) {
  const startingAddress = document.getElementById("startingaddress").value;
  const destinationAddress = document.getElementById("destinationaddress").value;
  const selectedMode = document.getElementById("mode").value;

  const geocoder = new google.maps.Geocoder();
  geocoder.geocode({ address: startingAddress }, (results, status) => {
    if (status !== "OK") {
      window.alert("Starting address not found");
      return;
    }

    const startLocation = results[0].geometry.location;

    geocoder.geocode({ address: destinationAddress }, (results, status) => {
      if (status !== "OK") {
        window.alert("Destination address not found");
        return;
      }

      const endLocation = results[0].geometry.location;

      directionsService
        .route({
          origin: startLocation,
          destination: endLocation,
          travelMode: google.maps.TravelMode[selectedMode],
        })
        .then((response) => {
          directionsRenderer.setDirections(response);

          // Get total travel time in minutes
          const totalMinutes = response.routes[0].legs.reduce(
            (acc, leg) => acc + leg.duration.value,
            0
          ) / 60;

          // Format total travel time as string
          let totalTimeStr;
          if (totalMinutes >= 60) {
            const hours = Math.floor(totalMinutes / 60);
            const minutes = Math.round(totalMinutes % 60);
            totalTimeStr = `${hours} hour${hours > 1 ? "s" : ""} ${minutes} minute${
              minutes > 1 ? "s" : ""
            }`;
          } else {
            const minutes = Math.ceil(totalMinutes);
            totalTimeStr = `${minutes} minute${minutes > 1 ? "s" : ""}`;
          }

          // Remove previous travel time element
          const travelTimeElem = document.getElementById("travel-time");
          if (travelTimeElem) {
            travelTimeElem.remove();
          }

          // Display total travel time in HTML
          const newTravelTimeElem = document.createElement("div");
          newTravelTimeElem.id = "travel-time";
          newTravelTimeElem.innerHTML = `<b>Travel Time:</b> ${totalTimeStr}`;
          document.getElementById("floating-panel").appendChild(newTravelTimeElem);
        })
        .catch((e) =>
          window.alert("Direction request failed due to " + e)
        );
    });
  });
}