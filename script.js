// ========================================
// AUTHENTICATION SYSTEM
// ========================================
(function() {
    // EmailJS Configuration
    // Initialize EmailJS with your public key
    // To get your keys: https://www.emailjs.com/
    const EMAILJS_CONFIG = {
        serviceId: 'service_default', // Replace with your EmailJS service ID
        templateId2FA: 'template_2fa',  // Replace with your 2FA template ID
        templateIdReset: 'template_reset', // Replace with your password reset template ID
        publicKey: 'YOUR_PUBLIC_KEY' // Replace with your EmailJS public key
    };

    // Initialize EmailJS
    if (typeof emailjs !== 'undefined' && EMAILJS_CONFIG.publicKey !== 'YOUR_PUBLIC_KEY') {
        emailjs.init(EMAILJS_CONFIG.publicKey);
        console.log('✅ EmailJS initialized successfully');
    } else {
        console.warn('⚠️ EmailJS not configured. Set up your keys in EMAILJS_CONFIG.');
    }

    // State
    let emailConfig = null;
    let verificationCode = null;
    let resetEmail = null;

    // DOM Elements
    const authOverlay = document.getElementById('authOverlay');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    const verifyCodeForm = document.getElementById('verifyCodeForm');
    const twoFACodeForm = document.getElementById('twoFACodeForm');

    // Login Elements
    const loginEmail = document.getElementById('loginEmail');
    const loginPassword = document.getElementById('loginPassword');
    const loginBtn = document.getElementById('loginBtn');
    const loginError = document.getElementById('loginError');
    const auth2FABadge = document.getElementById('auth2FABadge');

    // Signup Elements
    const signupName = document.getElementById('signupName');
    const signupEmail = document.getElementById('signupEmail');
    const signupPassword = document.getElementById('signupPassword');
    const signupBtn = document.getElementById('signupBtn');
    const signupError = document.getElementById('signupError');

    // Forgot Password Elements
    const forgotEmail = document.getElementById('forgotEmail');
    const sendCodeBtn = document.getElementById('sendCodeBtn');
    const forgotError = document.getElementById('forgotError');

    // Verify Code Elements
    const verifyCode = document.getElementById('verifyCode');
    const newPassword = document.getElementById('newPassword');
    const resetPasswordBtn = document.getElementById('resetPasswordBtn');
    const verifyError = document.getElementById('verifyError');

    // Form Switching Links
    const showSignup = document.getElementById('showSignup');
    const showLogin = document.getElementById('showLogin');
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    const backToLogin = document.getElementById('backToLogin');
    const backToLoginFromVerify = document.getElementById('backToLoginFromVerify');

    // Initialize
    function init() {
        loadEmailConfig();
        checkAuth();
        setupEventListeners();
    }

    // Load EmailJS Configuration
    function loadEmailConfig() {
        fetch('/api/email-config')
            .then(res => res.json())
            .then(config => {
                emailConfig = {
                    serviceId: config.EMAIL_SERVICE_ID,
                    templateId: config.EMAIL_TEMPLATE_ID,
                    publicKey: config.EMAIL_PUBLIC_KEY
                };

                if (emailConfig.publicKey) {
                    emailjs.init(emailConfig.publicKey);
                    console.log("✅ EmailJS initialized for auth");
                }
            })
            .catch(err => console.error("Error loading EmailJS config:", err));
    }

    // Check if user is already authenticated
    function checkAuth() {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            const user = JSON.parse(currentUser);
            console.log("User already logged in:", user.name);
            hideAuthOverlay();
            updateUIWithUser(user);
        } else {
            showAuthOverlay();
        }
    }

    // Setup Event Listeners
    function setupEventListeners() {
        // Login
        loginBtn.addEventListener('click', handleLogin);
        loginPassword.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleLogin();
        });

        // Check for 2FA badge on email input
        loginEmail.addEventListener('input', () => {
            const email = loginEmail.value.trim();
            if (email && isValidEmail(email)) {
                const users = JSON.parse(localStorage.getItem('users') || '[]');
                const user = users.find(u => u.email === email);
                if (user && user.twoFactorEnabled) {
                    auth2FABadge.style.display = 'flex';
                } else {
                    auth2FABadge.style.display = 'none';
                }
            } else {
                auth2FABadge.style.display = 'none';
            }
        });

        // Signup
        signupBtn.addEventListener('click', handleSignup);
        signupPassword.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSignup();
        });

        // Forgot Password
        sendCodeBtn.addEventListener('click', handleSendCode);
        forgotEmail.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSendCode();
        });

        // Reset Password
        resetPasswordBtn.addEventListener('click', handleResetPassword);
        newPassword.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleResetPassword();
        });

        // Verify Code Input - Real-time validation
        verifyCode.addEventListener('input', handleVerifyCodeInput);

        // Form Switching
        showSignup.addEventListener('click', () => switchForm('signup'));
        showLogin.addEventListener('click', () => switchForm('login'));
        forgotPasswordLink.addEventListener('click', () => switchForm('forgot'));
        backToLogin.addEventListener('click', () => switchForm('login'));
        backToLoginFromVerify.addEventListener('click', () => switchForm('login'));
    }

    // Switch Between Forms
    function switchForm(formType) {
        // Hide all forms
        loginForm.style.display = 'none';
        signupForm.style.display = 'none';
        forgotPasswordForm.style.display = 'none';
        verifyCodeForm.style.display = 'none';
        if (twoFACodeForm) twoFACodeForm.style.display = 'none';

        // Hide 2FA badge when switching forms
        if (auth2FABadge) auth2FABadge.style.display = 'none';

        // Clear all errors
        hideError(loginError);
        hideError(signupError);
        hideError(forgotError);
        hideError(verifyError);

        // Show selected form
        switch(formType) {
            case 'login':
                loginForm.style.display = 'block';
                break;
            case 'signup':
                signupForm.style.display = 'block';
                break;
            case 'forgot':
                forgotPasswordForm.style.display = 'block';
                break;
            case 'verify':
                verifyCodeForm.style.display = 'block';
                break;
            case '2fa':
                if (twoFACodeForm) {
                    twoFACodeForm.style.display = 'block';
                    // Focus first code input
                    setTimeout(() => {
                        const firstInput = document.querySelector('.code-digit');
                        if (firstInput) firstInput.focus();
                    }, 100);
                }
                break;
        }
    }

    // Handle Login
    function handleLogin() {
        const email = loginEmail.value.trim();
        const password = loginPassword.value.trim();

        hideError(loginError);

        // Validation
        if (!email || !password) {
            showError(loginError, "Please enter both email and password");
            return;
        }

        if (!isValidEmail(email)) {
            showError(loginError, "Please enter a valid email address");
            return;
        }

        // Get users from localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email);

        if (!user) {
            showError(loginError, "Account doesn't exist. Please sign up first.");
            return;
        }

        if (user.password !== password) {
            showError(loginError, "Wrong password or email. Please try again.");
            return;
        }

        // Check if 2FA is enabled
        if (user.twoFactorEnabled) {
            // Generate 5-digit code
            const twoFACode = Math.floor(10000 + Math.random() * 90000).toString();

            // Store code and email temporarily
            sessionStorage.setItem('temp2FACode', twoFACode);
            sessionStorage.setItem('temp2FAEmail', email);

            // Send email with code
            send2FAEmail(email, user.name, twoFACode);

            // Show 2FA code form
            switchForm('2fa');
            return;
        }

        // Successful login
        localStorage.setItem('currentUser', JSON.stringify(user));
        hideAuthOverlay();
        updateUIWithUser(user);
        clearLoginForm();
    }

    // Handle Signup
    function handleSignup() {
        const name = signupName.value.trim();
        const email = signupEmail.value.trim();
        const password = signupPassword.value.trim();

        hideError(signupError);

        // Validation
        if (!name || !email || !password) {
            showError(signupError, "Please fill in all fields");
            return;
        }

        if (!isValidEmail(email)) {
            showError(signupError, "Please enter a valid email address");
            return;
        }

        if (password.length < 6) {
            showError(signupError, "Password must be at least 6 characters");
            return;
        }

        // Check if user already exists
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        if (users.find(u => u.email === email)) {
            showError(signupError, "Account already exists. Please login.");
            return;
        }

        // Create new user
        const newUser = { name, email, password };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        // Show success and switch to login
        clearSignupForm();
        switchForm('login');
        showSuccess("Account created successfully! Please login.");
    }

    // Handle Send Verification Code
    function handleSendCode() {
        const email = forgotEmail.value.trim();

        hideError(forgotError);

        // Validation
        if (!email) {
            showError(forgotError, "Please enter your email");
            return;
        }

        if (!isValidEmail(email)) {
            showError(forgotError, "Please enter a valid email address");
            return;
        }

        // Check if user exists
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email);

        if (!user) {
            showError(forgotError, "No account found with this email");
            return;
        }

        // Generate 6-digit code
        verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        resetEmail = email;

        // Send email with EmailJS
        if (emailConfig && emailConfig.publicKey) {
            sendCodeBtn.classList.add('loading');
            sendCodeBtn.disabled = true;

            emailjs.send(emailConfig.serviceId, emailConfig.templateId, {
                to_email: email,
                user_name: user.name,
                to_name: user.name,
                verification_code: verificationCode,
                reset_code: verificationCode
            })
            .then(() => {
                sendCodeBtn.classList.remove('loading');
                sendCodeBtn.disabled = false;
                switchForm('verify');
            })
            .catch(err => {
                console.error("Email send error:", err);
                sendCodeBtn.classList.remove('loading');
                sendCodeBtn.disabled = false;
                showError(forgotError, "Failed to send email. Please try again.");
            });
        } else {
            // For testing without EmailJS
            console.log("Verification code:", verificationCode);
            alert(`Your verification code is: ${verificationCode} (EmailJS not configured)`);
            switchForm('verify');
        }
    }

    // Handle Verify Code Input - Real-time validation
    let verifyCodeTimeout = null;
    function handleVerifyCodeInput() {
        const code = verifyCode.value.trim();
        const passwordGroup = document.querySelector('#verifyCodeForm .auth-input-group:last-of-type');

        // Clear previous timeout
        if (verifyCodeTimeout) {
            clearTimeout(verifyCodeTimeout);
        }

        // Remove unlocked class first
        passwordGroup.classList.remove('unlocked');

        // Check if code is 6 digits
        if (code.length === 6) {
            // Wait 1 second before checking
            verifyCodeTimeout = setTimeout(() => {
                if (code === verificationCode) {
                    // Unlock password field with animation
                    passwordGroup.classList.add('unlocked');
                    newPassword.focus();
                } else {
                    // Show error if code doesn't match
                    showError(verifyError, "Invalid verification code");
                }
            }, 1000);
        }
    }

    // Handle Reset Password
    function handleResetPassword() {
        const code = verifyCode.value.trim();
        const newPass = newPassword.value.trim();

        hideError(verifyError);

        // Validation
        if (!code || !newPass) {
            showError(verifyError, "Please fill in all fields");
            return;
        }

        if (code !== verificationCode) {
            showError(verifyError, "Invalid verification code");
            return;
        }

        if (newPass.length < 6) {
            showError(verifyError, "Password must be at least 6 characters");
            return;
        }

        // Update password
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.email === resetEmail);

        if (userIndex !== -1) {
            users[userIndex].password = newPass;
            localStorage.setItem('users', JSON.stringify(users));

            // Clear verification data
            verificationCode = null;
            resetEmail = null;
            clearVerifyForm();

            // Switch to login
            switchForm('login');
            showSuccess("Password reset successfully! Please login.");
        } else {
            showError(verifyError, "User not found");
        }
    }

    // Update UI with logged-in user
    function updateUIWithUser(user) {
        // Update AI sidebar greeting
        const aiConversation = document.getElementById('aiConversation');
        if (aiConversation) {
            const welcomeMsg = aiConversation.querySelector('.ai-welcome');
            if (welcomeMsg) {
                welcomeMsg.textContent = `Hi ${user.name}! Ask me anything about your code!`;
            }
        }

        // Update homepage welcome message
        const welcomeTitle = document.getElementById('welcomeTitle');
        if (welcomeTitle) {
            welcomeTitle.textContent = `Welcome Back, ${user.name}!`;
        }

        // Update settings profile
        const profileAvatar = document.getElementById('profileAvatar');
        const profileName = document.getElementById('profileName');
        const profileEmail = document.getElementById('profileEmail');

        if (profileAvatar && user.name) {
            profileAvatar.textContent = user.name.charAt(0).toUpperCase();
        }

        if (profileName) {
            profileName.textContent = user.name;
        }

        if (profileEmail) {
            profileEmail.textContent = user.email;
        }

        // Store globally for other scripts to access
        window.currentUser = user;
    }

    // Show/Hide Auth Overlay
    function showAuthOverlay() {
        authOverlay.classList.add('active');
    }

    function hideAuthOverlay() {
        authOverlay.classList.remove('active');
    }

    // Error/Success Handling
    function showError(element, message) {
        element.textContent = message;
        element.classList.add('show');
    }

    function hideError(element) {
        element.classList.remove('show');
    }

    function showSuccess(message) {
        // Create temporary success element in login form
        const successDiv = document.createElement('div');
        successDiv.className = 'auth-success show';
        successDiv.textContent = message;
        loginForm.appendChild(successDiv);

        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    }

    // Form Clearing
    function clearLoginForm() {
        loginEmail.value = '';
        loginPassword.value = '';
    }

    function clearSignupForm() {
        signupName.value = '';
        signupEmail.value = '';
        signupPassword.value = '';
    }

    function clearVerifyForm() {
        verifyCode.value = '';
        newPassword.value = '';
    }

    // Email Validation
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Logout Function (can be called from elsewhere)
    window.logout = function() {
        localStorage.removeItem('currentUser');
        window.currentUser = null;
        location.reload();
    };

    // ========== 2FA FUNCTIONS ==========
    async function send2FAEmail(email, name, code) {
        console.log(`[2FA] Sending code ${code} to ${email}`);

        // Check if EmailJS is configured
        if (typeof emailjs === 'undefined' || EMAILJS_CONFIG.publicKey === 'YOUR_PUBLIC_KEY') {
            console.warn('⚠️ EmailJS not configured. Showing code in console for development.');
            showSuccess(`2FA code sent (DEV MODE): ${code}`);

            // Show notification with code for development
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(135deg, #8b5cf6, #7c3aed);
                color: white;
                padding: 20px 30px;
                border-radius: 16px;
                font-size: 16px;
                font-weight: 600;
                box-shadow: 0 8px 32px rgba(139, 92, 246, 0.5);
                z-index: 100000;
                text-align: center;
            `;
            notification.innerHTML = `
                <div style="margin-bottom: 10px;">🔐 Your 2FA Code</div>
                <div style="font-size: 32px; letter-spacing: 8px; font-family: monospace;">${code}</div>
                <div style="margin-top: 10px; font-size: 12px; opacity: 0.8;">(Development Mode - EmailJS not configured)</div>
            `;
            document.body.appendChild(notification);

            setTimeout(() => {
                notification.remove();
            }, 10000);
            return;
        }

        // Send actual email using EmailJS
        try {
            const templateParams = {
                to_email: email,
                to_name: name,
                verification_code: code,
                from_name: 'Code Academy'
            };

            await emailjs.send(
                EMAILJS_CONFIG.serviceId,
                EMAILJS_CONFIG.templateId2FA,
                templateParams
            );

            console.log('✅ 2FA email sent successfully to:', email);
            showSuccess('Verification code sent to your email!');

        } catch (error) {
            console.error('❌ Failed to send email:', error);

            // Fallback: show code in UI if email fails
            showSuccess(`Email failed. Your code is: ${code}`);

            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(135deg, #ef4444, #dc2626);
                color: white;
                padding: 20px 30px;
                border-radius: 16px;
                font-size: 16px;
                font-weight: 600;
                box-shadow: 0 8px 32px rgba(239, 68, 68, 0.5);
                z-index: 100000;
                text-align: center;
            `;
            notification.innerHTML = `
                <div style="margin-bottom: 10px;">⚠️ Email Service Error</div>
                <div>Your code: <span style="font-size: 24px; letter-spacing: 4px; font-family: monospace;">${code}</span></div>
                <div style="margin-top: 10px; font-size: 12px; opacity: 0.8;">Please check EmailJS configuration</div>
            `;
            document.body.appendChild(notification);

            setTimeout(() => {
                notification.remove();
            }, 10000);
        }
    }

    // 2FA Code Input Handling
    const codeDigits = document.querySelectorAll('.code-digit');
    const verify2FABtn = document.getElementById('verify2FABtn');
    const backToLoginFrom2FA = document.getElementById('backToLoginFrom2FA');
    const twoFAError = document.getElementById('twoFAError');

    if (codeDigits.length > 0) {
        codeDigits.forEach((input, index) => {
            input.addEventListener('input', (e) => {
                const value = e.target.value;

                if (value.length === 1) {
                    input.classList.add('filled');
                    // Move to next input
                    if (index < codeDigits.length - 1) {
                        codeDigits[index + 1].focus();
                    }
                } else {
                    input.classList.remove('filled');
                }
            });

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && !input.value) {
                    // Move to previous input on backspace
                    if (index > 0) {
                        codeDigits[index - 1].focus();
                    }
                }
            });

            // Allow paste
            input.addEventListener('paste', (e) => {
                e.preventDefault();
                const paste = e.clipboardData.getData('text').slice(0, 5);
                paste.split('').forEach((char, i) => {
                    if (codeDigits[i]) {
                        codeDigits[i].value = char;
                        codeDigits[i].classList.add('filled');
                    }
                });
                if (codeDigits[paste.length - 1]) {
                    codeDigits[paste.length - 1].focus();
                }
            });
        });
    }

    if (verify2FABtn) {
        verify2FABtn.addEventListener('click', handle2FAVerification);
    }

    if (backToLoginFrom2FA) {
        backToLoginFrom2FA.addEventListener('click', () => switchForm('login'));
    }

    function handle2FAVerification() {
        const code = Array.from(codeDigits).map(input => input.value).join('');

        if (code.length !== 5) {
            showError(twoFAError, 'Please enter the complete 5-digit code');
            return;
        }

        const storedCode = sessionStorage.getItem('temp2FACode');
        const email = sessionStorage.getItem('temp2FAEmail');

        if (code === storedCode) {
            // Successful verification
            verify2FABtn.classList.add('loading');
            verify2FABtn.disabled = true;

            setTimeout(() => {
                const users = JSON.parse(localStorage.getItem('users') || '[]');
                const user = users.find(u => u.email === email);

                if (user) {
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    sessionStorage.removeItem('temp2FACode');
                    sessionStorage.removeItem('temp2FAEmail');

                    hideAuthOverlay();
                    updateUIWithUser(user);

                    // Clear code inputs
                    codeDigits.forEach(input => {
                        input.value = '';
                        input.classList.remove('filled');
                    });

                    verify2FABtn.classList.remove('loading');
                    verify2FABtn.disabled = false;
                }
            }, 1500); // 1.5s loading animation
        } else {
            showError(twoFAError, 'Invalid code. Please try again.');
            // Clear inputs
            codeDigits.forEach(input => {
                input.value = '';
                input.classList.remove('filled');
            });
            codeDigits[0].focus();
        }
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

// ========================================
// COURSE DATA
// ========================================
// UPDATED COURSE DATA - REPLACE YOUR EXISTING coursesData
const coursesData = {
    python: [
        { id: 1, title: "Python Basics", desc: "Learn print statements and simple commands", details: "Duration: 1.5 hours | Difficulty: Beginner | Topics: 6", unlocked: true },
        { id: 2, title: "Variables & Types", desc: "Understanding variables and data types", details: "Duration: 2 hours | Difficulty: Beginner | Topics: 7", unlocked: false },
        { id: 3, title: "Control Flow", desc: "Master if statements and loops", details: "Duration: 1.5 hours | Difficulty: Beginner | Topics: 6", unlocked: false },
        { id: 4, title: "Functions", desc: "Create reusable code blocks", details: "Duration: 2 hours | Difficulty: Intermediate | Topics: 7", unlocked: false },
        { id: 5, title: "Data Structures", desc: "Work with lists and dictionaries", details: "Duration: 3 hours | Difficulty: Intermediate | Topics: 10", unlocked: false },
        { id: 6, title: "File Handling", desc: "Read and write files in Python", details: "Duration: 2 hours | Difficulty: Intermediate | Topics: 8", unlocked: false }
    ],
    javascript: [
        { id: 1, title: "JS Fundamentals", desc: "Variables, types, and operators", details: "Duration: 2 hours | Difficulty: Beginner | Topics: 9", unlocked: true },
        { id: 2, title: "Functions", desc: "Regular and arrow functions", details: "Duration: 1.5 hours | Difficulty: Beginner | Topics: 7", unlocked: false },
        { id: 3, title: "DOM Manipulation", desc: "Interact with HTML elements", details: "Duration: 2.5 hours | Difficulty: Intermediate | Topics: 8", unlocked: false },
        { id: 4, title: "Events", desc: "Handle user interactions", details: "Duration: 2 hours | Difficulty: Intermediate | Topics: 6", unlocked: false },
        { id: 5, title: "Async JavaScript", desc: "Promises and async/await", details: "Duration: 3 hours | Difficulty: Advanced | Topics: 6", unlocked: false }
    ],
    react: [
        { id: 1, title: "React Basics", desc: "Components and JSX", details: "Duration: 2 hours | Difficulty: Beginner | Topics: 7", unlocked: true },
        { id: 2, title: "State & Props", desc: "Managing component state", details: "Duration: 2.5 hours | Difficulty: Intermediate | Topics: 8", unlocked: false },
        { id: 3, title: "Hooks", desc: "useState, useEffect, and more", details: "Duration: 3 hours | Difficulty: Intermediate | Topics: 9", unlocked: false },
        { id: 4, title: "React Router", desc: "Navigation in React apps", details: "Duration: 2 hours | Difficulty: Intermediate | Topics: 5", unlocked: false },
        { id: 5, title: "Context API", desc: "Global state management", details: "Duration: 2.5 hours | Difficulty: Advanced | Topics: 6", unlocked: false },
        { id: 6, title: "React Performance", desc: "Optimization techniques", details: "Duration: 3 hours | Difficulty: Advanced | Topics: 8", unlocked: false }
    ],
    html: [
        { id: 1, title: "HTML Basics", desc: "Structure web pages", details: "Duration: 1.5 hours | Difficulty: Beginner | Topics: 6", unlocked: true },
        { id: 2, title: "CSS Styling", desc: "Style your pages", details: "Duration: 2.5 hours | Difficulty: Beginner | Topics: 10", unlocked: false },
        { id: 3, title: "Flexbox & Grid", desc: "Modern layouts", details: "Duration: 2 hours | Difficulty: Intermediate | Topics: 7", unlocked: false },
        { id: 4, title: "Responsive Design", desc: "Mobile-first approach", details: "Duration: 2 hours | Difficulty: Intermediate | Topics: 6", unlocked: false },
        { id: 5, title: "CSS Animations", desc: "Create smooth transitions", details: "Duration: 2.5 hours | Difficulty: Intermediate | Topics: 8", unlocked: false },
        { id: 6, title: "Advanced CSS", desc: "Sass, variables, and more", details: "Duration: 3 hours | Difficulty: Advanced | Topics: 9", unlocked: false }
    ],
    java: [
        { id: 1, title: "Java Fundamentals", desc: "Syntax and basic operations", details: "Duration: 2.5 hours | Difficulty: Beginner | Topics: 9", unlocked: true },
        { id: 2, title: "OOP in Java", desc: "Classes and objects", details: "Duration: 3 hours | Difficulty: Intermediate | Topics: 11", unlocked: false },
        { id: 3, title: "Collections", desc: "Lists, sets, and maps", details: "Duration: 2.5 hours | Difficulty: Intermediate | Topics: 8", unlocked: false },
        { id: 4, title: "Exception Handling", desc: "Error handling", details: "Duration: 2 hours | Difficulty: Intermediate | Topics: 6", unlocked: false },
        { id: 5, title: "File I/O", desc: "Reading and writing files", details: "Duration: 2 hours | Difficulty: Intermediate | Topics: 7", unlocked: false },
        { id: 6, title: "Multithreading", desc: "Concurrent programming", details: "Duration: 3 hours | Difficulty: Advanced | Topics: 10", unlocked: false }
    ]
};

        // State
        let currentLanguage = 'python';
        let completedCourses = new Set(JSON.parse(localStorage.getItem('completedCourses') || '[]'));
        let studyStartTime = null;
        let totalStudyTime = parseInt(localStorage.getItem('totalStudyTime') || '0');
        let isStudying = false;
        let studyInterval = null;
        let lastStudyDate = localStorage.getItem('lastStudyDate');
        let streak = parseInt(localStorage.getItem('streak') || '0');
        let longestStreak = parseInt(localStorage.getItem('longestStreak') || '0');
        let currentCourse = null;
        let lessonComplete = false;
        let courseProgress = JSON.parse(localStorage.getItem('courseProgress') || '{}');
        let quizAnswers = [];
        let currentQuizQuestions = [];
        let quizAccuracy = 0;
        let currentCourseLanguage = null;
        let currentChartLanguage = 'python'; // Default to Python
        let lessonTimeouts = []; // Track lesson timeouts for cancellation
        let chatbotActive = false; // Track if chatbot is active

        // Check streak
        const today = new Date().toDateString();
        if (lastStudyDate) {
            const lastDate = new Date(lastStudyDate);
            const daysDiff = Math.floor((new Date(today) - lastDate) / (1000 * 60 * 60 * 24));
            
            if (daysDiff > 1) {
                showNotification('Streak Lost!', `Your ${streak}-day streak has been reset. Start a new one today!`);
                streak = 0;
                localStorage.setItem('streak', '0');
            }
        }

        // Start study timer
        function startStudyTimer() {
            if (!isStudying) {
                isStudying = true;
                studyStartTime = Date.now() - totalStudyTime;
                
                studyInterval = setInterval(() => {
                    if (isStudying) {
                        totalStudyTime = Date.now() - studyStartTime;
                        const hours = Math.floor(totalStudyTime / (1000 * 60 * 60));
                        const minutes = Math.floor((totalStudyTime % (1000 * 60 * 60)) / (1000 * 60));
                        document.getElementById('studyTime').textContent = `${hours}h ${minutes}m`;
                        localStorage.setItem('totalStudyTime', totalStudyTime);
                    }
                }, 1000);
            }
        }

        // Stop study timer
        function stopStudyTimer() {
            isStudying = false;
            if (studyInterval) {
                clearInterval(studyInterval);
                studyInterval = null;
            }
        }

        // Initialize on load
        window.addEventListener('load', () => {
            const bgGradient = document.getElementById('bgGradient');
            bgGradient.classList.add('loading');
            setTimeout(() => bgGradient.classList.remove('loading'), 2000);

            // Add page load spin animation to widgets and analytics cards
            const widgets = document.querySelectorAll('.widget');
            const analyticsCards = document.querySelectorAll('.analytics-card');

            // Animate widgets
            widgets.forEach((widget, index) => {
                setTimeout(() => {
                    widget.classList.add('page-load-animation');
                    setTimeout(() => {
                        widget.classList.remove('page-load-animation');
                    }, 2000);
                }, index * 100);
            });

            // Animate analytics cards
            analyticsCards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('page-load-animation');
                    setTimeout(() => {
                        card.classList.remove('page-load-animation');
                    }, 2000);
                }, (widgets.length * 100) + (index * 100)); // Start after widgets
            });

            updateStats();
            renderChart();
            
            // Display saved study time
            const hours = Math.floor(totalStudyTime / (1000 * 60 * 60));
            const minutes = Math.floor((totalStudyTime % (1000 * 60 * 60)) / (1000 * 60));
            document.getElementById('studyTime').textContent = `${hours}h ${minutes}m`;
        });

        // Update stats
        function updateStats() {
            document.getElementById('coursesCompleted').textContent = completedCourses.size;
            document.getElementById('streakCount').textContent = `${streak} days`;
            document.getElementById('streakSubtitle').textContent = streak > 0 ? `Longest: ${longestStreak} days` : 'Start your streak today!';
        }

        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const page = this.dataset.page;

                document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                document.querySelectorAll('.page-section').forEach(p => p.classList.remove('active'));
                document.getElementById(page + 'Page').classList.add('active');

                // Update charts and analytics when navigating to home page
                if (page === 'home') {
                    // Force re-render of charts and analytics cards, especially important on mobile
                    setTimeout(() => {
                        renderChart(currentChartLanguage);
                        // Force analytics cards to be visible
                        const analyticsCards = document.querySelectorAll('.analytics-card');
                        analyticsCards.forEach(card => {
                            card.style.opacity = '1';
                            card.style.display = 'block';

                            // On mobile, add smooth slide-in effect
                            if (window.innerWidth <= 768) {
                                card.classList.remove('mobile-slide-in');
                                // Force reflow
                                void card.offsetWidth;
                                card.classList.add('mobile-slide-in');

                                // Remove class after animation
                                setTimeout(() => {
                                    card.classList.remove('mobile-slide-in');
                                }, 600);
                            }
                        });
                    }, 100); // Increased timeout for mobile
                }

                if (window.innerWidth <= 768) {
                    document.getElementById('sidebar').classList.remove('active');
                    document.getElementById('sidebarOverlay').classList.remove('active');
                    document.getElementById('hamburger').classList.remove('active');
                }
            });
        });

        // Initialize widget indicators once
        initWidgetIndicators();

        // Hamburger
        const hamburger = document.getElementById('hamburger');
        const sidebar = document.getElementById('sidebar');
        const sidebarOverlay = document.getElementById('sidebarOverlay');

        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            sidebar.classList.toggle('active');
            sidebarOverlay.classList.toggle('active');
        });

        sidebarOverlay.addEventListener('click', () => {
            hamburger.classList.remove('active');
            sidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
        });

        // Swipe - REPLACE THE EXISTING SWIPE CODE
