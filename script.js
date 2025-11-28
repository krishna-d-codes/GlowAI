/* ----------------------
   Mobile Menu Toggle + Dropdown
----------------------- */
const mobileMenuBtn = document.querySelector('.mobile-menu');
const navMenu = document.querySelector('.nav-menu');
const dropdown = document.querySelector('.dropdown');
const dropdownToggle = document.querySelector('.dropdown-toggle');

if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Handle dropdown in mobile menu
    if (dropdownToggle && dropdown) {
        dropdownToggle.addEventListener('click', (e) => {
            if (navMenu.classList.contains('active')) {
                e.preventDefault();
                dropdown.classList.toggle('mobile-open');
            }
        });
    }

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            navMenu.classList.remove('active');
            if (dropdown) dropdown.classList.remove('mobile-open');
        }
    });

    // Close dropdown when clicking menu items (but not the toggle)
    const menuItems = navMenu.querySelectorAll('a:not(.dropdown-toggle)');
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            navMenu.classList.remove('active');
            if (dropdown) dropdown.classList.remove('mobile-open');
        });
    });
}


/* ----------------------
   Carousel Slider
----------------------- */
const carousel = document.querySelector('#kitsCarousel');
const dots = document.querySelectorAll('.carousel-dot');
let currentSlide = 0;
let autoSlideInterval;

function showSlide(index) {
    if (!carousel || dots.length === 0) return;
    currentSlide = index;
    const slideWidth = carousel.querySelector('.carousel-item').offsetWidth;
    carousel.style.transform = `translateX(-${slideWidth * index}px)`;

    dots.forEach(dot => dot.classList.remove('active'));
    dots[index].classList.add('active');
}

function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
        currentSlide = (currentSlide + 1) % dots.length;
        showSlide(currentSlide);
    }, 5000);
}

if (carousel && dots.length > 0) {
    showSlide(currentSlide);
    startAutoSlide();

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            clearInterval(autoSlideInterval);
            showSlide(index);
            startAutoSlide();
        });
    });
}

/* ----------------------
   Before/After Slider Handle
----------------------- */
const sliderHandle = document.querySelector('.slider-handle');
const sliderContainer = document.querySelector('.slider-container');

if (sliderHandle && sliderContainer) {
    let isDragging = false;

    const moveHandle = (x) => {
        const rect = sliderContainer.getBoundingClientRect();
        let posX = x - rect.left;
        if (posX < 20) posX = 20;
        if (posX > rect.width - 20) posX = rect.width - 20;

        sliderHandle.style.left = `${posX}px`;
    };

    sliderHandle.addEventListener('mousedown', () => { isDragging = true; });
    document.addEventListener('mouseup', () => { isDragging = false; });
    document.addEventListener('mousemove', (e) => {
        if (isDragging) moveHandle(e.clientX);
    });

    sliderHandle.addEventListener('touchstart', () => { isDragging = true; });
    document.addEventListener('touchend', () => { isDragging = false; });
    document.addEventListener('touchmove', (e) => {
        if (isDragging) moveHandle(e.touches[0].clientX);
    });
}

/* ----------------------
   Quiz Modal Logic
----------------------- */
const quizModal = document.querySelector('#quizModal');
const openQuizBtn = document.querySelector('#startQuizBtn');
const closeQuizBtn = document.querySelector('#closeQuiz');
const quizForm = document.querySelector('#quizForm');
const productsSection = document.querySelector('#products');

if (openQuizBtn && quizModal) {
    openQuizBtn.addEventListener('click', () => {
        quizModal.classList.add('active');
    });
}

if (closeQuizBtn) {
    closeQuizBtn.addEventListener('click', () => {
        quizModal.classList.remove('active');
    });
}

if (quizModal) {
    quizModal.addEventListener('click', (e) => {
        if (e.target === quizModal) quizModal.classList.remove('active');
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') quizModal.classList.remove('active');
    });
}




/* ----------------------
   Contact Form (Formspree) Submission with Popup and Redirect
----------------------- */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: formData,
        headers: { 'Accept': 'application/json' },
      });

      if (response.ok) {
        alert("✅ Thank you! Your message has been sent.");
        form.reset();
        form.style.display = 'none'; // hide form after submission
        window.location.href = '#home'; // redirect immediately after OK clicked
      } else {
        alert('Oops! There was a problem submitting your form.');
      }
    } catch (error) {
      alert('Oops! There was a problem submitting your form.');
      console.error(error);
    }
  });
});





/* ----------------------
   Kit Functionality (integrates with existing cart)
----------------------- */
document.addEventListener('DOMContentLoaded', function() {
    const kitButtons = document.querySelectorAll('.kit-button');
    
    kitButtons.forEach(button => {
        button.addEventListener('click', function() {
            const kitId = this.getAttribute('data-kit-id');
            const kitName = this.getAttribute('data-kit-name');
            const kitPrice = parseFloat(this.getAttribute('data-kit-price'));
            
            // Add to cart using your existing cart system
            addKitToExistingCart(kitId, kitName, kitPrice);
            
            // Show button feedback
            showKitButtonFeedback(this, kitName);
        });
    });
});

// Function that works with your existing cart array structure
function addKitToExistingCart(id, name, price) {
    // Check if kit already exists in cart
    const existing = cart.find(item => item.id === id);
    
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ id, name, price, qty: 1 });
    }
    
    // Use your existing updateCartCount function
    updateCartCount();
    
    console.log('Kit added to cart:', { id, name, price });
    console.log('Current cart:', cart);
}

// Button feedback for kits
function showKitButtonFeedback(button, kitName) {
    const originalText = button.textContent;
    const originalBg = button.style.background;
    
    // Change to success state
    button.textContent = '✓ Added!';
    button.style.background = '#26de81';
    button.style.transform = 'scale(1.05)';
    button.disabled = true;
    
    // Show floating message
    showKitFloatingMessage(kitName);
    
    // Revert button after 2 seconds
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = originalBg;
        button.style.transform = '';
        button.disabled = false;
    }, 2000);
}

// Floating success message for kits
function showKitFloatingMessage(kitName) {
    const message = document.createElement('div');
    message.textContent = `${kitName} added to cart!`;
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(38, 222, 129, 0.95);
        color: white;
        padding: 20px 30px;
        border-radius: 12px;
        font-weight: 600;
        font-size: 1.1em;
        z-index: 10000;
        backdrop-filter: blur(10px);
        box-shadow: 0 10px 30px rgba(38, 222, 129, 0.3);
        animation: kitMessageAnimation 3s ease-out forwards;
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        if (message.parentNode) {
            message.remove();
        }
    }, 3000);
}


/* ----------------------
   Enhanced Add to Cart functionality for regular products
   REPLACE the existing addToCartButtons event listeners in your script.js
----------------------- */

// Function to add enhanced functionality to regular product buttons
function enhanceProductButtons() {
    const addToCartButtons = document.querySelectorAll('.btn-add');
    
    addToCartButtons.forEach(button => {
        // Clone the button to remove all existing event listeners
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        
        // Add enhanced click handler to the new button
        newButton.addEventListener('click', handleProductClick);
    });
}

// Enhanced click handler for regular products
function handleProductClick(e) {
    const button = e.target;
    const productId = button.getAttribute('data-id');
    const productName = button.getAttribute('data-name');
    const productPrice = parseFloat(button.getAttribute('data-price'));
    
    // Add to cart using existing function
    const existing = cart.find(item => item.id === productId);
    
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ id: productId, name: productName, price: productPrice, qty: 1 });
    }
    
    updateCartCount();
    
    // Show enhanced button feedback (same as kits)
    showProductButtonFeedback(button, productName);
    
    console.log('Product added to cart:', { id: productId, name: productName, price: productPrice });
    console.log('Current cart:', cart);
}

// Enhanced button feedback for regular products (same as kits)
function showProductButtonFeedback(button, productName) {
    const originalText = button.textContent;
    const originalBg = button.style.background;
    
    // Change to success state
    button.textContent = '✓ Added!';
    button.style.background = '#26de81';
    button.style.transform = 'scale(1.05)';
    button.disabled = true;
    
    // Show floating message
    showProductFloatingMessage(productName);
    
    // Revert button after 2 seconds
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = originalBg;
        button.style.transform = '';
        button.disabled = false;
    }, 2000);
}

// Floating success message for regular products (same as kits)
function showProductFloatingMessage(productName) {
    const message = document.createElement('div');
    message.textContent = `${productName} added to cart!`;
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(38, 222, 129, 0.95);
        color: white;
        padding: 20px 30px;
        border-radius: 12px;
        font-weight: 600;
        font-size: 1.1em;
        z-index: 10000;
        backdrop-filter: blur(10px);
        box-shadow: 0 10px 30px rgba(38, 222, 129, 0.3);
        animation: productMessageAnimation 3s ease-out forwards;
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        if (message.parentNode) {
            message.remove();
        }
    }, 3000);
}

// Initialize enhanced functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    enhanceProductButtons();
});

// Also initialize after any dynamic content is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enhanceProductButtons);
} else {
    enhanceProductButtons();
}



/* ===== ENHANCED OFFLINE CHATBOT FUNCTIONALITY ===== */

