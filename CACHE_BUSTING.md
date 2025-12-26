# Cache Busting Guide

## Problem

When deploying changes to GitHub Pages or any static website, browsers often cache CSS and JavaScript files aggressively. This means users may not see your latest changes immediately because their browser serves the old cached files instead of fetching the new ones from the server.

## Solution

We've implemented **cache busting** using version query parameters on all static asset references.

### What We Changed

1. **Added Cache Control Meta Tags**
   - Added meta tags to both `index.html` and `dashboard.html` to discourage aggressive caching
   - These tags help but may not work in all browsers/scenarios

2. **Version Query Parameters**
   - All CSS and JavaScript references now include a version parameter
   - Example: `styles.css?v=1.0.1` instead of `styles.css`
   - When the version changes, browsers treat it as a different file and fetch the new version

### Current Version

Current asset version: **v1.0.1**

### When to Update the Version

Update the version parameter whenever you make changes to:
- `styles.css` - CSS styling changes
- `auth.js` - Authentication logic changes  
- `dashboard.js` - Dashboard functionality changes

### How to Update the Version

1. **Decide on new version number**
   - For minor changes: increment the patch version (1.0.1 → 1.0.2)
   - For feature additions: increment the minor version (1.0.1 → 1.1.0)
   - For major changes: increment the major version (1.0.1 → 2.0.0)

2. **Update all references**
   
   In `index.html`:
   ```html
   <link rel="stylesheet" href="styles.css?v=NEW_VERSION">
   <script src="auth.js?v=NEW_VERSION"></script>
   ```
   
   In `dashboard.html`:
   ```html
   <link rel="stylesheet" href="styles.css?v=NEW_VERSION">
   <script src="dashboard.js?v=NEW_VERSION"></script>
   ```

3. **Commit and push changes**
   ```bash
   git add index.html dashboard.html
   git commit -m "Update asset version to vNEW_VERSION"
   git push
   ```

### Alternative: Automated Version Bumping

For more automation, you could:
1. Use the version from `package.json`
2. Create a build script that automatically updates version references
3. Use a template engine to inject versions dynamically

### Testing

After deployment to GitHub Pages:
1. Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)
2. Check the Network tab in Developer Tools
3. Verify that CSS and JS files are loaded with the new version parameter
4. Confirm your changes are visible

### Additional Notes

- Version changes force browsers to download fresh files
- Users will automatically get the latest version on their next visit
- No need to manually clear browser cache
- Consider syncing version numbers with `package.json` version for consistency
