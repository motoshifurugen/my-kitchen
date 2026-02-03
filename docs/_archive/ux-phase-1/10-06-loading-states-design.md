> **⚠️ このファイルはアーカイブされました**
>
> このファイルの内容は `docs/ux/phase-1/02-design-system.md` に統合されました。
> 最新の情報はそちらを参照してください。
>
> ---

# 10-06: ローディング / 待機状態の表現設計
_Loading & Waiting States Design Specification_

**UX-SOON P1**

---

## 概要

このドキュメントは、アプリ内のローディング・待機状態の表現仕様を定義します。

World Bible の核心思想「料理は静かな自己回復の儀式である」に準拠し、待たせない設計を前提としつつ、発生した場合も最小・静か・短い表現に留めます。

**関連ドキュメント:**
- [04-motion-tokens.md](./04-motion-tokens.md) - モーショントークン定義
- [10-ui-components.md](./10-ui-components.md) - UIコンポーネントシステム
- [01-screen-flows.md](./01-screen-flows.md) - 画面フロー定義
- [../world-bible/core-philosophy.md](../world-bible/core-philosophy.md) - 核心思想
- [../world-bible/philosophy-speed.md](../world-bible/philosophy-speed.md) - 速さの哲学

---

## 0) 目的（World Bible準拠）

- **待たせない：原則としてローディングを発生させない設計**（ローカルファースト前提）
- **発生した場合も 最小・静か・短い 表現に留める**
- **「チカチカ」「せわしない」動きは禁止**（視線が疲れない）

---

## 1) ローディングインジケーター方針（共通）

### 基本ルール

- **200ms未満で終わる処理：何も出さない**
- **200ms〜900ms：ミニインジケーター**（控えめ）
- **900ms以上：スケルトン or 画面内プレースホルダー**
- **3秒を超える可能性がある場合：説明文を1行だけ追加**（謝罪しない、急かさない）

### 見た目（デザイン）

- **形：小さな点の呼吸（3 dots） または 細いリング（極細）**
- **動き：ゆっくり（呼吸）**
- **点：出現→消失ではなく、不透明度の揺れ**（点滅禁止）
- **リング：高速回転禁止。回すなら低速、または「満ち引き」表現**
- **色：UIの主張を避けるため、テキストより薄い中間色**（テーマ色に寄せすぎない）
- **位置：原則 コンテンツ内**（画面中央固定で遮らない）。必要な時のみ中央。

