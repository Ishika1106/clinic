let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');
const totalSlides = slides.length;
let chatbotOpen = false;

// DOM Elements
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const chatbot = document.getElementById('chatbot');
const chatbotBtn = document.getElementById('chatbotBtn');
const indicators = document.getElementById('carouselIndicators');

const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');


// -------------------- UTILITY FUNCTIONS --------------------

// Helper function for smooth scrolling from buttons, accounting for fixed header
function scrollToSection(id) {
    const section = document.getElementById(id);
    if (section) {
        // Adjust scroll to account for fixed header (nav height is approx 80px)
        const yOffset = -80;
        const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
    }
    // Close mobile menu if it's open
    if (mobileMenu && mobileMenu.classList.contains('open')) {
        toggleMobileMenu();
    }
}

// Global exposure for HTML onclick attributes
window.scrollToSection = scrollToSection;


// -------------------- MOBILE MENU LOGIC --------------------

function toggleMobileMenu() {
    if (!mobileMenu || !mobileMenuBtn) return;

    const isMenuOpen = mobileMenu.classList.toggle('open');

    // Hamburger icon animation
    const span1 = document.getElementById('span1');
    const span2 = document.getElementById('span2');
    const span3 = document.getElementById('span3');

    span1.classList.toggle('rotate-45', isMenuOpen);
    span1.classList.toggle('translate-y-[5px]', isMenuOpen);
    span2.classList.toggle('opacity-0', isMenuOpen);
    span3.classList.toggle('-rotate-45', isMenuOpen);
    span3.classList.toggle('-translate-y-[5px]', isMenuOpen);

    mobileMenuBtn.setAttribute('aria-expanded', isMenuOpen);
}

// Event listener for mobile menu button
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
}
// Event listeners for mobile navigation links (to close menu after click)
document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', toggleMobileMenu);
});


// -------------------- CAROUSEL LOGIC --------------------
function showSlide(index) {
    slides.forEach((slide, i) => {
        if (i === index) {
            slide.classList.add('active');
        } else {
            slide.classList.remove('active');
        }
    });
    currentSlide = index; // Update currentSlide here to match the index shown
    updateIndicators();
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

function updateIndicators() {
    if (!indicators) return;
    indicators.innerHTML = '';
    slides.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.classList.add('w-3', 'h-3', 'rounded-full', 'cursor-pointer', 'transition-colors', 'duration-300');
        if (i === currentSlide) {
            // Use a color that is clearly visible/active
            dot.classList.add('bg-primary-indigo'); 
        } else {
            dot.classList.add('bg-gray-400');
        }
        dot.addEventListener('click', () => {
            showSlide(i);
        });
        indicators.appendChild(dot);
    });
}

// Initialize Carousel
if (slides.length > 0) {
    showSlide(currentSlide);
    // Auto-advance every 5 seconds
    setInterval(nextSlide, 5000);
}


