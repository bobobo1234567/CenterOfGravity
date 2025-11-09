// ========== بيانات الوصلات حسب جدول فيشر وبراون ==========
const segments = [
    { name: 'الرأس', relativeWeight: 0.07 },
    { name: 'الجذع', relativeWeight: 0.43 },
    { name: 'العضد الأيمن R', relativeWeight: 0.03 },
    { name: 'العضد الأيسر L', relativeWeight: 0.03 },
    { name: 'الساعد الأيمن R', relativeWeight: 0.02 },
    { name: 'الساعد الأيسر L', relativeWeight: 0.02 },
    { name: 'اليد اليمنى R', relativeWeight: 0.01 },
    { name: 'اليد اليسرى L', relativeWeight: 0.01 },
    { name: 'الفخذ الأيمن R', relativeWeight: 0.12 },
    { name: 'الفخذ الأيسر L', relativeWeight: 0.12 },
    { name: 'الساق اليمنى R', relativeWeight: 0.05 },
    { name: 'الساق اليسرى L', relativeWeight: 0.05 },
    { name: 'القدم اليمنى R', relativeWeight: 0.02 },
    { name: 'القدم اليسرى L', relativeWeight: 0.02 }
];

let chart = null;

// ========== تهيئة حقول الإدخال عند تحميل الصفحة ==========
document.addEventListener('DOMContentLoaded', function() {
    initializeInputs();
});

