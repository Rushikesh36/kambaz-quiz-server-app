import mongoose from "mongoose";

// Sub-schema for answer choices (for multiple choice)
const answerChoiceSchema = new mongoose.Schema(
    {
        text: { type: String, required: true },
        isCorrect: { type: Boolean, default: false }
    },
    { _id: false }
);

// Sub-schema for fill-in-blank blanks
const blankSchema = new mongoose.Schema(
    {
        label: { type: String, required: true }, // e.g., "Blank 1", "Blank 2"
        correctAnswers: [{ type: String }] // Array of acceptable answers (case-insensitive)
    },
    { _id: false }
);

const questionSchema = new mongoose.Schema(
    {
        _id: String,
        quiz: { type: String, required: true, ref: "quizzes" },
        
        title: { type: String, default: "" },
        type: {
            type: String,
            enum: ["MULTIPLE_CHOICE", "TRUE_FALSE", "FILL_IN_BLANK"],
            required: true,
            default: "MULTIPLE_CHOICE"
        },
        points: { type: Number, default: 1 },
        question: { type: String, required: true }, // Question text (supports HTML)
        
        // For Multiple Choice
        choices: [answerChoiceSchema],
        
        // For Fill in Blank (new multi-blank support)
        blanks: [blankSchema],
        
        // For True/False
        correctAnswer: { type: Boolean }, // true or false
        
        // Order in quiz
        order: { type: Number, default: 0 },
        
        // Metadata
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now }
    },
    { collection: "questions" }
);

export default questionSchema;