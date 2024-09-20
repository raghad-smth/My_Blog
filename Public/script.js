const navLinks = document.querySelectorAll(".nav-link"); 
let currntUrl = window.location.href
let menueButton = document.getElementById('menu-btn');
let navBar = document.querySelector('.small-dev-menu');



navLinks.forEach(link => {
    if(link.href === currntUrl ){
        link.classList.add('current-link');
    }
});



const aboutParg = document.querySelectorAll('.animated-p');

const aboutPargObserver= new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        } else {
            entry.target.classList.remove('animate');
        }
    });
}, {
    threshold:0.2
});

aboutParg.forEach((el) =>  aboutPargObserver.observe(el));



const observer = new IntersectionObserver((enteries) =>{
    enteries.forEach((entry) =>{
        if(entry.isIntersecting){
            entry.target.classList.add('show');
        }
        else{
            entry.target.classList.remove('show');
        }
    });
});


const anitmatedPosts =  document.querySelectorAll('.a-post-box');
anitmatedPosts.forEach((el) =>  observer.observe(el));


//auto type for header 
var autoType = document.querySelector(".auto-type");
new Typed(autoType, {
    strings : ["Growth", "love", "Groundness"],
    typeSpeed : 60,
    backSpeed: 60,
    loop: true
});


//Making the img responsive to scroling 

// observe the first div 
// const prevDiv = document.querySelector('.latest-posts');
// const logoObserver = new IntersectionObserver((enteries) =>{
//     const img= document.querySelector('.logo-img');
//     enteries.forEach((entry) =>{
//         if(entry.isIntersecting){
//             if(entry.intersectionRatio >= 0.6){
//                 img.style.opacity = '0';
//             }
//             else{
//                 img.style.opacity = '1';
//             }

//         }
//     });
// });
// logoObserver.observe(prevDiv);

// observing the footer 
// const footerObserver = new IntersectionObserver((enteries) =>{
//     const footer= document.querySelector('.footer ');
//     const img= document.querySelector('.logo-img');
//     enteries.forEach((entry) =>{
//         if(entry.isIntersecting){
//             footer.style.position = 'absolute';
//             footer.style.bottom = 'unset';
            
//         }else{
//             footer.style.position = 'sticky';
//             footer.style.bottom = '0';
//         }
//     });
// }, {
//     threshold: 0.7
// });

// footerObserver.observe(prevDiv);

// function showPhoneMenu (){
//     navBar.style.display = 'block';
// }
// function hidePhoneMenu (){
//     navBar.style.display = 'none';
// }


// menueButton.addEventListener('mouseover', showPhoneMenu);
// menueButton.addEventListener('click',  hidePhoneMenu);


// posts redndring 
document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/Favposts')
        .then(response => response.json())
        .then(posts => {
            const postContainer = document.querySelector('.fav-posts');
            // postContainer.innerHTML = ''; // Clear existing content

            posts.forEach(post => {
                const postBox = document.createElement('div');
                postBox.className = 'a-post-box';

                postBox.innerHTML = `
                    <div class="post-img">
                        <img src="${post.image_url}">
                    </div>
                    <h2>${post.title}</h2>
                    <p>${post.content} <div class="cr-link"><a href="/postView.html">Continue Reading &nbsp;</a><i class="fa fa-arrow-right"></i></div></p>
                `;
                postContainer.appendChild(postBox);
                const observer = new IntersectionObserver((enteries) =>{
                    enteries.forEach((entry) =>{
                        if(entry.isIntersecting){
                            entry.target.classList.add('show');
                        }
                        else{
                            entry.target.classList.remove('show');
                        }
                    });
                });
                
                
                const anitmatedPosts =  document.querySelectorAll('.a-post-box');
                anitmatedPosts.forEach((el) =>  observer.observe(el));
            });
        })
        .catch(error => console.error('Error fetching posts:', error));
});


// /* <div class="post-date">27.Aguest.2024</div>
// <div class="post-title">The love we never had </div>
// <div class="hrz-line"><hr></div> }