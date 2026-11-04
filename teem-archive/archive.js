(function () {
  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lightbox-img");
  const lbCap = document.getElementById("lightbox-cap");
  const closeBtn = document.getElementById("lightbox-close");

  function openLb(src, cap) {
    lbImg.src = src;
    lbCap.textContent = cap || "";
    lb.classList.add("open");
    lb.setAttribute("aria-hidden", "false");
  }
  function closeLb() {
    lb.classList.remove("open");
    lb.setAttribute("aria-hidden", "true");
    lbImg.removeAttribute("src");
  }

  document.querySelectorAll("[data-full]").forEach((btn) => {
    if (btn.classList.contains("missing")) return;
    btn.addEventListener("click", () => {
      if (btn.classList.contains("missing")) return;
      openLb(btn.getAttribute("data-full"), btn.getAttribute("data-cap") || "");
    });
  });
  closeBtn.addEventListener("click", closeLb);
  lb.addEventListener("click", (e) => {
    if (e.target === lb) closeLb();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLb();
  });

  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const text = btn.getAttribute("data-copy");
      try {
        await navigator.clipboard.writeText(text);
        const old = btn.textContent;
        btn.textContent = "已复制";
        setTimeout(() => (btn.textContent = old), 1200);
      } catch (err) {
        prompt("复制此路径：", text);
      }
    });
  });
})();
