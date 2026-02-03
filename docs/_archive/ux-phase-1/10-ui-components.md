> **⚠️ このファイルはアーカイブされました**
>
> このファイルの内容は `docs/ux/phase-1/02-design-system.md` に統合されました。
> 最新の情報はそちらを参照してください。
>
> ---

# UI Components - Atomic Design System

このドキュメントは、アプリのUIコンポーネントシステムを定義します。

## 概要

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

## 参照

- [03-design-tokens.md](./03-design-tokens.md) - デザイントークン定義
- [04-motion-tokens.md](./04-motion-tokens.md) - モーショントークン定義
- [09-accessibility-requirements.md](./09-accessibility-requirements.md) - アクセシビリティ要件
- [10-01-button-visual-design.md](./10-01-button-visual-design.md) - ボタン/リンク/タップ可能要素のビジュアル設計
- [10-02-form-elements-design.md](./10-02-form-elements-design.md) - フォーム要素設計（テキスト入力/選択UI/ピッカー）
- [10-03-modal-overlay-design.md](./10-03-modal-overlay-design.md) - モーダル/ボトムシート/オーバーレイ設計
- [10-04-shelf-card-animation-design.md](./10-04-shelf-card-animation-design.md) - 棚図鑑 カード追加アニメーション設計
- [10-05-card-grade-up-animation-design.md](./10-05-card-grade-up-animation-design.md) - 料理カード グレードアップ演出設計
- [10-06-loading-states-design.md](./10-06-loading-states-design.md) - ローディング/待機状態の表現設計
- [10-07-performance-budget-design.md](./10-07-performance-budget-design.md) - 2.5D世界 メモリ使用量・パフォーマンス目標
- [10-08-time-gradient-interpolation-design.md](./10-08-time-gradient-interpolation-design.md) - 時間帯グラデーション補完ルール
- [10-09-sound-assets-design.md](./10-09-sound-assets-design.md) - 環境音アセットリスト定義
- [10-10-time-based-sound-rules.md](./10-10-time-based-sound-rules.md) - 時間帯に応じたサウンド変化ルール
- [10-11-sound-volume-dynamics-design.md](./10-11-sound-volume-dynamics-design.md) - 各サウンドタイプの音量レンジとダイナミクス
- [10-12-responsive-layout-design.md](./10-12-responsive-layout-design.md) - 画面サイズ別レイアウト調整
