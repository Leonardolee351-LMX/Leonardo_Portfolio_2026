
(function () {
  "use strict";

  function columnFactor(index, variance) {
    var pseudo = ((index * 0.6180339887 + 0.35) % 1) * 2 - 1;
    return 1 + variance * pseudo;
  }

  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function DriftWall(root, opts) {
    opts = opts || {};
    var items = opts.items || [];
    var columns = opts.columns || 4;
    var tileWidth = opts.tileWidth || 200;
    var tileHeight = opts.tileHeight || 148;
    var gap = opts.gap || 14;
    var radius = opts.radius || 14;
    var tilt = opts.tilt != null ? opts.tilt : 16;
    var turn = opts.turn != null ? opts.turn : -14;
    var roll = opts.roll || 0;
    var perspective = opts.perspective || 1200;
    var depth = opts.depth != null ? opts.depth : 120;
    var speed = opts.speed != null ? opts.speed : 38;
    var direction = opts.direction || "up";
    var variance = opts.variance != null ? opts.variance : 0.45;
    var parallax = opts.parallax != null ? opts.parallax : 0.55;
    var pauseOnHover = !!opts.pauseOnHover;
    var lift = opts.lift != null ? opts.lift : 56;
    var fade = opts.fade != null ? opts.fade : 0.55;
    var dim = opts.dim != null ? opts.dim : 0.55;
    var grayscale = !!opts.grayscale;
    var overlayColor = opts.overlayColor || "#060010";

    var reduced = prefersReducedMotion();
    var containerHeight = 600;
    var activeId = null;
    var hoveredCol = -1;
    var wallHovered = false;
    var pointer = { x: 0, y: 0 };
    var pointerDamped = { x: 0, y: 0 };
    var offsets = [];
    var velocities = [];
    var trackEls = [];
    var planeEl = null;
    var lastTs = null;
    var raf = null;

    root.className = "drift-wall" + (reduced ? " drift-wall--reduced" : "");
    root.setAttribute("role", "group");
    root.setAttribute("aria-label", "Drifting wall of tiles");
    root.style.setProperty("--dw-tile-w", tileWidth + "px");
    root.style.setProperty("--dw-tile-h", tileHeight + "px");
    root.style.setProperty("--dw-gap", gap + "px");
    root.style.setProperty("--dw-radius", radius + "px");
    root.style.setProperty("--dw-perspective", perspective + "px");
    root.style.setProperty("--dw-lift", lift + "px");
    root.style.setProperty("--dw-dim", String(dim));
    root.style.setProperty("--dw-gray", grayscale ? "1" : "0");
    root.style.setProperty("--dw-overlay", overlayColor);
    root.style.setProperty("--dw-edge", Math.max(0, (1 - fade) * 100) + "%");

    var cols = Array.from({ length: columns }, function () { return []; });
    items.forEach(function (item, i) { cols[i % columns].push(item); });
    cols = cols.map(function (col) { return col.length ? col : items.slice(0, 1); });

    function metaFor() {
      var unit = tileHeight + gap;
      return cols.map(function (col) {
        var copyHeight = Math.max(unit, col.length * unit);
        var copies = Math.max(2, Math.ceil((containerHeight * 1.6) / copyHeight) + 1);
        return { copyHeight: copyHeight, copies: copies };
      });
    }

    var columnMeta = metaFor();
    var dirSign = direction === "up" ? 1 : -1;
    var baseVelocities = cols.map(function (_, c) {
      var altSign = c % 2 === 0 ? 1 : -1;
      return speed * columnFactor(c, variance) * dirSign * altSign;
    });

    planeEl = document.createElement("div");
    planeEl.className = "drift-wall__plane";
    root.appendChild(planeEl);

    function renderTile(item, id, colIndex) {
      var tag = item.href ? "a" : "div";
      var el = document.createElement(tag);
      el.className = "drift-wall__tile";
      el.dataset.tileId = id;
      el.dataset.col = String(colIndex);
      if (item.href) {
        el.href = item.href;
        el.target = "_blank";
        el.rel = "noreferrer noopener";
      } else {
        el.tabIndex = 0;
        el.setAttribute("role", "button");
        el.setAttribute("aria-label", item.title || "tile");
      }
      var inner = document.createElement("span");
      inner.className = "drift-wall__inner";
      var img = document.createElement("img");
      img.src = item.image;
      img.alt = item.title || "";
      img.loading = "lazy";
      img.decoding = "async";
      img.draggable = false;
      var overlay = document.createElement("span");
      overlay.className = "drift-wall__overlay";
      overlay.setAttribute("aria-hidden", "true");
      inner.appendChild(img);
      inner.appendChild(overlay);
      el.appendChild(inner);
      el.addEventListener("focus", function () {
        activeId = id;
        hoveredCol = colIndex;
        syncActive();
      });
      el.addEventListener("blur", function () {
        activeId = null;
        hoveredCol = -1;
        syncActive();
      });
      return el;
    }

    function build() {
      planeEl.innerHTML = "";
      trackEls = [];
      columnMeta = metaFor();
      cols.forEach(function (col, c) {
        var colEl = document.createElement("div");
        colEl.className = "drift-wall__col";
        var track = document.createElement("div");
        track.className = "drift-wall__track";
        trackEls[c] = track;
        var copies = columnMeta[c].copies;
        for (var copyIndex = 0; copyIndex < copies; copyIndex++) {
          col.forEach(function (item, itemIndex) {
            track.appendChild(renderTile(item, c + "-" + copyIndex + "-" + itemIndex, c));
          });
        }
        colEl.appendChild(track);
        planeEl.appendChild(colEl);
      });
      offsets = columnMeta.map(function (meta, c) { return meta.copyHeight * ((c * 0.37) % 1); });
      velocities = cols.map(function () { return 0; });
    }

    function syncActive() {
      root.querySelectorAll(".drift-wall__tile").forEach(function (tile) {
        tile.classList.toggle("is-active", tile.dataset.tileId === activeId);
      });
    }

    function applyPlaneTransform(px, py) {
      planeEl.style.transform =
        "translate(-50%, -50%) scale(1.18) " +
        "rotateX(" + (tilt + py) + "deg) rotateY(" + (turn + px) + "deg) rotateZ(" + roll + "deg) " +
        "translateZ(" + (-depth) + "px)";
    }

    function animate(ts) {
      if (lastTs == null) lastTs = ts;
      var dt = Math.min(0.05, Math.max(0, (ts - lastTs) / 1000));
      lastTs = ts;
      var maxTilt = parallax * 8;
      var targetX = pointer.x * maxTilt;
      var targetY = -pointer.y * maxTilt;
      var damp = 1 - Math.exp(-dt / 0.12);
      pointerDamped.x += (targetX - pointerDamped.x) * damp;
      pointerDamped.y += (targetY - pointerDamped.y) * damp;
      applyPlaneTransform(pointerDamped.x, pointerDamped.y);

      if (!reduced) {
        for (var c = 0; c < trackEls.length; c++) {
          var meta = columnMeta[c];
          if (!meta) continue;
          var paused = wallHovered && pauseOnHover;
          var factor = paused || hoveredCol === c ? 0 : 1;
          var target = baseVelocities[c] * factor;
          var ease = 1 - Math.exp(-dt / (target === 0 ? 0.16 : 0.28));
          velocities[c] += (target - velocities[c]) * ease;
          var next = (offsets[c] || 0) + velocities[c] * dt;
          next = ((next % meta.copyHeight) + meta.copyHeight) % meta.copyHeight;
          offsets[c] = next;
          if (trackEls[c]) trackEls[c].style.transform = "translate3d(0," + (-next) + "px,0)";
        }
      }
      raf = requestAnimationFrame(animate);
    }

    root.addEventListener("pointermove", function (e) {
      var rect = root.getBoundingClientRect();
      if (parallax > 0 && !reduced) {
        pointer.x = (e.clientX - rect.left) / rect.width - 0.5;
        pointer.y = (e.clientY - rect.top) / rect.height - 0.5;
      }
      var hit = document.elementFromPoint(e.clientX, e.clientY);
      var tile = hit && hit.closest ? hit.closest("[data-tile-id]") : null;
      if (!tile) return;
      var id = tile.dataset.tileId || null;
      if (id === activeId) return;
      activeId = id;
      hoveredCol = Number(tile.dataset.col);
      syncActive();
    });
    root.addEventListener("pointerenter", function () { wallHovered = true; });
    root.addEventListener("pointerleave", function () {
      wallHovered = false;
      pointer.x = 0;
      pointer.y = 0;
      activeId = null;
      hoveredCol = -1;
      syncActive();
    });

    var ro = new ResizeObserver(function (entries) {
      var h = (entries[0] && entries[0].contentRect.height) || 600;
      if (Math.abs(h - containerHeight) > 8) {
        containerHeight = h;
        build();
      }
    });
    containerHeight = root.getBoundingClientRect().height || 600;
    build();
    ro.observe(root);
    applyPlaneTransform(0, 0);
    raf = requestAnimationFrame(animate);

    return function destroy() {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      root.innerHTML = "";
    };
  }

  window.DriftWall = DriftWall;
})();