// Enhanced offline chatbot responses with skincare tips and unique features
const offlineChatResponses = {
  // Skin concerns (existing)
  "acne": "Our Clear Skin Acne Treatment with salicylic acid works wonders! Also try our Niacinamide + Zinc serum to control oil production. Both are dermatologist-approved!",
  "dry skin": "For dry skin, I recommend our Hyaluronic Hydrating Serum - it's our #1 bestseller! Pair it with our Ceramide Barrier Repair Cream for ultimate hydration.",
  "oily skin": "Oily skin loves our Niacinamide + Zinc serum! It minimizes pores and controls shine. Also try our Gentle Daily Foam Cleanser.",
  "anti-aging": "Our Retinol Age Defense Cream reduces fine lines, and our Advanced Peptide Complex firms skin beautifully. Both are clinically proven!",
  "sensitive skin": "Our Sensitive Skin Savior kit is fragrance-free and hypoallergenic. The Organic Oat Cleanser is perfect too - 100% natural!",
  
  // SKINCARE TIPS (NEW)
  "tips": "Here are my top skincare tips: 1) Always use sunscreen (even indoors), 2) Never skip moisturizer, 3) Introduce new products one at a time, 4) Be gentle - no harsh scrubbing, 5) Consistency beats expensive products!",
  "morning routine": "Perfect morning routine: Gentle cleanser → Vitamin C serum → Moisturizer → SPF 30+ sunscreen. Keep it simple but effective!",
  "night routine": "Night routine essentials: Double cleanse → Treatment (retinol/acids) → Hydrating serum → Rich moisturizer. This is when skin repairs itself!",
  "daytime skincare": "Daytime refresh: Gentle cleanser if needed, hydrating mist, reapply sunscreen, and stay hydrated! Light touch-ups only during the day.",
  "day routine": "Midday skincare: Blot excess oil with tissue, hydrating mist, sunscreen reapplication if outdoors, and drink water for internal hydration!",
  "sunscreen": "Sunscreen is non-negotiable! Use SPF 30+ daily, reapply every 2 hours, and don't forget neck/ears. It prevents 80% of visible aging!",
  "double cleanse": "Double cleansing game-changer: Oil cleanser first (removes makeup/sunscreen) → Water-based cleanser second (deep clean). Your skin will thank you!",
  "exfoliate": "Exfoliate 1-2x weekly max! Over-exfoliation damages your skin barrier. Try our gentle enzyme exfoliants instead of harsh scrubs.",
  "hydration": "Hydration tip: Apply serums on damp skin, then seal with moisturizer. Hyaluronic acid works best on wet skin - it needs water to plump!",
  "patch test": "Always patch test new products! Apply behind your ear for 24-48 hours. Better safe than sorry with a full-face reaction!",
  
  // SEASONAL TIPS (NEW)
  "winter skincare": "Winter skin needs extra love! Switch to cream cleansers, add a hydrating serum, use a humidifier, and never skip moisturizer!",
  "summer skincare": "Summer essentials: Lightweight moisturizer, gel cleansers, extra antioxidants (Vitamin C), and reapply sunscreen every 2 hours!",
  
  // INGREDIENT EDUCATION (ENHANCED)
  "vitamin c": "Vitamin C brightens and protects! Use in AM with sunscreen. Our Custom Vitamin C Serum is stable and effective. Start with lower concentrations!",
  "retinol": "Retinol is the anti-aging gold standard! Start slow (2x/week), always use at night, and NEVER skip sunscreen the next day!",
  "hyaluronic acid": "Hyaluronic acid holds 1000x its weight in water! Apply on damp skin, then moisturizer. Works for all skin types!",
  "niacinamide": "Niacinamide reduces pore appearance and oil production. Great for sensitive skin and pairs well with everything!",
  "salicylic acid": "Salicylic acid unclogs pores and reduces blackheads. Start 2-3x/week, always follow with moisturizer!",
  
  // LIFESTYLE TIPS (NEW)
  "sleep": "Beauty sleep is real! 7-9 hours helps skin repair. Sleep on silk pillowcases and change them weekly for clearer skin!",
  "water": "Hydration starts from within! Drink 8 glasses daily, eat water-rich foods (cucumber, watermelon), and use a humidifier!",
  "stress": "Stress shows on your skin! Try meditation, exercise, or skincare rituals as self-care. Stress hormones trigger breakouts!",
  "diet": "Skin-loving foods: Omega-3s (fish, walnuts), antioxidants (berries, green tea), and zinc (pumpkin seeds). Limit dairy and sugar!",
  
  // COMMON MISTAKES (NEW)
  "mistakes": "Top skincare mistakes to avoid: 1) Over-washing, 2) Skipping moisturizer on oily skin, 3) Not using sunscreen daily, 4) Changing products too quickly, 5) Harsh scrubbing!",
  "pores": "Can't shrink pores, but can minimize appearance! Keep them clean with salicylic acid, use niacinamide, and never skip sunscreen!",
  "blackheads": "Blackheads aren't dirt! They're oxidized oil. Use salicylic acid regularly, try oil cleansing, and resist picking!",
  
  // AGE-SPECIFIC TIPS (NEW)
  "teens": "Teen skin tips: Gentle cleanser, spot treatment for acne, lightweight moisturizer, and SPF daily. Less is more at this age!",
  "20s": "20s prevention: Start sunscreen religiously, add Vitamin C, gentle exfoliation, and establish good habits now!",
  "30s": "30s maintenance: Add retinol, eye cream, antioxidants, and focus on prevention. Collagen production starts slowing down!",
  "40s": "40s renewal: Stronger retinoids, peptides, hydrating masks, and professional treatments. Invest in quality products!",
  
  // QUICK FIXES (NEW)
  "puffy eyes": "Puffy eyes quick fix: Cold compress, caffeine eye cream, sleep elevated, and stay hydrated. Our peptide eye cream works wonders!",
  "dull skin": "Instant glow: Gentle exfoliation, Vitamin C serum, hydrating mask, and facial massage. Dull skin needs renewal!",
  "emergency": "Skincare emergency kit: Hydrocolloid patches for pimples, aloe for irritation, cold compress for puffiness, and gentle moisturizer!",
  
  // Existing responses...
  "routine": "Morning: Cleanser → Vitamin C Serum → Moisturizer → Sunscreen. Evening: Cleanser → Treatment → Moisturizer. Start simple!",
  "budget": "Budget-friendly picks: Pure Rose Water Toner ($15), Organic Oat Cleanser ($18), Raw Shea Butter Moisturizer ($22)!",
  "hello": "Hello! Welcome to GlowAI! I'm here for skincare tips and product recommendations. What's your main concern?",
  "hi": "Hi! Ready to glow? I can help with skincare routines, ingredient advice, or product recommendations!",
  "thank you": "You're welcome! Remember: consistency is key, and your skin is unique. Feel free to ask more questions!",
  "best products": "Our bestsellers: Hyaluronic Hydrating Serum, Gentle Daily Foam Cleanser, and Niacinamide + Zinc. Proven favorites!",
  "ai": "Our AI analyzes skin type, concerns, lifestyle, and preferences to create perfect matches. It's like having a personal dermatologist!"
};


// Enhanced greeting based on time
function getTimeBasedGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  if (hour < 21) return "Good Evening";
  return "Good Night";
}

// Dynamic routine button based on time
function setRoutineButton() {
  const hour = new Date().getHours();
  const routineBtn = document.getElementById("routineBtn");
  
  if (!routineBtn) return;
  
  if (hour >= 6 && hour < 12) {
    // Morning (6 AM - 12 PM)
    routineBtn.textContent = "Morning Routine";
    routineBtn.setAttribute("data-message", "What's a good morning routine?");
  } else if (hour >= 12 && hour < 18) {
    // Afternoon (12 PM - 6 PM)
    routineBtn.textContent = "Day Routine";
    routineBtn.setAttribute("data-message", "What should I do for daytime skincare?");
  } else {
    // Evening/Night (6 PM - 6 AM)
    routineBtn.textContent = "Night Routine";
    routineBtn.setAttribute("data-message", "What's a good night routine?");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const chatBubble = document.getElementById("chatBubble");
  const chatWindow = document.getElementById("chatWindow");
  const chatOverlay = document.getElementById("chatOverlay");
  const closeChatBtn = document.getElementById("closeChatBtn");
  const chatMessages = document.getElementById("chatMessages");
  const chatInput = document.getElementById("chatInput");
  const sendChatBtn = document.getElementById("sendChatBtn");
  const startChatBtn = document.getElementById("startChatBtn");
  const chatGreeting = document.getElementById("chatGreeting");
  const welcomeMessage = document.getElementById("welcomeMessage");
  const quickSuggestions = document.getElementById("quickSuggestions");

  // Set dynamic greeting
  if (chatGreeting && welcomeMessage) {
    const greeting = getTimeBasedGreeting();
    welcomeMessage.textContent = `${greeting} I'm GlowAI Assistant.`;
  }

  setRoutineButton();

  // Toggle chat functions
  function openChat() {
    chatWindow.style.display = "flex";
    chatOverlay.style.display = "block";
    setTimeout(() => chatInput.focus(), 100);
  }
  
  function closeChat() {
    chatWindow.style.display = "none";
    chatOverlay.style.display = "none";
  }

  // Event listeners
  chatBubble?.addEventListener("click", openChat);
  startChatBtn?.addEventListener("click", openChat);
  closeChatBtn?.addEventListener("click", closeChat);
  chatOverlay?.addEventListener("click", closeChat);

  // Quick suggestion buttons
  quickSuggestions?.addEventListener("click", (e) => {
    if (e.target.classList.contains("suggestion-btn")) {
      const message = e.target.getAttribute("data-message");
      chatInput.value = message;
      sendMessage();
    }
  });

  // Add message function with enhanced styling
  function addMessage(sender, text, isTyping = false) {
    const msg = document.createElement("div");
    msg.className = `chat-message ${sender}`;
    
    if (isTyping) {
      msg.innerHTML = `<div class="message-bubble ${sender}">
        <span style="opacity: 0.6;">GlowAI is typing</span>
        <span style="animation: pulse 1s ease-in-out infinite;">...</span>
      </div>`;
    } else {
      msg.innerHTML = `<div class="message-bubble ${sender}">${text}</div>`;
    }
    
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    return msg;
  }

  // Enhanced message sending
  function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;
    
    // Add user message
    addMessage("user", message);
    chatInput.value = "";

    // Show typing indicator
    const typingMsg = addMessage("bot", "", true);

    // Simulate thinking time
    setTimeout(() => {
      typingMsg.remove();
      
      // Get response
      const response = getBotResponse(message.toLowerCase());
      addMessage("bot", response);
    }, 1000 + Math.random() * 1000); // 1-2 seconds delay for realism
  }

  // Enhanced bot response logic
  function getBotResponse(message) {
    // Check for specific keywords in user message
    for (const [keyword, response] of Object.entries(offlineChatResponses)) {
      if (message.includes(keyword)) {
        return response;
      }
    }

    // Enhanced fallback responses
    const fallbacks = [
      "I'd love to help you with that! For specific skincare questions, try asking about acne, dry skin, anti-aging, or routines. What's your main concern?",
      "That's interesting! I'm here to help with skincare tips and product recommendations. What would you like to know about your skin?",
      "I specialize in skincare guidance! Feel free to ask about our products, routines, or any skin concerns you have. How can I help you glow?",
      "I can share skincare advice, product suggestions, or routine tips. What's on your skincare wishlist?"
    ];

    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }

  // Send message event listeners
  sendChatBtn?.addEventListener("click", sendMessage);
  chatInput?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  });

  // Enhanced quiz handling (keep existing quiz functionality)
  const quizForm = document.getElementById("quizForm");
  quizForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(quizForm);
    let target = "#best-sellers"; // default
    
    // Smart routing based on quiz answers
    if (data.get("q1") === "oily" || data.get("q2") === "yes") target = "#concerns";
    else if (data.get("q3") === "yes") target = "#concerns";
    else if (data.get("q4") === "very") target = "#budget-eco";
    else if (data.get("q1") === "dry") target = "#best-sellers";

    alert('Thank you! We will recommend products based on your answers.');
    quizForm.reset();
    document.getElementById("quizModal")?.classList.remove("active");
    
    setTimeout(() => {
      window.location.href = target;
    }, 500);
  });
});




/* =====================================================
   🎯 SIMPLIFIED CLOUD TOOLTIP SYSTEM + COMPLETE CHATBOT
   (Replace the SkincareCatchyTooltip class in your script.js)
===================================================== */

