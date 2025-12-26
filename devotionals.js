const SHEET_ID = "1kEea5XwYqU7b0yEi1baFIibBOkb1MCJbNg2PM3qGo6g";
const SHEET_NAME = "Devotionals";
const URL = `https://opensheet.elk.sh/${SHEET_ID}/${SHEET_NAME}`;
const card = document.querySelector(".devotional-card");
card.innerHTML = `
  <div class="skeleton skel-title"></div>
  <div class="skeleton skel-text"></div>
  <div class="skeleton skel-text short"></div>
  <div class="skeleton skel-text"></div>
  <div class="skeleton skel-text short"></div>
`;

fetch(URL)
  .then(res => res.json())
  .then(data => {
    if (!data || data.length === 0) return;

    // Sort by date (latest first)
    const devotionals = data.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    const today = devotionals[0];

    // TODAY'S DEVOTIONAL
    document.getElementById("devotional-date").textContent =
      formatDate(today.date);

    document.getElementById("devotional-title").textContent =
      today.title;

    document.getElementById("devotional-scripture").innerHTML =
      `“${today.scripture}” <span>— ${today.scripture_ref}</span>`;

    document.getElementById("devotional-body").textContent =
      today.body;

    document.getElementById("devotional-author").textContent =
      today.author || "TMC Ministry";

      // ===============================
// SEO META UPDATE
// ===============================

document.title = `${dev.title} | TMC Daily Devotional`;

updateMeta("description", dev.body.substring(0, 160));
updateMeta("og:title", dev.title);
updateMeta("og:description", dev.scripture + " — " + dev.scripture_ref);
updateMeta("og:type", "article");

function updateMeta(name, content) {
  let meta = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute(name.startsWith("og:") ? "property" : "name", name);
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", content);
}


    // PREVIOUS DEVOTIONALS
    const previousContainer =
      document.getElementById("previous-devotionals");

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
  })
  .catch(err => console.error("Devotional load error:", err));


// ===============================
// HELPERS
// ===============================

function loadDevotional(dev) {
  document.getElementById("devotional-date").textContent =
    formatDate(dev.date);

  document.getElementById("devotional-title").textContent =
    dev.title;

  document.getElementById("devotional-scripture").innerHTML =
    `“${dev.scripture}” <span>— ${dev.scripture_ref}</span>`;

  document.getElementById("devotional-body").textContent =
    dev.body;

  document.getElementById("devotional-author").textContent =
    dev.author || "TMC Ministry";
}

function formatDate(dateStr) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateStr).toLocaleDateString(undefined, options);
}
// ===============================
// SHARE & COPY LOGIC
// ===============================

function shareOnWhatsApp() {
  const title = document.getElementById("devotional-title").textContent;
  const scriptureBlock = document.getElementById("devotional-scripture").innerText;
  const body = document.getElementById("devotional-body").textContent;

  const message = `
${title}

${scriptureBlock}

${body}

— TMC Devotional
${window.location.href}
`;

  const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}

function copyScripture() {
  const scriptureBlock = document.getElementById("devotional-scripture").innerText;

  navigator.clipboard.writeText(scriptureBlock)
    .then(() => {
      showToast("Scripture copied ✨");
    })
    .catch(() => {
      showToast("Failed to copy");
    });
}

// ===============================
// TOAST FEEDBACK
// ===============================

function showToast(message) {
  let toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 100);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

const card = document.querySelector(".devotional-card"); // this must exist
card.innerHTML = `
  <h2 id="devotional-title"></h2>
  <div class="scripture" id="devotional-scripture"></div>
  <p id="devotional-body"></p>
  <div id="devotional-author" class="author"></div>
  <div class="devotional-actions">
    <button onclick="shareOnWhatsApp()" class="btn primary">Share on WhatsApp</button>
    <button onclick="copyScripture()" class="btn secondary">Copy Scripture</button>
  </div>
`;

