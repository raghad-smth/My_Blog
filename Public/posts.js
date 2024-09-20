const createPost = (post, postContainer) => {
    const postBox = document.createElement("div");
    postBox.className = "a-post-box";
  
    postBox.innerHTML = `
          <div class="post-img">
              <img src="${post.image_url}">
          </div>
          <h2>${post.title}</h2>
          <p>${post.content} <div class="cr-link"><a href="postView.html?id=${post.id}">Continue Reading &nbsp;</a><i class="fa fa-arrow-right"></i></div></p>
      `;
    postContainer.appendChild(postBox);
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
  };
  

document.addEventListener("DOMContentLoaded", () => {
fetch("/posts/api")
.then((response) => response.json())
.then((posts) => {
  const allPostContainer = document.querySelector(".posts-wrapper");
  posts
    .forEach((post) => {
      createPost(post, allPostContainer);
      console.log(post);
    })
    .catch((error) => console.error("Error fetching posts:", error));
});
});
