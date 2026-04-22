import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/hooks/redux';
import { logout } from '@/store/slices/authSlice';
import { useChangePasswordMutation } from '@/store/api/adminApi';
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

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword === '0000') {
        setError('Please choose a different password from the default');
        return;
    }

    try {
      await changePassword({ 
          currentPassword: '0000', 
          newPassword 
      }).unwrap();
      
      setSuccess(true);
      // Wait a bit then logout and redirect to login
      setTimeout(() => {
        dispatch(logout());
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      setError(err.data?.message || 'Failed to reset password');
    }
  };

  if (success) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Success</CardTitle>
          <CardDescription>
            Your password has been reset successfully. Redirecting to login...
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reset Password</CardTitle>
        <CardDescription>
          You are using the default password. Please set a new password to continue.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleReset}>
        <CardContent className="space-y-4">
          {error && (
            <div className="text-destructive text-sm font-medium text-center">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <label className="text-sm font-medium">New Password</label>
            <Input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Confirm New Password</label>
            <Input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
