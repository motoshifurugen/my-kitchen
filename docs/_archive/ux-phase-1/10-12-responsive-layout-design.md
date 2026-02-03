> **⚠️ このファイルはアーカイブされました**
>
> このファイルの内容は `docs/ux/phase-1/07-accessibility.md` に統合されました。
> 最新の情報はそちらを参照してください。
>
> ---

# 10-12: 画面サイズ別レイアウト調整
_Responsive Layout Design Specification_

**UX-SOON P1**

---

## 概要

このドキュメントは、iPhone SE〜iPad、小型Android〜タブレットまで、世界観と迷いの少なさを維持しつつ破綻しないレイアウトルールを定義します。

MVPでは「機能追加」ではなく、余白・列数・表示密度の調整で吸収します。

**関連ドキュメント:**
- [03-design-tokens.md](./03-design-tokens.md) - デザイントークン定義
- [01-screen-flows.md](./01-screen-flows.md) - 画面フロー定義
- [10-ui-components.md](./10-ui-components.md) - UIコンポーネントシステム
- [../world-bible/visual-foundation.md](../world-bible/visual-foundation.md) - 視覚言語の基礎

---

## 0) 目的

iPhone SE〜iPad、小型Android〜タブレットまで、世界観と迷いの少なさを維持しつつ破綻しないレイアウトルールを定義する。
MVPでは「機能追加」ではなく、余白・列数・表示密度の調整で吸収する。

---

## 1) 対応範囲（ターゲットデバイス）

- **最小想定：iPhone SE 相当（幅 320pt クラス）**
- **一般スマホ：幅 360–430dp クラス（Android含む）**
- **最大想定：iPad/タブレット（短辺 768pt 以上）**

**※ OS差による"dp/pt"は吸収し、実装では `useWindowDimensions().width` を基準にする。**

---

## 2) 画面クラス（Breakpoints）

幅 W によって画面クラスを切り替える。

- **Compact：** W < 360
- **Regular：** 360 ≤ W < 430
- **Large Phone：** 430 ≤ W < 768
- **Tablet：** W ≥ 768

### 共通ルール

- **contentMaxWidth = 560**（Tabletでは中央寄せし、左右余白を増やして"落ち着き"を作る）
- **pagePaddingX：**
  - **Compact:** 16
  - **Regular:** 20
  - **Large Phone:** 24
  - **Tablet:** 32（＋中央寄せ）

**デザイントークン参照:**
- Compact: `spacing.md` (16pt)
- Regular: `spacing.screen.horizontal` (20pt)
- Large Phone: `spacing.lg` (24pt)
- Tablet: `spacing.xl` (32pt)

---

## 3) 方向（Portrait / Landscape）

### 基本は縦（Portrait）前提で最適化

### 横（Landscape）時のMVP対応

- **コンテンツは contentMaxWidth で中央寄せ、左右に余白**
- **2.5D世界（S-01）は拡大で埋めず、中央表示＋余白で破綻を防ぐ**
- **操作UI（フッター、ボタン）はサイズを変えず、余白で調整**

---

## 4) 画面別レイアウト調整ルール

### S-01 トップ（キッチン世界）

- **世界表示領域：常に「画面の残り全部」を使う**（ヘッダー＋フッターを除いた領域）
- **Tablet：**
  - **世界は 中央寄せ（contentMaxWidth 内）**
  - **背景（余白部分）は単色/淡いトーンで"静かな額縁"扱い**
- **Compact：**
  - **世界の上下クリップを避ける**（resizeMode/contain 寄りで、重要部分が切れないこと優先）
- **フッター：**
  - **タップ領域は常に 44pt 以上**
  - **ラベルは省略しない**（迷いを増やすため）

### S-02 アーカイブ（棚図鑑） / S-05 探索（同型グリッド）

#### カードグリッド列数

- **Compact：** 2列
- **Regular：** 3列
- **Large Phone：** 3列（余白増）
- **Tablet：** 4列（ただし密度を上げすぎない）

#### カードサイズ

- **カード幅は「列数に応じて均等割り」**
- **高さは width * 1.2 を基本**（一覧）
- **Tabletで4列にしてもカードが小さくなりすぎる場合：**
  - **3列に戻す**（"読みやすさ優先"）

#### タブ（時系列/カテゴリ）

- **Compactでは横幅不足になりやすいので：**
  - **タブは1行固定、ラベル短縮は禁止**（意味が変わるため）
  - **必要なら左右パディングを縮めて対応**

### S-03 詳細モーダル

