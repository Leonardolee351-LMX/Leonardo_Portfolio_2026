(function () {
  var links = Array.prototype.slice.call(document.querySelectorAll(".cs-index a"));
  var views = links
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);
  if (!views.length) return;
  var io = new IntersectionObserver(function (entries) {
    var vis = entries
      .filter(function (e) { return e.isIntersecting; })
      .sort(function (a, b) { return b.intersectionRatio - a.intersectionRatio; })[0];
    if (!vis) return;
    links.forEach(function (a) {
      a.classList.toggle("is-now", a.getAttribute("href") === "#" + vis.target.id);
    });
  }, { rootMargin: "-18% 0px -62% 0px", threshold: [0.12, 0.28] });
  views.forEach(function (v) { io.observe(v); });
})();
