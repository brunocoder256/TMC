// CONFIG
const SHEET_ID = "1zCCxU949thb2YYrpl6qPZ-td4vJFAxUkY078oOl0Lwc";
const SHEET_NAME = "TMC Videos";
const URL = `https://opensheet.elk.sh/${SHEET_ID}/${SHEET_NAME}`;

const featuredContainer = document.getElementById("featured-video");
const galleryContainer = document.getElementById("video-gallery");
const filterButtons = document.querySelectorAll(".video-filters button");

let videosData = [];

// FETCH VIDEOS DATA
fetch(URL)
  .then(res => res.json())
  .then(data => {
    if (!Array.isArray(data) || data.length === 0) return;
    videosData = data.sort((a,b) => new Date(b.date) - new Date(a.date));
    displayFeatured(videosData[0]);
    displayGallery(videosData);
  })
  .catch(err => console.error("Videos load error:", err));

// DISPLAY FEATURED VIDEO
function displayFeatured(video) {
  featuredContainer.innerHTML = `
    <iframe src="https://www.youtube.com/embed/${video.youtube_id}" allowfullscreen></iframe>
    <h3 style="text-align:center; color: gold; margin-top:1rem;">${video.title}</h3>
    <p style="text-align:center; color: gold;">${video.description}</p>
  `;
}

// DISPLAY VIDEO GALLERY
function displayGallery(videos) {
  galleryContainer.innerHTML = "";
  videos.forEach(video => {
    const card = document.createElement("div");
    card.className = "video-card fade-up";
    card.innerHTML = `
      <iframe src="https://www.youtube.com/embed/${video.youtube_id}" allowfullscreen></iframe>
      <div class="video-info">
        <h4>${video.title}</h4>
        <p>${video.description}</p>
      </div>
    `;
    card.addEventListener("click", () => {
      displayFeatured(video);
      featuredContainer.scrollIntoView({behavior:"smooth"});
    });
    galleryContainer.appendChild(card);
  });
}

// FILTERING
filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const category = btn.dataset.category;
    if (category === "All") displayGallery(videosData);
    else displayGallery(videosData.filter(v => v.category === category));
  });
});
