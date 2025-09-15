// Responsive mobile navigation menu

document.addEventListener('DOMContentLoaded', function() {
    // Create hamburger button
    const nav = document.querySelector('.navbar');
    const navLinks = document.querySelector('.nav-links');
    if (!nav || !navLinks) return;

    const hamburger = document.createElement('button');
    hamburger.className = 'hamburger';
    hamburger.setAttribute('aria-label', 'Open navigation menu');
    hamburger.innerHTML = '<span></span><span></span><span></span>';
    nav.insertBefore(hamburger, navLinks);

    hamburger.addEventListener('click', function() {
        navLinks.classList.toggle('nav-open');
        hamburger.classList.toggle('is-active');
    });

    // Close menu on link click (mobile)
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            navLinks.classList.remove('nav-open');
            hamburger.classList.remove('is-active');
        });
    });

    // Optional: close menu on outside click
    document.addEventListener('click', function(e) {
        if (!nav.contains(e.target)) {
            navLinks.classList.remove('nav-open');
            hamburger.classList.remove('is-active');
        }
    });
});

// Add mobile styles via JS if not present in CSS
(function() {
    const style = document.createElement('style');
    style.innerHTML = `
    .hamburger {
        display: none;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 44px;
        height: 44px;
        background: none;
        border: none;
        cursor: pointer;
        z-index: 2001;
        margin-right: 8px;
    }
    .hamburger span {
        display: block;
        width: 28px;
        height: 3px;
        margin: 4px 0;
        background: var(--primary);
        border-radius: 2px;
        transition: all 0.3s;
    }
    .hamburger.is-active span:nth-child(1) {
        transform: translateY(7px) rotate(45deg);
    }
    .hamburger.is-active span:nth-child(2) {
        opacity: 0;
    }
    .hamburger.is-active span:nth-child(3) {
        transform: translateY(-7px) rotate(-45deg);
    }
    @media (max-width: 900px) {
        .hamburger { display: flex; }
        .nav-links {
            position: absolute;
            top: 70px;
            right: 24px;
            background: var(--glass-bg);
            box-shadow: var(--shadow);
            border-radius: var(--radius);
            flex-direction: column;
            align-items: flex-end;
            gap: 0;
            padding: 18px 24px 18px 24px;
            display: none;
            min-width: 180px;
        }
        .nav-links.nav-open {
            display: flex;
        }
        .nav-links li {
            margin: 0 0 18px 0;
        }
        .nav-links li:last-child {
            margin-bottom: 0;
        }
    }
    `;
    document.head.appendChild(style);
})();
