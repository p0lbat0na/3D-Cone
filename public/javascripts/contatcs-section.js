const phoneBtn = document.getElementById('phoneBtn');
const mailBtn = document.getElementById('mailBtn');
const contactsText = document.getElementById('contacts');

const phone = "8(987)291-63-53";
const mail = "arsenya.popov.03@bk.ru";

phoneBtn.addEventListener("click", event => {
   event.preventDefault();


   contactsText.innerHTML = phone;
   contactsText.style.visibility = 'visible';

})

mailBtn.addEventListener("click", event => {

   event.preventDefault();

   contactsText.innerHTML = mail;
   contactsText.style.visibility = 'visible';
})
