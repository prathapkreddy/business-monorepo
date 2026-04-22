import { useState, useMemo } from 'react';
import {
  useGetAllContentQuery,
  useSaveContentMutation,
} from '@/store/api/adminApi';
import { Button } from '@/components/ui/button';
import { Edit2, ArrowLeft, ChevronDown, ChevronRight, Calendar } from 'lucide-react';

interface ContentItem {
  id: string;
  pageName: string;
  section: string;
  content: any;
  updatedAt: string;
}

export default function Content() {
  const {
    data: contentItems = [],
    isLoading,
    error,
    refetch,
  } = useGetAllContentQuery(undefined);
  const [saveContent, { isLoading: isSaving }] = useSaveContentMutation();

  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [editValue, setEditValue] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const groupedContent = useMemo(() => {
    return contentItems.reduce((acc, item) => {
      if (!acc[item.pageName]) {
        acc[item.pageName] = [];
      }
      acc[item.pageName].push(item);
      return acc;
    }, {} as Record<string, ContentItem[]>);
  }, [contentItems]);

  const toggleGroup = (pageName: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [pageName]: !prev[pageName],
    }));
  };

  const handleEdit = (item: ContentItem) => {
    setEditingItem(item);
    setEditValue(JSON.stringify(item.content, null, 2));
    setValidationError(null);
  };

  const handleCancel = () => {
    setEditingItem(null);
    setEditValue('');
    setValidationError(null);
  };

  const handleSave = async () => {
    if (!editingItem) return;

    // Validate JSON
    let parsedContent;
    try {
      parsedContent = JSON.parse(editValue);
      setValidationError(null);
    } catch (e: any) {
      setValidationError(`Invalid JSON: ${e.message}`);
      return;
    }

    try {
      await saveContent({
        id: editingItem.id,
        content: parsedContent,
      }).unwrap();
      setEditingItem(null);
      refetch();
    } catch (err: any) {
      alert(err.data?.message || 'Failed to save content');
    }
  };

  if (isLoading) return <div className="p-8">Loading content...</div>;
  if (error) {
    const errorData = error as any;
    return (
      <div className="p-8 text-destructive">
        {errorData.data?.message || 'Failed to load content'}
      </div>
    );
  }

  // Full screen edit mode
  if (editingItem) {
    return (
      <div className="flex h-full flex-col space-y-4">
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={handleCancel}>
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Edit Content</h1>
              <p className="text-sm text-muted-foreground">
                {editingItem.pageName} - {editingItem.section}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>

        <div className="flex flex-1 flex-col space-y-2 overflow-hidden">
          <label className="text-sm font-medium">Content (JSON)</label>
          <textarea
            className="flex-1 rounded-md border bg-muted p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            spellCheck={false}
          />
          {validationError && (
            <p className="text-sm font-medium text-destructive">
              {validationError}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Content Management</h1>
      </div>

      <div className="space-y-4">
        {Object.entries(groupedContent).map(([pageName, items]) => (
          <div key={pageName} className="rounded-lg border bg-card">
            <button
              onClick={() => toggleGroup(pageName)}
              className="flex w-full items-center justify-between p-4 transition-colors hover:bg-muted/50"
            >
              <div className="flex items-center gap-3">
                {expandedGroups[pageName] ? (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                )}
                <span className="text-lg font-semibold capitalize">{pageName}</span>
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                  {items.length} sections
                </span>
              </div>
            </button>

            {expandedGroups[pageName] && (
              <div className="border-t">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted/30 text-muted-foreground">
                    <tr>
                      <th className="p-4 font-medium">Section Name</th>
                      <th className="p-4 font-medium">Last Updated</th>
                      <th className="p-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {items.map((item) => (
                      <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                        <td className="p-4 font-medium">{item.section}</td>
                        <td className="p-4 text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar size={14} />
                            {new Date(item.updatedAt).toLocaleDateString()} {new Date(item.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center gap-2 ml-auto"
                            onClick={() => handleEdit(item)}
                          >
                            <Edit2 size={16} />
                            Edit
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}

        {contentItems.length === 0 && (
          <div className="rounded-md border p-8 text-center text-muted-foreground">
            No content found.
          </div>
        )}
      </div>
    </div>
  );
}
