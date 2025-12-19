document.addEventListener('DOMContentLoaded', () => {
    const loginContainer = document.getElementById('login-container');
    const signupContainer = document.getElementById('signup-container');
    const showSignup = document.getElementById('show-signup');
    const showLogin = document.getElementById('show-login');

    // Переключение между Входом и Регистрацией
    if(showSignup) {
        showSignup.addEventListener('click', (e) => {
            e.preventDefault();
            loginContainer.classList.remove('active');
            signupContainer.classList.add('active');
        });
    }

    if(showLogin) {
        showLogin.addEventListener('click', (e) => {
            e.preventDefault();
            signupContainer.classList.remove('active');
            loginContainer.classList.add('active');
        });
    }

    // --- ЛОГИКА РЕГИСТРАЦИИ ---
    const signupForm = document.getElementById('signup-form');
    if(signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('reg-name').value;
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;

            let users = JSON.parse(localStorage.getItem('alky_users')) || [];

            // Проверка: есть ли такой email
            if (users.some(user => user.email === email)) {
                document.getElementById('email-error').textContent = "Email already exists!";
                return;
            }

            // Сохраняем пользователя
            users.push({ name, email, password });
            localStorage.setItem('alky_users', JSON.stringify(users));

            alert("Registration successful! Now please Log In.");

            // Переключаем на форму входа (чтобы браузер предложил сохранить пароль)
            signupContainer.classList.remove('active');
            loginContainer.classList.add('active');

            // Автозаполнение поля email для удобства
            document.getElementById('login-email').value = email;
        });
    }

    // --- ЛОГИКА ВХОДА ---
    const loginForm = document.getElementById('login-form');
    if(loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const loginError = document.getElementById('login-error');

            let users = JSON.parse(localStorage.getItem('alky_users')) || [];

            // Ищем пользователя
            const user = users.find(u => u.email === email);

            if (!user) {
                loginError.textContent = "User not found! Please register first.";
                return;
            }

            if (user.password !== password) {
                loginError.textContent = "Incorrect password!";
                return;
            }

            // Успешный вход
            localStorage.setItem('currentUser', JSON.stringify(user));

            // Редирект в профиль (или в каталог)
            window.location.href = 'profile.html';
        });
    }
});
