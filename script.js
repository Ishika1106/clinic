// ====================================================================
// GLOBAL FUNCTIONS - Accessible immediately for inline HTML handlers
// ====================================================================

// Placeholder for DOMElements to be populated on DOMContentLoaded
let DOMElements = {}; 
let reviews = [];
let autoSlideInterval;
let currentSlide = 0; // Initialize slide tracker globally

/** Scrolls smoothly to a target section by its ID, accounting for the fixed header. */
window.scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
        const yOffset = -72;
        const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({
            top: y,
            behavior: 'smooth'
        });
    }
    // Close the mobile menu if it's open
    if (DOMElements.mobileMenu && DOMElements.mobileMenu.classList.contains('open')) {
        DOMElements.mobileMenu.classList.remove('open');
        DOMElements.span1?.classList.remove('rotate-45', 'translate-y-1.5');
        DOMElements.span2?.classList.remove('opacity-0');
        DOMElements.span3?.classList.remove('-rotate-45', '-translate-y-1.5');
    }
};

/** Toggles the visibility of the chatbot window. */
window.toggleChatbot = () => {
    if (!DOMElements.chatbot) return;
    DOMElements.chatbot.classList.toggle('hidden');
    DOMElements.chatbot.classList.toggle('animate-fade-in');

    const isOpen = !DOMElements.chatbot.classList.contains('hidden');
    if (isOpen) {
        // Focus the input when opened
        DOMElements.chatInput?.focus();
        
        // Add initial greeting only on first open
        if (DOMElements.chatMessages && DOMElements.chatMessages.children.length === 0) {
            // NOTE: The actual addMessage/response logic is defined inside DOMContentLoaded
            // A simple placeholder or a proper definition inside DOMContentLoaded handles this.
        }
    }
};

/** Sends the user's message (defined fully inside DOMContentLoaded). */
window.sendMessage = () => {
    // This will be overridden inside DOMContentLoaded
};

/** Handles the Enter key press in the chat input. */
window.handleKeyPress = (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        window.sendMessage();
    }
};

/** Deletes a review by ID (defined fully inside DOMContentLoaded). */
window.deleteReview = (id) => {
    // This will be overridden inside DOMContentLoaded
};


// ====================================================================
// MAIN DOM CONTENT LOADED LOGIC 
// All elements and internal functions are initialized here.
// ====================================================================

