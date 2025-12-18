document.addEventListener('DOMContentLoaded', () => {

    // 1. Security Check
    const user = localStorage.getItem('currentUser');
    if (!user && !window.location.href.includes('index.html')) {
        // Allow browsing index, but protect catalog/product
        if(window.location.href.includes('catalog.html') || window.location.href.includes('product.html')) {
            alert("Please Login First");
            window.location.href = 'auth.html';
            return;
        }
    }

    // 2. Cart Count Init
    const cartCount = localStorage.getItem('cartCount') || 0;
    const cartDisplay = document.getElementById('cart-count');
    if(cartDisplay) cartDisplay.innerText = cartCount;

    // 3. Logout Logic
    const logoutBtn = document.getElementById('logout-btn');
    if(logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        });
    }

    // 4. Catalog Logic (Only runs if element exists)
    const grid = document.getElementById('product-grid');
    if (grid) {
        let allProducts = [];

        // Fetch Data
        fetch('../data/shoes.json')
            .then(response => response.json())
            .then(data => {
                allProducts = data;
                renderProducts(allProducts);
            })
            .catch(err => {
                grid.innerHTML = '<h3>Error loading products. Use Live Server.</h3>';
                console.error(err);
            });

        // Filter Inputs
        const searchInput = document.getElementById('search-input');
        const brandFilter = document.getElementById('brand-filter');
        const genderFilter = document.getElementById('category-filter');

        // Listeners
        [searchInput, brandFilter, genderFilter].forEach(el => {
            el.addEventListener('input', filterProducts);
        });

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
                grid.innerHTML = '<h3 style="grid-column: 1/-1; text-align:center;">No matches found.</h3>';
                return;
            }

            products.forEach(product => {
                const card = document.createElement('div');
                card.className = 'product-card';
                card.onclick = () => window.location.href = `product.html?id=${product.id}`;

                card.innerHTML = `
                    <img src="${product.image}" alt="${product.title}" class="card-image">
                    <div class="card-details">
                        <div class="card-brand">${product.brand}</div>
                        <h3 class="card-title">${product.title}</h3>
                        <div class="card-price">$${product.price}</div>
                        <span class="view-btn">VIEW DETAILS</span>
                    </div>
                `;
                grid.appendChild(card);
            });
        }
    }
});
