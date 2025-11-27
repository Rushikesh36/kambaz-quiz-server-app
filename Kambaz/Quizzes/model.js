import mongoose from "mongoose";
import schema from "./schema.js";

const QuizzesModel = mongoose.model("quizzes", schema);
export default QuizzesModel;