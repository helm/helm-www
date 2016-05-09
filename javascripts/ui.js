(function () {
  $(document).ready(function() {
    var $fixedHeader,
        triggerPos,
        scrolled,
        scrollPos,
        mentionPos,
        reachedBottom;
    /**
     * Register click events for each 'class="ga-track"' element
     */
    $('.ga-track').click(function (event) {
      var category = $(this).data('click-category'),
          label;
      if (category) {
        // Custom label foo for click events on <a> elements
        if ($(this).prop('nodeName') === 'A') {
          label = $(this).attr('href');
        }
        sendGa(category, label);
      }
    });

    /**
     * Special foo for tweets because the twitters asynchronously insert stuff into the DOM
     */
    $('.tweet').bind('DOMNodeInserted', function (event) {
      var category = $(this).data('click-category');

      $('.tweet').click(function (event) {
        if (category) {
          sendGa(category);
        }
      });
    });

    /**
     * Register a click event for the 'id="get-helmc-sh"' element
     */
    $('#get-helmc-sh').click(function (event) {
      selectElement(this);
    });

    // Main header behavior
    $fixedHeader = $('[data-purpose="fixed-header"]');
    triggerPos = $('[data-purpose="code-steps"]').offset().top;
    mentionPos = $('section.mentions').offset().top;

    $(window).scroll(function() {
      scrollPos = $(this).scrollTop();
      scrolled = true;
    });

    if (window.matchMedia) {
      centerLogo();
    }

    $(window).on("orientationchange", function (event) {
      centerLogo();
    });

    setInterval(function() {
      // show and hide the '-show' class, engaging the logo menu drop-down
      if (scrolled) {
        scrolled = false;
        if (scrollPos >= triggerPos) {
          $fixedHeader.addClass('-show');
        } else {
          $fixedHeader.removeClass('-show');
        }
      }

      // send a 'scrolled-to-tweets' event if the user has scrolled that far down
      // if the mentions section is not visible, we'll have a 0 (falsy) value here
      // we'll also falsify it once we've scrolled past it once
      if (mentionPos) {
        if (scrollPos >= mentionPos) {
          mentionPos = false;
          sendGa('scrolled-to-tweets');
        }
      }

      // send a 'scrolled-to-bottom' event if the user has scrolled all the way down
      if (!reachedBottom) {
        if ($(window).scrollTop() + $(window).height() === $(document).height()) {
          reachedBottom = true;
          sendGa('scrolled-to-bottom');
        }
      }
    }, 150);

  });

  window.onload = function () {
    var easter_egg = new Konami('https://www.youtube.com/watch?v=7SqC_m3yUDU');
  };

  function centerLogo () {
    var logoQuery = '[data-purpose="logo"]',
      logoContainerWidth = $('.main-header > .container').css('width'),
      logoWidth = $(logoQuery).css('width'),
      logoHeaderSpace = parseInt(logoContainerWidth, 10) - parseInt(logoWidth, 10);

    if (window.matchMedia("(max-device-width: 414px)").matches) {
      $(logoQuery).css('margin-left', (logoHeaderSpace / 2));
    }
  }


  function selectElement (elem) {
    var range = typeof document.createRange === "function" ? document.createRange() : null;
    if (range) {
      range.selectNode(elem);
      if (typeof window.getSelection === "function") {
        window.getSelection().addRange(range);
      }
    }
  }

  function sendGa (category, label) {
    if (ga) {
      ga('send', {
        hitType: 'event',
        eventCategory: category,
        eventAction: 'click',
        eventLabel: label
      });
    } else {
      console.log('ga not loaded!');
    }
  }
}());
