const socket = new WebSocket("ws://192.168.9.162:3000");

socket.onmessage = (event) => {
  try {
    const data = JSON.parse(event.data);
    updateDashboard(data);
  } catch (error) {
    console.error("Failed to parse WebSocket data:", error);
  }
};

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

  Object.entries(data).forEach(([receiver, channels]) => {
    Object.entries(channels).forEach(([channel, info]) => {
      const cardId = `${receiver}-${channel}`;
      const card = document.getElementById(cardId);

      if (card) {
        const channelHeader = channelMapping[cardId] || "UNKNOWN CHANNEL"; // Default fallback

        // Determine mute/unmute icon
        const muteIcon = info.mute === "Muted" ? "MUTE.png" : "UNMUTE.png";

        // Replace card content dynamically
        card.innerHTML = `
          <h1>
            <strong>${info.name || "N/A"}</strong>
            <img src="${muteIcon}" alt="${info.mute}" class="icon">
          </h1>
          <h3>${channelHeader}</h3> <!-- Channel header -->
          <p>${receiver} - ${channel}</p>
          <p><strong>Mute:</strong> ${info.mute || "N/A"}</p>
          <p>${info.frequency || "N/A"} MHz</p>
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