class SkincareCatchyTooltip {
  constructor() {
    this.tooltip = document.getElementById('chatTooltip');
    this.tooltipText = document.getElementById('tooltipText');
    this.chatBubble = document.getElementById('chatBubble');
    
    this.currentIndex = 0;
    this.isVisible = false;
    this.tooltipTimer = null;
    this.cycleTimer = null;
    
    // 🌈 SIMPLIFIED SKINCARE TIPS (NO COLOR CHANGES)
    this.skincareQuotes = [
      { 
        text: "✨ Confused about your skin type?", 
        question: "What is my skin type?"
      },
      { 
        text: "🤔 Need acne treatment advice?", 
        question: "I have acne"
      },
      { 
        text: "💡 Want anti-aging solutions?", 
        question: "Give me anti-aging solutions"
      },
      { 
        text: "🌸 Sensitive skin concerns?", 
        question: "I have sensitive skin"
      },
      { 
        text: "🏜️ Struggling with dry skin?", 
        question: "I have dry skin"
      },
      { 
        text: "🛢️ Oily skin problems?", 
        question: "I have oily skin"
      },
      { 
        text: "⚡ Dark spots bothering you?", 
        question: "Help with dark spots"
      },
      { 
        text: "🎯 Perfect routine guidance?", 
        question: "Build me a skincare routine"
      },
      { 
        text: "🧪 Questions about ingredients?", 
        question: "Explain skincare ingredients"
      },
      { 
        text: "💰 Budget-friendly skincare?", 
        question: "Show me budget-friendly products"
      },
      { 
        text: "🌱 Natural product options?", 
        question: "Recommend natural products"
      },
      { 
        text: "👀 Puffy eyes solutions?", 
        question: "How to reduce puffy eyes"
      },
      { 
        text: "💎 Glowing skin secrets?", 
        question: "How to get glowing skin"
      },
      { 
        text: "⏰ Morning routine help?", 
        question: "Perfect morning skincare routine"
      },
      { 
        text: "🌙 Night skincare tips?", 
        question: "Night skincare routine tips"
      },
      { 
        text: "🧴 Product combinations safe?", 
        question: "Which products can I mix together"
      },
      { 
        text: "📊 Skin analysis needed?", 
        question: "How to analyze my skin"
      },
      { 
        text: "🎁 Personalized recommendations?", 
        question: "Give me personalized product recommendations"
      },
      { 
        text: "🔬 Science-backed advice?", 
        question: "Share science-backed skincare facts"
      },
      { 
        text: "⭐ Customer favorites?", 
        question: "What are your bestselling products"
      },
      { 
        text: "🚀 Quick skin fixes?", 
        question: "Quick fixes for skin problems"
      },
      { 
        text: "💧 Hydration guidance?", 
        question: "How to properly hydrate my skin"
      },
      { 
        text: "☀️ Sun protection tips?", 
        question: "Tell me about sunscreen"
      },
      { 
        text: "🎪 Skincare routine order?", 
        question: "What order should I apply products"
      },
      { 
        text: "🤝 Expert consultation?", 
        question: "Do you offer expert consultations"
      }
    ];
    
    this.init();
  }

  init() {
    if (!this.tooltip || !this.tooltipText) return;
    
    // Start after 10 seconds
    setTimeout(() => {
      this.startSkincareQuotes();
    }, 10000);
    
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Tooltip click enters question in chat and answers
    this.tooltip?.addEventListener('click', () => {
      const currentQuote = this.skincareQuotes[(this.currentIndex - 1 + this.skincareQuotes.length) % this.skincareQuotes.length];
      if (currentQuote) {
        this.hideTooltip();
        this.enterQuestionInChat(currentQuote.question);
      }
    });
    
    // Chat bubble click hides tooltip
    this.chatBubble?.addEventListener('click', () => {
      this.hideTooltip();
    });
  }

  // SIMPLIFIED: No color changes, just text and slide-in animation
  showSkincareQuote() {
    if (this.isVisible) return;
    
    const quote = this.skincareQuotes[this.currentIndex % this.skincareQuotes.length];
    
    // Set text content
    this.tooltipText.textContent = quote.text;
    
    // Get tooltip content element and add slide-in animation
    const tooltipContent = this.tooltip.querySelector('.tooltip-content');
    tooltipContent.className = 'tooltip-content slide-in';
    
    // Show tooltip
    this.tooltip.classList.add('show');
    this.isVisible = true;
    
    // Auto-hide after 8 seconds
    this.tooltipTimer = setTimeout(() => {
      this.hideTooltip();
    }, 8000);
    
    // Move to next quote
    this.currentIndex++;
  }

  hideTooltip() {
    if (!this.isVisible) return;
    
    this.tooltip.classList.remove('show');
    this.isVisible = false;
    clearTimeout(this.tooltipTimer);
  }

  startSkincareQuotes() {
    // Show first quote
    this.showSkincareQuote();
    
    // Continue cycle every 12 seconds
    this.cycleTimer = setInterval(() => {
      if (!this.isVisible) {
        this.showSkincareQuote();
      }
    }, 12000);
  }

  enterQuestionInChat(question) {
    // Open chat window
    const chatWindow = document.getElementById("chatWindow");
    const chatOverlay = document.getElementById("chatOverlay");
    const chatInput = document.getElementById("chatInput");
    
    if (chatWindow) chatWindow.style.display = "flex";
    if (chatOverlay) chatOverlay.style.display = "block";
    
    // Enter question and get answer
    if (chatInput) {
      chatInput.value = question;
      setTimeout(() => {
        // Auto-send the message
        addMessageToChat(question, 'user');
        chatInput.value = '';
        
        setTimeout(() => {
          const response = handleChatbotResponse(question);
          addMessageToChat(response, 'bot');
        }, 800);
        
        chatInput.focus();
      }, 200);
    }
  }
}

// =====================================================
//    🤖 COMPLETE ANSWERS FOR ALL 25 TIPS
// =====================================================

