class ThemeManager {
  constructor() {
    this.themeToggle = document.getElementById("themeToggle");
    this.themeIcon = this.themeToggle.querySelector("i");
    this.initTheme();
    this.bindEvents();
  }

  initTheme() {
    const savedTheme = localStorage.getItem("theme") || "dark";
    this.setTheme(savedTheme);
  }

  setTheme(theme) {
    const html = document.documentElement;
    const body = document.body;

    if (theme === "light") {
      html.setAttribute("data-theme", "light");
      body.classList.remove("dark");
      this.themeIcon.className = "fas fa-moon";
      this.themeToggle.setAttribute("aria-label", "切换到深色模式");
    } else {
      html.removeAttribute("data-theme");
      body.classList.add("dark");
      this.themeIcon.className = "fas fa-sun";
      this.themeToggle.setAttribute("aria-label", "切换到浅色模式");
    }

    localStorage.setItem("theme", theme);
    this.notifyThemeChange(theme);
  }

  notifyThemeChange(theme) {
    const event = new CustomEvent("themeChanged", {
      detail: { theme },
    });
    document.dispatchEvent(event);

    setTimeout(() => {
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "theme",
          newValue: theme,
          storageArea: localStorage,
        })
      );
    }, 100);
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "light" ? "dark" : "light";
    this.setTheme(newTheme);
  }

  bindEvents() {
    this.themeToggle.addEventListener("click", () => {
      this.toggleTheme();
    });

    // 键盘支持
    document.addEventListener("keydown", (e) => {
      if (
        e.key.toLowerCase() === "t" &&
        !e.ctrlKey &&
        !e.altKey &&
        !e.metaKey
      ) {
        const activeElement = document.activeElement;
        if (
          activeElement.tagName !== "INPUT" &&
          activeElement.tagName !== "TEXTAREA" &&
          !activeElement.isContentEditable
        ) {
          this.toggleTheme();
        }
      }
    });
  }

  getCurrentTheme() {
    return document.documentElement.getAttribute("data-theme") === "light"
      ? "light"
      : "dark";
  }
}

// 初始化
document.addEventListener("DOMContentLoaded", () => {
  new ThemeManager();
});
