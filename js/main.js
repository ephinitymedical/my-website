/* ============================================================
   Ephinity Medical — site scripts
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Header: shadow on scroll ---------- */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 10);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Mobile nav ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("global-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "メニューを閉じる" : "メニューを開く");
      document.body.style.overflow = open ? "hidden" : "";
    });
    // メニュー内リンクを押したら閉じる
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      }
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealTargets = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealTargets.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealTargets.forEach(function (el) { io.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Contact form ----------
     GitHub Pages はサーバー処理を持たないため、フォーム送信には
     Formspree などの外部フォームサービスを利用します。

     ● 本番設定手順:
       1. https://formspree.io で無料アカウントを作成しフォームを作る
       2. contact.html の <form id="contact-form" data-endpoint=""> の
          data-endpoint に発行された URL（例: https://formspree.io/f/xxxxxxx）を設定
       3. これだけで送信内容がメールに届くようになります

     data-endpoint が空の間は「デモモード」として動作し、
     入力チェック後にサンクスページへ遷移するだけで内容は送信されません。
     （WordPress + SWELL 移行後は Contact Form 7 等に置き換え予定）
  ------------------------------------------------ */
  var form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var endpoint = form.getAttribute("data-endpoint");
      var submitBtn = form.querySelector('[type="submit"]');

      if (!endpoint) {
        console.info("[Ephinity] デモモード: data-endpoint 未設定のため送信は行われません。");
        window.location.href = "thanks.html";
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.dataset.label = submitBtn.textContent;
        submitBtn.textContent = "送信中…";
      }

      fetch(endpoint, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      })
        .then(function (res) {
          if (res.ok) {
            window.location.href = "thanks.html";
          } else {
            throw new Error("send failed");
          }
        })
        .catch(function () {
          alert("送信に失敗しました。お手数ですが、時間をおいて再度お試しください。");
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = submitBtn.dataset.label || "送信する";
          }
        });
    });
  }
})();