const detailedChatbotResponses = {
  'What is my skin type?': `🔍 **Determine Your Skin Type:**

**🧪 Simple Test (Clean Face Method):**
1. Wash face with gentle cleanser
2. Wait 30 minutes (no products)
3. Check your T-zone and cheeks

**📝 Results:**
• **Oily:** Shiny all over, large pores
• **Dry:** Tight, flaky, small pores  
• **Combination:** Oily T-zone, dry cheeks
• **Normal:** Balanced, few concerns
• **Sensitive:** Easily irritated, reactive

**🎯 Quick Visual Check:**
• Blot face with tissue after 1 hour
• Oil on tissue = Oily skin
• No oil, feels tight = Dry skin

**💡 Professional Analysis:**
Take our AI skin quiz for personalized recommendations!

Ready to find your perfect products?`,

  'I have acne': `🌟 **Complete Acne Treatment Guide:**

**🧼 Morning Routine:**
• Gentle Daily Foam Cleanser
• 10% Niacinamide + Zinc Serum  
• Lightweight moisturizer
• SPF 30+ (non-comedogenic)

**🌙 Evening Routine:**
• Same gentle cleanser
• Clear Skin Acne Treatment (salicylic acid)
• Hydrating serum (hyaluronic acid)
• Night moisturizer

**⚡ Spot Treatment:**
Apply BHA treatment only to active breakouts, not entire face.

**📋 Do's & Don'ts:**
✅ Be patient (6-8 weeks for results)
✅ Moisturize even oily skin
❌ Don't over-cleanse or scrub harshly
❌ Don't pick or squeeze

**🛒 Product Trio:** Clear Skin Treatment ($42) + Niacinamide Serum ($35) + Gentle Cleanser ($28)`,

  'Give me anti-aging solutions': `⏰ **Anti-Aging Powerhouse Routine:**

**🌅 Morning Defense:**
• Vitamin C Serum (antioxidant protection)
• Peptide moisturizer
• Broad spectrum SPF (most important!)

**🌛 Night Repair:**
• Retinol Age Defense Cream (start 2x/week)
• Advanced Peptide Complex
• Rich barrier repair cream

**🎯 Key Ingredients Explained:**
• **Retinol:** Speeds cell turnover, reduces lines
• **Peptides:** Boost collagen production
• **Vitamin C:** Prevents damage, brightens
• **Hyaluronic Acid:** Plumps and hydrates

**📈 Timeline:**
• Week 1-2: Skin adjustment period
• Week 4-6: Improved texture
• Week 8-12: Visible line reduction

**🏆 Best Kit:** Anti-Aging Essentials ($125) - Complete system with proven results!`,

  'I have sensitive skin': `🌸 **Gentle Care for Sensitive Skin:**

**✨ Golden Rules:**
• Less is more - simple routines work best
• Patch test everything for 48 hours
• Fragrance-free and hypoallergenic only
• Lukewarm water, gentle patting dry

**🧴 Perfect Products:**
• Organic Oat Cleanser (100% natural, $18)
• Pure Rose Water Toner (alcohol-free, $15)
• Ceramide Barrier Repair Cream ($52)

**🚫 Ingredients to Avoid:**
❌ Fragrances, dyes, sulfates
❌ High % acids (salicylic, glycolic)
❌ Essential oils, menthol
❌ Harsh scrubs or exfoliants

**🌿 Soothing Ingredients:**
✅ Ceramides, niacinamide, hyaluronic acid
✅ Oat extract, aloe vera
✅ Chamomile, centella asiatica

**🎁 Sensitive Skin Savior Kit:** $75 - Fragrance-free, dermatologist-tested essentials!`,

  'I have dry skin': `💧 **Ultimate Dry Skin Hydration Guide:**

**🏜️ Why Skin Gets Dry:**
• Damaged moisture barrier
• Weather, heating, over-cleansing
• Age (less natural oil production)
• Genetics

**💦 Hydration Strategy:**
1. **Cleanse:** Cream-based, not foaming
2. **Damp Skin:** Apply serums on wet skin
3. **Layer:** Hyaluronic → Moisturizer → Oil (if needed)
4. **Seal:** Rich night cream

**🌟 Hero Products:**
• Hyaluronic Hydrating Serum ($39) - Holds 1000x its weight in water
• Ceramide Barrier Repair Cream ($52) - Rebuilds skin barrier  
• Raw Shea Butter Moisturizer ($22) - Deep overnight hydration

**⏰ Application Tips:**
• Apply moisturizer within 3 minutes of washing
• Use humidifier in dry climates
• Gentle exfoliation 1x/week only

**🎯 Complete routine under $100!**`,

  'I have oily skin': `🌿 **Master Your Oily Skin:**

**🧠 Understanding Oily Skin:**
Your skin produces excess sebum - often due to genetics, hormones, or over-stripping.

**⚖️ Balance Strategy:**
• **Don't Over-Cleanse:** 2x daily max
• **Oil-Free ≠ Moisturizer-Free:** Skip this step and skin overproduces oil
• **BHA Over AHA:** Salicylic acid penetrates pores better

**🎯 Perfect Routine:**
**AM:** Gentle Foam Cleanser → Niacinamide Serum → Light Moisturizer → SPF
**PM:** Same Cleanser → BHA Treatment (3x/week) → Hyaluronic Serum → Night Moisturizer

**🏆 Top Picks:**
• 10% Niacinamide + Zinc ($35) - Controls oil, minimizes pores
• Smart Adaptive Moisturizer ($58) - Adjusts to skin needs
• Gentle Daily Foam Cleanser ($28) - Won't strip skin

**💡 Pro Tip:** Blotting papers > washing face multiple times daily!`,

  'Help with dark spots': `⚡ **Dark Spot Correction System:**

**🔬 Types of Dark Spots:**
• **PIH:** Post-acne marks (red/brown)
• **Melasma:** Hormone-related patches
• **Sun Spots:** UV damage (age spots)
• **PIE:** Post-acne redness

**🎯 Treatment Approach:**
**Morning:** 
• Vitamin C Serum (prevention)
• SPF 30+ (non-negotiable!)

**Evening:**
• Brightening Dark Spot Corrector
• Retinol (speeds cell turnover)
• Hydrating moisturizer

**⭐ Key Ingredients:**
• **Vitamin C + Kojic Acid:** Our Brightening Corrector ($55)
• **Niacinamide:** Reduces melanin transfer
• **Retinol:** Accelerates cell renewal

**⏰ Timeline:** 6-12 weeks for visible improvement

**☀️ Critical:** SPF daily or dark spots will return/worsen!

**🛒 Dark Spot Kit:** Corrector + Vitamin C + SPF = Complete protection!`,

  'Build me a skincare routine': `📋 **Your Custom Routine Builder:**

**🔍 Step 1: Identify Your Goals**
• Acne control, anti-aging, hydration, or maintenance?

**🌅 Morning Routine (5-7 minutes):**
1. **Cleanser:** Gentle Daily Foam Cleanser
2. **Treatment:** Vitamin C Serum OR Niacinamide
3. **Moisturizer:** Smart Adaptive formula  
4. **SPF:** Broad spectrum 30+ (non-negotiable!)

**🌙 Evening Routine (7-10 minutes):**
1. **Cleanser:** Same gentle formula
2. **Treatment:** Retinol OR BHA (alternate nights)
3. **Serum:** Hyaluronic Hydrating Serum
4. **Moisturizer:** Rich barrier repair cream

**📅 Weekly Additions:**
• Gentle exfoliation (1-2x)
• Hydrating mask (1x)
• Deep treatment mask (1x)

**🎯 Beginner Kits:**
• **Anti-Aging Essentials:** $125
• **Acne-Fighting Trio:** $89  
• **Sensitive Skin Savior:** $75

**💡 Golden Rule:** Introduce ONE new product every 2 weeks!`,

  'Explain skincare ingredients': `🧪 **Skincare Ingredients Decoded:**

**🌟 The Power Players:**

**ACTIVES (Treatment):**
• **Retinol:** Gold standard anti-aging, speeds cell turnover
• **Vitamin C:** Antioxidant, brightening, collagen boost
• **Niacinamide:** Controls oil, minimizes pores, anti-inflammatory
• **Salicylic Acid (BHA):** Unclogs pores, anti-acne
• **Hyaluronic Acid:** Hydration powerhouse

**🛡️ SUPPORT INGREDIENTS:**
• **Ceramides:** Repair skin barrier
• **Peptides:** Boost collagen production
• **Kojic Acid:** Brightens dark spots
• **Centella Asiatica:** Soothes inflammation

**⚠️ MIXING RULES:**
❌ **Never Mix:** Retinol + Vitamin C
❌ **Don't Overdo:** Multiple acids together
✅ **Perfect Pairs:** Niacinamide + Hyaluronic Acid

**📚 Reading Labels:**
• Concentration matters (10% Niacinamide vs 2%)
• Order = potency (first 5 ingredients most important)

**🎯 Want specific ingredient advice? Ask me about any ingredient!**`,

  'Show me budget-friendly products': `💰 **Best Skincare Under $25:**

**🌱 SUPER AFFORDABLE (Under $20):**
• **Pure Rose Water Toner:** $15 - Zero waste, pure hydration
• **Organic Oat Cleanser:** $18 - 100% natural, sensitive skin approved
• **Raw Shea Butter Moisturizer:** $22 - Fair-trade, deeply nourishing

**✨ AMAZING VALUE ($25-40):**
• **Gentle Daily Foam Cleanser:** $28 - Lasts 3+ months
• **10% Niacinamide + Zinc:** $35 - Multi-benefit powerhouse  
• **Hyaluronic Hydrating Serum:** $39 (was $49!) - #1 Bestseller

**🎯 COMPLETE BUDGET ROUTINE ($63 total):**
• Morning: Oat Cleanser + Rose Toner + Shea Moisturizer
• Evening: Same routine + gentle massage

**💚 WHY BUDGET DOESN'T MEAN CHEAP:**
• Same active ingredients as premium brands
• Eco-friendly, sustainable packaging
• No fancy marketing costs = savings passed to you

**🏆 Pro Tip:** Start with 3-4 products, build slowly. Quality over quantity!

**🌟 Budget routine delivers professional results without breaking the bank!**`,

  // Add remaining responses here (continuing with the same format)
  'Recommend natural products': `🌱 **Natural & Organic Skincare Heroes:**

**🌿 100% NATURAL INGREDIENTS:**
• **Organic Oat Cleanser:** $18 - Colloidal oats, gentle cleansing
• **Pure Rose Water Toner:** $15 - Steam-distilled rose petals
• **Raw Shea Butter Moisturizer:** $22 - Unrefined, fair-trade
• **Plant-Based Bakuchiol Serum:** $48 - Natural retinol alternative

**🌸 BOTANICAL POWERHOUSES:**
• **Centella Asiatica:** Soothes inflammation
• **Green Tea Extract:** Antioxidant protection  
• **Chamomile:** Calms sensitive skin
• **Aloe Vera:** Healing and hydrating

**♻️ ECO-FRIENDLY FEATURES:**
• Biodegradable packaging
• Zero-waste containers
• Cruelty-free testing
• Sustainable sourcing

**🔬 NATURAL BUT EFFECTIVE:**
• Bakuchiol = Gentle retinol alternative
• Plant oils = Ceramide alternatives
• Fruit acids = Gentle exfoliation

**💚 COMPLETE NATURAL ROUTINE ($103):**
Oat Cleanser + Rose Toner + Bakuchiol Serum + Shea Moisturizer

**✨ Nature's pharmacy delivers results without compromise!**`,

  'How to reduce puffy eyes': `👀 **Bye-Bye Puffy Eyes Guide:**

**🧠 WHY EYES GET PUFFY:**
• Fluid retention (salt, sleep position)
• Allergies, crying, genetics
• Age (weaker eye muscles)
• Late nights, dehydration

**❄️ INSTANT FIXES:**
• **Cold Compress:** Ice cubes in cloth (10 mins)
• **Caffeine:** Coffee grounds or tea bags
• **Elevation:** Sleep with extra pillow
• **Massage:** Gentle tapping with ring finger

**🧴 PRODUCT SOLUTIONS:**
• **Advanced Peptide Complex:** $72 - Firms delicate eye area
• **Caffeine Eye Cream:** Reduces puffiness instantly
• **Hyaluronic Eye Serum:** Plumps fine lines

**💧 LIFESTYLE FIXES:**
• Drink more water (counterintuitive but works!)
• Reduce sodium intake
• Remove makeup gently
• Use silk pillowcase

**⏰ APPLICATION TECHNIQUE:**
• Ring finger only (gentlest pressure)
• Pat, don't rub
• Apply to orbital bone, not eyelid

**🎯 PREVENTION > CORRECTION: Address causes for lasting results!**`,

'How to get glowing skin': `💎 **Unlock Your Natural Glow:**

**✨ WHAT IS "GLOWING SKIN"?**
• Smooth texture, even tone
• Healthy cell turnover
• Proper hydration levels
• Light reflection from smooth surface

**🌟 THE GLOW FORMULA:**

**STEP 1: EXFOLIATION**
• Gentle 2x/week (not harsh scrubs!)
• BHA for oily skin, AHA for dry
• **Result:** Smooth texture

**STEP 2: HYDRATION**
• Hyaluronic Serum on damp skin
• **Result:** Plump, dewy appearance

**STEP 3: PROTECTION**
• Vitamin C AM (antioxidant shield)
• SPF daily (prevent damage)
• **Result:** Even skin tone

**STEP 4: NOURISHMENT**
• Rich moisturizer PM
• Face oils if very dry
• **Result:** Healthy skin barrier

**🏆 GLOW-BOOSTING PRODUCTS:**
• Custom Vitamin C Serum ($65)
• Hyaluronic Hydrating Serum ($39)
• Smart Adaptive Moisturizer ($58)

**💡 GLOW HACK:** Apply moisturizer to damp skin - instant dewy finish!

**⏰ Timeline:** 4-6 weeks for noticeable glow transformation!`,

  'Perfect morning skincare routine': `🌅 **Your 5-Minute Morning Glow-Up:**

**⏰ MORNING PRIORITIES:**
• Protection (antioxidants + SPF)
• Light hydration (won't pill under makeup)
• Quick absorption (ready for day ahead)

**📋 STEP-BY-STEP (5 minutes total):**

**1. CLEANSE (1 min):** 
• Gentle Daily Foam Cleanser - removes night products
• Lukewarm water, pat dry

**2. TREAT (1 min):**
• Custom Vitamin C Serum - antioxidant protection
• OR 10% Niacinamide if oily skin

**3. HYDRATE (1 min):**
• Smart Adaptive Moisturizer - lightweight formula
• Apply while skin still slightly damp

**4. PROTECT (2 mins):**
• SPF 30+ broad spectrum (most important step!)
• Allow to set before makeup

**☀️ WHY THIS WORKS:**
• Vitamin C prevents daily damage
• Moisturizer maintains barrier
• SPF is your best anti-aging tool

**🎯 PRO TIPS:**
• Apply products from thinnest to thickest
• Wait 30 seconds between steps
• SPF every day, even indoors!

**🌟 This routine = healthy, protected, glowing skin all day!**`,

  'Night skincare routine tips': `🌙 **Your PM Skin Repair Ritual:**

**⭐ WHY NIGHT ROUTINES MATTER:**
• Skin repairs itself while you sleep
• No UV damage to fight
• Can use stronger actives
• More time for absorption

**🛁 COMPLETE EVENING ROUTINE:**

**STEP 1: REMOVE MAKEUP/SUNSCREEN**
• Oil cleanser or micellar water first
• Follow with regular cleanser (double cleanse)

**STEP 2: TREATMENT TIME**
• **Monday/Wed/Fri:** Retinol Age Defense Cream
• **Tues/Thurs:** Clear Skin Acne Treatment (if needed)
• **Weekends:** Advanced Peptide Complex

**STEP 3: HYDRATE DEEPLY**
• Hyaluronic Serum on damp skin
• Ceramide Barrier Repair Cream
• Face oil if very dry

**STEP 4: EYE CARE**
• Advanced Peptide Eye Complex
• Gentle patting motion

**🕒 TIMING TIPS:**
• Start routine 1 hour before bed
• Allow 10 minutes between active treatments
• Sleep on silk pillowcase

**💡 NIGHT ROUTINE = MORNING GLOW!**`,

  'Which products can I mix together': `🧴 **Product Mixing Guide - Safe Combinations:**

**✅ PERFECT PAIRS:**

**MORNING COMBOS:**
• Vitamin C + Hyaluronic Acid ✨
• Niacinamide + Moisturizer ✨
• Any serum + SPF ✨

**EVENING COMBOS:**
• Retinol + Ceramide Cream ✨
• Hyaluronic Acid + Any moisturizer ✨
• Peptides + Niacinamide ✨

**⚠️ USE WITH CAUTION:**
• Retinol + AHA/BHA (alternate nights)
• Multiple acids together (start slow)
• New products + actives (patch test first)

**❌ NEVER MIX:**
• **Vitamin C + Retinol** (different pH levels)
• **Benzoyl Peroxide + Retinol** (too irritating)
• **Multiple Exfoliants** (over-exfoliation risk)

**🧪 MIXING RULES:**
1. **Patch test** new combinations
2. **Start slow** - every other night
3. **Listen to skin** - reduce if irritated
4. **Layer thinnest to thickest**

**💡 GOLDEN RULE:** When in doubt, use actives on alternate nights!

**🎯 Our products are formulated to work together safely - follow kit recommendations!**`,

  'How to analyze my skin': `📊 **Complete Skin Analysis Guide:**

**🔍 DIY SKIN ANALYSIS:**

**STEP 1: CLEAN SLATE TEST**
• Wash face with gentle cleanser
• No products for 2 hours
• Examine in natural light

**STEP 2: TEXTURE CHECK**
• Run fingers over skin
• Smooth = normal/combo
• Rough = dry/dehydrated
• Bumpy = congested/acne-prone

**STEP 3: OIL PRODUCTION**
• Blot with tissue after 3 hours
• Oil on forehead/nose = combination
• Oil everywhere = oily
• No oil = dry

**STEP 4: PORE SIZE**
• Large, visible = oily
• Medium, some visible = combination  
• Barely visible = dry/normal

**📱 DIGITAL ANALYSIS:**
• Take selfie in natural light
• Use magnifying mirror
• Compare with skin type charts

**🤖 AI SKIN QUIZ:**
Our advanced AI analyzes 50+ factors:
• Upload photos
• Answer lifestyle questions  
• Get personalized routine

**🔬 PROFESSIONAL ANALYSIS:**
• Dermatologist consultation
• Digital skin scanner
• Wood's lamp examination

**🎯 Ready for your AI skin analysis? Take our quiz for personalized recommendations!**`,

  'Give me personalized product recommendations': `🎁 **Your Personalized Product Matcher:**

**🤖 AI-POWERED RECOMMENDATIONS:**

**FOR ACNE-PRONE SKIN:**
• Clear Skin Acne Treatment ($42)
• 10% Niacinamide + Zinc ($35)
• Gentle Daily Foam Cleanser ($28)
• **Total Investment:** $105

**FOR DRY/MATURE SKIN:**
• Hyaluronic Hydrating Serum ($39)
• Retinol Age Defense Cream ($68)
• Ceramide Barrier Repair ($52)
• **Total Investment:** $159

**FOR SENSITIVE SKIN:**
• Organic Oat Cleanser ($18)  
• Pure Rose Water Toner ($15)
• Plant-Based Bakuchiol Serum ($48)
• **Total Investment:** $81

**FOR BUDGET-CONSCIOUS:**
• Eco-friendly essentials under $85
• Maximum value, proven results
• 3-month supply included

**🎯 COMPLETE KITS (Best Value):**
• **Acne-Fighting Trio:** $89 (save $16)
• **Anti-Aging Essentials:** $125 (save $22)
• **Sensitive Skin Savior:** $75 (save $12)

**💡 PERSONALIZATION FACTORS:**
• Skin type, concerns, lifestyle
• Climate, age, sensitivity level
• Budget, ingredient preferences

**🚀 TAKE OUR AI QUIZ for scientifically-matched recommendations!**`,

  'Share science-backed skincare facts': `🔬 **Evidence-Based Skincare Science:**

**📚 RESEARCH-PROVEN FACTS:**

**🧬 RETINOL RESEARCH:**
• 30+ years of clinical studies
• Increases collagen production by 80%
• Reduces fine lines in 12 weeks
• Gold standard for anti-aging

**☀️ SUNSCREEN SCIENCE:**
• Prevents 80% of visible aging
• SPF 30 blocks 97% of UVB rays
• Daily use = 24% less aging over 4.5 years
• Most important skincare product

**💧 HYALURONIC ACID:**
• Holds 1,000x its weight in water
• Naturally occurs in skin (decreases with age)
• Penetrates 3 layers of skin
• Clinically proven hydration boost

**🎯 NIACINAMIDE STUDIES:**
• 10% concentration optimal for oil control
• Reduces pore appearance by 35%
• Improves skin barrier function
• Anti-inflammatory properties proven

**🧪 VITAMIN C RESEARCH:**
• L-Ascorbic Acid most potent form
• 15-20% concentration most effective
• Stimulates collagen synthesis
• Protects against UV damage

**⏰ SKIN CELL TURNOVER:**
• 28 days in your 20s
• 45+ days in your 50s
• Exfoliation accelerates renewal
• Consistent use = cumulative benefits

**🎓 BOTTOM LINE:** Science supports simple, consistent routines with proven ingredients!**`,

  'What are your bestselling products': `⭐ **Customer Favorites & Bestsellers:**

**🏆 TOP 3 BESTSELLERS:**

**#1 HYALURONIC HYDRATING SERUM - $39** ⭐⭐⭐⭐⭐
• 50,000+ bottles sold
• 4.8/5 star rating
• "Skin looks plumper instantly!"
• Works for ALL skin types

**#2 GENTLE DAILY FOAM CLEANSER - $28** ⭐⭐⭐⭐⭐
• 95% repurchase rate
• "Finally, a cleanser that doesn't strip!"
• Perfect daily gentle cleansing
• Lasts 3+ months

**#3 10% NIACINAMIDE + ZINC - $35** ⭐⭐⭐⭐⭐
• #1 for oily/combo skin
• "Pores look smaller in 2 weeks!"
• Controls oil without drying
• Multi-benefit powerhouse

**🌟 RISING STARS:**
• **Advanced Peptide Complex:** $72 - Anti-aging breakthrough
• **Ceramide Barrier Repair:** $52 - Dry skin savior
• **Clear Skin Acne Treatment:** $42 - Acne fighter

**💬 REAL CUSTOMER REVIEWS:**
"The Hyaluronic serum changed my skin!" - Sarah M.
"Finally found my holy grail cleanser!" - Jennifer K.  
"My pores have never looked better!" - Lisa R.

**🎁 BESTSELLER BUNDLE:** Get all 3 top products for $95 (save $7)!

**✨ Join 100,000+ happy customers who've found their skin solutions!**`,

  'Quick fixes for skin problems': `🚀 **Emergency Skin Fixes:**

**⚡ OVERNIGHT SOLUTIONS:**

**ANGRY BREAKOUT:**
• Ice cube (2 minutes) → reduce inflammation
• Spot treatment with salicylic acid
• Hydrocolloid patch overnight
• **Result:** 50% reduction by morning

**DULL, TIRED SKIN:**
• Gentle exfoliation (BHA pad)
• Hyaluronic serum on damp skin  
• Sheet mask (20 minutes)
• **Result:** Instant glow boost

**PUFFY EYES:**
• Cold spoons (5 minutes)
• Caffeine eye cream
• Cucumber slices
• **Result:** Visible depuffing

**DRY PATCH EMERGENCY:**
• Rich face oil
• Occlusive moisturizer layer
• Humidifier overnight
• **Result:** Smooth, hydrated skin

**📱 QUICK MAKEUP PREP:**
• Hydrating mist
• Primer with hyaluronic acid
• Color-correcting concealer
• **Result:** Flawless base

**⏰ 5-MINUTE GLOW-UP:**
1. Face massage (increase circulation)
2. Vitamin C serum
3. Dewy moisturizer  
4. Highlighter on high points

**💡 PREVENTION > CORRECTION:** These are temporary fixes - consistent routine = lasting results!**`,

  'How to properly hydrate my skin': `💧 **Complete Hydration Masterclass:**

**🧠 HYDRATION VS. MOISTURE:**
• **Hydration:** Water content in skin cells
• **Moisture:** Oil/lipids that seal in water
• Need BOTH for healthy skin

**💦 LAYERING TECHNIQUE:**
1. **Damp Skin:** Never apply to completely dry skin
2. **Thinnest First:** Serum → Moisturizer → Oil
3. **Press, Don't Rub:** Gentle patting motion
4. **Wait:** 30 seconds between layers

**🌟 HYDRATION HEROES:**
• **Hyaluronic Acid:** Holds 1000x its weight in water
• **Glycerin:** Draws moisture from environment  
• **Ceramides:** Seal in hydration
• **Squalane:** Lightweight moisture lock

**⏰ TIMING MATTERS:**
• **AM:** Light hydration (won't interfere with makeup)
• **PM:** Heavy hydration (repair while sleeping)
• **Weekly:** Hydrating mask boost

**🏆 PERFECT HYDRATION ROUTINE:**
• **Step 1:** Hyaluronic Hydrating Serum ($39)
• **Step 2:** Smart Adaptive Moisturizer ($58)
• **Step 3:** Face oil (if very dry)

**💡 HYDRATION HACKS:**
• Humidifier in bedroom
• Drink water throughout day
• Avoid hot water on face
• Use hydrating mist throughout day

**🎯 RESULT:** Plump, dewy, healthy-looking skin in 1-2 weeks!**`,

  'Tell me about sunscreen': `☀️ **Sunscreen: Your Anti-Aging Superhero:**

**🛡️ WHY SPF IS NON-NEGOTIABLE:**
• Prevents 80% of visible aging
• Blocks skin cancer risk
• Stops dark spots from forming
• Required 365 days/year (UVA penetrates windows)

**📊 SPF NUMBERS DECODED:**
• **SPF 15:** Blocks 93% of UVB
• **SPF 30:** Blocks 97% of UVB (sweet spot!)
• **SPF 50:** Blocks 98% of UVB
• Higher SPF ≠ dramatically better protection

**🧪 SUNSCREEN TYPES:**
• **Chemical:** Absorbs UV rays (avobenzone, octinoxate)
• **Physical/Mineral:** Reflects rays (zinc, titanium dioxide)  
• **Hybrid:** Combination of both

**🎯 APPLICATION RULES:**
• **Amount:** 1/4 teaspoon for face + neck
• **Timing:** 15 minutes before sun exposure
• **Reapply:** Every 2 hours when active
• **Coverage:** Don't forget ears, lips, eyelids

**☁️ DAILY SPF MUSTS:**
• Broad spectrum (UVA + UVB)
• Water-resistant for activities
• Non-comedogenic (won't clog pores)
• Plays well under makeup

**🌟 PRO TIPS:**
• SPF in makeup isn't enough alone
• Reapply over makeup with powder SPF
• Use lip balm with SPF

**💡 THINK OF SPF AS DAILY VITAMINS FOR YOUR SKIN!**`,

  'What order should I apply products': `🎪 **Perfect Product Application Order:**

**📏 GOLDEN RULE: THINNEST TO THICKEST**
This ensures each product can penetrate properly!

**🌅 MORNING ORDER:**
1. **Cleanser** (remove overnight buildup)
2. **Toner** (pH balance, prep skin)
3. **Serum** (vitamin C, niacinamide)
4. **Eye cream** (delicate area first)
5. **Moisturizer** (seal in treatments)
6. **SPF** (final protective barrier)

**🌙 EVENING ORDER:**
1. **Makeup remover** (if wearing makeup)
2. **Cleanser** (double cleanse recommended)
3. **Exfoliant** (BHA/AHA, 2-3x/week)
4. **Treatment** (retinol, prescription)
5. **Serum** (hyaluronic, peptides)
6. **Eye cream** (richer formulas at night)
7. **Moisturizer** (repair and hydrate)
8. **Face oil** (optional final seal)

**⏰ TIMING BETWEEN STEPS:**
• **Water-based products:** 30 seconds
• **Actives (retinol, vitamin C):** 10-15 minutes
• **Moisturizer:** 2-3 minutes before SPF

**💡 EXCEPTIONS:**
• Retinol can go AFTER moisturizer (gentler)
• Some prefer oil before moisturizer (experiment!)

**🎯 REMEMBER:** Consistency matters more than perfection!**`,

  'Do you offer expert consultations': `🤝 **Expert Skincare Consultations Available:**

**👩‍⚕️ CONSULTATION OPTIONS:**

**🤖 AI SKIN ANALYSIS (FREE):**
• 3-minute comprehensive quiz
• Photo analysis technology
• Instant personalized routine
• Product recommendations with explanations

**📱 VIRTUAL CONSULTATION ($49):**
• 30-minute video call with licensed esthetician
• Detailed skin assessment
• Custom routine creation
• 3-month follow-up check-in

**🏥 DERMATOLOGIST REFERRAL:**
• Partner with certified dermatologists
• Medical-grade treatments available
• Prescription coordination
• Insurance coverage guidance

**🎓 WHAT YOU'LL GET:**
• Detailed skin type analysis
• Ingredient education
• Step-by-step routine guide
• Product mixing guidelines
• Timeline expectations

**📅 BOOKING PROCESS:**
1. Complete preliminary skin quiz
2. Upload clear skin photos
3. Schedule convenient time slot
4. Receive consultation prep guide

**💰 INVESTMENT OPTIONS:**
• **Free AI Analysis:** Basic recommendations
• **Virtual Consultation:** $49 (credited toward $100+ purchase)
• **In-person:** Partner locations available

**🌟 95% of consultation clients see improvement within 6 weeks!

Ready to start with our free AI skin quiz?**`

  // [Continue with remaining 15 responses following the same detailed format]
  
};

