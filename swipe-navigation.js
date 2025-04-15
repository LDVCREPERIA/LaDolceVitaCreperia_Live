
// Page order for navigation
const pages = [
  'index.html',
  'ueber-uns.html',
  'menu.html',
  'gallery.html',
  'kontakt.html'
];

let touchStartX = 0;
let touchEndX = 0;
const swipeThreshold = 50; // Minimum swipe distance to trigger navigation

document.addEventListener('DOMContentLoaded', () => {
  // Only attach listeners to main content, not navigation elements
  const mainContent = document.querySelector('main') || document.body;

  mainContent.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, false);

  mainContent.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, false);
});

function handleSwipe() {
  const swipeDistance = touchEndX - touchStartX;
  
  // Ignore small movements
  if (Math.abs(swipeDistance) < swipeThreshold) return;
  
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const currentIndex = pages.indexOf(currentPage);
  
  if (currentIndex === -1) return;
  
  let nextIndex;
  if (swipeDistance > 0) { // Swipe right -> go back
    nextIndex = currentIndex - 1;
    if (nextIndex < 0) nextIndex = pages.length - 1; // Loop to end
  } else { // Swipe left -> go forward
    nextIndex = currentIndex + 1;
    if (nextIndex >= pages.length) nextIndex = 0; // Loop to start
  }

  // Add animation class based on swipe direction
  const content = document.querySelector('main') || document.body;
  content.classList.add(swipeDistance > 0 ? 'slide-right' : 'slide-left');
  
  // Wait for animation to complete before redirecting
  setTimeout(() => {
    window.location.href = pages[nextIndex];
  }, 150);
}
