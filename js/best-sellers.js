$(function() {
    const $productGrid = $('#best-sellers-grid');
    if (!$productGrid.length) {
        console.error('The element with ID "best-sellers-grid" was not found.');
        return;
    }

    // Manually selected popular product IDs
    const popularProductIds = [2, 3, 5, 14, 21, 51]; // Jordan 1, Air Force 1, Dunk Low, Stan Smith, NB 574, Vans Old Skool

    $.getJSON('data/shoes.json', function(products) {
        const bestSellers = products.filter(product => popularProductIds.includes(product.id));

        if (bestSellers.length === 0) {
            $productGrid.html('<p>No best sellers to display at the moment.</p>');
            return;
        }

        const productsHTML = bestSellers.map(product => {
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

        $productGrid.html(productsHTML);
    }).fail(function(jqXHR, textStatus, errorThrown) {
        console.error('Error fetching or processing product data:', textStatus, errorThrown);
        $productGrid.html('<p>Could not load best sellers. Please try again later.</p>');
    });
});
