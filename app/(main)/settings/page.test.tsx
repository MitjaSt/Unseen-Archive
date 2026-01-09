import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Settings from './page';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import itemsReducer from '@/lib/store/itemsSlice';
import categoriesReducer from '@/lib/store/categoriesSlice';
import listPageReducer from '@/lib/store/listPageSlice';

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

// Helper to render with Redux store
const renderWithStore = (component: React.ReactElement, initialState = {}) => {
  const store = createTestStore(initialState);
  return {
    ...render(<Provider store={store}>{component}</Provider>),
    store,
  };
};

describe('Settings Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the settings page with all sections', () => {
      renderWithStore(<Settings />);

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
            { id: '1', type: 'link' as const, link: 'https://example.com', createdAt: '2024-01-01' },
            { id: '2', type: 'note' as const, note: 'Test note', createdAt: '2024-01-02' },
          ],
        },
        categories: {
          categories: [
            { id: '1', name: 'Work', color: 'FF0000', createdAt: '2024-01-01' },
            { id: '2', name: 'Personal', color: '00FF00', createdAt: '2024-01-02' },
          ],
        },
      };

      renderWithStore(<Settings />, initialState);

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
            { id: '1', type: 'link', link: 'https://example.com', createdAt: '2024-01-01' },
          ],
        },
        categories: {
          categories: [
            { id: '1', name: 'Work', color: 'FF0000', createdAt: '2024-01-01' },
          ],
        },
      };

      renderWithStore(<Settings />, initialState);

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
            { id: '1', type: 'link' as const, link: 'https://example.com', createdAt: '2024-01-01' },
          ],
        },
        categories: {
          categories: [
            { id: '1', name: 'Work', color: 'FF0000', createdAt: '2024-01-01' },
          ],
        },
      };

      renderWithStore(<Settings />, initialState);

      const exportButton = screen.getByRole('button', { name: /export data/i });
      expect(exportButton).toBeInTheDocument();
      expect(exportButton).toBeEnabled();
    });
  });

  describe('Import Functionality', () => {
    it('should render import section with file upload', () => {
      renderWithStore(<Settings />);

      expect(screen.getByRole('heading', { name: 'Import Data' })).toBeInTheDocument();
      expect(screen.getByText(/Upload a previously exported JSON file/i)).toBeInTheDocument();
      expect(screen.getByText(/Warning: This will replace all existing data/i)).toBeInTheDocument();

      // Check that FileUpload component is present
      const fileInput = document.querySelector('input[type="file"]');
      expect(fileInput).toBeInTheDocument();
      expect(fileInput).toHaveAttribute('accept', 'application/json');
    });

    it('should show warning message about data replacement', () => {
      renderWithStore(<Settings />);

      const warningText = screen.getByText(/Warning: This will replace all existing data/i);
      expect(warningText).toBeInTheDocument();
      expect(warningText).toHaveClass('text-red-600');
    });
  });
});
