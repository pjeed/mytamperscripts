// ==UserScript==
// @name         Neopets - Copy Shop Items
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Copy all items in your shop to the clipboard
// @match        https://www.neopets.com/market.phtml*
// @match        https://www.neopets.com/browseshop.phtml*
// @grant        GM_setClipboard
// ==/UserScript==

(function () {
    'use strict';

    function addButton() {
        if (document.getElementById("copyShopItemsBtn")) return;

        const btn = document.createElement("button");
        btn.id = "copyShopItemsBtn";
        btn.textContent = "Copy Shop Items";

        Object.assign(btn.style, {
            position: "fixed",
            top: "10px",
            right: "10px",
            zIndex: "99999",
            padding: "10px 16px",
            fontSize: "14px",
            fontWeight: "bold",
            cursor: "pointer",
            background: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "6px",
            boxShadow: "0 2px 6px rgba(0,0,0,.3)"
        });

        btn.onclick = async () => {
            const rows = [];

            document.querySelectorAll(".bsp-item__buy").forEach(item => {
                const name = item.dataset.name || "";
                const price = item.dataset.price || "";
                const qtyText = item.querySelector(".bsp-item__qty")?.textContent || "";
                const qty = qtyText.match(/\d+/)?.[0] || "";

                rows.push(`${name} | ${price} | ${qty}`);
            });

            const text = rows.join("\n");

            try {
                await navigator.clipboard.writeText(text);
            } catch {
                if (typeof GM_setClipboard !== "undefined") {
                    GM_setClipboard(text);
                }
            }

            btn.textContent = `Copied ${rows.length} items!`;

            setTimeout(() => {
                btn.textContent = "Copy Shop Items";
            }, 2000);
        };

        document.body.appendChild(btn);
    }

    window.addEventListener("load", addButton);
})();