let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchEndY = 0;
let isSwipingOnWidget = false;

document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
    
    // Check if touch started on widgets grid
    isSwipingOnWidget = e.target.closest('.widgets-grid') !== null;
});

document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    
    const horizontalSwipe = Math.abs(touchEndX - touchStartX);
    const verticalSwipe = Math.abs(touchEndY - touchStartY);
    
    // Only trigger sidebar if:
    // 1. Not swiping on widgets
    // 2. Horizontal swipe is greater than vertical
    // 3. Started from left edge (within 50px)
    if (!isSwipingOnWidget && horizontalSwipe > verticalSwipe) {
        if (touchEndX - touchStartX > 100 && touchStartX < 50) {
            // Swipe right from left edge - open sidebar
            sidebar.classList.add('active');
            sidebarOverlay.classList.add('active');
            hamburger.classList.add('active');
        } else if (touchStartX - touchEndX > 100) {
            // Swipe left - close sidebar
            sidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
            hamburger.classList.remove('active');
        }
    }
});

        // Search
        const searchBtn = document.getElementById('searchBtn');
        const searchInput = document.getElementById('searchInput');
        const searchResults = document.getElementById('searchResults');
        const mainNav = document.getElementById('mainNav');
        const searchCloseBtn = document.getElementById('searchCloseBtn');
        const hamburger = document.getElementById('hamburger');
        const pageContainer = document.querySelector('.page-container');

        searchBtn.addEventListener('click', () => {
            if (!searchBtn.classList.contains('active')) {
                // Activate search mode
                searchBtn.classList.add('active');
                mainNav.classList.add('hide');

                // Hide hamburger and add blur on mobile
                if (hamburger) hamburger.style.opacity = '0';
                if (hamburger) hamburger.style.pointerEvents = 'none';
                if (pageContainer) pageContainer.classList.add('search-blur-active');

                setTimeout(() => searchInput.focus(), 500);
            }
        });

        searchCloseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            // Deactivate search mode
            searchBtn.classList.remove('active');
            mainNav.classList.remove('hide');
            searchInput.value = '';
            searchResults.classList.remove('show');

            // Show hamburger and remove blur
            if (hamburger) hamburger.style.opacity = '1';
            if (hamburger) hamburger.style.pointerEvents = 'auto';
            if (pageContainer) pageContainer.classList.remove('search-blur-active');
        });

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            if (query.length > 0) {
                const results = [];

                // Natural language search enhancements
                const naturalLanguageMap = {
                    'learn': '', 'start': '', 'begin': '', 'study': '',
                    'how to': '', 'what is': '', 'understand': '',
                    'basics': 'basic', 'fundamentals': 'basic',
                    'beginner': 'basic', 'starting': 'basic',
                    'functions': 'function', 'loops': 'loop', 'variables': 'variable',
                    'classes': 'class', 'objects': 'object'
                };

                // Process query with natural language understanding
                let processedQuery = query;
                Object.keys(naturalLanguageMap).forEach(key => {
                    if (processedQuery.includes(key)) {
                        processedQuery = processedQuery.replace(key, naturalLanguageMap[key]);
                    }
                });

                // Extract language name from query
                const languageKeywords = {
                    'python': 'python', 'py': 'python',
                    'javascript': 'javascript', 'js': 'javascript',
                    'react': 'react', 'reactjs': 'react',
                    'html': 'html', 'css': 'html', 'web': 'html',
                    'java': 'java'
                };

                let targetLanguage = null;
                Object.keys(languageKeywords).forEach(keyword => {
                    if (query.includes(keyword)) {
                        targetLanguage = languageKeywords[keyword];
                    }
                });

                // Search courses with enhanced matching
                Object.keys(coursesData).forEach(lang => {
                    // If specific language mentioned, only search that language
                    if (targetLanguage && lang !== targetLanguage) return;

                    coursesData[lang].forEach(course => {
                        const titleMatch = course.title.toLowerCase().includes(query) ||
                                          course.title.toLowerCase().includes(processedQuery);
                        const descMatch = course.desc.toLowerCase().includes(query) ||
                                         course.desc.toLowerCase().includes(processedQuery);
                        const langMatch = lang.toLowerCase().includes(query);

                        if (titleMatch || descMatch || langMatch) {
                            // Calculate progress
                            const progress = courseProgress[course.title];
                            let percentage = 0;
                            if (progress) {
                                if (progress.quizCompleted && progress.lessonCompleted) {
                                    percentage = 100;
                                } else if (progress.lessonCompleted) {
                                    percentage = 75;
                                } else if (progress.totalLessons > 0) {
                                    percentage = Math.round((progress.lessonIndex / progress.totalLessons) * 70);
                                }
                            }
                            results.push({ ...course, language: lang, percentage });
                        }
                    });
                });

                if (results.length > 0) {
                    searchResults.innerHTML = results.slice(0, 6).map(course => {
                        const isLocked = !course.unlocked;
                        const statusIcon = isLocked ? '🔒' : '✓';
                        const statusText = isLocked ? 'Locked' : 'Available';
                        const statusColor = isLocked ? '#ef4444' : '#4ade80';
                        const progressBadge = course.percentage > 0 && course.percentage < 100
                            ? `<span style="background: linear-gradient(135deg, rgba(59, 130, 246, 0.9), rgba(6, 182, 212, 0.9)); color: white; padding: 4px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 700; margin-left: 8px;">${course.percentage}% Complete</span>`
                            : '';

                        return `
                        <div class="result-item" data-search-lang="${course.language}" data-search-id="${course.id}">
                            <div style="flex: 1;">
                                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                                    <strong>${course.title}</strong>
                                    <span style="color: ${statusColor}; font-size: 0.85rem; font-weight: 600;">${statusIcon} ${statusText}</span>
                                    ${progressBadge}
                                </div>
                                <small style="color: var(--text-secondary);">${course.language.toUpperCase()} • ${course.desc}</small>
                            </div>
                        </div>
                    `;
                    }).join('');
                    searchResults.classList.add('show');

                    // Add click listeners to search results
                    document.querySelectorAll('.result-item').forEach(item => {
                        item.addEventListener('click', function() {
                            const lang = this.dataset.searchLang;
                            const courseId = parseInt(this.dataset.searchId);
                            openCourseFromSearch(lang, courseId);
                        });
                    });
                } else {
                    searchResults.innerHTML = '<div class="result-item" style="pointer-events: none;">No courses found</div>';
                    searchResults.classList.add('show');
                }
            } else {
                searchResults.classList.remove('show');
            }
        });

        // Add widget scroll indicators for mobile
