> **⚠️ このファイルはアーカイブされました**
>
> このファイルの内容は `docs/ux/phase-1/05-sound.md` に統合されました。
> 最新の情報はそちらを参照してください。
>
> ---

# 10-09: 環境音アセットリスト定義
_Sound Assets List & Specification_

**UX-SOON P1**

---

## 概要

このドキュメントは、アプリ内で使用する環境音アセットの一覧と仕様を定義します。

World Bible の核心思想「料理は静かな自己回復の儀式である」に準拠し、音は「演出」ではなく空気として、気づかないくらいの存在感を実現します。

**関連ドキュメント:**
- [07-sound-guidelines.md](./07-sound-guidelines.md) - サウンドガイドライン
- [10-08-time-gradient-interpolation-design.md](./10-08-time-gradient-interpolation-design.md) - 時間帯グラデーション補完ルール
- [../world-bible/sound-philosophy.md](../world-bible/sound-philosophy.md) - 音の哲学（アンビエント・インタラクション含む）

---

## 0) 方針（World Bible準拠）

- **音は「演出」ではなく 空気。気づかないくらいの存在感が正しい。**
- **ストリーク圧 / 催促 / 達成のゲーム感につながるSEは作らない**（必要最低限の儀式音のみ）。
- **MVPは「音の演出」設定（ON/OFF）に統合**（個別の音量/種別切り替えは行わない）。

---

## 1) アセット一覧（用途・タイミング込み）

### A. 常時ループ（World Scene の"床"）

| ID | アセット名（仮） | 用途 | 再生タイミング | 形式 | 長さ | ルール |
|----|----------------|------|---------------|------|------|--------|
| A1 | `amb_room_air` | 室内の空気（遠くの生活音の粒） | S-01表示中ずっと | AAC(.m4a) or MP3 | 60–120s | ループ、境界が分からない編集 |
| A2 | `amb_fridge_hum` | 冷蔵庫のモーター（低域） | S-01表示中 | AAC/MP3 | 30–60s | 低音強すぎ禁止（耳疲れ回避） |
| A3 | `amb_vent_soft` | 換気扇/空調の"風の層" | S-01表示中（微小） | AAC/MP3 | 30–60s | 常に薄く、存在感は最小 |
| A4 | `amb_outside_far` | 外の遠音（車/人の気配の超遠景） | 時間帯で混ぜ量を変える | AAC/MP3 | 60–120s | 鋭い音（クラクション等）は除去 |

### B. 時間帯差分ループ（時間の"気配"）

| ID | アセット名（仮） | 用途 | 再生タイミング | 形式 | 長さ | ルール |
|----|----------------|------|---------------|------|------|--------|
| B1 | `tod_early_morning` | 早朝の静けさ（鳥/遠い気配を極小） | early_morning 区間で薄く | AAC/MP3 | 60–120s | "鳥のさえずり"強め禁止（自然すぎると台所から離れる） |
| B2 | `tod_day` | 昼の生活感（遠音を少しだけ増やす） | day 区間で薄く | AAC/MP3 | 60–120s | 作業を邪魔しない密度 |
| B3 | `tod_evening` | 夕方の落ち着き（外気配が少し増える） | evening 区間で薄く | AAC/MP3 | 60–120s | 情緒過多にしない |
| B4 | `tod_night` | 夜の静けさ（外気配を減らす） | night/late_night で薄く | AAC/MP3 | 60–120s | "不穏"にならない |

### C. ワンショット（操作の"儀式"・安心のフィードバック）

| ID | アセット名（仮） | 用途 | 再生タイミング | 形式 | 長さ | ルール |
|----|----------------|------|---------------|------|------|--------|
| C1 | `ui_soft_tap` | 主要ボタンタップの触感 | Primary決定時のみ（乱発しない） | AAC/MP3 | 0.05–0.15s | カチカチ禁止、布/木/紙の柔らかさ |
| C2 | `ui_modal_open` | モーダル表示 | S-03等のモーダル表示時 | AAC/MP3 | 0.1–0.25s | "演出"ではなく存在通知 |
| C3 | `ui_modal_close` | モーダル閉じ | 閉じる操作時 | AAC/MP3 | 0.1–0.25s | 開く音と対になる |
| C4 | `ritual_saved` | 記録完了（セレブレーション） | S-08表示開始と同時 | AAC/MP3 | 0.4–0.8s | ファンファーレ禁止、ささやかな達成感 |

---

## 2) フォーマット方針（推奨）

