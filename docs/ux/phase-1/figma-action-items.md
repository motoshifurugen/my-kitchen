# Figma Action Items — IA Issues (UX-001〜015)

このドキュメントは、情報アーキテクチャ関連イシュー（UX-001, 002, 003, 005, 009, 014, 015）を完了するために Figma で作成すべきフレーム・コンポーネント・状態を定義する。

**対象プラットフォーム:** iOS / Android（React Native）
**基準画面サイズ:** 390 × 844pt（iPhone 14 相当）

---

## Figma Project構成

```
my-kitchen / Phase 1 UX
├── IA / Screen Flows          ← UX-001
├── Wireframes / Top           ← S-01
├── Wireframes / Archive       ← UX-002, UX-003 (S-02, S-03)
├── Wireframes / Record Flow   ← UX-005 (S-04a, S-04b, S-04c, S-08)
├── Wireframes / Explore       ← S-05
├── Wireframes / Settings      ← UX-009 (S-06)
├── Wireframes / Onboarding    ← UX-014, UX-015 (S-07a, S-07b, S-07c)
└── Components                 ← 共通コンポーネント
```

---

## 1. UX-001: 全体画面フロー図

### Page: `IA / Screen Flows`

#### Frame 1: Overview Flow Diagram (1920×1080)

**ノード一覧:**

| Node ID | Label | Shape | Size | Position | Fill | Stroke |
|---------|-------|-------|------|----------|------|--------|
| `n-s01` | S-01 トップ | Rounded rect | 120×60 | (200, 400) | #FDFCFA | #C17A50 2pt |
| `n-s02` | S-02 アーカイブ | Rounded rect | 120×60 | (600, 200) | #FDFCFA | #2C2825 1pt |
| `n-s03` | S-03 詳細 | Rounded rect | 120×60 | (800, 200) | #FFF8E7 | #2C2825 1pt |
| `n-s04` | S-04 記録 | Rounded rect | 120×60 | (600, 400) | #FDFCFA | #2C2825 1pt |
| `n-s05` | S-05 探索 | Rounded rect | 120×60 | (600, 600) | #FDFCFA | #2C2825 1pt |
| `n-s06` | S-06 設定 | Rounded rect | 120×60 | (200, 200) | #FDFCFA | #2C2825 1pt |
| `n-s07` | S-07 オンボ | Rounded rect | 120×60 | (0, 400) | #FDFCFA | #2C2825 1pt |
| `n-s08` | S-08 セレブ | Diamond | 80×80 | (800, 400) | #FFF8E7 | #C17A50 2pt |

**コネクタ一覧:**

| From | To | Label | Style | 備考 |
|------|----|-------|-------|------|
| n-s07 | n-s01 | 初回完了 | Solid arrow | |
| n-s01 | n-s02 | Footer棚 | Solid arrow | |
| n-s01 | n-s04 | Footer記録 | Solid arrow | |
| n-s01 | n-s05 | Footer探索 | Solid arrow | |
| n-s01 | n-s06 | Header⚙️ | Solid arrow | |
| n-s02 | n-s03 | タップ | Solid arrow | |
| n-s05 | n-s03 | タップ | Solid arrow | |
| n-s04 | n-s08 | 保存 | Solid arrow | |
| n-s08 | n-s01 | 自動2s | Dashed arrow | |
| n-s06 | n-s01 | 戻る | Dashed arrow | |
| n-s04 | n-s01 | キャンセル | Dashed arrow | |