// -------------------- BOT RESPONSES --------------------
const botResponses = {
    greetings: {
        positive: [
            "Hello! I'm BlessBot, happy to help you with Blessings Clinic information today. How can I assist?",
            "Hi there! What can I do for you?"
        ],
        neutral: [
            "Hello! Welcome to Blessings Child Care And Diagnostics. I'm BlessBot. How can I assist you today?",
            "Hi there! I can share details about our clinic, our doctor, services, and how to book appointments."
        ]
    },
    about: [
        "Blessings Child Care And Diagnostics is a specialized clinic focused on **pediatric care** and **advanced diagnostics**. We provide essential services like checkups, vaccinations, and laboratory testing.",
        "Our mission is to provide compassionate, high-quality care for infants, children, and adolescents, supported by state-of-the-art diagnostic facilities."
    ],
    timing: [
        "Our clinic hours are:\n- **Monday to Friday:** 8:00 AM – 6:00 PM\n- **Saturday:** 9:00 AM – 4:00 PM\n- **Sunday:** Closed\n(Please note: Diagnostic services may have slightly different hours.)"
    ],
    location: [
        "We are located at:\n**123 Medical Center Drive, Healthcare City, HC 12345**\n\nIf you're looking for directions, please search Blessings Clinic on Google Maps."
    ],
    contact: [
        "You can reach us directly:\n- **Phone (Appointments):** (555) 123-4567\n- **Email (General Inquiries):** info@blessingsmedical.com"
    ],
    doctors: [
        "Our Chief Pediatrician is **Dr. Deepika Gulati Dumeer**.",
        "We are led by Dr. Deepika Gulati Dumeer, a specialist in Pediatric Medicine."
    ],
    doctorDetails: {
        "deepika": "Dr. Deepika Gulati Dumeer is our **Chief Pediatrician**. She specializes in Pediatric Medicine and Neonatology, with 15+ years of experience. Education: Harvard Medical School, Johns Hopkins Residency.",
    },
    services: [
        "Our core services include:\n1. **Routine Checkups**\n2. **Vaccinations/Immunizations**\n3. **Specialized Consultations**\n4. **Laboratory Tests (Blood, Tissue)**\n\nWhich service interests you the most?"
    ],
    appointment: [
        "To book an appointment, please visit our **Contact & Book** section, or call us directly at (555) 123-4567.",
        "You can schedule easily online by signing up or logging into your patient account on our website."
    ],
    thanks: [
        "You're very welcome! Is there anything else I can clarify?",
        "Happy to assist you!"
    ],
    default: [
        "I'm sorry, I couldn't understand that request. I can provide details on **Services, Dr. Deepika, Timing, or Booking**. Can you try phrasing your question differently?",
        "That information might be outside my current knowledge base. For complex inquiries, please call the clinic directly."
    ],
    error: [
        "I can only provide details on our Chief Pediatrician, **Dr. Deepika Gulati Dumeer**. Please ask about her!",
        "Could you please clarify? I only have information for Dr. Deepika."
    ]
};

// Simple sentiment detection based on keywords
function getSentiment(msg) {
    const positiveWords = ["great", "excellent", "happy", "love", "fantastic"];
    if (positiveWords.some(word => msg.includes(word))) {
        return 'positive';
    }
    return 'neutral';
}

