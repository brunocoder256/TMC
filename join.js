// Email Form Submission
const emailForm = document.getElementById('email-form');

emailForm.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const emailInput = emailForm.querySelector('input[type="email"]');
  const email = emailInput.value.trim();

  if (!email) {
    alert('Please enter a valid email address.');
    return;
  }

  // Option 1: Simple mailto link to collect emails (can be replaced with Google Sheets later)
  const subject = encodeURIComponent("Join TMC Updates");
  const body = encodeURIComponent(`Please subscribe me to TMC updates: ${email}`);
  window.location.href = `mailto:YOUR_EMAIL@example.com?subject=${subject}&body=${body}`;

  // Optional: Reset the form
  emailForm.reset();
  alert("Thank you! Check your email to confirm subscription.");
});
