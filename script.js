// ====================================================================
// SECTION 1: CORE DATA AND BOT LOGIC (GLOBAL SCOPE)
// ====================================================================

const botResponses = {
    greetings: { 
        positive: [
            "Hello! I'm BlessBot, and I'm delighted to assist you with any information you need about Blessings Clinic. How may I help you today?", 
            "A warm welcome! I can share details about our pediatric and diagnostic services, our expert team, and how to schedule your visit. What's on your mind?"
        ], 
        neutral: [
            "Hello! Welcome to Blessings Child Care And Diagnostics. I'm BlessBot, your virtual assistant. Please feel free to ask me about our services, timings, location, or how to book appointments!", 
            "Hi there! I'm ready to provide you with comprehensive information regarding our clinic's specialized care and diagnostic facilities."
        ] 
    },
    about: [
        "Blessings Child Care And Diagnostics is a trusted center dedicated to holistic child wellness and precision diagnostics. We are uniquely structured to provide both expert pediatric care for children and advanced diagnostic services supported by state-of-the-art laboratory technology.", 
        "Our mission is centered on clinical excellence and compassionate care. We strive to be the supportive foundation for your child's health journey, from infancy through adolescence, while offering reliable, cutting-edge diagnostic support for accurate medical decisions."
    ],
    timing: [
        "We are pleased to offer flexible hours to accommodate your family's schedule. Please note our distinct timings for the services:\n\n" +
        "- Pediatric Clinic Consultation Hours:\n  - Monday to Friday: 9:00 AM – 5:00 PM\n  - Saturday: 9:00 AM – 1:00 PM\n\n" +
        "- Diagnostics Lab Hours (for sample collection & tests):\n  - Monday to Saturday: 9:00 AM – 9:00 PM\n  - Sunday: 9:00 AM – 4:00 PM"
    ],
    location: [
        "You can find our clinic at our convenient location:\n123 Medical Center Drive, Healthcare City, HC 12345\n\nWe have ample parking available and look forward to providing your family with the best care in a comfortable environment!"
    ],
    contact: [
        "We would be happy to hear from you! You can reach our dedicated administrative team directly:\n- Phone (For Appointments & Emergencies): (555) 123-4567\n- Email (General Inquiries): info@blessingsmedical.com\n\nPlease don't hesitate to reach out with any questions or concerns."
    ],
    doctors: [
        "We are proud to have a team of highly experienced specialists. Our esteemed Chief Pediatrician is Dr. Deepika Gulati Dumeer.", 
        "Our clinic is led by Dr. Deepika Gulati Dumeer, a recognized specialist dedicated to providing the highest standard of care in Pediatric Medicine."
    ],
    doctorDetails: { 
        "deepika": "Dr. Deepika Gulati Dumeer is our Chief Pediatrician and the heart of our child care services. She is highly experienced in Pediatric Medicine and Neonatology, focusing on the holistic physical, emotional, and developmental health of children. She brings over 15 years of expertise and a compassionate approach to every consultation." 
    },
    services: [
        "We offer a comprehensive suite of services tailored for the whole child and accurate diagnosis. These include:\n\n" +
        "1. Pediatric Wellness: Routine Checkups, Child Development Assessments, and Vaccinations/Immunizations.\n" +
        "2. Advanced Diagnostics: State-of-the-art Laboratory Tests (Blood, Tissue, etc.), and Expert Pathology Analysis.\n" +
        "3. Specialized Consultations and Telemedicine options.\n\n" +
        "Can I provide more details on our Pediatric Wellness options or our Advanced Diagnostics services?"
    ],
    
    serviceDetails: {
        pediatric_wellness: [
            "Our Pediatric Wellness services are focused on preventative care and healthy development. This includes scheduled routine checkups, comprehensive child development assessments, personalized nutritional guidance, and a full schedule of recommended vaccinations/immunizations to keep your child protected and thriving.",
            "We are here to support your child's physical and emotional growth through our Pediatric Wellness program. Ask about our well-baby care plans or adolescent health consultations!"
        ],
        advanced_diagnostics: [
            "Our Advanced Diagnostics service utilizes a modern, on-site laboratory for fast and accurate testing. We handle everything from routine blood counts and urine analysis to specialized tests (like tissue and genetic testing). Our results are processed quickly and reviewed by our expert pathology team to ensure the most reliable foundation for your child's treatment plan.",
            "Need a lab test? Our Diagnostics Lab is equipped with state-of-the-art technology to ensure precise results, supporting both pediatric care and general diagnostic needs. No appointment is needed for most routine lab collections."
        ]
    },
    
    appointment: [
        "Appointments can be easily scheduled online after you have signed up for an account on our website. Once logged in, simply navigate to your personal dashboard, select 'Book an Appointment', and choose whether you require a Pediatric consultation or a Diagnostic service. Should you encounter any difficulty during the process, please do not hesitate to contact us via phone at (555) 123-4567 or email at info@blessingsmedical.com for prompt assistance. We are here to help!"
    ],
    thanks: [
        "It was my pleasure to assist you! Please feel free to ask if anything else comes to mind.",
        "You're very welcome! Thank you for reaching out to Blessings Clinic."
    ],
    default: [
        "I sincerely apologize, I'm having trouble understanding your request. I can confidently provide information on our Services, Dr. Deepika, Clinic Timings, Location, or Appointment Booking. Could you please rephrase your question?",
        "That information might be outside the scope of my current knowledge base. For complex or medical-specific inquiries, please contact our administrative desk directly at (555) 123-4567."
    ],
    error: [
        "I can only provide specific details on our Chief Pediatrician, Dr. Deepika Gulati Dumeer, at this time. Please ask for her details."
    ]
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

    // 1. Doctor details (High priority)
    const doctorMatch = msg.match(/(deepika|dr deepika|pediatrician)/);
    if (doctorMatch && (doctorMatch[1].includes('deepika') || doctorMatch[1].includes('pediatrician'))) {
        return botResponses.doctorDetails.deepika;
    }

    // 2. Specific service details (Handle follow-up questions)
    if (msg.includes("pediatric wellness") || msg.includes("wellness") || msg.includes("vaccination") || msg.includes("checkup")) {
        return getRandomResponse(botResponses.serviceDetails.pediatric_wellness);
    }
    if (msg.includes("advanced diagnostics") || msg.includes("diagnostics") || msg.includes("lab") || msg.includes("test") || msg.includes("pathology")) {
        return getRandomResponse(botResponses.serviceDetails.advanced_diagnostics);
    }

    // 3. General Synonyms
    const synonyms = {
        about: [" about the clinic", "information", "details", "what is blessings", "mission"],
        timing: ["time", "timing", "hours", "open", "schedule", "working"," about clinic timing","timings"],
        location: ["location", "address", "where", "find", "place", "map"],
        contact: ["contact", "phone", "email", "reach", "number", "call"],
        doctors: ["doctor", "physician", "specialist"],
        services: ["service", "treatment", "care", "facility", "lab", "checkup"],
        appointment: ["appointment", "book", "schedule visit", "reservation", "consultation"],
        thanks: ["thank", "thanks", "thank you"],
        goodbye: ["bye", "see you", "goodbye", "exit"]
    };

    for (const [category, words] of Object.entries(synonyms)) {
        for (const word of words) {
            if (msg.includes(word)) return getRandomResponse(botResponses[category]);
        }
    }
    
    // 4. Fallback
    return getRandomResponse(botResponses.default);
};