function getRandomResponse(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getBotResponse(message) {
    const msg = message.toLowerCase().trim().replace(/[.,!?'"]/g, '');

    // --- 1. Sentiment & Greeting ---
    if (msg.includes("hi") || msg.includes("hello") || msg.includes("hey")) {
        const sentiment = getSentiment(msg);
        return getRandomResponse(botResponses.greetings[sentiment]);
    }

    // --- 2. Doctor Details Check (Specific intent) ---
    const doctorMatch = msg.match(/(deepika|dr\. deepika|pediatrician|dr\. nitin|nitin|pathologist)/);

    if (doctorMatch) {
        const key = doctorMatch[1];
        if (key.includes('deepika') || key.includes('pediatrician')) {
            return botResponses.doctorDetails.deepika;
        }
        if (key.includes('nitin') || key.includes('pathologist')) {
            return getRandomResponse(botResponses.error);
        }
    }

    // --- 3. General Synonyms & Intent Mapping ---
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
}


// -------------------- CHATBOT UI & FUNCTIONALITY --------------------

// Global exposure for HTML onclick attributes
window.toggleChatbot = toggleChatbot;

function toggleChatbot() {
    if (!chatbot) return;
    chatbotOpen = !chatbotOpen;
    if (chatbotOpen) {
        chatbot.classList.remove('hidden');
        chatbot.classList.add('animate-fade-in');
        // Initial greeting on open (if no messages)
        if (chatMessages.children.length === 0) {
             addMessage(getRandomResponse(botResponses.greetings.neutral), 'bot', false);
        }
        if (chatInput) chatInput.focus();
    } else {
        chatbot.classList.add('hidden');
        chatbot.classList.remove('animate-fade-in');
    }
}

function addTyping(parentDiv) {
    const typingDiv = document.createElement('div');
    typingDiv.classList.add('bg-gray-700', 'p-3', 'rounded-xl', 'rounded-tl-none', 'inline-block', 'shadow-md');
    typingDiv.innerHTML = `
        <span class="dot inline-block w-2 h-2 bg-white rounded-full mx-0.5 animate-bounce" style="animation-delay: 0s;"></span>
        <span class="dot inline-block w-2 h-2 bg-white rounded-full mx-0.5 animate-bounce" style="animation-delay: 0.2s;"></span>
        <span class="dot inline-block w-2 h-2 bg-white rounded-full mx-0.5 animate-bounce" style="animation-delay: 0.4s;"></span>
    `;
    parentDiv.appendChild(typingDiv);
    return typingDiv;
}

function typeMessage(element, text, delay = 15) {
    const lines = text.split('\n');
    element.innerHTML = '';

    function typeLine(lineIndex) {
        if (lineIndex >= lines.length) return;

        let line = lines[lineIndex];
        let j = 0;

        if (lineIndex > 0) element.innerHTML += '<br>';

        const span = document.createElement('span');
        element.appendChild(span);

        const lineInterval = setInterval(() => {
            span.textContent += line[j];
            j++;
            if (j >= line.length) {
                clearInterval(lineInterval);
                // Introduce a slight pause before typing the next line (if any)
                setTimeout(() => typeLine(lineIndex + 1), 100);
            }
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, delay);
    }

    typeLine(0);
}

function addMessage(content, sender, isTyping = true) {
    if (!chatMessages) return;
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('flex', 'mb-3');

    if (sender === 'user') {
        messageDiv.classList.add('justify-end', 'animate-fade-in');
        messageDiv.innerHTML = `<div class="bg-secondary-blue text-white p-3 rounded-xl rounded-br-none max-w-[80%] shadow-md">${content}</div>`;
        chatMessages.appendChild(messageDiv);
    } else {
        messageDiv.classList.add('justify-start');

        if (!isTyping) {
            // Used for initial instant greeting
            messageDiv.innerHTML = `<div class="bg-primary-indigo text-white p-3 rounded-xl rounded-tl-none max-w-[80%] shadow-md whitespace-pre-wrap animate-fade-in">${content}</div>`;
            chatMessages.appendChild(messageDiv);
        } else {
            // Typing simulation logic
            chatMessages.appendChild(messageDiv);
            const typingAnimation = addTyping(messageDiv);

            // Realistic delay (500ms base + 15ms per character)
            const typingDelay = 500 + Math.min(content.length * 15, 1200);

            setTimeout(() => {
                typingAnimation.remove();
                const responseDiv = document.createElement('div');
                responseDiv.classList.add('bg-primary-indigo', 'text-white', 'p-3', 'rounded-xl', 'rounded-tl-none', 'max-w-[80%]', 'shadow-md', 'whitespace-pre-wrap');
                messageDiv.appendChild(responseDiv);
                typeMessage(responseDiv, content);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, typingDelay);
        }
    }
    chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to bottom after adding
}

function sendMessage() {
    if (!chatInput) return;
    const message = chatInput.value.trim();
    if (!message) return;

    addMessage(message, 'user', false);
    chatInput.value = '';

    const response = getBotResponse(message);
    addMessage(response, 'bot', true);
}

// Global exposure for HTML onclick attributes
window.sendMessage = sendMessage;
window.handleKeyPress = (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        sendMessage();
    }
};


// -------------------- REVIEWS SYSTEM --------------------
let reviews = [];

function loadReviews() {
    const stored = localStorage.getItem('blessingsClinicReviews');
    reviews = stored ? JSON.parse(stored) : [];
    displayReviews();
}

function saveReviews() {
    localStorage.setItem('blessingsClinicReviews', JSON.stringify(reviews));
}

function displayReviews() {
    const container = document.getElementById('reviewsDisplay');
    if (!container) return;

    if (reviews.length === 0) {
        container.innerHTML = '<p class="text-gray-500 italic p-4">No reviews to display yet.</p>';
        container.classList.remove('flex', 'gap-6', 'py-4', 'overflow-x-auto', 'snap-x', 'snap-mandatory', 'justify-start');
        return;
    }

    container.classList.add('flex', 'gap-6', 'py-4', 'overflow-x-auto', 'snap-x', 'snap-mandatory', 'justify-start');

    container.innerHTML = reviews.map(r => {
        const stars = r.rating ? Array(5).fill(0).map((_, i) => i < r.rating ? '★' : '☆').join('') : '';
        return `
            <div class="review-item bg-white p-5 rounded-xl shadow-lg hover:shadow-2xl transition min-w-[300px] flex-shrink-0 snap-center relative border-t-4 border-secondary-blue">
                <button onclick="deleteReview(${r.id})" class="absolute top-2 right-3 text-tertiary-slate hover:text-red-500 font-bold text-xl transition" aria-label="Delete Review">&times;</button>
                <div class="review-header flex justify-between items-center mb-3">
                    <span class="reviewer-name font-bold text-primary-indigo">${r.name}</span>
                    ${stars ? `<span class="review-rating text-yellow-500 text-lg">${stars}</span>` : ''}
                </div>
                <p class="review-text text-gray-700 mb-2 italic">"${r.text}"</p>
                <p class="review-date text-gray-400 text-sm">Reviewed on: ${r.date}</p>
            </div>
        `;
    }).join('');
}

function submitReview(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    const name = formData.get('reviewerName').trim() || 'Anonymous Patient';
    const text = formData.get('reviewText').trim();
    if (!text) {
        alert('Please enter your feedback.');
        return;
    }

    const review = {
        id: Date.now(),
        name: name,
        text: text,
        rating: parseInt(formData.get('rating')),
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    };

    reviews.unshift(review);
    saveReviews();
    displayReviews();
    form.reset();
}

function deleteReview(id) {
    // Expose deleteReview globally for the onclick in displayReviews
    reviews = reviews.filter(r => r.id !== id);
    saveReviews();
    displayReviews();
}
window.deleteReview = deleteReview; // Expose globally


// -------------------- FAQ TOGGLE (Accordion) --------------------
function initFAQ() {
    const faqButtons = document.querySelectorAll(".faq-btn");
    faqButtons.forEach(btn => {
        const content = btn.nextElementSibling;
        const iconContainer = btn.querySelector(".faq-icon");
        const plusIcon = iconContainer ? iconContainer.querySelector(".fa-plus") : null;
        const minusIcon = iconContainer ? iconContainer.querySelector(".fa-minus") : null;

        const isInitiallyExpanded = btn.getAttribute('aria-expanded') === 'true';

        // Set initial state
        if (isInitiallyExpanded) {
            content.classList.remove('hidden');
            plusIcon?.classList.add('hidden');
            minusIcon?.classList.remove('hidden');
        } else {
            content.classList.add('hidden');
            plusIcon?.classList.remove('hidden');
            minusIcon?.classList.add('hidden');
        }

        btn.addEventListener("click", () => {
            const isExpanded = btn.getAttribute('aria-expanded') === 'true';

            // Close all other open FAQs
            document.querySelectorAll(".faq-btn").forEach(otherBtn => {
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

            // Toggle current FAQ
            btn.setAttribute('aria-expanded', String(!isExpanded));
            content.classList.toggle("hidden");
            plusIcon?.classList.toggle('hidden');
            minusIcon?.classList.toggle('hidden');
        });
    });
}


// -------------------- INITIALIZATION --------------------
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Systems
    loadReviews();
    initFAQ();

    // Attach Event listener for the Review Form
    document.getElementById('reviewForm')?.addEventListener('submit', submitReview);
});