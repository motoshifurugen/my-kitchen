# 04: モーショントークン
_Motion Tokens Specification_

---

## 概要

アニメーションのデュレーション、イージング、遷移パターンを定義する。
具体的な値は `04-motion-tokens.json` に格納。

**対象プラットフォーム:** iOS / Android（React Native）

**関連イシュー:** UX-027, UX-028, UX-029, UX-032

**準拠ドキュメント:** 01-screen-flows.md（遷移仕様の正）

---

## 単位ポリシー（Units Policy）

本ドキュメントにおける単位の扱い:
- **時間**: `ms`（ミリ秒）はすべてのプラットフォームで共通
- **距離**: `pt` は iOS ポイント基準。Android では `dp` として読み替え
- **React Native**: 数値をそのまま使用（density-independent）

---

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

## 更新履歴

| 日付 | 更新内容 |
|------|---------|
| 2026-02-01 | 初版作成 |
| 2026-02-01 | 単位ポリシー追加、距離/スケールトークン追加、遷移優先ルール追加、overlay duration 300ms統一、Reduced Motion明確化、タップフィードバック適用ルール追加 |
| 2026-02-01 | JSON完全同期: duration.slow→300ms、distance/scale全トークン追加、reducedMotion構造化、celebration sequence更新、RN実装ノート追加 |
