const artworksContainer = document.getElementById("artworks");

fetch("https://api.artic.edu/api/v1/artworks?page=1&limit=20")
  .then(response => response.json())
  .then(data => {
    data.data.forEach(art => {
      const imgUrl = `https://www.artic.edu/iiif/2/${art.image_id}/full/843,/0/default.jpg`;
      const div = document.createElement("div");
      div.className = "art-card";
      div.innerHTML = `
        <img src="${imgUrl}" alt="${art.title}" width="200">
        <h3>${art.title}</h3>
        <p>By ${art.artist_title || "Unknown Artist"}</p>
      `;
      artworksContainer.appendChild(div);
    });
  })
  .catch(error => console.error("Error fetching artworks:", error));
