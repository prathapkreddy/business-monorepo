import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGetProfileQuery, useChangePasswordMutation } from '@/store/api/adminApi';

export default function Account() {
  const { data: profile, isLoading, error } = useGetProfileQuery(undefined);
  const [changePassword, { isLoading: isUpdating }] = useChangePasswordMutation();
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    try {
      await changePassword({ currentPassword, newPassword }).unwrap();
      setMessage({ type: 'success', text: 'Password updated successfully' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setMessage({ type: 'error', text: err.data?.message || 'Failed to update password' });
    }
  };

  if (isLoading) return <div className="p-8">Loading profile...</div>;
  if (error) {
    const errorData = error as any;
    return <div className="p-8 text-destructive">{errorData.data?.message || 'Failed to load profile'}</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Account</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="font-medium text-muted-foreground">Name</div>
              <div>{profile?.name || 'Not provided'}</div>
              
              <div className="font-medium text-muted-foreground">Email</div>
              <div>{profile?.email}</div>
              
              <div className="font-medium text-muted-foreground">Role</div>
              <div>{profile?.role}</div>
              
              <div className="font-medium text-muted-foreground">Account Created</div>
              <div>{profile ? new Date(profile.createdAt).toLocaleDateString() : ''}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              {message && (
                <div className={`text-sm font-medium ${message.type === 'success' ? 'text-green-600' : 'text-destructive'}`}>
                  {message.text}
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium">Current Password</label>
                <Input 
                  type="password" 
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">New Password</label>
                <Input 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Confirm New Password</label>
                <Input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required 
                />
              </div>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? 'Updating...' : 'Update Password'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