// Helper function to add messages to chat
function addMessageToChat(message, sender) {
  const chatMessages = document.getElementById('chatMessages');
  if (!chatMessages) return;
  
  const messageDiv = document.createElement('div');
  messageDiv.className = `chat-message ${sender}`;
  
  const bubbleDiv = document.createElement('div');
  bubbleDiv.className = `message-bubble ${sender}`;
  bubbleDiv.innerHTML = message.replace(/\n/g, '<br>');
  
  messageDiv.appendChild(bubbleDiv);
  chatMessages.appendChild(messageDiv);
  
  // Scroll to bottom
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Enhanced Response Handler Function
function handleChatbotResponse(message) {
  const lowerMessage = message.toLowerCase().trim();
  
  // Check for exact matches from detailed responses first
  if (detailedChatbotResponses[message]) {
    return detailedChatbotResponses[message];
  }
  
  // Check for partial matches
  for (const [key, response] of Object.entries(detailedChatbotResponses)) {
    if (lowerMessage.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerMessage)) {
      return response;
    }
  }
  
  // Default response
  return "That's a great question! I'd recommend taking our AI quiz for personalized advice tailored to your specific skin concerns. 🌟";
}

// 🚀 Initialize Complete System
document.addEventListener("DOMContentLoaded", () => {
  // Initialize skincare tooltip system
  window.skincareTooltip = new SkincareCatchyTooltip();
  
  // Enhanced Quick Suggestions Handler  
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('suggestion-btn')) {
      const message = e.target.getAttribute('data-message') || e.target.textContent.trim();
      
      addMessageToChat(message, 'user');
      
      setTimeout(() => {
        const response = handleChatbotResponse(message);
        addMessageToChat(response, 'bot');
      }, 800);
      
      const suggestions = document.getElementById('quickSuggestions');
      if (suggestions) {
        suggestions.style.display = 'none';
      }
    }
  });
  
  // Enhanced send message functionality
  const sendChatBtn = document.getElementById('sendChatBtn');
  const chatInput = document.getElementById('chatInput');
  
  function sendMessage() {
    const message = chatInput.value.trim();
    
    if (message) {
      addMessageToChat(message, 'user');
      chatInput.value = '';
      
      setTimeout(() => {
        const response = handleChatbotResponse(message);
        addMessageToChat(response, 'bot');
      }, 800);
    }
  }
  
  if (sendChatBtn) {
    sendChatBtn.addEventListener('click', sendMessage);
  }
  
  if (chatInput) {
    chatInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
  }
});





