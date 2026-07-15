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
     送信先: Googleフォーム「FemStage お問い合わせ」
     サイトのフォームの見た目はそのままに、入力内容を Googleフォームの
     回答として転送する（回答はGoogleフォームの「回答」タブ／
     リンクしたスプレッドシートで閲覧できる）。

     ⚠ Googleフォーム側の質問を編集・削除すると下記の entry ID が
       変わり、送信が届かなくなります。フォームの質問は変更しないこと。
       変更する場合は GFORM_FIELDS の ID も取り直して更新すること。
  ------------------------------------------------ */
  var GFORM_ACTION =
    "https://docs.google.com/forms/d/e/1FAIpQLSdRwFGXx8p8yLzWTETg4kC6aGrcoTgcFcm8F3BXEE450tfrqw/formResponse";
  var GFORM_FIELDS = {
    "氏名": "entry.284379273",
    "メールアドレス": "entry.252485725",
    "会社名": "entry.349867253",
    "役職": "entry.1867964301",
    "問い合わせ内容": "entry.1002718503"
  };

  var form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var submitBtn = form.querySelector('[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "送信中…";
      }

      var body = new URLSearchParams();
      Object.keys(GFORM_FIELDS).forEach(function (name) {
        var field = form.elements[name];
        body.append(GFORM_FIELDS[name], field ? field.value : "");
      });

      // Googleフォームは CORS ヘッダーを返さないため no-cors で送信する
      // （レスポンスは読めないが送信自体は記録される）
      fetch(GFORM_ACTION, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString()
      })
        .then(function () {
          window.location.href = "thanks.html";
        })
        .catch(function () {
          alert("送信に失敗しました。お手数ですが、時間をおいて再度お試しください。");
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = "送信する";
          }
        });
    });
  }
})();
