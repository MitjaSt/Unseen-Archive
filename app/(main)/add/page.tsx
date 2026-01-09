"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Editor } from 'primereact/editor';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { ColorPicker } from 'primereact/colorpicker';
import { Chip } from 'primereact/chip';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { addItem, clearCategoryFromItems } from '@/lib/store/itemsSlice';
import { addCategory, removeCategory } from '@/lib/store/categoriesSlice';
import { z } from 'zod';

// Zod validation schemas
const linkSchema = z.object({
  type: z.literal('link'),
  link: z.string().min(1, { message: 'Link is required' }).refine((val) => {
    try {
      new URL(val);
      return true;
    } catch {
      return false;
    }
  }, { message: 'Please enter a valid URL (e.g., https://example.com)' }),
  note: z.string().optional(),
});

const noteSchema = z.object({
  type: z.literal('note'),
  note: z.string().min(1, { message: 'Note is required' }),
});

const itemSchema = z.discriminatedUnion('type', [linkSchema, noteSchema]);

export default function Add() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.categories.categories || []);

  const typeOptions = {
    link: { label: 'Link', value: 'link' },
    note: { label: 'Note', value: 'note' }
  };

  const [type, setType] = useState<string>(typeOptions.link.value);
  const [link, setLink] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [linkError, setLinkError] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);

  // Category management states
  const [showCategoryDialog, setShowCategoryDialog] = useState<boolean>(false);
  const [newCategoryName, setNewCategoryName] = useState<string>('');
  const [newCategoryColor, setNewCategoryColor] = useState<string>('1976D2');

  const validateAndSubmit = (navigateToList: boolean) => {
    // Validate with Zod
    const result = itemSchema.safeParse({
      type,
      link: type === 'link' ? link : undefined,
      note: type === 'note' ? note : undefined,
    });

    if (!result.success) {
      // Extract error messages
      const errors = result.error.flatten().fieldErrors;
      if ('link' in errors && errors.link && errors.link[0]) {
        setLinkError(errors.link[0]);
      }
      return false;
    }

    // Dispatch item to Redux store
    dispatch(addItem({
      type: type as 'link' | 'note',
      link: type === 'link' ? link : undefined,
      note: type === 'note' ? note : undefined,
      categoryId,
    }));

    // Reset form after submit
    setType(typeOptions.link.value);
    setLink('');
    setNote('');
    setLinkError('');
    setCategoryId(undefined);

    if (navigateToList) {
      router.push('/list');
    }

    return true;
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      dispatch(addCategory({
        name: newCategoryName.trim(),
        color: newCategoryColor,
      }));
      setNewCategoryName('');
      setNewCategoryColor('1976D2');
      setShowCategoryDialog(false);
    }
  };

  const handleDeleteCategory = (id: string) => {
    dispatch(removeCategory(id));
    dispatch(clearCategoryFromItems(id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    validateAndSubmit(true);
  };

  const handleSubmitAndAddAnother = (e: React.MouseEvent) => {
    e.preventDefault();
    validateAndSubmit(false);
  };

  const handleCancel = () => {
    router.push('/list');
  };

  const renderHeader = () => {
    return (
        <span className="ql-formats">
            <button className="ql-bold" aria-label="Bold" />
            <button className="ql-italic" aria-label="Italic" />
            <button className="ql-underline" aria-label="Underline" />
        </span>
    );
  };

  const header = renderHeader();

  const categoryOptions = categories.map(cat => ({
    label: cat.name,
    value: cat.id,
    color: cat.color,
  }));

  const categoryItemTemplate = (option: { label: string; value: string; color: string }) => {
    return (
      <div className="flex items-center gap-2">
        <div
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: `#${option.color}` }}
        />
        <span>{option.label}</span>
      </div>
    );
  };

  const categoryValueTemplate = (option: { label: string; value: string; color: string } | null) => {
    if (!option) return <span>Select a category</span>;
    return (
      <div className="flex items-center gap-2">
        <div
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: `#${option.color}` }}
        />
        <span>{option.label}</span>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-coffee-bean border-b-2 border-scarlet-fire pb-2">Add New Item</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">Type</label>
          <Dropdown
            id="type"
            value={type}
            options={Object.values(typeOptions)}
            onChange={(e) => setType(e.value)}
            placeholder="Select a type"
            className="w-full"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category (Optional)</label>
            <Button
              type="button"
              label="Manage Categories"
              icon="pi pi-cog"
              className="p-button-sm p-button-text"
              onClick={() => setShowCategoryDialog(true)}
            />
          </div>
          <Dropdown
            id="category"
            value={categoryId}
            options={categoryOptions}
            onChange={(e) => setCategoryId(e.value)}
            placeholder="Select a category"
            className="w-full"
            itemTemplate={categoryItemTemplate}
            valueTemplate={categoryValueTemplate}
            showClear
          />
        </div>

        {type === 'link' && (
          <div>
            <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-2">Link</label>
            <InputText
              id="link"
              value={link}
              onChange={(e) => {
                setLink(e.target.value);
                setLinkError('');
              }}
              placeholder="Enter link URL (e.g., https://example.com)"
              className={`w-full ${linkError ? 'p-invalid' : ''}`}
            />
            {linkError && (
              <small className="text-red-600 block mt-1">{linkError}</small>
            )}
          </div>
        )}

        {type === 'note' && (
          <div>
            <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-2">Note</label>
            <Editor
              value={note}
              onTextChange={(e) => setNote(e.htmlValue || '')}
              style={{ height: '200px' }}
              headerTemplate={header}
              placeholder="Enter your note here..."
            />
          </div>
        )}

        <div className="flex justify-between gap-4">
          <Button type="button" label="Cancel" icon="pi pi-times" className="p-button-secondary" onClick={handleCancel} />
          <div className="flex gap-4">
            <Button type="button" label="Submit & Add Another" icon="pi pi-plus" className="p-button-success" onClick={handleSubmitAndAddAnother} />
            <Button type="submit" label="Submit" icon="pi pi-check" className="p-button-primary" />
          </div>
        </div>
      </form>

      {/* Category Management Dialog */}
      <Dialog
        header="Manage Categories"
        visible={showCategoryDialog}
        style={{ width: '500px' }}
        onHide={() => setShowCategoryDialog(false)}
      >
        <div className="space-y-4">
          {/* Add New Category Section */}
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold mb-3">Add New Category</h3>
            <div className="flex flex-col gap-3">
              <div>
                <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name
                </label>
                <InputText
                  id="categoryName"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Enter category name"
                  className="w-full"
                />
              </div>
              <div>
                <label htmlFor="categoryColor" className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
                <div className="flex items-center gap-3">
                  <ColorPicker
                    id="categoryColor"
                    value={newCategoryColor}
                    onChange={(e) => setNewCategoryColor(e.value as string)}
                    format="hex"
                  />
                  <div
                    className="w-8 h-8 rounded border"
                    style={{ backgroundColor: `#${newCategoryColor}` }}
                  />
                  <span className="text-sm text-gray-600">#{newCategoryColor}</span>
                </div>
              </div>
              <Button
                label="Add Category"
                icon="pi pi-plus"
                onClick={handleAddCategory}
                className="w-full"
                disabled={!newCategoryName.trim()}
              />
            </div>
          </div>

          {/* Existing Categories Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Existing Categories</h3>
            {categories.length === 0 ? (
              <p className="text-gray-500 text-sm">No categories yet. Add one above!</p>
            ) : (
              <div className="space-y-2">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-2 border rounded hover:bg-gray-50"
                  >
                    <Chip
                      label={category.name}
                      style={{
                        backgroundColor: `#${category.color}`,
                        color: '#ffffff',
                      }}
                    />
                    <Button
                      icon="pi pi-trash"
                      className="p-button-rounded p-button-danger p-button-text p-button-sm"
                      onClick={() => handleDeleteCategory(category.id)}
                      aria-label="Delete category"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Dialog>
    </div>
  );
}