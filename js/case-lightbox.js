/*! Shared case lightbox: zoom +/- · drag · Esc · X close. Auto-binds case content images. */
(function () {
  if (window.CaseLightbox) return;

  var CSS = [
    ".case-lb{position:fixed;inset:0;z-index:9999;display:none;background:rgba(16,14,12,.9)}",
    ".case-lb.is-open{display:block}",
    ".case-lb-toolbar{position:absolute;top:16px;right:16px;z-index:2;display:flex;gap:8px}",
    ".case-lb-toolbar button{min-width:40px;height:40px;border:1px solid rgba(255,255,255,.18);border-radius:10px;background:rgba(20,18,16,.72);color:#fff;font-size:18px;line-height:1;cursor:pointer;backdrop-filter:blur(8px)}",
    ".case-lb-stage{position:absolute;inset:0;overflow:hidden;display:flex;align-items:center;justify-content:center;cursor:zoom-out}",
    ".case-lb-stage.is-zoomed{cursor:grab}",
    ".case-lb-stage.is-zoomed.is-dragging{cursor:grabbing}",
    ".case-lb-stage img{max-width:min(96vw,1600px);max-height:88vh;width:auto;height:auto;object-fit:contain;border-radius:8px;box-shadow:0 24px 80px rgba(0,0,0,.45);background:#fff;transform-origin:center center;will-change:transform;user-select:none;-webkit-user-drag:none;pointer-events:none}",
    ".case-lb-stage img.is-phone{max-width:min(42vw,420px);background:#111}",
    ".case-lb-hint{position:absolute;left:50%;bottom:14px;transform:translateX(-50%);color:rgba(255,255,255,.72);font-size:12px;letter-spacing:.02em;pointer-events:none;white-space:nowrap}",
    "img[data-lb],.case-lb-hit{cursor:zoom-in}",
    ".pdf-embed{margin:18px 0 28px;border:1px solid rgba(0,0,0,.08);border-radius:14px;overflow:hidden;background:#f6f4f1}",
    ".pdf-embed header{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:10px 14px;font-size:13px;color:#444;background:#efeae3}",
    ".pdf-embed header a{color:#111;text-decoration:underline}",
    ".pdf-embed iframe,.pdf-embed object{display:block;width:100%;height:min(78vh,920px);border:0;background:#fff}",
    ".case-fold{margin:18px 0 28px;border:1px solid rgba(0,0,0,.08);border-radius:14px;background:#fff}",
    ".case-fold>summary{cursor:pointer;list-style:none;padding:14px 16px;font-weight:600;display:flex;justify-content:space-between;gap:12px}",
    ".case-fold>summary::-webkit-details-marker{display:none}",
    ".case-fold>summary .hint{font-weight:400;opacity:.55;font-size:12px}",
    ".case-fold[open]>summary{border-bottom:1px solid rgba(0,0,0,.06)}",
    ".case-fold .fold-body{padding:14px 16px 18px}",
    ".case-fold .fold-body img{width:100%;height:auto;border-radius:10px;cursor:zoom-in}",
    ".case-fold .doc-links{display:flex;flex-wrap:wrap;gap:10px;margin-top:10px}",
    ".case-fold .doc-links a{display:inline-flex;align-items:center;gap:6px;padding:8px 12px;border-radius:999px;background:#111;color:#fff;text-decoration:none;font-size:13px}",
    "body.case-soft .pdf-embed,body.case-soft .case-fold{background:rgba(255,255,255,.04);border-color:rgba(255,255,255,.1)}",
    "body.case-soft .pdf-embed header{background:rgba(255,255,255,.06);color:#ddd}",
    "body.case-soft .pdf-embed header a{color:#fff}",
    "body.case-soft .case-fold>summary{color:#f2f2f2}",
    "body.case-soft .case-fold .doc-links a{background:#f2f2f2;color:#111}"
  ].join("");

  function injectCss() {
    if (document.getElementById("case-lb-css")) return;
    var s = document.createElement("style");
    s.id = "case-lb-css";
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function buildDom() {
    var root = document.createElement("div");
    root.className = "case-lb";
    root.id = "caseLightbox";
    root.setAttribute("hidden", "");
    root.setAttribute("aria-hidden", "true");
    root.innerHTML =
      '<div class="case-lb-toolbar">' +
      '<button type="button" data-act="out" aria-label="缩小">−</button>' +
      '<button type="button" data-act="in" aria-label="放大">+</button>' +
      '<button type="button" data-act="reset" aria-label="适配">핏</button>' +
      '<button type="button" data-act="close" aria-label="关闭">×</button>' +
      "</div>" +
      '<div class="case-lb-stage" id="caseLbStage"><img alt=""></div>' +
      '<div class="case-lb-hint">滚轮 / +− 缩放 · 拖动平移 · 双击复位 · Esc / × 关闭</div>';
    // fix garbled reset label
    root.querySelector('[data-act="reset"]').textContent = "适配";
    document.body.appendChild(root);
    return root;
  }

  function init() {
    injectCss();
    var root = buildDom();
    var stage = root.querySelector(".case-lb-stage");
    var img = stage.querySelector("img");
    var scale = 1, tx = 0, ty = 0, dragging = false, moved = false;
    var startX = 0, startY = 0, originTx = 0, originTy = 0;
    var MIN = 1, MAX = 6;

    function apply() {
      img.style.transform = "translate(" + tx + "px," + ty + "px) scale(" + scale + ")";
      stage.classList.toggle("is-zoomed", scale > 1.01);
    }
    function reset() { scale = 1; tx = 0; ty = 0; apply(); }
    function zoomAt(factor, cx, cy) {
      var rect = stage.getBoundingClientRect();
      var x = (cx == null ? rect.left + rect.width / 2 : cx) - rect.left - rect.width / 2;
      var y = (cy == null ? rect.top + rect.height / 2 : cy) - rect.top - rect.height / 2;
      var next = Math.min(MAX, Math.max(MIN, scale * factor));
      if (next === scale) return;
      var k = next / scale;
      tx = x - (x - tx) * k;
      ty = y - (y - ty) * k;
      scale = next;
      if (scale <= 1.01) { scale = 1; tx = 0; ty = 0; }
      apply();
    }
    function open(src, alt, isPhone) {
      img.src = src;
      img.alt = alt || "";
      img.classList.toggle("is-phone", !!isPhone);
      reset();
      root.hidden = false;
      root.classList.add("is-open");
      root.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }
    function close() {
      root.classList.remove("is-open");
      root.hidden = true;
      root.setAttribute("aria-hidden", "true");
      img.removeAttribute("src");
      img.classList.remove("is-phone");
      stage.classList.remove("is-zoomed", "is-dragging");
      document.body.style.overflow = "";
      scale = 1; tx = 0; ty = 0;
    }

    root.querySelector('[data-act="close"]').addEventListener("click", function (e) { e.stopPropagation(); close(); });
    root.querySelector('[data-act="in"]').addEventListener("click", function (e) { e.stopPropagation(); zoomAt(1.25); });
    root.querySelector('[data-act="out"]').addEventListener("click", function (e) { e.stopPropagation(); zoomAt(1 / 1.25); });
    root.querySelector('[data-act="reset"]').addEventListener("click", function (e) { e.stopPropagation(); reset(); });
    stage.addEventListener("wheel", function (e) {
      if (!root.classList.contains("is-open")) return;
      e.preventDefault();
      zoomAt(e.deltaY < 0 ? 1.12 : 1 / 1.12, e.clientX, e.clientY);
    }, { passive: false });
    stage.addEventListener("dblclick", function (e) {
      e.preventDefault(); e.stopPropagation();
      if (scale > 1.01) reset(); else zoomAt(2.2, e.clientX, e.clientY);
    });
    stage.addEventListener("pointerdown", function (e) {
      if (e.button !== 0) return;
      dragging = true; moved = false;
      startX = e.clientX; startY = e.clientY; originTx = tx; originTy = ty;
      stage.setPointerCapture(e.pointerId);
      stage.classList.add("is-dragging");
    });
    stage.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      var dx = e.clientX - startX, dy = e.clientY - startY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) moved = true;
      if (scale > 1.01) { tx = originTx + dx; ty = originTy + dy; apply(); }
    });
    function endDrag(e) {
      if (!dragging) return;
      dragging = false;
      stage.classList.remove("is-dragging");
      try { stage.releasePointerCapture(e.pointerId); } catch (err) {}
      if (!moved && scale <= 1.01) close();
    }
    stage.addEventListener("pointerup", endDrag);
    stage.addEventListener("pointercancel", endDrag);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && root.classList.contains("is-open")) close();
    });

    function bindImage(el) {
      if (!el || el.dataset.lbBound === "1") return;
      if (el.closest("a.brand, header, footer, .brand, .cs-index, .lightbox-toolbar, .case-lb")) return;
      var src = el.getAttribute("src") || "";
      if (!src || src.indexOf("brand/") !== -1 || src.indexOf("leonardo-icon") !== -1) return;
      el.dataset.lbBound = "1";
      el.setAttribute("data-lb", "");
      el.addEventListener("click", function (e) {
        e.preventDefault();
        open(el.currentSrc || el.src, el.alt, el.classList.contains("phone"));
      });
    }

    function bindAll() {
      var scope = document.querySelector(".wrap, .case-body, article, main") || document.body;
      scope.querySelectorAll("img").forEach(bindImage);
      // LaborLink board buttons with data-full
      document.querySelectorAll(".board button[data-full]").forEach(function (btn) {
        if (btn.dataset.lbBound === "1") return;
        btn.dataset.lbBound = "1";
        btn.addEventListener("click", function (e) {
          e.preventDefault();
          var im = btn.querySelector("img");
          open(btn.getAttribute("data-full"), im ? im.alt : "");
        });
      });
    }

    bindAll();
    window.CaseLightbox = { open: open, close: close, rebind: bindAll };
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
