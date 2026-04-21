# Styles Structure

This folder follows the **7-1 SCSS architecture pattern** (simplified version).

## Folder Organization

```
styles/
├── abstracts/          # Variables, mixins, functions
│   ├── _variables.scss # Color palette, spacing, sizing
│   └── _mixins.scss    # Reusable SCSS mixins
├── base/               # Base/global styles
│   ├── _css-variables.scss  # CSS custom properties for theming
│   └── _base.scss      # HTML element defaults
└── components/         # Component-specific styles
    ├── _buttons.scss   # Button overrides
    ├── _inputs.scss    # Input & dropdown overrides
    └── _editor.scss    # Quill editor overrides
```

## File Naming Convention

- Partial files start with underscore: `_variables.scss`
- Main entry file has no underscore: `index.scss`

## Import Order (in index.scss)

1. **Tailwind** - Base utility framework
2. **Abstracts** - Variables and mixins (no CSS output)
3. **Base** - CSS variables and element defaults
4. **Components** - Component overrides and styles

## Usage Examples

### Using Variables

```scss
// In any component file
.my-component {
  color: $primary-color;
  padding: $padding-standard;
  border-radius: $border-radius;
}
```

### Using Mixins

```scss
// Focus state
.my-input {
  &:focus {
    @include focus-state;
  }
}

// Input base styles
.custom-input {
  @include input-base;
  // Add custom styles here
}
```

### Adding New Component Styles

1. Create `_component-name.scss` in `components/`
2. Import it in `src/index.scss`
3. Use variables and mixins from abstracts

## Why This Structure?

- ✅ **Maintainable** - Easy to find and update specific styles
- ✅ **Reusable** - Variables and mixins used across components
- ✅ **Scalable** - Add new components without cluttering
- ✅ **DRY** - No color/spacing duplication
- ✅ **Clear** - Logical organization by purpose
