ZOUZOU THEME FIX

Files included:
- index.html
- groups.html
- years.html
- group-builder.html
- login.html
- theme.js
- theme.css

Important:
Keep all files in the same folder.
The theme preference is stored under localStorage key: zouzou_theme
The theme script now applies BOTH:
- html[data-theme="light|dark"]
- html.light-mode / html.dark-mode
This keeps old inline light-mode rules and the shared theme stylesheet compatible.
