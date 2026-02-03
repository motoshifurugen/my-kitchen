> **⚠️ このファイルはアーカイブされました**
>
> このファイルの内容は `docs/ux/phase-1/02-design-system.md` に統合されました。
> 最新の情報はそちらを参照してください。
>
> ---

# 10-05: 料理カード グレードアップ演出設計
_Card Grade Up Animation Design Specification_

**UX-SOON P1**

---

## 概要

このドキュメントは、料理カードのグレードアップ時の演出仕様を定義します。

World Bible の核心思想「料理は静かな自己回復の儀式である」に準拠し、「評価」「ランク」ではなく、手触りの変化＝育ちを感じさせる静かで短い演出を実現します。

**関連ドキュメント:**
- [04-motion-tokens.md](./04-motion-tokens.md) - モーショントークン定義
- [10-04-shelf-card-animation-design.md](./10-04-shelf-card-animation-design.md) - 棚図鑑 カード追加アニメーション設計
- [02-04-card-grade.md](./02-04-card-grade.md) - カードグレード定義
- [../world-bible/core-philosophy.md](../world-bible/core-philosophy.md) - 核心思想
- [../world-bible/philosophy-imperfection.md](../world-bible/philosophy-imperfection.md) - 不完全でよいという原則

---

## 0) 目的（World Bible準拠）

- **作った回数の蓄積を「数字」ではなく、紙の密度 / 質感の深まりとして見せる**
- **「評価」「ランク」ではなく、手触りの変化＝育ちを感じさせる**
- **演出は 静かで短い（気づいた人が嬉しい程度）**

---

## 1) トリガー条件（いつ起きるか）

- **グレードアップは、記録保存（S-04c 保存）によって 閾値を跨いだときのみ発生**
- **1回の保存で上がるのは 最大1段**（G0→G2 などの飛び級はしない）
- **※将来の集計更新で複数段上がる可能性がある場合でも、演出は1段分に丸める**（"派手さ"抑制）

---

## 2) 演出の表示タイミング（記録完了と同時/後）

### 基本方針：記録完了 "後" に、棚でそっと見せる

- **S-04c → S-08（セレブレーション）中は出さない**
  - セレブレーションは「記録できた」ことだけで十分
  - グレードアップをここで出すと "報酬" に見えてゲーム化する
- **S-02（棚図鑑）で初めて可視化する**
  - ユーザーが棚を見に行った時だけ、静かに気づける

### UX-032（棚追加演出）と整合

「棚が開く → 0.3秒静止 →（追加/更新演出）→（必要ならグレードアップ演出）」の順。

**デザイントークン参照:**
- 静止時間: 300ms（`10-04-shelf-card-animation-design.md` と同様）

---

## 3) 演出の表示場所（どこで見せるか）

- **対象カード：今回更新された料理カードのみ**
- **表示場所：S-02（カードグリッド）**
- **カードが画面内にある場合のみ演出**（強制スクロールしない）
- **補助（将来）：S-03 詳細モーダルを開いた時、既に上がっている状態として表示**（演出は繰り返さない）

---

## 4) グレードアップ演出シーケンス（秒数つき）

**"光る・鳴る・飛ぶ" をしない。**
**「紙が馴染む」「装丁が整う」だけ。**

### シーケンス（合計 0.8〜1.2秒）

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
- イージング: `motion.easing.easeOut` - バネ/弾みは禁止

---

## 5) カードの視覚変化仕様（厚み、質感等）

### 5-1. "厚み"の扱い（数字の代替）

- **一枚カードのまま運用**（図鑑格納の都合）
- **代わりに、カードの縁（エッジ）と紙面の密度で "厚み" を表す**
  - エッジがわずかに深くなる（陰影が少し増える）
  - 紙面の粒子感/繊維感が少し豊かになる
- **目立つ立体増量（極端な厚み）はNG**（"レアカード感"に直結する）

**デザイントークン参照:**
- エッジの陰影: `shadow.sm` よりさらに薄い、または専用のエッジシャドウ
- 紙面の密度: テクスチャの不透明度を微調整

