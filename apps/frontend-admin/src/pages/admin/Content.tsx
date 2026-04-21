import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function Content() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Content</h1>
      <Card>
        <CardHeader>
          <CardTitle>Manage Content</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">This is a dummy page for managing web application content.</p>
        </CardContent>
      </Card>
    </div>
  );
}
