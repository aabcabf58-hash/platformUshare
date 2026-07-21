(function () {
    const STORAGE_KEY = 'zouzou_color_theme';

    function normalizeTheme(value) {
        return value === 'light' ? 'light' : 'dark';
    }

    function getCurrentTheme() {
        return document.documentElement.classList.contains(
            'light-mode'
        )
            ? 'light'
            : 'dark';
    }

    function updateThemeButtons() {
        const isLight = getCurrentTheme() === 'light';

        document
            .querySelectorAll('[data-theme-toggle]')
            .forEach((button) => {
                const icon = button.querySelector(
                    '[data-theme-icon]'
                );

                const label = button.querySelector(
                    '[data-theme-label]'
                );

                button.setAttribute(
                    'aria-label',
                    isLight
                        ? 'Switch to dark mode'
                        : 'Switch to light mode'
                );

                button.title = isLight
                    ? 'Switch to dark mode'
                    : 'Switch to light mode';

                if (icon) {
                    icon.className = isLight
                        ? 'fa-solid fa-moon'
                        : 'fa-solid fa-sun';
                }

                if (label) {
                    label.textContent = isLight
                        ? 'Dark Mode'
                        : 'Light Mode';
                }
            });
    }

    function applyTheme(theme, persist = true) {
        const finalTheme = normalizeTheme(theme);
        const isLight = finalTheme === 'light';

        document.documentElement.classList.toggle(
            'light-mode',
            isLight
        );

        document.documentElement.classList.toggle(
            'dark-mode',
            !isLight
        );

        document.documentElement.dataset.theme = finalTheme;

        if (persist) {
            try {
                localStorage.setItem(
                    STORAGE_KEY,
                    finalTheme
                );
            } catch (error) {
                console.error(
                    'Unable to save theme preference:',
                    error
                );
            }
        }

        updateThemeButtons();
    }

    function toggleTheme() {
        applyTheme(
            getCurrentTheme() === 'light'
                ? 'dark'
                : 'light'
        );
    }

    let savedTheme = 'dark';

    try {
        savedTheme = normalizeTheme(
            localStorage.getItem(STORAGE_KEY)
        );
    } catch (error) {
        console.error(
            'Unable to read theme preference:',
            error
        );
    }

    window.toggleTheme = toggleTheme;
    window.applyZouzouTheme = applyTheme;

    // Apply before the page body is painted to reduce flashing.
    applyTheme(savedTheme, false);

    if (document.readyState === 'loading') {
        document.addEventListener(
            'DOMContentLoaded',
            updateThemeButtons
        );
    } else {
        updateThemeButtons();
    }
})();