function initWidgetIndicators() {
    if (window.innerWidth <= 768) {
        const widgetsGrid = document.querySelector('.widgets-grid');
        const widgets = document.querySelectorAll('.widget');

        // Remove any existing indicators first
        const existingIndicators = document.querySelector('.widget-indicators');
        if (existingIndicators) {
            existingIndicators.remove();
        }

        // Create indicators
        const indicatorsDiv = document.createElement('div');
        indicatorsDiv.className = 'widget-indicators';
        widgets.forEach((_, index) => {
            const indicator = document.createElement('div');
            indicator.className = `widget-indicator ${index === 0 ? 'active' : ''}`;
            indicator.dataset.index = index;
            indicatorsDiv.appendChild(indicator);
        });
        widgetsGrid.parentNode.insertBefore(indicatorsDiv, widgetsGrid.nextSibling);
        
        // Update active indicator on scroll
        widgetsGrid.addEventListener('scroll', () => {
            const scrollLeft = widgetsGrid.scrollLeft;
            const widgetWidth = widgets[0].offsetWidth + 15; // width + gap
            const activeIndex = Math.round(scrollLeft / widgetWidth);
            
            document.querySelectorAll('.widget-indicator').forEach((ind, idx) => {
                ind.classList.toggle('active', idx === activeIndex);
            });
        });
        
        // Click indicator to scroll
        document.querySelectorAll('.widget-indicator').forEach(ind => {
            ind.addEventListener('click', () => {
                const index = parseInt(ind.dataset.index);
                const widgetWidth = widgets[0].offsetWidth + 15;
                widgetsGrid.scrollTo({
                    left: widgetWidth * index,
                    behavior: 'smooth'
                });
            });
        });
    }
}

        function openCourseFromSearch(lang, courseId) {
    currentLanguage = lang;
    renderLanguageTabs();
    renderCourses();

    // Close search
    searchBtn.classList.remove('active');
    mainNav.classList.remove('hide');
    searchInput.value = '';
    searchResults.classList.remove('show');

    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.nav-btn[data-page="learn"]').forEach(b => b.classList.add('active'));
    document.querySelectorAll('.page-section').forEach(p => p.classList.remove('active'));
    document.getElementById('learnPage').classList.add('active');

    setTimeout(() => {
        const course = coursesData[lang].find(c => c.id === courseId);
        if (course && course.unlocked) {
            checkCourseProgress(course.title);
        }
    }, 500);
}

        // Language tabs
        function renderLanguageTabs() {
            const container = document.getElementById('languageTabs');
            const languages = Object.keys(coursesData);
            container.innerHTML = languages.map(lang => `
                <div class="tab-btn ${lang === currentLanguage ? 'active' : ''}" data-lang="${lang}">
                    ${lang.charAt(0).toUpperCase() + lang.slice(1)}
                </div>
            `).join('');
            
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    currentLanguage = this.dataset.lang;
                    renderCourses();
                });
            });
        }

        // 1. FIRST - Define openChatbot function
function openChatbot(courseTitle, continueMode) {
    const chatbotContainer = document.getElementById('chatbotContainer');
    const chatbotTitle = document.getElementById('chatbotTitle');
    const chatbotMessages = document.getElementById('chatbotMessages');
    const quizContainer = document.getElementById('quizContainer');
    const quizTab = document.getElementById('quizTab');
    
    currentCourse = courseTitle;
    lessonComplete = false;
    chatbotTitle.textContent = courseTitle;
    chatbotContainer.classList.add('active');
    
    // Start study timer
    startStudyTimer();
    
    quizTab.classList.remove('unlocked');
    document.querySelectorAll('.chatbot-tab').forEach(t => {
        t.classList.remove('active');
        if (t.dataset.tab === 'learn') t.classList.add('active');
    });
    
    chatbotMessages.style.display = 'block';
    quizContainer.style.display = 'none';
    
    const content = courseContent[courseTitle] || {
        intro: "Welcome to this course!",
        lessons: ["Course content coming soon..."],
        quiz: []
    };
    
    if (continueMode && courseProgress[courseTitle]) {
        // Restore previous messages
        chatbotMessages.innerHTML = courseProgress[courseTitle].messages;
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        
        // Continue from where left off
        const currentIndex = courseProgress[courseTitle].currentIndex;
        if (currentIndex < content.lessons.length) {
            setTimeout(() => {
                typeLessonsFrom(content.lessons, currentIndex);
            }, 500);
        } else {
            lessonComplete = true;
            quizTab.classList.add('unlocked');
        }
    } else {
        // Start fresh
        chatbotMessages.innerHTML = '';
        courseProgress[courseTitle] = { messages: '', currentIndex: 0 };
        
        setTimeout(() => {
            typeMessage('AI Tutor', content.intro, () => {
                typeLessonsFrom(content.lessons, 0);
            });
        }, 500);
    }
}

        // REPLACE YOUR checkCourseProgress FUNCTION
function checkCourseProgress(courseTitle) {
    const course = coursesData[currentLanguage].find(c => c.title === courseTitle);
    
    if (!course) return;
    
    // Check if there's saved progress
    const savedProgress = courseProgress[courseTitle];
    
    if (savedProgress && savedProgress.lessonIndex < courseContent[courseTitle].lessons.length) {
        // Show continue/restart dialog
        showContinueDialog(course, savedProgress);
    } else {
        // Start fresh
        startCourse(course, false);
    }
}

        // FIND where you create course cards and UPDATE
function renderCourses() {
    const coursesGrid = document.getElementById('coursesGrid');
    if (!coursesGrid) return;

    coursesGrid.innerHTML = '';
    const courses = coursesData[currentLanguage];

    // Update unlock status based on completed courses
    courses.forEach((course, index) => {
        if (index === 0) {
            course.unlocked = true; // First course always unlocked
        } else if (index > 0) {
            const prevCourse = courses[index - 1];
            const prevProgress = courseProgress[prevCourse.title];
            // Unlock next course only if previous is 100% complete (both learn and quiz)
            course.unlocked = prevProgress && prevProgress.quizCompleted && prevProgress.lessonCompleted;
        }
    });

    courses.forEach((course, index) => {
        const progress = courseProgress[course.title];
        // Calculate progress: Only show 100% when BOTH learn AND quiz complete
        let percentage = 0;
        if (progress) {
            if (progress.quizCompleted && progress.lessonCompleted) {
                percentage = 100;
            } else if (progress.lessonCompleted && !progress.quizCompleted) {
                percentage = 75; // Finished learn, not quiz
            } else if (progress.totalLessons > 0) {
                // During learning phase: 0-70%
                percentage = Math.round((progress.lessonIndex / progress.totalLessons) * 70);
            }
        }

        const courseCard = document.createElement('div');
        courseCard.className = `course-card ${!course.unlocked ? 'locked' : ''}`;
        courseCard.dataset.locked = !course.unlocked;
        courseCard.dataset.courseTitle = course.title;
        courseCard.dataset.percentage = percentage;

        // Calculate realistic time estimate (4-5 mins per course)
        const timeEstimate = `${4 + (index % 2)}min`;

        courseCard.innerHTML = `
            ${!course.unlocked ? `
                <svg class="lock-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
            ` : `
                <svg class="unlock-icon" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
            `}
            <div class="course-number">Course ${course.id}</div>
            ${percentage > 0 ? `
                <div class="course-progress-badge" style="${percentage === 100 ? 'background: linear-gradient(135deg, rgba(74, 222, 128, 0.9), rgba(34, 197, 94, 0.9));' : ''}">
                    <span>${percentage === 100 ? '✓ ' : ''}${percentage}% Complete</span>
                </div>
            ` : ''}
            <h3 class="course-title">${course.title}</h3>
            <p class="course-desc">${course.desc}</p>
            <button class="view-details-btn">
                <span class="view-details-text">View Details</span>
                <svg class="view-details-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </button>
            <div class="course-details">
                <div class="detail-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    Duration: ${timeEstimate}
                </div>
                <div class="detail-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"></path>
                    </svg>
                    Difficulty: ${course.id <= 2 ? 'Beginner' : course.id <= 4 ? 'Intermediate' : 'Advanced'}
                </div>
                <div class="detail-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    Topics: ${Math.floor(Math.random() * 5) + 6}
                </div>
            </div>
        `;

        coursesGrid.appendChild(courseCard);
    });

    addCourseEventListeners();
}

