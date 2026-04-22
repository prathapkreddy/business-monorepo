import { useState } from 'react';
import { useGetAllServicesQuery, useUpdateServiceMutation } from '@/store/api/adminApi';
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Edit2, ArrowLeft, Star, Tag, Calendar, Plus, X } from "lucide-react";

interface Service {
  id: string;
  name: string;
  category: string;
  price: number;
  mrp: number;
  rating: number;
  icon?: string | null;
  image?: string | null;
  color?: string | null;
  updatedAt: string;
  details?: {
    content: any;
    updatedAt: string;
  } | null;
}

export default function Services() {
  const { data: services = [], isLoading, error, refetch } = useGetAllServicesQuery(undefined);
  const [updateService, { isLoading: isUpdating }] = useUpdateServiceMutation();

  const [editingItem, setEditingItem] = useState<Service | null>(null);
  const [editValue, setEditValue] = useState('');
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editImage, setEditImage] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editMrp, setEditMrp] = useState('');
  const [editRating, setEditRating] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [showCreatePopup, setShowCreatePopup] = useState(false);

  const handleEdit = (service: Service) => {
    setEditingItem(service);
    setEditValue(JSON.stringify(service.details?.content || {}, null, 2));
    setEditName(service.name);
    setEditCategory(service.category);
    setEditImage(service.image || '');
    setEditPrice(service.price.toString());
    setEditMrp(service.mrp.toString());
    setEditRating(service.rating.toString());
    setValidationError(null);
  };

  const handleCancel = () => {
    setEditingItem(null);
    setEditValue('');
    setEditName('');
    setEditCategory('');
    setEditImage('');
    setEditPrice('');
    setEditMrp('');
    setEditRating('');
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
      await updateService({
        id: editingItem.id,
        name: editName,
        category: editCategory,
        image: editImage,
        price: parseFloat(editPrice),
        mrp: parseFloat(editMrp),
        rating: parseFloat(editRating),
        details: parsedContent,
      }).unwrap();
      setEditingItem(null);
      refetch();
    } catch (err: any) {
      alert(err.data?.message || 'Failed to update service');
    }
  };

  if (isLoading) return <div className="p-8">Loading services...</div>;
  if (error) {
    const errorData = error as any;
    return <div className="p-8 text-destructive">{errorData.data?.message || 'Failed to load services'}</div>;
  }

  if (editingItem) {
    return (
      <div className="flex h-full flex-col space-y-4">
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={handleCancel}>
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Edit Service</h1>
              <p className="text-sm text-muted-foreground">{editingItem.name}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel} disabled={isUpdating}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isUpdating}>
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Service Name</label>
            <Input 
              value={editName} 
              onChange={(e) => setEditName(e.target.value)} 
              placeholder="Service Name"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <Input 
              value={editCategory} 
              onChange={(e) => setEditCategory(e.target.value)} 
              placeholder="Category"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Image URL</label>
            <Input 
              value={editImage} 
              onChange={(e) => setEditImage(e.target.value)} 
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Price</label>
            <Input 
              type="number"
              value={editPrice} 
              onChange={(e) => setEditPrice(e.target.value)} 
              placeholder="Price"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">MRP</label>
            <Input 
              type="number"
              value={editMrp} 
              onChange={(e) => setEditMrp(e.target.value)} 
              placeholder="MRP"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Rating</label>
            <Input 
              type="number"
              step="0.1"
              value={editRating} 
              onChange={(e) => setEditRating(e.target.value)} 
              placeholder="Rating"
            />
          </div>
        </div>

        <div className="flex flex-1 flex-col space-y-2 overflow-hidden mt-4">
          <label className="text-sm font-medium">Service Details (JSON)</label>
          <textarea
            className="flex-1 rounded-md border bg-muted p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary min-h-[300px]"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            spellCheck={false}
          />
          {validationError && (
            <p className="text-sm font-medium text-destructive">{validationError}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Services</h1>
        <Button onClick={() => setShowCreatePopup(true)} className="flex items-center gap-2">
          <Plus size={18} />
          Create Service
        </Button>
      </div>

      {showCreatePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-card p-6 shadow-lg border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Create New Service</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowCreatePopup(false)}>
                <X size={20} />
              </Button>
            </div>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                This is a dummy popup for creating a new service. Full implementation coming soon.
              </p>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowCreatePopup(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowCreatePopup(false)}>
                  Create (Dummy)
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-md border bg-card">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              <th className="p-4 font-medium">Service</th>
              <th className="p-4 font-medium">Category</th>
              <th className="p-4 font-medium">Price</th>
              <th className="p-4 font-medium">Rating</th>
              <th className="p-4 font-medium">Last Edited</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {services.map((service) => {
              const lastEdited = service.details?.updatedAt && new Date(service.details.updatedAt) > new Date(service.updatedAt)
                ? service.details.updatedAt
                : service.updatedAt;

              return (
                <tr key={service.id} className="hover:bg-muted/20 transition-colors">
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-base">{service.name}</span>
                      <span className="text-xs text-muted-foreground font-mono">{service.id}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 capitalize">
                      <Tag size={14} className="text-muted-foreground" />
                      {service.category}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-primary">₹{service.price}</span>
                      <span className="text-xs text-muted-foreground line-through">₹{service.mrp}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <Star size={14} className="fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{service.rating}</span>
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      {new Date(lastEdited).toLocaleDateString()} {new Date(lastEdited).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex items-center gap-2 ml-auto"
                      onClick={() => handleEdit(service)}
                    >
                      <Edit2 size={16} />
                      Edit
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {services.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            No services found.
          </div>
        )}
      </div>
    </div>
  );
}
