(function () {
  var pathButtons = document.querySelectorAll("[data-path-btn]");
  var pages = document.querySelectorAll("[data-spread]");
  pathButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var path = btn.getAttribute("data-path-btn");
      pathButtons.forEach(function (b) {
        var on = b === btn;
        b.classList.toggle("is-on", on);
        b.setAttribute("aria-pressed", on ? "true" : "false");
      });
      pages.forEach(function (page) {
        page.classList.toggle("is-on", page.getAttribute("data-spread") === path);
      });
    });
  });

  if (!document.body.classList.contains("home")) return;

  var hero = document.getElementById("hero");
  var top = document.querySelector("[data-home-top]");
  var showcase = document.getElementById("showcase");
  if (!hero || !top) return;

  function setSolid(on) {
    top.classList.toggle("is-solid", on);
    document.body.classList.toggle("home-past-hero", on);
  }

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          setSolid(!(entry.isIntersecting && entry.intersectionRatio >= 0.55));
        });
      },
      { threshold: [0.55, 0.75, 0.9] }
    );
    io.observe(hero);
  } else {
    function onScroll() {
      setSolid(window.scrollY > hero.offsetHeight * 0.45);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // Prefer one notch from the hero stage into Showcase without fighting later sections.
  var locking = false;
  window.addEventListener(
    "wheel",
    function (ev) {
      if (locking || !showcase || ev.deltaY <= 0) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      var rect = hero.getBoundingClientRect();
      if (rect.top > -8 && rect.bottom > window.innerHeight * 0.72) {
        ev.preventDefault();
        locking = true;
        showcase.scrollIntoView({ behavior: "smooth", block: "start" });
        window.setTimeout(function () {
          locking = false;
        }, 850);
      }
    },
    { passive: false }
  );
})();