/* =====================================================
   COMPLETE ENHANCED CART JAVASCRIPT - REPLACE EXISTING CART CODE
===================================================== */

// Enhanced Cart System
class EnhancedCart {
    constructor() {
        this.cart = [];
        this.isOpen = false;
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.initializeElements();
        this.bindEvents();
        this.loadProductImages();
        this.setupCheckoutSystem();
    }

    initializeElements() {
        this.modal = document.getElementById('cartModal');
        this.overlay = document.getElementById('cartOverlay');
        this.itemsContainer = document.getElementById('cartItemsContainer');
        this.itemCountEl = document.getElementById('cartItemCount');
        this.subtotalEl = document.getElementById('cartSubtotal');
        this.totalEl = document.getElementById('cartTotal');
        this.checkoutBtn = document.getElementById('checkoutBtn');
        this.closeBtn = document.getElementById('closeCart');
        this.cartIcon = document.getElementById('cartIcon');
    }

    loadProductImages() {
        this.productImages = {};
        const imageMap = document.getElementById('productImageMap');
        if (imageMap) {
            const mappings = imageMap.querySelectorAll('[data-id]');
            mappings.forEach(mapping => {
                this.productImages[mapping.dataset.id] = mapping.dataset.image;
            });
        }
    }

    bindEvents() {
        // Open cart
        if (this.cartIcon) {
            this.cartIcon.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.openCart();
            });
        }

        // Close cart - X button and overlay
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.closeCart();
            });
        }

        // Close cart when clicking overlay
        if (this.overlay) {
            this.overlay.addEventListener('click', (e) => {
                this.closeCart();
            });
        }

        // Keyboard ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeCart();
            }
        });

        // Prevent modal click bubbling
        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }

        // Checkout button
        if (this.checkoutBtn) {
            this.checkoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.proceedToCheckout();
            });
        }
    }

    setupCheckoutSystem() {
        // Use a delay to ensure DOM is fully loaded
        setTimeout(() => {
            // Get checkout elements
            this.checkoutPopup = document.getElementById('checkoutPopup');
            this.checkoutForm = document.getElementById('checkoutForm');
            this.closeCheckoutBtn = document.getElementById('closeCheckout');
            this.backToCartBtn = document.getElementById('backToCart');
            this.cartDataInput = document.getElementById('cartData');
            this.totalPriceInput = document.getElementById('totalPrice');
            this.orderSummaryText = document.getElementById('orderSummaryText');
            this.orderSummaryTotal = document.getElementById('orderSummaryTotal');

            console.log('Checkout system setup:', {
                checkoutPopup: !!this.checkoutPopup,
                checkoutForm: !!this.checkoutForm,
                cartDataInput: !!this.cartDataInput,
                totalPriceInput: !!this.totalPriceInput
            });

            // Bind checkout events with improved mobile support
            if (this.closeCheckoutBtn) {
                // Add both click and touch events for better mobile support
                this.closeCheckoutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.closeCheckoutPopup();
                });
                
                this.closeCheckoutBtn.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.closeCheckoutPopup();
                });
            }

            if (this.backToCartBtn) {
                this.backToCartBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.closeCheckoutPopup();
                    this.openCart();
                });
                
                this.backToCartBtn.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.closeCheckoutPopup();
                    this.openCart();
                });
            }

            // Close checkout popup when clicking outside
            if (this.checkoutPopup) {
                this.checkoutPopup.addEventListener('click', (e) => {
                    if (e.target === this.checkoutPopup) {
                        this.closeCheckoutPopup();
                    }
                });
            }

            // Handle form submission
            if (this.checkoutForm) {
                this.checkoutForm.addEventListener('submit', (e) => {
                    this.handleFormSubmission(e);
                });
            }
        }, 100);
    }

    async handleFormSubmission(e) {
        e.preventDefault();

        const formData = new FormData(this.checkoutForm);

        try {
            const response = await fetch(this.checkoutForm.action, {
                method: this.checkoutForm.method,
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                // Clear cart and storage
                this.clearCart();

                // Close checkout popup
                this.closeCheckoutPopup();

                // Show success toast
                this.showToast("✅ Order placed successfully!");

                // Reset form
                this.checkoutForm.reset();

                // Redirect to home after 2 seconds
                setTimeout(() => {
                    window.location.href = '#home';
                }, 2000);

            } else {
                this.showToast("❌ Something went wrong. Please try again!", "error");
            }
        } catch (error) {
            console.error(error);
            this.showToast("❌ Unable to submit order right now.", "error");
        }
    }

    showToast(message, type = "success") {
        let toast = document.getElementById('toast');
        if (!toast) {
            // Create toast if it doesn't exist
            toast = document.createElement('div');
            toast.id = 'toast';
            toast.className = 'toast';
            document.body.appendChild(toast);
        }

        toast.textContent = message;
        toast.style.background = type === "error" ? "#dc3545" : "#28a745";
        toast.className = "toast show";
        
        setTimeout(() => {
            toast.className = toast.className.replace("show", "");
        }, 2500);
    }

    openCart() {
        this.isOpen = true;
        this.modal.classList.add('active');
        if (this.overlay) {
            this.overlay.classList.add('active');
        }
        this.renderCart();
        document.body.style.overflow = 'hidden';
    }

    closeCart() {
        this.isOpen = false;
        this.modal.classList.remove('active');
        if (this.overlay) {
            this.overlay.classList.remove('active');
        }
        document.body.style.overflow = '';
    }

    closeCheckoutPopup() {
        if (this.checkoutPopup) {
            this.checkoutPopup.style.display = 'none';
        }
    }

    addItem(id, name, price, quantity = 1) {
        const existingItem = this.cart.find(item => item.id === id);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({
                id,
                name,
                price: parseFloat(price),
                quantity,
                image: this.productImages[id] || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjBGMEYwIi8+CjxwYXRoIGQ9Ik0yNSAzNUg1NVY0NUgyNVYzNVoiIGZpbGw9IiNDQ0MiLz4KPHBhdGggZD0iTTMwIDI1SDUwVjMwSDMwVjI1WiIgZmlsbD0iI0NDQyIvPgo8L3N2Zz4K'
            });
        }
        this.updateCartCount();
        this.showToast(`${name} added to cart!`);
        if (this.isOpen) this.renderCart();
    }

    removeItem(id) {
        this.cart = this.cart.filter(item => item.id !== id);
        this.updateCartCount();
        this.renderCart();
    }

    updateQuantity(id, quantity) {
        const item = this.cart.find(item => item.id === id);
        if (item && quantity > 0) {
            item.quantity = quantity;
            this.updateCartCount();
            this.renderCart();
        }
    }

    clearCart() {
        this.cart = [];
        this.updateCartCount();
        this.renderCart();
    }

    updateCartCount() {
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        if (this.itemCountEl) {
            this.itemCountEl.textContent = totalItems;
        }
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            cartCount.textContent = totalItems;
        }
    }

    renderCart() {
        if (!this.itemsContainer) return;
        if (this.cart.length === 0) {
            this.itemsContainer.innerHTML = `
                <div class="empty-cart-state">
                    <div class="empty-cart-icon">🛒</div>
                    <div class="empty-cart-text">Your cart is empty</div>
                    <div class="empty-cart-subtext">Add some products to get started</div>
                </div>
            `;
            this.updateTotals(0);
            return;
        }

        let html = '';
        let total = 0;
        this.cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            html += `
                <div class="cart-item-modern" data-id="${item.id}">
                    <div class="cart-item-content">
                        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                        <div class="cart-item-info">
                            <div class="cart-item-name">${item.name}</div>
                            <div class="cart-item-price">$${item.price.toFixed(2)} each</div>
                            <div class="cart-item-total">Total: $${itemTotal.toFixed(2)}</div>
                            <div class="cart-quantity-controls">
                                <button class="quantity-btn decrease-btn" data-id="${item.id}" ${item.quantity <= 1 ? 'disabled' : ''}>-</button>
                                <div class="quantity-display">${item.quantity}</div>
                                <button class="quantity-btn increase-btn" data-id="${item.id}">+</button>
                            </div>
                        </div>
                        <button class="cart-item-remove" data-id="${item.id}" title="Remove item">&times;</button>
                    </div>
                </div>
            `;
        });
        this.itemsContainer.innerHTML = html;
        this.addEventListeners();
        this.updateTotals(total);
    }

    addEventListeners() {
        this.itemsContainer.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.removeItem(btn.dataset.id);
            });
        });
        this.itemsContainer.querySelectorAll('.decrease-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const item = this.cart.find(item => item.id === btn.dataset.id);
                if (item && item.quantity > 1) {
                    this.updateQuantity(item.id, item.quantity - 1);
                }
            });
        });
        this.itemsContainer.querySelectorAll('.increase-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const item = this.cart.find(item => item.id === btn.dataset.id);
                if (item) {
                    this.updateQuantity(item.id, item.quantity + 1);
                }
            });
        });
    }

    updateTotals(subtotal) {
        if (this.subtotalEl) {
            this.subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        }
        if (this.totalEl) {
            this.totalEl.textContent = `$${subtotal.toFixed(2)}`;
        }
    }

    proceedToCheckout() {
        if (this.cart.length === 0) {
            this.showToast("⚠️ Your cart is empty!", "error");
            return;
        }

        this.closeCart();

        const cartSummary = this.cart.map(item => 
            `${item.quantity} x ${item.name} (${item.price})`
        ).join(', ');
        const totalPrice = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        // Re-get elements in case they weren't found during initialization
        const checkoutPopup = document.getElementById('checkoutPopup');
        const cartDataInput = document.getElementById('cartData');
        const totalPriceInput = document.getElementById('totalPrice');
        const orderSummaryText = document.getElementById('orderSummaryText');
        const orderSummaryTotal = document.getElementById('orderSummaryTotal');

        console.log('Checkout elements found:', {
            checkoutPopup: !!checkoutPopup,
            cartDataInput: !!cartDataInput,
            totalPriceInput: !!totalPriceInput,
            orderSummaryText: !!orderSummaryText,
            orderSummaryTotal: !!orderSummaryTotal
        });

        if (checkoutPopup && cartDataInput && totalPriceInput) {
            cartDataInput.value = cartSummary;
            totalPriceInput.value = `${totalPrice.toFixed(2)}`;
            if (orderSummaryText) orderSummaryText.textContent = cartSummary;
            if (orderSummaryTotal) orderSummaryTotal.textContent = `${totalPrice.toFixed(2)}`;
            checkoutPopup.style.display = 'flex';
        } else {
            console.error('Missing checkout elements:', {
                checkoutPopup: !checkoutPopup,
                cartDataInput: !cartDataInput,
                totalPriceInput: !totalPriceInput
            });
            this.showToast("❌ Checkout system not available", "error");
        }
    }
}

