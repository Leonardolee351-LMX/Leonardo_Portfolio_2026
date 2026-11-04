(function () {
  var mount = document.querySelector("[data-files]");
  if (!mount || !window.CATALOG) return;

  var base = mount.getAttribute("data-root") || "";
  var only = mount.getAttribute("data-only");
  var drawers = window.CATALOG.drawers.filter(function (d) {
    return !only || d.id === only;
  });
  var drawerId = drawers[0].id;
  var fileId = "";

  function drawer() {
    return drawers.filter(function (d) { return d.id === drawerId; })[0];
  }
  function current() {
    var files = drawer().files;
    var found = files.filter(function (f) { return f.id === fileId; })[0];
    return found || files[0];
  }
  function el(tag, cls) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    return node;
  }
  function pickFromHash() {
    var id = (location.hash || "").replace("#", "");
    if (!id) return;
    drawers.forEach(function (d) {
      d.files.forEach(function (f) {
        if (f.id === id) {
          drawerId = d.id;
          fileId = f.id;
        }
      });
    });
  }

  function render() {
    pickFromHash();
    var file = current();
    fileId = file.id;
    mount.innerHTML = "";
    var desk = el("div", "desk");

    if (!only) {
      var rail = el("div", "desk-drawers");
      drawers.forEach(function (d) {
        var btn = el("button", "drawer-btn" + (d.id === drawerId ? " is-on" : ""));
        btn.type = "button";
        btn.setAttribute("aria-pressed", d.id === drawerId ? "true" : "false");
        var name = el("strong");
        name.textContent = d.label;
        var meta = el("span");
        meta.textContent = d.files.length + " 份 · " + d.note;
        btn.appendChild(name);
        btn.appendChild(meta);
        btn.addEventListener("click", function () {
          drawerId = d.id;
          fileId = "";
          if (location.hash) history.replaceState(null, "", location.pathname);
          render();
        });
        rail.appendChild(btn);
      });
      desk.appendChild(rail);
    }

    var list = el("div", "desk-list");
    drawer().files.forEach(function (f) {
      var row = el("button", "desk-row" + (f.id === fileId ? " is-on" : ""));
      row.type = "button";
      var title = el("strong");
      title.textContent = f.title;
      var year = el("span");
      year.textContent = f.year;
      row.appendChild(title);
      row.appendChild(year);
      row.addEventListener("click", function () {
        fileId = f.id;
        if (!only) history.replaceState(null, "", "#" + f.id);
        render();
      });
      list.appendChild(row);
    });
    desk.appendChild(list);

    var sheet = el("aside", "desk-sheet");
    if (file.img) {
      var img = el("img");
      img.src = base + file.img;
      img.alt = "";
      sheet.appendChild(img);
    } else {
      var paper = el("div", "paper");
      paper.textContent = file.tab;
      sheet.appendChild(paper);
    }
    var kicker = el("p", "eyebrow");
    kicker.textContent = file.year;
    var h = el("h3");
    h.textContent = file.title;
    var stand = el("p");
    stand.textContent = file.stand;
    var role = el("p", "muted");
    role.textContent = file.role;
    var limit = el("p", "muted");
    limit.textContent = file.limit;
    sheet.appendChild(kicker);
    sheet.appendChild(h);
    sheet.appendChild(stand);
    sheet.appendChild(role);
    sheet.appendChild(limit);
    if (file.href) {
      var a = el("a");
      a.href = base + file.href;
      a.textContent = "打开正文";
      sheet.appendChild(a);
    }
    desk.appendChild(sheet);
    mount.appendChild(desk);
  }

  window.addEventListener("hashchange", render);
  render();
})();
