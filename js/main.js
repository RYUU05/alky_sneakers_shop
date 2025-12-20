document.addEventListener('DOMContentLoaded', () => {
    initAuth();
    initCart();

    // Вставляем HTML для НОВОЙ большой модалки
    const modalHTML = `
        <div id="success-modal" class="success-modal">
            <div class="modal-icon">✓</div>
            <div class="modal-text">
                <h3>ADDED TO CART</h3>
                <p id="modal-product-name">Product Name</p>
            </div>
        </div>`;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Логика Бургера
    const burger = document.getElementById('burger-menu');
    const nav = document.getElementById('nav-links');
    if(burger && nav) {
        burger.addEventListener('click', () => {
            nav.classList.toggle('nav-active');
            burger.classList.toggle('toggle');
        });
    }

    // Логика Темы
    const themeBtn = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;
    const savedTheme = localStorage.getItem('alky_theme');

    if(savedTheme) {
        htmlEl.setAttribute('data-theme', savedTheme);
        if(savedTheme === 'dark' && themeBtn) themeBtn.innerText = '☀️';
    }

    if(themeBtn) {
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
    }
});

// --- AUTH LOGIC ---
function initAuth() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const guestLinks = document.querySelectorAll('.guest-only');
    const userLinks = document.querySelectorAll('.user-only');
    const userNameDisplay = document.getElementById('user-name-display');

    if (user) {
        guestLinks.forEach(el => el.style.display = 'none');
        userLinks.forEach(el => el.style.display = 'block');
        if(userNameDisplay) {
            userNameDisplay.textContent = `Hi, ${user.name.split(' ')[0]}`;
            userNameDisplay.href = "profile.html";
        }
    } else {
        guestLinks.forEach(el => el.style.display = 'block');
        userLinks.forEach(el => el.style.display = 'none');
    }

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
            if(drawer) drawer.classList.add('open');
            if(overlay) overlay.classList.add('open');
        });
    }

    function closeCart() {
        if(drawer) drawer.classList.remove('open');
        if(overlay) overlay.classList.remove('open');
    }

    if(closeBtn) closeBtn.addEventListener('click', closeCart);
    if(overlay) overlay.addEventListener('click', closeCart);
}

// --- НОВАЯ ФУНКЦИЯ ДЛЯ БОЛЬШОЙ МОДАЛКИ ---
function showSuccessModal(productName) {
    const modal = document.getElementById('success-modal');
    const nameEl = document.getElementById('modal-product-name');

    if(modal && nameEl) {
        nameEl.textContent = productName;
        modal.classList.add('active');

        // Скрываем через 2 секунды
        setTimeout(() => {
            modal.classList.remove('active');
        }, 2000);
    } else {
        alert(productName + " added to cart!");
    }
}

// --- MAIN ACTIONS ---
function addToCart(productObj) {
    const user = localStorage.getItem('currentUser');

    // Блокировка если не вошел
    if (!user) {
        if(confirm("Please Login to start shopping.")) {
            window.location.href = 'auth.html';
        }
        return;
    }

    const existingItem = cart.find(item => item.id === productObj.id);
    if (existingItem) {
        existingItem.qty++;
    } else {
        cart.push({ ...productObj, qty: 1 });
    }

    saveCart();
    updateCartCounter();
    renderCartDrawer();

    // ВЫЗЫВАЕМ КРАСИВУЮ МОДАЛКУ
    showSuccessModal(productObj.title);
}

function toggleWishlist(btn, productObj) {
    event.stopPropagation();
    const index = wishlist.findIndex(item => item.id === productObj.id);

    if (index === -1) {
        wishlist.push(productObj);
        btn.classList.add('active');
    } else {
        wishlist.splice(index, 1);
        btn.classList.remove('active');
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
        container.innerHTML = '<p class="empty-msg" style="text-align:center; padding:2rem; color:#999;">Cart is empty.</p>';
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

// --- CHECKOUT REDIRECT ---
function checkout() {
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) {
        window.location.href = 'auth.html';
        return;
    }
    if (cart.length === 0) {
        alert("Cart is empty!");
        return;
    }
    // Переход на checkout.html
    window.location.href = 'checkout.html';
}

window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.checkout = checkout;
window.toggleWishlist = toggleWishlist;
