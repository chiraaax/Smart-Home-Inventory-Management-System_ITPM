import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import logo from '../assets/logo.png';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();

  const { username, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', { username, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      if (rememberMe) {
        localStorage.setItem('rememberedUser', username);
      }

      if (res.data.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/home');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotPasswordEmail) {
      setError('Please enter your email address');
      return;
    }

    setForgotPasswordLoading(true);
    setError('');
    setForgotPasswordSuccess('');

    try {
      // Mock API call - replace with your actual forgot password endpoint
      await api.post('/auth/forgot-password', { email: forgotPasswordEmail });
      setForgotPasswordSuccess('Password reset instructions have been sent to your email.');
      setForgotPasswordEmail('');
      
      // Hide forgot password form after 5 seconds
      setTimeout(() => {
        toggleForgotPassword();
        setForgotPasswordSuccess('');
      }, 5000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset instructions');
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const toggleForgotPassword = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setShowForgotPassword(!showForgotPassword);
    
    // Reset animation state after animation completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{ 
        backgroundImage: 'url(/src/assets/bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-sm"></div>
      
      {/* Main Content Container - White Rectangle with Glass Effect */}
      <div className="relative z-10 w-full max-w-6xl bg-white/20 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/30">
        <div className="relative h-[600px] lg:h-[700px]">
          {/* Screen 1: Login with Dark Blue on Right */}
          <div className={`absolute inset-0 flex transition-all duration-500 ease-in-out ${showForgotPassword ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'}`}>
            {/* Left Side - Login Form with Glass Effect */}
            <div className="w-1/2 p-8 lg:p-12">
              <div className="h-full flex flex-col justify-center">
                {/* Glassmorphism Form Container */}
                <div className="max-w-md mx-auto w-full bg-white/30 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/40">
                  {/* Form Header */}
                  <div className="text-center mb-10">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h1>
                    <p className="text-gray-700">Login to your account to continue</p>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="mb-6 p-4 bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-lg animate-shake">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span className="text-red-700 font-medium">{error}</span>
                      </div>
                    </div>
                  )}

                  {/* Login Form */}
                  <form onSubmit={onSubmit} className="space-y-6">
                    {/* Email Field */}
                    <div>
                      <label className="block text-gray-800 text-sm font-semibold mb-2">
                        Username
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <input
                          type="text"
                          name="username"
                          value={username}
                          onChange={onChange}
                          required
                          className="w-full pl-10 pr-4 py-3 bg-white/60 backdrop-blur-sm border border-white/50 rounded-lg text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 transition-all duration-200 shadow-sm"
                          placeholder="Enter username"
                        />
                      </div>
                    </div>

                    {/* Password Field */}
                    <div>
                      <label className="block text-gray-800 text-sm font-semibold mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                          </svg>
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={password}
                          onChange={onChange}
                          required
                          className="w-full pl-10 pr-12 py-3 bg-white/60 backdrop-blur-sm border border-white/50 rounded-lg text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 transition-all duration-200 shadow-sm"
                          placeholder="Enter your password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-colors"
                        >
                          {showPassword ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Remember Me & Forgot Password Link */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="remember"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-400 rounded cursor-pointer"
                        />
                        <label htmlFor="remember" className="ml-2 text-gray-800 text-sm cursor-pointer">
                          Remember me
                        </label>
                      </div>
                      <button
                        type="button"
                        onClick={toggleForgotPassword}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                      >
                        Forgot password?
                      </button>
                    </div>

                    {/* Submit Button with Glass Effect */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Signing in...
                        </span>
                      ) : (
                        <span>Sign in</span>
                      )}
                    </button>
                  </form>

                  {/* Sign Up Link */}
                  <div className="mt-8 pt-6 border-t border-white/40">
                    <p className="text-center text-gray-700 text-sm">
                      Don't have an account?{' '}
                      <Link 
                        to="/signup" 
                        className="text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200 hover:underline"
                      >
                        Create account
                      </Link>
                    </p>
                  </div>

                  {/* Footer Links */}
                  <div className="mt-8 text-center">
                    <div className="flex justify-center space-x-6 text-sm text-gray-600">
                      <a href="#" className="hover:text-gray-800 transition-colors">Privacy Policy</a>
                      <a href="#" className="hover:text-gray-800 transition-colors">Terms of Service</a>
                      <a href="#" className="hover:text-gray-800 transition-colors">Support</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Dark Blue Section */}
            <div className="w-1/2 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-8 lg:p-12">
              <div className="h-full flex flex-col justify-between">
                {/* Logo - Much bigger logo without changing container size */}
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border-2 border-white/30 overflow-hidden p-0">
                    <img 
                      src={logo} 
                      alt="M.T Digital Project Logo" 
                      className="w-full h-full object-contain scale-150" 
                    />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-white">Lumina Homes</h1>
                    <p className="text-white/80 text-sm">Intelligent Living Solutions</p>
                  </div>
                </div>

                {/* Slider Content */}
                <div className="flex-1 flex flex-col justify-center py-8">
                  <div className="max-w-sm mx-auto">
                    <h1 className="text-3xl font-bold text-white mb-4">Hello, Welcome!</h1>
                    <p className="text-white/90 leading-relaxed mb-6">
                      Manage your living spaces efficiently and easily. <br></br>
                      Login to access your dashboard.
                    </p>
                    
                    {/* Company Info */}
                    <div className="mt-8 pt-6 border-t border-white/20">
                      <p className="text-white/60 text-sm">
                        presented by <span className="font-bold text-white">Homes Solutions</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Slider Indicators */}
                <div className="flex justify-center space-x-2">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <div className="w-2 h-2 bg-white/30 rounded-full"></div>
                  <div className="w-2 h-2 bg-white/30 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Screen 2: Forgot Password with Dark Blue on Left */}
          <div className={`absolute inset-0 flex transition-all duration-500 ease-in-out ${showForgotPassword ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
            {/* Left Side - Dark Blue Section */}
            <div className="w-1/2 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-8 lg:p-12">
              <div className="h-full flex flex-col justify-between">
                {/* Logo - Much bigger logo without changing container size */}
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border-2 border-white/30 overflow-hidden p-0">
                    <img 
                      src={logo} 
                      alt="M.T Digital Project Logo" 
                      className="w-full h-full object-contain scale-150" 
                    />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-white">Lumina Homes</h1>
                    <p className="text-white/80 text-sm">Intelligent Living Solutions</p>
                  </div>
                </div>

                {/* Slider Content */}
                <div className="flex-1 flex flex-col justify-center py-8">
                  <div className="max-w-sm mx-auto">
                    <h1 className="text-3xl font-bold text-white mb-4">Need Help?</h1>
                    <p className="text-white/90 leading-relaxed mb-6">
                      Enter your email to reset your password. We'll send you instructions to regain access to your account.
                    </p>
                    
                    {/* Company Info */}
                    <div className="mt-8 pt-6 border-t border-white/20">
                      <p className="text-white/60 text-sm">
                        presented by <span className="font-bold text-white">Homes Solutions</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Slider Indicators */}
                <div className="flex justify-center space-x-2">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <div className="w-2 h-2 bg-white/30 rounded-full"></div>
                  <div className="w-2 h-2 bg-white/30 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Right Side - Forgot Password Form with Glass Effect */}
            <div className="w-1/2 p-8 lg:p-12">
              <div className="h-full flex flex-col justify-center">
                {/* Glassmorphism Form Container */}
                <div className="max-w-md mx-auto w-full bg-white/30 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/40">
                  {/* Form Header */}
                  <div className="text-center mb-10">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Reset Password</h1>
                    <p className="text-gray-700">Enter your email to receive reset instructions</p>
                  </div>

                  {/* Success Message for Forgot Password */}
                  {forgotPasswordSuccess && (
                    <div className="mb-6 p-4 bg-green-50/80 backdrop-blur-sm border border-green-200 rounded-lg">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-green-700 font-medium">{forgotPasswordSuccess}</span>
                      </div>
                    </div>
                  )}

                  {/* Error Message */}
                  {error && (
                    <div className="mb-6 p-4 bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-lg animate-shake">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span className="text-red-700 font-medium">{error}</span>
                      </div>
                    </div>
                  )}

                  {/* Forgot Password Form */}
                  <form onSubmit={handleForgotPassword} className="space-y-6">
                    <div>
                      <label className="block text-gray-800 text-sm font-semibold mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <input
                          type="email"
                          value={forgotPasswordEmail}
                          onChange={(e) => setForgotPasswordEmail(e.target.value)}
                          required
                          className="w-full pl-10 pr-4 py-3 bg-white/60 backdrop-blur-sm border border-white/50 rounded-lg text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 transition-all duration-200 shadow-sm"
                          placeholder="Enter your registered email"
                        />
                      </div>
                      <p className="text-gray-600 text-xs mt-2">
                        We'll send you a link to reset your password
                      </p>
                    </div>

                    {/* Spacer div to match login form height */}
                    <div className="h-10"></div>

                    <div className="flex space-x-4">
                      {/* Send Button with Glass Effect */}
                      <button
                        type="submit"
                        disabled={forgotPasswordLoading}
                        className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm"
                      >
                        {forgotPasswordLoading ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sending...
                          </span>
                        ) : (
                          'Send Reset Link'
                        )}
                      </button>
                      
                      {/* Back Button with Glass Effect */}
                      <button
                        type="button"
                        onClick={toggleForgotPassword}
                        className="flex-1 py-3 px-6 bg-white/40 backdrop-blur-sm border border-white/50 text-gray-700 font-semibold rounded-lg hover:bg-white/60 focus:outline-none focus:ring-2 focus:ring-gray-400/50 focus:ring-offset-2 transition-all duration-300 shadow-sm hover:shadow-md"
                      >
                        Back to Login
                      </button>
                    </div>
                  </form>

                  {/* Sign Up Link */}
                  <div className="mt-8 pt-6 border-t border-white/40 opacity-0">
                    <p className="text-center text-gray-700 text-sm">
                      Don't have an account?{' '}
                      <Link 
                        to="/signup" 
                        className="text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200 hover:underline"
                      >
                        Create account
                      </Link>
                    </p>
                  </div>

                  {/* Footer Links */}
                  <div className="mt-8 text-center opacity-0">
                    <div className="flex justify-center space-x-6 text-sm text-gray-600">
                      <a href="#" className="hover:text-gray-800 transition-colors">Privacy Policy</a>
                      <a href="#" className="hover:text-gray-800 transition-colors">Terms of Service</a>
                      <a href="#" className="hover:text-gray-800 transition-colors">Support</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Login;