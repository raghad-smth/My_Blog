let navLinks = document.querySelectorAll(".nav-link")
let menueButton = document.getElementById("menu-btn");
let navBar = document.querySelector(".small-screens-nav");

menueButton.addEventListener('click', () =>{
    if(navBar.style.display === 'none'){
      navBar.style.display = 'grid';
    }
    else{
      navBar.style.display = 'none';
    }
})


navLinks.forEach((link) => {
  let currntUrl = window.location.href;
  if (link.href === currntUrl) {
    link.classList.add("current-link");
  }
});





const aboutParg = document.querySelectorAll(".animated-p");

const aboutPargObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate");
        aboutPargObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.2,
  }
);

aboutParg.forEach((el) => aboutPargObserver.observe(el));

const observer = new IntersectionObserver((enteries) => {
  enteries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    } else {
      entry.target.classList.remove("show");
    }
  });
});

const anitmatedPosts = document.querySelectorAll(".a-post-box");
anitmatedPosts.forEach((el) => observer.observe(el));

//auto type for header
var autoType = document.querySelector(".auto-type");
new Typed(autoType, {
  strings: ["Growth", "love", "Groundness"],
  typeSpeed: 60,
  backSpeed: 60,
  loop: true,
});

document.addEventListener("DOMContentLoaded", function() {
  const sparks = document.querySelector('.sparks');

  // Intersection Observer to detect when sparks are in view
  const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              sparks.classList.add('visible'); // Show sparks when in view
          } else {
              sparks.classList.remove('visible'); // Hide sparks when out of view
          }
      });
  });

  observer.observe(sparks); // Start observing the sparks element
});

