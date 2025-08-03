import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Code2, Sparkles, User, Mail, Lock, Github, Chrome, Shield } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { userLogin, socialLogin } from "../redux/authSlice";
import { useEffect,useState} from 'react';
import { auth, googleProvider, githubProvider } from "../utils/firebase";
import { signInWithPopup } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

// Validation schema
const schema = z.object({
  emailID: z.string().min(1, "Email is required").email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const { mode } = useSelector((state) => state.theme);


  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = (data) => {
    dispatch(userLogin(data));
    return new Promise((resolve) => setTimeout(resolve, 2000));
  };

  const handleSocialLogin = async (provider) => {
    setError("root.serverError", null);
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      dispatch(socialLogin(idToken));
    } catch (firebaseError) {
      console.error("Firebase authentication error:", firebaseError.message);
      setError("root.serverError", {
        type: "firebase",
        message: "Failed to sign in. The popup may have been closed."
      });
    }
  };

  return (
  <div
    className={`min-h-screen p-4 flex items-center justify-center font-sans transition-all duration-300 ${
      mode === 'dark'
        ? 'bg-gray-900 text-white'
        : 'bg-gradient-to-br from-white via-blue-50 to-blue-100 text-gray-800'
    }`}
  >
    <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
      {/* Branding Left Panel */}
      <div className="hidden lg:flex flex-col gap-6 animate-fade-in-left">
        <div className="flex items-center gap-3">
          <Code2 className="h-10 w-10 text-blue-600" />
          <h1 className={`text-4xl font-bold ${mode === 'dark' ? 'text-white' : 'text-gray-800'}`}>CodeG</h1>
        </div>
        <h2 className={`text-3xl font-bold ${mode === 'dark' ? 'text-white' : 'text-gray-700'}`}>
          Empowering the <span className="text-blue-600">Future of Coding</span>
        </h2>
        <p className={`text-lg ${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          Log in to access your workspace, projects, and collaborate with your team.
        </p>
        <div className="flex gap-4 mt-4">
          <div
            className={`flex items-center gap-3 rounded-lg p-3 ${
              mode === 'dark'
                ? 'bg-gray-800 border border-gray-700 shadow-md'
                : 'bg-white border border-blue-200 shadow'
            }`}
          >
            <Code2 className="text-blue-600 h-5 w-5" />
            <p className={`text-sm font-medium ${mode === 'dark' ? 'text-white' : 'text-gray-700'}`}>Project Workspace</p>
          </div>
          <div
            className={`flex items-center gap-3 rounded-lg p-3 ${
              mode === 'dark'
                ? 'bg-gray-800 border border-gray-700 shadow-md'
                : 'bg-white border border-blue-200 shadow'
            }`}
          >
            <Sparkles className="text-blue-600 h-5 w-5" />
            <p className={`text-sm font-medium ${mode === 'dark' ? 'text-white' : 'text-gray-700'}`}>Smart Assistance</p>
          </div>
        </div>
      </div>

      {/* Login Form Right Panel */}
      <div
        className={`w-full max-w-md rounded-2xl p-8 animate-fade-in-up border ${
          mode === 'dark'
            ? 'bg-gray-800 border-gray-700 shadow-lg'
            : 'bg-white border-gray-200 shadow-xl'
        }`}
      >
        <div className="mb-6 text-center">
          <h2 className={`text-3xl font-bold ${mode === 'dark' ? 'text-white' : 'text-gray-800'}`}>Sign In</h2>
          <p className={`mt-1 ${mode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            Welcome back! Please login to your account.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div>
            <label className={`text-sm font-medium flex items-center gap-2 ${mode === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              <Mail size={16} className="text-blue-600" />
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className={`input input-bordered w-full h-11 mt-1 ${errors.emailID ? 'input-error' : ''}`}
              {...register('emailID')}
            />
            {errors.emailID && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <Shield size={12} />
                {errors.emailID.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <label className={`text-sm font-medium flex items-center justify-between ${mode === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              <span className="flex items-center gap-2">
                <Lock size={16} className="text-blue-600" /> Password
              </span>
              <a href="#" className="text-xs text-blue-600 hover:underline">
                Forgot password?
              </a>
            </label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className={`input input-bordered w-full h-11 mt-1 ${errors.password ? 'input-error' : ''}`}
              {...register('password')}
            />
            <button
                  type="button"
                  className="absolute inset-y-0  top-4 right-2 flex items-center pr-3 text-gray-500 hover:text-gray-800" // Added transform for better centering, styling
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"} // Accessibility
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <Shield size={12} />
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn bg-blue-600 text-white w-full h-11 font-semibold hover:bg-blue-700"
            disabled={ loading}
          >
            { loading && <span className="loading loading-spinner loading-sm mr-2"></span>}
            { loading  ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div className={`divider my-6 ${mode === 'dark' ? 'text-gray-400' : ''}`}>Or Sign In With</div>

        {/* Social Logins */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleSocialLogin(googleProvider)}
            className={`btn btn-outline h-12 flex items-center justify-center gap-2 border ${
              mode === 'dark'
                ? 'border-gray-600 hover:bg-gray-700'
                : 'border-gray-300 hover:bg-gray-100'
            }`}
          >
            <FcGoogle className="w-5 h-5" /> Google
          </button>
          <button
            type="button"
            onClick={() => handleSocialLogin(githubProvider)}
            className={`btn btn-outline h-12 flex items-center justify-center gap-2 border ${
              mode === 'dark'
                ? 'border-gray-600 hover:bg-gray-700 text-white'
                : 'border-gray-300 hover:bg-gray-100 text-gray-700'
            }`}
          >
            <FaGithub className="w-5 h-5" /> GitHub
          </button>
        </div>

        <p className={`text-sm text-center mt-6 ${mode === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="text-blue-600 font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  </div>
);

}

export default Login;
