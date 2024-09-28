const commentBtn = document.getElementById("commetning-btn"); // Make sure the ID is correct
const form = document.getElementById("comment-form");
    
    commentBtn.addEventListener('click', (event) => {
        form.style.display = 'flex'; // Show the comment form
    });
    



function getQueryParam() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

let postId = getQueryParam();
fetch(`/post/api/${postId}`)
.then((response) => response.json())
.then((post) => {
    const postContainer = document.querySelector('.post-body-wrapper');    
    postContainer.innerHTML = `
        <div class="first-row">
              <h1 class="post-title">${post.title}</h1>
        <div class="post-img-warpper">
            <img src="${post.image_url}" alt="${post.title}">
        </div>
        </div>
      
        <div class="post-content-warapper">
                    <pre class="body-paragraph">${post.content}</pre>
        </div>
        `;
    })
    .catch((error) => console.error("Error fetching post:", error));


const commentsButton = document.getElementById('comments-btn');

commentsButton.addEventListener('click', () => {
    fetch(`/post/api/${postId}`)
    .then((response) => response.json())
    .then((post) => {
        const postContainer = document.querySelector('.post-body-wrapper');    
        postContainer.innerHTML = `
        <div class="first-row"> 
           <h1 class="post-title">${post.title}</h1>
            <div class="post-img-warpper">
                <img src="${post.image_url}" alt="${post.title}">
            </div>
        </div>
            <div class="post-content-warapper">
                <pre class="body-paragraph">${post.content}</pre>
            </div>
            <hr class="header-divider">
             
            <div class="comment-section">
                ${post.comments.length > 0 
                    ? post.comments.map(comment => `
                        <div class="comment">
                            <h4 class="user-name">${comment.name}</h4>
                            <p class="comment-content">${comment.comment}</p>
                            <div class="date">${comment.created_at.split('T')[0]}</div>
                        </div>
                    `).join('') 
                    : `<p>No comments on this post. Be the first to comment!</p>`}
            </div>
        `;
    })
    .catch((error) => console.error("Error fetching post:", error));
});


// Commetns handling 
    document.getElementById('comment-form').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the form from submitting the default way
    
        const nickname = document.getElementById('name-input').value;
        const comment = document.getElementById('comment-input').value;
        
        fetch('/api/comments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ post_id: postId, name: nickname, comment: comment })
        })
        .then(response => response.json())
        .then(data => {
            const comment = document.querySelector('.comment');
    
            const name = document.createElement('h4');
            const content = document.createElement('p');
            name.innerHTML = data.name;
            content.innerHTML = data.comment;
            comment.appendChild(name);
            comment.appendChild(content);
            
            document.getElementById('comment-form').reset();
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    });