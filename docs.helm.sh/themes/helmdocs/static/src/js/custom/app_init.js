$(document).ready(function() {
  $(document).foundation();

  // custom theme js for sidebar links
  var allClosed;

  // close all accordions, besides that of the page that is currently active
  var doclocation = window.location.pathname;
  var docpath = doclocation.substring(0, doclocation.lastIndexOf("/"));
  var directoryName = docpath.substring(docpath.lastIndexOf("/")+1);
  $(".toctree-l1 > a[href='" + directoryName + "']").addClass('active').attr({state: "open"});

  if (allClosed === true) { }

  // if menu is closed when clicked, expand it
  $('.toctree-l1 > a').click(function() {

    //Make the titles of open accordions dead links
    if ($(this).attr('state') == 'open') {return false;}

    //Clicking on a title of a closed accordion
    if($(this).attr('state') != 'open' && $(this).siblings().size() > 0) {
      $('.toctree-l1 > ul').hide();
      $('.toctree-l1 > a').attr('state', '');
      $(this).attr('state', 'open');
      $(this).next().slideDown(function(){});
      return false;
    }
  });
}); // document ready


// headroom
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
    }
  }).init();
}());

// add permalinks to titles
$(function() {
  return $("h1, h2, h3, h4, h5, h6").each(function(i, el) {
    var $el, icon, id;
    $el = $(el);
    id = $el.attr('id');
    icon = '<i class="fa fa-link"></i>';
    if (id) {
      return $el.prepend($("<a />").addClass("header-link").attr("href", "#" + id).html(icon));
    }
  });
});

// smooth scroll
$(function() {
  $('a[href*=#]:not([href=#])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html,body').animate({
          scrollTop: target.offset().top
        }, 400);
        // return false;
      }
    }
  });
});
