$(document).ready(function() {
  // Main header behavior
  var $fixedHeader = $('[data-purpose="fixed-header"]'),
      triggerPos = $('[data-purpose="code-steps"]').offset().top,
      scrolled,
      scrollPos;

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
    if (scrolled) {
      scrolled = false;
      if(scrollPos >= triggerPos) {
        $fixedHeader.addClass('-show');
      } else {
        $fixedHeader.removeClass('-show');
      }

    }
  }, 150);

});

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
