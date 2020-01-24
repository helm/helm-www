$(document).ready(function() {
  $(document).foundation();

  // custom theme js for sidebar links
  var allClosed;

  // close all accordions, besides that of the page that is currently active
  var doclocation = window.location.pathname;
  var docpath = doclocation.substring(0, doclocation.lastIndexOf("/"));
  var parentName = docpath.replace(/\/[^\/]+$/, '')
  var pageName = docpath.substring(docpath.lastIndexOf("/")+1);
  $(".toctree-l1 > a[href*='" + parentName + "']").addClass("active");
  $(".toctree-12 > a[href$='" + pageName + "/']").addClass("active");

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


//Navbar Clone
if ($('.navbar-top-fixed').length) {
  $(window).scroll(function() {    // this will work when your window scrolled.
      var height = $(window).scrollTop();  //getting the scrolling height of window
      if(height  > 200) {
          $(".navbar-top-fixed").addClass('is-active');
      } else{
          $(".navbar-top-fixed").removeClass('is-active');
      }
  });
}

//Navbar mobile burger menu (bulma)
$(".navbar-burger").click(function() {
  $(".navbar-burger").toggleClass("is-active");
  $(".navbar-menu").toggleClass("is-active");
  $("#banner").toggleClass("is-active");
  $(".sidebar-wrapper").toggleClass("is-active");
});

// a life at sea
if ($('.home').length) {
  $(window).scroll(function() {    // this will work when your window scrolled.
      var height = $(window).scrollTop();  //getting the scrolling height of window
      if(height  > 600) {
        $(".boat").addClass('boat-badge');
      } else{
        $(".boat").removeClass('boat-badge');
      }
  });
};

// adjust docs sidebar after scroll
if ($('.page-docs').length) {
  $(window).scroll(function() {    // this will work when your window scrolled.
      var height = $(window).scrollTop();  //getting the scrolling height of window
      if(height  > 50) {
        $(".sidebar").addClass('is-scrolled');
      } else{
        $(".sidebar").removeClass('is-scrolled');
      }
  });
}

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