> **⚠️ このファイルはアーカイブされました**
>
> このファイルの内容は、Figmaで管理されるべきTODOです。
> Figma内で管理してください。
>
> ---

# 02-10: Figmaデザインファイル & TODO
_Figma Design Files & TODO_

[← 戻る](../02-core-wireframes.md)

---

## Figmaデザインファイル

**Figma Project:** `my-kitchen / Phase 1 UX`

### Page構成

| Page | 内容 |
|------|------|
| `IA / Screen Flows` | 画面遷移図、ジャーニーマップ |
| `Wireframes / Top` | S-01 トップ画面 |
| `Wireframes / Shelf` | S-02a 本棚、S-02b 図鑑内カード一覧、S-02c 本棚ログ、S-02d アニバーサリー、S-03 詳細 |
| `Wireframes / Record Flow` | S-04a〜c、S-08 |
| `Wireframes / Explore` | S-05 探索 |
| `Wireframes / Settings` | S-06 設定 |
| `Wireframes / Onboarding` | S-07a〜c |
| `Components` | Footer、Card、Button 等 |

### Export先

```
docs/ux/phase-1/figma/exports/
├── flows-overview-v1.png
├── flow-record-v1.png
├── wire-s01-top-v1.png
├── wire-s02a-shelf-v1.png
├── wire-s02b-encyclopedia-cards-v1.png
├── wire-s02c-shelf-log-v1.png
├── wire-s02d-anniversary-v1.png
├── wire-s03-detail-v1.png
├── wire-s04a-photo-v1.png
├── wire-s04b-input-v1.png
├── wire-s04c-confirm-v1.png
├── wire-s05-explore-v1.png
├── wire-s06-settings-v1.png
├── wire-s07-onboarding-v1.png
└── wire-s08-celebration-v1.png
```

---

## TODO / 未決定事項

- [x] カードのアスペクト比最終決定 → **4:3 採用**
- [x] グリッド列数のレスポンシブ閾値 → **375pt（3列/2列切り替え）**
- [ ] オンボーディングのイラストスタイル（UX-036 2.5Dアセット仕様で決定）
- [ ] S-04b タグ入力UIの詳細（Phase 2 で詳細化）
- [ ] S-03 詳細モーダルの編集機能配置（Phase 2 で追加）

---

## 更新履歴

| 日付 | 更新内容 |
|------|---------|
| 2026-02-01 | 初版作成 |
| 2026-02-01 | 01-screen-flows.md準拠: フッター3アイテム化、記録フローS-04a/b/c/S-08分割、S-02/S-05ヘッダー修正、インタラクションゾーン追加 |
| 2026-02-01 | UX-002/003/009/014/015対応: 並び順・スクロール仕様追加、カード情報要素・視覚階層追加、設定最小化チェックリスト追加、オンボーディングチェックリスト追加、Kitchen Signals入力仕様追加、Pencil→Figma移行 |
| 2026-02-01 | S-02構造変更: 旧「アーカイブ/時系列|カテゴリタブ/グリッド一覧」を「本棚→図鑑→カード→詳細」ナビゲーションに再構成。S-02a（本棚/図鑑一覧）、S-02b（図鑑内カード一覧/あいうえお順）、S-02c（本棚ログ/時系列）、S-02d（アニバーサリー）を追加。図鑑は固定セット・固定配置・全ユーザー共通の仕様を明確化。評価・比較の印象を避けるため、グリッド一覧では作成回数・日付を非表示に。S-03の戻り先参照を更新。 |
| 2026-02-01 | S-05探索画面拡充: 「レシピ検索 & 提案」として再定義。検索UI展開方式、複数条件（チップ）によるAND検索、即時フィルタ仕様を追加。提案は検索UI展開時のみ表示、最大3件、控えめに配置。提案ロジックは3枠で役割分担（定番/時間帯/新規）、ランキング・評価表現は禁止。検索結果ゼロ時の優しいメッセージと提案ブロック継続表示を追加。 |

---

[← 戻る](../02-core-wireframes.md)

