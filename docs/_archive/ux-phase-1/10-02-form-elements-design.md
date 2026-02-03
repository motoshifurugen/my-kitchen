> **⚠️ このファイルはアーカイブされました**
>
> このファイルの内容は `docs/ux/phase-1/02-design-system.md` に統合されました。
> 最新の情報はそちらを参照してください。
>
> ---

# 10-02: フォーム要素設計（テキスト入力 / 選択UI / ピッカー）
_Form Elements Design Specification (Text Input / Selection UI / Picker)_

**UX-SOON P1**

---

## 概要

このドキュメントは、アプリ内のフォーム要素（テキスト入力、選択UI、ピッカー）の設計仕様を定義します。

World Bible の視覚言語原則に準拠し、「静かな儀式」の世界観を保ちながら、迷いを減らし、確実に入力できるインターフェースを実現します。

**関連ドキュメント:**
- [03-design-tokens.md](./03-design-tokens.md) - デザイントークン定義
- [04-motion-tokens.md](./04-motion-tokens.md) - モーショントークン定義
- [10-ui-components.md](./10-ui-components.md) - UIコンポーネントシステム
- [10-01-button-visual-design.md](./10-01-button-visual-design.md) - ボタン/リンク/タップ可能要素のビジュアル設計
- [../world-bible/visual-foundation.md](../world-bible/visual-foundation.md) - 視覚言語の基礎

---

## 0) 共通原則（World Bible準拠）

### 迷いを減らす
入力は"何をすればいいか"が一目で分かる。説明は短く、選択肢は少なく。

### 線で囲わない
枠線でUI感を強めず、面（背景色差）＋余白＋タイポで成立させる。

### 入力は任意を基本
MVPで必須は最小（例：料理名のみ）。任意入力は"後でOK"が伝わる設計にする。

### エラーは責めない
赤で叱らず、静かに修正へ導く（「必要です」より「ここだけ入れると助かります」）。

---

## 1) テキストフィールド（Text Field / Text Area）

### 1-1. 基本構造

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

### 1-2. 状態（default / focus / disabled）

#### default
- **薄い面 + 通常テキスト**
- プレースホルダーは本文より薄い（ただし読める）

#### focus
- **面の明度を少し変える**（にじむ程度）
- **可能なら内側のハイライトで"今ここ"を示す**（枠線は使わない）
- フォーカスリングはアクセシビリティ用のみ（通常操作時は非表示）

