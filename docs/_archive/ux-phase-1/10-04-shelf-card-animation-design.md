> **⚠️ このファイルはアーカイブされました**
>
> このファイルの内容は `docs/ux/phase-1/02-design-system.md` に統合されました。
> 最新の情報はそちらを参照してください。
>
> ---

# 10-04: 棚図鑑 カード追加アニメーション設計
_Shelf Archive Card Addition Animation Design Specification_

**UX-SOON P1**

---

## 概要

このドキュメントは、S-02 アーカイブ（棚図鑑）におけるカード追加・更新時のアニメーション仕様を定義します。

World Bible の核心思想「料理は静かな自己回復の儀式である」に準拠し、「追加した」ことを誇張せず、でも確かに気配として残す演出を実現します。

**関連ドキュメント:**
- [04-motion-tokens.md](./04-motion-tokens.md) - モーショントークン定義
- [10-ui-components.md](./10-ui-components.md) - UIコンポーネントシステム
- [01-screen-flows.md](./01-screen-flows.md) - 画面フロー定義
- [../world-bible/core-philosophy.md](../world-bible/core-philosophy.md) - 核心思想
- [../world-bible/experience-principles.md](../world-bible/experience-principles.md) - 体験原則（インタラクションリズム含む）

---

## 0) 目的（World Bible準拠）

- **「追加した」ことを誇張せず、でも確かに気配として残す**
- **「棚にスケッチが増えていく」＝静かなコレクションの増殖**
- **記録完了 → 0.3秒静止 → 演出表示**（"一瞬止まってから配置"が核）

---

## 1) 適用タイミングと対象画面

### 対象画面
- **S-02 アーカイブ（棚図鑑）**のカードグリッド

### トリガー
S-04c 保存 → S-08（セレブレーション）→ S-01 に戻るの後、ユーザーが：

1. **そのまま棚（S-02）へ遷移した時**
2. **保存直後に「棚へ」導線がある場合（将来）**

に "直近追加/更新" を1回だけ演出する。

**※「保存したから見て！」と押し付けない。ユーザーが棚を開いた瞬間に、そっと起きる。**

---

## 2) "間（ま）"の取り方（静止時間）

### 静止（Pause）：0.30秒 固定

- **棚画面が表示されてから 0.30秒は何も動かさない**
- **その後、カードの追加/更新演出を開始**

**World Bible:**「一瞬止まってから配置」を守るため、動きより先に"落ち着き"を入れる。

**デザイントークン参照:**
- 静止時間: 300ms（固定）
- アニメーション開始: 画面表示後 300ms 経過後

---

## 3) 追加位置の決定ロジック（どこに置かれるか）

### 3-1. デフォルトの並び（棚の基本）

- **基本：あいうえお順**（図鑑内のカード一覧は固定順で落ち着かせる）

### 3-2. "今回の追加/更新"の位置

追加・更新で挙動を分ける：

#### A) 新規カード（その料理を初めて作った）

- **あいうえお順の正しい位置に挿入**
- **ただし、演出上は「一瞬だけ目に入る」ことが重要なので：**
  - **挿入位置が画面外の場合は、最初はスクロールしない**（強制しない）
  - **代わりに、画面内に出ている場合のみ演出を見せる**
  - **画面外の場合は「本棚ログ（後述）」側で気配を担保する**

#### B) 既存カード更新（同じ料理をまた作った）

- **カードの並び順は変えない**（"評価/ランキング"に寄らない）
- **そのカードに対して "育ち"の演出だけを行う**（グレード変化や紙質の変化）

---

## 4) カード追加アニメーション仕様（どう見せるか）

### 4-1. 基本タイプ（新規カード挿入）

**フェードイン + ごく短いスライド**（上からではなく、棚に"置かれる"方向）

**推奨表現:**
- **Opacity:** 0 → 1（180ms）
- **TranslateY:** +6px → 0（180ms）（下から"すっ"）
- **Scale:** 0.985 → 1.0（180ms）（紙が落ち着く感じ）
- **イージング:** 穏やかな ease-out（バネ/弾みは禁止）

**デザイントークン参照:**
- アニメーション時間: `motion.duration.fast` (150ms) または 180ms
- イージング: `motion.easing.easeOut` - バネ/弾みは禁止

### 4-2. 更新タイプ（既存カードの"育ち"）

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

---

## 5) 既存カードの再配置挙動（他のカードはどう動くか）

### 原則
- **既存カードは"押しのけられる"程度に最小限**

### 新規挿入で同一ページ内の並びが変わる場合

- **全カードを大きく動かさない**
- **代わりに、該当行以降だけが 120ms で詰まる**（軽いレイアウトアニメ）
- **大きな再配置（全面リフロー）は避ける**

**→ 「棚がガタつく」印象になり、世界観が壊れる**

**デザイントークン参照:**
- 再配置アニメーション: 120ms（軽いレイアウトアニメ）

---

## 6) "見逃し"の救済（押し付けない導線）

### 新規カードが画面外で演出できなかった場合の救済

