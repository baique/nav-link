// ==UserScript==
// @name         Personal Nav Redirect
// @namespace    https://github.com/your-name
// @version      1.0.0
// @description  Redirect custom trigger domains (e.g. nav.me) to your personal navigation page.
// @author       you
// @match        *://nav.me/*
// @match        *://www.nav.me/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  // Change this to your public navigation page URL.
  const TARGET_URL = "https://your-name.github.io/nav/";

  // If true: nav.me/abc?q=1 -> TARGET_URL + "abc?q=1"
  // If false: always jump to TARGET_URL exactly.
  const KEEP_PATH_AND_QUERY = false;

  function buildRedirectURL() {
    if (!KEEP_PATH_AND_QUERY) return TARGET_URL;
    const target = new URL(TARGET_URL);
    const path = window.location.pathname === "/" ? "" : window.location.pathname.replace(/^\//, "");
    const suffix = path ? `${path}${window.location.search}${window.location.hash}` : `${window.location.search}${window.location.hash}`;
    return new URL(suffix || "", target).toString();
  }

  const nextURL = buildRedirectURL();
  if (window.location.href !== nextURL) {
    window.location.replace(nextURL);
  }
})();

