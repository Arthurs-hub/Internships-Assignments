// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.pageYOffset > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Button click handlers - Apply/Partner buttons
const applyButtons = document.querySelectorAll('.btn-primary');
const partnerButtons = document.querySelectorAll('.btn-secondary');

applyButtons.forEach(button => {
    if (button.textContent.includes('Apply')) {
        button.addEventListener('click', () => {
            // In production, this would open application form
            alert('Thank you for your interest! Application form will be available soon.\n\nFor now, please contact us at:\nbusiness@karostartup.com\nWhatsApp: +91 9315194393');
        });
    }
});

partnerButtons.forEach(button => {
    if (button.textContent.includes('Partner') || button.textContent.includes('Explore')) {
        button.addEventListener('click', () => {
            // In production, this would open relevant page
            alert('Thank you for your interest!\n\nPlease contact us at:\nbusiness@karostartup.com\nWhatsApp: +91 9315194393');
        });
    }
});

console.log('Karo Pitch loaded! 🚀');
