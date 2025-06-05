# Console Injection Snippet

This snippet enables automatic opening of the next email message after archiving or deleting the current one in ProtonMail.
It is designed for temporary use by pasting directly into the browser's developer console, without persistentence.

---

## Features

- Automatically opens the next visible email after pressing `t` or `a`.
- Supports both split and fullscreen layouts.
- Requires **no extensions** or permanent modifications.
- Leaves no trace after tab refresh or close.

---

## How to Use

1. Open [ProtonMail](https://mail.proton.me/) in your browser.
2. Open the Developer Console of your Browser.
3. Go to the **Console** tab.
4. Paste the entire script below and hit **Enter**.

---

## Script (Copy & Paste into Console)
```
(() => {
    console.log('[AutoNext] Console snippet loaded');

    let cachedList = [];
    let currentId = null;
    let currentSubject = null;
    let shouldOpenNext = false;

    function isFullscreenLayout() {
        const item = document.querySelector('.item-container');
        return item?.classList.contains('item-container--row');
    }

    function cacheInbox() {
        const items = document.querySelectorAll('[data-testid^="message-item:"]');
        cachedList = [];

        items.forEach(item => {
            const id = item.getAttribute('data-element-id') || '';
            const subjectEl = item.querySelector('[data-testid="message-row:subject"]');
            const subject = subjectEl?.textContent?.trim() || '';
            if (id && subject) {
                cachedList.push({ id, subject, element: item });
            }
        });

        console.log(`[AutoNext] Cached ${cachedList.length} messages`);
    }

    function captureCurrentMessage() {
        const subjectEl = document.querySelector('[data-testid="conversation-header:subject"] span');
        const subject = subjectEl?.textContent?.trim();
        const article = document.querySelector('[data-testid^="message-view-"][data-message-id]');
        const id = article?.getAttribute('data-message-id');

        currentSubject = subject || null;
        currentId = id || null;

        console.log(`[AutoNext] Tracking message – Subject: "${currentSubject}", ID: ${currentId}`);
    }

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

    const keyHandler = (e) => {
        if ((e.key === 't' || e.key === 'a') && !e.ctrlKey && !e.metaKey && !e.altKey) {
            captureCurrentMessage();
            shouldOpenNext = true;
        }
    };

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

    window.addEventListener('keydown', keyHandler, true);
    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('beforeunload', () => {
        observer.disconnect();
        window.removeEventListener('keydown', keyHandler, true);
        console.log('[AutoNext] Cleaned up on page unload.');
    });

    console.log('[AutoNext] Ready – press "t" or "a" while reading a message to auto-open the next one.');
})();
```
