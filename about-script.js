// ========== دالة إظهار رسالة نجاح التحميل ==========
// هذا الملف يمكن أن يكون فارغاً إذا كنت تستخدم التحميل المباشر للـ PDF
// أو يمكنك إضافة تأثيرات إضافية هنا

// إذا أردت إضافة رسالة تأكيد عند الضغط على زر التحميل:
document.addEventListener('DOMContentLoaded', function() {
    const downloadBtn = document.querySelector('.btn-download');
    
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            // إظهار رسالة نجاح بعد ثانية واحدة
            setTimeout(() => {
                showDownloadSuccess();
            }, 1000);
        });
    }
});

// ========== دالة إظهار رسالة نجاح التحميل ==========
function showDownloadSuccess() {
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
        color: white;
        padding: 20px 40px;
        border-radius: 12px;
        font-size: 1.1em;
        font-weight: 600;
        box-shadow: 0 10px 30px rgba(40, 167, 69, 0.4);
        z-index: 9999;
        animation: slideDown 0.5s ease;
    `;
    message.textContent = '✓ جاري تحميل ملف المشروع...';
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.style.animation = 'slideUp 0.5s ease';
        setTimeout(() => {
            document.body.removeChild(message);
        }, 500);
    }, 3000);
}

// ========== إضافة CSS للأنيميشن ==========
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
    
    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
    }
`;
document.head.appendChild(style);