Smart Sidebar
==========================

jquery plugin used to convert an element in a sidebar that follow the scroll in the right way, even when sidebar is higher than viewport.


Usage
=========================
You need to call the `smartSidebar` method over the element that you want to became your sidebar.

```js
$('#your-sidebar-element').smartSidebar();
```

###You can define the position by css:

If the header and footer are always visibles:

```css
    .sidebar-rail {
      margin-top: 80px; // header height
      margin-bottom: 120px; // footer height
    }
```

If the site header is always visible and the footer is on the end of scroll:

```css
    .sidebar-rail {
      margin-top: 80px; // header height
    }
    .sidebar-rail .bottom-offset {
      height: 120px; // footer height
    }
```

If the header is auto-hide sticky, and the footer is on the end of the scroll:

```css
    .sidebar-rail .top-offset {
      height: 80px; // header height
    }
    .sidebar-rail .bottom-offset {
      height: 120px; // footer height
    }
```