- **幅：**
  - **Compact〜Large Phone：** W - 40
  - **Tablet：** min(560, W - 80)（中央寄せ）
- **閉じる操作：**
  - **×ボタンは常に右上固定、44ptヒット領域**
- **スクロール：**
  - **内容が収まらない場合のみ縦スクロール**（基本は"短い"体験）

### S-04 記録フロー（a/b/c）

- **ボタン配置：常に下部固定**（押しやすさ優先）
- **入力：**
  - **Compactではフォームの上下余白を減らす**（詰め込みではなく"無駄を削る"）
- **Tablet：**
  - **1カラム維持**（2カラムは情報密度が上がり"儀式感"が壊れるためMVPでは不採用）
  - **中央寄せ＋左右余白で落ち着かせる**

---

## 5) 最小/最大サイズのワイヤー

- **最小：iPhone SE（320pt幅）相当で破綻しないこと**
- **最大：iPad（768pt以上）相当で"間延び"しないこと**（中央寄せ＋余白）

**※ ワイヤーはMVPでは画像化せず、上記ルールを満たすスクリーンショット（最小/最大）を成果物として保存して代替する。**
**（例：`docs/ux/phase-1/figma/exports/` ではなく `docs/ux/phase-1/responsive/` に `s01_min.png`, `s01_max.png` 等）**

---

## 6) 受け入れ条件チェック（Done条件）

以下の項目をすべて満たすこと:

- [ ] 対応範囲（ターゲットデバイス）が定義されている
- [ ] 画面クラス（Breakpoints）が定義されている
- [ ] 方向（Portrait / Landscape）の対応方針が定義されている
- [ ] 画面別レイアウト調整ルール（S-01, S-02/S-05, S-03, S-04）が定義されている
- [ ] 最小/最大サイズのワイヤー方針が明記されている

---

## 実装ガイドライン

### React Native 実装例（参考）

#### 画面クラス判定

```tsx
import { useWindowDimensions } from 'react-native';

// 画面クラス定義
type ScreenClass = 'compact' | 'regular' | 'largePhone' | 'tablet';

// 画面クラス判定
const getScreenClass = (width: number): ScreenClass => {
  if (width < 360) {
    return 'compact';
  } else if (width < 430) {
    return 'regular';
  } else if (width < 768) {
    return 'largePhone';
  } else {
    return 'tablet';
  }
};

// 画面クラス取得フック
const useScreenClass = (): ScreenClass => {
  const { width } = useWindowDimensions();
  return getScreenClass(width);
};
```

#### レスポンシブトークン定義

```tsx
// レスポンシブトークン
interface ResponsiveTokens {
  pagePaddingX: number;
  contentMaxWidth: number;
  cardColumns: number;
  modalWidth: number;
}

const RESPONSIVE_TOKENS: Record<ScreenClass, ResponsiveTokens> = {
  compact: {
    pagePaddingX: 16,
    contentMaxWidth: 560,
    cardColumns: 2,
    modalWidth: 0, // W - 40 として計算
  },
  regular: {
    pagePaddingX: 20,
    contentMaxWidth: 560,
    cardColumns: 3,
    modalWidth: 0, // W - 40 として計算
  },
  largePhone: {
    pagePaddingX: 24,
    contentMaxWidth: 560,
    cardColumns: 3,
    modalWidth: 0, // W - 40 として計算
  },
  tablet: {
    pagePaddingX: 32,
    contentMaxWidth: 560,
    cardColumns: 4,
    modalWidth: 560, // min(560, W - 80)
  },
};

// レスポンシブトークン取得フック
const useResponsiveTokens = (): ResponsiveTokens => {
  const screenClass = useScreenClass();
  const { width } = useWindowDimensions();
  
  const tokens = RESPONSIVE_TOKENS[screenClass];
  
  // modalWidth の動的計算
  if (screenClass === 'tablet') {
    tokens.modalWidth = Math.min(560, width - 80);
  } else {
    tokens.modalWidth = width - 40;
  }
  
  return tokens;
};
```

#### S-01 トップ（キッチン世界）

