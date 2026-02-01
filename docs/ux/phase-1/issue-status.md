# UX-MVP Issue Status Tracker

> Generated: 2026-02-01
> Total: 35 issues | Closed: 25 | Open: 10 (Blocked by Figma)

---

## Closed Issues (25)

### B) ビジュアルシステム

#### ✅ UX-016: カラーパレット定義 — CLOSED

**Why done:**
- ベース/テキスト/アクセント/セマンティックカラー全て定義済み
- HEX値明記、WCAG AA準拠コントラスト比検証済み

**References:**
- `docs/ux/phase-1/03-design-tokens.md` → §カラーパレット
- `docs/ux/phase-1/03-design-tokens.json` → `color.*`

---

#### ✅ UX-017: タイポグラフィスケール定義 — CLOSED

**Why done:**
- iOS/Android フォントファミリー選定済み（System / Noto Sans JP）
- サイズスケール xs〜2xl をpt値で定義済み
- 行間・字間定義済み
- Dynamic Type対応ルール定義済み

**References:**
- `docs/ux/phase-1/03-design-tokens.md` → §タイポグラフィ
- `docs/ux/phase-1/03-design-tokens.json` → `typography.*`
- `docs/ux/phase-1/09-accessibility-requirements.md` → §2.3 フォントスケーリングポリシー

---

#### ✅ UX-018: スペーシング・サイジングトークン定義 — CLOSED

**Why done:**
- 4pt基準スペーシングスケール定義済み（xs〜2xl）
- タップターゲット最小サイズ 44pt 定義済み
- 画面マージン・コンポーネント間余白定義済み

**References:**
- `docs/ux/phase-1/03-design-tokens.md` → §スペーシング, §タップターゲット
- `docs/ux/phase-1/03-design-tokens.json` → `spacing.*`, `size.tap.*`

---

#### ✅ UX-019: 形状トークン定義 — CLOSED

**Why done:**
- 角丸スケール（none〜full）をpt値で定義済み
- シャドウスタイル（sm/md/lg）定義済み
- elevation 定義済み
- 用途ガイドライン明記済み

**References:**
- `docs/ux/phase-1/03-design-tokens.md` → §形状, §シャドウ, §重なり順
- `docs/ux/phase-1/03-design-tokens.json` → `radius.*`, `shadow.*`, `elevation.*`

---

### C) モーションシステム

#### ✅ UX-027: アニメーション速度・イージング定義 — CLOSED

**Why done:**
- 基本デュレーション（instant〜slower）ms値で定義済み
- 用途別デュレーション（遷移/フィードバック/演出）定義済み
- イージングカーブ cubic-bezier 値定義済み
- 禁止パターン（linear, bounce, overshoot）明記済み

**References:**
- `docs/ux/phase-1/04-motion-tokens.md` → §デュレーション, §イージング, §禁止パターン
- `docs/ux/phase-1/04-motion-tokens.json` → `duration.*`, `easing.*`

---

#### ✅ UX-028: 画面遷移パターン定義 — CLOSED

**Why done:**
- Fade遷移仕様定義済み（200ms, easeOut）
- Soft Slide遷移仕様定義済み（250ms, 30pt, easeOut）
- Overlay遷移仕様定義済み（300ms, 20pt）
- 画面遷移マッピング完了（遷移優先ルール表）

**References:**
- `docs/ux/phase-1/04-motion-tokens.md` → §遷移パターン詳細, §遷移優先ルール
- `docs/ux/phase-1/04-motion-tokens.json` → `transition.*`, `distance.*`

---

#### ✅ UX-029: 3層モーション構造設計 — CLOSED

**Why done:**
- 3層（世界/UI/演出）の定義と境界明確化済み
- 各層のモーション許可範囲定義済み
- 層間干渉ルール定義済み
- 遷移時の各層挙動定義済み

**References:**
- `docs/ux/phase-1/04-motion-tokens.md` → §3層モーション構造
- `docs/ux/phase-1/01-screen-flows.md` → §2 3層構造とスクリーンマッピング

---

#### ✅ UX-032: 記録完了セレブレーション設計 — CLOSED

**Why done:**
- セレブレーションシーケンス定義済み（5ステップ、合計約1050ms）
- 各ステップのタイミング・デュレーション定義済み
- 視覚演出仕様（光の広がり、余韻）定義済み
- 音との連動タイミング定義済み（07-sound-guidelines参照）
- 「派手すぎ」禁止チェック済み

**References:**
- `docs/ux/phase-1/04-motion-tokens.md` → §記録完了セレブレーション
- `docs/ux/phase-1/04-motion-tokens.json` → `celebration.*`
- `docs/ux/phase-1/07-sound-guidelines.md` → §儀式音

---

