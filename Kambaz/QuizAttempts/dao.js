import { v4 as uuidv4 } from "uuid";
import QuizAttemptsModel from "./model.js";

export default function QuizAttemptsDao() {
    async function findAttemptsForQuiz(quizId) {
        return QuizAttemptsModel.find({ quiz: quizId })
            .populate("user")
            .sort({ startedAt: -1 });
    }

    async function findAttemptsForUser(quizId, userId) {
        return QuizAttemptsModel.find({ quiz: quizId, user: userId })
            .sort({ attemptNumber: -1 });
    }

    async function findAttemptById(attemptId) {
        return QuizAttemptsModel.findById(attemptId);
    }

    async function getLatestAttempt(quizId, userId) {
        return QuizAttemptsModel.findOne({ quiz: quizId, user: userId })
            .sort({ attemptNumber: -1 });
    }

    async function getAttemptCount(quizId, userId) {
        return QuizAttemptsModel.countDocuments({ quiz: quizId, user: userId });
    }

    async function createAttempt(attempt) {
        const id = attempt._id || uuidv4();
        const doc = { 
            ...attempt, 
            _id: id,
            startedAt: new Date()
        };
        const created = await QuizAttemptsModel.create(doc);
        return created;
    }

    async function updateAttempt(attemptId, attemptUpdates) {
        const { _id, ...rest } = attemptUpdates;
        return QuizAttemptsModel.findOneAndUpdate(
            { _id: attemptId },
            { $set: rest },
            { new: true }
        );
    }

    async function submitAttempt(attemptId, answers, score) {
        return QuizAttemptsModel.findOneAndUpdate(
            { _id: attemptId },
            { 
                $set: { 
                    answers, 
                    score, 
                    isComplete: true,
                    submittedAt: new Date()
                } 
            },
            { new: true }
        );
    }

    async function deleteAttemptsForQuiz(quizId) {
        return QuizAttemptsModel.deleteMany({ quiz: quizId });
    }

    return {
        findAttemptsForQuiz,
        findAttemptsForUser,
        findAttemptById,
        getLatestAttempt,
        getAttemptCount,
        createAttempt,
        updateAttempt,
        submitAttempt,
        deleteAttemptsForQuiz,
    };
}