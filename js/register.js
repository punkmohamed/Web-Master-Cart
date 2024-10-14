let form = document.getElementById("formRegister");
let users = JSON.parse(localStorage.getItem('users')) || [];
if (!Array.isArray(users)) {
    users = [];
}

form.addEventListener('submit', (event) => {
    event.preventDefault();
    register();
});

document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', () => {
        validateField(input);
    });
});

function register() {
    const errorMessages = form.querySelectorAll('p.text-red-600');
    errorMessages.forEach(e => {
        e.innerHTML = '';
    });

    let name = document.getElementById("register-name");
    let email = document.getElementById("register-email");
    let phone = document.getElementById("register-phone");
    let password = document.getElementById("register-password");
    let conPassword = document.getElementById("register-conPassword");
    let onSubmit = document.getElementById('onSubmitMess');
    let existingUser = users.find(user => user.email === email.value);

    if (existingUser) {
        onSubmit.classList.add('bg-red-400');
        onSubmit.innerHTML = "That email already exists. Change it.";
        return;
    }

    let valid = true;
    valid = validateField(name) && valid;
    valid = validateField(email) && valid;
    valid = validateField(phone) && valid;
    valid = validateField(password) && valid;

    if (password.value !== conPassword.value) {
        let errorConPassword = document.querySelector('#register-conPassword + p');
        errorConPassword.innerHTML = 'Password must equal confirm password.';
        password.classList.add('border-red-800');
        conPassword.classList.add('border-red-800');
        valid = false;
    } else {
        conPassword.classList.remove('border-red-800');
    }

    if (valid) {
        let user = {
            id: new Date().getTime(),
            name: name.value,
            email: email.value,
            phone: phone.value,
            password: password.value
        };

        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
        onSubmit.classList.remove('bg-red-400');
        onSubmit.classList.add('bg-green-400');
        onSubmit.innerHTML = "You registered successfully! You will be redirected to login.";

        document.querySelectorAll('input').forEach(e => {
            e.value = '';
        });

        setTimeout(() => {
            window.location.href = './login.html';
        }, 1000);
    }
}

function validateField(input) {
    let errorMessage = '';
    let valid = true;

    switch (input.id) {
        case "register-name":
            if (!validateInput('name', input.value)) {
                errorMessage = 'Name must be at least 6 characters';
                valid = false;
            }
            break;
        case "register-email":
            if (!validateInput('email', input.value)) {
                errorMessage = 'Enter a valid email';
                valid = false;
            }
            break;
        case "register-phone":
            if (!validateInput('phone', input.value)) {
                errorMessage = 'Phone must be 11 numbers';
                valid = false;
            }
            break;
        case "register-password":
            if (!validateInput('password', input.value)) {
                errorMessage = 'Password must be at least 6 characters';
                valid = false;
            }
            break;
    }

    let errorElement = document.querySelector(`#${input.id} + p`);
    if (!valid) {
        errorElement.innerHTML = errorMessage;
        input.classList.add('border-red-800');
    } else {
        errorElement.innerHTML = '';
        input.classList.remove('border-red-800');
    }

    return valid;
}

function validateInput(type, input) {
    var regex = {
        name: /^[a-zA-Z]{6,}$/,
        email: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/,
        password: /^[a-zA-Z0-9!@#$%^&*]{6,16}$/,
        phone: /^\d{11}$/
    };
    return regex[type].test(input);
}