- **推奨形式：AAC .m4a（または MP3）**
- **ループ系は容量が増えやすいので WAVは原則使わない**（編集/マスター保管はWAVでOK）
- **サンプルレート：44.1kHz / 16bit**（ループ用途は十分）
- **チャンネル：基本ステレオ**（ただし定位が強すぎるものは避ける）
- **ファイル命名：`{category}_{name}.m4a`** 例）`amb_fridge_hum.m4a`

---

## 3) 長さ・ループ仕様

- **ループ：60–120秒を基本**（短いと"繰り返し感"が出る）
- **ループ境界：**
  - **クリック/段差が出ないように、無音 0.2–0.5秒やクロスで処理**
  - **可能なら"ループ用に編集された素材"を採用**
- **ループの切替（時間帯）：クロスフェード 2–6秒**（気づかない速度）

**デザイントークン参照:**
- クロスフェード時間: `motion.duration.slow` (600ms以上) または 2–6秒

---

## 4) ミックス指針（音量・主張しない）

### 目安

- **常時ループ（A系）は -30dB〜-24dB相当の体感**（かなり小さく）
- **ワンショット（C系）は 常時ループより少しだけ前に出るが、通知音にならない**

### "不穏"回避

- **低域のうねり、強い風音、孤独を煽る残響は避ける**
- **代わりに 柔らかいノイズ層・木質・布質を使う**

---

## 5) 調達方法（録音/購入/生成）

### 優先順位

1. **購入（商用利用OKの効果音ライブラリ）：品質が安定、編集もしやすい**
2. **自前録音：冷蔵庫/換気扇/食器など、固有性を出せる**
3. **生成AI：方向性は良いが、ループ品質や権利/再現性の管理に注意**（要：利用規約確認）

### 最低限の作業フロー（推奨）

1. **収集**
2. **ノイズ除去**
3. **ループ編集**
4. **音量合わせ**
5. **書き出し（m4a）**

---

## 6) 受け入れ条件チェック（Done条件）

以下の項目をすべて満たすこと:

- [ ] アセット一覧が定義されている（常時ループ、時間帯差分ループ、ワンショット）
- [ ] フォーマット方針（AAC/MP3、サンプルレート、チャンネル）が定義されている
- [ ] 長さ・ループ仕様（60–120秒、境界処理、クロスフェード）が定義されている
- [ ] ミックス指針（音量目安、不穏回避）が明記されている
- [ ] 調達方法（優先順位、作業フロー）が定義されている

---

## 実装ガイドライン

### React Native 実装例（参考）

#### 環境音管理システム

