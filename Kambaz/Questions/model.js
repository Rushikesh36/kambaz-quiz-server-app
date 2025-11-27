import mongoose from "mongoose";
import schema from "./schema.js";

const QuestionsModel = mongoose.model("questions", schema);
export default QuestionsModel;