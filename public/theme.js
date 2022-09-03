(function initTheme() {
  let theme = localStorage.getItem("darkMode") === "true";
  if (theme) {
    document.documentElement.classList.add("dark");
  }
})();
