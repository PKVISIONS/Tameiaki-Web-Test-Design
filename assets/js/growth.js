(function () {
  "use strict";

  var SIGNUP = "https://emblem.gr/?register=1&p=nav&utm_source=land-tamiaki";
  var CALLBACK = "https://emblem.gr/callmeback.html?utm_source=land-tamiaki";

  var PLANS = [
    { id: "starter", name: "Starter", monthly: 6, receipts: 100, yearly: 72 },
    { id: "standard", name: "Standard", monthly: 12, receipts: 300, yearly: 144 },
    { id: "premium", name: "Premium", monthly: 18, receipts: 600, yearly: 216 },
    { id: "allinone", name: "All in One", monthly: 10, receipts: Infinity, yearly: 120 },
  ];

  var HARDWARE_YEAR_1 = 600 + 120;

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  function $all(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  function detectAiSource() {
    var params = new URLSearchParams(window.location.search);
    var utm = (params.get("utm_source") || "").toLowerCase();
    var ref = (document.referrer || "").toLowerCase();
    var keys = ["chatgpt", "openai", "perplexity", "claude", "anthropic", "gemini", "copilot", "you.com", "phind"];
    var hit = keys.find(function (k) {
      return utm.indexOf(k) !== -1 || ref.indexOf(k) !== -1;
    });
    return hit || "";
  }

  window.dataLayer = window.dataLayer || [];

  window.TamiakiAnalytics = {
    track: function (name, payload) {
      var event = Object.assign(
        {
          event: name,
          page: "tamiaki",
          ai_source: detectAiSource() || undefined,
        },
        payload || {},
        { ts: Date.now() }
      );
      window.dataLayer.push(event);
      if (typeof window.gtag === "function") {
        window.gtag("event", name, payload || {});
      }
      try {
        var log = JSON.parse(localStorage.getItem("tamiaki_funnel") || "[]");
        log.push(event);
        localStorage.setItem("tamiaki_funnel", JSON.stringify(log.slice(-80)));
      } catch (e) {}
    },
  };

  function initAiReferral() {
    var ai = detectAiSource();
    if (ai) {
      window.TamiakiAnalytics.track("ai_referral", { source: ai, referrer: document.referrer });
    }
    window.TamiakiAnalytics.track("page_view", { path: location.pathname });
  }

  function initCtaTracking() {
    document.addEventListener("click", function (e) {
      var signup = e.target.closest(".js-cta-signup");
      var callback = e.target.closest(".js-cta-callback");
      if (signup) {
        window.TamiakiAnalytics.track("signup_start", {
          location: signup.getAttribute("data-cta-location") || "unknown",
        });
      }
      if (callback) {
        window.TamiakiAnalytics.track("callback_request", {
          location: callback.getAttribute("data-cta-location") || "unknown",
        });
      }
    });
  }

  function initTicker() {
    var el = $("#signupTicker");
    if (!el) return;
    var minutes = (Math.floor(Date.now() / 60000) % 11) + 1;
    el.textContent = "Τελευταία εγγραφή πριν " + minutes + " λεπτά";
  }

  function initIndustry() {
    var buttons = $all(".industry-btn");
    var cards = $all("[data-industries]");
    if (!buttons.length) return;

    function apply(id) {
      buttons.forEach(function (b) {
        b.classList.toggle("is-active", b.getAttribute("data-industry") === id);
      });
      cards.forEach(function (card) {
        var list = (card.getAttribute("data-industries") || "all").split(",");
        var match = id === "all" || list.indexOf("all") !== -1 || list.indexOf(id) !== -1;
        card.classList.toggle("is-hot", match && id !== "all");
        card.classList.toggle("is-dim", !match);
      });
      window.TamiakiAnalytics.track("industry_select", { industry: id });
    }

    buttons.forEach(function (b) {
      b.addEventListener("click", function () {
        apply(b.getAttribute("data-industry"));
      });
    });
  }

  function pickPlan(receipts) {
    if (receipts <= 100) return PLANS[0];
    if (receipts <= 300) return PLANS[1];
    if (receipts <= 600) return PLANS[2];
    return PLANS[3];
  }

  function initCalculator() {
    var slider = $("#receiptSlider");
    var count = $("#receiptCount");
    var result = $("#calcResult");
    var compare = $("#calcCompare");
    if (!slider || !result) return;

    function render() {
      var n = parseInt(slider.value, 10);
      if (count) count.textContent = n.toLocaleString("el-GR");
      var plan = pickPlan(n);
      var save = Math.max(0, HARDWARE_YEAR_1 - plan.yearly);
      result.innerHTML =
        '<strong>Το πακέτο ' +
        plan.name +
        " είναι ιδανικό για σένα — €" +
        plan.monthly +
        "/μήνα.</strong>" +
        "<span>Γλυτώνεις ~€" +
        save +
        "/χρόνο vs. φυσική ταμειακή στον πρώτο χρόνο.</span>";
      if (compare) {
        compare.textContent =
          "Μια φυσική ταμειακή κοστίζει €400–€800 + €120/χρόνο συντήρηση. Με Emblem γλυτώνεις €" +
          save +
          " τον πρώτο χρόνο.";
      }
      $all(".pricing-card").forEach(function (card) {
        var id = card.getAttribute("data-plan");
        card.classList.toggle("is-recommended", id === plan.id);
      });
    }

    slider.addEventListener("input", render);
    slider.addEventListener("change", function () {
      window.TamiakiAnalytics.track("pricing_calculator", { receipts: parseInt(slider.value, 10) });
    });
    render();
  }

  function qrBits(seed) {
    var bits = [];
    var x = seed || 1;
    for (var i = 0; i < 100; i++) {
      x = (x * 1103515245 + 12345) & 0x7fffffff;
      bits.push(x % 3 === 0);
    }
    for (var r = 0; r < 3; r++) {
      for (var c = 0; c < 3; c++) {
        bits[r * 10 + c] = true;
        bits[r * 10 + (7 + c)] = true;
        bits[(7 + r) * 10 + c] = true;
      }
    }
    return bits;
  }

  function initDemo() {
    var root = $("#posDemo");
    if (!root) return;

    var PRODUCTS = [
      { id: "coffee", name: "ΚΑΦΕΣ", price: 2.5, vat: 24 },
      { id: "cookies", name: "COOKIES", price: 2.0, vat: 24 },
      { id: "sandwich", name: "SANDWICH", price: 3.5, vat: 24 },
      { id: "croissant", name: "CROISSANT", price: 3.0, vat: 24 },
    ];

    var lines = [];
    var input = "";
    var pendingQty = 1;
    var started = false;
    var payOverlay = $("#posPayOverlay");
    var doneOverlay = $("#posDoneOverlay");

    function money(n) {
      return n.toFixed(2) + "€";
    }

    function total() {
      return lines.reduce(function (s, i) {
        return s + i.qty * i.price;
      }, 0);
    }

    function setPayEnabled(on) {
      ["posPay", "posCash"].forEach(function (id) {
        var btn = $("#" + id);
        if (!btn) return;
        btn.disabled = !on;
        btn.classList.toggle("is-disabled", !on);
      });
    }

    function renderInput() {
      $("#posInput").textContent = input;
    }

    function renderCart() {
      var box = $("#posLines");
      if (!lines.length) {
        box.innerHTML = "";
      } else {
        box.innerHTML = lines
          .map(function (i) {
            return (
              '<button type="button" class="cr-line" data-line="' +
              i.id +
              '"><span class="cr-qty">' +
              i.qty +
              " x " +
              i.price.toFixed(2) +
              '€</span><span class="cr-name">' +
              i.name +
              '</span><span class="cr-vat">' +
              i.vat +
              '%</span><span class="cr-tot">' +
              money(i.qty * i.price) +
              "</span></button>"
            );
          })
          .join("");
      }
      var t = total();
      $("#posPayAmt").textContent = t.toFixed(2) + " €";
      setPayEnabled(t > 0);
    }

    function drawQr(seed) {
      var host = $("#posQr");
      host.innerHTML = qrBits(seed)
        .map(function (on) {
          return "<i class='" + (on ? "on" : "") + "'></i>";
        })
        .join("");
    }

    function markStarted() {
      if (started) return;
      started = true;
      window.TamiakiAnalytics.track("demo_started");
    }

    function addProduct(id) {
      var p = PRODUCTS.filter(function (x) {
        return x.id === id;
      })[0];
      if (!p) return;
      markStarted();
      var qty = pendingQty;
      if (input && !isNaN(parseFloat(input))) {
        qty = parseFloat(input);
      }
      if (!qty || qty <= 0) qty = 1;
      var existing = lines.filter(function (l) {
        return l.id === p.id;
      })[0];
      if (existing && qty === 1 && !input) {
        existing.qty += 1;
      } else if (existing) {
        existing.qty += qty;
      } else {
        lines.push({ id: p.id, name: p.name, price: p.price, vat: p.vat, qty: qty });
      }
      input = "";
      pendingQty = 1;
      renderInput();
      renderCart();
    }

    function complete(pay) {
      if (!lines.length) return;
      var t = total();
      drawQr(Math.floor(t * 100) + lines.length * 17);
      $("#posPayLabel").textContent =
        pay === "card" ? "Κάρτα / SoftPos" : pay === "iris" ? "IRIS" : "Μετρητά";
      $("#posSeconds").textContent = String(5 + Math.min(6, lines.length));
      if (payOverlay) payOverlay.hidden = true;
      if (doneOverlay) doneOverlay.hidden = false;
      window.TamiakiAnalytics.track("demo_completed", {
        items: lines.length,
        total: t,
        pay: pay,
      });
    }

    $all("[data-digit]", root).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var d = btn.getAttribute("data-digit");
        if (d === "." && input.indexOf(".") !== -1) return;
        if (input.length > 10) return;
        input += d;
        renderInput();
      });
    });

    var ce = $("[data-ce]", root);
    if (ce) {
      ce.addEventListener("click", function () {
        if (input) {
          input = "";
          renderInput();
          return;
        }
        if (lines.length) {
          var last = lines[lines.length - 1];
          if (last.qty > 1) last.qty -= 1;
          else lines.pop();
          renderCart();
        }
      });
    }

    var times = $("[data-times]", root);
    if (times) {
      times.addEventListener("click", function () {
        var n = parseFloat(input);
        if (!isNaN(n) && n > 0) pendingQty = n;
        input = "";
        renderInput();
      });
    }

    $all(".cr-mat", root).forEach(function (btn) {
      btn.addEventListener("click", function () {
        addProduct(btn.getAttribute("data-id"));
      });
    });

    $("#posLines").addEventListener("click", function (e) {
      var row = e.target.closest(".cr-line");
      if (!row) return;
      var id = row.getAttribute("data-line");
      lines = lines.filter(function (l) {
        if (l.id !== id) return true;
        if (l.qty > 1) {
          l.qty -= 1;
          return true;
        }
        return false;
      });
      renderCart();
    });

    $("#posPay").addEventListener("click", function () {
      if (!lines.length) return;
      if (payOverlay) payOverlay.hidden = false;
    });

    $("#posCash").addEventListener("click", function () {
      complete("cash");
    });

    $all("[data-pay]", root).forEach(function (btn) {
      btn.addEventListener("click", function () {
        complete(btn.getAttribute("data-pay"));
      });
    });

    var cancel = $("#posPayCancel");
    if (cancel) {
      cancel.addEventListener("click", function () {
        if (payOverlay) payOverlay.hidden = true;
      });
    }

    $("#posReset").addEventListener("click", function () {
      lines = [];
      input = "";
      pendingQty = 1;
      started = false;
      if (doneOverlay) doneOverlay.hidden = true;
      if (payOverlay) payOverlay.hidden = true;
      renderInput();
      renderCart();
    });

    renderInput();
    renderCart();
    drawQr(42);
  }

  function initDeviceShowcase() {
    var root = document.getElementById("device-showcase");
    if (!root) return;

    var tones = ["tablet", "phone", "pos"];
    var total = 3;
    var current = 0;
    var copies = $all(".hw-copy", root);
    var shots = $all(".hw-shot", root);
    var tabs = $all(".hw-tab", root);
    var cards = $all(".hw-card", root);
    var panel = $(".hw-feature", root);
    var scrolly = $(".hw-scrolly", root);
    var pin = $(".hw-pin", root);
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var ticking = false;
    var ignoreScroll = false;
    var stepTargets = [0.12, 0.5, 0.88];

    function navOffset() {
      var raw = getComputedStyle(document.documentElement).getPropertyValue("--nav-offset");
      return parseInt(raw, 10) || 104;
    }

    function apply(step) {
      if (step < 0) step = 0;
      if (step > total - 1) step = total - 1;
      current = step;
      copies.forEach(function (el, i) {
        el.classList.toggle("is-active", i === step);
      });
      shots.forEach(function (el, i) {
        el.classList.toggle("is-active", i === step);
      });
      tabs.forEach(function (el, i) {
        var on = i === step;
        el.classList.toggle("is-active", on);
        el.setAttribute("aria-selected", on ? "true" : "false");
      });
      cards.forEach(function (el, i) {
        el.classList.toggle("is-active", i === step);
      });
      root.classList.toggle("is-phone-step", step === 1);
      if (panel) {
        panel.setAttribute("data-tone", tones[step]);
        panel.setAttribute("aria-labelledby", "hw-tab-" + step);
      }
    }

    function progress() {
      if (!scrolly || !pin) return 0;
      var range = scrolly.offsetHeight - pin.offsetHeight;
      if (range <= 0) return 0;
      var scrolled = navOffset() - scrolly.getBoundingClientRect().top;
      return Math.max(0, Math.min(1, scrolled / range));
    }

    function stepFromProgress(p) {
      if (p < 1 / 3) return 0;
      if (p < 2 / 3) return 1;
      return 2;
    }

    function unlockScroll() {
      ignoreScroll = false;
    }

    function scrollToStep(step, track) {
      if (step < 0) step = 0;
      if (step > total - 1) step = total - 1;
      apply(step);
      if (track) window.TamiakiAnalytics.track("device_showcase", { step: step });
      if (reduced || !scrolly || !pin) return;

      var range = scrolly.offsetHeight - pin.offsetHeight;
      var startY = window.scrollY + scrolly.getBoundingClientRect().top - navOffset();
      var y = startY + stepTargets[step] * Math.max(range, 0);
      ignoreScroll = true;
      window.scrollTo({ top: y, behavior: "smooth" });
      if ("onscrollend" in window) {
        window.addEventListener("scrollend", unlockScroll, { once: true });
        window.setTimeout(unlockScroll, 1200);
      } else {
        window.setTimeout(unlockScroll, 900);
      }
    }

    function go(step, track) {
      scrollToStep(step, track);
    }

    function bind(els) {
      els.forEach(function (el) {
        el.addEventListener("click", function () {
          go(parseInt(el.getAttribute("data-step"), 10), true);
        });
      });
    }

    bind(tabs);
    bind(cards);

    tabs.forEach(function (tab, i) {
      tab.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight") go((i + 1) % total, true);
        if (e.key === "ArrowLeft") go((i - 1 + total) % total, true);
      });
    });

    $all(".js-hw-try", root).forEach(function (link) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        go(1, true);
      });
    });

    var startX = 0;
    var stage = $(".hw-feature-visual", root);
    if (stage) {
      stage.addEventListener(
        "touchstart",
        function (e) {
          if (e.target.closest(".cr-phone")) return;
          startX = e.changedTouches[0].clientX;
        },
        { passive: true }
      );
      stage.addEventListener(
        "touchend",
        function (e) {
          if (e.target.closest(".cr-phone")) return;
          var dx = e.changedTouches[0].clientX - startX;
          if (Math.abs(dx) < 40) return;
          if (dx < 0) go(Math.min(total - 1, current + 1), true);
          else go(Math.max(0, current - 1), true);
        },
        { passive: true }
      );
    }

    function onScroll() {
      if (ignoreScroll || reduced || !scrolly) return;
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        ticking = false;
        var next = stepFromProgress(progress());
        if (next !== current) apply(next);
      });
    }

    apply(0);

    if (!reduced) {
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }

    if (window.location.hash === "#live-demo") {
      window.requestAnimationFrame(function () {
        go(1, false);
      });
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    initAiReferral();
    initCtaTracking();
    initTicker();
    initIndustry();
    initCalculator();
    initDemo();
    initDeviceShowcase();
    var form = document.querySelector(".demo-form");
    if (form) {
      form.addEventListener("submit", function () {
        window.TamiakiAnalytics.track("callback_request", { location: "contact-form" });
      });
    }
  });
})();
