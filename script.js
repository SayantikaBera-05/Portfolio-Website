/* 
  Portfolio JavaScript 
  Handles mobile menu, smooth scrolling, and scroll animations
*/

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Mobile Navigation Menu ---
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-link');

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when a link is clicked
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (mobileMenuBtn.classList.contains('active')) {
                mobileMenuBtn.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    });

    // --- Sticky Navbar ---
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // --- Active Section Highlight ---
        let current = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').includes(current)) {
                item.classList.add('active');
            }
        });
    });

    // --- Set Current Year in Footer ---
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- Scroll Animations (Intersection Observer) ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add the 'visible' class to trigger CSS animation
                entry.target.classList.add('visible');
                
                // If it's a progress bar container, animate the width
                if (entry.target.classList.contains('skill-card')) {
                    const progressBar = entry.target.querySelector('.progress');
                    if (progressBar && progressBar.style.width) {
                        const targetWidth = progressBar.style.width;
                        progressBar.style.width = '0%';
                        setTimeout(() => {
                            progressBar.style.width = targetWidth;
                        }, 500);
                    }
                }
                
                // Stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Select elements to animate
    const elementsToAnimate = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in');
    
    elementsToAnimate.forEach(el => {
        // If element is in the hero section, animate it in immediately
        if (el.closest('.hero')) {
            setTimeout(() => {
                el.classList.add('visible');
            }, 300);
        } else {
            observer.observe(el);
        }
    });

    // --- Contact Form Handling ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent page reload
            
            // Get input values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Construct email payload
            const targetEmail = 'sayantika.bera.ciphernauts@gmail.com';
            const subject = encodeURIComponent('New Message from Portfolio Website');
            const body = encodeURIComponent(`You have received a new message from your portfolio website.\n\nFrom: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
            
            // Open the default mail client (Gmail, Outlook, Mail app, etc.)
            window.location.href = `mailto:${targetEmail}?subject=${subject}&body=${body}`;
            
            // Optional: reset the form after clicking
            contactForm.reset();
        });
    }
});
