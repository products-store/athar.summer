// zr-express.js - نسخة محدثة
const ZR_CONFIG = {
    secretKey: 'aJE7CMeR061R2WTC6yi8sNZUr2OJDG8NazHJF13sAsxqBagL21QYn6d6AXZHZxGf',
    tenantId: '106672a4-5f7f-4e6c-acd9-59e37e5aaaf3',
    baseUrl: 'https://api.zrexpress.app'
};

async function createZRWaybill(orderData) {
    try {
        // تحويل بيانات الطلب إلى الصيغة المطلوبة من ZR Express
        const waybillData = {
            customerName: orderData.shippingInfo.fullName,
            phoneNumber: orderData.shippingInfo.phone,
            alternativePhone: orderData.shippingInfo.alternativePhone || '',
            wilaya: orderData.shippingInfo.wilaya,
            commune: orderData.shippingInfo.commune || '',
            deliveryMethod: orderData.shippingInfo.deliveryMethod,
            products: orderData.items.map(item => ({
                name: item.name,
                color: item.color,
                size: item.size,
                quantity: item.quantity,
                price: item.price
            })),
            productsTotal: orderData.productsTotal,
            deliveryCost: orderData.deliveryCost,
            totalAmount: orderData.totalAmount,
            paymentMethod: 'cashOnDelivery'
        };

        console.log('📦 إرسال البيانات إلى ZR Express:', waybillData);

        const response = await fetch(`${ZR_CONFIG.baseUrl}/api/waybills`, {
            method: 'POST',
            mode: 'cors', // إضافة mode cors
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ZR_CONFIG.secretKey}`,
                'X-Tenant-Id': ZR_CONFIG.tenantId,
                'Accept': 'application/json'
            },
            body: JSON.stringify(waybillData)
        });

        // قراءة الاستجابة حتى في حالة الخطأ
        const responseText = await response.text();
        let result;
        try {
            result = JSON.parse(responseText);
        } catch (e) {
            result = { message: responseText };
        }

        if (!response.ok) {
            console.error('❌ ZR Express API Error:', response.status, result);
            throw new Error(`فشل إنشاء بوليصة الشحن: ${response.status} - ${result.message || 'خطأ غير معروف'}`);
        }

        console.log('✅ بوليصة شحن تم إنشاؤها بنجاح:', result);
        return {
            success: true,
            data: result,
            trackingNumber: result.trackingNumber || result.waybillNumber || 'غير متوفر',
            waybillUrl: result.waybillUrl || result.url || ''
        };

    } catch (error) {
        console.error('❌ خطأ في ZR Express API:', error);
        
        // رسائل خطأ أكثر وضوحاً
        let errorMessage = error.message;
        if (error.message.includes('Failed to fetch')) {
            errorMessage = 'تعذر الاتصال بخادم ZR Express. يرجى التحقق من اتصالك بالإنترنت أو المحاولة لاحقاً.';
        } else if (error.message.includes('401')) {
            errorMessage = 'مفتاح API غير صالح. يرجى التحقق من الإعدادات.';
        } else if (error.message.includes('403')) {
            errorMessage = 'صلاحية الوصول مرفوضة. يرجى التحقق من صلاحيات المفتاح.';
        }
        
        return {
            success: false,
            error: errorMessage
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






// دالة لاختبار الاتصال بـ ZR Express
async function testZRConnection() {
    try {
        console.log('🔍 جاري اختبار الاتصال بـ ZR Express...');
        
        // محاولة الاتصال بالخادم
        const response = await fetch(`${ZR_CONFIG.baseUrl}/api/health`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${ZR_CONFIG.secretKey}`,
                'X-Tenant-Id': ZR_CONFIG.tenantId
            }
        });

        if (response.ok) {
            console.log('✅ الاتصال بـ ZR Express ناجح');
            return { success: true, message: 'الاتصال ناجح' };
        } else {
            console.error('❌ فشل الاتصال:', response.status);
            return { success: false, message: `فشل الاتصال: ${response.status}` };
        }
    } catch (error) {
        console.error('❌ خطأ في الاتصال:', error);
        return { success: false, message: error.message };
    }
}

// اختبار الاتصال عند تحميل الصفحة (للتصحيح)
// يمكنك تفعيل هذا مؤقتاً للاختبار
// testZRConnection();
