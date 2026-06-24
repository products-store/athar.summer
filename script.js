// --- Product Data Definition ---
const productDetails = {
    name: "قميص صيفي",
    price: 2900,
    offerPrice: 5800, // سعر القطعتين مع التخفيض (2900 * 2)
    singlePrice: 2900, // سعر القطعة الواحدة
    imagePrefix: "images/shirt-",
    colors: {
        'maroonchocolate': {
            name: 'مارون شوكولا',
            main: 'images/maroonchocolate1.webp',
            thumbnails: [
                'images/maroonchocolate1.webp',
                'images/maroonchocolate2.webp',
                'images/maroonchocolate3.webp',
                'images/maroonchocolate4.webp'
            ],
            availableSizes: ['52', '54', '56', '58']
        },
        'beigeclair': {
            name: 'باج كلار',
            main: 'images/beigeclair1.webp',
            thumbnails: [
                'images/beigeclair1.webp',
                'images/beigeclair2.webp',
                'images/beigeclair3.webp',
                'images/beigeclair4.webp'
            ],
            availableSizes: ['52', '54', '56', '58']
        },
        'lightgreen': {
            name: 'اخضر فاتح',
            main: 'images/lightgreen1.webp',
            thumbnails: [
                'images/lightgreen1.webp',
                'images/lightgreen2.webp',
                'images/lightgreen3.webp',
                'images/lightgreen4.webp'
            ],
            availableSizes: ['52', '54', '56', '58']
        },
        'burgundy': {
            name: 'برغندي',
            main: 'images/burgundy1.webp',
            thumbnails: [
                'images/burgundy1.webp',
                'images/burgundy2.webp',
                'images/burgundy3.webp',
                'images/burgundy4.webp'
            ],
            availableSizes: ['52', '54', '56', '58']
        },
        'beige': {
            name: 'باج',
            main: 'images/beige1.webp',
            thumbnails: [
                'images/beige1.webp',
                'images/beige2.webp',
                'images/beige3.webp',
                'images/beige4.webp'
            ],
            availableSizes: ['52', '54', '56', '58']
        },
        'bluepetrol': {
            name: 'بلوبيترول',
            main: 'images/bluepetrol1.webp',
            thumbnails: [
                'images/bluepetrol1.webp',
                'images/bluepetrol2.webp',
                'images/bluepetrol3.webp',
                'images/bluepetrol4.webp'
            ],
            availableSizes: ['52', '54', '56', '58']
        },
        'brown': {
            name: 'بني',
            main: 'images/brown1.webp',
            thumbnails: [
                'images/brown1.webp',
                'images/brown2.webp',
                'images/brown3.webp',
                'images/brown4.webp'
            ],
            availableSizes: ['52', '54', '56', '58']
        },
        'darkgray': {
            name: 'رمادي داكن',
            main: 'images/darkgray1.webp',
            thumbnails: [
                'images/darkgray1.webp',
                'images/darkgray2.webp',
                'images/darkgray3.webp',
                'images/darkgray4.webp'
            ],
            availableSizes: ['52', '54', '56', '58']
        },
        'black': {
            name: 'اسود',
            main: 'images/black1.webp',
            thumbnails: [
                'images/black1.webp',
                'images/black2.webp',
                'images/black3.webp',
                'images/black4.webp'
            ],
            availableSizes: ['52', '54', '56', '58']
        },
        'lightblue': {
            name: 'ازرق فاتح',
            main: 'images/lightblue1.webp',
            thumbnails: [
                'images/lightblue1.webp',
                'images/lightblue2.webp',
                'images/lightblue3.webp',
                'images/lightblue4.webp'
            ],
            availableSizes: ['52', '54', '56', '58']
        },
        'sugarwhite': {
            name: 'ابيض سكري',
            main: 'images/sugarwhite1.webp',
            thumbnails: [
                'images/sugarwhite1.webp',
                'images/sugarwhite2.webp',
                'images/sugarwhite3.webp',
                'images/sugarwhite4.webp'
            ],
            availableSizes: ['52', '54', '56', '58']
        }
    }
};

const quickOrderBtn = document.querySelector('.quick-order-btn');

