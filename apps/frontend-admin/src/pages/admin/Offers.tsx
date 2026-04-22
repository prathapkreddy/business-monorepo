import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useGetAllOffersQuery } from '@/store/api/adminApi';
import {Button} from "@/components/ui/button.tsx";
import {Badge} from "lucide-react";

interface Offer {
  id: string;
  title: string;
  subtitle: string;
  code: string;
  color: string;
  createdAt: string;
  details?: {
    content: any;
  } | null;
}

export default function Offers() {
  const { data: offers = [], isLoading, error } = useGetAllOffersQuery(undefined);

  if (isLoading) return <div className="p-8">Loading offers...</div>;
  if (error) {
    const errorData = error as any;
    return <div className="p-8 text-destructive">{errorData.data?.message || 'Failed to load offers'}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Offers</h1>
        <Button onClick={() => alert('Create offer logic would go here')}>Create Offer</Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {offers.map((offer) => (
          <Card key={offer.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{offer.title}</CardTitle>
                <div 
                  className="w-4 h-4 rounded-full border" 
                  style={{ backgroundColor: offer.color }} 
                  title={offer.color}
                />
              </div>
              <p className="text-sm text-muted-foreground">{offer.subtitle}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Code:</span>
                <Badge variant="secondary" className="font-mono">{offer.code}</Badge>
              </div>
              {offer.details && (
                <div className="text-xs bg-muted p-2 rounded max-h-[100px] overflow-auto">
                  <pre>{JSON.stringify(offer.details.content, null, 2)}</pre>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        {offers.length === 0 && (
          <p className="text-muted-foreground col-span-full text-center py-8">
            No promotional offers found.
          </p>
        )}
      </div>
    </div>
  );
}
