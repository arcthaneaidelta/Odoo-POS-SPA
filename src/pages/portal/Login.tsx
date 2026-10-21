import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { BrandLogo } from '../../components/BrandLogo';
import { Button } from '../../components/ui/Button';
import { TextField, CheckboxField } from '../../components/ui/Fields';
import { useDemo } from '../../state/DemoProvider';
import { DEMO_CREDENTIALS } from '../../content/brand';
import { useToast } from '../../components/ui/Toast';

export default function Login() {
  const { dispatch } = useDemo();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [email, setEmail] = useState('alex.morgan@havenwell-demo.test');
  const [password, setPassword] = useState('demo-access');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const errs: Record<string, string> = {};
    if (!email.trim()) errs.email = 'Please enter your email.';
    if (!password) errs.password = 'Please enter your password.';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      dispatch({ type: 'LOGIN', role: 'client' });
      toast({ tone: 'success', title: 'Welcome, Alex', message: 'Entering your client space.' });
      navigate('/portal/dashboard');
    }, 700);
  };

  const handleQuickClient = () => {
    setEmail(DEMO_CREDENTIALS.client.email);
    setPassword(DEMO_CREDENTIALS.client.password);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      dispatch({ type: 'LOGIN', role: 'client' });
      toast({ tone: 'success', title: 'Welcome, Alex', message: 'Demo client session started.' });
      navigate('/portal/dashboard');
    }, 400);
  };

  const handleQuickAdmin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      dispatch({ type: 'LOGIN', role: 'admin' });
      toast({ tone: 'info', title: 'Operations View', message: 'Signed in as Care Coordinator.' });
      navigate('/admin');
    }, 400);
  };

  return (
    <div className="login-page">
      <div className="login-card card">
        <div className="login-header">
          <Link to="/" aria-label="Havenwell Home">
            <BrandLogo />
          </Link>
          <h1 className="login-title">Sign in to your client space</h1>
          <p className="login-subtitle">
            Private, non-clinical care management navigation portal.
          </p>
        </div>

        {/* Quick Demo Access banner */}
        <div className="demo-access-box">
          <div className="demo-access-badge">
            <ShieldCheck size={14} />
            <span>Interactive Demo Prototype</span>
          </div>
          <p className="demo-access-text">
            No real credentials required. You can jump directly into either role:
          </p>
          <div className="demo-access-buttons">
            <Button
              variant="secondary"
              size="sm"
              block
              onClick={handleQuickClient}
              loading={loading}
              iconAfter={<ArrowRight size={14} />}
            >
              Sign In as Alex Morgan (Client)
            </Button>
            <Button
              variant="ghost"
              size="sm"
              block
              onClick={handleQuickAdmin}
              disabled={loading}
            >
              Open Operations Dashboard (Admin)
            </Button>
          </div>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="field">
            <TextField
              label="Email address"
              type="email"
              value={email}
              onChange={setEmail}
              error={errors.email}
              placeholder="your.email@example.com"
              suffix={<Mail size={16} className="login-input-icon" />}
            />
          </div>

          <div className="field">
            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={setPassword}
              error={errors.password}
              placeholder="••••••••"
              suffix={
                <button
                  type="button"
                  className="icon-btn icon-btn--sm"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />
          </div>

          <div className="login-options row row--between">
            <CheckboxField
              label={<span className="small">Remember this device</span>}
              checked={remember}
              onChange={setRemember}
            />
            <span className="small muted">Demo credentials prefilled</span>
          </div>

          <div style={{ marginTop: '20px' }}>
            <Button
              type="submit"
              size="lg"
              block
              loading={loading}
              icon={<Lock size={16} />}
            >
              Enter Client Space
            </Button>
          </div>
        </form>

        <div className="login-footer">
          <Link to="/" className="link-btn small">
            ← Return to public website
          </Link>
        </div>
      </div>
    </div>
  );
}
