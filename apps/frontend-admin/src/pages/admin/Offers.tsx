import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function Offers() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Offers</h1>
      <Card>
        <CardHeader>
          <CardTitle>Manage Offers</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">This is a dummy page for managing promotional offers.</p>
        </CardContent>
      </Card>
    </div>
  );
}
