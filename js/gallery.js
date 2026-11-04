(function () {
  var mount = document.querySelector("[data-gallery]");
  if (!mount || !window.CATALOG) return;

  var drawer = window.CATALOG.drawers.filter(function (d) { return d.id === "archive"; })[0];
  if (!drawer) return;
  var files = drawer.files;
  var index = 0;
  var playing = true;
  var timer;
  var covers = [];
  var titleEl;
  var standEl;
  var playBtn;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  var onscreen = true;

  function el(tag, cls) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    return node;
  }

  function wrapOff(i) {
    var n = files.length;
    var off = i - index;
    if (off > n / 2) off -= n;
    if (off < -n / 2) off += n;
    return off;
  }

  function build() {
    mount.innerHTML = "";
    var stage = el("div", "album-stage");
    stage.setAttribute("role", "listbox");
    stage.setAttribute("aria-label", "归档作品");
    files.forEach(function (f, i) {
      var btn = el("button", "album-cover");
      btn.type = "button";
      btn.setAttribute("role", "option");
      btn.setAttribute("aria-label", f.title);
      if (f.img) {
        var img = el("img");
        img.src = f.img;
        img.alt = f.title;
        img.loading = i < 6 ? "eager" : "lazy";
        btn.appendChild(img);
      } else {
        var blank = el("span", "album-blank");
        blank.textContent = f.title;
        btn.appendChild(blank);
      }
      btn.addEventListener("click", function () {
        if (i === index && f.href) {
          window.location.href = f.href;
          return;
        }
        go(i, true);
      });
      stage.appendChild(btn);
      covers.push(btn);
    });

    var now = el("div", "album-now");
    titleEl = el("h3");
    titleEl.id = "album-title";
    standEl = el("p");
    now.appendChild(titleEl);
    now.appendChild(standEl);

    var bar = el("div", "album-bar");
    var prev = el("button", "album-shift");
    prev.type = "button";
    prev.setAttribute("aria-label", "上一张");
    prev.textContent = "<";
    prev.addEventListener("click", function () { go(index - 1, true); });
    playBtn = el("button", "album-shift is-play");
    playBtn.type = "button";
    playBtn.addEventListener("click", togglePlay);
    var next = el("button", "album-shift");
    next.type = "button";
    next.setAttribute("aria-label", "下一张");
    next.textContent = ">";
    next.addEventListener("click", function () { go(index + 1, true); });
    bar.appendChild(prev);
    bar.appendChild(playBtn);
    bar.appendChild(next);

    mount.appendChild(stage);
    mount.appendChild(now);
    mount.appendChild(bar);
    mount.tabIndex = 0;

    mount.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        go(index + 1, true);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(index - 1, true);
      } else if (e.key === " ") {
        e.preventDefault();
        togglePlay();
      }
    });
    var wheelLock = false;
    mount.addEventListener("wheel", function (e) {
      if (Math.abs(e.deltaY) < 8 && Math.abs(e.deltaX) < 8) return;
      e.preventDefault();
      if (wheelLock) return;
      wheelLock = true;
      var dir = (e.deltaX || e.deltaY) > 0 ? 1 : -1;
      go(index + dir, true);
      window.setTimeout(function () { wheelLock = false; }, 520);
    }, { passive: false });
    mount.addEventListener("pointerenter", function () { stop(); });
    mount.addEventListener("pointerleave", function () { if (playing) start(); });
    mount.addEventListener("focusin", function () { stop(); });
    mount.addEventListener("focusout", function () { if (playing) start(); });
  }

  function span() {
    return window.matchMedia("(max-width: 640px)").matches ? 1 : 2;
  }

  function paint() {
    var maxShow = span();
    covers.forEach(function (btn, i) {
      var off = wrapOff(i);
      var abs = Math.abs(off);
      btn.classList.toggle("is-on", off === 0);
      if (off === 0) btn.setAttribute("aria-selected", "true");
      else btn.removeAttribute("aria-selected");
      btn.style.zIndex = String(40 - abs);
      var visible = abs <= maxShow;
      btn.style.opacity = !visible ? "0" : (off === 0 ? "1" : (abs === 1 ? "0.92" : "0.72"));
      btn.style.visibility = visible ? "visible" : "hidden";
      btn.style.pointerEvents = visible ? "auto" : "none";
      if (visible) btn.removeAttribute("aria-hidden");
      else btn.setAttribute("aria-hidden", "true");
      var step = maxShow === 2 ? 84 : 86;
      var x = off * step;
      var rot = off * (maxShow === 2 ? -10 : -16);
      var sc = off === 0 ? 1 : (abs === 1 ? 0.82 : 0.68);
      btn.style.transform = "translateX(" + x + "%) rotateY(" + rot + "deg) scale(" + sc + ")";
    });
    var file = files[index];
    titleEl.textContent = file.title;
    standEl.textContent = file.stand;
    playBtn.textContent = playing && !reduce.matches ? "暂停" : "播放";
    playBtn.setAttribute("aria-label", playing ? "暂停循环" : "开始循环");
  }

  function go(i, user) {
    index = (i + files.length) % files.length;
    paint();
    if (user) restart();
  }

  function start() {
    stop();
    if (reduce.matches || !playing || !onscreen || document.hidden) return;
    timer = window.setInterval(function () {
      go(index + 1, false);
    }, 4200);
  }

  function stop() {
    if (timer) {
      window.clearInterval(timer);
      timer = undefined;
    }
  }

  function restart() {
    if (playing) start();
  }

  function togglePlay() {
    playing = !playing;
    paint();
    if (playing) start();
    else stop();
  }

  var observer = new IntersectionObserver(function (entries) {
    onscreen = entries[0] && entries[0].isIntersecting;
    if (onscreen) start();
    else stop();
  }, { threshold: 0.25 });

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stop();
    else if (playing) start();
  });
  reduce.addEventListener("change", function () {
    if (reduce.matches) {
      playing = false;
      stop();
    }
    paint();
  });

  window.addEventListener("resize", function () { paint(); });

  build();
  for (var s = 0; s < files.length; s++) {
    if (files[s].img) {
      index = s;
      break;
    }
  }
  if (reduce.matches) playing = false;
  paint();
  observer.observe(mount);
  start();
})();
