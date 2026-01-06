const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const Groq = require('groq-sdk');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://machine-learning-quiz-one.vercel.app',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Additional CORS headers
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (corsOptions.origin.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Initialize Groq
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// User Schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema);

// Submission Schema
const submissionSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  answers: [{
    question: String,
    userAnswer: String,
    correctAnswer: String,
    score: Number
  }],
  totalScore: {
    type: Number,
    required: true
  },
  maxScore: {
    type: Number,
    default: 50
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

const Submission = mongoose.model('Submission', submissionSchema);

// Questions and Answers
const questionsData = [
  {
    question: "What is Machine Learning?",
    answer: "Machine Learning is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed. It uses algorithms to analyze data, identify patterns, and make decisions with minimal human intervention."
  },
  {
    question: "What are the three main types of Machine Learning?",
    answer: "The three main types are Supervised Learning (learning from labeled data), Unsupervised Learning (finding patterns in unlabeled data), and Reinforcement Learning (learning through trial and error with rewards and penalties)."
  },
  {
    question: "What is the difference between classification and regression?",
    answer: "Classification predicts discrete categorical outputs (like spam or not spam), while regression predicts continuous numerical values (like house prices or temperature)."
  },
  {
    question: "What is overfitting in Machine Learning?",
    answer: "Overfitting occurs when a model learns the training data too well, including its noise and outliers, resulting in poor performance on new, unseen data. The model becomes too complex and fails to generalize."
  },
  {
    question: "What is a training set and a test set?",
    answer: "A training set is the data used to train the machine learning model, while a test set is separate data used to evaluate the model's performance and ensure it can generalize to new, unseen examples."
  },
  {
    question: "What is a feature in Machine Learning?",
    answer: "A feature is an individual measurable property or characteristic of the data being analyzed. Features are the input variables used by the model to make predictions. For example, in house price prediction, features could include size, location, and number of bedrooms."
  },
  {
    question: "What is the purpose of cross-validation?",
    answer: "Cross-validation is a technique to assess model performance by dividing data into multiple subsets, training on some and testing on others repeatedly. This helps ensure the model generalizes well and isn't overfitting to a particular train-test split."
  },
  {
    question: "What is a neural network?",
    answer: "A neural network is a computational model inspired by biological neurons in the brain. It consists of interconnected layers of nodes (neurons) that process information through weighted connections, enabling it to learn complex patterns in data."
  },
  {
    question: "What is the difference between supervised and unsupervised learning?",
    answer: "Supervised learning uses labeled data where the correct output is known, training the model to predict outcomes. Unsupervised learning works with unlabeled data, finding hidden patterns and structures without predefined answers."
  },
  {
    question: "What is gradient descent?",
    answer: "Gradient descent is an optimization algorithm used to minimize the loss function by iteratively adjusting model parameters in the direction of steepest descent. It helps the model find the best parameters that minimize prediction errors."
  }
];

// ============= ROUTES =============

// 1. SIGNUP Route
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    if (username.length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Username must be at least 3 characters long'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    const existingUser = await User.findOne({ username: username.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Username already taken. Please choose another.'
      });
    }

    const isAdmin = username.toLowerCase() === 'admin' && password === '123456';
    const newUser = new User({
      username: username.toLowerCase(),
      password,
      isAdmin
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      username: newUser.username,
      isAdmin: newUser.isAdmin
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during signup'
    });
  }
});

