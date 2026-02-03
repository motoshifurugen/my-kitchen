> **⚠️ このファイルはアーカイブされました**
>
> このファイルの内容は `docs/ux/phase-1/03-assets.md` に統合されました。
> 最新の情報はそちらを参照してください。
>
> ---

# 10-07: 2.5D世界 メモリ使用量・パフォーマンス目標
_2.5D World Memory Usage & Performance Budget Specification_

**UX-SOON P1**

---

## 概要

このドキュメントは、2.5Dキッチン世界（S-01）のメモリ使用量・パフォーマンス目標を定義します。

モバイルで"静かに常駐できる"ことを優先して設計し、バッテリー・メモリ・起動時間に負担をかけないことを「UXの一部」として扱います。

**関連ドキュメント:**
- [05-2_5d-asset-spec.md](./05-2_5d-asset-spec.md) - 2.5Dアセット仕様
- [06-lighting-spec.md](./06-lighting-spec.md) - ライティング仕様
- [04-motion-tokens.md](./04-motion-tokens.md) - モーショントークン定義
- [../world-bible/core-philosophy.md](../world-bible/core-philosophy.md) - 核心思想
- [../world-bible/philosophy-speed.md](../world-bible/philosophy-speed.md) - 速さの哲学

---

## 0) 設計方針

2.5Dキッチン世界（S-01）を、モバイルで"静かに常駐できる"ことを優先して設計する。
バッテリー・メモリ・起動時間に負担をかけないことを「UXの一部」として扱う。

---

## 1) 総アセットサイズ目安（ダウンロード/ストレージ）

### 目標（MVP）

- **2.5D世界に関わる runtimeアセット総量：~8MB以内（理想） / 上限 15MB**

### 内訳イメージ（例）

- **ベース部屋（時間帯別のフルレンダーを採用する場合）：@2x を 最大6枚程度**
- **キャラクター：@2x 3枚（年代別ベース）**
- **マスク：@2x 1枚**
- **（将来）アンビエント/小物：追加するたびに +0.2〜1.0MB 想定**

### 1アセットあたりの目安

- **2.5D「部屋フルレンダー」@2x：〜150KB を目標（上限 250KB）**
- **立ち絵/キャラ @2x：〜120KB（上限 200KB）**
- **マスク @2x：〜80KB（上限 150KB）**

**方針：まずは「容量が小さい」＝「メモリ展開も軽い」ので、容量は強いKPI として扱う。**

---

## 2) メモリ使用量ターゲット（実行時）

### 目標（S-01表示中）

- **追加メモリ（2.5D世界に起因する増分）：**
  - **目標：+40MB以内**
  - **上限：+80MB**（これを超える場合は縮退発動・アセット削減を検討）
- **同時にメモリ保持してよい「世界系画像」の枚数：**
  - **最大 3〜4枚**（例：部屋1 + キャラ1 + マスク1 + 予備1）
  - **時間帯別の部屋フルレンダーを採用する場合でも、全時間帯を同時保持しない**（必要分のみロード）

**メモ：画像は「ファイルサイズ」より「展開後のピクセルメモリ」が効く。**
**"使ってない時間帯の部屋画像をキャッシュし続けない" をルール化する。**

---

## 3) 起動時ロード戦略（体感速度優先）

### 原則

- **起動時に世界を"完成状態"までロードしない。**
- **「まず表示できる最小構成 → 落ち着いて差し込む」が世界観に合う。**

### ステップ（推奨）

1. **初期描画（最速）**
   - **S-01：ベースの部屋（または現在時間の部屋フルレンダー）1枚だけで描画開始**

2. **次に重ねる**
   - **キャラ（年代別）を遅延ロードして重ねる**（数百ms遅れてもOK）

3. **最後に補助**
   - **マスク/軽い装飾/（将来）アンビエントは最終段で**

### キャッシュ方針

- **直近で使用した時間帯の部屋のみ保持**（例：今 + 直前の1つ）
- **それ以外は破棄**（OS任せのキャッシュに期待しない）
- **アセットのプリロードは「最初の1回」だけやり、以後は必要時に差し込む**

---

## 4) 低スペック端末での縮退ルール（必須）

### 縮退の発動条件（いずれか）

- **メモリ増分が +80MB を超える兆候がある**
- **FPS低下・描画のガタつきが目立つ**
- **OSが頻繁にアプリを落とす**（再起動が増える）

