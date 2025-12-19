document.addEventListener('DOMContentLoaded', () => {
    const productGrid = document.getElementById('sale-grid');
    if (!productGrid) {
        console.error('The element with ID "sale-grid" was not found.');
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
            // Sort products by price in descending order and take the top 3
            const topThreeMostExpensive = products
                .sort((a, b) => b.price - a.price)
                .slice(0, 3);

            if (topThreeMostExpensive.length === 0) {
                productGrid.innerHTML = '<p>No items to display at the moment.</p>';
                return;
            }

            const productsHTML = topThreeMostExpensive.map(product => {
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
            productGrid.innerHTML = '<p>Could not load sale items. Please try again later.</p>';
        });
});
