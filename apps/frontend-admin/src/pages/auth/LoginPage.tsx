import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/hooks/redux';
import { setCredentials } from '@/store/slices/authSlice';
import { useLoginMutation } from '@/store/api/adminApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const result = await login({ email, password }).unwrap();
      
      if (result.resetPasswordRequired) {
        const { tempToken } = result;
        // Store temp token to allow password change, but don't mark as authenticated
        dispatch(setCredentials({ 
          user: { email: result.email } as any, 
          token: tempToken,
          isTemp: true 
        }));
        navigate('/reset-password');
        return;
      }

      const { admin, token } = result;
      dispatch(setCredentials({ user: admin, token }));
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.data?.message || 'Failed to login');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Enter your email and password to access the admin panel
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleLogin}>
        <CardContent className="space-y-4">
          {error && (
            <div className="text-destructive text-sm font-medium text-center">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Password</label>
            </div>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
