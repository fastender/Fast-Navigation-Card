# Fast Navigation Card

A custom card for Home Assistant that provides a flexible navigation bar that can be positioned at the top, bottom or as a sidebar.

## Features

- Three positioning options: top, bottom, and sidebar
- Responsive design
- Automatic alignment with main content
- Supports grid layout for navigation buttons

## Installation

### HACS (Recommended)
1. In HACS, click on "Frontend" section
2. Click the menu icon in the upper right and select "Custom repositories"
3. Add this repository URL and select "Lovelace" as category
4. Click "Install"

### Manual Installation
1. Download `fast-navigation-card.js`
2. Copy it to your `www` folder
3. Add it as a resource in your Lovelace configuration:
```yaml
resources:
  - url: /local/fast-navigation-card.js
    type: module
```

## Usage

```yaml
type: custom:fast-navigation-card
position: top  # Options: 'top', 'bottom', 'sidebar'
card:
  type: grid
  square: false
  columns: 5
  cards:
    - type: custom:button-card
      # ... your button configuration
```

## Options

| Name | Type | Default | Description |
|------|------|---------|-------------|
| position | string | 'top' | Position of the navigation bar. Options: 'top', 'bottom', 'sidebar' |
```

