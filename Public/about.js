const profile = document.querySelector(".profile-img");

const profileImgObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("scale");
            } else {
                entry.target.classList.remove("scale");
            }
        });
    },
    {
        threshold: 0.8,
    }
);

profileImgObserver.observe(profile);


