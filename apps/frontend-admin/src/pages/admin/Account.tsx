import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function Account() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Account</h1>
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">This is a dummy page for managing your account settings.</p>
        </CardContent>
      </Card>
    </div>
  );
}
