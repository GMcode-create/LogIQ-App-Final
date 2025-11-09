import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import EmailValidator from "@/components/EmailValidator";
import { Loader2, Mail, Lock, User, Eye, EyeOff } from "lucide-react";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
    const { login, signup, isLoading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [loginForm, setLoginForm] = useState({ email: "", password: "" });
    const [signupForm, setSignupForm] = useState({ email: "", password: "", name: "", confirmPassword: "" });
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState("login");
    const [showLoginPassword, setShowLoginPassword] = useState(false);
    const [showSignupPassword, setShowSignupPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [emailValidation, setEmailValidation] = useState({ isValid: true, message: '' });

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('🔐 AuthModal: handleLogin called');
        setError("");

        if (!loginForm.email || !loginForm.password) {
            console.log('❌ AuthModal: Missing email or password');
            setError("Please fill in all fields");
            return;
        }

        console.log('🔐 AuthModal: Validation passed, proceeding with login');

        // Clear any previous login errors
        if ((window as any).loginError) {
            delete (window as any).loginError;
        }

        console.log('🔐 AuthModal: Starting login process for:', loginForm.email);
        console.log('🔐 AuthModal: Form data:', { email: loginForm.email, passwordLength: loginForm.password.length });

        try {
            const success = await login(loginForm.email, loginForm.password);
            console.log('🔐 AuthModal: Login result:', success);
            
            if (success) {
                console.log('✅ AuthModal: Login successful, closing modal and redirecting');
                onClose();
                setLoginForm({ email: "", password: "" });
                
                // Redirect to algorithm visualizer if on home page
                if (location.pathname === '/') {
                    navigate('/algorithm-visualizer');
                }
            } else {
                console.log('❌ AuthModal: Login failed, checking for error message');
                // Check for specific error message from the login function
                const specificError = (window as any).loginError;
                if (specificError) {
                    console.log('❌ AuthModal: Found specific error:', specificError);
                    setError(specificError);
                    delete (window as any).loginError;
                } else {
                    console.log('❌ AuthModal: No specific error, using default message');
                    setError("Login failed. Please check your credentials and try again. If this problem persists, there may be an issue with the authentication service.");
                }
            }
        } catch (err) {
            console.error('❌ AuthModal: Login threw an exception:', err);
            setError(`An unexpected error occurred: ${err.message || 'Unknown error'}. Please try again.`);
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!signupForm.email || !signupForm.password || !signupForm.name || !signupForm.confirmPassword) {
            setError("Please fill in all fields");
            return;
        }

        if (signupForm.password !== signupForm.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (signupForm.password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        if (!emailValidation.isValid) {
            setError(emailValidation.message || "Please use a different email address");
            return;
        }

        // Clear any previous signup errors
        if ((window as any).signupError) {
            delete (window as any).signupError;
        }

        const success = await signup(signupForm.email, signupForm.password, signupForm.name);
        if (success) {
            onClose();
            setSignupForm({ email: "", password: "", name: "", confirmPassword: "" });
            
            // Redirect to algorithm visualizer if on home page
            if (location.pathname === '/') {
                navigate('/algorithm-visualizer');
            }
        } else {
            // Check for specific error message from the signup function
            const specificError = (window as any).signupError;
            if (specificError) {
                setError(specificError);
                delete (window as any).signupError;
            } else {
                setError("Failed to create account. Please try again or use a different email.");
            }
        }
    };



    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="dialog-content bg-slate-900/95 backdrop-blur-xl border-slate-700/50 shadow-2xl overflow-hidden">
                {/* Enhanced Animated Background */}
                <div className="absolute inset-0 -z-10 auth-modal-bg overflow-hidden">
                    {/* Multi-layer Gradient Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
                    <div className="absolute inset-0 bg-gradient-to-tr from-cyan-900/10 via-transparent to-purple-900/10"></div>
                    
                    {/* Animated Particles */}
                    <div className="absolute inset-0">
                        {[...Array(25)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute rounded-full particle"
                                style={{
                                    width: `${2 + Math.random() * 3}px`,
                                    height: `${2 + Math.random() * 3}px`,
                                    backgroundColor: i % 3 === 0 ? 'rgba(56, 189, 248, 0.3)' : 
                                                   i % 3 === 1 ? 'rgba(168, 85, 247, 0.3)' : 
                                                   'rgba(34, 197, 94, 0.3)',
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`,
                                    animationDelay: `${Math.random() * 4}s`,
                                }}
                            />
                        ))}
                    </div>
                    
                    {/* Floating Orbs with Enhanced Animation */}
                    <div className="absolute top-6 left-6 w-28 h-28 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-2xl floating-orb"></div>
                    <div className="absolute bottom-6 right-6 w-24 h-24 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-2xl floating-orb" style={{ animationDelay: '2s' }}></div>
                    <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-gradient-to-r from-emerald-500/15 to-teal-500/15 rounded-full blur-xl pulsing-orb" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute bottom-1/3 left-1/3 w-16 h-16 bg-gradient-to-r from-indigo-500/15 to-purple-500/15 rounded-full blur-lg floating-orb" style={{ animationDelay: '3s' }}></div>
                    
                    {/* Subtle Grid Pattern */}
                    <div className="absolute inset-0 opacity-[0.03]">
                        <div className="absolute inset-0" style={{
                            backgroundImage: `
                                linear-gradient(rgba(56, 189, 248, 0.4) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(56, 189, 248, 0.4) 1px, transparent 1px)
                            `,
                            backgroundSize: '24px 24px'
                        }}></div>
                    </div>
                    
                    {/* Subtle Noise Texture */}
                    <div className="absolute inset-0 opacity-[0.02]" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                    }}></div>
                </div>

                <DialogHeader className="relative z-10 pb-2">
                    <DialogTitle className="text-white text-center text-xl font-bold mb-1">
                        Welcome to LogiQ
                    </DialogTitle>
                    <div className="text-center text-slate-400 text-xs">
                        Sign in to access algorithm visualizations
                    </div>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full relative z-10 mt-4">
                    <TabsList className="grid w-full grid-cols-2 bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 overflow-fix">
                        <TabsTrigger value="login" className="text-white overflow-fix data-[state=active]:bg-slate-700/80 data-[state=active]:text-cyan-400">Login</TabsTrigger>
                        <TabsTrigger value="signup" className="text-white overflow-fix data-[state=active]:bg-slate-700/80 data-[state=active]:text-cyan-400">Sign Up</TabsTrigger>
                    </TabsList>

                    <TabsContent value="login" className="space-y-4 mt-4">
                        <form onSubmit={handleLogin} className="space-y-5">
                            <div className="space-y-3">
                                <Label htmlFor="login-email" className="text-white font-medium">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="login-email"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={loginForm.email}
                                        onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                                        className="pl-10 bg-slate-800/80 backdrop-blur-sm border-slate-600/50 text-white placeholder:text-gray-500 focus:border-cyan-400/50 focus:ring-cyan-400/20 h-11"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="login-password" className="text-white font-medium">Password</Label>
                                <div className="relative password-input-container">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="login-password"
                                        type={showLoginPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        value={loginForm.password}
                                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                                        className="pl-10 password-input bg-slate-800/80 backdrop-blur-sm border-slate-600/50 text-white placeholder:text-gray-500 focus:border-cyan-400/50 focus:ring-cyan-400/20 h-11"
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                                        className="password-toggle-btn text-gray-400 hover:text-gray-300 transition-colors"
                                        disabled={isLoading}
                                    >
                                        {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-900/20 backdrop-blur-sm border border-red-700/30 p-4 rounded-lg">
                                    <div className="flex items-start gap-3">
                                        <div className="w-5 h-5 rounded-full bg-red-500/80 flex-shrink-0 mt-0.5 flex items-center justify-center">
                                            <div className="w-2 h-2 bg-white rounded-full"></div>
                                        </div>
                                        <div className="text-red-200 text-sm leading-relaxed">
                                            {error}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold h-11 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300"
                                disabled={isLoading}
                                onClick={(e) => {
                                    console.log('🔐 AuthModal: Sign In button clicked');
                                    // Don't prevent default here, let the form handle it
                                }}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    "Sign In"
                                )}
                            </Button>
                        </form>
                    </TabsContent>

                    <TabsContent value="signup" className="space-y-3 mt-4">
                        <form onSubmit={handleSignup} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="signup-name" className="text-white font-medium">Full Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="signup-name"
                                        type="text"
                                        placeholder="Enter your full name"
                                        value={signupForm.name}
                                        onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                                        className="pl-10 bg-slate-800/80 backdrop-blur-sm border-slate-600/50 text-white placeholder:text-gray-500 focus:border-cyan-400/50 focus:ring-cyan-400/20 h-11"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="signup-email" className="text-white font-medium">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="signup-email"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={signupForm.email}
                                        onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                                        className="pl-10 bg-slate-800/80 backdrop-blur-sm border-slate-600/50 text-white placeholder:text-gray-500 focus:border-cyan-400/50 focus:ring-cyan-400/20 h-11"
                                        disabled={isLoading}
                                    />
                                </div>
                                <EmailValidator
                                    email={signupForm.email}
                                    onValidationChange={(isValid, message) => 
                                        setEmailValidation({ isValid, message })
                                    }
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="signup-password" className="text-white font-medium">Password</Label>
                                <div className="relative password-input-container">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="signup-password"
                                        type={showSignupPassword ? "text" : "password"}
                                        placeholder="Create a password"
                                        value={signupForm.password}
                                        onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                                        className="pl-10 password-input bg-slate-800/80 backdrop-blur-sm border-slate-600/50 text-white placeholder:text-gray-500 focus:border-cyan-400/50 focus:ring-cyan-400/20 h-11"
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowSignupPassword(!showSignupPassword)}
                                        className="password-toggle-btn text-gray-400 hover:text-gray-300 transition-colors"
                                        disabled={isLoading}
                                    >
                                        {showSignupPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="signup-confirm" className="text-white font-medium">Confirm Password</Label>
                                <div className="relative password-input-container">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="signup-confirm"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm your password"
                                        value={signupForm.confirmPassword}
                                        onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                                        className="pl-10 password-input bg-slate-800/80 backdrop-blur-sm border-slate-600/50 text-white placeholder:text-gray-500 focus:border-cyan-400/50 focus:ring-cyan-400/20 h-11"
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="password-toggle-btn text-gray-400 hover:text-gray-300 transition-colors"
                                        disabled={isLoading}
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-900/20 backdrop-blur-sm border border-red-700/30 p-4 rounded-lg">
                                    <div className="flex items-start gap-3">
                                        <div className="w-5 h-5 rounded-full bg-red-500/80 flex-shrink-0 mt-0.5 flex items-center justify-center">
                                            <div className="w-2 h-2 bg-white rounded-full"></div>
                                        </div>
                                        <div className="text-red-200 text-sm leading-relaxed">
                                            {error}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 text-white font-semibold h-11 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating account...
                                    </>
                                ) : (
                                    "Create Account"
                                )}
                            </Button>
                        </form>
                    </TabsContent>
                </Tabs>

                <div className="text-center text-sm text-gray-400 mt-4 relative z-10">
                    {activeTab === "login" ? (
                        <>
                            Don't have an account?{" "}
                            <button
                                onClick={() => setActiveTab("signup")}
                                className="text-cyan-400 hover:text-cyan-300 underline transition-colors font-medium"
                            >
                                Sign up here
                            </button>
                        </>
                    ) : (
                        <>
                            Already have an account?{" "}
                            <button
                                onClick={() => setActiveTab("login")}
                                className="text-purple-400 hover:text-purple-300 underline transition-colors font-medium"
                            >
                                Sign in here
                            </button>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};