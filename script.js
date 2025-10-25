// Add at the very top of your script, before everything else
(function() {
    document.body.classList.add('loading');
    window.addEventListener('load', function() {
        setTimeout(function() {
            document.body.classList.remove('loading');
        }, 100);
    });
})();

        // Mistral AI Configuration
function getAIConfig() {
    return {
        apiKey: '', // Will be fetched from backend
        endpoint: 'https://api.mistral.ai/v1/chat/completions',
        model: 'mistral-tiny' // or 'mistral-small', 'mistral-medium'
    };
}

// Fetch AI config from backend
async function fetchAIConfig() {
    try {
        const response = await fetch('/api/ai-config');
        const config = await response.json();
        return {
            apiKey: config.MISTRAL_API_KEY || '',
            endpoint: 'https://api.mistral.ai/v1/chat/completions',
            model: 'mistral-tiny'
        };
    } catch (error) {
        console.warn('AI config not available:', error);
        return {
            apiKey: '',
            endpoint: 'https://api.mistral.ai/v1/chat/completions',
            model: 'mistral-small'
        };
    }
}

// Fetch EmailJS config from backend (Vercel serverless function)
fetch('/api/email-config')
  .then(res => res.json())
  .then(config => {
    const EMAIL_CONFIG = {
      serviceId: config.EMAIL_SERVICE_ID,
      templateId: config.EMAIL_TEMPLATE_ID,
      publicKey: config.EMAIL_PUBLIC_KEY
    };

    if (EMAIL_CONFIG.publicKey) {
      emailjs.init(EMAIL_CONFIG.publicKey);
    } else {
      console.warn('⚠️ EmailJS not configured - password reset will not work');
    }
  })
  .catch(err => console.error('Error fetching EmailJS config:', err));

let studyStartTime = null;
let totalStudyTime = 0;
let timerInterval = null;
let pendingLesson = null;
let soundEnabled = true;
let currentUser = null;
let isTransitioning = false; // ✅ ADD THIS LINE

// ✅ ADD DEBOUNCE FUNCTION HERE (after line 64)
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

let userProgress = {
    python: {
        course1: { completed: false, progress: 0, time: 0 },
        course2: { completed: false, progress: 0, time: 0 },
        course3: { completed: false, progress: 0, time: 0 },
        course4: { completed: false, progress: 0, time: 0 },
        course5: { completed: false, progress: 0, time: 0 },
        course6: { completed: false, progress: 0, time: 0 },
        course7: { completed: false, progress: 0, time: 0 },
        course8: { completed: false, progress: 0, time: 0 },  // ADD
        course9: { completed: false, progress: 0, time: 0 },   // ADD
        course10: { completed: false, progress: 0, time: 0 },  // ADD THIS
    },
    javascript: {
        course1: { completed: false, progress: 0, time: 0 },
        course2: { completed: false, progress: 0, time: 0 },
        course3: { completed: false, progress: 0, time: 0 },
        course4: { completed: false, progress: 0, time: 0 },
        course5: { completed: false, progress: 0, time: 0 },
        course6: { completed: false, progress: 0, time: 0 },
        course7: { completed: false, progress: 0, time: 0 },
        course8: { completed: false, progress: 0, time: 0 },  // ADD
        course9: { completed: false, progress: 0, time: 0 },   // ADD
        course10: { completed: false, progress: 0, time: 0 },  // ADD THIS
    },
    html: {
        course1: { completed: false, progress: 0, time: 0 },
        course2: { completed: false, progress: 0, time: 0 },
        course3: { completed: false, progress: 0, time: 0 },
        course4: { completed: false, progress: 0, time: 0 },
        course5: { completed: false, progress: 0, time: 0 },
        course6: { completed: false, progress: 0, time: 0 },
        course7: { completed: false, progress: 0, time: 0 },
        course8: { completed: false, progress: 0, time: 0 },  // ADD
        course9: { completed: false, progress: 0, time: 0 },  // ADD
        course10: { completed: false, progress: 0, time: 0 },  // ADD THIS
    },
    css: {
        course1: { completed: false, progress: 0, time: 0 },
        course2: { completed: false, progress: 0, time: 0 },
        course3: { completed: false, progress: 0, time: 0 },
        course4: { completed: false, progress: 0, time: 0 },
        course5: { completed: false, progress: 0, time: 0 },
        course6: { completed: false, progress: 0, time: 0 },
        course7: { completed: false, progress: 0, time: 0 },
        course8: { completed: false, progress: 0, time: 0 },  // ADD
        course9: { completed: false, progress: 0, time: 0 },   // ADD
        course10: { completed: false, progress: 0, time: 0 },  // ADD THIS
    },
    react: {
        course1: { completed: false, progress: 0, time: 0 },
        course2: { completed: false, progress: 0, time: 0 },
        course3: { completed: false, progress: 0, time: 0 },
        course4: { completed: false, progress: 0, time: 0 },
        course5: { completed: false, progress: 0, time: 0 },
        course6: { completed: false, progress: 0, time: 0 },
        course7: { completed: false, progress: 0, time: 0 },
        course8: { completed: false, progress: 0, time: 0 },  // ADD
        course9: { completed: false, progress: 0, time: 0 },   // ADD
        course10: { completed: false, progress: 0, time: 0 },  // ADD THIS
    }
};

const courses = {
    python: [
        { id: 'course1', title: 'Variables', desc: 'Store data', icon: '📦' },
        { id: 'course2', title: 'Print Function', desc: 'Display output', icon: '🖨️' },
        { id: 'course3', title: 'Strings', desc: 'Text manipulation', icon: '📝' },
        { id: 'course4', title: 'Math Operators', desc: 'Calculations', icon: '➗' },
        { id: 'course5', title: 'Concatenation', desc: 'Joining strings', icon: '🔗' },
        { id: 'course6', title: 'Loops', desc: 'Repeat code', icon: '🔄' },
        { id: 'course7', title: 'Lists', desc: 'Store multiple items', icon: '📋' },
        { id: 'course8', title: 'Dictionaries', desc: 'Key-value pairs', icon: '📚' },
        { id: 'course9', title: 'Functions', desc: 'Reusable code blocks', icon: '⚙️' },
        { id: 'course10', title: 'Conditionals', desc: 'If/else statements', icon: '🔀' },
    ],
    javascript: [
        { id: 'course1', title: 'Variables', desc: 'let, const & types', icon: '📦' },
        { id: 'course2', title: 'Strings & Templates', desc: 'Text handling', icon: '📝' },
        { id: 'course3', title: 'Functions', desc: 'Reusable code', icon: '🎯' },
        { id: 'course4', title: 'DOM Manipulation', desc: 'Control web pages', icon: '🌐' },
        { id: 'course5', title: 'Arrays & Objects', desc: 'Data structures', icon: '📚' },
        { id: 'course6', title: 'Events', desc: 'User interactions', icon: '🖱️' },
        { id: 'course7', title: 'Async & Promises', desc: 'Handle async code', icon: '⏳' },
        { id: 'course8', title: 'ES6 Features', desc: 'Modern JavaScript', icon: '✨' },
        { id: 'course9', title: 'Error Handling', desc: 'Try, catch & debug', icon: '🐛' },
        { id: 'course10', title: 'Modules & Import', desc: 'Code organization', icon: '📦'},

    ],
    html: [
        { id: 'course1', title: 'HTML Structure', desc: 'Basic tags', icon: '🌐' },
        { id: 'course2', title: 'Text Formatting', desc: 'Bold, italic, etc', icon: '✍️' },
        { id: 'course3', title: 'Lists', desc: 'Organize content', icon: '📝' },
        { id: 'course4', title: 'Images & Media', desc: 'Visual content', icon: '🖼️' },
        { id: 'course5', title: 'Forms', desc: 'User input', icon: '📋' },
        { id: 'course6', title: 'Links', desc: 'Connect pages', icon: '🔗' },
        { id: 'course7', title: 'Tables', desc: 'Display data', icon: '📊' },
        { id: 'course8', title: 'Semantic HTML', desc: 'Meaningful structure', icon: '🏗️' },
        { id: 'course9', title: 'Meta Tags & SEO', desc: 'Optimize for search', icon: '🔍' },
        { id: 'course10', title: 'Accessibility', desc: 'Web for everyone', icon: '♿' },
    ],
    css: [
        { id: 'course1', title: 'CSS Selectors', desc: 'Target elements', icon: '🎯' },
        { id: 'course2', title: 'Colors & Backgrounds', desc: 'Style appearance', icon: '🎨' },
        { id: 'course3', title: 'Box Model', desc: 'Spacing & layout', icon: '📦' },
        { id: 'course4', title: 'Fonts & Text', desc: 'Typography', icon: '✍️' },
        { id: 'course5', title: 'Flexbox & Grid', desc: 'Modern layouts', icon: '📐' },
        { id: 'course6', title: 'Responsive Design', desc: 'Mobile-first CSS', icon: '📱' },
        { id: 'course7', title: 'Animations', desc: 'Bring pages to life', icon: '✨' },
        { id: 'course8', title: 'CSS Variables', desc: 'Custom properties', icon: '🎛️' },
        { id: 'course9', title: 'Pseudo Classes', desc: 'Dynamic styling', icon: '🎭'},
        { id: 'course10', title: 'CSS Grid Advanced', desc: 'Complex layouts', icon: '🎨' },
    ],
    react: [
        { id: 'course1', title: 'Components & JSX', desc: 'React basics', icon: '⚛️' },
        { id: 'course2', title: 'Props', desc: 'Pass data', icon: '📬' },
        { id: 'course3', title: 'State', desc: 'Dynamic data', icon: '🔄' },
        { id: 'course4', title: 'Events', desc: 'User interactions', icon: '🎯' },
        { id: 'course5', title: 'Conditionals', desc: 'Dynamic UI', icon: '🔀' },
        { id: 'course6', title: 'Lists & Keys', desc: 'Render arrays', icon: '📋' },
        { id: 'course7', title: 'useEffect Hook', desc: 'Side effects', icon: '🪝' },
        { id: 'course8', title: 'Custom Hooks', desc: 'Reusable logic', icon: '🔧' },
        { id: 'course9', title: 'Context API', desc: 'Global state', icon: '🌍' },
        { id: 'course10', title: 'React Router', desc: 'Navigation & routing', icon: '🧭' },
    ]
};

const comingSoonCourses = {
    python: [
        { title: 'File Handling', desc: 'Read & write files', icon: '📁' },
        { title: 'Error Handling', desc: 'Try, except, finally', icon: '⚠️' },
        { title: 'Object-Oriented', desc: 'Classes & objects', icon: '🏗️' }
    ],
    javascript: [
        { title: 'Local Storage', desc: 'Save data locally', icon: '💾' },
        { title: 'Fetch API', desc: 'HTTP requests', icon: '🌐' },
        { title: 'Regex', desc: 'Pattern matching', icon: '🔤' }
    ],
    html: [
        { title: 'Canvas API', desc: 'Draw graphics', icon: '🎨' },
        { title: 'Web Storage', desc: 'localStorage & sessionStorage', icon: '💾' },
        { title: 'Geolocation', desc: 'User location', icon: '📍' }
    ],
    css: [
        { title: 'CSS Filters', desc: 'Image effects', icon: '🖼️' },
        { title: 'Transforms 3D', desc: '3D transformations', icon: '🎲' },
        { title: 'CSS Shapes', desc: 'Clip-path & shapes', icon: '⭐' }
    ],
    react: [
        { title: 'Redux', desc: 'State management', icon: '🗄️' },
        { title: 'Testing', desc: 'Jest & React Testing', icon: '🧪' },
        { title: 'Performance', desc: 'Optimize React apps', icon: '⚡' }
    ]
};

let currentLesson = null;
let learnMessageIndex = 0;
let learnCompleted = false;
let selectedMCQ = {};
let correctAnswers = 0;
let isRetryMode = false;

let currentVerificationCode = null;
let currentForgotEmail = null;

let currentAICourse = null;
let aiCourseContent = null;

// Video Player Functions
let currentVideoIndex = null;
let isFullscreen = false;

let isWatchingVideo = false;
let videoMessageIndex = null;

function showNotification(message, type = 'info') {
    // Remove any existing notifications
    const existingNotif = document.querySelector('.notification-toast');
    if (existingNotif) {
        existingNotif.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification-toast notification-${type}`;

    // Set icon based on type
    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '❌';
    if (type === 'warning') icon = '⚠️';

    notification.innerHTML = `
        <span class="notification-icon">${icon}</span>
        <span class="notification-message">${message}</span>
    `;

    // Add to page
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => notification.classList.add('show'), 10);

    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

function handleForgotPassword(event) {
    event.preventDefault();

    const email = document.getElementById('forgotEmail').value.trim().toLowerCase();
    const btn = document.getElementById('forgotBtn');

    if (!email) {
        showNotification('Please enter your email', 'error');
        return;
    }

    // Check if user exists
    const userDataStr = localStorage.getItem('user_' + email);

    if (!userDataStr) {
        showNotification('Email not found. Please sign up first!', 'error');
        return;
    }

    const userData = JSON.parse(userDataStr);

    btn.disabled = true;
    btn.textContent = 'Sending Code...';

    // Generate 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Store verification data
    currentVerificationCode = verificationCode;
    currentForgotEmail = email;

    // Fetch EmailJS config and send email
    fetch('/api/email-config')
        .then(res => res.json())
        .then(config => {
            const templateParams = {
                to_email: email,
                to_name: userData.name || 'User',
                verification_code: verificationCode,
                user_name: userData.name || 'User'
            };

            return emailjs.send(
                config.EMAIL_SERVICE_ID,
                config.EMAIL_TEMPLATE_ID,
                templateParams,
                config.EMAIL_PUBLIC_KEY
            );
        })
        .then(() => {
            showNotification('✅ Verification code sent to ' + email, 'success');
            btn.disabled = false;
            btn.textContent = 'Send Code';

            // Switch to verify form
            setTimeout(() => {
                switchAuthTab('verify');
            }, 1500);
        })
        .catch((error) => {
            console.error('Email error:', error);
            showNotification('❌ Failed to send email. Please try again.', 'error');
            btn.disabled = false;
            btn.textContent = 'Send Code';
        });
}

// Step 1: Verify the code only
function verifyCodeOnly() {
    const inputs = document.querySelectorAll('.otp-input');
    const code = Array.from(inputs).map(input => input.value).join('');
    const btn = document.getElementById('verifyCodeBtn');

    if (code.length !== 6) {
        showAuthMessage('verifyMessage', 'Please enter all 6 digits!', 'error');
        return;
    }

    if (!currentVerificationCode || !currentForgotEmail) {
        showAuthMessage('verifyMessage', 'Session expired. Please request a new code.', 'error');
        setTimeout(() => switchAuthTab('forgot'), 2000);
        return;
    }

    if (code !== currentVerificationCode) {
        showAuthMessage('verifyMessage', '✗ Invalid verification code!', 'error');
        inputs.forEach(input => input.value = '');
        inputs[0].focus();
        return;
    }

    // Code is correct!
    showAuthMessage('verifyMessage', '✓ Code verified! Enter your new password below.', 'success');
    btn.disabled = true;
    inputs.forEach(input => input.disabled = true);

    // Show password step
    setTimeout(() => {
        document.getElementById('codeStep').style.display = 'none';
        document.getElementById('passwordStep').style.display = 'block';
        document.getElementById('newPassword').focus();
    }, 1500);
}

// Initialize OTP inputs with auto-focus
function initOTPInputs() {
    const inputs = document.querySelectorAll('.otp-input');

    inputs.forEach((input, index) => {
        // Auto-focus next input
        input.addEventListener('input', (e) => {
            if (e.target.value.length === 1 && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
        });

        // Handle backspace
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !e.target.value && index > 0) {
                inputs[index - 1].focus();
            }
        });

        // Only allow numbers
        input.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
        });

        // Handle paste
        input.addEventListener('paste', (e) => {
            e.preventDefault();
            const pastedData = e.clipboardData.getData('text').slice(0, 6);
            const digits = pastedData.split('');
            digits.forEach((digit, i) => {
                if (inputs[i] && /[0-9]/.test(digit)) {
                    inputs[i].value = digit;
                }
            });
            if (digits.length === 6) {
                inputs[5].focus();
            }
        });
    });
}

// Step 2: Reset password
function handleVerifyCode(e) {
    e.preventDefault();

    const newPassword = document.getElementById('newPassword').value;
    const btn = document.getElementById('resetPasswordBtn');

    if (!newPassword || newPassword.length < 6) {
        alert('Password must be at least 6 characters!');
        return;
    }

    btn.disabled = true;
    btn.textContent = 'Resetting...';

    // Update password
    const userDataStr = localStorage.getItem('user_' + currentForgotEmail);
    const userData = JSON.parse(userDataStr);
    userData.password = newPassword;
    localStorage.setItem('user_' + currentForgotEmail, JSON.stringify(userData));

    alert('✓ Password reset successful! Please login with your new password.');

    // Clear verification data
    currentVerificationCode = null;
    currentForgotEmail = null;

    // Reset and go to login
    document.getElementById('verifyForm').reset();
    document.getElementById('codeStep').style.display = 'block';
    document.getElementById('passwordStep').style.display = 'none';
    document.querySelectorAll('.otp-input').forEach(input => input.disabled = false);
    btn.disabled = false;
    btn.textContent = 'Reset Password';

    switchAuthTab('login');
}

function switchAuthTab(tab) {
    const authTabs = document.querySelector('.auth-tabs');
    const allForms = document.querySelectorAll('.auth-form');

    // Clear all messages
    ['loginMessage', 'signupMessage', 'forgotMessage', 'verifyMessage'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = '';
    });

    // Hide all forms first
    allForms.forEach(f => f.classList.remove('active'));

    if (tab === 'login') {
        authTabs.style.display = 'flex';
        document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.auth-tab')[0].classList.add('active');
        document.getElementById('loginForm').classList.add('active');
    } else if (tab === 'signup') {
        authTabs.style.display = 'flex';
        document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.auth-tab')[1].classList.add('active');
        document.getElementById('signupForm').classList.add('active');
    } else if (tab === 'forgot') {
        authTabs.style.display = 'none';
        document.getElementById('forgotForm').classList.add('active');
    } else if (tab === 'verify') {
        authTabs.style.display = 'none';
        document.getElementById('verifyForm').classList.add('active');
        setTimeout(initOTPInputs, 100);
    }
}

function handleSignup(e) {
    e.preventDefault();

    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim().toLowerCase();
    const password = document.getElementById('signupPassword').value;
    const btn = document.getElementById('signupBtn');

    const existingUser = localStorage.getItem('user_' + email);
    if (existingUser) {
        showAuthMessage('signupMessage', 'Account already exists! Please login.', 'error');
        return;
    }

    btn.disabled = true;
    btn.textContent = 'Signing up...';

    setTimeout(() => {
        const userData = {
            name: name,
            email: email,
            password: password,
            createdAt: new Date().toISOString()
        };

        localStorage.setItem('user_' + email, JSON.stringify(userData));

        showAuthMessage('signupMessage', 'Account created successfully! Logging you in...', 'success');
        btn.disabled = false;
        btn.textContent = 'Create Account';

        document.getElementById('signupForm').reset();

        setTimeout(() => {
            document.getElementById('loginEmail').value = email;
            switchAuthTab('login');
        }, 1500);
    }, 1000);
}

function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const password = document.getElementById('loginPassword').value;
    const btn = document.getElementById('loginBtn');

    const userDataStr = localStorage.getItem('user_' + email);

    if (!userDataStr) {
        showAuthMessage('loginMessage', 'Account doesn\'t exist. Please sign up!', 'error');
        return;
    }

    const userData = JSON.parse(userDataStr);

    if (userData.password !== password) {
        showAuthMessage('loginMessage', 'Incorrect password. Try again!', 'error');
        return;
    }

    btn.disabled = true;
    btn.textContent = 'Logging in...';

    setTimeout(() => {
        localStorage.setItem('currentUser', email);
        currentUser = email;
        initializeApp();
    }, 1000);
}

function showAuthMessage(elementId, message, type) {
    const msgEl = document.getElementById(elementId);
    msgEl.innerHTML = `<div class="auth-message ${type}">${message}</div>`;
}

function initializeApp() {
    document.getElementById('authScreen').style.display = 'none';

    const savedProgress = localStorage.getItem('progress_' + currentUser);
    if (savedProgress) {
        const loadedProgress = JSON.parse(savedProgress);

        Object.keys(userProgress).forEach(lang => {
            Object.keys(userProgress[lang]).forEach(courseId => {
                if (loadedProgress[lang] && loadedProgress[lang][courseId]) {
                    userProgress[lang][courseId] = loadedProgress[lang][courseId];
                }
            });
        });

        localStorage.setItem('progress_' + currentUser, JSON.stringify(userProgress));
        soundEnabled = localStorage.getItem('soundEnabled') !== 'false';
    }

    const savedTime = localStorage.getItem('studyTime_' + currentUser);
    if (savedTime) {
        totalStudyTime = parseInt(savedTime);
    }

    const userData = JSON.parse(localStorage.getItem('user_' + currentUser));
    if (userData) {
        const firstName = userData.name.split(' ')[0];
        document.getElementById('userName').textContent = firstName;
        document.getElementById('userEmail').textContent = userData.email;
        document.getElementById('userAvatar').textContent = firstName.charAt(0).toUpperCase();
    }

    renderCourses();
    updateDashboard();
    checkStreakStatus();

    // Check for updates - will show splash for new users after 0.3s
    checkForUpdates();

    // Start goal monitoring if goals exist
const savedGoals = localStorage.getItem('userGoals_' + currentUser);
if (savedGoals) {
    const goals = JSON.parse(savedGoals);
    if (goals.emailNotifications) {
        startSmartGoalMonitoring();
    }
}

    // ADD THESE LINES AT THE VERY END
    setTimeout(() => {
        initializeGoalsButtons();
    }, 500);
}

function logout() {
    document.getElementById('logoutModal').classList.add('active');
}

function closeLogoutModal() {
    document.getElementById('logoutModal').classList.remove('active');
}

function confirmLogout() {
    localStorage.removeItem('currentUser');
    location.reload();
}

function checkStreakStatus() {
    const today = new Date().toDateString();
    const lastActivity = localStorage.getItem('lastActivity_' + currentUser);
    const currentStreak = parseInt(localStorage.getItem('streak_' + currentUser) || '0');

    if (lastActivity && currentStreak > 0) {
        const lastDate = new Date(lastActivity);
        const todayDate = new Date(today);
        const diffTime = todayDate - lastDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays > 1) {
            // Streak broken - reset to 0
            const brokenStreak = currentStreak;
            localStorage.setItem('streak_' + currentUser, '0');

            // Show broken streak message
            setTimeout(() => {
                const modal = document.createElement('div');
                modal.className = 'streak-broken-modal';
                modal.innerHTML = `
                    <div class="streak-broken-content">
                        <div class="streak-broken-icon">💔</div>
                        <h2 class="streak-broken-title">Streak Broken!</h2>
                        <p class="streak-broken-text">You had a ${brokenStreak} day streak.</p>
                        <p class="streak-broken-encourage">Complete a lesson today to start fresh!</p>
                        <button class="close-broken-btn" onclick="this.closest('.streak-broken-modal').remove()">Continue</button>
                    </div>
                `;
                document.body.appendChild(modal);
                setTimeout(() => modal.classList.add('active'), 100);
            }, 1000);
        }
    }
}

function checkAuth() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = savedUser;
        initializeApp();
    } else {
        document.getElementById('authScreen').style.display = 'flex';
    }
}

function injectMobileBottomSheetCSS() {
    if (document.getElementById('mobileBottomSheetCSS')) return;

    const style = document.createElement('style');
    style.id = 'mobileBottomSheetCSS';
    style.textContent = `
@media (max-width: 768px) {
.goals-modal,
.completion-stats-modal,
#goalsListModal,
.retry-modal {
align-items: flex-end !important;
padding: 0 !important;
}
.goals-modal-content,
.completion-stats-content,
.goals-list-content,
.retry-modal-content {
max-width: 100% !important;
width: 100% !important;
max-height: 85vh !important;
margin: 0 !important;
border-radius: 20px 20px 0 0 !important;
transform: translateY(100%) !important;
transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
}
.goals-modal.active .goals-modal-content,
.completion-stats-modal.active .completion-stats-content,
#goalsListModal.active .goals-list-content,
.retry-modal .retry-modal-content {
transform: translateY(0) !important;
}
.goals-modal-content::before,
.completion-stats-content::before,
.goals-list-content::before,
.retry-modal-content::before {
content: '';
position: absolute;
top: 12px;
left: 50%;
transform: translateX(-50%);
width: 40px;
height: 4px;
background: rgba(255, 255, 255, 0.3);
border-radius: 2px;
z-index: 1;
}
.goals-modal-content,
.completion-stats-content,
.goals-list-content,
.retry-modal-content {
padding-top: 30px !important;
}
}
`;
    document.head.appendChild(style);
}

function enableBottomSheetSwipe() {
    if (window.innerWidth > 768) return; // Desktop only

    const modals = [
        '.goals-modal-content',
        '.completion-stats-content',
        '#viewGoalsModal > div',
        '.goals-list-content',
        '.retry-modal-content'  // ✅ Add this
    ];

    modals.forEach(selector => {
        document.addEventListener('DOMContentLoaded', () => {
            const observer = new MutationObserver(() => {
                const element = document.querySelector(selector);
                if (element && !element.dataset.swipeEnabled) {
                    element.dataset.swipeEnabled = 'true';
                    addSwipeGesture(element);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    });
}

function addSwipeGesture(element) {
    let startY = 0;
    let currentY = 0;
    let isDragging = false;

    element.addEventListener('touchstart', (e) => {
        // Only allow swipe from top 50px (drag handle area)
        const rect = element.getBoundingClientRect();
        const touchY = e.touches[0].clientY - rect.top;

        if (touchY < 50) {
            startY = e.touches[0].clientY;
            isDragging = true;
        }
    }, { passive: true });

    element.addEventListener('touchmove', (e) => {
        if (!isDragging) return;

        currentY = e.touches[0].clientY;
        const diff = currentY - startY;

        if (diff > 0) {
            element.style.transform = `translateY(${diff}px)`;
            element.style.transition = 'none';
        }
    }, { passive: true });

    element.addEventListener('touchend', () => {
        if (!isDragging) return;

        const diff = currentY - startY;
        element.style.transition = 'transform 0.3s ease';

        if (diff > 100) {
            // Close modal
            element.style.transform = 'translateY(100%)';
            setTimeout(() => {
                const modal = element.closest('.goals-modal, .completion-stats-modal, #viewGoalsModal, #goalsListModal, .retry-modal');
                if (modal) {
                    if (modal.id === 'goalsModal') closeGoalsModal();
                    else if (modal.id === 'viewGoalsModal') closeViewGoalsModal();
                    else if (modal.id === 'goalsListModal') closeGoalsList();
                    else if (modal.classList.contains('retry-modal')) closeRetryModal();
                    else if (modal.classList.contains('completion-stats-modal')) {
                        modal.remove();
                        unlockScroll();
                    }
                }
            }, 300);
        } else {
            element.style.transform = 'translateY(0)';
        }

        isDragging = false;
        startY = 0;
        currentY = 0;
    });
}

function injectScrollLockCSS() {
    if (document.getElementById('scrollLockCSS')) return;

    const style = document.createElement('style');
    style.id = 'scrollLockCSS';
    style.textContent = `
body.modal-open {
overflow: hidden !important;
position: fixed !important;
width: 100% !important;
height: 100% !important;
}
.goals-modal,
.completion-stats-modal,
#viewGoalsModal,
#goalsListModal,
.inline-ai-overlay,
.update-splash {
position: fixed !important;
overflow: hidden !important;
-webkit-overflow-scrolling: auto !important;
}
.goals-modal-content,
.completion-stats-content,
#viewGoalsModal > div,
.goals-list-content,
#goalsContentContainer,
.stat-detail-content,
.wrong-answers-list {
overflow-y: auto !important;
-webkit-overflow-scrolling: touch !important;
overscroll-behavior: contain !important;
}
.goals-modal-content,
.completion-stats-content,
#viewGoalsModal > div,
.goals-list-content {
touch-action: pan-y !important;
}
@media (max-width: 768px) {
body.modal-open {
touch-action: none !important;
}
.goals-modal,
.completion-stats-modal,
#viewGoalsModal,
#goalsListModal {
touch-action: none !important;
}
}
`;
    document.head.appendChild(style);
}

// Update AI suggestions dynamically based on detected language
function updateAISuggestions(language) {
    const suggestionsContainer = document.querySelector('.ai-suggestions');
    if (!suggestionsContainer) return;

    const languageEmojis = {
        'Python': '🐍',
        'JavaScript': '⚡',
        'HTML': '🌐',
        'CSS': '🎨',
        'React': '⚛️',
        'None': '💡',
        'Unknown': '💡'
    };

    const emoji = languageEmojis[language] || '💡';

    // Language-specific suggestions
    let suggestions = '';

    if (language === 'Python') {
        suggestions = `
            <button class="suggestion-btn" onclick="sendAISuggestion('explain')">
                🐍 Explain this Python code
            </button>
            <button class="suggestion-btn" onclick="sendAISuggestion('debug')">
                🐛 Debug Python errors
            </button>
            <button class="suggestion-btn" onclick="sendAISuggestion('improve')">
                ⚡ Optimize Python code
            </button>
        `;
    } else if (language === 'JavaScript') {
        suggestions = `
            <button class="suggestion-btn" onclick="sendAISuggestion('explain')">
                ⚡ Explain this JavaScript
            </button>
            <button class="suggestion-btn" onclick="sendAISuggestion('debug')">
                🐛 Debug JS errors
            </button>
            <button class="suggestion-btn" onclick="sendAISuggestion('improve')">
                💪 Improve JS code
            </button>
        `;
    } else if (language === 'HTML') {
        suggestions = `
            <button class="suggestion-btn" onclick="sendAISuggestion('explain')">
                🌐 Explain this HTML
            </button>
            <button class="suggestion-btn" onclick="sendAISuggestion('debug')">
                🔍 Check HTML structure
            </button>
            <button class="suggestion-btn" onclick="sendAISuggestion('improve')">
                ✨ Enhance HTML markup
            </button>
        `;
    } else if (language === 'CSS') {
        suggestions = `
            <button class="suggestion-btn" onclick="sendAISuggestion('explain')">
                🎨 Explain these styles
            </button>
            <button class="suggestion-btn" onclick="sendAISuggestion('debug')">
                🔍 Fix CSS issues
            </button>
            <button class="suggestion-btn" onclick="sendAISuggestion('improve')">
                💅 Beautify CSS
            </button>
        `;
    } else {
        // Default suggestions
        suggestions = `
            <button class="suggestion-btn" onclick="sendAISuggestion('explain')">
                💡 What does this code do?
            </button>
            <button class="suggestion-btn" onclick="sendAISuggestion('debug')">
                🐛 Debug my code
            </button>
            <button class="suggestion-btn" onclick="sendAISuggestion('improve')">
                ⚡ Improve my code
            </button>
        `;
    }

    suggestionsContainer.innerHTML = suggestions;
}

window.addEventListener('DOMContentLoaded', () => {
    injectScrollLockCSS();
    injectSplashScreenCSS();
    injectGoalsCSS(); // ✅ ADD THIS LINE
    injectVideoPlayerCSS();
    checkAuth();
    injectMobileBottomSheetCSS();
    enableBottomSheetSwipe();

    // Initialize the home section and stat cards on page load
    setTimeout(() => {
        updateDashboard();
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('animate-in');
            }, index * 150);
        });
    }, 100);

    const codeEditor = document.getElementById('codeEditor');
    const detectedLangSpan = document.getElementById('detectedLang');

    if (codeEditor && detectedLangSpan) {
        codeEditor.addEventListener('input', () => {
            const language = detectLanguage(codeEditor.value);
            detectedLangSpan.textContent = language;

            if (language === 'None' || language === 'Unknown') {
                detectedLangSpan.style.color = '#8b949e';
            } else {
                detectedLangSpan.style.color = '#64ffda';
            }

            // Update AI suggestions dynamically based on language
            updateAISuggestions(language);
        });
    }
});

window.addEventListener('resize', () => {
    if (window.innerWidth <= 768) {
        createMobileStatsCarousel();
        updateMobileStatsCarousel();
    }
});

// Scroll lock utility functions
let scrollPosition = 0;

function lockScroll() {
    // Save current scroll position
    scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

    // Add class to body
    document.body.classList.add('modal-open');

    // Set body position to prevent scroll
    document.body.style.top = `-${scrollPosition}px`;

    console.log('🔒 Scroll locked at position:', scrollPosition);
}

function unlockScroll() {
    // Remove class from body
    document.body.classList.remove('modal-open');

    // Remove inline styles
    document.body.style.top = '';

    // Restore scroll position
    window.scrollTo(0, scrollPosition);

    console.log('🔓 Scroll unlocked, restored to:', scrollPosition);
}

// Remove old mobile nav functions and add these:

let touchStartX = 0;
let touchEndX = 0;
let isSwiping = false;

// Swipe detection
document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    // Only detect swipe from left edge (first 50px)
    if (touchStartX < 50) {
        isSwiping = true;
    }
}, false);

document.addEventListener('touchmove', (e) => {
    if (isSwiping) {
        touchEndX = e.changedTouches[0].screenX;
        // Open sidebar if swiped right from edge
        if (touchEndX - touchStartX > 50) {
            openMobileSidebar();
            isSwiping = false;
        }
    }
}, false);

document.addEventListener('touchend', () => {
    isSwiping = false;
}, false);

function openMobileSidebar() {
    const sidebar = document.getElementById('mobileSidebar');
    const overlay = document.getElementById('mobileSidebarOverlay');

    if (sidebar && overlay) {
        sidebar.classList.add('active');
        overlay.classList.add('active');
        document.body.classList.add('sidebar-open');
    }
}

function closeMobileSidebar() {
    const sidebar = document.getElementById('mobileSidebar');
    const overlay = document.getElementById('mobileSidebarOverlay');

    if (sidebar && overlay) {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.classList.remove('sidebar-open');
    }
}

function showSectionSidebar(sectionId) {
    // Close sidebar first
    closeMobileSidebar();

    // Small delay for smooth transition
    setTimeout(() => {
        // Show section
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        document.getElementById(sectionId).classList.add('active');

        // Update active state in sidebar
        document.querySelectorAll('.sidebar-item').forEach(item => {
            item.classList.remove('active');
            if (item.textContent.toLowerCase().includes(sectionId === 'home' ? 'overview' : sectionId)) {
                item.classList.add('active');
            }
        });

        // Update dashboard if home
        if (sectionId === 'home') {
            updateDashboard();
        }

        // Trigger course card animations when switching to learn section
        if (sectionId === 'learn') {
            const courseCards = document.querySelectorAll('.course-card');
            courseCards.forEach((card, index) => {
                // Reset animation
                card.style.animation = 'none';
                card.offsetHeight; // Trigger reflow
                card.style.animation = null;
            });
        }
    }, 300);
}

function toggleTheme() {
    document.body.classList.toggle('light-mode');
    document.documentElement.classList.toggle('light-mode');
    const toggle = document.getElementById('themeToggle');
    toggle.classList.toggle('active');
}

function toggleSearch() {
    const container = document.getElementById('navContainer');
    const tabs = document.getElementById('navTabs');
    const searchContainer = document.getElementById('searchContainer');
    const searchInput = document.getElementById('searchInput');

    if (container.classList.contains('search-active')) {
        // Closing search - faster
        searchContainer.classList.remove('active');
        document.getElementById('searchResults').classList.remove('active');
        searchInput.value = '';

        // Wait for search to fade out (reduced time)
        setTimeout(() => {
            container.classList.remove('search-active');
            tabs.style.opacity = '0';
            tabs.style.display = 'flex';
            tabs.classList.remove('show-tabs');

            // Trigger reflow to restart animation
            void tabs.offsetWidth;

            // Fade in tabs with animation
            setTimeout(() => {
                tabs.classList.add('show-tabs');
                tabs.style.transition = 'opacity 0.3s ease';
                tabs.style.opacity = '1';
            }, 30);
        }, 200); // Reduced from 300ms
    } else {
        // Opening search - faster
        tabs.style.transition = 'opacity 0.2s ease';
        tabs.style.opacity = '0';

        setTimeout(() => {
            container.classList.add('search-active');
            tabs.style.display = 'none';

            setTimeout(() => {
                searchContainer.classList.add('active');
                searchInput.focus();
            }, 50);
        }, 200); // Reduced from 300ms
    }
}

function toggleMobileSearch() {
    document.getElementById('mobileSearchOverlay').classList.add('active');
    document.getElementById('mobileSearchContainer').classList.add('active');
    setTimeout(() => {
        document.getElementById('mobileSearchInput').focus();
    }, 400);
}

function closeMobileSearch() {
    document.getElementById('mobileSearchOverlay').classList.remove('active');
    document.getElementById('mobileSearchContainer').classList.remove('active');
    document.getElementById('mobileSearchInput').value = '';
    document.getElementById('mobileSearchResults').innerHTML = '';
}

// Global variable to track selected search item
let selectedSearchIndex = -1;
let searchItems = [];

function handleSearch() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const results = document.getElementById('searchResults');

    if (!query) {
        results.classList.remove('active');
        selectedSearchIndex = -1;
        searchItems = [];
        return;
    }

    // Group matches by language
    const matchesByLang = {};
    Object.keys(courses).forEach(lang => {
        courses[lang].forEach((course, index) => {
            if (course.title.toLowerCase().includes(query) ||
                course.desc.toLowerCase().includes(query) ||
                lang.includes(query)) {

                const isLocked = index > 0 && !userProgress[lang]['course' + index]?.completed;
                const isCompleted = userProgress[lang][course.id]?.completed;

                if (!matchesByLang[lang]) {
                    matchesByLang[lang] = [];
                }

                matchesByLang[lang].push({
                    lang,
                    course,
                    langName: lang.charAt(0).toUpperCase() + lang.slice(1),
                    isLocked,
                    isCompleted,
                    index
                });
            }
        });
    });

    // Build HTML with AI search option + grouped results
    let html = '';
    searchItems = [];
    let itemIndex = 0;

    // Detect if query is natural language (long sentence with multiple words)
    const wordCount = query.trim().split(/\s+/).length;
    const hasNaturalLanguage = wordCount >= 5 || (query.length > 25 && wordCount >= 3);

    // Only show AI search for natural language queries
    if (hasNaturalLanguage) {
        html += `
            <div class="search-ai-section" data-index="${itemIndex}" onclick="handleAISearch('${query.replace(/'/g, "\\'")}')">
                <div class="search-ai-icon">🤖</div>
                <div class="search-ai-text">
                    <div class="search-ai-title">AI Natural Language Search</div>
                    <div class="search-ai-desc">"${query.length > 50 ? query.substring(0, 50) + '...' : query}"</div>
                </div>
            </div>
        `;
        searchItems.push({ type: 'ai', query });
        itemIndex++;
    }

    // Add grouped language results
    const languages = Object.keys(matchesByLang);

    if (languages.length > 0) {
        languages.forEach(lang => {
            const langIcon = {
                'javascript': '🟨',
                'python': '🐍',
                'java': '☕',
                'cpp': '⚙️',
                'html': '🌐',
                'css': '🎨',
                'react': '⚛️',
                'nodejs': '🟢'
            }[lang] || '📚';

            const langName = lang.charAt(0).toUpperCase() + lang.slice(1);
            html += `
                <div class="search-language-group">
                    <div class="search-language-header">${langIcon} ${langName} Courses</div>
            `;

            matchesByLang[lang].forEach(m => {
                let statusBadge = '';
                let clickable = !m.isLocked;

                if (m.isCompleted) {
                    statusBadge = '<span style="color: #00ff00; margin-left: 8px;">✓ Completed</span>';
                } else if (m.isLocked) {
                    statusBadge = '<span style="color: #ff6b6b; margin-left: 8px;">🔒 Locked</span>';
                } else {
                    statusBadge = '<span style="color: #64ffda; margin-left: 8px;">📖 Available</span>';
                }

                const onClickAttr = clickable
                    ? `onclick="openCourseFromSearch('${m.lang}', '${m.course.id}', '${m.course.title}')"`
                    : `style="opacity: 0.5; cursor: not-allowed;"`;

                html += `
                    <div class="search-result-item" data-index="${itemIndex}" ${onClickAttr}>
                        <div class="search-result-title">${m.course.icon} ${m.course.title}${statusBadge}</div>
                        <div class="search-result-desc">${m.langName} • ${m.course.desc}</div>
                    </div>
                `;

                searchItems.push({
                    type: 'course',
                    lang: m.lang,
                    courseId: m.course.id,
                    title: m.course.title,
                    clickable
                });
                itemIndex++;
            });

            html += '</div>';
        });
    } else {
        html += '<div class="search-result-item">No courses found. Try the AI search above!</div>';
    }

    results.innerHTML = html;
    results.classList.add('active');
    selectedSearchIndex = -1;
}

function handleSearchKeyboard(event) {
    const results = document.getElementById('searchResults');

    if (!results.classList.contains('active') || searchItems.length === 0) {
        return;
    }

    if (event.key === 'ArrowDown') {
        event.preventDefault();
        selectedSearchIndex = Math.min(selectedSearchIndex + 1, searchItems.length - 1);
        updateSearchSelection();
    } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        selectedSearchIndex = Math.max(selectedSearchIndex - 1, -1);
        updateSearchSelection();
    } else if (event.key === 'Enter') {
        event.preventDefault();
        if (selectedSearchIndex >= 0 && selectedSearchIndex < searchItems.length) {
            const item = searchItems[selectedSearchIndex];
            if (item.type === 'ai') {
                handleAISearch(item.query);
            } else if (item.type === 'course' && item.clickable) {
                openCourseFromSearch(item.lang, item.courseId, item.title);
            }
        }
    } else if (event.key === 'Escape') {
        toggleSearch();
    }
}

function updateSearchSelection() {
    // Remove previous selection
    document.querySelectorAll('.search-result-item, .search-ai-section').forEach(item => {
        item.classList.remove('selected');
    });

    // Add selection to current item
    if (selectedSearchIndex >= 0) {
        const selectedItem = document.querySelector(`[data-index="${selectedSearchIndex}"]`);
        if (selectedItem) {
            selectedItem.classList.add('selected');
            selectedItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
    }
}

async function handleAISearch(query) {
    const results = document.getElementById('searchResults');

    // Show loading state
    results.innerHTML = `
        <div class="search-ai-section">
            <div class="search-ai-icon">🤖</div>
            <div class="search-ai-text">
                <div class="search-ai-title">AI is analyzing your request...</div>
                <div class="search-ai-desc">Please wait while we find the best courses for you</div>
            </div>
        </div>
    `;

    try {
        // Get all available courses info for AI context
        const coursesInfo = Object.keys(courses).map(lang => {
            return courses[lang].map((course, index) => ({
                language: lang,
                title: course.title,
                description: course.desc,
                id: course.id
            }));
        }).flat();

        const aiPrompt = `The user is searching for: "${query}"

Here are all available courses:
${coursesInfo.map(c => `- ${c.language.toUpperCase()}: ${c.title} - ${c.description}`).join('\n')}

Based on the user's search query, which courses would be most relevant? Return ONLY a JSON array of course IDs in order of relevance (most relevant first). Maximum 5 courses.

Example format: ["course0", "course1", "course2"]

Return only the JSON array, no other text.`;

        const apiKey = await getMistralAPIKey();

        if (!apiKey) {
            throw new Error('API key not configured');
        }

        const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'mistral-small-latest',
                messages: [
                    {
                        role: 'user',
                        content: aiPrompt
                    }
                ],
                temperature: 0.3,
                max_tokens: 200
            })
        });

        const data = await response.json();
        let aiResponse = data.choices[0].message.content.trim();

        // Extract JSON array from response
        const jsonMatch = aiResponse.match(/\[.*\]/);
        if (!jsonMatch) {
            throw new Error('Invalid AI response format');
        }

        const recommendedIds = JSON.parse(jsonMatch[0]);

        // Display AI-recommended courses
        let html = `
            <div class="search-ai-section">
                <div class="search-ai-icon">✨</div>
                <div class="search-ai-text">
                    <div class="search-ai-title">AI Recommendations for: "${query}"</div>
                    <div class="search-ai-desc">Found ${recommendedIds.length} relevant course(s)</div>
                </div>
            </div>
        `;

        recommendedIds.forEach(courseId => {
            // Find the course in our courses object
            Object.keys(courses).forEach(lang => {
                courses[lang].forEach((course, index) => {
                    if (course.id === courseId) {
                        const isLocked = index > 0 && !userProgress[lang]['course' + index]?.completed;
                        const isCompleted = userProgress[lang][course.id]?.completed;
                        const clickable = !isLocked;

                        let statusBadge = '';
                        if (isCompleted) {
                            statusBadge = '<span style="color: #00ff00; margin-left: 8px;">✓ Completed</span>';
                        } else if (isLocked) {
                            statusBadge = '<span style="color: #ff6b6b; margin-left: 8px;">🔒 Locked</span>';
                        } else {
                            statusBadge = '<span style="color: #64ffda; margin-left: 8px;">📖 Available</span>';
                        }

                        const onClickAttr = clickable
                            ? `onclick="openCourseFromSearch('${lang}', '${course.id}', '${course.title}')"`
                            : `style="opacity: 0.5; cursor: not-allowed;"`;

                        const langName = lang.charAt(0).toUpperCase() + lang.slice(1);

                        html += `
                            <div class="search-result-item" ${onClickAttr}>
                                <div class="search-result-title">🤖 ${course.icon} ${course.title}${statusBadge}</div>
                                <div class="search-result-desc">${langName} • ${course.desc}</div>
                            </div>
                        `;
                    }
                });
            });
        });

        results.innerHTML = html;

    } catch (error) {
        console.error('AI Search Error:', error);
        results.innerHTML = `
            <div class="search-ai-section">
                <div class="search-ai-icon">⚠️</div>
                <div class="search-ai-text">
                    <div class="search-ai-title">AI Search Failed</div>
                    <div class="search-ai-desc">${error.message || 'Please try a regular search or try again later'}</div>
                </div>
            </div>
        `;

        // Fall back to regular search after 2 seconds
        setTimeout(() => handleSearch(), 2000);
    }
}

function handleMobileSearch() {
    const query = document.getElementById('mobileSearchInput').value.toLowerCase();
    const results = document.getElementById('mobileSearchResults');

    if (!query) {
        results.innerHTML = '';
        return;
    }

    const matches = [];
    Object.keys(courses).forEach(lang => {
        courses[lang].forEach((course, index) => {
            if (course.title.toLowerCase().includes(query) ||
                course.desc.toLowerCase().includes(query) ||
                lang.includes(query)) {

                const isLocked = index > 0 && !userProgress[lang]['course' + index]?.completed;
                const isCompleted = userProgress[lang][course.id]?.completed;

                matches.push({
                    lang,
                    course,
                    langName: lang.charAt(0).toUpperCase() + lang.slice(1),
                    isLocked,
                    isCompleted,
                    index
                });
            }
        });
    });

    if (matches.length > 0) {
        results.innerHTML = matches.map(m => {
            let statusBadge = '';
            let clickable = !m.isLocked;

            if (m.isCompleted) {
                statusBadge = '<span style="color: #00ff00; margin-left: 8px;">✓ Completed</span>';
            } else if (m.isLocked) {
                statusBadge = '<span style="color: #ff6b6b; margin-left: 8px;">🔒 Locked</span>';
            } else {
                statusBadge = '<span style="color: #64ffda; margin-left: 8px;">📖 Available</span>';
            }

            const onClick = clickable
                ? `onclick="openCourseFromSearch('${m.lang}', '${m.course.id}', '${m.course.title}'); closeMobileSearch();"`
                : `style="opacity: 0.5; cursor: not-allowed;"`;

            return `
                <div class="search-result-item" ${onClick}>
                    <div class="search-result-title">${m.course.icon} ${m.course.title}${statusBadge}</div>
                    <div class="search-result-desc">${m.langName} • ${m.course.desc}</div>
                </div>
            `;
        }).join('');
    } else {
        results.innerHTML = '<div class="search-result-item">No courses found</div>';
    }
}

function openCourseFromSearch(lang, courseId, courseName) {
    const courseIndex = courses[lang].findIndex(c => c.id === courseId);
    const isLocked = courseIndex > 0 && !userProgress[lang]['course' + courseIndex]?.completed;

    if (isLocked) {
        alert('🔒 This course is locked! Complete the previous course to unlock it.');
        return;
    }

    toggleSearch();
    showSection('learn');
    switchLanguage(lang);

    const isCompleted = userProgress[lang][courseId]?.completed;

    if (isCompleted) {
        showRetryModal(lang, courseId, courseName);
    } else {
        openLesson(lang, courseId, courseName);
    }
}

function retryLesson(lang, courseId, courseName) {
    closeRetryModal();

    // Set retry mode flag
    isRetryMode = true;

    // Open the lesson
    openLesson(lang, courseId, courseName);
}

// Track if this is the initial page load
let isInitialPageLoad = true;

function showSection(sectionId) {
    // Cache all queries at once
    const sections = document.querySelectorAll('.section');
    const navTabs = document.querySelectorAll('.nav-tab');
    
    // Batch all DOM changes in one animation frame
requestAnimationFrame(() => {
    sections.forEach(s => {
        s.classList.remove('active', 'page-load-animate');
    });
    navTabs.forEach(t => t.classList.remove('active'));
    
    const section = document.getElementById(sectionId);
    section.classList.add('active');
});

    // Only add page load animation on initial page load for 'home' section
    if (isInitialPageLoad && sectionId === 'home') {
        setTimeout(() => section.classList.add('page-load-animate'), 10);
        setTimeout(() => section.classList.remove('page-load-animate'), 1000);
        isInitialPageLoad = false;
    }

    // Find and activate nav tab (reuse cached navTabs)
    const activeTab = Array.from(navTabs).find(
        tab => tab.textContent.toLowerCase().includes(sectionId === 'home' ? 'overview' : sectionId)
    );
    if (activeTab) activeTab.classList.add('active');

    if (sectionId === 'home') {
        updateDashboard();

        // Use requestAnimationFrame to batch DOM updates
requestAnimationFrame(() => {
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => card.classList.add('visible'));
});

        // Fix for mobile: Defer carousel updates
        if (window.innerWidth <= 768) {
            // Use requestIdleCallback to defer non-critical work
            if ('requestIdleCallback' in window) {
                requestIdleCallback(() => {
                    const statsGrid = document.querySelector('.stats-grid');
                    if (statsGrid) statsGrid.style.display = 'none';
                    
                    const existingCarousel = document.querySelector('.mobile-stats-carousel');
                    if (existingCarousel) existingCarousel.remove();
                    
                    createMobileStatsCarousel();
                });
            } else {
                // Fallback for browsers without requestIdleCallback
                setTimeout(() => {
                    const statsGrid = document.querySelector('.stats-grid');
                    if (statsGrid) statsGrid.style.display = 'none';
                    
                    const existingCarousel = document.querySelector('.mobile-stats-carousel');
                    if (existingCarousel) existingCarousel.remove();
                    
                    createMobileStatsCarousel();
                }, 0);
            }
        } else {
            // On desktop, ensure the grid is visible
            const statsGrid = document.querySelector('.stats-grid');
            if (statsGrid) {
                statsGrid.style.display = 'grid';
            }
            // Remove carousel if it exists on desktop
            const existingCarousel = document.querySelector('.mobile-stats-carousel');
            if (existingCarousel) {
                existingCarousel.remove();
            }
        }
    } // ✅ CLOSES if (sectionId === 'home')

    if (sectionId === 'stats') {
        setTimeout(() => {
            initializeGoalsButtons();
        }, 100);
    }
} // ✅ CLOSES function showSection

function showSectionMobile(sectionId, element) {
    document.querySelectorAll('.section').forEach(s => {
        s.classList.remove('active');
        s.classList.remove('page-load-animate');
    });
    document.querySelectorAll('.mobile-nav-item').forEach(i => i.classList.remove('active'));

    const section = document.getElementById(sectionId);
    section.classList.add('active');
    element.classList.add('active');

    // Only add page load animation on initial page load for 'home' section
    if (isInitialPageLoad && sectionId === 'home') {
        setTimeout(() => {
            section.classList.add('page-load-animate');
        }, 10);

        // Remove animation class after animation completes
        setTimeout(() => {
            section.classList.remove('page-load-animate');
        }, 1000);

        // Mark that the initial page load animation has been shown
        isInitialPageLoad = false;
    }

    if (sectionId === 'home') {
        // Defer dashboard updates
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => updateDashboard());
        } else {
            setTimeout(() => updateDashboard(), 0);
        }

        // Animate stat cards with wave effect only on initial page load
        if (isInitialPageLoad) {
            const statCards = document.querySelectorAll('.stat-card');
            statCards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('animate-in');
                }, index * 150); // 150ms delay between each card
            });
        } else {
            // If not initial load, just show them immediately
            const statCards = document.querySelectorAll('.stat-card');
            statCards.forEach(card => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) scale(1)';
            });
        }

        // Fix for mobile: Ensure carousel is properly updated
        if (window.innerWidth <= 768) {
            setTimeout(() => {
                const statsGrid = document.querySelector('.stats-grid');
                if (statsGrid) {
                    statsGrid.style.display = 'none';
                }

                // Always remove and recreate carousel
                const existingCarousel = document.querySelector('.mobile-stats-carousel');
                if (existingCarousel) {
                    existingCarousel.remove();
                }

                createMobileStatsCarousel();
            }, 100);
        }
    }
}

function switchLanguage(lang) {
    document.querySelectorAll('.language-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.language-content').forEach(c => c.classList.remove('active'));
    event.target.classList.add('active');
    document.getElementById(lang + '-content').classList.add('active');
}

function switchChart(type) {
    // Force hide all charts first
    document.querySelectorAll('.chart-container').forEach(c => {
        c.classList.remove('active');
        c.style.display = 'none';
    });

    // Remove active from all tabs
    document.querySelectorAll('.chart-tab').forEach(t => t.classList.remove('active'));

    // Add active to clicked tab (if triggered by tab click)
    if (event && event.target && event.target.classList.contains('chart-tab')) {
        event.target.classList.add('active');
    } else {
        // If triggered by filter, activate the corresponding tab
        const tabs = document.querySelectorAll('.chart-tab');
        tabs.forEach(tab => {
            const tabText = tab.textContent.toLowerCase();
            if (tabText.includes(type) || (type === 'all' && tabText.includes('all'))) {
                tab.classList.add('active');
            }
        });
    }

    // Show the selected chart
    const chartToShow = document.getElementById(type + 'Chart');
    if (chartToShow) {
        chartToShow.classList.add('active');
        chartToShow.style.display = 'block';
    }

    // Update charts
    updateCharts();
}

function renderCourses() {
    const newCoursesSeenDate = localStorage.getItem('newCoursesSeen_' + currentUser);
    const now = new Date().getTime();
    const oneDayMs = 24 * 60 * 60 * 1000;
    const shouldShowNew = !newCoursesSeenDate || (now - parseInt(newCoursesSeenDate)) < oneDayMs;

    if (!newCoursesSeenDate) {
        localStorage.setItem('newCoursesSeen_' + currentUser, now.toString());
    }

    Object.keys(courses).forEach(lang => {
        const container = document.getElementById(lang + '-courses');
        container.innerHTML = '';

        // Active Courses Section - FILTER OUT COURSES 8-10
        const availableCourses = courses[lang].filter(course => !course.isNew);

        availableCourses.forEach((course, index) => {
            const isLocked = index > 0 && !userProgress[lang]['course' + index]?.completed;
            const isCompleted = userProgress[lang][course.id]?.completed;
            const progress = userProgress[lang][course.id]?.progress || 0;

            const card = document.createElement('div');
            card.className = 'course-card' + (isLocked ? ' locked' : '');
            card.innerHTML = `
                ${isLocked ? '<div class="lock-overlay">🔒 Complete previous</div>' : ''}
                ${isCompleted ? '<div class="completed-badge">✓ Completed</div>' : ''}
                <div class="course-header">
                    <div style="font-size: 2.5em; margin-bottom: 10px;">${course.icon}</div>
                    <div class="course-title">${course.title}</div>
                    <div class="course-desc">${course.desc}</div>
                </div>
                <div class="course-progress-bar">
                    <div class="course-progress-header">
                        <span class="course-progress-name">Progress</span>
                        <span class="course-progress-percent" id="percent-${lang}-${course.id}">${progress}%</span>
                    </div>
                    <div class="progress-bar" onclick="toggleProgressBar(event, '${lang}', '${course.id}', ${progress})">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                </div>
            `;

            if (!isLocked) {
                card.onclick = () => {
                    if (isCompleted) {
                        showRetryModal(lang, course.id, course.title);
                    } else {
                        openLesson(lang, course.id, course.title);
                    }
                };
            }

            container.appendChild(card);
        });
    });

    // ADD COMING SOON SECTION AT THE END (AFTER ALL LANGUAGES)
    createComingSoonSection();
}

        function createComingSoonSection() {
    // Check if already exists
    const existingSection = document.getElementById('globalComingSoonSection');
    if (existingSection) {
        existingSection.remove();
    }

    const learnSection = document.getElementById('learn');
    const languageContent = learnSection.querySelector('.language-content.active');

    if (!languageContent) return;

    // Create coming soon container
    const comingSoonContainer = document.createElement('div');
    comingSoonContainer.id = 'globalComingSoonSection';
    comingSoonContainer.style.cssText = `
        margin-top: 40px;
        background: rgba(30, 30, 30, 0.8);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 2px solid rgba(102, 126, 234, 0.3);
        border-radius: 20px;
        padding: 30px;
        box-shadow: 0 8px 32px rgba(102, 126, 234, 0.2);
    `;

    const titleSection = document.createElement('div');
    titleSection.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 25px;
        flex-wrap: wrap;
        gap: 15px;
    `;

    const title = document.createElement('h2');
    title.style.cssText = `
        color: #fff;
        font-size: 1.8em;
        font-weight: 700;
        margin: 0;
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    title.innerHTML = '🚀 Coming Soon';

    const badge = document.createElement('span');
    badge.style.cssText = `
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(100, 255, 218, 0.2));
        border: 2px solid rgba(102, 126, 234, 0.5);
        padding: 6px 16px;
        border-radius: 50px;
        color: #667eea;
        font-weight: 700;
        font-size: 0.5em;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    `;
    badge.textContent = 'FUTURE COURSES';
    title.appendChild(badge);

    titleSection.appendChild(title);
    comingSoonContainer.appendChild(titleSection);

    // Empty state message
    const emptyState = document.createElement('div');
    emptyState.style.cssText = `
        text-align: center;
        padding: 60px 20px;
        background: rgba(100, 255, 218, 0.03);
        border: 2px dashed rgba(100, 255, 218, 0.2);
        border-radius: 15px;
    `;

    emptyState.innerHTML = `
        <div style="font-size: 4em; margin-bottom: 15px; opacity: 0.6;">📦</div>
        <div style="color: #fff; font-size: 1.3em; font-weight: 700; margin-bottom: 10px;">No courses coming soon yet</div>
        <div style="color: #8b949e; font-size: 1em; font-weight: 500;">More exciting courses will be added in future updates!</div>
    `;

    comingSoonContainer.appendChild(emptyState);
    languageContent.appendChild(comingSoonContainer);
}

function switchComingSoonTab(lang) {
    // Update active tab
    document.querySelectorAll('.coming-soon-tab').forEach(tab => {
        const isActive = tab.dataset.lang === lang;
        tab.classList.toggle('active', isActive);
        tab.style.background = isActive ? 'rgba(102, 126, 234, 0.2)' : 'rgba(100, 255, 218, 0.05)';
        tab.style.borderColor = isActive ? 'rgba(102, 126, 234, 0.5)' : 'rgba(100, 255, 218, 0.2)';
        tab.style.color = isActive ? '#667eea' : '#64ffda';
    });

    // Get coming soon courses (courses 8-10)
    const comingSoonCourses = courses[lang].filter(course => course.isNew);

    // Update cards
    const cardsContainer = document.getElementById('comingSoonCards');
    cardsContainer.style.cssText = `
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 20px;
        animation: fadeIn 0.4s ease;
    `;

    cardsContainer.innerHTML = '';

    comingSoonCourses.forEach(course => {
        const card = document.createElement('div');
        card.style.cssText = `
            display: flex;
            align-items: center;
            gap: 15px;
            background: rgba(100, 255, 218, 0.05);
            border: 2px solid rgba(100, 255, 218, 0.15);
            border-radius: 15px;
            padding: 20px;
            transition: all 0.3s ease;
            cursor: not-allowed;
            opacity: 0.8;
        `;

        card.onmouseenter = function() {
            this.style.background = 'rgba(100, 255, 218, 0.08)';
            this.style.borderColor = 'rgba(100, 255, 218, 0.25)';
            this.style.transform = 'translateY(-3px)';
            this.style.boxShadow = '0 8px 20px rgba(100, 255, 218, 0.2)';
        };

        card.onmouseleave = function() {
            this.style.background = 'rgba(100, 255, 218, 0.05)';
            this.style.borderColor = 'rgba(100, 255, 218, 0.15)';
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        };

        card.innerHTML = `
            <div style="font-size: 3em; opacity: 0.7; flex-shrink: 0; filter: grayscale(30%);">${course.icon}</div>
            <div style="flex: 1;">
                <div style="font-weight: 700; color: #fff; font-size: 1.15em; margin-bottom: 8px; opacity: 0.9;">${course.title}</div>
                <div style="color: #8b949e; font-size: 0.95em; font-weight: 500; margin-bottom: 8px;">${course.desc}</div>
                <div style="display: inline-flex; align-items: center; gap: 6px; background: rgba(102, 126, 234, 0.15); padding: 4px 12px; border-radius: 20px; font-size: 0.85em; color: #667eea; font-weight: 600;">
                    <span>🔜</span>
                    <span>Coming Soon</span>
                </div>
            </div>
        `;

        cardsContainer.appendChild(card);
    });
}

function openLesson(language, courseId, courseName) {
    currentLesson = { language, courseId, courseName };
    learnCompleted = false;
    learnMessageIndex = 0;
    correctAnswers = 0;
    selectedMCQ = {};

    studyStartTime = Date.now();
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);

    document.body.classList.add('lesson-active');

    document.getElementById('lessonTitle').textContent = courseName;
    document.getElementById('lessonView').classList.add('active');
    document.getElementById('learnMessages').innerHTML = '';
    document.getElementById('questionMessages').innerHTML = '';

    document.getElementById('questionsTabBtn').disabled = true;
    document.getElementById('questionsTabBtn').innerHTML = 'Questions 🔒';

    switchPanel('learn');
    updateLessonProgress();
    displayNextLearnMessage();
}

function closeLesson() {
    if (studyStartTime && currentLesson && !isRetryMode && !currentLesson.isAI) {
        const sessionTime = Math.floor((Date.now() - studyStartTime) / 1000);
        userProgress[currentLesson.language][currentLesson.courseId].time += sessionTime;
        totalStudyTime += sessionTime;

        localStorage.setItem('progress_' + currentUser, JSON.stringify(userProgress));
        localStorage.setItem('studyTime_' + currentUser, totalStudyTime.toString());
    }

    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    // Clear all AI course data
    if (currentLesson && currentLesson.isAI) {
        currentAICourse = null;
        aiCourseContent = null;
        wrongAnswers = [];
    }

    studyStartTime = null;
    isRetryMode = false;
    learnCompleted = false;
    learnMessageIndex = 0;
    correctAnswers = 0;
    selectedMCQ = {};

    document.body.classList.remove('lesson-active');

    document.getElementById('lessonView').classList.remove('active');
    currentLesson = null;

    renderCourses();
    updateDashboard();
}

function updateTimer() {
    if (!studyStartTime) return;
    const elapsed = Math.floor((Date.now() - studyStartTime) / 1000) + totalStudyTime;
    const hours = Math.floor(elapsed / 3600);
    const minutes = Math.floor((elapsed % 3600) / 60);
    document.getElementById('totalTime').textContent = `${hours}h ${minutes}m`;
}

function switchPanel(panel) {
    if (panel === 'questions' && !learnCompleted) return;

    document.querySelectorAll('.tab-switch-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.content-panel').forEach(p => p.classList.remove('active'));

    if (panel === 'learn') {
        document.getElementById('learnTabBtn').classList.add('active');
        document.getElementById('learnPanel').classList.add('active');
    } else {
        document.getElementById('questionsTabBtn').classList.add('active');
        document.getElementById('questionsPanel').classList.add('active');

        const questionMessages = document.getElementById('questionMessages');
        if (questionMessages.children.length === 0) {
            // Check if it's an AI course
            if (currentLesson && currentLesson.isAI) {
                displayAIQuestions(aiCourseContent.exercises);
            } else {
                displayQuestions();
            }
        }
    }
}

async function displayNextLearnMessage() {
    if (!currentLesson || !currentLesson.language || !currentLesson.courseId) {
        console.warn('currentLesson is not properly set:', currentLesson);
        return;
    }

    const content = lessonContent[currentLesson.language]?.[currentLesson.courseId];
    if (!content) {
        console.warn('Lesson content not found for:', currentLesson);
        return;
    }

    const learnMessages = document.getElementById('learnMessages');
    if (!learnMessages) {
        console.warn('Element with id "learnMessages" not found in the DOM.');
        return;
    }

    if (learnMessageIndex >= content.learn.length) {
        learnCompleted = true;
        const questionsBtn = document.getElementById('questionsTabBtn');
        if (questionsBtn) {
            questionsBtn.disabled = false;
            questionsBtn.innerHTML = 'Questions ✓';
        }

        // Get user's first name
        const userData = JSON.parse(localStorage.getItem('user_' + currentUser));
        const firstName = userData ? userData.name.split(' ')[0] : 'there';

        const unlockMsg = document.createElement('div');
        unlockMsg.className = 'message';
        unlockMsg.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="message-bubble">
                ✅ Great job, ${firstName}! Learning complete! Switch to <strong>Questions</strong> tab to test yourself!
            </div>
        `;
        learnMessages.appendChild(unlockMsg);
        learnMessages.scrollTop = learnMessages.scrollHeight;
        return;
    }

    const typingDiv = document.createElement('div');
    typingDiv.className = 'message';
    typingDiv.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="message-bubble">
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        </div>
    `;
    learnMessages.appendChild(typingDiv);
    learnMessages.scrollTop = learnMessages.scrollHeight;

    setTimeout(async () => {
        typingDiv.remove();

        const msg = content.learn[learnMessageIndex];
        if (!msg || !msg.bot) {
            console.warn('Message content missing at index', learnMessageIndex);
            learnMessageIndex++;
            return;
        }

        // Add personalized greeting for first message
        let messageContent = msg.bot;
        if (learnMessageIndex === 0 && currentUser) {
            const userData = JSON.parse(localStorage.getItem('user_' + currentUser));
            const firstName = userData ? userData.name.split(' ')[0] : 'there';

            // Personalize the greeting
            if (messageContent.includes('Welcome')) {
                messageContent = messageContent.replace('Welcome', `Welcome, ${firstName}!`);
            } else {
                messageContent = `Hey ${firstName}! 👋 ${messageContent}`;
            }
        }

        const highlightedContent = await highlightKeywords(messageContent);

        // REPLACE with this:
const messageDiv = document.createElement('div');
messageDiv.className = 'message';
messageDiv.style.opacity = '0';
messageDiv.style.transform = 'translateY(10px)';

// Check if this is a video message
if (msg.video) {
    messageDiv.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="message-bubble">
            ${highlightedContent}
            <div class="video-message-buttons">
                <button class="video-btn video-btn-watch" onclick="showVideoPlayer(${learnMessageIndex})">
                    ▶️ Watch Video
                </button>
                <button class="video-btn video-btn-later" onclick="skipVideo()">
                    ⏭️ Later
                </button>
            </div>
            <div class="video-container" id="videoContainer-${learnMessageIndex}">
                <div class="video-wrapper">
                    <iframe src="" id="videoFrame-${learnMessageIndex}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                </div>
                <button class="fullscreen-btn" onclick="toggleFullscreen(${learnMessageIndex})" title="Fullscreen">
                    ⛶
                </button>
            </div>
        </div>
    `;
} else {
    messageDiv.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="message-bubble">${highlightedContent}</div>
    `;
}
        learnMessages.appendChild(messageDiv);

        learnMessages.scrollTop = learnMessages.scrollHeight;

        requestAnimationFrame(() => {
            messageDiv.style.transition = 'all 0.4s ease';
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translateY(0)';
        });

        learnMessageIndex++;
        updateLessonProgress();

        if (learnMessageIndex < content.learn.length) {
            setTimeout(displayNextLearnMessage, 600);
        } else {
            learnCompleted = true;
            const questionsBtn = document.getElementById('questionsTabBtn');
            if (questionsBtn) {
                questionsBtn.disabled = false;
                questionsBtn.innerHTML = 'Questions ✓';
            }

            const userData = JSON.parse(localStorage.getItem('user_' + currentUser));
            const firstName = userData ? userData.name.split(' ')[0] : 'there';

            const unlockMsg = document.createElement('div');
            unlockMsg.className = 'message';
            unlockMsg.style.opacity = '0';
            unlockMsg.style.transform = 'translateY(10px)';
            unlockMsg.innerHTML = `
                <div class="message-avatar">🤖</div>
                <div class="message-bubble">
                    ✅ Excellent work, ${firstName}! Switch to <strong>Questions</strong> tab to test yourself!
                </div>
            `;
            learnMessages.appendChild(unlockMsg);
            learnMessages.scrollTop = learnMessages.scrollHeight;

            requestAnimationFrame(() => {
                unlockMsg.style.transition = 'all 0.4s ease';
                unlockMsg.style.opacity = '1';
                unlockMsg.style.transform = 'translateY(0)';
            });
        }
    }, 800);
}

function updateLessonProgress() {
    // Handle AI courses
    if (currentLesson && currentLesson.isAI) {
        const totalSteps = aiCourseContent.learn.length + aiCourseContent.exercises.length;
        const completedSteps = learnMessageIndex + correctAnswers;
        const progress = Math.min(100, Math.round((completedSteps / totalSteps) * 100));
        document.getElementById('lessonProgressText').textContent = `${progress}% Complete`;
        return;
    }

    if (!currentLesson || !currentLesson.language || !currentLesson.courseId) return;

    const content = lessonContent[currentLesson.language]?.[currentLesson.courseId];
    if (!content) return;

    const totalSteps = content.learn.length + content.exercises.length;
    const completedSteps = learnMessageIndex + correctAnswers;

    // Calculate progress - will be forced to 100% by checkCompletion() when done
    const progress = Math.min(100, Math.round((completedSteps / totalSteps) * 100));

    document.getElementById('lessonProgressText').textContent = `${progress}% Complete`;

    if (!isRetryMode) {
        userProgress[currentLesson.language][currentLesson.courseId].progress = progress;
        localStorage.setItem('progress_' + currentUser, JSON.stringify(userProgress));
    }
}

function displayQuestions() {
    const content = lessonContent[currentLesson.language]?.[currentLesson.courseId];
    if (!content) return;

    const questionMessages = document.getElementById('questionMessages');
    questionMessages.innerHTML = ''; // Clear any existing content

    const welcomeDiv = document.createElement('div');
    welcomeDiv.className = 'message';
    welcomeDiv.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="message-bubble">🎯 Test your knowledge!</div>
    `;
    questionMessages.appendChild(welcomeDiv);

    // ✅ DEBUG: Log total exercises
    console.log('Total exercises to display:', content.exercises.length);

    content.exercises.forEach((exercise, index) => {
        console.log('Creating question', index + 1, ':', exercise.question); // Debug

        const exerciseDiv = document.createElement('div');
        exerciseDiv.className = 'message';

        if (exercise.type === 'mcq') {
            let optionsHTML = exercise.options.map((opt, i) =>
                `<div class="mcq-option" onclick="selectOption(this, ${index}, ${i})">${opt}</div>`
            ).join('');

            exerciseDiv.innerHTML = `
                <div class="message-avatar">🤖</div>
                <div class="message-bubble">
                    <div class="exercise-box">
                        <div class="exercise-title">❓ ${exercise.question}</div>
                        <div class="mcq-options" data-exercise="${index}">
                            ${optionsHTML}
                        </div>
                        <button class="submit-button" onclick="checkMCQAnswer(${index})">Check</button>
                        <div id="feedback-${index}"></div>
                    </div>
                </div>
            `;
        } else if (exercise.type === 'fill') {
            const isMobile = window.innerWidth <= 768;

            if (isMobile) {
                // Mobile version with clickable options
                const options = generateFillOptions(exercise.answer, exercise.code);

                exerciseDiv.innerHTML = `
                    <div class="message-avatar">🤖</div>
                    <div class="message-bubble">
                        <div class="exercise-box">
                            <div class="exercise-title">✏️ ${exercise.question}</div>
                            <div class="code-fill">${exercise.code.replace(/___BLANK___/g, '<span class="code-blank-placeholder">____</span>')}</div>
                            <div class="fill-options">
                                ${options.map((opt, i) => `
                                    <button class="fill-option-btn" onclick="selectFillOption(${index}, '${opt}', '${exercise.answer}')">${opt}</button>
                                `).join('')}
                            </div>
                            <div id="feedback-${index}"></div>
                        </div>
                    </div>
                `;
            } else {
                // Desktop version with input field
                const codeWithBlanks = exercise.code.replace(/___BLANK___/g,
                    `<span class="code-blank-wrapper"><input type="text" class="code-blank" data-index="${index}" placeholder="____"></span>`);

                exerciseDiv.innerHTML = `
                    <div class="message-avatar">🤖</div>
                    <div class="message-bubble">
                        <div class="exercise-box">
                            <div class="exercise-title">✏️ ${exercise.question}</div>
                            <div class="code-fill">${codeWithBlanks}</div>
                            <button class="submit-button" onclick="checkFillAnswer(${index}, '${exercise.answer}')">Check</button>
                            <div id="feedback-${index}"></div>
                        </div>
                    </div>
                `;
            }
        }

        questionMessages.appendChild(exerciseDiv);
    });

    // ✅ Force scroll to top of questions panel
    questionMessages.scrollTop = 0;

    // ✅ DEBUG: Log how many questions were created
    console.log('Questions created:', questionMessages.children.length - 1); // -1 for welcome message
}

function selectOption(element, exerciseIndex, optionIndex) {
    element.parentElement.querySelectorAll('.mcq-option').forEach(opt => opt.classList.remove('selected'));
    element.classList.add('selected');
    selectedMCQ[exerciseIndex] = optionIndex;
}

function checkMCQAnswer(exerciseIndex) {
    // FIX: Check if AI course or regular course
    const content = currentLesson.isAI
        ? aiCourseContent
        : lessonContent[currentLesson.language][currentLesson.courseId];

    const exercise = content.exercises[exerciseIndex];
    const selected = selectedMCQ[exerciseIndex];
    const feedbackDiv = document.getElementById('feedback-' + exerciseIndex);
    const optionsContainer = document.querySelector(`.mcq-options[data-exercise="${exerciseIndex}"]`);
    const options = optionsContainer.querySelectorAll('.mcq-option');
    const submitBtn = optionsContainer.closest('.exercise-box').querySelector('.submit-button');

    if (selected === undefined) {
        feedbackDiv.innerHTML = '<div class="feedback incorrect">Select an answer!</div>';
        return;
    }

    if (selected === exercise.correct) {
        options[selected].classList.add('correct');
        options.forEach(opt => {
            opt.style.pointerEvents = 'none';
            opt.style.cursor = 'not-allowed';
            opt.style.opacity = '0.7';
        });
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.5';
        submitBtn.style.cursor = 'not-allowed';
        feedbackDiv.innerHTML = '<div class="feedback correct">✅ Correct!</div>';
        correctAnswers++;
        updateLessonProgress();
        checkCompletion();
    } else {
        if (!isRetryMode) {
            trackWrongAnswer(
                exercise.question,
                exercise.options[selected],
                exercise.options[exercise.correct]
            );
        }

        options[selected].classList.add('incorrect');
        options[exercise.correct].classList.add('correct');
        feedbackDiv.innerHTML = '<div class="feedback incorrect">❌ Try again!</div>';
        setTimeout(() => {
            options[selected].classList.remove('incorrect', 'selected');
            options[exercise.correct].classList.remove('correct');
            selectedMCQ[exerciseIndex] = undefined;
        }, 1500);
    }
}

function checkFillAnswer(exerciseIndex, correctAnswer) {
    const blank = document.querySelector(`.code-blank[data-index="${exerciseIndex}"]`);
    const wrapper = blank.parentElement;
    const userAnswer = blank.value.trim();
    const feedbackDiv = document.getElementById('feedback-' + exerciseIndex);
    const submitBtn = wrapper.closest('.exercise-box').querySelector('.submit-button');

    if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
        wrapper.classList.remove('incorrect');
        wrapper.classList.add('correct');
        blank.disabled = true;
        blank.style.cursor = 'not-allowed';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.5';
        submitBtn.style.cursor = 'not-allowed';
        feedbackDiv.innerHTML = '<div class="feedback correct">✅ Correct!</div>';
        correctAnswers++;
        updateLessonProgress();
        checkCompletion();
    } else {
        // Track wrong answer
        if (!isRetryMode) {
            const content = currentLesson.isAI
                ? aiCourseContent
                : lessonContent[currentLesson.language][currentLesson.courseId];
            const exercise = content.exercises[exerciseIndex];
            trackWrongAnswer(exercise.question, userAnswer, correctAnswer);
        }

        wrapper.classList.remove('correct');
        wrapper.classList.add('incorrect');
        feedbackDiv.innerHTML = '<div class="feedback incorrect">❌ Wrong! Answer: ' + correctAnswer + '</div>';
        setTimeout(() => {
            wrapper.classList.remove('incorrect');
            blank.value = '';
        }, 500);
    }
}

// Generate fill options for mobile
function generateFillOptions(correctAnswer, codeSnippet) {
    const options = [correctAnswer];

    // Common wrong answers based on context
    const commonWrong = {
        'print': ['println', 'console', 'echo'],
        'let': ['var', 'const', 'int'],
        'const': ['let', 'var', 'final'],
        'function': ['func', 'def', 'method'],
        'return': ['returns', 'give', 'send'],
        'type': ['typeof', 'typeOf', 'Type'],
        'len': ['length', 'size', 'count'],
        'append': ['add', 'push', 'insert'],
        'upper': ['uppercase', 'toUpper', 'UP'],
        'replace': ['substitute', 'change', 'swap'],
        'for': ['while', 'foreach', 'loop'],
        'import': ['include', 'require', 'use'],
        'def': ['function', 'func', 'define'],
        'if': ['when', 'check', 'test'],
        'else': ['otherwise', 'or', 'elif'],
        'while': ['for', 'loop', 'until'],
        'break': ['stop', 'exit', 'end'],
        'in': ['of', 'from', 'inside'],
        'addEventListener': ['addListener', 'on', 'listen'],
        'querySelector': ['getElement', 'select', 'find'],
        'getElementById': ['querySelector', 'getElement', 'findById'],
        'style': ['css', 'styling', 'styles'],
        'async': ['await', 'promise', 'asynchronous'],
        'await': ['async', 'wait', 'promise'],
        'then': ['next', 'after', 'done'],
        'catch': ['error', 'fail', 'exception']
    };

    // Add wrong options
    if (commonWrong[correctAnswer]) {
        options.push(...commonWrong[correctAnswer].slice(0, 2));
    } else {
        // Generic wrong options
        options.push(correctAnswer + 's', correctAnswer.toUpperCase(), correctAnswer + '()');
    }

    // Shuffle options
    return options.sort(() => Math.random() - 0.5).slice(0, 4);
}

// Handle mobile fill option selection
function selectFillOption(exerciseIndex, selected, correctAnswer) {
    const feedbackDiv = document.getElementById('feedback-' + exerciseIndex);
    const optionsContainer = document.querySelector(`#feedback-${exerciseIndex}`).closest('.exercise-box').querySelector('.fill-options');
    const buttons = optionsContainer.querySelectorAll('.fill-option-btn');
    const placeholder = document.querySelector(`#feedback-${exerciseIndex}`).closest('.exercise-box').querySelector('.code-blank-placeholder');

    if (selected.toLowerCase() === correctAnswer.toLowerCase()) {
        buttons.forEach(btn => {
            btn.disabled = true;
            btn.style.opacity = '0.5';
            btn.style.cursor = 'not-allowed';
            if (btn.textContent === selected) {
                btn.classList.add('correct-option');
            }
        });

        placeholder.textContent = selected;
        placeholder.style.color = '#64ffda';
        placeholder.style.fontWeight = '700';

        feedbackDiv.innerHTML = '<div class="feedback correct">✅ Correct!</div>';
        correctAnswers++;
        updateLessonProgress();
        checkCompletion();
    } else {
        buttons.forEach(btn => {
            if (btn.textContent === selected) {
                btn.classList.add('incorrect-option');
                setTimeout(() => {
                    btn.classList.remove('incorrect-option');
                }, 1000);
            }
        });

        feedbackDiv.innerHTML = '<div class="feedback incorrect">❌ Try again!</div>';
        setTimeout(() => {
            feedbackDiv.innerHTML = '';
        }, 1500);
    }
}

function checkCompletion() {
    // FIX: Support AI courses
    const content = currentLesson.isAI
        ? aiCourseContent
        : lessonContent[currentLesson.language][currentLesson.courseId];

    if (correctAnswers >= content.exercises.length) {
        // ✅ CRITICAL: Update progress to 100% BEFORE showing completion message
        if (!isRetryMode) {
            if (currentLesson.isAI) {
                // For AI courses, just update display
                document.getElementById('lessonProgressText').textContent = '100% Complete';
            } else {
                // For regular courses, save to storage
                userProgress[currentLesson.language][currentLesson.courseId].progress = 100;
                localStorage.setItem('progress_' + currentUser, JSON.stringify(userProgress));
                document.getElementById('lessonProgressText').textContent = '100% Complete';
            }
        } else {
            document.getElementById('lessonProgressText').textContent = '100% Complete';
        }

        const questionMessages = document.getElementById('questionMessages');

        const completeMsg = document.createElement('div');
        completeMsg.className = 'message';
        completeMsg.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="message-bubble">
                🎉 Excellent work! You've mastered this lesson!
                <button class="next-button" onclick="completeLesson()">Finish Lesson</button>
            </div>
        `;
        questionMessages.appendChild(completeMsg);
        questionMessages.scrollTop = questionMessages.scrollHeight;
    }
}

function completeLesson() {
    if (!isRetryMode) {
        // Handle AI course completion
        if (currentLesson.isAI) {
            const aiCompletions = JSON.parse(localStorage.getItem('aiCompletions_' + currentUser) || '[]');
            aiCompletions.push({
                title: currentAICourse.title,
                completedAt: new Date().toISOString(),
                accuracy: Math.round(((aiCourseContent.exercises.length - wrongAnswers.length) / aiCourseContent.exercises.length) * 100)
            });
            localStorage.setItem('aiCompletions_' + currentUser, JSON.stringify(aiCompletions));
            showAICompletionStats();
            return;
        }

        trackCourseCompletion();

        // Track study time
        if (studyStartTime) {
            const sessionTime = Math.floor((Date.now() - studyStartTime) / 1000);
            userProgress[currentLesson.language][currentLesson.courseId].time += sessionTime;
            totalStudyTime += sessionTime;

            localStorage.setItem('progress_' + currentUser, JSON.stringify(userProgress));
            localStorage.setItem('studyTime_' + currentUser, totalStudyTime.toString());
        }

        // Normal course completion
        userProgress[currentLesson.language][currentLesson.courseId].completed = true;
        userProgress[currentLesson.language][currentLesson.courseId].progress = 100;
        localStorage.setItem('progress_' + currentUser, JSON.stringify(userProgress));

        // Calculate and store accuracy
        const totalQuestions = lessonContent[currentLesson.language][currentLesson.courseId].exercises.length;
        const wrongAttempts = wrongAnswers.length;
        const finalAccuracy = Math.round(((totalQuestions - wrongAttempts) / totalQuestions) * 100);

        localStorage.setItem('lastLessonAccuracy', finalAccuracy.toString());
        localStorage.setItem('lastLessonName', currentLesson.courseName);
        localStorage.setItem('lastLessonLanguage', currentLesson.language);

        // Show completion stats
        showCompletionStats();

        const today = new Date().toDateString();
        const lastActivity = localStorage.getItem('lastActivity_' + currentUser);
        const currentStreak = parseInt(localStorage.getItem('streak_' + currentUser) || '0');

        let newStreak = currentStreak;
        let showStreak = false;

        if (!lastActivity) {
            newStreak = 1;
            showStreak = true;
            localStorage.setItem('streak_' + currentUser, '1');
            localStorage.setItem('lastActivity_' + currentUser, today);
        } else if (lastActivity !== today) {
            const lastDate = new Date(lastActivity);
            const todayDate = new Date(today);
            const diffTime = todayDate - lastDate;
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                newStreak = currentStreak + 1;
                showStreak = true;
            } else if (diffDays > 1) {
                newStreak = 1;
                showStreak = true; // ✅ FIXED: Show animation even when restarting streak
            }

            localStorage.setItem('streak_' + currentUser, newStreak.toString());
            localStorage.setItem('lastActivity_' + currentUser, today);
        }

        document.getElementById('lessonView').classList.remove('active');
        currentLesson = null;

        // ✅ FIX: Update both courses list AND roadmap
        renderCourses();

        // Check if roadmap is visible and regenerate it
        const roadmapView = document.getElementById('roadmapView');
        if (roadmapView && roadmapView.classList.contains('active')) {
            generateRoadmap();
        }

        showSection('home');

        if (showStreak && newStreak > 0) {
            setTimeout(() => {
                showStreakCelebration(newStreak);
            }, 300);
        }
    } else {
        closeLesson();
    }
}

function showStreakCelebration(streakNumber) {
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
        // Mobile: Navigate to streak card in carousel FIRST
        showSection('home');

        setTimeout(() => {
            // Slide to streak card (index 2 - third card)
            goToStatsSlide(2);

            // Wait for carousel to settle
            setTimeout(() => {
                const statsCards = document.querySelectorAll('.stats-carousel-slide .stat-card');
                const streakCard = statsCards[2]; // Third card is streak

                if (!streakCard) return;

                // Get card position
                const rect = streakCard.getBoundingClientRect();
                const oldStreak = streakNumber - 1;

                // Create floating card clone
                const floatingCard = document.createElement('div');
                floatingCard.className = 'floating-streak-card';
                floatingCard.innerHTML = `
                    <div class="stat-icon">🔥</div>
                    <div class="stat-value" id="floatingStreakValue">${oldStreak}</div>
                    <div class="stat-label">Day Streak</div>
                `;

                floatingCard.style.cssText = `
                    position: fixed;
                    left: ${rect.left}px;
                    top: ${rect.top}px;
                    width: ${rect.width}px;
                    height: ${rect.height}px;
                    background: rgba(30, 30, 30, 0.95);
                    border: 2px solid rgba(100, 255, 218, 0.3);
                    border-radius: 20px;
                    padding: 30px;
                    z-index: 9999;
                    transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
                    box-shadow: 0 10px 40px rgba(100, 255, 218, 0.3);
                `;

                // Hide original card
                streakCard.style.opacity = '0';

                // Add to body
                document.body.appendChild(floatingCard);

                // Create overlay
                const overlay = document.createElement('div');
                overlay.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0);
                    z-index: 9998;
                    transition: background 0.5s ease;
                `;
                document.body.appendChild(overlay);

                // Animate to center
                setTimeout(() => {
                    overlay.style.background = 'rgba(0, 0, 0, 0.8)';

                    const centerX = window.innerWidth / 2;
                    const centerY = window.innerHeight / 2;

                    floatingCard.style.left = centerX + 'px';
                    floatingCard.style.top = centerY + 'px';
                    floatingCard.style.transform = 'translate(-50%, -50%) scale(1.2)';
                    floatingCard.style.boxShadow = '0 20px 60px rgba(100, 255, 218, 0.5)';
                }, 100);

                // Animate number change
                setTimeout(() => {
                    const valueElement = document.getElementById('floatingStreakValue');

                    // Create number slide container
                    valueElement.style.position = 'relative';
                    valueElement.style.overflow = 'hidden';
                    valueElement.style.height = '60px';

                    const numberContainer = document.createElement('div');
                    numberContainer.style.cssText = `
                        position: relative;
                        width: 100%;
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        transition: transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
                    `;

                    const oldNumber = document.createElement('div');
                    oldNumber.textContent = oldStreak;
                    oldNumber.style.cssText = `
                        font-size: 2.5em;
                        color: #64ffda;
                        font-weight: 700;
                        min-height: 60px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    `;

                    const newNumber = document.createElement('div');
                    newNumber.textContent = streakNumber;
                    newNumber.style.cssText = `
                        font-size: 2.5em;
                        color: #64ffda;
                        font-weight: 700;
                        min-height: 60px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        text-shadow: 0 0 30px rgba(100, 255, 218, 0.8);
                    `;

                    numberContainer.appendChild(oldNumber);
                    numberContainer.appendChild(newNumber);

                    valueElement.innerHTML = '';
                    valueElement.appendChild(numberContainer);

                    // Slide animation
                    setTimeout(() => {
                        numberContainer.style.transform = 'translateY(-60px)';
                    }, 100);

                    // Pulse card
                    setTimeout(() => {
                        floatingCard.style.transform = 'translate(-50%, -50%) scale(1.25)';
                    }, 300);

                    setTimeout(() => {
                        floatingCard.style.transform = 'translate(-50%, -50%) scale(1.2)';
                    }, 600);

                }, 1000);

                // Fly back to original position
                setTimeout(() => {
                    overlay.style.background = 'rgba(0, 0, 0, 0)';
                    floatingCard.style.left = rect.left + 'px';
                    floatingCard.style.top = rect.top + 'px';
                    floatingCard.style.transform = 'translate(0, 0) scale(1)';
                    floatingCard.style.boxShadow = '0 10px 40px rgba(100, 255, 218, 0.3)';
                }, 3000);

                // Clean up
                setTimeout(() => {
                    floatingCard.style.opacity = '0';

                    setTimeout(() => {
                        floatingCard.remove();
                        overlay.remove();
                        streakCard.style.opacity = '1';

                        // Update the actual streak value
                        document.getElementById('streakDays').textContent = streakNumber;
                        updateMobileStatsCarousel();
                    }, 500);
                }, 3500);

            }, 600);
        }, 300);

        return; // Exit early for mobile
    }

    // DESKTOP VERSION (keep existing desktop code below)
    const celebration = document.getElementById('streakCelebration');
    const card = celebration.querySelector('.streak-card-animated');
    const numberContainer = card.querySelector('.streak-number-container');

    const statCards = document.querySelectorAll('.stat-card');
    let streakCard = null;
    statCards.forEach(c => {
        if (c.textContent.includes('Day Streak')) {
            streakCard = c;
        }
    });

    if (!streakCard) return;

    streakCard.classList.add('animating');

    const rect = streakCard.getBoundingClientRect();
    const oldStreak = streakNumber - 1;

    const cardWidth = rect.width;
    const cardHeight = rect.height;
    card.style.width = cardWidth + 'px';
    card.style.height = cardHeight + 'px';

    numberContainer.innerHTML = `
        <div class="streak-number-big" style="transform: translateY(0); opacity: 1;">${oldStreak}</div>
    `;

    card.style.left = (rect.left + rect.width / 2) + 'px';
    card.style.top = (rect.top + rect.height / 2) + 'px';
    card.style.transform = 'translate(-50%, -50%) scale(1)';
    card.style.opacity = '1';

    celebration.style.display = 'flex';
    celebration.classList.add('active');

    setTimeout(() => {
        celebration.classList.add('show-bg');

        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        card.style.left = centerX + 'px';
        card.style.top = centerY + 'px';
        card.style.transform = 'translate(-50%, -50%) scale(1.15)';

        setTimeout(() => {
            numberContainer.innerHTML = `
                <div class="streak-number-big" style="transform: translateY(0); opacity: 0;">${oldStreak}</div>
                <div class="streak-number-big" style="transform: translateY(60px); opacity: 1;">${streakNumber}</div>
            `;

            setTimeout(() => {
                const numbers = numberContainer.querySelectorAll('.streak-number-big');
                numbers[0].style.transform = 'translateY(-60px)';
                numbers[0].style.opacity = '0';
                numbers[1].style.transform = 'translateY(0)';
                numbers[1].style.opacity = '1';
            }, 50);
        }, 800);

        setTimeout(() => {
            card.style.left = (rect.left + rect.width / 2) + 'px';
            card.style.top = (rect.top + rect.height / 2) + 'px';
            card.style.transform = 'translate(-50%, -50%) scale(1)';
            celebration.classList.remove('show-bg');

            setTimeout(() => {
                card.style.opacity = '0';

                setTimeout(() => {
                    celebration.classList.remove('active');
                    celebration.style.display = 'none';

                    streakCard.classList.remove('animating');

                    card.style.left = '';
                    card.style.top = '';
                    card.style.transform = '';
                    card.style.opacity = '';
                    card.style.width = '';
                    card.style.height = '';

                    updateDashboard();
                    renderCourses();
                }, 500);
            }, 800);
        }, 2500);

    }, 500);
}

// ENHANCED DETAILED STATS WITH GLASSMORPHISM

// Inject Enhanced CSS with Glassmorphism
function injectDetailedStatsCSS() {
    if (document.getElementById('detailedStatsCSS')) {
        document.getElementById('detailedStatsCSS').remove();
    }

    const style = document.createElement('style');
    style.id = 'detailedStatsCSS';
    style.textContent = `
#roadmapNavContainer {
display: none !important;
}
.roadmap-scroll-top-btn {
position: fixed;
top: 80px;
left: 50%;
transform: translateX(-50%);
width: 56px;
height: 56px;
background: transparent;
backdrop-filter: none;
-webkit-backdrop-filter: none;
border: 3px solid #64ffda;
width: 56px;
height: 56px;
background: rgba(100, 255, 218, 0.15);
backdrop-filter: blur(20px);
-webkit-backdrop-filter: blur(20px);
border: 2px solid rgba(100, 255, 218, 0.4);
border-radius: 50%;
color: #64ffda;
font-size: 1.5em;
cursor: pointer;
display: none;
align-items: center;
justify-content: center;
z-index: 1000;
transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
box-shadow: 0 8px 32px rgba(100, 255, 218, 0.2);
}
.roadmap-scroll-top-btn.show {
display: flex;
animation: bounceIn 0.6s ease;
}
.roadmap-scroll-top-btn:hover {
background: rgba(100, 255, 218, 0.25);
border-color: rgba(100, 255, 218, 0.6);
transform: translateX(-50%) translateY(-5px) scale(1.1);
box-shadow: 0 12px 40px rgba(100, 255, 218, 0.4);
}
.roadmap-scroll-top-btn:active {
transform: translateX(-50%) translateY(-3px) scale(1.05);
}
@keyframes bounceIn {
0% {
opacity: 0;
transform: scale(0.3) translateY(20px);
}
50% {
transform: scale(1.05) translateY(0);
}
100% {
opacity: 1;
transform: scale(1) translateY(0);
}
}
.stats-grid {
margin-bottom: 0 !important;
}
.stats-buttons-container {
display: flex;
gap: 12px;
flex-wrap: wrap;
margin: 0;
padding: 20px;
background: rgba(30, 30, 30, 0.6);
backdrop-filter: blur(20px);
-webkit-backdrop-filter: blur(20px);
border-radius: 16px;
border: 1px solid rgba(100, 255, 218, 0.2);
width: 100%;
box-sizing: border-box;
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
transition: all 0.4s ease;
}
.stats-buttons-container:hover {
border-color: rgba(100, 255, 218, 0.3);
box-shadow: 0 12px 40px rgba(100, 255, 218, 0.15);
}
.stat-toggle-btn {
display: flex;
align-items: center;
gap: 10px;
padding: 12px 24px;
background: rgba(100, 255, 218, 0.08);
backdrop-filter: blur(10px);
-webkit-backdrop-filter: blur(10px);
border: 2px solid rgba(100, 255, 218, 0.3);
border-radius: 50px;
color: #64ffda;
font-weight: 600;
font-size: 0.95em;
cursor: pointer;
transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
white-space: nowrap;
position: relative;
overflow: hidden;
}
.stat-toggle-btn::before {
content: '';
position: absolute;
top: 50%;
left: 50%;
width: 0;
height: 0;
border-radius: 50%;
background: rgba(100, 255, 218, 0.3);
transform: translate(-50%, -50%);
transition: width 0.6s ease, height 0.6s ease;
}
.stat-toggle-btn:hover::before {
width: 300px;
height: 300px;
}
.stat-toggle-btn:hover {
background: rgba(100, 255, 218, 0.15);
border-color: rgba(100, 255, 218, 0.6);
transform: translateY(-3px);
box-shadow: 0 8px 20px rgba(100, 255, 218, 0.4);
}
.stat-toggle-btn:active {
transform: translateY(-1px) scale(0.98);
}
.stat-btn-icon {
font-size: 1.3em;
position: relative;
z-index: 1;
filter: drop-shadow(0 2px 4px rgba(100, 255, 218, 0.3));
}
.stat-toggle-btn span {
position: relative;
z-index: 1;
}
.stats-back-btn {
display: none;
align-items: center;
gap: 10px;
padding: 12px 24px;
background: rgba(100, 255, 218, 0.12);
backdrop-filter: blur(20px);
-webkit-backdrop-filter: blur(20px);
border: 2px solid rgba(100, 255, 218, 0.5);
border-radius: 50px;
color: #64ffda;
font-weight: 700;
font-size: 1em;
cursor: pointer;
transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
margin-bottom: 20px;
width: fit-content;
box-shadow: 0 4px 16px rgba(100, 255, 218, 0.2);
}
.stats-back-btn:hover {
background: rgba(100, 255, 218, 0.2);
border-color: rgba(100, 255, 218, 0.7);
transform: translateX(-5px) scale(1.05);
box-shadow: 0 8px 24px rgba(100, 255, 218, 0.4);
}
.stats-back-btn:active {
transform: translateX(-3px) scale(1.02);
}
.stats-back-btn.show {
display: flex;
animation: slideInLeft 0.5s ease;
}
@keyframes slideInLeft {
from {
opacity: 0;
transform: translateX(-30px);
}
to {
opacity: 1;
transform: translateX(0);
}
}
#statDetailViews {
position: relative;
width: 100%;
min-height: 200px;
}
.stat-detail-view {
display: none;
opacity: 0;
transform: translateY(30px) scale(0.95);
transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
background: rgba(30, 30, 30, 0.6);
backdrop-filter: blur(20px);
-webkit-backdrop-filter: blur(20px);
border: 1px solid rgba(100, 255, 218, 0.2);
border-radius: 20px;
padding: 25px;
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}
.stat-detail-view.active {
display: block;
animation: slideUpFade 0.6s ease forwards;
}
@keyframes slideUpFade {
0% {
opacity: 0;
transform: translateY(30px) scale(0.95);
}
50% {
transform: translateY(-5px) scale(1.02);
}
100% {
opacity: 1;
transform: translateY(0) scale(1);
}
}
.stat-detail-header {
display: flex;
align-items: center;
gap: 15px;
margin-bottom: 25px;
padding-bottom: 20px;
border-bottom: 2px solid rgba(100, 255, 218, 0.3);
position: relative;
}
.stat-detail-header::after {
content: '';
position: absolute;
bottom: -2px;
left: 0;
width: 100px;
height: 2px;
background: linear-gradient(90deg, #64ffda, transparent);
animation: expandLine 0.8s ease;
}
@keyframes expandLine {
from { width: 0; }
to { width: 100px; }
}
.stat-detail-icon {
font-size: 2.8em;
filter: drop-shadow(0 4px 12px rgba(100, 255, 218, 0.5));
animation: float 3s ease-in-out infinite;
}
@keyframes float {
0%, 100% { transform: translateY(0px); }
50% { transform: translateY(-8px); }
}
.stat-detail-title {
font-size: 2em;
color: #fff;
font-weight: 700;
background: linear-gradient(135deg, #64ffda 0%, #667eea 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
text-shadow: 0 2px 10px rgba(100, 255, 218, 0.3);
}
.stat-detail-content {
display: flex;
flex-direction: column;
gap: 14px;
}
.language-item, .time-item, .metric-row, .activity-item {
background: rgba(100, 255, 218, 0.05);
backdrop-filter: blur(10px);
-webkit-backdrop-filter: blur(10px);
border: 1px solid rgba(100, 255, 218, 0.15);
transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.language-item:hover, .time-item:hover, .metric-row:hover, .activity-item:hover {
background: rgba(100, 255, 218, 0.12);
border-color: rgba(100, 255, 218, 0.4);
box-shadow: 0 8px 24px rgba(100, 255, 218, 0.2);
}
.language-item {
display: flex;
align-items: center;
justify-content: space-between;
padding: 16px 20px;
border-radius: 16px;
cursor: pointer;
}
.language-item:hover {
transform: translateX(5px);
}
.language-info {
display: flex;
align-items: center;
gap: 15px;
}
.language-icon {
font-size: 2em;
filter: drop-shadow(0 2px 8px rgba(100, 255, 218, 0.4));
}
.language-name {
font-weight: 700;
color: #fff;
font-size: 1.1em;
}
.language-stats {
display: flex;
flex-direction: column;
align-items: flex-end;
gap: 5px;
}
.language-progress {
font-size: 1.4em;
color: #64ffda;
font-weight: 800;
text-shadow: 0 0 15px rgba(100, 255, 218, 0.6);
}
.language-courses {
font-size: 0.9em;
color: #8b949e;
font-weight: 600;
}
.time-item {
display: flex;
justify-content: space-between;
align-items: center;
padding: 16px 20px;
border-radius: 14px;
border-left: 4px solid #64ffda;
}
.time-item:hover {
transform: translateX(5px);
border-left-width: 6px;
}
.time-label {
color: #fff;
font-weight: 600;
font-size: 1.05em;
}
.time-value {
color: #64ffda;
font-weight: 800;
font-size: 1.3em;
text-shadow: 0 0 12px rgba(100, 255, 218, 0.6);
}
.metric-row {
display: flex;
align-items: center;
gap: 18px;
padding: 16px 20px;
border-radius: 16px;
}
.metric-row:hover {
transform: scale(1.01);
}
.metric-icon {
font-size: 2.2em;
filter: drop-shadow(0 2px 10px rgba(100, 255, 218, 0.5));
}
.metric-info {
flex: 1;
display: flex;
justify-content: space-between;
align-items: center;
}
.metric-label {
color: #8b949e;
font-weight: 600;
font-size: 1em;
}
.metric-value {
color: #64ffda;
font-weight: 800;
font-size: 1.4em;
text-shadow: 0 0 12px rgba(100, 255, 218, 0.6);
}
.activity-item {
display: flex;
align-items: center;
gap: 18px;
padding: 16px 20px;
border-radius: 16px;
border-left: 4px solid #64ffda;
}
.activity-item:hover {
transform: translateX(5px);
}
.activity-icon {
font-size: 2em;
filter: drop-shadow(0 2px 8px rgba(100, 255, 218, 0.4));
}
.activity-details {
flex: 1;
}
.activity-title {
color: #fff;
font-weight: 700;
font-size: 1.1em;
margin-bottom: 5px;
}
.activity-date {
color: #8b949e;
font-size: 0.9em;
font-weight: 600;
}
.stat-detail-content {
max-height: 450px;
overflow-y: auto;
padding-right: 12px;
}
.stat-detail-content::-webkit-scrollbar {
width: 8px;
}
.stat-detail-content::-webkit-scrollbar-track {
background: rgba(100, 255, 218, 0.05);
border-radius: 10px;
}
.stat-detail-content::-webkit-scrollbar-thumb {
background: rgba(100, 255, 218, 0.3);
border-radius: 10px;
transition: all 0.3s ease;
}
.stat-detail-content::-webkit-scrollbar-thumb:hover {
background: rgba(100, 255, 218, 0.5);
}
.chart-container {
transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
opacity: 1;
transform: scale(1);
}
.chart-container.hide {
opacity: 0;
transform: scale(0.95) translateY(-20px);
height: 0;
overflow: hidden;
margin: 0;
padding: 0;
}
.goals-button-container {
display: flex;
justify-content: flex-end;
margin-top: 15px;
}
.goals-btn {
display: flex;
align-items: center;
gap: 8px;
padding: 10px 20px;
background: rgba(102, 126, 234, 0.1);
backdrop-filter: blur(10px);
-webkit-backdrop-filter: blur(10px);
border: 2px solid rgba(102, 126, 234, 0.3);
border-radius: 50px;
color: #667eea;
font-weight: 600;
font-size: 0.95em;
cursor: pointer;
transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
white-space: nowrap;
margin-left: auto;
}
.goals-btn:hover {
background: rgba(102, 126, 234, 0.2);
border-color: rgba(102, 126, 234, 0.6);
transform: translateY(-3px);
box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}
.goals-btn-icon {
font-size: 1.2em;
}
@media (max-width: 768px) {
.roadmap-scroll-top-btn {
bottom: 80px;
right: 20px;
width: 50px;
height: 50px;
font-size: 1.3em;
}
.stats-buttons-container {
gap: 10px;
padding: 15px;
}
.stat-toggle-btn {
padding: 10px 18px;
font-size: 0.85em;
}
.stat-detail-view {
padding: 20px;
}
.stat-detail-title {
font-size: 1.5em;
}
.stat-detail-icon {
font-size: 2.2em;
}
}
`;
    document.head.appendChild(style);
}

// Create Roadmap Scroll to Top Button
function createRoadmapScrollButton() {
    // Check if already exists
    if (document.getElementById('roadmapScrollTopBtn')) return;

    const btn = document.createElement('button');
    btn.id = 'roadmapScrollTopBtn';
    btn.className = 'roadmap-scroll-top-btn';
    btn.innerHTML = '↑';
    btn.onclick = scrollRoadmapToTop;

    document.body.appendChild(btn);
}

// Scroll roadmap to top
function scrollRoadmapToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Monitor roadmap scroll
function monitorRoadmapScroll() {
    const roadmapView = document.getElementById('roadmapView');
    const scrollBtn = document.getElementById('roadmapScrollTopBtn');

    if (!roadmapView || !scrollBtn) return;

    window.addEventListener('scroll', function() {
        // Only show button if on roadmap view
        if (roadmapView.classList.contains('active')) {
            if (window.scrollY > 400) {
                scrollBtn.classList.add('show');
            } else {
                scrollBtn.classList.remove('show');
            }
        } else {
            scrollBtn.classList.remove('show');
        }
    }, true);
}

function addStatsButtons() {
    // Check if buttons already exist
    if (document.getElementById('statsButtonsContainer')) {
        console.log('Buttons already exist, skipping creation');
        return;
    }

    // Find the progress section
    const progressSection = document.querySelector('.progress-section');
    if (!progressSection) return;

    // Find the chart tabs
    const chartTabs = progressSection.querySelector('.chart-tabs');
    if (!chartTabs) return;

    // ✅ Add transition to chart containers BEFORE inserting buttons
    const allChartContainers = document.querySelectorAll('.chart-container');
    allChartContainers.forEach(container => {
        container.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
    });

    // Create buttons container
    const buttonsContainer = document.createElement('div');
    buttonsContainer.id = 'statsButtonsContainer';
    buttonsContainer.className = 'stats-buttons-container';

    // ✅ Start with 0 height and hidden
    buttonsContainer.style.cssText = `
        opacity: 0;
        transform: translateY(-20px);
        max-height: 0;
        overflow: hidden;
        transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
    `;

    buttonsContainer.innerHTML = `
    <div style="display: flex; flex: 1; gap: 12px; flex-wrap: wrap; padding: 20px; transition: all 0.4s ease;">
        <button class="stat-toggle-btn stat-btn-animate" style="opacity: 0; transform: translateX(-30px);" onclick="showStatDetail('time')">
            <span class="stat-btn-icon">⏱️</span>
            <span>Time Breakdown</span>
        </button>
        <button class="stat-toggle-btn stat-btn-animate" style="opacity: 0; transform: translateX(-30px);" onclick="showStatDetail('activity')">
            <span class="stat-btn-icon">📅</span>
            <span>Recent Activity</span>
        </button>
        <button class="stat-toggle-btn stat-btn-animate" style="opacity: 0; transform: translateX(-30px);" onclick="showStatDetail('performance')">
            <span class="stat-btn-icon">🎯</span>
            <span>Performance</span>
        </button>
    </div>
    `;

    // Insert after chart tabs
    chartTabs.parentNode.insertBefore(buttonsContainer, chartTabs.nextSibling);

    // ✅ Measure the natural height
    buttonsContainer.style.maxHeight = 'none';
    buttonsContainer.style.position = 'absolute';
    buttonsContainer.style.visibility = 'hidden';
    const naturalHeight = buttonsContainer.scrollHeight;
    buttonsContainer.style.position = '';
    buttonsContainer.style.visibility = '';
    buttonsContainer.style.maxHeight = '0';

    // ✅ Animate container expanding
    setTimeout(() => {
        buttonsContainer.style.maxHeight = naturalHeight + 'px';
        buttonsContainer.style.opacity = '1';
        buttonsContainer.style.transform = 'translateY(0)';
    }, 100);

    // ✅ After expansion, set to auto for responsiveness
    setTimeout(() => {
        buttonsContainer.style.maxHeight = 'none';
    }, 700);

    // Animate buttons in one by one
    const buttons = buttonsContainer.querySelectorAll('.stat-btn-animate');
    buttons.forEach((btn, index) => {
        setTimeout(() => {
            btn.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
            btn.style.opacity = '1';
            btn.style.transform = 'translateX(0)';
        }, 300 + (index * 100)); // Stagger by 100ms
    });

    // Create detail views
    createDetailViews();

    // Make chart tabs clickable to go back
    makeChartTabsClickable();
}

// Find where you have the goals button and update addGoalsButton function:
function addGoalsButton(chartTabs) {
    // Check if already exists
    if (document.getElementById('goalsButtonContainer')) return;

    const goalsContainer = document.createElement('div');
    goalsContainer.id = 'goalsButtonContainer';
    goalsContainer.className = 'goals-button-container';
    goalsContainer.style.cssText = `
        display: flex;
        gap: 10px;
        align-items: center;
    `;

    // Set Goals Button
    const setGoalsBtn = document.createElement('button');
    setGoalsBtn.className = 'goals-btn';
    setGoalsBtn.onclick = openGoals;
    setGoalsBtn.style.cssText = `
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 20px;
        background: rgba(102, 126, 234, 0.1);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 2px solid rgba(102, 126, 234, 0.3);
        border-radius: 50px;
        color: #667eea;
        font-weight: 600;
        font-size: 0.95em;
        cursor: pointer;
        transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        white-space: nowrap;
    `;
    setGoalsBtn.innerHTML = '<span style="font-size: 1.2em;">🎯</span><span>Set Goals</span>';

    setGoalsBtn.onmouseenter = function() {
        this.style.background = 'rgba(102, 126, 234, 0.2)';
        this.style.borderColor = 'rgba(102, 126, 234, 0.6)';
        this.style.transform = 'translateY(-3px)';
        this.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.4)';
    };

    setGoalsBtn.onmouseleave = function() {
        this.style.background = 'rgba(102, 126, 234, 0.1)';
        this.style.borderColor = 'rgba(102, 126, 234, 0.3)';
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = 'none';
    };

    // View Goals Button (initially hidden)
const viewGoalsBtn = document.createElement('button');
viewGoalsBtn.id = 'viewGoalsBtn';
viewGoalsBtn.onclick = openViewGoals;
viewGoalsBtn.style.cssText = `
    display: none;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    background: linear-gradient(135deg, rgba(100, 255, 218, 0.15), rgba(100, 255, 218, 0.08));
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 2px solid rgba(100, 255, 218, 0.3);
    border-radius: 50px;
    color: #64ffda;
    font-weight: 600;
    font-size: 0.95em;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    white-space: nowrap;
    box-shadow: 0 4px 12px rgba(100, 255, 218, 0.2);
    opacity: 0;
    transform: scale(0.8) translateX(-20px);
`;
    viewGoalsBtn.innerHTML = '<span style="font-size: 1.2em;">👁️</span><span>View Goals</span>';

    viewGoalsBtn.onmouseenter = function() {
        this.style.background = 'rgba(100, 255, 218, 0.2)';
        this.style.borderColor = 'rgba(100, 255, 218, 0.6)';
        this.style.transform = 'translateY(-3px)';
        this.style.boxShadow = '0 8px 20px rgba(100, 255, 218, 0.4)';
    };

    viewGoalsBtn.onmouseleave = function() {
        this.style.background = 'rgba(100, 255, 218, 0.1)';
        this.style.borderColor = 'rgba(100, 255, 218, 0.3)';
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = 'none';
    };

    goalsContainer.appendChild(setGoalsBtn);
    goalsContainer.appendChild(viewGoalsBtn);

    // Insert after chart tabs
    chartTabs.parentNode.insertBefore(goalsContainer, chartTabs.nextSibling);

    // Check if goals exist and show view button
    checkAndShowViewGoalsButton();
}

function checkAndShowViewGoalsButton() {
    const viewBtn = document.getElementById('viewGoalsBtn');
    const allGoals = JSON.parse(localStorage.getItem('allUserGoals_' + currentUser) || '[]');

    console.log('Checking view button - Goals found:', allGoals.length);

    if (!viewBtn) {
        console.warn('View button not found - recreating');
        initializeGoalsButtons();
        return;
    }

    if (allGoals.length > 0) {
        viewBtn.style.display = 'flex';
        setTimeout(() => {
            viewBtn.style.opacity = '1';
            viewBtn.style.transform = 'scale(1)';
        }, 50);
        console.log('View button shown');
    } else {
        viewBtn.style.opacity = '0';
        viewBtn.style.transform = 'scale(0.8)';
        setTimeout(() => {
            viewBtn.style.display = 'none';
        }, 300);
        console.log('View button hidden');
    }
}

function openGoals() {
    // Lock scroll FIRST
    lockScroll();

    // Create modal if it doesn't exist
    let modal = document.getElementById('goalsModal');
    if (!modal) {
        modal = createGoalsModal();
    }

    // Load saved goals
    loadSavedGoals();

    // Show modal with animation
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('active');
        modal.style.opacity = '1';
        const content = modal.querySelector('.goals-modal-content');
        if (content) {
            content.style.transform = 'scale(1) translateY(0)';
        }
    }, 10);
}

function initializeGoalsButtons() {
    // Find the chart tabs in stats section
    const chartTabs = document.querySelector('.chart-tabs');
    if (!chartTabs) {
        console.log('Chart tabs not found');
        return;
    }

    // Remove existing goals container if it exists
    const existingContainer = document.getElementById('goalsButtonContainer');
    if (existingContainer) {
        existingContainer.remove();
    }

    // Create new goals container
    const goalsContainer = document.createElement('div');
    goalsContainer.id = 'goalsButtonContainer';
    goalsContainer.style.cssText = `
        display: flex;
        gap: 10px;
        align-items: center;
        justify-content: flex-end;
        margin-top: 15px;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
    `;

    // View Goals Button (initially hidden)
const viewGoalsBtn = document.createElement('button');
viewGoalsBtn.id = 'viewGoalsBtn';
viewGoalsBtn.onclick = openViewGoals;
viewGoalsBtn.style.cssText = `
    display: none;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    background: linear-gradient(135deg, rgba(100, 255, 218, 0.15), rgba(100, 255, 218, 0.08));
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 2px solid rgba(100, 255, 218, 0.3);
    border-radius: 50px;
    color: #64ffda;
    font-weight: 600;
    font-size: 0.95em;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    white-space: nowrap;
    box-shadow: 0 4px 12px rgba(100, 255, 218, 0.2);
    opacity: 0;
    transform: scale(0.8) translateX(-20px);
`;
    viewGoalsBtn.innerHTML = '<span style="font-size: 1.2em;">👁️</span><span>View Goals</span>';

    viewGoalsBtn.onmouseenter = function() {
        this.style.background = 'linear-gradient(135deg, rgba(100, 255, 218, 0.25), rgba(100, 255, 218, 0.15))';
        this.style.borderColor = 'rgba(100, 255, 218, 0.6)';
        this.style.transform = 'translateY(-3px) scale(1) translateX(0)';
        this.style.boxShadow = '0 8px 20px rgba(100, 255, 218, 0.4)';
    };

    viewGoalsBtn.onmouseleave = function() {
        this.style.background = 'linear-gradient(135deg, rgba(100, 255, 218, 0.15), rgba(100, 255, 218, 0.08))';
        this.style.borderColor = 'rgba(100, 255, 218, 0.3)';
        this.style.transform = 'translateY(0) scale(1) translateX(0)';
        this.style.boxShadow = '0 4px 12px rgba(100, 255, 218, 0.2)';
    };

    // Set Goals Button
    const setGoalsBtn = document.createElement('button');
    setGoalsBtn.id = 'setGoalsBtn';
    setGoalsBtn.onclick = openGoals;
    setGoalsBtn.style.cssText = `
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 24px;
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.15), rgba(102, 126, 234, 0.08));
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 2px solid rgba(102, 126, 234, 0.3);
        border-radius: 50px;
        color: #667eea;
        font-weight: 600;
        font-size: 0.95em;
        cursor: pointer;
        transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        white-space: nowrap;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
        opacity: 0;
        transform: scale(0.8) translateX(20px);
    `;
    setGoalsBtn.innerHTML = '<span style="font-size: 1.2em;">🎯</span><span>Set Goals</span>';

    setGoalsBtn.onmouseenter = function() {
        this.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.25), rgba(102, 126, 234, 0.15))';
        this.style.borderColor = 'rgba(102, 126, 234, 0.6)';
        this.style.transform = 'translateY(-3px) scale(1) translateX(0)';
        this.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.4)';
    };

    setGoalsBtn.onmouseleave = function() {
        this.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.15), rgba(102, 126, 234, 0.08))';
        this.style.borderColor = 'rgba(102, 126, 234, 0.3)';
        this.style.transform = 'translateY(0) scale(1) translateX(0)';
        this.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.2)';
    };

    // Add buttons to container
    goalsContainer.appendChild(viewGoalsBtn);
    goalsContainer.appendChild(setGoalsBtn);

    // Insert after chart tabs
    chartTabs.parentNode.insertBefore(goalsContainer, chartTabs.nextSibling);

    // Animate container in
    setTimeout(() => {
        goalsContainer.style.opacity = '1';
        goalsContainer.style.transform = 'translateY(0)';

        // Animate Set Goals button
        setTimeout(() => {
            setGoalsBtn.style.opacity = '1';
            setGoalsBtn.style.transform = 'scale(1) translateX(0)';
        }, 100);
    }, 300);

    // Check if goals exist and show view button with animation
    setTimeout(() => {
        checkAndShowViewGoalsButton();
    }, 500);
}

function createGoalsModal() {
    const modal = document.createElement('div');
    modal.id = 'goalsModal';
    modal.className = 'goals-modal';
    modal.style.cssText = `
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.85);
        backdrop-filter: blur(10px);
        z-index: 10000;
        justify-content: center;
        align-items: center;
        opacity: 0;
        transition: opacity 0.3s ease;
        overflow-y: auto;
        padding: 20px;
    `;

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeGoalsModal();
        }
    });

    const content = document.createElement('div');
    content.className = 'goals-modal-content';
    content.style.cssText = `
        background: rgba(30, 30, 30, 0.98);
        backdrop-filter: blur(20px);
        border: 2px solid rgba(100, 255, 218, 0.3);
        border-radius: 20px;
        padding: 35px;
        max-width: 600px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        transform: scale(0.9) translateY(20px);
        transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        box-shadow: 0 20px 60px rgba(100, 255, 218, 0.3);
        margin: auto;
    `;

    content.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    const langIcons = {
        python: '🐍',
        javascript: '⚡',
        html: '🌐',
        css: '🎨',
        react: '⚛️'
    };

    content.innerHTML = `
        <!-- Header (Now part of scrollable content) -->
        <div style="margin-bottom: 30px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                <div>
                    <h2 style="color: #fff; margin: 0 0 10px 0; font-size: 1.6em; font-weight: 700;">
                        🎯 Daily Learning Goal
                    </h2>
                    <p style="color: #8b949e; margin: 0; font-size: 0.95em;">Set your personalized learning target</p>
                </div>
                <button onclick="closeGoalsModal()" style="background: none; border: none; color: #8b949e; font-size: 1.8em; cursor: pointer; padding: 0; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: all 0.3s ease; line-height: 1;">×</button>
            </div>
        </div>

        <!-- Step 1: Reminder Schedule -->
        <div style="margin-bottom: 40px;">
            <div style="margin-bottom: 20px;">
                <h3 style="color: #fff; margin: 0; font-size: 1.15em; font-weight: 600;">📅 When should we remind you?</h3>
                <p style="color: #8b949e; margin: 10px 0 0 0; font-size: 0.92em; line-height: 1.5;">Choose a weekday or specific time for your learning session</p>
            </div>

            <!-- Weekday Dropdown -->
            <div style="margin-bottom: 18px;">
                <label style="display: block; color: #64ffda; font-size: 0.9em; font-weight: 500; margin-bottom: 8px;">Choose a Weekday</label>
                <div class="custom-dropdown" id="weekdayDropdown" onclick="toggleCustomDropdown('weekday')">
                    <div class="dropdown-selected">
                        <span id="selectedWeekday">Select a day...</span>
                        <span class="dropdown-arrow">▼</span>
                    </div>
                    <div class="dropdown-options" id="weekdayOptions">
                        <div class="dropdown-option" onclick="selectWeekday(event, 'monday', 'Monday')">📅 Monday</div>
                        <div class="dropdown-option" onclick="selectWeekday(event, 'tuesday', 'Tuesday')">📅 Tuesday</div>
                        <div class="dropdown-option" onclick="selectWeekday(event, 'wednesday', 'Wednesday')">📅 Wednesday</div>
                        <div class="dropdown-option" onclick="selectWeekday(event, 'thursday', 'Thursday')">📅 Thursday</div>
                        <div class="dropdown-option" onclick="selectWeekday(event, 'friday', 'Friday')">📅 Friday</div>
                        <div class="dropdown-option" onclick="selectWeekday(event, 'saturday', 'Saturday')">📅 Saturday</div>
                        <div class="dropdown-option" onclick="selectWeekday(event, 'sunday', 'Sunday')">📅 Sunday</div>
                    </div>
                </div>
                <div style="margin-top: 8px; font-size: 0.85em; color: #8b949e;">
                    💡 We'll remind you 1 day before via email
                </div>
            </div>

            <!-- Time Dropdown -->
            <div style="margin-bottom: 15px;">
                <label style="display: block; color: #667eea; font-size: 0.9em; font-weight: 500; margin-bottom: 8px;">Or Choose a Specific Time</label>
                <div class="custom-dropdown" id="timeDropdown" onclick="toggleCustomDropdown('time')">
                    <div class="dropdown-selected">
                        <span id="selectedTime">Select a time...</span>
                        <span class="dropdown-arrow">▼</span>
                    </div>
                    <div class="dropdown-options" id="timeOptions">
                        <!-- Time options will be generated dynamically -->
                    </div>
                </div>
                <div id="timeEmailMessage" style="margin-top: 8px; font-size: 0.85em; color: #8b949e;">
                    ⏰ We'll remind you 5-10 minutes early
                </div>
                <div id="courseTimeMessage" style="margin-top: 8px; font-size: 0.85em; color: #64ffda; display: none;">
                    📧 We'll email you based on your course duration and chosen time
                </div>
                <div id="timeWarning" style="margin-top: 8px; font-size: 0.85em; color: #ff6b6b; display: none;">
                    ⚠️ Please choose a future time
                </div>
            </div>

            <!-- Custom Time Goal Input -->
            <div style="margin-top: 20px;">
                <label style="display: block; color: #64ffda; font-size: 0.95em; font-weight: 600; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 1.3em;">⏱️</span>
                    <span>Daily Time Goal (minutes)</span>
                </label>
                <div style="position: relative;">
                    <input type="number" id="dailyTimeGoal" value="60" min="1" max="999"
                        style="
                            width: 100%;
                            padding: 16px 20px;
                            background: linear-gradient(135deg, rgba(100, 255, 218, 0.08), rgba(102, 126, 234, 0.08));
                            border: 2px solid rgba(100, 255, 218, 0.3);
                            border-radius: 15px;
                            color: #fff;
                            font-size: 1.1em;
                            font-weight: 600;
                            text-align: center;
                            outline: none;
                            transition: all 0.3s ease;
                            box-shadow: 0 4px 15px rgba(100, 255, 218, 0.1);
                        "
                        onfocus="this.style.borderColor='rgba(100, 255, 218, 0.6)'; this.style.background='linear-gradient(135deg, rgba(100, 255, 218, 0.15), rgba(102, 126, 234, 0.15))'; this.style.boxShadow='0 6px 20px rgba(100, 255, 218, 0.2)';"
                        onblur="this.style.borderColor='rgba(100, 255, 218, 0.3)'; this.style.background='linear-gradient(135deg, rgba(100, 255, 218, 0.08), rgba(102, 126, 234, 0.08))'; this.style.boxShadow='0 4px 15px rgba(100, 255, 218, 0.1)';"
                        placeholder="Enter minutes (e.g., 30, 60, 90)"
                    >
                    <div style="margin-top: 10px; display: flex; gap: 8px; flex-wrap: wrap; justify-content: center;">
                        <button type="button" onclick="document.getElementById('dailyTimeGoal').value = 15; document.getElementById('dailyTimeGoal').focus();"
                            style="padding: 8px 16px; background: rgba(100, 255, 218, 0.1); border: 1px solid rgba(100, 255, 218, 0.3); border-radius: 20px; color: #64ffda; font-size: 0.85em; font-weight: 600; cursor: pointer; transition: all 0.3s ease;"
                            onmouseenter="this.style.background='rgba(100, 255, 218, 0.2)'; this.style.borderColor='rgba(100, 255, 218, 0.5)'; this.style.transform='translateY(-2px)';"
                            onmouseleave="this.style.background='rgba(100, 255, 218, 0.1)'; this.style.borderColor='rgba(100, 255, 218, 0.3)'; this.style.transform='translateY(0)';">
                            15 min
                        </button>
                        <button type="button" onclick="document.getElementById('dailyTimeGoal').value = 30; document.getElementById('dailyTimeGoal').focus();"
                            style="padding: 8px 16px; background: rgba(100, 255, 218, 0.1); border: 1px solid rgba(100, 255, 218, 0.3); border-radius: 20px; color: #64ffda; font-size: 0.85em; font-weight: 600; cursor: pointer; transition: all 0.3s ease;"
                            onmouseenter="this.style.background='rgba(100, 255, 218, 0.2)'; this.style.borderColor='rgba(100, 255, 218, 0.5)'; this.style.transform='translateY(-2px)';"
                            onmouseleave="this.style.background='rgba(100, 255, 218, 0.1)'; this.style.borderColor='rgba(100, 255, 218, 0.3)'; this.style.transform='translateY(0)';">
                            30 min
                        </button>
                        <button type="button" onclick="document.getElementById('dailyTimeGoal').value = 60; document.getElementById('dailyTimeGoal').focus();"
                            style="padding: 8px 16px; background: rgba(100, 255, 218, 0.1); border: 1px solid rgba(100, 255, 218, 0.3); border-radius: 20px; color: #64ffda; font-size: 0.85em; font-weight: 600; cursor: pointer; transition: all 0.3s ease;"
                            onmouseenter="this.style.background='rgba(100, 255, 218, 0.2)'; this.style.borderColor='rgba(100, 255, 218, 0.5)'; this.style.transform='translateY(-2px)';"
                            onmouseleave="this.style.background='rgba(100, 255, 218, 0.1)'; this.style.borderColor='rgba(100, 255, 218, 0.3)'; this.style.transform='translateY(0)';">
                            60 min
                        </button>
                        <button type="button" onclick="document.getElementById('dailyTimeGoal').value = 90; document.getElementById('dailyTimeGoal').focus();"
                            style="padding: 8px 16px; background: rgba(100, 255, 218, 0.1); border: 1px solid rgba(100, 255, 218, 0.3); border-radius: 20px; color: #64ffda; font-size: 0.85em; font-weight: 600; cursor: pointer; transition: all 0.3s ease;"
                            onmouseenter="this.style.background='rgba(100, 255, 218, 0.2)'; this.style.borderColor='rgba(100, 255, 218, 0.5)'; this.style.transform='translateY(-2px)';"
                            onmouseleave="this.style.background='rgba(100, 255, 218, 0.1)'; this.style.borderColor='rgba(100, 255, 218, 0.3)'; this.style.transform='translateY(0)';">
                            90 min
                        </button>
                        <button type="button" onclick="document.getElementById('dailyTimeGoal').value = 120; document.getElementById('dailyTimeGoal').focus();"
                            style="padding: 8px 16px; background: rgba(100, 255, 218, 0.1); border: 1px solid rgba(100, 255, 218, 0.3); border-radius: 20px; color: #64ffda; font-size: 0.85em; font-weight: 600; cursor: pointer; transition: all 0.3s ease;"
                            onmouseenter="this.style.background='rgba(100, 255, 218, 0.2)'; this.style.borderColor='rgba(100, 255, 218, 0.5)'; this.style.transform='translateY(-2px)';"
                            onmouseleave="this.style.background='rgba(100, 255, 218, 0.1)'; this.style.borderColor='rgba(100, 255, 218, 0.3)'; this.style.transform='translateY(0)';">
                            120 min
                        </button>
                    </div>
                    <div style="margin-top: 10px; font-size: 0.85em; color: #8b949e; text-align: center;">
                        💡 Quick select or enter your own custom time
                    </div>
                </div>
            </div>
        </div>

        <!-- Step 2: Language Selection -->
        <div id="languageSelectionScreen" style="margin-bottom: 35px; transition: opacity 0.3s ease;">
            <div style="margin-bottom: 18px;">
                <h3 style="color: #fff; margin: 0; font-size: 1.1em; font-weight: 600;">🎯 Choose a language to add courses</h3>
            </div>

            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
                ${Object.keys(courses).map(lang => {
                    const availableCount = courses[lang].filter((c, idx) => {
                        const isNew = c.isNew;
                        const isCompleted = userProgress[lang][c.id]?.completed;
                        const isLocked = idx > 0 && !userProgress[lang][courses[lang][idx - 1].id]?.completed;
                        return !isNew && !isCompleted && !isLocked;
                    }).length;

                    if (availableCount === 0) return '';

                    return `
                        <button onclick="showCourseSelection('${lang}')" style="padding: 20px; background: rgba(100, 255, 218, 0.05); border: 2px solid rgba(100, 255, 218, 0.2); border-radius: 12px; cursor: pointer; transition: all 0.3s ease; display: flex; flex-direction: column; align-items: center; gap: 10px;"
                                onmouseenter="this.style.background='rgba(100, 255, 218, 0.1)'; this.style.borderColor='rgba(100, 255, 218, 0.4)'; this.style.transform='translateY(-2px)'"
                                onmouseleave="this.style.background='rgba(100, 255, 218, 0.05)'; this.style.borderColor='rgba(100, 255, 218, 0.2)'; this.style.transform='translateY(0)'">
                            <span style="font-size: 2.8em;">${langIcons[lang]}</span>
                            <span style="color: #fff; font-weight: 600; font-size: 1em;">${lang.charAt(0).toUpperCase() + lang.slice(1)}</span>
                            <span style="color: #64ffda; font-size: 0.9em; font-weight: 500;">${availableCount} available</span>
                        </button>
                    `;
                }).join('')}
            </div>
        </div>

        <!-- Course Selection Screen (Hidden Initially) -->
        <div id="courseSelectionScreen" style="display: none; margin-bottom: 35px; opacity: 0; transition: opacity 0.3s ease;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 18px;">
                <button onclick="backToLanguageSelection()" style="background: rgba(100, 255, 218, 0.1); border: 2px solid rgba(100, 255, 218, 0.2); color: #64ffda; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 1.3em; transition: all 0.3s ease;"
                        onmouseenter="this.style.background='rgba(100, 255, 218, 0.2)'"
                        onmouseleave="this.style.background='rgba(100, 255, 218, 0.1)'">
                    ←
                </button>
                <h3 id="courseSelectionTitle" style="color: #fff; margin: 0; font-size: 1.1em; font-weight: 600;">Select Courses</h3>
            </div>

            <div id="coursesList" style="display: flex; flex-direction: column; gap: 10px; padding: 18px; background: rgba(100, 255, 218, 0.03); border: 2px solid rgba(100, 255, 218, 0.15); border-radius: 12px; max-height: 320px; overflow-y: auto;">
                <!-- Courses will be populated here -->
            </div>
        </div>

        <!-- Selected Courses Summary -->
        <div id="selectedCoursesSummary" style="
            display: none;
            margin-bottom: 30px;
            padding: 18px;
            background: rgba(100, 255, 218, 0.08);
            border: 2px solid rgba(100, 255, 218, 0.25);
            border-radius: 15px;
            animation: slideIn 0.3s ease;
        ">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                <span style="color: #64ffda; font-weight: 600; font-size: 0.95em;">
                    ✓ Selected Courses
                </span>
                <span id="selectedCoursesCount" style="
                    background: rgba(100, 255, 218, 0.2);
                    color: #64ffda;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-weight: 700;
                    font-size: 0.9em;
                ">0</span>
            </div>
            <div id="selectedCoursesList" style="
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
            "></div>
        </div>

        <!-- Settings -->
        <div style="margin-bottom: 30px;">
            <div style="margin-bottom: 18px;">
                <h3 style="color: #fff; margin: 0; font-size: 1.1em; font-weight: 600;">⚙️ Additional settings</h3>
            </div>

            <!-- Streak -->
            <div style="padding: 16px; background: rgba(100, 255, 218, 0.05); border: 1px solid rgba(100, 255, 218, 0.15); border-radius: 10px; margin-bottom: 12px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <span style="font-size: 1.5em;">🔥</span>
                        <span style="color: #fff; font-weight: 500; font-size: 1em;">Count towards streak</span>
                    </div>
                    <div class="modern-toggle" id="streakToggle" onclick="toggleModernSwitch('dailyStreak')" style="width: 56px; height: 30px; background: #64ffda; border-radius: 30px; position: relative; cursor: pointer; transition: 0.3s; box-shadow: 0 3px 10px rgba(100, 255, 218, 0.3);">
                        <input type="checkbox" id="dailyStreak" checked style="display: none;">
                        <div class="toggle-circle" style="position: absolute; height: 24px; width: 24px; left: 3px; top: 3px; background: white; border-radius: 50%; transition: 0.3s; transform: translateX(26px); box-shadow: 0 2px 6px rgba(0,0,0,0.2);"></div>
                    </div>
                </div>
                <div id="streakStatusMessage" style="font-size: 0.9em; color: #64ffda; line-height: 1.5;">
                    Goal courses will add to your learning streak
                </div>
            </div>

            <!-- Email -->
            <div style="padding: 16px; background: rgba(102, 126, 234, 0.08); border: 1px solid rgba(102, 126, 234, 0.2); border-radius: 10px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <span style="font-size: 1.5em;">📧</span>
                        <span style="color: #fff; font-weight: 500; font-size: 1em;">Send me reminders</span>
                    </div>
                    <div class="modern-toggle" id="emailToggle" onclick="toggleModernSwitch('emailNotifications')" style="width: 56px; height: 30px; background: #667eea; border-radius: 30px; position: relative; cursor: pointer; transition: 0.3s; box-shadow: 0 3px 10px rgba(102, 126, 234, 0.3);">
                        <input type="checkbox" id="emailNotifications" checked style="display: none;">
                        <div class="toggle-circle" style="position: absolute; height: 24px; width: 24px; left: 3px; top: 3px; background: white; border-radius: 50%; transition: 0.3s; transform: translateX(26px); box-shadow: 0 2px 6px rgba(0,0,0,0.2);"></div>
                    </div>
                </div>
                <div id="emailStatusMessage" style="font-size: 0.9em; color: #667eea; line-height: 1.5;">
                    We'll email you if you're falling behind
                </div>
            </div>
        </div>

        <!-- Save Button -->
        <button onclick="saveGoalsWithCourses()" style="width: 100%; padding: 16px; background: linear-gradient(135deg, #667eea 0%, #64ffda 100%); border: none; border-radius: 12px; color: #fff; font-weight: 700; font-size: 1.1em; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(100, 255, 218, 0.3);">
            💾 Save My Goal
        </button>
    `;

    // Add scrollbar hiding CSS
    const style = document.createElement('style');
    style.textContent = `
.goals-modal-content::-webkit-scrollbar {
width: 6px;
}
.goals-modal-content::-webkit-scrollbar-track {
background: rgba(100, 255, 218, 0.05);
border-radius: 10px;
}
.goals-modal-content::-webkit-scrollbar-thumb {
background: rgba(100, 255, 218, 0.3);
border-radius: 10px;
}
#coursesList::-webkit-scrollbar {
width: 6px;
}
#coursesList::-webkit-scrollbar-track {
background: rgba(100, 255, 218, 0.05);
border-radius: 10px;
}
#coursesList::-webkit-scrollbar-thumb {
background: rgba(100, 255, 218, 0.3);
border-radius: 10px;
}
.custom-dropdown {
position: relative;
width: 100%;
cursor: pointer;
user-select: none;
}
.dropdown-selected {
display: flex;
justify-content: space-between;
align-items: center;
padding: 14px 18px;
background: rgba(100, 255, 218, 0.05);
border: 2px solid rgba(100, 255, 218, 0.2);
border-radius: 12px;
color: #fff;
font-size: 1em;
font-weight: 500;
transition: all 0.3s ease;
}
.custom-dropdown:hover .dropdown-selected {
background: rgba(100, 255, 218, 0.1);
border-color: rgba(100, 255, 218, 0.4);
}
.custom-dropdown.active .dropdown-selected {
border-color: rgba(100, 255, 218, 0.5);
background: rgba(100, 255, 218, 0.15);
}
.dropdown-arrow {
font-size: 0.8em;
transition: transform 0.3s ease;
color: #64ffda;
}
.custom-dropdown.active .dropdown-arrow {
transform: rotate(180deg);
}
.dropdown-options {
position: absolute;
top: calc(100% + 8px);
left: 0;
right: 0;
background: rgba(30, 30, 30, 0.98);
backdrop-filter: blur(20px);
border: 2px solid rgba(100, 255, 218, 0.3);
border-radius: 12px;
max-height: 0;
overflow: hidden;
opacity: 0;
transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
z-index: 1000;
box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}
.custom-dropdown.active .dropdown-options {
max-height: 300px;
opacity: 1;
overflow-y: auto;
}
.dropdown-options::-webkit-scrollbar {
width: 6px;
}
.dropdown-options::-webkit-scrollbar-track {
background: rgba(100, 255, 218, 0.05);
border-radius: 10px;
}
.dropdown-options::-webkit-scrollbar-thumb {
background: rgba(100, 255, 218, 0.3);
border-radius: 10px;
}
.dropdown-option {
padding: 12px 18px;
color: #fff;
font-size: 0.95em;
transition: all 0.2s ease;
cursor: pointer;
border-bottom: 1px solid rgba(100, 255, 218, 0.1);
}
.dropdown-option:last-child {
border-bottom: none;
}
.dropdown-option:hover {
background: rgba(100, 255, 218, 0.15);
color: #64ffda;
padding-left: 24px;
}
.dropdown-option.selected {
background: rgba(100, 255, 218, 0.2);
color: #64ffda;
font-weight: 600;
}
body.light-mode .dropdown-selected {
background: rgba(100, 255, 218, 0.1);
border-color: rgba(100, 255, 218, 0.3);
color: #000;
}
body.light-mode .dropdown-options {
background: rgba(255, 255, 255, 0.98);
border-color: rgba(100, 255, 218, 0.4);
}
body.light-mode .dropdown-option {
color: #000;
border-bottom: 1px solid rgba(100, 255, 218, 0.15);
}
`;
    document.head.appendChild(style);

    modal.appendChild(content);
    document.body.appendChild(modal);

    // Add event listener for close button after modal is created
    setTimeout(() => {
        const closeBtn = content.querySelector('button[onclick*="closeGoalsModal"]');
        if (closeBtn) {
            // Remove inline onclick and use proper event listener
            closeBtn.removeAttribute('onclick');
            closeBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                closeGoalsModal();
            });
        }
    }, 100);

    return modal;
}

function adjustTaskCount(delta) {
    const input = document.getElementById('taskCountGoal');
    const warning = document.getElementById('taskCountWarning');
    let newValue = parseInt(input.value) + delta;

    // Get max available courses
    const maxCourses = tempSelectedCourses.length || 10;

    if (newValue < 1) newValue = 1;
    if (newValue > maxCourses) {
        newValue = maxCourses;
        warning.textContent = `Maximum ${maxCourses} courses available in your selection`;
        warning.style.display = 'block';
        setTimeout(() => {
            warning.style.display = 'none';
        }, 3000);
    } else {
        warning.style.display = 'none';
    }

    input.value = newValue;
}

// Store selected reminder data
let selectedWeekdayValue = null;
let selectedTimeValue = null;

// Dropdown handling functions
function toggleCustomDropdown(type) {
    event.stopPropagation();
    const dropdown = type === 'weekday' ? document.getElementById('weekdayDropdown') : document.getElementById('timeDropdown');
    const otherDropdown = type === 'weekday' ? document.getElementById('timeDropdown') : document.getElementById('weekdayDropdown');

    // Close other dropdown
    if (otherDropdown) {
        otherDropdown.classList.remove('active');
    }

    // Toggle current dropdown
    dropdown.classList.toggle('active');

    // Generate time options if opening time dropdown for first time
    if (type === 'time' && !document.getElementById('timeOptions').hasChildNodes.length) {
        generateTimeOptions();
    }
}

function selectWeekday(event, value, display) {
    event.stopPropagation();

    // Clear time selection
    selectedTimeValue = null;
    document.getElementById('selectedTime').textContent = 'Select a time...';
    document.getElementById('timeWarning').style.display = 'none';

    // Remove all previous selections
    document.querySelectorAll('#weekdayOptions .dropdown-option').forEach(opt => {
        opt.classList.remove('selected');
    });

    // Mark as selected
    event.target.classList.add('selected');
    selectedWeekdayValue = value;
    document.getElementById('selectedWeekday').textContent = display;
    document.getElementById('weekdayDropdown').classList.remove('active');

    console.log('Selected weekday:', value);
}

function generateTimeOptions() {
    const timeOptions = document.getElementById('timeOptions');
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    let optionsHTML = '';

    // Generate time slots from current time onwards
    for (let hour = currentHour; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
            // Skip past times for current hour
            if (hour === currentHour && minute <= currentMinute) {
                continue;
            }

            const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            const displayTime = formatTime12Hour(hour, minute);

            optionsHTML += `<div class="dropdown-option" onclick="selectTime(event, '${timeStr}', '${displayTime}')">⏰ ${displayTime}</div>`;
        }
    }

    if (optionsHTML === '') {
        optionsHTML = '<div class="dropdown-option" style="color: #ff6b6b; cursor: default;">No future times available today</div>';
    }

    timeOptions.innerHTML = optionsHTML;
}

function formatTime12Hour(hour, minute) {
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`;
}

function selectTime(event, value, display) {
    event.stopPropagation();

    // Clear weekday selection
    selectedWeekdayValue = null;
    document.getElementById('selectedWeekday').textContent = 'Select a day...';
    document.querySelectorAll('#weekdayOptions .dropdown-option').forEach(opt => {
        opt.classList.remove('selected');
    });

    // Validate time is in future
    const now = new Date();
    const [hours, minutes] = value.split(':').map(Number);
    const selectedTime = new Date();
    selectedTime.setHours(hours, minutes, 0, 0);

    if (selectedTime <= now) {
        document.getElementById('timeWarning').style.display = 'block';
        return;
    }

    document.getElementById('timeWarning').style.display = 'none';

    // Remove all previous selections
    document.querySelectorAll('#timeOptions .dropdown-option').forEach(opt => {
        opt.classList.remove('selected');
    });

    // Mark as selected
    event.target.classList.add('selected');
    selectedTimeValue = value;
    document.getElementById('selectedTime').textContent = display;
    document.getElementById('timeDropdown').classList.remove('active');

    console.log('Selected time:', value);
}

// Close dropdowns when clicking outside
document.addEventListener('click', function(e) {
    const weekdayDropdown = document.getElementById('weekdayDropdown');
    const timeDropdown = document.getElementById('timeDropdown');

    if (weekdayDropdown && !weekdayDropdown.contains(e.target)) {
        weekdayDropdown.classList.remove('active');
    }

    if (timeDropdown && !timeDropdown.contains(e.target)) {
        timeDropdown.classList.remove('active');
    }
});

// Store selected courses temporarily
let tempSelectedCourses = [];

function showCourseSelection(lang) {
    const langScreen = document.getElementById('languageSelectionScreen');
    const courseScreen = document.getElementById('courseSelectionScreen');
    const courseTitle = document.getElementById('courseSelectionTitle');
    const coursesList = document.getElementById('coursesList');

    const langIcons = {
        python: '🐍',
        javascript: '⚡',
        html: '🌐',
        css: '🎨',
        react: '⚛️'
    };

    // Update title
    courseTitle.innerHTML = `${langIcons[lang]} ${lang.charAt(0).toUpperCase() + lang.slice(1)} Courses`;

    // ✅ Get ALL courses (not just available ones)
    const allCourses = courses[lang];

    // Group courses by status
    const unlockedCourses = [];
    const lockedCourses = [];

    allCourses.forEach((course, idx) => {
        const isNew = course.isNew;
        const isCompleted = userProgress[lang][course.id]?.completed;
        const isLocked = idx > 0 && !userProgress[lang][courses[lang][idx - 1].id]?.completed;

        if (isNew) return; // Skip "coming soon" courses

        if (isCompleted || isLocked) {
            lockedCourses.push({ course, idx, isCompleted, isLocked });
        } else {
            unlockedCourses.push({ course, idx });
        }
    });

    // Populate courses with better styling
    coursesList.innerHTML = `
        ${unlockedCourses.length > 0 ? `
            <div style="margin-bottom: 20px;">
                <div style="color: #64ffda; font-weight: 600; font-size: 0.95em; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                    <span>✓</span>
                    <span>Available Courses (${unlockedCourses.length})</span>
                </div>
                ${unlockedCourses.map(({ course, idx }) => {
                    const isSelected = tempSelectedCourses.some(c => c.lang === lang && c.courseId === course.id);

                    return `
                        <label class="enhanced-course-item ${isSelected ? 'selected' : ''}" style="
                            display: flex;
                            align-items: center;
                            gap: 12px;
                            padding: 16px;
                            background: ${isSelected ? 'rgba(100, 255, 218, 0.12)' : 'rgba(100, 255, 218, 0.05)'};
                            border: 2px solid ${isSelected ? 'rgba(100, 255, 218, 0.4)' : 'rgba(100, 255, 218, 0.15)'};
                            border-radius: 12px;
                            cursor: pointer;
                            transition: all 0.3s ease;
                            margin-bottom: 10px;
                        "
                           onmouseenter="if(!this.querySelector('input').checked) { this.style.background='rgba(100, 255, 218, 0.08)'; this.style.borderColor='rgba(100, 255, 218, 0.25)'; this.style.transform='translateX(5px)'; }"
                           onmouseleave="if(!this.querySelector('input').checked) { this.style.background='rgba(100, 255, 218, 0.05)'; this.style.borderColor='rgba(100, 255, 218, 0.15)'; this.style.transform='translateX(0)'; }">
                            <input type="checkbox" class="temp-course-checkbox" data-lang="${lang}" data-course="${course.id}" ${isSelected ? 'checked' : ''}
                                   onchange="handleCourseSelection('${lang}', '${course.id}', this)"
                                   style="width: 22px; height: 22px; cursor: pointer; accent-color: #64ffda;">
                            <span style="font-size: 1.8em; filter: drop-shadow(0 2px 6px rgba(100, 255, 218, 0.4));">${course.icon}</span>
                            <div style="flex: 1;">
                                <div style="color: #fff; font-weight: 700; font-size: 1em; margin-bottom: 4px;">${course.title}</div>
                                <div style="color: #8b949e; font-size: 0.85em;">${course.desc}</div>
                            </div>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <span style="background: rgba(100, 255, 218, 0.15); color: #64ffda; padding: 4px 10px; border-radius: 12px; font-size: 0.8em; font-weight: 600;">⏱️ 15 min</span>
                            </div>
                        </label>
                    `;
                }).join('')}
            </div>
        ` : ''}

        ${lockedCourses.length > 0 ? `
            <div>
                <div style="color: #ff6b6b; font-weight: 600; font-size: 0.95em; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                    <span>🔒</span>
                    <span>Locked/Completed (${lockedCourses.length})</span>
                </div>
                ${lockedCourses.map(({ course, idx, isCompleted, isLocked }) => {
                    return `
                        <div class="enhanced-course-item locked" style="
                            display: flex;
                            align-items: center;
                            gap: 12px;
                            padding: 16px;
                            background: rgba(139, 148, 158, 0.05);
                            border: 2px solid rgba(139, 148, 158, 0.15);
                            border-radius: 12px;
                            opacity: 0.6;
                            margin-bottom: 10px;
                        ">
                            <input type="checkbox" disabled style="width: 22px; height: 22px; cursor: not-allowed; opacity: 0.5;">
                            <span style="font-size: 1.8em; filter: grayscale(80%);">${course.icon}</span>
                            <div style="flex: 1;">
                                <div style="color: #8b949e; font-weight: 700; font-size: 1em; margin-bottom: 4px;">${course.title}</div>
                                <div style="color: #5a6169; font-size: 0.85em;">${course.desc}</div>
                            </div>
                            <span style="background: ${isCompleted ? 'rgba(100, 255, 218, 0.1)' : 'rgba(255, 107, 107, 0.1)'}; color: ${isCompleted ? '#64ffda' : '#ff6b6b'}; padding: 4px 10px; border-radius: 12px; font-size: 0.8em; font-weight: 600;">
                                ${isCompleted ? '✓ Done' : '🔒 Locked'}
                            </span>
                        </div>
                    `;
                }).join('')}
            </div>
        ` : ''}
    `;

    // Fade transition
    langScreen.style.opacity = '0';

    setTimeout(() => {
        langScreen.style.display = 'none';
        courseScreen.style.display = 'block';

        setTimeout(() => {
            courseScreen.style.opacity = '1';
        }, 50);
    }, 300);
}

function backToLanguageSelection() {
    const langScreen = document.getElementById('languageSelectionScreen');
    const courseScreen = document.getElementById('courseSelectionScreen');

    // Fade transition
    courseScreen.style.opacity = '0';

    setTimeout(() => {
        courseScreen.style.display = 'none';
        langScreen.style.display = 'block';

        setTimeout(() => {
            langScreen.style.opacity = '1';
        }, 50);

        // Update summary
        updateSelectedCoursesSummary();
    }, 300);
}

function handleCourseSelection(lang, courseId, checkbox) {
    const label = checkbox.closest('label');

    if (checkbox.checked) {
        // Add to temp selection
        if (!tempSelectedCourses.some(c => c.lang === lang && c.courseId === courseId)) {
            tempSelectedCourses.push({ lang, courseId });
        }
        label.style.background = 'rgba(100, 255, 218, 0.12)';
        label.style.borderColor = 'rgba(100, 255, 218, 0.4)';
    } else {
        // Remove from temp selection
        tempSelectedCourses = tempSelectedCourses.filter(c => !(c.lang === lang && c.courseId === courseId));
        label.style.background = 'rgba(100, 255, 218, 0.05)';
        label.style.borderColor = 'rgba(100, 255, 218, 0.15)';
    }

    // Update count in real-time
    updateSelectedCoursesCountInline();
}

function updateSelectedCoursesCountInline() {
    const summary = document.getElementById('selectedCoursesSummary');
    const countEl = document.getElementById('selectedCoursesCount');
    const listEl = document.getElementById('selectedCoursesList');

    if (!summary || !countEl || !listEl) return;

    if (tempSelectedCourses.length === 0) {
        summary.style.display = 'none';
        return;
    }

    summary.style.display = 'block';
    countEl.textContent = tempSelectedCourses.length;

    const langIcons = {
        python: '🐍',
        javascript: '⚡',
        html: '🌐',
        css: '🎨',
        react: '⚛️'
    };

    // Show oval badges
    listEl.innerHTML = tempSelectedCourses.map(selected => {
        const course = courses[selected.lang].find(c => c.id === selected.courseId);
        return `
            <div style="
                display: inline-flex;
                align-items: center;
                gap: 6px;
                padding: 8px 14px;
                background: rgba(100, 255, 218, 0.15);
                border: 2px solid rgba(100, 255, 218, 0.3);
                border-radius: 25px;
                font-size: 0.85em;
                transition: all 0.3s ease;
            " onmouseenter="this.style.background='rgba(100, 255, 218, 0.25)'; this.style.transform='scale(1.05)'" onmouseleave="this.style.background='rgba(100, 255, 218, 0.15)'; this.style.transform='scale(1)'">
                <span>${course.icon}</span>
                <span style="color: #fff; font-weight: 600;">${course.title}</span>
                <button onclick="removeCourseFromSelection('${selected.lang}', '${selected.courseId}')" style="
                    background: none;
                    border: none;
                    color: #ff6b6b;
                    cursor: pointer;
                    padding: 0;
                    margin-left: 4px;
                    font-size: 1.1em;
                    line-height: 1;
                    transition: transform 0.2s ease;
                " onmouseenter="this.style.transform='scale(1.3)'" onmouseleave="this.style.transform='scale(1)'">×</button>
            </div>
        `;
    }).join('');
}

function updateSelectedCoursesSummary() {
    updateSelectedCoursesCountInline();
}

function removeCourseFromSelection(lang, courseId) {
    tempSelectedCourses = tempSelectedCourses.filter(c => !(c.lang === lang && c.courseId === courseId));

    // Update checkbox if on that screen
    const checkbox = document.querySelector(`.temp-course-checkbox[data-lang="${lang}"][data-course="${courseId}"]`);
    if (checkbox) {
        checkbox.checked = false;
        const label = checkbox.closest('label');
        label.style.background = 'rgba(100, 255, 218, 0.05)';
        label.style.borderColor = 'rgba(100, 255, 218, 0.15)';
    }

    updateSelectedCoursesSummary();
}

function updateSelectedCoursesCount() {
    const selected = document.querySelectorAll('.course-checkbox:checked').length;
    const countEl = document.getElementById('selectedCoursesCount');
    if (countEl) {
        if (selected === 0) {
            countEl.textContent = 'No courses selected';
            countEl.style.background = 'rgba(102, 126, 234, 0.1)';
            countEl.style.color = '#667eea';
        } else if (selected === 1) {
            countEl.textContent = '1 course selected ✓';
            countEl.style.background = 'rgba(100, 255, 218, 0.15)';
            countEl.style.color = '#64ffda';
        } else {
            countEl.textContent = `${selected} courses selected ✓`;
            countEl.style.background = 'rgba(100, 255, 218, 0.15)';
            countEl.style.color = '#64ffda';
        }
    }
}

function toggleModernSwitch(id) {
    const checkbox = document.getElementById(id);
    const toggle = checkbox.closest('.modern-toggle');
    const circle = toggle.querySelector('.toggle-circle');

    checkbox.checked = !checkbox.checked;

    if (checkbox.checked) {
        circle.style.transform = 'translateX(26px)';
        toggle.style.background = '#64ffda'; // Only streak uses this now
        toggle.style.boxShadow = '0 3px 10px rgba(100, 255, 218, 0.3)';
    } else {
        circle.style.transform = 'translateX(0)';
        toggle.style.background = '#8b949e';
        toggle.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1)';
    }

    // ✅ Only update streak status message (removed email case)
    if (id === 'dailyStreak') {
        const streakMessage = document.getElementById('streakStatusMessage');
        if (streakMessage) {
            if (checkbox.checked) {
                streakMessage.textContent = "Goal courses will add to your learning streak";
                streakMessage.style.color = '#64ffda';
            } else {
                streakMessage.textContent = "Goal courses won't affect your streak";
                streakMessage.style.color = '#8b949e';
            }
        }
    }
}

function switchGoalTab(tab) {
    // Update buttons
    document.querySelectorAll('.goal-tab').forEach(btn => {
        const isActive = btn.dataset.tab === tab;
        btn.style.background = isActive ? 'rgba(100, 255, 218, 0.2)' : 'rgba(100, 255, 218, 0.05)';
        btn.style.borderColor = isActive ? 'rgba(100, 255, 218, 0.5)' : 'rgba(100, 255, 218, 0.2)';
    });

    // Update sections
    document.getElementById('dailyGoals').style.display = tab === 'daily' ? 'block' : 'none';
    document.getElementById('weeklyGoals').style.display = tab === 'weekly' ? 'block' : 'none';
}

function saveGoalsWithCourses() {
    if (tempSelectedCourses.length === 0) {
        showNotification('⚠️ Please select at least one course!', 'warning');
        return;
    }

    // Validate reminder selection
    if (!selectedWeekdayValue && !selectedTimeValue) {
        showNotification('⚠️ Please select either a weekday or a time for reminders!', 'warning');
        return;
    }

    const timeGoal = parseInt(document.getElementById('dailyTimeGoal').value) || 60;
    const estimatedTimePerCourse = 15;
    const totalEstimatedTime = tempSelectedCourses.length * estimatedTimePerCourse;
    const emailReminderThreshold = Math.floor(timeGoal * 0.7);

    const goalId = 'goal_' + Date.now();

    const newGoal = {
        id: goalId,
        createdAt: new Date().toISOString(),
        daily: {
            selectedCourses: [...tempSelectedCourses],
            timeGoal: timeGoal,
            estimatedTime: totalEstimatedTime,
            streak: document.getElementById('dailyStreak').checked,
            emailReminderThreshold: emailReminderThreshold
        },
        reminder: {
            type: selectedWeekdayValue ? 'weekday' : 'time',
            weekday: selectedWeekdayValue,
            time: selectedTimeValue
        },
        emailNotifications: document.getElementById('emailNotifications').checked,
        startDate: new Date().toISOString(),
        startTime: Date.now(),
        completed: 0,
        total: tempSelectedCourses.length
    };

    const allGoals = JSON.parse(localStorage.getItem('allUserGoals_' + currentUser) || '[]');
    allGoals.push(newGoal);
    localStorage.setItem('allUserGoals_' + currentUser, JSON.stringify(allGoals));

    localStorage.setItem('userGoals_' + currentUser, JSON.stringify(newGoal));
    localStorage.setItem('activeGoalId_' + currentUser, goalId);

    // Reset timer and email flag for NEW goal
    localStorage.setItem('goalStartTime_' + currentUser, Date.now().toString());
    localStorage.setItem('coursesCompletedToday_' + currentUser, '0');

    // Clear any previous email sent flag
    const oldGoalId = localStorage.getItem('activeGoalId_' + currentUser);
    if (oldGoalId) {
        localStorage.removeItem('goalEmailSent_' + currentUser + '_' + oldGoalId);
    }

    // Schedule reminder
    if (selectedWeekdayValue) {
        scheduleWeekdayReminder(selectedWeekdayValue, newGoal);
        showNotification(`✅ Goal saved! We'll remind you 1 day before ${selectedWeekdayValue}`, 'success');
    } else if (selectedTimeValue) {
        scheduleTimeReminder(selectedTimeValue, newGoal);
        const [hours, minutes] = selectedTimeValue.split(':');
        const displayTime = formatTime12Hour(parseInt(hours), parseInt(minutes));
        showNotification(`✅ Goal saved! We'll remind you 5-10 min before ${displayTime}`, 'success');
    }

    // Reset selections
    tempSelectedCourses = [];
    selectedWeekdayValue = null;
    selectedTimeValue = null;
    closeGoalsModal();

    setTimeout(() => {
        const statsSection = document.getElementById('stats');
        if (statsSection && statsSection.classList.contains('active')) {
            initializeGoalsButtons();
        }
    }, 400);

    // Always start monitoring
    startSmartGoalMonitoring();
}

// Reminder scheduling functions
function scheduleWeekdayReminder(weekday, goal) {
    const weekdayMap = {
        'monday': 1, 'tuesday': 2, 'wednesday': 3,
        'thursday': 4, 'friday': 5, 'saturday': 6, 'sunday': 0
    };

    const targetDay = weekdayMap[weekday.toLowerCase()];
    const today = new Date();
    const currentDay = today.getDay();

    // Calculate days until target weekday
    let daysUntilTarget = targetDay - currentDay;
    if (daysUntilTarget <= 0) {
        daysUntilTarget += 7; // Next week
    }

    // Calculate reminder date (1 day before target)
    const reminderDate = new Date(today);
    reminderDate.setDate(today.getDate() + daysUntilTarget - 1);
    reminderDate.setHours(9, 0, 0, 0); // Set reminder for 9 AM

    console.log(`Weekday reminder scheduled for ${reminderDate.toLocaleString()}`);

    // Store reminder info
    const reminderData = {
        type: 'weekday',
        targetDate: reminderDate.toISOString(),
        weekday: weekday,
        goalId: goal.id
    };

    localStorage.setItem('activeReminder_' + currentUser, JSON.stringify(reminderData));

    // Set up interval to check for reminder
    const checkInterval = setInterval(() => {
        const now = new Date();
        const stored = localStorage.getItem('activeReminder_' + currentUser);

        if (!stored) {
            clearInterval(checkInterval);
            return;
        }

        const reminder = JSON.parse(stored);
        const targetTime = new Date(reminder.targetDate);

        // Check if it's time to send reminder
        if (now >= targetTime && now < new Date(targetTime.getTime() + 3600000)) { // Within 1 hour window
            sendWeekdayReminder(reminder, goal);
            clearInterval(checkInterval);
        }
    }, 60000); // Check every minute
}

function scheduleTimeReminder(time, goal) {
    const [hours, minutes] = time.split(':').map(Number);
    const targetTime = new Date();
    targetTime.setHours(hours, minutes, 0, 0);

    // Calculate reminder time (5-10 minutes before)
    const randomMinutes = Math.floor(Math.random() * 6) + 5; // Random 5-10 minutes
    const reminderTime = new Date(targetTime.getTime() - randomMinutes * 60000);

    console.log(`Time reminder scheduled for ${reminderTime.toLocaleString()} (${randomMinutes} min before target)`);

    // Store reminder info
    const reminderData = {
        type: 'time',
        targetTime: reminderTime.toISOString(),
        originalTime: time,
        minutesBefore: randomMinutes,
        goalId: goal.id
    };

    localStorage.setItem('activeReminder_' + currentUser, JSON.stringify(reminderData));

    // Set up interval to check for reminder
    const checkInterval = setInterval(() => {
        const now = new Date();
        const stored = localStorage.getItem('activeReminder_' + currentUser);

        if (!stored) {
            clearInterval(checkInterval);
            return;
        }

        const reminder = JSON.parse(stored);
        const targetTime = new Date(reminder.targetTime);

        // Check if it's time to send reminder
        if (now >= targetTime && now < new Date(targetTime.getTime() + 60000)) { // Within 1 minute window
            sendTimeReminder(reminder, goal);
            clearInterval(checkInterval);
        }
    }, 30000); // Check every 30 seconds
}

function sendWeekdayReminder(reminder, goal) {
    // Browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Learning Reminder 📚', {
            body: `Don't forget! Tomorrow is ${reminder.weekday}. Time to work on your learning goals!`,
            icon: '/favicon.ico'
        });
    }

    // In-app notification
    showNotification(`🎯 Reminder: Tomorrow is ${reminder.weekday}! Don't forget your learning goal.`, 'info');

    // Send email if enabled
    const goals = JSON.parse(localStorage.getItem('userGoals_' + currentUser) || '{}');
    if (goals.emailNotifications) {
        sendGoalReminderEmail(goal, 'weekday', reminder.weekday);
    }

    // Clear reminder
    localStorage.removeItem('activeReminder_' + currentUser);
}

function sendTimeReminder(reminder, goal) {
    const [hours, minutes] = reminder.originalTime.split(':').map(Number);
    const displayTime = formatTime12Hour(hours, minutes);

    // Browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Learning Reminder 📚', {
            body: `Your learning session starts at ${displayTime} (in ${reminder.minutesBefore} minutes)!`,
            icon: '/favicon.ico'
        });
    }

    // In-app notification
    showNotification(`⏰ Reminder: Your learning session starts at ${displayTime} (in ${reminder.minutesBefore} minutes)!`, 'info');

    // Clear reminder
    localStorage.removeItem('activeReminder_' + currentUser);
}

function sendGoalReminderEmail(goal, type, value) {
    // Get user email from localStorage
    const userEmail = localStorage.getItem('userEmail_' + currentUser);
    if (!userEmail) {
        console.warn('No email found for user');
        return;
    }

    const courseList = goal.daily.selectedCourses.map(c => c.title).join(', ');
    const message = type === 'weekday'
        ? `Don't forget! Tomorrow is ${value}. You have ${goal.total} courses to complete: ${courseList}`
        : `Your learning session is coming up! You have ${goal.total} courses to complete: ${courseList}`;

    // Send email using emailjs
    if (typeof emailjs !== 'undefined') {
        emailjs.send(EMAIL_CONFIG.serviceId, EMAIL_CONFIG.templateId, {
            to_email: userEmail,
            to_name: currentUser,
            subject: 'Learning Goal Reminder',
            message: message
        }).then(
            () => console.log('Reminder email sent successfully'),
            (error) => console.error('Failed to send reminder email:', error)
        );
    }
}

function loadSavedGoals() {
    const saved = localStorage.getItem('userGoals_' + currentUser);
    if (saved) {
        const goals = JSON.parse(saved);

        // Set time goal
        if (document.getElementById('dailyTimeGoal')) {
            document.getElementById('dailyTimeGoal').value = goals.daily.timeGoal || 60;
        }

        // ✅ REMOVED: reminder time loading

        // Set streak checkbox
        if (document.getElementById('dailyStreak')) {
            document.getElementById('dailyStreak').checked = goals.daily.streak;
            updateToggleVisualState('dailyStreak', goals.daily.streak);
        }

        // Load selected courses into temp
        if (goals.daily.selectedCourses) {
            tempSelectedCourses = [...goals.daily.selectedCourses];
            setTimeout(() => {
                updateSelectedCoursesSummary();
            }, 200);
        }
    }
}

function updateToggleVisualState(id, isChecked) {
    const checkbox = document.getElementById(id);
    if (!checkbox) return;

    const toggle = checkbox.closest('.modern-toggle');
    const circle = toggle.querySelector('.toggle-circle');

    if (isChecked) {
        circle.style.transform = 'translateX(26px)';
        toggle.style.background = '#64ffda'; // Only for streak
        toggle.style.boxShadow = '0 3px 10px rgba(100, 255, 218, 0.3)';
    } else {
        circle.style.transform = 'translateX(0)';
        toggle.style.background = '#8b949e';
        toggle.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1)';
    }

    // ✅ Only handle streak (removed email case)
    if (id === 'dailyStreak') {
        const streakMessage = document.getElementById('streakStatusMessage');
        if (streakMessage) {
            if (isChecked) {
                streakMessage.textContent = "Goal courses will add to your learning streak";
                streakMessage.style.color = '#64ffda';
            } else {
                streakMessage.textContent = "Goal courses won't affect your streak";
                streakMessage.style.color = '#8b949e';
            }
        }
    }
}

function openViewGoals() {
    const allGoals = JSON.parse(localStorage.getItem('allUserGoals_' + currentUser) || '[]');
    if (allGoals.length === 0) {
        showNotification('No goals set yet!', 'info');
        return;
    }

    // Remove any existing modal first
    const existingModal = document.getElementById('viewGoalsModal');
    if (existingModal) {
        existingModal.remove();
        unlockScroll();
    }

    // Lock scroll AFTER cleanup
    lockScroll();

    const modal = document.createElement('div');
    modal.id = 'viewGoalsModal';
    modal.style.cssText = `
        display: flex;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.85);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        z-index: 10000;
        justify-content: center;
        align-items: center;
        opacity: 0;
        transition: opacity 0.3s ease;
        padding: 20px;
    `;

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeViewGoalsModal();
        }
    });

    const content = document.createElement('div');
    content.style.cssText = `
        background: rgba(30, 30, 30, 0.98);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 2px solid rgba(100, 255, 218, 0.3);
        border-radius: 20px;
        padding: 0;
        max-width: 550px;
        width: 100%;
        max-height: 90vh;
        display: flex;
        flex-direction: column;
        transform: scale(0.9);
        transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1);
        box-shadow: 0 20px 60px rgba(100, 255, 218, 0.3);
        margin: auto;
        overflow: hidden;
    `;

    content.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    const langIcons = { python: '🐍', javascript: '⚡', html: '🌐', css: '🎨', react: '⚛️' };

    // Selection state
    let selectionMode = false;
    let selectedGoals = new Set();

    // Generate rectangle buttons for goals
    function generateGoalButtons() {
        const buttonsHTML = allGoals.map((goal, index) => {
            const startTime = parseInt(goal.startTime || Date.now());
            const goalDate = new Date(startTime);
            const completed = parseInt(goal.completed || 0);
            const progress = goal.daily.selectedCourses.length > 0 ? Math.round((completed / goal.daily.selectedCourses.length) * 100) : 0;
            const isSelected = selectedGoals.has(index);

            return `
                <div class="goal-button-card" data-index="${index}" style="
                    padding: 20px;
                    background: linear-gradient(135deg, rgba(100, 255, 218, 0.1), rgba(102, 126, 234, 0.1));
                    border: 2px solid ${isSelected ? 'rgba(100, 255, 218, 0.8)' : 'rgba(100, 255, 218, 0.3)'};
                    border-radius: 15px;
                    cursor: pointer;
                    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                    margin-bottom: 15px;
                    position: relative;
                    ${isSelected ? 'box-shadow: 0 0 20px rgba(100, 255, 218, 0.4);' : ''}
                ">
                    ${selectionMode ? `
                        <div class="goal-checkbox" data-index="${index}" style="
                            position: absolute;
                            top: 15px;
                            right: 15px;
                            width: 28px;
                            height: 28px;
                            border: 2px solid #64ffda;
                            border-radius: 8px;
                            background: ${isSelected ? '#64ffda' : 'rgba(0,0,0,0.3)'};
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            transition: all 0.3s ease;
                            z-index: 10;
                            cursor: pointer;
                        ">
                            ${isSelected ? '<span style="color: #000; font-size: 1.2em; font-weight: 700;">✓</span>' : ''}
                        </div>
                    ` : ''}
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                        <div style="font-size: 1.2em; color: #64ffda; font-weight: 700;">Goal #${index + 1}</div>
                        <div style="font-size: 2em;">${progress === 100 ? '🎉' : '📊'}</div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                        <div style="flex: 1;">
                            <div style="background: rgba(0,0,0,0.3); height: 8px; border-radius: 8px; overflow: hidden;">
                                <div style="height: 100%; background: linear-gradient(90deg, #667eea, #64ffda); width: ${progress}%; transition: width 0.5s ease;"></div>
                            </div>
                        </div>
                        <div style="color: #64ffda; font-weight: 700; font-size: 1.1em; min-width: 50px; text-align: right;">${progress}%</div>
                    </div>
                    <div style="display: flex; justify-content: space-between; color: #8b949e; font-size: 0.9em;">
                        <span>⏱️ ${goal.daily.timeGoal} min goal</span>
                        <span>📚 ${goal.daily.selectedCourses.length} courses</span>
                        <span>📅 ${goalDate.toLocaleDateString()}</span>
                    </div>
                </div>
            `;
        }).join('');

        return `
            <div style="padding: 30px 30px 20px 30px; border-bottom: 2px solid rgba(100, 255, 218, 0.2); flex-shrink: 0;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <h2 style="color: #fff; margin: 0; font-size: 1.6em; display: flex; align-items: center; gap: 10px;">
                        👁️ Your Goals
                        <span style="font-size: 0.6em; color: #8b949e;">(${allGoals.length} total)</span>
                    </h2>
                    <button id="closeViewGoalsBtn" style="background: none; border: none; color: #64ffda; font-size: 2em; cursor: pointer; padding: 0; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: all 0.3s ease;">×</button>
                </div>
                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                    <button id="toggleSelectBtn" style="
                        flex: 1;
                        min-width: 120px;
                        padding: 12px 20px;
                        background: ${selectionMode ? 'rgba(255, 107, 107, 0.15)' : 'rgba(102, 126, 234, 0.15)'};
                        border: 2px solid ${selectionMode ? 'rgba(255, 107, 107, 0.3)' : 'rgba(102, 126, 234, 0.3)'};
                        border-radius: 12px;
                        color: ${selectionMode ? '#ff6b6b' : '#667eea'};
                        font-weight: 600;
                        font-size: 0.95em;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    ">
                        ${selectionMode ? '✖️ Cancel' : '☑️ Select'}
                    </button>
                    ${selectionMode ? `
                        <button id="deleteSelectedBtn" style="
                            flex: 1;
                            min-width: 120px;
                            padding: 12px 20px;
                            background: rgba(255, 107, 107, 0.15);
                            border: 2px solid rgba(255, 107, 107, 0.3);
                            border-radius: 12px;
                            color: #ff6b6b;
                            font-weight: 600;
                            font-size: 0.95em;
                            cursor: pointer;
                            transition: all 0.3s ease;
                            ${selectedGoals.size === 0 ? 'opacity: 0.5; cursor: not-allowed;' : ''}
                        " ${selectedGoals.size === 0 ? 'disabled' : ''}>
                            🗑️ Delete (${selectedGoals.size})
                        </button>
                    ` : ''}
                    <button id="deleteAllBtn" style="
                        flex: 1;
                        min-width: 120px;
                        padding: 12px 20px;
                        background: rgba(255, 107, 107, 0.15);
                        border: 2px solid rgba(255, 107, 107, 0.3);
                        border-radius: 12px;
                        color: #ff6b6b;
                        font-weight: 600;
                        font-size: 0.95em;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    ">
                        🗑️ Delete All
                    </button>
                </div>
            </div>
            <div style="flex: 1; overflow-y: auto; padding: 20px;">
                ${buttonsHTML}
            </div>
        `;
    }

    // Generate full goal details view
    function generateGoalDetail(index) {
        const goal = allGoals[index];
        const startTime = parseInt(goal.startTime || Date.now());
        const goalDate = new Date(startTime);
        const elapsed = Math.floor((Date.now() - startTime) / 60000);
        const completed = parseInt(goal.completed || 0);
        const remaining = goal.daily.selectedCourses.length - completed;
        const progress = goal.daily.selectedCourses.length > 0 ? Math.round((completed / goal.daily.selectedCourses.length) * 100) : 0;

        return `
            <div style="padding: 30px 30px 20px 30px; border-bottom: 2px solid rgba(100, 255, 218, 0.2); flex-shrink: 0;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <button id="backToGoalsBtn" style="background: rgba(100, 255, 218, 0.1); border: 2px solid rgba(100, 255, 218, 0.3); color: #64ffda; padding: 10px 20px; border-radius: 25px; cursor: pointer; font-weight: 600; transition: all 0.3s ease;">
                        ← Back
                    </button>
                    <h2 style="color: #fff; margin: 0; font-size: 1.4em;">Goal #${index + 1}</h2>
                    <button id="closeViewGoalsBtn" style="background: none; border: none; color: #64ffda; font-size: 2em; cursor: pointer; padding: 0; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: all 0.3s ease;">×</button>
                </div>
            </div>
            <div style="flex: 1; overflow-y: auto; padding: 25px;">
                <div style="text-align: center; margin-bottom: 20px; padding: 10px; background: rgba(100, 255, 218, 0.1); border-radius: 10px;">
                    <div style="color: #8b949e; font-size: 0.85em; margin-top: 5px;">Set on ${goalDate.toLocaleDateString()}</div>
                </div>

                <div style="margin-bottom: 20px; padding: 20px; background: linear-gradient(135deg, rgba(102, 126, 234, 0.15), rgba(100, 255, 218, 0.15)); border: 2px solid rgba(100, 255, 218, 0.3); border-radius: 15px;">
                    <div style="text-align: center; margin-bottom: 15px;">
                        <div style="font-size: 3em; margin-bottom: 10px;">${progress === 100 ? '🎉' : '📊'}</div>
                        <div style="font-size: 2.5em; font-weight: 700; color: #64ffda; margin-bottom: 5px;">${progress}%</div>
                        <div style="color: #8b949e; font-weight: 600; font-size: 1em;">Daily Progress</div>
                    </div>
                    <div style="background: rgba(0,0,0,0.3); height: 12px; border-radius: 12px; overflow: hidden; margin-bottom: 15px;">
                        <div style="height: 100%; background: linear-gradient(90deg, #667eea, #64ffda); width: ${progress}%; transition: width 0.5s ease;"></div>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; text-align: center;">
                        <div>
                            <div style="font-size: 1.8em; color: #64ffda; font-weight: 700;">${completed}</div>
                            <div style="font-size: 0.85em; color: #8b949e;">Completed</div>
                        </div>
                        <div>
                            <div style="font-size: 1.8em; color: #667eea; font-weight: 700;">${remaining}</div>
                            <div style="font-size: 0.85em; color: #8b949e;">Remaining</div>
                        </div>
                        <div>
                            <div style="font-size: 1.8em; color: #ffc107; font-weight: 700;">${elapsed}</div>
                            <div style="font-size: 0.85em; color: #8b949e;">Minutes</div>
                        </div>
                    </div>
                </div>

                <div style="margin-bottom: 15px; padding: 15px; background: rgba(100, 255, 218, 0.05); border-radius: 12px;">
                    <div style="display: flex; align-items: center; gap: 10px; color: #fff; font-weight: 600; margin-bottom: 8px;">
                        <span style="font-size: 1.3em;">⏱️</span>
                        <span style="font-size: 1em;">Time Goal</span>
                    </div>
                    <div style="color: #64ffda; font-size: 1.3em; font-weight: 700;">${goal.daily.timeGoal} minutes</div>
                    <div style="color: #8b949e; font-size: 0.85em; margin-top: 5px;">
                        📧 Smart reminder after ${goal.daily.emailReminderThreshold || Math.floor(goal.daily.timeGoal * 0.7)} minutes
                    </div>
                </div>

                <div style="margin-bottom: 15px;">
                    <div style="display: flex; align-items: center; gap: 10px; color: #fff; font-weight: 600; margin-bottom: 12px;">
                        <span style="font-size: 1.3em;">📚</span>
                        <span style="font-size: 1em;">Today's Courses</span>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 8px;">
                        ${goal.daily.selectedCourses.map(course => {
                            const courseData = courses[course.lang].find(c => c.id === course.courseId);
                            const isCompleted = userProgress[course.lang][course.courseId]?.completed;
                            return `
                                <div style="display: flex; align-items: center; gap: 12px; padding: 12px; background: ${isCompleted ? 'rgba(100, 255, 218, 0.1)' : 'rgba(100, 255, 218, 0.05)'}; border: 2px solid ${isCompleted ? 'rgba(100, 255, 218, 0.3)' : 'rgba(100, 255, 218, 0.15)'}; border-radius: 10px;">
                                    <span style="font-size: 1.5em;">${courseData.icon}</span>
                                    <div style="flex: 1;">
                                        <div style="color: #fff; font-weight: 600; font-size: 1em;">${courseData.title}</div>
                                        <div style="color: #8b949e; font-size: 0.85em;">${langIcons[course.lang]} ${course.lang.toUpperCase()}</div>
                                    </div>
                                    <span style="font-size: 1.3em;">${isCompleted ? '✅' : '⏳'}</span>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>

                <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                    <div style="flex: 1; padding: 12px; background: rgba(100, 255, 218, 0.05); border-radius: 10px; text-align: center;">
                        <div style="font-size: 1.5em; margin-bottom: 5px;">${goal.daily.streak ? '🔥' : '❌'}</div>
                        <div style="color: #8b949e; font-size: 0.85em;">Streak Goal</div>
                    </div>
                    <div style="flex: 1; padding: 12px; background: rgba(102, 126, 234, 0.08); border-radius: 10px; text-align: center;">
                        <div style="font-size: 1.5em; margin-bottom: 5px;">${goal.emailNotifications ? '📧' : '🔕'}</div>
                        <div style="color: #8b949e; font-size: 0.85em;">Email Alerts</div>
                    </div>
                </div>

                <div style="display: flex; gap: 10px; margin-top: 20px;">
                    <button class="edit-goal-btn" data-index="${index}" style="flex: 1; padding: 14px; background: rgba(102, 126, 234, 0.15); border: 2px solid rgba(102, 126, 234, 0.3); border-radius: 12px; color: #667eea; font-weight: 600; font-size: 1em; cursor: pointer; transition: all 0.3s ease;">
                        ✏️ Edit
                    </button>
                    <button class="delete-goal-btn" data-index="${index}" style="flex: 1; padding: 14px; background: rgba(255, 107, 107, 0.15); border: 2px solid rgba(255, 107, 107, 0.3); border-radius: 12px; color: #ff6b6b; font-weight: 600; font-size: 1em; cursor: pointer; transition: all 0.3s ease;">
                        🗑️ Delete
                    </button>
                </div>
            </div>
        `;
    }

    // Setup event handlers
    function setupEventHandlers(isDetailView = false, currentGoalIndex = null) {
        setTimeout(() => {
            const closeBtn = document.getElementById('closeViewGoalsBtn');
            const backBtn = document.getElementById('backToGoalsBtn');
            const goalButtons = document.querySelectorAll('.goal-button-card');
            const editBtns = document.querySelectorAll('.edit-goal-btn');
            const deleteBtns = document.querySelectorAll('.delete-goal-btn');
            const toggleSelectBtn = document.getElementById('toggleSelectBtn');
            const deleteAllBtn = document.getElementById('deleteAllBtn');
            const deleteSelectedBtn = document.getElementById('deleteSelectedBtn');
            const checkboxes = document.querySelectorAll('.goal-checkbox');

            if (closeBtn) {
                closeBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    closeViewGoalsModal();
                });
                closeBtn.onmouseenter = function() {
                    this.style.background = 'rgba(100, 255, 218, 0.1)';
                };
                closeBtn.onmouseleave = function() {
                    this.style.background = 'none';
                };
            }

            if (backBtn) {
                backBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    // Smooth fade-out transition
                    content.style.opacity = '0';
                    content.style.transform = 'scale(0.95)';

                    setTimeout(() => {
                        content.innerHTML = generateGoalButtons();
                        setupEventHandlers(false);

                        // Fade back in
                        setTimeout(() => {
                            content.style.opacity = '1';
                            content.style.transform = 'scale(1)';
                        }, 50);
                    }, 200);
                });
                backBtn.onmouseenter = function() {
                    this.style.background = 'rgba(100, 255, 218, 0.2)';
                };
                backBtn.onmouseleave = function() {
                    this.style.background = 'rgba(100, 255, 218, 0.1)';
                };
            }

            // Toggle selection mode
            if (toggleSelectBtn) {
                toggleSelectBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    // Smooth fade-out transition
                    content.style.opacity = '0.7';

                    setTimeout(() => {
                        selectionMode = !selectionMode;
                        if (!selectionMode) {
                            selectedGoals.clear();
                        }
                        content.innerHTML = generateGoalButtons();
                        setupEventHandlers(false);

                        // Fade back in
                        setTimeout(() => {
                            content.style.opacity = '1';
                        }, 50);
                    }, 150);
                });
                toggleSelectBtn.onmouseenter = function() {
                    this.style.transform = 'translateY(-2px)';
                    this.style.boxShadow = '0 5px 15px rgba(100, 255, 218, 0.2)';
                };
                toggleSelectBtn.onmouseleave = function() {
                    this.style.transform = 'translateY(0)';
                    this.style.boxShadow = 'none';
                };
            }

            // Delete all goals
            if (deleteAllBtn) {
                deleteAllBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (confirm(`⚠️ WARNING: Are you sure you want to delete ALL ${allGoals.length} goals?\n\nThis action cannot be undone!`)) {
                        localStorage.removeItem('userGoals_' + currentUser);
                        localStorage.removeItem('allUserGoals_' + currentUser);
                        closeViewGoalsModal();
                        checkAndShowViewGoalsButton();
                        showNotification('All goals deleted successfully!', 'success');
                    }
                });
                deleteAllBtn.onmouseenter = function() {
                    this.style.background = 'rgba(255, 107, 107, 0.25)';
                    this.style.transform = 'translateY(-2px)';
                };
                deleteAllBtn.onmouseleave = function() {
                    this.style.background = 'rgba(255, 107, 107, 0.15)';
                    this.style.transform = 'translateY(0)';
                };
            }

            // Delete selected goals
            if (deleteSelectedBtn) {
                deleteSelectedBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (selectedGoals.size === 0) return;

                    if (confirm(`Are you sure you want to delete ${selectedGoals.size} selected goal${selectedGoals.size > 1 ? 's' : ''}?`)) {
                        // Smooth fade-out transition
                        content.style.opacity = '0';
                        content.style.transform = 'scale(0.95)';

                        setTimeout(() => {
                            const goalsArray = JSON.parse(localStorage.getItem('allUserGoals_' + currentUser) || '[]');
                            const indicesToDelete = Array.from(selectedGoals).sort((a, b) => b - a);
                            indicesToDelete.forEach(index => {
                                goalsArray.splice(index, 1);
                            });

                            if (goalsArray.length === 0) {
                                localStorage.removeItem('userGoals_' + currentUser);
                                localStorage.removeItem('allUserGoals_' + currentUser);
                                closeViewGoalsModal();
                                checkAndShowViewGoalsButton();
                            } else {
                                localStorage.setItem('allUserGoals_' + currentUser, JSON.stringify(goalsArray));
                                selectedGoals.clear();
                                selectionMode = false;
                                // Refresh the view
                                const updatedGoals = JSON.parse(localStorage.getItem('allUserGoals_' + currentUser) || '[]');
                                allGoals.length = 0;
                                allGoals.push(...updatedGoals);
                                content.innerHTML = generateGoalButtons();
                                setupEventHandlers(false);

                                // Fade back in
                                setTimeout(() => {
                                    content.style.opacity = '1';
                                    content.style.transform = 'scale(1)';
                                }, 50);
                            }

                            showNotification(`${indicesToDelete.length} goal${indicesToDelete.length > 1 ? 's' : ''} deleted successfully!`, 'success');
                        }, 200);
                    }
                });
                deleteSelectedBtn.onmouseenter = function() {
                    if (selectedGoals.size > 0) {
                        this.style.background = 'rgba(255, 107, 107, 0.25)';
                        this.style.transform = 'translateY(-2px)';
                    }
                };
                deleteSelectedBtn.onmouseleave = function() {
                    if (selectedGoals.size > 0) {
                        this.style.background = 'rgba(255, 107, 107, 0.15)';
                        this.style.transform = 'translateY(0)';
                    }
                };
            }

            // Handle checkbox clicks
            checkboxes.forEach(checkbox => {
                checkbox.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    // Quick fade for checkbox toggle
                    content.style.opacity = '0.8';

                    setTimeout(() => {
                        const index = parseInt(checkbox.dataset.index);
                        if (selectedGoals.has(index)) {
                            selectedGoals.delete(index);
                        } else {
                            selectedGoals.add(index);
                        }
                        content.innerHTML = generateGoalButtons();
                        setupEventHandlers(false);

                        // Fade back in
                        setTimeout(() => {
                            content.style.opacity = '1';
                        }, 30);
                    }, 100);
                });
            });

            goalButtons.forEach((btn) => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    // If in selection mode, toggle selection
                    if (selectionMode) {
                        // Quick fade for selection toggle
                        content.style.opacity = '0.8';

                        setTimeout(() => {
                            const index = parseInt(btn.dataset.index);
                            if (selectedGoals.has(index)) {
                                selectedGoals.delete(index);
                            } else {
                                selectedGoals.add(index);
                            }
                            content.innerHTML = generateGoalButtons();
                            setupEventHandlers(false);

                            // Fade back in
                            setTimeout(() => {
                                content.style.opacity = '1';
                            }, 30);
                        }, 100);
                    } else {
                        // Smooth fade-out transition before showing detail
                        content.style.opacity = '0';
                        content.style.transform = 'scale(0.95)';

                        setTimeout(() => {
                            const index = parseInt(btn.dataset.index);
                            content.innerHTML = generateGoalDetail(index);
                            setupEventHandlers(true, index);

                            // Fade back in
                            setTimeout(() => {
                                content.style.opacity = '1';
                                content.style.transform = 'scale(1)';
                            }, 50);
                        }, 200);
                    }
                });
                btn.onmouseenter = function() {
                    this.style.transform = 'translateY(-3px) scale(1.02)';
                    this.style.boxShadow = '0 10px 30px rgba(100, 255, 218, 0.3)';
                    this.style.borderColor = 'rgba(100, 255, 218, 0.5)';
                };
                btn.onmouseleave = function() {
                    this.style.transform = 'translateY(0) scale(1)';
                    this.style.boxShadow = selectedGoals.has(parseInt(btn.dataset.index)) ? '0 0 20px rgba(100, 255, 218, 0.4)' : 'none';
                    this.style.borderColor = selectedGoals.has(parseInt(btn.dataset.index)) ? 'rgba(100, 255, 218, 0.8)' : 'rgba(100, 255, 218, 0.3)';
                };
            });

            editBtns.forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    const index = parseInt(this.dataset.index);
                    closeViewGoalsModal();
                    setTimeout(() => openGoalsModal(), 300);
                });
                btn.onmouseenter = function() {
                    this.style.background = 'rgba(102, 126, 234, 0.25)';
                    this.style.transform = 'translateY(-2px)';
                };
                btn.onmouseleave = function() {
                    this.style.background = 'rgba(102, 126, 234, 0.15)';
                    this.style.transform = 'translateY(0)';
                };
            });

            deleteBtns.forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    const index = parseInt(this.dataset.index);
                    confirmDeleteGoal(index);
                });
                btn.onmouseenter = function() {
                    this.style.background = 'rgba(255, 107, 107, 0.25)';
                    this.style.transform = 'translateY(-2px)';
                };
                btn.onmouseleave = function() {
                    this.style.background = 'rgba(255, 107, 107, 0.15)';
                    this.style.transform = 'translateY(0)';
                };
            });
        }, 50);
    }

    // Show initial button view
    content.innerHTML = generateGoalButtons();

    modal.appendChild(content);
    document.body.appendChild(modal);

    // Setup event handlers
    setupEventHandlers(false);

    // Animate in
    setTimeout(() => {
        modal.style.opacity = '1';
        content.style.transform = 'scale(1)';
    }, 50);
}

function confirmDeleteGoal(index) {
    const allGoals = JSON.parse(localStorage.getItem('allUserGoals_' + currentUser) || '[]');
    if (index >= 0 && index < allGoals.length) {
        if (confirm(`Are you sure you want to delete Goal #${index + 1}?`)) {
            allGoals.splice(index, 1);
            localStorage.setItem('allUserGoals_' + currentUser, JSON.stringify(allGoals));

            // If no goals left, clean up
            if (allGoals.length === 0) {
                localStorage.removeItem('userGoals_' + currentUser);
                localStorage.removeItem('allUserGoals_' + currentUser);
            }

            closeViewGoalsModal();
            checkAndShowViewGoalsButton();
            showNotification('Goal deleted successfully!', 'success');
        }
    }
}

function closeGoalsModal() {
    const modal = document.getElementById('goalsModal');
    if (modal) {
        modal.style.opacity = '0';
        const content = modal.querySelector('.goals-modal-content');
        if (content) {
            content.style.transform = 'scale(0.9) translateY(20px)';
        }
        setTimeout(() => {
            modal.style.display = 'none';
            modal.classList.remove('active');

            // Unlock scroll AFTER animation
            unlockScroll();

            // Check and show view button after modal closes
            checkAndShowViewGoalsButton();
        }, 300);
    }
}

function closeViewGoalsModal() {
    const modal = document.getElementById('viewGoalsModal');
    if (modal) {
        modal.style.opacity = '0';
        const content = modal.querySelector('div[style*="background"]');
        if (content) {
            content.style.transform = 'scale(0.9)';
        }
        setTimeout(() => {
            modal.remove();

            // ✅ Always unlock scroll
            unlockScroll();
        }, 300);
    } else {
        // ✅ If modal doesn't exist but scroll is locked, unlock it
        unlockScroll();
    }
}

function confirmDeleteGoals() {
    // Create custom modal
    const modal = document.createElement('div');
    modal.className = 'custom-delete-modal';
    modal.style.cssText = `
        display: flex;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.85);
        backdrop-filter: blur(10px);
        z-index: 10001;
        justify-content: center;
        align-items: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;

    modal.innerHTML = `
        <div class="delete-modal-content" style="
            background: rgba(30, 30, 30, 0.98);
            backdrop-filter: blur(20px);
            border: 2px solid rgba(255, 107, 107, 0.4);
            border-radius: 20px;
            padding: 30px;
            max-width: 450px;
            width: 90%;
            transform: scale(0.9);
            transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
            box-shadow: 0 20px 60px rgba(255, 107, 107, 0.3);
        ">
            <div style="text-align: center; margin-bottom: 25px;">
                <div style="font-size: 4em; margin-bottom: 15px;">⚠️</div>
                <h2 style="color: #fff; margin: 0 0 10px 0; font-size: 1.6em;">Delete Goals?</h2>
                <p style="color: #8b949e; margin: 0; line-height: 1.6;">This will remove all your daily goals, stop email reminders, and reset today's progress. This action cannot be undone.</p>
            </div>

            <div style="display: flex; gap: 12px;">
                <button onclick="closeDeleteModal()" style="
                    flex: 1;
                    padding: 14px;
                    background: rgba(139, 148, 158, 0.15);
                    border: 2px solid rgba(139, 148, 158, 0.3);
                    border-radius: 12px;
                    color: #8b949e;
                    font-weight: 600;
                    font-size: 1em;
                    cursor: pointer;
                    transition: all 0.3s ease;
                ">Cancel</button>
                <button onclick="deleteGoalsConfirmed()" style="
                    flex: 1;
                    padding: 14px;
                    background: rgba(255, 107, 107, 0.15);
                    border: 2px solid rgba(255, 107, 107, 0.4);
                    border-radius: 12px;
                    color: #ff6b6b;
                    font-weight: 700;
                    font-size: 1em;
                    cursor: pointer;
                    transition: all 0.3s ease;
                ">Delete Goals</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    setTimeout(() => {
        modal.style.opacity = '1';
        const content = modal.querySelector('.delete-modal-content');
        content.style.transform = 'scale(1)';
    }, 10);
}

function closeDeleteModal() {
    const modal = document.querySelector('.custom-delete-modal');
    if (modal) {
        modal.style.opacity = '0';
        const content = modal.querySelector('.delete-modal-content');
        content.style.transform = 'scale(0.9)';
        setTimeout(() => modal.remove(), 300);
    }
}

function deleteGoalsConfirmed() {
    closeDeleteModal();
    deleteGoals();
}

function deleteGoals() {
    localStorage.removeItem('userGoals_' + currentUser);
    localStorage.removeItem('goalStartTime_' + currentUser);
    localStorage.removeItem('coursesCompletedToday_' + currentUser);

    // Stop monitoring
    if (goalMonitoringInterval) {
        clearInterval(goalMonitoringInterval);
        goalMonitoringInterval = null;
    }

    // Hide view button with animation
    const viewBtn = document.getElementById('viewGoalsBtn');
    if (viewBtn) {
        viewBtn.style.opacity = '0';
        viewBtn.style.transform = 'scale(0.8)';
        setTimeout(() => {
            viewBtn.style.display = 'none';
        }, 300);
    }

    showNotification('✅ Goals deleted successfully!', 'success');
    closeViewGoalsModal();
}

let goalMonitoringInterval = null;

function startSmartGoalMonitoring() {
    if (goalMonitoringInterval) {
        clearInterval(goalMonitoringInterval);
    }

    const goals = JSON.parse(localStorage.getItem('userGoals_' + currentUser) || '{}');

    if (!goals.emailNotifications) {
        console.log('📧 Email notifications disabled');
        return;
    }

    // ✅ FIX: Ensure goal start time is set
    if (!localStorage.getItem('goalStartTime_' + currentUser)) {
        localStorage.setItem('goalStartTime_' + currentUser, Date.now().toString());
        console.log('⏰ Goal start time initialized');
    }

    console.log(`✅ Smart goal monitoring started - Will check every minute`);
    console.log(`📊 Goal settings:`, goals);

    // ✅ Check immediately on start
    setTimeout(() => {
        console.log('🔍 Running initial check...');
        checkSmartGoalProgress();
    }, 5000);

    // Then check every minute
    goalMonitoringInterval = setInterval(() => {
        checkSmartGoalProgress();
    }, 60000);
}

function checkSmartGoalProgress() {
    const goals = JSON.parse(localStorage.getItem('userGoals_' + currentUser) || '{}');

    if (!goals.emailNotifications) {
        console.log('❌ Email notifications disabled - skipping check');
        return;
    }

    const startTime = parseInt(localStorage.getItem('goalStartTime_' + currentUser) || Date.now());
    const elapsed = Math.floor((Date.now() - startTime) / 60000);
    const completed = parseInt(localStorage.getItem('coursesCompletedToday_' + currentUser) || '0');

    const currentGoalId = localStorage.getItem('activeGoalId_' + currentUser);
    const emailSent = localStorage.getItem('goalEmailSent_' + currentUser + '_' + currentGoalId);

    const totalCourses = goals.daily.selectedCourses.length;
    const remainingCourses = totalCourses - completed;
    const progressPercent = totalCourses > 0 ? (completed / totalCourses) * 100 : 0;

    const reminderThreshold = goals.daily.emailReminderThreshold || Math.floor(goals.daily.timeGoal * 0.7);

    console.log(`📊 Progress Check:
    - Elapsed: ${elapsed}/${goals.daily.timeGoal} min
    - Completed: ${completed}/${totalCourses} courses (${progressPercent.toFixed(0)}%)
    - Threshold: ${reminderThreshold} min
    - Email sent: ${emailSent ? 'YES' : 'NO'}
    `);

    // ✅ FIX: Check all conditions and log which ones pass/fail
    const passedThreshold = elapsed >= reminderThreshold;
    const belowHalfway = progressPercent < 50;
    const hasRemaining = remainingCourses > 0;
    const notSent = !emailSent;

    console.log(`Conditions:
    - Passed threshold (${elapsed} >= ${reminderThreshold}): ${passedThreshold}
    - Below 50% (${progressPercent}% < 50%): ${belowHalfway}
    - Has remaining (${remainingCourses} > 0): ${hasRemaining}
    - Email not sent: ${notSent}
    `);

    if (passedThreshold && belowHalfway && hasRemaining && notSent) {
        sendSmartGoalEmail(goals, completed, totalCourses, elapsed);
        localStorage.setItem('goalEmailSent_' + currentUser + '_' + currentGoalId, 'true');
    } else {
        console.log('❌ Not sending email - conditions not met');
    }
}

async function sendSmartGoalEmail(goals, completed, total, elapsed) {
    try {
        const userData = JSON.parse(localStorage.getItem('user_' + currentUser));
        const remaining = total - completed;
        const progressPercent = Math.round((completed / total) * 100);

        const reminderThreshold = goals.daily.emailReminderThreshold || Math.floor(goals.daily.timeGoal * 0.7);

        // ✅ Fetch email config
        const response = await fetch('/api/email-config');
        const config = await response.json();

        console.log('📧 Email Config:', config); // Debug - check what templates we have

        // ✅ FIX: Use the goal template ID, NOT the password reset template
        const templateId = config.EMAIL_GOAL_TEMPLATE_ID;

        if (!templateId) {
            console.error('❌ EMAIL_GOAL_TEMPLATE_ID not found in config!');
            showNotification('Goal reminder template not configured', 'error');
            return;
        }
        const langIcons = {
            python: '🐍',
            javascript: '⚡',
            html: '🌐',
            css: '🎨',
            react: '⚛️'
        };

        const coursesList = goals.daily.selectedCourses.map(c => {
            const courseData = courses[c.lang].find(course => course.id === c.courseId);
            const isCompleted = userProgress[c.lang][c.courseId]?.completed;
            const status = isCompleted ? '✅ Done' : '⏳ Pending';
            return `${status} ${langIcons[c.lang]} ${courseData.title} (${c.lang.toUpperCase()})`;
        }).join('\n');

        const emailParams = {
            to_email: userData.email,
            to_name: userData.name,
            user_name: userData.name,
            subject: `⏰ Daily Goal Reminder - ${remaining} Course${remaining !== 1 ? 's' : ''} Left!`,
            greeting: `Hi ${userData.name}!`,
            elapsed_time: elapsed,
            total_courses: total,
            time_goal: goals.daily.timeGoal,
            progress_percent: progressPercent,
            completed_courses: completed,
            remaining_courses: remaining,
            courses_list: coursesList,
            remaining_time: goals.daily.timeGoal - elapsed,
            reminder_threshold: reminderThreshold
        };

        console.log('📤 Sending email with params:', emailParams);

        await emailjs.send(
            config.EMAIL_SERVICE_ID,
            templateId, // ✅ Use the goal template ID
            emailParams,
            config.EMAIL_PUBLIC_KEY
        );
        showNotification('📧 Reminder email sent!', 'success');

    } catch (error) {
        console.error('❌ Email error:', error);
        showNotification('Failed to send reminder email', 'error');
    }
}

function trackCourseCompletion() {
    const count = parseInt(localStorage.getItem('coursesCompletedToday_' + currentUser) || '0');
    localStorage.setItem('coursesCompletedToday_' + currentUser, (count + 1).toString());

    console.log('🎓 Course completed! Today\'s count:', count + 1);

    // ✅ Check if this course was part of an active goal
    const activeGoalId = localStorage.getItem('activeGoalId_' + currentUser);
    if (activeGoalId) {
        const allGoals = JSON.parse(localStorage.getItem('allUserGoals_' + currentUser) || '[]');
        const activeGoal = allGoals.find(g => g.id === activeGoalId);

        if (activeGoal) {
            // Count completed courses in this goal
            let goalCompleted = 0;
            activeGoal.daily.selectedCourses.forEach(course => {
                if (userProgress[course.lang][course.courseId]?.completed) {
                    goalCompleted++;
                }
            });

            // Update goal progress
            activeGoal.completed = goalCompleted;
            const goalIndex = allGoals.findIndex(g => g.id === activeGoalId);
            if (goalIndex !== -1) {
                allGoals[goalIndex] = activeGoal;
                localStorage.setItem('allUserGoals_' + currentUser, JSON.stringify(allGoals));
            }

            // ✅ Check if goal is now complete
if (goalCompleted >= activeGoal.daily.selectedCourses.length) {
    // Goal completed! - Store flag to show notification after stats close
    localStorage.setItem('goalJustCompleted_' + currentUser, 'true');
    localStorage.setItem('completedGoalData_' + currentUser, JSON.stringify(activeGoal));
    setTimeout(() => {
        showGoalCompletionCelebration(activeGoal);
    }, 2000); // Show after streak celebration
            } else {
                // Show progress towards goal
                showNotification(`🎯 Goal Progress: ${goalCompleted}/${activeGoal.daily.selectedCourses.length} courses completed!`, 'success');
            }

            // ✅ Update streak if enabled
            if (activeGoal.daily.streak) {
            } else {
                console.log('ℹ️ Streak NOT updated (setting is off)');
            }

            // Stop monitoring if goal complete
            if (goalCompleted >= activeGoal.daily.selectedCourses.length && goalMonitoringInterval) {
                clearInterval(goalMonitoringInterval);
            }
        }
    }
}

function showGoalCompletionCelebration(goal) {
    const modal = document.createElement('div');
    modal.className = 'goal-completion-modal';
    modal.style.cssText = `
        display: flex;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        backdrop-filter: blur(15px);
        -webkit-backdrop-filter: blur(15px);
        z-index: 10001;
        justify-content: center;
        align-items: center;
        opacity: 0;
        transition: opacity 0.5s ease;
    `;

    const content = document.createElement('div');
    content.style.cssText = `
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.95), rgba(100, 255, 218, 0.95));
        border: 3px solid rgba(255, 255, 255, 0.3);
        border-radius: 25px;
        padding: 50px 40px;
        max-width: 550px;
        width: 90%;
        text-align: center;
        transform: scale(0.8);
        transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        box-shadow: 0 20px 60px rgba(100, 255, 218, 0.5);
        position: relative;
        overflow: hidden;
    `;

    // Animated background effect
    content.innerHTML = `
        <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; pointer-events: none;">
            <div style="position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%); animation: rotateGlow 10s linear infinite;"></div>
        </div>

        <div style="position: relative; z-index: 1;">
            <div style="font-size: 5em; margin-bottom: 20px; animation: bounceIn 0.8s ease;">🎉</div>
            <h1 style="color: #fff; font-size: 2.5em; font-weight: 800; margin: 0 0 15px 0; text-shadow: 0 4px 20px rgba(0,0,0,0.3);">
                Goal Completed!
            </h1>
            <p style="color: rgba(255,255,255,0.95); font-size: 1.2em; margin: 0 0 30px 0; font-weight: 600;">
                You've completed all ${goal.daily.selectedCourses.length} courses in this goal!
            </p>

            <div style="background: rgba(255,255,255,0.2); backdrop-filter: blur(10px); border-radius: 15px; padding: 25px; margin-bottom: 30px;">
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 20px;">
                    <div>
                        <div style="font-size: 2.5em; color: #fff; font-weight: 800;">${goal.daily.selectedCourses.length}</div>
                        <div style="color: rgba(255,255,255,0.9); font-size: 0.9em; font-weight: 600;">Courses</div>
                    </div>
                    <div>
                        <div style="font-size: 2.5em; color: #fff; font-weight: 800;">${goal.daily.timeGoal}</div>
                        <div style="color: rgba(255,255,255,0.9); font-size: 0.9em; font-weight: 600;">Minutes</div>
                    </div>
                </div>

                <div style="display: flex; flex-wrap: wrap; gap: 8px; justify-content: center;">
                    ${goal.daily.selectedCourses.slice(0, 4).map(c => {
                        const courseData = courses[c.lang].find(course => course.id === c.courseId);
                        return `
                            <div style="background: rgba(255,255,255,0.25); padding: 6px 14px; border-radius: 20px; font-size: 0.85em; color: #fff; font-weight: 600; display: flex; align-items: center; gap: 6px;">
                                <span>${courseData.icon}</span>
                                <span>${courseData.title}</span>
                            </div>
                        `;
                    }).join('')}
                    ${goal.daily.selectedCourses.length > 4 ? `
                        <div style="background: rgba(255,255,255,0.25); padding: 6px 14px; border-radius: 20px; font-size: 0.85em; color: #fff; font-weight: 600;">
                            +${goal.daily.selectedCourses.length - 4} more
                        </div>
                    ` : ''}
                </div>
            </div>

            <button onclick="closeGoalCompletion()" style="
                padding: 16px 40px;
                background: rgba(255,255,255,0.95);
                border: none;
                border-radius: 50px;
                color: #667eea;
                font-weight: 800;
                font-size: 1.1em;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            " onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 6px 30px rgba(0,0,0,0.3)';" onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 4px 20px rgba(0,0,0,0.2)';">
                ✨ Awesome!
            </button>
        </div>
    `;

    // Add rotation animation
    const style = document.createElement('style');
    style.textContent = `
@keyframes rotateGlow {
from { transform: rotate(0deg); }
to { transform: rotate(360deg); }
}
@keyframes bounceIn {
0% { transform: scale(0); }
50% { transform: scale(1.2); }
100% { transform: scale(1); }
}
`;
    document.head.appendChild(style);

    modal.appendChild(content);
    document.body.appendChild(modal);

    // Confetti effect
    createConfetti();

    // Animate in
    setTimeout(() => {
        modal.style.opacity = '1';
        content.style.transform = 'scale(1)';
    }, 100);
}

function showGoalsList() {
    const allGoals = JSON.parse(localStorage.getItem('allUserGoals_' + currentUser) || '[]');
    const activeGoalId = localStorage.getItem('activeGoalId_' + currentUser);

    if (allGoals.length === 0) {
        showNotification('No goals found!', 'info');
        return;
    }

    // Lock scroll FIRST
    lockScroll();

    // ✅ Inject CSS if not already injected
    injectGoalsCSS();

    const modal = document.createElement('div');
    modal.className = 'goals-list-modal';
    modal.id = 'goalsListModal';

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeGoalsList();
        }
    });

    function closeGoalsList() {
    const modal = document.getElementById('goalsListModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();

            // Unlock scroll AFTER removal
            unlockScroll();
        }, 300);
    }
}

    const langIcons = { python: '🐍', javascript: '⚡', html: '🌐', css: '🎨', react: '⚛️' };

    const content = document.createElement('div');
    content.className = 'goals-list-content';
    content.addEventListener('click', (e) => e.stopPropagation());

    content.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
            <h2 style="color: #fff; margin: 0; font-size: 1.8em; font-weight: 700;">
                🎯 Your Learning Goals
            </h2>
            <button id="closeGoalsListBtn" style="background: none; border: none; color: #64ffda; font-size: 2em; cursor: pointer; padding: 0; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: all 0.3s ease;">×</button>
        </div>

        <div style="color: #8b949e; margin-bottom: 20px; font-size: 0.95em;">
            📊 You have ${allGoals.length} goal${allGoals.length !== 1 ? 's' : ''} • Click to view details
        </div>

        <div id="goalsCardsContainer" style="margin-bottom: 20px;"></div>

        <button id="createNewGoalBtn" style="width: 100%; padding: 14px; margin-top: 20px; background: linear-gradient(135deg, #667eea, #64ffda); border: none; border-radius: 12px; color: #fff; font-weight: 700; font-size: 1em; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(100, 255, 218, 0.3);">
            ➕ Create New Goal
        </button>
    `;

    modal.appendChild(content);
    document.body.appendChild(modal);

    // ✅ Add event listeners
    setTimeout(() => {
        const closeBtn = document.getElementById('closeGoalsListBtn');
        const createBtn = document.getElementById('createNewGoalBtn');

        if (closeBtn) {
            closeBtn.addEventListener('click', closeGoalsList);
        }

        if (createBtn) {
            createBtn.addEventListener('click', function() {
                closeGoalsList();
                setTimeout(openGoals, 300);
            });
        }
    }, 50);

    // ✅ Populate goal cards
    const container = document.getElementById('goalsCardsContainer');

    if (allGoals.length === 0) {
        container.innerHTML = `
            <div class="goals-empty-state">
                <div class="goals-empty-state-icon">🎯</div>
                <div class="goals-empty-state-text">No goals yet</div>
                <div style="font-size: 0.9em;">Create your first learning goal to get started!</div>
            </div>
        `;
    } else {
        allGoals.reverse().forEach((goal, index) => {
            const isActive = goal.id === activeGoalId;

            // ✅ Recalculate progress for each goal
            let completed = 0;
            goal.daily.selectedCourses.forEach(course => {
                if (userProgress[course.lang][course.courseId]?.completed) {
                    completed++;
                }
            });
            goal.completed = completed;

            const progress = Math.round((completed / goal.total) * 100);
            const createdDate = new Date(goal.createdAt).toLocaleDateString();

            let badge = '';
            let badgeClass = '';
            if (progress === 100) {
                badge = '✅ Completed';
                badgeClass = 'badge-completed';
            } else if (isActive) {
                badge = '🔥 Active';
                badgeClass = 'badge-active';
            } else {
                badge = '⏸️ Paused';
                badgeClass = 'badge-paused';
            }

            const card = document.createElement('div');
            card.className = 'goal-card' + (isActive ? ' active-goal' : '');
            card.style.animationDelay = (index * 0.05) + 's';

            card.innerHTML = `
                <div class="goal-card-header">
                    <div class="goal-card-title">
                        🎯 Goal ${allGoals.length - index}
                    </div>
                    <span class="goal-card-badge ${badgeClass}">${badge}</span>
                </div>

                <div class="goal-card-stats">
                    <div class="goal-stat">
                        <div class="goal-stat-value">${progress}%</div>
                        <div class="goal-stat-label">Progress</div>
                    </div>
                    <div class="goal-stat">
                        <div class="goal-stat-value">${completed}/${goal.total}</div>
                        <div class="goal-stat-label">Completed</div>
                    </div>
                    <div class="goal-stat">
                        <div class="goal-stat-value">${goal.daily.timeGoal}m</div>
                        <div class="goal-stat-label">Time Goal</div>
                    </div>
                </div>

                <div style="color: #8b949e; font-size: 0.85em; margin-bottom: 12px;">
                    📅 Created: ${createdDate}
                </div>

                <div class="goal-card-courses">
                    ${goal.daily.selectedCourses.slice(0, 4).map(c => {
                        const courseData = courses[c.lang].find(course => course.id === c.courseId);
                        return `
                            <div class="goal-course-chip">
                                <span>${courseData.icon}</span>
                                <span>${courseData.title}</span>
                            </div>
                        `;
                    }).join('')}
                    ${goal.daily.selectedCourses.length > 4 ? `
                        <div class="goal-course-chip" style="background: rgba(100, 255, 218, 0.1); border-color: rgba(100, 255, 218, 0.3);">
                            +${goal.daily.selectedCourses.length - 4} more
                        </div>
                    ` : ''}
                </div>
            `;

            // ✅ Add click handler
            card.addEventListener('click', function() {
                openSpecificGoal(goal.id);
            });

            container.appendChild(card);
        });
    }

    // Animate in
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
}

function closeGoalCompletion() {
    const modal = document.querySelector('.goal-completion-modal');
    if (modal) {
        modal.style.opacity = '0';
        setTimeout(() => modal.remove(), 500);
    }

    // Clean up confetti
    document.querySelectorAll('.confetti').forEach(c => c.remove());
}

function createConfetti() {
    const colors = ['#667eea', '#64ffda', '#ffc107', '#ff6b6b', '#00ff00'];
    const confettiCount = 50;

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            top: -10px;
            left: ${Math.random() * 100}%;
            opacity: ${Math.random() * 0.5 + 0.5};
            transform: rotate(${Math.random() * 360}deg);
            animation: confettiFall ${Math.random() * 3 + 2}s linear forwards;
            z-index: 10002;
        `;
        document.body.appendChild(confetti);

        // Remove after animation
        setTimeout(() => confetti.remove(), 5000);
    }

    // Add confetti animation
    const style = document.createElement('style');
    style.textContent = `
@keyframes confettiFall {
to {
transform: translateY(100vh) rotate(${Math.random() * 720}deg);
opacity: 0;
}
}
`;
    document.head.appendChild(style);
}

// Make chart tabs clickable to return from detail view
function makeChartTabsClickable() {
    const chartTabs = document.querySelectorAll('.chart-tab');

    chartTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // If detail view is active, hide it first
            const activeDetail = document.querySelector('.stat-detail-view.active');
            if (activeDetail) {
                hideStatDetails();
            }
        });
    });
}

// Create detail view containers
function createDetailViews() {
    // Check if already exists
    if (document.getElementById('statDetailViews')) return;

    // Find the buttons container
    const buttonsContainer = document.getElementById('statsButtonsContainer');
    if (!buttonsContainer) return;

    const detailContainer = document.createElement('div');
    detailContainer.id = 'statDetailViews';
    detailContainer.innerHTML = `
        <button class="stats-back-btn" id="statsBackBtn" onclick="hideStatDetails()">
            <span>← Back to Charts</span>
        </button>

        <!-- Time Detail -->
        <div id="timeDetail" class="stat-detail-view">
            <div class="stat-detail-header">
                <div class="stat-detail-icon">⏱️</div>
                <div class="stat-detail-title">Time Breakdown</div>
            </div>
            <div id="timeDetailContent" class="stat-detail-content"></div>
        </div>

        <!-- Activity Detail -->
        <div id="activityDetail" class="stat-detail-view">
            <div class="stat-detail-header">
                <div class="stat-detail-icon">📅</div>
                <div class="stat-detail-title">Recent Activity</div>
            </div>
            <div id="activityDetailContent" class="stat-detail-content"></div>
        </div>

        <!-- Performance Detail -->
        <div id="performanceDetail" class="stat-detail-view">
            <div class="stat-detail-header">
                <div class="stat-detail-icon">🎯</div>
                <div class="stat-detail-title">Your Performance</div>
            </div>
            <div id="performanceDetailContent" class="stat-detail-content"></div>
        </div>
    `;

    // Insert after buttons container
    buttonsContainer.parentNode.insertBefore(detailContainer, buttonsContainer.nextSibling);
}

// Show stat detail
function showStatDetail(type) {
    // Hide all chart containers
    const chartContainers = document.querySelectorAll('.chart-container');
    chartContainers.forEach(c => c.classList.add('hide'));

    // Hide all detail views
    const detailViews = document.querySelectorAll('.stat-detail-view');
    detailViews.forEach(v => v.classList.remove('active'));

    // Show back button
    const backBtn = document.getElementById('statsBackBtn');
    if (backBtn) backBtn.classList.add('show');

    // Update content first
    if (type === 'time') {
        updateTimeDetail();
    } else if (type === 'performance') {
        updatePerformanceDetail();
    } else if (type === 'activity') {
        updateActivityDetail();
    }

    // Show selected detail
    setTimeout(() => {
        const detailView = document.getElementById(type + 'Detail');
        if (detailView) {
            detailView.classList.add('active');
        }
    }, 200);
}

// Hide stat details
function hideStatDetails() {
    // Hide all detail views
    const detailViews = document.querySelectorAll('.stat-detail-view');
    detailViews.forEach(v => v.classList.remove('active'));

    // Hide back button
    const backBtn = document.getElementById('statsBackBtn');
    if (backBtn) backBtn.classList.remove('show');

    // Show charts again
    setTimeout(() => {
        const chartContainers = document.querySelectorAll('.chart-container');
        chartContainers.forEach(c => c.classList.remove('hide'));
    }, 200);
}

// Navigate to language
function navigateToLanguage(lang) {
    showSection('learn');
    setTimeout(() => {
        const languageTabs = document.querySelectorAll('.language-tab');
        languageTabs.forEach(tab => {
            const tabText = tab.textContent.toLowerCase();
            if (tabText.includes(lang.toLowerCase())) {
                tab.click();
                setTimeout(() => {
                    const coursesContainer = document.getElementById(lang + '-content');
                    if (coursesContainer) {
                        coursesContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }, 200);
            }
        });
    }, 100);
}

// Update language detail
function updateLanguageDetail() {
    const container = document.getElementById('languageDetailContent');
    if (!container) return;

    const langIcons = {
        python: '🐍',
        javascript: '⚡',
        html: '🌐',
        css: '🎨',
        react: '⚛️'
    };

    container.innerHTML = '';

    Object.keys(courses).forEach(lang => {
        const totalCourses = courses[lang].length;
        const completedCourses = Object.values(userProgress[lang]).filter(c => c.completed).length;
        const avgProgress = calculateAvgProgress(lang);

        const item = document.createElement('div');
        item.className = 'language-item';
        item.onclick = () => navigateToLanguage(lang);
        item.innerHTML = `
            <div class="language-info">
                <span class="language-icon">${langIcons[lang]}</span>
                <span class="language-name">${lang.toUpperCase()}</span>
            </div>
            <div class="language-stats">
                <span class="language-progress">${avgProgress}%</span>
                <span class="language-courses">${completedCourses}/${totalCourses} courses</span>
            </div>
        `;
        container.appendChild(item);
    });
}

function updateTimeDetail() {
    const container = document.getElementById('timeDetailContent');
    if (!container) return;

    const langIcons = {
        python: '🐍',
        javascript: '⚡',
        html: '🌐',
        css: '🎨',
        react: '⚛️'
    };

    container.innerHTML = '';

    const timeByLang = {};
    const detailsByLang = {};

    Object.keys(courses).forEach(lang => {
        let totalTime = 0;
        const courseDetails = [];

        Object.keys(userProgress[lang]).forEach(courseId => {
            const time = userProgress[lang][courseId].time || 0;
            totalTime += time;

            const course = courses[lang].find(c => c.id === courseId);
            if (course && time > 0) {
                const hours = Math.floor(time / 3600);
                const mins = Math.floor((time % 3600) / 60);
                const timeStr = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

                courseDetails.push({
                    title: course.title,
                    icon: course.icon,
                    time: time,
                    timeStr: timeStr,
                    completed: userProgress[lang][courseId].completed
                });
            }
        });

        timeByLang[lang] = totalTime;
        detailsByLang[lang] = courseDetails.sort((a, b) => b.time - a.time);
    });

    const sortedLangs = Object.entries(timeByLang).sort((a, b) => b[1] - a[1]);

    sortedLangs.forEach(([lang, seconds]) => {
        const hours = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const timeStr = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

        const itemWrapper = document.createElement('div');
        itemWrapper.style.marginBottom = '12px';

        const item = document.createElement('div');
        item.className = 'time-item';
        item.style.cursor = 'pointer';
        item.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px; flex: 1;">
                <span class="time-label">${langIcons[lang]} ${lang.toUpperCase()}</span>
                <span style="color: #8b949e; font-size: 0.85em;">(${detailsByLang[lang].length} courses)</span>
            </div>
            <div style="display: flex; align-items: center; gap: 10px;">
                <span class="time-value">${timeStr}</span>
                <span class="expand-icon" style="color: #64ffda; font-size: 1.2em; transition: transform 0.3s ease;">▼</span>
            </div>
        `;

        // Create expandable details section
        const detailsSection = document.createElement('div');
        detailsSection.className = 'time-details-section';
        detailsSection.style.cssText = `
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.4s ease, opacity 0.4s ease, margin-top 0.4s ease;
            opacity: 0;
            margin-top: 0;
        `;

        if (detailsByLang[lang].length > 0) {
            detailsSection.innerHTML = detailsByLang[lang].map(course => `
                <div style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px 15px;
                    margin: 8px 0;
                    background: rgba(100, 255, 218, 0.03);
                    border-left: 3px solid ${course.completed ? '#64ffda' : '#667eea'};
                    border-radius: 8px;
                    transition: all 0.3s ease;
                ">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="font-size: 1.3em;">${course.icon}</span>
                        <div>
                            <div style="color: #fff; font-weight: 600; font-size: 0.95em;">${course.title}</div>
                            <div style="color: #8b949e; font-size: 0.8em;">${course.completed ? '✓ Completed' : 'In Progress'}</div>
                        </div>
                    </div>
                    <span style="color: #64ffda; font-weight: 700;">${course.timeStr}</span>
                </div>
            `).join('');
        } else {
            detailsSection.innerHTML = `
                <div style="padding: 15px; text-align: center; color: #8b949e; font-size: 0.9em;">
                    No time recorded yet
                </div>
            `;
        }

        // Toggle expand/collapse
        let isExpanded = false;
        item.onclick = function() {
            isExpanded = !isExpanded;
            const expandIcon = item.querySelector('.expand-icon');

            if (isExpanded) {
                detailsSection.style.maxHeight = (detailsByLang[lang].length * 60 + 50) + 'px';
                detailsSection.style.opacity = '1';
                detailsSection.style.marginTop = '12px';
                expandIcon.style.transform = 'rotate(180deg)';
                item.style.borderColor = 'rgba(100, 255, 218, 0.4)';
            } else {
                detailsSection.style.maxHeight = '0';
                detailsSection.style.opacity = '0';
                detailsSection.style.marginTop = '0';
                expandIcon.style.transform = 'rotate(0deg)';
                item.style.borderColor = 'rgba(100, 255, 218, 0.15)';
            }
        };

        itemWrapper.appendChild(item);
        itemWrapper.appendChild(detailsSection);
        container.appendChild(itemWrapper);
    });
}

// Update performance detail
function updatePerformanceDetail() {
    const container = document.getElementById('performanceDetailContent');
    if (!container) return;

    let bestLang = '';
    let bestProgress = 0;

    Object.keys(courses).forEach(lang => {
        const progress = calculateAvgProgress(lang);
        if (progress > bestProgress) {
            bestProgress = progress;
            bestLang = lang;
        }
    });

    const langIcons = {
        python: '🐍',
        javascript: '⚡',
        html: '🌐',
        css: '🎨',
        react: '⚛️'
    };

    let totalProgress = 0;
    let courseCount = 0;
    Object.keys(courses).forEach(lang => {
        Object.keys(userProgress[lang]).forEach(courseId => {
            totalProgress += userProgress[lang][courseId].progress || 0;
            courseCount++;
        });
    });
    const avgCompletion = courseCount > 0 ? Math.round(totalProgress / courseCount) : 0;

    const activeDaysCount = localStorage.getItem('activeDaysCount_' + currentUser) || '1';

    container.innerHTML = `
        <div class="metric-row">
            <div class="metric-icon">🏆</div>
            <div class="metric-info">
                <span class="metric-label">Best Language</span>
                <span class="metric-value">${bestLang ? `${langIcons[bestLang]} ${bestLang.toUpperCase()}` : 'None yet'}</span>
            </div>
        </div>
        <div class="metric-row">
            <div class="metric-icon">📈</div>
            <div class="metric-info">
                <span class="metric-label">Avg. Completion</span>
                <span class="metric-value">${avgCompletion}%</span>
            </div>
        </div>
        <div class="metric-row">
            <div class="metric-icon">🔥</div>
            <div class="metric-info">
                <span class="metric-label">Active Days</span>
                <span class="metric-value">${activeDaysCount}</span>
            </div>
        </div>
    `;
}

// Update activity detail
function updateActivityDetail() {
    const container = document.getElementById('activityDetailContent');
    if (!container) return;

    const activities = [];

    Object.keys(courses).forEach(lang => {
        Object.keys(userProgress[lang]).forEach(courseId => {
            const course = courses[lang].find(c => c.id === courseId);
            const progress = userProgress[lang][courseId];

            if (progress.completed) {
                activities.push({
                    lang,
                    course,
                    progress
                });
            }
        });
    });

    const recentActivities = activities.slice(-10).reverse();

    if (recentActivities.length === 0) {
        container.innerHTML = '<p style="color: #8b949e; text-align: center; padding: 40px 20px;">No completed courses yet</p>';
        return;
    }

    container.innerHTML = '';

    recentActivities.forEach(activity => {
        const item = document.createElement('div');
        item.className = 'activity-item';
        item.innerHTML = `
            <span class="activity-icon">${activity.course.icon}</span>
            <div class="activity-details">
                <div class="activity-title">${activity.course.title}</div>
                <div class="activity-date">${activity.lang.toUpperCase()} • Completed</div>
            </div>
        `;
        container.appendChild(item);
    });
}

function initDetailedStats() {
    injectDetailedStatsCSS();
    createRoadmapScrollButton();
    monitorRoadmapScroll();

    // ✅ Add smooth transition to all chart elements FIRST
    setTimeout(() => {
        const progressSection = document.querySelector('.progress-section');
        if (progressSection) {
            progressSection.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
        }

        const chartContainers = document.querySelectorAll('.chart-container');
        chartContainers.forEach(container => {
            container.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
        });

        // Now add the buttons with animation
        addStatsButtons();
    }, 100);
}

function updateDashboard() {
    let totalStarted = 0;
    let totalCompleted = 0;

    Object.keys(userProgress).forEach(lang => {
        Object.keys(userProgress[lang]).forEach(course => {
            if (userProgress[lang][course].progress > 0) totalStarted++;
            if (userProgress[lang][course].completed) totalCompleted++;
        });
    });

    document.getElementById('totalCourses').textContent = totalStarted;
    document.getElementById('completedLessons').textContent = totalCompleted;
    const currentStreak = parseInt(localStorage.getItem('streak_' + currentUser) || '0');
    document.getElementById('streakDays').textContent = currentStreak;

    const hours = Math.floor(totalStudyTime / 3600);
    const minutes = Math.floor((totalStudyTime % 3600) / 60);
    document.getElementById('totalTime').textContent = `${hours}h ${minutes}m`;

    updateCharts();

    initDetailedStats();

    if (window.innerWidth <= 768) {
        createMobileStatsCarousel();
        updateMobileStatsCarousel();
    }
}

function updateCharts() {

    // ✅ ADD THIS CODE HERE (at the very top)
    const chartStyle = document.createElement('style');
    chartStyle.id = 'dynamicChartStyles';
    if (document.getElementById('dynamicChartStyles')) {
        document.getElementById('dynamicChartStyles').remove();
    }
    chartStyle.textContent = `
        .chart-container {
            min-height: 450px !important;
            padding: 30px !important;
        }
        .bar-chart {
            min-height: 350px !important;
        }
        @media (max-width: 768px) {
            .chart-container {
                min-height: 350px !important;
                padding: 20px !important;
            }
        }
    `;
    document.head.appendChild(chartStyle);

    // ✅ ADD: Hide all charts first
    document.querySelectorAll('.chart-container').forEach(container => {
        container.classList.remove('active');
    });

    // ✅ ADD: Show only the "All Languages" chart by default
    const allChart = document.getElementById('allBarChart');
    if (allChart) {
        allChart.parentElement.classList.add('active');
    }

    if (currentChartType === 'line') {
        // Render line chart for all languages
        const allData = Object.keys(userProgress).map(lang => ({
            label: lang.toUpperCase(),
            value: calculateAvgProgress(lang)
        }));
        renderLineChart('allBarChart', allData);

        // Render line charts for each language
        Object.keys(userProgress).forEach(lang => {
            const chartData = courses[lang].map(course => ({
                label: course.title.length > 10 ? course.title.substring(0, 10) + '...' : course.title,
                value: userProgress[lang][course.id]?.progress || 0
            }));
            renderLineChart(lang + 'BarChart', chartData);
        });
    } else {
        // Render bar chart for all languages
        allChart.innerHTML = `
            <div class="chart-y-labels">
                <span>100%</span>
                <span>80%</span>
                <span>60%</span>
                <span>40%</span>
                <span>20%</span>
                <span>0%</span>
            </div>
        `;

        Object.keys(userProgress).forEach(lang => {
            const avgProgress = calculateAvgProgress(lang);
            const bar = createBarItem(lang.toUpperCase(), avgProgress);
            allChart.appendChild(bar);
        });

        // Render bar charts for each language
        Object.keys(userProgress).forEach(lang => {
            const chart = document.getElementById(lang + 'BarChart');
            chart.innerHTML = `
                <div class="chart-y-labels">
                    <span>100%</span>
                    <span>80%</span>
                    <span>60%</span>
                    <span>40%</span>
                    <span>20%</span>
                    <span>0%</span>
                </div>
            `;

            courses[lang].forEach(course => {
                const progress = userProgress[lang][course.id]?.progress || 0;
                const bar = createBarItem(course.title, progress);
                chart.appendChild(bar);
            });
        });
    }
}

function createMobileStatsCarousel() {
    const isMobile = window.innerWidth <= 768;
    if (!isMobile) return;

    const dashboard = document.querySelector('.dashboard');
    if (!dashboard) return;

    const statsGrid = document.querySelector('.stats-grid');
    if (!statsGrid) return;

    // Create carousel
    const carousel = document.createElement('div');
    carousel.className = 'mobile-stats-carousel';
    carousel.innerHTML = `
        <div class="stats-carousel-track" id="statsCarouselTrack"></div>
        <div class="stats-carousel-dots" id="statsCarouselDots"></div>
    `;

    // Insert carousel before stats-grid
    statsGrid.parentNode.insertBefore(carousel, statsGrid);

    updateMobileStatsCarousel();
}

function updateMobileStatsCarousel() {
    const track = document.getElementById('statsCarouselTrack');
    const dots = document.getElementById('statsCarouselDots');

    if (!track || !dots) return;

    // Get all stat cards data
    const statsData = [
        {
            icon: '📚',
            value: document.getElementById('totalCourses').textContent,
            label: 'Courses Started'
        },
        {
            icon: '✅',
            value: document.getElementById('completedLessons').textContent,
            label: 'Lessons Completed'
        },
        {
            icon: '🔥',
            value: document.getElementById('streakDays').textContent,
            label: 'Day Streak'
        },
        {
            icon: '⏱️',
            value: document.getElementById('totalTime').textContent,
            label: 'Time Studied'
        }
    ];

    track.innerHTML = '';
    dots.innerHTML = '';

    statsData.forEach((stat, index) => {
        // Create slide
        const slide = document.createElement('div');
        slide.className = 'stats-carousel-slide';
        slide.innerHTML = `
            <div class="stat-card">
                <div class="stat-icon">${stat.icon}</div>
                <div class="stat-value">${stat.value}</div>
                <div class="stat-label">${stat.label}</div>
            </div>
        `;
        track.appendChild(slide);

        // Create dot
        const dot = document.createElement('div');
        dot.className = 'stats-carousel-dot' + (index === 0 ? ' active' : '');
        dot.onclick = () => goToStatsSlide(index);
        dots.appendChild(dot);
    });

    initStatsCarouselSwipe();
}

let currentStatsSlide = 0;
let statsStartX = 0;
let statsIsDragging = false;

function initStatsCarouselSwipe() {
    const track = document.getElementById('statsCarouselTrack');
    if (!track) return;

    track.addEventListener('touchstart', (e) => {
        statsStartX = e.touches[0].clientX;
        statsIsDragging = true;
    });

    track.addEventListener('touchmove', (e) => {
        if (!statsIsDragging) return;
        const currentX = e.touches[0].clientX;
        const diff = statsStartX - currentX;

        if (Math.abs(diff) > 10) {
            e.preventDefault();
        }
    });

    track.addEventListener('touchend', (e) => {
        if (!statsIsDragging) return;
        const endX = e.changedTouches[0].clientX;
        const diff = statsStartX - endX;

        if (Math.abs(diff) > 50) {
            if (diff > 0 && currentStatsSlide < 3) {
                goToStatsSlide(currentStatsSlide + 1);
            } else if (diff < 0 && currentStatsSlide > 0) {
                goToStatsSlide(currentStatsSlide - 1);
            }
        }

        statsIsDragging = false;
    });
}

function goToStatsSlide(index) {
    currentStatsSlide = index;
    const track = document.getElementById('statsCarouselTrack');
    const dots = document.querySelectorAll('.stats-carousel-dot');

    if (track) {
        track.style.transform = `translateX(-${index * 100}%)`;
    }

    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

function calculateAvgProgress(language) {
    const coursesList = Object.keys(userProgress[language]);
    const total = coursesList.reduce((sum, course) => {
        const progress = userProgress[language][course]?.progress || 0;
        return sum + progress;
    }, 0);
    return Math.round(total / coursesList.length);
}

function createBarItem(label, progress) {
    const div = document.createElement('div');
    div.className = 'bar-item';
    div.style.cursor = 'pointer';
    div.style.transition = 'all 0.3s ease';

    const heightPercent = Math.min(progress, 100);

    div.innerHTML = `
        <div class="bar" style="height: 0%; position: relative; transition: all 0.3s ease;" data-target="${heightPercent}">
            <div class="bar-gradient" style="
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(180deg,
                    rgba(100, 255, 218, 0.8) 0%,
                    rgba(102, 126, 234, 0.6) 100%);
                border-radius: 8px 8px 0 0;
                box-shadow:
                    0 -4px 20px rgba(100, 255, 218, 0.4),
                    inset 0 2px 10px rgba(255, 255, 255, 0.2);
            "></div>
            <div class="bar-shine" style="
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 30%;
                background: linear-gradient(180deg,
                    rgba(255, 255, 255, 0.3) 0%,
                    transparent 100%);
                border-radius: 8px 8px 0 0;
            "></div>
            <div class="bar-glow" style="
                position: absolute;
                bottom: -10px;
                left: 50%;
                transform: translateX(-50%);
                width: 120%;
                height: 20px;
                background: radial-gradient(ellipse at center,
                    rgba(100, 255, 218, 0.6) 0%,
                    transparent 70%);
                filter: blur(8px);
            "></div>
            <div class="bar-value" data-target="${progress}" style="
                position: absolute;
                top: -35px;
                left: 50%;
                transform: translateX(-50%);
                color: #64ffda;
                font-weight: 800;
                font-size: 1.1em;
                text-shadow:
                    0 0 10px rgba(100, 255, 218, 0.8),
                    0 2px 4px rgba(0, 0, 0, 0.5);
                white-space: nowrap;
            ">0%</div>
        </div>
        <div class="bar-label" style="
            margin-top: 8px;
            color: #fff;
            font-weight: 600;
            font-size: 0.9em;
            text-align: center;
        ">${label}</div>
    `;

    setTimeout(() => {
        const bar = div.querySelector('.bar');
        const valueEl = div.querySelector('.bar-value');

        // Animate height
        bar.style.transition = 'height 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)';
        bar.style.height = heightPercent + '%';

        // Animate value counter
        let current = 0;
        const increment = Math.max(1, Math.ceil(progress / 50));
        const interval = setInterval(() => {
            current += increment;
            if (current >= progress) {
                current = progress;
                clearInterval(interval);
            }
            valueEl.textContent = current + '%';
        }, 25);
    }, 100);

    // Store data for detail view
    div.dataset.label = label;
    div.dataset.progress = progress;

    // Add click handler for bar detail view
    div.addEventListener('click', function() {
        const parentChart = this.closest('.bar-chart');
        const chartContainer = parentChart.parentElement;
        const allBars = parentChart.querySelectorAll('.bar-item');
        const isMobile = window.innerWidth <= 768;

        // Check if already in detail view
        const isDetailView = chartContainer.querySelector('.bar-detail-view') || document.getElementById('barDetailModal');

        if (isDetailView) return; // Prevent multiple clicks

        // Mobile: Show modal popup
        if (isMobile) {
            const modal = document.createElement('div');
            modal.id = 'barDetailModal';
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.85);
                backdrop-filter: blur(10px);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;

            const modalContent = document.createElement('div');
            modalContent.style.cssText = `
                width: 90%;
                max-width: 400px;
                padding: 40px 30px;
                background: linear-gradient(135deg, rgba(30, 30, 30, 0.95), rgba(40, 40, 40, 0.95));
                border: 2px solid rgba(100, 255, 218, 0.3);
                border-radius: 20px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
                transform: scale(0.9);
                transition: transform 0.3s ease;
            `;

            modalContent.innerHTML = `
                <div style="text-align: center;">
                    <div style="font-size: 3em; margin-bottom: 20px;">📊</div>
                    <div style="color: #fff; font-size: 1.5em; font-weight: 700; margin-bottom: 15px;">${label}</div>
                    <div style="color: #64ffda; font-size: 3.5em; font-weight: 900; margin: 25px 0; text-shadow: 0 0 20px rgba(100, 255, 218, 0.5);">${Math.round(progress)}%</div>
                    <div style="color: #8b949e; font-size: 1.1em; margin-bottom: 25px;">Completed</div>
                    <div style="background: rgba(0,0,0,0.4); height: 14px; border-radius: 14px; overflow: hidden; margin: 25px 0;">
                        <div style="height: 100%; background: linear-gradient(90deg, #667eea, #64ffda); width: ${progress}%; transition: width 1s ease;"></div>
                    </div>
                    <button class="modal-close-btn" style="
                        margin-top: 30px;
                        padding: 14px 40px;
                        background: rgba(100, 255, 218, 0.1);
                        border: 2px solid rgba(100, 255, 218, 0.3);
                        border-radius: 50px;
                        color: #64ffda;
                        font-weight: 600;
                        font-size: 1em;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        width: 100%;
                    ">Close</button>
                </div>
            `;

            modal.appendChild(modalContent);
            document.body.appendChild(modal);

            // Animate in
            setTimeout(() => {
                modal.style.opacity = '1';
                modalContent.style.transform = 'scale(1)';
            }, 10);

            // Close modal on click
            const closeBtn = modalContent.querySelector('.modal-close-btn');
            const closeModal = () => {
                modal.style.opacity = '0';
                modalContent.style.transform = 'scale(0.9)';
                setTimeout(() => modal.remove(), 300);
            };

            closeBtn.addEventListener('click', closeModal);
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModal();
            });

            return;
        }

        // Desktop: Hide other bars with animation
        allBars.forEach(item => {
            if (item !== this) {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                item.style.pointerEvents = 'none';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });

        // Desktop: Slide selected bar to the left (adjusted for better fit)
        setTimeout(() => {
            this.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
            this.style.transform = 'translateX(-30%)'; // Changed from -40% to -30% for better container fit
        }, 300);

        // Create detail view container
        setTimeout(() => {
            const detailView = document.createElement('div');
            detailView.className = 'bar-detail-view';
            detailView.style.cssText = `
                position: absolute;
                right: 0;
                top: 50%;
                transform: translateY(-50%) translateX(20px);
                width: 45%;
                padding: 30px;
                background: linear-gradient(135deg, rgba(100, 255, 218, 0.1), rgba(102, 126, 234, 0.1));
                border: 2px solid rgba(100, 255, 218, 0.3);
                border-radius: 15px;
                opacity: 0;
                transition: all 0.5s ease;
            `;

            detailView.innerHTML = `
                <div style="text-align: center;">
                    <div style="font-size: 2.5em; margin-bottom: 15px;">📊</div>
                    <div style="color: #fff; font-size: 1.5em; font-weight: 700; margin-bottom: 10px;">${label}</div>
                    <div style="color: #64ffda; font-size: 3em; font-weight: 900; margin: 20px 0;">${Math.round(progress)}%</div>
                    <div style="color: #8b949e; font-size: 1.1em; margin-bottom: 20px;">Completed</div>
                    <div style="background: rgba(0,0,0,0.3); height: 12px; border-radius: 12px; overflow: hidden; margin: 20px 0;">
                        <div style="height: 100%; background: linear-gradient(90deg, #667eea, #64ffda); width: ${progress}%; transition: width 1s ease;"></div>
                    </div>
                </div>
            `;

            chartContainer.style.position = 'relative';
            chartContainer.appendChild(detailView);

            // Animate detail view in
            setTimeout(() => {
                detailView.style.opacity = '1';
                detailView.style.transform = 'translateY(-50%) translateX(0)';
            }, 50);
        }, 600);

        // Add back button
        setTimeout(() => {
            let backBtn = chartContainer.querySelector('.bar-back-btn');
            if (!backBtn) {
                backBtn = document.createElement('button');
                backBtn.className = 'bar-back-btn';
                backBtn.innerHTML = '← Back';
                backBtn.style.cssText = `
                    position: absolute;
                    top: 10px;
                    left: 50%;
                    transform: translateX(-50%);
                    padding: 12px 30px;
                    background: rgba(100, 255, 218, 0.1);
                    border: 2px solid rgba(100, 255, 218, 0.3);
                    border-radius: 50px;
                    color: #64ffda;
                    font-weight: 600;
                    font-size: 1em;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    opacity: 0;
                    z-index: 10;
                `;

                backBtn.addEventListener('click', function(e) {
                    e.stopPropagation();

                    // Remove detail view
                    const detailView = chartContainer.querySelector('.bar-detail-view');
                    if (detailView) {
                        detailView.style.opacity = '0';
                        detailView.style.transform = 'translateY(-50%) translateX(20px)';
                        setTimeout(() => detailView.remove(), 300);
                    }

                    // Reset selected bar
                    allBars.forEach(item => {
                        if (item === div) {
                            item.style.transform = 'translateX(0)';
                        }
                    });

                    // Show all bars again
                    setTimeout(() => {
                        allBars.forEach(item => {
                            item.style.display = 'flex';
                            setTimeout(() => {
                                item.style.opacity = '1';
                                item.style.transform = 'scale(1)';
                                item.style.pointerEvents = 'auto';
                            }, 50);
                        });
                    }, 300);

                    // Hide back button
                    this.style.opacity = '0';
                    setTimeout(() => this.remove(), 300);
                });

                backBtn.addEventListener('mouseenter', function() {
                    this.style.background = 'rgba(100, 255, 218, 0.2)';
                    this.style.transform = 'translateX(-50%) translateY(-2px)';
                });

                backBtn.addEventListener('mouseleave', function() {
                    this.style.background = 'rgba(100, 255, 218, 0.1)';
                    this.style.transform = 'translateX(-50%) translateY(0)';
                });

                chartContainer.appendChild(backBtn);

                setTimeout(() => {
                    backBtn.style.opacity = '1';
                }, 50);
            }
        }, 600);
    });

    return div;
}

let currentChartType = 'bar';

function toggleChartType(type) {
    currentChartType = type;

    const barBtn = document.getElementById('barChartBtn');
    const lineBtn = document.getElementById('lineChartBtn');

    if (type === 'bar') {
        barBtn.style.background = 'linear-gradient(135deg, rgba(100, 255, 218, 0.2), rgba(100, 255, 218, 0.1))';
        barBtn.style.borderColor = 'rgba(100, 255, 218, 0.4)';
        barBtn.style.color = '#64ffda';
        lineBtn.style.background = 'rgba(100, 255, 218, 0.05)';
        lineBtn.style.borderColor = 'rgba(100, 255, 218, 0.2)';
        lineBtn.style.color = '#8b949e';
    } else {
        lineBtn.style.background = 'linear-gradient(135deg, rgba(100, 255, 218, 0.2), rgba(100, 255, 218, 0.1))';
        lineBtn.style.borderColor = 'rgba(100, 255, 218, 0.4)';
        lineBtn.style.color = '#64ffda';
        barBtn.style.background = 'rgba(100, 255, 218, 0.05)';
        barBtn.style.borderColor = 'rgba(100, 255, 218, 0.2)';
        barBtn.style.color = '#8b949e';
    }

    // Re-render current chart with new type
    updateCharts();
}

function renderLineChart(chartId, data) {
    const chart = document.getElementById(chartId);
    chart.innerHTML = '';

    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '350px';
    chart.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    canvas.width = chart.offsetWidth;
    canvas.height = 350;

    const padding = 60;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;

    // Draw grid
    ctx.strokeStyle = 'rgba(100, 255, 218, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(canvas.width - padding, y);
        ctx.stroke();

        // Y-axis labels
        ctx.fillStyle = '#8b949e';
        ctx.font = '12px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(`${100 - i * 20}%`, padding - 10, y + 4);
    }

    // Draw line
    if (data.length > 0) {
        const stepX = chartWidth / (data.length - 1 || 1);

        ctx.strokeStyle = '#64ffda';
        ctx.lineWidth = 3;
        ctx.beginPath();

        data.forEach((point, index) => {
            const x = padding + stepX * index;
            const y = padding + chartHeight - (point.value / 100) * chartHeight;

            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });

        ctx.stroke();

        // Draw gradient fill
        const gradient = ctx.createLinearGradient(0, padding, 0, canvas.height - padding);
        gradient.addColorStop(0, 'rgba(100, 255, 218, 0.3)');
        gradient.addColorStop(1, 'rgba(100, 255, 218, 0.05)');

        ctx.lineTo(canvas.width - padding, canvas.height - padding);
        ctx.lineTo(padding, canvas.height - padding);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw points
        data.forEach((point, index) => {
            const x = padding + stepX * index;
            const y = padding + chartHeight - (point.value / 100) * chartHeight;

            ctx.beginPath();
            ctx.arc(x, y, 6, 0, Math.PI * 2);
            ctx.fillStyle = '#64ffda';
            ctx.fill();
            ctx.strokeStyle = '#1a1a1a';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Label
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 11px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(point.label, x, canvas.height - padding + 20);

            // Value
            ctx.fillStyle = '#64ffda';
            ctx.font = 'bold 12px Arial';
            ctx.fillText(`${point.value}%`, x, y - 15);
        });
    }
}

// Switch between Code and Preview tabs in center
function switchCenterTab(tab) {
    const tabs = document.querySelectorAll('.center-tab');
    const codePanel = document.getElementById('codePanel');
    const previewPanel = document.getElementById('previewPanel');

    tabs.forEach(t => t.classList.remove('active'));

    if (tab === 'code') {
        tabs[0].classList.add('active');
        codePanel.style.display = 'flex';
        previewPanel.style.display = 'none';
    } else if (tab === 'preview') {
        tabs[1].classList.add('active');
        codePanel.style.display = 'none';
        previewPanel.style.display = 'flex';

        // Auto-run code when switching to preview
        const codeEditor = document.getElementById('codeEditor');
        if (codeEditor && codeEditor.value.trim()) {
            // Small delay to ensure the preview panel is visible
            setTimeout(() => {
                runCode(true); // Pass true to indicate auto-run
            }, 100);
        }
    }
}

function runCode(isAutoRun = false) {
    const code = document.getElementById('codeEditor').value;
    const language = detectLanguage(code);
    const outputFrame = document.getElementById('outputFrame');
    const consolePanel = document.getElementById('consolePanel');

    // Only clear console if not auto-running (prevents flashing when switching tabs)
    if (!isAutoRun) {
        clearConsole();
        logToConsole(`Running ${language} code...`, 'info');
    }

    // Show console panel
    consolePanel.style.display = 'flex';

    // Only switch to preview tab if not already there (prevents recursive calls)
    if (!isAutoRun) {
        switchCenterTab('preview');
    }

    if (!code.trim()) {
        outputFrame.srcdoc = '<div style="padding: 20px; color: #999; text-align: center;">Write some code and click Run to see results</div>';
        logToConsole('No code to run', 'warn');
        return;
    }

    if (language === 'Python') {
    const encodedCode = btoa(unescape(encodeURIComponent(code)));
    logToConsole('Initializing Python environment...', 'info');

    outputFrame.srcdoc = `<!DOCTYPE html>
<html><head><meta charset="UTF-8">
<style>
body { font-family: Arial; padding: 20px; background: #fff; }
.loading { text-align: center; color: #667eea; font-weight: bold; padding: 20px; }
.loading-spinner { display: inline-block; width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #667eea; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 15px; }
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
.output { background: #f8f9fa; border: 2px solid #e9ecef; border-radius: 8px; padding: 15px; font-family: monospace; white-space: pre-wrap; }
.output-title { font-weight: bold; color: #495057; border-bottom: 2px solid #dee2e6; padding-bottom: 8px; margin-bottom: 10px; }
.output-line { margin: 5px 0; color: #0066cc; }
.error { color: #dc3545; font-weight: bold; background: #fff3cd; border: 1px solid #ffc107; border-radius: 5px; padding: 10px; margin: 10px 0; }
.input-container { margin: 10px 0; display: flex; gap: 10px; }
.input-prompt { color: #495057; font-weight: bold; }
.input-field { flex: 1; padding: 8px 12px; border: 2px solid #667eea; border-radius: 5px; font-family: monospace; font-size: 14px; }
.input-submit { padding: 8px 20px; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; }
.input-submit:hover { background: #5568d3; }
</style>
<script src="https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js"><\/script>
</head><body>
<div class="loading" id="loading"><div class="loading-spinner"></div><div>Loading Python...</div></div>
<div id="output" class="output" style="display:none;"><div class="output-title">🐍 Python Output</div><div id="output-content"></div></div>
<script>
let pyodide;
let inputQueue = [];
let inputResolvers = [];

async function runPython() {
  const outputDiv = document.getElementById("output");
  const outputContent = document.getElementById("output-content");
  const loading = document.getElementById("loading");

  try {
    // Send initial loading message
    window.parent.postMessage({ type: 'log', message: 'Loading Python environment...' }, '*');

    pyodide = await loadPyodide();

    // Hide loading, show output
    loading.style.display = "none";
    outputDiv.style.display = "block";

    window.parent.postMessage({ type: 'log', message: 'Python loaded successfully' }, '*');

    await pyodide.runPythonAsync(\`
import sys
from io import StringIO
sys.stdout = StringIO()
\`);

    // Create custom input function
    window.js_input = (prompt) => {
      return new Promise((resolve) => {
        const inputContainer = document.createElement("div");
        inputContainer.className = "input-container";

        const promptSpan = document.createElement("span");
        promptSpan.className = "input-prompt";
        promptSpan.textContent = prompt || "Input: ";

        const inputField = document.createElement("input");
        inputField.className = "input-field";
        inputField.type = "text";
        inputField.placeholder = "Enter value here...";

        const submitBtn = document.createElement("button");
        submitBtn.className = "input-submit";
        submitBtn.textContent = "Submit";

        const handleSubmit = () => {
          const value = inputField.value;
          inputContainer.remove();

          const outputLine = document.createElement("div");
          outputLine.className = "output-line";
          outputLine.textContent = "▶ " + prompt + value;
          outputContent.appendChild(outputLine);

          resolve(value);
        };

        submitBtn.onclick = handleSubmit;
        inputField.onkeypress = (e) => {
          if (e.key === "Enter") handleSubmit();
        };

        inputContainer.appendChild(promptSpan);
        inputContainer.appendChild(inputField);
        inputContainer.appendChild(submitBtn);
        outputContent.appendChild(inputContainer);

        inputField.focus();
      });
    });

    await pyodide.runPythonAsync(\`
def input(prompt=""):
    from js import js_input
    return js_input(prompt)
\`);

    const userCodeBase64 = "${encodedCode}";
    const decodedCode = decodeURIComponent(escape(atob(userCodeBase64)));

    window.parent.postMessage({ type: 'log', message: 'Executing code...' }, '*');

    // Execute code with automatic expression printing (like interactive Python)
    try {
      const result = await pyodide.runPythonAsync(\`
import ast
import sys

user_code = """${decodedCode.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n')}"""

# Parse and execute code
tree = ast.parse(user_code, mode='exec')

# Check if last statement is an expression
if tree.body and isinstance(tree.body[-1], ast.Expr):
    # Split into statements and last expression
    if len(tree.body) > 1:
        exec_tree = ast.Module(body=tree.body[:-1], type_ignores=[])
        exec(compile(exec_tree, '<string>', 'exec'), globals())

    # Evaluate and print last expression if not None
    last_expr = tree.body[-1]
    result = eval(compile(ast.Expression(body=last_expr.value), '<string>', 'eval'), globals())
    if result is not None:
        print(result)
else:
    # Execute normally if last line is not an expression
    exec(compile(tree, '<string>', 'exec'), globals())
\`);
    } catch (e) {
      // If the smart execution fails, fall back to regular execution
      await pyodide.runPythonAsync(decodedCode);
    }

    const output = pyodide.runPython("sys.stdout.getvalue()");
    if (output) {
      output.split("\\n").forEach(line => {
        if (line.trim()) {
          const lineDiv = document.createElement("div");
          lineDiv.className = "output-line";
          lineDiv.textContent = "▶ " + line;
          outputContent.appendChild(lineDiv);
        }
      });
      window.parent.postMessage({ type: 'log', message: 'Code executed successfully' }, '*');
    } else if (!outputContent.querySelector(".input-container") && !outputContent.querySelector(".output-line")) {
      const successMsg = "Program executed successfully (no output)";
      outputContent.innerHTML = "<div class='output-line'>" + successMsg + "</div>";
      window.parent.postMessage({ type: 'log', message: successMsg }, '*');
    }

  } catch (error) {
    loading.style.display = "none";
    outputDiv.style.display = "block";
    const errorMsg = error.message || error.toString();
    window.parent.postMessage({ type: 'error', message: errorMsg }, '*');
    outputContent.innerHTML += "<div class='error'>Error: " + errorMsg + "</div>";
  }
}
runPython();
<\/script>
</body></html>`;
    return;
}

    if (language === 'HTML') {
        outputFrame.srcdoc = code;
        logToConsole('HTML rendered successfully', 'log');
        return;
    }

    if (language === 'CSS') {
        outputFrame.srcdoc = `<!DOCTYPE html>
<html><head><meta charset="UTF-8">
<style>${code}</style>
</head><body>
<h1>CSS Applied</h1>
<p>Your CSS styles are loaded. Add some HTML to see the effects!</p>
<div class="box">Sample Box</div>
</body></html>`;
        logToConsole('CSS loaded successfully', 'log');
        return;
    }

    const escapedCode = code.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');

    const jsHTML = `<!DOCTYPE html>
<html><head><meta charset="UTF-8">
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: Arial; padding: 20px; background: #fff; color: #333; line-height: 1.6; }
.console-output { background: #f8f9fa; border: 2px solid #e9ecef; border-radius: 8px; padding: 15px; margin-top: 20px; font-family: monospace; white-space: pre-wrap; }
.console-log { color: #0066cc; margin: 5px 0; padding: 3px 0; }
.console-error { color: #dc3545; margin: 5px 0; padding: 3px 0; font-weight: bold; }
.console-title { font-weight: bold; color: #495057; border-bottom: 2px solid #dee2e6; padding-bottom: 8px; margin-bottom: 10px; }
</style>
</head><body>
<div id="output"></div>
<div id="console" class="console-output" style="display:none;">
  <div class="console-title">📟 Console Output</div>
  <div id="console-content"></div>
</div>
<script>
const originalLog = console.log;
console.log = function(...args) {
  const logMsg = args.map(arg => typeof arg === "object" ? JSON.stringify(arg, null, 2) : String(arg)).join(" ");
  window.parent.postMessage({type: 'log', message: logMsg}, '*');
  originalLog.apply(console, args);
};
const originalError = console.error;
console.error = function(...args) {
  const errorMsg = args.join(" ");
  window.parent.postMessage({type: 'error', message: errorMsg}, '*');
  originalError.apply(console, args);
};
window.onerror = function(msg, url, line) {
  window.parent.postMessage({type: 'error', message: "Error: " + msg + (line ? " (Line " + line + ")" : "")}, '*');
  return true;
};
try {
  ${escapedCode}
  window.parent.postMessage({type: 'log', message: 'Code executed successfully'}, '*');
} catch(e) {
  window.parent.postMessage({type: 'error', message: e.message}, '*');
}
<\/script>
</body></html>`;

    outputFrame.srcdoc = jsHTML;
    logToConsole('JavaScript code loaded', 'log');
}

function detectLanguage(code) {
    if (!code || code.trim().length === 0) {
        return 'None';
    }

    const trimmedCode = code.trim();
    const lowerCode = trimmedCode.toLowerCase(); // IMPORTANT: Use this for ALL checks

    // HTML Detection
    if (/^<!doctype/i.test(lowerCode) || // CHANGED: Use lowerCode
        /^<html/i.test(lowerCode) ||
        /<html[\s>]/i.test(lowerCode) ||
        /<head>/i.test(lowerCode) ||
        /<body>/i.test(lowerCode) ||
        (/<div/i.test(lowerCode) && /<\/div>/i.test(lowerCode)) ||
        (/<p>/i.test(lowerCode) && /<\/p>/i.test(lowerCode)) ||
        /<h[1-6]>/i.test(lowerCode)) {
        return 'HTML';
    }

    // CSS Detection - IMPROVED
    if (/^\s*[\w-#.]+\s*\{[\s\S]*\}/m.test(lowerCode) || // Use lowerCode
        /@media|@keyframes/i.test(lowerCode) ||
        /body\s*\{|\.[\w-]+\s*\{|#[\w-]+\s*\{/i.test(lowerCode)) {
        return 'CSS';
    }

    // Python Detection - ALL lowercase checks
    if (/\bdef\s+\w+\s*\(/i.test(lowerCode) ||
        /\bprint\s*\(/i.test(lowerCode) ||
        /\bimport\s+\w+/i.test(lowerCode) ||
        /\bfrom\s+\w+\s+import/i.test(lowerCode) ||
        /\binput\s*\(/i.test(lowerCode) ||
        /\bint\s*\(/i.test(lowerCode) ||
        /\bstr\s*\(/i.test(lowerCode) ||
        /\blen\s*\(/i.test(lowerCode) ||
        /\brange\s*\(/i.test(lowerCode) ||
        /\belif\b/i.test(lowerCode) ||
        /^\s*#[^<]/m.test(code) ||
        /:$/m.test(trimmedCode)) {
        return 'Python';
    }

    // JavaScript Detection
    if (/\bfunction\s+\w+\s*\(/i.test(lowerCode) ||
        /\b(const|let|var)\s+\w+/i.test(lowerCode) ||
        /=>/i.test(code) ||
        /console\.log/i.test(lowerCode) ||
        /document\./i.test(lowerCode)) {
        return 'JavaScript';
    }

    return 'Unknown';
}
window.addEventListener('message', (e) => {
    if (e.data.type === 'log' || e.data.type === 'error') {
        logToConsole(e.data.data, e.data.type);
    }
});

// Console Management
let lastErrorMessage = '';

function logToConsole(message, type = 'log') {
    const consoleContent = document.getElementById('consoleContent');
    const messageDiv = document.createElement('div');
    messageDiv.className = `console-message ${type}`;

    const timestamp = new Date().toLocaleTimeString();

    // Add compact error button for error messages
    if (type === 'error') {
        const errorId = 'error-' + Math.random().toString(36).substr(2, 9);
        lastErrorMessage = message;

        // Truncate long error messages
        const shortMessage = message.length > 80 ? message.substring(0, 80) + '...' : message;

        messageDiv.innerHTML = `
            <span style="color: #8b949e; margin-right: 10px;">[${timestamp}]</span>
            <span class="error-message-text" id="${errorId}">${shortMessage}</span>
            <button class="error-button-compact" onclick="showErrorPopup('${errorId}', \`${message.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`)">
                ⚠️ Error
            </button>
        `;
    } else {
        messageDiv.innerHTML = `<span style="color: #8b949e; margin-right: 10px;">[${timestamp}]</span>${message}`;
    }

    consoleContent.appendChild(messageDiv);
    consoleContent.scrollTop = consoleContent.scrollHeight;
}

function clearConsole() {
    const consoleContent = document.getElementById('consoleContent');
    consoleContent.innerHTML = '<div class="console-message info">Console cleared.</div>';
}

// Error Popup Functions
function showErrorPopup(errorId, errorMessage) {
    const modal = document.getElementById('errorPopupModal');
    const body = document.getElementById('errorPopupBody');

    body.textContent = errorMessage;
    lastErrorMessage = errorMessage;
    modal.classList.add('active');
}

function closeErrorPopup() {
    const modal = document.getElementById('errorPopupModal');
    modal.classList.remove('active');
}

// Language Conversion Functions
function showLanguageConverter() {
    const converter = document.getElementById('languageConverter');
    converter.style.display = converter.style.display === 'none' ? 'block' : 'none';
}

async function convertLanguage(targetLang) {
    const code = document.getElementById('codeEditor').value;

    if (!code.trim()) {
        addAIMessage('Please write some code first!', 'assistant');
        return;
    }

    const currentLang = detectLanguage(code);
    const langNames = {
        python: 'Python',
        javascript: 'JavaScript',
        java: 'Java',
        cpp: 'C++',
        csharp: 'C#',
        go: 'Go',
        rust: 'Rust',
        php: 'PHP'
    };

    const targetLangName = langNames[targetLang] || targetLang;
    const currentLangName = langNames[currentLang] || currentLang;

    // Hide converter
    document.getElementById('languageConverter').style.display = 'none';

    // Show message
    addAIMessage(`🔄 Converting ${currentLangName} code to ${targetLangName}...`, 'user');

    // Show typing indicator
    const typingId = addTypingIndicator();

    try {
        const prompt = `Convert this ${currentLangName} code to ${targetLangName}. Provide ONLY the converted code without any explanation. Maintain the same functionality and logic.\n\nCode to convert:\n${code}`;

        if (isAgentMode) {
            // Agent Mode: Convert and apply directly
            const response = await callMistralAI(prompt, code, true);
            removeTypingIndicator(typingId);

            let newCode = response.replace(/```[\w]*\n?/g, '').trim();
            await applyCodeWithAnimation(newCode, `converted to ${targetLangName}`);

            // Update language detection
            document.getElementById('detectedLang').textContent = targetLangName;
        } else {
            // Normal Mode: Show converted code
            const response = await callMistralAI(prompt, code, false);
            removeTypingIndicator(typingId);
            addAIMessage(`Here's your code converted to ${targetLangName}:\n\n${response}`, 'assistant');
        }
    } catch (error) {
        removeTypingIndicator(typingId);
        addAIMessage('Sorry, I encountered an error converting your code. Please try again.', 'assistant');
    }
}

// Right Panel Management
function toggleAISidebar() {
    const aiSidebar = document.getElementById('aiSidebar');
    const container = document.querySelector('.playground-container');

    if (aiSidebar.classList.contains('active')) {
        closeAISidebar();
    } else {
        aiSidebar.classList.add('active');
        container.classList.add('with-ai');

        // Add neural nodes animation
        if (!aiSidebar.querySelector('.neural-nodes')) {
            const neuralNodes = document.createElement('div');
            neuralNodes.className = 'neural-nodes';

            // Create 12 neural nodes
            for (let i = 0; i < 12; i++) {
                const node = document.createElement('div');
                node.className = 'neural-node';
                node.style.left = Math.random() * 100 + '%';
                node.style.top = Math.random() * 100 + '%';
                node.style.animationDelay = Math.random() * 4 + 's';
                node.style.animationDuration = (6 + Math.random() * 4) + 's';
                neuralNodes.appendChild(node);
            }

            aiSidebar.appendChild(neuralNodes);
        }
    }
}

function closeAISidebar() {
    const aiSidebar = document.getElementById('aiSidebar');
    const container = document.querySelector('.playground-container');

    aiSidebar.classList.remove('active');
    container.classList.remove('with-ai');
}

// Agent Mode Functions
let isAgentMode = false;

function toggleAgentMode() {
    const toggle = document.getElementById('agentModeToggle');
    isAgentMode = toggle.checked;

    if (isAgentMode) {
        addAIMessage('🤖 Agent Mode Activated! I can now modify your code directly. Just ask me to fix, improve, or write code for you!', 'assistant');
    } else {
        addAIMessage('✨ Agent Mode Deactivated. I\'m back to suggestion mode.', 'assistant');
    }
}

async function applyCodeWithAnimation(newCode, description) {
    const editor = document.getElementById('codeEditor');
    const aiSidebar = document.getElementById('aiSidebar');
    const currentCode = editor.value;

    // Show "Thinking..." animation in editor
    await showThinkingAnimation();

    // Show "Trying to implement..." message
    const implementMsg = addAIMessage(`🔧 Trying to implement: ${description}...`, 'assistant');

    // Wait a bit to simulate thinking
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Smoothly minimize the AI sidebar on mobile while code is being typed
    const isMobile = window.innerWidth <= 768;
    if (isMobile && aiSidebar.classList.contains('active')) {
        aiSidebar.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        aiSidebar.style.opacity = '0.3';
        aiSidebar.style.transform = 'scale(0.95)';
    }

    // Clear editor
    editor.value = '';

    // Type out new code with animation (faster on mobile)
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const baseDelay = isMobileDevice ? 3 : 8;

    for (let i = 0; i < newCode.length; i++) {
        editor.value += newCode[i];
        editor.scrollTop = editor.scrollHeight;

        // Variable speed typing for more natural feel
        const delay = newCode[i] === '\n' ? 5 : (Math.random() * baseDelay + 2);
        await new Promise(resolve => setTimeout(resolve, delay));
    }

    // Restore AI sidebar after code typing is done
    if (isMobile && aiSidebar.classList.contains('active')) {
        aiSidebar.style.opacity = '1';
        aiSidebar.style.transform = 'scale(1)';
        // Remove inline styles after transition
        setTimeout(() => {
            aiSidebar.style.transition = '';
            aiSidebar.style.opacity = '';
            aiSidebar.style.transform = '';
        }, 300);
    }

    // Update language detection
    const language = detectLanguage(newCode);
    document.getElementById('detectedLang').textContent = language;
    updateAISuggestions(language);

    // Show completion message
    addAIMessage(`✅ Code updated successfully! I've ${description}.`, 'assistant');
}

async function showThinkingAnimation() {
    const editor = document.getElementById('codeEditor');
    const overlay = document.createElement('div');
    overlay.className = 'thinking-overlay';
    overlay.innerHTML = `
        <div class="thinking-content">
            <div class="thinking-spinner"></div>
            <div class="thinking-text">🧠 Analyzing your code...</div>
        </div>
    `;

    editor.parentElement.appendChild(overlay);

    await new Promise(resolve => setTimeout(resolve, 500));

    overlay.remove();
}

// AI Assistant Functions
async function sendAIMessage() {
    const input = document.getElementById('aiInput');
    const message = input.value.trim();

    if (!message) return;

    // Add user message
    addAIMessage(message, 'user');
    input.value = '';

    // Show typing indicator
    const typingId = addTypingIndicator();

    // Get code context
    const code = document.getElementById('codeEditor').value;

    try {
        if (isAgentMode && code.trim()) {
            // Agent Mode: AI modifies code directly
            const response = await callMistralAI(
                `${message}\n\nCurrent code:\n${code}\n\nPlease provide ONLY the complete corrected/improved code without any explanation. Start your response with the code directly.`,
                code,
                true
            );
            removeTypingIndicator(typingId);

            // Extract code from response
            let newCode = response;
            // Remove code block markers if present
            newCode = newCode.replace(/```[\w]*\n?/g, '').trim();

            // Apply code with animation
            await applyCodeWithAnimation(newCode, message);
        } else {
            // Normal Mode: AI provides suggestions
            const response = await callMistralAI(message, code, false);
            removeTypingIndicator(typingId);
            addAIMessage(response, 'assistant');
        }
    } catch (error) {
        removeTypingIndicator(typingId);
        addAIMessage('Sorry, I encountered an error. Please try again.', 'assistant');
        logToConsole('AI Error: ' + error.message, 'error');
    }
}

async function sendAISuggestion(type) {
    const code = document.getElementById('codeEditor').value;

    if (!code.trim()) {
        addAIMessage('Please write some code first!', 'assistant');
        return;
    }

    const language = detectLanguage(code);
    let question = '';
    let displayText = '';
    let description = '';

    switch(type) {
        case 'explain':
            displayText = '💡 What does this code do?';
            question = `Please explain what this ${language} code does in simple terms. Provide a clear, beginner-friendly explanation:\n\n${code}`;
            break;
        case 'debug':
            displayText = '🐛 Debug my code';
            description = 'fixed bugs and errors';
            if (isAgentMode) {
                question = `Please fix all bugs and errors in this ${language} code. Provide ONLY the complete corrected code without any explanation:\n\n${code}`;
            } else {
                question = `Please analyze this ${language} code for any bugs, errors, or potential issues. Provide specific fixes with code examples:\n\n${code}`;
            }
            break;
        case 'improve':
            displayText = '⚡ Improve my code';
            description = 'improved the code with best practices';
            if (isAgentMode) {
                question = `Please improve this ${language} code with best practices, better performance, and readability. Provide ONLY the complete improved code without any explanation:\n\n${code}`;
            } else {
                question = `Please suggest improvements for this ${language} code. Focus on best practices, performance, and readability. Provide specific code examples:\n\n${code}`;
            }
            break;
    }

    // Highlight code with animation
    highlightCode();

    // Animate suggestion text into input
    await animateTextToInput(displayText);

    // Add user message
    addAIMessage(displayText, 'user');

    // Show typing indicator
    const typingId = addTypingIndicator();

    try {
        if (isAgentMode && type !== 'explain') {
            // Agent Mode: Apply code changes directly
            const response = await callMistralAI(question, code, true);
            removeTypingIndicator(typingId);

            // Extract code from response
            let newCode = response;
            newCode = newCode.replace(/```[\w]*\n?/g, '').trim();

            // Apply code with animation
            await applyCodeWithAnimation(newCode, description);
        } else {
            // Normal Mode: Provide suggestions
            const response = await callMistralAI(question, code, false);
            removeTypingIndicator(typingId);
            addAIMessage(response, 'assistant');
        }
    } catch (error) {
        removeTypingIndicator(typingId);
        addAIMessage('Sorry, I encountered an error. Please try again.', 'assistant');
        logToConsole('AI Error: ' + error.message, 'error');
    }
}

function highlightCode() {
    const editor = document.getElementById('codeEditor');
    editor.classList.add('code-highlight');

    setTimeout(() => {
        editor.classList.remove('code-highlight');
    }, 1500);
}

async function animateTextToInput(text) {
    const input = document.getElementById('aiInput');
    input.value = '';

    // Smooth typing animation
    for (let i = 0; i < text.length; i++) {
        input.value += text[i];
        await new Promise(resolve => setTimeout(resolve, 30));
    }

    await new Promise(resolve => setTimeout(resolve, 300));
    input.value = '';
}

function addAIMessage(content, role) {
    const messagesContainer = document.getElementById('aiMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `ai-message ${role}`;

    const avatar = role === 'assistant' ? '✨' : '👤';

    // Format content with code blocks
    const formattedContent = formatAIContent(content);

    messageDiv.innerHTML = `
        <div class="message-avatar">${avatar}</div>
        <div class="message-content">${formattedContent}</div>
    `;

    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function formatAIContent(content) {
    // Convert markdown-style code blocks to HTML with copy button
    content = content.replace(/```(\w+)?\n([\s\S]*?)```/g, function(match, lang, code) {
        const codeId = 'code-' + Math.random().toString(36).substr(2, 9);
        return `<div class="code-block-wrapper">
            <button class="code-copy-btn" onclick="copyCodeToClipboard('${codeId}', this)">📋 Copy</button>
            <pre><code id="${codeId}">${code.trim()}</code></pre>
        </div>`;
    });

    content = content.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Convert line breaks to paragraphs
    const paragraphs = content.split('\n\n');
    return paragraphs.map(p => p.trim() ? `<p>${p.replace(/\n/g, '<br>')}</p>` : '').join('');
}

// Function to copy code to clipboard
function copyCodeToClipboard(codeId, button) {
    const codeElement = document.getElementById(codeId);
    if (!codeElement) return;

    const code = codeElement.textContent;

    navigator.clipboard.writeText(code).then(() => {
        button.textContent = '✓ Copied!';
        button.classList.add('copied');

        setTimeout(() => {
            button.textContent = '📋 Copy';
            button.classList.remove('copied');
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy code:', err);
        button.textContent = '✗ Failed';
        setTimeout(() => {
            button.textContent = '📋 Copy';
        }, 2000);
    });
}

function addTypingIndicator() {
    const messagesContainer = document.getElementById('aiMessages');
    const typingDiv = document.createElement('div');
    const typingId = 'typing-' + Date.now();
    typingDiv.id = typingId;
    typingDiv.className = 'ai-message assistant';
    typingDiv.innerHTML = `
        <div class="message-avatar">✨</div>
        <div class="message-content">
            <p style="color: #8b949e;"><em>Thinking...</em></p>
        </div>
    `;

    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    return typingId;
}

function removeTypingIndicator(typingId) {
    const typingDiv = document.getElementById(typingId);
    if (typingDiv) typingDiv.remove();
}

// Mistral AI Integration
async function callMistralAI(userMessage, codeContext) {
    // Get Mistral API key from environment/config
    const apiKey = await getMistralAPIKey(); // ← ADD "await" here!

    if (!apiKey) {
        return 'API key not configured. Please add your Mistral AI API key to continue.';
    }

    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'mistral-small-latest',
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful coding assistant. Provide clear, concise, and accurate responses about code. When writing HTML code, always use proper indentation and structure with 2-space indentation. Format all code snippets using markdown code blocks with ```language```. For HTML, include proper doctype, head, body tags and well-structured markup with semantic elements. Make code readable and well-formatted.'
                },
                {
                    role: 'user',
                    content: userMessage
                }
            ],
            temperature: 0.7,
            max_tokens: 1000
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Mistral API error:', response.status, errorText);
        throw new Error('AI service error: ' + response.statusText);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

async function getMistralAPIKey() {
    // Try to fetch API key from server environment variable
    try {
        console.log('🔍 Fetching API key from /api/ai-config...');
        const response = await fetch('/api/ai-config');

        if (response.ok) {
            const data = await response.json();
            if (data.MISTRAL_API_KEY) {
                return data.MISTRAL_API_KEY;
            } else {
                console.error('❌ No MISTRAL_API_KEY in response');
            }
        } else {
            console.error('❌ Failed to fetch from /api/ai-config:', response.status);
        }
    } catch (error) {
        console.error('❌ Failed to fetch API key from server:', error);
    }

    // Fallback to localStorage if server fetch fails
    let apiKey = localStorage.getItem('mistral_api_key');

    // Only prompt as last resort (shouldn't happen with env variable)
    if (!apiKey) {
        console.warn('⚠️ API key not found in environment or localStorage');
        apiKey = prompt('Please enter your Mistral AI API key:');
        if (apiKey) {
            localStorage.setItem('mistral_api_key', apiKey);
        }
    }

    return apiKey;
}

// Handle Enter key in AI input
document.addEventListener('DOMContentLoaded', () => {
    const aiInput = document.getElementById('aiInput');
    if (aiInput) {
        aiInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendAIMessage();
            }
        });

        // Auto-resize textarea
        aiInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 120) + 'px';
        });
    }

    // Listen for messages from iframe (errors and logs)
    window.addEventListener('message', (event) => {
        if (event.data && event.data.type) {
            if (event.data.type === 'error') {
                logToConsole(event.data.message, 'error');
            } else if (event.data.type === 'log') {
                logToConsole(event.data.message, 'log');
            }
        }
    });
});

function toggleSetting(element) {
    element.classList.toggle('active');
}

function resetProgress() {
    if (confirm('Are you sure? This will delete all your progress!')) {
        Object.keys(userProgress).forEach(lang => {
            Object.keys(userProgress[lang]).forEach(course => {
                userProgress[lang][course] = { completed: false, progress: 0, time: 0 };
            });
        });
        totalStudyTime = 0;

        localStorage.setItem('progress_' + currentUser, JSON.stringify(userProgress));
        localStorage.setItem('studyTime_' + currentUser, '0');

        renderCourses();update

        updateDashboard();
        alert('✅ Progress reset successfully!');
    }
}

// Add this function with your other CSS injection functions
function injectGoalsCSS() {
    if (document.getElementById('goalsListCSS')) return; // Already injected

    const style = document.createElement('style');
    style.id = 'goalsListCSS';
    style.textContent = `
.goals-list-modal {
display: none;
position: fixed;
top: 0;
left: 0;
width: 100%;
height: 100%;
background: rgba(0, 0, 0, 0.85);
backdrop-filter: blur(10px);
-webkit-backdrop-filter: blur(10px);
z-index: 10000;
justify-content: center;
align-items: center;
opacity: 0;
transition: opacity 0.3s ease;
padding: 20px;
overflow-y: auto;
}
.goals-list-modal.active {
display: flex;
opacity: 1;
}
.goals-list-content {
background: rgba(30, 30, 30, 0.98);
backdrop-filter: blur(20px);
-webkit-backdrop-filter: blur(20px);
border: 2px solid rgba(100, 255, 218, 0.3);
border-radius: 20px;
padding: 30px;
max-width: 700px;
width: 100%;
max-height: 90vh;
overflow-y: auto;
transform: scale(0.9);
transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
box-shadow: 0 20px 60px rgba(100, 255, 218, 0.3);
}
.goals-list-modal.active .goals-list-content {
transform: scale(1);
}
.goal-card {
background: rgba(100, 255, 218, 0.05);
border: 2px solid rgba(100, 255, 218, 0.2);
border-radius: 15px;
padding: 20px;
margin-bottom: 15px;
cursor: pointer;
transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
position: relative;
overflow: hidden;
}
.goal-card::before {
content: '';
position: absolute;
top: 0;
left: -100%;
width: 100%;
height: 100%;
background: linear-gradient(90deg, transparent, rgba(100, 255, 218, 0.1), transparent);
transition: left 0.5s ease;
}
.goal-card:hover::before {
left: 100%;
}
.goal-card:hover {
background: rgba(100, 255, 218, 0.1);
border-color: rgba(100, 255, 218, 0.4);
transform: translateY(-3px);
box-shadow: 0 8px 24px rgba(100, 255, 218, 0.3);
}
.goal-card:active {
transform: translateY(-1px);
}
.goal-card.active-goal {
border-color: rgba(100, 255, 218, 0.6);
background: rgba(100, 255, 218, 0.12);
box-shadow: 0 4px 16px rgba(100, 255, 218, 0.2);
}
.goal-card.active-goal::after {
content: '';
position: absolute;
top: 0;
right: 0;
width: 0;
height: 0;
border-style: solid;
border-width: 0 50px 50px 0;
border-color: transparent rgba(100, 255, 218, 0.3) transparent transparent;
}
.goal-card-header {
display: flex;
justify-content: space-between;
align-items: center;
margin-bottom: 15px;
position: relative;
z-index: 1;
}
.goal-card-title {
font-size: 1.3em;
font-weight: 700;
color: #fff;
display: flex;
align-items: center;
gap: 10px;
}
.goal-card-badge {
padding: 4px 12px;
border-radius: 20px;
font-size: 0.75em;
font-weight: 600;
white-space: nowrap;
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}
.badge-active {
background: rgba(100, 255, 218, 0.2);
color: #64ffda;
border: 1px solid rgba(100, 255, 218, 0.4);
animation: badgePulse 2s ease-in-out infinite;
}
@keyframes badgePulse {
0%, 100% {
box-shadow: 0 2px 8px rgba(100, 255, 218, 0.2);
}
50% {
box-shadow: 0 2px 16px rgba(100, 255, 218, 0.4);
}
}
.badge-completed {
background: rgba(0, 255, 0, 0.2);
color: #00ff00;
border: 1px solid rgba(0, 255, 0, 0.4);
}
.badge-paused {
background: rgba(255, 193, 7, 0.2);
color: #ffc107;
border: 1px solid rgba(255, 193, 7, 0.4);
}
.goal-card-stats {
display: grid;
grid-template-columns: repeat(3, 1fr);
gap: 15px;
margin-bottom: 15px;
position: relative;
z-index: 1;
}
.goal-stat {
text-align: center;
padding: 10px;
background: rgba(0, 0, 0, 0.2);
border-radius: 10px;
border: 1px solid rgba(100, 255, 218, 0.1);
transition: all 0.3s ease;
}
.goal-card:hover .goal-stat {
background: rgba(0, 0, 0, 0.3);
border-color: rgba(100, 255, 218, 0.2);
}
.goal-stat-value {
font-size: 1.5em;
font-weight: 700;
color: #64ffda;
text-shadow: 0 0 10px rgba(100, 255, 218, 0.3);
}
.goal-stat-label {
font-size: 0.8em;
color: #8b949e;
margin-top: 5px;
}
.goal-card-courses {
display: flex;
flex-wrap: wrap;
gap: 8px;
position: relative;
z-index: 1;
}
.goal-course-chip {
display: inline-flex;
align-items: center;
gap: 6px;
padding: 6px 12px;
background: rgba(102, 126, 234, 0.15);
border: 1px solid rgba(102, 126, 234, 0.3);
border-radius: 20px;
font-size: 0.85em;
color: #fff;
transition: all 0.3s ease;
}
.goal-card:hover .goal-course-chip {
background: rgba(102, 126, 234, 0.25);
border-color: rgba(102, 126, 234, 0.5);
}
.goals-list-content::-webkit-scrollbar {
width: 8px;
}
.goals-list-content::-webkit-scrollbar-track {
background: rgba(100, 255, 218, 0.05);
border-radius: 10px;
}
.goals-list-content::-webkit-scrollbar-thumb {
background: rgba(100, 255, 218, 0.3);
border-radius: 10px;
transition: all 0.3s ease;
}
.goals-list-content::-webkit-scrollbar-thumb:hover {
background: rgba(100, 255, 218, 0.5);
}
.goals-empty-state {
text-align: center;
padding: 60px 20px;
color: #8b949e;
}
.goals-empty-state-icon {
font-size: 5em;
margin-bottom: 20px;
opacity: 0.5;
}
.goals-empty-state-text {
font-size: 1.2em;
font-weight: 600;
margin-bottom: 10px;
}
@media (max-width: 768px) {
.goals-list-content {
padding: 20px;
max-height: 85vh;
}
.goal-card {
padding: 15px;
}
.goal-card-title {
font-size: 1.1em;
}
.goal-card-stats {
grid-template-columns: repeat(3, 1fr);
gap: 10px;
}
.goal-stat {
padding: 8px;
}
.goal-stat-value {
font-size: 1.3em;
}
.goal-stat-label {
font-size: 0.75em;
}
.goal-course-chip {
font-size: 0.8em;
padding: 5px 10px;
}
.goal-card-badge {
font-size: 0.7em;
padding: 3px 10px;
}
}
@media (max-width: 480px) {
.goals-list-modal {
padding: 10px;
}
.goals-list-content {
padding: 15px;
}
.goal-card {
padding: 12px;
margin-bottom: 12px;
}
.goal-card-header {
flex-direction: column;
align-items: flex-start;
gap: 8px;
}
.goal-card-stats {
gap: 8px;
}
}
@keyframes goalCardSlideIn {
from {
opacity: 0;
transform: translateY(20px);
}
to {
opacity: 1;
transform: translateY(0);
}
}
.goal-card {
animation: goalCardSlideIn 0.4s ease forwards;
}
.goal-card:nth-child(1) { animation-delay: 0.05s; }
.goal-card:nth-child(2) { animation-delay: 0.1s; }
.goal-card:nth-child(3) { animation-delay: 0.15s; }
.goal-card:nth-child(4) { animation-delay: 0.2s; }
.goal-card:nth-child(5) { animation-delay: 0.25s; }
@keyframes shimmer {
0% {
background-position: -1000px 0;
}
100% {
background-position: 1000px 0;
}
}
.goals-loading {
background: linear-gradient(
90deg,
rgba(100, 255, 218, 0.05) 0%,
rgba(100, 255, 218, 0.1) 50%,
rgba(100, 255, 218, 0.05) 100%
);
background-size: 1000px 100%;
animation: shimmer 2s infinite;
}
`;

    document.head.appendChild(style);
}

// Add this function near the top of your script (after the global variables)
function injectSplashScreenCSS() {
    if (document.getElementById('splashScreenCSS')) return; // Already injected

    const style = document.createElement('style');
    style.id = 'splashScreenCSS';
    style.textContent = `
.update-splash {
position: fixed;
top: 0;
left: 0;
width: 100%;
height: 100%;
background: rgba(0, 0, 0, 0.95);
backdrop-filter: blur(10px);
-webkit-backdrop-filter: blur(10px);
display: none;
justify-content: center;
align-items: center;
z-index: 10000;
opacity: 0;
transition: opacity 0.4s ease;
padding: 20px;
}
.update-splash.active {
display: flex;
opacity: 1;
}
.splash-content {
background: rgba(30, 30, 30, 0.95);
backdrop-filter: blur(30px);
-webkit-backdrop-filter: blur(30px);
border: 2px solid rgba(100, 255, 218, 0.3);
border-radius: 25px;
padding: 50px 40px;
max-width: 550px;
width: 100%;
text-align: center;
transform: scale(0.9);
transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
box-shadow:
0 20px 60px rgba(0, 0, 0, 0.5),
0 0 100px rgba(100, 255, 218, 0.2);
position: relative;
overflow: hidden;
}
.update-splash.active .splash-content {
transform: scale(1);
}
.splash-content::before {
content: '';
position: absolute;
top: -50%;
left: -50%;
width: 200%;
height: 200%;
background: linear-gradient(45deg,
transparent 0%,
rgba(100, 255, 218, 0.05) 50%,
transparent 100%);
animation: splashShimmer 3s ease-in-out infinite;
pointer-events: none;
}
@keyframes splashShimmer {
0%, 100% { transform: translate(0, 0) rotate(0deg); }
50% { transform: translate(10%, 10%) rotate(5deg); }
}
.splash-icon {
font-size: 5em;
margin-bottom: 20px;
animation: splashIconBounce 1s ease infinite;
filter: drop-shadow(0 10px 30px rgba(100, 255, 218, 0.4));
}
@keyframes splashIconBounce {
0%, 100% { transform: translateY(0); }
50% { transform: translateY(-10px); }
}
.splash-title {
font-size: 2.5em;
font-weight: 800;
margin: 0 0 15px 0;
background: linear-gradient(135deg, #667eea 0%, #64ffda 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
background-clip: text;
position: relative;
z-index: 1;
}
.splash-version {
font-size: 1.2em;
color: #64ffda;
font-weight: 700;
margin-bottom: 35px;
padding: 8px 20px;
background: rgba(100, 255, 218, 0.1);
border: 2px solid rgba(100, 255, 218, 0.3);
border-radius: 50px;
display: inline-block;
box-shadow: 0 4px 15px rgba(100, 255, 218, 0.2);
}
.splash-features {
display: flex;
flex-direction: column;
gap: 15px;
margin-bottom: 35px;
text-align: left;
}
.splash-feature {
display: flex;
align-items: center;
gap: 15px;
padding: 15px 20px;
background: rgba(100, 255, 218, 0.05);
border: 1px solid rgba(100, 255, 218, 0.2);
border-radius: 12px;
transition: all 0.3s ease;
position: relative;
z-index: 1;
}
.splash-feature:hover {
background: rgba(100, 255, 218, 0.1);
border-color: rgba(100, 255, 218, 0.4);
transform: translateX(5px);
}
.feature-icon {
font-size: 2em;
flex-shrink: 0;
filter: drop-shadow(0 2px 8px rgba(100, 255, 218, 0.4));
}
.feature-text {
color: #fff;
font-weight: 600;
font-size: 1.05em;
}
.splash-button {
padding: 16px 40px;
background: linear-gradient(135deg, #667eea 0%, #64ffda 100%);
border: none;
border-radius: 50px;
color: #fff;
font-weight: 700;
font-size: 1.1em;
cursor: pointer;
transition: all 0.3s ease;
box-shadow: 0 6px 25px rgba(100, 255, 218, 0.4);
position: relative;
z-index: 1;
overflow: hidden;
}
.splash-button::before {
content: '';
position: absolute;
top: 50%;
left: 50%;
width: 0;
height: 0;
border-radius: 50%;
background: rgba(255, 255, 255, 0.3);
transform: translate(-50%, -50%);
transition: width 0.6s ease, height 0.6s ease;
}
.splash-button:hover::before {
width: 300px;
height: 300px;
}
.splash-button:hover {
transform: translateY(-3px);
box-shadow: 0 10px 35px rgba(100, 255, 218, 0.6);
}
.splash-button:active {
transform: translateY(-1px);
}
@media (max-width: 768px) {
.splash-content {
padding: 40px 25px;
max-width: 90%;
}
.splash-icon {
font-size: 3.5em;
}
.splash-title {
font-size: 2em;
}
.splash-version {
font-size: 1em;
margin-bottom: 25px;
}
.splash-features {
gap: 12px;
margin-bottom: 25px;
}
.splash-feature {
padding: 12px 15px;
}
.feature-icon {
font-size: 1.6em;
}
.feature-text {
font-size: 0.95em;
}
.splash-button {
padding: 14px 30px;
font-size: 1em;
width: 100%;
}
}
`;
    document.head.appendChild(style);
}

const APP_VERSION = '4.7.1';

function checkForUpdates() {
    const lastSeenVersion = localStorage.getItem('lastSeenVersion_' + currentUser);
    const hasSeenThisVersion = lastSeenVersion === APP_VERSION;
    const isNewUser = !localStorage.getItem('isReturningUser_' + currentUser);

    // New users see welcome splash
    if (isNewUser) {
        localStorage.setItem('isReturningUser_' + currentUser, 'true');
        localStorage.setItem('lastSeenVersion_' + currentUser, APP_VERSION);
        setTimeout(() => {
            document.getElementById('splashTitle').textContent = 'Welcome to DevLearn Pro';
            document.getElementById('updateSplash').classList.add('active');
            document.body.classList.add('splash-open');

            // Lock scroll when splash opens
            lockScroll();
        }, 300);
    }
    // Returning users see update splash only if version changed
    else if (!hasSeenThisVersion) {
        localStorage.setItem('lastSeenVersion_' + currentUser, APP_VERSION);
        setTimeout(() => {
            document.getElementById('splashTitle').textContent = 'New Version';
            document.getElementById('updateSplash').classList.add('active');
            document.body.classList.add('splash-open');

            // Lock scroll when splash opens
            lockScroll();
        }, 1000);
    }
}

function showRetryModal(lang, courseId, courseName) {
    // Lock scroll
    lockScroll();

    const modal = document.createElement('div');
    modal.className = 'retry-modal';
    modal.style.cssText = `
        display: flex;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.85);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        z-index: 10000;
        justify-content: center;
        align-items: center;
        opacity: 0;
        transition: opacity 0.3s ease;
        padding: 20px;
    `;

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeRetryModal();
        }
    });

    const content = document.createElement('div');
    content.className = 'retry-modal-content';

    // ✅ Check if mobile
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
        // Mobile bottom sheet style
        modal.style.alignItems = 'flex-end';
        modal.style.padding = '0';

        content.style.cssText = `
            background: rgba(30, 30, 30, 0.98);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 2px solid rgba(100, 255, 218, 0.3);
            border-radius: 20px 20px 0 0;
            padding: 30px 25px 25px 25px;
            max-width: 100%;
            width: 100%;
            max-height: 85vh;
            overflow-y: auto;
            text-align: center;
            transform: translateY(100%);
            transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
            box-shadow: 0 -10px 40px rgba(100, 255, 218, 0.3);
            position: relative;
        `;
    } else {
        // Desktop center style
        content.style.cssText = `
            background: rgba(30, 30, 30, 0.98);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 2px solid rgba(100, 255, 218, 0.3);
            border-radius: 20px;
            padding: 40px 30px;
            max-width: 450px;
            width: 100%;
            text-align: center;
            transform: scale(0.9);
            transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
            box-shadow: 0 20px 60px rgba(100, 255, 218, 0.3);
        `;
    }

    content.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    const courseData = courses[lang].find(c => c.id === courseId);

    // ✅ Add drag handle for mobile
    const dragHandle = isMobile ? `
        <div style="
            position: absolute;
            top: 12px;
            left: 50%;
            transform: translateX(-50%);
            width: 40px;
            height: 4px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 2px;
            margin-bottom: 10px;
        "></div>
    ` : '';

    content.innerHTML = `
        ${dragHandle}
        <div style="font-size: 4em; margin-bottom: 20px;">✅</div>
        <h2 style="color: #fff; margin: 0 0 15px 0; font-size: 1.8em; font-weight: 700;">
            Course Completed!
        </h2>
        <p style="color: #8b949e; margin: 0 0 10px 0; font-size: 1em;">
            ${courseData.icon} ${courseName}
        </p>
        <p style="color: #64ffda; margin: 0 0 30px 0; font-size: 0.95em; font-weight: 600;">
            You've already finished this course
        </p>

        <div style="display: flex; flex-direction: column; gap: 12px;">
            <button onclick="retryLesson('${lang}', '${courseId}', '${courseName}')" style="
                padding: 14px 30px;
                background: linear-gradient(135deg, #667eea, #64ffda);
                border: none;
                border-radius: 12px;
                color: #fff;
                font-weight: 700;
                font-size: 1em;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(100, 255, 218, 0.3);
            " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(100, 255, 218, 0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(100, 255, 218, 0.3)'">
                🔄 Retry Course
            </button>

            <button onclick="closeRetryModal()" style="
                padding: 14px 30px;
                background: rgba(139, 148, 158, 0.15);
                border: 2px solid rgba(139, 148, 158, 0.3);
                border-radius: 12px;
                color: #8b949e;
                font-weight: 600;
                font-size: 1em;
                cursor: pointer;
                transition: all 0.3s ease;
            " onmouseover="this.style.background='rgba(139, 148, 158, 0.25)'; this.style.borderColor='rgba(139, 148, 158, 0.5)'" onmouseout="this.style.background='rgba(139, 148, 158, 0.15)'; this.style.borderColor='rgba(139, 148, 158, 0.3)'">
                Cancel
            </button>
        </div>
    `;

    modal.appendChild(content);
    document.body.appendChild(modal);

    // ✅ Add swipe gesture for mobile
    if (isMobile) {
        addSwipeGesture(content);
    }

    // Animate in
    setTimeout(() => {
        modal.style.opacity = '1';
        if (isMobile) {
            content.style.transform = 'translateY(0)';
        } else {
            content.style.transform = 'scale(1)';
        }
    }, 10);
}

function closeRetryModal() {
    const modal = document.querySelector('.retry-modal');
    if (modal) {
        const content = modal.querySelector('.retry-modal-content');
        const isMobile = window.innerWidth <= 768;

        modal.style.opacity = '0';

        if (content) {
            if (isMobile) {
                content.style.transform = 'translateY(100%)';
            } else {
                content.style.transform = 'scale(0.9)';
            }
        }

        setTimeout(() => {
            modal.remove();

            // Unlock scroll
            unlockScroll();
        }, 400);
    }
}

function closeUpdateSplash() {
    document.getElementById('updateSplash').classList.remove('active');
    document.body.classList.remove('splash-open');

    // Unlock scroll
    unlockScroll();
}

function showPreviewExplanation() {
    const preview = document.getElementById('previewExplanation');
    preview.classList.add('show');

    setTimeout(() => {
        preview.classList.remove('show');
    }, 2500);
}

const highlightCache = new Map();

async function highlightKeywords(text) {
    if (highlightCache.has(text)) {
        return highlightCache.get(text);
    }

    if (text.length < 50 || !containsCodeContent(text)) {
        return text;
    }

    try {
        const config = await fetchAIConfig();

        if (!config.apiKey) {
            highlightCache.set(text, text);
            return text;
        }

        const response = await fetch(config.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.apiKey}`
            },
            body: JSON.stringify({
                model: config.model,
                messages: [
                    {
                        role: 'user',
                        content: `Identify 2-4 CORE programming concepts/terms from this lesson that a beginner MUST understand. Only return technical terms, NOT common words like "automatically", "important", "essential". Return ONLY a JSON array: "${text.replace(/"/g, '\\"').substring(0, 500)}"`
                    }
                ],
                max_tokens: 40,
                temperature: 0.2
            })
        });

        if (!response.ok) throw new Error('API failed');

        const data = await response.json();
        const content = data.choices[0].message.content;

        const match = content.match(/\[.*\]/);
        if (!match) {
            highlightCache.set(text, text);
            return text;
        }

        const keywords = JSON.parse(match[0]);
        let highlightedText = text;

        const technicalKeywords = keywords.filter(keyword => {
            const lower = keyword.toLowerCase();
            const commonWords = ['automatically', 'important', 'essential', 'fundamental', 'basic', 'simple', 'easy', 'quickly', 'useful', 'great', 'good', 'best'];
            return !commonWords.includes(lower) && keyword.length > 2;
        });

        technicalKeywords.forEach(keyword => {
            const parts = highlightedText.split(/(<[^>]+>)/);
            highlightedText = parts.map((part, index) => {
                if (index % 2 === 0) {
                    const regex = new RegExp(`\\b(${keyword.replace(/[()]/g, '\\$&')})\\b`, 'gi');
                    return part.replace(regex, match => {
                        return `<span class="keyword-highlight" onclick="showInlineAI(event, '${match}')" ontouchstart="showInlineAI(event, '${match}')">${match}</span>`;
                    });
                }
                return part;
            }).join('');
        });

        highlightCache.set(text, highlightedText);
        return highlightedText;

    } catch (error) {
        console.error('Highlight error:', error);
        highlightCache.set(text, text);
        return text;
    }
}

let currentInlinePopup = null;

async function showInlineAI(event, keyword) {
    event.preventDefault();
    event.stopPropagation();

    // Lock scroll when inline AI opens
    lockScroll();

    // Close existing popup if any
    if (currentInlinePopup) {
        closeInlineAI();
        return;
    }

    const clickedElement = event.target;
    const rect = clickedElement.getBoundingClientRect();

    const overlay = document.createElement('div');
    overlay.className = 'inline-ai-overlay';
    overlay.onclick = closeInlineAI;
    overlay.ontouchstart = closeInlineAI; // Add touch support
    document.body.appendChild(overlay);

    const popup = document.createElement('div');
    popup.className = 'inline-ai-popup';
    popup.onclick = (e) => e.stopPropagation();
    popup.ontouchstart = (e) => e.stopPropagation(); // Prevent closing on touch inside

    // Mobile-specific positioning
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
        // Center popup on mobile
        popup.style.left = '50%';
        popup.style.top = '50%';
        popup.style.transform = 'translate(-50%, -50%) scale(0.8)';
        popup.style.maxWidth = '90vw';
        popup.style.width = '90vw';
    } else {
        // Desktop positioning
        popup.style.left = rect.left + (rect.width / 2) + 'px';
        popup.style.top = rect.top + 'px';
        popup.style.transform = 'translate(-50%, 0) scale(0.8)';
    }

    popup.style.opacity = '0';
    popup.style.visibility = 'hidden';

    popup.innerHTML = `
        <div class="inline-ai-arrow"></div>
        <div class="inline-ai-header">
            <div class="inline-ai-keyword">${keyword}</div>
            <button class="inline-ai-close" onclick="closeInlineAI()">×</button>
        </div>
        <div class="inline-ai-content">
            <div class="inline-ai-loading">
                <div class="wave-container">
                    <div class="wave-line"></div>
                    <div class="wave-line"></div>
                    <div class="wave-line"></div>
                </div>
            </div>
            <div class="inline-ai-text" style="display: none;"></div>
        </div>
    `;

    document.body.appendChild(popup);

    const popupRect = popup.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const spaceAbove = rect.top;
    const spaceBelow = viewportHeight - rect.bottom;
    const popupHeight = popupRect.height || 250;

    let finalTop, finalTransform, arrowPosition;

    if (spaceAbove > popupHeight + 30 && spaceAbove > spaceBelow) {
        finalTop = rect.top - 20;
        finalTransform = 'translate(-50%, -100%) scale(0.8)';
        arrowPosition = 'bottom';
        popup.classList.add('popup-above');
    } else {
        finalTop = rect.bottom + 20;
        finalTransform = 'translate(-50%, 0) scale(0.8)';
        arrowPosition = 'top';
        popup.classList.add('popup-below');
    }

    let finalLeft = rect.left + (rect.width / 2);
    const popupWidth = popupRect.width || 350;

    if (finalLeft - popupWidth / 2 < 10) {
        finalLeft = popupWidth / 2 + 10;
    } else if (finalLeft + popupWidth / 2 > viewportWidth - 10) {
        finalLeft = viewportWidth - popupWidth / 2 - 10;
    }

    popup.style.left = finalLeft + 'px';
    popup.style.top = finalTop + 'px';
    popup.style.transform = finalTransform;
    popup.style.visibility = 'visible';

    const arrow = popup.querySelector('.inline-ai-arrow');
    if (arrowPosition === 'bottom') {
        arrow.style.bottom = '-10px';
        arrow.style.top = 'auto';
        arrow.style.borderTop = '10px solid rgba(100, 255, 218, 0.4)';
        arrow.style.borderBottom = 'none';
    } else {
        arrow.style.top = '-10px';
        arrow.style.bottom = 'auto';
        arrow.style.borderBottom = '10px solid rgba(100, 255, 218, 0.4)';
        arrow.style.borderTop = 'none';
    }

    currentInlinePopup = { overlay, popup };

    setTimeout(() => {
    overlay.classList.add('active');
    popup.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';

    if (isMobile) {
        // Mobile: scale up to center
        popup.style.transform = 'translate(-50%, -50%) scale(1)';
        popup.style.opacity = '1';
    } else {
        // Desktop: existing logic
        if (arrowPosition === 'bottom') {
            popup.style.transform = 'translate(-50%, -100%) scale(1)';
        } else {
            popup.style.transform = 'translate(-50%, 0) scale(1)';
        }
        popup.style.opacity = '1';
    }
}, 50);

    const startTime = Date.now();

    // Inside showInlineAI() function, replace the API call with:
try {
    const config = await fetchAIConfig();

    if (!config.apiKey) {
        throw new Error('AI API key not configured');
    }

    const response = await fetch(config.endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.apiKey}`
        },
        body: JSON.stringify({
            model: config.model,
            messages: [
                {
                    role: 'user',
                    content: `Explain "${keyword}" in programming in 2-3 simple sentences for beginners.`
                }
            ],
            max_tokens: 100,
            temperature: 0.7
        })
    });

    if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
    }


        const data = await response.json();

        const minLoadingTime = 800;
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minLoadingTime - elapsedTime);

        setTimeout(() => {
            const loadingDiv = popup.querySelector('.inline-ai-loading');
            const textDiv = popup.querySelector('.inline-ai-text');

            if (loadingDiv && textDiv) {
                loadingDiv.style.display = 'none';
                textDiv.textContent = data.choices[0].message.content;
                textDiv.style.display = 'block';
            }
        }, remainingTime);

    } catch (error) {
        console.error('AI Error:', error);
        const loadingDiv = popup.querySelector('.inline-ai-loading');
        const textDiv = popup.querySelector('.inline-ai-text');

        if (loadingDiv && textDiv) {
            loadingDiv.style.display = 'none';
            textDiv.textContent = 'Sorry, could not load explanation. Please try again.';
            textDiv.style.display = 'block';
            textDiv.style.color = '#ff6b6b';
        }
    }
}

function closeInlineAI() {
    if (currentInlinePopup) {
        currentInlinePopup.overlay.remove();
        currentInlinePopup.popup.remove();
        currentInlinePopup = null;

        // Unlock scroll when inline AI closes
        unlockScroll();
    }
}

function containsCodeContent(text) {
    return /\bfunction\b|\bvar\b|\blet\b|\bconst\b|\bclass\b|\bdef\b|\bprint\b|\breturn\b|<code>/i.test(text);
}

function smoothTypeInline(element, text) {
    const words = text.split(' ');
    element.innerHTML = '';
    let wordIndex = 0;

    function revealNextWord() {
        if (wordIndex < words.length) {
            const word = words[wordIndex];

            const container = document.createElement('span');
            container.className = 'word-reveal-container';

            const glowOuter = document.createElement('span');
            glowOuter.className = 'word-glow-outer';

            const glowInner = document.createElement('span');
            glowInner.className = 'word-glow-inner';

            const glowCore = document.createElement('span');
            glowCore.className = 'word-glow-core';

            const textSpan = document.createElement('span');
            textSpan.className = 'word-reveal-text-inline';
            textSpan.textContent = word + ' ';

            container.appendChild(glowOuter);
            container.appendChild(glowInner);
            container.appendChild(glowCore);
            container.appendChild(textSpan);
            element.appendChild(container);

            wordIndex++;
            setTimeout(revealNextWord, 85); // Slightly slower for dramatic effect
        }
    }

    revealNextWord();
}

// Added smoothTypeWithGlow function that was missing
function smoothTypeWithGlow(element, text) {
    const words = text.split(' ');
    element.innerHTML = '';
    let wordIndex = 0;

    function revealNextWord() {
        if (wordIndex < words.length) {
            const word = words[wordIndex];

            const container = document.createElement('span');
            container.className = 'word-reveal-container';

            const glowOuter = document.createElement('span');
            glowOuter.className = 'word-glow-outer';

            const glowInner = document.createElement('span');
            glowInner.className = 'word-glow-inner';

            const glowCore = document.createElement('span');
            glowCore.className = 'word-glow-core';

            const textSpan = document.createElement('span');
            textSpan.className = 'word-reveal-text';
            textSpan.innerHTML = word + ' ';

            container.appendChild(glowOuter);
            container.appendChild(glowInner);
            container.appendChild(glowCore);
            container.appendChild(textSpan);
            element.appendChild(container);

            wordIndex++;
            setTimeout(revealNextWord, 80);
        }
    }

    revealNextWord();
}

async function showAIExplanation(keyword) {
    const modal = document.getElementById('aiExplanationModal');
    const keywordDisplay = document.getElementById('aiKeyword');
    const loading = document.getElementById('aiLoading');
    const explanationText = document.getElementById('aiExplanationText');

    keywordDisplay.textContent = keyword;
    loading.style.display = 'block';
    explanationText.style.display = 'none';
    explanationText.innerHTML = '';

    modal.classList.add('active');

    const startTime = Date.now();

    // ✅ UPDATED: Now uses environment variable
    try {
        const config = getAIConfig();

        if (!config.apiKey) {
            throw new Error('AI API key not configured');
        }

        const response = await fetch(config.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.apiKey}`
            },
            body: JSON.stringify({
                model: config.model,
                messages: [
                    {
                        role: 'user',
                        content: `Explain "${keyword}" in programming in 2-3 simple sentences for beginners.`
                    }
                ],
                max_tokens: 100,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error('API request failed');
        }

        const data = await response.json();
        const explanation = data.choices[0].message.content;

        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, 2000 - elapsedTime);

        setTimeout(() => {
            loading.style.display = 'none';
            explanationText.style.display = 'block';
            smoothTypeWithGlow(explanationText, explanation);
        }, remainingTime);

    } catch (error) {
        console.error('Error fetching AI explanation:', error);

        const explanations = {
            'print()': 'The <code>print()</code> function displays output to the console or terminal. It\'s one of the most basic and essential functions for seeing what your code is doing.',
            'variable': 'A variable is a named container that stores data. Think of it as a labeled box where you can put information and retrieve it later using its name.',
            'function': 'A function is a reusable block of code that performs a specific task. Functions help organize code, avoid repetition, and make programs easier to understand and maintain.',
            'loop': 'A loop repeats a block of code multiple times. Common types include <code>for</code> loops (repeat a specific number of times) and <code>while</code> loops (repeat while a condition is true).',
            'array': 'An array is an ordered collection of items stored in a single variable. You can access items by their position (index), starting from 0.',
            'object': 'An object stores data as key-value pairs, like a dictionary. Each piece of data has a name (key) and a value associated with it.',
            'const': 'The <code>const</code> keyword declares a constant variable that cannot be reassigned. Once you set its value, it stays the same throughout your program.',
            'let': 'The <code>let</code> keyword declares a variable that can be changed (reassigned) later in your code. Use it for values that need to update.',
            'state': 'State is data that changes over time in your application. When state updates, the UI automatically re-renders to reflect the new data.',
            'props': 'Props (properties) are how you pass data from a parent component to a child component in React. They work like function parameters.',
            'JSX': 'JSX is a syntax extension that lets you write HTML-like code in JavaScript. React transforms JSX into JavaScript function calls.',
            'DOM': 'The DOM (Document Object Model) is a programming interface for web documents. It represents the page structure as a tree of objects that JavaScript can manipulate.',
            'useState': 'useState is a React Hook that lets you add state to functional components. It returns the current state value and a function to update it.',
            'useEffect': 'useEffect is a React Hook for side effects. It runs after render and is perfect for data fetching, subscriptions, or manually changing the DOM.',
            'component': 'A component is a reusable piece of UI in React. Components are like JavaScript functions that accept inputs (props) and return React elements.',
            'CSS': 'CSS (Cascading Style Sheets) is a language for styling HTML elements. It controls colors, layouts, fonts, and visual appearance of web pages.',
            'HTML': 'HTML (HyperText Markup Language) is the standard language for creating web pages. It uses tags to structure content like headings, paragraphs, and links.',
            'string': 'A string is a sequence of characters used to represent text. Strings are enclosed in quotes and can contain letters, numbers, and symbols.',
            'boolean': 'A boolean is a data type with only two values: true or false. Booleans are used for logic and decision-making in programs.',
            'if': 'The if statement executes code only when a condition is true. It\'s fundamental for making decisions in your programs.',
            'for': 'A for loop repeats code a specific number of times. It\'s commonly used to iterate through arrays or perform actions a set number of times.'
        };

        const explanation = explanations[keyword.toLowerCase()] ||
            `<strong>${keyword}</strong> is an important programming concept. Understanding it will help you write better code.`;

        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, 2000 - elapsedTime);

        setTimeout(() => {
            loading.style.display = 'none';
            explanationText.style.display = 'block';
            smoothTypeWithGlow(explanationText, explanation + '<p style="color: #8b949e; font-size: 0.9em; margin-top: 15px;">⚠️ AI explanation unavailable - showing fallback content</p>');
        }, remainingTime);
    }
}

function closeAIExplanation(event) {
    if (event && event.target !== event.currentTarget) return;
    document.getElementById('aiExplanationModal').classList.remove('active');
}

function createPreviewPanel() {
    const existingPanel = document.querySelector('.preview-panel');
    if (existingPanel) return existingPanel;

    const lessonView = document.querySelector('.lesson-view');
    const chatMessages = document.querySelector('.chat-messages');

    // Wrap content in container
    const container = document.createElement('div');
    container.className = 'lesson-container';

    const mainContent = document.createElement('div');
    mainContent.className = 'lesson-main';

    // Move chat messages to main content
    mainContent.appendChild(chatMessages);

    // Create preview panel
    const previewPanel = document.createElement('div');
    previewPanel.className = 'preview-panel';
    previewPanel.innerHTML = `
        <h3>
            <span>👁️</span>
            Live Preview
        </h3>
        <div class="preview-content" id="livePreview">
            <p style="color: #8b949e; text-align: center; padding: 40px 20px;">
                Preview will appear here when you reach code examples
            </p>
        </div>
    `;

    container.appendChild(mainContent);
    container.appendChild(previewPanel);

    lessonView.insertBefore(container, lessonView.querySelector('.lesson-progress'));

    return previewPanel;
}

function updateLivePreview(content, type = 'html') {
    const previewContent = document.getElementById('livePreview');
    if (!previewContent) return;

    if (type === 'html') {
        const iframe = document.createElement('iframe');
        iframe.className = 'preview-iframe';
        iframe.srcdoc = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        padding: 20px;
                        margin: 0;
                    }
                </style>
            </head>
            <body>${content}</body>
            </html>
        `;
        previewContent.innerHTML = '';
        previewContent.appendChild(iframe);
    } else if (type === 'css') {
        const iframe = document.createElement('iframe');
        iframe.className = 'preview-iframe';
        iframe.srcdoc = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    ${content}
                    body { padding: 20px; }
                </style>
            </head>
            <body>
                <div class="box">Sample Box</div>
                <button class="button">Sample Button</button>
                <p>Sample Text</p>
            </body>
            </html>
        `;
        previewContent.innerHTML = '';
        previewContent.appendChild(iframe);
    } else if (type === 'animation') {
        const iframe = document.createElement('iframe');
        iframe.className = 'preview-iframe';
        iframe.srcdoc = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        min-height: 100vh;
                        margin: 0;
                        background: #f0f0f0;
                    }
                    ${content}
                </style>
            </head>
            <body>
                <div class="element">Hover Me!</div>
            </body>
            </html>
        `;
        previewContent.innerHTML = '';
        previewContent.appendChild(iframe);
    }
}

// Auto-detect code examples and show previews
function enhanceCodeExamples() {
    const codeExamples = document.querySelectorAll('.code-example');

    codeExamples.forEach((example, index) => {
        const code = example.querySelector('code');
        if (!code) return;

        const codeText = code.textContent;

        // Detect code type
        let type = 'html';
        if (codeText.includes('transition:') || codeText.includes('@keyframes') || codeText.includes('animation:')) {
            type = 'animation';
        } else if (codeText.includes('{') && codeText.includes('}') && codeText.includes(':')) {
            type = 'css';
        }

        // Add "Try It" button
        if (!example.querySelector('.try-it-btn')) {
            const tryBtn = document.createElement('button');
            tryBtn.className = 'try-it-btn';
            tryBtn.innerHTML = '▶️ Try It Live';
            tryBtn.onclick = () => {
                updateLivePreview(codeText, type);
                tryBtn.innerHTML = '✅ Preview Updated!';
                setTimeout(() => {
                    tryBtn.innerHTML = '▶️ Try It Live';
                }, 2000);
            };
            example.appendChild(tryBtn);
        }
    });
}

// LANGUAGE FILTER FUNCTIONS

function toggleFilter() {
    const filter = document.getElementById('languageFilter');
    if (filter) {
        filter.classList.toggle('active');
    }
}

function filterChart(language) {
    const filter = document.getElementById('languageFilter');
    const filterText = document.getElementById('filterText');
    const options = document.querySelectorAll('.filter-option');

    // Update active state
    options.forEach(opt => opt.classList.remove('active'));
    event.target.classList.add('active');

    // Update filter text with icons
    const icons = {
        'all': '🌐 All Languages',
        'python': '🐍 Python',
        'javascript': '⚡ JavaScript',
        'html': '🌐 HTML',
        'css': '🎨 CSS',
        'react': '⚛️ React'
    };

    if (filterText) {
        filterText.textContent = icons[language] || '🌐 All Languages';
    }

    // Close dropdown
    if (filter) {
        filter.classList.remove('active');
    }

    // Switch to the selected chart
    switchChart(language);
}

// Close filter dropdown when clicking outside
document.addEventListener('click', function(e) {
    const filter = document.getElementById('languageFilter');
    if (filter && !filter.contains(e.target)) {
        filter.classList.remove('active');
    }
});

// ROADMAP FUNCTIONALITY

function switchLearnMode(mode) {
    // Update tabs
    document.querySelectorAll('.learn-mode-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.closest('.learn-mode-tab').classList.add('active');

    // Update content
    document.querySelectorAll('.learn-mode-content').forEach(content => {
        content.classList.remove('active');
    });

    if (mode === 'courses') {
        document.getElementById('coursesView').classList.add('active');
        renderCourses(); // ✅ Refresh courses
    } else if (mode === 'roadmap') {
        document.getElementById('roadmapView').classList.add('active');
        generateRoadmap(); // Already there, this will show updated state
    }
}

function generateRoadmap() {
    const timeline = document.getElementById('roadmapTimeline');
    timeline.innerHTML = '';

    let totalCourses = 0;
    let completedCourses = 0;
    let inProgressCourses = 0;
    let lockedCourses = 0;
    let totalEstimatedTime = 0;

    // IMPROVED: Better structured overview
    const overview = document.createElement('div');
    overview.className = 'roadmap-overview';
    overview.innerHTML = `
        <div class="roadmap-overview-card">
            <div class="overview-icon">🎯</div>
            <div class="overview-value" id="roadmapProgress">0%</div>
            <div class="overview-label">Overall Progress</div>
        </div>
        <div class="roadmap-overview-card">
            <div class="overview-icon">⏱️</div>
            <div class="overview-value" id="estimatedTime">0h</div>
            <div class="overview-label">Time Remaining</div>
        </div>
        <div class="roadmap-overview-card">
            <div class="overview-icon">🎓</div>
            <div class="overview-value" id="nextMilestone" style="font-size: 1.8em;">-</div>
            <div class="overview-label">Next Milestone</div>
        </div>
    `;
    timeline.appendChild(overview);

    // Create progress line (will be positioned absolutely)
    const progressLine = document.createElement('div');
    progressLine.className = 'roadmap-progress-line';
    progressLine.style.height = '0';
    timeline.appendChild(progressLine);

    let nextMilestone = null;
    let lastActiveItemTop = 0;

    // Generate roadmap for each language
    Object.keys(courses).forEach((lang, langIndex) => {
        const section = document.createElement('div');
        section.className = 'roadmap-language-section';
        section.setAttribute('data-lang', lang);

        const langIcons = {
            python: '🐍',
            javascript: '⚡',
            html: '🌐',
            css: '🎨',
            react: '⚛️'
        };

        section.innerHTML = `
            <div class="roadmap-language-header">
                <div class="roadmap-language-title">
                    <span>${langIcons[lang]}</span>
                    <span>${lang.toUpperCase()}</span>
                </div>
            </div>
        `;

        courses[lang].forEach((course, index) => {
            totalCourses++;
            const progress = userProgress[lang][course.id];
            const isCompleted = progress?.completed || false;
            const isInProgress = progress?.progress > 0 && !isCompleted;

            // FIX: Proper unlock logic
            const prevCourse = index > 0 ? userProgress[lang]['course' + index] : null;
            const isLocked = index > 0 && !prevCourse?.completed;

            if (isCompleted) completedCourses++;
            else if (isInProgress) inProgressCourses++;
            else if (isLocked) lockedCourses++;

            // Estimate 15-30 minutes per course
            const estimatedMinutes = 20;
            if (!isCompleted) totalEstimatedTime += estimatedMinutes;

            // Find next milestone
            if (!nextMilestone && !isCompleted && !isLocked) {
                nextMilestone = course.title;
            }

            let status = 'locked';
            let statusText = '🔒 Locked';
            let nodeIcon = '🔒';

            if (isCompleted) {
                status = 'completed';
                statusText = '✅ Completed';
                nodeIcon = '✅';
            } else if (isInProgress) {
                status = 'in-progress';
                statusText = '📚 In Progress';
                nodeIcon = '📚';
            } else if (!isLocked) {
                status = 'available';
                statusText = '🎯 Available';
                nodeIcon = '🎯';
            }

            const item = document.createElement('div');
            item.className = 'roadmap-item';
            item.innerHTML = `
                <div class="roadmap-node ${status}">${nodeIcon}</div>
                <div class="roadmap-card ${status}" onclick="${!isLocked ? `openCourseFromRoadmap('${lang}', '${course.id}', '${course.title}')` : ''}">
                    <div class="roadmap-card-header">
                        <div class="roadmap-course-title">${course.icon} ${course.title}</div>
                        <div class="roadmap-status-badge ${status}">${statusText}</div>
                    </div>
                    <div class="roadmap-course-desc">${course.desc}</div>
                    ${!isLocked ? `<div class="course-time-estimate">⏱️ ~${estimatedMinutes} min</div>` : ''}
                    <div class="roadmap-progress-bar">
                        <div class="roadmap-progress-fill" style="width: ${progress?.progress || 0}%"></div>
                    </div>
                </div>
            `;

            section.appendChild(item);
        });

        timeline.appendChild(section);
    });

    // Update overview stats
    const overallProgress = totalCourses > 0 ? Math.round((completedCourses / totalCourses) * 100) : 0;
    document.getElementById('roadmapProgress').textContent = overallProgress + '%';

    const hours = Math.floor(totalEstimatedTime / 60);
    const mins = totalEstimatedTime % 60;
    document.getElementById('estimatedTime').textContent = hours + 'h ' + mins + 'm';
    document.getElementById('nextMilestone').textContent = nextMilestone || '🎉 Done!';

    // Calculate progress line height - START FROM FIRST NODE CENTER
setTimeout(() => {
    const sections = document.querySelectorAll('.roadmap-language-section');
    const firstNode = document.querySelector('.roadmap-node');
    let lastActiveNode = firstNode;

    sections.forEach(section => {
        const items = section.querySelectorAll('.roadmap-item');

        items.forEach(item => {
            const node = item.querySelector('.roadmap-node');
            const status = node.classList.contains('completed') ? 'completed' :
                          node.classList.contains('in-progress') ? 'in-progress' : 'locked';

            if (status === 'completed' || status === 'in-progress') {
                lastActiveNode = node;
                // ADDED: Trigger fill animation
                node.classList.add('just-completed');
                setTimeout(() => node.classList.remove('just-completed'), 1000);
            }
        });
    });

    if (firstNode && lastActiveNode) {
        const firstRect = firstNode.getBoundingClientRect();
        const lastRect = lastActiveNode.getBoundingClientRect();
        const timelineRect = timeline.getBoundingClientRect();

        // Calculate from first node CENTER to last active node CENTER
        const startPoint = firstRect.top + (firstRect.height / 2) - timelineRect.top;
        const endPoint = lastRect.top + (lastRect.height / 2) - timelineRect.top;

        progressLine.style.top = startPoint + 'px';
        progressLine.style.height = Math.max(0, endPoint - startPoint) + 'px';
    }
}, 200);

// Auto-scroll to user's current progress
setTimeout(() => {
    const inProgressNode = document.querySelector('.roadmap-node.in-progress');
    const firstAvailableNode = document.querySelector('.roadmap-node:not(.completed):not(.locked)');
    const targetNode = inProgressNode || firstAvailableNode;

    if (targetNode) {
        targetNode.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }
}, 500);

    // Update stats
    document.getElementById('roadmapTotal').textContent = totalCourses;
    document.getElementById('roadmapCompleted').textContent = completedCourses;
    document.getElementById('roadmapInProgress').textContent = inProgressCourses;
    document.getElementById('roadmapLocked').textContent = lockedCourses;
}

function openCourseFromRoadmap(lang, courseId, courseName) {
    const courseIndex = courses[lang].findIndex(c => c.id === courseId);
    const isLocked = courseIndex > 0 && !userProgress[lang]['course' + courseIndex]?.completed;

    if (isLocked) {
        showNotification('🔒 This course is locked! Complete the previous course to unlock it.', 'warning');
        return;
    }

    // Switch to courses view
    switchLanguage(lang);

    const isCompleted = userProgress[lang][courseId]?.completed;

    if (isCompleted) {
        showRetryModal(lang, courseId, courseName);
    } else {
        openLesson(lang, courseId, courseName);
    }
}

function handleMobileTopSearch() {
    const query = document.getElementById('mobileTopSearchInput').value.toLowerCase();
    const results = document.getElementById('mobileTopSearchResults');

    if (!query) {
        results.classList.remove('active');
        return;
    }

    const matches = [];
    Object.keys(courses).forEach(lang => {
        courses[lang].forEach((course, index) => {
            if (course.title.toLowerCase().includes(query) ||
                course.desc.toLowerCase().includes(query) ||
                lang.includes(query)) {

                const isLocked = index > 0 && !userProgress[lang]['course' + index]?.completed;
                const isCompleted = userProgress[lang][course.id]?.completed;

                matches.push({
                    lang,
                    course,
                    langName: lang.charAt(0).toUpperCase() + lang.slice(1),
                    isLocked,
                    isCompleted,
                    index
                });
            }
        });
    });

    if (matches.length > 0) {
        results.innerHTML = matches.map(m => {
            let statusBadge = '';
            let clickable = !m.isLocked;

            if (m.isCompleted) {
                statusBadge = '<span style="color: #00ff00; margin-left: 8px;">✓ Completed</span>';
            } else if (m.isLocked) {
                statusBadge = '<span style="color: #ff6b6b; margin-left: 8px;">🔒 Locked</span>';
            } else {
                statusBadge = '<span style="color: #64ffda; margin-left: 8px;">📖 Available</span>';
            }

            const onClick = clickable
                ? `onclick="openCourseFromSearch('${m.lang}', '${m.course.id}', '${m.course.title}'); document.getElementById('mobileTopSearchInput').value = ''; document.getElementById('mobileTopSearchResults').classList.remove('active');"`
                : `style="opacity: 0.5; cursor: not-allowed;"`;

            return `
                <div class="search-result-item" ${onClick}>
                    <div class="search-result-title">${m.course.icon} ${m.course.title}${statusBadge}</div>
                    <div class="search-result-desc">${m.langName} • ${m.course.desc}</div>
                </div>
            `;
        }).join('');
        results.classList.add('active');
    } else {
        results.innerHTML = '<div class="search-result-item">No courses found</div>';
        results.classList.add('active');
    }
}

// Close mobile search when clicking outside
document.addEventListener('click', function(e) {
    const searchContainer = document.getElementById('mobileTopSearch');
    if (searchContainer && !searchContainer.contains(e.target)) {
        document.getElementById('mobileTopSearchResults').classList.remove('active');
    }
});

// Prevent search bar movement on mobile
if (window.innerWidth <= 768) {
    const searchInput = document.getElementById('mobileTopSearchInput');

    if (searchInput) {
        searchInput.addEventListener('focus', () => {
            document.body.classList.add('keyboard-open');
        });

        searchInput.addEventListener('blur', () => {
            document.body.classList.remove('keyboard-open');
            // Force reposition
            window.scrollTo(window.scrollX, window.scrollY);
        });
    }
}

// Track wrong answers
let wrongAnswers = [];

function trackWrongAnswer(question, userAnswer, correctAnswer) {
    wrongAnswers.push({
        question,
        userAnswer,
        correctAnswer
    });
}

async function showCompletionStats() {
    const totalQuestions = lessonContent[currentLesson.language][currentLesson.courseId].exercises.length;
    const wrongAttempts = wrongAnswers.length;
    const accuracy = Math.round(((totalQuestions - wrongAttempts) / totalQuestions) * 100);

    // Lock scroll FIRST
    lockScroll();

    const modal = document.createElement('div');
    modal.className = 'completion-stats-modal';
    modal.id = 'completionStatsModal';
    modal.innerHTML = `
        <div class="completion-stats-content">
            <div class="stats-header">
                <div class="stats-icon">🎉</div>
                <div class="stats-title">Course Completed!</div>
                <p style="color: #8b949e;">Great job on finishing ${currentLesson.courseName}!</p>
            </div>

            <div class="stats-score">
                <div class="score-item">
                    <div class="score-value">${totalQuestions}</div>
                    <div class="score-label">Total Questions</div>
                </div>
                <div class="score-item">
                    <div class="score-value">${wrongAttempts}</div>
                    <div class="score-label">Wrong Attempts</div>
                </div>
                <div class="score-item">
                    <div class="score-value">${accuracy}%</div>
                    <div class="score-label">Accuracy</div>
                </div>
            </div>

            ${wrongAttempts > 0 ? `
                <div class="wrong-answers-list" id="wrongAnswersList">
                    <h3 style="color: #ff6b6b; margin-bottom: 15px;">📝 Review These:</h3>
                    ${wrongAnswers.map(wa => `
                        <div class="wrong-answer-item">
                            <strong>Q:</strong> ${wa.question}<br>
                            <span style="color: #ff6b6b;">Your answer: ${wa.userAnswer}</span><br>
                            <span style="color: #00ff00;">Correct: ${wa.correctAnswer}</span>
                        </div>
                    `).join('')}
                </div>
            ` : '<div style="text-align: center; color: #00ff00; padding: 20px;">🌟 Perfect score! No mistakes!</div>'}

            <button class="continue-btn" onclick="closeStatsAndSuggest()">Continue</button>
        </div>
    `;

    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('active'), 100);

    // ✅ Store wrong answers data for AI
    if (wrongAttempts > 0) {
        localStorage.setItem('lastWrongAnswers_' + currentUser, JSON.stringify(wrongAnswers));
    }
}

// ✅ UPDATED: Better flow control
async function closeStatsAndSuggest() {
    // Close the stats modal
    const statsModal = document.querySelector('.completion-stats-modal');
    if (statsModal) {
        statsModal.remove();
        unlockScroll();
    }

    // Check if goal was just completed
    const goalJustCompleted = localStorage.getItem('goalJustCompleted_' + currentUser);
    if (goalJustCompleted === 'true') {
        const goalData = JSON.parse(localStorage.getItem('completedGoalData_' + currentUser) || '{}');
        showNotification(`🎉 Daily Goal Completed! All ${goalData.daily?.selectedCourses?.length || 0} courses finished!`, 'success');
        localStorage.removeItem('goalJustCompleted_' + currentUser);
        localStorage.removeItem('completedGoalData_' + currentUser);
    }

    const accuracy = parseInt(localStorage.getItem('lastLessonAccuracy') || '100');
    const lessonName = localStorage.getItem('lastLessonName') || '';
    const lessonLang = localStorage.getItem('lastLessonLanguage') || '';

    // Close lesson and navigate
    document.getElementById('lessonView').classList.remove('active');
    currentLesson = null;

    renderCourses();
    const roadmapView = document.getElementById('roadmapView');
    if (roadmapView && roadmapView.classList.contains('active')) {
        generateRoadmap();
    }

    showSection('home');

    // Wait for transition
    await new Promise(resolve => setTimeout(resolve, 500));

    // ✅ STEP 1: Show streak FIRST (if applicable)
    if (!isRetryMode) {
        const streakShown = await checkAndShowStreakAsync();

        // ✅ STEP 2: Wait for streak animation to finish
        if (streakShown) {
            await new Promise(resolve => setTimeout(resolve, 4000)); // Wait for streak animation
        }
    }

    // ✅ STEP 3: THEN show AI suggestion (if needed)
    if (!isRetryMode && accuracy < 80 && lessonName && lessonLang) {
        console.log('🤖 Generating AI suggestion after streak...');
        await generateAISuggestionFromLesson(lessonName, lessonLang);
    }

    // Clean up
    wrongAnswers = [];
    localStorage.removeItem('lastLessonAccuracy');
    localStorage.removeItem('lastLessonName');
    localStorage.removeItem('lastLessonLanguage');
}

// ✅ NEW: Async version of streak check that returns whether streak was shown
async function checkAndShowStreakAsync() {
    const today = new Date().toDateString();
    const lastActivity = localStorage.getItem('lastActivity_' + currentUser);
    const currentStreak = parseInt(localStorage.getItem('streak_' + currentUser) || '0');

    let newStreak = currentStreak;
    let showStreak = false;

    if (!lastActivity) {
        newStreak = 1;
        showStreak = true;
        localStorage.setItem('streak_' + currentUser, '1');
        localStorage.setItem('lastActivity_' + currentUser, today);
    } else if (lastActivity !== today) {
        const lastDate = new Date(lastActivity);
        const todayDate = new Date(today);
        const diffTime = todayDate - lastDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            newStreak = currentStreak + 1;
            showStreak = true;
        } else if (diffDays > 1) {
            newStreak = 1;
            showStreak = false;
        }

        localStorage.setItem('streak_' + currentUser, newStreak.toString());
        localStorage.setItem('lastActivity_' + currentUser, today);
    }

    // Show streak celebration if needed
    if (showStreak && newStreak > 0) {
        showStreakCelebration(newStreak);
        return true; // Streak was shown
    }

    return false; // No streak shown
}

// ✅ UPDATED: Smaller oval button centered below on mobile
function showAISuggestionButton(title) {
    const existingBtn = document.querySelector('.ai-suggestion-btn');
    if (existingBtn) existingBtn.remove();

    const isMobile = window.innerWidth <= 768;

    const btn = document.createElement('div');
    btn.className = 'ai-suggestion-btn';
    btn.style.cssText = `
        position: fixed;
        bottom: ${isMobile ? '90px' : '30px'};
        left: 50%;
        transform: translateX(-50%) translateY(100px) scale(0.9);
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.95), rgba(100, 255, 218, 0.95));
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 2px solid rgba(100, 255, 218, 0.6);
        border-radius: ${isMobile ? '30px' : '50px'};
        padding: ${isMobile ? '12px 20px' : '18px 30px'};
        box-shadow: 0 8px 32px rgba(100, 255, 218, 0.4);
        cursor: pointer;
        z-index: 9999;
        opacity: 0;
        transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        max-width: ${isMobile ? '85%' : '90%'};
        text-align: center;
    `;

    btn.innerHTML = `
        <div style="display: flex; align-items: center; gap: ${isMobile ? '8px' : '12px'}; flex-wrap: wrap; justify-content: center;">
            <div style="font-size: ${isMobile ? '1.3em' : '1.8em'};">💡</div>
            <div>
                <div class="ai-suggestion-title" style="color: #fff; font-weight: 700; font-size: ${isMobile ? '0.9em' : '1.1em'}; margin-bottom: ${isMobile ? '2px' : '4px'};">${title}</div>
                <div class="ai-suggestion-desc" style="color: rgba(255, 255, 255, 0.9); font-size: ${isMobile ? '0.7em' : '0.85em'};">🎯 Practice based on your mistakes</div>
            </div>
        </div>
    `;

    btn.onclick = () => openPersonalizedAIPractice(title);

    btn.onmouseenter = function() {
        this.style.transform = 'translateX(-50%) translateY(0) scale(1.05)';
        this.style.boxShadow = '0 12px 40px rgba(100, 255, 218, 0.6)';
    };

    btn.onmouseleave = function() {
        this.style.transform = 'translateX(-50%) translateY(0) scale(1)';
        this.style.boxShadow = '0 8px 32px rgba(100, 255, 218, 0.4)';
    };

    document.body.appendChild(btn);

    // ✅ Animate in with delay (appears AFTER streak)
    setTimeout(() => {
        btn.style.opacity = '1';
        btn.style.transform = 'translateX(-50%) translateY(0) scale(1)';
    }, 100);

    // Auto-hide after 15 seconds
    setTimeout(() => {
        if (btn && btn.parentNode) {
            btn.style.opacity = '0';
            btn.style.transform = 'translateX(-50%) translateY(100px) scale(0.9)';
            setTimeout(() => btn.remove(), 500);
        }
    }, 15000);
}

async function openPersonalizedAIPractice(title) {
    closeAISuggestion();

    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.classList.add('active');
        document.querySelector('.loading-text').textContent = '🤖 Creating Personalized Practice...';
    }

    // ✅ Get wrong answers from storage
    const wrongAnswersData = JSON.parse(localStorage.getItem('lastWrongAnswers_' + currentUser) || '[]');
    const completedLesson = localStorage.getItem('lastLessonName') || '';

    currentAICourse = {
        title: title,
        language: 'ai-generated',
        courseId: 'ai_' + Date.now()
    };

    try {
        const config = await fetchAIConfig();

        if (!config.apiKey) {
            throw new Error('AI API key not configured');
        }

        // ✅ ENHANCED PROMPT: Include wrong answers for better targeting
        const wrongAnswersSummary = wrongAnswersData.map((wa, idx) =>
            `${idx + 1}. Q: "${wa.question}" - User answered: "${wa.userAnswer}" (Correct: "${wa.correctAnswer}")`
        ).join('\n');

        const enhancedPrompt = `The user completed "${completedLesson}" but struggled with these concepts:

${wrongAnswersSummary}

Create 8 targeted practice questions about "${title}" that specifically address these weak areas. Each question should:
1. Test understanding of the concepts they got wrong
2. Use similar but slightly different scenarios
3. Include clear explanations in options

Format as JSON array: [{"question":"...","options":["A","B","C","D"],"correct":0,"explanation":"Why this is correct"}]`;

        console.log('📤 Sending enhanced prompt:', enhancedPrompt);

        const response = await fetch(config.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.apiKey}`
            },
            body: JSON.stringify({
                model: config.model,
                messages: [{
                    role: 'user',
                    content: enhancedPrompt
                }],
                max_tokens: 1200,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error('Failed to generate questions');
        }

        const data = await response.json();
        console.log('📥 AI Response:', data);

        let questions;
        try {
            const content = data.choices[0].message.content;
            const jsonMatch = content.match(/\[[\s\S]*\]/);

            if (!jsonMatch) {
                throw new Error('No JSON found');
            }

            questions = JSON.parse(jsonMatch[0]);

            // Validate
            questions = questions.filter(q =>
                q.question &&
                Array.isArray(q.options) &&
                q.options.length >= 2 &&
                typeof q.correct === 'number'
            );

            if (questions.length === 0) {
                throw new Error('No valid questions');
            }

        } catch (parseError) {
            console.error('Parse error:', parseError);
            // Enhanced fallback based on wrong answers
            questions = generateFallbackQuestions(wrongAnswersData, title);
        }

        // ✅ Store for direct practice (no learn phase)
        aiCourseContent = {
            learn: [], // ✅ EMPTY - go straight to practice
            exercises: questions.map(q => ({
                type: 'mcq',
                question: q.question,
                options: q.options,
                correct: q.correct,
                explanation: q.explanation || ''
            }))
        };

        if (loadingOverlay) loadingOverlay.classList.remove('active');

        // ✅ Open AI lesson directly in practice mode
        openAILessonDirectPractice();

        // Clean up
        localStorage.removeItem('lastWrongAnswers_' + currentUser);

    } catch (error) {
        console.error('AI Practice Error:', error);
        if (loadingOverlay) loadingOverlay.classList.remove('active');
        showNotification('Failed to generate practice. Please try again.', 'error');
        currentAICourse = null;
    }
}

// ✅ Helper function for fallback questions
function generateFallbackQuestions(wrongAnswers, title) {
    return wrongAnswers.slice(0, 5).map((wa, idx) => ({
        question: `Let's revisit: ${wa.question}`,
        options: [
            wa.correctAnswer,
            wa.userAnswer,
            'Another option',
            'Different approach'
        ].sort(() => Math.random() - 0.5),
        correct: 0, // First option after shuffle
        explanation: `The correct answer is ${wa.correctAnswer}`
    }));
}

// ✅ New function to open AI lesson without learn phase
function openAILessonDirectPractice() {
    currentLesson = {
        language: 'ai-generated',
        courseId: 'ai_practice',
        courseName: '🎯 ' + currentAICourse.title,
        isAI: true
    };

    learnCompleted = true; // ✅ Skip learn phase
    learnMessageIndex = 0;
    correctAnswers = 0;
    selectedMCQ = {};
    wrongAnswers = []; // Reset

    studyStartTime = Date.now();
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);

    document.getElementById('lessonTitle').textContent = '🎯 ' + currentAICourse.title;
    document.getElementById('lessonView').classList.add('active');
    document.getElementById('learnMessages').innerHTML = '';
    document.getElementById('questionMessages').innerHTML = '';

    // ✅ Show only questions tab, auto-switch to it
    document.getElementById('questionsTabBtn').disabled = false;
    document.getElementById('questionsTabBtn').innerHTML = 'Practice Questions';

    // ✅ Hide learn tab for AI practice
    document.getElementById('learnTabBtn').style.display = 'none';

    switchPanel('questions');
    updateLessonProgress();

    // ✅ Display questions immediately
    displayAIQuestions(aiCourseContent.exercises);
}

function closeAISuggestion() {
    const btn = document.querySelector('.ai-suggestion-btn');
    const overlay = document.querySelector('.ai-suggestion-overlay');

    if (btn) {
        btn.style.opacity = '0';
        btn.style.transform = 'translateX(-50%) translateY(150px)';
    }

    if (overlay) {
        overlay.style.background = 'rgba(0, 0, 0, 0)';
        overlay.style.backdropFilter = 'blur(0px)';
        overlay.style.webkitBackdropFilter = 'blur(0px)';
        overlay.style.opacity = '0';
    }

    setTimeout(() => {
        if (btn && btn.parentNode) btn.remove();
        if (overlay && overlay.parentNode) overlay.remove();
    }, 600);
}

async function openAISuggestedCourse(title) {
    closeAISuggestion(); // CHANGE: Use new close function

    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.classList.add('active');
        document.querySelector('.loading-text').textContent = 'Generating AI Course...';
    }

    currentAICourse = {
        title: title,
        language: 'ai-generated',
        courseId: 'ai_' + Date.now()
    };

    try {
        const config = await fetchAIConfig();

        if (!config.apiKey) {
            throw new Error('AI API key not configured');
        }

        // IMPROVED: Reference the completed lesson
        const completedLesson = localStorage.getItem('lastLessonName') || '';

        const lessonResponse = await fetch(config.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.apiKey}`
            },
            body: JSON.stringify({
                model: config.model,
                messages: [{
                    role: 'user',
                    content: `Create 5 teaching messages about "${title}" (reinforcing "${completedLesson}") for beginners. Include 2 code examples in <div class="code-example"><code>...</code></div>. Each message 2-3 sentences. Format as JSON array.`
                }],
                max_tokens: 600,
                temperature: 0.7
            })
        });

        if (!lessonResponse.ok) {
            throw new Error('Failed to generate lesson content');
        }

        const lessonData = await lessonResponse.json();
        console.log('📚 Lesson Response:', lessonData); // Debug

        let messages;
        try {
            const content = lessonData.choices[0].message.content;
            const jsonMatch = content.match(/\[[\s\S]*\]/);

            if (!jsonMatch) {
                throw new Error('No JSON array found in response');
            }

            messages = JSON.parse(jsonMatch[0]);

            // Validate messages
            if (!Array.isArray(messages) || messages.length === 0) {
                throw new Error('Invalid messages format');
            }
        } catch (parseError) {
            console.error('Parse error:', parseError);
            // Fallback messages
            messages = [
                `Welcome to ${title}! Let's learn the basics.`,
                `Understanding ${title} will help you become a better programmer.`,
                `This concept is used frequently in modern development.`,
                `Practice makes perfect - let's test your knowledge!`
            ];
        }

        // ✅ FIXED: Generate 5 questions instead of 3
const questionsResponse = await fetch(config.endpoint, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
    },
    body: JSON.stringify({
        model: config.model,
        messages: [{
            role: 'user',
            content: `Create 5 multiple choice questions about "${title}". Each question should test understanding. Format: [{"question":"What is...", "options":["Option A","Option B","Option C","Option D"], "correct":0}]`
        }],
        max_tokens: 700, // ✅ Increased from 400 to 700 for more questions
        temperature: 0.7
    })
});

        if (!questionsResponse.ok) {
            throw new Error('Failed to generate questions');
        }

        const questionsData = await questionsResponse.json();
        console.log('❓ Questions Response:', questionsData); // Debug

        let questions;
        try {
            const content = questionsData.choices[0].message.content;
            const jsonMatch = content.match(/\[[\s\S]*\]/);

            if (!jsonMatch) {
                throw new Error('No JSON array found in questions');
            }

            questions = JSON.parse(jsonMatch[0]);

            // Validate questions
            if (!Array.isArray(questions) || questions.length === 0) {
                throw new Error('Invalid questions format');
            }

            // Validate each question has required fields
            questions = questions.filter(q =>
                q.question &&
                Array.isArray(q.options) &&
                q.options.length >= 2 &&
                typeof q.correct === 'number'
            );

            if (questions.length === 0) {
                throw new Error('No valid questions found');
            }

        } catch (parseError) {
            console.error('Questions parse error:', parseError);
            // ✅ FIXED: 5 fallback questions instead of 3
questions = [
    {
        question: `What is the main purpose of ${title}?`,
        options: [
            'To improve code quality',
            'To slow down development',
            'To confuse developers',
            'None of the above'
        ],
        correct: 0
    },
    {
        question: `When should you use ${title}?`,
        options: [
            'Never',
            'Always',
            'When it improves your code',
            'Only on Mondays'
        ],
        correct: 2
    },
    {
        question: `Which best describes ${title}?`,
        options: [
            'A programming concept',
            'A type of food',
            'A car brand',
            'A movie genre'
        ],
        correct: 0
    },
    {
        question: `What is a key benefit of ${title}?`,
        options: [
            'Makes code harder to read',
            'Increases file size',
            'Improves code organization',
            'Slows execution'
        ],
        correct: 2
    },
    {
        question: `How does ${title} help developers?`,
        options: [
            'It doesn\'t help',
            'Makes coding more efficient',
            'Creates more bugs',
            'Removes all errors'
        ],
        correct: 1
    }
];
}


        // Store AI course content
        aiCourseContent = {
            learn: messages.map(msg => ({ bot: msg })),
            exercises: questions.map(q => ({
                type: 'mcq',
                question: q.question,
                options: q.options,
                correct: q.correct
            }))
        };

        console.log('✅ AI Course Content:', aiCourseContent); // Debug

        // Hide loading and open lesson
        if (loadingOverlay) loadingOverlay.classList.remove('active');

        openAILesson();

    } catch (error) {
        console.error('❌ AI Course Generation Error:', error);

        // Hide loading
        if (loadingOverlay) loadingOverlay.classList.remove('active');

        // Show error notification
        showNotification('Failed to generate AI course. Please try again later.', 'error');

        currentAICourse = null;
    }
}

function openAILesson() {
    // Set up like normal lesson
    currentLesson = {
        language: 'ai-generated',
        courseId: 'ai_course',
        courseName: '🤖 ' + currentAICourse.title,
        isAI: true // Flag to track it's AI
    };

    learnCompleted = false;
    learnMessageIndex = 0;
    correctAnswers = 0;
    selectedMCQ = {};

    studyStartTime = Date.now();
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);

    document.getElementById('lessonTitle').textContent = '🤖 ' + currentAICourse.title;
    document.getElementById('lessonView').classList.add('active');
    document.getElementById('learnMessages').innerHTML = '';
    document.getElementById('questionMessages').innerHTML = '';

    document.getElementById('questionsTabBtn').disabled = true;
    document.getElementById('questionsTabBtn').innerHTML = 'Questions 🔒';

    switchPanel('learn');
    updateLessonProgress();
    displayNextAIMessage();
}

async function displayNextAIMessage() {
    const learnMessages = document.getElementById('learnMessages');

    if (learnMessageIndex >= aiCourseContent.learn.length) {
        learnCompleted = true;
        const questionsBtn = document.getElementById('questionsTabBtn');
        if (questionsBtn) {
            questionsBtn.disabled = false;
            questionsBtn.innerHTML = 'Questions ✓';
        }

        const unlockMsg = document.createElement('div');
        unlockMsg.className = 'message';
        unlockMsg.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="message-bubble">
                ✅ Great! Switch to <strong>Questions</strong> tab to test yourself!
            </div>
        `;
        learnMessages.appendChild(unlockMsg);
        learnMessages.scrollTop = learnMessages.scrollHeight;
        return; // Don't display questions yet - wait for user to switch tabs
    }

    const typingDiv = document.createElement('div');
    typingDiv.className = 'message';
    typingDiv.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="message-bubble">
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        </div>
    `;
    learnMessages.appendChild(typingDiv);
    learnMessages.scrollTop = learnMessages.scrollHeight;

    setTimeout(() => {
        typingDiv.remove();

        const msg = aiCourseContent.learn[learnMessageIndex];
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message';
        messageDiv.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="message-bubble">${msg.bot}</div>
        `;
        learnMessages.appendChild(messageDiv);
        learnMessages.scrollTop = learnMessages.scrollHeight;

        learnMessageIndex++;
        updateLessonProgress();

        if (learnMessageIndex < aiCourseContent.learn.length) {
            setTimeout(displayNextAIMessage, 600);
        } else {
            // Final message - unlock questions
            setTimeout(() => {
                learnCompleted = true;
                const questionsBtn = document.getElementById('questionsTabBtn');
                if (questionsBtn) {
                    questionsBtn.disabled = false;
                    questionsBtn.innerHTML = 'Questions ✓';
                }

                const unlockMsg = document.createElement('div');
                unlockMsg.className = 'message';
                unlockMsg.innerHTML = `
                    <div class="message-avatar">🤖</div>
                    <div class="message-bubble">
                        ✅ Excellent! Switch to <strong>Questions</strong> tab to test yourself!
                    </div>
                `;
                learnMessages.appendChild(unlockMsg);
                learnMessages.scrollTop = learnMessages.scrollHeight;
            }, 600);
        }
    }, 800);
}

function displayAIMessage(text) {
    const learnMessages = document.getElementById('learnMessages');
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message';
    msgDiv.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="message-bubble">${text}</div>
    `;
    learnMessages.appendChild(msgDiv);
    learnMessages.scrollTop = learnMessages.scrollHeight;
}

function displayAIQuestions(questions) {
    const questionMessages = document.getElementById('questionMessages');
    questionMessages.innerHTML = '';

    const welcomeDiv = document.createElement('div');
    welcomeDiv.className = 'message';
    welcomeDiv.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="message-bubble">🎯 Test your AI-generated knowledge!</div>
    `;
    questionMessages.appendChild(welcomeDiv);

    questions.forEach((q, index) => {
        const exerciseDiv = document.createElement('div');
        exerciseDiv.className = 'message';

        let optionsHTML = q.options.map((opt, i) =>
            `<div class="mcq-option" onclick="selectOption(this, ${index}, ${i})">${opt}</div>`
        ).join('');

        exerciseDiv.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="message-bubble">
                <div class="exercise-box">
                    <div class="exercise-title">❓ ${q.question}</div>
                    <div class="mcq-options" data-correct="${q.correct}" data-exercise="${index}">
                        ${optionsHTML}
                    </div>
                    <button class="submit-button" onclick="checkMCQAnswer(${index})">Check</button>
                    <div id="feedback-${index}"></div>
                </div>
            </div>
        `;

        questionMessages.appendChild(exerciseDiv);
    });
}

function finishLessonCompletely() {
    wrongAnswers = [];
    closeLesson();
}

function showAICompletionStats() {
    const totalQuestions = aiCourseContent.exercises.length;
    const wrongAttempts = wrongAnswers.length;
    const accuracy = Math.round(((totalQuestions - wrongAttempts) / totalQuestions) * 100);

    const modal = document.createElement('div');
    modal.className = 'completion-stats-modal';
    modal.innerHTML = `
        <div class="completion-stats-content">
            <div class="stats-header">
                <div class="stats-icon">🎉</div>
                <div class="stats-title">AI Course Completed!</div>
                <p style="color: #8b949e;">Excellent work on <strong>${currentAICourse.title}</strong>! 🤖</p>
                <div style="background: rgba(100, 255, 218, 0.1); border: 1px solid rgba(100, 255, 218, 0.3); padding: 10px; border-radius: 10px; margin-top: 15px;">
                    <strong style="color: #64ffda;">✨ Extra Task Completed!</strong>
                </div>
            </div>

            <div class="stats-score">
                <div class="score-item">
                    <div class="score-value">${totalQuestions}</div>
                    <div class="score-label">Total Questions</div>
                </div>
                <div class="score-item">
                    <div class="score-value">${wrongAttempts}</div>
                    <div class="score-label">Wrong Attempts</div>
                </div>
                <div class="score-item">
                    <div class="score-value">${accuracy}%</div>
                    <div class="score-label">Accuracy</div>
                </div>
            </div>

            ${wrongAttempts > 0 ? `
                <div class="wrong-answers-list">
                    <h3 style="color: #ff6b6b; margin-bottom: 15px;">📝 Review These:</h3>
                    ${wrongAnswers.map(wa => `
                        <div class="wrong-answer-item">
                            <strong>Q:</strong> ${wa.question}<br>
                            <span style="color: #ff6b6b;">Your answer: ${wa.userAnswer}</span><br>
                            <span style="color: #00ff00;">Correct: ${wa.correctAnswer}</span>
                        </div>
                    `).join('')}
                </div>
            ` : '<div style="text-align: center; color: #00ff00; padding: 20px;">🌟 Perfect score! No mistakes!</div>'}

            <button class="continue-btn" onclick="closeAIStats()">Continue</button>
        </div>
    `;

    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('active'), 100);
}

function closeAIStats() {
    document.querySelector('.completion-stats-modal').remove();
    wrongAnswers = [];
    currentAICourse = null;
    aiCourseContent = null;
    closeLesson();
}

async function generateAISuggestionFromLesson(lessonName, language) {
    try {
        const config = await fetchAIConfig();

        if (!config.apiKey) {
            showAISuggestionButton(`Review ${lessonName}`);
            return;
        }

        // IMPROVED PROMPT: Use the lesson that was just completed
        const response = await fetch(config.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.apiKey}`
            },
            body: JSON.stringify({
                model: config.model,
                messages: [{
                    role: 'user',
                    content: `The user just completed "${lessonName}" in ${language} but scored below 80%. Create a practice mini-course title (6-8 words) that reinforces "${lessonName}" concepts. Just the title.`
                }],
                max_tokens: 20,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            showAISuggestionButton(`Practice ${lessonName}`);
            return;
        }

        const data = await response.json();
        const title = data.choices[0].message.content.replace(/['"]/g, '').trim();

        showAISuggestionButton(title);

    } catch (error) {
        console.error('AI Suggestion Error:', error);
        showAISuggestionButton(`Master ${lessonName}`);
    }
}

// Dynamic Scroll Button System
let currentLanguageSection = null;
const languageOrder = ['python', 'javascript', 'html', 'css', 'react'];

window.addEventListener('scroll', function() {
    const container = document.getElementById('scrollButtonContainer');
    const prevBtn = document.getElementById('scrollPrevBtn');
    const nextBtn = document.getElementById('scrollNextBtn');

    if (!container) return;

    // Always show scroll to top after 300px (both mobile & desktop)
    if (window.pageYOffset > 300) {
        container.classList.add('show');
    } else {
        container.classList.remove('show');
    }

    // Roadmap navigation buttons (NEW) - Check this BEFORE desktop check
    const roadmapNavContainer = document.getElementById('roadmapNavContainer');
    const roadmapPrevBtn = document.getElementById('roadmapPrevBtn');
    const roadmapNextBtn = document.getElementById('roadmapNextBtn');

    // Check if on roadmap for prev/next buttons
    const roadmapView = document.getElementById('roadmapView');
    if (roadmapView && roadmapView.classList.contains('active')) {
        // On roadmap - show navigation buttons when scrolled
        if (window.scrollY > 300 && roadmapNavContainer) {
            roadmapNavContainer.style.display = 'flex';
            roadmapNavContainer.classList.add('show');
            console.log('Roadmap nav buttons shown'); // Debug
        } else if (roadmapNavContainer) {
            roadmapNavContainer.classList.remove('show');
        }

        // Detect current section for prev/next buttons (works on both mobile and desktop)
        const sections = document.querySelectorAll('.roadmap-language-section');
        let currentSection = null;

        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
                currentSection = section.getAttribute('data-lang');
            }
        });

        if (currentSection) {
            currentLanguageSection = currentSection;
            const currentIndex = languageOrder.indexOf(currentSection);

            // Show/hide prev button (roadmap navigation)
            if (currentIndex > 0 && roadmapPrevBtn) {
                roadmapPrevBtn.classList.add('show');
                roadmapPrevBtn.querySelector('span').textContent = `↑ ${languageOrder[currentIndex - 1].toUpperCase()}`;
            } else if (roadmapPrevBtn) {
                roadmapPrevBtn.classList.remove('show');
            }

            // Show/hide next button (roadmap navigation)
            if (currentIndex < languageOrder.length - 1 && roadmapNextBtn) {
                roadmapNextBtn.classList.add('show');
                roadmapNextBtn.querySelector('span').textContent = `${languageOrder[currentIndex + 1].toUpperCase()} ↓`;
            } else if (roadmapNextBtn) {
                roadmapNextBtn.classList.remove('show');
            }
        }
    } else {
        // Not on roadmap - hide navigation buttons
        if (roadmapNavContainer) {
            roadmapNavContainer.classList.remove('show');
            roadmapNavContainer.style.display = 'none';
        }
    }

    // ✅ HIDE prev/next buttons on desktop (>768px) - but only for mobile buttons
    const isDesktop = window.innerWidth > 768;
    if (isDesktop) {
        if (prevBtn) prevBtn.classList.remove('show');
        if (nextBtn) nextBtn.classList.remove('show');
        return; // Exit early on desktop
    }

    // Mobile-only section detection (for mobile prev/next buttons)
    const sections = document.querySelectorAll('.roadmap-language-section');
    let currentSection = null;

    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            currentSection = section.getAttribute('data-lang');
        }
    });

    if (currentSection) {
        currentLanguageSection = currentSection;
        const currentIndex = languageOrder.indexOf(currentSection);

        // Show/hide prev button (mobile only)
        if (currentIndex > 0 && prevBtn) {
            prevBtn.classList.add('show');
            prevBtn.querySelector('span').textContent = `↑ ${languageOrder[currentIndex - 1].toUpperCase()}`;
        } else if (prevBtn) {
            prevBtn.classList.remove('show');
        }

        // Show/hide next button (mobile only)
        if (currentIndex < languageOrder.length - 1 && nextBtn) {
            nextBtn.classList.add('show');
            nextBtn.querySelector('span').textContent = `${languageOrder[currentIndex + 1].toUpperCase()} ↓`;
        } else if (nextBtn) {
            nextBtn.classList.remove('show');
        }
    }
}, true);

function scrollToPrevSection() {
    if (!currentLanguageSection) return;
    const currentIndex = languageOrder.indexOf(currentLanguageSection);
    if (currentIndex > 0) {
        const prevLang = languageOrder[currentIndex - 1];
        const prevSection = document.querySelector(`.roadmap-language-section[data-lang="${prevLang}"]`);
        if (prevSection) {
            prevSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
}

function scrollToNextSection() {
    if (!currentLanguageSection) return;
    const currentIndex = languageOrder.indexOf(currentLanguageSection);
    if (currentIndex < languageOrder.length - 1) {
        const nextLang = languageOrder[currentIndex + 1];
        const nextSection = document.querySelector(`.roadmap-language-section[data-lang="${nextLang}"]`);
        if (nextSection) {
            nextSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function injectVideoPlayerCSS() {
    if (document.getElementById('videoPlayerCSS')) return;

    const style = document.createElement('style');
    style.id = 'videoPlayerCSS';
    style.textContent = `
.video-message-buttons {
display: flex;
gap: 10px;
margin-top: 15px;
animation: fadeInUp 0.4s ease;
}
.video-btn {
flex: 1;
padding: 12px 20px;
border: none;
border-radius: 10px;
font-weight: 600;
font-size: 0.95em;
cursor: pointer;
transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
display: flex;
align-items: center;
justify-content: center;
gap: 8px;
}
.video-btn-watch {
background: linear-gradient(135deg, #667eea, #64ffda);
color: #fff;
box-shadow: 0 4px 15px rgba(100, 255, 218, 0.3);
}
.video-btn-watch:hover {
transform: translateY(-2px);
box-shadow: 0 6px 20px rgba(100, 255, 218, 0.5);
}
.video-btn-later {
background: rgba(139, 148, 158, 0.15);
border: 2px solid rgba(139, 148, 158, 0.3);
color: #8b949e;
}
.video-btn-later:hover {
background: rgba(139, 148, 158, 0.25);
border-color: rgba(139, 148, 158, 0.5);
}
.video-container {
max-height: 0;
overflow: hidden;
opacity: 0;
margin-top: 0;
border-radius: 15px;
background: rgba(30, 30, 30, 0.95);
border: 2px solid rgba(100, 255, 218, 0.3);
transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
position: relative;
}
.video-container.active {
max-height: 500px;
opacity: 1;
margin-top: 20px;
padding: 15px;
}
.video-wrapper {
position: relative;
width: 100%;
padding-bottom: 56.25%;
background: #000;
border-radius: 10px;
overflow: hidden;
}
.video-wrapper iframe {
position: absolute;
top: 0;
left: 0;
width: 100%;
height: 100%;
border: none;
}
.fullscreen-btn {
position: absolute;
bottom: 20px;
right: 20px;
width: 44px;
height: 44px;
background: rgba(0, 0, 0, 0.8);
backdrop-filter: blur(10px);
border: 2px solid rgba(100, 255, 218, 0.5);
border-radius: 50%;
color: #64ffda;
font-size: 1.2em;
cursor: pointer;
opacity: 0;
transform: scale(0.8);
transition: all 0.3s ease;
z-index: 10;
display: flex;
align-items: center;
justify-content: center;
}
.video-container:hover .fullscreen-btn {
opacity: 1;
transform: scale(1);
}
.fullscreen-btn:hover {
background: rgba(100, 255, 218, 0.2);
transform: scale(1.1);
box-shadow: 0 0 20px rgba(100, 255, 218, 0.5);
}
.video-fullscreen-modal {
position: fixed;
top: 0;
left: 0;
width: 100vw;
height: 100vh;
z-index: 2147483647;
display: flex;
align-items: center;
justify-content: center;
opacity: 0;
visibility: hidden;
transition: opacity 0.4s ease, visibility 0.4s ease;
}
.video-fullscreen-modal.active {
opacity: 1;
visibility: visible;
}
.video-fullscreen-backdrop {
position: absolute;
top: 0;
left: 0;
width: 100%;
height: 100%;
background: rgba(0, 0, 0, 0.98);
backdrop-filter: blur(10px);
animation: fadeIn 0.3s ease;
}
.video-fullscreen-content {
position: relative;
width: 90vw;
height: calc(90vw * 9 / 16);
max-height: 85vh;
max-width: calc(85vh * 16 / 9);
display: flex;
align-items: center;
justify-content: center;
z-index: 1;
padding: 0;
transform: scale(0.8);
opacity: 0;
transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
background: #000;
border-radius: 12px;
overflow: hidden;
box-shadow: 0 25px 100px rgba(100, 255, 218, 0.4);
}
.video-fullscreen-modal.active .video-fullscreen-content {
transform: scale(1);
opacity: 1;
}
.video-fullscreen-content iframe {
width: 100%;
height: 100%;
border: none;
}
.video-fullscreen-close {
position: absolute;
top: 20px;
right: 20px;
width: 50px;
height: 50px;
background: rgba(0, 0, 0, 0.85);
backdrop-filter: blur(10px);
border: 2px solid rgba(100, 255, 218, 0.5);
border-radius: 50%;
color: #64ffda;
font-size: 1.8em;
cursor: pointer;
z-index: 10;
display: flex;
align-items: center;
justify-content: center;
transition: all 0.3s ease;
line-height: 1;
opacity: 0.9;
}
.video-fullscreen-close:hover {
background: rgba(255, 0, 0, 0.85);
border-color: rgba(255, 0, 0, 0.8);
transform: scale(1.15) rotate(90deg);
color: #fff;
opacity: 1;
}
.video-fullscreen-controls {
position: absolute;
bottom: 0;
left: 0;
width: 100%;
padding: 20px;
background: linear-gradient(to top, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.7), transparent);
z-index: 5;
opacity: 0;
transition: opacity 0.3s ease;
pointer-events: none;
}
.video-fullscreen-modal.show-controls .video-fullscreen-controls {
opacity: 1;
pointer-events: all;
}
.video-progress-container {
width: 100%;
height: 6px;
background: rgba(255, 255, 255, 0.2);
border-radius: 3px;
cursor: pointer;
position: relative;
margin-bottom: 10px;
}
.video-progress-bar {
height: 100%;
background: linear-gradient(90deg, #64ffda, #00d4ff);
border-radius: 3px;
width: 0%;
transition: width 0.1s linear;
box-shadow: 0 0 10px rgba(100, 255, 218, 0.5);
}
.video-time-display {
color: #fff;
font-size: 0.9em;
text-align: center;
font-weight: 600;
}
@media (max-width: 768px) {
.video-fullscreen-content {
width: 100vw;
height: 56.25vw;
max-height: 100vh;
max-width: 177.78vh;
border-radius: 0;
}
.video-fullscreen-close {
width: 45px;
height: 45px;
font-size: 1.5em;
top: 15px;
right: 15px;
}
}
@keyframes fadeInUp {
from {
opacity: 0;
transform: translateY(20px);
}
to {
opacity: 1;
transform: translateY(0);
}
}
@media (max-width: 768px) {
.video-message-buttons {
flex-direction: column;
}
.video-btn {
width: 100%;
}
.video-container.active {
max-height: 300px;
}
.fullscreen-btn {
width: 40px;
height: 40px;
font-size: 1.1em;
}
.video-fullscreen-close {
width: 50px;
height: 50px;
font-size: 1.6em;
}
}
`;
    document.head.appendChild(style);
}

function showVideoPlayer(messageIndex) {
    const container = document.getElementById('videoContainer-' + messageIndex);
    const iframe = document.getElementById('videoFrame-' + messageIndex);

    if (!container || !iframe) return;

    // Get video URL from current lesson
    const content = currentLesson.isAI
        ? aiCourseContent
        : lessonContent[currentLesson.language][currentLesson.courseId];

    const videoUrl = content.videoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ'; // Fallback video

    // Convert YouTube watch URL to embed URL if needed
    let embedUrl = videoUrl;
    if (videoUrl.includes('youtube.com/watch')) {
        const videoId = videoUrl.split('v=')[1]?.split('&')[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }

    // Set video source
    iframe.src = embedUrl;

    // Show container with animation
    setTimeout(() => {
        container.classList.add('active');
        currentVideoIndex = messageIndex;

        // Play sound effect if enabled
        if (soundEnabled) {
            playNotificationSound();
        }
    }, 100);

    // Scroll to video
    setTimeout(() => {
        container.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 700);
}

function skipVideo() {
    showNotification('You can watch the video anytime later!', 'info');
}

function toggleFullscreen(messageIndex) {
    const container = document.getElementById('videoContainer-' + messageIndex);
    const iframe = document.getElementById('videoFrame-' + messageIndex);

    if (!container || !iframe) return;

    if (!isFullscreen) {
        // Create fullscreen modal overlay
        const modal = document.createElement('div');
        modal.id = 'videoFullscreenModal';
        modal.className = 'video-fullscreen-modal show-controls';

        modal.innerHTML = `
            <div class="video-fullscreen-backdrop"></div>
            <div class="video-fullscreen-content">
                <button class="video-fullscreen-close" onclick="closeVideoFullscreen()">✕</button>
                <iframe src="${iframe.src}"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen>
                </iframe>
                <div class="video-fullscreen-controls">
                    <div class="video-progress-container" onclick="seekVideo(event)">
                        <div class="video-progress-bar" id="videoProgressBar"></div>
                    </div>
                    <div class="video-time-display" id="videoTimeDisplay">Video Player</div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';

        setTimeout(() => modal.classList.add('active'), 50);

        isFullscreen = true;
        currentVideoIndex = messageIndex;

        // Lock scroll
        lockScroll();

        // Auto-hide controls on mouse inactivity
        let mouseInactivityTimer;
        const hideControls = () => {
            modal.classList.remove('show-controls');
        };
        const showControls = () => {
            modal.classList.add('show-controls');
            clearTimeout(mouseInactivityTimer);
            mouseInactivityTimer = setTimeout(hideControls, 3000);
        };

        modal.addEventListener('mousemove', showControls);
        modal.addEventListener('click', showControls);
        showControls(); // Show initially

    } else {
        closeVideoFullscreen();
    }
}

function seekVideo(event) {
    const progressContainer = event.currentTarget;
    const rect = progressContainer.getBoundingClientRect();
    const pos = (event.clientX - rect.left) / rect.width;
    const progressBar = document.getElementById('videoProgressBar');

    if (progressBar) {
        progressBar.style.width = (pos * 100) + '%';
        // Note: Actual video seeking would require YouTube API or similar
    }
}

function closeVideoFullscreen() {
    const modal = document.getElementById('videoFullscreenModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = '';
        }, 300);
    }

    isFullscreen = false;
    unlockScroll();
}

function exitFullscreen() {
    if (currentVideoIndex === null) return;

    const container = document.getElementById('videoContainer-' + currentVideoIndex);
    if (!container) return;

    container.classList.remove('fullscreen');
    isFullscreen = false;

    // Change button icon back
    const btn = container.querySelector('.fullscreen-btn');
    if (btn) btn.innerHTML = '⛶';

    // Unlock scroll
    unlockScroll();

    // Scroll back to video
    setTimeout(() => {
        container.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 400);

    currentVideoIndex = null;
}

document.addEventListener('keydown', debounce(function(e) {
    if (e.key === 'Escape' && isFullscreen) {
        e.preventDefault();
        closeVideoFullscreen();
    }
}, 100)); // ← Add debounce here!

// Prevent scroll while in fullscreen
document.addEventListener('wheel', function(e) {
    if (isFullscreen) {
        e.preventDefault();
    }
}, { passive: false });

// Mobile landscape orientation detection for auto-fullscreen
let lastActiveVideoIndex = null;

// Track when a video container becomes active
function trackActiveVideo() {
    const activeContainers = document.querySelectorAll('.video-container.active');
    if (activeContainers.length > 0) {
        const lastContainer = activeContainers[activeContainers.length - 1];
        const videoId = lastContainer.id;
        if (videoId) {
            const match = videoId.match(/videoContainer-(\d+)/);
            if (match) {
                lastActiveVideoIndex = parseInt(match[1]);
            }
        }
    }
}

// ✅ Only watch specific containers, not entire body
const videoObserver = new MutationObserver(() => {
    trackActiveVideo();
});

// Only observe the specific container where videos are shown
const videoContainer = document.querySelector('.lessons-container'); // or whatever contains videos
if (videoContainer) {
    videoObserver.observe(videoContainer, {
        attributes: true,
        attributeFilter: ['class'], // Only watch class changes
        subtree: true
        // Removed childList to reduce triggers
    });
}

// Start observing when DOM is ready
if (document.body) {
    videoObserver.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class']
    });
}

// Detect orientation change on mobile devices
window.addEventListener('orientationchange', function() {
    // Check if device is mobile (screen width < 768px)
    const isMobile = window.innerWidth < 768;

    if (isMobile && lastActiveVideoIndex !== null) {
        // Check if orientation is landscape
        const isLandscape = window.orientation === 90 || window.orientation === -90 ||
                          (window.screen && window.screen.orientation &&
                           window.screen.orientation.type.includes('landscape'));

        if (isLandscape && !isFullscreen) {
            // Auto-enter fullscreen when rotated to landscape
            console.log('Landscape detected - auto-entering fullscreen');
            setTimeout(() => {
                toggleFullscreen(lastActiveVideoIndex);
            }, 300); // Small delay to allow orientation change to complete
        } else if (!isLandscape && isFullscreen) {
            // Auto-exit fullscreen when rotated back to portrait
            console.log('Portrait detected - auto-exiting fullscreen');
            closeVideoFullscreen();
        }
    }
});

// Also listen to screen orientation API (modern browsers)
if (window.screen && window.screen.orientation) {
    window.screen.orientation.addEventListener('change', function() {
        const isMobile = window.innerWidth < 768;

        if (isMobile && lastActiveVideoIndex !== null) {
            const isLandscape = window.screen.orientation.type.includes('landscape');

            if (isLandscape && !isFullscreen) {
                console.log('Landscape detected (Screen API) - auto-entering fullscreen');
                setTimeout(() => {
                    toggleFullscreen(lastActiveVideoIndex);
                }, 300);
            } else if (!isLandscape && isFullscreen) {
                console.log('Portrait detected (Screen API) - auto-exiting fullscreen');
                closeVideoFullscreen();
            }
        }
    });
}

// Track video container when it becomes active
document.addEventListener('click', function(e) {
    if (e.target.closest('.video-btn-watch')) {
        setTimeout(trackActiveVideo, 500);
    }
});

function toggleProgressBar(event, lang, courseId, progress) {
    event.stopPropagation();

    const progressBar = event.currentTarget;
    const percentSpan = document.getElementById(`percent-${lang}-${courseId}`);
    const progressFill = progressBar.querySelector('.progress-fill');

    if (progressBar.classList.contains('expanded')) {
        // Collapse
        progressBar.classList.remove('expanded');
        if (percentSpan) {
            percentSpan.classList.remove('hidden');
        }
        progressFill.textContent = '';
    } else {
        // Expand
        progressBar.classList.add('expanded');
        if (percentSpan) {
            percentSpan.classList.add('hidden');
        }
        progressFill.textContent = `${progress}% Complete`;
    }
}

let hasLoadedOnce = false;

function animateWidgetCards() {
    const statsGrid = document.querySelector('#home .stats-grid');
    if (!statsGrid) return;

    const cards = Array.from(statsGrid.querySelectorAll('.stat-card'));
    if (cards.length === 0) return;

    // Reset all cards
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.8) translateY(30px)';
        card.style.transition = 'none';
    });

    // Force reflow
    void statsGrid.offsetHeight;

    // Show first card
    setTimeout(() => {
        if (cards[0]) {
            cards[0].style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
            cards[0].style.opacity = '1';
            cards[0].style.transform = 'scale(1) translateY(0)';
        }
    }, 100);

    // Shuffle and show remaining cards
    setTimeout(() => {
        cards.forEach((card, index) => {
            if (index === 0) return; // Skip first card

            setTimeout(() => {
                card.style.transition = `all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)`;
                card.style.opacity = '1';
                card.style.transform = 'scale(1) translateY(0)';
            }, index * 100);
        });
    }, 400);
}

// Override showSection to handle animations properly
const originalShowSection = showSection;
showSection = function(sectionId) {
    document.querySelectorAll('.section').forEach(s => {
        s.classList.remove('active');
        s.classList.remove('page-load-animate');
    });
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));

    const section = document.getElementById(sectionId);
    section.classList.add('active');

    // Only animate on first load or if it's home section and page was refreshed
    if (sectionId === 'home' && !hasLoadedOnce) {
        hasLoadedOnce = true;
        setTimeout(() => {
            animateWidgetCards();
        }, 100);
    } else {
        // For tab switches, just show without animation
        const cards = section.querySelectorAll('.stat-card');
        cards.forEach(card => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1) translateY(0)';
            card.style.transition = 'none';
        });
    }

    const activeTab = Array.from(document.querySelectorAll('.nav-tab')).find(
        tab => tab.textContent.toLowerCase().includes(sectionId === 'home' ? 'overview' : sectionId)
    );
    if (activeTab) activeTab.classList.add('active');

    if (sectionId === 'home') {
    // Defer ALL dashboard work
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => updateDashboard(), { timeout: 500 });
    } else {
        setTimeout(() => updateDashboard(), 0);
    }

    if (sectionId === 'stats') {
        setTimeout(() => {
            initializeGoalsButtons();
        }, 100);
    }
};

class NetworkAnimation {
    constructor() {
        this.canvas = document.getElementById('networkCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.nodes = [];
        this.nodeCount = 100;
        this.mouse = { x: null, y: null, radius: 150 };
        this.theme = localStorage.getItem('nodeTheme') || 'green';

        this.resize();
        this.initNodes();
        this.animate();

        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    initNodes() {
        this.nodes = [];
        for (let i = 0; i < this.nodeCount; i++) {
            this.nodes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2.5 + 1.5
            });
        }
    }

    getThemeColor() {
        const themes = {
            green: { r: 100, g: 255, b: 218 },
            blue: { r: 102, g: 126, b: 234 },
            pink: { r: 255, g: 107, b: 157 }
        };
        return themes[this.theme] || themes.green;
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const color = this.getThemeColor();

        // Update and draw nodes
        this.nodes.forEach((node, i) => {
            // Move nodes
            node.x += node.vx;
            node.y += node.vy;

            // Bounce off walls
            if (node.x < 0 || node.x > this.canvas.width) node.vx *= -1;
            if (node.y < 0 || node.y > this.canvas.height) node.vy *= -1;

            // Mouse interaction
            if (this.mouse.x && this.mouse.y) {
                const dx = this.mouse.x - node.x;
                const dy = this.mouse.y - node.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.mouse.radius) {
                    const force = (this.mouse.radius - distance) / this.mouse.radius;
                    node.vx -= (dx / distance) * force * 0.2;
                    node.vy -= (dy / distance) * force * 0.2;
                }
            }

            // Limit velocity
            const speed = Math.sqrt(node.vx * node.vx + node.vy * node.vy);
            if (speed > 2) {
                node.vx = (node.vx / speed) * 2;
                node.vy = (node.vy / speed) * 2;
            }

            // Draw node with glow effect
            this.ctx.shadowBlur = 15;
            this.ctx.shadowColor = `rgba(${color.r}, ${color.g}, ${color.b}, 0.8)`;
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.9)`;
            this.ctx.fill();

            // Add inner glow
            this.ctx.shadowBlur = 8;
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.radius * 0.6, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, 0.6)`;
            this.ctx.fill();
            this.ctx.shadowBlur = 0;

            // Draw connections with glow
            for (let j = i + 1; j < this.nodes.length; j++) {
                const dx = this.nodes[j].x - node.x;
                const dy = this.nodes[j].y - node.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    const opacity = (1 - distance / 150) * 0.6;
                    this.ctx.shadowBlur = 3;
                    this.ctx.shadowColor = `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity})`;
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.moveTo(node.x, node.y);
                    this.ctx.lineTo(this.nodes[j].x, this.nodes[j].y);
                    this.ctx.stroke();
                    this.ctx.shadowBlur = 0;
                }
            }
        });

        requestAnimationFrame(() => this.animate());
    }

    changeTheme(newTheme) {
        this.theme = newTheme;
    }
}

let networkAnimation;

function changeTheme(theme) {
    // Update visual selection
    document.querySelectorAll('.theme-option').forEach(opt => {
        opt.classList.remove('active');
    });
    document.querySelector(`[data-theme="${theme}"]`).classList.add('active');

    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme);

    // Update network animation
    if (networkAnimation) {
        networkAnimation.changeTheme(theme);
    }

    // Save to localStorage
    localStorage.setItem('nodeTheme', theme);

    // Show notification
    showNotification(`Theme changed to ${theme.charAt(0).toUpperCase() + theme.slice(1)}!`, 'success');
}

function toggleAIAssistant() {
    const toggle = document.getElementById('aiAssistantToggle');
    toggle.classList.toggle('active');

    const isEnabled = toggle.classList.contains('active');
    localStorage.setItem('aiAssistantEnabled', isEnabled);

    // Update AI button visibility
    updateAIButtonVisibility(isEnabled);

    showNotification(
        isEnabled ? 'AI Assistant enabled!' : 'AI Assistant disabled!',
        'success'
    );
}

function updateAIButtonVisibility(isEnabled) {
    const aiButton = document.querySelector('.ai-toggle-btn');
    if (aiButton) {
        aiButton.style.display = isEnabled ? 'flex' : 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize network animation (now hidden)
    networkAnimation = new NetworkAnimation();

    // Load saved theme
    const savedTheme = localStorage.getItem('nodeTheme') || 'green';
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.querySelectorAll('.theme-option').forEach(opt => {
        opt.classList.remove('active');
    });
    const savedThemeOption = document.querySelector(`[data-theme="${savedTheme}"]`);
    if (savedThemeOption) {
        savedThemeOption.classList.add('active');

    // Load AI assistant setting
    const aiEnabled = localStorage.getItem('aiAssistantEnabled') !== 'false';
    const aiToggle = document.getElementById('aiAssistantToggle');
    if (aiToggle) {
        if (aiEnabled) {
            aiToggle.classList.add('active');
        } else {
            aiToggle.classList.remove('active');
        }
    }
    updateAIButtonVisibility(aiEnabled);

    // Event delegation for nav tabs with debouncing
    const navTabs = document.querySelector('.nav-tabs');
    if (navTabs) {
        navTabs.addEventListener('click', (e) => {
            if (isTransitioning) return;
            
            const tab = e.target.closest('.nav-tab');
            if (!tab) return;
            
            const sectionId = tab.dataset.section;
            if (sectionId) {
                isTransitioning = true;
                showSection(sectionId);
                
                setTimeout(() => {
                    isTransitioning = false;
                }, 300);
            }
        });
    }
});
});
