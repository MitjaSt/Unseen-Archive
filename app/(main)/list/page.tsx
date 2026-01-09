"use client";

import { useAppSelector, useAppDispatch } from '@/lib/store/hooks';
import { removeItem, reorderItems } from '@/lib/store/itemsSlice';
import { setSelectedFilter } from '@/lib/store/listPageSlice';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Chip } from 'primereact/chip';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Sortable Item Component
interface SortableItemProps {
  id: string;
  item: any;
  category: any;
  failedFavicons: Set<string>;
  handleDelete: (id: string) => void;
  handleFaviconError: (url: string) => void;
  getFaviconUrl: (url: string) => string;
  parseLink: (url: string) => { domain: string; path: string };
  truncateText: (html: string) => string;
}

function SortableItem({
  id,
  item,
  category,
  failedFavicons,
  handleDelete,
  handleFaviconError,
  getFaviconUrl,
  parseLink,
  truncateText,
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const cardClassName = category
    ? `shadow-md h-fit [&_.p-card-content]:!p-0 [&_.p-card-body]:!p-3 border-l-4`
    : `shadow-md h-fit [&_.p-card-content]:!p-0 [&_.p-card-body]:!p-3`;

  const cardStyle = category
    ? { borderLeftColor: `#${category.color}` }
    : undefined;

  return (
    <div ref={setNodeRef} style={style}>
      <Card className={cardClassName} style={cardStyle}>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div {...attributes} {...listeners} className="cursor-move">
              {item.type === 'link' && item.link ? (
                failedFavicons.has(item.link) || !getFaviconUrl(item.link) ? (
                  <i className="pi pi-link text-lg text-vivid-royal"></i>
                ) : (
                  <Image
                    src={getFaviconUrl(item.link)}
                    alt={item.link}
                    title={item.link}
                    width={18}
                    height={18}
                    onError={() => handleFaviconError(item.link!)}
                    unoptimized
                  />
                )
              ) : (
                <i className="pi pi-file-edit text-lg text-glaucous"></i>
              )}
            </div>
            <Button
              icon="pi pi-trash"
              className="p-button-rounded p-button-danger p-button-text p-button-sm !w-8 !h-8 !p-0"
              onClick={() => handleDelete(item.id)}
              aria-label="Delete"
            />
          </div>

          <div className="text-sm">
            {item.type === 'link' && item.link && (
              <>
                <div className="text-gray-700 mb-2 break-words">
                  <p className="font-bold">{parseLink(item.link).domain}</p>
                  <p className="text-xs text-gray-500">{parseLink(item.link).path}</p>
                </div>
                <Button
                  label="Visit"
                  icon="pi pi-external-link"
                  className="p-button-sm w-full !py-1 !text-xs"
                  onClick={() => window.open(item.link, '_blank')}
                />
              </>
            )}

            {item.type === 'note' && item.note && (
              <p className="text-gray-700 break-words">{truncateText(item.note)}</p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function List() {
  const items = useAppSelector((state) => state.items.items);
  const categories = useAppSelector((state) => state.categories.categories);
  const selectedFilter = useAppSelector((state) => state.listPage.selectedFilter);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [failedFavicons, setFailedFavicons] = useState<Set<string>>(new Set());
  const [isInitialized, setIsInitialized] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Initialize filter from URL hash on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const hash = window.location.hash;
    if (hash.startsWith('#category=')) {
      const filterValue = decodeURIComponent(hash.replace('#category=', ''));
      dispatch(setSelectedFilter(filterValue));
    }
    setIsInitialized(true);
  }, [dispatch]);

  // Update URL hash when filter changes
  useEffect(() => {
    if (!isInitialized || typeof window === 'undefined') return;

    if (selectedFilter === null) {
      // Remove hash when "All" is selected
      if (window.location.hash) {
        router.push('/list', { scroll: false });
      }
    } else {
      // Set hash to category filter
      const newHash = `#category=${encodeURIComponent(selectedFilter)}`;
      if (window.location.hash !== newHash) {
        router.push(`/list${newHash}`, { scroll: false });
      }
    }
  }, [selectedFilter, isInitialized, router]);

  const getCategoryById = (categoryId?: string) => {
    if (!categoryId) return null;
    return categories.find(cat => cat.id === categoryId);
  };

  const handleFilterChange = (filter: string | null) => {
    dispatch(setSelectedFilter(filter));
  };

  // Filter items based on selected category
  const filteredItems = selectedFilter === null
    ? items // Show all
    : selectedFilter === 'uncategorized'
    ? items.filter(item => !item.categoryId)
    : items.filter(item => item.categoryId === selectedFilter);

  const handleDelete = (id: string) => {
    confirmDialog({
      message: 'Are you sure you want to delete this item?',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'p-button-danger',
      accept: () => {
        dispatch(removeItem(id));
      },
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      dispatch(reorderItems({ oldIndex, newIndex }));
    }
  };

  const handleFaviconError = (url: string) => {
    setFailedFavicons((prev) => new Set(prev).add(url));
  };

  const getFaviconUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=32`;
    } catch {
      return '';
    }
  };

  const parseLink = (url: string) => {
    try {
      const urlObj = new URL(url);
      const rawDomain = urlObj.hostname.replace('www.', '').split('.')[0];
      const domain = rawDomain.charAt(0).toUpperCase() + rawDomain.slice(1);
      const path = urlObj.pathname;
      const truncatedPath = path.length > 50 ? path.substring(0, 50) + '...' : path;

      return { domain, path: truncatedPath };
    } catch {
      return { domain: url, path: '' };
    }
  };

  const truncateText = (html: string) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    const text = tmp.textContent || tmp.innerText || '';
    return text.length > 100 ? text.substring(0, 100) + '...' : text;
  };

  return (
    <div className="p-6">
      <ConfirmDialog />
      <h1 className="text-3xl font-bold mb-6 text-coffee-bean border-b-2 border-glaucous pb-2">List</h1>

      {/* Filter Section */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <Chip
            label="All"
            onClick={() => handleFilterChange(null)}
            className={`cursor-pointer !px-4 ${selectedFilter === null ? '!bg-vivid-royal !text-white' : '!bg-gray-200 hover:!bg-gray-300'}`}
          />
          <Chip
            label="Uncategorized"
            onClick={() => handleFilterChange('uncategorized')}
            className={`cursor-pointer !px-4 ${selectedFilter === 'uncategorized' ? '!bg-vivid-royal !text-white' : '!bg-gray-200 hover:!bg-gray-300'}`}
          />
          {categories.map((category) => (
            <Chip
              key={category.id}
              label={category.name}
              onClick={() => handleFilterChange(category.id)}
              style={
                selectedFilter === category.id
                  ? { backgroundColor: `#${category.color}`, color: '#ffffff' }
                  : undefined
              }
              className={`cursor-pointer !px-4 ${selectedFilter === category.id ? '' : '!bg-gray-200 hover:!bg-gray-300'}`}
            />
          ))}
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={filteredItems.map((item) => item.id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 auto-rows-min">
            {filteredItems.map((item) => {
              const category = getCategoryById(item.categoryId);

              return (
                <SortableItem
                  key={item.id}
                  id={item.id}
                  item={item}
                  category={category}
                  failedFavicons={failedFavicons}
                  handleDelete={handleDelete}
                  handleFaviconError={handleFaviconError}
                  getFaviconUrl={getFaviconUrl}
                  parseLink={parseLink}
                  truncateText={truncateText}
                />
              );
            })}

            {/* Add Item Card */}
            <Link href="/add">
              <Card className="shadow-md h-fit cursor-pointer hover:shadow-lg transition-shadow border-2 border-dashed border-gray-300 hover:border-vivid-royal">
                <div className="flex flex-col items-center justify-center gap-3 py-3">
                  <i className="pi pi-plus text-4xl text-vivid-royal"></i>
                  <span className="text-sm font-medium text-gray-700">Add New Item</span>
                </div>
              </Card>
            </Link>
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}