if (quickOrderBtn) {
    quickOrderBtn.addEventListener('click', () => {
        const quickOrderCard = document.getElementById('quick-order-card');
        if (quickOrderCard) {
            quickOrderCard.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });

            quickOrderCard.style.transition = 'all 0.5s ease';
            quickOrderCard.style.boxShadow = '0 0 0 3px rgba(0, 123, 255, 0.5)';

            setTimeout(() => {
                quickOrderCard.style.boxShadow = 'var(--box-shadow)';
            }, 1500);
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Elements ---
    const mainProductImage = document.getElementById('main-product-image');
    const thumbnailImages = document.querySelectorAll('.thumbnail-images img');
    const colorButtons = document.querySelectorAll('.color-btn');
    const sizeButtons = document.querySelectorAll('.size-btn');
    const quantityInput = document.querySelector('.quantity-input');
    const minusBtn = document.querySelector('.quantity-btn.minus');
    const plusBtn = document.querySelector('.quantity-btn.plus');
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
    const buyNowBtn = document.querySelector('.buy-now-btn');
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    const cartCountElement = document.querySelector('.cart-count');

    // --- State Variables ---
    let selectedColor = 'beige-clair';
    let selectedSize = 'S';
    let cart = JSON.parse(localStorage.getItem('qudwahCart')) || [];

    // --- Helper Functions ---

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const updateProductDisplay = (color) => {
        const colorData = productDetails.colors[color];
        if (!colorData) return;

        mainProductImage.src = colorData.main;

        thumbnailImages.forEach((thumb, index) => {
            if (colorData.thumbnails[index]) {
                thumb.src = colorData.thumbnails[index];
                thumb.style.display = 'block';
            } else {
                thumb.style.display = 'none';
            }
            thumb.classList.remove('active');
        });

        if (thumbnailImages.length > 0 && colorData.thumbnails[0]) {
            thumbnailImages[0].classList.add('active');
        }

        colorButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.color === color) btn.classList.add('active');
        });

        sizeButtons.forEach(btn => {
            const size = btn.dataset.size;
            if (colorData.availableSizes.includes(size)) {
                btn.removeAttribute('disabled');
                btn.classList.remove('disabled');
            } else {
                btn.setAttribute('disabled', 'true');
                btn.classList.add('disabled');
                btn.classList.remove('active');
            }
        });

        if (!colorData.availableSizes.includes(selectedSize)) {
            selectedSize = colorData.availableSizes[0] || '52';
            sizeButtons.forEach(btn => btn.classList.remove('active'));
            const defaultSizeBtn = document.querySelector(`.size-btn[data-size="${selectedSize}"]`);
            if (defaultSizeBtn) defaultSizeBtn.classList.add('active');
        }
    };

    const handleColorChangeWithScroll = (color) => {
        selectedColor = color;
        updateProductDisplay(color);
        setTimeout(scrollToTop, 300);
    };

    const updateGlobalCartCount = () => {
        const total = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElement.textContent = total;
    };

    const saveCartToLocalStorage = () => {
        localStorage.setItem('qudwahCart', JSON.stringify(cart));
    };


    // --- Event Listeners ---

    thumbnailImages.forEach(thumb => {
        thumb.addEventListener('click', () => {
            thumbnailImages.forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
            mainProductImage.src = thumb.src;
        });
    });

    colorButtons.forEach(button => {
        button.addEventListener('click', () => {
            const color = button.dataset.color;
            handleColorChangeWithScroll(color);
        });
    });

    sizeButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (!button.hasAttribute('disabled')) {
                sizeButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                selectedSize = button.dataset.size;
            }
        });
    });

    minusBtn.addEventListener('click', () => {
        const val = parseInt(quantityInput.value);
        if (val > 1) quantityInput.value = val - 1;
    });

    plusBtn.addEventListener('click', () => {
        const val = parseInt(quantityInput.value);
        quantityInput.value = val + 1;
    });

    quantityInput.addEventListener('change', () => {
        const val = parseInt(quantityInput.value);
        if (isNaN(val) || val < 1) quantityInput.value = 1;
    });


addToCartBtn.addEventListener('click', () => {
    const quantity = parseInt(quantityInput.value);
    const productId = `${selectedColor}-${selectedSize}`;
    const colorName = productDetails.colors[selectedColor].name;

    const existing = cart.findIndex(item => item.id === productId);
    if (existing > -1) {
        cart[existing].quantity += quantity;
    } else {
        cart.push({
            id: productId,
            name: productDetails.name,
            color: colorName,
            size: selectedSize,
            price: productDetails.price,
            quantity,
            image: productDetails.colors[selectedColor].main
        });
    }

    saveCartToLocalStorage();
    updateGlobalCartCount();

    alert(`تم إضافة ${quantity} قطعة من المنتج إلى السلة!`);
    
    // 🔥 هنا أضف كود تتبع Meta Pixel لإضافة للسلة
    fbq('track', 'AddToCart', {
        value: productDetails.price * quantity,
        currency: 'DZD',
        contents: [{
            id: productId,
            quantity: quantity,
            item_price: productDetails.price
        }]
    });
});

    // --- Initialization ---
    updateProductDisplay(selectedColor);
    updateGlobalCartCount();

});
