document.addEventListener('DOMContentLoaded', () => {
    // Discord Webhook URL - IMPORTANT: In a real production app, this should be sent from a backend server, not directly from frontend.
    const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1481703762274947106/Bda8WkM_WQyKA9_RbJBwjDoqBrl-fxxB4zYyJqApA5c1NLVQv6jc3q8yCuIqZc-afe_Y';

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

    // Data for Algerian Wilayas (Provinces) and delivery prices
    const wilayaPrices = [
        { name: 'أدرار', home: 1450, office: 1070, cancel: 200 },
        { name: 'الشلف', home: 850, office: 570, cancel: 200 },
        { name: 'الأغواط', home: 950, office: 670, cancel: 200 },
        { name: 'أم البواقي', home: 800, office: 570, cancel: 200 },
        { name: 'باتنة', home: 900, office: 570, cancel: 200 },
        { name: 'بجاية', home: 900, office: 570, cancel: 200 },
        { name: 'بسكرة', home: 950, office: 670, cancel: 200 },
        { name: 'بشار', home: 1200, office: 770, cancel: 200 },
        { name: 'البليدة', home: 700, office: 520, cancel: 200 },
        { name: 'البويرة', home: 750, office: 570, cancel: 200 },
        { name: 'تمنراست', home: 1650, office: 1270, cancel: 250 },
        { name: 'تبسة', home: 950, office: 570, cancel: 200 },
        { name: 'تلمسان', home: 900, office: 570, cancel: 200 },
        { name: 'تيارت', home: 850, office: 520, cancel: 200 },
        { name: 'تيزي وزو', home: 750, office: 570, cancel: 200 },
        { name: 'الجزائر', home: 600, office: 520, cancel: 200 },
        { name: 'الجلفة', home: 950, office: 670, cancel: 200 },
        { name: 'جيجل', home: 900, office: 570, cancel: 200 },
        { name: 'سطيف', home: 850, office: 570, cancel: 200 },
        { name: 'سعيدة', home: 900, office: 620, cancel: 200 },
        { name: 'سكيكدة', home: 900, office: 570, cancel: 200 },
        { name: 'سيدي بلعباس', home: 900, office: 570, cancel: 200 },
        { name: 'عنابة', home: 900, office: 570, cancel: 200 },
        { name: 'قالمة', home: 850, office: 570, cancel: 200 },
        { name: 'قسنطينة', home: 850, office: 570, cancel: 200 },
        { name: 'المدية', home: 850, office: 570, cancel: 200 },
        { name: 'مستغانم', home: 900, office: 570, cancel: 200 },
        { name: 'المسيلة', home: 900, office: 570, cancel: 200 },
        { name: 'معسكر', home: 900, office: 570, cancel: 200 },
        { name: 'ورقلة', home: 1000, office: 670, cancel: 200 },
        { name: 'وهران', home: 850, office: 570, cancel: 200 },
        { name: 'البيض', home: 1100, office: 670, cancel: 250 },
        { name: 'برج بوعريريج', home: 850, office: 570, cancel: 200 },
        { name: 'بومرداس', home: 500, office: 420, cancel: 200 },
        { name: 'الطارف', home: 900, office: 570, cancel: 200 },
        { name: 'تيسمسيلت', home: 900, office: 520, cancel: 200 },
        { name: 'الوادي', home: 1000, office: 670, cancel: 200 },
        { name: 'خنشلة', home: 900, office: null, cancel: 200 },
        { name: 'سوق أهراس', home: 900, office: 570, cancel: 200 },
        { name: 'تيبازة', home: 800, office: 570, cancel: 200 },
        { name: 'ميلة', home: 900, office: 570, cancel: 200 },
        { name: 'عين الدفلى', home: 900, office: 570, cancel: 200 },
        { name: 'النعامة', home: 1200, office: 670, cancel: 200 },
        { name: 'عين تموشنت', home: 900, office: 570, cancel: 200 },
        { name: 'غرداية', home: 950, office: 670, cancel: 200 },
        { name: 'غليزان', home: 900, office: 570, cancel: 200 },
        { name: 'تيميمون', home: 1450, office: 1070, cancel: 250 },
        { name: 'أولاد جلال', home: 950, office: 670, cancel: 200 },
        { name: 'بني عباس', home: 1100, office: 1070, cancel: 250 },
        { name: 'عين صالح', home: 1650, office: null, cancel: 250 },
        { name: 'عين قزام', home: 1650, office: null, cancel: 250 },
        { name: 'تقرت', home: 950, office: 670, cancel: 250 },
        { name: 'المغير', home: 950, office: null, cancel: 200 },
        { name: 'المنيعة', home: 1100, office: null, cancel: 200 }
    ];

    // --- DOM Elements ---
    const shippingForm = document.getElementById('shipping-form');
    const fullNameInput = document.getElementById('fullName');
    const phoneInput = document.getElementById('phone');
    const alternativePhoneInput = document.getElementById('alternativePhone');
    const wilayaSelect = document.getElementById('wilaya');
    const deliveryMethodRadios = document.querySelectorAll('input[name="deliveryMethod"]');
    const deliveryToOfficeRadio = document.getElementById('deliveryToOffice');
    const deliveryToHomeRadio = document.getElementById('deliveryToHome');
    const communeGroup = document.getElementById('commune-group');
    const communeInput = document.getElementById('commune');
    const productsSubtotalElement = document.getElementById('products-subtotal');
    const deliveryPriceElement = document.getElementById('delivery-price');
    const orderGrandTotalElement = document.getElementById('order-grand-total');

    // --- Load Cart from localStorage ---
    let cart = JSON.parse(localStorage.getItem('qudwahCart')) || [];

    // دالة لحساب إجمالي عدد القطع في السلة
    const getTotalQuantity = () => {
        return cart.reduce((sum, item) => sum + item.quantity, 0);
    };

    // --- State Variables ---
    let productsTotalPrice = 0;
    let currentDeliveryPrice = 0;
    let selectedWilayaData = null;
    let selectedDeliveryMethod = 'office'; // Default delivery method

    // Redirect if cart is empty
    if (cart.length === 0) {
        alert('سلة التسوق فارغة! الرجاء إضافة منتجات قبل إتمام الشراء.');
        window.location.href = 'cart.html';
        return;
    }

    // --- Functions ---

    // Function to update cart count in header
    const updateGlobalCartCount = () => {
        const cartCountElement = document.querySelector('.cart-count');
        if (cartCountElement) {
            let totalItems = getTotalQuantity();
            cartCountElement.textContent = totalItems;
        }
    };

    // Populate Wilaya dropdown
    const populateWilayas = () => {
        wilayaPrices.forEach(wilaya => {
            const option = document.createElement('option');
            option.value = wilaya.name;
            option.textContent = wilaya.name;
            wilayaSelect.appendChild(option);
        });
    };

    // Calculate product subtotal مع التخفيض على مستوى السلة
    const calculateProductsSubtotal = () => {
        const totalQuantity = getTotalQuantity();
        const breakdown = getPriceBreakdown(totalQuantity);
        productsTotalPrice = breakdown.total;
        
        if (breakdown.isOfferApplied && breakdown.saved > 0) {
            productsSubtotalElement.innerHTML = `${breakdown.total.toLocaleString('ar-DZ')} د.ج <span style="font-size: 14px; color: #dc3545; text-decoration: line-through; margin-right: 8px;">${breakdown.regular.toLocaleString('ar-DZ')} د.ج</span> <span style="font-size: 14px; color: #28a745;">(وفرت ${breakdown.saved.toLocaleString('ar-DZ')} د.ج)</span>`;
        } else {
            productsSubtotalElement.textContent = `${breakdown.total.toLocaleString('ar-DZ')} د.ج`;
        }
        
        return productsTotalPrice;
    };

    // Calculate and update delivery price and grand total
    const updateOrderTotals = () => {
        let currentTotal = productsTotalPrice;
        currentDeliveryPrice = 0;

        if (selectedWilayaData) {
            // Check if selected delivery method is available for the wilaya
            if (selectedDeliveryMethod === 'office' && selectedWilayaData.office === null) {
                alert(`التوصيل للمكتب غير متاح في ولاية ${selectedWilayaData.name}. سيتم تحويلك إلى التوصيل للمنزل.`);
                deliveryToHomeRadio.checked = true;
                selectedDeliveryMethod = 'home';
            }

            if (selectedDeliveryMethod === 'home') {
                currentDeliveryPrice = selectedWilayaData.home;
                communeGroup.style.display = 'block';
                communeInput.setAttribute('required', 'true');
            } else {
                currentDeliveryPrice = selectedWilayaData.office;
                communeGroup.style.display = 'none';
                communeInput.removeAttribute('required');
                communeInput.value = '';
            }
        } else {
            communeGroup.style.display = 'none';
            communeInput.removeAttribute('required');
            communeInput.value = '';
        }

        currentTotal += currentDeliveryPrice;
        deliveryPriceElement.textContent = `${currentDeliveryPrice.toLocaleString('ar-DZ')} د.ج`;
        orderGrandTotalElement.textContent = `${currentTotal.toLocaleString('ar-DZ')} د.ج`;
    };

    // Send data to Discord webhook
    const sendToDiscordWebhook = async (order) => {
        // إنشاء قائمة المنتجات بشكل منظم
        const orderItemsList = order.items.map(item => 
            `${item.name} (${item.color}، ${item.size}) × ${item.quantity} = ${(item.price * item.quantity).toLocaleString('ar-DZ')} د.ج`
        ).join('\n');

        // حساب إجمالي عدد القطع والتخفيض
        const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0);
        const breakdown = getPriceBreakdown(totalQuantity);

        // تحديد طريقة التوصيل
        const deliveryMethodText = order.shippingInfo.deliveryMethod === 'home' 
            ? `التوصيل إلى المنزل (${order.shippingInfo.commune})`
            : 'التوصيل إلى مكتب البريد';

        const webhookPayload = {
            username: "ATHAR Order Bot",
            embeds: [
                {
                    title: "طلب جديد 📦",
                    color: 0x28A745,
                    fields: [
                        {
                            name: "معلومات العميل",
                            value: `**الاسم:** ${order.shippingInfo.fullName}\n**الهاتف:** ${order.shippingInfo.phone}\n**الهاتف الاحتياطي:** ${order.shippingInfo.alternativePhone}`,
                            inline: false
                        },
                        {
                            name: "معلومات التوصيل",
                            value: `**الولاية:** ${order.shippingInfo.wilaya}\n**${deliveryMethodText}**`,
                            inline: false
                        },
                        {
                            name: "المنتجات",
                            value: orderItemsList || "لا توجد منتجات",
                            inline: false
                        },
                        {
                            name: "الفاتورة",
                            value: `**عدد القطع:** ${totalQuantity}\n**المجموع الجزئي:** ${breakdown.regular.toLocaleString('ar-DZ')} د.ج\n**التخفيض:** ${breakdown.saved.toLocaleString('ar-DZ')} د.ج\n**السعر بعد التخفيض:** ${breakdown.total.toLocaleString('ar-DZ')} د.ج\n**تكلفة التوصيل:** ${order.deliveryCost.toLocaleString('ar-DZ')} د.ج\n**المجموع الكلي:** ${(breakdown.total + order.deliveryCost).toLocaleString('ar-DZ')} د.ج`,
                            inline: false
                        }
                    ],
                    timestamp: new Date().toISOString(),
                    footer: {
                        text: "ATHAR Store - " + new Date().toLocaleString('ar-DZ')
                    }
                }
            ]
        };

        try {
            const response = await fetch(DISCORD_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(webhookPayload),
            });

            if (!response.ok) {
                console.error('Failed to send webhook:', response.status, response.statusText);
                alert(`حدث خطأ أثناء إرسال الطلب (${response.status}). الرجاء المحاولة مرة أخرى أو الاتصال بالدعم.`);
                return false;
            }
            console.log('Webhook sent successfully!');
            return true;
        } catch (error) {
            console.error('Error sending webhook:', error);
            alert('حدث خطأ في الاتصال. الرجاء التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.');
            return false;
        }
    };

    // --- Event Listeners and Initial Setup ---

    // Populate wilayas on page load
    populateWilayas();

    // Initial calculation of product subtotal
    calculateProductsSubtotal();
    
    // Set initial delivery method based on radio checked state
    if (deliveryToHomeRadio.checked) {
        selectedDeliveryMethod = 'home';
    } else {
        selectedDeliveryMethod = 'office';
    }
    updateOrderTotals();

    // Event listener for wilaya selection change
    wilayaSelect.addEventListener('change', () => {
        const selectedWilayaName = wilayaSelect.value;
        selectedWilayaData = wilayaPrices.find(w => w.name === selectedWilayaName);
        updateOrderTotals();
    });

    // Event listener for delivery method change
    deliveryMethodRadios.forEach(radio => {
        radio.addEventListener('change', (event) => {
            selectedDeliveryMethod = event.target.value;
            updateOrderTotals();
        });
    });

    // Form submission
    shippingForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Basic validation
        if (!fullNameInput.value.trim()) {
            alert('الرجاء إدخال الاسم الكامل.');
            return;
        }
        if (!phoneInput.value.trim()) {
            alert('الرجاء إدخال رقم الهاتف الأساسي.');
            return;
        }
        if (phoneInput.value.trim().length < 9 || !/^\d+$/.test(phoneInput.value.trim())) {
            alert('رقم الهاتف الأساسي غير صحيح. الرجاء إدخال 9 أرقام على الأقل.');
            return;
        }
        if (alternativePhoneInput.value.trim() && (alternativePhoneInput.value.trim().length < 9 || !/^\d+$/.test(alternativePhoneInput.value.trim()))) {
            alert('رقم الهاتف الاحتياطي غير صحيح. الرجاء إدخال 9 أرقام على الأقل أو تركه فارغًا.');
            return;
        }

        if (!wilayaSelect.value) {
            alert('الرجاء اختيار الولاية.');
            return;
        }

        if (selectedDeliveryMethod === 'home' && !communeInput.value.trim()) {
            alert('الرجاء إدخال اسم البلدية للتوصيل إلى المنزل.');
            return;
        }
        
        if (!selectedWilayaData) {
            alert('الرجاء اختيار ولاية صالحة قبل تأكيد الطلب.');
            return;
        }

        // Construct shipping information
        const shippingInfo = {
            fullName: fullNameInput.value.trim(),
            phone: phoneInput.value.trim(),
            alternativePhone: alternativePhoneInput.value.trim() || 'لا يوجد',
            wilaya: wilayaSelect.value,
            deliveryMethod: selectedDeliveryMethod,
            commune: selectedDeliveryMethod === 'home' ? communeInput.value.trim() : 'غير قابل للتطبيق',
            paymentMethod: "cashOnDelivery"
        };

        // حساب إجمالي الكمية والتخفيض
        const totalQuantity = getTotalQuantity();
        const breakdown = getPriceBreakdown(totalQuantity);

        // Construct the full order object
        const order = {
            id: 'ORD-' + Date.now(),
            date: new Date().toLocaleString('ar-DZ', { timeZone: 'Africa/Algiers' }),
            shippingInfo: shippingInfo,
            items: cart,
            productsTotal: breakdown.total,
            productsRegular: breakdown.regular,
            discountSaved: breakdown.saved,
            deliveryCost: currentDeliveryPrice,
            totalAmount: breakdown.total + currentDeliveryPrice,
            status: 'Pending'
        };

        // Attempt to send to Discord
        const webhookSent = await sendToDiscordWebhook(order);

        if (webhookSent) {
            // Save the order to localStorage
            let allOrders = JSON.parse(localStorage.getItem('qudwahOrders')) || [];
            allOrders.push(order);
            localStorage.setItem('qudwahOrders', JSON.stringify(allOrders));

            // Clear the cart after placing the order
            localStorage.removeItem('qudwahCart');
            localStorage.removeItem('qudwahCartTotal');
            localStorage.removeItem('qudwahCartDiscount');
            cart = [];
            updateGlobalCartCount();

            // Meta Pixel Purchase tracking
            fbq('track', 'Purchase', {
                value: order.totalAmount,
                currency: 'DZD',
                contents: order.items.map(item => ({
                    id: item.id,
                    quantity: item.quantity,
                    item_price: item.price
                }))
            });

            // Redirect to confirmation page
            if (confirm('لقد تم استلام طلبك ، سنتصل بك للتأكيد. اضغط موافق للعودة للصفحة الرئيسية.')) {
                window.location.href = 'index.html';
            }
        }
    });

    // Load saved info if available
    const savedInfo = JSON.parse(localStorage.getItem('qudwahShippingInfo'));
    if (savedInfo) {
        fullNameInput.value = savedInfo.fullName || '';
        phoneInput.value = savedInfo.phone || '';
        alternativePhoneInput.value = savedInfo.alternativePhone || '';
        
        if (savedInfo.wilaya) {
            wilayaSelect.value = savedInfo.wilaya;
            selectedWilayaData = wilayaPrices.find(w => w.name === savedInfo.wilaya);
        }

        if (savedInfo.deliveryMethod === 'home') {
            deliveryToHomeRadio.checked = true;
            selectedDeliveryMethod = 'home';
            communeInput.value = savedInfo.commune || '';
        } else {
            deliveryToOfficeRadio.checked = true;
            selectedDeliveryMethod = 'office';
        }
        updateOrderTotals();
    } else {
        calculateProductsSubtotal();
        updateOrderTotals();
    }

    // Save info to localStorage on input change
    const saveInfoOnInput = () => {
        const currentInfo = {
            fullName: fullNameInput.value.trim(),
            phone: phoneInput.value.trim(),
            alternativePhone: alternativePhoneInput.value.trim(),
            wilaya: wilayaSelect.value,
            deliveryMethod: selectedDeliveryMethod,
            commune: communeInput.value.trim()
        };
        localStorage.setItem('qudwahShippingInfo', JSON.stringify(currentInfo));
    };

    fullNameInput.addEventListener('input', saveInfoOnInput);
    phoneInput.addEventListener('input', saveInfoOnInput);
    alternativePhoneInput.addEventListener('input', saveInfoOnInput);
    wilayaSelect.addEventListener('change', saveInfoOnInput);
    deliveryMethodRadios.forEach(radio => radio.addEventListener('change', () => {
        selectedDeliveryMethod = radio.value;
        saveInfoOnInput();
    }));
    communeInput.addEventListener('input', saveInfoOnInput);
});