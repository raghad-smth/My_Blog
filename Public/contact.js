const form = document.getElementById('contact-form')
const fname= document.getElementById('fname')
const lname = document.getElementById('lname')
const email = document.getElementById('email')
const  message = document.getElementById('message-box')
const errorfName = document.getElementById('error-fName')
const errorlName = document.getElementById('error-lName')
const errorMail = document.getElementById('error-mail')
const errorMsg= document.getElementById('error-msg')
const emailValidation = document.getElementById('email-validition');



form.addEventListener('submit', (e) =>{
    let valid = true;
    if (fname.value.trim() === '') {
        e.preventDefault();
        valid = false;
        errorfName.style.display = 'block';
        fname.style.border = '1.5px solid #7b1f1f';
        errorfName.innerText ='Please enter your first name !';
    }
    else{
        valid = true;
        fname.style.border = '';
        errorfName.style.display = 'none';
    }
    if (lname.value.trim() === '') {
        e.preventDefault();
        valid = false;
        errorlName.style.display = 'block';
        lname.style.border = '1.5px solid #7b1f1f';
        errorlName.innerText ='Please enter your last name !';
    }
    else{
        valid = true;
        lname.style.border = '';
        errorlName.style.display = 'none';
    }
    if (!email.checkValidity()) {
        e.preventDefault();
        valid = false;
        emailValidation.style.display = 'block';
    } else {
        valid = true;
        emailValidation.style.display = 'none'; 
    }
    if (email.value.trim() === '') {
        e.preventDefault();
        valid = false;
        errorMail.style.display = 'block';
        email.style.border = '1.5px solid #7b1f1f';
        errorMail.innerText ='Please enter your email !';
    }
    else {
        valid = true;
        email.style.border = '';
        errorMail.style.display = 'none';
    }
    if (message.value.trim() === '') {
        e.preventDefault();
        valid = false;
        errorMsg.style.display = 'block';
        message.style.border = '1.5px solid #7b1f1f';
        errorMsg.innerText ='Please write a  messege !';
    }
    else{
        valid = true;
        message.style.border = '';
        errorMsg.style.display = 'none';
    }

    if (valid){
        event.preventDefault(); 

  
        document.getElementById('fname').value = '';
        document.getElementById('lname').value = '';
        document.getElementById('email').value = '';
        document.getElementById('message-box').value = '';
    
       
        document.getElementById('thank-you-message').style.display = 'block';
       
        setTimeout(function() {
            document.getElementById('thank-you-message').style.display = 'none';
        }, 5000); 
    }
})




