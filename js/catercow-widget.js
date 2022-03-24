(function (d) {
  script = d.createElement("script");

  script.type = "text/javascript";
  script.setAttribute("defer", "");
  script.setAttribute("crossorigin", "anonymous");

  script.onload = function () {
    if (window.CC_WIDGET) {
      window.CC_WIDGET.init();
    }
  };

  script.src = "https://catercow.s3.us-east-1.amazonaws.com/widget.js";
  d.getElementsByTagName("head")[0].appendChild(script);
})(document);
