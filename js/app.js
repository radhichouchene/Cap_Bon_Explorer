// app.js : formulaire de contact (page contact.html)
const contactForm = document.getElementById("contact-form");
const confirmation = document.getElementById("confirmation");

contactForm.addEventListener("submit", function (event) {
    event.preventDefault();                   
    confirmation.style.display = "block";        
    contactForm.reset();                         
});
