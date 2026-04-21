import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function Services() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Services</h1>
      <Card>
        <CardHeader>
          <CardTitle>Manage Services</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">This is a dummy page for managing business services.</p>
        </CardContent>
      </Card>
    </div>
  );
}