**デザイントークン参照:**
- 背景: `color.surface.selected` または `color.background.secondary` を少し明るく
- フォーカスリング: `focus.ring.color` (#C17A50) - アクセシビリティ時のみ

#### disabled
- **透明度を下げる**（テキストも薄く）
- **入力不可を明確化**

**デザイントークン参照:**
- 透明度: `opacity.disabled` (0.4)
- テキスト: `color.text.disabled`

### 1-3. サイズと余白

- **1行入力:** 高さ 48–56pt（指が迷わない）
- **テキストエリア:** 最小 3行、伸縮可（自動拡張 or 固定高さどちらでもOK）
- **フィールド間隔:** 16pt（密にしない）

**デザイントークン参照:**
- 高さ: `size.tap.recommended` (48pt) 以上
- 間隔: `spacing.md` (16pt)
- パディング: `spacing.md` (16pt) 水平、`spacing.sm` (8pt) 垂直

### 1-4. キーボードと入力体験（"速さ"）

- **`returnKeyType` を目的に合わせる**（次へ/完了）
- **次の項目へ自動フォーカス**（ある場合）
- **入力中の"余計な判断"を消す:**
  - 料理名：placeholderで例示（「例：味噌汁」）
  - メモ：短文前提（長文を促さない）

---

## 2) プレースホルダーテキストのスタイル

### トーン
- **命令ではなく例示**（「入力してください」ではなく「例：…」）
- **見え方:** 本文より薄い、ただし読める（薄すぎ禁止）

### 禁止事項
- **長い説明文をplaceholderに詰めない**（読めない＆消える）

### 例
- **料理名:** 例：オムライス
- **メモ:** 今日の気配を一言だけ（任意）

**デザイントークン参照:**
- プレースホルダー色: `color.text.tertiary` (#9C9590) - ただし大テキストのみAA準拠のため、可読性を優先

---

## 3) 選択UI（Single / Multi）

### 3-1. 基本方針（迷いを減らす）

- **ドロップダウンは原則使わない**（迷い・操作コスト増）
- **選択肢が少ないものは Pill（チップ）で即決**
- **選択肢が多いものは 検索 or セクション分け**（ただしMVPでは増やさない）

### 3-2. Single Select（ラジオ相当）

**用途:** 年代、世帯、並び順など

**UI:** Pill / セグメント（タップで選択、再タップで解除も可＝押し付けない）

**設計原則:**
- **未選択が許される設計**（"分類されている感"回避）
- **選択状態は、色の濃さ or 面の違いで表現**（チェックマークは控えめ）

**デザイントークン参照:**
- 未選択: `color.background.secondary` または透明＋にじみ
- 選択: `color.surface.selected` または `color.accent.subtle`
- テキスト: `color.text.primary`（選択時）、`color.text.secondary`（未選択時）

### 3-3. Multi Select（チェック相当）

**用途:** タグ（将来）など

**UI:** Pill（複数ON）

**設計原則:**
- **ON:** 面が少し濃い + 小さいアイコン（任意）
- **OFF:** 薄い面（または透明＋にじみ）
- **"全部選ぶ"は置かない**（選択疲れを増やす）

**デザイントークン参照:**
- ON: `color.surface.selected` + 小さなアイコン（`color.icon.active`）
- OFF: `color.background.secondary` または透明

---

## 4) ピッカー（日時・期間・カテゴリなど）

### 4-1. MVP前提

**MVPでピッカーが必要になりやすいのは:**
- 日付（任意の編集）
- フィルタ期間（探索の将来）

**基本方針:**
- **基本はOS標準のピッカーを使い、独自UIは避ける**（速さ優先）

### 4-2. 表示形式

- **モーダル / ボトムシートで出す**（画面遷移させない）
- **キャンセルと決定を明確に**（ただし押し付けない文言）

**デザイントークン参照:**
- モーダル背景: `color.overlay.scrim` (rgba(44, 40, 37, 0.4))
- ボトムシート: `color.surface.elevated` + `shadow.lg`

---

## 5) バリデーション & エラー表示（責めない）

### 5-1. 表示ルール

- **入力中は出さない**（タイピングの邪魔）
- **確定アクション時（次へ/保存）にだけ出す**
- **エラーは1つずつ、最短で直せる形にする**

### 5-2. 表現（静か）

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

## 6) 入力完了時のフィードバック

### フィールド単体の完了

- **フォーカスが外れた瞬間に、軽い"落ち着き"が出る程度**（色が戻る、にじみが消える）
- **チェックマーク常設はしない**（評価感が出る）

### フォーム全体の完了

- **次へ/保存ボタンが自然に有効化**（最重要のフィードバック）
- **追加で出すなら、短い安心文**（例：「あとから変えられます」）

**デザイントークン参照:**
- アニメーション: `motion.duration.fast` (150ms) で即時フィードバック

---

## 7) 受け入れ条件チェック（このIssueのDone条件）

以下の項目をすべて満たすこと:

- [ ] テキストフィールドのデザイン：面＋余白＋focusにじみ、48–56pt
- [ ] 選択UI：Pill中心（Single/Multi）、ドロップダウンは原則回避
- [ ] エラー：確定時のみ、責めない文言、フィールド直下1行
- [ ] プレースホルダー：例示中心、本文より薄い、長文禁止
- [ ] 完了フィードバック：ボタン有効化＋軽い視覚変化、チェック常設なし

---

## 実装ガイドライン

### React Native 実装例（参考）

#### テキストフィールド

```tsx
// Text Field
<View>
  <Text style={styles.label}>料理名</Text>
  <PressableBase
    style={[
      styles.textField,
      focused && styles.textFieldFocused,
      disabled && styles.textFieldDisabled,
      error && styles.textFieldError,
    ]}
    disabled={disabled}
  >
    <TextInput
      style={styles.textInput}
      placeholder="例：オムライス"
      placeholderTextColor={colors.text.tertiary}
      value={value}
      onChangeText={onChangeText}
      onFocus={onFocus}
      onBlur={onBlur}
      editable={!disabled}
      returnKeyType="next"
      accessibilityLabel="料理名を入力"
    />
  </PressableBase>
  {helper && <Text style={styles.helper}>{helper}</Text>}
  {error && <Text style={styles.error}>{error}</Text>}
</View>

// Text Area
<View>
  <Text style={styles.label}>メモ（任意）</Text>
  <PressableBase
    style={[
      styles.textArea,
      focused && styles.textAreaFocused,
    ]}
  >
    <TextInput
      style={styles.textAreaInput}
      placeholder="今日の気配を一言だけ（任意）"
      placeholderTextColor={colors.text.tertiary}
      value={value}
      onChangeText={onChangeText}
      multiline
      numberOfLines={3}
      textAlignVertical="top"
      accessibilityLabel="メモを入力"
    />
  </PressableBase>
  {counter && (
    <Text style={styles.counter}>
      {value.length} / {maxLength}
    </Text>
  )}
</View>
```

#### 選択UI（Pill）

```tsx
// Single Select Pill
<View style={styles.pillGroup}>
  {options.map((option) => (
    <PressableBase
      key={option.value}
      style={[
        styles.pill,
        selected === option.value && styles.pillSelected,
      ]}
      onPress={() => onSelect(option.value)}
      accessibilityLabel={option.label}
      accessibilityRole="radio"
      accessibilityState={{ selected: selected === option.value }}
    >
      <Text
        style={[
          styles.pillText,
          selected === option.value && styles.pillTextSelected,
        ]}
      >
        {option.label}
      </Text>
    </PressableBase>
  ))}
</View>

// Multi Select Pill
<View style={styles.pillGroup}>
  {options.map((option) => (
    <PressableBase
      key={option.value}
      style={[
        styles.pill,
        selected.includes(option.value) && styles.pillSelected,
      ]}
      onPress={() => onToggle(option.value)}
      accessibilityLabel={option.label}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected.includes(option.value) }}
    >
      {selected.includes(option.value) && (
        <Icon name="check" size={16} color={colors.icon.active} />
      )}
      <Text
        style={[
          styles.pillText,
          selected.includes(option.value) && styles.pillTextSelected,
        ]}
      >
        {option.label}
      </Text>
    </PressableBase>
  ))}
</View>
```

### スタイル定義例（参考）

```tsx
const styles = StyleSheet.create({
  // Label
  label: {
    fontSize: typography.size.sm, // 13pt
    fontWeight: typography.weight.medium, // 500
    color: colors.text.secondary, // #6B6560
    marginBottom: spacing.xs, // 4pt
  },
  
  // Text Field
  textField: {
    backgroundColor: colors.background.secondary, // #F5F3EF
    borderRadius: radius.lg, // 12pt
    paddingHorizontal: spacing.md, // 16pt
    paddingVertical: spacing.sm, // 8pt
    minHeight: 48,
  },
  textFieldFocused: {
    backgroundColor: colors.surface.selected, // #F5EDE6
  },
  textFieldDisabled: {
    opacity: opacity.disabled, // 0.4
  },
  textFieldError: {
    backgroundColor: colors.semantic.error.background, // #F9F0EE
  },
  textInput: {
    fontSize: typography.size.md, // 15pt
    fontWeight: typography.weight.regular, // 400
    color: colors.text.primary, // #2C2825
    padding: 0, // TextInputのデフォルトパディングを削除
  },
  
  // Text Area
  textArea: {
    backgroundColor: colors.background.secondary, // #F5F3EF
    borderRadius: radius.lg, // 12pt
    paddingHorizontal: spacing.md, // 16pt
    paddingVertical: spacing.sm, // 8pt
    minHeight: 80, // 3行分
  },
  textAreaFocused: {
    backgroundColor: colors.surface.selected, // #F5EDE6
  },
  textAreaInput: {
    fontSize: typography.size.md, // 15pt
    fontWeight: typography.weight.regular, // 400
    color: colors.text.primary, // #2C2825
    padding: 0,
    minHeight: 64,
  },
  
  // Helper / Error
  helper: {
    fontSize: typography.size.xs, // 11pt
    color: colors.text.tertiary, // #9C9590
    marginTop: spacing.xs, // 4pt
  },
  error: {
    fontSize: typography.size.xs, // 11pt
    color: colors.semantic.error.text, // #9E5A4D
    marginTop: spacing.xs, // 4pt
  },
  counter: {
    fontSize: typography.size.xs, // 11pt
    color: colors.text.tertiary, // #9C9590
    textAlign: 'right',
    marginTop: spacing.xs, // 4pt
  },
  
  // Pill Group
  pillGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm, // 8pt
  },
  
  // Pill
  pill: {
    paddingHorizontal: spacing.md, // 16pt
    paddingVertical: spacing.sm, // 8pt
    borderRadius: radius.full, // 9999pt
    backgroundColor: colors.background.secondary, // #F5F3EF
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs, // 4pt
  },
  pillSelected: {
    backgroundColor: colors.surface.selected, // #F5EDE6
  },
  pillText: {
    fontSize: typography.size.md, // 15pt
    fontWeight: typography.weight.regular, // 400
    color: colors.text.secondary, // #6B6560
  },
  pillTextSelected: {
    color: colors.text.primary, // #2C2825
    fontWeight: typography.weight.medium, // 500
  },
});
```

---

## 変更履歴

| 日付 | 更新内容 |
|------|---------|
| 2026-02-01 | 初版作成（UX-SOON P1） |

