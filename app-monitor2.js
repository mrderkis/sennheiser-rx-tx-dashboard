const socket = new WebSocket("ws://192.168.9.162:3000");

socket.onmessage = (event) => {
  try {
    const data = JSON.parse(event.data);
    updateDashboard(data);
  } catch (error) {
    console.error("Failed to parse WebSocket data:", error);
  }
};

const TESTING_MODE = false; // Set to true when testing with mock data

function updateDashboard(data) {
  const channelMapping = {
    "R6-channel2": "Channel 12",
    "R1-channel1": "Channel 1",
    "R1-channel2": "Channel 2",
    "R2-channel1": "Channel 3",
    "R2-channel2": "Channel 4",
    "R7-channel1": "Channel 27",
    "R7-channel2": "Channel 28",
    "R8-channel1": "Channel 29",
    "R8-channel2": "Channel 30",
  };

  function formatFrequency(frequency) {
    if (!frequency) return "N/A"; // Handle missing data
    const parsedFrequency = parseFloat(frequency); // Ensure it's treated as a number
    if (isNaN(parsedFrequency)) return "N/A"; // Handle invalid data

    // Assume the input is already in MHz
    return `${parsedFrequency.toFixed(3)} MHz`;
  }

  function formatBattery(battery, warnings) {
    if (warnings && warnings.toLowerCase() === "nolink") {
      return "No Link"; // Display "No Link" if warnings indicate no connection
    }

    const batteryMinutes = parseInt(battery, 10); // Parse battery value as an integer
    if (isNaN(batteryMinutes) || batteryMinutes < 0) {
      return "N/A"; // Handle invalid or missing data
    }

    const hours = Math.floor(batteryMinutes / 60); // Calculate hours
    const minutes = batteryMinutes % 60; // Calculate remaining minutes

    return `${hours}:${minutes.toString().padStart(2, "0")}`; // Format as HH:MM
  }

  function getRSQILevel(rsqi) {
    const rsqiValue = parseInt(rsqi, 10); // Convert RSQI to an integer
    if (isNaN(rsqiValue) || rsqiValue < 0 || rsqiValue > 100) return 0; // Ensure valid range
    if (rsqiValue >= 75) return 4; // 4 bars for RSQI >= 75%
    if (rsqiValue >= 50) return 3; // 3 bars for RSQI >= 50%
    if (rsqiValue >= 25) return 2; // 2 bars for RSQI >= 25%
    return 1; // 1 bar for RSQI > 0%
  }

  Object.entries(data).forEach(([receiver, channels]) => {
    Object.entries(channels).forEach(([channel, info]) => {
      const cardId = `${receiver}-${channel}`;
      const card = document.getElementById(cardId);

      if (card) {
        const channelHeader = channelMapping[cardId] || "Unknown Channel";

        // Log the warnings for debugging
        console.log(`Warnings for ${receiver} - ${channel}:`, info.warnings);

        // Determine mute/unmute icon
        const muteIcon = info.mute === "Muted" ? "MUTE.png" : "UNMUTE.png";

        // Construct background image path
        const backgroundImagePath = info.name
          ? `images/${info.name.replace(/ /g, "_")}.png`
          : null;

        // Check if the image exists
        const img = new Image();
        img.src = backgroundImagePath;
        img.onload = () => {
          card.style.backgroundImage = `url('${backgroundImagePath}')`;
        };
        img.onerror = () => {
          card.style.backgroundImage = "none";
          card.style.backgroundColor = "#2C3E50"; // Fallback color
        };

        // Get RSQI level
        const rsqiLevel = getRSQILevel(info.rsqi || 0);

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
            <p>${receiver} - ${channel}</p>
            <p>${formatFrequency(info.frequency)}</p>
            <p>${info.gain || "N/A"} dB</p>
            <p>${formatBattery(info.battery, info.warnings)}</p>
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
    R5: {
      channel1: {
        battery: 698,
        divi: 1,
        frequency: 544.000,
        gain: 27,
        mates: "N/A",
        mute: "Muted",
        name: "CHRISTY",
        rsqi: 80,
        txMute: "N/A",
        warnings: "",
      },
      channel2: {
        battery: "N/A",
        divi: 2,
        frequency: 543.400,
        gain: 33,
        mates: "N/A",
        mute: "Unmuted",
        name: "JACK",
        rsqi: 40,
        txMute: "N/A",
        warnings: "NoLink",
      },
    },
  };

  updateDashboard(mockData); // Manually call updateDashboard with mock data
}
