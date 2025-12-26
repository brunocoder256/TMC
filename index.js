document.addEventListener("DOMContentLoaded", () => {
  const previewContainer = document.getElementById('devotional-preview');

  // Use your sheet ID and sheet name (tab)
  const SHEET_ID = "1kEea5XwYqU7b0yEi1baFIibBOkb1MCJbNg2PM3qGo6g";
  const SHEET_NAME = "Devotionals"; // exact tab name
  const URL = `https://opensheet.elk.sh/${SHEET_ID}/${SHEET_NAME}`;

  // Show loading skeleton
  previewContainer.innerHTML = `
    <div class="skeleton skel-title"></div>
    <div class="skeleton skel-text"></div>
    <div class="skeleton skel-text short"></div>
  `;

  fetch(URL)
    .then(res => res.json())
    .then(data => {
      if (!data || data.length === 0) {
        previewContainer.innerHTML = '<p>No devotionals available yet.</p>';
        return;
      }

      // Sort by date descending and pick the latest
      const latest = data.sort((a, b) => new Date(b.date) - new Date(a.date))[0];

      previewContainer.innerHTML = `
        <h3>${latest.title}</h3>
        <div class="scripture">“${latest.scripture}” — ${latest.scripture_ref || latest.scripture}</div>
        <p>${latest.body.slice(0,200)}...</p>
        <div style="margin-top:1.5rem;">
          <a href="devotionals.html" class="btn primary">Read Full Devotional</a>
        </div>
      `;
    })
    .catch(err => {
      console.error('Devotional preview load error:', err);
      previewContainer.innerHTML = '<p>Devotional preview unavailable.</p>';
    });
});
