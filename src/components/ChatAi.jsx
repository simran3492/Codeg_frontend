import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "../utils/axiosClient";
import { Send, Code } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

// Helper Component: Typing Indicator
const TypingIndicator = ({ isDarkTheme }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="chat chat-start"
    >
        <div className="chat-image avatar">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border ${isDarkTheme ? 'border-gray-700 bg-gray-800 text-gray-400' : 'border-gray-200 bg-white text-gray-600'}`}>
                A
            </div>
        </div>
        <div className={`chat-bubble ${isDarkTheme ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-800'}`}>
            <motion.div
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
                Thinking...
            </motion.div>
        </div>
    </motion.div>
);

// Helper Component: Chat Message
const ChatMessage = ({ msg, isDarkTheme }) => {
    const isUser = msg.role === "user";
    const formatTimestamp = (date) => new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            layout
            className={`chat ${isUser ? "chat-end" : "chat-start"}`}
        >
            <div className="chat-image avatar">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border ${isDarkTheme ? 'border-gray-700 bg-gray-800 text-gray-400' : 'border-gray-200 bg-white text-gray-600'}`}>
                    {isUser ? 'U' : 'A'}
                </div>
            </div>
            <div className={`chat-bubble ${isUser ? "bg-blue-500 text-white" : (isDarkTheme ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-900')} ${msg.isError ? "bg-red-500 text-white" : ""}`}>
                <p className="max-w-prose break-words">{msg.parts[0].text}</p>
                <time className={`text-xs float-right ml-2 mt-1 ${isUser || msg.isError ? 'opacity-70' : (isDarkTheme ? 'opacity-40' : 'opacity-50')}`}>
                    {formatTimestamp(msg.timestamp)}
                </time>
            </div>
        </motion.div>
    );
};

function ChatAi({ problem, isDarkTheme }) {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const messagesEndRef = useRef(null);

    useEffect(() => {
        setMessages([
            { role: 'model', parts: [{ text: `Hello! I'm here to help with the "${problem.title}" problem. How can I assist you?` }], timestamp: new Date() }
        ]);
    }, [problem.title]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    const onSubmit = async (data) => {
        if (isLoading || !data.message.trim()) return;

        const userMessage = { role: 'user', parts: [{ text: data.message }], timestamp: new Date() };
        setMessages(prev => [...prev, userMessage]);
        reset();
        setIsLoading(true);

        try {
            const response = await axiosClient.post("/ai/chat", {
                messages: [...messages, userMessage],
                title: problem.title,
                description: problem.description,
                testCases: problem.visibleTestCases,
                startCode: problem.startCode
            });
            setMessages(prev => [...prev, {
                role: 'model',
                parts: [{ text: response.data.message }],
                timestamp: new Date()
            }]);
        } catch (error) {
            console.error("API Error:", error);
            setMessages(prev => [...prev, {
                role: 'model',
                parts: [{ text: "Sorry, an unexpected error occurred. Please try again later." }],
                timestamp: new Date(),
                isError: true
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`flex flex-col h-screen max-h-[80vh] min-h-[500px] font-sans rounded-2xl shadow-2xl overflow-hidden transition-colors duration-300 ${isDarkTheme ? 'bg-gray-900' : 'bg-gray-100'}`}>
            <header className={`flex items-center justify-between p-4 border-b z-10 transition-colors duration-300 ${isDarkTheme ? 'border-gray-700 bg-gray-900/50' : 'border-gray-200 bg-white/50'} backdrop-blur-sm`}>
                <div className="flex items-center gap-3">
                    <Code className="text-blue-500" size={24} />
                    <h2 className={`text-xl font-bold transition-colors duration-300 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>{problem.title}</h2>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto p-6 space-y-6">
                <AnimatePresence>
                    {messages.map((msg, index) => (
                        <ChatMessage key={index} msg={msg} isDarkTheme={isDarkTheme} />
                    ))}
                    {isLoading && <TypingIndicator isDarkTheme={isDarkTheme} />}
                </AnimatePresence>
                <div ref={messagesEndRef} />
            </main>

            <footer className={`p-4 border-t transition-colors duration-300 ${isDarkTheme ? 'border-gray-700 bg-gray-900/50' : 'border-gray-200 bg-white/30'} backdrop-blur-lg`}>
                <form onSubmit={handleSubmit(onSubmit)} className="flex items-center gap-3">
                    <input
                        placeholder="Ask me anything..."
                        className={`input w-full border transition-colors duration-300 ${isDarkTheme ? 'border-gray-700 bg-gray-800 text-white placeholder-gray-500' : 'border-gray-300 bg-white text-black placeholder-gray-400'}`}
                        {...register("message", { required: true, minLength: 2 })}
                        disabled={isLoading}
                        autoComplete="off"
                    />
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className="btn bg-blue-500 hover:bg-blue-600 text-white btn-circle shrink-0"
                        disabled={isLoading || !!errors.message}
                    >
                        {isLoading ? <span className="loading loading-spinner"></span> : <Send size={20} />}
                    </motion.button>
                </form>
            </footer>
        </div>
    );
}

export default ChatAi;