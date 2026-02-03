> **⚠️ このファイルはアーカイブされました**
>
> このファイルの内容は `docs/ux/phase-1/04-lighting.md` に統合されました。
> 最新の情報はそちらを参照してください。
>
> ---

# 10-08: 時間帯グラデーション補完ルール
_Time Gradient Interpolation Rules Specification_

**UX-SOON P1**

---

## 概要

このドキュメントは、2.5Dキッチン世界（S-01）における時間帯レンダー切替と補間ルールを定義します。

World Bible の核心思想「料理は静かな自己回復の儀式である」に準拠し、段階切替を禁止し、常に滑らかなグラデーション補間で時間帯を移行します。

**関連ドキュメント:**
- [05-2_5d-asset-spec.md](./05-2_5d-asset-spec.md) - 2.5Dアセット仕様
- [06-lighting-spec.md](./06-lighting-spec.md) - ライティング仕様
- [10-07-performance-budget-design.md](./10-07-performance-budget-design.md) - 2.5D世界 メモリ使用量・パフォーマンス目標
- [../world-bible/lighting-time-rules.md](../world-bible/lighting-time-rules.md) - 時間帯ライティング変化ルール
- [../world-bible/core-philosophy.md](../world-bible/core-philosophy.md) - 核心思想

---

## 方針

- **時間帯の見た目は「Time Overlay（差分）」ではなく、各時間帯ごとの"部屋の完全レンダー画像"で表現する。**
- **表示は base に重ねる運用ではなく、時間帯レンダーによる完全置き換えとする**（=「その時間帯の部屋」そのものを表示）。

---

## 1) 使用する時間帯キー

現実のローカル時刻（端末時刻）に同期して、以下のキーで時間帯を定義する。

- **early_morning**（例：05:00）
- **morning**（例：08:00）
- **day**（例：12:00）
- **evening**（例：17:30）
- **night**（例：21:00）
- **late_night**（例：01:00 ※翌日扱い）

**※キー時刻は「例」。最終的な時刻はUX/プロダクト判断で調整可能。**

---

## 2) 表示モデル（段階切替禁止 / グラデーション補間）

### World Bible準拠として、段階切替は禁止。

- **常に 隣接する2つの時間帯レンダーを重ねてクロスフェードし、滑らかに移行する。**

### 基本ルール

- **ある時刻が区間 [t0, t1) に属する場合、表示は常に以下の2レイヤーで構成する：**
  - **前のレンダー R0**（時刻 t0 のレンダー）
  - **次のレンダー R1**（時刻 t1 のレンダー）
- **progress = (now - t0) / (t1 - t0)**（0〜1）
- **表示は R0 をベースに、R1 を alpha = easing(progress) で重ねる**（クロスフェード）。

**デザイントークン参照:**
- イージング: `motion.easing.easeInOut` - 滑らかな補間
- アニメーション: クロスフェードは即時（アニメーション不要、progress値の更新のみ）

### キー時刻での挙動

- **キー時刻ちょうど（例：08:00）では、該当レンダーが 100% になる。**
- **例：08:00ちょうど → morning 100%**

---

## 3) 日跨ぎ（late_night の扱い）

- **late_night（例：01:00）は 翌日側のキーとして扱う。**
- **21:00〜翌01:00 は night → late_night の補間、**
- **01:00〜05:00 は late_night → early_morning の補間とする。**
- **これにより深夜帯でも連続性が保たれ、「急に戻る」挙動を防ぐ。**

---

## 4) レンダー画像の必須条件（ズレ/二重化対策）

フル部屋レンダーをクロスフェードするため、レンダー間の差分が大きいと「二重」や「ブレ」に見える可能性がある。
そのため、以下を必須条件とする：

- **カメラ構図は全時間帯で完全一致**
- **カメラ位置・角度・画角、部屋の輪郭（床・壁）、家具配置は固定**
- **変えるのは光と色味のみ**
- **明度/彩度/色温度/影の濃さなどの"トーン"差分に限定**
- **目立つ輪郭差分（オブジェクトの移動、壁の形状差、エッジ位置ズレ）は禁止**

---

## 5) 更新頻度

- **表示更新は 少なくとも15分間隔を最低ラインとし、可能ならより高頻度で補間率を更新する。**
- **目標は「変化に気づかない」レベル**（World Bible準拠）。

**推奨更新頻度:**
- 最低: 15分間隔
- 推奨: 5分間隔
- 理想: 1分間隔（バッテリー消費とのバランスを考慮）

---

## 6) 命名・管理

- **時間帯キーは上記の固定名を採用する**（early_morning, morning, day, evening, night, late_night）。
- **画像アセットは **時間帯キーに対応する"フル部屋レンダー"**として管理する**（overlayではなくbase置き換え用途）。

**アセット命名例:**
- `base-kitchen__early_morning@2x.png`
- `base-kitchen__morning@2x.png`
- `base-kitchen__day@2x.png`
- `base-kitchen__evening@2x.png`
- `base-kitchen__night@2x.png`
- `base-kitchen__late_night@2x.png`

---

## 7) 受け入れ条件チェック（Done条件）

以下の項目をすべて満たすこと:

- [ ] 時間帯キーが定義されている（early_morning, morning, day, evening, night, late_night）
- [ ] 段階切替が禁止され、常にクロスフェード補間が使用される
- [ ] 日跨ぎ（late_night）の扱いが定義されている
- [ ] レンダー画像の必須条件（カメラ構図一致、トーン差分のみ）が明記されている
- [ ] 更新頻度（最低15分間隔）が定義されている

---

## 実装ガイドライン

### React Native 実装例（参考）

