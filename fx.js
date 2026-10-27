/* ============================================================
   fx.js — 在线主页的动效层（与 fx.css 配套，删除两者即可回退）
   1) 开场动画   2) 粒子星座背景   3) 滚动进度 + 回顶
   4) 滚动渐显   5) 鼠标光斑       6) 导航当前区块高亮
   ============================================================ */
(function () {
    "use strict";

    var reduceMotion = window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function store(key, value) {
        try {
            if (value === undefined) return window.sessionStorage.getItem(key);
            window.sessionStorage.setItem(key, value);
        } catch (e) { /* 隐私模式下忽略 */ }
        return null;
    }

    /* ---------------- 1. 开场动画 ---------------- */
    (function intro() {
        var el = document.getElementById("fxIntro");
        if (!el) return;
        if (reduceMotion || store("fxIntroDone") === "1") {
            el.parentNode.removeChild(el);
            return;
        }
        store("fxIntroDone", "1");

        var finished = false;
        function finish() {
            if (finished) return;
            finished = true;
            el.classList.add("is-done");
            window.setTimeout(function () {
                if (el.parentNode) el.parentNode.removeChild(el);
            }, 900);
        }
        window.setTimeout(finish, 1750);
        el.addEventListener("click", finish);
        window.addEventListener("wheel", finish, { passive: true });
        window.addEventListener("touchstart", finish, { passive: true });
        window.addEventListener("keydown", finish);
    }());

    /* ---------------- 2. 粒子星座背景 ---------------- */
    (function particles() {
        var canvas = document.querySelector(".fx-particles");
        if (!canvas || reduceMotion || !canvas.getContext) return;
        var ctx = canvas.getContext("2d");
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        var w = 0, h = 0, dots = [], raf = null, visible = true;
        var pointer = { x: -9999, y: -9999 };

        function resize() {
            w = canvas.clientWidth;
            h = canvas.clientHeight;
            canvas.width = Math.round(w * dpr);
            canvas.height = Math.round(h * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            var count = Math.min(80, Math.max(24, Math.round(w * h / 26000)));
            dots = [];
            for (var i = 0; i < count; i++) {
                dots.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    vx: (Math.random() - 0.5) * 0.18,
                    vy: (Math.random() - 0.5) * 0.18,
                    r: Math.random() * 1.3 + 0.6
                });
            }
        }

        function frame() {
            ctx.clearRect(0, 0, w, h);
            var i, j, p, q, dx, dy, d2, d, a;

            for (i = 0; i < dots.length; i++) {
                p = dots[i];
                p.x += p.vx;
                p.y += p.vy;
                dx = pointer.x - p.x;
                dy = pointer.y - p.y;
                d2 = dx * dx + dy * dy;
                if (d2 < 26000) {
                    p.vx += dx * 0.000016;
                    p.vy += dy * 0.000016;
                }
                p.vx *= 0.995;
                p.vy *= 0.995;
                if (Math.abs(p.vx) < 0.05) p.vx += (Math.random() - 0.5) * 0.03;
                if (Math.abs(p.vy) < 0.05) p.vy += (Math.random() - 0.5) * 0.03;
                if (p.x < -30) p.x = w + 30;
                if (p.x > w + 30) p.x = -30;
                if (p.y < -30) p.y = h + 30;
                if (p.y > h + 30) p.y = -30;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = "rgba(37, 99, 235, .5)";
                ctx.fill();
            }

            for (i = 0; i < dots.length; i++) {
                for (j = i + 1; j < dots.length; j++) {
                    p = dots[i];
                    q = dots[j];
                    dx = p.x - q.x;
                    dy = p.y - q.y;
                    d2 = dx * dx + dy * dy;
                    if (d2 < 13000) {
                        d = Math.sqrt(d2);
                        a = (1 - d / 114) * 0.32;
                        ctx.strokeStyle = "rgba(99, 102, 241," + a.toFixed(3) + ")";
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(q.x, q.y);
                        ctx.stroke();
                    }
                }
            }

            raf = visible ? window.requestAnimationFrame(frame) : null;
        }

        resize();
        frame();
        window.addEventListener("resize", function () {
            window.clearTimeout(canvas._t);
            canvas._t = window.setTimeout(resize, 180);
        });
        window.addEventListener("pointermove", function (e) {
            pointer.x = e.clientX;
            pointer.y = e.clientY;
        }, { passive: true });
        document.addEventListener("visibilitychange", function () {
            visible = !document.hidden;
            if (visible && !raf) frame();
        });
    }());

    /* ---------------- 3. 滚动进度 + 回到顶部 ---------------- */
    (function scrollUi() {
        var bar = document.getElementById("fxProgress");
        var top = document.getElementById("fxTop");
        var ticking = false;

        function update() {
            ticking = false;
            var doc = document.documentElement;
            var max = doc.scrollHeight - window.innerHeight;
            var y = window.pageYOffset || doc.scrollTop || 0;
            if (bar) {
                var ratio = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
                bar.style.transform = "scaleX(" + ratio.toFixed(4) + ")";
            }
            if (top) top.classList.toggle("is-on", y > 560);
            var navBar = document.querySelector(".nav-bar");
            if (navBar) navBar.classList.toggle("is-scrolled", y > 12);
        }

        window.addEventListener("scroll", function () {
            if (!ticking) {
                ticking = true;
                window.requestAnimationFrame(update);
            }
        }, { passive: true });
        window.addEventListener("resize", update);
        update();

        if (top) {
            top.addEventListener("click", function () {
                window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
            });
        }
    }());

    /* ---------------- 4. 滚动渐显 ---------------- */
    (function reveal() {
        if (reduceMotion || !("IntersectionObserver" in window)) return;
        var nodes = document.querySelectorAll(
            ".header-section, .section-header, .card-body, .lifestyle-card, .game-entry-btn, .intro-p"
        );
        if (!nodes.length) return;

        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("fx-in");
                io.unobserve(entry.target);
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

        Array.prototype.forEach.call(nodes, function (node, i) {
            node.classList.add("fx-reveal");
            // 生活志三张卡片错开出现
            if (node.classList.contains("lifestyle-card")) {
                node.style.transitionDelay = (i % 3) * 80 + "ms";
            }
            io.observe(node);
        });
    }());

    /* ---------------- 5. 鼠标光斑 ---------------- */
    (function spotlight() {
        var bg = document.querySelector(".fx-bg");
        if (!bg || reduceMotion) return;
        var pending = false, px = 0, py = 0;
        window.addEventListener("pointermove", function (e) {
            px = e.clientX;
            py = e.clientY;
            if (pending) return;
            pending = true;
            window.requestAnimationFrame(function () {
                pending = false;
                bg.style.setProperty("--fx-mx", px + "px");
                bg.style.setProperty("--fx-my", py + "px");
            });
        }, { passive: true });
    }());

    /* ---------------- 6. 导航当前区块高亮 ---------------- */
    (function scrollSpy() {
        var links = Array.prototype.slice.call(
            document.querySelectorAll('.nav-link[href^="#"]')
        );
        if (!links.length) return;

        var pairs = [];
        links.forEach(function (link) {
            var id = link.getAttribute("href").slice(1);
            if (!id) return;
            var target = document.getElementById(id);
            if (target) pairs.push({ link: link, target: target });
        });
        if (!pairs.length) return;

        var ticking = false;
        function update() {
            ticking = false;
            var pos = window.pageYOffset + 150;
            var current = null;
            pairs.forEach(function (p) {
                if (p.target.offsetTop <= pos) current = p;
            });
            pairs.forEach(function (p) {
                p.link.classList.toggle("is-active", p === current);
            });
        }
        window.addEventListener("scroll", function () {
            if (!ticking) {
                ticking = true;
                window.requestAnimationFrame(update);
            }
        }, { passive: true });
        update();
    }());
}());