### 縮退レベル（上から順に適用）

1. **呼吸アニメーションOFF**（または更新頻度を下げる）
2. **時間帯の切り替えを"即時差し替え"にし、フェード等の演出を省略**
3. **画像解像度を@1x優先**（端末や状況によって@2xを使わない）
4. **キャラクターを非表示にできる**（設定 or 自動）
5. **（将来のアンビエントが入った場合）アンビエント停止**

**重要：縮退しても「世界観が壊れない」順番で落とす。**
**まず"動き"、次に"装飾"、最後に"存在（キャラ）"。**

---

## 5) バッテリー消費への考慮事項（必須）

- **アニメーションは 常時60fpsを狙わない**（静かな呼吸で十分）
- **体感が変わらない範囲で更新頻度を抑える**
- **画面が非表示/バックグラウンド時は 必ずアニメーション停止**
- **画像合成は「増やしすぎない」**
  - **レイヤー枚数が増えるほどGPU/電池に効くため、同時レイヤー上限を設ける**
- **透過やブラーは慎重に**（常時ブラーはコスト高）
- **デバッグ用トグル・FPS表示などは DEV 限定で本番に残さない**

---

## 6) 受け入れ条件チェック（Done条件）

以下の項目をすべて満たすこと:

- [ ] 総アセットサイズ目安（目標/上限）が定義されている
- [ ] メモリ使用量ターゲット（目標/上限）が定義されている
- [ ] 起動時ロード戦略（最小構成→段階ロード）が定義されている
- [ ] 低スペック端末の縮退ルール（段階）が定義されている
- [ ] バッテリー考慮（停止/更新頻度/レイヤー制限）が明記されている

---

## 実装ガイドライン

### React Native 実装例（参考）

#### メモリ監視と縮退発動

```tsx
import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

// メモリ監視と縮退レベル管理
const usePerformanceBudget = () => {
  const [degradationLevel, setDegradationLevel] = useState(0);
  const [memoryUsage, setMemoryUsage] = useState(0);

  useEffect(() => {
    // メモリ使用量を監視（定期的にチェック）
    const checkMemory = async () => {
      // 実装時は、react-native-device-info などでメモリ取得
      // const memInfo = await DeviceInfo.getUsedMemory();
      // const worldMemoryIncrement = memInfo - baselineMemory;
      
      // 仮の実装例
      const worldMemoryIncrement = 0; // 実際の値に置き換え
      
      if (worldMemoryIncrement > 80) {
        // 上限超過：縮退レベル5（最大）
        setDegradationLevel(5);
      } else if (worldMemoryIncrement > 60) {
        setDegradationLevel(4);
      } else if (worldMemoryIncrement > 50) {
        setDegradationLevel(3);
      } else if (worldMemoryIncrement > 40) {
        setDegradationLevel(2);
      } else if (worldMemoryIncrement > 30) {
        setDegradationLevel(1);
      } else {
        setDegradationLevel(0);
      }
      
      setMemoryUsage(worldMemoryIncrement);
    };

    const interval = setInterval(checkMemory, 5000); // 5秒ごと
    checkMemory(); // 初回実行

    return () => clearInterval(interval);
  }, []);

  // バックグラウンド時のアニメーション停止
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        // アニメーション停止
        setDegradationLevel((prev) => Math.max(prev, 1)); // 最低でも呼吸OFF
      }
    });

    return () => subscription.remove();
  }, []);

  return { degradationLevel, memoryUsage };
};
```

#### 段階的ロード戦略

```tsx
// 世界コンポーネント（段階的ロード）
const WorldScene = () => {
  const [loadPhase, setLoadPhase] = useState<'base' | 'character' | 'mask'>('base');
  const { degradationLevel } = usePerformanceBudget();

  useEffect(() => {
    // Phase 1: ベース部屋のみ（最速）
    setLoadPhase('base');

    // Phase 2: キャラクターを遅延ロード（数百ms後）
    const characterTimer = setTimeout(() => {
      if (degradationLevel < 4) { // キャラ非表示でない場合
        setLoadPhase('character');
      }
    }, 300);

    // Phase 3: マスク/装飾を最終段で
    const maskTimer = setTimeout(() => {
      setLoadPhase('mask');
    }, 600);

    return () => {
      clearTimeout(characterTimer);
      clearTimeout(maskTimer);
    };
  }, [degradationLevel]);

  return (
    <View>
      {/* ベース部屋 */}
      <WorldBaseRoom />
      
      {/* キャラクター（Phase 2以降） */}
      {loadPhase !== 'base' && degradationLevel < 4 && (
        <WorldCharacter />
      )}
      
      {/* マスク/装飾（Phase 3以降） */}
      {loadPhase === 'mask' && (
        <WorldMask />
      )}
    </View>
  );
};
```