// REPLACE YOUR ENTIRE addCourseEventListeners FUNCTION
function addCourseEventListeners() {
    // Handle course card clicks
    document.querySelectorAll('.course-card').forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking the details button or details area
            if (e.target.closest('.view-details-btn') || e.target.closest('.course-details')) {
                return;
            }

            const isLocked = this.dataset.locked === 'true';
            const courseTitle = this.dataset.courseTitle;
            const percentage = parseInt(this.dataset.percentage) || 0;

            if (!isLocked) {
                const course = coursesData[currentLanguage].find(c => c.title === courseTitle);
                if (course) {
                    // Check if course is 100% complete
                    if (percentage === 100) {
                        showTryAgainPopup(course);
                    } else {
                        startCourse(course, false);
                    }
                }
            } else {
                showNotification('Locked', 'Complete previous courses to unlock this one.');
            }
        });
    });

    // Handle view details button clicks
    document.querySelectorAll('.view-details-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleDetails(this);
        });
    });
}

// Try again popup functionality
function showTryAgainPopup(course) {
    const overlay = document.getElementById('tryAgainOverlay');
    const tryAgainBtn = document.getElementById('tryAgainBtn');
    const cancelBtn = document.getElementById('cancelTryAgainBtn');

    overlay.style.display = 'flex';

    // Handle try again
    tryAgainBtn.onclick = () => {
        overlay.style.display = 'none';
        // Reset progress for this course
        delete courseProgress[course.title];
        localStorage.setItem('courseProgress', JSON.stringify(courseProgress));
        renderCourses();
        renderChart();
        startCourse(course, false);
    };

    // Handle cancel
    cancelBtn.onclick = () => {
        overlay.style.display = 'none';
    };

    // Close on overlay click
    overlay.onclick = (e) => {
        if (e.target === overlay) {
            overlay.style.display = 'none';
        }
    };
}

        function toggleDetails(btn) {
    const details = btn.nextElementSibling;
    const isOpen = details.classList.contains('open');
    
    // Close all other details first
    document.querySelectorAll('.course-details.open').forEach(d => {
        if (d !== details) {
            d.classList.remove('open');
            const prevBtn = d.previousElementSibling;
            if (prevBtn && prevBtn.classList.contains('view-details-btn')) {
                prevBtn.classList.remove('open');
            }
        }
    });
    
    details.classList.toggle('open');
    btn.classList.toggle('open');
}


// ========== CHATBOT FUNCTIONS - PUT THESE IN THIS ORDER ==========

// 2. SECOND - typeLessonsFrom (uses typeMessage)
function typeLessonsFrom(lessons, startIndex) {
    let lessonIndex = startIndex;
    const typeNext = () => {
        if (!chatbotActive) return; // Stop if chatbot closed

        if (lessonIndex < lessons.length) {
            const timeoutId = setTimeout(() => {
                if (!chatbotActive) return; // Check again before typing

                typeMessage('AI Tutor', lessons[lessonIndex], () => {
                    if (!chatbotActive) return; // Stop if closed during typing

                    lessonIndex++;
                    courseProgress[currentCourse].currentIndex = lessonIndex;
                    courseProgress[currentCourse].messages = document.getElementById('chatbotMessages').innerHTML;
                    localStorage.setItem('courseProgress', JSON.stringify(courseProgress));
                    typeNext();
                });
            }, 1000);
            lessonTimeouts.push(timeoutId);
        } else {
            lessonComplete = true;
            const quizTab = document.getElementById('quizTab');
            const learnTab = document.getElementById('learnTab');

            if (quizTab) {
                quizTab.classList.add('unlocked');
            }

            // Ensure learn tab stays unlocked
            if (learnTab) {
                learnTab.classList.add('unlocked');
            }
        }
    };
    typeNext();
}

// 3. THIRD - openChatbot (uses typeMessage and typeLessonsFrom)
function openChatbot(courseTitle, continueMode) {
    const chatbotContainer = document.getElementById('chatbotContainer');
    const chatbotTitle = document.getElementById('chatbotTitle');
    const chatbotMessages = document.getElementById('chatbotMessages');
    const quizContainer = document.getElementById('quizContainer');
    const quizTab = document.getElementById('quizTab');

    currentCourse = courseTitle;
    lessonComplete = false;
    chatbotTitle.textContent = courseTitle;
    chatbotContainer.classList.add('active');

    // Start study timer
    startStudyTimer();

    // Add scroll detection for header
    const chatbotContent = document.querySelector('.chatbot-content');
    const chatbotHeader = document.querySelector('.chatbot-header');
    if (chatbotContent && chatbotHeader) {
        chatbotContent.addEventListener('scroll', function() {
            if (this.scrollTop > 50) {
                chatbotHeader.classList.add('scrolled');
            } else {
                chatbotHeader.classList.remove('scrolled');
            }
        });
    }

    // REPLACE TAB SWITCHING CODE
document.querySelectorAll('.chatbot-tab').forEach(tab => {
    tab.addEventListener('click', function() {
        // Check if tab is unlocked
        if (!this.classList.contains('unlocked')) {
            const tabType = this.dataset.tab;
            if (tabType === 'quiz') {
                showNotification('Locked', 'Complete the learning section first!');
            } else {
                showNotification('Locked', 'This tab is not available yet!');
            }
            return;
        }

        // Remove active from all tabs
        document.querySelectorAll('.chatbot-tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');

        const tabType = this.dataset.tab;
        const messagesContainer = document.getElementById('chatbotMessages');
        const quizContainer = document.getElementById('quizContainer');

        // Hide all containers
        if (messagesContainer) messagesContainer.style.display = 'none';
        if (quizContainer) {
            quizContainer.style.display = 'none';
            quizContainer.classList.remove('active');
        }

        // Show appropriate container
        if (tabType === 'learn') {
            if (messagesContainer) messagesContainer.style.display = 'grid';
        } else if (tabType === 'quiz') {
            if (quizContainer) {
                quizContainer.style.display = 'block';
                quizContainer.classList.add('active');
                loadQuiz();
            }
        }
    });
});

    chatbotMessages.style.display = 'block';
    quizContainer.style.display = 'none';
    
    const content = courseContent[courseTitle] || {
        intro: "Welcome to this course!",
        lessons: ["Course content coming soon..."],
        quiz: []
    };
    
    if (continueMode && courseProgress[courseTitle]) {
        // Restore previous messages
        chatbotMessages.innerHTML = courseProgress[courseTitle].messages;
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        
        // Continue from where left off
        const currentIndex = courseProgress[courseTitle].currentIndex;
        if (currentIndex < content.lessons.length) {
            setTimeout(() => {
                typeLessonsFrom(content.lessons, currentIndex);
            }, 500);
        } else {
            lessonComplete = true;
            quizTab.classList.add('unlocked');
        }
    } else {
        // Start fresh
        chatbotMessages.innerHTML = '';
        courseProgress[courseTitle] = { messages: '', currentIndex: 0 };
        
        setTimeout(() => {
            typeMessage('AI Tutor', content.intro, () => {
                typeLessonsFrom(content.lessons, 0);
            });
        }, 500);
    }
}

// 5. Chatbot tab listeners (AFTER all functions are defined)
document.querySelectorAll('.chatbot-tab').forEach(tab => {
    tab.addEventListener('click', function() {
        if (!this.classList.contains('unlocked')) return;
        
        document.querySelectorAll('.chatbot-tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        
        const tabType = this.dataset.tab;
        if (tabType === 'learn') {
            document.getElementById('chatbotMessages').style.display = 'block';
            document.getElementById('quizContainer').style.display = 'none';
        } else {
            document.getElementById('chatbotMessages').style.display = 'none';
            document.getElementById('quizContainer').style.display = 'block';
            loadQuiz();
        }
    });
});

// REPLACE YOUR loadQuiz FUNCTION
function loadQuiz() {
    if (!currentCourse || !courseContent[currentCourse.title]) return;
    
    const quizContainer = document.getElementById('quizContainer');
    const content = courseContent[currentCourse.title];
    currentQuizQuestions = content.quiz;
    quizAnswers = new Array(currentQuizQuestions.length).fill(null);
    
    quizContainer.innerHTML = '';
    
    currentQuizQuestions.forEach((q, qIndex) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question';
        questionDiv.innerHTML = `
            <div class="question-text">${qIndex + 1}. ${q.question}</div>
            <div class="feedback" id="feedback-${qIndex}"></div>
            ${q.options.map((opt, oIndex) => `
                <div class="option" data-question="${qIndex}" data-option="${oIndex}">
                    <div style="width: 20px; height: 20px; border: 2px solid var(--border-color); border-radius: 50%; flex-shrink: 0;"></div>
                    <span>${opt}</span>
                </div>
            `).join('')}
        `;
        quizContainer.appendChild(questionDiv);
    });
    
    // Add submit button
    const submitBtn = document.createElement('button');
    submitBtn.className = 'submit-quiz-btn';
    submitBtn.textContent = 'Submit Quiz';
    submitBtn.onclick = submitQuiz;
    quizContainer.appendChild(submitBtn);
    
    // Add option click handlers
    document.querySelectorAll('.option').forEach(opt => {
        opt.addEventListener('click', function() {
            const qIndex = parseInt(this.dataset.question);
            const oIndex = parseInt(this.dataset.option);
            const question = currentQuizQuestions[qIndex];
            const feedback = document.getElementById(`feedback-${qIndex}`);
            
            // Remove previous selections for this question
            document.querySelectorAll(`.option[data-question="${qIndex}"]`).forEach(o => {
                o.classList.remove('selected', 'correct', 'incorrect');
            });
            
            this.classList.add('selected');
            
            // Check answer immediately
            if (oIndex === question.correct) {
                this.classList.add('correct');
                this.classList.remove('incorrect');
                feedback.innerHTML = '';
                quizAnswers[qIndex] = true;
            } else {
                this.classList.add('incorrect');
                feedback.innerHTML = '<span style="color: #ef4444; font-weight: 600; font-size: 0.95rem;">❌ Try Again</span>';
                quizAnswers[qIndex] = false;
            }
        });
    });
}

// REPLACE startCourse FUNCTION
function startCourse(course, skipQuiz = false) {
    currentCourse = course;
    currentCourseLanguage = currentLanguage;
    lessonComplete = false;
    chatbotActive = true; // Set chatbot as active
    lessonTimeouts = []; // Clear previous timeouts

    const chatbotContainer = document.getElementById('chatbotContainer');
    const chatbotMessages = document.getElementById('chatbotMessages');
    const quizContainer = document.getElementById('quizContainer');
    const learnTab = document.getElementById('learnTab');
    const quizTab = document.getElementById('quizTab');
    const nav = document.querySelector('nav');

    if (!chatbotContainer || !chatbotMessages) {
        console.error('Required elements not found!');
        return;
    }

    chatbotContainer.classList.add('active');
    chatbotMessages.innerHTML = '';

    if (quizContainer) {
        quizContainer.innerHTML = '';
        quizContainer.style.display = 'none';
        quizContainer.classList.remove('active');
    }

    // Reset tabs - Learn UNLOCKED by default, others LOCKED
    document.querySelectorAll('.chatbot-tab').forEach(tab => {
        tab.classList.remove('active', 'unlocked');
    });

    // Learn tab always UNLOCKED
    if (learnTab) {
        learnTab.classList.add('active', 'unlocked');
    }

    // Quiz tab LOCKED until learning complete
    if (quizTab) {
        quizTab.classList.remove('unlocked');
    }

    chatbotMessages.style.display = 'grid';

    if (nav) {
        nav.classList.add('hide');
    }

    // Add scroll detection for header
    const chatbotContent = document.querySelector('.chatbot-content');
    const chatbotHeader = document.querySelector('.chatbot-header');
    if (chatbotContent && chatbotHeader) {
        chatbotContent.addEventListener('scroll', function() {
            if (this.scrollTop > 50) {
                chatbotHeader.classList.add('scrolled');
            } else {
                chatbotHeader.classList.remove('scrolled');
            }
        });
    }

    // Initialize progress tracking
    if (!courseProgress[course.title]) {
        courseProgress[course.title] = {
            lessonIndex: 0,
            totalLessons: courseContent[course.title] ? courseContent[course.title].lessons.length : 0,
            lessonCompleted: false,
            quizCompleted: false
        };
    }

    // Add progress indicator
    addProgressIndicator(course.title);

    if (courseContent[course.title]) {
        const content = courseContent[course.title];
        let index = 0;

        typeMessage('AI TUTOR', content.intro, () => {
            const typeNextLesson = () => {
                if (index < content.lessons.length) {
                    typeMessage('AI TUTOR', content.lessons[index], () => {
                        index++;

                        // Update progress
                        courseProgress[course.title].lessonIndex = index;
                        updateProgressIndicator(course.title);
                        localStorage.setItem('courseProgress', JSON.stringify(courseProgress));

                        if (index < content.lessons.length) {
                            setTimeout(typeNextLesson, 500);
                        } else {
                            lessonComplete = true;
                            // Mark lessons as completed (50% progress)
                            courseProgress[course.title].lessonCompleted = true;
                            localStorage.setItem('courseProgress', JSON.stringify(courseProgress));

                            // UNLOCK QUIZ TAB when learning complete
                            if (!skipQuiz && quizTab) {
                                quizTab.classList.add('unlocked');

                                // Ensure learn tab stays unlocked
                                if (learnTab) {
                                    learnTab.classList.add('unlocked');
                                }

                                showNotification('Learning Complete! 🎓', 'Quiz unlocked! Test your knowledge.');
                            }

                            if (!skipQuiz) {
                                loadQuiz();
                            }
                        }
                    });
                }
            };
            setTimeout(typeNextLesson, 800);
        });
    }

    startStudyTimer();
}

