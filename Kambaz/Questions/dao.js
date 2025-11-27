import { v4 as uuidv4 } from "uuid";
import QuestionsModel from "./model.js";

export default function QuestionsDao() {
    async function findQuestionsForQuiz(quizId) {
        return QuestionsModel.find({ quiz: quizId }).sort({ order: 1 });
    }

    async function findQuestionById(questionId) {
        return QuestionsModel.findById(questionId);
    }

    async function createQuestion(question) {
        const id = question._id || uuidv4();
        const doc = { 
            ...question, 
            _id: id,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        const created = await QuestionsModel.create(doc);
        return created;
    }

    async function deleteQuestion(questionId) {
        return QuestionsModel.deleteOne({ _id: questionId });
    }

    async function updateQuestion(questionId, questionUpdates) {
        const { _id, ...rest } = questionUpdates;
        return QuestionsModel.findOneAndUpdate(
            { _id: questionId },
            { $set: { ...rest, updatedAt: new Date() } },
            { new: true }
        );
    }

    async function deleteQuestionsForQuiz(quizId) {
        return QuestionsModel.deleteMany({ quiz: quizId });
    }

    return {
        findQuestionsForQuiz,
        findQuestionById,
        createQuestion,
        deleteQuestion,
        updateQuestion,
        deleteQuestionsForQuiz,
    };
}