// Initialize enhanced cart system globally
window.enhancedCart = new EnhancedCart();

// Override existing cart functionality + add checkout form flow
document.addEventListener('DOMContentLoaded', function() {
    const addButtons = document.querySelectorAll('.btn-add, .kit-button');
    addButtons.forEach(button => {
        button.onclick = null;
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const id = this.getAttribute('data-id') || this.getAttribute('data-kit-id');
            const name = this.getAttribute('data-name') || this.getAttribute('data-kit-name');
            const price = this.getAttribute('data-price') || this.getAttribute('data-kit-price');
            if (id && name && price) {
                window.enhancedCart.addItem(id, name, price);
                const originalText = this.textContent;
                const originalBg = this.style.background;
                this.style.background = '#26de81';
                this.textContent = '✓ Added!';
                this.disabled = true;
                setTimeout(() => {
                    this.style.background = originalBg;
                    this.textContent = originalText;
                    this.disabled = false;
                }, 1500);
            }
        });
    });

    window.enhancedCart.updateCartCount();
});





/* =====================================================
   BLOG ARTICLE MODAL SYSTEM - ADD TO END OF script.js
===================================================== */

// Article content data
const articleContent = {
    'ai-technology': {
        title: 'The Science Behind AI Skin Matching',
        author: 'Dr. Sarah Chen',
        content: `
            <h3>🧠 How AI Understands Your Skin</h3>
            <p>Our advanced AI system processes over 10,000 data points to create your perfect skincare match. Here's the fascinating science behind it:</p>
            
            <h4>📊 Data Collection Process</h4>
            <ul>
                <li><strong>Visual Analysis:</strong> Our computer vision identifies skin texture, tone, and concerns</li>
                <li><strong>Lifestyle Factors:</strong> Climate, stress levels, diet, and sleep patterns</li>
                <li><strong>Product History:</strong> What worked and what didn't for similar skin profiles</li>
                <li><strong>Genetic Markers:</strong> Age, ethnicity, and hereditary skin characteristics</li>
            </ul>
            
            <h4>🤖 Machine Learning Algorithm</h4>
            <p>Our neural network has been trained on millions of skincare interactions, learning patterns that human experts might miss. It continuously improves by analyzing:</p>
            <ul>
                <li>Treatment outcomes from 100,000+ users</li>
                <li>Dermatological research databases</li>
                <li>Ingredient interaction studies</li>
                <li>Seasonal and environmental impact data</li>
            </ul>
            
            <h4>🎯 Precision Matching</h4>
            <p>The AI creates a unique "skin fingerprint" for each user, matching them with products that have shown 85%+ success rates for similar profiles. This personalization is impossible to achieve with traditional one-size-fits-all approaches.</p>
            
            <h4>📈 Continuous Learning</h4>
            <p>Every user interaction teaches our AI something new. If a recommended product doesn't work perfectly, the system learns and adjusts future recommendations for similar skin types.</p>
            
            <div class="article-cta">
                <h4>✨ Ready to Experience AI-Powered Skincare?</h4>
                <p>Take our 3-minute skin quiz and discover your scientifically-matched routine!</p>
                <button class="cta-button" onclick="document.getElementById('startQuizBtn').click(); closeArticleModal();">Take Skin Quiz</button>
            </div>
        `
    },
    
    'skincare-routines': {
        title: 'Morning vs Evening Routines',
        author: 'Emma Rodriguez',
        content: `
            <h3>🌅 The Perfect Morning Routine</h3>
            <p>Morning skincare is all about <strong>protection</strong>. Your skin needs to defend against UV rays, pollution, and daily stressors.</p>
            
            <h4>☀️ Morning Essentials (5-7 minutes)</h4>
            <ol>
                <li><strong>Gentle Cleanser:</strong> Remove overnight buildup without stripping natural oils</li>
                <li><strong>Antioxidant Serum:</strong> Vitamin C protects against free radical damage</li>
                <li><strong>Hydrating Moisturizer:</strong> Creates a protective barrier</li>
                <li><strong>Broad Spectrum SPF:</strong> Your most important anti-aging step!</li>
            </ol>
            
            <h3>🌙 The Restorative Evening Routine</h3>
            <p>Evening is <strong>repair time</strong>. Your skin regenerates faster at night, making it perfect for active treatments.</p>
            
            <h4>🌟 Evening Essentials (10-12 minutes)</h4>
            <ol>
                <li><strong>Double Cleanse:</strong> Oil cleanser first, then water-based cleanser</li>
                <li><strong>Exfoliation:</strong> BHA/AHA treatments (2-3x weekly)</li>
                <li><strong>Treatment Serum:</strong> Retinol, peptides, or targeted concerns</li>
                <li><strong>Rich Moisturizer:</strong> Deeper hydration while you sleep</li>
                <li><strong>Face Oil (Optional):</strong> Extra nourishment for dry skin</li>
            </ol>
            
            <h4>🔬 The Science of Timing</h4>
            <ul>
                <li><strong>Circadian Rhythms:</strong> Skin follows a 24-hour cycle of protection and repair</li>
                <li><strong>Cell Turnover:</strong> Peaks between 11 PM - 4 AM</li>
                <li><strong>Collagen Production:</strong> Highest during deep sleep phases</li>
                <li><strong>UV Sensitivity:</strong> Some ingredients (retinol, AHAs) increase photosensitivity</li>
            </ul>
            
            <h4>⚠️ Common Timing Mistakes</h4>
            <ul>
                <li>Using retinol in the morning (increases sun sensitivity)</li>
                <li>Applying vitamin C at night (wastes its protective benefits)</li>
                <li>Over-cleansing (disrupts skin barrier)</li>
                <li>Skipping moisturizer on oily skin</li>
            </ul>
            
            <div class="article-cta">
                <h4>🎯 Build Your Perfect Routine</h4>
                <p>Discover products specifically chosen for your skin type and schedule!</p>
                <button class="cta-button" onclick="window.location.href='#best-sellers'; closeArticleModal();">Shop Recommended Products</button>
            </div>
        `
    },
    
    'ingredients': {
        title: 'Ingredient Spotlight: Hyaluronic Acid',
        author: 'Dr. Michael Park',
        content: `
            <h3>💧 What is Hyaluronic Acid?</h3>
            <p>Hyaluronic Acid (HA) is a naturally occurring substance in your skin that can hold <strong>1,000 times its weight in water</strong>. It's the ultimate hydration hero!</p>
            
            <h4>🔬 The Science</h4>
            <ul>
                <li><strong>Molecular Size:</strong> Different weights penetrate different skin layers</li>
                <li><strong>Natural Occurrence:</strong> Your body produces ~15 grams naturally</li>
                <li><strong>Age Decline:</strong> Production drops 50% by age 50</li>
                <li><strong>Skin Location:</strong> 50% is found in your skin tissue</li>
            </ul>
            
            <h4>✨ Benefits for Every Skin Type</h4>
            <div class="benefit-grid">
                <div class="benefit-item">
                    <strong>🌵 Dry Skin:</strong> Intense hydration without heaviness
                </div>
                <div class="benefit-item">
                    <strong>🛢️ Oily Skin:</strong> Lightweight moisture that doesn't clog pores
                </div>
                <div class="benefit-item">
                    <strong>🌸 Sensitive Skin:</strong> Gentle, non-irritating hydration
                </div>
                <div class="benefit-item">
                    <strong>⏰ Aging Skin:</strong> Plumps fine lines and improves elasticity
                </div>
            </div>
            
            <h4>📋 How to Use Hyaluronic Acid</h4>
            <ol>
                <li><strong>Apply to Damp Skin:</strong> HA needs water to work effectively</li>
                <li><strong>Layer Correctly:</strong> Apply before heavier creams</li>
                <li><strong>Seal It In:</strong> Always follow with moisturizer</li>
                <li><strong>Use Daily:</strong> Safe for morning and evening use</li>
            </ol>
            
            <h4>⚠️ Common Mistakes</h4>
            <ul>
                <li><strong>Dry Application:</strong> Can actually draw moisture from deep skin layers</li>
                <li><strong>Wrong Climate:</strong> In very dry environments, use with humidifier</li>
                <li><strong>Skipping Moisturizer:</strong> HA needs to be sealed in to prevent evaporation</li>
                <li><strong>Wrong Molecular Weight:</strong> Mix of high and low weights is most effective</li>
            </ul>
            
            <h4>🧪 GlowAI's Hyaluronic Formula</h4>
            <p>Our <strong>Hyaluronic Hydrating Serum</strong> contains 5 different molecular weights of HA for maximum penetration and hydration at every skin layer.</p>
            <ul>
                <li>Ultra-low molecular weight: Deep penetration</li>
                <li>Low molecular weight: Mid-layer hydration</li>
                <li>Medium molecular weight: Surface plumping</li>
                <li>High molecular weight: Protective film formation</li>
                <li>Cross-linked HA: Long-lasting hydration</li>
            </ul>
            
            <div class="article-cta">
                <h4>💧 Try Our #1 Bestselling Hyaluronic Serum</h4>
                <p>Over 50,000 customers love our 5-weight Hyaluronic formula!</p>
                <button class="cta-button" onclick="window.location.href='#best-sellers'; closeArticleModal();">Shop Hyaluronic Serum - $39</button>
            </div>
        `
    }
};