#### アセットキャッシュ管理

```tsx
// 時間帯別部屋のキャッシュ管理
const useRoomCache = () => {
  const [cachedRooms, setCachedRooms] = useState<Set<string>>(new Set());
  const maxCacheSize = 2; // 現在 + 直前の1つ

  const loadRoom = async (timeSlot: string) => {
    // 既にキャッシュされている場合はスキップ
    if (cachedRooms.has(timeSlot)) {
      return;
    }

    // キャッシュ上限チェック
    if (cachedRooms.size >= maxCacheSize) {
      // 最も古いものを削除（実装時はLRU等を検討）
      const oldest = Array.from(cachedRooms)[0];
      cachedRooms.delete(oldest);
      // メモリからも解放
      releaseRoomAsset(oldest);
    }

    // 新しい部屋をロード
    await loadRoomAsset(timeSlot);
    setCachedRooms((prev) => new Set([...prev, timeSlot]));
  };

  const releaseRoom = (timeSlot: string) => {
    if (cachedRooms.has(timeSlot)) {
      releaseRoomAsset(timeSlot);
      setCachedRooms((prev) => {
        const next = new Set(prev);
        next.delete(timeSlot);
        return next;
      });
    }
  };

  return { loadRoom, releaseRoom, cachedRooms };
};
```

#### 縮退レベルに応じた設定

```tsx
// 縮退レベルに応じた設定を取得
const getDegradationConfig = (level: number) => {
  const configs = {
    0: {
      animationEnabled: true,
      animationFPS: 30, // 静かな呼吸で十分
      useHighRes: true, // @2x
      characterVisible: true,
      ambientEnabled: true,
      transitionDuration: 300, // フェード等の演出あり
    },
    1: {
      animationEnabled: false, // 呼吸OFF
      animationFPS: 0,
      useHighRes: true,
      characterVisible: true,
      ambientEnabled: true,
      transitionDuration: 300,
    },
    2: {
      animationEnabled: false,
      animationFPS: 0,
      useHighRes: true,
      characterVisible: true,
      ambientEnabled: true,
      transitionDuration: 0, // 即時差し替え
    },
    3: {
      animationEnabled: false,
      animationFPS: 0,
      useHighRes: false, // @1x優先
      characterVisible: true,
      ambientEnabled: true,
      transitionDuration: 0,
    },
    4: {
      animationEnabled: false,
      animationFPS: 0,
      useHighRes: false,
      characterVisible: false, // キャラ非表示
      ambientEnabled: true,
      transitionDuration: 0,
    },
    5: {
      animationEnabled: false,
      animationFPS: 0,
      useHighRes: false,
      characterVisible: false,
      ambientEnabled: false, // アンビエント停止
      transitionDuration: 0,
    },
  };

  return configs[level] || configs[0];
};
```

#### アセットサイズ検証

```tsx
// アセットサイズの検証（開発時）
const validateAssetSize = async (assetPath: string, maxSizeKB: number) => {
  // 実装時は、react-native-fs などでファイルサイズ取得
  // const fileSize = await RNFS.stat(assetPath).then(stat => stat.size);
  // const sizeKB = fileSize / 1024;
  
  // 仮の実装例
  const sizeKB = 0; // 実際の値に置き換え
  
  if (sizeKB > maxSizeKB) {
    console.warn(
      `Asset ${assetPath} exceeds size limit: ${sizeKB}KB > ${maxSizeKB}KB`
    );
    return false;
  }
  
  return true;
};

// 使用例
const validateWorldAssets = async () => {
  await validateAssetSize('base-room@2x.png', 250); // 上限250KB
  await validateAssetSize('character@2x.png', 200); // 上限200KB
  await validateAssetSize('mask@2x.png', 150); // 上限150KB
};
```

---

## 変更履歴

| 日付 | 更新内容 |
|------|---------|
| 2026-02-01 | 初版作成（UX-SOON P1） |

