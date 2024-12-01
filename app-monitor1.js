const socket = new WebSocket("ws://192.168.9.162:3000");

socket.onmessage = (event) => {
  try {
    const data = JSON.parse(event.data);
    updateDashboard(data);
  } catch (error) {
    console.error("Failed to parse WebSocket data:", error);
  }
};

const TESTING_MODE = true; // Set to false when not testing

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
        console.log(rsqiLevel);
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
    R1: {
    channel1: {
      "battery": "N/A",
      "divi": "N/A",
      "frequency": "470.200 MHz",
      "gain": 30,
      "mates": "N/A",
      "mute": "N/A",
      "name": "JOHN",
      "rsqi": "N/A",
      "txMute": "N/A",
      "warnings": "NoLink"
    },
    channel2: {
      "battery": "N/A",
      "divi": "N/A",
      "frequency": "544.600 MHz",
      "gain": 21,
      "mates": "N/A",
      "mute": "N/A",
      "name": "NA",
      "rsqi": "N/A",
      "txMute": "N/A",
      "warnings": "NoLink"
    }
  },
  R2: {
    channel1: {
      "battery": "N/A",
      "divi": "N/A",
      "frequency": "546.400 MHz",
      "gain": 27,
      "mates": "N/A",
      "mute": "N/A",
      "name": "NA",
      "rsqi": "N/A",
      "txMute": "N/A",
      "warnings": "NoLink"
    },
    channel2: {
      "battery": "N/A",
      "divi": "N/A",
      "frequency": "541.300 MHz",
      "gain": 33,
      "mates": "N/A",
      "mute": "N/A",
      "name": "ACOUSTIC",
      "rsqi": "N/A",
      "txMute": "N/A",
      "warnings": "NoLink"
    }
  },
  R3: {
    channel1: {
      "battery": "N/A",
      "divi": "N/A",
      "frequency": "550.000 MHz",
      "gain": 33,
      "mates": "N/A",
      "mute": "N/A",
      "name": "LISA",
      "rsqi": "N/A",
      "txMute": "N/A",
      "warnings": "NoLink"
    },
    channel2: {
      "battery": "N/A",
      "divi": "N/A",
      "frequency": "549.400 MHz",
      "gain": 33,
      "mates": "N/A",
      "mute": "N/A",
      "name": "NANCY R",
      "rsqi": "N/A",
      "txMute": "N/A",
      "warnings": "NoLink"
    }
  },
  R4: {
    channel1: {
      "battery": "N/A",
      "divi": "N/A",
      "frequency": "541.600 MHz",
      "gain": 33,
      "mates": "N/A",
      "mute": "N/A",
      "name": "ALAN R",
      "rsqi": "N/A",
      "txMute": "N/A",
      "warnings": "NoLink"
    },
    channel2: {
      "battery": "N/A",
      "divi": "N/A",
      "frequency": "541.000 MHz",
      "gain": 33,
      "mates": "N/A",
      "mute": "N/A",
      "name": "JAY",
      "rsqi": "N/A",
      "txMute": "N/A",
      "warnings": "NoLink"
    }
  },
  R5: {
    channel1: {
      "battery": "N/A",
      "divi": "1",
      "frequency": "544.000 MHz",
      "gain": 27,
      "mates": "N/A",
      "mute": "N/A",
      "name": "CHRISTY",
      "rsqi": 70,
      "txMute": "N/A",
      "warnings": ""
    },
    channel2: {
      "battery": "N/A",
      "divi": "N/A",
      "frequency": "543.400 MHz",
      "gain": 27,
      "mates": "N/A",
      "mute": "N/A",
      "name": "JACK",
      "rsqi": "N/A",
      "txMute": "N/A",
      "warnings": "NoLink"
    }
  },
  R6: {
    channel1: {
      "battery": "N/A",
      "divi": "N/A",
      "frequency": "542.800 MHz",
      "gain": 27,
      "mates": "N/A",
      "mute": "N/A",
      "name": "GRACE",
      "rsqi": "N/A",
      "txMute": "N/A",
      "warnings": "NoLink"
    },
    channel2: {
      "battery": "N/A",
      "divi": "N/A",
      "frequency": "542.200 MHz",
      "gain": 33,
      "mates": "N/A",
      "mute": "N/A",
      "name": "JEFF",
      "rsqi": "N/A",
      "txMute": "N/A",
      "warnings": "NoLink"
    }
  },
  R7: {
    channel1: {
      "battery": "N/A",
      "divi": "N/A",
      "frequency": "548.800 MHz",
      "gain": 30,
      "mates": "N/A",
      "mute": "N/A",
      "name": "MANDY",
      "rsqi": "N/A",
      "txMute": "N/A",
      "warnings": "NoLink"
    },
    channel2: {
      "battery": "N/A",
      "divi": "N/A",
      "frequency": "548.200 MHz",
      "gain": 30,
      "mates": "N/A",
      "mute": "N/A",
      "name": "NANCY S",
      "rsqi": "N/A",
      "txMute": "N/A",
      "warnings": "NoLink"
    }
  },
  R8: {
    channel1: {
      "battery": "N/A",
      "divi": "N/A",
      "frequency": "547.600 MHz",
      "gain": 33,
      "mates": "N/A",
      "mute": "N/A",
      "name": "HARLEY",
      "rsqi": "N/A",
      "txMute": "N/A",
      "warnings": "NoLink"
    },
    channel2: {
      "battery": "N/A",
      "divi": "N/A",
      "frequency": "547.000 MHz",
      "gain": 33,
      "mates": "N/A",
      "mute": "N/A",
      "name": "ALLEN",
      "rsqi": "N/A",
      "txMute": "N/A",
      "warnings": "NoLink"
    }
  },
  };

  // Manually call updateDashboard with mock data
  updateDashboard(mockData);
}
