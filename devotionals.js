// ===============================
// CONFIG
// ===============================
const SHEET_ID = "1kEea5XwYqU7b0yEi1baFIibBOkb1MCJbNg2PM3qGo6g";
const SHEET_NAME = "Devotionals";
const URL = `https://opensheet.elk.sh/${SHEET_ID}/${SHEET_NAME}`;

// ===============================
// ELEMENTS
// ===============================
const card = document.querySelector(".devotional-card");

// Show skeleton while loading
card.innerHTML = `
  <div class="skeleton skel-title"></div>
  <div class="skeleton skel-text"></div>
  <div class="skeleton skel-text short"></div>
  <div class="skeleton skel-text"></div>
  <div class="skeleton skel-text short"></div>
`;

// ===============================
// FETCH DEVOTIONALS
// ===============================
fetch(URL)
  .then(res => res.json())
  .then(data => {
    if (!data || data.length === 0) {
      card.innerHTML = "<p>No devotionals available yet.</p>";
      return;
    }

    // Sort by date (latest first)
    const devotionals = data.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Load today’s devotional
    loadDevotional(devotionals[0]);

    // Load previous devotionals
    const previousContainer = document.getElementById("previous-devotionals");
    if (previousContainer) {
      previousContainer.innerHTML = ""; // clear
      devotionals.slice(1, 7).forEach(dev => {
        const item = document.createElement("div");
        item.className = "devotional-item";
        item.innerHTML = `
          <h4>${dev.title}</h4>
          <span>${dev.scripture_ref}</span>
        `;
        item.addEventListener("click", () => {
          loadDevotional(dev);
          window.scrollTo({ top: 0, behavior: "smooth" });
        });
        previousContainer.appendChild(item);
      });
    }
  })
  .catch(err => {
    console.error("Devotional load error:", err);
    card.innerHTML = "<p>Failed to load devotional.</p>";
  });

// ===============================
// LOAD DEVOTIONAL FUNCTION
// ===============================
function loadDevotional(dev) {
  card.innerHTML = `
    <span id="devotional-date">${formatDate(dev.date)}</span>
    <h2 id="devotional-title">${dev.title}</h2>
    <blockquote id="devotional-scripture">
      “${dev.scripture}” <span>— ${dev.scripture_ref}</span>
    </blockquote>
    <p id="devotional-body">${dev.body}</p>
    <span id="devotional-author">${dev.author || "TMC Ministry"}</span>

    <div class="devotional-actions">
      <button id="share-btn" class="btn primary">Share on WhatsApp</button>
      <button id="copy-btn" class="btn secondary">Copy Scripture</button>
    </div>
  `;

  // Bind share and copy buttons AFTER DOM update
  document.getElementById("share-btn").addEventListener("click", shareOnWhatsApp);
  document.getElementById("copy-btn").addEventListener("click", copyScripture);

  // Update SEO meta
  document.title = `${dev.title} | TMC Daily Devotional`;
  updateMeta("description", dev.body.substring(0, 160));
  updateMeta("og:title", dev.title);
  updateMeta("og:description", `${dev.scripture} — ${dev.scripture_ref}`);
  updateMeta("og:type", "article");
}

// ===============================
// HELPERS
// ===============================
function formatDate(dateStr) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateStr).toLocaleDateString(undefined, options);
}

function updateMeta(name, content) {
  let meta = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute(name.startsWith("og:") ? "property" : "name", name);
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", content);
}

// ===============================
// SHARE & COPY
// ===============================
function shareOnWhatsApp() {
  const title = document.getElementById("devotional-title").textContent;
  const scripture = document.getElementById("devotional-scripture").innerText;
  const body = document.getElementById("devotional-body").textContent;

  const message = `${title}\n\n${scripture}\n\n${body}\n\n— TMC Devotional\n${window.location.href}`;
  const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}

function copyScripture() {
  const scripture = document.getElementById("devotional-scripture").innerText;
  navigator.clipboard.writeText(scripture)
    .then(() => showToast("Scripture copied ✨"))
    .catch(() => showToast("Failed to copy"));
}

// ===============================
// TOAST FEEDBACK
// ===============================
function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 100);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}
