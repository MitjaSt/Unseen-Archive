import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SettingsPage from './SettingsPage';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import itemsReducer from '@/lib/store/itemsSlice';
import categoriesReducer from '@/lib/store/categoriesSlice';
import listPageReducer from '@/lib/store/listPageSlice';
import { ItemType } from '@/lib/types/item';
import { BrowserRouter } from 'react-router-dom';

// Mock URL.createObjectURL and revokeObjectURL
global.URL.createObjectURL = vi.fn(() => 'mock-url');
global.URL.revokeObjectURL = vi.fn();

// Helper to create a test store with initial state
const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      items: itemsReducer,
      categories: categoriesReducer,
      listPage: listPageReducer,
    },
    preloadedState: initialState,
  });
};

// Helper to render with Redux store and Router
const renderWithStore = (component: React.ReactElement, initialState = {}) => {
  const store = createTestStore(initialState);
  return {
    ...render(
      <Provider store={store}>
        <BrowserRouter>
          {component}
        </BrowserRouter>
      </Provider>
    ),
    store,
  };
};

describe('Settings Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the settings page with all sections', () => {
      renderWithStore(<SettingsPage />);

      expect(screen.getByText('Settings')).toBeInTheDocument();
      expect(screen.getByText('Data Overview')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Export Data' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Import Data' })).toBeInTheDocument();
      expect(screen.getByText('Storage Information')).toBeInTheDocument();
    });

    it('should display correct item and category counts', () => {
      const initialState = {
        items: {
          items: [
            { id: '1', type: ItemType.LINK, link: 'https://example.com', createdAt: '2024-01-01' },
            { id: '2', type: ItemType.NOTE, note: 'Test note', createdAt: '2024-01-02' },
          ],
        },
        categories: {
          categories: [
            { id: '1', name: 'Work', color: 'FF0000', createdAt: '2024-01-01' },
            { id: '2', name: 'Personal', color: '00FF00', createdAt: '2024-01-02' },
          ],
        },
      };

      renderWithStore(<SettingsPage />, initialState);

      const counts = screen.getAllByText('2');
      expect(counts.length).toBeGreaterThanOrEqual(2); // Both item and category counts
    });
  });

  describe('Export Functionality', () => {
    it('should export data when export button is clicked', async () => {
      const user = userEvent.setup();
      const mockClick = vi.fn();
      const mockAppendChild = vi.spyOn(document.body, 'appendChild');
      const mockRemoveChild = vi.spyOn(document.body, 'removeChild');

      // Mock createElement to return an element with our mock click
      const originalCreateElement = document.createElement.bind(document);
      vi.spyOn(document, 'createElement').mockImplementation((tagName) => {
        const element = originalCreateElement(tagName);
        if (tagName === 'a') {
          element.click = mockClick;
        }
        return element;
      });

      const initialState = {
        items: {
          items: [
            { id: '1', type: ItemType.LINK, link: 'https://example.com', createdAt: '2024-01-01' },
          ],
        },
        categories: {
          categories: [
            { id: '1', name: 'Work', color: 'FF0000', createdAt: '2024-01-01' },
          ],
        },
      };

      renderWithStore(<SettingsPage />, initialState);

      const exportButton = screen.getByRole('button', { name: /export data/i });
      await user.click(exportButton);

      expect(mockAppendChild).toHaveBeenCalled();
      expect(mockClick).toHaveBeenCalled();
      expect(mockRemoveChild).toHaveBeenCalled();
      expect(global.URL.createObjectURL).toHaveBeenCalled();
      expect(global.URL.revokeObjectURL).toHaveBeenCalled();

      await waitFor(() => {
        expect(screen.getByText('Export Successful')).toBeInTheDocument();
      });
    });

    it('should export button be present and clickable', () => {
      const initialState = {
        items: {
          items: [
            { id: '1', type: ItemType.LINK, link: 'https://example.com', createdAt: '2024-01-01' },
          ],
        },
        categories: {
          categories: [
            { id: '1', name: 'Work', color: 'FF0000', createdAt: '2024-01-01' },
          ],
        },
      };

      renderWithStore(<SettingsPage />, initialState);

      const exportButton = screen.getByRole('button', { name: /export data/i });
      expect(exportButton).toBeInTheDocument();
      expect(exportButton).toBeEnabled();
    });

    it('should export valid JSON with correct structure', async () => {
      const user = userEvent.setup();
      let capturedBlobData: string | null = null;

      // Mock Blob constructor
      const OriginalBlob = global.Blob;
      // @ts-expect-error - Mocking Blob constructor
      global.Blob = class MockBlob extends OriginalBlob {
        constructor(content: BlobPart[], options?: BlobPropertyBag) {
          super(content, options);
          if (content[0] && typeof content[0] === 'string') {
            capturedBlobData = content[0];
          }
        }
      };

      const initialState = {
        items: {
          items: [
            { id: '1', type: ItemType.LINK, link: 'https://example.com', createdAt: '2024-01-01' },
            { id: '2', type: ItemType.NOTE, note: 'Test note', createdAt: '2024-01-02' },
          ],
        },
        categories: {
          categories: [
            { id: '1', name: 'Work', color: 'FF0000', createdAt: '2024-01-01' },
            { id: '2', name: 'Personal', color: '00FF00', createdAt: '2024-01-02' },
          ],
        },
      };

      renderWithStore(<SettingsPage />, initialState);

      const exportButton = screen.getByRole('button', { name: /export data/i });
      await user.click(exportButton);

      // Wait for export to complete
      await waitFor(() => {
        expect(capturedBlobData).not.toBeNull();
      });

      // Validate JSON structure
      expect(capturedBlobData).not.toBeNull();
      const exportedData = JSON.parse(capturedBlobData!);

      // Check that all required keys exist
      expect(exportedData).toHaveProperty('items');
      expect(exportedData).toHaveProperty('categories');
      expect(exportedData).toHaveProperty('exportDate');
      expect(exportedData).toHaveProperty('version');

      // Check that items array is correct
      expect(Array.isArray(exportedData.items)).toBe(true);
      expect(exportedData.items).toHaveLength(2);
      expect(exportedData.items[0]).toHaveProperty('id');
      expect(exportedData.items[0]).toHaveProperty('type');
      expect(exportedData.items[0]).toHaveProperty('createdAt');

      // Check that categories array is correct
      expect(Array.isArray(exportedData.categories)).toBe(true);
      expect(exportedData.categories).toHaveLength(2);
      expect(exportedData.categories[0]).toHaveProperty('id');
      expect(exportedData.categories[0]).toHaveProperty('name');
      expect(exportedData.categories[0]).toHaveProperty('color');

      // Check version
      expect(exportedData.version).toBe('1.0');

      // Restore original Blob
      global.Blob = OriginalBlob;
    });
  });

  describe('Import Functionality', () => {
    it('should render import section with file upload', () => {
      renderWithStore(<SettingsPage />);

      expect(screen.getByRole('heading', { name: 'Import Data' })).toBeInTheDocument();
      expect(screen.getByText(/Upload a previously exported JSON file/i)).toBeInTheDocument();
      expect(screen.getByText(/Warning: This will replace all existing data/i)).toBeInTheDocument();

      // Check that FileUpload component is present
      const fileInput = document.querySelector('input[type="file"]');
      expect(fileInput).toBeInTheDocument();
      expect(fileInput).toHaveAttribute('accept', 'application/json');
    });

    it('should show warning message about data replacement', () => {
      renderWithStore(<SettingsPage />);

      const warningText = screen.getByText(/Warning: This will replace all existing data/i);
      expect(warningText).toBeInTheDocument();
      expect(warningText).toHaveClass('text-red-600');
    });
  });
});
