// Authentication System
(function() {
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

    // Login Elements
    const loginEmail = document.getElementById('loginEmail');
    const loginPassword = document.getElementById('loginPassword');
    const loginBtn = document.getElementById('loginBtn');
    const loginError = document.getElementById('loginError');

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

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
