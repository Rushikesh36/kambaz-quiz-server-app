import mongoose from "mongoose";

const quizSchema = new mongoose.Schema(
    {
        _id: String,
        title: { type: String, required: true, default: "Unnamed Quiz" },
        description: { type: String, default: "" },
        course: { type: String, required: true },
        
        // Quiz Configuration
        quizType: {
            type: String,
            enum: ["GRADED_QUIZ", "PRACTICE_QUIZ", "GRADED_SURVEY", "UNGRADED_SURVEY"],
            default: "GRADED_QUIZ"
        },
        points: { type: Number, default: 0 }, // Sum of all question points
        questionCount: { type: Number, default: 0 }, // Number of questions
        assignmentGroup: {
            type: String,
            enum: ["QUIZZES", "EXAMS", "ASSIGNMENTS", "PROJECT"],
            default: "QUIZZES"
        },
        shuffleAnswers: { type: Boolean, default: true },
        shuffleQuestions: { type: Boolean, default: false },
        timeLimit: { type: Number, default: 20 }, // in minutes
        multipleAttempts: { type: Boolean, default: false },
        howManyAttempts: { type: Number, default: 1 },
        showCorrectAnswers: { type: String, default: "IMMEDIATELY" },
        accessCode: { type: String, default: "" },
        oneQuestionAtATime: { type: Boolean, default: true },
        webcamRequired: { type: Boolean, default: false },
        lockQuestionsAfterAnswering: { type: Boolean, default: false },
        
        // Dates
        dueDate: { type: String, default: "" },
        availableDate: { type: String, default: "" },
        untilDate: { type: String, default: "" },
        
        // Publishing
        published: { type: Boolean, default: false },
        
        // Metadata
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now }
    },
    { collection: "quizzes" }
);

export default quizSchema;