// ====================================================================
// GLOBAL FUNCTIONS - Accessible immediately for inline HTML handlers
// ====================================================================

// Placeholder for DOMElements to be populated on DOMContentLoaded
let DOMElements = {}; 
let reviews = [];
let autoSlideInterval;
let currentSlide = 0;

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
    }
};

/** Sends the user's message (placeholder, overridden below). */
window.sendMessage = () => {};

/** Handles the Enter key press in the chat input (calls the function defined in DOMContentLoaded). */
window.handleKeyPress = (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        window.sendMessage();
    }
};

/** Deletes a review by ID (placeholder, overridden below). */
window.deleteReview = (id) => {};


// ====================================================================
// SECTION 2: MAIN DOM CONTENT LOADED LOGIC 
// All elements and internal functions are initialized here.
// ====================================================================

document.addEventListener('DOMContentLoaded', () => {

    // -------------------- 2.1 DOM & STATE INITIALIZATION --------------------
    // Initialize DOMElements with all required IDs
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
        sendButton: document.getElementById('sendButton'), // Added send button reference
        span1: document.getElementById('span1'),
        span2: document.getElementById('span2'),
        span3: document.getElementById('span3'),
    };

    reviews = JSON.parse(localStorage.getItem('blessingsClinicReviews')) || [];

    // Check for essential chat elements
    if (!DOMElements.chatMessages || !DOMElements.chatInput) {
        console.error("Essential chat elements (chatMessages or chatInput) not found in the DOM. Chatbot will not function.");
        // Continue with other functionality if chat elements are missing
    }

    // -------------------- 2.2 MOBILE MENU LOGIC --------------------
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

    // -------------------- 2.3 CAROUSEL LOGIC --------------------
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


    // -------------------- 2.4 FAQ ACCORDION LOGIC --------------------
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
    
    // --- FAQ Filtering Logic ---
    const filterButtons = document.querySelectorAll('.faq-filter-btn');
    const faqItems = document.querySelectorAll('.faq-item');

    function filterFaqs(filter) {
        filterButtons.forEach(btn => {
            if (btn.dataset.filter === filter) {
                btn.classList.add('bg-primary-indigo', 'text-white', 'shadow-md');
                btn.classList.remove('border', 'border-primary-indigo', 'text-primary-indigo', 'hover:bg-indigo-50');
            } else {
                btn.classList.remove('bg-primary-indigo', 'text-white', 'shadow-md');
                btn.classList.add('border', 'border-primary-indigo', 'text-primary-indigo', 'hover:bg-indigo-50');
            }
        });

        faqItems.forEach(item => {
            const categories = item.getAttribute('data-categories');
            if (filter === 'all' || categories.includes(filter)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            filterFaqs(filter);
        });
    });
    filterFaqs('all'); // Initialize filter


    // -------------------- 2.5 REVIEW SYSTEM LOGIC --------------------

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
            
            // Using fas for solid and far for regular (empty) stars
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

    // Override global placeholder for deleteReview
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
            // Using console.error instead of alert as per instructions for iFrame environment
            console.error('Please enter your feedback and select a star rating.');
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
        // Feedback message for successful submission
        console.log('Thank you for sharing your experience!');
    };

    DOMElements.reviewForm?.addEventListener('submit', submitReview);
    displayReviews(); // Initial display of reviews


    // -------------------- 2.6 CHATBOT UI & FUNCTIONALITY --------------------

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


    // Override global placeholder for sendMessage
    window.sendMessage = () => {
        if (!DOMElements.chatInput) return;
        const message = DOMElements.chatInput.value.trim();
        
        // Prevent sending empty messages
        if (!message) return;

        addMessage(message, 'user', false);
        DOMElements.chatInput.value = '';
        
        // Use the globally defined bot logic
        const response = getBotResponse(message); 
        addMessage(response, 'bot', true);
    };
    
    // Initial greeting if chatbot is visible (only show if no messages exist)
    if (DOMElements.chatbot && DOMElements.chatMessages.children.length === 0) {
        // Use a slight delay to ensure all UI is painted before the greeting appears
        setTimeout(() => {
            addMessage(getRandomResponse(botResponses.greetings.neutral), 'bot', false);
        }, 300);
    }

    // Event listener for sending messages on Enter key (already set globally, but re-added here for safety/clarity)
    DOMElements.chatInput?.addEventListener('keypress', window.handleKeyPress);

    // Event listener for send button
    DOMElements.sendButton?.addEventListener('click', window.sendMessage);
});
