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
    "R3-channel1": "CHANNEL 5",
    "R3-channel2": "CHANNEL 6",
    "R4-channel1": "CHANNEL 7",
    "R4-channel2": "CHANNEL 8",
    "R5-channel1": "CHANNEL 9",
    "R5-channel2": "CHANNEL 10",
    "R6-channel1": "CHANNEL 11",
    "R6-channel2": "CHANNEL 12",
  };

  Object.entries(data).forEach(([receiver, channels]) => {
    Object.entries(channels).forEach(([channel, info]) => {
      const cardId = `${receiver}-${channel}`;
      const card = document.getElementById(cardId);
      if (card) {
        const channelHeader = channelMapping[cardId] || "UNKNOWN CHANNEL"; // Default fallback
        card.innerHTML = `
          <h1><strong> ${info.name || "N/A"}</strong></h1>
          <h3>${channelHeader}</h3> <!-- Channel header -->
          <p>${receiver} - ${channel}</p>
          <p><strong>Mute:</strong> ${info.mute || "N/A"}</p>
          <p><strong>Frequency:</strong> ${info.frequency || "N/A"} MHz</p>
          <p><strong>Gain:</strong> ${info.gain || "N/A"} dB</p>
          <p><strong>Battery:</strong> ${info.battery || "N/A"}</p>
          <p><strong>Warnings:</strong> ${info.warnings || "N/A"}</p>
          <p><strong>Mates:</strong> ${info.mates || "N/A"}</p>
        `;
      }
    });
  });
}
