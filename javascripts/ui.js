$(document).ready(function() {

  // Main header behavior
  var $fixedHeader = $('[data-purpose="fixed-header"]');
  var triggerPos = $('[data-purpose="code-steps"]').offset().top;
  var scrolled;
  var scrollPos;

  $(window).scroll(function() {
    scrollPos = $(this).scrollTop();
    scrolled = true;
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
