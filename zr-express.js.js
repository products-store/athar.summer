// zr-express.js - ملف لتكامل ZR Express API (نسخة محسنة)

const ZR_CONFIG = {
    secretKey: 'aJE7CMeR061R2WTC6yi8sNZUr2OJDG8NazHJF13sAsxqBagL21QYn6d6AXZHZxGf',
    tenantId: '106672a4-5f7f-4e6c-acd9-59e37e5aaaf3',
    baseUrl: 'https://api.zrexpress.app'
};

/**
 * إنشاء بوليصة شحن في ZR Express
 * @param {Object} orderData - بيانات الطلب
 * @returns {Promise<Object>} - نتيجة العملية
 */
async function createZRWaybill(orderData) {
    try {
        // التحقق من صحة البيانات الأساسية
        if (!orderData.shippingInfo) {
            throw new Error('معلومات الشحن مطلوبة');
        }
        
        if (!orderData.items || orderData.items.length === 0) {
            throw new Error('يجب أن يحتوي الطلب على منتج واحد على الأقل');
        }

        // بناء بيانات الطلب وفقاً لمتطلبات ZR Express
        const waybillData = {
            // معلومات العميل
            customerName: orderData.shippingInfo.fullName || '',
            phoneNumber: orderData.shippingInfo.phone || '',
            alternativePhone: orderData.shippingInfo.alternativePhone || '',
            
            // معلومات العنوان
            wilaya: orderData.shippingInfo.wilaya || '',
            commune: orderData.shippingInfo.commune || '',
            deliveryMethod: orderData.shippingInfo.deliveryMethod || 'office', // 'home' or 'office'
            addressDetails: orderData.shippingInfo.addressDetails || '',
            
            // معلومات المنتجات - تأكد من أن المنتجات تحتوي على جميع الحقول المطلوبة
            products: orderData.items.map(item => ({
                name: item.name || 'منتج',
                color: item.color || '',
                size: item.size || '',
                quantity: parseInt(item.quantity) || 1,
                price: parseFloat(item.price) || 0,
                // إضافة أي حقول إضافية مطلوبة
                productId: item.id || '',
                description: item.description || ''
            })),
            
            // المبالغ المالية
            productsTotal: parseFloat(orderData.productsTotal) || 0,
            deliveryCost: parseFloat(orderData.deliveryCost) || 0,
            totalAmount: parseFloat(orderData.totalAmount) || 0,
            paymentMethod: orderData.shippingInfo.paymentMethod || 'cashOnDelivery',
            
            // معلومات إضافية
            orderId: orderData.id || '',
            orderDate: orderData.date || new Date().toISOString(),
            notes: orderData.notes || ''
        };

        console.log('📦 إرسال بيانات الطلب إلى ZR Express:', waybillData);

        // إرسال الطلب إلى ZR Express API
        const response = await fetch(`${ZR_CONFIG.baseUrl}/api/waybills`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ZR_CONFIG.secretKey}`,
                'X-Tenant-Id': ZR_CONFIG.tenantId,
                'Accept': 'application/json'
            },
            body: JSON.stringify(waybillData)
        });

        // قراءة الاستجابة حتى في حالة الخطأ
        let responseData;
        const responseText = await response.text();
        
        try {
            responseData = JSON.parse(responseText);
        } catch (e) {
            console.error('فشل تحليل استجابة JSON:', responseText);
            responseData = { message: responseText || 'استجابة غير صالحة' };
        }

        if (!response.ok) {
            console.error('❌ ZR Express API Error:', response.status, responseData);
            
            // رسائل خطأ مخصصة حسب كود الخطأ
            let errorMessage = 'فشل إنشاء بوليصة الشحن';
            
            if (response.status === 401) {
                errorMessage = 'مفتاح API غير صالح. يرجى التحقق من الإعدادات.';
            } else if (response.status === 403) {
                errorMessage = 'غير مصرح لك باستخدام هذا API. يرجى التحقق من الصلاحيات.';
            } else if (response.status === 404) {
                errorMessage = 'النقطة النهائية للAPI غير موجودة. يرجى التحقق من الرابط.';
            } else if (response.status === 422) {
                errorMessage = `بيانات غير صالحة: ${responseData.message || 'تحقق من صحة البيانات المدخلة'}`;
            } else if (response.status === 500) {
                errorMessage = 'خطأ في خادم ZR Express. يرجى المحاولة لاحقاً.';
            } else if (responseData.message) {
                errorMessage = responseData.message;
            }
            
            throw new Error(errorMessage);
        }

        console.log('✅ بوليصة شحن تم إنشاؤها بنجاح:', responseData);
        
        // استخراج رقم التتبع من الاستجابة
        const trackingNumber = responseData.trackingNumber || 
                             responseData.waybillNumber || 
                             responseData.number || 
                             responseData.id || 
                             'غير متوفر';

        return {
            success: true,
            data: responseData,
            trackingNumber: trackingNumber,
            waybillUrl: responseData.waybillUrl || responseData.url || '',
            status: responseData.status || 'Created'
        };

    } catch (error) {
        console.error('❌ خطأ في ZR Express API:', error);
        return {
            success: false,
            error: error.message || 'حدث خطأ غير معروف',
            details: error
        };
    }
}

/**
 * تحديث حالة بوليصة شحن في ZR Express
 * @param {string} trackingNumber - رقم التتبع
 * @param {Object} updateData - بيانات التحديث
 * @returns {Promise<Object>} - نتيجة العملية
 */
async function updateZRWaybill(trackingNumber, updateData) {
    try {
        const response = await fetch(`${ZR_CONFIG.baseUrl}/api/waybills/${trackingNumber}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ZR_CONFIG.secretKey}`,
                'X-Tenant-Id': ZR_CONFIG.tenantId
            },
            body: JSON.stringify(updateData)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'فشل تحديث بوليصة الشحن');
        }

        const result = await response.json();
        return { success: true, data: result };
    } catch (error) {
        console.error('❌ خطأ في تحديث ZR Express:', error);
        return { success: false, error: error.message };
    }
}

/**
 * التحقق من صحة توكن ZR Express
 * @returns {Promise<boolean>} - صحة التوكن
 */
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
            const errorData = await response.json().catch(() => ({}));
            console.error('❌ توكن ZR Express غير صالح:', errorData);
            return false;
        }
    } catch (error) {
        console.error('❌ فشل التحقق من التوكن:', error);
        return false;
    }
}

/**
 * الحصول على قائمة الولايات المدعومة من ZR Express
 * @returns {Promise<Array>} - قائمة الولايات
 */
async function getZRWilayas() {
    try {
        const response = await fetch(`${ZR_CONFIG.baseUrl}/api/wilayas`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${ZR_CONFIG.secretKey}`,
                'X-Tenant-Id': ZR_CONFIG.tenantId
            }
        });

        if (!response.ok) {
            throw new Error('فشل الحصول على قائمة الولايات');
        }

        const result = await response.json();
        return { success: true, data: result };
    } catch (error) {
        console.error('❌ خطأ في جلب الولايات:', error);
        return { success: false, error: error.message };
    }
}

// تصدير الدوال للاستخدام في ملفات أخرى
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        createZRWaybill,
        updateZRWaybill,
        validateZRToken,
        getZRWilayas,
        ZR_CONFIG
    };
}
