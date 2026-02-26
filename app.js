(function () {
  "use strict";

  const cfg = window.NAV_CONFIG || {};
  const profile = cfg.profile || { title: "My Hub", avatar: "M", subtitle: "", signature: "", tags: [] };
  const themes = Array.isArray(cfg.themes) ? cfg.themes : [];
  const linkGroups = Array.isArray(cfg.linkGroups) ? cfg.linkGroups : [];

  const content = document.getElementById("content");
  const searchInput = document.getElementById("searchInput");
  const emptyState = document.getElementById("emptyState");
  const pageTitle = document.getElementById("pageTitle");
  const greeting = document.getElementById("greeting");
  const signature = document.getElementById("signature");
  const tagRow = document.getElementById("tagRow");
  const avatarText = document.getElementById("avatarText");
  const todayDate = document.getElementById("todayDate");
  const clock = document.getElementById("clock");
  const themeButtons = document.getElementById("themeButtons");

  function domainOf(url) {
    try {
      return new URL(url).hostname.replace(/^www\./, "");
    } catch {
      return url;
    }
  }

  function faviconURL(url) {
    return `https://icons.duckduckgo.com/ip3/${domainOf(url)}.ico`;
  }

  function firstLetter(name) {
    return (name || "?").trim().charAt(0).toUpperCase();
  }

  function helloByTime() {
    const hour = new Date().getHours();
    if (hour < 6) return "夜深了，保持专注也别忘记休息。";
    if (hour < 12) return "早上好，今天也高效开局。";
    if (hour < 18) return "下午好，继续推进你的计划。";
    return "晚上好，适合整理和复盘。";
  }

  function updateClock() {
    const now = new Date();
    todayDate.textContent = now.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long"
    });
    clock.textContent = now.toLocaleTimeString("zh-CN", { hour12: false });
  }

  function createCard(link) {
    const a = document.createElement("a");
    a.className = "card";
    a.href = link.url;
    a.target = "_blank";
    a.rel = "noreferrer noopener";
    a.dataset.search = `${link.name} ${domainOf(link.url)}`.toLowerCase();

    const icon = document.createElement("div");
    icon.className = "icon";
    icon.textContent = firstLetter(link.name);

    const img = document.createElement("img");
    img.alt = `${link.name} icon`;
    img.loading = "lazy";
    img.src = faviconURL(link.url);
    img.onerror = () => img.remove();
    icon.prepend(img);

    const meta = document.createElement("div");
    meta.className = "meta";

    const name = document.createElement("h3");
    name.textContent = link.name;

    const host = document.createElement("p");
    host.textContent = domainOf(link.url);

    meta.append(name, host);
    a.append(icon, meta);
    return a;
  }

  function renderProfile() {
    pageTitle.textContent = profile.title;
    greeting.textContent = `${profile.subtitle} · ${helloByTime()}`;
    signature.textContent = profile.signature;
    avatarText.textContent = profile.avatar;

    tagRow.innerHTML = "";
    for (const t of profile.tags || []) {
      const tag = document.createElement("span");
      tag.className = "tag";
      tag.textContent = t;
      tagRow.appendChild(tag);
    }
  }

  function applyTheme(themeKey) {
    if (themeKey === "default") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", themeKey);
    }
    localStorage.setItem("nav-theme", themeKey);
    Array.from(themeButtons.querySelectorAll("button")).forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.theme === themeKey);
    });
  }

  function renderThemes() {
    themeButtons.innerHTML = "";
    const stored = localStorage.getItem("nav-theme") || "default";

    themes.forEach((theme) => {
      const btn = document.createElement("button");
      btn.className = "theme-btn";
      btn.dataset.theme = theme.key;
      btn.textContent = theme.label;
      btn.type = "button";
      btn.addEventListener("click", () => applyTheme(theme.key));
      themeButtons.appendChild(btn);
    });

    applyTheme(stored);
  }

  function renderLinks() {
    content.innerHTML = "";
    let totalCards = 0;
    const prioritizedGroups = linkGroups
      .map((group, idx) => {
        const names = (group.links || []).map((l) => (l.name || "").toLowerCase());
        const urls = (group.links || []).map((l) => (l.url || "").toLowerCase());
        let priority = 100;

        if (names.some((n) => n.includes("excalidraw")) || urls.some((u) => u.includes("excalidraw.com"))) {
          priority = 0;
        } else if (
          names.some((n) => n.includes("it tools") || n.includes("ip111") || n.includes("ping0") || n.includes("ip")) ||
          urls.some((u) => u.includes("it-tools.tech") || u.includes("ip111.cn") || u.includes("ping0.cc") || u.includes("ip.sb"))
        ) {
          priority = 1;
        }

        return { group, idx, priority };
      })
      .sort((a, b) => a.priority - b.priority || a.idx - b.idx)
      .map((x) => x.group);

    prioritizedGroups.forEach((group, idx) => {
      const section = document.createElement("section");
      section.className = "section";
      section.style.setProperty("--delay", `${idx * 0.08}s`);

      const h2 = document.createElement("h2");
      h2.textContent = group.title;

      const grid = document.createElement("div");
      grid.className = "grid";

      (group.links || []).forEach((link) => {
        grid.appendChild(createCard(link));
        totalCards += 1;
      });

      section.append(h2, grid);
      content.appendChild(section);
    });

    emptyState.style.display = totalCards ? "none" : "block";
  }

  function filterCards(keyword) {
    const q = keyword.trim().toLowerCase();
    const cards = Array.from(document.querySelectorAll(".card"));
    const sections = Array.from(document.querySelectorAll(".section"));
    let visible = 0;

    cards.forEach((card) => {
      const show = !q || card.dataset.search.includes(q);
      card.style.display = show ? "" : "none";
      if (show) visible += 1;
    });

    sections.forEach((section) => {
      const hasVisible = section.querySelector('.card:not([style*="display: none"])');
      section.style.display = hasVisible ? "" : "none";
    });

    emptyState.style.display = visible ? "none" : "block";
  }

  searchInput.addEventListener("input", (e) => filterCards(e.target.value));

  renderProfile();
  renderThemes();
  renderLinks();
  updateClock();
  setInterval(updateClock, 1000);
})();
