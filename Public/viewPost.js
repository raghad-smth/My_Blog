function getQueryParam() {
    const urlParams = new URLSearchParams(window.location.search);
    console.log(urlParams.get(param))
    return urlParams.get(param);
}

const postId = getQueryParam('id');

fetch(`/post/api/${postId}`)
.then((response) =>
    {response.json();
})
.then((post) => {
    // Assuming the post object has title and content properties
    const postContainer = document.querySelector('.post-body-wrapper');
    postContainer.innerHTML = `
        <h1 class="post-title">${post.title}</h1>
        <div class="post-img-warpper">
            <img src="${post.image_url}" alt="${post.title}">
        </div>
        <p class="body-pargrap">${post.content}</p>
    `;
})
.catch((error) => console.error("Error fetching post:", error));