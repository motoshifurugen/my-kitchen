> **⚠️ このファイルはアーカイブされました**
>
> このファイルの内容は `docs/ux/phase-1/02-design-system.md` に統合されました。
> 最新の情報はそちらを参照してください。
>
> ---

# 10-01: ボタン / リンク / タップ可能要素のビジュアル設計
_Button, Link & Tappable Elements Visual Design Specification_

**UX-SOON P1**

---

## 概要

このドキュメントは、アプリ内のボタン・リンク・タップ可能要素のビジュアル設計仕様を定義します。

World Bible の視覚言語原則に準拠し、「静かな儀式」の世界観を保ちながら、確実に操作可能なインターフェースを実現します。

**関連ドキュメント:**
- [03-design-tokens.md](./03-design-tokens.md) - デザイントークン定義
- [10-ui-components.md](./10-ui-components.md) - UIコンポーネントシステム
- [../world-bible/visual-foundation.md](../world-bible/visual-foundation.md) - 視覚言語の基礎

---

## 1) 共通原則（World Bible準拠）

### 線で囲わない
アウトライン枠で主張しない。境界は背景色差 + 影 + 余白で作る。

### 確実に押せる
タップ領域は最小 44pt を保証。見た目が小さくても `hitSlop` で補強する。

### 静かな強さ
コントラストは強すぎないが、押下時に必ず状態差が分かる。

### 言葉がUIを支える
ラベルは短く、命令口調を避ける（例：「保存する」より「このまま置く」など、文言は別Issueで詰めてもOK）。

---

## 2) ボタンバリエーション定義（Primary / Secondary / Tertiary）

### Primary（主アクション）

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

### Secondary（副アクション）

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

### Tertiary（最小アクション / テキスト導線）

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

---

## 3) 状態定義（default / pressed / disabled）

### default

- **Primary:** soft fill + うすい影
- **Secondary:** 薄い面 + さらに薄い影
- **Tertiary:** テキストのみ

### pressed（押下中）

"静かな確実さ"のために必須（すべてのバリエーションに適用）

**視覚変化は最低2つ入れる**（例：暗さ + 縮み、暗さ + 影減少）

**推奨変化:**
- `scale: 0.98`（ほんの少し沈む）
- `shadow`を弱める（浮きが減る）
- 背景をほんの少し濃く（にじむ程度）

**デザイントークン参照:**
- 背景: `color.surface.pressed` または `opacity.pressed` オーバーレイ
- アニメーション: `motion.duration.fast` (150ms) で即時フィードバック

### disabled

- **透明度を下げる**（テキストも面も一律で落とす）
- **影はゼロ**（押せそう感を消す）
- **押下アニメーションなし**
- **文言は変えない**（説明は必要なら補助テキストで）

**デザイントークン参照:**
- 透明度: `opacity.disabled` (0.4)
- 影: なし
- テキスト: `color.text.disabled`

---

## 4) タップ領域・レイアウト規約（44pt保証）

### 最小タップ領域
- **最小タップ領域:** 44pt × 44pt（iOS Human Interface Guidelinesに合わせる）

### 見た目の高さ（推奨）
- **Primary / Secondary:** 48–56pt（余白で安心感）
- **Tertiary / リンク:** 見た目が小さい場合でも、`hitSlop`で44pt確保

### 間隔（誤タップ防止）
- **ボタン同士の最小間隔:** 12–16pt
- **リンク同士の最小間隔:** 12–16pt
- **破壊的アクション**（削除など）は距離をさらに取る
- **長文内のリンク:** 避ける（独立行か行全体タップにする）

**デザイントークン参照:**
- 最小タップ領域: `size.tap.minimum` (44pt)
- 推奨タップ領域: `size.tap.recommended` (48pt)
- 間隔: `spacing.md` (16pt) または `spacing.sm` (8pt) + `spacing.xs` (4pt)

---

## 5) リンク / インラインタップ要素（テキスト導線）

### 基本原則
- **下線は基本使わない**（主張が強い）
- **代わりに:**
  - 色差（控えめ）+ 押下時の背景にじみ
  - 末尾に「›」などの記号は多用しない（必要な行だけ）
  - 長文の中に埋め込まない：リンクは独立行か行全体タップにする（迷わせない）

