$(document).ready(function() {

  $(document).foundation();

  // Registers a jQuery method "textMetrics"
  // which calculates the height and width of a text string
  (function($) {
    $.textMetrics = function(el) {
      var h = 0, w = 0;
      var div = document.createElement('div');

      document.body.appendChild(div);
      $(div).css({
        position: 'absolute',
        left: -1000,
        top: -1000,
        display: 'none'
      });

      $(div).html($(el).html());
      var styles = ['font-size','font-style', 'font-weight',
        'font-family','line-height', 'text-transform', 'letter-spacing'];
      $(styles).each(function() {
        var s = this.toString();
        $(div).css(s, $(el).css(s));
      });

      h = $(div).outerHeight();
      w = $(div).outerWidth();

      $(div).remove();

      return {
        height: h,
        width: w
      };
    }
  })(jQuery);

  // show the contact form
  $('#about-mailto').click( function() {
    $(this).hide();
    $('#contact-form').slideToggle();
  });

  // tweetable quotes
  $("blockquote").each(function() {
    if( $(this).is(':contains("Tweet this")')) {
      var tweetcopy = $(this).text().replace('Tweet this', '');
      var linkurl = window.location.href;
      var tweeturl = '//twitter.com/intent/tweet?text=' + tweetcopy + '&via=opendeis&url=' + linkurl;

      $(this).html('<a href="' + tweeturl + '" target=_blank" class="tweet-quote"><p>' + tweetcopy + '<i class="fa fa-twitter"><i></p></a>');
    };
  });

  // top navigation levels
  $("#toggleLevels").hover( function() {
    $(".top-bar").addClass('active');
  });
  $("#closeLevels").click(function() {
    $(".top-bar").removeClass('active');
  });
});


// lazy load youtube embeds via data-src
var vidDefer = document.getElementsByTagName('iframe');
function videoLoad() {
  for (var i=0; i<vidDefer.length; i++) {
    if(vidDefer[i].getAttribute('data-src')) {
      vidDefer[i].setAttribute('src',vidDefer[i].getAttribute('data-src'));
    }
  }
};
window.onload = videoLoad;


// use headroom.js for sticky topbar
(function() {
  var searchBar = document.querySelector(".top-bar");
  new Headroom(searchBar, {
    offset: 50,
    classes: {
      "initial": "headroom",
      "pinned": "headroom--pinned",
      "unpinned": "headroom--unpinned",
      "top" : "headroom--top",
      "notTop" : "headroom--not-top"
    },
    onUnpin: function() {
      $(".top-bar").removeClass('active');
      $(".f-dropdown").removeClass('f-open-dropdown').removeClass('open');
    }
  }).init();
}());
