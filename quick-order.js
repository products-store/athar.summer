document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const quickOrderForm = document.getElementById('quick-order-form');
    const quickFullNameInput = document.getElementById('quick-fullName');
    const quickPhoneInput = document.getElementById('quick-phone');
    const quickAlternativePhoneInput = document.getElementById('quick-alternativePhone');
    const quickWilayaSelect = document.getElementById('quick-wilaya');
    const quickDeliveryMethodRadios = document.querySelectorAll('#quick-order-form input[name="deliveryMethod"]');
    const quickDeliveryToOfficeRadio = document.getElementById('quick-deliveryToOffice');
    const quickDeliveryToHomeRadio = document.getElementById('quick-deliveryToHome');
    const quickCommuneGroup = document.getElementById('quick-commune-group');
    const quickCommuneInput = document.getElementById('quick-commune');
    const quickProductsSubtotalElement = document.getElementById('quick-products-subtotal');
    const quickDeliveryPriceElement = document.getElementById('quick-delivery-price');
    const quickOrderGrandTotalElement = document.getElementById('quick-order-grand-total');
    const quantityInput = document.querySelector('.quantity-input');
    const minusBtn = document.querySelector('.quantity-btn.minus');
    const plusBtn = document.querySelector('.quantity-btn.plus');

    // --- Data for Algerian Wilayas ---
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

    // --- State Variables ---
    let productsTotalPrice = 0;
    let currentDeliveryPrice = 0;
    let selectedWilayaData = null;
    let selectedDeliveryMethod = 'office';
    const productPrice = 2900; // سعر المنتج

    // --- Functions ---

    const populateWilayas = () => {
        wilayaPrices.forEach(wilaya => {
            const option = document.createElement('option');
            option.value = wilaya.name;
            option.textContent = wilaya.name;
            quickWilayaSelect.appendChild(option);
        });
    };

    const calculateProductsSubtotal = () => {
        const quantity = parseInt(quantityInput.value) || 1;
        productsTotalPrice = productPrice * quantity;
        quickProductsSubtotalElement.textContent = `${productsTotalPrice.toLocaleString('ar-DZ')} د.ج`;
        return productsTotalPrice;
    };

    const updateOrderTotals = () => {
        let currentTotal = calculateProductsSubtotal();
        currentDeliveryPrice = 0;

        if (selectedWilayaData) {
            if (selectedDeliveryMethod === 'office' && selectedWilayaData.office === null) {
                alert(`التوصيل للمكتب غير متاح في ولاية ${selectedWilayaData.name}. سيتم تحويلك إلى التوصيل للمنزل.`);
                quickDeliveryToHomeRadio.checked = true;
                selectedDeliveryMethod = 'home';
            }

            if (selectedDeliveryMethod === 'home') {
                currentDeliveryPrice = selectedWilayaData.home;
                quickCommuneGroup.style.display = 'block';
                quickCommuneInput.setAttribute('required', 'true');
            } else {
                currentDeliveryPrice = selectedWilayaData.office;
                quickCommuneGroup.style.display = 'none';
                quickCommuneInput.removeAttribute('required');
                quickCommuneInput.value = '';
            }
        } else {
            quickCommuneGroup.style.display = 'none';
            quickCommuneInput.removeAttribute('required');
            quickCommuneInput.value = '';
        }

        currentTotal += currentDeliveryPrice;
        quickDeliveryPriceElement.textContent = `${currentDeliveryPrice.toLocaleString('ar-DZ')} د.ج`;
        quickOrderGrandTotalElement.textContent = `${currentTotal.toLocaleString('ar-DZ')} د.ج`;
    };

    const handleQuantityChange = () => {
        updateOrderTotals();
    };

// في قسم معالجة نتيجة ZR Express في info.js

