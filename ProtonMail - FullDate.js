// ==UserScript==
// @name ProtonMail - Show Full Dates
// @namespace http://tampermonkey.net/
// @version 1.0
// @description Replaces short relative dates with full readable dates in ProtonMail inbox (e.g., "2d" → "June 4, 2025").
// @author GionLennon
// @match *://mail.proton.me/*
// @grant none
// ==/UserScript==

(() => {
  'use strict';

  const replaceShortDates = () => {
    document.querySelectorAll('time[data-testid="item-date-simple"]').forEach(el => {
      const parent = el.parentElement;
      if (!parent) return;

      const srOnly = [...parent.childNodes].find(
        node => node.nodeType === 1 && node.classList.contains('sr-only')
      );

      if (srOnly && el.textContent !== srOnly.textContent) {
        el.textContent = srOnly.textContent;
      }
    });
  };

  // Run immediately
  replaceShortDates();

  // Observe DOM for changes
  const observer = new MutationObserver(() => {
    replaceShortDates();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Optional: Add manual stop
  window.stopProtonDateFix = () => {
    observer.disconnect();
    console.log('[ProtonDateFix] Mutation observer stopped.');
  };

  console.log('[ProtonDateFix] Started – full dates will now replace short ones.');
})();
