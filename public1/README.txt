ADMIN CENTER SPLIT — LIGHT/DARK FIXED

Files:
- admin-center.html: central administration dashboard
- users-management.html: users and wallets
- categories-management.html: categories tree
- recharge-cards.html: card inventory and import
- products-cards.html: redirects old links to admin-center.html
- theme.js: shared theme logic and persistent theme selection
- theme.css: complete dark/light overrides for Tailwind utility colors

Keep these existing project files beside them:
- config.js
- auth.js

Theme details:
- Uses localStorage key: zouzou_theme
- First visit follows device preference
- The selected theme is shared across all admin pages
- The existing theme button icon and label update automatically
