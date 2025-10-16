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

      const heroHeight = vh - navbarHeight;

      hero.style.height = `${heroHeight}px`;
      hero.style.minHeight = `${heroHeight}px`;
      hero.style.maxHeight = `${heroHeight}px`;

      console.log("Hero height calculation:", {
        vh,
        navbarHeight,
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

    // Initial setup with multiple attempts for better compatibility
    updateHeroHeight();

    // Delayed recalculation for dynamic content
    setTimeout(updateHeroHeight, 100);
    setTimeout(updateHeroHeight, 500);
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
    setTimeout(calculateHeroHeight, 100);
  };

  history.replaceState = function() {
    originalReplaceState.apply(history, arguments);
    setTimeout(calculateHeroHeight, 100);
  };

  window.addEventListener("popstate", () => {
    setTimeout(calculateHeroHeight, 100);
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