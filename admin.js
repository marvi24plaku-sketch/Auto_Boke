// Konfigurimi i adminit
const ADMIN_EMAIL = 'marvi24plaku@gmail.com';
let ADMIN_PASSWORD = localStorage.getItem('adminPassword') || 'admin123';

// Kontrollo nëse është i loguar
function checkAuth() {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    if (isLoggedIn === 'true') {
        showDashboard();
    }
}

// Login
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('admin-email').value;
    const password = document.getElementById('admin-password').value;
    
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        sessionStorage.setItem('adminLoggedIn', 'true');
        showDashboard();
    } else {
        alert('Email ose fjalëkalim i gabuar!');
    }
});

// Shfaq dashboardin
function showDashboard() {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('admin-dashboard').style.display = 'flex';
    document.getElementById('admin-email-display').textContent = ADMIN_EMAIL;
    loadAdminCars();
    updateMessageCount();
}

// Logout
function logout() {
    sessionStorage.removeItem('adminLoggedIn');
    location.reload();
}

// Ngarko makinat në tabelën e adminit
function loadAdminCars() {
    const cars = JSON.parse(localStorage.getItem('autoBokeCars')) || [];
    const tbody = document.getElementById('admin-cars-list');
    
    tbody.innerHTML = cars.map(car => `
        <tr>
            <td><img src="${car.image}" alt="${car.brand}" onerror="this.src='https://via.placeholder.com/60x40?text=Auto+Boke'"></td>
            <td><strong>${car.brand} ${car.model}</strong></td>
            <td>${car.year}</td>
            <td>${car.fuel}</td>
            <td>€${car.price.toLocaleString()}</td>
            <td><span style="color: var(--success); font-weight: 600;">Aktive</span></td>
            <td class="table-actions">
                <button class="edit-btn" onclick="editCar(${car.id})"><i class="fas fa-edit"></i></button>
                <button class="delete-btn" onclick="deleteCar(${car.id})"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

// Shto makinë të re
function openAddModal() {
    document.getElementById('modal-title').textContent = 'Shto Makinë të Re';
    document.getElementById('car-form').reset();
    document.getElementById('car-id').value = '';
    document.getElementById('car-modal').style.display = 'block';
}

// Edit makinë
function editCar(id) {
    const cars = JSON.parse(localStorage.getItem('autoBokeCars')) || [];
    const car = cars.find(c => c.id === id);
    
    if (!car) return;
    
    document.getElementById('modal-title').textContent = 'Edito Makinën';
    document.getElementById('car-id').value = car.id;
    document.getElementById('car-brand').value = car.brand;
    document.getElementById('car-model').value = car.model;
    document.getElementById('car-year').value = car.year;
    document.getElementById('car-fuel').value = car.fuel;
    document.getElementById('car-price').value = car.price;
    document.getElementById('car-km').value = car.km || '';
    document.getElementById('car-description').value = car.description || '';
    document.getElementById('car-image').value = car.image;
    
    document.getElementById('car-modal').style.display = 'block';
}

// Fshi makinë
function deleteCar(id) {
    if (!confirm('A jeni i sigurt që doni të fshini këtë makinë?')) return;
    
    let cars = JSON.parse(localStorage.getItem('autoBokeCars')) || [];
    cars = cars.filter(c => c.id !== id);
    localStorage.setItem('autoBokeCars', JSON.stringify(cars));
    
    loadAdminCars();
    updateMessageCount();
}

// Ruaj makinën
document.getElementById('car-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const carId = document.getElementById('car-id').value;
    const carData = {
        id: carId ? parseInt(carId) : Date.now(),
        brand: document.getElementById('car-brand').value,
        model: document.getElementById('car-model').value,
        year: parseInt(document.getElementById('car-year').value),
        fuel: document.getElementById('car-fuel').value,
        price: parseInt(document.getElementById('car-price').value),
        km: parseInt(document.getElementById('car-km').value) || 0,
        description: document.getElementById('car-description').value,
        image: document.getElementById('car-image').value || 'https://via.placeholder.com/400x300?text=Auto+Boke',
        date: new Date().toISOString()
    };
    
    let cars = JSON.parse(localStorage.getItem('autoBokeCars')) || [];
    
    if (carId) {
        // Update
        const index = cars.findIndex(c => c.id === parseInt(carId));
        if (index !== -1) cars[index] = carData;
    } else {
        // Add new
        cars.push(carData);
    }
    
    localStorage.setItem('autoBokeCars', JSON.stringify(cars));
    closeCarModal();
    loadAdminCars();
    
    alert(carId ? 'Makina u përditësua me sukses!' : 'Makina u shtua me sukses!');
});

// Mbyll modalin e makinës
function closeCarModal() {
    document.getElementById('car-modal').style.display = 'none';
}

// Shfaq seksionet
function showSection(section) {
    document.querySelectorAll('.admin-section').forEach(s => s.style.display = 'none');
    document.querySelectorAll('.sidebar-nav a').forEach(a => a.classList.remove('active'));
    
    if (section === 'cars') {
        document.getElementById('cars-section').style.display = 'block';
        document.querySelector('.sidebar-nav a:nth-child(1)').classList.add('active');
    } else if (section === 'messages') {
        document.getElementById('messages-section').style.display = 'block';
        document.querySelector('.sidebar-nav a:nth-child(2)').classList.add('active');
        loadMessages();
    } else if (section === 'settings') {
        document.getElementById('settings-section').style.display = 'block';
        document.querySelector('.sidebar-nav a:nth-child(3)').classList.add('active');
    }
}

// Ngarko mesazhet
function loadMessages() {
    const messages = JSON.parse(localStorage.getItem('autoBokeMessages')) || [];
    const container = document.getElementById('messages-list');
    
    if (messages.length === 0) {
        container.innerHTML = `
            <div class="no-messages">
                <i class="fas fa-inbox" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                <p>Nuk ka mesazhe ende.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = messages.map(msg => `
        <div class="message-card">
            <div class="message-header">
                <strong><i class="fas fa-user"></i> ${msg.clientName}</strong>
                <span class="message-date">${msg.date}</span>
            </div>
            <div class="message-car">
                <i class="fas fa-car"></i> Interesuar për: ${msg.carInfo}
            </div>
            <div><i class="fas fa-phone"></i> ${msg.clientPhone}</div>
            ${msg.clientMessage ? `<div class="message-text"><i class="fas fa-comment"></i> ${msg.clientMessage}</div>` : ''}
        </div>
    `).join('').reverse(); // Mesazhet më të reja sipër
}

// Përditëso numrin e mesazheve
function updateMessageCount() {
    const messages = JSON.parse(localStorage.getItem('autoBokeMessages')) || [];
    document.getElementById('msg-count').textContent = messages.length;
}

// Fshi të gjitha mesazhet
function clearAllMessages() {
    if (!confirm('A jeni i sigurt që doni të fshini të gjitha mesazhet?')) return;
    
    localStorage.removeItem('autoBokeMessages');
    loadMessages();
    updateMessageCount();
}

// Ndrysho fjalëkalimin
document.getElementById('change-password-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const oldPass = document.getElementById('old-password').value;
    const newPass = document.getElementById('new-password').value;
    
    if (oldPass !== ADMIN_PASSWORD) {
        alert('Fjalëkalimi i vjetër është i gabuar!');
        return;
    }
    
    ADMIN_PASSWORD = newPass;
    localStorage.setItem('adminPassword', newPass);
    
    alert('Fjalëkalimi u ndryshua me sukses!');
    this.reset();
});

// Mbyll modalin kur klikon jashtë
window.onclick = function(event) {
    const modal = document.getElementById('car-modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

// Kontrollo autentikimin kur hapet faqja
document.addEventListener('DOMContentLoaded', checkAuth);