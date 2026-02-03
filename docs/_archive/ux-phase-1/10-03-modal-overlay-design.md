> **⚠️ このファイルはアーカイブされました**
>
> このファイルの内容は `docs/ux/phase-1/02-design-system.md` に統合されました。
> 最新の情報はそちらを参照してください。
>
> ---

# 10-03: モーダル / ボトムシート / オーバーレイ設計
_Modal, Bottom Sheet & Overlay Design Specification_

**UX-SOON P1**

---

## 概要

このドキュメントは、アプリ内のモーダル・ボトムシート・オーバーレイの設計仕様を定義します。

World Bible の視覚言語原則に準拠し、「静かな儀式」の世界観を保ちながら、ユーザーの「戻るストレス」を増やさず、直感的に操作できるインターフェースを実現します。

**関連ドキュメント:**
- [03-design-tokens.md](./03-design-tokens.md) - デザイントークン定義
- [04-motion-tokens.md](./04-motion-tokens.md) - モーショントークン定義
- [10-ui-components.md](./10-ui-components.md) - UIコンポーネントシステム
- [10-01-button-visual-design.md](./10-01-button-visual-design.md) - ボタン/リンク/タップ可能要素のビジュアル設計
- [../world-bible/visual-foundation.md](../world-bible/visual-foundation.md) - 視覚言語の基礎

---

## 0) 共通原則（World Bible準拠）

### 画面遷移ではなく上に置く
ユーザーの「戻るストレス」を増やさない。

### 背景は少し暗くする（強くしない）
主張しすぎず、前面だけを"そっと"浮かせる。

### 閉じ方は直感で複数
ボタン＋外側タップ＋（可能なら）スワイプ。迷わせない。

### 枠線で囲わない
面・角丸・余白で成立させる（UIが機械的にならない）。

---

## 1) 背景オーバーレイ（Dim / Scrim）

### 1-1. 色・透明度（基本値）

- **ベース:** 黒（#000）
- **不透明度:** 18%（標準）
- **状況別:**
  - ライトなボトムシート（選択だけ）：14%
  - 情報量の多いモーダル（詳細・確認）：22%
  - セレブレーション（S-08等）：10–14%（世界を消しすぎない）

**※「暗い＝集中」ではなく、「少し遠のく」程度が目標。**

**デザイントークン参照:**
- 標準: `color.overlay.scrim` (rgba(44, 40, 37, 0.4)) - ただし、この仕様では黒ベースで透明度を調整
- 実装時は `rgba(0, 0, 0, 0.18)` を標準として使用

### 1-2. 背景の扱い

- **背景はそのまま見せる**（原則 blur しない）
- **例外:** 写真詳細など情報密度が高くて読みにくい場合のみ、軽いブラーを検討（MVPでは不要）

---

## 2) モーダル（中央 / カード型）

### 2-1. 用途（例）

- S-03 料理カード詳細（モーダル）
- 確認系（削除・注意・許可案内など）

### 2-2. サイズ・配置

- **配置:** 画面中央（縦は少し上寄せでも可）
- **幅:** 画面幅 - 40pt（左右20ptマージン）
- **高さ:**
  - 標準：内容に応じて自動（最大でも画面高の 80–85%）
  - 長文/履歴：内部スクロール（モーダル自体は固定）

**デザイントークン参照:**
- マージン: `spacing.screen.horizontal` (20pt) × 2 = 40pt
- 最大高さ: 画面高の 80–85%

### 2-3. 見た目

- **角丸:** 大きめ（2xl相当）
- **影:** 強くしない（あるなら極薄）
- **余白:** 外側（モーダル内）16–20pt

