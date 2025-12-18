document.addEventListener('DOMContentLoaded', () => {
    const loginContainer = document.getElementById('login-container');
    const signupContainer = document.getElementById('signup-container');
    const showSignup = document.getElementById('show-signup');
    const showLogin = document.getElementById('show-login');

    // Toggle logic
    showSignup.addEventListener('click', (e) => {
        e.preventDefault();
        loginContainer.classList.remove('active');
        signupContainer.classList.add('active');
    });

    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        signupContainer.classList.remove('active');
        loginContainer.classList.add('active');
    });

    // --- REGISTRATION LOGIC ---
    const signupForm = document.getElementById('signup-form');
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;
        
        // Get existing users or create new array
        let users = JSON.parse(localStorage.getItem('alky_users')) || [];

        // Check if email already registered
        if (users.some(user => user.email === email)) {
            document.getElementById('email-error').textContent = "Email already exists!";
            return;
        }

        // Save new user
        users.push({ name, email, password });
        localStorage.setItem('alky_users', JSON.stringify(users));

        alert("Registration successful! Now you can log in.");
        signupContainer.classList.remove('active');
        loginContainer.classList.add('active');
    });

    // --- LOGIN LOGIC ---
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const loginError = document.getElementById('login-error');

        let users = JSON.parse(localStorage.getItem('alky_users')) || [];

        // Check if user exists
        const user = users.find(u => u.email === email);

        if (!user) {
            loginError.textContent = "User not found! Please register first.";
            return;
        }

        if (user.password !== password) {
            loginError.textContent = "Incorrect password!";
            return;
        }

        // Success
        localStorage.setItem('currentUser', JSON.stringify(user));
        window.location.href = 'catalog.html';
    });
});