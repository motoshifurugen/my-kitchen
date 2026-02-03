# 02: デザインシステム
_Design System Specification_

---

## 概要

アプリ全体で使用するデザイントークン、モーショントークン、UIコンポーネントシステム、ビジュアルデザイン詳細を定義する。

**対象プラットフォーム:** iOS / Android（React Native）

**関連イシュー:** UX-016, UX-017, UX-018, UX-019, UX-025, UX-027, UX-028, UX-029, UX-032

**参照ドキュメント:**
- `01-screen-flows.md` — 画面フロー定義
- `../world-bible/visual-foundation.md` — 視覚言語の基礎
- `../world-bible/core-philosophy.md` — 核心思想

---

## 目次

1. [デザイントークン](#デザイントークン)
2. [モーショントークン](#モーショントークン)
3. [UIコンポーネントシステム](#uiコンポーネントシステム)
4. [ビジュアルデザイン詳細](#ビジュアルデザイン詳細)
5. [アニメーション設計](#アニメーション設計)

---

# デザイントークン

## 単位ポリシー（Units Policy）

本ドキュメントにおける `pt` は iOS の「ポイント」を基準とする。
Android 実装時は `dp`（密度非依存ピクセル）として読み替えること。
フォントサイズについては Android では `sp`（スケール非依存ピクセル）を使用する。
React Native では数値をそのまま使用（density-independent）。

## カラーパレット

### 設計方針（World Bible準拠）

- ベース: ニュートラル（白〜生成り〜淡いグレー）
- アクセント: 食材っぽい色（少量）
- 強い原色は使わない
- 彩度は中〜低
- 色は「映え」ではなく「空気」

### ベースカラー

| トークン名 | 用途 | 値 | 備考 |
|-----------|------|-----|------|
| `color.background.primary` | メイン背景 | #FDFCFA | 生成り白 |
| `color.background.secondary` | サブ背景 | #F5F3EF | 淡いベージュ |
| `color.background.tertiary` | カード背景等 | #FFFFFF | 白 |
| `color.surface.elevated` | 浮いた要素 | #FFFFFF | シャドウと併用 |
| `color.surface.pressed` | 押下時の表面 | #F0EBE5 | タップフィードバック |
| `color.surface.selected` | 選択状態の表面 | #F5EDE6 | 選択中を示す |

### テキストカラー

| トークン名 | 用途 | 値 | コントラスト比 |
|-----------|------|-----|---------------|
| `color.text.primary` | 本文 | #2C2825 | 12.5:1 |
| `color.text.secondary` | 補助テキスト | #6B6560 | 5.2:1 |
| `color.text.tertiary` | ヒント | #9C9590 | 3.1:1 (大テキストのみ) |
| `color.text.inverse` | 反転テキスト | #FDFCFA | - |
| `color.text.disabled` | 無効状態 | #B8B3AD | 操作不可を示す |
| `color.text.link` | リンクテキスト | #C17A50 | アクセント流用 |

### アイコンカラー

| トークン名 | 用途 | 値 |
|-----------|------|-----|
| `color.icon.default` | 標準アイコン | #6B6560 |
| `color.icon.active` | アクティブ状態 | #C17A50 |
| `color.icon.disabled` | 無効状態 | #B8B3AD |

### アクセントカラー

| トークン名 | 用途 | 値 | 備考 |
|-----------|------|-----|------|
| `color.accent.primary` | 主要アクション | #C17A50 | 温かみのあるオレンジ |
| `color.accent.secondary` | 補助アクセント | #7B9E87 | 落ち着いた緑 |
| `color.accent.subtle` | 控えめなアクセント | #E8DFD5 | ベージュ |

### セマンティックカラー

用途別に text / background / border を定義し、実装時の迷いを防ぐ。

#### Success（成功）

| トークン名 | 用途 | 値 |
|-----------|------|-----|
| `color.semantic.success.text` | 成功メッセージ | #5A7A63 |
| `color.semantic.success.background` | 成功背景 | #EDF5EF |
| `color.semantic.success.border` | 成功ボーダー | #7B9E87 |

#### Error（エラー）

| トークン名 | 用途 | 値 |
|-----------|------|-----|
| `color.semantic.error.text` | エラーメッセージ | #9E5A4D |
| `color.semantic.error.background` | エラー背景 | #F9F0EE |
| `color.semantic.error.border` | エラーボーダー | #C67B6B |

#### Warning（警告）

| トークン名 | 用途 | 値 |
|-----------|------|-----|
| `color.semantic.warning.text` | 警告メッセージ | #8A7038 |
| `color.semantic.warning.background` | 警告背景 | #FBF6EC |
| `color.semantic.warning.border` | 警告ボーダー | #D4A85A |

### UI要素カラー

| トークン名 | 用途 | 値 |
|-----------|------|-----|
| `color.border.default` | 標準ボーダー | #E5E0DA |
| `color.border.focused` | フォーカス時 | #C17A50 |
| `color.border.disabled` | 無効状態ボーダー | #E5E0DA |
| `color.divider` | 区切り線 | #E5E0DA |

### オーバーレイカラー

| トークン名 | 用途 | 値 | 備考 |
|-----------|------|-----|------|
| `color.overlay.scrim` | モーダル背景暗転 | rgba(44, 40, 37, 0.4) | 強めの遮蔽 |
| `color.overlay.soft` | 世界レイヤーぼかし時 | rgba(44, 40, 37, 0.15) | 控えめな暗転 |

### 不透明度（Opacity）

| トークン名 | 値 | 用途 |
|-----------|-----|------|
| `opacity.disabled` | 0.4 | 無効状態の全般的な透明度 |
| `opacity.pressed` | 0.08 | 押下時オーバーレイ |

### UIステート設計ガイド

- **Disabled**: `opacity.disabled` を適用、または専用の `*.disabled` トークンを使用。タップ不可を明示。
- **Pressed**: `color.surface.pressed` で即時フィードバック。150ms以内に視覚変化。
- **Selected**: `color.surface.selected` で選択状態を維持。トグル/タブ等に使用。
- **Focused**: `color.border.focused` でフォーカスリングを描画。アクセシビリティ必須。

---

## アイコンセット & スタイルガイド

### 目的

UI全体のピクトグラムを統一し、「機械的・無機質」にならず、台所の静かな世界観に馴染ませる。

### 採用アイコンセット

- **Phosphor Icons** を採用（アプリ全体で統一）

### ウェイト（線の太さ）

- **Regular** を基本とする
- 「選択状態」を表現する場合も、極力同一ウェイト内の見え方で揃える（強い太線化は避ける）

### サイズスケール（基準）

| 用途 | サイズ | 備考 |
|------|--------|------|
| Footer（Bottom Tabs） | 24pt | フッターナビゲーション |
| 画面内の行アイコン | 20pt | 設定画面など |
| 小さな補助（インライン） | 16pt | テキスト内など |

**注:** タップ領域は別途確保（例：44×44pt以上）

### カラールール（基本）

| 状態 | 色 | 備考 |
|------|-----|------|
| デフォルト（未選択） | やわらかい焦茶系（ink/secondary 相当） | `color.icon.default` |
| 選択（アクティブ） | 少し濃い焦茶（ink/primary 相当） | `color.icon.active` |
| 無効（disabled） | opacity で落とす | `color.icon.disabled` + `opacity.disabled` |
| 禁止 | 純黒(#000000)の多用、強い原色の常用 | - |

### "機械的・無機質"回避ルール

- ギア的モチーフの多用を避ける（必要最低限）
- 警告/エラー表現（真っ赤・強い三角）を常用しない
- 可能な限り「生活道具」寄りのモチーフを選ぶ（家・本・帽子・虫眼鏡など）

### 必要アイコン一覧（MVP確定）

#### 1) フッター（Bottom Tabs）— 確定

| 役割 | アイコン名（Phosphor） | 備考 |
|------|----------------------|------|
| ホーム | `house-line` | S-01 トップ画面 |
| 棚 | `books` | S-02a 本棚 |
| 記録 | `chef-hat` | S-04 記録フロー |
| 探す | `magnifying-glass` | S-05 探索 |
| 設定 | `sliders-horizontal` | S-06 設定 |

#### 2) グローバル（画面共通の基本操作）

| 役割 | アイコン名（Phosphor） | 使用箇所例 |
|------|----------------------|-----------|
| 戻る | `arrow-left` | 設定画面、記録フローなど |
| 閉じる | `x` | モーダル（S-03など） |
| 詳細へ（行の右矢印） | `caret-right` | 設定行、リスト行など |

**注:** 「次へ」は原則テキストボタンで十分。必要になった場合のみ `arrow-right` を追加候補。

#### 3) 写真追加（記録フロー）

| 役割 | アイコン名（Phosphor） | 使用箇所例 |
|------|----------------------|-----------|
| カメラで撮影 | `camera` | S-04a |
| ライブラリから選択 | `image` | S-04a |

**注:** 「写真なしで続ける」はアイコン不要（文言でやさしく表現する）。

#### 4) 棚図鑑（追加導線）

| 役割 | アイコン名（Phosphor） | 使用箇所例 |
|------|----------------------|-----------|
| マイ図鑑（お気に入り） | `heart` | 本棚の「特色の違う図鑑」 |
| 本棚ログ（履歴） | `clock-counter-clockwise` | "追加/アップデート履歴" |
| アニバーサリー | `sparkle` | "昨年のこの日"表示 |

**注:** 並び替え・フィルタ等は、現時点の方針では優先度低。必要が出たら追加検討。

---

## タイポグラフィ

### 設計方針（World Bible準拠）

- 読みやすく、やわらかく、短く
- 行間は広め、文字は詰めない
- 強い見出しで煽らない

### フォントファミリー

| プラットフォーム | トークン | 値 |
|-----------------|---------|-----|
| iOS | `typography.fontFamily.ios` | System (default) |
| Android | `typography.fontFamily.android` | Noto Sans JP |

**React Native 実装メモ:**
- **iOS**: `fontFamily` を省略するとシステムフォント（San Francisco）が使用される。これが推奨動作。日本語は Hiragino Sans にフォールバックする。明示的に指定する必要がある場合のみ `System` を使用。
- **Android**: `fontFamily: Noto Sans JP` を指定。Roboto へのフォールバックは OS 側で自動処理。

### フォントウェイト

| トークン名 | 値 | 用途 |
|-----------|-----|------|
| `typography.weight.regular` | 400 | 本文、説明文 |
| `typography.weight.medium` | 500 | 小見出し、強調 |
| `typography.weight.semibold` | 600 | 見出し、ボタンラベル |

### サイズスケール

| トークン名 | サイズ | 用途 |
|-----------|--------|------|
| `typography.size.xs` | 11pt | キャプション |
| `typography.size.sm` | 13pt | 補助テキスト |
| `typography.size.md` | 15pt | 本文（基準） |
| `typography.size.lg` | 17pt | 小見出し |
| `typography.size.xl` | 20pt | 見出し |
| `typography.size.2xl` | 24pt | 大見出し |

### 行間（Line Height）

| トークン名 | 値 | 用途 |
|-----------|-----|------|
| `typography.lineHeight.tight` | 1.3 | 見出し |
| `typography.lineHeight.normal` | 1.6 | 本文 |
| `typography.lineHeight.relaxed` | 1.8 | 長文 |

### 字間（Letter Spacing）

| トークン名 | 値 | 用途 |
|-----------|-----|------|
| `typography.letterSpacing.normal` | 0 | 基本 |
| `typography.letterSpacing.wide` | 0.02em | 見出し |

### テキストスタイルプリセット（参考）

実装の一貫性のため、代表的な組み合わせを定義。

| プリセット名 | サイズ | ウェイト | 行間 | 用途 |
|-------------|--------|---------|------|------|
| `typography.style.heading` | xl (20pt) | semibold | tight | 画面タイトル |
| `typography.style.subheading` | lg (17pt) | medium | tight | セクション見出し |
| `typography.style.body` | md (15pt) | regular | normal | 本文 |
| `typography.style.caption` | xs (11pt) | regular | normal | 補足、日付 |
| `typography.style.button` | md (15pt) | semibold | tight | ボタンラベル |

---

## スペーシング

### 設計方針（World Bible準拠）

- 余白は「静けさ」の設計
- 情報密度を上げない
- タップ可能領域は余白で確保

### スペーシングスケール（4pt基準）

| トークン名 | 値 | 用途 |
|-----------|-----|------|
| `spacing.xs` | 4pt | 最小余白 |
| `spacing.sm` | 8pt | 小余白 |
| `spacing.md` | 16pt | 標準余白 |
| `spacing.lg` | 24pt | 大余白 |
| `spacing.xl` | 32pt | 特大余白 |
| `spacing.2xl` | 48pt | セクション間 |

### 画面マージン

| トークン名 | 値 |
|-----------|-----|
| `spacing.screen.horizontal` | 20pt |
| `spacing.screen.vertical` | 16pt |

### タップターゲット

| トークン名 | 値 | 備考 |
|-----------|-----|------|
| `size.tap.minimum` | 44pt | Apple HIG / Material Design 推奨の最小サイズ |
| `size.tap.recommended` | 48pt | 推奨サイズ（余裕を持った操作性） |

**注:** 44pt は WCAG 2.1 の Target Size (Level AAA) 基準ではなく、プラットフォームガイドラインに基づくユーザビリティ推奨値として採用。実装時は要素間の間隔も考慮すること。

---

## 形状

### 設計方針（World Bible準拠）

- 柔らかい角 + 直線の秩序
- 影は硬くしない
- 幼児向けの丸さにはしない

### 角丸（Border Radius）

| トークン名 | 値 | 用途 |
|-----------|-----|------|
| `radius.none` | 0pt | 角なし |
| `radius.sm` | 4pt | 小さい要素 |
| `radius.md` | 8pt | ボタン、入力 |
| `radius.lg` | 12pt | カード |
| `radius.xl` | 16pt | モーダル |
| `radius.full` | 9999pt | 円形 |

### シャドウ

| トークン名 | 値 | 用途 |
|-----------|-----|------|
| `shadow.sm` | 0 1px 2px rgba(0,0,0,0.05) | 軽い浮き |
| `shadow.md` | 0 2px 8px rgba(0,0,0,0.08) | カード |
| `shadow.lg` | 0 4px 16px rgba(0,0,0,0.10) | モーダル |

### 重なり順（Elevation）

React Native 実装向けの zIndex / elevation 基準値。

| トークン名 | 値 | 用途 |
|-----------|-----|------|
| `elevation.base` | 0 | 通常コンテンツ |
| `elevation.card` | 1 | カード、浮き要素 |
| `elevation.footer` | 10 | 固定フッター |
| `elevation.overlay` | 50 | オーバーレイ背景（モーダル下） |
| `elevation.modal` | 100 | モーダル、ダイアログ |
| `elevation.toast` | 200 | トースト通知 |

---

## フッター仕様

| トークン名 | 値 |
|-----------|-----|
| `footer.height` | 56pt |
| `footer.background` | #FDFCFA |
| `footer.border` | 1px solid #E5E0DA |

---

## フォーカスリング仕様

アクセシビリティ対応のためのフォーカス表示ガイド。

| トークン名 | 値 | 備考 |
|-----------|-----|------|
| `focus.ring.color` | #C17A50 | `color.border.focused` と同一 |
| `focus.ring.width` | 2pt | 視認性確保 |
| `focus.ring.offset` | 2pt | 要素との間隔 |

**実装ガイド:** スイッチコントロール / VoiceOver 操作時に表示。通常のタップ操作時は非表示でも可。

---

## WCAG 2.1 AA 準拠確認

以下はデザイン時点での算出値。実装後に実機検証を推奨。

| 組み合わせ | コントラスト比 | 判定 |
|-----------|---------------|------|
| text.primary / background.primary | 12.5:1 | ✅ AA |
| text.secondary / background.primary | 5.2:1 | ✅ AA |
| text.tertiary / background.primary | 3.1:1 | ⚠️ 大テキスト(18pt+)のみ AA |
| accent.primary / background.primary | 4.6:1 | ✅ AA（要実機検証） |
| text.disabled / background.primary | 2.5:1 (目安) | - 装飾的使用に限定 |

**注意:** コントラスト比は設計時の参考値。最終的な適合判定は実装後のアクセシビリティ検証で確認すること。

---

# モーショントークン

## 単位ポリシー（Units Policy）

本ドキュメントにおける単位の扱い:
- **時間**: `ms`（ミリ秒）はすべてのプラットフォームで共通
- **距離**: `pt` は iOS ポイント基準。Android では `dp` として読み替え
- **React Native**: 数値をそのまま使用（density-independent）

## 設計方針（World Bible準拠）

- 速すぎない、遅すぎない
- 「使っていることを忘れる速さ」が理想
- 急がない、しかし停滞もしない
- 止まり方がやわらかいことが重要

### 禁止パターン

- `linear` イージング（機械的）
- 強い `spring` / `bounce`（弾みすぎる）
- `overshoot`（勢いが出すぎる）
- **UI遷移**で 400ms 超のデュレーション（待たされ感）
- 120ms 未満のデュレーション（機械的、タップフィードバック除く）

**注:** 世界レイヤーのアンビエントループ（呼吸、揺らぎ等）はこの制限に含まれない。

---

## デュレーション

### 基本スケール

| トークン名 | 値 | 用途 |
|-----------|-----|------|
| `duration.instant` | 100ms | 即時フィードバック |
| `duration.fast` | 150ms | 軽いインタラクション |
| `duration.normal` | 200ms | 標準遷移 |
| `duration.slow` | 300ms | 情報量多い遷移、オーバーレイ |
| `duration.slower` | 350ms | 演出的な動き |

### 用途別デュレーション

| トークン名 | 値 | 用途 |
|-----------|-----|------|
| `duration.transition.fade` | 200ms | フェード遷移（Footer間移動） |
| `duration.transition.slide` | 250ms | スライド遷移（階層移動） |
| `duration.transition.overlay` | 300ms | オーバーレイ出現/退出 |
| `duration.feedback.tap` | 100ms | タップフィードバック |
| `duration.celebration` | 350ms | 記録完了セレブレーション（光の広がり） |

### 世界レイヤーデュレーション（アンビエント）

UI遷移の 400ms 制限は適用されない。

| トークン名 | 値 | 用途 |
|-----------|-----|------|
| `duration.world.breath` | 3000ms | 呼吸1サイクル |
| `duration.world.sway` | 4000ms | カーテン/植物の揺れ |
| `duration.world.light` | 10000ms | 光の移ろい |
| `duration.world.steam` | 3000ms | 湯気のゆらぎ |

---

## イージング

### 基本イージング

| トークン名 | cubic-bezier | 用途 |
|-----------|--------------|------|
| `easing.easeOut` | cubic-bezier(0.33, 1, 0.68, 1) | 標準（終わりがやわらかい） |
| `easing.easeInOut` | cubic-bezier(0.65, 0, 0.35, 1) | 対称的な動き |
| `easing.easeOutSoft` | cubic-bezier(0.25, 1, 0.5, 1) | よりやわらかい終わり |

### 用途別イージング

| トークン名 | 適用イージング | 用途 |
|-----------|---------------|------|
| `easing.transition` | easeOut | 画面遷移 |
| `easing.feedback` | easeOut | インタラクション |
| `easing.celebration` | easeOutSoft | セレブレーション |
| `easing.world` | easeInOut | 世界の呼吸・揺らぎ |

---

## 距離・スケールトークン

### 移動距離

| トークン名 | 値 | 用途 |
|-----------|-----|------|
| `distance.slide.short` | 30pt | Soft Slide（一覧→詳細） |
| `distance.slide.medium` | 60pt | 画面間スライド（将来用） |
| `distance.overlay.raise` | 20pt | オーバーレイ出現時の上昇 |
| `distance.overlay.full` | screenHeight | フルスクリーンオーバーレイ（画面下端から） |

**注:** `distance.overlay.full` は実行時に解決するセマンティックトークン。実装詳細は「Implementation Notes」を参照。

### スケール

| トークン名 | 値 | 用途 |
|-----------|-----|------|
| `scale.tap.down` | 0.97 | タップ押下時の縮小 |
| `scale.tap.up` | 1.0 | タップ解放時（元サイズ） |
| `scale.world.breathMin` | 0.98 | 世界呼吸の縮小時 |
| `scale.world.breathMax` | 1.02 | 世界呼吸の拡大時 |
| `scale.modal.enter` | 0.95 | モーダル出現開始 |

---

## 遷移優先ルール（Transition Priority Rules）

遷移パターンの選択基準。迷った場合はこのルールに従う。

| 遷移タイプ | 適用パターン | duration | 備考 |
|-----------|-------------|----------|------|
| Footer間ナビゲーション | **Fade のみ** | 200ms | S-01↔S-02↔S-05 等 |
| 一覧 → 詳細 | **Soft Slide** | 250ms | S-02→S-03、S-05→S-03 |
| 詳細 → 一覧（戻る） | **Soft Slide（逆方向）** | 250ms | translateX 方向反転 |
| オーバーレイ表示 | **Overlay（上昇）** | 300ms | S-04記録フロー開始 |
| オーバーレイ閉じる | **Overlay（下降）** | 300ms | キャンセル、完了時 |
| モーダル表示 | **Scale + Fade** | 250ms | S-03詳細カード |
| 設定画面遷移 | **Soft Slide** | 250ms | S-01→S-06 |

**優先順位:** オーバーレイ > モーダル > Slide > Fade

---

## 遷移パターン詳細

### 1. Fade（フェード）

最も基本的な遷移。視線の移動に近い。

```
用途: Footer間移動、静かな画面切替
duration: duration.transition.fade (200ms)
easing: easing.easeOut
opacity: 0 → 1
距離: なし（位置固定）
```

### 2. Soft Slide（軽いスライド）

階層移動や方向性のある遷移。

```
用途: 一覧 → 詳細、設定画面
duration: duration.transition.slide (250ms)
easing: easing.easeOut
translateX: ±distance.slide.short (30pt)
opacity: 同時に 0 → 1
```

### 3. Overlay（オーバーレイ）

モーダル、ボトムシートの出現。01-screen-flows.md §7.2 準拠。

```
用途: 記録フロー、詳細モーダル
duration: duration.transition.overlay (300ms)
easing: easing.easeOut
translateY: distance.overlay.raise (20pt) → 0
  または distance.overlay.full (画面下端から)
opacity: 0 → 1
背景: color.overlay.scrim をフェードイン
```

---

## 3層モーション構造

### 世界レイヤー（常時）

| 要素 | アニメーション | duration | 振幅/スケール |
|------|--------------|----------|--------------|
| 湯気 | ゆらぎ | duration.world.steam (3000ms) | 微小 |
| 光の移ろい | グラデーション変化 | duration.world.light (10000ms) | 微小 |
| カーテン/植物 | ゆれ | duration.world.sway (4000ms) | 微小 |
| キャラクター呼吸 | スケール | duration.world.breath (3000ms) | scale.world.breathMin〜Max |

#### MVPスコープ: キャラクターは静止画像

**MVPではキャラクターは静止画像（単一PNG/WebP）を使用する。フレームアニメーション、呼吸モーション、頭/首の動き、伸縮モーションは実装しない。**

- MVP: 年代別に1枚の静止キャラクター画像を使用
- Post-MVP: キャラクターフレームアニメーション（モーション毎に6〜8フレーム）を別途計画

**重要**: 
- 派手な動きは禁止
- 注目を奪わない
- 遷移時も可能な限り継続

### UIレイヤー（イベント駆動）

| イベント | アニメーション | duration | easing |
|---------|--------------|----------|--------|
| タップ | scale.tap.down → scale.tap.up | duration.feedback.tap (100ms) | easing.easeOut |
| フォーカス | ボーダー色変化 | duration.fast (150ms) | easing.easeOut |
| 画面遷移 | Fade/Slide/Overlay | 200-300ms | easing.easeOut |

**重要**:
- 静止状態が基本
- 動きすぎない
- 常時アニメーション禁止

### 演出レイヤー（特定イベント）

記録完了時のみ、少し強い演出を許可。

---

## タップフィードバック適用ルール

### 適用する要素

- ボタン（プライマリ、セカンダリ）
- Footer ナビゲーションアイテム
- カード（タップ可能なもの）
- リストアイテム
- タグ、チップ

### 適用しない要素

- テキスト入力フィールド（フォーカス表現のみ）
- スライダー、トグル（専用の操作フィードバックあり）
- 背景タップ（モーダル閉じる等）
- 世界レイヤー内のオブジェクト（操作対象外）

---

## 記録完了セレブレーション

### シーケンス

```
1. 保存ボタンタップ
   ↓ duration.feedback.tap (100ms)
2. 画面中央に小さな光の広がり
   ↓ duration.celebration (350ms), easing.easeOutSoft
3. 「記録しました」メッセージ表示
   ↓ 300ms 静止（間）
4. S-01トップ画面へ自動遷移
   ↓ duration.transition.overlay (300ms)
```

**合計時間:** 約 1050ms

### 制約

- 派手すぎない
- 評価感を出さない
- 「静かに広がる光や余韻」

---

## Reduced Motion対応

`prefers-reduced-motion` または OS のアクセシビリティ設定検出時の挙動を定義する。

### デフォルト動作

| カテゴリ | 通常時 | Reduced Motion時 | トークン |
|---------|--------|-----------------|---------|
| UI遷移（Slide） | translateX + opacity | **opacity のみ**（Fade化） | `reducedMotion.transition.slide` = "fade" |
| UI遷移（Overlay） | translateY + opacity | **opacity のみ**（Fade化） | `reducedMotion.transition.overlay` = "fade" |
| セレブレーション | 光の広がり + メッセージ | **メッセージのみ**（光なし） | `reducedMotion.celebration` = "messageOnly" |
| 世界アンビエント | scale/sway アニメ | **静止** | `reducedMotion.world` = "static" |
| タップフィードバック | scale 0.97 → 1.0 | **維持**（100ms以下のため） | `reducedMotion.tapFeedback` = "keep" |

### 例外（Reduced Motionでも維持）

- タップフィードバック（100ms、操作確認に必要）
- フォーカスインジケータの色変化（アクセシビリティ必須）
- 必須の状態変化表示（ローディングスピナー等）

---

## Implementation Notes (React Native)

### distance.overlay.full の解決

`distance.overlay.full` は固定値ではなく、実行時にデバイス高さを取得して使用する。

```javascript
import { Dimensions } from react-native;

// distance.overlay.full の実行時解決
const getOverlayFullDistance = () => {
  return Dimensions.get(window).height;
};

// 使用例: オーバーレイ出現アニメーション
const overlayEnterAnimation = {
  from: { translateY: getOverlayFullDistance(), opacity: 0 },
  to: { translateY: 0, opacity: 1 },
  duration: 300, // duration.transition.overlay
  easing: Easing.out(Easing.cubic), // easing.easeOut
};
```

### Reduced Motion 検出

```javascript
import { AccessibilityInfo } from react-native;

const [reduceMotionEnabled, setReduceMotionEnabled] = useState(false);

useEffect(() => {
  AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotionEnabled);
  const subscription = AccessibilityInfo.addEventListener(
    reduceMotionChanged,
    setReduceMotionEnabled
  );
  return () => subscription.remove();
}, []);

// Reduced Motion 時の遷移
const getTransitionStyle = (type) => {
  if (reduceMotionEnabled) {
    // すべてフェードに変換
    return { opacity: 1, duration: 200 };
  }
  return defaultTransitions[type];
};
```

---

# UIコンポーネントシステム

## 概要

このドキュメントは、アプリのUIコンポーネントシステムを定義します。

Atomic Design方法論に基づき、コンポーネントを5つの階層に分類しています。

```
app/src/components/
├── atoms/          # 最小単位の部品
├── molecules/      # Atomsの組み合わせ
├── organisms/      # 複雑なUIセクション
├── templates/      # ページレイアウト
└── world/          # 2.5Dキッチンワールド (特殊)
```

---

## Atomic Design ルール

### 1. デザイントークンを唯一の真実の源とする

すべてのスタイル値は `app/src/tokens/` から取得します。
ハードコードされた色、サイズ、間隔は禁止です。

```tsx
// Good
import { colors, spacing } from '../tokens';
<View style={{ backgroundColor: colors.surface.elevated, padding: spacing.md }} />

// Bad
<View style={{ backgroundColor: '#F5F5F5', padding: 16 }} />
```

### 2. PressableBaseを使用する

インタラクティブな要素は `PressableBase` を基盤とします。
これにより以下が一貫して適用されます：
- 押下時のフィードバック（opacity）
- アクセシビリティ属性
- 適切なタッチターゲットサイズ

### 3. 状態の定義

ホバー状態は使用しません（モバイル専用）。

| 状態 | 説明 |
|------|------|
| default | 通常表示 |
| pressed | 押下中（opacity: 0.7） |
| disabled | 無効化（opacity: 0.38） |
| focus | フォーカス時（入力フィールド用） |
| selected | 選択状態（Chip等） |

### 4. 階層の責任

- **Atoms**: 単一目的、状態を持たない
- **Molecules**: Atomsの組み合わせ、ローカル状態のみ
- **Organisms**: ビジネスロジックを含む可能性あり
- **Templates**: レイアウトのみ、コンテンツを含まない

---

## コンポーネント一覧

### Atoms

| 名前 | 説明 | 主なProps |
|------|------|-----------|
| Text | トークンベースのタイポグラフィ | variant, color |
| Icon | Phosphorアイコンラッパー | name, size, color, weight |
| Spacer | 余白を作成 | size, direction |
| Surface | カード・コンテナ | rounded, elevation, padding |
| Divider | 区切り線 | direction, color, margin |
| PressableBase | 押下可能な基盤 | style, disabled, accessibilityLabel |
| AppImage | expo-imageラッパー | source, rounded, contentFit |

### Molecules

| 名前 | 説明 | 主なProps |
|------|------|-----------|
| Button | ボタン（primary/secondary/ghost） | label, variant, iconLeft/Right |
| IconButton | アイコンのみのボタン | icon, variant |
| TextField | 単行テキスト入力 | value, onChangeText, label, error |
| TextArea | 複数行テキスト入力 | value, onChangeText, numberOfLines |
| Chip | 選択用ピル | label, selected, onPress |
| SettingsRow | 設定行（chevron/toggle） | variant, label, value/onValueChange |
| SearchField | 検索入力 | value, onChangeText, onClear |

### Organisms

| 名前 | 説明 | 主なProps |
|------|------|-----------|
| HeaderBar | 画面ヘッダー | title, showBack, onBack, rightIcon |
| ModalSheet | ボトムシートモーダル | visible, onClose, title |
| EmptyStateBlock | 空状態表示 | title, subtitle, icon, actionLabel |
| WorldScene | 2.5Dキッチンワールド | blurred, showCharacter |

### Templates

| 名前 | 説明 | 主なProps |
|------|------|-----------|
| AppShell | 標準画面レイアウト | showWorldBackground, header, footer |
| FlowShell | フロー画面用 | header, scrollable, avoidKeyboard |
| ModalShell | フルスクリーンモーダル | visible, onClose, header |

---

## 使用例

### ボタン

```tsx
import { Button } from '../components/molecules';

<Button
  label="保存"
  variant="primary"
  onPress={handleSave}
/>

<Button
  label="キャンセル"
  variant="ghost"
  onPress={handleCancel}
/>
```

### 設定行

```tsx
import { SettingsRow } from '../components/molecules';

// ナビゲーション行
<SettingsRow
  variant="chevron"
  label="通知設定"
  onPress={() => navigate('Notifications')}
/>

// トグル行
<SettingsRow
  variant="toggle"
  label="環境音"
  value={soundEnabled}
  onValueChange={setSoundEnabled}
/>
```

### 画面レイアウト

```tsx
import { AppShell } from '../components/templates';
import { HeaderBar } from '../components/organisms';

export const MyScreen = () => (
  <AppShell showWorldBackground>
    <HeaderBar title="設定" showBack onBack={() => goBack()} />
    {/* コンテンツ */}
  </AppShell>
);
```

---

## アクセシビリティ

すべてのインタラクティブ要素には以下を設定：

```tsx
<PressableBase
  accessibilityLabel="設定を開く"  // 必須
  accessibilityRole="button"       // 適切なロール
  accessibilityState={{ disabled: false }}
>
```

推奨タッチターゲットサイズ: 44pt × 44pt

---

## 世界観との整合性

World Bible の核心思想「料理は静かな自己回復の儀式である」に従い：

- **控えめなアニメーション**: 派手な動きは避ける
- **余白を大切に**: spacing トークンを活用
- **穏やかな色調**: accent.primary は温かみのあるオレンジ
- **やさしい影**: shadow.sm を基本に、過度な立体感は避ける

---

## ファイル構成

```
app/src/components/
├── atoms/
│   ├── Text.tsx
│   ├── Icon.tsx
│   ├── Spacer.tsx
│   ├── Surface.tsx
│   ├── Divider.tsx
│   ├── PressableBase.tsx
│   ├── AppImage.tsx
│   └── index.ts
├── molecules/
│   ├── Button.tsx
│   ├── IconButton.tsx
│   ├── TextField.tsx
│   ├── TextArea.tsx
│   ├── Chip.tsx
│   ├── SettingsRow.tsx
│   ├── SearchField.tsx
│   └── index.ts
├── organisms/
│   ├── HeaderBar.tsx
│   ├── ModalSheet.tsx
│   ├── EmptyStateBlock.tsx
│   └── index.ts
├── templates/
│   ├── AppShell.tsx
│   ├── FlowShell.tsx
│   ├── ModalShell.tsx
│   └── index.ts
├── world/
│   ├── WorldScene.tsx
│   ├── WorldLayer.tsx
│   └── index.ts
└── index.ts
```

---

# ビジュアルデザイン詳細

## ボタン / リンク / タップ可能要素

### 共通原則（World Bible準拠）

- **線で囲わない**: アウトライン枠で主張しない。境界は背景色差 + 影 + 余白で作る。
- **確実に押せる**: タップ領域は最小 44pt を保証。見た目が小さくても `hitSlop` で補強する。
- **静かな強さ**: コントラストは強すぎないが、押下時に必ず状態差が分かる。
- **言葉がUIを支える**: ラベルは短く、命令口調を避ける。

### ボタンバリエーション定義

#### Primary（主アクション）

**用途:** 次へ / 保存 / はじめる など、その画面の"主"となる1つ

**見た目:**
- **塗りつぶし（soft fill）:** 温かいニュートラル系の面
- **角丸:** 大きめ（やさしい印象）
- **影:** 薄く短い影（浮きすぎない）
- **テキスト:** 濃いめ（可読性優先）
- **アイコン:** 原則なし（必要なら左に小さく）

**デザイントークン参照:**
- 背景: `color.accent.primary` または `color.surface.elevated`
- テキスト: `color.text.primary` または `color.text.inverse`
- 角丸: `radius.lg` (12pt) または `radius.xl` (16pt)
- 影: `shadow.sm` (0 1px 2px rgba(0,0,0,0.05))

#### Secondary（副アクション）

**用途:** 戻る / 変更 / 写真を選ぶ / ライブラリ など

**見た目:**
- **"面"はあるが薄い:** 背景はほぼ地の色、押せる感は影の差と軽い色差で出す
- **影:** Primaryより弱い
- **テキスト:** Primaryより一段控えめ

**デザイントークン参照:**
- 背景: `color.background.secondary` または `color.surface.elevated`（薄め）
- テキスト: `color.text.secondary`
- 角丸: `radius.md` (8pt) または `radius.lg` (12pt)
- 影: `shadow.sm` よりさらに薄い、またはなし

#### Tertiary（最小アクション / テキスト導線）

**用途:** スキップ / 後で / 追加する / くわしく など

**見た目:**
- **塗りなし（透明）、線なし**
- **テキストのみ**（必要なら小さなアイコン）
- **押下時だけ:** 背景にほんのり"にじむ"ハイライト（チップ状に見えるくらい）

**デザイントークン参照:**
- 背景: 透明（default）、`color.surface.pressed`（pressed時）
- テキスト: `color.text.secondary` または `color.text.link`
- 角丸: `radius.md` (8pt) またはなし
- 影: なし

### 状態定義（default / pressed / disabled）

#### default
- **Primary:** soft fill + うすい影
- **Secondary:** 薄い面 + さらに薄い影
- **Tertiary:** テキストのみ

#### pressed（押下中）

"静かな確実さ"のために必須（すべてのバリエーションに適用）

**視覚変化は最低2つ入れる**（例：暗さ + 縮み、暗さ + 影減少）

**推奨変化:**
- `scale: 0.98`（ほんの少し沈む）
- `shadow`を弱める（浮きが減る）
- 背景をほんの少し濃く（にじむ程度）

**デザイントークン参照:**
- 背景: `color.surface.pressed` または `opacity.pressed` オーバーレイ
- アニメーション: `duration.fast` (150ms) で即時フィードバック

#### disabled
- **透明度を下げる**（テキストも面も一律で落とす）
- **影はゼロ**（押せそう感を消す）
- **押下アニメーションなし**
- **文言は変えない**（説明は必要なら補助テキストで）

**デザイントークン参照:**
- 透明度: `opacity.disabled` (0.4)
- 影: なし
- テキスト: `color.text.disabled`

### タップ領域・レイアウト規約（44pt保証）

- **最小タップ領域:** 44pt × 44pt（iOS Human Interface Guidelinesに合わせる）
- **見た目の高さ（推奨）:** Primary / Secondary: 48–56pt（余白で安心感）
- **間隔（誤タップ防止）:** ボタン同士の最小間隔: 12–16pt

**デザイントークン参照:**
- 最小タップ領域: `size.tap.minimum` (44pt)
- 推奨タップ領域: `size.tap.recommended` (48pt)
- 間隔: `spacing.md` (16pt) または `spacing.sm` (8pt) + `spacing.xs` (4pt)

### リンク / インラインタップ要素（テキスト導線）

#### 基本原則
- **下線は基本使わない**（主張が強い）
- **代わりに:** 色差（控えめ）+ 押下時の背景にじみ
- **末尾に「›」などの記号は多用しない**（必要な行だけ）
- **長文の中に埋め込まない**: リンクは独立行か行全体タップにする（迷わせない）

**デザイントークン参照:**
- テキスト色: `color.text.link` (#C17A50)
- 押下時背景: `color.surface.pressed` または `opacity.pressed` オーバーレイ
- タップ領域: `hitSlop` で44pt確保

---

## フォーム要素設計

### 共通原則（World Bible準拠）

- **迷いを減らす**: 入力は"何をすればいいか"が一目で分かる。説明は短く、選択肢は少なく。
- **線で囲わない**: 枠線でUI感を強めず、面（背景色差）＋余白＋タイポで成立させる。
- **入力は任意を基本**: MVPで必須は最小（例：料理名のみ）。任意入力は"後でOK"が伝わる設計にする。
- **エラーは責めない**: 赤で叱らず、静かに修正へ導く。

### テキストフィールド（Text Field / Text Area）

#### 基本構造
- **Label（項目名）:** フィールド上に固定表示（placeholderに依存しない）
- **Input面（塗り）:** 薄い面、角丸大きめ、影は無し or 極薄
- **Helper（補助文）:** 任意・例示・安心文（必要な項目だけ）
- **Counter（任意）:** メモ等で必要なら右下に小さく

**デザイントークン参照:**
- 背景: `color.background.secondary` または `color.surface.elevated`
- 角丸: `radius.lg` (12pt) または `radius.xl` (16pt)
- 影: なし または `shadow.sm` よりさらに薄い
- テキスト: `color.text.primary`
- ラベル: `color.text.secondary`
- Helper: `color.text.tertiary`

#### 状態（default / focus / disabled）

**default:**
- 薄い面 + 通常テキスト
- プレースホルダーは本文より薄い（ただし読める）

**focus:**
- 面の明度を少し変える（にじむ程度）
- 可能なら内側のハイライトで"今ここ"を示す（枠線は使わない）
- フォーカスリングはアクセシビリティ用のみ（通常操作時は非表示）

**disabled:**
- 透明度を下げる（テキストも薄く）
- 入力不可を明確化

**デザイントークン参照:**
- 背景: `color.surface.selected` または `color.background.secondary` を少し明るく
- フォーカスリング: `focus.ring.color` (#C17A50) - アクセシビリティ時のみ
- 透明度: `opacity.disabled` (0.4)
- テキスト: `color.text.disabled`

#### サイズと余白
- **1行入力:** 高さ 48–56pt（指が迷わない）
- **テキストエリア:** 最小 3行、伸縮可（自動拡張 or 固定高さどちらでもOK）
- **フィールド間隔:** 16pt（密にしない）

**デザイントークン参照:**
- 高さ: `size.tap.recommended` (48pt) 以上
- 間隔: `spacing.md` (16pt)
- パディング: `spacing.md` (16pt) 水平、`spacing.sm` (8pt) 垂直

### プレースホルダーテキストのスタイル

- **トーン:** 命令ではなく例示（「入力してください」ではなく「例：…」）
- **見え方:** 本文より薄い、ただし読める（薄すぎ禁止）

**デザイントークン参照:**
- プレースホルダー色: `color.text.tertiary` (#9C9590) - ただし大テキストのみAA準拠のため、可読性を優先

### 選択UI（Single / Multi）

#### 基本方針（迷いを減らす）
- **ドロップダウンは原則使わない**（迷い・操作コスト増）
- **選択肢が少ないものは Pill（チップ）で即決**
- **選択肢が多いものは 検索 or セクション分け**（ただしMVPでは増やさない）

#### Single Select（ラジオ相当）

**用途:** 年代、世帯、並び順など

**UI:** Pill / セグメント（タップで選択、再タップで解除も可＝押し付けない）

**設計原則:**
- **未選択が許される設計**（"分類されている感"回避）
- **選択状態は、色の濃さ or 面の違いで表現**（チェックマークは控えめ）

**デザイントークン参照:**
- 未選択: `color.background.secondary` または透明＋にじみ
- 選択: `color.surface.selected` または `color.accent.subtle`
- テキスト: `color.text.primary`（選択時）、`color.text.secondary`（未選択時）

#### Multi Select（チェック相当）

**用途:** タグ（将来）など

**UI:** Pill（複数ON）

**設計原則:**
- **ON:** 面が少し濃い + 小さいアイコン（任意）
- **OFF:** 薄い面（または透明＋にじみ）
- **"全部選ぶ"は置かない**（選択疲れを増やす）

**デザイントークン参照:**
- ON: `color.surface.selected` + 小さなアイコン（`color.icon.active`）
- OFF: `color.background.secondary` または透明

### バリデーション & エラー表示（責めない）

#### 表示ルール
- **入力中は出さない**（タイピングの邪魔）
- **確定アクション時（次へ/保存）にだけ出す**
- **エラーは1つずつ、最短で直せる形にする**

#### 表現（静か）
- **強い赤・警告アイコン連打は避ける**
- **フィールド直下に短く表示**（1行）
- **文言例:**
  - NG：「必須です」「エラーです」
  - OK：「料理名だけ、ひとつ入れると進めます」

**デザイントークン参照:**
- エラーテキスト: `color.semantic.error.text` (#9E5A4D) - ただし控えめに
- エラー背景: `color.semantic.error.background` (#F9F0EE) - 必要に応じて
- エラーボーダー: 使わない（線で囲わない原則）

---

## モーダル / ボトムシート / オーバーレイ設計

### 共通原則（World Bible準拠）

- **画面遷移ではなく上に置く**: ユーザーの「戻るストレス」を増やさない。
- **背景は少し暗くする（強くしない）**: 主張しすぎず、前面だけを"そっと"浮かせる。
- **閉じ方は直感で複数**: ボタン＋外側タップ＋（可能なら）スワイプ。迷わせない。
- **枠線で囲わない**: 面・角丸・余白で成立させる（UIが機械的にならない）。

### 背景オーバーレイ（Dim / Scrim）

#### 色・透明度（基本値）
- **ベース:** 黒（#000）
- **不透明度:** 18%（標準）
- **状況別:**
  - ライトなボトムシート（選択だけ）：14%
  - 情報量の多いモーダル（詳細・確認）：22%
  - セレブレーション（S-08等）：10–14%（世界を消しすぎない）

**※「暗い＝集中」ではなく、「少し遠のく」程度が目標。**

**デザイントークン参照:**
- 標準: `rgba(0, 0, 0, 0.18)` を標準として使用

### モーダル（中央 / カード型）

#### 用途（例）
- S-03 料理カード詳細（モーダル）
- 確認系（削除・注意・許可案内など）

#### サイズ・配置
- **配置:** 画面中央（縦は少し上寄せでも可）
- **幅:** 画面幅 - 40pt（左右20ptマージン）
- **高さ:**
  - 標準：内容に応じて自動（最大でも画面高の 80–85%）
  - 長文/履歴：内部スクロール（モーダル自体は固定）

**デザイントークン参照:**
- マージン: `spacing.screen.horizontal` (20pt) × 2 = 40pt
- 最大高さ: 画面高の 80–85%

#### 見た目
- **角丸:** 大きめ（2xl相当）
- **影:** 強くしない（あるなら極薄）
- **余白:** 外側（モーダル内）16–20pt

**デザイントークン参照:**
- 角丸: `radius.xl` (16pt) またはそれ以上
- 影: `shadow.sm` よりさらに薄い、またはなし
- パディング: `spacing.md` (16pt) または `spacing.lg` (20pt)
- 背景: `color.surface.elevated` (#FFFFFF)

#### 閉じる操作
- **×ボタン:** 左上 or 右上（S-03は左上推奨）
- **外側タップ:** 閉じる（有効）
- **スワイプ:** 基本なし（中央モーダルは誤操作が増えるため）
- **戻り先:** 呼び出し元画面（状態は保持）

**デザイントークン参照:**
- ×ボタン: `Icon` コンポーネント、サイズ 24pt、色 `color.icon.default`
- タップ領域: `size.tap.minimum` (44pt) を確保

### ボトムシート（Bottom Sheet）

#### 用途（例）
- 写真追加導線（カメラ / ライブラリ / スキップ）
- 並び替え選択（最終作成日 / 古い順 / 50音）
- 軽い選択UI（Pillより多いが、画面遷移したくないもの）

#### 高さバリエーション

ボトムシートは **3段階** で統一（設計・実装コストを抑える）。

1. **Compact（選択だけ）**: 画面高の 25–35%
2. **Medium（標準）**: 画面高の 55–65%
3. **Expanded（情報量多い/検索系）**: 画面高の 85–92%（ほぼフル）

#### 見た目
- **上端のみ角丸**（大）
- **上部にハンドル**（短い横棒）を置く（主張しない）
- **セーフエリア考慮**（下が切れない）

**デザイントークン参照:**
- 角丸: `radius.xl` (16pt) または `radius.2xl` (20pt) - 上端のみ
- ハンドル: 幅 40pt、高さ 4pt、色 `color.icon.default` を薄く
- 背景: `color.surface.elevated` (#FFFFFF)
- パディング: `spacing.md` (16pt) または `spacing.lg` (20pt)

#### 閉じる操作
- **下スワイプ:** 閉じる（必須）
- **外側タップ:** 閉じる（有効）
- **明示ボタン:** 原則不要（必要なら「閉じる」ではなく×）
- **例外:** 破壊的操作の確認は中央モーダルへ（シートでやらない）

**デザイントークン参照:**
- スワイプ閾値: 下方向に一定距離（例：50pt以上）ドラッグで閉じる
- アニメーション: `duration.normal` (300ms) でスムーズに

### オーバーレイ（Overlay：全画面演出 / 軽量通知）

#### 用途（例）
- S-08 セレブレーション（記録完了演出）
- 一時的な"気配"表示（例：保存しました、など）

#### 表示ルール
- **画面遷移しない**
- **表示時間は短く**（1.5〜2.0秒目安）
- **背景は薄暗くしすぎない**（Scrim 10–14%）

**デザイントークン参照:**
- 背景: `rgba(0, 0, 0, 0.10)` 〜 `rgba(0, 0, 0, 0.14)`
- アニメーション: `duration.fast` (150ms) で表示、`duration.normal` (300ms) で非表示

#### 閉じる
- **基本は自動で消える**
- **重要情報ならタップで閉じてもOK**（強制はしない）

---

# アニメーション設計

## 棚図鑑 カード追加アニメーション

### 目的（World Bible準拠）

- **「追加した」ことを誇張せず、でも確かに気配として残す**
- **「棚にスケッチが増えていく」＝静かなコレクションの増殖**
- **記録完了 → 0.3秒静止 → 演出表示**（"一瞬止まってから配置"が核）

### 適用タイミングと対象画面

**対象画面:** S-02 アーカイブ（棚図鑑）のカードグリッド

**トリガー:** S-04c 保存 → S-08（セレブレーション）→ S-01 に戻るの後、ユーザーが棚（S-02）へ遷移した時

**※「保存したから見て！」と押し付けない。ユーザーが棚を開いた瞬間に、そっと起きる。**

### "間（ま）"の取り方（静止時間）

**静止（Pause）：0.30秒 固定**

- 棚画面が表示されてから 0.30秒は何も動かさない
- その後、カードの追加/更新演出を開始

**World Bible:**「一瞬止まってから配置」を守るため、動きより先に"落ち着き"を入れる。

**デザイントークン参照:**
- 静止時間: 300ms（固定）
- アニメーション開始: 画面表示後 300ms 経過後

### 追加位置の決定ロジック

**基本：あいうえお順**（図鑑内のカード一覧は固定順で落ち着かせる）

#### A) 新規カード（その料理を初めて作った）

- **あいうえお順の正しい位置に挿入**
- **ただし、演出上は「一瞬だけ目に入る」ことが重要なので：**
  - 挿入位置が画面外の場合は、最初はスクロールしない（強制しない）
  - 代わりに、画面内に出ている場合のみ演出を見せる
  - 画面外の場合は「本棚ログ（後述）」側で気配を担保する

#### B) 既存カード更新（同じ料理をまた作った）

- **カードの並び順は変えない**（"評価/ランキング"に寄らない）
- **そのカードに対して "育ち"の演出だけを行う**（グレード変化や紙質の変化）

### カード追加アニメーション仕様

#### 基本タイプ（新規カード挿入）

**フェードイン + ごく短いスライド**（上からではなく、棚に"置かれる"方向）

**推奨表現:**
- **Opacity:** 0 → 1（180ms）
- **TranslateY:** +6px → 0（180ms）（下から"すっ"）
- **Scale:** 0.985 → 1.0（180ms）（紙が落ち着く感じ）
- **イージング:** 穏やかな ease-out（バネ/弾みは禁止）

**デザイントークン参照:**
- アニメーション時間: `duration.fast` (150ms) または 180ms
- イージング: `easing.easeOut` - バネ/弾みは禁止

#### 更新タイプ（既存カードの"育ち"）

**位置は動かさず、カードの見た目のみ「1段深くなる」演出**

**推奨表現:**
- **紙面の質感/模様がふっと乗る**（Opacity 0→1：220ms）
- **1回だけ柔らかいハイライトの流れ**（薄い帯が左→右に 240ms）
- **微細な呼吸**（Scale 1→1.01→1：合計260ms）（やりすぎない）

**禁止事項:**
- 星・数字・レベルアップのSEは禁止
- あくまで「棚に一枚増えた」「少し濃くなった」だけ

**デザイントークン参照:**
- 質感アニメーション: 220ms
- ハイライトアニメーション: 240ms
- 呼吸アニメーション: 260ms（合計）

### 既存カードの再配置挙動

**原則:** 既存カードは"押しのけられる"程度に最小限

**新規挿入で同一ページ内の並びが変わる場合:**
- **全カードを大きく動かさない**
- **代わりに、該当行以降だけが 120ms で詰まる**（軽いレイアウトアニメ）
- **大きな再配置（全面リフロー）は避ける**

**→ 「棚がガタつく」印象になり、世界観が壊れる**

**デザイントークン参照:**
- 再配置アニメーション: 120ms（軽いレイアウトアニメ）

---

## 料理カード グレードアップ演出

### 目的（World Bible準拠）

- **作った回数の蓄積を「数字」ではなく、紙の密度 / 質感の深まりとして見せる**
- **「評価」「ランク」ではなく、手触りの変化＝育ちを感じさせる**
- **演出は 静かで短い（気づいた人が嬉しい程度）**

### トリガー条件

- **グレードアップは、記録保存（S-04c 保存）によって 閾値を跨いだときのみ発生**
- **1回の保存で上がるのは 最大1段**（G0→G2 などの飛び級はしない）

### 演出の表示タイミング

**基本方針：記録完了 "後" に、棚でそっと見せる**

- **S-04c → S-08（セレブレーション）中は出さない**
  - セレブレーションは「記録できた」ことだけで十分
  - グレードアップをここで出すと "報酬" に見えてゲーム化する
- **S-02（棚図鑑）で初めて可視化する**
  - ユーザーが棚を見に行った時だけ、静かに気づける

**「棚が開く → 0.3秒静止 →（追加/更新演出）→（必要ならグレードアップ演出）」の順。**

**デザイントークン参照:**
- 静止時間: 300ms

### グレードアップ演出シーケンス（合計 0.8〜1.2秒）

**"光る・鳴る・飛ぶ" をしない。**
**「紙が馴染む」「装丁が整う」だけ。**

1. **間（ま）：0.30秒**（棚表示後、何も起こさない）
2. **気配の合図：カード面に「薄いハイライト帯」が一度だけ流れる（0.22秒）**
   - 左→右、または下→上（どちらかに固定）
   - 強い発光は禁止。あくまで"紙の艶"
3. **装丁の移行：カード台紙の模様/色味が 旧→新へクロスフェード（0.28秒）**
   - ここが「変化の本体」
4. **落ち着き：カード全体がごく軽く馴染む（Scale 1.00→1.01→1.00、合計0.24秒）**
   - バネ禁止、揺れ禁止

**デザイントークン参照:**
- 静止時間: 300ms
- ハイライトアニメーション: 220ms
- クロスフェード: 280ms
- 馴染みアニメーション: 240ms（合計）
- イージング: `easing.easeOut` - バネ/弾みは禁止

### カードの視覚変化仕様

#### "厚み"の扱い（数字の代替）

- **一枚カードのまま運用**（図鑑格納の都合）
- **代わりに、カードの縁（エッジ）と紙面の密度で "厚み" を表す**
  - エッジがわずかに深くなる（陰影が少し増える）
  - 紙面の粒子感/繊維感が少し豊かになる
- **目立つ立体増量（極端な厚み）はNG**（"レアカード感"に直結する）

**デザイントークン参照:**
- エッジの陰影: `shadow.sm` よりさらに薄い、または専用のエッジシャドウ
- 紙面の密度: テクスチャの不透明度を微調整

#### "質感/装丁"の変化（グレードの主表現）

**グレードが上がるほど：**
- **色が少し深くなる**（濃くではなく、澄む/落ち着く）
- **模様が一段だけ繊細になる**（派手にはしない）
- **微細な箔のような艶が"1点だけ"増える**（全面キラキラ用禁止）

**NG（ゲーム感の禁止事項）:**
- 星、レベル、数字、ゲージ、派手なスパーク
- "Level Up!" の文言、トロフィー、ファンファーレ
- 強い発光、色相が飛ぶ虹色、爆発演出

---

## ローディング / 待機状態の表現

### 目的（World Bible準拠）

- **待たせない：原則としてローディングを発生させない設計**（ローカルファースト前提）
- **発生した場合も 最小・静か・短い 表現に留める**
- **「チカチカ」「せわしない」動きは禁止**（視線が疲れない）

### ローディングインジケーター方針（共通）

#### 基本ルール

- **200ms未満で終わる処理：何も出さない**
- **200ms〜900ms：ミニインジケーター**（控えめ）
- **900ms以上：スケルトン or 画面内プレースホルダー**
- **3秒を超える可能性がある場合：説明文を1行だけ追加**（謝罪しない、急かさない）

#### 見た目（デザイン）

- **形：小さな点の呼吸（3 dots） または 細いリング（極細）**
- **動き：ゆっくり（呼吸）**
- **点：出現→消失ではなく、不透明度の揺れ**（点滅禁止）
- **リング：高速回転禁止。回すなら低速、または「満ち引き」表現**
- **色：UIの主張を避けるため、テキストより薄い中間色**（テーマ色に寄せすぎない）
- **位置：原則 コンテンツ内**（画面中央固定で遮らない）。必要な時のみ中央。

**デザイントークン参照:**
- 色: `color.text.tertiary` (#9C9590) またはそれより薄い
- アニメーション: `duration.slow` (600ms以上) でゆっくり
- イージング: `easing.easeInOut` - 呼吸のような動き

### スケルトンスクリーン仕様

#### 対象画面

- **S-02 アーカイブ（カードグリッド）**
- **S-05 探索（カードグリッド）**
- **S-03 詳細モーダル（写真＋テキスト）**
- **※S-01 キッチン世界は「ロード画面」にしない**（世界観が壊れるため）

#### 表示ルール

- **スケルトンは "形だけ"：写真枠（4:3）、料理名1行、グレード領域の3要素**
- **アニメーション：シマー（光が走る）禁止**
- **代わりに ゆっくりとした濃淡の呼吸**（不透明度がわずかに揺れる）
- **枚数：S-02 / S-05 は 画面内に見える分だけ**（例：3列×3行程度）
- **無限に並べない**（圧を出さない）

**デザイントークン参照:**
- 背景: `color.background.secondary` (#F5F3EF)
- 角丸: `radius.md` (8pt)
- アニメーション: 不透明度 0.3 → 0.6 → 0.3（800ms周期）

### プログレス表示の仕様（原則：使わない）

#### 方針

- **数値％・進捗バーは 原則NG**（焦り・評価感が出る）
- **例外：ユーザーが明確に「処理を待っている」と理解している長処理のみ**
- **例：将来のデータエクスポート、初回の大量移行など**（UX-LATER領域）

#### 例外時の表現（将来用）

- **％は出さず、ステップ名だけ**（短い名詞）
- **例：「まとめています…」「整えています…」**
- **バーを出すなら、細いラインがゆっくり満ちる**（短時間で戻らない）

**デザイントークン参照:**
- バーの高さ: 2pt（極細）
- 色: `color.text.tertiary` (#9C9590)
- アニメーション: `duration.slow` (600ms以上) でゆっくり

### 画面別：待機状態の具体（MVP想定）

#### S-01 トップ（キッチン世界）

- **原則ローディング表示なし**
- **アセットが未ロードの場合：**
  - **世界は表示する**（最小構成）
  - **必要なら右下などに 小さな3dots を出す**（操作を邪魔しない）

#### S-02 アーカイブ（棚図鑑）

- **初回表示：スケルトングリッド**（最大 900ms〜）
- **追加読み込み：リスト末尾に 小さな3dots**（中央ではなく最下部）

#### S-03 詳細モーダル

- **写真取得待ち：写真枠のみスケルトン、テキストは先に出してOK**
- **閉じる操作は常に可能**（待ちで閉じられないのはNG）

#### S-04 記録フロー（写真/入力/保存）

- **写真選択：サムネ生成など短い待ちは インライン3dots**
- **保存：**
  - **200ms未満 → 何も出さず S-08 へ**
  - **200ms超 → ボタン内に「…」ではなく 小さな点の呼吸**（文言は変えない）

### NGチェック（受け入れ条件の「チカチカ」対策）

以下の項目をすべて避けること:

- [ ] 点滅（on/offが明確な点灯）をしない
- [ ] 高速回転をしない
- [ ] シマー（光が走る）をしない
- [ ] 画面中央の遮断ローディングを乱用しない
- [ ] 謝罪や焦らせる文言（「お待ちください」「少々」）を多用しない

---

## 更新履歴

| 日付 | 更新内容 |
|------|---------|
| 2026-02-01 | 初版作成（03-design-tokens.md + 04-motion-tokens.md + 10-ui-components.md + 10-01〜10-06 を統合） |

---

## 参照

詳細な実装ガイドラインや追加のアニメーション仕様については、以下のドキュメントを参照：

- `03-assets.md` — 2.5Dアセット仕様（パフォーマンス予算含む）
- `04-lighting.md` — ライティング仕様（時間帯グラデーション補完ルール含む）
- `05-sound.md` — サウンド仕様（音量ダイナミクス含む）
- `07-accessibility.md` — アクセシビリティ要件（レスポンシブレイアウト含む）

