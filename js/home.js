(function () {
  var buttons = document.querySelectorAll("[data-path-btn]");
  var pages = document.querySelectorAll("[data-spread]");
  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var path = btn.getAttribute("data-path-btn");
      buttons.forEach(function (b) {
        var on = b === btn;
        b.classList.toggle("is-on", on);
        b.setAttribute("aria-pressed", on ? "true" : "false");
      });
      pages.forEach(function (page) {
        page.classList.toggle("is-on", page.getAttribute("data-spread") === path);
      });
    });
  });
})();
