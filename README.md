# Machine Learning Quiz App 🎯

A full-stack **Machine Learning quiz** web app built with **React (Vite)** frontend, **Node.js + Express** backend, **MongoDB** for storage and **Groq LLM API** for automatic subjective answer evaluation (0–5 score per question).

---

## Features

- User authentication (signup / login with username & password).
- Special **admin account**:
  - username: `admin`
  - password: `123456`
- 10 subjective questions on **Introduction to Machine Learning**.
- 20-minute countdown timer with auto-submit.
- Each answer is scored **0–5** using Groq's LLM based on a model answer.
- Total score and per-question scores stored in MongoDB.
- User can view latest quiz result.
- Admin can:
  - See list of users who submitted quizzes.
  - View all past submissions of any user with detailed answers and scores.
- Fully responsive UI.

---

## Tech Stack

**Frontend**

- React (Vite)
- React Router v6
- Fetch API

**Backend**

- Node.js
- Express
- Mongoose (MongoDB)
- Groq SDK (LLM scoring)

**Database**

- MongoDB Atlas

**Deployment**

- Backend: Render
- Frontend: Vercel

---

## Project Structure

```bash
machine-learning-quiz/
├── backend/
│   ├── server.js
│   ├── package.json
│   └── .env            # not committed
└── frontend/
    ├── index.html
    ├── vite.config.js
    └── src/
        ├── App.jsx
        ├── App.css
        ├── index.jsx
        └── components/
            ├── Login.jsx
            ├── Quiz.jsx
            ├── Results.jsx
            ├── AdminDashboard.jsx
            └── UserSubmissions.jsx
```


================================================================================
                    MACHINE LEARNING QUIZ APP - SETUP GUIDE
================================================================================

--------------------------------------------------------------------------------
PREREQUISITES
--------------------------------------------------------------------------------

1. Node.js (LTS recommended - v18 or higher)
   Download from: https://nodejs.org/

2. npm or yarn (comes with Node.js)
   Check version: npm -v

3. MongoDB Atlas account (Free tier available)
   Sign up at: https://www.mongodb.com/cloud/atlas

4. Groq API key (Free tier available)
   Get API key from: https://console.groq.com/keys


================================================================================
                              USAGE FLOW
================================================================================

--------------------------------------------------------------------------------
USER FLOW
--------------------------------------------------------------------------------

STEP 1: SIGN UP
  • Click on "Sign Up" button
  • Enter username (minimum 3 characters)
  • Enter password (minimum 6 characters)
  • Confirm password
  • Click "Sign Up"
  • Account created successfully!

STEP 2: LOGIN
  • Enter your username
  • Enter your password
  • Click "Login"
  • Redirected to Quiz page

STEP 3: START QUIZ
  • Click "Start Quiz" button
  • Timer starts automatically (20 minutes countdown)
  • Timer is displayed at the top right corner
  • 10 subjective questions are shown one by one

STEP 4: ANSWER QUESTIONS
  • Read the question carefully
  • Type your answer in the text area
  • Click "Next" to move to next question
  • Click "Previous" to go back to previous question
  • You can navigate between questions freely
  • Question indicators at bottom show:
    - Current question (highlighted in blue)
    - Answered questions (green)
    - Unanswered questions (gray)

STEP 5: TIMER & AUTO-SUBMIT
  • Timer counts down from 20:00 to 00:00
  • When 1 minute remaining, timer turns red and pulses
  • When timer reaches 00:00, quiz auto-submits
  • You can manually submit before timer ends by clicking "Submit Quiz"

STEP 6: SUBMISSION PROCESS
  • After clicking "Submit Quiz":
    - Confirmation dialog appears if any questions unanswered
    - All answers sent to backend server
    - Backend calls Groq LLM AI to evaluate each answer
    - Each answer scored on scale of 0 to 5
    - Scoring based on comparison with model answer
    - Total score calculated (max 50 points)
    - All data saved to MongoDB database

STEP 7: VIEW RESULTS
  • Automatically redirected to Results page
  • Results page displays:
    
    SCORE OVERVIEW:
    - Circular score indicator with percentage
    - Total score (e.g., 37.5 / 50)
    - Performance category:
      * Excellent (≥80%) - Green
      * Good (≥60%) - Blue
      * Fair (≥40%) - Yellow
      * Keep Practicing (<40%) - Red
    - Number of questions attempted
    - Submission date and time
    
    DETAILED RESULTS (Toggle):
    - Click "Show Detailed Results" to expand
    - For each question:
      * Question number and text
      * Your answer
      * Model/Correct answer
      * Score received (0-5)
      * Color-coded score badge:
        - Green (4-5): Excellent
        - Yellow (2.5-3.5): Medium
        - Red (0-2): Low
      * Progress bar showing score percentage
    
    ACTIONS:
    - "Retake Quiz" button - Start new attempt
    - "Logout" button - Return to login page


--------------------------------------------------------------------------------
ADMIN FLOW
--------------------------------------------------------------------------------