### デザイントークン参照
- テキスト色: `color.text.link` (#C17A50)
- 押下時背景: `color.surface.pressed` または `opacity.pressed` オーバーレイ
- タップ領域: `hitSlop` で44pt確保

### 使用パターン

#### パターン1: 独立行リンク
リンクテキストが独立した行として表示される。行全体がタップ可能。

**使用例:**
- 設定画面のナビゲーション行
- 「くわしく見る」「もっと見る」などの導線

#### パターン2: インラインテキストリンク
テキスト内に埋め込まれるリンク。ただし、長文内への埋め込みは避ける。

**使用例:**
- 利用規約へのリンク
- プライバシーポリシーへのリンク

#### パターン3: リストアイテムリンク
リストの各項目がタップ可能な場合。行全体がタップ可能。

**使用例:**
- メニュー一覧の各項目
- 履歴リストの各項目

---

## 6) "強い主張"にならないためのチェック

以下の項目をすべて満たすこと:

- [ ] Primaryは1画面に基本1つ（多くても2つまで）
- [ ] アウトライン枠で囲っていない
- [ ] 影が強すぎない（浮遊感が出ない）
- [ ] 押下時に必ず差が分かる（静かでも確実）
- [ ] タップ領域44ptが担保されている（`hitSlop`含む）
- [ ] リンクは下線を使っていない
- [ ] リンクの色差が控えめ（主張しすぎない）
- [ ] リンクは長文内に埋め込んでいない（独立行か行全体タップ）

---

## 実装ガイドライン

### React Native 実装例（参考）

#### ボタン

```tsx
// Primary Button
<PressableBase
  style={[
    styles.primaryButton,
    pressed && styles.primaryButtonPressed,
    disabled && styles.primaryButtonDisabled,
  ]}
  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
  disabled={disabled}
  accessibilityLabel="保存"
  accessibilityRole="button"
>
  <Text style={styles.primaryButtonText}>保存</Text>
</PressableBase>

// Secondary Button
<PressableBase
  style={[
    styles.secondaryButton,
    pressed && styles.secondaryButtonPressed,
    disabled && styles.secondaryButtonDisabled,
  ]}
  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
  disabled={disabled}
  accessibilityLabel="キャンセル"
  accessibilityRole="button"
>
  <Text style={styles.secondaryButtonText}>キャンセル</Text>
</PressableBase>

// Tertiary Button
<PressableBase
  style={[
    styles.tertiaryButton,
    pressed && styles.tertiaryButtonPressed,
    disabled && styles.tertiaryButtonDisabled,
  ]}
  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
  disabled={disabled}
  accessibilityLabel="スキップ"
  accessibilityRole="button"
>
  <Text style={styles.tertiaryButtonText}>スキップ</Text>
</PressableBase>
```

#### リンク

```tsx
// 独立行リンク
<PressableBase
  style={[
    styles.linkRow,
    pressed && styles.linkRowPressed,
    disabled && styles.linkRowDisabled,
  ]}
  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
  disabled={disabled}
  accessibilityLabel="くわしく見る"
  accessibilityRole="link"
>
  <Text style={styles.linkRowText}>くわしく見る</Text>
</PressableBase>

// インラインテキストリンク（長文内は避ける）
<Text>
  利用規約に同意の上、
  <PressableBase
    style={[styles.inlineLink, pressed && styles.inlineLinkPressed]}
    hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
    accessibilityLabel="利用規約を確認"
    accessibilityRole="link"
  >
    <Text style={styles.inlineLinkText}>利用規約</Text>
  </PressableBase>
  をご確認ください。
</Text>

// リストアイテムリンク
<PressableBase
  style={[
    styles.listItemLink,
    pressed && styles.listItemLinkPressed,
  ]}
  hitSlop={{ top: 8, bottom: 8, left: 0, right: 0 }}
  accessibilityLabel="メニュー名を確認"
  accessibilityRole="link"
>
  <Text style={styles.listItemLinkText}>メニュー名</Text>
  <Icon name="caret-right" size={16} color={colors.icon.default} />
</PressableBase>
```

### スタイル定義例（参考）

```tsx
const styles = StyleSheet.create({
  // Primary Button
  primaryButton: {
    backgroundColor: colors.accent.primary, // #C17A50
    borderRadius: radius.lg, // 12pt
    paddingVertical: spacing.md, // 16pt
    paddingHorizontal: spacing.lg, // 24pt
    minHeight: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  primaryButtonPressed: {
    transform: [{ scale: 0.98 }],
    backgroundColor: colors.surface.pressed, // 少し濃く
    shadowOpacity: 0.02, // 影を弱める
  },
  primaryButtonDisabled: {
    opacity: opacity.disabled, // 0.4
    shadowOpacity: 0, // 影なし
  },
  primaryButtonText: {
    color: colors.text.inverse, // #FDFCFA
    fontSize: typography.size.md, // 15pt
    fontWeight: typography.weight.semibold, // 600
  },
  
  // Secondary Button
  secondaryButton: {
    backgroundColor: colors.background.secondary, // #F5F3EF
    borderRadius: radius.md, // 8pt
    paddingVertical: spacing.md, // 16pt
    paddingHorizontal: spacing.lg, // 24pt
    minHeight: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 1,
    elevation: 0.5,
  },
  secondaryButtonPressed: {
    transform: [{ scale: 0.98 }],
    backgroundColor: colors.surface.pressed,
    shadowOpacity: 0,
  },
  secondaryButtonDisabled: {
    opacity: opacity.disabled, // 0.4
    shadowOpacity: 0,
  },
  secondaryButtonText: {
    color: colors.text.secondary, // #6B6560
    fontSize: typography.size.md, // 15pt
    fontWeight: typography.weight.medium, // 500
  },
  
  // Tertiary Button
  tertiaryButton: {
    paddingVertical: spacing.sm, // 8pt
    paddingHorizontal: spacing.md, // 16pt
    borderRadius: radius.md, // 8pt
    minHeight: 44, // hitSlopで補強
  },
  tertiaryButtonPressed: {
    backgroundColor: colors.surface.pressed, // にじむハイライト
  },
  tertiaryButtonDisabled: {
    opacity: opacity.disabled, // 0.4
  },
  tertiaryButtonText: {
    color: colors.text.secondary, // #6B6560
    fontSize: typography.size.md, // 15pt
    fontWeight: typography.weight.regular, // 400
  },
  
  // 独立行リンク
  linkRow: {
    paddingVertical: spacing.sm, // 8pt
    paddingHorizontal: spacing.md, // 16pt
    borderRadius: radius.md, // 8pt
    minHeight: 44, // hitSlopで補強
  },
  linkRowPressed: {
    backgroundColor: colors.surface.pressed, // にじむハイライト
  },
  linkRowDisabled: {
    opacity: opacity.disabled, // 0.4
  },
  linkRowText: {
    color: colors.text.link, // #C17A50
    fontSize: typography.size.md, // 15pt
    fontWeight: typography.weight.regular, // 400
  },
  
  // インラインテキストリンク
  inlineLink: {
    paddingVertical: spacing.xs, // 4pt
    paddingHorizontal: spacing.xs, // 4pt
    borderRadius: radius.sm, // 4pt
  },
  inlineLinkPressed: {
    backgroundColor: colors.surface.pressed,
  },
  inlineLinkText: {
    color: colors.text.link, // #C17A50
    fontSize: typography.size.md, // 15pt
    fontWeight: typography.weight.regular, // 400
    textDecorationLine: 'none', // 下線なし
  },
  
  // リストアイテムリンク
  listItemLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md, // 16pt
    paddingHorizontal: spacing.md, // 16pt
    borderRadius: radius.md, // 8pt
    minHeight: 44,
  },
  listItemLinkPressed: {
    backgroundColor: colors.surface.pressed,
  },
  listItemLinkText: {
    color: colors.text.primary, // #2C2825
    fontSize: typography.size.md, // 15pt
    fontWeight: typography.weight.regular, // 400
    flex: 1,
  },
});
```

---

## 変更履歴

| 日付 | 更新内容 |
|------|---------|
| 2026-02-01 | 初版作成（UX-SOON P1） |
