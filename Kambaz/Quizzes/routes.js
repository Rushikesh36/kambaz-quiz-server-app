import QuizzesDao from "./dao.js";
import QuestionsDao from "../Questions/dao.js";
import QuizAttemptsDao from "../QuizAttempts/dao.js";

export default function QuizzesRoutes(app) {
    const quizzesDao = QuizzesDao();
    const questionsDao = QuestionsDao();
    const attemptsDao = QuizAttemptsDao();

    // ============ QUIZ CRUD OPERATIONS ============

    // GET /api/courses/:courseId/quizzes - Get all quizzes for a course
    app.get("/api/courses/:courseId/quizzes", async (req, res) => {
        try {
            const { courseId } = req.params;
            const quizzes = await quizzesDao.findQuizzesForCourse(courseId);
            res.json(quizzes);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // GET /api/quizzes/:quizId - Get a specific quiz
    app.get("/api/quizzes/:quizId", async (req, res) => {
        try {
            const { quizId } = req.params;
            const quiz = await quizzesDao.findQuizById(quizId);
            if (!quiz) {
                res.status(404).json({ error: "Quiz not found" });
                return;
            }
            
            // Recalculate and update quiz points from questions
            const questions = await questionsDao.findQuestionsForQuiz(quizId);
            const totalPoints = questions.reduce((sum, q) => sum + (q.points || 0), 0);
            const questionCount = questions.length;
            if (quiz.points !== totalPoints || quiz.questionCount !== questionCount) {
                await quizzesDao.updateQuiz(quizId, { points: totalPoints, questionCount });
                quiz.points = totalPoints;
                quiz.questionCount = questionCount;
            }
            
            res.json(quiz);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // POST /api/courses/:courseId/quizzes - Create a new quiz
    app.post("/api/courses/:courseId/quizzes", async (req, res) => {
        try {
            const { courseId } = req.params;
            const quiz = { ...req.body, course: courseId };
            const created = await quizzesDao.createQuiz(quiz);
            res.json(created);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // PUT /api/quizzes/:quizId - Update a quiz
    app.put("/api/quizzes/:quizId", async (req, res) => {
        try {
            const { quizId } = req.params;
            const updated = await quizzesDao.updateQuiz(quizId, req.body);
            if (!updated) {
                res.status(404).json({ error: "Quiz not found" });
                return;
            }
            res.json(updated);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // DELETE /api/quizzes/:quizId - Delete a quiz
    app.delete("/api/quizzes/:quizId", async (req, res) => {
        try {
            const { quizId } = req.params;
            // Delete associated questions and attempts
            await questionsDao.deleteQuestionsForQuiz(quizId);
            await attemptsDao.deleteAttemptsForQuiz(quizId);
            const status = await quizzesDao.deleteQuiz(quizId);
            res.json(status);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // PUT /api/quizzes/:quizId/publish - Publish/unpublish a quiz
    app.put("/api/quizzes/:quizId/publish", async (req, res) => {
        try {
            const { quizId } = req.params;
            const { published } = req.body;
            const updated = await quizzesDao.publishQuiz(quizId, published);
            res.json(updated);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // ============ QUESTION OPERATIONS ============

    // GET /api/quizzes/:quizId/questions - Get all questions for a quiz
    app.get("/api/quizzes/:quizId/questions", async (req, res) => {
        try {
            const { quizId } = req.params;
            const questions = await questionsDao.findQuestionsForQuiz(quizId);
            res.json(questions);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // POST /api/quizzes/:quizId/questions - Create a new question
    app.post("/api/quizzes/:quizId/questions", async (req, res) => {
        try {
            const { quizId } = req.params;
            const question = { ...req.body, quiz: quizId };
            const created = await questionsDao.createQuestion(question);
            
            // Update quiz points total
            const questions = await questionsDao.findQuestionsForQuiz(quizId);
            const totalPoints = questions.reduce((sum, q) => sum + (q.points || 0), 0);
            await quizzesDao.updateQuiz(quizId, { points: totalPoints, questionCount: questions.length });
            
            res.json(created);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // PUT /api/questions/:questionId - Update a question
    app.put("/api/questions/:questionId", async (req, res) => {
        try {
            const { questionId } = req.params;
            const updated = await questionsDao.updateQuestion(questionId, req.body);
            if (!updated) {
                res.status(404).json({ error: "Question not found" });
                return;
            }
            
            // Update quiz points total
            const questions = await questionsDao.findQuestionsForQuiz(updated.quiz);
            const totalPoints = questions.reduce((sum, q) => sum + (q.points || 0), 0);
            await quizzesDao.updateQuiz(updated.quiz, { points: totalPoints, questionCount: questions.length });
            
            res.json(updated);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // DELETE /api/questions/:questionId - Delete a question
    app.delete("/api/questions/:questionId", async (req, res) => {
        try {
            const { questionId } = req.params;
            const question = await questionsDao.findQuestionById(questionId);
            const quizId = question?.quiz;
            
            const status = await questionsDao.deleteQuestion(questionId);
            
            // Update quiz points total
            if (quizId) {
                const questions = await questionsDao.findQuestionsForQuiz(quizId);
                const totalPoints = questions.reduce((sum, q) => sum + (q.points || 0), 0);
                await quizzesDao.updateQuiz(quizId, { points: totalPoints, questionCount: questions.length });
            }
            
            res.json(status);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // ============ STUDENT QUIZ ATTEMPT OPERATIONS ============

    // GET /api/quizzes/:quizId/attempts - Get all attempts for a quiz (Faculty)
    app.get("/api/quizzes/:quizId/attempts", async (req, res) => {
        try {
            const { quizId } = req.params;
            const attempts = await attemptsDao.findAttemptsForQuiz(quizId);
            res.json(attempts);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // GET /api/quizzes/:quizId/attempts/user/:userId - Get user's attempts for a quiz
    app.get("/api/quizzes/:quizId/attempts/user/:userId", async (req, res) => {
        try {
            const { quizId, userId } = req.params;
            const attempts = await attemptsDao.findAttemptsForUser(quizId, userId);
            res.json(attempts);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

   // POST /api/quizzes/:quizId/attempts - Start a new quiz attempt
app.post("/api/quizzes/:quizId/attempts", async (req, res) => {
    try {
        const { quizId } = req.params;
        const { userId } = req.body;
        
        // IMPORTANT: Only count COMPLETED attempts
        const completedAttempts = await attemptsDao.findAttemptsForUser(quizId, userId);
        const attemptCount = completedAttempts.filter(a => a.isComplete).length;  // ← ADD THIS FILTER
        
        const quiz = await quizzesDao.findQuizById(quizId);
        
        if (!quiz) {
            res.status(404).json({ error: "Quiz not found" });
            return;
        }
        
        // Check if user has exceeded COMPLETED attempts
        if (!quiz.multipleAttempts && attemptCount >= 1) {
            res.status(400).json({ error: "Maximum attempts reached" });
            return;
        }
        
        if (quiz.multipleAttempts && attemptCount >= quiz.howManyAttempts) {
            res.status(400).json({ error: "Maximum attempts reached" });
            return;
        }
        
        // Create new attempt
        const attempt = {
            quiz: quizId,
            user: userId,
            attemptNumber: attemptCount + 1,  // Based on completed attempts
            totalPoints: quiz.points,
            answers: [],
            isComplete: false
        };
        
        const created = await attemptsDao.createAttempt(attempt);
        res.json(created);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

    // PUT /api/attempts/:attemptId/answers - Save answer progress (not submitted)
    app.put("/api/attempts/:attemptId/answers", async (req, res) => {
        try {
            const { attemptId } = req.params;
            const { answers } = req.body;
            const updated = await attemptsDao.updateAttempt(attemptId, { answers });
            res.json(updated);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // POST /api/attempts/:attemptId/submit - Submit quiz attempt with grading
    app.post("/api/attempts/:attemptId/submit", async (req, res) => {
        try {
            const { attemptId } = req.params;
            const { answers } = req.body;
            
            const attempt = await attemptsDao.findAttemptById(attemptId);
            const questions = await questionsDao.findQuestionsForQuiz(attempt.quiz);
            
            // Grade the answers
            let totalScore = 0;
            const gradedAnswers = answers.map(answer => {
                const question = questions.find(q => q._id === answer.question);
                if (!question) return answer;
                
                let isCorrect = false;
                let pointsEarned = 0;
                
                if (question.type === "MULTIPLE_CHOICE") {
                    // Check if selected choice is correct
                    const selectedChoice = question.choices.find(
                        c => c.text === answer.answer
                    );
                    isCorrect = selectedChoice?.isCorrect || false;
                } else if (question.type === "TRUE_FALSE") {
                    // Compare boolean answer
                    isCorrect = answer.answer === question.correctAnswer;
                } else if (question.type === "FILL_IN_BLANK") {
                    // Check if all blanks are answered correctly
                    const userAnswers = Array.isArray(answer.answer) ? answer.answer : [answer.answer];
                    isCorrect = (question.blanks || []).every((blank, idx) => {
                        const userAnswer = String(userAnswers[idx] || "").toLowerCase().trim();
                        return blank.correctAnswers.some(
                            correctAns => correctAns.toLowerCase().trim() === userAnswer
                        );
                    });
                }
                
                if (isCorrect) {
                    pointsEarned = question.points;
                    totalScore += pointsEarned;
                }
                
                return {
                    ...answer,
                    isCorrect,
                    pointsEarned
                };
            });
            
            // Submit attempt with grade
            const submitted = await attemptsDao.submitAttempt(
                attemptId,
                gradedAnswers,
                totalScore
            );
            
            res.json(submitted);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // GET /api/attempts/:attemptId - Get a specific attempt
    app.get("/api/attempts/:attemptId", async (req, res) => {
        try {
            const { attemptId } = req.params;
            const attempt = await attemptsDao.findAttemptById(attemptId);
            if (!attempt) {
                res.status(404).json({ error: "Attempt not found" });
                return;
            }
            res.json(attempt);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
}