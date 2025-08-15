// src/components/common/LoginAccessCard.jsx
import React from "react";
import { Link } from "react-router";
import { Lock } from "lucide-react";
import Particles from "../components copy/ui/particlebg";
const LoginAccessCard = ({ message = "Please login or sign up to access this feature." }) => {
  return (<>
      <div className="absolute inset-0 z-20 pointer-events-none">
                <Particles
                    particleColors={['#ffffff', '#ffffff']}
                    particleCount={180}
                    particleSpread={10}
                    speed={0.1}
                    particleBaseSize={100}
                    moveParticlesOnHover={true}
                    alphaParticles={false}
                    disableRotation={false}
                    className="absolute inset-0 w-full h-full"
                />
            </div>

    <div
      className="max-w-md mx-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-900 p-6 shadow-md text-center"
      data-aos="zoom-in"
    >
        
      <div className="flex items-center justify-center mb-4">
        <Lock className="h-8 w-8 text-blue-600 dark:text-white" />
      </div>
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Restricted Access</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-4">{message}</p>
      <div className="flex justify-center gap-3">
        <Link to="/login">
          <button className="rounded-md bg-blue-600 text-white px-4 py-2 text-sm font-medium shadow hover:bg-blue-500 transition hover:scale-105">
            Log In
          </button>
        </Link>
        <Link to="/signup">
          <button className="rounded-md bg-gray-100 text-blue-600 px-4 py-2 text-sm font-medium shadow hover:bg-gray-200 transition hover:scale-105 dark:bg-white/10 dark:text-white dark:hover:bg-white/20">
            Sign Up
          </button>
        </Link>
      </div>
    </div>
      </>
  );
};

export default LoginAccessCard;
