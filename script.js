// Fireworks setup
const fireworks = new Fireworks(document.getElementById('fireworks'), {
    speed: 2,
    acceleration: 1.05,
    friction: 0.95,
    gravity: 1.5,
    particles: 50,
    explosion: 10
});

// Start fireworks
fireworks.start();

// Confetti effect
function createConfetti() {
    const colors = ['#ff69b4', '#4a90e2', '#ffd700', '#ff4040', '#40ff40'];
    const confettiContainer = document.querySelector('.confetti-container');
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
        confetti.style.opacity = Math.random();
        confettiContainer.appendChild(confetti);
    }
}

// Add special birthday message typing effect
document.addEventListener('DOMContentLoaded', () => {
    createConfetti();
    
    // Personalized click effect
    document.addEventListener('click', (e) => {
        const burst = document.createElement('div');
        burst.className = 'click-burst';
        burst.style.left = e.clientX + 'px';
        burst.style.top = e.clientY + 'px';
        
        // Add Peemkay's name to click effect
        const nameText = document.createElement('span');
        nameText.textContent = '🎉 PK 🎉';
        nameText.style.position = 'absolute';
        nameText.style.color = '#ff6b6b';
        nameText.style.fontSize = '1.5rem';
        burst.appendChild(nameText);
        
        document.body.appendChild(burst);
        
        setTimeout(() => {
            burst.remove();
        }, 1000);
    });

    // Animate letters on hover
    const letters = document.querySelectorAll('.letter');
    letters.forEach(letter => {
        letter.addEventListener('mouseover', () => {
            letter.style.transform = 'scale(1.5) rotate(10deg)';
            letter.style.transition = '0.3s';
        });
        
        letter.addEventListener('mouseout', () => {
            letter.style.transform = 'scale(1) rotate(0deg)';
        });
    });
});

// Enhanced 3D tilt effect for the card
const card = document.querySelector('.birthday-card');
card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const angleX = (y - centerY) / 20;
    const angleY = (centerX - x) / 20;
    
    card.style.transform = `rotateX(${angleX}deg) rotateY(${angleY}deg) scale(1.05)`;
    card.style.boxShadow = `
        ${-angleY}px ${-angleX}px 30px rgba(255, 107, 107, 0.3),
        ${angleY}px ${angleX}px 30px rgba(255, 215, 0, 0.3)
    `;
});

card.addEventListener('mouseleave', () => {
    card.style.transform = 'rotateX(0) rotateY(0) scale(1)';
    card.style.boxShadow = 'none';
});

// Add birthday music
const playBirthdayMusic = () => {
    const audio = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
    audio.loop = true;
    audio.volume = 0.5;
    audio.play();
};

// Play music on first click
document.body.addEventListener('click', () => {
    playBirthdayMusic();
}, { once: true });

// Wishes Management System
class WishesManager {
    constructor() {
        this.wishes = JSON.parse(localStorage.getItem('birthday-wishes')) || [];
        this.isAdmin = false;
        this.adminPassword = 'peemkay2025'; // Change this to a secure password
        this.setupEventListeners();
        this.renderWishes();
    }

    setupEventListeners() {
        // Wish Form Submission
        document.getElementById('wishForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addWish();
        });

        // Admin Login
        document.getElementById('adminLoginBtn').addEventListener('click', () => {
            this.adminLogin();
        });

        // Admin Logout
        document.getElementById('adminLogoutBtn').addEventListener('click', () => {
            this.adminLogout();
        });
    }

    addWish() {
        const senderName = document.getElementById('senderName').value;
        const wishMessage = document.getElementById('wishMessage').value;
        
        const wish = {
            id: Date.now(),
            sender: senderName,
            message: wishMessage,
            date: new Date().toLocaleString(),
        };

        this.wishes.unshift(wish);
        this.saveWishes();
        this.renderWishes();

        // Reset form
        document.getElementById('wishForm').reset();

        // Show success animation
        this.showSuccessMessage();
    }

    renderWishes() {
        const wishesContainer = document.getElementById('wishesList');
        const adminWishesContainer = document.getElementById('adminWishes');
        
        // Public wishes view
        wishesContainer.innerHTML = this.wishes
            .map(wish => `
                <div class="wish-card animate__animated animate__fadeIn">
                    <div class="wish-sender">${this.escapeHtml(wish.sender)}</div>
                    <div class="wish-message">${this.escapeHtml(wish.message)}</div>
                    <div class="wish-date">${wish.date}</div>
                </div>
            `).join('');

        // Admin wishes view
        if (this.isAdmin) {
            adminWishesContainer.innerHTML = this.wishes
                .map(wish => `
                    <div class="admin-wish-card">
                        <div>
                            <strong>${this.escapeHtml(wish.sender)}</strong>
                            <p>${this.escapeHtml(wish.message)}</p>
                            <small>${wish.date}</small>
                        </div>
                        <button class="delete-wish" onclick="wishesManager.deleteWish(${wish.id})">
                            Delete
                        </button>
                    </div>
                `).join('');
        }
    }

    deleteWish(id) {
        if (!this.isAdmin) return;
        this.wishes = this.wishes.filter(wish => wish.id !== id);
        this.saveWishes();
        this.renderWishes();
    }

    adminLogin() {
        const password = prompt('Enter admin password:');
        if (password === this.adminPassword) {
            this.isAdmin = true;
            document.getElementById('adminPanel').style.display = 'block';
            this.renderWishes();
        } else {
            alert('Invalid password');
        }
    }

    adminLogout() {
        this.isAdmin = false;
        document.getElementById('adminPanel').style.display = 'none';
    }

    saveWishes() {
        localStorage.setItem('birthday-wishes', JSON.stringify(this.wishes));
    }

    showSuccessMessage() {
        const message = document.createElement('div');
        message.className = 'success-message animate__animated animate__fadeIn';
        message.textContent = 'Wish sent successfully! 🎉';
        message.style.position = 'fixed';
        message.style.top = '20px';
        message.style.right = '20px';
        message.style.background = '#4CAF50';
        message.style.color = 'white';
        message.style.padding = '1rem';
        message.style.borderRadius = '8px';
        document.body.appendChild(message);

        setTimeout(() => {
            message.remove();
        }, 3000);
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}

// Initialize Wishes Manager
const wishesManager = new WishesManager();