if (zrResult.success) {
    // ✅ نجاح إنشاء بوليصة الشحن
    console.log('✅ بوليصة الشحن تم إنشاؤها:', zrResult.trackingNumber);
    
    // حفظ الطلب مع رقم التتبع
    let allOrders = JSON.parse(localStorage.getItem('qudwahOrders')) || [];
    allOrders.push({
        ...order,
        zrTrackingNumber: zrResult.trackingNumber,
        zrStatus: 'Created',
        zrWaybillUrl: zrResult.waybillUrl || '',
        zrData: zrResult.data || {}
    });
    localStorage.setItem('qudwahOrders', JSON.stringify(allOrders));

    // مسح السلة
    localStorage.removeItem('qudwahCart');
    cart = [];
    updateGlobalCartCount();

    // عرض رسالة نجاح مع رقم التتبع
    const trackingMsg = zrResult.waybillUrl 
        ? `رقم تتبع الشحن: ${zrResult.trackingNumber}\nرابط البوليصة: ${zrResult.waybillUrl}`
        : `رقم تتبع الشحن: ${zrResult.trackingNumber}`;
    
    alert(`✅ تم إنشاء طلبك بنجاح!\n${trackingMsg}\nسنقوم بالاتصال بك لتأكيد الطلب.`);

    // إرسال حدث Meta Pixel
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Purchase', {
            value: order.totalAmount,
            currency: 'DZD',
            contents: order.items.map(item => ({
                id: item.id,
                quantity: item.quantity,
                item_price: item.price
            }))
        });
    }

    // توجيه العميل إلى الصفحة الرئيسية
    window.location.href = 'index.html';
} else {
    // ❌ فشل إنشاء بوليصة الشحن
    console.error('❌ فشل إنشاء بوليصة الشحن:', zrResult.error);
    
    // ✅ عرض رسالة خطأ واضحة مع خيار المحاولة مرة أخرى
    const tryAgain = confirm(
        `❌ عذراً، حدث خطأ أثناء إنشاء بوليصة الشحن:\n${zrResult.error}\n\n` +
        `هل تريد المحاولة مرة أخرى؟\n` +
        `(إذا استمرت المشكلة، يرجى الاتصال بالدعم)`
    );
    
    if (tryAgain) {
        // يمكن للمستخدم المحاولة مرة أخرى
        // يمكن إعادة تشغيل العملية أو البقاء في الصفحة
    }
}

    // --- Event Listeners and Initial Setup ---

    populateWilayas();
    calculateProductsSubtotal();

    if (quickDeliveryToHomeRadio.checked) {
        selectedDeliveryMethod = 'home';
    } else {
        selectedDeliveryMethod = 'office';
    }
    updateOrderTotals();

    quickWilayaSelect.addEventListener('change', () => {
        const selectedWilayaName = quickWilayaSelect.value;
        selectedWilayaData = wilayaPrices.find(w => w.name === selectedWilayaName);
        updateOrderTotals();
    });

    quickDeliveryMethodRadios.forEach(radio => {
        radio.addEventListener('change', (event) => {
            selectedDeliveryMethod = event.target.value;
            updateOrderTotals();
        });
    });

    quantityInput.addEventListener('change', handleQuantityChange);
    quantityInput.addEventListener('input', handleQuantityChange);
    minusBtn.addEventListener('click', handleQuantityChange);
    plusBtn.addEventListener('click', handleQuantityChange);

    // --- Form Submission مع ZR Express ---
    quickOrderForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        // التحقق من صحة المدخلات
        if (!quickFullNameInput.value.trim()) {
            alert('الرجاء إدخال الاسم الكامل.');
            return;
        }
        if (!quickPhoneInput.value.trim()) {
            alert('الرجاء إدخال رقم الهاتف الأساسي.');
            return;
        }
        if (quickPhoneInput.value.trim().length < 9 || !/^\d+$/.test(quickPhoneInput.value.trim())) {
            alert('رقم الهاتف الأساسي غير صحيح. الرجاء إدخال 9 أرقام على الأقل.');
            return;
        }
        if (quickAlternativePhoneInput.value.trim() && (quickAlternativePhoneInput.value.trim().length < 9 || !/^\d+$/.test(quickAlternativePhoneInput.value.trim()))) {
            alert('رقم الهاتف الاحتياطي غير صحيح. الرجاء إدخال 9 أرقام على الأقل أو تركه فارغًا.');
            return;
        }
        if (!quickWilayaSelect.value) {
            alert('الرجاء اختيار الولاية.');
            return;
        }
        if (selectedDeliveryMethod === 'home' && !quickCommuneInput.value.trim()) {
            alert('الرجاء إدخال اسم البلدية للتوصيل إلى المنزل.');
            return;
        }
        if (!selectedWilayaData) {
            alert('الرجاء اختيار ولاية صالحة قبل تأكيد الطلب.');
            return;
        }

        // الحصول على اللون والمقاس المختارين
        const selectedColorBtn = document.querySelector('.color-btn.active');
        const selectedSizeBtn = document.querySelector('.size-btn.active');
        const selectedColor = selectedColorBtn ? selectedColorBtn.dataset.color : 'beigeclair';
        const selectedSize = selectedSizeBtn ? selectedSizeBtn.dataset.size : '52';
        const quantity = parseInt(quantityInput.value) || 1;

        const userFriendlyColor = productDetails.colors[selectedColor]?.name || selectedColor;

        // بناء معلومات الشحن
        const shippingInfo = {
            fullName: quickFullNameInput.value.trim(),
            phone: quickPhoneInput.value.trim(),
            alternativePhone: quickAlternativePhoneInput.value.trim() || 'لا يوجد',
            wilaya: quickWilayaSelect.value,
            deliveryMethod: selectedDeliveryMethod,
            commune: selectedDeliveryMethod === 'home' ? quickCommuneInput.value.trim() : 'غير قابل للتطبيق',
            paymentMethod: 'cashOnDelivery'
        };

        // بناء الطلب
        const orderItem = {
            id: `${selectedColor}-${selectedSize}`,
            name: productDetails.name,
            color: userFriendlyColor,
            size: selectedSize,
            price: productPrice,
            quantity: quantity,
            image: productDetails.colors[selectedColor]?.main || 'images/beigeclair1.webp'
        };

        const order = {
            id: 'ORD-' + Date.now(),
            date: new Date().toLocaleString('ar-DZ', { timeZone: 'Africa/Algiers' }),
            shippingInfo: shippingInfo,
            items: [orderItem],
            productsTotal: productsTotalPrice,
            deliveryCost: currentDeliveryPrice,
            totalAmount: productsTotalPrice + currentDeliveryPrice,
            status: 'Pending'
        };

        // ⭐ إرسال الطلب إلى ZR Express
        const zrResult = await sendOrderToZR(order);

        if (zrResult.success) {
            // حفظ الطلب في localStorage
            let allOrders = JSON.parse(localStorage.getItem('qudwahOrders')) || [];
            allOrders.push({
                ...order,
                zrTrackingNumber: zrResult.trackingNumber,
                zrStatus: 'Created'
            });
            localStorage.setItem('qudwahOrders', JSON.stringify(allOrders));

            // تحديث عداد السلة
            const cartCountElement = document.querySelector('.cart-count');
            if (cartCountElement) {
                cartCountElement.textContent = quantity;
            }

            // عرض رسالة نجاح مع رقم التتبع
            alert(`✅ تم إنشاء طلبك بنجاح!\nرقم تتبع الشحن: ${zrResult.trackingNumber}\nسنقوم بالاتصال بك لتأكيد الطلب.`);

            // إرسال حدث Meta Pixel
            fbq('track', 'Purchase', {
                value: order.totalAmount,
                currency: 'DZD',
                contents: order.items.map(item => ({
                    id: item.id,
                    quantity: item.quantity,
                    item_price: item.price
                }))
            });

            window.location.href = 'index.html';
        } else {
            alert(`❌ عذراً، حدث خطأ أثناء إنشاء بوليصة الشحن: ${zrResult.error}\nالرجاء المحاولة مرة أخرى أو الاتصال بالدعم.`);
        }
    });

    // تحميل المعلومات المحفوظة
    const savedInfo = JSON.parse(localStorage.getItem('qudwahShippingInfo'));
    if (savedInfo) {
        quickFullNameInput.value = savedInfo.fullName || '';
        quickPhoneInput.value = savedInfo.phone || '';
        quickAlternativePhoneInput.value = savedInfo.alternativePhone || '';
        
        if (savedInfo.wilaya) {
            quickWilayaSelect.value = savedInfo.wilaya;
            selectedWilayaData = wilayaPrices.find(w => w.name === savedInfo.wilaya);
        }

        if (savedInfo.deliveryMethod === 'home') {
            quickDeliveryToHomeRadio.checked = true;
            selectedDeliveryMethod = 'home';
            quickCommuneInput.value = savedInfo.commune || '';
        } else {
            quickDeliveryToOfficeRadio.checked = true;
            selectedDeliveryMethod = 'office';
        }
        updateOrderTotals();
    }

    // حفظ المعلومات عند التغيير
    const saveInfoOnInput = () => {
        const currentInfo = {
            fullName: quickFullNameInput.value.trim(),
            phone: quickPhoneInput.value.trim(),
            alternativePhone: quickAlternativePhoneInput.value.trim(),
            wilaya: quickWilayaSelect.value,
            deliveryMethod: selectedDeliveryMethod,
            commune: quickCommuneInput.value.trim()
        };
        localStorage.setItem('qudwahShippingInfo', JSON.stringify(currentInfo));
    };

    quickFullNameInput.addEventListener('input', saveInfoOnInput);
    quickPhoneInput.addEventListener('input', saveInfoOnInput);
    quickAlternativePhoneInput.addEventListener('input', saveInfoOnInput);
    quickWilayaSelect.addEventListener('change', saveInfoOnInput);
    quickDeliveryMethodRadios.forEach(radio => radio.addEventListener('change', () => {
        selectedDeliveryMethod = radio.value;
        saveInfoOnInput();
    }));
    quickCommuneInput.addEventListener('input', saveInfoOnInput);
});
