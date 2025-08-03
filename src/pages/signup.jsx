import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Code2, Sparkles, Shield, User, Mail, Lock, KeyRound } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userRegister, socialLogin } from "../redux/authSlice"; // Assuming userRegister is updated for the new flow
import { useEffect, useState } from "react";
import { auth, googleProvider, githubProvider } from "../utils/firebase";
import { signInWithPopup, fetchSignInMethodsForEmail } from "firebase/auth";
import axiosClient from "../utils/axiosClient";

// --- Step 1: Update the schema ---
// The OTP is now a required part of the form submission data.
const schema = z.object({
  firstName: z.string().min(1, "First name is required").min(3, "Minimum 3 characters required"),
  emailID: z.string().min(1, "Email is required").email("Please enter a valid email"),
  password: z.string().min(1, "Password is required").min(8, "Password must be at least 8 characters").regex(
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/,
    "Must include uppercase, number, and special character"
  ),
  // OTP is now required for the form to be valid for submission.
  otp: z.string().min(6, "A 6-digit OTP is required.").max(6, "OTP must be 6 digits."),
});

function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { isAuthenticated, loading: reduxLoading, error: reduxError } = useSelector((state) => state.auth);
  const { mode } = useSelector((state) => state.theme);

  // --- Step 2: Simplify OTP state ---
  // We only need to know if the OTP has been sent, not if it's "verified" separately.
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setError,
    getValues,
    trigger,
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  // Set server errors from Redux into the form state
  useEffect(() => {
    if (reduxError) {
      setError("root.serverError", { message: reduxError });
    }
  }, [reduxError, setError]);

  // --- Step 3: Keep the OTP sending handler ---
  const handleSendOtp = async () => {
    const isEmailValid = await trigger("emailID");
    if (!isEmailValid) return;

    setOtpLoading(true);
    setOtpError('');
    try {
      const email = getValues("emailID");
      await axiosClient.post(`user/send-otp`, { email });
      setOtpSent(true); // Mark OTP as sent
    } catch (error) {
      setOtpError(error.response?.data?.error || "Failed to send OTP. Please try again.");
    } finally {
      setOtpLoading(false);
    }
  };
  
  // --- Step 4: The main submission handler now sends everything ---
  // It relies on react-hook-form's `handleSubmit` to ensure all fields, including OTP, are valid.
  const onFormSubmit = (data) => {
    // `data` already contains firstName, emailID, password, and otp from the form.
    // The `userRegister` action in your authSlice should be configured to post this data
    // to your consolidated `/register` endpoint.
    dispatch(userRegister(data));
  };
  
  // Social login handler (unchanged)
  const handleSocialLogin = async (provider) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      dispatch(socialLogin(idToken));
    } catch (error) {
      const message = error.code === "auth/account-exists-with-different-credential"
        ? `An account already exists with this email. Please sign in with the original method.`
        : error.message;
      setError("root.serverError", { message });
    }
  };

  return (
    <div className={`min-h-screen p-4 flex items-center justify-center font-sans ...`}>
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Section (Unchanged) */}
        <div className="hidden lg:flex flex-col justify-center space-y-6">
          <div className="flex items-center space-x-3"><Code2 className="text-primary w-10 h-10" /><h1 className={`text-4xl font-bold ...`}>CodeG</h1></div>
          <h2 className={`text-3xl font-bold ...`}>Empower your <span className="text-blue-600">Coding Journey With AI</span></h2>
          <p className={`text-lg ...`}>Dive into personalized learning...</p>
        </div>

        {/* Right Section (Form) */}
        <div className="w-full max-w-md mx-auto bg-base-200 p-8 rounded-2xl shadow-xl border border-base-300">
          <div className="text-center mb-6">
            <h2 className={`text-3xl font-bold ...`}>Create Account</h2>
            <p className={`mt-1 ...`}>Enter your details below to get started.</p>
          </div>

          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
            {/* Display Server Errors */}
           

            {/* Fields that appear before OTP is sent */}
            {!otpSent && (
              <>
                {/* First Name */}
                <div className="form-control">
                  <label className={`label`}><span className="label-text flex items-center gap-2"><User size={16}/> First Name</span></label>
                  <input type="text" placeholder="John" {...register("firstName")} className={`input input-bordered ... ${errors.firstName ? "input-error" : ""}`} />
                  {errors.firstName && <p className="text-error text-xs mt-1">{errors.firstName.message}</p>}
                </div>

                {/* Email Input */}
                <div className="form-control">
                  <label className={`label`}><span className="label-text flex items-center gap-2"><Mail size={16}/> Email</span></label>
                  <div className="relative">
                    <input type="email" placeholder="john@example.com" {...register("emailID")} className={`input input-bordered w-full ... ${errors.emailID ? "input-error" : ""}`} />
                  </div>
                  {errors.emailID && <p className="text-error text-xs mt-1">{errors.emailID.message}</p>}
                </div>

                {/* Password */}
                <div className="form-control relative items-center">
                  <label className={`label`}><span className="label-text flex items-center gap-2"><Lock size={16}/> Password</span></label>
                  <input type={showPassword ? "text" : "password"} placeholder="Strong password" {...register("password")} className={`input input-bordered ... ${errors.password ? "input-error" : ""}`} />
                  <button
                  type="button"
                  className="absolute inset-y-0  top-4 right-14 flex items-center pr-3 text-gray-500 hover:text-gray-800" // Added transform for better centering, styling
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
                  {errors.password && <p className="text-error text-xs mt-1">{errors.password.message}</p>}
                </div>
                
                {/* --- Step 5: "Send OTP" is now the primary action to proceed --- */}
                <button type="button" onClick={handleSendOtp} disabled={otpLoading} className="btn w-full btn-primary h-12 text-base">
                  {otpLoading ? <span className="loading loading-spinner"></span> : "Send Verification Code"}
                </button>
                {otpError && <p className="text-error text-center text-sm">{otpError}</p>}
              </>
            )}

            {/* --- Step 6: OTP input appears after it's sent --- */}
            {otpSent && (
              <div className="p-4 border border-dashed rounded-lg space-y-3 animate-fade-in">
                 <p className="text-sm text-center">A 6-digit code was sent to <strong>{getValues("emailID")}</strong>. Enter it below to complete your registration.</p>
                 <div className="form-control">
                    <label className={`label`}><span className="label-text flex items-center gap-2"><KeyRound size={16}/> Verification Code</span></label>
                    <input type="text" placeholder="123456" {...register("otp")} maxLength={6} className={`input input-bordered text-center tracking-[1em] ... ${errors.otp ? "input-error" : ""}`} />
                    {errors.otp && <p className="text-error text-xs mt-1">{errors.otp.message}</p>}
                 </div>

                 {/* The main submit button now finalizes everything */}
                 <button type="submit" className="btn w-full btn-primary h-12 text-base font-semibold" disabled={reduxLoading || !isValid}>
                   {reduxLoading ? <span className="loading loading-spinner"></span> : <><Sparkles className="w-4 h-4 mr-1" /> Create Account</>}
                 </button>
              </div>
            )}
            
            {!otpSent && <div className="divider">OR</div>}

            {/* Social Buttons (hidden after OTP is sent) */}
            {!otpSent && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button type="button" onClick={() => handleSocialLogin(googleProvider)} className="btn btn-outline ..."><FcGoogle className="w-5 h-5" /> Google</button>
                  <button type="button" onClick={() => handleSocialLogin(githubProvider)} className="btn btn-outline ..."><FaGithub className="w-5 h-5" /> GitHub</button>
                </div>
            )}
          </form>
          
          <div className="text-center mt-6 text-sm text-base-content/70">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline font-medium">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;