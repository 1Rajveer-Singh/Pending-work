const logoLink = document.getElementById('logo-link');
const navMenu = document.querySelector('.nav-menu');
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.nav-link'); // Can be <a> or <button>

let menuOpen = false;

// Toggle menu on logo click (for mobile)
logoLink.addEventListener('click', (e) => {
  if (window.innerWidth <= 768) {
    e.preventDefault();
    menuOpen = !menuOpen;

    navMenu.classList.toggle('active', menuOpen);
    navbar.classList.toggle('shrinked', menuOpen);
  }
});

// Handle nav link clicks
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    // If it's a button, handle JavaScript-based action
    if (link.tagName.toLowerCase() === 'button') {
      const targetUrl = link.getAttribute('data-href');
      if (targetUrl) {
        window.open(targetUrl, '_blank'); // Or use `window.location.href = targetUrl` for same-tab nav
      }
    }

    // Remove 'active' class from all nav links
    navLinks.forEach(l => l.classList.remove('active'));

    // Add 'active' to the clicked one
    link.classList.add('active');
  });
});

// Automatically highlight the active link on page load (only works for <a> tags)
window.addEventListener('load', () => {
  const currentUrl = window.location.pathname.split("/").pop();  // Get current page from URL
  navLinks.forEach(link => {
    const linkHref = link.getAttribute('href');
    
    if (linkHref) {
      const linkPath = linkHref.split("/").pop();  // Get path from the link's href

      // If it's "Home" (index.html) and it's the current page, don't add active class
      if (linkPath === "index.html" && (currentUrl === "" || currentUrl === "index.html")) {
        link.classList.remove('active');
      } else if (linkPath === currentUrl || (currentUrl === "" && linkPath === "index.html")) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    }
  });
});
