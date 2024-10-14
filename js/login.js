let loginForm = document.getElementById("formLogin");
let users = JSON.parse(localStorage.getItem('users')) || [];
if (!Array.isArray(users)) {
    users = [];
}

loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    login();
});

document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', () => {
        validateField(input);
    });
});

function login() {
    const errorMessages = loginForm.querySelectorAll('p.text-red-600');
    errorMessages.forEach(e => {
        e.innerHTML = '';
    });
    let email = document.getElementById("login-email");
    let password = document.getElementById("login-password");
    let onSubmitMessLog = document.getElementById('onSubmitMessLog');
    let existingUser = users.find(user => user.email === email.value);

    let valid = true;
    valid = validateField(email) && valid;
    valid = validateField(password) && valid;



    if (valid && existingUser && existingUser.password === password.value) {
        localStorage.setItem('currentUser', JSON.stringify(existingUser));
        onSubmitMessLog.classList.remove('bg-red-400');
        onSubmitMessLog.classList.add('bg-green-400');
        onSubmitMessLog.innerHTML = "You logged in successfully! You will be redirected shortly to the home page.";

        document.querySelectorAll('input').forEach(e => {
            e.value = '';
        });

        setTimeout(() => {
            window.location.href = './index.html';
        }, 1000);
    } else {
        onSubmitMessLog.classList.add('bg-red-400');
        onSubmitMessLog.innerHTML = existingUser ? "Invalid password." : "Invalid email.";

    }
}

function validateField(input) {
    let errorMessage = '';
    let valid = true;

    switch (input.id) {
        case "login-email":
            if (!validateInput('email', input.value)) {
                errorMessage = 'Enter a valid email';
                valid = false;
            }
            break;
        case "login-password":
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
        email: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/,
        password: /^[a-zA-Z0-9!@#$%^&*]{6,16}$/
    };
    return regex[type].test(input);
}
