// artist-detail.js

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const artistId = params.get("id");

  const artistContainer = document.getElementById("artistDetail");
  const artworksContainer = document.getElementById("artworksGrid");

  if (!artistId) {
    artistContainer.innerHTML = "<p>No artist selected.</p>";
    return;
  }

  // Fetch artist details
  async function fetchArtistDetails(id) {
    const url = `https://api.artic.edu/api/v1/artists/${id}?fields=id,title,birth_date,death_date,description`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch artist details");
      const data = await response.json();
      const artist = data.data;

      const lifeSpan =
        artist.birth_date || artist.death_date
          ? `(${artist.birth_date || "?"} – ${artist.death_date || "?"})`
          : "";

      artistContainer.innerHTML = `
        <h2>${escapeHtml(artist.title)}</h2>
        ${lifeSpan ? `<p>${lifeSpan}</p>` : ""}
        ${artist.description ? `<p>${artist.description}</p>` : "<p>No biography available.</p>"}
      `;
    } catch (error) {
      console.error(error);
      artistContainer.innerHTML = "<p>Error loading artist details.</p>";
    }
  }

  // Fetch artworks by the artist
  async function fetchArtworks(id) {
    const url = `https://api.artic.edu/api/v1/artworks?artist_ids=${id}&limit=12&fields=id,title,image_id`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch artworks");
      const data = await response.json();

      artworksContainer.innerHTML = "";

      if (!data.data.length) {
        artworksContainer.innerHTML = "<p>No artworks found for this artist.</p>";
        return;
      }

      data.data.forEach((artwork) => {
        const card = document.createElement("div");
        card.className = "artwork-card";

        const imageUrl = artwork.image_id
          ? `https://www.artic.edu/iiif/2/${artwork.image_id}/full/400,/0/default.jpg`
          : "https://via.placeholder.com/400x400?text=No+Image";

        card.innerHTML = `
          <img src="${imageUrl}" alt="${escapeHtml(artwork.title)}">
          <h4>${escapeHtml(artwork.title)}</h4>
        `;

        artworksContainer.appendChild(card);
      });
    } catch (error) {
      console.error(error);
      artworksContainer.innerHTML = "<p>Error loading artworks.</p>";
    }
  }

  // Utilities
  function escapeHtml(str) {
    if (!str) return "";
    return str.replace(/[&<>"']/g, function (m) {
      return (
        {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        }[m] || m
      );
    });
  }

  // Load data
  fetchArtistDetails(artistId);
  fetchArtworks(artistId);
});