// ADD PROGRESS INDICATOR FUNCTIONS
function addProgressIndicator(courseTitle) {
    const header = document.querySelector('.chatbot-header');
    if (!header) return;

    // Remove existing indicator
    const existing = document.getElementById('progressIndicator');
    if (existing) existing.remove();

    const progress = courseProgress[courseTitle] || { lessonIndex: 0, totalLessons: 0, lessonCompleted: false, quizCompleted: false };

    // Calculate percentage: 0-50% during learning, 50% when learning complete, 100% when both complete
    let percentage = 0;
    if (progress.quizCompleted) {
        percentage = 100;
    } else if (progress.lessonCompleted) {
        percentage = 50;
    } else if (progress.totalLessons > 0) {
        percentage = Math.round((progress.lessonIndex / progress.totalLessons) * 50);
    }

    const indicator = document.createElement('div');
    indicator.id = 'progressIndicator';
    indicator.className = 'progress-indicator';
    indicator.innerHTML = `
        <div class="progress-label">Course Progress</div>
        <div class="progress-value">${percentage}%</div>
    `;

    header.appendChild(indicator);
}

function updateProgressIndicator(courseTitle) {
    const indicator = document.getElementById('progressIndicator');
    if (!indicator) return;

    const progress = courseProgress[courseTitle];

    // Calculate percentage: 0-50% during learning, 50% when learning complete, 100% when both complete
    let percentage = 0;
    if (progress.quizCompleted) {
        percentage = 100;
    } else if (progress.lessonCompleted) {
        percentage = 50;
    } else if (progress.totalLessons > 0) {
        percentage = Math.round((progress.lessonIndex / progress.totalLessons) * 50);
    }

    const valueElement = indicator.querySelector('.progress-value');
    if (valueElement) {
        valueElement.textContent = `${percentage}%`;
        valueElement.style.color = percentage === 100 ? '#4ade80' : 'var(--accent-color)';
    }
}

// ADD SUBMIT QUIZ FUNCTION
function submitQuiz() {
    const allAnswered = quizAnswers.every(a => a !== null);

    if (!allAnswered) {
        showNotification('Incomplete Quiz', 'Please answer all questions before submitting.');
        return;
    }

    const correctAnswers = quizAnswers.filter(a => a === true).length;
    quizAccuracy = Math.round((correctAnswers / quizAnswers.length) * 100);

    // Mark quiz as completed (100% progress)
    if (courseProgress[currentCourse.title]) {
        courseProgress[currentCourse.title].quizCompleted = true;
        localStorage.setItem('courseProgress', JSON.stringify(courseProgress));
        updateProgressIndicator(currentCourse.title);
    }

    showCompletionPopup();
}

// ADD COMPLETION POPUP FUNCTION
function showCompletionPopup() {
    const overlay = document.createElement('div');
    overlay.className = 'completion-overlay active';
    overlay.innerHTML = `
        <div class="completion-popup">
            <div class="completion-icon">${quizAccuracy >= 45 ? '🎉' : '📚'}</div>
            <div class="completion-title">${quizAccuracy >= 45 ? 'Congratulations!' : 'Keep Learning!'}</div>
            <div class="completion-accuracy">
                <div class="accuracy-label">Your Accuracy</div>
                <div class="accuracy-value" style="color: ${quizAccuracy >= 45 ? '#4ade80' : '#ef4444'}">${quizAccuracy}%</div>
            </div>
            <div class="completion-message">
                ${quizAccuracy >= 45 
                    ? 'Great job! You\'ve mastered this lesson.' 
                    : 'Don\'t worry! Practice makes perfect.'}
            </div>
            <button class="completion-btn" onclick="handleCompletion(${quizAccuracy})">
                Continue
            </button>
        </div>
    `;
    document.body.appendChild(overlay);
}

// ADD COMPLETION HANDLER
function handleCompletion(accuracy) {
    document.querySelector('.completion-overlay').remove();

    if (accuracy >= 45) {
        // Mark course complete and unlock next
        completedCourses.add(currentCourse.title);
        localStorage.setItem('completedCourses', JSON.stringify([...completedCourses]));

        const currentLangCourses = coursesData[currentCourseLanguage || currentLanguage];
        const currentIndex = currentLangCourses.findIndex(c => c.title === currentCourse.title);
        if (currentIndex < currentLangCourses.length - 1) {
            currentLangCourses[currentIndex + 1].unlocked = true;
        }

        // Update streak
        const today = new Date().toDateString();
        if (lastStudyDate !== today) {
            streak++;
            if (streak > longestStreak) {
                longestStreak = streak;
                localStorage.setItem('longestStreak', longestStreak);
            }
            localStorage.setItem('streak', streak);
            localStorage.setItem('lastStudyDate', today);
        }

        updateStats();
        renderCourses();
        renderChart(); // Update charts
        document.getElementById('chatbotContainer').classList.remove('active');
        showNotification('Course Complete! 🎉', `You completed ${currentCourse.title} with ${accuracy}% accuracy!`);
    } else {
        // Go to home and show AI suggestion
        document.getElementById('chatbotContainer').classList.remove('active');
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.nav-btn[data-page="home"]').forEach(btn => btn.classList.add('active'));
        document.querySelectorAll('.page-section').forEach(section => section.classList.remove('active'));
        document.getElementById('homePage').classList.add('active');

        setTimeout(() => {
            showAISuggestion(currentCourse.title);
        }, 500);
    }
}

// ADD AI SUGGESTION OVAL BUTTON
function showAISuggestion(courseName) {
    const suggestion = document.createElement('div');
    suggestion.className = 'ai-suggestion-oval';
    suggestion.innerHTML = `
        <div class="suggestion-icon">🤖</div>
        <div class="suggestion-text">
            <div class="suggestion-title">AI Recommendation</div>
            <div class="suggestion-desc">Let's review "${courseName}" together</div>
        </div>
    `;
    suggestion.onclick = () => startAIReview(courseName);
    document.body.appendChild(suggestion);
    
    setTimeout(() => suggestion.classList.add('show'), 100);
}

// ADD AI REVIEW FUNCTION
function startAIReview(courseName) {
    document.querySelector('.ai-suggestion-oval').remove();
    showNotification('AI Review Starting', `Nuvia will help you review ${courseName}!`);
    // Start the lesson without quiz
    const course = coursesData[currentLanguage].find(c => c.title === courseName);
    if (course) {
        startCourse(course, true); // true = skip quiz
    }
}

// FIND AND UPDATE YOUR CLOSE CHATBOT HANDLER
document.getElementById('closeChatbot').addEventListener('click', () => {
    // Stop all lesson typing immediately
    chatbotActive = false;
    lessonTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
    lessonTimeouts = [];

    document.getElementById('chatbotContainer').classList.remove('active');
    const nav = document.querySelector('nav');
    if (nav) {
        nav.classList.remove('hide'); // ADD THIS LINE
    }
    stopStudyTimer();
});
        function markCourseComplete(courseTitle) {
            completedCourses.add(courseTitle);
            localStorage.setItem('completedCourses', JSON.stringify([...completedCourses]));
            
            // Clear course progress
            delete courseProgress[courseTitle];
            localStorage.setItem('courseProgress', JSON.stringify(courseProgress));
            
            // Update stats
            document.getElementById('coursesCompleted').textContent = completedCourses.size;
            
            // Update streak
            const today = new Date().toDateString();
            if (lastStudyDate !== today) {
                streak++;
                if (streak > longestStreak) {
                    longestStreak = streak;
                    localStorage.setItem('longestStreak', longestStreak);
                }
                localStorage.setItem('streak', streak);
                localStorage.setItem('lastStudyDate', today);
                updateStats();
            }
            
            // Unlock next course
            const currentCourses = coursesData[currentLanguage];
            const currentCourse = currentCourses.find(c => c.title === courseTitle);
            if (currentCourse) {
                const currentIndex = currentCourses.indexOf(currentCourse);
                if (currentIndex < currentCourses.length - 1) {
                    currentCourses[currentIndex + 1].unlocked = true;
                }
            }
            
            renderCourses();
            renderChart();
        }

        document.getElementById('closeChatbot').addEventListener('click', () => {
            // Stop all lesson typing immediately
            chatbotActive = false;
            lessonTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
            lessonTimeouts = [];

            document.getElementById('chatbotContainer').classList.remove('active');
            stopStudyTimer();
        });

        // ADD FUNCTION TO UPDATE CHARTS WITH REAL DATA

// Function to animate counting numbers
function animateCounter(element, targetValue, duration = 1000) {
    const startValue = 0;
    const startTime = Date.now();

    function updateCounter() {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth counting
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.round(startValue + (targetValue - startValue) * easeOutCubic);

        element.textContent = `${currentValue}%`;

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }

    requestAnimationFrame(updateCounter);
}

// Function to update analytics cards
function updateAnalyticsCards(selectedLanguage) {
    const cardsContainer = document.getElementById('analyticsCards');
    if (!cardsContainer) return;

    // Add updating class for smooth transition
    cardsContainer.classList.add('updating');

    setTimeout(() => {
        const courses = coursesData[selectedLanguage];

        // Calculate analytics
        let totalProgress = 0;
        let coursesStarted = 0;
        let coursesCompleted = 0;
        let avgCompletion = 0;

        courses.forEach(course => {
            const progress = courseProgress[course.title];
            if (progress) {
                coursesStarted++;
                let percentage = 0;
                if (progress.quizCompleted) {
                    percentage = 100;
                    coursesCompleted++;
                } else if (progress.lessonCompleted) {
                    percentage = 50;
                } else if (progress.totalLessons > 0) {
                    percentage = Math.round((progress.lessonIndex / progress.totalLessons) * 50);
                }
                totalProgress += percentage;
            }
        });

        avgCompletion = coursesStarted > 0 ? Math.round(totalProgress / courses.length) : 0;

        // Card 1: 7-Day Activity
        const card1Value = document.getElementById('card1Value');
        const card1Subtitle = document.getElementById('card1Subtitle');
        const card1Trend = document.getElementById('card1Trend');

        card1Value.textContent = `${coursesStarted}/${courses.length}`;
        card1Subtitle.textContent = `${coursesCompleted} completed, ${avgCompletion}% avg progress`;

        if (coursesStarted > courses.length / 2) {
            card1Trend.className = 'analytics-card-trend positive';
            card1Trend.querySelector('span').textContent = '↑ Great pace!';
            card1Trend.style.display = 'inline-flex';
        } else if (coursesStarted > 0) {
            card1Trend.className = 'analytics-card-trend neutral';
            card1Trend.querySelector('span').textContent = '→ Keep going!';
            card1Trend.style.display = 'inline-flex';
        } else {
            card1Trend.style.display = 'none';
        }

        // Card 2: Course Comparison
        const card2Value = document.getElementById('card2Value');
        const card2Subtitle = document.getElementById('card2Subtitle');
        const card2Trend = document.getElementById('card2Trend');

        // Find best and worst performing courses
        let bestCourse = null;
        let worstCourse = null;
        let bestProgress = -1;
        let worstProgress = 101;

        courses.forEach(course => {
            const progress = courseProgress[course.title];
            if (progress) {
                let percentage = 0;
                if (progress.quizCompleted) percentage = 100;
                else if (progress.lessonCompleted) percentage = 50;
                else if (progress.totalLessons > 0) {
                    percentage = Math.round((progress.lessonIndex / progress.totalLessons) * 50);
                }

                if (percentage > bestProgress) {
                    bestProgress = percentage;
                    bestCourse = course.title;
                }
                if (percentage < worstProgress && percentage > 0) {
                    worstProgress = percentage;
                    worstCourse = course.title;
                }
            }
        });

        if (bestCourse) {
            const shortTitle = bestCourse.split(' ').slice(0, 2).join(' ');
            card2Value.textContent = `${bestProgress}%`;
            card2Subtitle.textContent = `Best: ${shortTitle} at ${bestProgress}%`;
            card2Trend.className = 'analytics-card-trend positive';
            card2Trend.querySelector('span').textContent = '↑ Top performer';
            card2Trend.style.display = 'inline-flex';
        } else {
            card2Value.textContent = '-';
            card2Subtitle.textContent = 'Start a course to see comparisons';
            card2Trend.style.display = 'none';
        }

        // Card 3: Improvement Area
        const card3Value = document.getElementById('card3Value');
        const card3Subtitle = document.getElementById('card3Subtitle');
        const card3Trend = document.getElementById('card3Trend');

        const coursesNotStarted = courses.length - coursesStarted;

        if (coursesNotStarted > 0) {
            card3Value.textContent = coursesNotStarted;
            card3Subtitle.textContent = `${coursesNotStarted} ${selectedLanguage.toUpperCase()} course${coursesNotStarted > 1 ? 's' : ''} waiting to be explored`;
            card3Trend.className = 'analytics-card-trend neutral';
            card3Trend.querySelector('span').textContent = '→ Start now!';
            card3Trend.style.display = 'inline-flex';
        } else if (avgCompletion < 100) {
            card3Value.textContent = `${100 - avgCompletion}%`;
            card3Subtitle.textContent = 'Complete remaining quizzes to reach 100%';
            card3Trend.className = 'analytics-card-trend negative';
            card3Trend.querySelector('span').textContent = '↓ Finish strong';
            card3Trend.style.display = 'inline-flex';
        } else {
            card3Value.textContent = '✓';
            card3Subtitle.textContent = `All ${selectedLanguage.toUpperCase()} courses completed! Amazing work!`;
            card3Trend.className = 'analytics-card-trend positive';
            card3Trend.querySelector('span').textContent = '↑ Perfect!';
            card3Trend.style.display = 'inline-flex';
        }

        // Remove updating class
        cardsContainer.classList.remove('updating');
    }, 300);
}

