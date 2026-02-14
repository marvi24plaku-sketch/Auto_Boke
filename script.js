// Të dhënat e makinave (ruhen në localStorage)
let cars = JSON.parse(localStorage.getItem('autoBokeCars')) || [
    {
        id: 1,
        brand: 'Audi',
        model: 'A4',
        year: 2019,
        fuel: 'Naftë',
        price: 18500,
        km: 85000,
        description: 'Audi A4 në gjendje të shkëlqyer. Mirëmbajtur me libër servisi.',
        image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=800',
        date: new Date().toISOString()
    }
];

// Ruaj makinat fillestare nëse localStorage është bosh
if (!localStorage.getItem('autoBokeCars')) {
    localStorage.setItem('autoBokeCars', JSON.stringify(cars));
}

// Ngarko makinat
function loadCars() {
    const grid = document.getElementById('cars-grid');
    const savedCars = JSON.parse(localStorage.getItem('autoBokeCars')) || [];
    
    // Përditëso numrin total
    document.getElementById('total-cars').textContent = savedCars.length;
    
    if (savedCars.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                <i class="fas fa-car" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem;"></i>
                <p>Nuk ka makina në shitje momentalisht.</p>
                <p style="color: #666; margin-top: 0.5rem;">Kontaktoni në WhatsApp për më shumë informacion!</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = savedCars.map(car => `
        <div class="car-card" data-brand="${car.brand.toLowerCase()}">
            <div class="car-image">
                <img src="${car.image}" alt="${car.brand} ${car.model}" onerror="this.src='https://via.placeholder.com/400x300?text=Auto+Boke'">
                <span class="car-badge">Në Shitje</span>
            </div>
            <div class="car-info">
                <div class="car-header">
                    <div>
                        <div class="car-title">${car.brand} ${car.model}</div>
                        <div style="color: #666; font-size: 0.9rem;">${car.year} • ${car.fuel}</div>
                    </div>
                    <div class="car-price">€${car.price.toLocaleString()}</div>
                </div>
                <div class="car-details">
                    <div class="car-detail">
                        <i class="fas fa-tachometer-alt"></i>
                        <span>${car.km ? car.km.toLocaleString() + ' km' : 'N/A'}</span>
                    </div>
                </div>
                <p class="car-description">${car.description || 'Makinë në gjendje të shkëlqyer. Kontaktoni për më shumë detaje.'}</p>
                <button class="contact-seller-btn" onclick="openContactModal(${car.id})">
                    <i class="fas fa-phone"></i> Kontakto Shitësin
                </button>
            </div>
        </div>
    `).join('');
}

// Filtro makinat
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        const filter = this.getAttribute('data-filter');
        const cards = document.querySelectorAll('.car-card');
        
        cards.forEach(card => {
            if (filter === 'all' || card.getAttribute('data-brand') === filter) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Modal për kontakt
function openContactModal(carId) {
    const cars = JSON.parse(localStorage.getItem('autoBokeCars')) || [];
    const car = cars.find(c => c.id === carId);
    
    if (!car) return;
    
    document.getElementById('modal-car-info').innerHTML = `
        <strong>Ju intereson:</strong> ${car.brand} ${car.model} (${car.year})<br>
        <strong>Çmimi:</strong> €${car.price.toLocaleString()}
    `;
    
    document.getElementById('contact-modal').style.display = 'block';
    document.getElementById('contact-form').setAttribute('data-car-id', carId);
}

// Mbyll modalin
document.querySelector('.close').onclick = function() {
    document.getElementById('contact-modal').style.display = 'none';
}

window.onclick = function(event) {
    const modal = document.getElementById('contact-modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

// Dërgo formën e kontaktit
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const carId = parseInt(this.getAttribute('data-car-id'));
    const cars = JSON.parse(localStorage.getItem('autoBokeCars')) || [];
    const car = cars.find(c => c.id === carId);
    
    const message = {
        id: Date.now(),
        carId: carId,
        carInfo: `${car.brand} ${car.model} (${car.year})`,
        clientName: document.getElementById('client-name').value,
        clientPhone: document.getElementById('client-phone').value,
        clientMessage: document.getElementById('client-message').value,
        date: new Date().toLocaleString('sq-AL')
    };
    
    // Ruaj mesazhin për adminin
    let messages = JSON.parse(localStorage.getItem('autoBokeMessages')) || [];
    messages.push(message);
    localStorage.setItem('autoBokeMessages', JSON.stringify(messages));
    
    alert(`Faleminderit ${message.clientName}! Kërkesa juaj u dërgua me sukses. Do t'ju kontaktojmë së shpejti në numrin ${message.clientPhone}.`);
    
    document.getElementById('contact-modal').style.display = 'none';
    this.reset();
});

// Mobile menu
document.querySelector('.hamburger').addEventListener('click', function() {
    document.querySelector('.nav-links').classList.toggle('active');
});

// Ngarko makinat kur hapet faqja
document.addEventListener('DOMContentLoaded', loadCars);