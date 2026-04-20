const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cron = require('node-cron');
const path = require('path');
const connectDB = require('./config/db');

// --- Swagger & API Integration Imports ---
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// --- SWAGGER CONFIGURATION (Assignment 5 & 6) ---
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ExamDojo API Documentation',
      version: '1.0.0',
      description: 'Full Backend Documentation: Includes JWT Auth and Third-Party Weather API Integration.',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}`,
        description: 'Development Server',
      },
    ],
    // Direct Path Definitions to prevent YAML Spacing Errors
    paths: {
      "/api/auth/register": {
        "post": {
          "tags": ["Authentication"],
          "summary": "Register a new user",
          "responses": { "201": { "description": "User created successfully" } }
        }
      },
      "/api/auth/login": {
        "post": {
          "tags": ["Authentication"],
          "summary": "User Login",
          "responses": { "200": { "description": "Login successful" } }
        }
      },
      "/api/auth/me": {
        "get": {
          "tags": ["Authentication"],
          "summary": "Get current user profile",
          "security": [{ "bearerAuth": [] }],
          "responses": { "200": { "description": "Success" } }
        }
      },
      "/api/public/weather/{city}": {
        "get": {
          "tags": ["Third-Party API Integration"],
          "summary": "Get Weather Data (Assignment 6)",
          "parameters": [
            {
              "name": "city",
              "in": "path",
              "required": true,
              "description": "Name of the city to get weather for",
              "schema": { "type": "string", "default": "Pune" }
            }
          ],
          "responses": { "200": { "description": "Data fetched from OpenWeatherMap" } }
        }
      }
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: [], // No need to scan files as paths are defined above
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

// --- MIDDLEWARE ---
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// --- MOUNT SWAGGER UI ---
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// --- IMPORT ROUTES ---
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const roadmapRoutes = require('./routes/roadmapRoutes');
const questionRoutes = require('./routes/questionRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const publicRoutes = require('./routes/publicRoutes');
const streakRoutes = require('./routes/streakRoutes');
const achievementRoutes = require('./routes/achievementRoutes');
const dailyQuestRoutes = require('./routes/dailyQuestRoutes');

// --- MOUNT ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/streaks', streakRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/daily-quests', dailyQuestRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// --- ERROR HANDLING ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server Error'
  });
});

// --- CRON JOBS ---
const UserStreak = require('./models/UserStreak');
cron.schedule('0 0 * * *', async () => {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    await UserStreak.updateMany(
      { lastActivityDate: { $lt: yesterday } },
      { $set: { currentStreak: 0 } }
    );
    console.log('Daily streak check completed');
  } catch (error) {
    console.error('Streak reset error:', error);
  }
});

// --- SERVER START ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server is firing on port ${PORT}`);
  console.log(`📄 Swagger Docs: http://localhost:${PORT}/api-docs`);
  console.log(`☁️ Weather API Test: http://localhost:${PORT}/api/public/weather/Pune\n`);
});

module.exports = app;