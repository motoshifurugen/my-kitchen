# 03: デザイントークン
_Design Tokens Specification_

---

## 概要

アプリ全体で使用するデザイントークン（カラー、タイポグラフィ、スペーシング、形状）を定義する。
具体的な値は `03-design-tokens.json` に格納。

**対象プラットフォーム:** iOS / Android（React Native）

**関連イシュー:** UX-016, UX-017, UX-018, UX-019, UX-025

---

## 単位ポリシー（Units Policy）

本ドキュメントにおける `pt` は iOS の「ポイント」を基準とする。
Android 実装時は `dp`（密度非依存ピクセル）として読み替えること。
フォントサイズについては Android では `sp`（スケール非依存ピクセル）を使用する。
React Native では数値をそのまま使用（density-independent）。

---

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

---

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

## 変更履歴

| 日付 | 更新内容 |
|------|---------|
| 2026-02-01 | 初版作成 |
| 2026-02-01 | UIステートトークン追加、セマンティックカラー分割、タイポグラフィ強化、overlay分割、elevation追加、フォーカスリング追加、WCAG表記修正 |
| 2026-02-01 | モバイル専用に整理: opacity.hover削除、iOS fontFamily をシステムデフォルト推奨に変更、JSON完全同期 |

---

## Change Notes

- `opacity.hover` を削除（モバイルアプリでは不使用）
- `typography.fontFamily.ios` を `System (default)` に変更（RN では fontFamily 省略を推奨）
- `size.tap.minimum` の説明を「WCAG準拠」から「プラットフォームガイドライン推奨」に修正
- セマンティックカラーを text/background/border に分割し JSON と MD を完全同期
