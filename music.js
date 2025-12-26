// ===============================
// CONFIG
// ===============================
console.log("TMC Music JS loaded");

const SHEET_ID = "1bAR9UhzVJdK2dh-PvE3LI0HP7wbA-lMVP-H_GEbSwG0";
const SHEET_NAME = "TMC Music";
const URL = `https://opensheet.elk.sh/${SHEET_ID}/${SHEET_NAME}`;

const featuredContainer = document.getElementById("featured-audio-card");
const galleryContainer = document.getElementById("music-gallery");

// ===============================
// HELPERS
// ===============================

/**
 * Convert Google Drive share link to direct download
 */
function driveDirectLink(url) {
  if (!url) return "";
  
  const regex = /\/d\/([a-zA-Z0-9_-]+)\//;
  const match = url.match(regex);
  if (match && match[1]) {
    return `https://drive.google.com/uc?export=download&id=${match[1]}`;
  }
  
  console.warn("Invalid Drive URL:", url);
  return url; // fallback
}

// ===============================
// FETCH MUSIC DATA
// ===============================
fetch(URL)
  .then(res => res.json())
  .then(data => {
    if (!data || data.length === 0) return;

    // Sort latest first
    const tracks = data.sort((a,b) => new Date(b.release_date) - new Date(a.release_date));

    // FEATURED TRACK
    const featured = tracks[0];
    const audioUrl = driveDirectLink(featured.audio_url);

    featuredContainer.innerHTML = `
      <div class="audio-card fade-up">
        <img src="${featured.cover}" alt="${featured.title}">
        <h2>${featured.title}</h2>
        <p>${featured.artist}</p>
        <audio controls>
          <source src="${audioUrl}" type="audio/mpeg">
          Your browser does not support the audio element.
        </audio>
      </div>
    `;

    // MUSIC GALLERY
    tracks.slice(1).forEach(track => {
      const item = document.createElement("div");
      item.className = "music-item fade-up";

      const galleryAudioUrl = driveDirectLink(track.audio_url);

      item.innerHTML = `
        <img src="${track.cover}" alt="${track.title}">
        <h4>${track.title}</h4>
        <span>${track.artist}</span>
      `;

      item.addEventListener("click", () => {
        featuredContainer.scrollIntoView({behavior:"smooth"});
        featuredContainer.innerHTML = `
          <div class="audio-card fade-up">
            <img src="${track.cover}" alt="${track.title}">
            <h2>${track.title}</h2>
            <p>${track.artist}</p>
            <audio controls autoplay>
              <source src="${galleryAudioUrl}" type="audio/mpeg">
              Your browser does not support the audio element.
            </audio>
          </div>
        `;
      });

      galleryContainer.appendChild(item);
    });
  })
  .catch(err => console.error("Music load error:", err));