function renderChart(selectedLanguage = currentChartLanguage) {
    currentChartLanguage = selectedLanguage;
    const chartContainer = document.querySelector('.chart-container');
    const chartTabsContainer = document.getElementById('chartTabs');

    if (!chartContainer || !chartTabsContainer) return;

    // Update analytics cards
    updateAnalyticsCards(selectedLanguage);

    // Create language toggle buttons
    const languages = ['python', 'javascript', 'react', 'html', 'java'];
    chartTabsContainer.innerHTML = languages.map(lang => `
        <div class="chart-tab ${lang === selectedLanguage ? 'active' : ''}" data-lang="${lang}">
            ${lang.charAt(0).toUpperCase() + lang.slice(1)}
        </div>
    `).join('');

    // Add click handlers for language tabs
    chartTabsContainer.querySelectorAll('.chart-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const newLang = this.dataset.lang;
            if (newLang !== currentChartLanguage) {
                renderChart(newLang);
            }
        });
    });

    // Fade out current bars
    chartContainer.querySelectorAll('.chart-bar-wrapper').forEach(wrapper => {
        wrapper.classList.add('fade-out');
    });

    // Wait for fade out, then render new bars
    setTimeout(() => {
        chartContainer.innerHTML = '';

        // Add Y-axis labels
        const yAxis = document.createElement('div');
        yAxis.className = 'chart-y-axis';
        for (let i = 100; i >= 0; i -= 20) {
            const label = document.createElement('div');
            label.className = 'y-axis-label';
            label.textContent = `${i}%`;
            yAxis.appendChild(label);
        }
        chartContainer.appendChild(yAxis);

        // Get courses for selected language
        const courses = coursesData[selectedLanguage];

        // Create bars for each course
        courses.forEach((course, index) => {
            const progress = courseProgress[course.title];
            let percentage = 0;

            if (progress) {
                if (progress.quizCompleted) {
                    percentage = 100;
                } else if (progress.lessonCompleted) {
                    percentage = 50;
                } else if (progress.totalLessons > 0) {
                    percentage = Math.round((progress.lessonIndex / progress.totalLessons) * 50);
                }
            }

            const barWrapper = document.createElement('div');
            barWrapper.className = 'chart-bar-wrapper';

            const bar = document.createElement('div');
            bar.className = 'chart-bar';
            bar.style.height = '0px';
            bar.style.transition = 'height 1s cubic-bezier(0.34, 1.56, 0.64, 1)';

            const label = document.createElement('div');
            label.className = 'chart-label';
            // Show truncated course title (first 2 words or 15 chars)
            const titleWords = course.title.split(' ');
            const shortTitle = titleWords.length > 2
                ? titleWords.slice(0, 2).join(' ')
                : course.title.substring(0, 15) + (course.title.length > 15 ? '...' : '');
            label.textContent = shortTitle;
            label.title = course.title; // Show full title on hover

            const percentageLabel = document.createElement('div');
            percentageLabel.className = 'chart-percentage';
            percentageLabel.textContent = '0%';
            percentageLabel.style.opacity = '0';
            percentageLabel.style.transition = 'opacity 0.2s ease 0.1s';

            bar.appendChild(percentageLabel);
            barWrapper.appendChild(bar);
            barWrapper.appendChild(label);
            chartContainer.appendChild(barWrapper);

            // Animate bars rising with staggered delay
            setTimeout(() => {
                // Chart usable height is 430px (500 - 20 - 50), so 100% = 430px
                // Precise calculation: 4.3px per percentage point
                const targetHeight = percentage * 4.3;
                bar.style.height = `${targetHeight}px`;
                percentageLabel.style.opacity = '1';

                // Start counting animation after bar starts rising
                setTimeout(() => {
                    animateCounter(percentageLabel, percentage, 800);
                }, 100);
            }, 100 + (index * 100));
        });
    }, 300); // Match fade-out duration
}

        function updateChart(language) {
            const chartContainer = document.getElementById('chartContainer');
            const languages = Object.keys(coursesData);
            
            chartContainer.innerHTML = languages.map(lang => {
                const courses = coursesData[lang];
                const completed = courses.filter(c => completedCourses.has(c.title)).length;
                const percentage = Math.round((completed / courses.length) * 100);
                const height = percentage * 2;
                
                return `
                    <div class="chart-bar-wrapper">
                        <div class="chart-bar" style="height: ${height}px; opacity: ${lang === language ? '1' : '0.4'}; filter: ${lang === language ? 'none' : 'grayscale(0.6)'}">
                            <div class="chart-percentage">${percentage}%</div>
                        </div>
                        <div class="chart-label">${lang.charAt(0).toUpperCase() + lang.slice(1)}</div>
                    </div>
                `;
            }).join('');
        }

        // Settings
        document.getElementById('darkModeToggle').addEventListener('click', function() {
            this.classList.toggle('active');
            document.body.classList.toggle('dark-mode');
            localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
        });

        document.getElementById('notificationsToggle').addEventListener('click', function() {
            this.classList.toggle('active');
        });

        document.getElementById('autoPlayToggle').addEventListener('click', function() {
            this.classList.toggle('active');
        });

        // Load dark mode preference
        if (localStorage.getItem('darkMode') === 'true') {
            document.body.classList.add('dark-mode');
            document.getElementById('darkModeToggle').classList.add('active');
        }

        // Notification
        function showNotification(title, text) {
            const notification = document.createElement('div');
            notification.className = 'notification';
            notification.innerHTML = `
                <div class="notification-title">${title}</div>
                <div class="notification-text">${text}</div>
            `;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.animation = 'slideInRight 0.5s ease-out reverse';
                setTimeout(() => notification.remove(), 500);
            }, 3000);
        }

        // Initialize
        renderLanguageTabs();
        renderCourses();

        // AI EXPLANATION FEATURE
const programmingKeywords = {
    'variable': true, 'variables': true,
    'function': true, 'functions': true,
    'loop': true, 'loops': true,
    'array': true, 'arrays': true,
    'object': true, 'objects': true,
    'string': true, 'strings': true,
    'integer': true, 'int': true,
    'boolean': true, 'bool': true,
    'class': true, 'classes': true,
    'method': true, 'methods': true,
    'parameter': true, 'parameters': true,
    'argument': true, 'arguments': true,
    'const': true, 'let': true, 'var': true,
    'return': true, 'if': true, 'else': true,
    'for': true, 'while': true,
    'component': true, 'components': true,
    'props': true, 'state': true, 'jsx': true,
    'import': true, 'export': true,
    'async': true, 'await': true, 'promise': true,
    'callback': true, 'event': true,
    'api': true, 'json': true, 'html': true,
    'css': true, 'dom': true, 'node': true
};

// Call AI API for explanations with improved fallback
async function getAIExplanation(keyword, context) {
    // Fallback explanations (use immediately if API is not available)
    const fallbacks = {
        'variable': 'Variables are containers that store data values. Think of them as labeled boxes where you can put information and retrieve it later. You can change what\'s inside anytime!',
        'function': 'Functions are reusable blocks of code that perform specific tasks. Like a recipe, you define it once and use it many times. They help keep your code organized!',
        'loop': 'Loops repeat code multiple times automatically. Instead of writing the same code 100 times, a loop does it for you! Common types include for loops and while loops.',
        'array': 'Arrays store multiple values in one variable, organized by index. Think of it as a numbered list where each item has a position starting from 0.',
        'string': 'Strings are sequences of characters representing text. Anything in quotes like "Hello" is a string. You can combine, split, and manipulate them!',
        'object': 'Objects store data as key-value pairs. Like a real object has properties (color, size), code objects have properties you can access and modify.',
        'boolean': 'Booleans represent true or false values. They\'re used in conditions to make decisions in your code, like "if user is logged in, show dashboard".',
        'const': 'Const declares a constant variable that cannot be reassigned. Use it when you want a value to stay the same throughout your program.',
        'let': 'Let declares a block-scoped variable that can be reassigned. It\'s the modern way to create variables that might change.',
        'component': 'Components are reusable pieces of UI in frameworks like React. Think of them as LEGO blocks you can combine to build your interface.',
        'props': 'Props pass data from parent to child components. They\'re like function parameters but for React components, making them flexible and reusable.',
        'jsx': 'JSX lets you write HTML-like code in JavaScript. It makes creating React components more intuitive by combining markup with logic.',
        'state': 'State is data that can change over time in your application. When state changes, your UI automatically updates to reflect the new data.',
        'import': 'Import statements bring in code from other files or libraries. It helps organize code into separate modules that can be reused.',
        'export': 'Export makes functions, objects, or values available to other files. It\'s how you share code between different parts of your application.',
        'async': 'Async functions allow you to write asynchronous code that looks synchronous. They return promises and make handling delayed operations easier.',
        'await': 'Await pauses execution until a promise resolves. It can only be used inside async functions and makes asynchronous code cleaner.',
        'promise': 'Promises represent future values from asynchronous operations. They can be pending, fulfilled, or rejected, helping manage async workflows.',
        'callback': 'Callbacks are functions passed as arguments to other functions. They\'re executed after an operation completes, enabling asynchronous behavior.',
        'event': 'Events are actions that happen in the browser, like clicks or key presses. You can listen for events and run code when they occur.',
        'api': 'APIs (Application Programming Interfaces) let different software systems communicate. They define how to request and receive data between applications.',
        'json': 'JSON (JavaScript Object Notation) is a lightweight data format. It\'s easy for humans to read and write, and easy for machines to parse.',
        'html': 'HTML (HyperText Markup Language) structures web content. It uses tags to define elements like headings, paragraphs, links, and images.',
        'css': 'CSS (Cascading Style Sheets) styles web pages. It controls colors, layouts, fonts, and visual appearance of HTML elements.',
        'dom': 'DOM (Document Object Model) represents HTML as a tree of objects. JavaScript can manipulate the DOM to dynamically change web page content.',
        'node': 'In web development, Node.js is a runtime that lets you run JavaScript outside the browser. It\'s commonly used for building server-side applications.',
        'class': 'Classes are blueprints for creating objects. They define properties and methods that objects created from the class will have.',
        'method': 'Methods are functions that belong to objects or classes. They define behaviors and actions that objects can perform.',
        'parameter': 'Parameters are variables listed in a function definition. They act as placeholders for values that will be passed when the function is called.',
        'argument': 'Arguments are the actual values passed to a function when you call it. They correspond to the parameters in the function definition.',
        'return': 'Return statements send a value back from a function. They end function execution and provide a result to the caller.',
        'if': 'If statements execute code conditionally. They check if a condition is true and run different code based on the result.',
        'else': 'Else provides an alternative when an if condition is false. It runs code when none of the previous conditions are true.',
        'for': 'For loops repeat code a specific number of times. They\'re great when you know how many iterations you need.',
        'while': 'While loops repeat code as long as a condition is true. They\'re useful when you don\'t know how many iterations you\'ll need.',
        'integer': 'Integers are whole numbers without decimal points. They can be positive, negative, or zero.',
        'int': 'Int is short for integer - a whole number without decimal points. Used for counting, indexing, and mathematical operations.',
    };

    // Return fallback explanation immediately (no API call for now)
    return fallbacks[keyword.toLowerCase()] ||
           `${keyword.charAt(0).toUpperCase() + keyword.slice(1)} is an important programming concept that helps you write better code. It\'s commonly used in many programming languages to build efficient and maintainable applications!`;
}

// Highlight keywords in text
function highlightKeywords(text) {
    let highlightedText = text;
    const keywords = Object.keys(programmingKeywords);
    
    // Sort by length (longest first) to avoid partial matches
    keywords.sort((a, b) => b.length - a.length);
    
    keywords.forEach(keyword => {
        const regex = new RegExp(`\\b(${keyword})\\b`, 'gi');
        highlightedText = highlightedText.replace(regex, (match) => {
            return `<span class="keyword-highlight" data-keyword="${match.toLowerCase()}">${match}</span>`;
        });
    });
    
    return highlightedText;
}

// REPLACE showAIPopup FUNCTION - 1.5 SECONDS
function showAIPopup(keyword, element) {
    const overlay = document.getElementById('aiPopupOverlay');
    const popup = document.getElementById('aiPopup');
    const content = document.getElementById('aiPopupContent');
    const closeBtn = document.getElementById('aiPopupClose');

    const rect = element.getBoundingClientRect();
    const popupHeight = 350;
    const popupWidth = Math.min(500, window.innerWidth - 40);

    let top = rect.top - popupHeight - 20;
    let left = rect.left + (rect.width / 2) - (popupWidth / 2);

    if (top < 20) top = rect.bottom + 20;
    if (left < 20) left = 20;
    if (left + popupWidth > window.innerWidth - 20) {
        left = window.innerWidth - popupWidth - 20;
    }

    popup.style.top = `${top}px`;
    popup.style.left = `${left}px`;
    popup.style.maxWidth = `${popupWidth}px`;

    content.innerHTML = `
        <div class="nuvia-thinking">
            <div class="nuvia-name">Nuvia</div>
            <div class="wave-container">
                <div class="wave-line"></div>
                <div class="wave-line"></div>
                <div class="wave-line"></div>
                <div class="wave-line"></div>
                <div class="wave-line"></div>
            </div>
        </div>
    `;

    content.classList.remove('show');
    closeBtn.style.opacity = '0';

    overlay.classList.add('active');
    setTimeout(() => popup.classList.add('active'), 10);

    const contextMessage = element.closest('.message');
    const context = contextMessage ? contextMessage.querySelector('.message-content').textContent.substring(0, 200) : '';

    getAIExplanation(keyword, context).then(explanation => {
        setTimeout(() => {
            content.innerHTML = `<p style="color: var(--text-primary); font-weight: 500;">${explanation}</p>`;
            setTimeout(() => {
                content.classList.add('show');
                closeBtn.style.opacity = '1';
            }, 100);
        }, 1500); // CHANGED TO 1.5 SECONDS
    }).catch(error => {
        setTimeout(() => {
            content.innerHTML = `<p style="color: var(--text-primary); font-weight: 500;">Nuvia couldn't load the explanation right now, but ${keyword} is an important programming concept!</p>`;
            setTimeout(() => {
                content.classList.add('show');
                closeBtn.style.opacity = '1';
            }, 100);
        }, 1500);
    });
}

// Close popup function remains the same
document.getElementById('aiPopupClose').addEventListener('click', () => {
    const overlay = document.getElementById('aiPopupOverlay');
    const popup = document.getElementById('aiPopup');
    
    popup.classList.remove('active');
    setTimeout(() => overlay.classList.remove('active'), 300);
});

document.getElementById('aiPopupOverlay').addEventListener('click', (e) => {
    if (e.target.id === 'aiPopupOverlay') {
        document.getElementById('aiPopupClose').click();
    }
});

// Attach click listeners to keywords
function attachKeywordListeners(container) {
    container.querySelectorAll('.keyword-highlight').forEach(keyword => {
        keyword.addEventListener('click', function(e) {
            e.stopPropagation();
            const keywordText = this.dataset.keyword;
            showAIPopup(keywordText, this);
        });
    });
}