### D) 2.5Dワールドアセット

#### ✅ UX-037: レイヤースタック構造定義 — CLOSED

**Why done:**
- レイヤー一覧と重ね順定義済み（7層）
- 各レイヤーの役割明記済み
- 合成モード定義済み（Normal + opacity）
- ASCII図解提供済み

**References:**
- `docs/ux/phase-1/05-2_5d-asset-spec.md` → §レイヤースタック構造, §合成モード

---

#### ✅ UX-041: 時間帯オーバーレイ仕様 — CLOSED

**Why done:**
- 6時間帯のオーバーレイ仕様定義済み
- 色味・明度・彩度ターゲット定義済み
- 合成モード（Normal + opacity）定義済み
- グラデーション補間ルール定義済み

**References:**
- `docs/ux/phase-1/05-2_5d-asset-spec.md` → §時間帯オーバーレイ（6区分）
- `docs/ux/phase-1/06-lighting-spec.md` → §時間帯トーン（6区分）

---

#### ✅ UX-042: 季節オーバーレイ仕様 — CLOSED

**Why done:**
- 4季節のオーバーレイ仕様定義済み
- 色味・雰囲気方向性定義済み
- 季節間遷移ルール（2週間グラデーション）定義済み

**References:**
- `docs/ux/phase-1/05-2_5d-asset-spec.md` → §季節オーバーレイ（4季節）
- `docs/ux/phase-1/06-lighting-spec.md` → §季節トーン（4季節）

---

#### ✅ UX-044: アセットパイプライン定義 — CLOSED

**Why done:**
- アセットタイプ一覧定義済み
- フォーマット（PNG/Lottie）定義済み
- 解像度ターゲット（@1x/@2x/@3x）定義済み
- 命名規則定義済み
- 品質チェックリスト提供済み

**References:**
- `docs/ux/phase-1/05-2_5d-asset-spec.md` → §アセットパイプライン, §品質チェックリスト

---

#### ✅ UX-046: シグナル合成ルール定義 — CLOSED

**Why done:**
- シグナルとレイヤー対応関係定義済み
- 合成優先順位定義済み（時間 > 季節 > 密度 > 素材感）
- 競合解決ルール定義済み
- 「テーマ切替感」回避確認済み

**References:**
- `docs/ux/phase-1/05-2_5d-asset-spec.md` → §シグナル合成ルール
- `docs/ux/phase-1/01-screen-flows.md` → §2.3 世界レイヤーの振る舞い

---

### E) ライティング＆トーン

#### ✅ UX-048: 時間帯トーンオーバーレイ仕様 — CLOSED

**Why done:**
- 6時間帯の定義（時刻範囲）明記済み
- 色温度・明度・彩度ターゲット定義済み
- 各時間帯の印象・光の質を記述済み

**References:**
- `docs/ux/phase-1/06-lighting-spec.md` → §時間帯トーン（6区分）, §数値ターゲット

---

#### ✅ UX-049: 季節トーンオーバーレイ仕様 — CLOSED

**Why done:**
- 4季節の定義（月別期間）明記済み
- 各季節の色味方向性定義済み
- グラデーション開始日定義済み

**References:**
- `docs/ux/phase-1/06-lighting-spec.md` → §季節トーン（4季節）

---

### F) サウンド

#### ✅ UX-053: アンビエントサウンド設計方針 — CLOSED

**Why done:**
- 環境音の役割明記済み（「気配」として）
- サウンドカテゴリ定義済み（空調音/生活音/調理音）
- 再生ルール定義済み（スケジューリング、沈黙時間）
- ON/OFF設定方針定義済み

**References:**
- `docs/ux/phase-1/07-sound-guidelines.md` → §サウンドカテゴリ, §再生スケジューリングルール, §設定UI

---

#### ✅ UX-055: 儀式音（記録完了等）設計 — CLOSED

**Why done:**
- 儀式音イベント一覧定義済み（記録完了/棚追加/グレードアップ）
- トーン方向性定義済み（やわらかいワンショット）
- UX-032との連動タイミング定義済み（300-600ms）

**References:**
- `docs/ux/phase-1/07-sound-guidelines.md` → §儀式音（Moment Sounds）

---

### G) マイクロコピー

#### ✅ UX-060: マイクロコピーボイス＆トーンガイド — CLOSED

**Why done:**
- Voice定義（5つの形容詞: 静か/やさしい/軽い/誠実/ほのかにワクワク）明記済み
- Toneルール（5原則）明記済み
- 推奨/禁止語彙リスト作成済み
- 良い例・悪い例含む

**References:**
- `docs/ux/phase-1/08-microcopy-core.md` → §Voice & Tone, §推奨語彙 / 禁止語彙

---