**デザイントークン参照:**
- 色: `color.text.tertiary` (#9C9590) またはそれより薄い
- アニメーション: `motion.duration.slow` (600ms以上) でゆっくり
- イージング: `motion.easing.easeInOut` - 呼吸のような動き

---

## 2) スケルトンスクリーン仕様

### 対象画面

- **S-02 アーカイブ（カードグリッド）**
- **S-05 探索（カードグリッド）**
- **S-03 詳細モーダル（写真＋テキスト）**
- **※S-01 キッチン世界は「ロード画面」にしない**（世界観が壊れるため）

### 表示ルール

- **スケルトンは "形だけ"：写真枠（4:3）、料理名1行、グレード領域の3要素**
- **アニメーション：シマー（光が走る）禁止**
- **代わりに ゆっくりとした濃淡の呼吸**（不透明度がわずかに揺れる）
- **枚数：S-02 / S-05 は 画面内に見える分だけ**（例：3列×3行程度）
- **無限に並べない**（圧を出さない）

### S-02 / S-05 のスケルトン形状（料理カード準拠）

- **写真エリア：4:3**
- **料理名：角丸の細長いバー（1本）**
- **グレード表現：小さな短いバー（1本）**※丸ドットでもOK（点滅禁止）

**デザイントークン参照:**
- 背景: `color.background.secondary` (#F5F3EF)
- 角丸: `radius.md` (8pt)
- アニメーション: 不透明度 0.3 → 0.6 → 0.3（800ms周期）

---

## 3) プログレス表示の仕様（原則：使わない）

### 方針

- **数値％・進捗バーは 原則NG**（焦り・評価感が出る）
- **例外：ユーザーが明確に「処理を待っている」と理解している長処理のみ**
- **例：将来のデータエクスポート、初回の大量移行など**（UX-LATER領域）

### 例外時の表現（将来用）

- **％は出さず、ステップ名だけ**（短い名詞）
- **例：「まとめています…」「整えています…」**
- **バーを出すなら、細いラインがゆっくり満ちる**（短時間で戻らない）

**デザイントークン参照:**
- バーの高さ: 2pt（極細）
- 色: `color.text.tertiary` (#9C9590)
- アニメーション: `motion.duration.slow` (600ms以上) でゆっくり

---

## 4) 画面別：待機状態の具体（MVP想定）

### S-01 トップ（キッチン世界）

- **原則ローディング表示なし**
- **アセットが未ロードの場合：**
  - **世界は表示する**（最小構成）
  - **必要なら右下などに 小さな3dots を出す**（操作を邪魔しない）

### S-02 アーカイブ（棚図鑑）

- **初回表示：スケルトングリッド**（最大 900ms〜）
- **追加読み込み：リスト末尾に 小さな3dots**（中央ではなく最下部）

### S-03 詳細モーダル

- **写真取得待ち：写真枠のみスケルトン、テキストは先に出してOK**
- **閉じる操作は常に可能**（待ちで閉じられないのはNG）

### S-04 記録フロー（写真/入力/保存）

- **写真選択：サムネ生成など短い待ちは インライン3dots**
- **保存：**
  - **200ms未満 → 何も出さず S-08 へ**
  - **200ms超 → ボタン内に「…」ではなく 小さな点の呼吸**（文言は変えない）

---

## 5) NGチェック（受け入れ条件の「チカチカ」対策）

以下の項目をすべて避けること:

- [ ] 点滅（on/offが明確な点灯）をしない
- [ ] 高速回転をしない
- [ ] シマー（光が走る）をしない
- [ ] 画面中央の遮断ローディングを乱用しない
- [ ] 謝罪や焦らせる文言（「お待ちください」「少々」）を多用しない

---

## 6) 受け入れ条件チェック（Done条件）

以下の項目をすべて満たすこと:

- [ ] ローディングインジケーター：3dots or 細リング、呼吸、200msルール
- [ ] スケルトン：対象画面、形状、シマー禁止、枚数上限
- [ ] プログレス：原則使わない／例外のみ将来方針
- [ ] チカチカ・せわしない禁止が明文化されている

---

## 実装ガイドライン

### React Native 実装例（参考）

#### 3 Dots ローディングインジケーター

```tsx
import { Animated, Easing } from 'react-native';

// 3 Dots ローディング（呼吸）
const LoadingDots = ({ size = 4, color = colors.text.tertiary }) => {
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const createAnimation = (dot, delay) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: 0.6,
            duration: 400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0.3,
            duration: 400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
    };

    const anim1 = createAnimation(dot1, 0);
    const anim2 = createAnimation(dot2, 150);
    const anim3 = createAnimation(dot3, 300);

    anim1.start();
    anim2.start();
    anim3.start();

    return () => {
      anim1.stop();
      anim2.stop();
      anim3.stop();
    };
  }, []);

  return (
    <View style={{ flexDirection: 'row', gap: spacing.xs }}>
      <Animated.View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          opacity: dot1,
        }}
      />
      <Animated.View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          opacity: dot2,
        }}
      />
      <Animated.View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          opacity: dot3,
        }}
      />
    </View>
  );
};
```

#### 細いリング ローディングインジケーター

```tsx
// 細いリング（満ち引き表現）
const LoadingRing = ({ size = 20, strokeWidth = 1.5, color = colors.text.tertiary }) => {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(progress, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(progress, {
          toValue: 0,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const circumference = 2 * Math.PI * (size / 2 - strokeWidth);
  const strokeDashoffset = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  return (
    <Svg width={size} height={size}>
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={size / 2 - strokeWidth}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
      />
    </Svg>
  );
};
```

#### スケルトンカード

```tsx
// スケルトンカード（料理カード準拠）
const SkeletonCard = () => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.6,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.skeletonCard,
        { opacity },
      ]}
    >
      {/* 写真エリア（4:3） */}
      <View style={styles.skeletonPhoto} />
      
      {/* 料理名 */}
      <View style={styles.skeletonTitle} />
      
      {/* グレード表現 */}
      <View style={styles.skeletonGrade} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  skeletonCard: {
    backgroundColor: colors.background.secondary, // #F5F3EF
    borderRadius: radius.md, // 8pt
    padding: spacing.sm, // 8pt
  },
  skeletonPhoto: {
    aspectRatio: 4 / 3,
    backgroundColor: colors.background.tertiary, // #FFFFFF
    borderRadius: radius.sm, // 4pt
    marginBottom: spacing.sm, // 8pt
  },
  skeletonTitle: {
    height: 16,
    backgroundColor: colors.background.tertiary, // #FFFFFF
    borderRadius: radius.sm, // 4pt
    marginBottom: spacing.xs, // 4pt
    width: '70%',
  },
  skeletonGrade: {
    height: 8,
    backgroundColor: colors.background.tertiary, // #FFFFFF
    borderRadius: radius.sm, // 4pt
    width: '40%',
  },
});
```

#### ローディング状態管理フック

```tsx
// ローディング状態管理フック
const useLoadingState = (loadingTime: number) => {
  const [showLoading, setShowLoading] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false);

  useEffect(() => {
    if (loadingTime < 200) {
      // 200ms未満：何も出さない
      setShowLoading(false);
      setShowSkeleton(false);
    } else if (loadingTime < 900) {
      // 200ms〜900ms：ミニインジケーター
      setShowLoading(true);
      setShowSkeleton(false);
    } else {
      // 900ms以上：スケルトン
      setShowLoading(false);
      setShowSkeleton(true);
    }
  }, [loadingTime]);

  return { showLoading, showSkeleton };
};

// 使用例
const ShelfScreen = () => {
  const { data, isLoading, loadingTime } = useShelfData();
  const { showLoading, showSkeleton } = useLoadingState(loadingTime);

  if (showSkeleton) {
    return (
      <View style={styles.grid}>
        {Array.from({ length: 9 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </View>
    );
  }

  return (
    <View style={styles.grid}>
      {data.map((card) => (
        <Card key={card.id} data={card} />
      ))}
      {showLoading && (
        <View style={styles.loadingFooter}>
          <LoadingDots />
        </View>
      )}
    </View>
  );
};
```

#### ボタン内ローディング

```tsx
// ボタン内ローディング（保存時など）
const ButtonWithLoading = ({ label, onPress, isLoading }) => {
  return (
    <PressableBase
      style={styles.button}
      onPress={onPress}
      disabled={isLoading}
    >
      <Text style={styles.buttonText}>{label}</Text>
      {isLoading && (
        <View style={styles.buttonLoading}>
          <LoadingDots size={3} color={colors.text.inverse} />
        </View>
      )}
    </PressableBase>
  );
};
```

---

## 変更履歴

| 日付 | 更新内容 |
|------|---------|
| 2026-02-01 | 初版作成（UX-SOON P1） |