### 5-2. "質感/装丁"の変化（グレードの主表現）

**グレードが上がるほど：**
- **色が少し深くなる**（濃くではなく、澄む/落ち着く）
- **模様が一段だけ繊細になる**（派手にはしない）
- **微細な箔のような艶が"1点だけ"増える**（全面キラキラ用禁止）

**模様カテゴリ（既定の5種）は維持し、グレードで密度を上げる：**

- **Soup/Liquid：ゆらぎ**（線の密度が少し増える）
- **Fry：粒感**（粒が少し細かくなる）
- **Grill/Bake：格子**（グリッドが少し滑らかに）
- **Noodle/Rice：流線**（線が少し長く途切れにくく）
- **Dessert/Salad：霧面**（粒のムラが少し均一に）

**デザイントークン参照:**
- 色の深まり: 彩度を少し上げる（ただし控えめに）
- 模様の密度: パターンの繰り返し頻度を上げる
- 箔の艶: 1点のみ、`rgba(255, 255, 255, 0.1)` 程度のハイライト

### 5-3. NG（ゲーム感の禁止事項）

- 星、レベル、数字、ゲージ、派手なスパーク
- "Level Up!" の文言、トロフィー、ファンファーレ
- 強い発光、色相が飛ぶ虹色、爆発演出

---

## 6) テキスト表示の方針（出すなら最小）

- **基本：テキストなし**（見た目の変化だけ）
- **どうしても補助が必要な場合のみ、カードの外で短く：**
  - 例：装丁が少し馴染みました / ページが落ち着きました
  - **「上がった」「達成」「昇格」などの語は避ける**（評価語に寄る）

---

## 7) 受け入れ条件チェック（Done条件）

以下の項目をすべて満たすこと:

- [ ] グレードアップ演出シーケンス（0.3s静止→ハイライト→装丁クロスフェード→馴染み）
- [ ] 視覚変化仕様（厚み=エッジ/密度、主変化=装丁・質感）
- [ ] タイミング（記録完了直後ではなく、棚で"後出し"）
- [ ] ゲーム感なし（星/数字/派手演出/報酬演出なし）

---

## 実装ガイドライン

### React Native 実装例（参考）

#### グレードアップ演出シーケンス

```tsx
import { Animated, Easing } from 'react-native';

// グレードアップ演出コンポーネント
const GradeUpAnimation = ({ children, delay = 300 }) => {
  const highlightOpacity = useRef(new Animated.Value(0)).current;
  const highlightTranslateX = useRef(new Animated.Value(-100)).current;
  const patternOpacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1.0)).current;

  useEffect(() => {
    // 0.3秒静止してから開始
    const timer = setTimeout(() => {
      // 1. 気配の合図：薄いハイライト帯が流れる（0.22秒）
      Animated.parallel([
        Animated.timing(highlightOpacity, {
          toValue: 1,
          duration: 220,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(highlightTranslateX, {
          toValue: 100, // 左→右
          duration: 220,
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

      // 2. 装丁の移行：クロスフェード（0.28秒）
      Animated.timing(patternOpacity, {
        toValue: 1,
        duration: 280,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();

      // 3. 落ち着き：ごく軽く馴染む（0.24秒）
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.01,
          duration: 120,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1.0,
          duration: 120,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      {children}
      {/* 薄いハイライト帯（左→右） */}
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 20,
          height: '100%',
          opacity: highlightOpacity,
          transform: [{ translateX: highlightTranslateX }],
          backgroundColor: 'rgba(255, 255, 255, 0.08)', // 紙の艶
        }}
      />
      {/* 装丁の移行（クロスフェード） */}
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: patternOpacity,
          // 新しい装丁パターンをここに表示
        }}
      />
    </Animated.View>
  );
};
```

#### カードの視覚変化（エッジと質感）