**デザイントークン参照:**
- 角丸: `radius.xl` (16pt) またはそれ以上
- 影: `shadow.sm` よりさらに薄い、またはなし
- パディング: `spacing.md` (16pt) または `spacing.lg` (20pt)
- 背景: `color.surface.elevated` (#FFFFFF)

### 2-4. 閉じる操作

- **×ボタン:** 左上 or 右上（S-03は左上推奨）
- **外側タップ:** 閉じる（有効）
- **スワイプ:** 基本なし（中央モーダルは誤操作が増えるため）
- **戻り先:** 呼び出し元画面（状態は保持）

**デザイントークン参照:**
- ×ボタン: `Icon` コンポーネント、サイズ 24pt、色 `color.icon.default`
- タップ領域: `size.tap.minimum` (44pt) を確保

---

## 3) ボトムシート（Bottom Sheet）

### 3-1. 用途（例）

- 写真追加導線（カメラ / ライブラリ / スキップ）
- 並び替え選択（最終作成日 / 古い順 / 50音）
- 軽い選択UI（Pillより多いが、画面遷移したくないもの）

### 3-2. 高さバリエーション

ボトムシートは **3段階** で統一（設計・実装コストを抑える）。

#### 1. Compact（選択だけ）

- **高さ:** 内容 + safe area（目安：画面高の 25–35%）

#### 2. Medium（標準）

- **高さ:** 画面高の 55–65%

#### 3. Expanded（情報量多い/検索系）

- **高さ:** 画面高の 85–92%（ほぼフル）
- **内部スクロール前提**

**デザイントークン参照:**
- Compact: 画面高の 25–35%
- Medium: 画面高の 55–65%
- Expanded: 画面高の 85–92%
- Safe Area: iOS/Androidのセーフエリアを考慮

### 3-3. 見た目

- **上端のみ角丸**（大）
- **上部にハンドル**（短い横棒）を置く（主張しない）
- **セーフエリア考慮**（下が切れない）

**デザイントークン参照:**
- 角丸: `radius.xl` (16pt) または `radius.2xl` (20pt) - 上端のみ
- ハンドル: 幅 40pt、高さ 4pt、色 `color.icon.default` を薄く
- 背景: `color.surface.elevated` (#FFFFFF)
- パディング: `spacing.md` (16pt) または `spacing.lg` (20pt)

### 3-4. 閉じる操作

- **下スワイプ:** 閉じる（必須）
- **外側タップ:** 閉じる（有効）
- **明示ボタン:** 原則不要（必要なら「閉じる」ではなく×）
- **例外:** 破壊的操作の確認は中央モーダルへ（シートでやらない）

**デザイントークン参照:**
- スワイプ閾値: 下方向に一定距離（例：50pt以上）ドラッグで閉じる
- アニメーション: `motion.duration.normal` (300ms) でスムーズに

---

## 4) オーバーレイ（Overlay：全画面演出 / 軽量通知）

### 4-1. 用途（例）

- S-08 セレブレーション（記録完了演出）
- 一時的な"気配"表示（例：保存しました、など）

### 4-2. 表示ルール

- **画面遷移しない**
- **表示時間は短く**（1.5〜2.0秒目安）
- **背景は薄暗くしすぎない**（Scrim 10–14%）

**デザイントークン参照:**
- 背景: `rgba(0, 0, 0, 0.10)` 〜 `rgba(0, 0, 0, 0.14)`
- アニメーション: `motion.duration.fast` (150ms) で表示、`motion.duration.normal` (300ms) で非表示

### 4-3. 閉じる

- **基本は自動で消える**
- **重要情報ならタップで閉じてもOK**（強制はしない）

---

## 5) 受け入れ条件チェック（Done条件）

以下の項目をすべて満たすこと:

- [ ] モーダルのサイズ・配置：幅=画面-40pt、高さ最大80–85%、中央配置
- [ ] ボトムシートの高さ：Compact / Medium / Expanded の3段階
- [ ] 背景オーバーレイ：黒 + 透明度14/18/22%（状況別）
- [ ] 閉じる操作：
  - [ ] モーダル：×＋外側タップ
  - [ ] シート：下スワイプ＋外側タップ
  - [ ] オーバーレイ：自動＋（任意で）タップ

---

## 実装ガイドライン

### React Native 実装例（参考）

#### モーダル

```tsx
// Modal Component
<Modal
  visible={visible}
  transparent
  animationType="fade"
  onRequestClose={onClose}
>
  <PressableBase
    style={styles.modalOverlay}
    onPress={onClose}
    accessibilityLabel="モーダルを閉じる"
  >
    <PressableBase
      style={styles.modalContent}
      onPress={(e) => e.stopPropagation()}
      accessibilityRole="dialog"
    >
      {/* 閉じるボタン */}
      <PressableBase
        style={styles.closeButton}
        onPress={onClose}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        accessibilityLabel="閉じる"
      >
        <Icon name="x" size={24} color={colors.icon.default} />
      </PressableBase>
      
      {/* コンテンツ */}
      <View style={styles.modalBody}>
        {children}
      </View>
    </PressableBase>
  </PressableBase>
</Modal>
```

#### ボトムシート

```tsx
// Bottom Sheet Component
<Modal
  visible={visible}
  transparent
  animationType="slide"
  onRequestClose={onClose}
>
  <PressableBase
    style={styles.bottomSheetOverlay}
    onPress={onClose}
    accessibilityLabel="ボトムシートを閉じる"
  >
    <PressableBase
      style={[
        styles.bottomSheetContent,
        variant === 'compact' && styles.bottomSheetCompact,
        variant === 'medium' && styles.bottomSheetMedium,
        variant === 'expanded' && styles.bottomSheetExpanded,
      ]}
      onPress={(e) => e.stopPropagation()}
      accessibilityRole="dialog"
    >
      {/* ハンドル */}
      <View style={styles.handle} />
      
      {/* コンテンツ */}
      <ScrollView
        style={styles.bottomSheetBody}
        showsVerticalScrollIndicator={variant === 'expanded'}
      >
        {children}
      </ScrollView>
    </PressableBase>
  </PressableBase>
</Modal>
```

#### オーバーレイ（トースト/セレブレーション）

```tsx
// Overlay Component
<Modal
  visible={visible}
  transparent
  animationType="fade"
  onRequestClose={onClose}
>
  <PressableBase
    style={styles.overlayContainer}
    onPress={dismissible ? onClose : undefined}
    accessibilityLabel={accessibilityLabel}
  >
    <View style={styles.overlayContent}>
      {children}
    </View>
  </PressableBase>
</Modal>

// 使用例（自動で閉じる）
useEffect(() => {
  if (visible) {
    const timer = setTimeout(() => {
      onClose();
    }, 2000); // 2秒で自動閉じる
    
    return () => clearTimeout(timer);
  }
}, [visible, onClose]);
```

### スタイル定義例（参考）

```tsx
import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const styles = StyleSheet.create({
  // Modal Overlay
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.18)', // 標準
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Modal Content
  modalContent: {
    width: SCREEN_WIDTH - 40, // 左右20ptマージン
    maxHeight: SCREEN_HEIGHT * 0.85, // 最大85%
    backgroundColor: colors.surface.elevated, // #FFFFFF
    borderRadius: radius.xl, // 16pt
    padding: spacing.md, // 16pt
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 5,
  },
  
  closeButton: {
    position: 'absolute',
    top: spacing.md, // 16pt
    left: spacing.md, // 16pt（左上推奨）
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  
  modalBody: {
    marginTop: spacing.md, // 16pt（×ボタンのスペース）
  },
  
  // Bottom Sheet Overlay
  bottomSheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.14)', // ライトなシート用
    justifyContent: 'flex-end',
  },
  
  // Bottom Sheet Content
  bottomSheetContent: {
    backgroundColor: colors.surface.elevated, // #FFFFFF
    borderTopLeftRadius: radius.xl, // 16pt
    borderTopRightRadius: radius.xl, // 16pt
    paddingTop: spacing.md, // 16pt（ハンドル用）
    paddingBottom: spacing.md, // 16pt（セーフエリア考慮）
    paddingHorizontal: spacing.md, // 16pt
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  
  bottomSheetCompact: {
    maxHeight: SCREEN_HEIGHT * 0.35, // 25–35%
  },
  
  bottomSheetMedium: {
    maxHeight: SCREEN_HEIGHT * 0.65, // 55–65%
  },
  
  bottomSheetExpanded: {
    maxHeight: SCREEN_HEIGHT * 0.92, // 85–92%
  },
  
  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.icon.default, // #6B6560
    opacity: 0.3,
    borderRadius: radius.sm, // 4pt
    alignSelf: 'center',
    marginBottom: spacing.sm, // 8pt
  },
  
  bottomSheetBody: {
    flex: 1,
  },
  
  // Overlay Container
  overlayContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.12)', // 10–14%
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  overlayContent: {
    // コンテンツに応じて調整
  },
});
```

### スワイプジェスチャー実装（ボトムシート）

```tsx
import { PanResponder } from 'react-native';

// ボトムシート用のPanResponder
const panResponder = PanResponder.create({
  onStartShouldSetPanResponder: () => true,
  onMoveShouldSetPanResponder: (_, gestureState) => {
    // 下方向へのスワイプのみ検出
    return gestureState.dy > 10;
  },
  onPanResponderMove: (_, gestureState) => {
    // 下方向へのドラッグ中は、シートを下に移動
    if (gestureState.dy > 0) {
      // アニメーションで下に移動
    }
  },
  onPanResponderRelease: (_, gestureState) => {
    // 一定距離以上ドラッグしたら閉じる
    if (gestureState.dy > 50) {
      onClose();
    } else {
      // 元の位置に戻す
    }
  },
});
```

---

## 変更履歴

| 日付 | 更新内容 |
|------|---------|
| 2026-02-01 | 初版作成（UX-SOON P1） |

