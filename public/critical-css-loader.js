(() => {
  const swapMedia = (link) => {
    if (!link || link.media === "all") return;
    link.media = "all";
  };

  const links = document.querySelectorAll('link[data-ws-preload="style"]');
  links.forEach((link) => {
    link.addEventListener("load", () => swapMedia(link), { once: true });
    if (link.sheet) {
      swapMedia(link);
    }
  });
})();
