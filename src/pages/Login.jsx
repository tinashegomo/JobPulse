import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Loader2, Briefcase } from 'lucide-react';
import Button from '../components/shared/Button';
import Input from '../components/shared/Input';

const FIREBASE_ERRORS = {
  'auth/invalid-credential': 'Invalid email or password.',
  'auth/user-disabled': 'This account has been disabled.',
  'auth/too-many-requests': 'Too many attempts. Please try again later.',
  'auth/network-request-failed': 'Network error. Check your connection.',
};

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(FIREBASE_ERRORS[err.code] || 'Login failed. Please try again.');
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
              Welcome Back
            </h1>
            <p className="mt-8 text-body-normal text-text-secondary">
              Sign in to JobPulse
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
              autoComplete="current-password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </div>

        <p className="mt-20 text-center text-body-normal text-text-secondary">
          Don&apos;t have an account?{' '}
          <Link
            to="/register"
            className="font-semibold text-brand-primary transition-colors hover:text-brand-hover"
          >
            Create one
          </Link>
        </p>

        <p className="mt-12 text-center text-ui-caption text-text-muted">
          JobPulse — Never miss a job posting
        </p>
      </div>
    </div>
  );
}
