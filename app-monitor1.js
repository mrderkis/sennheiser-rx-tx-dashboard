async function setStaticPhoto(cardId, name) {
  const card = document.getElementById(cardId);

  if (!card) return;

  // Fetch the list of photos in the person's folder
  try {
    const response = await fetch(`/random-photo/${name}?list=true`);
    if (!response.ok) throw new Error("No images found");
    const data = await response.json();

    if (data.photos && data.photos.length > 0) {
      // Use the first photo in the folder
      const photoPath = data.photos[0];
      card.style.backgroundImage = `url('${photoPath}')`;
      
    } else {
      // Fallback if no photos are available
      card.style.backgroundImage = "none";
      card.style.backgroundColor = "#2C3E50"; // Fallback color
    }
  } catch (error) {
    console.error(`Error loading photo for ${name}:`, error);
    card.style.backgroundImage = "none"; // Fallback for errors
    // card.style.backgroundColor = "#2C3E50";
  }
}

function updateDashboard(data) {
  Object.entries(data).forEach(([receiver, channels]) => {
    Object.entries(channels).forEach(([channel, info]) => {
      const cardId = `${receiver}-${channel}`;
      const card = document.getElementById(cardId);

      if (card) {
        const name = info.name || "Unknown";

        // Set static photo for this card
        setStaticPhoto(cardId, name);

        // Restore frequency strength and antennae logic
        const rsqiLevel = getRSQILevel(info.rsqi || 0);

        card.innerHTML = `
          <div class="header">
            <h1 class="name">${name}</h1>
            <h3 class="channel-header">${channel}</h3>
          </div>
          <div class="antenna-indicator">
            <span class="antenna-a ${info.divi == 1 ? "active" : ""}">A</span>
            <span class="antenna-b ${info.divi == 2 ? "active" : ""}">B</span>
          </div>
          <div class="rsqi-bars">
            ${[...Array(4)]
              .map(
                (_, i) =>
                  `<div class="bar ${
                    i < rsqiLevel ? "filled" : ""
                  }"></div>`
              )
              .join("")}
          </div>
          <div class="details-box">
            <p>${receiver} - ${channel}</p>
            <p>${info.frequency || "N/A"}</p>
            <p>${info.gain || "N/A"} dB</p>
            <p>${info.battery || "N/A"}</p>
          </div>
        `;
      }
    });
  });
}

function getRSQILevel(rsqi) {
  const rsqiValue = parseInt(rsqi, 10);
  if (isNaN(rsqiValue) || rsqiValue < 0 || rsqiValue > 100) return 0;
  if (rsqiValue >= 75) return 4;
  if (rsqiValue >= 50) return 3;
  if (rsqiValue >= 25) return 2;
  return 1;
}

// WebSocket integration
const socket = new WebSocket("ws://192.168.9.162:3000");
socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  updateDashboard(data);
}
