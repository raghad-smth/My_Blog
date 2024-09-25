const createPost = (post, postContainer) => {
    const postBox = document.createElement("div");
    postBox.className = "a-post-box";
  
    postBox.innerHTML = `
          <div class="post-img">
              <img src="${post.image_url}">
          </div>
          <h2>${post.title}</h2>
          <p>${post.content} <div class="cr-link"><a href="/post?id=${post.id}">Continue Reading &nbsp;</a><i class="fa fa-arrow-right"></i></div></p>
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
    fetch("/api/Favposts")
      .then((response) => response.json())
      .then((posts) => {
        const postContainer = document.querySelector(".fav-posts");
        posts
          .forEach((post) => {
            createPost(post, postContainer);
          })
      })
      .catch((error) => console.error("Error fetching posts:", error));
  
   
  
    fetch("/api/latestPosts")
      .then((response) => response.json())
      .then((posts) => {
        const latestPosts = document.querySelector(".latest-posts");
        posts.forEach((post) => {
            const date = document.createElement("div");
            date.className = "post-date";
            const title = document.createElement("div");
            title.className = "post-title";
            const divider = document.createElement("div");
            const line = document.createElement("hr");
            divider.className = "hrz-line";
            divider.appendChild(line);
            date.innerHTML = `${post.created_at}`;
            title.innerHTML = `${post.title}`;
            latestPosts.appendChild(date);
            latestPosts.appendChild(title);
            latestPosts.appendChild(divider);
          })
      })
      .catch((error) => console.error("Error fetching posts:", error));

  });
  