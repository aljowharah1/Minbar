let selectedCharacter = null;
let webcamStream = null;

// Toggle Pricing Monthly/Yearly
function switchPricing(type) {
    const monthly = document.getElementById('monthly');
    const yearly = document.getElementById('yearly');
    const basicPrice = document.getElementById('basic-price');
    const proPrice = document.getElementById('pro-price');
    const enterprisePrice = document.getElementById('enterprise-price');

    if (type === 'monthly') {
        monthly.classList.add('active');
        yearly.classList.remove('active');
        basicPrice.innerText = "10﷼";
        proPrice.innerText = "30﷼";
        enterprisePrice.innerText = "50﷼";
    } else {
        monthly.classList.remove('active');
        yearly.classList.add('active');
        basicPrice.innerText = "100﷼";
        proPrice.innerText = "300﷼";
        enterprisePrice.innerText = "500﷼";
    }
}

// Show Plan Details in Modal
function showPlanDetails(name, price, ...features) {
    const modalTitle = document.getElementById('modal-title');
    const modalPrice = document.getElementById('modal-price');
    const featuresList = document.getElementById('modal-features');

    modalTitle.innerText = name;
    modalPrice.innerText = `السعر: ${price} / شهر`;
    featuresList.innerHTML = features.map(feature => `<li>✔️ ${feature}</li>`).join('');

    document.getElementById('plan-modal').style.display = "block";
}

// Close Modal
function closePlanDetails() {
    document.getElementById('plan-modal').style.display = "none";
}
