// DOM Elements
const themeToggle = document.querySelector('.theme-toggle');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const countdown = document.getElementById('countdown');
const contactForm = document.getElementById('contact-form');
const filterButtons = document.querySelectorAll('.filter-btn');

// Dark Mode Toggle
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const icon = themeToggle.querySelector('i');
    icon.classList.toggle('fa-moon');
    icon.classList.toggle('fa-sun');
});

// Mobile Navigation
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

// Countdown Timer for Next Service
function updateCountdown() {
    const now = new Date();
    const nextSunday = new Date();
    
    // Set to next Sunday at 9:00 AM
    nextSunday.setDate(now.getDate() + (7 - now.getDay()) % 7);
    nextSunday.setHours(9, 0, 0, 0);
    
    // If it's already past 9 AM on Sunday, set to next Sunday
    if (now.getDay() === 0 && now.getHours() >= 9) {
        nextSunday.setDate(nextSunday.getDate() + 7);
    }
    
    const timeLeft = nextSunday - now;
    
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    
    countdown.innerHTML = `
        <div class="countdown-item">
            <span>${days}</span>
            <small>Days</small>
        </div>
        <div class="countdown-item">
            <span>${hours}</span>
            <small>Hours</small>
        </div>
        <div class="countdown-item">
            <span>${minutes}</span>
            <small>Minutes</small>
        </div>
        <div class="countdown-item">
            <span>${seconds}</span>
            <small>Seconds</small>
        </div>
    `;
}

// Update countdown every second
setInterval(updateCountdown, 1000);
updateCountdown();

// Media Filter
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        
        const filter = button.getAttribute('data-filter');
        // Add filtering logic here
    });
});

// Contact Form Submission
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    // Here you would typically send the data to a server
    console.log('Form submitted:', data);
    
    // Show success message
    alert('Thank you for your message! We will get back to you soon.');
    contactForm.reset();
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Close mobile menu if open
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
});

// Scroll Animation
const sections = document.querySelectorAll('section');

function checkScroll() {
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (sectionTop < windowHeight * 0.75) {
            section.classList.add('visible');
        }
    });
}

// Initial check
checkScroll();

// Check on scroll
window.addEventListener('scroll', checkScroll);

// Sample Events Data (Replace with actual data from your backend)
const events = [
    {
        title: 'Sunday Service',
        date: '2024-03-10',
        time: '9:00 AM',
        location: 'Main Sanctuary'
    },
    {
        title: 'Bible Study',
        date: '2024-03-12',
        time: '7:00 PM',
        location: 'Fellowship Hall'
    },
    {
        title: 'Youth Group',
        date: '2024-03-15',
        time: '6:30 PM',
        location: 'Youth Center'
    }
];

// Function to display events
function displayEvents() {
    const eventsContainer = document.querySelector('.events-calendar');
    eventsContainer.innerHTML = events.map(event => `
        <div class="event-card">
            <h3>${event.title}</h3>
            <p><i class="far fa-calendar"></i> ${event.date}</p>
            <p><i class="far fa-clock"></i> ${event.time}</p>
            <p><i class="fas fa-map-marker-alt"></i> ${event.location}</p>
            <button class="btn primary">RSVP</button>
        </div>
    `).join('');
}

// Display events when the page loads
displayEvents(); 