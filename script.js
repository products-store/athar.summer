// --- Product Data Definition ---
const productDetails = {
    name: "قميص صيفي",
    price: 3600,
    offerPrice: 7000, // سعر القطعتين مع التخفيض
    singlePrice: 3600, // سعر القطعة الواحدة
    imagePrefix: "images/shirt-",
    colors: {
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
            name: 'بلو بيترول',
            main: 'images/bluepetrol1.webp',
            thumbnails: [
                'images/bluepetrol1.webp',
                'images/bluepetrol2.webp',
                'images/bluepetrol3.webp',
                'images/bluepetrol4.webp'
            ],
            availableSizes: ['52', '54', '56', '58']
        },
        'lead': {
            name: 'رصاصي',
            main: 'images/lead1.webp',
            thumbnails: [
                'images/lead1.webp',
                'images/lead2.webp',
                'images/lead3.webp',
                'images/lead4.webp'
            ],
            availableSizes: ['52', '54', '56', '58']
        },
        'blue': {
            name: 'ازرق',
            main: 'images/blue1.webp',
            thumbnails: [
                'images/blue1.webp',
                'images/blue2.webp',
                'images/blue3.webp',
                'images/blue4.webp'
            ],
            availableSizes: ['52', '54', '56', '58']
        },
        'bluejean': {
            name: 'بلو جين',
            main: 'images/bluejean1.webp',
            thumbnails: [
                'images/bluejean1.webp',
                'images/bluejean2.webp',
                'images/bluejean3.webp',
                'images/bluejean4.webp'
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
        'darkblue': {
            name: 'ازرق داكن',
            main: 'images/darkblue1.webp',
            thumbnails: [
                'images/darkblue1.webp',
                'images/darkblue2.webp',
                'images/darkblue3.webp',
                'images/darkblue4.webp'
            ],
            availableSizes: ['52', '54', '56', '58']
        },
        'gray': {
            name: 'رمادي',
            main: 'images/gray1.webp',
            thumbnails: [
                'images/gray1.webp',
                'images/gray2.webp',
                'images/gray3.webp',
                'images/gray4.webp'
            ],
            availableSizes: ['52', '54', '56', '58']
        },
        'lightgray': {
            name: 'رمادي فاتح',
            main: 'images/lightgray1.webp',
            thumbnails: [
                'images/lightgray1.webp',
                'images/lightgray2.webp',
                'images/lightgray3.webp',
                'images/lightgray4.webp'
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
        'bluenuit': {
            name: 'بلو نوي',
            main: 'images/bluenuit1.webp',
            thumbnails: [
                'images/bluenuit1.webp',
                'images/bluenuit2.webp',
                'images/bluenuit3.webp',
                'images/bluenuit4.webp'
            ],
            availableSizes: ['52', '54', '56', '58']
        },
        'darkgray': {
            name: 'رمادي',
            main: 'images/darkgray1.webp',
            thumbnails: [
                'images/darkgray1.webp',
                'images/darkgray2.webp',
                'images/darkgray3.webp',
                'images/darkgray4.webp'
            ],
            availableSizes: ['52', '54', '56', '58']
        }
    }
};

// دالة حساب السعر بناءً على الكمية
function calculatePriceWithDiscount(quantity, singlePrice, offerPrice) {
    if (quantity >= 2) {
        // حساب عدد الأزواج (كل قطعتين بسعر 7000)
        const pairs = Math.floor(quantity / 2);
        const remaining = quantity % 2;
        const totalPrice = (pairs * offerPrice) + (remaining * singlePrice);
        return totalPrice;
    }
    return quantity * singlePrice;
}

// دالة حساب السعر مع التخفيض وعرض التفاصيل
function getPriceBreakdown(quantity) {
    const singlePrice = productDetails.singlePrice;
    const offerPrice = productDetails.offerPrice;
    
    if (quantity >= 2) {
        const pairs = Math.floor(quantity / 2);
        const remaining = quantity % 2;
        const totalPrice = (pairs * offerPrice) + (remaining * singlePrice);
        const regularPrice = quantity * singlePrice;
        const saved = regularPrice - totalPrice;
        
        return {
            total: totalPrice,
            regular: regularPrice,
            saved: saved,
            isOfferApplied: true,
            pairs: pairs,
            remaining: remaining
        };
    }
    
    return {
        total: quantity * singlePrice,
        regular: quantity * singlePrice,
        saved: 0,
        isOfferApplied: false,
        pairs: 0,
        remaining: quantity
    };
}

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
    const buyNowBtn = document.querySelector('.buy-now-btn');
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    const cartCountElement = document.querySelector('.cart-count');
    const productPriceElement = document.querySelector('.product-price');

    // --- State Variables ---
    let selectedColor = 'beige';
    let selectedSize = '52';
    let cart = JSON.parse(localStorage.getItem('qudwahCart')) || [];

    // تحديث عرض السعر بناءً على الكمية
    function updateDisplayedPrice() {
        const quantity = parseInt(quantityInput.value) || 1;
        const breakdown = getPriceBreakdown(quantity);
        
        if (breakdown.isOfferApplied && breakdown.saved > 0) {
            productPriceElement.innerHTML = `${breakdown.total.toLocaleString('ar-DZ')} د.ج <span style="font-size: 16px; color: #dc3545; text-decoration: line-through; margin-right: 10px;">${breakdown.regular.toLocaleString('ar-DZ')} د.ج</span> <span style="font-size: 14px; color: #28a745;">(وفرت ${breakdown.saved.toLocaleString('ar-DZ')} د.ج)</span>`;
        } else {
            productPriceElement.innerHTML = `${breakdown.total.toLocaleString('ar-DZ')} د.ج`;
        }
    }

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
        updateDisplayedPrice();
    });

    plusBtn.addEventListener('click', () => {
        const val = parseInt(quantityInput.value);
        quantityInput.value = val + 1;
        updateDisplayedPrice();
    });

    quantityInput.addEventListener('change', () => {
        const val = parseInt(quantityInput.value);
        if (isNaN(val) || val < 1) quantityInput.value = 1;
        updateDisplayedPrice();
    });

    addToCartBtn.addEventListener('click', () => {
        const quantity = parseInt(quantityInput.value);
        const productId = `${selectedColor}-${selectedSize}`;
        const colorName = productDetails.colors[selectedColor].name;
        
        // حساب السعر الإجمالي مع التخفيض
        const breakdown = getPriceBreakdown(quantity);
        const effectivePricePerItem = breakdown.total / quantity;

        const existing = cart.findIndex(item => item.id === productId);
        if (existing > -1) {
            cart[existing].quantity += quantity;
            // تحديث السعر الإجمالي للعنصر
            const newBreakdown = getPriceBreakdown(cart[existing].quantity);
            cart[existing].totalPrice = newBreakdown.total;
            cart[existing].effectivePricePerItem = newBreakdown.total / cart[existing].quantity;
        } else {
            cart.push({
                id: productId,
                name: productDetails.name,
                color: colorName,
                size: selectedSize,
                price: productDetails.singlePrice,
                effectivePricePerItem: effectivePricePerItem,
                quantity: quantity,
                totalPrice: breakdown.total,
                image: productDetails.colors[selectedColor].main
            });
        }

        saveCartToLocalStorage();
        updateGlobalCartCount();

        const discountMessage = breakdown.isOfferApplied ? ` (تم تطبيق عرض القطعتين: ${breakdown.total.toLocaleString('ar-DZ')} د.ج بدلاً من ${breakdown.regular.toLocaleString('ar-DZ')} د.ج)` : '';
        alert(`تم إضافة ${quantity} قطعة من المنتج إلى السلة!${discountMessage}`);
        
        fbq('track', 'AddToCart', {
            value: breakdown.total,
            currency: 'DZD',
            contents: [{
                id: productId,
                quantity: quantity,
                item_price: effectivePricePerItem
            }]
        });
    });

    // --- Initialization ---
    updateProductDisplay(selectedColor);
    updateGlobalCartCount();
    updateDisplayedPrice();

});