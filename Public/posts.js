const createPost = (post, postContainer) => {
  const postBox = document.createElement("div");
  postBox.className = "a-post-box";

  postBox.innerHTML = `
      <div class="post-img">
          <img src="${post.image_url}">
      </div>
      <h2>${post.title}</h2>
      <p>${post.content} 
      <br>
      <span>${post.created_at}<span>
      <div class="cr-link"><a href="/post?id=${post.id}">Continue Reading &nbsp;</a><i class="fa fa-arrow-right"></i></div></p>
  `;
  postContainer.appendChild(postBox);

  const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
          if (entry.isIntersecting) {
              entry.target.classList.add("show");
          } else {
              entry.target.classList.remove("show");
          }
      });
  });

  const animatedPosts = document.querySelectorAll(".a-post-box");
  animatedPosts.forEach((el) => observer.observe(el));
};

const fetchPosts = (searchTerm = '') => {
  fetch("/posts/api")
  .then((response) => response.json())
  .then((posts) => {
      const allPostContainer = document.querySelector(".posts-wrapper");
      allPostContainer.innerHTML = ''; // Clear existing posts

      const filteredPosts = posts.filter(post => {
          return post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                 post.content.toLowerCase().includes(searchTerm.toLowerCase());
      });

      filteredPosts.forEach((post) => {
          createPost(post, allPostContainer);
      });

      // Show message if no posts match the search
      if (filteredPosts.length === 0 && searchTerm !== '') {
          allPostContainer.innerHTML = '<p>No posts found.</p>';
      }
  })
  .catch((error) => console.error("Error fetching posts:", error));
};

document.addEventListener("DOMContentLoaded", () => {
  fetchPosts(); // Fetch all posts initially

  // Real-time search functionality
  document.getElementById('search-input').addEventListener('input', () => {
      const searchTerm = document.getElementById('search-input').value;
      fetchPosts(searchTerm); // Fetch posts based on the input value
  });
});