// Blog modal functionality
document.addEventListener('DOMContentLoaded', function() {
    const articleModal = document.getElementById('articleModal');
    const articleOverlay = document.getElementById('articleOverlay');
    const articleBody = document.getElementById('articleBody');
    const closeArticleBtn = document.getElementById('closeArticle');
    const expandButtons = document.querySelectorAll('.blog-expand-btn');
    
    // Open article modal
    expandButtons.forEach(button => {
        button.addEventListener('click', function() {
            const articleKey = this.getAttribute('data-article');
            const article = articleContent[articleKey];
            
            if (article) {
                articleBody.innerHTML = `
                    <div class="article-header">
                        <h2>${article.title}</h2>
                        <p class="article-author">By ${article.author}</p>
                    </div>
                    <div class="article-text">
                        ${article.content}
                    </div>
                `;
                
                articleModal.classList.add('active');
                articleOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    // Close article modal
    function closeArticleModal() {
        articleModal.classList.remove('active');
        articleOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Make closeArticleModal globally available
    window.closeArticleModal = closeArticleModal;
    
    closeArticleBtn.addEventListener('click', closeArticleModal);
    articleOverlay.addEventListener('click', closeArticleModal);
    
    // ESC key to close
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && articleModal.classList.contains('active')) {
            closeArticleModal();
        }
    });
});






/* ----------------------
   Enhanced Quiz Modal Logic
----------------------- */
class EnhancedQuiz {
    constructor() {
        this.currentQuestion = 1;
        this.totalQuestions = 5;
        this.quizModal = document.querySelector('#quizModal');
        this.quizOverlay = document.querySelector('#quizOverlay');
        this.openQuizBtn = document.querySelector('#startQuizBtn');
        this.closeQuizBtn = document.querySelector('#closeQuiz');
        this.quizForm = document.querySelector('#quizForm');
        this.prevBtn = document.querySelector('#prevBtn');
        this.nextBtn = document.querySelector('#nextBtn');
        this.submitBtn = document.querySelector('#submitBtn');
        this.progressFill = document.querySelector('#progressFill');
        this.currentQSpan = document.querySelector('#currentQ');
        this.chatWidget = document.querySelector('#chatWidget');
        
        this.initEventListeners();
        this.updateQuestionDisplay();
    }
    
    initEventListeners() {
        // Open quiz
        if (this.openQuizBtn && this.quizModal) {
            this.openQuizBtn.addEventListener('click', () => {
                this.openQuiz();
            });
        }
        
        // Close quiz
        if (this.closeQuizBtn) {
            this.closeQuizBtn.addEventListener('click', () => {
                this.closeQuiz();
            });
        }
        
        // Close on overlay click
        if (this.quizOverlay) {
            this.quizOverlay.addEventListener('click', () => {
                this.closeQuiz();
            });
        }
        
        // Navigation buttons
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => {
                this.previousQuestion();
            });
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => {
                this.nextQuestion();
            });
        }
        
        // Form submission
        if (this.quizForm) {
            this.quizForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitQuiz();
            });
        }
        
        // Option selection
        this.quizForm?.addEventListener('change', (e) => {
            if (e.target.type === 'radio') {
                setTimeout(() => {
                    if (this.currentQuestion < this.totalQuestions) {
                        this.nextQuestion();
                    }
                }, 500);
            }
        });
        
        // ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.quizModal?.classList.contains('active')) {
                this.closeQuiz();
            }
        });
    }
    
    openQuiz() {
        this.quizModal.classList.add('active');
        document.body.classList.add('modal-open');
        this.hideChat();
        document.body.style.overflow = 'hidden';
    }
    
    closeQuiz() {
        this.quizModal.classList.remove('active');
        document.body.classList.remove('modal-open');
        this.showChat();
        document.body.style.overflow = '';
        this.resetQuiz();
    }
    
    hideChat() {
        if (this.chatWidget) {
            this.chatWidget.style.display = 'none';
        }
    }
    
    showChat() {
        if (this.chatWidget) {
            this.chatWidget.style.display = 'block';
        }
    }
    
    nextQuestion() {
        if (this.currentQuestion < this.totalQuestions) {
            this.currentQuestion++;
            this.updateQuestionDisplay();
        }
    }
    
    previousQuestion() {
        if (this.currentQuestion > 1) {
            this.currentQuestion--;
            this.updateQuestionDisplay();
        }
    }
    
    updateQuestionDisplay() {
        const questions = this.quizModal.querySelectorAll('.quiz-question');
        
        // Hide all questions
        questions.forEach(q => q.classList.remove('active'));
        
        // Show current question
        const currentQ = this.quizModal.querySelector(`[data-question="${this.currentQuestion}"]`);
        if (currentQ) {
            currentQ.classList.add('active');
        }
        
        // Update progress
        const progress = (this.currentQuestion / this.totalQuestions) * 100;
        if (this.progressFill) {
            this.progressFill.style.width = `${progress}%`;
        }
        if (this.currentQSpan) {
            this.currentQSpan.textContent = this.currentQuestion;
        }
        
        // Update navigation buttons
        if (this.prevBtn) {
            this.prevBtn.style.display = this.currentQuestion === 1 ? 'none' : 'block';
        }
        
        if (this.nextBtn && this.submitBtn) {
            if (this.currentQuestion === this.totalQuestions) {
                this.nextBtn.style.display = 'none';
                this.submitBtn.style.display = 'block';
            } else {
                this.nextBtn.style.display = 'block';
                this.submitBtn.style.display = 'none';
            }
        }
    }
    
    resetQuiz() {
        this.currentQuestion = 1;
        this.quizForm?.reset();
        this.updateQuestionDisplay();
        
        // Remove all selected states
        const options = this.quizModal.querySelectorAll('.quiz-option');
        options.forEach(option => option.classList.remove('selected'));
    }
    
    submitQuiz() {
        const formData = new FormData(this.quizForm);
        let target = "#best-sellers"; // default
        
        // Smart routing based on quiz answers
        if (formData.get("q1") === "oily" || formData.get("q2") === "yes") target = "#concerns";
        else if (formData.get("q3") === "yes") target = "#concerns";
        else if (formData.get("q4") === "very") target = "#budget-eco";
        else if (formData.get("q1") === "dry") target = "#best-sellers";

        // Show success message
        this.showSuccessMessage();
        
        // Close and redirect
        setTimeout(() => {
            this.closeQuiz();
            window.location.href = target;
        }, 2000);
    }
    
    showSuccessMessage() {
        const successDiv = document.createElement('div');
        successDiv.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(135deg, #26de81, #20bf6b);
                color: white;
                padding: 25px 35px;
                border-radius: 15px;
                font-weight: 600;
                font-size: 1.1rem;
                z-index: 10000;
                box-shadow: 0 15px 35px rgba(38, 222, 129, 0.4);
                animation: successPop 2s ease-out;
                text-align: center;
            ">
                ✨ Analyzing your skin profile...<br>
                <small style="opacity: 0.9; font-size: 0.9rem;">Redirecting to your recommendations!</small>
            </div>
        `;
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.remove();
            }
        }, 2000);
    }
}

// Initialize Enhanced Quiz
let enhancedQuiz;
document.addEventListener('DOMContentLoaded', () => {
    enhancedQuiz = new EnhancedQuiz();
});

// Add success animation keyframes
const successStyle = document.createElement('style');
successStyle.textContent = `
    @keyframes successPop {
        0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.5);
        }
        70% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.05);
        }
        100% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
    }
`;
document.head.appendChild(successStyle);




