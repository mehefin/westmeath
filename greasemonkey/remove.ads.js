// ==UserScript==
// @name            RemoveAds
// @name:en         RemoveAds
// @version         1.9.25
// @description     需要配合AdBlock类软件使用！该脚本可以移除那些规避反广告功能或要求解除反广告功能的广告，仅此而已。
// @description:en  This script can remove the ads which avoiding or requesting you to stop blocking them. Just it.
// @author          AnnAngela
// @match           *://*/*
// @run-at          document-start
// @grant           unsafeWindow
// @namespace       https://greasyfork.org/users/129402
// @license         GNU General Public License v3.0 or later
// @compatible      chrome 80
// ==/UserScript==
"use strict";
(function () {
    if (location.host === "adsrff.web.sdo.com") { return location.replace("https://ff.web.sdo.com/web8/index.html#/home"); }
    class Stack extends Error {
        constructor(...a) {
            super(...a);
        }
        getStack(offset = 4) {
            return typeof this.stack === "string" ? this.stack.replace(/^Error\n +/, "").replace(/\n +/g, `\n${" ".repeat(offset)}`) : this.stack;
        }
    }
    const removedAds = [];
    const MutationObserver = unsafeWindow.MutationObserver;
    /**
     * @type {Document} doc
     */
    const doc = unsafeWindow.document;
    /**
     * @argument {string} selector
     * @returns {HTMLElement | null} element
     */
    const $ = (selector) => doc.querySelector(selector);
    /**
     * @argument {string} selector
     * @returns {NodeListOf<HTMLElement> | null} element
     */
    const $$ = (selector) => doc.querySelectorAll(selector);
    const info = (that) => {
        console.info("RemoveAds: ", removedAds.push(that), "\nTarget:", that, "\nParentNode:", that.parentNode, "\nInnerText:", that.innerText);
    };
    const suffixList = {};
    const getRandomSuffix = (str) => {
        if (typeof suffixList[str] !== "string") {
            suffixList[str] = "";
            while (suffixList[str].length < 16) {
                suffixList[str] += (+`${Math.random()}`.substring(2)).toString(36).replace(suffixList[str].length === 0 ? /^\d+/ : "", "");
            }
        }
        return suffixList[str];
    };
    let localstorage;
    try {
        localstorage = unsafeWindow.localStorage;
    } catch (e) {
        console.info("RemoveAds: Tried to get `localStorage` but got an error - ", e);
        localstorage = {
            length: 0,
            key: () => null,
            getItem: () => null,
            setItem: () => { },
            removeItem: () => { },
        };
    }

    if (location.hostname.endsWith(".ff14angler.com")) {
        const removeChild = unsafeWindow.Node.prototype.removeChild;
        unsafeWindow.Node.prototype.removeChild = function (e) {
            if (e.id === "contents") {
                console.info("RemoveAds: Tried to remove contents", e, "but rejected.\n", new Stack().getStack(9));
                return false;
            }
            return removeChild.bind(this)(e);
        };
    } else if ((location.host.includes("bbs.nga.cn") || location.host.includes("bbs.ngacn.cc")) && location.pathname.includes("adpage_insert")) {
        const stylesheet = document.createElement("style");
        stylesheet.innerText = "html, body, * { display: none!important; }";
        doc.body.appendChild(stylesheet);
        const jump = function jump() {
            if (unsafeWindow.getJump) {
                const _getJump = unsafeWindow.getJump.bind(unsafeWindow);
                unsafeWindow.getJump = function () { };
                _getJump();
            }
        };
        setInterval(jump, 10);
    } else if (location.hostname === "www.ruanyifeng.com") {
        console.info("RemoveAds: removed the anti-adb checker.");
        const c = setInterval(() => {
            const img = $('a > img[src*="wangbase.com/blogimg/asset/"]');
            if (img) {
                img.remove();
            } else {
                const entrySponsor = $(".entry-sponsor");
                if (entrySponsor) {
                    entrySponsor.remove();
                    clearInterval(c);
                }
            }
        }, 10);
    } else if (location.hostname.includes("mrcong.com")) {
        const style = document.createElement("style");
        style.innerText = "#fukie1{display:none !important}#fukie2{display:block !important}";
        document.head.appendChild(style);
    }
    const secretKey = `${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`;
    class BlockAdBlock {
        constructor(...args) {
            if (args[0] !== secretKey) {
                console.info("RemoveAds: Got a call to construct BlockAdBlock but denied,\nwith arguments", ...args, ",\nin stack", new Stack().getStack(9));
            }
        }
        check(...args) {
            console.info("RemoveAds: Got a call to blockAdBlock.check but denied,\nwith arguments", ...args, ",\nin stack", new Stack().getStack(9));
        }
        clearEvent(...args) {
            console.info("RemoveAds: Got a call to blockAdBlock.clearEvent but denied,\nwith arguments", ...args, ",\nin stack", new Stack().getStack(9));
        }
        emitEvent(...args) {
            console.info("RemoveAds: Got a call to blockAdBlock.emitEvent but denied,\nwith arguments", ...args, ",\nin stack", new Stack().getStack(9));
        }
        setOption(...args) {
            console.info("RemoveAds: Got a call to blockAdBlock.setOption but denied,\nwith arguments", ...args, ",\nin stack", new Stack().getStack(9));
        }
        on(detected, fn) {
            this[detected === true ? "onDetected" : "onNotDetected"](fn);
            return this;
        }
        onDetected(...args) {
            console.info("RemoveAds: Got a call to blockAdBlock.onDetected but denied,\nwith arguments", ...args, ",\nin stack", new Stack().getStack(9));
            return this;
        }
        onNotDetected(...args) {
            if (typeof args[0] === "function") {
                args[0]();
            }
            console.info("RemoveAds: Got a call to blockAdBlock.onNotDetected but denied,\nwith arguments", ...args, ",\nin stack", new Stack().getStack(9));
            return this;
        }
    }
    const blockAdBlock = new BlockAdBlock(secretKey);
    const blockAdBlockProps = {
        configurable: false,
        enumerable: false,
        get: () => blockAdBlock,
        set: (...args) => {
            console.info("RemoveAds: Got a call to set window.blockAdBlock but denied,\nwith arguments", ...args, ",\nin stack", new Stack().getStack(9));
        },
    };
    const BlockAdBlockProps = {
        configurable: false,
        enumerable: false,
        get: () => BlockAdBlock,
        set: (...args) => {
            console.info("RemoveAds: Got a call to set window.BlockAdBlock but denied,\nwith arguments", ...args, ",\nin stack", new Stack().getStack(9));
        },
    };
    const fabList = ["fuckAdBlock", "blockAdBlock", "sniffAdBlock"];
    const FABList = ["FuckAdBlock", "BlockAdBlock", "SniffAdBlock"];
    fabList.forEach((n) => {
        if (Object.prototype.hasOwnProperty.bind(unsafeWindow)(n)) {
            unsafeWindow[n].__proto__ = new BlockAdBlock(secretKey);
        } else {
            Object.defineProperty(unsafeWindow, n, blockAdBlockProps);
        }
    });
    FABList.forEach((n) => {
        if (Object.prototype.hasOwnProperty.bind(unsafeWindow)(n)) {
            unsafeWindow[n].prototype = BlockAdBlock;
        } else {
            Object.defineProperty(unsafeWindow, n, BlockAdBlockProps);
        }
    });

    const constantVariabls = [
        ["admiral", undefined],
        ["runAntiAdBlock", undefined],
        ["DHAntiAdBlocker", true],
        ["canRunAds", true],
        ["__jsadsuccess", true],
    ];
    for (const [name, value] of constantVariabls) {
        try {
            Object.defineProperty(unsafeWindow, name, {
                configurable: false,
                enumerable: true,
                get() {
                    console.info(`RemoveAds: Got a call trying to get \`${name}\` but denied with returning`, value, ":\n", new Stack().getStack(9));
                    return value;
                },
                set(v) {
                    console.info(`RemoveAds: Got a call trying to get \`${name}\` to this but denied:\n`, v, "\n", new Stack().getStack(9));
                },
            });
        } catch (e) {
            console.info(`RemoveAds: Cannot set global variable \`${name}\` to`, value, "from", unsafeWindow[name], "because:\n", new Stack().getStack.bind(e)(9));
        }
    }

    // let blockBlockAdBlockFlag = false;
    function removeAd() {
        if (!location.host.includes("getadmiral.com")) {
            Array.from($$(`body > :not([${getRandomSuffix("rmAd-admiral")}])`)).forEach((that) => {
                that.setAttribute(getRandomSuffix("rmAd-admiral"), "");
                if (that.querySelector('a[href^="https://getadmiral.com/pb"]')) {
                    info(that);
                    that.remove();
                }
            });
        }
        if (location.host.endsWith("gamepedia.com")) {
            const siderail = $("#siderail");
            if (siderail) { siderail.remove(); }
            const globalWrapper = $("#global-wrapper.with-siderail");
            if (globalWrapper) { globalWrapper.classList.remove("with-siderail"); }
        } else if (!location.host.includes("amplitude.com")) {
            try {
                const keys = [];
                const length = (localstorage || unsafeWindow.localStorage).length;
                for (let i = 0; i < length; i++) {
                    keys.push((localstorage || unsafeWindow.localStorage).key(i));
                }
                keys.filter((k) => k.startsWith("amplitude_")).forEach((k) => {
                    const c = (localstorage || unsafeWindow.localStorage).getItem(k);
                    (localstorage || unsafeWindow.localStorage).removeItem(k);
                    console.info("RemoveAds: Remove the track info from amplitude", removedAds.push([k, c]), "\n", `${k}: ${c}`);
                });
            } catch (e) { }
        }
        if (location.hostname.includes("aternos.org")) {
            const i = doc.querySelector("body > span i.fas.fa-ban");
            const c = unsafeWindow.$('body > div > div> div[style*="overflow: hidden"]');
            if (i || c) {
                c.children().appendTo(".page-content");
                i?.closest?.("body > span")?.remove?.();
                unsafeWindow.$(".body, .header").each(function () {
                    this.style.setProperty("display", "");
                    this.style.setProperty("height", "");
                });
                unsafeWindow.$("#start").each(function () {
                    this._ready = true;
                });
            }
        }
    }
    document.addEventListener("DOMContentLoaded", () => {
        const callback = function () {
            removeAd();
            if (location.href.indexOf("www.baidu.com/s") !== -1) {
                Array.from($$(`#content_left .c-container:not([${getRandomSuffix("rmAd-baidu")}])`)).forEach((ele) => {
                    ele.setAttribute(getRandomSuffix("rmAd-baidu"), "");
                    if (ele.querySelector(".icon-unsafe-icon")) { ele.remove(); }
                    if (!ele.attachShadow) {
                        console.info("RemoveAds (shadowRoot): ", removedAds.push(ele), "\nTarget:", ele, "\nParentNode:", ele.parentNode, "\nInnerText", ele.innerText);
                        const html = ele.outerHTML;
                        const node = doc.createElement("div");
                        ele.before(node);
                        node.outerHTML = html;
                        ele.remove();
                    }
                });
            }
        };
        const observer = new MutationObserver(callback);
        observer.observe(doc.body, { attributes: true, childList: true, subtree: true });
        removeAd();
    });
})();