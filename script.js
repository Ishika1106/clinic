let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');
const totalSlides = slides.length;
let chatbotOpen = false;

const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const chatbot = document.getElementById('chatbot');
const chatbotBtn = document.getElementById('chatbotBtn');
const indicators = document.getElementById('carouselIndicators');

// -------------------- CAROUSEL (UNCHANGED) --------------------
function showSlide(index) {
    slides.forEach((slide, i) => {
        // Toggle the 'active' class to control visibility, opacity, and z-index
        // as defined in the <style> block of the HTML file.
        if(i === index){
            slide.classList.add('active');
        } else {
            slide.classList.remove('active');
        }
    });
    updateIndicators();
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

function updateIndicators() {
    if(!indicators) return;
    indicators.innerHTML = '';
    slides.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.classList.add('w-3','h-3','rounded-full','cursor-pointer','transition-colors','duration-300');
        if(i === currentSlide){
            // Use the custom color variable name for consistency
            dot.classList.add('bg-secondary-blue');
        } else {
            dot.classList.add('bg-gray-400');
        }
        dot.addEventListener('click', () => {
            currentSlide = i;
            showSlide(currentSlide);
        });
        indicators.appendChild(dot);
    });
}

// Helper function for smooth scrolling from buttons
function scrollToSection(id) {
    const section = document.getElementById(id);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Initialize Carousel
if (slides.length > 0) {
    showSlide(currentSlide);
    setInterval(nextSlide, 5000);
}


// -------------------- BOT RESPONSES (UPDATED) --------------------
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
    // Only one doctor listed
    doctors: [
        "Our Chief Pediatrician is **Dr. Deepika Gulati Dumeer**.",
        "We are led by Dr. Deepika Gulati Dumeer, a specialist in Pediatric Medicine."
    ],
    // Only Dr. Deepika's details remain
    doctorDetails: {
        "deepika": "Dr. Deepika Gulati Dumeer is our **Chief Pediatrician**. She specializes in Pediatric Medicine and Neonatology, with 15+ years of experience. Education: Harvard Medical School, Johns Hopkins Residency.",
    },
    services: [
        "Our core services include:\n1. **Routine Checkups**\n2. **Vaccinations/Immunizations**\n3. **Specialized Consultations**\n4. **Laboratory Tests (Blood, Tissue)**\n\nWhich service interests you the most?"
    ],
    appointment: [
        "To book an appointment, please visit our **Pediatrics** page and look for the 'Book an Appointment' section, or call us directly at (555) 123-4567.",
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
        "I can only provide details on our Chief Pediatrician, Dr. Deepika Gulati Dumeer. Please ask about her!",
        "Could you please clarify? I only have information for Dr. Deepika."
    ]
};

// -------------------- CHATBOT LOGIC (UPDATED) --------------------

