// Hero height calculator client module
function initializeHeroHeightCalculation() {
  // Only run in browser environment
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  function calculateHeroHeight() {
    const hero = document.querySelector(".hero");

    if (!hero) {
      // Retry after React components have rendered
      setTimeout(calculateHeroHeight, 100);
      return;
    }

    function updateHeroHeight() {
      const vh = window.innerHeight;
      const navbar = document.querySelector(".navbar");
      const navbarHeight = navbar ? navbar.offsetHeight : 88; // fallback to 88px

      const announcementBar = document.querySelector("div.theme-announcement-bar");
      const announcementBarHeight = announcementBar ? announcementBar.offsetHeight : 0;

      const heroHeight = vh - navbarHeight - announcementBarHeight;

      hero.style.height = `${heroHeight}px`;
      hero.style.minHeight = `${heroHeight}px`;
      hero.style.maxHeight = `${heroHeight}px`;

      console.log("Hero height calculation:", {
        vh,
        navbarHeight,
        announcementBarHeight,
        heroHeight,
      });
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

  // Initialize on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', calculateHeroHeight);
  } else {
    calculateHeroHeight();
  }

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