STEP 1: ADMIN LOGIN
  • Use special admin credentials
  • Click "Login"
  • Automatically redirected to Admin Dashboard

STEP 2: ADMIN DASHBOARD
  • Dashboard displays:
    
    STATISTICS:
    - Total number of users who have submitted quizzes
    - User icon with count
    
    USERS TABLE:
    - Serial number (#)
    - Username with avatar (first letter of username)
    - "View Submissions" button for each user
    
    NOTE:
    - Admin's own submissions are excluded from list
    - Only users with at least one submission shown

STEP 3: VIEW USER SUBMISSIONS
  • Click "View Submissions" button next to any username
  • Redirected to User Submissions page
  • Page header shows:
    - "Submissions for [username]"
    - Total number of submissions
    - "Back to Dashboard" button

STEP 4: SUBMISSIONS LIST
  • Each submission card displays:
    
    SUBMISSION INFO:
    - Attempt number (e.g., "Attempt #3")
    - Submission date (e.g., "1/6/2026")
    - Submission time (e.g., "11:30:45 PM")
    - Score (e.g., "37.5 / 50")
    - Percentage (e.g., "75%")
    - Number of questions (always 10)
    
    VISUAL INDICATORS:
    - Color-coded percentage badge:
      * Green (≥80%): Excellent
      * Blue (≥60%): Good  
      * Yellow (≥40%): Fair
      * Red (<40%): Needs improvement
    
    ACTIONS:
    - "View Details" button to see complete submission

STEP 5: VIEW DETAILED SUBMISSION
  • Click "View Details" button
  • Modal popup opens showing:
    
    SUMMARY SECTION:
    - Total score
    - Submission date and time
    
    QUESTION-BY-QUESTION BREAKDOWN:
    For each of 10 questions:
    
    - Question number (e.g., "Question 1")
    - Question text
    - Score badge (0-5 out of 5)
      * High (4-5): Green badge
      * Medium (2.5-3.5): Yellow badge
      * Low (0-2): Red badge
    
    - Side-by-side comparison:
      LEFT SIDE (Blue background):
      - "User's Answer"
      - Actual text user submitted
      
      RIGHT SIDE (Green background):
      - "Model Answer"
      - Correct/Expected answer
    
    - If user didn't answer: Shows "No answer provided"
    
    NAVIGATION:
    - Close button (X) at top right
    - Click outside modal to close
    - Scroll to view all 10 questions

STEP 6: NAVIGATION OPTIONS
  • From User Submissions page:
    - "Back to Dashboard" - Return to admin dashboard
  
  • From Admin Dashboard:
    - "Logout" button - Return to login page
    - Click any other user to view their submissions


================================================================================
                        KEY FEATURES SUMMARY
================================================================================

FOR USERS:
  ✓ Secure authentication with username/password
  ✓ 20-minute timed quiz with visible countdown
  ✓ 10 subjective questions on Machine Learning
  ✓ Ability to navigate between questions freely
  ✓ Visual indicators for answered/unanswered questions
  ✓ Auto-submit when timer expires
  ✓ AI-powered scoring (0-5 per question)
  ✓ Instant results with detailed breakdown
  ✓ Option to retake quiz multiple times

FOR ADMIN:
  ✓ Special admin account access
  ✓ View all registered users
  ✓ See total submission count
  ✓ Access any user's submission history
  ✓ View detailed answers and scores
  ✓ Compare user answers with model answers
  ✓ Track user performance over multiple attempts


================================================================================
                          SCORING SYSTEM
================================================================================

INDIVIDUAL QUESTION SCORING (by Groq AI):
  5 points - Excellent, complete and accurate answer
  4 points - Good answer with minor gaps
  3 points - Satisfactory answer covering main points
  2 points - Partial answer with significant gaps
  1 point  - Poor answer with minimal relevance
  0 points - Completely incorrect or no answer

TOTAL SCORE:
  • Maximum: 50 points (10 questions × 5 points)
  • Displayed as: [Score] / 50 and percentage

PERFORMANCE CATEGORIES:
  • 80-100% (40-50 points) → Excellent 🎉
  • 60-79%  (30-39 points) → Good Job 👍
  • 40-59%  (20-29 points) → Fair 😊
  • 0-39%   (0-19 points)  → Keep Practicing 📚


================================================================================
                        TECHNICAL NOTES
================================================================================

AUTOMATIC FEATURES:
  • Timer starts automatically when quiz begins
  • Auto-submit when timer reaches 00:00
  • Real-time timer updates every second
  • Automatic scoring via AI (no manual grading)
  • Instant result calculation and display

SECURITY FEATURES:
  • Username uniqueness check
  • Minimum length requirements for credentials
  • Admin-only routes protected
  • User authentication for all quiz routes

DATA PERSISTENCE:
  • All user accounts saved in MongoDB
  • All quiz submissions permanently stored
  • Complete answer history maintained
  • No data loss between sessions


================================================================================
                              AUTHOR
================================================================================
BHUWAN CHANDRA PANDEY
