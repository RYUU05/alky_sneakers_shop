document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    let allProducts = [];
    let filteredProducts = [];

    // НАСТРОЙКИ ПАГИНАЦИИ
    const itemsPerPage = 8; // Сколько товаров на одной странице
    let currentPage = 1;

    // 1. Загрузка
    fetch('../data/shoes.json')
        .then(res => res.json())
        .then(data => {
            allProducts = data;
            filteredProducts = data; // Сначала показываем всё
            renderPage(1); // Рисуем 1 страницу
        })
        .catch(err => console.error(err));

    // 2. Фильтры
    const searchInput = document.getElementById('search-input');
    const brandFilter = document.getElementById('brand-filter');
    const genderFilter = document.getElementById('category-filter');

    if(searchInput) {
        [searchInput, brandFilter, genderFilter].forEach(el => {
            el.addEventListener('input', () => {
                filterProducts();
                currentPage = 1; // При фильтрации сбрасываем на 1 стр.
                renderPage(1);
            });
        });
    }

    function filterProducts() {
        const term = searchInput.value.toLowerCase();
        const brand = brandFilter.value;
        const gender = genderFilter.value;

        filteredProducts = allProducts.filter(product => {
            const matchesSearch = product.title.toLowerCase().includes(term);
            const matchesBrand = brand === 'all' || product.brand === brand;
            const matchesGender = gender === 'all' || product.category === gender;
            return matchesSearch && matchesBrand && matchesGender;
        });
    }

    // 3. Главная функция отрисовки страницы
    function renderPage(page) {
        grid.innerHTML = '';
        currentPage = page;

        // Вычисляем, какие товары показывать (например, с 0 по 5)
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedItems = filteredProducts.slice(start, end);

        if(paginatedItems.length === 0) {
            grid.innerHTML = '<h3>No matches found.</h3>';
            removePagination();
            return;
        }

        renderProductsHTML(paginatedItems);
        setupPagination(filteredProducts.length, page);
    }

    function renderProductsHTML(products) {
        const currentWishlist = JSON.parse(localStorage.getItem('alky_wishlist')) || [];

        products.forEach(product => {
            const isLiked = currentWishlist.some(item => item.id === product.id);
            const activeClass = isLiked ? 'active' : '';
            const productString = JSON.stringify(product).replace(/"/g, "&quot;");

            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <div style="position:relative;">
                    <button class="wishlist-btn ${activeClass}" onclick='toggleWishlist(this, ${productString})'>♥</button>
                    <div onclick="window.location.href='product.html?id=${product.id}'" style="cursor:pointer">
                        <img src="${product.image}" alt="${product.title}" class="card-image">
                    </div>
                </div>
                <div class="card-details">
                    <div class="card-brand">${product.brand}</div>
                    <h3 class="card-title" onclick="window.location.href='product.html?id=${product.id}'">${product.title}</h3>
                    <div class="card-price">$${product.price}</div>
                    <button class="view-btn" onclick='addToCart(${productString})'>ADD TO CART</button>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    // 4. Рисуем кнопки 1, 2, 3...
    function setupPagination(totalItems, activePage) {
        // Удаляем старую пагинацию если есть
        removePagination();

        const pageCount = Math.ceil(totalItems / itemsPerPage);
        if (pageCount < 2) return; // Если всего 1 страница, кнопки не нужны

        const paginationContainer = document.createElement('div');
        paginationContainer.className = 'pagination';
        paginationContainer.id = 'pagination-container';

        for (let i = 1; i <= pageCount; i++) {
            const btn = document.createElement('button');
            btn.innerText = i;
            btn.className = `page-btn ${i === activePage ? 'active' : ''}`;
            btn.addEventListener('click', () => {
                renderPage(i);
                // Плавный скролл наверх к началу товаров
                document.querySelector('.catalog-section').scrollIntoView({ behavior: 'smooth' });
            });
            paginationContainer.appendChild(btn);
        }

        // Добавляем кнопки ПОСЛЕ сетки товаров
        grid.parentNode.appendChild(paginationContainer);
    }

    function removePagination() {
        const oldPag = document.getElementById('pagination-container');
        if(oldPag) oldPag.remove();
    }
});
