const socket = new WebSocket("ws://192.168.9.162:3000");

socket.onmessage = (event) => {
  try {
    const data = JSON.parse(event.data);
    updateDashboard(data);
  } catch (error) {
    console.error("Failed to parse WebSocket data:", error);
  }
};

const TESTING_MODE = false; // Enable testing mode for fake data

function updateDashboard(data) {
  const channelMapping = {
    "R6-channel2": "CHANNEL 12",
    "R1-channel1": "CHANNEL 1",
    "R1-channel2": "CHANNEL 2",
    "R2-channel1": "CHANNEL 3",
    "R2-channel2": "CHANNEL 4",
    "R7-channel1": "CHANNEL 27",
    "R7-channel2": "CHANNEL 28",
    "R8-channel1": "CHANNEL 29",
    "R8-channel2": "CHANNEL 30",
  };

  function formatFrequency(frequency) {
    if (!frequency || isNaN(frequency)) return "N/A"; // Handle invalid or missing data
    return `${(frequency / 1000).toFixed(3)} MHz`;
  }
  

  Object.entries(data).forEach(([receiver, channels]) => {
    Object.entries(channels).forEach(([channel, info]) => {
      const cardId = `${receiver}-${channel}`;
      const card = document.getElementById(cardId);

      if (card) {
        const channelHeader = channelMapping[cardId] || "Unknown Channel";

        // Determine mute/unmute icon
        const muteIcon = info.mute === "Muted" ? "MUTE.png" : "UNMUTE.png";

        // Set the background image dynamically based on the name
        const backgroundImage = info.name
          ? `url('images/${info.name.replace(/ /g, "_")}.png')`
          : "none";

        // Apply the background image
        card.style.backgroundImage = backgroundImage;

        // Replace card content dynamically
        card.innerHTML = `
          <div class="header">
            <h1 class="name">
              ${info.name || "N/A"}
              <img src="${muteIcon}" alt="${info.mute}" class="mute-icon">
            </h1>
            <h3 class="channel-header">${channelHeader}</h3>
          </div>
          ${
            info.warnings === "NoLink"
              ? `<img src="NO_LINK.png" alt="No Link" class="no-link-icon">`
              : ""
          }
          <div class="details-box">
            <p>${receiver} - ${channel}</p>
            <p>${formatFrequency(info.frequency)}</p>
            <p>${info.gain || "N/A"} dB</p>
            <p>${info.mute || "N/A"}</p>
          </div>
        `;
      }
    });
  });
}


// WebSocket data handling
socket.onmessage = (event) => {
  if (!TESTING_MODE) {
    try {
      const data = JSON.parse(event.data);
      updateDashboard(data);
    } catch (error) {
      console.error("Failed to parse WebSocket data:", error);
    }
  }
};

// Inject mock data for testing
if (TESTING_MODE) {
  const mockData = {
    R6: {
      channel2: {
        name: "Mel Braddy",
        mute: "Muted",
        frequency: 540800,
        gain: 26,
        battery: "500 minutes",
        warnings: "NoLink",
        mates: "N/A",
      },
    },
    R1: {
      channel1: {
        name: "Alan Reaves",
        mute: "Unmuted",
        frequency: 542200,
        gain: 27,
        battery: "450 minutes",
        warnings: "",
        mates: "N/A",
      },
    },
  };

  // Manually call updateDashboard with mock data
  updateDashboard(mockData);
}

