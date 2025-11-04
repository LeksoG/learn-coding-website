const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const session = require('express-session');

const app = express();

// Build connection string with separate password
const DB_USER = process.env.DB_USER || 'neondb_owner';
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST || 'ep-holy-flower-ahh42lgr-pooler.us-east-1.aws.neon.tech';
const DB_NAME = process.env.DB_NAME || 'neondb';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error('❌ DATABASE_URL not set!');
}

const pool = new Pool({
    connectionString: connectionString,
    ssl: {
        rejectUnauthorized: false
    }
});

// Middleware
app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);
        
        const allowedOrigins = [
            'https://learn-coding-website.vercel.app',
            'http://localhost:3000',
            'http://localhost:5500',
            'http://127.0.0.1:5500'
        ];
        
        // Allow any Vercel preview deployment
        if (origin && origin.includes('vercel.app')) {
            return callback(null, true);
        }
        
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        
        // For development, allow all origins
        return callback(null, true);
    },
    credentials: true
}));

app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET || 'dev-secret-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    }
}));

// Test database connection (only in development)
if (process.env.NODE_ENV !== 'production') {
    pool.connect((err, client, release) => {
        if (err) {
            console.error('❌ Database connection error:', err.stack);
        } else {
            console.log('✅ Connected to Neon PostgreSQL');
            release();
        }
    });
}

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server running' });
});

// ==================== EMAIL CONFIG ROUTE ====================
app.get('/api/email-config', (req, res) => {
    try {
        const emailConfig = {
            serviceId: process.env.EMAILJS_SERVICE_ID || null,
            templateId2FA: process.env.EMAILJS_TEMPLATE_2FA || null,
            templateIdReset: process.env.EMAILJS_TEMPLATE_RESET || null,
            publicKey: process.env.EMAILJS_PUBLIC_KEY || null
        };

        const isConfigured = !!(emailConfig.serviceId && emailConfig.templateId2FA && emailConfig.publicKey);

        res.json({
            configured: isConfigured,
            config: isConfigured ? emailConfig : null
        });
    } catch (error) {
        console.error('Email config error:', error);
        res.status(500).json({ error: 'Failed to load email config' });
    }
});

// ==================== AUTH ROUTES ====================

// Signup
app.post('/api/auth/signup', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (userCheck.rows.length > 0) {
            return res.status(400).json({ error: 'Account already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, two_factor_enabled',
            [name, email, hashedPassword]
        );

        await pool.query('INSERT INTO user_stats (user_id) VALUES ($1)', [result.rows[0].id]);

        res.status(201).json({ 
            message: 'Account created successfully',
            user: result.rows[0]
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Server error during signup' });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Account not found' });
        }

        const user = result.rows[0];
        const validPassword = await bcrypt.compare(password, user.password);
        
        if (!validPassword) {
            return res.status(401).json({ error: 'Wrong password' });
        }

        req.session.userId = user.id;

        const { password: _, ...userData } = user;
        res.json({ 
            message: 'Login successful',
            user: userData,
            requiresTwoFactor: user.two_factor_enabled
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error during login' });
    }
});

// Logout
app.post('/api/auth/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.json({ message: 'Logged out successfully' });
    });
});

// Get current user
app.get('/api/auth/me', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
        const result = await pool.query(
            'SELECT id, name, email, two_factor_enabled FROM users WHERE id = $1',
            [req.session.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user: result.rows[0] });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// ==================== PROGRESS ROUTES ====================

// Get progress
app.get('/api/progress', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
        const result = await pool.query(
            'SELECT * FROM course_progress WHERE user_id = $1',
            [req.session.userId]
        );

        const progress = {};
        result.rows.forEach(row => {
            progress[row.course_title] = {
                lessonIndex: row.lesson_index,
                totalLessons: row.total_lessons,
                lessonCompleted: row.lesson_completed,
                quizCompleted: row.quiz_completed,
                messages: row.messages,
                currentIndex: row.current_index
            };
        });

        res.json({ progress });
    } catch (error) {
        console.error('Get progress error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Save progress
app.post('/api/progress', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    const { courseTitle, progress } = req.body;

    try {
        await pool.query(
            `INSERT INTO course_progress 
            (user_id, course_title, lesson_index, total_lessons, lesson_completed, quiz_completed, messages, current_index)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            ON CONFLICT (user_id, course_title) 
            DO UPDATE SET 
                lesson_index = $3, total_lessons = $4, lesson_completed = $5,
                quiz_completed = $6, messages = $7, current_index = $8, updated_at = CURRENT_TIMESTAMP`,
            [
                req.session.userId, courseTitle,
                progress.lessonIndex || 0, progress.totalLessons || 0,
                progress.lessonCompleted || false, progress.quizCompleted || false,
                progress.messages || '', progress.currentIndex || 0
            ]
        );

        res.json({ message: 'Progress saved' });
    } catch (error) {
        console.error('Save progress error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get completed courses
app.get('/api/completed-courses', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
        const result = await pool.query(
            'SELECT course_title FROM completed_courses WHERE user_id = $1',
            [req.session.userId]
        );

        const courses = result.rows.map(row => row.course_title);
        res.json({ courses });
    } catch (error) {
        console.error('Get completed courses error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Mark course completed
app.post('/api/completed-courses', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    const { courseTitle } = req.body;

    try {
        await pool.query(
            'INSERT INTO completed_courses (user_id, course_title) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [req.session.userId, courseTitle]
        );

        res.json({ message: 'Course marked as completed' });
    } catch (error) {
        console.error('Complete course error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get stats
app.get('/api/stats', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
        const result = await pool.query('SELECT * FROM user_stats WHERE user_id = $1', [req.session.userId]);

        if (result.rows.length === 0) {
            await pool.query('INSERT INTO user_stats (user_id) VALUES ($1)', [req.session.userId]);
            return res.json({
                stats: { total_study_time: 0, streak: 0, longest_streak: 0, last_study_date: null }
            });
        }

        res.json({ stats: result.rows[0] });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update stats
app.put('/api/stats', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    const { totalStudyTime, streak, longestStreak, lastStudyDate } = req.body;

    try {
        await pool.query(
            `UPDATE user_stats 
            SET total_study_time = $1, streak = $2, longest_streak = $3, last_study_date = $4, updated_at = CURRENT_TIMESTAMP
            WHERE user_id = $5`,
            [totalStudyTime, streak, longestStreak, lastStudyDate, req.session.userId]
        );

        res.json({ message: 'Stats updated' });
    } catch (error) {
        console.error('Update stats error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Toggle 2FA
app.put('/api/user/2fa', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    const { enabled } = req.body;

    try {
        await pool.query(
            'UPDATE users SET two_factor_enabled = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
            [enabled, req.session.userId]
        );

        res.json({ message: '2FA updated' });
    } catch (error) {
        console.error('2FA update error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// ==================== AI CHAT ROUTE ====================
app.post('/api/ai-chat', async (req, res) => {
    const { message, language, context } = req.body;

    try {
        // Placeholder response - replace with real AI later
        const responses = {
            'Python': 'Python is a great language! Here are some tips...',
            'JavaScript': 'JavaScript is powerful! Let me help you...',
            'default': 'I can help you with that!'
        };

        const response = responses[language] || responses['default'];

        res.json({ 
            success: true,
            response: `You asked: "${message}". ${response}`
        });
    } catch (error) {
        console.error('AI chat error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'AI service temporarily unavailable' 
        });
    }
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Export for Vercel serverless
module.exports = app;

// Start server locally (won't run on Vercel)
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        // CORRECT - Add parenthesis
console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
}