#### ✅ UX-061: 空状態メッセージ一覧 — CLOSED

**Why done:**
- 空状態発生画面一覧定義済み（S-02, S-05, S-03）
- 各画面の日本語メッセージ確定済み
- Voice/Toneガイド準拠確認済み

**References:**
- `docs/ux/phase-1/08-microcopy-core.md` → §画面別マイクロコピー

---

#### ✅ UX-062: エラーメッセージ一覧 — CLOSED

**Why done:**
- エラーパターン一覧定義済み（保存失敗/読み込み失敗/写真アクセス失敗/ネットワークエラー）
- 各エラーの日本語メッセージ確定済み
- 「責めない」表現確認済み

**References:**
- `docs/ux/phase-1/08-microcopy-core.md` → §エラーメッセージ

---

#### ✅ UX-063: 記録完了メッセージ一覧 — CLOSED

**Why done:**
- 7種類のバリエーション作成済み
- 「余韻」「積み重なり」が感じられる表現確認済み
- NG例も明記済み

**References:**
- `docs/ux/phase-1/08-microcopy-core.md` → §S-08: セレブレーション

---

### H) アクセシビリティ

#### ✅ UX-069: Dynamic Type対応仕様 — CLOSED

**Why done:**
- 対応サイズ範囲定義済み（200%まで）
- スケーリングルール定義済み（allowFontScaling）
- レイアウト崩れ防止ルール定義済み

**References:**
- `docs/ux/phase-1/09-accessibility-requirements.md` → §2.3 フォントスケーリングポリシー, §3.3 テキストサイズ

---

#### ✅ UX-070: コントラスト要件定義 — CLOSED

**Why done:**
- 各テキストタイプの最小コントラスト比定義済み（4.5:1 / 3:1）
- カラーパレット組み合わせ検証済み

**References:**
- `docs/ux/phase-1/03-design-tokens.md` → §WCAG 2.1 AA 準拠確認
- `docs/ux/phase-1/09-accessibility-requirements.md` → §3.1 色のコントラスト

---

#### ✅ UX-071: タップターゲット最小サイズ定義 — CLOSED

**Why done:**
- 最小サイズ 44pt 定義済み
- 推奨サイズ 48pt 定義済み
- 要素間隔 8pt以上定義済み

**References:**
- `docs/ux/phase-1/03-design-tokens.md` → §タップターゲット
- `docs/ux/phase-1/03-design-tokens.json` → `size.tap.*`
- `docs/ux/phase-1/09-accessibility-requirements.md` → §4.1 タップターゲット

---

#### ✅ UX-073: Reduced Motion対応設計 — CLOSED

**Why done:**
- 無効化/簡略化アニメーション一覧定義済み
- 代替表現定義済み（Slide→Fade, セレブレーション→メッセージのみ, ワールド→静止）
- タップフィードバック維持ルール定義済み

**References:**
- `docs/ux/phase-1/04-motion-tokens.md` → §Reduced Motion対応
- `docs/ux/phase-1/04-motion-tokens.json` → `reducedMotion.*`
- `docs/ux/phase-1/09-accessibility-requirements.md` → §7 モーションアクセシビリティ

---

## Open Issues — Blocked by Figma (10)

### A) 情報アーキテクチャ & フロー

#### 🔴 UX-001: 全体画面フロー設計 — OPEN

**Blocked by:** Figma flow diagram

**Figma deliverable required:**
- 全画面フロー俯瞰図（Overview Flow Diagram）
- Record/Explore/Reflect Journey 詳細フロー図

**Existing spec (source of truth):**
- `docs/ux/phase-1/01-screen-flows.md` — 全画面リスト、遷移マトリクス、Mermaid図
- `docs/ux/phase-1/figma-action-items.md` → Frame 1, 2

---

#### 🔴 UX-002: 棚図鑑IA設計 — OPEN

**Blocked by:** Figma wireframe

**Figma deliverable required:**
- S-02 アーカイブ ワイヤーフレーム（Default / Empty / Loading states）

**Existing spec (source of truth):**
- `docs/ux/phase-1/02-core-wireframes.md` → §S-02: アーカイブ
- `docs/ux/phase-1/figma-action-items.md` → Page: Wireframes / Archive

---

#### 🔴 UX-003: 料理カード構造設計 — OPEN

**Blocked by:** Figma card component

**Figma deliverable required:**
- comp-card-small コンポーネント（with-photo / no-photo variants）
- S-03 詳細モーダル ワイヤーフレーム

**Existing spec (source of truth):**
- `docs/ux/phase-1/02-core-wireframes.md` → §料理カード構造, §S-03: 料理カード詳細
- `docs/ux/phase-1/figma-action-items.md` → Component: comp-card-small

---

#### 🔴 UX-005: 記録フロー設計 — OPEN

