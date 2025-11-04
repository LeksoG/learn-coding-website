const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const app = express();

// Database connection using DATABASE_URL
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error('❌ DATABASE_URL not set!');
    console.error('⚠️  Set DATABASE_URL environment variable in Vercel dashboard');
}

const pool = new Pool({
    connectionString: connectionString,
    ssl: {
        rejectUnauthorized: false
    },
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 30000,
    max: 10
});

// Middleware
app.use(cors({
    origin: function(origin, callback) {
        if (!origin) return callback(null, true);
        
        const allowedOrigins = [
            'https://learn-coding-website.vercel.app',
            'http://localhost:3000',
            'http://localhost:5500',
            'http://127.0.0.1:5500'
        ];
        
        if (origin && origin.includes('vercel.app')) {
            return callback(null, true);
        }
        
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        
        return callback(null, true);
    },
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// JWT Authentication Middleware
function authenticateToken(req, res, next) {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
}

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

// Database initialization endpoint
app.get('/api/init-db', async (req, res) => {
    try {
        console.log('🔧 Initializing database tables...');

        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                two_factor_enabled BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS user_stats (
                id SERIAL PRIMARY KEY,
                user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                total_study_time INTEGER DEFAULT 0,
                streak INTEGER DEFAULT 0,
                longest_streak INTEGER DEFAULT 0,
                last_study_date TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS course_progress (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                course_title VARCHAR(255) NOT NULL,
                lesson_index INTEGER DEFAULT 0,
                total_lessons INTEGER DEFAULT 0,
                lesson_completed BOOLEAN DEFAULT FALSE,
                quiz_completed BOOLEAN DEFAULT FALSE,
                messages TEXT DEFAULT '',
                current_index INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, course_title)
            )
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS completed_courses (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                course_title VARCHAR(255) NOT NULL,
                completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, course_title)
            )
        `);

        await pool.query(`
            CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
            CREATE INDEX IF NOT EXISTS idx_user_stats_user_id ON user_stats(user_id);
            CREATE INDEX IF NOT EXISTS idx_course_progress_user_id ON course_progress(user_id);
            CREATE INDEX IF NOT EXISTS idx_completed_courses_user_id ON completed_courses(user_id);
        `);

        console.log('✅ Database tables initialized successfully');
        res.json({
            success: true,
            message: 'Database tables initialized successfully'
        });
    } catch (error) {
        console.error('❌ Database initialization error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to initialize database',
            details: error.message
        });
    }
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
    console.log('🔵 SIGNUP ATTEMPT STARTED');
    const { name, email, password } = req.body;

    try {
        if (!process.env.DATABASE_URL) {
            console.error('❌ DATABASE_URL not configured');
            return res.status(500).json({
                error: 'Server configuration error',
                details: 'Database not configured.'
            });
        }

        if (!name || !email || !password) {
            console.log('❌ Missing required fields');
            return res.status(400).json({ error: 'All fields are required' });
        }

        console.log('📧 Checking if user exists:', email);
        const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (userCheck.rows.length > 0) {
            console.log('❌ User already exists');
            return res.status(400).json({ error: 'Account already exists' });
        }

        console.log('🔐 Hashing password...');
        const hashedPassword = await bcrypt.hash(password, 10);

        console.log('➕ Creating user...');
        const result = await pool.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, two_factor_enabled',
            [name, email, hashedPassword]
        );

        console.log('➕ Creating user stats...');
        await pool.query('INSERT INTO user_stats (user_id) VALUES ($1)', [result.rows[0].id]);

        console.log('✅ SIGNUP SUCCESSFUL');
        res.status(201).json({
            message: 'Account created successfully',
            user: result.rows[0]
        });
    } catch (error) {
        console.error('❌ SIGNUP ERROR:', error.message);
        console.error('Error code:', error.code);

        if (error.code === '42P01') {
            return res.status(500).json({
                error: 'Database tables not initialized',
                details: 'Please visit /api/init-db to set up the database tables.'
            });
        }

        if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
            return res.status(500).json({
                error: 'Database connection failed',
                details: 'Could not connect to database.'
            });
        }

        res.status(500).json({
            error: 'Server error during signup',
            details: error.message
        });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    console.log('🔵 LOGIN ATTEMPT STARTED');
    const { email, password } = req.body;

    try {
        if (!process.env.DATABASE_URL) {
            console.error('❌ DATABASE_URL not configured');
            return res.status(500).json({
                error: 'Server configuration error',
                details: 'Database not configured.'
            });
        }

        if (!email || !password) {
            console.log('❌ Missing credentials');
            return res.status(400).json({ error: 'Email and password are required' });
        }

        console.log('🔍 Querying database for user:', email);
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        console.log('✅ Query complete. Users found:', result.rows.length);

        if (result.rows.length === 0) {
            console.log('❌ Account not found');
            return res.status(404).json({ error: 'Account not found' });
        }

        const user = result.rows[0];
        console.log('🔐 Comparing password...');

        const validPassword = await bcrypt.compare(password, user.password);
        console.log('✅ Password valid:', validPassword);

        if (!validPassword) {
            console.log('❌ Invalid password');
            return res.status(401).json({ error: 'Wrong password' });
        }

        // Create JWT token
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        const { password: _, ...userData } = user;
        console.log('✅ LOGIN SUCCESSFUL');
        res.json({
            message: 'Login successful',
            user: userData,
            token: token,
            requiresTwoFactor: user.two_factor_enabled
        });
    } catch (error) {
        console.error('❌ LOGIN ERROR:', error.message);
        console.error('Error code:', error.code);

        if (error.code === '42P01') {
            return res.status(500).json({
                error: 'Database tables not initialized',
                details: 'Please visit /api/init-db to set up the database tables.'
            });
        }

        if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
            return res.status(500).json({
                error: 'Database connection failed',
                details: 'Could not connect to database.'
            });
        }

        res.status(500).json({
            error: 'Server error during login',
            details: error.message
        });
    }
});

// Logout
app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
});

// Get current user
app.get('/api/auth/me', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, name, email, two_factor_enabled FROM users WHERE id = $1',
            [req.userId]
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
app.get('/api/progress', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM course_progress WHERE user_id = $1',
            [req.userId]
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
app.post('/api/progress', authenticateToken, async (req, res) => {
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
                req.userId,
                courseTitle,
                progress.lessonIndex || 0,
                progress.totalLessons || 0,
                progress.lessonCompleted || false,
                progress.quizCompleted || false,
                progress.messages || '',
                progress.currentIndex || 0
            ]
        );

        res.json({ message: 'Progress saved' });
    } catch (error) {
        console.error('Save progress error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get completed courses
app.get('/api/completed-courses', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT course_title FROM completed_courses WHERE user_id = $1',
            [req.userId]
        );

        const courses = result.rows.map(row => row.course_title);
        res.json({ courses });
    } catch (error) {
        console.error('Get completed courses error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Mark course completed
app.post('/api/completed-courses', authenticateToken, async (req, res) => {
    const { courseTitle } = req.body;

    try {
        await pool.query(
            'INSERT INTO completed_courses (user_id, course_title) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [req.userId, courseTitle]
        );

        res.json({ message: 'Course marked as completed' });
    } catch (error) {
        console.error('Complete course error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get stats
app.get('/api/stats', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM user_stats WHERE user_id = $1', [req.userId]);

        if (result.rows.length === 0) {
            await pool.query('INSERT INTO user_stats (user_id) VALUES ($1)', [req.userId]);
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
app.put('/api/stats', authenticateToken, async (req, res) => {
    const { totalStudyTime, streak, longestStreak, lastStudyDate } = req.body;

    try {
        await pool.query(
            `UPDATE user_stats 
            SET total_study_time = $1, streak = $2, longest_streak = $3, last_study_date = $4, updated_at = CURRENT_TIMESTAMP
            WHERE user_id = $5`,
            [totalStudyTime, streak, longestStreak, lastStudyDate, req.userId]
        );

        res.json({ message: 'Stats updated' });
    } catch (error) {
        console.error('Update stats error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Toggle 2FA
app.put('/api/user/2fa', authenticateToken, async (req, res) => {
    const { enabled } = req.body;

    try {
        await pool.query(
            'UPDATE users SET two_factor_enabled = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
            [enabled, req.userId]
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

// TEMPORARY DEBUG ENDPOINT
app.get('/api/test-login', async (req, res) => {
    try {
        const envCheck = {
            hasDatabaseUrl: !!process.env.DATABASE_URL,
            hasJwtSecret: !!process.env.JWT_SECRET,
            nodeEnv: process.env.NODE_ENV
        };

        const bcrypt = require('bcryptjs');
        const testHash = await bcrypt.hash('testpass', 10);
        const bcryptWorks = !!testHash;

        const dbResult = await pool.query('SELECT NOW() as time');
        const dbConnected = !!dbResult.rows[0];

        const usersResult = await pool.query('SELECT COUNT(*) as count FROM users');
        const usersCount = usersResult.rows[0].count;

        res.json({
            success: true,
            environment: envCheck,
            bcrypt_working: bcryptWorks,
            database_connected: dbConnected,
            users_table_exists: true,
            users_count: usersCount,
            message: 'All systems operational!'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            stack: error.stack,
            message: 'Something is broken'
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
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
}
