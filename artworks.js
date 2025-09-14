let currentPage = 1;
const limit = 20;
const maxPages = 5; // since 20 * 5 = 100 artworks

const params = new URLSearchParams(window.location.search);
const artistId = params.get("artist_id");

async function fetchArtworks(page = 1) {
  let url = artistId
    ? `https://api.artic.edu/api/v1/artworks?artist_ids=${artistId}&page=${page}&limit=${limit}`
    : `https://api.artic.edu/api/v1/artworks?page=${page}&limit=${limit}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const container = document.getElementById("artworks");
    container.innerHTML = "";

    if (!data.data.length) {
      container.innerHTML = "<p>No artworks found.</p>";
      return;
    }

    data.data.forEach(artwork => {
      const card = document.createElement("div");
      card.className = "artwork-card";

      const imageUrl = artwork.image_id
        ? `https://www.artic.edu/iiif/2/${artwork.image_id}/full/400,/0/default.jpg`
        : "https://via.placeholder.com/400x250?text=No+Image";

      card.innerHTML = `
        <img src="${imageUrl}" alt="${artwork.title}">
        <h4>${artwork.title || "Untitled"}</h4>
      `;

      container.appendChild(card);
    });

    // Update pagination controls
    document.getElementById("pageInfo").innerText = `Page ${page}`;
    document.getElementById("prevBtn").disabled = page === 1;
    document.getElementById("nextBtn").disabled = page === maxPages;

  } catch (error) {
    console.error("Error fetching artworks:", error);
  }
}

// Event Listeners for Pagination
document.getElementById("prevBtn").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    fetchArtworks(currentPage);
  }
});

document.getElementById("nextBtn").addEventListener("click", () => {
  if (currentPage < maxPages) {
    currentPage++;
    fetchArtworks(currentPage);
  }
});

// Initial load
fetchArtworks(currentPage);
