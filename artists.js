document.addEventListener("DOMContentLoaded", () => {
  let currentPage = 1;
  const limit = 20;
  const maxPages = 5; // 20 * 5 = 100 artists

  const container = document.getElementById("artists");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const pageInfo = document.getElementById("pageInfo");

  if (!container) {
    console.error('No element with id="artists" found. Make sure artists.html contains <div id="artists"></div>');
    return;
  }

  async function fetchArtists(page = 1) {
    const url = `https://api.artic.edu/api/v1/artists?page=${page}&limit=${limit}&fields=id,title,birth_date,death_date`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Network error: ${response.status}`);
      const data = await response.json();

      container.innerHTML = "";

      if (!data.data || data.data.length === 0) {
        container.innerHTML = "<p>No artists found.</p>";
        return;
      }

      data.data.forEach(artist => {
        const card = document.createElement("div");
        card.className = "artist-card";

        // Prepare lifespan string only if data exists
        const lifeSpan = (artist.birth_date || artist.death_date)
          ? `(${artist.birth_date || "?"} – ${artist.death_date || "?"})`
          : "";

        // Use safe-escaped title
        const safeTitle = escapeHtml(artist.title);


        card.innerHTML = `
          <h3>${safeTitle}</h3>
          ${lifeSpan ? `<p>${lifeSpan}</p>` : ""}
          <a href="artist-detail.html?id=${artist.id}" class="btn-view small-btn">View</a>
        `;


        // Make entire card clickable (but allow the anchor to behave normally)
        card.addEventListener("click", (e) => {
          // If clicked an <a> (or inside one), don't override — let it navigate
          if (e.target.closest("a")) return;
          window.location.href = `artist-detail.html?id=${artist.id}`;
        });

        container.appendChild(card);
      });

      // Update pagination UI if present
      if (pageInfo) pageInfo.innerText = `Page ${page}`;
      if (prevBtn) prevBtn.disabled = page === 1;
      if (nextBtn) nextBtn.disabled = page === maxPages;

    } catch (error) {
      console.error("Error fetching artists:", error);
      container.innerHTML = "<p>Failed to load artists. Check console for details.</p>";
    }
  }

  // Add event listeners only if the buttons exist in the DOM
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        fetchArtists(currentPage);
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (currentPage < maxPages) {
        currentPage++;
        fetchArtists(currentPage);
      }
    });
  }

  // initial load
  fetchArtists(currentPage);
});

/**
 * Small utility to escape HTML (prevents accidental injection)
 */
function escapeHtml(str) {
  if (!str) return "";
  return str.replace(/[&<>"']/g, function (m) {
    return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[m];
  });
}
