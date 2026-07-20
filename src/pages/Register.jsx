import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Loader2, Briefcase } from 'lucide-react';
import Button from '../components/shared/Button';
import Input from '../components/shared/Input';

const FIREBASE_ERRORS = {
  'auth/email-already-in-use': 'An account with this email already exists.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/weak-password': 'Password must be at least 6 characters.',
  'auth/network-request-failed': 'Network error. Check your connection.',
};

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setSubmitting(true);

    try {
      await register(email, password);
      navigate('/');
    } catch (err) {
      setError(FIREBASE_ERRORS[err.code] || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-subtle px-16 py-24 animate-fade-in">
      <div className="w-full max-w-[420px]">
        <div className="rounded-card bg-surface-default p-28 shadow-elevation-3 animate-slide-up">
          <div className="mb-24 text-center">
            <div className="mx-auto mb-16 flex h-14 w-14 items-center justify-center rounded-input bg-brand-primary text-neutral-0 shadow-elevation-2">
              <Briefcase className="w-7 h-7" />
            </div>
            <h1 className="text-h2 font-bold text-text-primary">
              Create Account
            </h1>
            <p className="mt-8 text-body-normal text-text-secondary">
              Start tracking jobs with JobPulse
            </p>
          </div>

          {error && (
            <div className="mb-18 rounded-input border border-danger-main bg-danger-bg px-14 py-10 text-body-small text-danger-main animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-18">
            <Input
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              autoComplete="new-password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              autoComplete="new-password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="h-14 w-14 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>
        </div>

        <p className="mt-20 text-center text-body-normal text-text-secondary">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-brand-primary transition-colors hover:text-brand-hover"
          >
            Sign in
          </Link>
        </p>

        <p className="mt-12 text-center text-ui-caption text-text-muted">
          JobPulse — Never miss a job posting
        </p>
      </div>
    </div>
  );
}
