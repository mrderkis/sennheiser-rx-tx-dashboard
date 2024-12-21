async function fetchRandomPhoto(name) {
  try {
    const response = await fetch(`/random-photo/${name}`);
    if (!response.ok) throw new Error("No images found");
    const data = await response.json();
    return data.photoPath;
  } catch (error) {
    console.error(`Error fetching random photo for ${name}:`, error);
    return null;
  }
}

function updateDashboard(data) {
  Object.entries(data).forEach(([receiver, channels]) => {
    Object.entries(channels).forEach(async ([channel, info]) => {
      const cardId = `${receiver}-${channel}`;
      const card = document.getElementById(cardId);

      if (card) {
        const currentName = info.name || "Unknown";

        // Fetch a random photo dynamically
        const randomPhotoPath = await fetchRandomPhoto(currentName);

        if (randomPhotoPath) {
          card.style.backgroundImage = `url('${randomPhotoPath}')`;
        } else {
          card.style.backgroundImage = "none";
          card.style.backgroundColor = "#2C3E50"; // Fallback color
        }

        // Update card content
        card.innerHTML = `
          <div class="header">
            <h1 class="name">${currentName}</h1>
            <h3 class="channel-header">${channel}</h3>
          </div>
          <div class="details-box">
            <p>${receiver} - ${channel}</p>
            <p>${info.frequency || "N/A"} MHz</p>
            <p>${info.battery || "N/A"}</p>
          </div>
        `;
      }
    });
  });
}

// WebSocket integration
const socket = new WebSocket("ws://192.168.9.162:3000");
socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  updateDashboard(data);
};
