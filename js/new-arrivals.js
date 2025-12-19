document.addEventListener('DOMContentLoaded', () => {
    const productGrid = document.getElementById('new-arrivals-grid');
    if (!productGrid) {
        console.error('The element with ID "new-arrivals-grid" was not found.');
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
            // Get the last 6 items from the shoes data
            const newArrivals = products.slice(-6).reverse(); // reverse to show the very last item first

            if (newArrivals.length === 0) {
                productGrid.innerHTML = '<p>No new arrivals to display at the moment.</p>';
                return;
            }

            const productsHTML = newArrivals.map(product => {
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
            productGrid.innerHTML = '<p>Could not load new arrivals. Please try again later.</p>';
        });
});
