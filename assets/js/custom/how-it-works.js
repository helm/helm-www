$(document).ready(function() {
  $('.developers').hover(function() {
    $('.developers > img').attr('src', '/images/how-it-works/dev-left-hover.png');
    $('.graphic > img').attr('src', '/images/how-it-works/dev-right.png');
  }, function() {
    $('.developers > img').attr('src', '/images/how-it-works/dev-left-normal.png');
    $('.graphic > img').attr('src', '/images/how-it-works/normal.png');
  });

  $('.operators').hover(function() {
    $('.operators > img').attr('src', '/images/how-it-works/ops-left-hover.png');
    $('.graphic > img').attr('src', '/images/how-it-works/ops-right.png');
  }, function() {
    $('.operators > img').attr('src', '/images/how-it-works/ops-left-normal.png');
    $('.graphic > img').attr('src', '/images/how-it-works/normal.png');
  });
});