```tsx
// カードコンポーネント（グレードに応じた視覚変化）
const Card = ({ grade, patternCategory, children }) => {
  // グレードに応じたエッジの深さ
  const edgeShadow = getEdgeShadow(grade);
  // グレードに応じた紙面の密度
  const textureDensity = getTextureDensity(grade);
  // グレードに応じた色の深まり
  const colorDepth = getColorDepth(grade);
  // グレードに応じた模様の密度
  const patternDensity = getPatternDensity(grade, patternCategory);

  return (
    <View
      style={[
        styles.card,
        {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: edgeShadow.height },
          shadowOpacity: edgeShadow.opacity,
          shadowRadius: edgeShadow.radius,
          elevation: edgeShadow.elevation,
        },
      ]}
    >
      {/* 紙面の質感（テクスチャ） */}
      <View
        style={[
          styles.texture,
          {
            opacity: textureDensity,
            // テクスチャ画像またはパターン
          }]}
      />
      
      {/* 装丁パターン（カテゴリ別） */}
      <View
        style={[
          styles.pattern,
          {
            opacity: patternDensity,
            // カテゴリに応じたパターン
          }]}
      />
      
      {/* 微細な箔の艶（1点のみ） */}
      {grade >= 2 && (
        <View
          style={[
            styles.foil,
            {
              // 1点のみのハイライト
            }]}
        />
      )}
      
      {children}
    </View>
  );
};

// グレードに応じた値の取得関数
const getEdgeShadow = (grade) => {
  const shadows = {
    0: { height: 1, opacity: 0.05, radius: 2, elevation: 1 },
    1: { height: 1, opacity: 0.06, radius: 2, elevation: 1 },
    2: { height: 1, opacity: 0.07, radius: 3, elevation: 2 },
    3: { height: 2, opacity: 0.08, radius: 3, elevation: 2 },
    4: { height: 2, opacity: 0.09, radius: 4, elevation: 3 },
  };
  return shadows[grade] || shadows[0];
};

const getTextureDensity = (grade) => {
  // 0.3 〜 0.5 の範囲で微調整
  return 0.3 + (grade * 0.05);
};

const getColorDepth = (grade) => {
  // 色の深まり（彩度を少し上げる）
  // 実装時は、カラーパレットから選択
  return grade * 0.02; // 控えめに
};

const getPatternDensity = (grade, category) => {
  // カテゴリとグレードに応じた模様の密度
  // 実装時は、パターン画像の繰り返し頻度を調整
  return 0.4 + (grade * 0.1);
};
```

#### 棚画面での統合

```tsx
// 棚画面コンポーネント（グレードアップ演出の統合）
const ShelfScreen = () => {
  const [isReady, setIsReady] = useState(false);
  const [updatedCardId, setUpdatedCardId] = useState<string | null>(null);
  const [gradeUpCardId, setGradeUpCardId] = useState<string | null>(null);

  useEffect(() => {
    // 画面表示後、0.3秒静止
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View>
      {cards.map((card) => {
        const isUpdated = card.id === updatedCardId;
        const isGradeUp = card.id === gradeUpCardId;
        const isVisible = checkIfVisible(card.id);
        
        if (isGradeUp && isVisible && isReady) {
          // グレードアップ演出
          return (
            <GradeUpAnimation key={card.id} delay={300}>
              <Card grade={card.grade} patternCategory={card.category}>
                <CardContent data={card} />
              </Card>
            </GradeUpAnimation>
          );
        } else if (isUpdated && isVisible && isReady) {
          // 通常の更新演出（`10-04` の更新タイプ）
          return (
            <CardUpdateAnimation key={card.id}>
              <Card grade={card.grade} patternCategory={card.category}>
                <CardContent data={card} />
              </Card>
            </CardUpdateAnimation>
          );
        }
        
        return (
          <Card key={card.id} grade={card.grade} patternCategory={card.category}>
            <CardContent data={card} />
          </Card>
        );
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
気配の合図開始
  | [ハイライト帯: 左→右]
  | [0.22秒]
  |
  v
装丁の移行開始
  | [クロスフェード: 旧→新]
  | [0.28秒]
  |
  v
落ち着き開始
  | [Scale: 1.00→1.01→1.00]
  | [0.24秒]
  |
  v
完了
```

---

## 変更履歴

| 日付 | 更新内容 |
|------|---------|
| 2026-02-01 | 初版作成（UX-SOON P1） |