function initializeInputs() {
    const container = document.getElementById('coordinatesInputs');
    let html = '';
    
    segments.forEach((segment, index) => {
        html += `
            <div class="coordinate-row">
                <div class="col-segment">${segment.name}</div>
                <div class="col-coord" data-label="الإحداثي الأفقي X">
                    <input type="number" 
                           id="x_${index}" 
                           placeholder="0.00" 
                           step="0.01">
                </div>
                <div class="col-coord" data-label="الإحداثي الرأسي Y">
                    <input type="number" 
                           id="y_${index}" 
                           placeholder="0.00" 
                           step="0.01">
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// ========== الدالة الرئيسية لحساب مركز الثقل ==========
function calculateCOG() {
    // قراءة الوزن
    const weight = parseFloat(document.getElementById('weight').value);
    
    if (!weight || weight <= 0) {
        showError('⚠️ الرجاء إدخال وزن صحيح أكبر من صفر');
        return;
    }

    // قراءة الإحداثيات
    let hasEmptyFields = false;
    let invalidFields = [];
    
    segments.forEach((segment, index) => {
        const x = document.getElementById(`x_${index}`).value;
        const y = document.getElementById(`y_${index}`).value;
        
        if (x === '' || y === '') {
            hasEmptyFields = true;
            invalidFields.push(segment.name);
        }
        
        segment.x = parseFloat(x) || 0;
        segment.y = parseFloat(y) || 0;
    });
    
    if (hasEmptyFields) {
        showError('⚠️ الرجاء إدخال جميع الإحداثيات للوصلات');
        return;
    }

    hideError();

    // الحسابات
    let totalPx = 0;
    let totalPy = 0;
    let tableHTML = '';

    segments.forEach((segment) => {
        // حساب الوزن المطلق
        segment.absoluteWeight = weight * segment.relativeWeight;
        
        // حساب العزوم
        segment.px = segment.absoluteWeight * segment.x;
        segment.py = segment.absoluteWeight * segment.y;
        
        // جمع العزوم
        totalPx += segment.px;
        totalPy += segment.py;

        // إنشاء صف في الجدول
        tableHTML += `
            <tr>
                <td><strong>${segment.name}</strong></td>
                <td>${segment.relativeWeight.toFixed(2)}</td>
                <td>${segment.absoluteWeight.toFixed(2)}</td>
                <td>${segment.x.toFixed(2)}</td>
                <td>${segment.px.toFixed(2)}</td>
                <td>${segment.y.toFixed(2)}</td>
                <td>${segment.py.toFixed(2)}</td>
            </tr>
        `;
    });

    // حساب إحداثيات مركز الثقل النهائي
    const cgx = totalPx / weight;
    const cgy = totalPy / weight;

    // إضافة صف المجموع
    tableHTML += `
        <tr style="background: #667eea; color: white; font-weight: bold;">
            <td>المجموع</td>
            <td>1.00</td>
            <td>${weight.toFixed(2)}</td>
            <td>-</td>
            <td>${totalPx.toFixed(2)}</td>
            <td>-</td>
            <td>${totalPy.toFixed(2)}</td>
        </tr>
    `;

    // عرض النتائج
    document.getElementById('tableBody').innerHTML = tableHTML;
    document.getElementById('cgxValue').textContent = cgx.toFixed(2);
    document.getElementById('cgyValue').textContent = cgy.toFixed(2);
    document.getElementById('totalWeight').textContent = weight.toFixed(2);

    // إظهار قسم النتائج
    document.getElementById('results').style.display = 'block';
    
    // رسم الرسم البياني
    drawChart(cgx, cgy);
    
    // التمرير إلى النتائج
    setTimeout(() => {
        document.getElementById('results').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }, 100);
}

// ========== دالة رسم الرسم البياني ==========
function drawChart(cgx, cgy) {
    const ctx = document.getElementById('cogChart').getContext('2d');
    
    if (chart) {
        chart.destroy();
    }

    const segmentData = segments.map(s => ({
        x: s.x,
        y: s.y,
        label: s.name
    }));

    // إيجاد الحد الأدنى والأقصى للمحاور
    const xValues = segments.map(s => s.x);
    const yValues = segments.map(s => s.y);
    
    const allXValues = [...xValues, cgx];
    const allYValues = [...yValues, cgy];
    
    const minX = Math.min(...allXValues) - 10;
    const maxX = Math.max(...allXValues) + 10;
    const minY = Math.min(...allYValues) - 10;
    const maxY = Math.max(...allYValues) + 10;

    chart = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: 'وصلات الجسم',
                    data: segmentData,
                    backgroundColor: 'rgba(102, 126, 234, 0.6)',
                    borderColor: 'rgba(102, 126, 234, 1)',
                    pointRadius: 8,
                    pointHoverRadius: 12
                },
                {
                    label: 'مركز الثقل (COG)',
                    data: [{ x: cgx, y: cgy }],
                    backgroundColor: 'rgba(255, 0, 0, 0.8)',
                    borderColor: 'rgba(255, 0, 0, 1)',
                    pointRadius: 15,
                    pointHoverRadius: 18,
                    pointStyle: 'star'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 1.5,
            plugins: {
                title: {
                    display: true,
                    text: 'الرسم البياني لمركز الثقل والوصلات',
                    font: {
                        size: 18,
                        family: 'Cairo',
                        weight: 'bold'
                    }
                },
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        font: {
                            family: 'Cairo',
                            size: 14
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.dataset.label || '';
                            const point = context.raw;
                            return `${label}: (${point.x.toFixed(2)}, ${point.y.toFixed(2)})`;
                        }
                    },
                    titleFont: {
                        family: 'Cairo'
                    },
                    bodyFont: {
                        family: 'Cairo'
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'الإحداثي الأفقي (X) - سم',
                        font: {
                            family: 'Cairo',
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    min: minX,
                    max: maxX
                },
                y: {
                    title: {
                        display: true,
                        text: 'الإحداثي الرأسي (Y) - سم',
                        font: {
                            family: 'Cairo',
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    min: minY,
                    max: maxY
                }
            }
        }
    });
}

// ========== دالة إعادة تعيين الحاسبة ==========
function resetCalculator() {
    // إعادة تعيين الوزن
    document.getElementById('weight').value = '';
    
    // إعادة تعيين جميع الإحداثيات
    segments.forEach((segment, index) => {
        document.getElementById(`x_${index}`).value = '';
        document.getElementById(`y_${index}`).value = '';
    });
    
    // إخفاء النتائج
    document.getElementById('results').style.display = 'none';
    
    // إخفاء رسائل الخطأ
    hideError();
    
    // حذف الرسم البياني
    if (chart) {
        chart.destroy();
        chart = null;
    }
    
    // التمرير للأعلى
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ========== دالة الطباعة ==========
function printResults() {
    const originalTitle = document.title;
    document.title = 'CenterOfGravity';
    window.print();
    document.title = originalTitle;
}

// ========== دالة عرض رسالة خطأ ==========
function showError(message) {
    const alertDiv = document.getElementById('errorAlert');
    alertDiv.innerHTML = `
        <div class="alert alert-error">${message}</div>
    `;
    alertDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ========== دالة إخفاء رسالة الخطأ ==========
function hideError() {
    document.getElementById('errorAlert').innerHTML = '';
}