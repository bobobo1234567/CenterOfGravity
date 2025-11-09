document.getElementById("calcBtn").addEventListener("click", () => {
  const totalWeight = parseFloat(document.getElementById("weight").value);
  if (isNaN(totalWeight) || totalWeight <= 0) {
    alert("من فضلك أدخل وزن صحيح!");
    return;
  }

  const segments = [
    { name: "Head", ratio: 0.07, x: 0.52, y: 1.75 },
    { name: "Trunk", ratio: 0.44, x: 0.50, y: 1.10 },
    { name: "Upper Arm (R)", ratio: 0.03, x: 0.62, y: 1.45 },
    { name: "Upper Arm (L)", ratio: 0.03, x: 0.38, y: 1.45 },
    { name: "Forearm (R)", ratio: 0.02, x: 0.68, y: 1.20 },
    { name: "Forearm (L)", ratio: 0.02, x: 0.32, y: 1.20 },
    { name: "Hand (R)", ratio: 0.01, x: 0.73, y: 1.05 },
    { name: "Hand (L)", ratio: 0.01, x: 0.27, y: 1.05 },
    { name: "Thigh (R)", ratio: 0.10, x: 0.55, y: 0.85 },
    { name: "Thigh (L)", ratio: 0.10, x: 0.45, y: 0.85 },
    { name: "Leg (R)", ratio: 0.05, x: 0.55, y: 0.45 },
    { name: "Leg (L)", ratio: 0.05, x: 0.45, y: 0.45 },
    { name: "Foot (R)", ratio: 0.01, x: 0.58, y: 0.15 },
    { name: "Foot (L)", ratio: 0.01, x: 0.42, y: 0.15 },
  ];

  let sumPx = 0;
  let sumPy = 0;
  let totalMass = 0;

  segments.forEach(seg => {
    const mass = totalWeight * seg.ratio;
    sumPx += mass * seg.x;
    sumPy += mass * seg.y;
    totalMass += mass;
  });

  const CGx = (sumPx / totalMass).toFixed(3);
  const CGy = (sumPy / totalMass).toFixed(3);

  document.getElementById("cgx").textContent = CGx;
  document.getElementById("cgy").textContent = CGy;
  document.getElementById("resultSection").style.display = "block";

  // رسم الرسم البياني
  const ctx = document.getElementById("cgChart").getContext("2d");
  if (window.cgChart) window.cgChart.destroy(); // لحذف الرسم القديم
  window.cgChart = new Chart(ctx, {
    type: "scatter",
    data: {
      datasets: [
        {
          label: "Segments",
          data: segments.map(s => ({ x: s.x, y: s.y })),
          pointBackgroundColor: "blue",
          pointRadius: 5,
        },
        {
          label: "Center of Gravity",
          data: [{ x: CGx, y: CGy }],
          pointBackgroundColor: "red",
          pointRadius: 8,
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        x: { title: { display: true, text: "المحور الأفقي (X)" } },
        y: { title: { display: true, text: "المحور الرأسي (Y)" } }
      }
    }
  });
});

// ---- طباعة باسم محدد ----
document.getElementById("printBtn").addEventListener("click", () => {
  const originalTitle = document.title;
  document.title = "CenterOfGravity"; // اسم الملف عند الطباعة
  window.print();
  document.title = originalTitle; // استرجاع الاسم الأصلي بعد الطباعة
});
