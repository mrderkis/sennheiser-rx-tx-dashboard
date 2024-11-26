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
    "R3-channel1": "CHANNEL 5",
    "R3-channel2": "CHANNEL 6",
    "R4-channel1": "CHANNEL 7",
    "R4-channel2": "CHANNEL 8",
    "R5-channel1": "CHANNEL 9",
    "R5-channel2": "CHANNEL 10",
    "R6-channel1": "CHANNEL 11",
  };

  Object.entries(data).forEach(([receiver, channels]) => {
    Object.entries(channels).forEach(([channel, info]) => {
      const cardId = `${receiver}-${channel}`;
      const card = document.getElementById(cardId);

      if (card) {
        const channelHeader = channelMapping[cardId] || "UNKNOWN CHANNEL";

        // Determine mute/unmute icon
        const muteIcon = info.mute === "Muted" ? "MUTE.png" : "UNMUTE.png";

        // Set the background image dynamically based on the name
        const backgroundImage = info.name
          ? `url('images/${info.name.replace(/ /g, "_")}.png')`
          : "none";

        // Apply the background image to the card
        card.style.backgroundImage = backgroundImage;
        card.style.backgroundSize = "cover";
        card.style.backgroundPosition = "center";
        card.style.backgroundBlendMode = "overlay"; // Blend background with fallback
        card.style.color = "#ffffff"; // Ensure text is readable

        // Replace card content dynamically
        card.innerHTML = `
          <h1>
            <strong>${info.name || "N/A"}</strong>
            <img src="${muteIcon}" alt="${info.mute}" class="icon">
          </h1>
          <h3>${channelHeader}</h3> <!-- Channel header -->
          <p>${receiver} - ${channel}</p>
          <p><strong>Mute:</strong> ${info.mute || "N/A"}</p>
          <p><strong>Frequency:</strong> ${info.frequency || "N/A"} MHz</p>
          <p><strong>Gain:</strong> ${info.gain || "N/A"} dB</p>
        `;

        // Replace content with "No Link" icon if warnings are "NoLink"
        if (info.warnings === "NoLink") {
          card.innerHTML += `
            <img src="NO_LINK.png" alt="No Link" class="no-link-placeholder">
          `;
        } else {
          card.innerHTML += `
            <p><strong>Battery:</strong> ${info.battery || "N/A"}</p>
            <p><strong>Warnings:</strong> ${info.warnings || "N/A"}</p>
            <p><strong>Mates:</strong> ${info.mates || "N/A"}</p>
          `;
        }
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
        name: "John Doe",
        mute: "Muted",
        frequency: 540800,
        gain: 26,
        battery: "500 minutes",
        warnings: "NoLink",
        mates: "N/A",
      },
      channel2: {
        name: "Jane Doe",
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
        name: "Michael Smith",
        mute: "Muted",
        frequency: 542400,
        gain: 25,
        battery: "450 minutes",
        warnings: "NoLink",
        mates: "N/A",
      },
      channel2: {
        name: "Emily White",
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