```tsx
import { Audio } from 'expo-av';
import { useEffect, useRef } from 'react';

// 環境音のカテゴリ
type AmbientCategory = 'ambient' | 'timeOfDay' | 'ui' | 'ritual';

// アセット定義
const SOUND_ASSETS = {
  // 常時ループ（A系）
  ambient: {
    roomAir: require('../assets/sounds/amb_room_air.m4a'),
    fridgeHum: require('../assets/sounds/amb_fridge_hum.m4a'),
    ventSoft: require('../assets/sounds/amb_vent_soft.m4a'),
    outsideFar: require('../assets/sounds/amb_outside_far.m4a'),
  },
  // 時間帯差分ループ（B系）
  timeOfDay: {
    earlyMorning: require('../assets/sounds/tod_early_morning.m4a'),
    day: require('../assets/sounds/tod_day.m4a'),
    evening: require('../assets/sounds/tod_evening.m4a'),
    night: require('../assets/sounds/tod_night.m4a'),
  },
  // ワンショット（C系）
  ui: {
    softTap: require('../assets/sounds/ui_soft_tap.m4a'),
    modalOpen: require('../assets/sounds/ui_modal_open.m4a'),
    modalClose: require('../assets/sounds/ui_modal_close.m4a'),
  },
  ritual: {
    saved: require('../assets/sounds/ritual_saved.m4a'),
  },
} as const;

// 環境音管理フック
const useAmbientSound = (enabled: boolean) => {
  const ambientSounds = useRef<Map<string, Audio.Sound>>(new Map());
  const timeOfDaySound = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    if (!enabled) {
      // すべて停止
      ambientSounds.current.forEach((sound) => {
        sound.unloadAsync();
      });
      timeOfDaySound.current?.unloadAsync();
      ambientSounds.current.clear();
      timeOfDaySound.current = null;
      return;
    }

    // 常時ループの初期化
    const initAmbientSounds = async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
        });

        // 常時ループ（A系）をロード
        for (const [key, source] of Object.entries(SOUND_ASSETS.ambient)) {
          const { sound } = await Audio.Sound.createAsync(
            source,
            {
              isLooping: true,
              volume: 0.1, // -30dB相当（かなり小さく）
            }
          );
          ambientSounds.current.set(key, sound);
          await sound.playAsync();
        }
      } catch (error) {
        console.error('Failed to initialize ambient sounds:', error);
      }
    };

    initAmbientSounds();

    return () => {
      // クリーンアップ
      ambientSounds.current.forEach((sound) => {
        sound.unloadAsync();
      });
      timeOfDaySound.current?.unloadAsync();
    };
  }, [enabled]);

  return { ambientSounds: ambientSounds.current };
};

// 時間帯別ループ管理
const useTimeOfDaySound = (timeSlot: string, enabled: boolean) => {
  const currentSound = useRef<Audio.Sound | null>(null);
  const previousSound = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    if (!enabled) {
      currentSound.current?.unloadAsync();
      previousSound.current?.unloadAsync();
      return;
    }

    const updateTimeOfDaySound = async () => {
      const soundAsset = SOUND_ASSETS.timeOfDay[timeSlot as keyof typeof SOUND_ASSETS.timeOfDay];
      if (!soundAsset) return;

      // 前の音をクロスフェードで停止
      if (previousSound.current) {
        previousSound.current.setVolumeAsync(0, { durationMillis: 3000 }); // 3秒でフェードアウト
        setTimeout(() => {
          previousSound.current?.unloadAsync();
        }, 3000);
      }

      // 新しい音をクロスフェードで開始
      try {
        const { sound } = await Audio.Sound.createAsync(
          soundAsset,
          {
            isLooping: true,
            volume: 0.0, // 最初は無音
          }
        );
        
        await sound.playAsync();
        sound.setVolumeAsync(0.08, { durationMillis: 3000 }); // 3秒でフェードイン
        
        previousSound.current = currentSound.current;
        currentSound.current = sound;
      } catch (error) {
        console.error('Failed to load time of day sound:', error);
      }
    };

    updateTimeOfDaySound();
  }, [timeSlot, enabled]);

  return currentSound.current;
};

// UI音（ワンショット）再生
const playUISound = async (soundKey: keyof typeof SOUND_ASSETS.ui) => {
  try {
    const soundAsset = SOUND_ASSETS.ui[soundKey];
    const { sound } = await Audio.Sound.createAsync(
      soundAsset,
      {
        volume: 0.15, // 常時ループより少し前に出る
      }
    );
    await sound.playAsync();
    
    // 再生完了後にアンロード
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish) {
        sound.unloadAsync();
      }
    });
  } catch (error) {
    console.error('Failed to play UI sound:', error);
  }
};

// 儀式音（記録完了）再生
const playRitualSound = async () => {
  try {
    const soundAsset = SOUND_ASSETS.ritual.saved;
    const { sound } = await Audio.Sound.createAsync(
      soundAsset,
      {
        volume: 0.2, // 少し前に出るが、通知音にならない
      }
    );
    await sound.playAsync();
    
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish) {
        sound.unloadAsync();
      }
    });
  } catch (error) {
    console.error('Failed to play ritual sound:', error);
  }
};
```

#### 使用例

```tsx
// 世界画面コンポーネント
const WorldScene = () => {
  const { soundEnabled } = useSettings();
  const { timeSlot } = useTimeSlot(); // 時間帯判定
  
  // 環境音管理
  useAmbientSound(soundEnabled);
  useTimeOfDaySound(timeSlot, soundEnabled);

  return <View>{/* 世界コンテンツ */}</View>;
};

// ボタンコンポーネント（Primary）
const PrimaryButton = ({ onPress, label }) => {
  const handlePress = async () => {
    await playUISound('softTap'); // Primary決定時のみ
    onPress();
  };

  return (
    <PressableBase onPress={handlePress}>
      <Text>{label}</Text>
    </PressableBase>
  );
};

// モーダルコンポーネント
const Modal = ({ visible, onClose }) => {
  useEffect(() => {
    if (visible) {
      playUISound('modalOpen');
    } else {
      playUISound('modalClose');
    }
  }, [visible]);

  return <View>{/* モーダルコンテンツ */}</View>;
};

// セレブレーション画面（S-08）
const CelebrationScreen = () => {
  useEffect(() => {
    playRitualSound(); // 記録完了音
  }, []);

  return <View>{/* セレブレーションコンテンツ */}</View>;
};
```

---

## 変更履歴

| 日付 | 更新内容 |
|------|---------|
| 2026-02-01 | 初版作成（UX-SOON P1） |