**Blocked by:** Figma wireframes

**Figma deliverable required:**
- S-04a 写真選択 ワイヤーフレーム
- S-04b 入力フォーム ワイヤーフレーム（empty / valid / keyboard states）
- S-04c 確認 ワイヤーフレーム
- S-08 セレブレーション ワイヤーフレーム

**Existing spec (source of truth):**
- `docs/ux/phase-1/01-screen-flows.md` → §4.1 Record Journey
- `docs/ux/phase-1/02-core-wireframes.md` → §S-04: 記録フロー
- `docs/ux/phase-1/figma-action-items.md` → Page: Wireframes / Record Flow

---

#### 🔴 UX-009: 設定画面IA設計 — OPEN

**Blocked by:** Figma wireframe

**Figma deliverable required:**
- S-06 設定 ワイヤーフレーム

**Existing spec (source of truth):**
- `docs/ux/phase-1/02-core-wireframes.md` → §S-06: 設定
- `docs/ux/phase-1/figma-action-items.md` → Page: Wireframes / Settings

---

#### 🔴 UX-014: 初回オンボーディングフロー設計 — OPEN

**Blocked by:** Figma wireframes

**Figma deliverable required:**
- S-07a ウェルカム ワイヤーフレーム
- S-07b Kitchen Signals ワイヤーフレーム
- S-07c 完了 ワイヤーフレーム

**Existing spec (source of truth):**
- `docs/ux/phase-1/01-screen-flows.md` → §6.1 オンボーディングフロー
- `docs/ux/phase-1/02-core-wireframes.md` → §S-07: オンボーディング
- `docs/ux/phase-1/figma-action-items.md` → Page: Wireframes / Onboarding

---

#### 🔴 UX-015: Kitchen Signals入力フロー設計 — OPEN

**Blocked by:** Figma wireframe + Chip component

**Figma deliverable required:**
- S-07b Signals ワイヤーフレーム（詳細版）
- comp-chip コンポーネント（selected / unselected variants）

**Existing spec (source of truth):**
- `docs/ux/phase-1/02-core-wireframes.md` → §Kitchen Signals 入力仕様（UX-015）
- `docs/ux/phase-1/figma-action-items.md` → Component: Chip (selection)

---

### B) ビジュアルシステム

#### 🔴 UX-025: ナビゲーション・フッター設計 — OPEN

**Blocked by:** Figma visual component

**Figma deliverable required:**
- comp-footer コンポーネント（default / recording-active states）
- comp-footer-item コンポーネント（default / active states）

**Existing spec (source of truth):**
- `docs/ux/phase-1/01-screen-flows.md` → §3 フッターナビゲーション
- `docs/ux/phase-1/02-core-wireframes.md` → §フッターナビゲーション（共通）
- `docs/ux/phase-1/figma-action-items.md` → Component: comp-footer

---

### D) 2.5Dワールドアセット

#### 🔴 UX-036: 固定カメラトップ画面構図設計 — OPEN

**Blocked by:** Figma reference image / wire

**Figma deliverable required:**
- カメラアングル参照画像
- 要素配置ワイヤーフレーム
- セーフエリア図示

**Existing spec (source of truth):**
- `docs/ux/phase-1/05-2_5d-asset-spec.md` → §プロップ配置ルール, §セーフゾーン, §固定カメラ原則

---

#### 🔴 UX-038: ベースキッチンアセット仕様 — OPEN

**Blocked by:** Figma reference images / style samples

**Figma deliverable required:**
- ベースキッチン参照画像
- スタイルサンプル（形状、素材感、色味方向性）

**Existing spec (source of truth):**
- `docs/ux/phase-1/05-2_5d-asset-spec.md` → §ベースキッチン仕様, §スタイルガイド

---

## Summary

| Category | Total | Closed | Open |
|----------|-------|--------|------|
| A) IA & Flow | 7 | 0 | 7 |
| B) Visual | 5 | 4 | 1 |
| C) Motion | 4 | 4 | 0 |
| D) 2.5D World | 7 | 5 | 2 |
| E) Lighting | 2 | 2 | 0 |
| F) Sound | 2 | 2 | 0 |
| G) Microcopy | 4 | 4 | 0 |
| H) Accessibility | 4 | 4 | 0 |
| **Total** | **35** | **25** | **10** |

---

## Next Steps

1. **Figma work** — Use `docs/ux/phase-1/figma-action-items.md` to create remaining visual artifacts
2. **Export** — Place exports in `docs/ux/phase-1/figma/exports/`
3. **Close remaining issues** — Update this tracker when Figma work is complete

---

## Change Log

| Date | Update |
|------|--------|
| 2026-02-01 | Initial status tracking: 25 closed, 10 open |