// FIND YOUR typeMessage FUNCTION and UPDATE the code block part
function typeMessage(label, text, callback) {
    if (!chatbotActive) return; // Stop if chatbot closed

    const chatbotMessages = document.getElementById('chatbotMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    messageDiv.innerHTML = `
        <div class="message-label">${label}</div>
        <div class="message-content"></div>
    `;
    chatbotMessages.appendChild(messageDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

    const contentDiv = messageDiv.querySelector('.message-content');

    if (text.includes('\n') && (text.includes('=') || text.includes('{') || text.includes('print(') || text.includes('function'))) {
        const parts = text.split('\n\n');
        let partIndex = 0;

        const typePart = () => {
            if (!chatbotActive) return; // Stop if closed

            if (partIndex < parts.length) {
                const part = parts[partIndex];
                // CHECK if this part is code
                if (part.includes('=') || part.includes('{') || part.includes('print(') || part.includes('function') || part.includes('//') || part.includes('#')) {
                    // CREATE PROPER CODE BLOCK
                    const codeBlock = document.createElement('div');
                    codeBlock.className = 'code-block';
                    codeBlock.textContent = part;
                    contentDiv.appendChild(codeBlock);
                    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
                    partIndex++;
                    setTimeout(typePart, 100);
                } else {
                    // Regular text typing
                    let charIndex = 0;
                    const span = document.createElement('span');
                    contentDiv.appendChild(span);

                    const typeChar = () => {
                        if (!chatbotActive) return; // Stop if closed

                        if (charIndex < part.length) {
                            span.textContent += part[charIndex];
                            charIndex++;
                            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
                            setTimeout(typeChar, 5);
                        } else {
                            span.innerHTML = highlightKeywords(span.textContent);
                            attachKeywordListeners(span);
                            contentDiv.innerHTML += '<br><br>';
                            partIndex++;
                            setTimeout(typePart, 100);
                        }
                    };
                    typeChar();
                }
            } else {
                if (callback && chatbotActive) callback();
            }
        };
        typePart();
    } else {
        let index = 0;
        const typeChar = () => {
            if (!chatbotActive) return; // Stop if closed

            if (index < text.length) {
                contentDiv.textContent += text[index];
                index++;
                chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
                setTimeout(typeChar, 5);
            } else {
                contentDiv.innerHTML = highlightKeywords(contentDiv.textContent);
                attachKeywordListeners(contentDiv);
                if (callback && chatbotActive) callback();
            }
        };
        setTimeout(typeChar, 150);
    }
}

// Attach click listeners to highlighted keywords
function attachKeywordListeners(container) {
    container.querySelectorAll('.keyword-highlight').forEach(keyword => {
        keyword.addEventListener('click', function(e) {
            e.stopPropagation();
            const keywordText = this.dataset.keyword;
            showAIPopup(keywordText, this);
        });
    });
}

// Carousel indicator for analytics cards on mobile
function initCarouselIndicator() {
    const cardsContainer = document.getElementById('analyticsCards');
    const indicator = document.getElementById('carouselIndicator');
    
    if (!cardsContainer || !indicator) return;
    
    // Show indicator only on mobile
    function updateIndicatorVisibility() {
        if (window.innerWidth <= 768) {
            indicator.style.display = 'flex';
        } else {
            indicator.style.display = 'none';
        }
    }
    
    updateIndicatorVisibility();
    window.addEventListener('resize', updateIndicatorVisibility);
    
    // Update active dot on scroll
    const dots = indicator.querySelectorAll('.carousel-dot');
    
    cardsContainer.addEventListener('scroll', () => {
        const scrollLeft = cardsContainer.scrollLeft;
        const cardWidth = cardsContainer.querySelector('.analytics-card').offsetWidth + 15; // width + gap
        const activeIndex = Math.round(scrollLeft / cardWidth);
        
        dots.forEach((dot, index) => {
            if (index === activeIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    });
}

// Call on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCarouselIndicator);
} else {
    initCarouselIndicator();
}

// Pause lesson when leaving chatbot mid-way
const closeChatbotBtn = document.getElementById('closeChatbot');
if (closeChatbotBtn) {
    closeChatbotBtn.addEventListener('click', () => {
        // Stop all lesson typing immediately
        chatbotActive = false;
        lessonTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
        lessonTimeouts = [];

        const chatbotContainer = document.getElementById('chatbotContainer');
        const chatbotMessages = document.getElementById('chatbotMessages');

        // Check if in the middle of a lesson
        if (currentCourse && chatbotMessages && chatbotMessages.children.length > 0) {
            const progress = courseProgress[currentCourse.title];

            // Only show paused message if not fully complete
            if (progress && !progress.lessonCompleted && !progress.quizCompleted) {
                // Save current progress
                localStorage.setItem('courseProgress', JSON.stringify(courseProgress));

                // Update course cards to show paused state
                renderCourses();
                renderChart();

                showNotification('Paused', `Progress saved at ${progress.lessonIndex}/${progress.totalLessons} lessons`);
            }
        }

        chatbotContainer.classList.remove('active');
        stopStudyTimer();
    });
}

// ==================== PRACTICE SECTION FUNCTIONALITY ====================

// Language detection
function detectLanguage(code) {
    code = code.trim();
    
    // Python detection
    if (code.includes('print(') || code.includes('def ') || code.includes('import ') || 
        code.includes('from ') || code.startsWith('#') || code.includes('elif ') || 
        code.includes('range(')) {
        return 'Python';
    }
    
    // JavaScript detection
    if (code.includes('console.log') || code.includes('function ') || code.includes('const ') || 
        code.includes('let ') || code.includes('var ') || code.includes('=>') || 
        code.includes('document.')) {
        return 'JavaScript';
    }
    
    // Java detection
    if (code.includes('System.out.print') || code.includes('public class') || 
        code.includes('public static void') || code.includes('import java.')) {
        return 'Java';
    }
    
    // Default to Python
    return 'Python';
}

// Update language badge
function updateLanguageBadge(language) {
    const languageText = document.getElementById('languageText');
    if (languageText) {
        languageText.textContent = language;
    }
}

// Run Python code (simulated)
function runPythonCode(code) {
    try {
        // Simulated Python execution for basic print statements
        const output = [];
        const lines = code.split('\n');
        
        for (let line of lines) {
            line = line.trim();
            
            // Handle print statements
            if (line.startsWith('print(')) {
                const match = line.match(/print\((.*)\)/);
                if (match) {
                    let content = match[1];
                    // Remove quotes
                    content = content.replace(/^['"](.*)['"]$/, '$1');
                    output.push(content);
                }
            }
        }
        
        return output.length > 0 ? output.join('\n') : 'No output';
    } catch (error) {
        return `Error: ${error.message}`;
    }
}

// Run JavaScript code
function runJavaScriptCode(code) {
    try {
        // Capture console.log output
        const output = [];
        const originalLog = console.log;
        console.log = (...args) => {
            output.push(args.join(' '));
        };
        
        // Execute code
        eval(code);
        
        // Restore original console.log
        console.log = originalLog;
        
        return output.length > 0 ? output.join('\n') : 'No output';
    } catch (error) {
        return `Error: ${error.message}`;
    }
}

// Initialize practice section
const codeEditor = document.getElementById('codeEditor');
const runCodeBtn = document.getElementById('runCodeBtn');
const codePreview = document.getElementById('codePreview');

if (codeEditor) {
    // Detect language on input
    codeEditor.addEventListener('input', () => {
        const code = codeEditor.value;
        if (code.trim()) {
            const language = detectLanguage(code);
            updateLanguageBadge(language);
        }
    });
}

if (runCodeBtn && codeEditor && codePreview) {
    runCodeBtn.addEventListener('click', () => {
        const code = codeEditor.value.trim();
        
        if (!code) {
            codePreview.innerHTML = '<div class="preview-placeholder">Please write some code first...</div>';
            return;
        }
        
        const language = detectLanguage(code);
        let output;
        
        if (language === 'Python') {
            output = runPythonCode(code);
        } else if (language === 'JavaScript') {
            output = runJavaScriptCode(code);
        } else {
            output = `${language} execution not supported yet. Only Python and JavaScript are currently available.`;
        }
        
        // Display output
        if (output.startsWith('Error:')) {
            codePreview.innerHTML = `<div class="preview-error">${output}</div>`;
        } else {
            codePreview.innerHTML = `<div class="preview-output">${output}</div>`;
        }
    });
}

// ==================== AI SIDEBAR FUNCTIONALITY ====================

const aiHelperBtn = document.getElementById('aiHelperBtn');
const aiSidebar = document.getElementById('aiSidebar');
const aiSidebarClose = document.getElementById('aiSidebarClose');
const practiceWrapper = document.getElementById('practiceWrapper');
const aiInputOval = document.getElementById('aiInputOval');
const aiSendBtn = document.getElementById('aiSendBtn');
const aiConversation = document.getElementById('aiConversation');
const aiSuggestions = document.getElementById('aiSuggestions');
let aiCurrentLanguage = 'Python'; // Default language for AI sidebar

// Agent Mode Status Display Functions
window.showAgentStatus = function(status, text) {
    const statusMessage = document.getElementById('agentStatusMessage');
    const statusText = document.getElementById('agentStatusText');

    if (!statusMessage || !statusText) return;

    statusText.textContent = text;
    statusMessage.className = 'agent-status-message active';

    if (status === 'changing') {
        statusMessage.classList.add('changing');
    } else if (status === 'success') {
        statusMessage.classList.remove('changing');
        statusMessage.classList.add('success');
        // Hide success message after 3 seconds
        setTimeout(() => {
            statusMessage.classList.remove('active');
        }, 3000);
    }
};

window.hideAgentStatus = function() {
    const statusMessage = document.getElementById('agentStatusMessage');
    if (statusMessage) {
        statusMessage.classList.remove('active', 'changing', 'success');
    }
};

if (aiHelperBtn && aiSidebar && aiSidebarClose && practiceWrapper) {
    // Open AI Sidebar
    aiHelperBtn.addEventListener('click', () => {
        aiSidebar.classList.add('active');
        practiceWrapper.classList.add('shifted');
        // Check if user has code written
        const hasCode = codeEditor && codeEditor.value.trim().length > 0;
        updateSuggestions(aiCurrentLanguage, hasCode);
    });

    // Close AI Sidebar
    aiSidebarClose.addEventListener('click', () => {
        aiSidebar.classList.remove('active');
        practiceWrapper.classList.remove('shifted');
    });

    // Suggestion rotation state
    let suggestionRotationIndex = 0;
    let suggestionRotationInterval = null;

    // Update suggestions based on detected language
    function updateSuggestions(language, hasCode = false) {
        // Fallback suggestions when AI_CONFIG is not loaded
        const fallbackSuggestions = {
            'Python': ['Explain my code', 'How do I use loops?', 'Explain functions', 'Fix errors', 'Optimize code'],
            'JavaScript': ['Explain my code', 'How do promises work?', 'Explain async/await', 'Fix errors', 'Best practices'],
            'HTML': ['Explain my code', 'How to structure a page?', 'What are semantic tags?', 'Fix layout', 'Improve accessibility'],
            'CSS': ['Explain my code', 'How to center a div?', 'Explain flexbox', 'Fix styling', 'Optimize CSS'],
            'Java': ['Explain my code', 'What are classes?', 'How do I use loops?', 'Fix errors', 'Code review'],
            'C++': ['Explain my code', 'Explain pointers', 'How do vectors work?', 'Fix errors', 'Optimize code'],
            'Ruby': ['Explain my code', 'What are blocks?', 'How to iterate arrays?', 'Fix errors', 'Best practices']
        };

        let suggestions;
        if (typeof AI_CONFIG === 'undefined' || !AI_CONFIG || !AI_CONFIG.suggestions) {
            console.warn('⚠️ AI_CONFIG not loaded. Using fallback suggestions.');
            suggestions = fallbackSuggestions[language] || fallbackSuggestions['Python'];
        } else {
            suggestions = AI_CONFIG.suggestions[language] || AI_CONFIG.suggestions['Python'];
        }

        // If user has code, prioritize code-based suggestions
        if (hasCode && AI_CONFIG && AI_CONFIG.codeSuggestions) {
            const codeSugg = AI_CONFIG.codeSuggestions[0]; // Use first code suggestion
            suggestions = [codeSugg, ...suggestions.filter(s => s !== codeSugg)];
        }

        // Clear rotation interval if exists
        if (suggestionRotationInterval) {
            clearInterval(suggestionRotationInterval);
        }

        // Function to display suggestions with animation
        function displaySuggestions(startIndex) {
            // Add blur out animation
            aiSuggestions.style.filter = 'blur(10px)';
            aiSuggestions.style.opacity = '0';
            aiSuggestions.style.transition = 'all 0.3s ease';

            setTimeout(() => {
                aiSuggestions.innerHTML = '';

                // Show 4 suggestions in rotation
                const suggestionsToShow = [];
                for (let i = 0; i < 4; i++) {
                    const index = (startIndex + i) % suggestions.length;
                    suggestionsToShow.push(suggestions[index]);
                }

                suggestionsToShow.forEach((suggestion, idx) => {
                    const chip = document.createElement('div');
                    chip.className = 'ai-suggestion-chip';
                    chip.textContent = suggestion;
                    chip.style.opacity = '0';
                    chip.style.transform = 'translateY(10px)';
                    chip.addEventListener('click', () => {
                        aiInputOval.value = suggestion;
                        aiInputOval.focus();
                    });
                    aiSuggestions.appendChild(chip);

                    // Stagger animation
                    setTimeout(() => {
                        chip.style.transition = 'all 0.3s ease';
                        chip.style.opacity = '1';
                        chip.style.transform = 'translateY(0)';
                    }, idx * 50);
                });

                // Blur in animation
                aiSuggestions.style.filter = 'blur(0px)';
                aiSuggestions.style.opacity = '1';
            }, 300);
        }

        // Initial display
        displaySuggestions(0);

        // Rotate suggestions every 8 seconds with blur animation
        suggestionRotationInterval = setInterval(() => {
            suggestionRotationIndex = (suggestionRotationIndex + 4) % suggestions.length;
            displaySuggestions(suggestionRotationIndex);
        }, 8000);
    }

    // Listen for language changes in code editor
    if (codeEditor) {
        codeEditor.addEventListener('input', () => {
            const code = codeEditor.value;
            if (code.trim()) {
                const detectedLang = detectLanguage(code);
                if (detectedLang !== aiCurrentLanguage) {
                    aiCurrentLanguage = detectedLang;
                    if (aiSidebar.classList.contains('active')) {
                        updateSuggestions(aiCurrentLanguage);
                    }
                }
            }
        });
    }

    // Add message to conversation with improved formatting
    function addMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `ai-message ${type}`;

        if (type === 'ai') {
            // Format AI responses with better structure
            messageDiv.innerHTML = formatAIResponse(text);
        } else {
            messageDiv.textContent = text;
        }

        aiConversation.appendChild(messageDiv);
        aiConversation.scrollTop = aiConversation.scrollHeight;
    }

    // Format AI responses for better readability
    function formatAIResponse(text) {
        // Remove markdown hashtags (headers) and replace with bold
        text = text.replace(/#+\s+(.+)/g, '<strong>$1</strong>');

        // Remove asterisk bold/italic markers
        text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');

        // Convert markdown-style code blocks
        text = text.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');

        // Convert inline code
        text = text.replace(/`([^`]+)`/g, '<code>$1</code>');

        // Convert bullet points
        text = text.replace(/^\s*[-•]\s+(.+)$/gm, '<li>$1</li>');

        // Wrap consecutive list items in ul
        text = text.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');

        // Convert numbered lists
        text = text.replace(/^\s*\d+\.\s+(.+)$/gm, '<li>$1</li>');

        // Convert line breaks to paragraphs (limit length)
        const paragraphs = text.split('\n\n').filter(p => p.trim());
        if (paragraphs.length > 1 && !text.includes('<ul>') && !text.includes('<pre>')) {
            text = paragraphs.slice(0, 4).map(p => { // Limit to 4 paragraphs
                if (!p.startsWith('<') && p.trim()) {
                    return '<p>' + p.trim() + '</p>';
                }
                return p;
            }).join('');
        }

        // Truncate if response is too long (more than 500 characters)
        if (text.length > 500 && !text.includes('<code>')) {
            text = text.substring(0, 500) + '...';
        }

        return text;
    }

    // Fallback AI response when aiConfig.js is not available
    function getFallbackAIResponse(question, language) {
        const lowerQuestion = question.toLowerCase();

        // Language-specific responses
        const responses = {
            'Python': {
                'loop': 'In Python, you can use for loops: `for i in range(5):` or while loops: `while condition:`. For loops are great for iterating over sequences like lists.',
                'function': 'Define functions in Python with `def function_name(parameters):`. Remember to use proper indentation. Example: `def greet(name):\n    return f"Hello, {name}"`',
                'list': 'Python lists are created with square brackets: `my_list = [1, 2, 3]`. Access items with `my_list[0]`, and use methods like `.append()`, `.remove()`, and `.pop()`.',
                'default': 'In Python, focus on clean, readable code. Use proper indentation (4 spaces), meaningful variable names, and built-in functions like `len()`, `range()`, and `enumerate()`.'
            },
            'JavaScript': {
                'promise': 'Promises handle async operations. Create one with `new Promise((resolve, reject) => {...})`. Use `.then()` for success and `.catch()` for errors.',
                'async': 'async/await makes promises easier to read. Mark functions with `async`, then use `await` before promises: `const result = await fetchData();`',
                'function': 'JavaScript functions can be declared as `function name() {}` or as arrow functions: `const name = () => {}`. Arrow functions are great for callbacks.',
                'default': 'JavaScript is versatile! Key concepts: variables (let/const), functions, arrays, objects, and async programming. Always use `const` by default, `let` when you need to reassign.'
            },
            'HTML': {
                'structure': 'HTML structure: `<!DOCTYPE html>`, then `<html>`, `<head>` (metadata), and `<body>` (content). Use semantic tags like `<header>`, `<nav>`, `<main>`, `<footer>`.',
                'tag': 'Common tags: `<div>` (container), `<p>` (paragraph), `<a href="">` (link), `<img src="">` (image), `<button>` (button). Always close tags properly!',
                'semantic': 'Semantic tags describe content: `<article>`, `<section>`, `<aside>`, `<nav>`, `<header>`, `<footer>`. They improve accessibility and SEO.',
                'default': 'HTML provides structure to web pages. Use semantic tags for better accessibility, add alt text to images, and always validate your HTML structure.'
            },
            'CSS': {
                'center': 'Center a div with Flexbox: `display: flex; justify-content: center; align-items: center;` or Grid: `display: grid; place-items: center;`',
                'flexbox': 'Flexbox is for 1D layouts. On container: `display: flex;`. Common properties: `justify-content` (horizontal), `align-items` (vertical), `gap` (spacing).',
                'grid': 'CSS Grid is for 2D layouts. Set `display: grid;` on container, define columns: `grid-template-columns: 1fr 1fr;`, and use `gap` for spacing.',
                'default': 'CSS styles your HTML. Key concepts: selectors, box model, flexbox, grid, and responsive design with media queries. Use CSS variables for maintainability!'
            },
            'default': {
                'default': `Great question about ${language}! Here's a tip: Break down your problem into smaller steps, use console.log (or print) to debug, and don't hesitate to check documentation.`
            }
        };

        // Get language-specific responses or default
        const langResponses = responses[language] || responses['default'];

        // Match question keywords to responses
        for (const [keyword, response] of Object.entries(langResponses)) {
            if (keyword !== 'default' && lowerQuestion.includes(keyword)) {
                return response;
            }
        }

        // Return default response for the language
        return langResponses['default'];
    }

    // Send message function
    async function sendMessage() {
        const question = aiInputOval.value.trim();

        if (!question) {
            return;
        }

        // Add user message
        addMessage(question, 'user');
        aiInputOval.value = '';

        // Show thinking state with wave animation
        const thinkingDiv = document.createElement('div');
        thinkingDiv.className = 'ai-message ai';
        thinkingDiv.innerHTML = `
            <div class="ai-thinking-wave">
                <span class="wave-dot" style="animation-delay: 0s"></span>
                <span class="wave-dot" style="animation-delay: 0.1s"></span>
                <span class="wave-dot" style="animation-delay: 0.2s"></span>
                <span class="thinking-text">Thinking...</span>
            </div>
        `;
        thinkingDiv.id = 'thinking-message';
        aiConversation.appendChild(thinkingDiv);
        aiConversation.scrollTop = aiConversation.scrollHeight;

        try {
            let response;

            // Check if callAI is available, otherwise use fallback
            if (typeof callAI === 'undefined') {
                console.log('ℹ️ Using fallback AI responses (aiConfig.js not loaded)');
                response = getFallbackAIResponse(question, aiCurrentLanguage);
            } else {
                // Call AI API (from aiConfig.js)
                response = await callAI(question, aiCurrentLanguage);
            }

            // Remove thinking message
            const thinkingMsg = document.getElementById('thinking-message');
            if (thinkingMsg) {
                thinkingMsg.remove();
            }

            // Add AI response
            addMessage(response, 'ai');
        } catch (error) {
            console.error('AI Error:', error);
            const thinkingMsg = document.getElementById('thinking-message');
            if (thinkingMsg) {
                thinkingMsg.remove();
            }
            addMessage('Sorry, I encountered an error. Please try again.', 'ai');
        }
    }

    // Send button click
    if (aiSendBtn) {
        aiSendBtn.addEventListener('click', sendMessage);
    }

    // Enter key to send
    if (aiInputOval) {
        aiInputOval.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendMessage();
            }
        });

        // Update suggestions as user types
        let suggestionTimeout;
        aiInputOval.addEventListener('input', () => {
            clearTimeout(suggestionTimeout);
            const input = aiInputOval.value.trim();

            if (input.length >= 2) {
                // Wait 300ms after user stops typing
                suggestionTimeout = setTimeout(() => {
                    showDynamicSuggestions(input);
                }, 300);
            } else {
                // Show default suggestions when input is empty
                updateSuggestions(aiCurrentLanguage);
            }
        });
    }

    // Show dynamic suggestions based on user input
    function showDynamicSuggestions(input) {
        const words = input.toLowerCase().split(' ');
        const firstTwoWords = words.slice(0, 2).join(' ');

        const dynamicSuggestions = {
            'how': ['How do I debug this?', 'How to optimize code?', 'How does this work?'],
            'what': ['What is this error?', 'What does this do?', 'What is best practice?'],
            'why': ['Why is this not working?', 'Why use this method?', 'Why this error?'],
            'how do': ['How do I fix this?', 'How do loops work?', 'How do I optimize?'],
            'how to': ['How to debug efficiently?', 'How to improve performance?', 'How to fix syntax?'],
            'what is': ['What is causing this?', 'What is the issue?', 'What is wrong here?'],
            'explain': ['Explain this code', 'Explain the logic', 'Explain the error'],
            'fix': ['Fix my code', 'Fix this bug', 'Fix syntax error'],
            'help': ['Help me understand', 'Help with debugging', 'Help optimize this'],
            'debug': ['Debug this code', 'Debug my function', 'Debug the error']
        };

        // Find matching suggestions
        let suggestions = [];
        for (const [key, values] of Object.entries(dynamicSuggestions)) {
            if (firstTwoWords.includes(key) || input.toLowerCase().includes(key)) {
                suggestions = values;
                break;
            }
        }

        // If no match, show language-specific suggestions
        if (suggestions.length === 0) {
            updateSuggestions(aiCurrentLanguage);
            return;
        }

        // Update UI with dynamic suggestions
        aiSuggestions.innerHTML = '';
        suggestions.slice(0, 3).forEach(suggestion => {
            const chip = document.createElement('div');
            chip.className = 'ai-suggestion-chip';
            chip.textContent = suggestion;
            chip.addEventListener('click', () => {
                aiInputOval.value = suggestion;
                aiInputOval.focus();
            });
            aiSuggestions.appendChild(chip);
        });
    }

    // Plus button functionality - Show agent popup
    const aiPlusBtn = document.getElementById('aiPlusBtn');
    const agentPopup = document.getElementById('agentPopup');
    const agentModeToggle = document.getElementById('agentModeToggle');
    let newAgentMode = false;

    if (aiPlusBtn && agentPopup) {
        aiPlusBtn.addEventListener('click', () => {
            agentPopup.classList.toggle('active');
        });

        // Close popup when clicking outside
        document.addEventListener('click', (e) => {
            if (!agentPopup.contains(e.target) && !aiPlusBtn.contains(e.target)) {
                agentPopup.classList.remove('active');
            }
        });
    }

    // Agent mode toggle
    if (agentModeToggle) {
        agentModeToggle.addEventListener('click', () => {
            agentModeToggle.classList.toggle('active');
            newAgentMode = !newAgentMode;

            if (newAgentMode) {
                aiPlusBtn.classList.add('active');
                // Show agent mode enabled notification
                if (window.showAgentStatus) {
                    showAgentStatus('success', 'Agent Mode Enabled');
                }
            } else {
                aiPlusBtn.classList.remove('active');
                if (window.hideAgentStatus) {
                    hideAgentStatus();
                }
            }
        });
    }

    // Enhanced send message function for agent mode
    window.sendMessageToAIWithAgent = function(message) {
        const codeEditor = document.getElementById('codeEditor');

        if (newAgentMode) {
            // Agent mode workflow
            showAgentStatus('thinking', 'Thinking...');

            setTimeout(() => {
                showAgentStatus('changing', 'Changing code...');

                // Simulate code changes character by character
                const newCode = `# AI improved code\n${codeEditor.value || '# Example code'}`;
                let currentIndex = 0;
                const typingInterval = setInterval(() => {
                    if (currentIndex < newCode.length) {
                        codeEditor.value = newCode.substring(0, currentIndex + 1);
                        currentIndex++;
                    } else {
                        clearInterval(typingInterval);
                        showAgentStatus('success', 'Code has been changed successfully! See the updated code');
                    }
                }, 20);
            }, 1500);
        }
    };
}