**スタイルルール:**
- Solid arrow = 進行方向のナビゲーション
- Dashed arrow = 戻る/キャンセル/自動遷移
- Diamond = Effects Layer（セレブレーション）
- 強調枠 (#C17A50) = 起点/終点

---

#### Frame 2: Record Journey Detail (1920×400)

| Node | Label | Position | 備考 |
|------|-------|----------|------|
| `r-01` | S-01 トップ | (100, 200) | 起点 |
| `r-02` | S-04a 写真 | (300, 200) | |
| `r-03` | S-04b 入力 | (500, 200) | |
| `r-04` | S-04c 確認 | (700, 200) | |
| `r-05` | S-08 セレブ | (900, 200) | Diamond |
| `r-06` | S-01 戻り | (1100, 200) | 終点 |

**アノテーション:**
- r-02 の上: 「決定タップ①②」
- r-04 の上: 「決定タップ③」
- r-05 の下: 「2秒自動遷移」

---

## 2. UX-002/003: 棚図鑑 + 料理カード

### Page: `Wireframes / Archive`

#### Frame: S-02 アーカイブ (390×844)

**レイヤー構成（上から）:**

1. **Status bar** (44pt) — プレースホルダー
2. **Header** (48pt)
   - タイトル: "アーカイブ" (center, 17pt semibold)
3. **Tab bar** (44pt)
   - [時系列 | カテゴリ] セグメントコントロール
4. **Card grid** (残り領域 - Footer)
   - 3列グリッド
   - ギャップ: 16pt
   - 左右マージン: 20pt
5. **Footer** (56pt + Safe Area)
   - 3アイテム: 探索/記録/棚

**作成する状態:**

| State | 説明 |
|-------|------|
| Default | カード6枚以上表示 |
| Empty | 空状態メッセージ中央表示 |
| Loading | スケルトンカード表示 |

---

#### Component: `comp-card-small` (110×132)

**構成:**

```
┌────────────────┐
│                │  ← 写真エリア (110×82, 4:3)
│                │
├────────────────┤
│ 料理名         │  ← 15pt semibold, 1行省略
│ ●●●○○         │  ← グレード表現 (11pt)
└────────────────┘
```

**バリアント:**

| Variant | 写真 | グレード |
|---------|------|---------|
| with-photo | 画像 | 1〜5 dots |
| no-photo | プレースホルダー | 1〜5 dots |

---

#### Frame: S-03 詳細モーダル (390×844)

**レイヤー構成:**

1. **Background** — S-02 に blur(20px) + scrim overlay
2. **Modal card** (350×600, centered)
   - 閉じるボタン [×] (左上)
   - 写真エリア (350×262)
   - 料理名 (20pt semibold)
   - グレード表現
   - Divider
   - メモセクション
   - Divider
   - 記録履歴セクション（日付リスト）

**作成する状態:**

| State | 説明 |
|-------|------|
| with-photo | 写真あり |
| no-photo | プレースホルダー表示 |

---

## 3. UX-005: 記録フロー

### Page: `Wireframes / Record Flow`

#### Frame: S-04a 写真選択 (390×844)

**レイヤー構成:**

1. **Header** (48pt)
   - [×] 閉じるボタン (左)
   - タイトル: "記録する" (center)
2. **Content** (中央寄せ)
   - [📷 写真を撮る] — Primary button (large)
   - [🖼 ライブラリから選ぶ] — Secondary button
   - Divider
   - [写真なしで続ける] — Text button
   - 補足: "写真はあとからでも追加できます" (caption)
3. **Footer** — 非表示

**ボタンサイズ:**
- Primary: 350×56pt
- Secondary: 350×48pt
- Text button: auto width

---

#### Frame: S-04b 入力フォーム (390×844)

**レイヤー構成:**

1. **Header** (48pt)
   - [←] 戻るボタン
   - タイトル: "記録する"
2. **Content**
   - 写真プレビュー (170×127, optional)
   - 料理名入力フィールド (必須マーク *)
   - メモ入力エリア (任意)
   - タグ入力 [+ タグを追加]
3. **Bottom bar** (56pt)
   - [確認へ] ボタン

**作成する状態:**

| State | 説明 |
|-------|------|
| empty | 料理名未入力、ボタン disabled |
| valid | 料理名入力済み、ボタン enabled |
| with-photo | 写真プレビューあり |
| no-photo | 写真プレビューなし |
| keyboard | キーボード表示時のレイアウト |

---

#### Frame: S-04c 確認 (390×844)

**レイヤー構成:**

1. **Header** (48pt)
   - [←] 戻るボタン
   - タイトル: "確認"
2. **Content**
   - 写真プレビュー (大)
   - 料理名表示
   - メモ表示 (あれば)
   - タグ表示 (あれば)
   - 補足: "記録はあとから編集できます"
3. **Bottom bar** (56pt)
   - [保存する] Primary button

---

#### Frame: S-08 セレブレーション (390×844)

**レイヤー構成:**

1. **Background** — キッチン世界 (blur なし、visible)
2. **Overlay** — Semi-transparent (#2C2825, 40%)
3. **Content** (中央)
   - メッセージ: "記録しました。" (20pt)
   - 料理名
   - パーティクルエフェクト placeholder (annotation)
4. **Timer indicator** — "2秒後に戻ります" (caption)

---

## 4. UX-009: 設定画面

### Page: `Wireframes / Settings`

#### Frame: S-06 設定 (390×844)

**レイヤー構成:**

1. **Header** (48pt)
   - [←] 戻るボタン
   - タイトル: "設定"
2. **Content** — List形式
   - Section: 通知
     - Row: "通知設定" + [>] chevron
   - Section: サウンド
     - Row: "環境音" + Toggle
     - Row: "記録完了音" + Toggle
   - Section: データ
     - Row: "Kitchen Signals" + [>]
     - Row: "データについて" + [>]
   - Section: アプリについて
     - Row: "バージョン" + "1.0.0"
3. **Footer info**
   - "データは端末内に保存されています" (caption, center)

**Component: Row item**

| Type | 右側要素 |
|------|---------|
| navigation | [>] chevron |
| toggle | Toggle switch |
| value | Text (e.g., "1.0.0") |

---

## 5. UX-014/015: オンボーディング + Signals

### Page: `Wireframes / Onboarding`

#### Frame: S-07a ウェルカム (390×844)

**レイヤー構成:**

1. **Content** (中央寄せ)
   - イラストプレースホルダー (200×200)
   - タイトル: "わたしの台所へようこそ" (20pt)
2. **Bottom** (下寄せ)
   - [はじめる] Primary button
   - [あとで設定する] Text button

---

#### Frame: S-07b Kitchen Signals (390×844)

**レイヤー構成:**

1. **Content**
   - タイトル: "キッチンの空気感を設定しましょう" (17pt)
   - Section: 年代
     - Chip group: [20-30代] [40-50代] [60代〜]
   - Section: 世帯
     - Chip group: [ひとり暮らし] [ファミリー]
   - 補足: "いつでも変更できます" (caption)
2. **Bottom**
   - [次へ] Primary button
   - [スキップ] Text button

**Component: Chip (selection)**

| State | Fill | Stroke | Text |
|-------|------|--------|------|
| unselected | transparent | #E5E0DA | #6B6560 |
| selected | #C17A50 | none | #FFFFFF |

---

#### Frame: S-07c 完了 (390×844)

**レイヤー構成:**

1. **Content** (中央寄せ)
   - イラストプレースホルダー (200×200)
   - タイトル: "準備ができました" (20pt)
   - サブタイトル: "さっそく記録をはじめましょう" (15pt)
2. **Bottom**
   - [はじめる] Primary button

---

## 6. 共通コンポーネント

### Page: `Components`

| Component | Size | Variants |
|-----------|------|----------|
| `comp-footer` | 390×56 | default, recording-active |
| `comp-footer-item` | 80×48 | default, active |
| `comp-header-back` | 390×48 | with-title |
| `comp-header-close` | 390×48 | with-title |
| `comp-button-primary` | 350×56 | enabled, disabled |
| `comp-button-secondary` | 350×48 | enabled, disabled |
| `comp-button-text` | auto | default |
| `comp-input-text` | 350×48 | empty, filled, error |
| `comp-input-textarea` | 350×120 | empty, filled |
| `comp-toggle` | 51×31 | on, off |
| `comp-chip` | auto×36 | selected, unselected |
| `comp-card-small` | 110×132 | with-photo, no-photo |
| `comp-row-item` | 350×56 | navigation, toggle, value |

---

## Export規則

### 命名規則

```
{type}-{name}-v{version}.png

type: flows, wire, comp
name: 英小文字ハイフン区切り
version: 整数（1, 2, 3...）
```

### Export設定

- Format: PNG @2x
- Background: Include (white)
- Destination: `docs/ux/phase-1/figma/exports/`

### Export一覧

| Filename | Frame |
|----------|-------|
| flows-overview-v1.png | Overview Flow Diagram |
| flows-record-v1.png | Record Journey Detail |
| wire-s01-top-v1.png | S-01 トップ |
| wire-s02-archive-v1.png | S-02 アーカイブ |
| wire-s02-empty-v1.png | S-02 空状態 |
| wire-s03-detail-v1.png | S-03 詳細 |
| wire-s04a-photo-v1.png | S-04a 写真 |
| wire-s04b-input-v1.png | S-04b 入力 |
| wire-s04c-confirm-v1.png | S-04c 確認 |
| wire-s05-explore-v1.png | S-05 探索 |
| wire-s06-settings-v1.png | S-06 設定 |
| wire-s07a-welcome-v1.png | S-07a ウェルカム |
| wire-s07b-signals-v1.png | S-07b Signals |
| wire-s07c-complete-v1.png | S-07c 完了 |
| wire-s08-celebration-v1.png | S-08 セレブレーション |

---

## 更新履歴

| 日付 | 更新内容 |
|------|---------|
| 2026-02-01 | 初版作成（UX-001, 002, 003, 005, 009, 014, 015 対応） |
