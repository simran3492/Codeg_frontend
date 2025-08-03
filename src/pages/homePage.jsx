import React from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { Link } from "react-router";
import { FiCode, FiCheckCircle, FiUsers, FiAward, FiArrowRight } from 'react-icons/fi';

// Step 1: Create a reusable SVG logo component
const CodeGLogo= ({ className }) => (
    <div className={`text-5xl md:text-6xl font-extrabold tracking-tight ${className}`}>
        <span className="text-blue-600">Code</span>
        {/* Add a little space between the words */}
        <span className="ml-3">G</span>
    </div>
);


const CodeEditorGlimpse = () => {
    // ... (This component remains unchanged)
    const codeLines = [
        { text: 'function', color: 'text-purple-400' },
        { text: ' findPath', color: 'text-yellow-300' },
        { text: '(node, target) {' },
        { text: '  // Implementation here', color: 'text-gray-500', indent: true },
        { text: '}' },
    ];

    const containerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: 'spring',
                damping: 25,
                stiffness: 100,
                staggerChildren: 0.3
            }
        }
    };

    const lineVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 }
    };

    return (
        <motion.div
            className="w-full max-w-md mx-auto bg-gray-800 rounded-xl shadow-2xl overflow-hidden"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="h-9 bg-gray-700 flex items-center px-4">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="p-5 font-mono text-sm text-gray-200">
                {codeLines.map((line, i) => (
                    <motion.div key={i} variants={lineVariants} className="flex">
                        <span className="text-gray-500 mr-4">{i + 1}</span>
                        <span className={line.color || ''}>
                            {line.indent && <span className="mr-4"></span>}
                            {line.text}
                        </span>
                    </motion.div>
                ))}
                <motion.div variants={lineVariants} className="flex items-center">
                    <span className="text-gray-500 mr-4">{codeLines.length + 1}</span>
                    <span className="w-2 h-4 bg-blue-400 animate-pulse"></span>
                </motion.div>
            </div>
        </motion.div>
    );
};

