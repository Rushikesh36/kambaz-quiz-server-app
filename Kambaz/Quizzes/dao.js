import { v4 as uuidv4 } from "uuid";
import QuizzesModel from "./model.js";

export default function QuizzesDao() {
    async function findQuizzesForCourse(courseId) {
        return QuizzesModel.find({ course: courseId }).sort({ availableDate: 1 });
    }

    async function findQuizById(quizId) {
        return QuizzesModel.findById(quizId);
    }

    async function createQuiz(quiz) {
        const id = quiz._id || uuidv4();
        const doc = { 
            ...quiz, 
            _id: id,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        const created = await QuizzesModel.create(doc);
        return created;
    }

    async function deleteQuiz(quizId) {
        return QuizzesModel.deleteOne({ _id: quizId });
    }

    async function updateQuiz(quizId, quizUpdates) {
        const { _id, ...rest } = quizUpdates;
        return QuizzesModel.findOneAndUpdate(
            { _id: quizId },
            { $set: { ...rest, updatedAt: new Date() } },
            { new: true }
        );
    }

    async function publishQuiz(quizId, published) {
        return QuizzesModel.findOneAndUpdate(
            { _id: quizId },
            { $set: { published, updatedAt: new Date() } },
            { new: true }
        );
    }

    return {
        findQuizzesForCourse,
        findQuizById,
        createQuiz,
        deleteQuiz,
        updateQuiz,
        publishQuiz,
    };
}