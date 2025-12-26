import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Lock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const Login: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 500));

    const result = login(password);
    
    if (result.success) {
      toast.success(`Welcome! Logged in as ${result.role}`);
      if (result.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/employee');
      }
    } else {
      setError('Invalid password. Please try again.');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-[40%] -top-[40%] h-[80%] w-[80%] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-[40%] -right-[40%] h-[80%] w-[80%] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <Card className="relative w-full max-w-md animate-scale-in border-border/50 shadow-xl">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl gradient-hero shadow-lg">
            <Users className="h-8 w-8 text-primary-foreground" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold tracking-tight">
              Employee Management
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter your password to access the portal
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="pl-10 bg-card border-border focus:border-primary focus:ring-primary/20"
                  autoComplete="current-password"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              className="w-full gradient-hero py-6 text-base font-semibold shadow-lg transition-all hover:opacity-90 hover:shadow-xl"
              disabled={isLoading || !password}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </Button>

            <div className="space-y-3 rounded-lg bg-secondary/50 p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Demo Credentials
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Admin:</span>
                  <code className="rounded bg-muted px-2 py-1 font-mono text-xs">admin1234</code>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Employee:</span>
                  <code className="rounded bg-muted px-2 py-1 font-mono text-xs">1234</code>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      
      {/* Trademark */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
        <p className="text-xs text-muted-foreground/70">
          Developed by Krishna Agarwaal
        </p>
      </div>
    </div>
  );
};

export default Login;