const HomePage = () => {
    const { mode } = useSelector((state) => state.theme);

    const isDark = mode === 'dark';

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: 'easeOut' },
        },
    };

    const features = [
        {
            icon: <FiCode className="h-8 w-8 text-white" />,
            title: "Curated Problem Library",
            description: "Challenge yourself with a vast collection of problems curated from real-world interviews."
        },
        {
            icon: <FiCheckCircle className="h-8 w-8 text-white" />,
            title: "Instant Code Validation",
            description: "Our high-speed online judge provides immediate, detailed feedback to accelerate your learning."
        },
        {
            icon: <FiUsers className="h-8 w-8 text-white" />,
            title: "Collaborative Community",
            description: "Join a vibrant network of developers to share knowledge, discuss solutions, and grow together."
        },
        {
            icon: <FiAward className="h-8 w-8 text-white" />,
            title: "Competitive Contests",
            description: "Benchmark your skills, climb the ranks, and gain recognition in our regular coding contests."
        },
    ];

    const testimonials = [
        {
            name: "Alex Johnson",
            role: "Software Engineer at TechCorp",
            avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
            quote: "The targeted problem sets on CodeG were the key to me acing my technical interviews. It's an indispensable tool for any aspiring developer."
        },
        {
            name: "Samantha Lee",
            role: "Frontend Developer",
            avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704e",
            quote: "I love the community aspect. Discussing different approaches to a problem has drastically improved my problem-solving skills."
        }
    ];

    return (
        <div className={`${isDark ? "bg-gray-900 text-gray-100" : "bg-white text-gray-800"} font-sans transition-colors duration-300`}>

            {/* Hero Section */}
            <section className={`${isDark ? "bg-gray-900" : "bg-gray-50"} min-h-screen flex justify-center ml-17 items-center overflow-hidden transition-colors duration-300`}>
                <div className="container mx-auto px-6 lg:px-10"> {/* Step 3: Added padding to the main container */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center justify-center">
                        <motion.div className="text-center lg:text-left" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 2 }} transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}>
                            {/* Step 2: Add the CodeG Logo here */}
                            <CodeGLogo className="h-12 md:h-16 mb-4 mx-auto lg:mx-0" />
                            
                            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
                                Build Your Future,
                                <span className="block text-blue-600">One Line at a Time.</span>
                            </h1>
                            <p className={`mt-6 text-lg max-w-xl mx-auto lg:mx-0 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                                CodeG is the ultimate training ground for developers. Master data structures, conquer algorithms, and prepare to ace your next technical interview.
                            </p>
                            <Link to='/signup'>
                                <motion.button className="mt-8 px-8 py-4 bg-blue-600 text-white font-bold rounded-full inline-flex items-center shadow-lg transform transition-transform duration-300" whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                                    Start Your Journey <FiArrowRight className="ml-2" />
                                </motion.button>
                            </Link>
                        </motion.div>
                        <div className="hidden lg:flex justify-center items-center h-full">
                            <CodeEditorGlimpse />
                        </div>
                    </div>
                </div>
            </section>
            
            {/* The rest of the sections remain unchanged */}
            
            {/* Features Section */}
            <section className="py-24">
                <div className="container mx-auto px-6 lg:px-8 text-center">
                    <motion.div variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                        <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">Your Path to Mastery</h2>
                        <p className={`mt-2 text-3xl md:text-4xl font-extrabold ${isDark ? "text-white" : "text-gray-900"}`}>A Better Way to Practice</p>
                        <p className={`mt-4 max-w-2xl mx-auto text-xl ${isDark ? "text-gray-300" : "text-gray-500"}`}>
                            We provide all the tools you need to level up your skills, all in one place.
                        </p>
                    </motion.div>
                    <motion.div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                        {features.map((feature, i) => (
                            <motion.div key={i} className={`${isDark ? "bg-gray-800 text-white" : "bg-gray-50 text-gray-800"} p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300`} variants={itemVariants}>
                                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-600 mx-auto">
                                    {feature.icon}
                                </div>
                                <h3 className="mt-6 text-xl font-bold">{feature.title}</h3>
                                <p className="mt-2">{feature.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className={`${isDark ? "bg-gray-800" : "bg-blue-50"} py-24`}>
                <div className="container mx-auto px-6 lg:px-8 text-center">
                    <motion.div variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                        <h2 className={`text-3xl md:text-4xl font-extrabold ${isDark ? "text-white" : "text-gray-900"}`}>Get Started in 3 Simple Steps</h2>
                        <p className={`mt-4 max-w-2xl mx-auto text-xl ${isDark ? "text-gray-300" : "text-gray-500"}`}>
                            It's never been easier to start practicing and improving.
                        </p>
                    </motion.div>
                    <motion.div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                        {[
                            { title: 'Pick a Problem', desc: 'Choose from our extensive library.' },
                            { title: 'Write Your Code', desc: 'Solve it in our integrated editor.' },
                            { title: 'Get Instant Feedback', desc: 'Submit and see your results.' }
                        ].map((step, i) => (
                            <motion.div key={i} className="p-6" variants={itemVariants}>
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center font-bold text-2xl text-blue-600 bg-blue-100 rounded-full">
                                        {i + 1}
                                    </div>
                                    <h3 className="ml-4 text-2xl font-bold">{step.title}</h3>
                                </div>
                                <p className={`mt-4 pl-16 ${isDark ? "text-gray-300" : "text-gray-600"}`}>{step.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24">
                <div className="container mx-auto px-6 lg:px-8">
                    <motion.div className="text-center" variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                        <h2 className={`text-3xl md:text-4xl font-extrabold ${isDark ? "text-white" : "text-gray-900"}`}>Loved by Developers Worldwide</h2>
                    </motion.div>
                    <motion.div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                        {testimonials.map((t, i) => (
                            <motion.div key={i} className={`${isDark ? "bg-gray-800 border-gray-600 text-gray-300" : "bg-white border-gray-200 text-gray-700"} p-8 rounded-lg border`} variants={itemVariants}>
                                <p className="text-lg leading-relaxed">"{t.quote}"</p>
                                <div className="mt-6 flex items-center">
                                    <img className="h-14 w-14 rounded-full" src={t.avatar} alt={t.name} />
                                    <div className="ml-4">
                                        <p className={`font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{t.name}</p>
                                        <p className="text-sm">{t.role}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className={`${isDark ? "bg-gray-800 border-gray-600 text-gray-300" : "bg-white border-gray-200 text-gray-700"}`}>
                <div className="container mx-auto py-20 px-6 lg:px-8 text-center">
                    <motion.div variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                        <h2 className={`${isDark ? "text-white" : "text-gray-700"} text-3xl md:text-4xl font-extrabold `}>Ready to Write Your Success Story?</h2>
                        <p className={` ${isDark ? "text-white" : "text-gray-500"} mt-4 max-w-2xl mx-auto text-xl`}>
                            Create your free account today and join the next generation of top tech talent.
                        </p>
                        <Link to='/signup'>
                        <motion.button className="mt-8 px-8 py-4 bg-blue-600 text-white font-bold rounded-full inline-flex items-center shadow-lg transform transition-transform duration-300" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            Sign Up for Free
                        </motion.button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className={`${isDark ? "bg-gray-900" : "bg-gray-800"}`}>
                <div className="container mx-auto py-6 px-6 lg:px-8 text-center text-gray-400">
                    <p>Copyright © {new Date().getFullYear()} - All rights reserved by CodeG</p>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;