// 2. LOGIN Route
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    const user = await User.findOne({ username: username.toLowerCase() });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    res.json({
      success: true,
      message: 'Login successful!',
      username: user.username,
      isAdmin: user.isAdmin
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// 3. CHECK USERNAME Availability
app.post('/api/auth/check-username', async (req, res) => {
  try {
    const { username } = req.body;

    const existingUser = await User.findOne({ username: username.toLowerCase() });

    res.json({
      available: !existingUser,
      message: existingUser ? 'Username already taken' : 'Username available'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// 4. GET QUESTIONS
app.get('/api/questions', (req, res) => {
  const questions = questionsData.map((q, index) => ({
    id: index,
    question: q.question
  }));
  res.json(questions);
});

// 5. SUBMIT QUIZ - WITH GROQ API
app.post('/api/submit', async (req, res) => {
  try {
    const { username, answers } = req.body;

    if (!username || !answers || answers.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid submission data'
      });
    }

    const scoredAnswers = [];
    let totalScore = 0;

    // Evaluate each answer using Groq AI
    for (let i = 0; i < answers.length; i++) {
      const userAnswer = answers[i];
      const correctAnswer = questionsData[i].answer;
      const question = questionsData[i].question;

      const prompt = `You are an educational evaluator. Compare the following answers and rate the user's answer on a scale of 0 to 5 based on how well it matches the correct answer.

Question: ${question}

Correct Answer: ${correctAnswer}

User's Answer: ${userAnswer}

If User's answer is blank or too short (less than 5 characters) then assign 0 marks immediately and move on.

Scoring criteria:
- 5: Excellent, complete and accurate answer
- 4: Good answer with minor gaps
- 3: Satisfactory answer covering main points
- 2: Partial answer with significant gaps
- 1: Poor answer with minimal relevance
- 0: Completely incorrect or no answer

Provide ONLY a single number between 0 and 5 as the score. No explanation needed, just the number.`;

      try {
        const chatCompletion = await groq.chat.completions.create({
          messages: [
            {
              role: "user",
              content: prompt
            }
          ],
          model: "llama-3.3-70b-versatile",
          temperature: 0.5,
          max_tokens: 10,
          top_p: 1,
          stream: false
        });

        const scoreText = chatCompletion.choices[0]?.message?.content?.trim() || "2.5";
        let score = parseFloat(scoreText);

        if (isNaN(score) || score < 0 || score > 5) {
          console.log(`Invalid score for Q${i + 1}: ${scoreText}, using 2.5`);
          score = 2.5;
        }

        score = Math.min(5, Math.max(0, score));
        score = Math.round(score * 10) / 10;

        scoredAnswers.push({
          question,
          userAnswer,
          correctAnswer,
          score
        });

        totalScore += score;

        console.log(`✓ Question ${i + 1} scored: ${score}/5`);

      } catch (error) {
        console.error('Groq API error for question', i + 1, ':', error.message);
        scoredAnswers.push({
          question,
          userAnswer,
          correctAnswer,
          score: 2.5
        });
        totalScore += 2.5;
      }
    }

    totalScore = Math.round(totalScore * 10) / 10;

    const submission = new Submission({
      username,
      answers: scoredAnswers,
      totalScore: totalScore,
      maxScore: questionsData.length * 5
    });

    await submission.save();

    console.log(`✅ Quiz submitted by ${username} - Score: ${totalScore}/${submission.maxScore}`);

    res.json({
      success: true,
      totalScore: submission.totalScore,
      maxScore: submission.maxScore,
      answers: scoredAnswers,
      submissionId: submission._id
    });

  } catch (error) {
    console.error('Submit error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit quiz. Please try again.'
    });
  }
});

// 6. GET ALL USERS (Admin only)
app.get('/api/admin/users', async (req, res) => {
  try {
    const submissions = await Submission.find().sort({ submittedAt: -1 });
    const usernames = [...new Set(submissions.map(s => s.username))];
    const filteredUsernames = usernames.filter(u => u !== 'admin');
    res.json(filteredUsernames);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// 7. GET USER SUBMISSIONS (Admin only)
app.get('/api/admin/submissions/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const submissions = await Submission.find({ username }).sort({ submittedAt: -1 });
    res.json(submissions);
  } catch (error) {
    console.error('Get submissions error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// 8. GET USER'S OWN SUBMISSION HISTORY
app.get('/api/submissions/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const submissions = await Submission.find({ username })
      .sort({ submittedAt: -1 })
      .select('totalScore maxScore submittedAt');
    res.json(submissions);
  } catch (error) {
    console.error('Get user submissions error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Server is running with Groq API',
    timestamp: new Date().toISOString()
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════╗
║   🚀 Server Started Successfully!     ║
║   📡 Port: ${PORT}                        ║
║   🌐 URL: http://localhost:${PORT}     ║
║   🤖 AI: Groq API (Llama 3.3 70B)     ║
╚═══════════════════════════════════════╝
  `);
});