// ==================== SPLASH SCREEN ====================
(function() {
    const splashScreen = document.getElementById('splashScreen');
    const splashContinueBtn = document.getElementById('splashContinueBtn');
    const splashCloseBtn = document.getElementById('splashCloseBtn');
    const currentVersion = '5.0';
    const lastVersion = localStorage.getItem('appVersion');

    function hideSplash() {
        splashScreen.classList.add('hidden');
        localStorage.setItem('appVersion', currentVersion);
    }

    // Always add event listeners to buttons
    if (splashContinueBtn) {
        splashContinueBtn.addEventListener('click', hideSplash);
    }
    if (splashCloseBtn) {
        splashCloseBtn.addEventListener('click', hideSplash);
    }

    // Show splash screen only for new versions
    if (lastVersion !== currentVersion) {
        // Splash will show by default
    } else {
        // Hide immediately if same version
        splashScreen.classList.add('hidden');
    }
})();

// ==================== LOGOUT CONFIRMATION ====================
(function() {
    const logoutBtn = document.getElementById('logoutBtn');
    const logoutConfirmation = document.getElementById('logoutConfirmation');
    const cancelLogout = document.getElementById('cancelLogout');
    const confirmLogout = document.getElementById('confirmLogout');

    if (logoutBtn && logoutConfirmation) {
        // Show confirmation instead of logging out immediately
        logoutBtn.onclick = function(e) {
            e.preventDefault();
            logoutConfirmation.classList.add('active');
        };

        // Cancel logout
        if (cancelLogout) {
            cancelLogout.addEventListener('click', () => {
                logoutConfirmation.classList.remove('active');
            });
        }

        // Confirm logout
        if (confirmLogout) {
            confirmLogout.addEventListener('click', () => {
                window.logout();
            });
        }

        // Close on overlay click
        logoutConfirmation.addEventListener('click', (e) => {
            if (e.target === logoutConfirmation) {
                logoutConfirmation.classList.remove('active');
            }
        });
    }
})();

// ==================== 2FA TOGGLE FUNCTIONALITY ====================
(function() {
    const twoFactorToggle = document.getElementById('twoFactorToggle');

    if (twoFactorToggle) {
        // Load 2FA state from current user
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.twoFactorEnabled) {
            twoFactorToggle.classList.add('active');
        }

        // Toggle 2FA
        twoFactorToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            const enabled = this.classList.contains('active');

            // Update current user's 2FA status
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (currentUser) {
                currentUser.twoFactorEnabled = enabled;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));

                // Update in users array
                const users = JSON.parse(localStorage.getItem('users') || '[]');
                const userIndex = users.findIndex(u => u.email === currentUser.email);
                if (userIndex !== -1) {
                    users[userIndex].twoFactorEnabled = enabled;
                    localStorage.setItem('users', JSON.stringify(users));
                }

                // Show notification
                const notification = document.createElement('div');
                notification.style.cssText = `
                    position: fixed;
                    top: 30px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: ${enabled ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)' : 'linear-gradient(135deg, #6b7280, #4b5563)'};
                    color: white;
                    padding: 12px 24px;
                    border-radius: 12px;
                    font-size: 14px;
                    font-weight: 500;
                    box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
                    z-index: 100000;
                    animation: slideDown 0.5s ease;
                `;
                notification.textContent = `2FA ${enabled ? 'enabled' : 'disabled'}`;
                document.body.appendChild(notification);

                setTimeout(() => {
                    notification.remove();
                }, 3000);
            }
        });
    }
})();

// ==================== FIX MOBILE HOME PAGE VISIBILITY ====================
(function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page-section');

    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            const targetPage = this.dataset.page;

            // Force repaint for home page on mobile
            if (targetPage === 'home') {
                setTimeout(() => {
                    const chartContainer = document.querySelector('.chart-container');
                    if (chartContainer) {
                        chartContainer.style.display = 'none';
                        chartContainer.offsetHeight; // Trigger reflow
                        chartContainer.style.display = 'flex';
                    }

                    const widgets = document.querySelector('.widgets-grid');
                    if (widgets) {
                        widgets.style.display = 'none';
                        widgets.offsetHeight; // Trigger reflow
                        widgets.style.display = 'grid';
                    }
                }, 100);
            }
        });
    });
})();
