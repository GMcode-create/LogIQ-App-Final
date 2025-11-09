import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Mail, Lock, User } from "lucide-react";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
    const { login, signup, loginWithGoogle, isLoading } = useAuth();
    const [loginForm, setLoginForm] = useState({ email: "", password: "" });
    const [signupForm, setSignupForm] = useState({ email: "", password: "", name: "", confirmPassword: "" });
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState("login");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!loginForm.email || !loginForm.password) {
            setError("Please fill in all fields");
            return;
        }

        const success = await login(loginForm.email, loginForm.password);
        if (success) {
            onClose();
            setLoginForm({ email: "", password: "" });
        } else {
            setError("Invalid email or password");
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

        const success = await signup(signupForm.email, signupForm.password, signupForm.name);
        if (success) {
            onClose();
            setSignupForm({ email: "", password: "", name: "", confirmPassword: "" });
        } else {
            setError("User with this email already exists");
        }
    };

    const handleGoogleLogin = async () => {
        setError("");
        // Clear any previous Google auth errors
        if (window.googleAuthError) {
            delete window.googleAuthError;
        }
        
        const success = await loginWithGoogle(false); // Pass false for login
        if (success) {
            onClose();
        } else {
            // Check for specific Google auth error
            if (window.googleAuthError) {
                setError(window.googleAuthError);
                delete window.googleAuthError;
            } else {
                setError("Google sign-in failed. Please try again.");
            }
        }
    };

    const handleGoogleSignUp = async () => {
        setError("");
        // Clear any previous Google auth errors
        if (window.googleAuthError) {
            delete window.googleAuthError;
        }
        
        const success = await loginWithGoogle(true); // Pass true for signup
        if (success) {
            onClose();
        } else {
            // Check for specific Google auth error
            if (window.googleAuthError) {
                setError(window.googleAuthError);
                delete window.googleAuthError;
            } else {
                setError("Google sign-up failed. Please try again.");
            }
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-slate-900 border-slate-700">
                <DialogHeader>
                    <DialogTitle className="text-white text-center text-2xl font-bold">
                        Welcome to LogIQ
                    </DialogTitle>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-slate-800">
                        <TabsTrigger value="login" className="text-white">Login</TabsTrigger>
                        <TabsTrigger value="signup" className="text-white">Sign Up</TabsTrigger>
                    </TabsList>

                    <TabsContent value="login" className="space-y-4 mt-6">
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="login-email" className="text-white">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="login-email"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={loginForm.email}
                                        onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                                        className="pl-10 bg-slate-800 border-slate-600 text-white"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="login-password" className="text-white">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="login-password"
                                        type="password"
                                        placeholder="Enter your password"
                                        value={loginForm.password}
                                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                                        className="pl-10 bg-slate-800 border-slate-600 text-white"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="text-red-400 text-sm text-center bg-red-900/20 p-2 rounded">
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700"
                                disabled={isLoading}
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

                        {/* Divider */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-slate-600" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-slate-900 px-2 text-gray-400">Or continue with</span>
                            </div>
                        </div>

                        {/* Google Sign-In Button */}
                        <Button
                            onClick={handleGoogleLogin}
                            variant="outline"
                            className="w-full border-slate-600 bg-white hover:bg-gray-50 text-gray-900"
                            disabled={isLoading}
                        >
                            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                                <path
                                    fill="#4285F4"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            Continue with Google
                        </Button>
                    </TabsContent>

                    <TabsContent value="signup" className="space-y-4 mt-6">
                        <form onSubmit={handleSignup} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="signup-name" className="text-white">Full Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="signup-name"
                                        type="text"
                                        placeholder="Enter your full name"
                                        value={signupForm.name}
                                        onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                                        className="pl-10 bg-slate-800 border-slate-600 text-white"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="signup-email" className="text-white">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="signup-email"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={signupForm.email}
                                        onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                                        className="pl-10 bg-slate-800 border-slate-600 text-white"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="signup-password" className="text-white">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="signup-password"
                                        type="password"
                                        placeholder="Create a password"
                                        value={signupForm.password}
                                        onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                                        className="pl-10 bg-slate-800 border-slate-600 text-white"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="signup-confirm" className="text-white">Confirm Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="signup-confirm"
                                        type="password"
                                        placeholder="Confirm your password"
                                        value={signupForm.confirmPassword}
                                        onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                                        className="pl-10 bg-slate-800 border-slate-600 text-white"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="text-red-400 text-sm text-center bg-red-900/20 p-2 rounded">
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full bg-purple-600 hover:bg-purple-700"
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

                        {/* Divider */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-slate-600" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-slate-900 px-2 text-gray-400">Or continue with</span>
                            </div>
                        </div>

                        {/* Google Sign-In Button */}
                        <Button
                            onClick={handleGoogleSignUp}
                            variant="outline"
                            className="w-full border-slate-600 bg-white hover:bg-gray-50 text-gray-900"
                            disabled={isLoading}
                        >
                            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                                <path
                                    fill="#4285F4"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            Continue with Google
                        </Button>
                    </TabsContent>
                </Tabs>

                <div className="text-center text-sm text-gray-400 mt-4">
                    {activeTab === "login" ? (
                        <>
                            Don't have an account?{" "}
                            <button
                                onClick={() => setActiveTab("signup")}
                                className="text-blue-400 hover:text-blue-300 underline"
                            >
                                Sign up here
                            </button>
                        </>
                    ) : (
                        <>
                            Already have an account?{" "}
                            <button
                                onClick={() => setActiveTab("login")}
                                className="text-purple-400 hover:text-purple-300 underline"
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