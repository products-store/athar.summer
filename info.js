document.addEventListener('DOMContentLoaded', () => {
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

    // --- Data for Algerian Wilayas (Provinces) and delivery prices ---
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

    // --- Load Cart from localStorage ---
    let cart = JSON.parse(localStorage.getItem('qudwahCart')) || [];

    // --- State Variables ---
    let productsTotalPrice = 0;
    let currentDeliveryPrice = 0;
    let selectedWilayaData = null;
    let selectedDeliveryMethod = 'office';

    // Redirect if cart is empty
    if (cart.length === 0) {
        alert('سلة التسوق فارغة! الرجاء إضافة منتجات قبل إتمام الشراء.');
        window.location.href = 'cart.html';
        return;
    }

    // --- Functions ---

    // Populate Wilaya dropdown
    const populateWilayas = () => {
        wilayaPrices.forEach(wilaya => {
            const option = document.createElement('option');
            option.value = wilaya.name;
            option.textContent = wilaya.name;
            wilayaSelect.appendChild(option);
        });
    };

    // Calculate product subtotal
    const calculateProductsSubtotal = () => {
        productsTotalPrice = 0;
        cart.forEach(item => {
            productsTotalPrice += item.price * item.quantity;
        });
        productsSubtotalElement.textContent = `${productsTotalPrice.toLocaleString('ar-DZ')} د.ج`;
    };

    // Calculate and update delivery price and grand total
    const updateOrderTotals = () => {
        let currentTotal = productsTotalPrice;
        currentDeliveryPrice = 0;

        if (selectedWilayaData) {
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

    // --- دالة إرسال الطلب إلى ZR Express ---
    async function sendOrderToZR(order) {
        try {
            // بناء بيانات الطلب لإرسالها إلى ZR Express
            const orderData = {
                shippingInfo: order.shippingInfo,
                items: order.items.map(item => ({
                    name: item.name,
                    color: item.color,
                    size: item.size,
                    quantity: item.quantity,
                    price: item.price
                })),
                productsTotal: order.productsTotal,
                deliveryCost: order.deliveryCost,
                totalAmount: order.totalAmount
            };

            // استدعاء الدالة من ملف zr-express.js
            const result = await createZRWaybill(orderData);
            
            if (result.success) {
                console.log('✅ تم إنشاء بوليصة الشحن بنجاح:', result);
                return { success: true, trackingNumber: result.trackingNumber };
            } else {
                console.error('❌ فشل إنشاء بوليصة الشحن:', result.error);
                return { success: false, error: result.error };
            }
        } catch (error) {
            console.error('❌ خطأ أثناء إرسال الطلب إلى ZR Express:', error);
            return { success: false, error: error.message };
        }
    }

    // --- Event Listeners and Initial Setup ---

    populateWilayas();
    calculateProductsSubtotal();

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

    // --- Form Submission مع ZR Express ---
    shippingForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        // التحقق من صحة المدخلات
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

        // بناء معلومات الشحن
        const shippingInfo = {
            fullName: fullNameInput.value.trim(),
            phone: phoneInput.value.trim(),
            alternativePhone: alternativePhoneInput.value.trim() || 'لا يوجد',
            wilaya: wilayaSelect.value,
            deliveryMethod: selectedDeliveryMethod,
            commune: selectedDeliveryMethod === 'home' ? communeInput.value.trim() : 'غير قابل للتطبيق',
            paymentMethod: 'cashOnDelivery'
        };

        // بناء الطلب
        const order = {
            id: 'ORD-' + Date.now(),
            date: new Date().toLocaleString('ar-DZ', { timeZone: 'Africa/Algiers' }),
            shippingInfo: shippingInfo,
            items: cart,
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

            // مسح السلة
            localStorage.removeItem('qudwahCart');
            cart = [];
            updateGlobalCartCount();

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

            // توجيه العميل إلى الصفحة الرئيسية
            window.location.href = 'index.html';
        } else {
            // في حالة فشل الاتصال بـ ZR Express
            alert(`❌ عذراً، حدث خطأ أثناء إنشاء بوليصة الشحن: ${zrResult.error}\nالرجاء المحاولة مرة أخرى أو الاتصال بالدعم.`);
        }
    });

    // دالة تحديث عداد السلة في الهيدر
    function updateGlobalCartCount() {
        const cartCountElement = document.querySelector('.cart-count');
        if (cartCountElement) {
            let totalItems = 0;
            cart.forEach(item => {
                totalItems += item.quantity;
            });
            cartCountElement.textContent = totalItems;
        }
    }

    // تحميل المعلومات المحفوظة
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
    }

    // حفظ المعلومات عند التغيير
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