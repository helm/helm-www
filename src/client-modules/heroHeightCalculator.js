// Hero height calculator client module
function initializeHeroHeightCalculation() {
  // Only run in browser environment
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  // Move hero to outer scope so it's accessible by all functions
  let hero = null;

  function calculateHeroHeight() {
    hero = document.querySelector(".hero");

    if (!hero) {
      // Retry after React components have rendered
      setTimeout(calculateHeroHeight, 100);
      return;
    }

    function updateHeroHeight() {
      // Safety check - hero might have been removed from DOM
      if (!hero) {
        return;
      }

      const vh = window.innerHeight;
      const navbar = document.querySelector(".navbar");
      const navbarHeight = navbar ? navbar.offsetHeight : 0;

      // Check for announcement bar
      const announcementBar = document.querySelector(
        "div.theme-announcement-bar"
      );
      let announcementBarHeight = 0;

      if (announcementBar && announcementBar.offsetHeight > 0) {
        // Only count it if it's visible and has height
        announcementBarHeight = announcementBar.offsetHeight;
      }

      const heroHeight = vh - navbarHeight - announcementBarHeight;

      // Apply the calculated height (with safety check)
      if (hero && hero.style) {
        hero.style.height = `${heroHeight}px`;
        hero.style.minHeight = `${heroHeight}px`;
        hero.style.maxHeight = `${heroHeight}px`;
      }
    }

    // Throttled scroll and resize handler
    let ticking = false;
    function requestTick() {
      if (!ticking) {
        requestAnimationFrame(updateHeroHeight);
        ticking = true;
        setTimeout(() => (ticking = false), 16);
      }
    }

    function handleResize() {
      updateHeroHeight();
    }

    // Event listeners
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", () => {
      setTimeout(handleResize, 100);
    });

    // iOS Safari specific events
    window.addEventListener("pageshow", handleResize);

    // Watch for announcement bar close button clicks
    function observeAnnouncementBar() {
      const announcementBar = document.querySelector("div.theme-announcement-bar");
      if (announcementBar) {
        const closeButton = announcementBar.querySelector("button");
        if (closeButton) {
          closeButton.addEventListener("click", () => {
            // Delay recalculation to allow DOM to update after close animation
            setTimeout(handleResize, 300);
          });
        }
      }
    }

    // Set up announcement bar observer
    observeAnnouncementBar();

    // Initial setup with multiple attempts for better compatibility
    updateHeroHeight();
    observeAnnouncementBar();

    // Delayed recalculation for dynamic content
    setTimeout(() => {
      updateHeroHeight();
      observeAnnouncementBar();
    }, 100);
    setTimeout(() => {
      updateHeroHeight();
      observeAnnouncementBar();
    }, 500);
  }

  // Track if we've successfully applied styles
  let stylesApplied = false;

  function ensureHeroStylesApplied() {
    if (!stylesApplied && hero && hero.style.height) {
      stylesApplied = true;
      return true;
    }
    return false;
  }

  // Initialize with multiple strategies to catch hydration
  function initializeHero() {
    calculateHeroHeight();

    // Keep trying until styles are actually applied
    let attempts = 0;
    const checkInterval = setInterval(() => {
      attempts++;
      if (ensureHeroStylesApplied() || attempts > 20) {
        clearInterval(checkInterval);
      } else {
        calculateHeroHeight();
      }
    }, 100);
  }

  // Initialize on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeHero);
  } else {
    initializeHero();
  }

  // Also listen for React hydration completion
  if (typeof window !== 'undefined') {
    // React 18+ hydration
    const reactRoot = document.getElementById('__docusaurus');
    if (reactRoot) {
      // Use MutationObserver to detect when React modifies the DOM
      const observer = new MutationObserver((mutations) => {
        if (window.location.pathname === '/' && !stylesApplied) {
          calculateHeroHeight();
          if (ensureHeroStylesApplied()) {
            observer.disconnect();
          }
        }
      });

      observer.observe(reactRoot, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'style']
      });

      // Disconnect after 5 seconds to prevent memory leaks
      setTimeout(() => observer.disconnect(), 5000);
    }
  }

  // Force scroll to top AFTER browser's scroll restoration
  if (window.location.pathname === '/') {
    // Disable scroll restoration for this page
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    // Multiple attempts to ensure we stay at top
    window.scrollTo(0, 0);
    setTimeout(() => window.scrollTo(0, 0), 0);
    setTimeout(() => window.scrollTo(0, 0), 100);
    setTimeout(() => window.scrollTo(0, 0), 300);
  }

  // Handle Docusaurus route changes
  window.addEventListener('docusaurus:route-did-update', () => {
    if (window.location.pathname === '/') {
      stylesApplied = false;  // Reset for new navigation
      setTimeout(initializeHero, 100);
    }
  });

  // Handle client-side navigation (Docusaurus SPA routing)
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = function() {
    originalPushState.apply(history, arguments);
    setTimeout(() => {
      calculateHeroHeight();
    }, 100);
  };

  history.replaceState = function() {
    originalReplaceState.apply(history, arguments);
    setTimeout(() => {
      calculateHeroHeight();
    }, 100);
  };

  window.addEventListener("popstate", () => {
    setTimeout(() => {
      calculateHeroHeight();
    }, 100);
  });

  // Handle hot module replacement during development
  if (module.hot) {
    module.hot.addStatusHandler((status) => {
      if (status === 'idle') {
        setTimeout(calculateHeroHeight, 200);
      }
    });
  }

  // Alternative: Listen for React's development mode updates
  if (typeof window !== 'undefined' && window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
    const hook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (hook.onCommitFiberRoot) {
      const originalOnCommitFiberRoot = hook.onCommitFiberRoot;
      hook.onCommitFiberRoot = function() {
        originalOnCommitFiberRoot.apply(this, arguments);
        setTimeout(calculateHeroHeight, 100);
      };
    }
  }
}

// Execute immediately when module is imported
initializeHeroHeightCalculation();