document.addEventListener('DOMContentLoaded', () => {
    const productGrid = document.getElementById('collections-grid');
    if (!productGrid) {
        console.error('The element with ID "collections-grid" was not found.');
        return;
    }

    fetch('data/shoes.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(products => {
            // Sort products by brand, then by title for a consistent order
            const sortedProducts = products.sort((a, b) => {
                if (a.brand < b.brand) return -1;
                if (a.brand > b.brand) return 1;
                if (a.title < b.title) return -1;
                if (a.title > b.title) return 1;
                return 0;
            });

            if (sortedProducts.length === 0) {
                productGrid.innerHTML = '<p>There are no items in the collection to display.</p>';
                return;
            }

            const productsHTML = sortedProducts.map(product => {
                return `
                <a href="product.html?id=${product.id}" class="product-card-link">
                    <div class="product-card">
                        <img src="${product.image}" alt="${product.title}" class="card-image">
                        <div class="card-details">
                            <span class="card-brand">${product.brand}</span>
                            <h3 class="card-title">${product.title}</h3>
                            <div class="card-price">$${product.price}</div>
                        </div>
                    </div>
                </a>
                `;
            }).join('');

            productGrid.innerHTML = productsHTML;
        })
        .catch(error => {
            console.error('Error fetching or processing product data:', error);
            productGrid.innerHTML = '<p>Could not load the collection. Please try again later.</p>';
        });
});
