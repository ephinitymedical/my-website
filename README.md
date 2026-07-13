# 株式会社エフィニティメディカル コーポレートサイト

GitHub Pages で公開できる静的HTMLサイトです。将来的に WordPress + SWELL へ移行する前提で、シンプルなページ構造・CSS変数ベースの配色設計にしています。

## ページ構成

| ファイル | ページ |
|---|---|
| `index.html` | トップページ（キャッチコピー → 課題提起 → 事業内容 → 選ばれる理由・代表紹介 → 相談フロー → CTA） |
| `about.html` | 会社概要（企業理念・事業内容・会社情報） |
| `profile.html` | 代表紹介（プロフィール・経歴・代表メッセージ） |
| `service.html` | サービス詳細 |
| `contact.html` | お問い合わせフォーム |
| `thanks.html` | 送信完了（サンクスページ） |
| `privacy.html` | プライバシーポリシー |
| `404.html` | Not Found ページ |

共通アセット: `css/style.css` / `js/main.js` / `img/`

## ローカルでの確認

```bash
cd ephinity-site
python3 -m http.server 4173
# → http://localhost:4173 をブラウザで開く
```

## GitHub Pages での公開手順

1. GitHub で新しいリポジトリを作成（例: `ephinity-site`）
2. このフォルダをプッシュ:
   ```bash
   cd ephinity-site
   git init
   git add .
   git commit -m "コーポレートサイト初版"
   git branch -M main
   git remote add origin https://github.com/<ユーザー名>/ephinity-site.git
   git push -u origin main
   ```
3. リポジトリの **Settings → Pages** を開き、
   **Source: Deploy from a branch / Branch: main / フォルダ: /(root)** を選択して保存
4. 数分後に `https://<ユーザー名>.github.io/ephinity-site/` で公開されます

※ リンクはすべて相対パスなので、サブパス配信（`/ephinity-site/`）でも独自ドメインでもそのまま動きます。

## ⚠️ 公開前に必要な作業

### 1. お問い合わせフォームの送信先設定（必須）

GitHub Pages はサーバー処理を持たないため、フォーム送信には外部サービスを使います。

1. [Formspree](https://formspree.io/)（無料枠あり）でアカウントを作成し、フォームを作成
2. 発行されたエンドポイントURLを `contact.html` の form タグに設定:
   ```html
   <form class="contact-form" id="contact-form" data-endpoint="https://formspree.io/f/xxxxxxxx" novalidate>
   ```
3. 設定後、`contact.html` 内の注意書き（`form-note` の段落）を削除

**未設定の間はデモモード**（入力チェック後にサンクスページへ遷移するだけで、内容はどこにも送信されません）。

### 補足

- 代表写真は `img/ceo.jpg`（1334×2000px）。差し替える場合は同名で上書きすれば全ページに反映されます
- メールアドレスは `info@ephinitymedical.com` で統一済み（全ページのフッター・about.html・contact.html）

## WordPress + SWELL への移行メモ

- 各HTMLは WordPress の**固定ページ**に1対1で対応します（トップ / About / Profile / Service / Contact / プライバシーポリシー）
- 配色は `css/style.css` の `:root` 変数に集約 → SWELL カスタマイザーの「メインカラー」に `#b04a5f`、テキストに `#3a3440` を設定すると近い見た目になります
- フォント: 見出し = Zen Old Mincho（明朝）、本文 = Noto Sans JP → SWELL のフォント設定で同等の組み合わせを選択
- お問い合わせフォームは Contact Form 7 / Snow Monkey Forms 等に置き換え（項目: 氏名・メールアドレス・会社名・役職・問い合わせ内容 + プライバシーポリシー同意）
- サンクスページ（thanks.html 相当）はフォームプラグインのリダイレクト設定で再現
