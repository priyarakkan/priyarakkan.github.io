
//Nav
const menu1 = document.querySelector('.menu');
const hamburger1 = document.querySelector('.hamburger');

hamburger1.addEventListener('click', () => {
    menu1.classList.toggle('menuOpen');
    hamburger1.classList.toggle('hamburgerOpen');
})

menu1.addEventListener('click', () => {
    menu1.classList.remove('menuOpen');
    hamburger1.classList.remove('hamburgerOpen');
})
