// Load from DB
async function loadExistingPlans() {
    const container = document.getElementById('existing-plans');
    container.innerHTML = '';

    try {
        const res = await fetch('/admin/plans');
        const plans = await res.json();
        plans.forEach(plan => {
            const planElement = createPlanElement(plan);
            container.appendChild(planElement);
        });
    } catch (error) {
        console.error('Error loading plans:', error);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', function () {
    loadExistingPlans();
    setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
    document.getElementById('add-plan-form').addEventListener('submit', handleAddPlan);
    document.getElementById('add-feature').addEventListener('click', addFeatureInput);
    document.getElementById('delete-selected').addEventListener('click', deleteSelectedPlans);
    document.getElementById('select-all').addEventListener('click', toggleSelectAll);

    document.getElementById('features-list').addEventListener('click', function (e) {
        if (e.target.classList.contains('remove-feature')) {
            removeFeatureInput(e.target);
        }
    });
}

// Create plan element
function createPlanElement(plan) {
    const div = document.createElement('div');
    div.className = 'plan-item';
    div.innerHTML = `
        <input type="checkbox" class="plan-checkbox" data-plan-id="${plan.id}">
        <div class="plan-details">
            <div class="plan-header">
                <h4 class="plan-title">${plan.name}</h4>
                ${plan.is_featured ? '<span class="featured-badge">الأكثر شيوعاً</span>' : ''}
            </div>
            <p class="plan-price">${plan.price}﷼ / ${plan.billing_type === 'monthly' ? 'شهري' : 'سنوي'}</p>
            <ul class="plan-features">
                ${plan.features.map(feature => `<li>✔️ ${feature}</li>`).join('')}
            </ul>
        </div>
    `;
    return div;
}

// Add new plan
async function handleAddPlan(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const features = [];

    document.querySelectorAll('input[name="features[]"]').forEach(input => {
        if (input.value.trim()) features.push(input.value.trim());
    });

    const newPlan = {
        name: formData.get('planName'),
        price: parseFloat(formData.get('monthlyPrice')),
        billing_type: 'monthly',
        is_featured: formData.get('isFeatured') !== null,
        features
    };

    try {
        const res = await fetch('/admin/plans', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newPlan)
        });

        if (res.ok) {
            showMessage('تم إضافة الخطة بنجاح', 'success');
            e.target.reset();
            resetFeaturesList();
            loadExistingPlans();
        } else {
            showMessage('فشل في إضافة الخطة', 'error');
        }
    } catch (error) {
        console.error('Error adding plan:', error);
    }
}

// Add feature input
function addFeatureInput() {
    const featuresList = document.getElementById('features-list');
    const newFeatureDiv = document.createElement('div');
    newFeatureDiv.className = 'feature-input';
    newFeatureDiv.innerHTML = `
        <input type="text" name="features[]" placeholder="أدخل ميزة واحدة">
        <button type="button" class="remove-feature">×</button>
    `;
    featuresList.appendChild(newFeatureDiv);
}

// Remove feature input
function removeFeatureInput(button) {
    button.parentElement.remove();
}

// Reset features list
function resetFeaturesList() {
    const featuresList = document.getElementById('features-list');
    featuresList.innerHTML = `
        <div class="feature-input">
            <input type="text" name="features[]" placeholder="أدخل ميزة واحدة" required>
            <button type="button" class="remove-feature" style="display: none;">×</button>
        </div>
    `;
}

// Delete selected plans
async function deleteSelectedPlans() {
    const checkboxes = document.querySelectorAll('.plan-checkbox:checked');
    if (checkboxes.length === 0) return showMessage('يرجى تحديد خطة واحدة على الأقل للحذف', 'error');

    const planIds = Array.from(checkboxes).map(cb => parseInt(cb.dataset.planId));

    if (!confirm(`هل أنت متأكد من حذف ${planIds.length} خطة؟`)) return;

    try {
        const res = await fetch('/admin/plans', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids: planIds })
        });

        if (res.ok) {
            showMessage('تم حذف الخطط المحددة بنجاح', 'success');
            loadExistingPlans();
        } else {
            showMessage('فشل في الحذف', 'error');
        }
    } catch (error) {
        console.error('Error deleting plans:', error);
    }
}

// Toggle select all
function toggleSelectAll() {
    const checkboxes = document.querySelectorAll('.plan-checkbox');
    const allChecked = Array.from(checkboxes).every(cb => cb.checked);
    checkboxes.forEach(cb => cb.checked = !allChecked);
}

// Show message
function showMessage(text, type) {
    const container = document.getElementById('message-container');
    const message = document.createElement('div');
    message.className = `message ${type}-message`;
    message.textContent = text;
    container.appendChild(message);
    setTimeout(() => message.remove(), 3000);
}


