

import type { Category } from '@/lib/store/categoriesSlice';
import { addCategory, removeCategory } from '@/lib/store/categoriesSlice';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import type { Item } from '@/lib/store/itemsSlice';
import { addItem, clearItems } from '@/lib/store/itemsSlice';
import { Button } from 'primereact/button';
import { FileUpload, FileUploadHandlerEvent } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';

interface ExportData {
  items: Item[];
  categories: Category[];
  exportDate: string;
  version: string;
}

export default function Settings() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.items.items);
  const categories = useAppSelector((state) => state.categories.categories);
  const toast = useRef<Toast>(null);

  const handleExport = () => {
    const exportData: ExportData = {
      items,
      categories,
      exportDate: new Date().toISOString(),
      version: '1.0',
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `unseen-archive-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.current?.show({
      severity: 'success',
      summary: 'Export Successful',
      detail: 'Your data has been exported successfully',
      life: 3000,
    });
  };

  const handleImport = async (event: FileUploadHandlerEvent) => {
    const file = event.files[0];

    if (!file) {
      toast.current?.show({
        severity: 'error',
        summary: 'Import Failed',
        detail: 'No file selected',
        life: 3000,
      });
      return;
    }

    try {
      const text = await file.text();
      const importData: ExportData = JSON.parse(text);

      // Validate the imported data structure
      if (!importData.items || !Array.isArray(importData.items)) {
        throw new Error('Invalid data format: missing or invalid items array');
      }
      if (!importData.categories || !Array.isArray(importData.categories)) {
        throw new Error('Invalid data format: missing or invalid categories array');
      }

      // Clear existing data
      dispatch(clearItems());

      // Remove all existing categories
      categories.forEach(cat => {
        dispatch(removeCategory(cat.id));
      });

      // Import categories first (so items can reference them)
      importData.categories.forEach(category => {
        dispatch(addCategory({
          name: category.name,
          color: category.color,
        }));
      });

      // Import items
      importData.items.forEach(item => {
        dispatch(addItem({
          type: item.type,
          link: item.link,
          note: item.note,
          categoryId: item.categoryId,
        }));
      });

      toast.current?.show({
        severity: 'success',
        summary: 'Import Successful',
        detail: `Imported ${importData.items.length} items and ${importData.categories.length} categories`,
        life: 5000,
      });
    } catch (error) {
      console.error('Import error:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Import Failed',
        detail: error instanceof Error ? error.message : 'Failed to import data',
        life: 5000,
      });
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Toast ref={toast} />
      <h1 className="text-3xl font-bold mb-6 text-coffee-bean border-b-2 border-glaucous pb-2">
        Settings
      </h1>

      <div className="space-y-6">
        {/* Data Overview */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Data Overview</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-vivid-royal">{items.length}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-600">Total Categories</p>
              <p className="text-2xl font-bold text-scarlet-fire">{categories.length}</p>
            </div>
          </div>
        </div>

        {/* Export Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Export Data</h2>
          <p className="text-gray-600 mb-4">
            Download all your items and categories as a JSON file. You can use this file to backup your data or import it later.
          </p>
          <Button
            label="Export Data"
            icon="pi pi-download"
            onClick={handleExport}
            className="p-button-primary"
          />
        </div>

        {/* Import Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Import Data</h2>
          <p className="text-gray-600 mb-4">
            Upload a previously exported JSON file to restore your data.
            <span className="font-semibold text-red-600"> Warning: This will replace all existing data.</span>
          </p>
          <FileUpload
            mode="basic"
            name="import"
            accept="application/json"
            maxFileSize={10000000}
            customUpload
            uploadHandler={handleImport}
            auto
            chooseLabel="Import Data"
            className="p-button-danger"
          />
        </div>

      </div>
    </div>
  );
}
