import mongoose from "mongoose";

// Sub-schema for individual question answers
const questionAnswerSchema = new mongoose.Schema(
    {
        question: { type: String, required: true, ref: "questions" },
        answer: mongoose.Schema.Types.Mixed, // Can be string, boolean, or array
        isCorrect: { type: Boolean },
        pointsEarned: { type: Number, default: 0 }
    },
    { _id: false }
);

const quizAttemptSchema = new mongoose.Schema(
    {
        _id: String,
        quiz: { type: String, required: true, ref: "quizzes" },
        user: { type: String, required: true, ref: "users" },
        
        // Attempt tracking
        attemptNumber: { type: Number, required: true },
        
        // Answers
        answers: [questionAnswerSchema],
        
        // Scoring
        score: { type: Number, default: 0 },
        totalPoints: { type: Number, required: true },
        
        // Timing
        startedAt: { type: Date, default: Date.now },
        submittedAt: { type: Date },
        
        // Status
        isComplete: { type: Boolean, default: false }
    },
    { collection: "quizAttempts" }
);

// Compound index for finding user attempts for a specific quiz
quizAttemptSchema.index({ quiz: 1, user: 1, attemptNumber: 1 });

export default quizAttemptSchema;