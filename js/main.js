document.addEventListener('DOMContentLoaded', () => {
    initAuth();
    initCart();

    // --- 1. МОБИЛЬНОЕ МЕНЮ (БУРГЕР) ---
    const burger = document.getElementById('burger-menu');
    const nav = document.getElementById('nav-links');

    if(burger && nav) {
        burger.addEventListener('click', () => {
            // Включаем/выключаем меню
            nav.classList.toggle('nav-active');
            // Анимация превращения в крестик
            burger.classList.toggle('toggle');
        });
    }

    // --- 2. ТЕМНАЯ ТЕМА ---
    const themeBtn = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;

    // Проверяем сохраненную тему
    const savedTheme = localStorage.getItem('alky_theme');
    if(savedTheme) {
        htmlEl.setAttribute('data-theme', savedTheme);
        if(savedTheme === 'dark') themeBtn.innerText = '☀️';
    }

    themeBtn.addEventListener('click', () => {
        const currentTheme = htmlEl.getAttribute('data-theme');
        if(currentTheme === 'dark') {
            htmlEl.setAttribute('data-theme', 'light');
            themeBtn.innerText = '🌙';
            localStorage.setItem('alky_theme', 'light');
        } else {
            htmlEl.setAttribute('data-theme', 'dark');
            themeBtn.innerText = '☀️';
            localStorage.setItem('alky_theme', 'dark');
        }
    });
    // Вставляем HTML для уведомлений в body
    const toastHTML = `
        <div id="toast" class="toast-notification">
            <span class="toast-icon">✔</span>
            <span id="toast-msg">Item added successfully</span>
        </div>`;
    document.body.insertAdjacentHTML('beforeend', toastHTML);
});

// --- AUTH LOGIC ---
function initAuth() {
    const user = JSON.parse(localStorage.getItem('currentUser'));

    const guestLinks = document.querySelectorAll('.guest-only');
    const userLinks = document.querySelectorAll('.user-only'); // Сюда теперь входит и корзина, если ты добавил класс в HTML
    const userNameDisplay = document.getElementById('user-name-display');

    if (user) {
        // ЕСЛИ ВОШЕЛ
        guestLinks.forEach(el => el.style.display = 'none');
        userLinks.forEach(el => {
            // Восстанавливаем display (для li это обычно list-item или block)
            el.style.display = 'block';
        });
        if(userNameDisplay) userNameDisplay.textContent = `Hi, ${user.name.split(' ')[0]}`;
        // Внутри initAuth() если пользователь вошел:

        if(userNameDisplay) {
            userNameDisplay.textContent = `Hi, ${user.name.split(' ')[0]}`;
            // Сделаем имя кликабельным — переход в профиль
            userNameDisplay.href = "profile.html";
        }
    } else {
        // ЕСЛИ НЕ ВОШЕЛ
        guestLinks.forEach(el => el.style.display = 'block');
        userLinks.forEach(el => el.style.display = 'none'); // Скрываем корзину и профиль
    }

    // Логика выхода
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        });
    }
}