- **本棚ログ（時系列）に1行追加**（例：「今日のページが増えました」）
- **アニバーサリー枠にも将来流用可能**

**※ 演出を"強制的に見せるスクロール"で解決しない。**

---

## 7) 受け入れ条件チェック（Done条件）

以下の項目をすべて満たすこと:

- [ ] カード追加アニメーション：新規=フェード+微スライド、更新=育ち（質感/ハイライト）
- [ ] 追加位置ロジック：新規=あいうえお順の正しい位置、更新=位置固定
- [ ] 間（ま）：棚表示後 0.30秒静止してから開始
- [ ] 再配置挙動：最小限（必要な範囲だけ 120ms の軽い詰まり）

---

## 実装ガイドライン

### React Native 実装例（参考）

#### 新規カード追加アニメーション

```tsx
import { Animated } from 'react-native';

// カード追加アニメーション
const CardAdditionAnimation = ({ children, delay = 300 }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(6)).current;
  const scale = useRef(new Animated.Value(0.985)).current;

  useEffect(() => {
    // 0.3秒静止してから開始
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 180,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 180,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1.0,
          duration: 180,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <Animated.View
      style={{
        opacity,
        transform: [
          { translateY },
          { scale },
        ],
      }}
    >
      {children}
    </Animated.View>
  );
};
```

#### 既存カード更新アニメーション（"育ち"）

```tsx
// カード更新アニメーション（育ち）
const CardUpdateAnimation = ({ children }) => {
  const textureOpacity = useRef(new Animated.Value(0)).current;
  const highlightOpacity = useRef(new Animated.Value(0)).current;
  const highlightTranslateX = useRef(new Animated.Value(-100)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      // 質感がふっと乗る
      Animated.timing(textureOpacity, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();

      // ハイライトの流れ（左→右）
      Animated.parallel([
        Animated.timing(highlightOpacity, {
          toValue: 1,
          duration: 240,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(highlightTranslateX, {
          toValue: 100,
          duration: 240,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start(() => {
        // ハイライトを消す
        Animated.timing(highlightOpacity, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }).start();
      });

      // 微細な呼吸
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.01,
          duration: 130,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1.0,
          duration: 130,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      {children}
      {/* 質感オーバーレイ */}
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: textureOpacity,
          backgroundColor: 'rgba(0, 0, 0, 0.02)', // 微細な質感
        }}
      />
      {/* ハイライト帯 */}
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 20,
          height: '100%',
          opacity: highlightOpacity,
          transform: [{ translateX: highlightTranslateX }],
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
        }}
      />
    </Animated.View>
  );
};
```

#### 再配置アニメーション（軽い詰まり）

```tsx
// 既存カードの再配置（軽い詰まり）
const CardRepositionAnimation = ({ children, targetY }) => {
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: targetY,
      duration: 120,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [targetY]);

  return (
    <Animated.View style={{ transform: [{ translateY }] }}>
      {children}
    </Animated.View>
  );
};
```

#### 画面表示時の静止時間管理

```tsx
// 棚画面コンポーネント
const ShelfScreen = () => {
  const [isReady, setIsReady] = useState(false);
  const [newCardId, setNewCardId] = useState<string | null>(null);

  useEffect(() => {
    // 画面表示後、0.3秒静止
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // 新規カードの位置を計算
  const getCardPosition = (cardId: string) => {
    if (cardId === newCardId) {
      // あいうえお順の正しい位置を計算
      // 画面内かどうかをチェック
      const isVisible = checkIfVisible(cardId);
      return { isNew: true, isVisible };
    }
    return { isNew: false, isVisible: true };
  };

  return (
    <View>
      {cards.map((card) => {
        const { isNew, isVisible } = getCardPosition(card.id);
        
        if (isNew && isVisible && isReady) {
          return (
            <CardAdditionAnimation key={card.id}>
              <Card data={card} />
            </CardAdditionAnimation>
          );
        } else if (isNew && !isVisible) {
          // 画面外の場合は、本棚ログに通知を追加
          // （演出は行わない）
          return <Card key={card.id} data={card} />;
        } else if (card.isUpdated && isReady) {
          return (
            <CardUpdateAnimation key={card.id}>
              <Card data={card} />
            </CardUpdateAnimation>
          );
        }
        
        return <Card key={card.id} data={card} />;
      })}
    </View>
  );
};
```

### アニメーションタイミング図

```
画面表示
  |
  | [0.3秒静止]
  |
  v
アニメーション開始
  |
  | [新規カード]
  | - Opacity: 0 → 1 (180ms)
  | - TranslateY: +6px → 0 (180ms)
  | - Scale: 0.985 → 1.0 (180ms)
  |
  | [更新カード]
  | - 質感: Opacity 0 → 1 (220ms)
  | - ハイライト: 左→右 (240ms)
  | - 呼吸: Scale 1 → 1.01 → 1 (260ms)
  |
  v
完了
```

---

## 変更履歴

| 日付 | 更新内容 |
|------|---------|
| 2026-02-01 | 初版作成（UX-SOON P1） |

