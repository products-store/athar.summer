// zr-express.js - ملف لتكامل ZR Express API

// تكوين API - سيتم إدخال القيم يدوياً
const ZR_CONFIG = {
    secretKey: 'aJE7CMeR061R2WTC6yi8sNZUr2OJDG8NazHJF13sAsxqBagL21QYn6d6AXZHZxGf', // ضع الـ secretKey الخاص بك هنا
    tenantId: '106672a4-5f7f-4e6c-acd9-59e37e5aaaf3',   // ضع الـ tenantId الخاص بك هنا
    baseUrl: 'https://api.zrexpress.app'
};

// دالة لإنشاء بوليصة شحن في ZR Express
async function createZRWaybill(orderData) {
    try {
        // تحويل بيانات الطلب إلى الصيغة المطلوبة من ZR Express
        const waybillData = {
            // معلومات العميل
            customerName: orderData.shippingInfo.fullName,
            phoneNumber: orderData.shippingInfo.phone,
            alternativePhone: orderData.shippingInfo.alternativePhone || '',
            
            // معلومات الشحن
            wilaya: orderData.shippingInfo.wilaya,
            commune: orderData.shippingInfo.commune || '',
            deliveryMethod: orderData.shippingInfo.deliveryMethod, // 'home' or 'office'
            
            // معلومات المنتجات
            products: orderData.items.map(item => ({
                name: item.name,
                color: item.color,
                size: item.size,
                quantity: item.quantity,
                price: item.price
            })),
            
            // المبالغ
            productsTotal: orderData.productsTotal,
            deliveryCost: orderData.deliveryCost,
            totalAmount: orderData.totalAmount,
            
            // طريقة الدفع
            paymentMethod: 'cashOnDelivery'
        };

        // إرسال الطلب إلى ZR Express API
        const response = await fetch(`${ZR_CONFIG.baseUrl}/api/waybills`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ZR_CONFIG.secretKey}`,
                'X-Tenant-Id': ZR_CONFIG.tenantId
            },
            body: JSON.stringify(waybillData)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('ZR Express API Error:', response.status, errorData);
            throw new Error(`فشل إنشاء بوليصة الشحن: ${response.status} - ${errorData.message || 'خطأ غير معروف'}`);
        }

        const result = await response.json();
        console.log('✅ بوليصة شحن تم إنشاؤها بنجاح:', result);
        return {
            success: true,
            data: result,
            trackingNumber: result.trackingNumber || result.waybillNumber || 'غير متوفر'
        };

    } catch (error) {
        console.error('❌ خطأ في ZR Express API:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// دالة للتحقق من صحة التوكن
async function validateZRToken() {
    try {
        const response = await fetch(`${ZR_CONFIG.baseUrl}/api/auth/validate`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${ZR_CONFIG.secretKey}`,
                'X-Tenant-Id': ZR_CONFIG.tenantId
            }
        });
        
        if (response.ok) {
            console.log('✅ توكن ZR Express صالح');
            return true;
        } else {
            console.error('❌ توكن ZR Express غير صالح');
            return false;
        }
    } catch (error) {
        console.error('❌ فشل التحقق من التوكن:', error);
        return false;
    }
}