// --- CART LOGIC ---
let cart = JSON.parse(localStorage.getItem('alky_cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('alky_wishlist')) || [];

function initCart() {
    updateCartCounter();
    renderCartDrawer();

    const openBtn = document.getElementById('open-cart-btn');
    const overlay = document.getElementById('cart-overlay');
    const drawer = document.getElementById('cart-drawer');
    const closeBtn = document.getElementById('close-cart');

    if(openBtn) {
        openBtn.addEventListener('click', (e) => {
            e.preventDefault();
            drawer.classList.add('open');
            overlay.classList.add('open');
        });
    }

    function closeCart() {
        drawer.classList.remove('open');
        overlay.classList.remove('open');
    }

    if(closeBtn) closeBtn.addEventListener('click', closeCart);
    if(overlay) overlay.addEventListener('click', closeCart);
}

// --- CORE FUNCTIONS ---

// 1. Показать уведомление (Красивая модалка)
function showToast(message) {
    const toast = document.getElementById('toast');
    const msg = document.getElementById('toast-msg');
    msg.textContent = message;
    toast.classList.add('active');
    setTimeout(() => {
        toast.classList.remove('active');
    }, 3000);
}

// 2. Добавить в корзину
function addToCart(productObj) {
    // 1. ПРОВЕРКА: ВОШЕЛ ЛИ ПОЛЬЗОВАТЕЛЬ?
    const user = localStorage.getItem('currentUser');

    if (!user) {
        // Если не вошел
        if(confirm("To add items to cart, you need to Login first. Go to Login?")) {
            window.location.href = 'auth.html';
        }
        return; // Останавливаем функцию
    }

    // 2. Если вошел, продолжаем как обычно
    const existingItem = cart.find(item => item.id === productObj.id);
    if (existingItem) {
        existingItem.qty++;
    } else {
        cart.push({ ...productObj, qty: 1 });
    }
    saveCart();
    updateCartCounter();
    renderCartDrawer();
    showToast(`${productObj.title} added to cart!`);
}

// 3. Лайкнуть товар
function toggleWishlist(btn, productObj) {
    // Остановить всплытие клика, чтобы не переходить на страницу товара
    event.stopPropagation();

    const index = wishlist.findIndex(item => item.id === productObj.id);
    if (index === -1) {
        wishlist.push(productObj);
        btn.classList.add('active');
        showToast("Added to Wishlist ❤️");
    } else {
        wishlist.splice(index, 1);
        btn.classList.remove('active');
        showToast("Removed from Wishlist 💔");
    }
    localStorage.setItem('alky_wishlist', JSON.stringify(wishlist));
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartCounter();
    renderCartDrawer();
}

function saveCart() {
    localStorage.setItem('alky_cart', JSON.stringify(cart));
}

function updateCartCounter() {
    const count = cart.reduce((acc, item) => acc + item.qty, 0);
    document.querySelectorAll('#cart-count').forEach(el => el.textContent = count);
    const drawerCount = document.getElementById('drawer-count');
    if(drawerCount) drawerCount.textContent = count;
}

function renderCartDrawer() {
    const container = document.getElementById('cart-items');
    const totalPriceEl = document.getElementById('cart-total-price');
    if (!container) return;

    container.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        container.innerHTML = '<p class="empty-msg" style="text-align:center; padding:2rem;">Cart is empty.</p>';
        if(totalPriceEl) totalPriceEl.textContent = '$0';
        return;
    }

    cart.forEach(item => {
        total += item.price * item.qty;
        const div = document.createElement('div');
        div.className = 'cart-item-card';
        div.innerHTML = `
            <img src="${item.image}" class="cart-item-img">
            <div class="cart-item-info">
                <h4>${item.title}</h4>
                <div class="cart-item-price">$${item.price} x ${item.qty}</div>
                <button class="remove-item-btn" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `;
        container.appendChild(div);
    });

    if(totalPriceEl) totalPriceEl.textContent = '$' + total.toFixed(2);
}

// Переход к оформлению
function checkout() {
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) {
        alert("Please login first!");
        window.location.href = 'auth.html';
        return;
    }

    if (cart.length === 0) {
        showToast("Cart is empty!");
        return;
    }

    // --- ЛОГИКА СОХРАНЕНИЯ ЗАКАЗА ---
    const user = JSON.parse(userStr);
    const orderData = {
        id: '#' + Date.now().toString().slice(-6), // Генерируем ID заказа
        date: new Date().toLocaleDateString(),
        total: cart.reduce((sum, item) => sum + (item.price * item.qty), 0),
        items: cart // Сохраняем копию товаров
    };

    // Получаем старые заказы этого юзера или создаем пустой массив
    let userOrders = JSON.parse(localStorage.getItem(`orders_${user.email}`)) || [];
    userOrders.push(orderData);
    localStorage.setItem(`orders_${user.email}`, JSON.stringify(userOrders));

    // Очистка и редирект
    cart = [];
    saveCart();
    updateCartCounter();
    renderCartDrawer();

    alert("✅ Order Placed Successfully! Check your Profile for history.");
    window.location.href = 'profile.html'; // Отправляем в профиль
}

window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.checkout = checkout;
window.toggleWishlist = toggleWishlist;
