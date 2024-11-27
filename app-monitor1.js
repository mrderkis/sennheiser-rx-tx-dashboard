const socket = new WebSocket("ws://192.168.9.162:3000");

socket.onmessage = (event) => {
  try {
    const data = JSON.parse(event.data);
    updateDashboard(data);
  } catch (error) {
    console.error("Failed to parse WebSocket data:", error);
  }
};

const TESTING_MODE = false; // Set to false when not testing

function updateDashboard(data) {
  const channelMapping = {
    "R3-channel1": "Channel 5",
    "R3-channel2": "Channel 6",
    "R4-channel1": "Channel 7",
    "R4-channel2": "Channel 8",
    "R5-channel1": "Channel 9",
    "R5-channel2": "Channel 10",
    "R6-channel1": "Channel 11",
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
    R3: {
      channel1: {
        name: "Jordan Mathis",
        mute: "Muted",
        frequency: 540800,
        gain: 26,
        battery: "500 minutes",
        warnings: "NoLink",
        mates: "N/A",
      },
      channel2: {
        name: "Grace Pham",
        mute: "Unmuted",
        frequency: 541200,
        gain: 30,
        battery: "600 minutes",
        warnings: "",
        mates: "N/A",
      },
    },
    R4: {
      channel1: {
        name: "Jeff Brazell",
        mute: "Muted",
        frequency: 542400,
        gain: 25,
        battery: "450 minutes",
        warnings: "NoLink",
        mates: "N/A",
      },
      channel2: {
        name: "Ray Braddy",
        mute: "Unmuted",
        frequency: 543600,
        gain: 27,
        battery: "400 minutes",
        warnings: "",
        mates: "N/A",
      },
    },
  };

  // Manually call updateDashboard with mock data
  updateDashboard(mockData);
}
