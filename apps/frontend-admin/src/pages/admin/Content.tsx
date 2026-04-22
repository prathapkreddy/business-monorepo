import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGetAllContentQuery, useUpdateContentMutation } from '@/store/api/adminApi';

interface ContentItem {
  id: string;
  pageName: string;
  section: string;
  content: any;
  updatedAt: string;
}

export default function Content() {
  const { data: contentItems = [], isLoading, error } = useGetAllContentQuery(undefined);
  const [updateContent] = useUpdateContentMutation();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleUpdate = async (id: string) => {
    try {
      let parsedContent;
      try {
        parsedContent = JSON.parse(editValue);
      } catch (e) {
        parsedContent = editValue;
      }
      
      await updateContent({ id, content: parsedContent }).unwrap();
      setEditingId(null);
    } catch (err: any) {
      alert(err.data?.message || 'Failed to update content');
    }
  };

  if (isLoading) return <div className="p-8">Loading content...</div>;
  if (error) {
    const errorData = error as any;
    return <div className="p-8 text-destructive">{errorData.data?.message || 'Failed to load content'}</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Content</h1>
      <div className="grid gap-6">
        {contentItems.map((item) => (
          <Card key={item.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">
                  {item.pageName} - {item.section}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Last updated: {new Date(item.updatedAt).toLocaleString()}
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setEditingId(item.id);
                  setEditValue(JSON.stringify(item.content, null, 2));
                }}
              >
                Edit
              </Button>
            </CardHeader>
            <CardContent>
              {editingId === item.id ? (
                <div className="space-y-4">
                  <textarea
                    className="w-full min-h-[200px] p-2 border rounded font-mono text-sm"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button onClick={() => handleUpdate(item.id)}>Save Changes</Button>
                    <Button variant="ghost" onClick={() => setEditingId(null)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-[200px] text-sm font-mono">
                  {JSON.stringify(item.content, null, 2)}
                </pre>
              )}
            </CardContent>
          </Card>
        ))}
        {contentItems.length === 0 && (
          <p className="text-muted-foreground">No content found.</p>
        )}
      </div>
    </div>
  );
}
