(function() {
  var fonts = [
    "//fonts.googleapis.com/css?family=Inconsolata",
    "//fonts.googleapis.com/css?family=Source+Sans+Pro",
    "//code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css"
  ];
  fonts.forEach(function (font) {
    var link = document.createElement('link');
    link.rel = "stylesheet";
    link.href = font;
    document.querySelector("head").appendChild(link);
  });
})();