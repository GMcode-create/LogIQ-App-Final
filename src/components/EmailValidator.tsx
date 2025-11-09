import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface EmailValidatorProps {
  email: string;
  onValidationChange: (isValid: boolean, message: string) => void;
}

const EmailValidator = ({ email, onValidationChange }: EmailValidatorProps) => {
  const [isChecking, setIsChecking] = useState(false);
  const [validationStatus, setValidationStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!email || !email.includes('@')) {
      setValidationStatus('idle');
      setMessage('');
      onValidationChange(true, ''); // Allow empty or invalid format to be handled by form validation
      return;
    }

    const checkEmailExists = async () => {
      setIsChecking(true);
      
      try {
        // Check if email exists in profiles table
        const { data: profile } = await supabase
          .from('profiles')
          .select('email')
          .eq('email', email)
          .single();

        if (profile) {
          setValidationStatus('invalid');
          setMessage('This email is already registered');
          onValidationChange(false, 'This email is already registered. Please use the login form instead.');
        } else {
          setValidationStatus('valid');
          setMessage('Email is available');
          onValidationChange(true, '');
        }
      } catch (error) {
        // If profiles table doesn't exist or other error, assume email is available
        setValidationStatus('valid');
        setMessage('Email is available');
        onValidationChange(true, '');
      } finally {
        setIsChecking(false);
      }
    };

    // Debounce the email check
    const timeoutId = setTimeout(checkEmailExists, 500);
    return () => clearTimeout(timeoutId);
  }, [email, onValidationChange]);

  if (!email || !email.includes('@')) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 mt-1">
      {isChecking ? (
        <>
          <Loader2 className="w-3 h-3 animate-spin text-slate-400" />
          <span className="text-xs text-slate-400">Checking availability...</span>
        </>
      ) : validationStatus === 'valid' ? (
        <>
          <CheckCircle className="w-3 h-3 text-green-400" />
          <span className="text-xs text-green-400">{message}</span>
        </>
      ) : validationStatus === 'invalid' ? (
        <>
          <XCircle className="w-3 h-3 text-red-400" />
          <span className="text-xs text-red-400">{message}</span>
        </>
      ) : null}
    </div>
  );
};

export default EmailValidator;