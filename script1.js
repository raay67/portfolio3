
window.addEventListener('load', function() {
    document.body.classList.add('bg-loaded');
});

function SendEmail() {

    let pram = {
        name: document.getElementById('name-input').value,
        email: document.getElementById('email').value,
        message: document.getElementById('information').value
    }
    const serviceID = "service_zkgdl9o"
const temp = "template_nsg4va8"
emailjs
.send(serviceID,temp,pram)

}
