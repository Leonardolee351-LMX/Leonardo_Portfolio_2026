(function () {
  "use strict";
  if (window.__siteLoaderStarted) return;
  window.__siteLoaderStarted = true;

  var MAX_MS = 20000;
  var CIRC = 2 * Math.PI * 48; // r=48
  var root = document.documentElement;
  root.classList.add("site-loading");

  function assetBase() {
    var s = document.querySelector('script[src*="site-loader.js"]');
    if (!s) return "";
    var src = s.getAttribute("src") || "";
    return src.indexOf("../") === 0 ? "../" : "";
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
    var bgSrc = base + "experiments/cover-models/index.html?v=home37-loader&loader=1";
    el.innerHTML =
      '<iframe id="site-loader-bg" title="" aria-hidden="true" tabindex="-1" src="' +
      bgSrc +
      '"></iframe>' +
      '<div id="site-loader-scrim" aria-hidden="true"></div>' +
      '<div id="site-loader-ui">' +
      '<img class="site-loader-mark" src="' +
      base +
      'media/brand/leonardo-icon-white.svg" alt="" width="140" height="32" />' +
      '<div class="site-loader-ring" aria-hidden="true">' +
      '<svg viewBox="0 0 108 108">' +
      '<circle class="track" cx="54" cy="54" r="48"></circle>' +
      '<circle class="prog" id="site-loader-prog" cx="54" cy="54" r="48"></circle>' +
      "</svg>" +
      '<div class="site-loader-pct" id="site-loader-pct">0%</div>' +
      "</div>" +
      '<p class="site-loader-label">Loading</p>' +
      "</div>";
    (document.body || document.documentElement).appendChild(el);
    return el;
  }

  var loader = null;
  var progEl = null;
  var pctEl = null;
  var doneCount = 0;
  var totalCount = 1;

  function setProgress(done, total) {
    doneCount = done;
    totalCount = Math.max(1, total);
    var p = Math.max(0, Math.min(1, done / totalCount));
    var pct = Math.round(p * 100);
    if (!progEl) progEl = document.getElementById("site-loader-prog");
    if (!pctEl) pctEl = document.getElementById("site-loader-pct");
    if (progEl) progEl.style.strokeDashoffset = String(CIRC * (1 - p));
    if (pctEl) pctEl.textContent = pct + "%";
  }

  function waitImg(img) {
    if (!img) return Promise.resolve();
    if (img.complete && img.naturalWidth > 0) return Promise.resolve();
    return new Promise(function (resolve) {
      img.addEventListener("load", resolve, { once: true });
      img.addEventListener("error", resolve, { once: true });
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
      frame.addEventListener("load", done, { once: true });
      frame.addEventListener("error", done, { once: true });
      try {
        if (frame.contentDocument && frame.contentDocument.readyState === "complete") resolve();
      } catch (e) {}
    });
  }

  function track(promise) {
    return Promise.resolve(promise).then(
      function (v) {
        setProgress(doneCount + 1, totalCount);
        return v;
      },
      function () {
        setProgress(doneCount + 1, totalCount);
      }
    );
  }

  function criticalTasks() {
    var tasks = [];
    if (document.fonts && document.fonts.ready) tasks.push(document.fonts.ready.catch(function () {}));

    var imgs = document.images ? Array.prototype.slice.call(document.images) : [];
    imgs.forEach(function (img) {
      var src = img.currentSrc || img.getAttribute("src") || "";
      if (!src || src.indexOf("data:") === 0) return;
      tasks.push(waitImg(img));
    });

    Array.prototype.forEach.call(document.querySelectorAll('link[rel="stylesheet"]'), function (link) {
      if (link.sheet) return;
      tasks.push(
        new Promise(function (resolve) {
          link.addEventListener("load", resolve, { once: true });
          link.addEventListener("error", resolve, { once: true });
        })
      );
    });

    // Always warm Cover models for home; also used as loader bg
    ["hero-glass.glb", "hero-cat.glb", "hero-hashbrown.glb"].forEach(function (name) {
      tasks.push(fetchOk(base + "experiments/cover-models/models/" + name));
    });
    tasks.push(fetchOk(base + "experiments/cover-models/assets/pixel-blast.js?v=home28b"));

    if (document.body && document.body.classList.contains("home")) {
      var modelFrame = document.querySelector('iframe.hero-models-frame, iframe[src*="cover-models"]');
      if (modelFrame) tasks.push(waitIframe(modelFrame));
    }

    document
      .querySelectorAll("iframe.about-drift-frame, iframe.about-lanyard-frame, .prototype-demo iframe, .embed-frame iframe")
      .forEach(function (f) {
        tasks.push(waitIframe(f));
      });

    return tasks;
  }

  var dismissed = false;
  function dismiss() {
    if (dismissed) return;
    dismissed = true;
    setProgress(totalCount, totalCount);
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
    progEl = document.getElementById("site-loader-prog");
    pctEl = document.getElementById("site-loader-pct");
    if (progEl) {
      progEl.style.strokeDasharray = String(CIRC);
      progEl.style.strokeDashoffset = String(CIRC);
    }
    var tasks = criticalTasks();
    totalCount = Math.max(1, tasks.length);
    doneCount = 0;
    setProgress(0, totalCount);
    var safety = window.setTimeout(dismiss, MAX_MS);
    Promise.all(tasks.map(track)).then(function () {
      window.setTimeout(function () {
        window.clearTimeout(safety);
        dismiss();
      }, 160);
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run);
  else run();
})();
