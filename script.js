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
    const submitBtn = document.getElementById('submitBtn');
    const submitSpinner = document.getElementById('submitSpinner');
    const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
    const formStatus = document.getElementById('formStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault(); // Prevent page reload
            
            // Clear previous errors
            document.querySelectorAll('.error-msg').forEach(el => el.classList.remove('visible'));
            document.querySelectorAll('.form-input').forEach(el => el.classList.remove('error'));
            formStatus.className = 'form-status hidden';

            // Get input values
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const subjectInput = document.getElementById('subject');
            const messageInput = document.getElementById('message');
            const botcheck = document.querySelector('input[name="botcheck"]').checked;
            
            let isValid = true;

            // Validate Name
            if (nameInput.value.trim().length < 2) {
                document.getElementById('nameError').textContent = 'Name must be at least 2 characters.';
                document.getElementById('nameError').classList.add('visible');
                nameInput.classList.add('error');
                isValid = false;
            }

            // Validate Email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value.trim())) {
                document.getElementById('emailError').textContent = 'Please enter a valid email address.';
                document.getElementById('emailError').classList.add('visible');
                emailInput.classList.add('error');
                isValid = false;
            }

            // Validate Subject
            if (subjectInput.value.trim() === '') {
                document.getElementById('subjectError').textContent = 'Subject is required.';
                document.getElementById('subjectError').classList.add('visible');
                subjectInput.classList.add('error');
                isValid = false;
            }

            // Validate Message
            if (messageInput.value.trim().length < 10) {
                document.getElementById('messageError').textContent = 'Message must be at least 10 characters.';
                document.getElementById('messageError').classList.add('visible');
                messageInput.classList.add('error');
                isValid = false;
            }

            if (!isValid) return;

            // Update UI to Submitting State
            submitBtn.disabled = true;
            submitSpinner.classList.remove('hidden');
            btnText.style.opacity = '0.5';

            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        access_key: '06eef67d-34c0-4c20-aae4-03eaba19e888',
                        name: nameInput.value.trim(),
                        email: emailInput.value.trim(),
                        subject: subjectInput.value.trim(),
                        message: messageInput.value.trim(),
                        botcheck: botcheck
                    })
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    // Success state
                    contactForm.reset();
                    formStatus.textContent = 'Message sent successfully!';
                    formStatus.className = 'form-status success visible';
                } else {
                    // Error state from server
                    formStatus.textContent = result.message || 'Failed to send message. Please try again.';
                    formStatus.className = 'form-status error visible';
                }
            } catch (error) {
                // Network error
                formStatus.textContent = 'A network error occurred. Please try again.';
                formStatus.className = 'form-status error visible';
                console.error('Form submission error:', error);
            } finally {
                // Revert UI from Submitting State
                submitBtn.disabled = false;
                submitSpinner.classList.add('hidden');
                btnText.style.opacity = '1';
            }
        });
    }
});