// Simple sentiment detection based on keywords
function getSentiment(msg) {
    const positiveWords = ["great", "excellent", "happy", "love", "fantastic"];
    if (positiveWords.some(word => msg.includes(word))) {
        return 'positive';
    }
    return 'neutral';
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
        
        // If they ask specifically about Dr. Deepika, give details
        if (key.includes('deepika') || key.includes('pediatrician')) {
            return botResponses.doctorDetails.deepika;
        }
        
        // If they ask about Dr. Nitin or Pathologist, give the limited error/clarification
        if (key.includes('nitin') || key.includes('pathologist')) {
            return getRandomResponse(botResponses.error);
        }
    }
    
    // --- 3. General Synonyms & Intent Mapping ---
    const synonyms = {
        about: ["about", "clinic", "information", "details", "who are you", "what is blessings", "mission"],
        timing: ["time", "timing", "hours", "open", "schedule", "working"],
        location: ["location", "address", "where", "find", "place", "map"],
        contact: ["contact", "phone", "email", "reach", "number", "call"],
        doctors: ["doctor", "physician", "specialist"], // Keep this general, specific names are handled above
        services: ["service", "treatment", "care", "facility", "test", "lab", "checkup", "cost", "price"],
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

function getRandomResponse(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// -------------------- CHATBOT UI (IMPROVED) --------------------
function toggleChatbot() {
    chatbotOpen = !chatbotOpen;
    if (chatbotOpen) {
        chatbot.classList.remove('hidden');
        chatbot.classList.add('animate-fade-in');
        // Initial greeting on open
        if (chatMessages.children.length === 0) {
             addMessage(getRandomResponse(botResponses.greetings.neutral), 'bot', false);
        }
    } else {
        chatbot.classList.add('hidden');
        chatbot.classList.remove('animate-fade-in');
    }
}

function addMessage(content, sender, isTyping = true) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('flex', 'mb-3');
    
    if (sender === 'user') {
        messageDiv.classList.add('justify-end');
        messageDiv.innerHTML = `<div class="bg-secondary-blue text-white p-3 rounded-xl rounded-br-none max-w-[80%] shadow-md">${content}</div>`;
        chatMessages.appendChild(messageDiv);
    } else {
        messageDiv.classList.add('justify-start');
        // If not typing, just show the message immediately (used for initial greeting)
        if (!isTyping) {
            messageDiv.innerHTML = `<div class="bg-primary-indigo text-white p-3 rounded-xl rounded-tl-none max-w-[80%] shadow-md whitespace-pre-wrap">${content}</div>`;
            chatMessages.appendChild(messageDiv);
        } else {
             // Create a container for the typing animation
            messageDiv.classList.add('typing-container');
            chatMessages.appendChild(messageDiv);
            
            // Add typing animation
            const typingAnimation = addTyping(messageDiv);

            // Calculate realistic delay based on message length (15ms per character + base delay)
            const typingDelay = 500 + Math.min(content.length * 15, 1200);

            setTimeout(() => {
                // Remove typing animation
                typingAnimation.remove();
                
                // Add the final response container
                const responseDiv = document.createElement('div');
                responseDiv.classList.add('bg-primary-indigo', 'text-white', 'p-3', 'rounded-xl', 'rounded-tl-none', 'max-w-[80%]', 'shadow-md', 'whitespace-pre-wrap');
                
                // Use the typeMessage function for the typing effect
                messageDiv.appendChild(responseDiv);
                typeMessage(responseDiv, content);
                
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, typingDelay);
        }
    }

    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addTyping(parentDiv) {
    const typingSpan = document.createElement('span');
    typingSpan.classList.add('dot', 'inline-block', 'w-2', 'h-2', 'bg-white', 'rounded-full', 'mx-0.5', 'animate-bounce');
    
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


// Function to simulate typing out the message content
function typeMessage(element, text, delay = 15) {
    const lines = text.split('\n');
    element.innerHTML = '';
    
    function typeLine(lineIndex) {
        if (lineIndex >= lines.length) return;

        let line = lines[lineIndex];
        let j = 0;
        
        if (lineIndex > 0) element.innerHTML += '<br>'; // Add a newline marker

        const span = document.createElement('span');
        element.appendChild(span);

        const lineInterval = setInterval(() => {
            span.textContent += line[j];
            j++;
            if (j >= line.length) {
                clearInterval(lineInterval);
                typeLine(lineIndex + 1); // Move to the next line
            }
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, delay);
    }
    
    typeLine(0);
}


function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;
    addMessage(message, 'user', false); // User message is instant
    chatInput.value = '';

    const response = getBotResponse(message);
    addMessage(response, 'bot', true); // Bot message triggers typing simulation
}


if (chatbotBtn) chatbotBtn.addEventListener('click', toggleChatbot);
chatInput.addEventListener('keydown', e => { 
    if (e.key === 'Enter') { 
        e.preventDefault(); 
        sendMessage(); 
    } 
});

// -------------------- REVIEWS SYSTEM (UNCHANGED) --------------------
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
        // Ensure styling is correctly applied for empty state
        container.classList.remove('flex', 'gap-6', 'py-4', 'overflow-x-auto', 'snap-x', 'snap-mandatory');
        return;
    }

    // Apply horizontal scroll styling when reviews exist
    container.classList.add('flex', 'gap-6', 'py-4', 'overflow-x-auto', 'snap-x', 'snap-mandatory');

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
    
    // Simple validation
    const name = formData.get('reviewerName').trim();
    const text = formData.get('reviewText').trim();
    if (!name || !text) {
        alert('Please enter your name and feedback.');
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
    reviews = reviews.filter(r => r.id !== id);
    saveReviews();
    displayReviews();
}

// -------------------- FAQ TOGGLE (UNCHANGED) --------------------
function initFAQ() {
    const faqButtons = document.querySelectorAll(".faq-btn");
    faqButtons.forEach(btn => {
        // Find the icon element within the button
        const iconContainer = btn.querySelector(".faq-icon");
        // Check for Font Awesome icons or similar placeholders
        const plusIcon = iconContainer ? iconContainer.querySelector(".fa-plus") : null;
        const minusIcon = iconContainer ? iconContainer.querySelector(".fa-minus") : null;

        if (plusIcon && minusIcon) {
            // Set initial icon state
            if (btn.getAttribute('aria-expanded') === 'true') {
                plusIcon.classList.add('hidden');
                minusIcon.classList.remove('hidden');
            } else {
                plusIcon.classList.remove('hidden');
                minusIcon.classList.add('hidden');
            }
        }


        btn.addEventListener("click", () => {
            const content = btn.nextElementSibling;
            const isExpanded = btn.getAttribute('aria-expanded') === 'true';

            // Toggle ARIA attribute
            btn.setAttribute('aria-expanded', String(!isExpanded));
            
            // Toggle visibility of content
            content.classList.toggle("hidden");

            // Toggle icons if they exist
            if (plusIcon && minusIcon) {
                plusIcon.classList.toggle('hidden');
                minusIcon.classList.toggle('hidden');
            }
        });
    });
}

// -------------------- INITIALIZATION (IMPROVED) --------------------
window.addEventListener('load', () => {
    // Check if the global function is defined (due to inline onclick on buttons)
    window.scrollToSection = (id) => {
        const section = document.getElementById(id);
        if (section) {
            // Adjust scroll to account for fixed header (nav height is approx 80px)
            const yOffset = -80; 
            const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };
    
    // Initialize Systems
    loadReviews();
    initFAQ();

    // Event listener for the Review Form (must be after loadReviews)
    document.getElementById('reviewForm')?.addEventListener('submit', submitReview);
});