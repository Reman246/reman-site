// Light/dark toggle. The chosen mode is kept in data-mode (so the host's own data-theme
// can't override it), saved to storage, and carried to the next page as #light / #dark.
(() => {
  const root = document.documentElement;
  const valid = m => m === "light" || m === "dark";

  let mode = location.hash.slice(1);
  if (!valid(mode)) { try { mode = localStorage.getItem("reman-theme"); } catch (e) {} }
  if (!valid(mode)) { try { mode = sessionStorage.getItem("reman-theme"); } catch (e) {} }

  const isDark = () => valid(mode) ? mode === "dark"
    : root.dataset.theme ? root.dataset.theme === "dark"
    : matchMedia("(prefers-color-scheme: dark)").matches;

  function apply() {
    if (valid(mode)) root.dataset.mode = mode; else delete root.dataset.mode;
    document.querySelectorAll("a[href]").forEach(a => {
      const href = a.getAttribute("href");
      if (/^(https?:|mailto:|tel:|#)/.test(href)) return;
      const base = href.split("#")[0];
      a.setAttribute("href", valid(mode) ? `${base}#${mode}` : base);
    });
  }
  apply();

  document.querySelectorAll(".theme").forEach(b => b.addEventListener("click", () => {
    mode = isDark() ? "light" : "dark";
    try { localStorage.setItem("reman-theme", mode); } catch (e) {}
    try { sessionStorage.setItem("reman-theme", mode); } catch (e) {}
    apply();
  }));
})();
