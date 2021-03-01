const parallaxScrollUp = document.querySelectorAll('.parallax-scroll-up');
const headingPrimary = document.querySelector('.heading-primary');

document.addEventListener('scroll', () => {
    const scroll = window.scrollY;

    parallaxScrollUp.forEach(element => {
        const speed = element.getAttribute('data-speed');
        element.style.transform = `translateY(${Math.trunc(scroll * speed)}px)`;
    });

    const speed = headingPrimary.getAttribute('data-speed');
    headingPrimary.style.transform = `translate(-50%, calc(-50% + ${Math.trunc(scroll * speed)}px))`;
    headingPrimary.style.opacity = ``;
});
