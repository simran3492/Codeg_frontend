import React, { useState, useEffect,useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import axiosClient from '../utils/axiosClient';
import StyledButton from '../components copy/ui/StyledButton';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';

import AnswerCard from '../components/question/AnswerCard';
import QuestionBody from '../components/question/QuestionBody';
import AnswerForm from '../components/question/AnswerForm';
import QuestionHeader from '../components/question/QuestionHeader';

import AOS from 'aos';
import 'aos/dist/aos.css'





// Main detail page component
const QuestionDetailPage = () => {
    const [question, setQuestion] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams(); // Gets the ':id' from the URL

    const [answerContent, setAnswerContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [upvotingId, setUpvotingId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    const navigate = useNavigate();


    const currentUserId = useSelector((state) => state.auth.user._id);


     useEffect(() => {
        AOS.init({
            duration: 800, // Animation duration in ms
            once: false,     // Whether animation should happen only once
            offset: 50,     // Offset (in px) from the original trigger point
        });
    }, []);



  const fetchQuestion = useCallback(async () => {
        try {
            if (!loading) setLoading(true);
            const response = await axiosClient.get(`/discussion/getQuestion/${id}`);
            setQuestion(response.data);
            // Refresh AOS after data is loaded to detect new elements
            setTimeout(() => AOS.refresh(), 500);
        } catch (err) {
            console.error("Error fetching question:", err);
            setError("Failed to load the question.");
        } finally {
            setLoading(false);
        }
    }, [id, loading]);

    useEffect(() => {
        fetchQuestion();
    }, [id]);

    const handlePostAnswer = async () => {
        if (!answerContent.trim()) {
            setError('Answer content cannot be empty.');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            await axiosClient.post(
                `/discussion/answer/${id}`,
                { content: answerContent }
            );


            setAnswerContent('');
            await fetchQuestion();
            AOS.refresh();
        } catch (err) {
            console.error("Error posting answer:", err);
            setError(err.response?.data?.msg || 'An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpvote = async (answerId) => {


        setUpvotingId(answerId);

        try {
            const res = await axiosClient.patch(
                `discussion/${answerId}/upvote`,
                {}
            );


            setQuestion(prevQuestion => ({
                ...prevQuestion,
                answers: prevQuestion.answers.map(ans =>
                    ans._id === answerId
                        ? { ...ans, upvotes: res.data.upvotes, upvoted_by: res.data.upvoted_by }
                        : ans
                ),
            }));


        } catch (err) {
            console.error("Upvote error:", err);

            alert(err.response?.data?.msg || 'An error occurred.');
        } finally {
            setUpvotingId(null);
        }
    };

    const handleDeleteQuestion = async () => {
        if (!window.confirm("Are you sure you want to delete this entire question and all its answers? This cannot be undone.")) {
            return;
        }


        try {
            await axiosClient.delete(`/discussion/deleteQuestion/${id}`);
            // On success, redirect to the main discussion page
            navigate('/discussion');
        } catch (err) {
            console.error("Error deleting question:", err);
            alert(err.response?.data?.msg || "Could not delete the question.");
        }
    };


    const handleDeleteAnswer = async (answerId) => {
        if (!window.confirm("Are you sure you want to delete this answer?")) {
            return;
        }


        setDeletingId(answerId); // Set loading state for this specific button

        try {
            await axiosClient.delete(`/discussion/deleteAnswer/${answerId}`);

            // Update UI instantly by filtering out the deleted answer
            setQuestion(prev => ({
                ...prev,
                answers: prev.answers.filter(ans => ans._id !== answerId)
            }));

        } catch (err) {
            console.error("Error deleting answer:", err);
            alert(err.response?.data?.msg || "Could not delete the answer.");
        } finally {
            setDeletingId(null); // Reset loading state
        }
    };


    if (loading) {
        return <div className="flex h-screen items-center justify-center text-gray-500 dark:text-gray-400">Loading...</div>;
    }

    if (!question) {
        return <div className="p-8 text-center text-red-500">{error || 'Question not found.'}</div>;
    }



    const isQuestionAuthor = currentUserId && question.posted_by._id === currentUserId;

    
    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-pink-50 p-4 transition-colors dark:from-slate-900 dark:via-gray-900 dark:to-slate-600 sm:p-8">
            <div className="mx-auto max-w-4xl">
                {/* ✅ 3. Add data-aos attributes to your components */}
                <div data-aos="fade-down" data-aos-delay="100">
                    <QuestionHeader
                        title={question.title}
                        tags={question.tags}
                        isAuthor={isQuestionAuthor}
                        onDelete={handleDeleteQuestion}
                    />
                </div>

                <div data-aos="fade-up" data-aos-delay="200">
                    <QuestionBody
                        description={question.description}
                        user={question.posted_by}
                        date={question.createdAt}
                    />
                </div>

                <div className="mb-8" data-aos="fade-up" data-aos-delay="300">
                    <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                        {question.answers.length} Answers 🧠
                    </h2>
                    <div className="space-y-4">
                        <AnimatePresence>
                            {question.answers.length > 0 ? (
                                question.answers.map((answer, index) => (
                                    // Stagger the animation for each answer card
                                    <div key={answer._id} data-aos="fade-up" data-aos-delay={100 * (index + 1)}>
                                        <AnswerCard
                                            answer={answer}
                                            onUpvote={handleUpvote}
                                            upvotingId={upvotingId}
                                            currentUserId={currentUserId}
                                            onDelete={handleDeleteAnswer}
                                            deletingId={deletingId}
                                        />
                                    </div>
                                ))
                            ) : (
                                <p className="py-4 text-center text-gray-500 dark:text-gray-400">
                                    No answers yet. Be the first to help!
                                </p>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div data-aos="zoom-in-up" data-aos-delay="200">
                    <AnswerForm
                        content={answerContent}
                        setContent={setAnswerContent}
                        onSubmit={handlePostAnswer}
                        isSubmitting={isSubmitting}
                        error={error}
                    />
                </div>
            </div>
        </div>
    
    
    );
};
    


export default QuestionDetailPage;