```tsx
// 世界画面コンポーネント
const WorldScreen = () => {
  const { width, height } = useWindowDimensions();
  const screenClass = useScreenClass();
  const tokens = useResponsiveTokens();

  return (
    <View style={styles.container}>
      {/* ヘッダー */}
      <HeaderBar />
      
      {/* 世界表示領域 */}
      <View
        style={[
          styles.worldContainer,
          screenClass === 'tablet' && styles.worldContainerTablet,
        ]}
      >
        <WorldScene
          style={[
            styles.worldScene,
            screenClass === 'tablet' && {
              maxWidth: tokens.contentMaxWidth,
              alignSelf: 'center',
            },
            screenClass === 'compact' && {
              resizeMode: 'contain', // クリップを避ける
            },
          ]}
        />
      </View>
      
      {/* フッター */}
      <FooterBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  worldContainer: {
    flex: 1,
  },
  worldContainerTablet: {
    backgroundColor: colors.background.secondary, // 静かな額縁
  },
  worldScene: {
    width: '100%',
    height: '100%',
  },
});
```

#### S-02 アーカイブ（棚図鑑） / S-05 探索

```tsx
// カードグリッドコンポーネント
const CardGrid = ({ cards }) => {
  const { width } = useWindowDimensions();
  const tokens = useResponsiveTokens();
  const screenClass = useScreenClass();

  // カード幅計算
  const cardWidth = (width - tokens.pagePaddingX * 2 - 
    (tokens.cardColumns - 1) * spacing.sm) / tokens.cardColumns;
  const cardHeight = cardWidth * 1.2;

  // Tabletで4列が小さすぎる場合は3列に
  const actualColumns = screenClass === 'tablet' && cardWidth < 120
    ? 3
    : tokens.cardColumns;

  return (
    <View style={[styles.grid, { paddingHorizontal: tokens.pagePaddingX }]}>
      {cards.map((card, index) => (
        <View
          key={card.id}
          style={[
            styles.card,
            {
              width: (width - tokens.pagePaddingX * 2 - 
                (actualColumns - 1) * spacing.sm) / actualColumns,
              height: cardHeight,
            },
          ]}
        >
          <Card data={card} />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm, // 8pt
  },
  card: {
    marginBottom: spacing.sm,
  },
});
```

#### S-03 詳細モーダル

```tsx
// モーダルコンポーネント
const DetailModal = ({ visible, onClose, children }) => {
  const { width } = useWindowDimensions();
  const tokens = useResponsiveTokens();

  return (
    <Modal visible={visible} transparent>
      <PressableBase style={styles.overlay} onPress={onClose}>
        <PressableBase
          style={[
            styles.modalContent,
            {
              width: tokens.modalWidth,
              maxWidth: tokens.contentMaxWidth,
            },
          ]}
          onPress={(e) => e.stopPropagation()}
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
          <ScrollView
            style={styles.modalBody}
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        </PressableBase>
      </PressableBase>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.surface.elevated,
    borderRadius: radius.xl,
    padding: spacing.md,
    maxHeight: '85%',
  },
  closeButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  modalBody: {
    marginTop: spacing.md,
  },
});
```

#### S-04 記録フロー

```tsx
// 記録フロー画面
const RecordFlowScreen = () => {
  const tokens = useResponsiveTokens();
  const screenClass = useScreenClass();

  return (
    <View style={styles.container}>
      {/* コンテンツ */}
      <ScrollView
        style={[
          styles.content,
          {
            paddingHorizontal: tokens.pagePaddingX,
            paddingTop: screenClass === 'compact' ? spacing.sm : spacing.md,
            paddingBottom: screenClass === 'compact' ? spacing.sm : spacing.md,
          },
        ]}
      >
        {/* フォーム要素 */}
        <FormElements />
      </ScrollView>
      
      {/* ボタン（下部固定） */}
      <View
        style={[
          styles.buttonContainer,
          {
            paddingHorizontal: tokens.pagePaddingX,
            paddingBottom: spacing.md,
          },
        ]}
      >
        <Button label="保存" variant="primary" onPress={handleSave} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  buttonContainer: {
    paddingTop: spacing.md,
    backgroundColor: colors.background.primary,
  },
});
```

#### 方向（Landscape）対応

```tsx
import { useWindowDimensions } from 'react-native';

// 方向判定
const useOrientation = (): 'portrait' | 'landscape' => {
  const { width, height } = useWindowDimensions();
  return width > height ? 'landscape' : 'portrait';
};

// Landscape時の調整
const useLandscapeAdjustments = () => {
  const orientation = useOrientation();
  const tokens = useResponsiveTokens();
  
  if (orientation === 'landscape') {
    return {
      contentMaxWidth: tokens.contentMaxWidth,
      centerContent: true,
      // 2.5D世界は拡大せず、中央表示＋余白
    };
  }
  
  return {
    contentMaxWidth: '100%',
    centerContent: false,
  };
};
```

---

## 変更履歴

| 日付 | 更新内容 |
|------|---------|
| 2026-02-01 | 初版作成（UX-SOON P1） |

