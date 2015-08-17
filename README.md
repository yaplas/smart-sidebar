Smart Sidebar
==========================

jquery plugin used to convert an element in a sidebar that follow the scroll in the right way, even when sidebar is higher than viewport.


Usage
=========================
You need to call the `smartSidebar` method over the element that you want to became your sidebar.

```js
$('#your-sidebar-element').smartSidebar();
```

#You can define the position by css:

If the site header is always visible and the footer appear just at the end of scroll:

```css
    .sidebar-rail {
      top: 80px; // header height
    }
    .sidebar-rail .bottom-offset {
      height: 120px; // footer height
    }
```

If the header and footer is always visible: 

```css
    .sidebar-rail {
      top: 80px; // header height
      bottom: 120px; // footer height
    }

```
