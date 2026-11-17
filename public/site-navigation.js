(() => {
    const more = document.querySelector('.site-navigation-more');
    if (!more) return;

    const user = typeof getUser === 'function' ? getUser() : null;
    const token = typeof getToken === 'function' ? getToken() : null;
    const tokenUser = token && typeof parseJwtPayload === 'function'
        ? parseJwtPayload(token)
        : null;
    const role = String(user?.role || tokenUser?.role || '')
        .trim()
        .toLowerCase()
        .replace(/[ -]/g, '_');

    if (role === 'super_admin') {
        more.querySelectorAll('[data-nav-super-admin]').forEach(link => {
            link.hidden = false;
        });
    }

    const summary = more.querySelector('summary');
    const list = more.querySelector('.site-navigation-list');

    list.addEventListener('click', event => {
        if (event.target.closest('a, button')) more.open = false;
    });

    document.addEventListener('click', event => {
        if (more.open && !more.contains(event.target)) more.open = false;
    });

    document.addEventListener('keydown', event => {
        if (event.key !== 'Escape' || !more.open) return;
        event.preventDefault();
        more.open = false;
        summary.focus();
    });
})();