document.addEventListener('DOMContentLoaded', () => {

    // -------------------- DOM & STATE INITIALIZATION --------------------
    DOMElements = {
        slides: document.querySelectorAll('.carousel-slide'),
        indicatorsContainer: document.getElementById('carouselIndicators'),
        mobileMenuBtn: document.getElementById('mobileMenuBtn'),
        mobileMenu: document.getElementById('mobileMenu'),
        mobileNavLinks: document.querySelectorAll('.mobile-nav-link'),
        faqButtons: document.querySelectorAll('.faq-btn'),
        reviewForm: document.getElementById('reviewForm'),
        reviewsDisplay: document.getElementById('reviewsDisplay'),
        chatMessages: document.getElementById('chatMessages'),
        chatInput: document.getElementById('chatInput'),
        chatbot: document.getElementById('chatbot'),
        chatbotBtn: document.getElementById('chatbotBtn'),
        span1: document.getElementById('span1'),
        span2: document.getElementById('span2'),
        span3: document.getElementById('span3'),
    };

    reviews = JSON.parse(localStorage.getItem('blessingsClinicReviews')) || [];

    // -------------------- MOBILE MENU LOGIC --------------------
    const toggleMobileMenu = () => {
        if (!DOMElements.mobileMenu) return;
        const isMenuOpen = DOMElements.mobileMenu.classList.toggle('open');

        DOMElements.span1?.classList.toggle('rotate-45', isMenuOpen);
        DOMElements.span1?.classList.toggle('translate-y-1.5', isMenuOpen);
        DOMElements.span2?.classList.toggle('opacity-0', isMenuOpen);
        DOMElements.span3?.classList.toggle('-rotate-45', isMenuOpen);
        DOMElements.span3?.classList.toggle('-translate-y-1.5', isMenuOpen);

        DOMElements.mobileMenuBtn?.setAttribute('aria-expanded', isMenuOpen);
    };

    DOMElements.mobileMenuBtn?.addEventListener('click', toggleMobileMenu);

    DOMElements.mobileNavLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            window.scrollToSection(targetId);
        });
    });

    // -------------------- CAROUSEL LOGIC --------------------
    const showSlide = (index) => {
        DOMElements.slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        currentSlide = index;
        updateIndicators();
    };

    const nextSlide = () => {
        const totalSlides = DOMElements.slides.length;
        if (totalSlides === 0) return;
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
    };

    const updateIndicators = () => {
        if (!DOMElements.indicatorsContainer) return;
        DOMElements.indicatorsContainer.innerHTML = '';
        DOMElements.slides.forEach((_, i) => {
            const dot = document.createElement('span');
            dot.classList.add('w-3', 'h-3', 'rounded-full', 'cursor-pointer', 'transition-colors', 'duration-300', 'border-2', 'border-secondary-blue');
            dot.classList.toggle('bg-secondary-blue', i === currentSlide);
            dot.classList.toggle('bg-white', i !== currentSlide); 
            dot.addEventListener('click', () => {
                showSlide(i);
                startAutoSlide();
            });
            DOMElements.indicatorsContainer.appendChild(dot);
        });
    };

    const startAutoSlide = () => {
        if (DOMElements.slides.length === 0) return;
        stopAutoSlide();
        autoSlideInterval = setInterval(nextSlide, 5000);
    };

    const stopAutoSlide = () => {
        if (autoSlideInterval) clearInterval(autoSlideInterval);
    };

    // Initialize Carousel
    if (DOMElements.slides.length > 0) {
        showSlide(currentSlide);
        startAutoSlide();
    }

    // Carousel Swipe Support
    let touchStartX = 0;
    let touchEndX = 0;

    DOMElements.slides.forEach(slide => {
        slide.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoSlide();
        });
        slide.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipeGesture();
        });
    });

    const handleSwipeGesture = () => {
        const swipeDistance = touchEndX - touchStartX;
        const minSwipeDistance = 50;
        const totalSlides = DOMElements.slides.length;

        if (swipeDistance > minSwipeDistance) {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            showSlide(currentSlide);
        } else if (swipeDistance < -minSwipeDistance) {
            nextSlide();
        }
        startAutoSlide();
    };


    // -------------------- FAQ ACCORDION LOGIC --------------------
    const initFAQ = () => {
        DOMElements.faqButtons.forEach(btn => {
            const content = btn.nextElementSibling;
            const iconContainer = btn.querySelector(".faq-icon");
            const plusIcon = iconContainer?.querySelector(".fa-plus");
            const minusIcon = iconContainer?.querySelector(".fa-minus");

            const isInitiallyExpanded = btn.getAttribute('aria-expanded') === 'true';
            content.classList.toggle('hidden', !isInitiallyExpanded);
            plusIcon?.classList.toggle('hidden', isInitiallyExpanded);
            minusIcon?.classList.toggle('hidden', !isInitiallyExpanded);

            btn.addEventListener("click", () => {
                const isExpanded = btn.getAttribute('aria-expanded') === 'true';

                DOMElements.faqButtons.forEach(otherBtn => {
                    if (otherBtn !== btn && otherBtn.getAttribute('aria-expanded') === 'true') {
                        const otherContent = otherBtn.nextElementSibling;
                        const otherPlusIcon = otherBtn.querySelector(".fa-plus");
                        const otherMinusIcon = otherBtn.querySelector(".fa-minus");
                        otherBtn.setAttribute('aria-expanded', 'false');
                        otherContent.classList.add("hidden");
                        otherPlusIcon?.classList.remove('hidden');
                        otherMinusIcon?.classList.add('hidden');
                    }
                });

                btn.setAttribute('aria-expanded', String(!isExpanded));
                content.classList.toggle("hidden");
                plusIcon?.classList.toggle('hidden');
                minusIcon?.classList.toggle('hidden');
            });
        });
    };
    initFAQ();

    // -------------------- REVIEW SYSTEM LOGIC (FIXED) --------------------

    const saveReviews = () => {
        localStorage.setItem('blessingsClinicReviews', JSON.stringify(reviews));
    };

    const displayReviews = () => {
        const container = DOMElements.reviewsDisplay;
        if (!container) return;

        if (reviews.length === 0) {
            container.innerHTML = '<p class="text-gray-500 italic p-4 text-center w-full">Be the first to share your experience!</p>';
            container.classList.remove('flex', 'gap-6', 'py-4', 'overflow-x-auto', 'snap-x', 'snap-mandatory', 'justify-start');
            return;
        }

        container.classList.add('flex', 'gap-6', 'py-4', 'overflow-x-auto', 'snap-x', 'snap-mandatory', 'justify-start');
        container.innerHTML = reviews.map(r => {
            
            // --- FIX: Using fas for solid and far for regular (empty) stars ---
            const stars = Array(5).fill(0).map((_, i) => i < r.rating ?
                '<i class="fas fa-star text-yellow-500"></i>' :
                '<i class="far fa-star text-yellow-500"></i>'
            ).join('');

            return `
            <div class="review-item bg-white p-5 rounded-xl shadow-lg hover:shadow-2xl transition min-w-[300px] flex-shrink-0 snap-center relative border-t-4 border-secondary-blue animate-fade-in">
                <button onclick="deleteReview(${r.id})" class="absolute top-2 right-3 text-tertiary-slate hover:text-red-500 font-bold text-lg transition z-10" aria-label="Delete Review">
                    <i class="fas fa-times-circle"></i>
                </button>
                <div class="review-header flex justify-between items-center mb-3">
                    <span class="reviewer-name font-bold text-primary-indigo">${r.name}</span>
                    <span class="review-rating text-lg">${stars}</span>
                </div>
                <p class="review-text text-gray-700 mb-2 italic">"${r.text}"</p>
                <p class="review-date text-gray-400 text-sm">Reviewed on: ${r.date}</p>
            </div>`;
        }).join('');
    };

    // Override global placeholder
    window.deleteReview = (id) => {
        reviews = reviews.filter(r => r.id !== id);
        saveReviews();
        displayReviews();
    };

    const submitReview = (event) => {
        event.preventDefault();
        const form = DOMElements.reviewForm;
        const formData = new FormData(form);
        const name = formData.get('reviewerName').trim() || 'Anonymous Patient';
        const text = formData.get('reviewText').trim();
        const rating = parseInt(formData.get('rating'));

        if (!text || !rating) {
            alert('Please enter your feedback and select a star rating.');
            return;
        }

        const review = {
            id: Date.now(),
            name,
            text,
            rating,
            date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        };

        reviews.unshift(review);
        saveReviews();
        displayReviews();
        form.reset();
        alert('Thank you for sharing your experience!');
    };

    DOMElements.reviewForm?.addEventListener('submit', submitReview);
    displayReviews(); // Initial display of reviews

    // -------------------- CHATBOT CORE LOGIC --------------------

    const botResponses = {
        greetings: { positive: ["Hello! I'm BlessBot, happy to help you with Blessings Clinic information today. How can I assist?", "Hi there! What can I do for you?"], neutral: ["Hello! Welcome to Blessings Child Care And Diagnostics. I'm BlessBot. How can I assist you today?", "Hi there! I can share details about our clinic, our doctors, services, and how to book appointments."] },
        about: ["Blessings Child Care And Diagnostics is a specialized clinic focused on **pediatric care** and **advanced diagnostics**. We provide essential services like checkups, vaccinations, and laboratory testing.", "Our mission is to provide compassionate, high-quality care for infants, children, and adolescents, supported by state-of-the-art diagnostic facilities."],
        timing: ["Our clinic hours are:\n- **Monday to Friday:** 8:00 AM – 6:00 PM\n- **Saturday & Sunday:** 9:00 AM – 4:00 PM"],
        location: ["We are located at:\n**123 Medical Center Drive, Healthcare City, HC 12345**\n\nWe look forward to seeing you!"],
        contact: ["You can reach us directly:\n- **Phone (Appointments):** (555) 123-4567\n- **Email (General Inquiries):** info@blessingsmedical.com"],
        doctors: ["Our Chief Pediatrician is **Dr. Deepika Gulati Dumeer**.", "We are led by Dr. Deepika Gulati Dumeer, a specialist in Pediatric Medicine."],
        doctorDetails: { "deepika": "Dr. Deepika Gulati Dumeer is our **Chief Pediatrician**. She specializes in Pediatric Medicine and Neonatology, with 15+ years of experience. Her focus is on holistic child health." },
        services: ["Our core services include:\n1. **Routine Checkups**\n2. **Vaccinations/Immunizations**\n3. **Specialized Consultations**\n4. **Laboratory Tests (Blood, Tissue)**\n\nWhich service interests you the most?"],
        appointment: ["To book an appointment, please click the **Contact & Book** link in the navigation, or call us directly at (555) 123-4567.","You can schedule easily online by visiting the 'Contact' section."],
        thanks: ["You're very welcome! Is there anything else I can clarify?","Happy to assist you!"],
        default: ["I'm sorry, I couldn't understand that request. I can provide details on **Services, Dr. Deepika, Timing, or Booking**. Can you try phrasing your question differently?","That information might be outside my current knowledge base. For complex inquiries, please call the clinic directly."],
        error: ["I can only provide details on our Chief Pediatrician, **Dr. Deepika Gulati Dumeer**. Please ask about her!","Could you please clarify? I only have information for Dr. Deepika, not Dr. Nitin."]
    };

    const getSentiment = (msg) => {
        const positiveWords = ["great", "excellent", "happy", "love", "fantastic"];
        return positiveWords.some(word => msg.includes(word)) ? 'positive' : 'neutral';
    };

    const getRandomResponse = (arr) => {
        return arr[Math.floor(Math.random() * arr.length)];
    };

    const getBotResponse = (message) => {
        const msg = message.toLowerCase().trim().replace(/[.,!?'"]/g, '');

        if (msg.includes("hi") || msg.includes("hello") || msg.includes("hey")) {
            return getRandomResponse(botResponses.greetings[getSentiment(msg)]);
        }

        const doctorMatch = msg.match(/(deepika|dr deepika|pediatrician|dr nitin|nitin|pathologist)/);
        if (doctorMatch) {
            const key = doctorMatch[1];
            if (key.includes('deepika') || key.includes('pediatrician')) return botResponses.doctorDetails.deepika;
            if (key.includes('nitin') || key.includes('pathologist')) return getRandomResponse(botResponses.error);
        }

        const synonyms = {
            about: ["about", "clinic", "information", "details", "what is blessings", "mission"],
            timing: ["time", "timing", "hours", "open", "schedule", "working"],
            location: ["location", "address", "where", "find", "place", "map"],
            contact: ["contact", "phone", "email", "reach", "number", "call"],
            doctors: ["doctor", "physician", "specialist"],
            services: ["service", "treatment", "care", "facility", "test", "lab", "checkup"],
            appointment: ["appointment", "book", "schedule visit", "reservation", "consultation"],
            thanks: ["thank", "thanks", "thank you"],
            goodbye: ["bye", "see you", "goodbye", "exit"]
        };

        for (const [category, words] of Object.entries(synonyms)) {
            for (const word of words) {
                if (msg.includes(word)) return getRandomResponse(botResponses[category]);
            }
        }
        return getRandomResponse(botResponses.default);
    };


    // -------------------- CHATBOT UI & FUNCTIONALITY --------------------

    /** Adds a typing indicator to the chat window. */
    const addTypingIndicator = () => {
        const typingDiv = document.createElement('div');
        typingDiv.classList.add('flex', 'mb-3', 'justify-start', 'typing-indicator-container');

        const indicator = document.createElement('div');
        indicator.classList.add('bg-gray-700', 'p-3', 'rounded-xl', 'rounded-tl-none', 'shadow-md', 'flex', 'items-center', 'space-x-1.5');
        indicator.innerHTML = `
            <span class="dot inline-block w-2 h-2 bg-white rounded-full animate-bounce" style="animation-delay:0s;"></span>
            <span class="dot inline-block w-2 h-2 bg-white rounded-full animate-bounce" style="animation-delay:0.2s;"></span>
            <span class="dot inline-block w-2 h-2 bg-white rounded-full animate-bounce" style="animation-delay:0.4s;"></span>
        `;
        
        typingDiv.appendChild(indicator);
        DOMElements.chatMessages.appendChild(typingDiv);
        DOMElements.chatMessages.scrollTop = DOMElements.chatMessages.scrollHeight;
        return typingDiv;
    };
    
    /** Types out the message content line by line. */
    const typeMessage = (element, text, delay = 15) => {
        const lines = text.split('\n');
        element.innerHTML = '';
        let lineIndex = 0;

        function typeLine() {
            if (lineIndex >= lines.length) return;

            let line = lines[lineIndex];
            if (lineIndex > 0) element.innerHTML += '<br>';
            
            const span = document.createElement('span');
            element.appendChild(span);
            let charIndex = 0;
            
            const lineInterval = setInterval(() => {
                span.textContent += line[charIndex];
                charIndex++;
                DOMElements.chatMessages.scrollTop = DOMElements.chatMessages.scrollHeight;

                if (charIndex >= line.length) {
                    clearInterval(lineInterval);
                    lineIndex++;
                    setTimeout(typeLine, 100);
                }
            }, delay);
        }
        typeLine();
    };


    /** Adds a message to the chat display. */
    const addMessage = (content, sender, isTyping = true) => {
        if (!DOMElements.chatMessages) return;

        if (sender === 'user') {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('flex', 'mb-3', 'justify-end', 'animate-fade-in');
            messageDiv.innerHTML = `<div class="bg-secondary-blue text-white p-3 rounded-xl rounded-br-none max-w-[80%] shadow-md">${content}</div>`;
            DOMElements.chatMessages.appendChild(messageDiv);
            DOMElements.chatMessages.scrollTop = DOMElements.chatMessages.scrollHeight;
            return;
        }

        // Bot message
        if (!isTyping) {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('flex', 'mb-3', 'justify-start', 'animate-fade-in');
            messageDiv.innerHTML = `<div class="bg-primary-indigo text-white p-3 rounded-xl rounded-tl-none max-w-[80%] shadow-md whitespace-pre-wrap">${content}</div>`;
            DOMElements.chatMessages.appendChild(messageDiv);
        } else {
            const typingIndicator = addTypingIndicator();
            const response = content;
            const typingDelay = 500 + Math.min(response.length * 15, 1200);

            setTimeout(() => {
                typingIndicator.remove();
                
                const messageDiv = document.createElement('div');
                messageDiv.classList.add('flex', 'mb-3', 'justify-start');
                
                const responseDiv = document.createElement('div');
                responseDiv.classList.add('bg-primary-indigo', 'text-white', 'p-3', 'rounded-xl', 'rounded-tl-none', 'max-w-[80%]', 'shadow-md', 'whitespace-pre-wrap');
                
                messageDiv.appendChild(responseDiv);
                DOMElements.chatMessages.appendChild(messageDiv);

                typeMessage(responseDiv, response);
                DOMElements.chatMessages.scrollTop = DOMElements.chatMessages.scrollHeight;
            }, typingDelay);
        }
    };


    // --- FIX: OVERRIDE global placeholder with the fully defined, working logic ---
    window.sendMessage = () => {
        if (!DOMElements.chatInput) return;
        const message = DOMElements.chatInput.value.trim();
        
        // Prevent sending empty messages
        if (!message) return;

        addMessage(message, 'user', false);
        DOMElements.chatInput.value = '';
        const response = getBotResponse(message);
        addMessage(response, 'bot', true);
    };
    
    // Initial greeting if chatbot is opened (only show if no messages exist)
    if (DOMElements.chatbot && DOMElements.chatMessages) {
         if (!DOMElements.chatbot.classList.contains('hidden') && DOMElements.chatMessages.children.length === 0) {
             addMessage(getRandomResponse(botResponses.greetings.neutral), 'bot', false);
         }
    }
});