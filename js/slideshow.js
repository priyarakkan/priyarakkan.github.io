
//SLIDE SHOW
const images = document.querySelectorAll('.slideshow img');
let currentIndex = 0;
images[currentIndex].classList.add('active');

setInterval(() => {
    images[currentIndex].classList.remove('active');
    currentIndex = (currentIndex + 1) % 4;
    console.log(currentIndex);
    images[currentIndex].classList.add('active');
}, 3000);


//modal
document.querySelectorAll('.imageModalContainer img').forEach(image => {
    image.addEventListener('click', () => {
        document.querySelector('.popupImage').style.display = 'block';
        document.querySelector('.popupImage img').src = image.getAttribute('src');
    })
});
document.querySelector('.popupImage span').addEventListener('click', () => {
    document.querySelector('.popupImage').style.display = 'none';
});