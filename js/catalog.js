document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('product-grid');

    // Если мы не на странице каталога, выходим
    if (!grid) return;

    let allProducts = [];

    // Загрузка данных
    fetch('../data/shoes.json')
        .then(response => response.json())
        .then(data => {
            allProducts = data;
            renderProducts(allProducts);
        })
        .catch(err => {
            grid.innerHTML = '<h3 style="color:red">Ошибка загрузки. Запустите через Live Server.</h3>';
            console.error(err);
        });

    // Фильтры
    const searchInput = document.getElementById('search-input');
    const brandFilter = document.getElementById('brand-filter');
    const genderFilter = document.getElementById('category-filter');

    if(searchInput) {
        [searchInput, brandFilter, genderFilter].forEach(el => {
            el.addEventListener('input', filterProducts);
        });
    }

    function filterProducts() {
        const term = searchInput.value.toLowerCase();
        const brand = brandFilter.value;
        const gender = genderFilter.value;

        const filtered = allProducts.filter(product => {
            const matchesSearch = product.title.toLowerCase().includes(term);
            const matchesBrand = brand === 'all' || product.brand === brand;
            const matchesGender = gender === 'all' || product.category === gender;
            return matchesSearch && matchesBrand && matchesGender;
        });

        renderProducts(filtered);
    }

    function renderProducts(products) {
        grid.innerHTML = '';

        if(products.length === 0) {
            grid.innerHTML = '<h3>No matches found.</h3>';
            return;
        }

        // Получаем текущие лайки для проверки
        const currentWishlist = JSON.parse(localStorage.getItem('alky_wishlist')) || [];

        products.forEach(product => {
            // Проверяем, лайкнут ли товар
            const isLiked = currentWishlist.some(item => item.id === product.id);
            const activeClass = isLiked ? 'active' : '';

            // Объект для передачи в функции
            // Экранируем кавычки в названии, если они есть
            const productString = JSON.stringify(product).replace(/"/g, "&quot;");

            const card = document.createElement('div');
            card.className = 'product-card';

            card.innerHTML = `
                <div style="position:relative;">
                    <button class="wishlist-btn ${activeClass}" onclick='toggleWishlist(this, ${productString})'>
                        ♥
                    </button>
                    <div onclick="window.location.href='product.html?id=${product.id}'" style="cursor:pointer">
                        <img src="${product.image}" alt="${product.title}" class="card-image">
                    </div>
                </div>
                
                <div class="card-details">
                    <div class="card-brand">${product.brand}</div>
                    <h3 class="card-title" onclick="window.location.href='product.html?id=${product.id}'">${product.title}</h3>
                    <div class="card-price">$${product.price}</div>
                    <button class="view-btn" onclick='addToCart(${productString})'>
                        ADD TO CART
                    </button>
                </div>
            `;
            grid.appendChild(card);
        });
    }
});
