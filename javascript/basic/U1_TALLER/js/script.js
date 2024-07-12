document.addEventListener('DOMContentLoaded', function() {
    AOS.init();
    
    document.getElementById('down-arrow').addEventListener('click', function() {
        window.scroll({
            top: document.querySelector('section').offsetTop,
            behavior: 'smooth'
        });
    });
});
