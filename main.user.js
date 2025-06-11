// ==UserScript==
// @name ProtonMail - Auto Select Next Message
// @namespace http://tampermonkey.net/
// @version 1.1
// @description Automatically selects the next email in ProtonMail after archiving, deleting or spamming the current one.
// @author tompos2
// @modifiedby GionLennon
// @match *://mail.proton.me/*
// @grant none
// ==/UserScript==

console.log('Script is running');

(function () {
    'use strict';

    console.log('[AutoNext] Script loaded');

    let cachedList = [];
    let currentId = null;
    let currentSubject = null;
    let shouldOpenNext = false;

    // Detect layout based on row vs column item container
    function isFullscreenLayout() {
        const item = document.querySelector('.item-container');
        return item?.classList.contains('item-container--row');
    }

    // Cache the visible inbox list
    function cacheInbox() {
        const items = document.querySelectorAll('[data-element-id][data-testid*="message-item"]');
        cachedList = [];

        if (!items.length) {
            console.warn('[AutoNext] No message items found for caching');
            return;
        }

        items.forEach(item => {
            const id = item.getAttribute('data-element-id') || '';
            // NEW - works across layouts
            const subjectEl = item.querySelector('[data-testid$="subject"]');
            const subject = subjectEl?.textContent?.trim() || '';
            if (id && subject) {
                cachedList.push({ id, subject, element: item });
            }
        });

        console.log(`[AutoNext] Cached ${cachedList.length} messages`);
    }

    // Track the currently viewed message
    function captureCurrentMessage() {
        const subjectEl = document.querySelector('[data-testid="conversation-header:subject"] span');
        const subject = subjectEl?.textContent?.trim();
        const article = document.querySelector('[data-element-id][data-testid*="message-item"]');
        const id = article?.getAttribute('data-message-id');

        currentSubject = subject || null;
        currentId = id || null;

        console.log(`[AutoNext] Tracking message – Subject: "${currentSubject}", ID: ${currentId}`);
    }

    // Click the next message
    function openNextMessage() {
        const items = Array.from(document.querySelectorAll('[data-testid^="message-item:"]'));

        let index = cachedList.findIndex(item =>
            item.id === currentId || item.subject === currentSubject
        );

        if (index === -1) {
            console.warn('[AutoNext] Could not find current message in cache');
            return;
        }

        const next = cachedList[index + 1];
        if (!next) {
            console.warn('[AutoNext] No next message in cache');
            return;
        }

        console.log(`[AutoNext] Opening next message: "${next.subject}"`);

        const nextLive = items.find(el =>
            el.getAttribute('data-element-id') === next.id
        );

        if (nextLive) {
            nextLive.click();
        } else {
            console.warn('[AutoNext] Could not find next message in live DOM');
        }
    }

    // Detect archive/delete keypress
    window.addEventListener('keydown', (e) => {
        if ((e.key === 't' || e.key === 'a') && !e.ctrlKey && !e.metaKey && !e.altKey) {
            captureCurrentMessage();
            shouldOpenNext = true;
        }
    }, true);

    // DOM observer to track changes
    const observer = new MutationObserver(() => {
        if (shouldOpenNext) {
            const delay = isFullscreenLayout() ? 500 : 300;
            setTimeout(() => {
                openNextMessage();
                shouldOpenNext = false;
                currentId = null;
                currentSubject = null;
            }, delay);
        } else {
            cacheInbox();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();

