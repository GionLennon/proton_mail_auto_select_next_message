// ==UserScript==
// @name ProtonMail - Show Full Dates
// @namespace http://tampermonkey.net/
// @version 1.0
// @description Injects changes to the UI to make it look more minimalistic.
// @author GionLennon
// @match *://mail.proton.me/*
// @grant none
// ==/UserScript==

(() => {
  'use strict';
  
  console.log('[NeutralTheme] Injecting Minimal-Style UI');

  const style = document.createElement('style');
  style.textContent = `
    .sidebar {
      display: none !important;
    }

    nav.drawer-sidebar {
      display: none !important;
    }

    .MainContainer, .main, .main-container {
      margin-left: 0 !important;
      padding-left: 1rem !important;
    }

    .header.ui-prominent {
      background-color: #f9fafb !important;
      color: #1f2937 !important;
      border-bottom: 1px solid #d1d5db !important;
    }

    .header.ui-prominent svg,
    .header.ui-prominent .button,
    .header.ui-prominent .user-dropdown-text {
      color: #1f2937 !important;
      fill: #1f2937 !important;
    }

    .user-initials {
      background-color: #d1d5db !important;
      color: #111827 !important;
    }

    .searchbox {
      background-color: #ffffff !important;
      border-radius: 0.375rem !important;
      padding: 0.25rem 0.5rem !important;
    }

    .input {
      background-color: #f3f4f6 !important;
      border: 1px solid #d1d5db !important;
      border-radius: 0.375rem !important;
    }

    .input-element {
      background-color: #f3f4f6 !important;
      color: #1f2937 !important;
    }

    .input-adornment svg {
      fill: #6b7280 !important;
    }

    .toolbar--heavy {
      background-color: #f3f4f6 !important;
      border-bottom: 1px solid #d1d5db !important;
      color: #1f2937 !important;
    }

    .toolbar--heavy h2,
    .toolbar--heavy button,
    .toolbar--heavy svg {
      color: #1f2937 !important;
      fill: #1f2937 !important;
    }

    .toolbar--heavy .toolbar-button {
      background-color: transparent !important;
      border-radius: 0.375rem !important;
    }

    .toolbar--heavy .toolbar-button:hover {
      background-color: #e5e7eb !important;
    }
  `;
  document.head.appendChild(style);
})();
