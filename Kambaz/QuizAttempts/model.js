import mongoose from "mongoose";
import schema from "./schema.js";

const QuizAttemptsModel = mongoose.model("quizAttempts", schema);
export default QuizAttemptsModel;