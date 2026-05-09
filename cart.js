document.addEventListener('DOMContentLoaded', () => {
    // --- Discount Functions - تعمل على إجمالي السلة ككل ---
    const PRODUCT_SINGLE_PRICE = 3600;
    const PRODUCT_OFFER_PRICE = 7000; // سعر القطعتين

    // دالة حساب السعر الإجمالي بناءً على العدد الإجمالي للقطع
    function calculateTotalPriceWithDiscount(totalQuantity) {
        if (totalQuantity >= 2) {
            const pairs = Math.floor(totalQuantity / 2);
            const remaining = totalQuantity % 2;
            const totalPrice = (pairs * PRODUCT_OFFER_PRICE) + (remaining * PRODUCT_SINGLE_PRICE);
            return totalPrice;
        }
        return totalQuantity * PRODUCT_SINGLE_PRICE;
    }

    // دالة للحصول على تفاصيل التخفيض بناءً على العدد الإجمالي
    function getPriceBreakdown(totalQuantity) {
        if (totalQuantity >= 2) {
            const pairs = Math.floor(totalQuantity / 2);
            const remaining = totalQuantity % 2;
            const totalPrice = (pairs * PRODUCT_OFFER_PRICE) + (remaining * PRODUCT_SINGLE_PRICE);
            const regularPrice = totalQuantity * PRODUCT_SINGLE_PRICE;
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
            total: totalQuantity * PRODUCT_SINGLE_PRICE,
            regular: totalQuantity * PRODUCT_SINGLE_PRICE,
            saved: 0,
            isOfferApplied: false,
            pairs: 0,
            remaining: totalQuantity
        };
    }

    // --- DOM Elements ---
    const cartItemsContainer = document.querySelector('.cart-items-container');
    const emptyCartMessage = document.querySelector('.empty-cart-message');
    const subtotalPriceElement = document.querySelector('.subtotal-price');
    const totalPriceElement = document.querySelector('.total-price');
    const checkoutBtn = document.querySelector('.checkout-btn');
    const cartCountElement = document.querySelector('.cart-count');

    // --- Load Cart from localStorage ---
    let cart = JSON.parse(localStorage.getItem('qudwahCart')) || [];

    // --- Functions ---

    // دالة لحساب إجمالي عدد القطع في السلة
    const getTotalQuantity = () => {
        return cart.reduce((sum, item) => sum + item.quantity, 0);
    };

    // Function to save cart to localStorage
    const saveCart = () => {
        localStorage.setItem('qudwahCart', JSON.stringify(cart));
        updateCartCount();
    };

    // Function to update cart count in header
    const updateCartCount = () => {
        const totalItems = getTotalQuantity();
        cartCountElement.textContent = totalItems;
    };

    // Function to calculate and display total prices with discount (على مستوى السلة)
    const updateCartTotals = () => {
        const totalQuantity = getTotalQuantity();
        const breakdown = getPriceBreakdown(totalQuantity);
        
        if (breakdown.isOfferApplied && breakdown.saved > 0) {
            subtotalPriceElement.innerHTML = `${breakdown.total.toLocaleString('ar-DZ')} د.ج <span style="font-size: 14px; color: #dc3545; text-decoration: line-through; margin-right: 8px;">${breakdown.regular.toLocaleString('ar-DZ')} د.ج</span> <span style="font-size: 14px; color: #28a745;">(وفرت ${breakdown.saved.toLocaleString('ar-DZ')} د.ج)</span>`;
        } else {
            subtotalPriceElement.innerHTML = `${breakdown.total.toLocaleString('ar-DZ')} د.ج`;
        }
        
        totalPriceElement.innerHTML = `${breakdown.total.toLocaleString('ar-DZ')} د.ج`;
        checkoutBtn.disabled = cart.length === 0;
        
        // حفظ السعر الإجمالي في localStorage للاستخدام في صفحات أخرى
        localStorage.setItem('qudwahCartTotal', JSON.stringify({
            total: breakdown.total,
            regular: breakdown.regular,
            saved: breakdown.saved,
            totalQuantity: totalQuantity
        }));
    };

    // Function to render cart items
    const renderCartItems = () => {
        cartItemsContainer.innerHTML = '';

        if (cart.length === 0) {
            emptyCartMessage.style.display = 'block';
            checkoutBtn.disabled = true;
        } else {
            emptyCartMessage.style.display = 'none';
            checkoutBtn.disabled = false;
            
            cart.forEach((item, index) => {
                const cartItemDiv = document.createElement('div');
                cartItemDiv.classList.add('cart-item');
                cartItemDiv.dataset.id = item.id;
                cartItemDiv.dataset.index = index;

                // حساب سعر هذا المنتج بشكل فردي (للعرض فقط)
                const itemTotal = item.price * item.quantity;
                const itemEffectivePrice = item.price;

                cartItemDiv.innerHTML = `
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <h3>${item.name}</h3>
                        <p>اللون: ${item.color}</p>
                        <p>المقاس: ${item.size}</p>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus" data-id="${item.id}" data-index="${index}">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}" data-index="${index}">
                        <button class="quantity-btn plus" data-id="${item.id}" data-index="${index}">+</button>
                    </div>
                    <span class="cart-item-price">${itemTotal.toLocaleString('ar-DZ')} د.ج</span>
                    <button class="remove-item-btn" data-id="${item.id}" data-index="${index}">&#10006;</button>
                `;
                cartItemsContainer.appendChild(cartItemDiv);
            });
            
            // إضافة ملاحظة التخفيض إذا كان هناك أكثر من قطعة
            const totalQuantity = getTotalQuantity();
            if (totalQuantity >= 2) {
                const breakdown = getPriceBreakdown(totalQuantity);
                const discountNote = document.createElement('div');
                discountNote.className = 'discount-note';
                discountNote.style.cssText = 'background-color: #e8f5e9; padding: 12px; border-radius: 8px; margin: 15px 0; text-align: center; border-right: 4px solid #28a745;';
                discountNote.innerHTML = `
                    <span style="color: #28a745; font-weight: bold;">🎉 عرض خاص مطبق!</span>
                    <span style="color: #555; margin-right: 10px;">لديك ${totalQuantity} قطعة - السعر الإجمالي: ${breakdown.total.toLocaleString('ar-DZ')} د.ج بدلاً من ${breakdown.regular.toLocaleString('ar-DZ')} د.ج (وفرت ${breakdown.saved.toLocaleString('ar-DZ')} د.ج)</span>
                `;
                // إضافة الملاحظة قبل ملخص السلة
                const cartSummary = document.querySelector('.cart-summary');
                const existingNote = document.querySelector('.discount-note');
                if (existingNote) existingNote.remove();
                cartItemsContainer.parentNode.insertBefore(discountNote, cartSummary);
            } else {
                const existingNote = document.querySelector('.discount-note');
                if (existingNote) existingNote.remove();
            }
        }
        updateCartTotals();
    };

    // --- Event Listeners ---

    // Event Listeners for quantity change and item removal
    cartItemsContainer.addEventListener('click', (event) => {
        const target = event.target;
        const itemId = target.dataset.id;
        const itemIndex = target.dataset.index;
        let itemToUpdate = cart.find(item => item.id === itemId);

        if (!itemToUpdate) return;

        if (target.classList.contains('quantity-btn')) {
            if (target.classList.contains('minus')) {
                if (itemToUpdate.quantity > 1) {
                    itemToUpdate.quantity--;
                }
            } else if (target.classList.contains('plus')) {
                itemToUpdate.quantity++;
            }
            saveCart();
            renderCartItems();
        } else if (target.classList.contains('remove-item-btn')) {
            cart = cart.filter(item => item.id !== itemId);
            saveCart();
            renderCartItems();
        }
    });

    // Event listener for manual quantity input change
    cartItemsContainer.addEventListener('change', (event) => {
        const target = event.target;
        if (target.classList.contains('quantity-input')) {
            const itemId = target.dataset.id;
            let itemToUpdate = cart.find(item => item.id === itemId);
            if (itemToUpdate) {
                let newQuantity = parseInt(target.value);
                if (isNaN(newQuantity) || newQuantity < 1) {
                    newQuantity = 1;
                }
                itemToUpdate.quantity = newQuantity;
                saveCart();
                renderCartItems();
            }
        }
    });

    // Link Checkout Button to info page
    checkoutBtn.addEventListener('click', () => {
        if (cart.length > 0) {
            const totalQuantity = getTotalQuantity();
            const breakdown = getPriceBreakdown(totalQuantity);
            
            // حفظ معلومات التخفيض في localStorage لاستخدامها في صفحة الدفع
            localStorage.setItem('qudwahCartDiscount', JSON.stringify({
                applied: breakdown.isOfferApplied,
                saved: breakdown.saved,
                regularTotal: breakdown.regular,
                discountedTotal: breakdown.total,
                totalQuantity: totalQuantity,
                singlePrice: PRODUCT_SINGLE_PRICE,
                offerPrice: PRODUCT_OFFER_PRICE
            }));
            
            // تتبع Meta Pixel لبدء عملية الشراء
            fbq('track', 'InitiateCheckout', {
                value: breakdown.total,
                currency: 'DZD',
                num_items: totalQuantity,
                contents: cart.map(item => ({
                    id: item.id,
                    quantity: item.quantity,
                    item_price: item.price
                }))
            });
            
            window.location.href = 'info.html';
        }
    });

    // --- Initial Render ---
    renderCartItems();
    updateCartCount();
});