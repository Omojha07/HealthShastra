'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { InventoryItem } from '@/types/database';
import { Plus, Package, AlertTriangle, Edit2, Trash2 } from 'lucide-react';

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lowStock, setLowStock] = useState(0);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/inventory');
      if (response.ok) {
        const data = await response.json();
        setItems(data);
        const low = data.filter((item: InventoryItem) => item.quantity <= item.reorder_level).length;
        setLowStock(low);
      }
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this item?')) return;

    try {
      const response = await fetch(`/api/inventory/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setItems(items.filter((i) => i.id !== id));
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const isLowStock = (item: InventoryItem) => item.quantity <= item.reorder_level;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory</h1>
          <p className="text-gray-600 mt-2">Manage medical supplies and equipment</p>
        </div>
        <Link href="/inventory/new">
          <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </Link>
      </div>

      {/* Low Stock Alert */}
      {lowStock > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6 flex items-center gap-4">
            <AlertTriangle className="h-6 w-6 text-orange-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-orange-900">{lowStock} items are running low on stock</p>
              <p className="text-sm text-orange-700">Consider reordering supplies soon</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Inventory Items */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Items ({items.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-gray-500 py-8">Loading...</p>
          ) : items.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No items in inventory</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Item Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 hidden sm:table-cell">Type</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Quantity</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 hidden md:table-cell">Supplier</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm">
                        <div>
                          <p className="font-medium text-gray-900">{item.item_name}</p>
                          <p className="text-xs text-gray-500">{item.id}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm hidden sm:table-cell">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                          {item.item_type.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div>
                          <p className="font-semibold text-gray-900">{item.quantity} {item.unit}</p>
                          <p className="text-xs text-gray-500">Reorder: {item.reorder_level}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm hidden md:table-cell text-gray-600">
                        {item.supplier_name}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {isLowStock(item) ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <AlertTriangle className="h-3 w-3" />
                            Low Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            In Stock
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex gap-2">
                          <Link href={`/inventory/${item.id}`}>
                            <Button variant="outline" size="sm">
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(item.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