#### 時間帯判定と補間率計算

```tsx
// 時間帯キーの定義
type TimeSlot = 'early_morning' | 'morning' | 'day' | 'evening' | 'night' | 'late_night';

interface TimeSlotConfig {
  key: TimeSlot;
  hour: number;
  minute: number;
}

const TIME_SLOTS: TimeSlotConfig[] = [
  { key: 'early_morning', hour: 5, minute: 0 },
  { key: 'morning', hour: 8, minute: 0 },
  { key: 'day', hour: 12, minute: 0 },
  { key: 'evening', hour: 17, minute: 30 },
  { key: 'night', hour: 21, minute: 0 },
  { key: 'late_night', hour: 1, minute: 0 }, // 翌日扱い
];

// 現在時刻から時間帯と補間率を計算
const getTimeSlotInterpolation = (now: Date): {
  currentSlot: TimeSlot;
  nextSlot: TimeSlot;
  progress: number; // 0-1
} => {
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTime = currentHour * 60 + currentMinute; // 分単位

  // late_night の扱い（翌日側）
  let adjustedTime = currentTime;
  if (currentTime < 60) {
    // 0:00-5:00 は late_night → early_morning の補間
    adjustedTime = currentTime + 24 * 60; // 翌日扱い
  }

  // 時間帯の区間を特定
  for (let i = 0; i < TIME_SLOTS.length; i++) {
    const slot0 = TIME_SLOTS[i];
    const slot1 = TIME_SLOTS[(i + 1) % TIME_SLOTS.length];
    
    const time0 = slot0.hour * 60 + slot0.minute;
    const time1 = slot1.hour * 60 + slot1.minute;
    
    // late_night の扱い
    const adjustedTime0 = time0 < 60 ? time0 + 24 * 60 : time0;
    const adjustedTime1 = time1 < 60 ? time1 + 24 * 60 : time1;
    
    // 区間チェック
    if (adjustedTime >= adjustedTime0 && adjustedTime < adjustedTime1) {
      const duration = adjustedTime1 - adjustedTime0;
      const elapsed = adjustedTime - adjustedTime0;
      const progress = elapsed / duration;
      
      // イージング適用（easeInOut）
      const easedProgress = easeInOut(progress);
      
      return {
        currentSlot: slot0.key,
        nextSlot: slot1.key,
        progress: easedProgress,
      };
    }
  }
  
  // フォールバック（通常は到達しない）
  return {
    currentSlot: 'day',
    nextSlot: 'evening',
    progress: 0,
  };
};

// イージング関数（easeInOut）
const easeInOut = (t: number): number => {
  return t < 0.5
    ? 2 * t * t
    : -1 + (4 - 2 * t) * t;
};
```

#### クロスフェード表示コンポーネント

```tsx
import { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';

// 時間帯レンダーのクロスフェード表示
const TimeGradientWorld = () => {
  const [interpolation, setInterpolation] = useState(() =>
    getTimeSlotInterpolation(new Date())
  );

  useEffect(() => {
    // 更新頻度：5分間隔（推奨）
    const interval = setInterval(() => {
      setInterpolation(getTimeSlotInterpolation(new Date()));
    }, 5 * 60 * 1000); // 5分

    // 初回実行
    setInterpolation(getTimeSlotInterpolation(new Date()));

    return () => clearInterval(interval);
  }, []);

  // アセットパス取得
  const getAssetPath = (slot: TimeSlot): string => {
    return `base-kitchen__${slot}@2x.png`;
  };

  return (
    <View style={styles.container}>
      {/* 前のレンダー（R0） */}
      <Image
        source={{ uri: getAssetPath(interpolation.currentSlot) }}
        style={[styles.render, { opacity: 1 - interpolation.progress }]}
        resizeMode="cover"
      />
      
      {/* 次のレンダー（R1） */}
      <Image
        source={{ uri: getAssetPath(interpolation.nextSlot) }}
        style={[styles.render, { opacity: interpolation.progress }]}
        resizeMode="cover"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  render: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
});
```

#### アセットプリロード（パフォーマンス最適化）

```tsx
// 必要な時間帯レンダーをプリロード
const preloadTimeSlotAssets = async (currentSlot: TimeSlot, nextSlot: TimeSlot) => {
  const assetsToLoad = [currentSlot, nextSlot];
  
  // 直近で使用した時間帯も保持（キャッシュ管理）
  // 実装時は、Image.prefetch または expo-image の preload を使用
  for (const slot of assetsToLoad) {
    const assetPath = `base-kitchen__${slot}@2x.png`;
    // await Image.prefetch(assetPath);
    // または
    // await Image.prefetchAsync(assetPath);
  }
};

// 使用例
useEffect(() => {
  preloadTimeSlotAssets(interpolation.currentSlot, interpolation.nextSlot);
}, [interpolation.currentSlot, interpolation.nextSlot]);
```

#### 更新頻度の動的調整（バッテリー考慮）

```tsx
import { AppState } from 'react-native';

// 更新頻度の動的調整
const useAdaptiveUpdateInterval = () => {
  const [updateInterval, setUpdateInterval] = useState(5 * 60 * 1000); // デフォルト5分

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        // バックグラウンド時は更新頻度を下げる（15分間隔）
        setUpdateInterval(15 * 60 * 1000);
      } else {
        // フォアグラウンド時は通常の更新頻度（5分間隔）
        setUpdateInterval(5 * 60 * 1000);
      }
    });

    return () => subscription.remove();
  }, []);

  return updateInterval;
};
```

---

## 変更履歴

| 日付 | 更新内容 |
|------|---------|
| 2026-02-01 | 初版作成（UX-SOON P1） |

