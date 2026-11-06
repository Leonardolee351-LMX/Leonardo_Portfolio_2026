(function () {
  "use strict";
  if (window.__siteLoaderStarted) return;
  window.__siteLoaderStarted = true;

  var MAX_MS = 18000;
  var root = document.documentElement;
  root.classList.add("site-loading");

  function assetBase() {
    var s = document.querySelector('script[src*="site-loader.js"]');
    if (!s) return "";
    var src = s.getAttribute("src") || "";
    // js/site-loader.js → "" ; ../js/site-loader.js → "../"
    if (src.indexOf("../") === 0) return "../";
    return "";
  }

  var base = assetBase();

  function ensureDom() {
    var el = document.getElementById("site-loader");
    if (el) return el;
    el = document.createElement("div");
    el.id = "site-loader";
    el.setAttribute("role", "status");
    el.setAttribute("aria-live", "polite");
    el.setAttribute("aria-busy", "true");
    el.innerHTML =
      '<img class="site-loader-mark" src="' +
      base +
      'media/brand/leonardo-icon-white.svg" alt="" width="160" height="36" />' +
      '<p class="site-loader-label">Loading</p>' +
      '<div class="site-loader-bar" aria-hidden="true"><i></i></div>';
    document.body
      ? document.body.appendChild(el)
      : document.addEventListener("DOMContentLoaded", function () {
          document.body.appendChild(el);
        });
    return el;
  }

  var loader = ensureDom();
  if (!document.body) {
    document.addEventListener("DOMContentLoaded", function () {
      loader = ensureDom();
    });
  }

  function waitImg(img) {
    if (!img || !img.getAttribute("src")) return Promise.resolve();
    if (img.complete && img.naturalWidth > 0) return Promise.resolve();
    return new Promise(function (resolve) {
      var done = function () {
        resolve();
      };
      img.addEventListener("load", done, { once: true });
      img.addEventListener("error", done, { once: true });
    });
  }

  function fetchOk(url) {
    return fetch(url, { method: "GET", cache: "force-cache", credentials: "same-origin" })
      .then(function (r) {
        return r.blob();
      })
      .then(function () {})
      .catch(function () {});
  }

  function waitIframe(frame) {
    if (!frame) return Promise.resolve();
    return new Promise(function (resolve) {
      var done = function () {
        resolve();
      };
      if (frame.dataset && frame.dataset.loaded === "1") return resolve();
      frame.addEventListener("load", done, { once: true });
      frame.addEventListener("error", done, { once: true });
      // already complete?
      try {
        if (frame.contentDocument && frame.contentDocument.readyState === "complete") {
          resolve();
        }
      } catch (e) {
        /* cross-origin ok */
      }
    });
  }

  function criticalTasks() {
    var tasks = [];

    // fonts
    if (document.fonts && document.fonts.ready) {
      tasks.push(document.fonts.ready.catch(function () {}));
    }

    // in-document images (skip tiny tracking)
    var imgs = document.images ? Array.prototype.slice.call(document.images) : [];
    imgs.forEach(function (img) {
      var src = img.currentSrc || img.getAttribute("src") || "";
      if (!src || src.indexOf("data:") === 0) return;
      tasks.push(waitImg(img));
    });

    // stylesheets
    Array.prototype.forEach.call(document.styleSheets || [], function () {});
    Array.prototype.forEach.call(document.querySelectorAll('link[rel="stylesheet"]'), function (link) {
      if (link.sheet) return;
      tasks.push(
        new Promise(function (resolve) {
          link.addEventListener("load", resolve, { once: true });
          link.addEventListener("error", resolve, { once: true });
        })
      );
    });

    // Cover 3D models (home)
    if (document.body && document.body.classList.contains("home")) {
      ["hero-glass.glb", "hero-cat.glb", "hero-hashbrown.glb"].forEach(function (name) {
        tasks.push(fetchOk(base + "experiments/cover-models/models/" + name));
      });
      var modelFrame = document.querySelector(
        'iframe.hero-models-frame, iframe[src*="cover-models"]'
      );
      if (modelFrame) tasks.push(waitIframe(modelFrame));
    }

    // About drift / lanyard iframes
    document.querySelectorAll("iframe.about-drift-frame, iframe.about-lanyard-frame").forEach(function (f) {
      tasks.push(waitIframe(f));
    });

    // Attunia purpose embed (external) — only wait load event, not all remote assets
    document.querySelectorAll(".prototype-demo iframe, .embed-frame iframe").forEach(function (f) {
      tasks.push(waitIframe(f));
    });

    return tasks;
  }

  var dismissed = false;
  function dismiss() {
    if (dismissed) return;
    dismissed = true;
    root.classList.remove("site-loading");
    var el = document.getElementById("site-loader");
    if (el) {
      el.setAttribute("data-done", "1");
      el.setAttribute("aria-busy", "false");
      window.setTimeout(function () {
        if (el && el.parentNode) el.parentNode.removeChild(el);
      }, 520);
    }
  }

  function run() {
    loader = ensureDom();
    var tasks = criticalTasks();
    var safety = window.setTimeout(dismiss, MAX_MS);
    Promise.allSettled(tasks).then(function () {
      // brief paint settle for decoded bitmaps / GL upload
      window.setTimeout(function () {
        window.clearTimeout(safety);
        dismiss();
      }, 120);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
