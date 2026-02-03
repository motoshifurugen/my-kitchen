> **⚠️ このファイルはアーカイブされました**
>
> このファイルの内容は `docs/ux/phase-1/05-sound.md` に統合されました。
> 最新の情報はそちらを参照してください。
>
> ---

# 10-10: 時間帯に応じたサウンド変化ルール
_Time-Based Sound Variation Rules Specification_

**UX-SOON P1**

---

## 概要

このドキュメントは、時間帯（6区分）に応じたサウンド変化ルールを定義します。

ユーザーに気づかれないレベルで、朝は軽くクリア / 昼は生活感 / 夜は音量を落とす / 深夜はほぼ無音を成立させます。

**関連ドキュメント:**
- [10-09-sound-assets-design.md](./10-09-sound-assets-design.md) - 環境音アセットリスト定義
- [10-08-time-gradient-interpolation-design.md](./10-08-time-gradient-interpolation-design.md) - 時間帯グラデーション補完ルール
- [07-sound-guidelines.md](./07-sound-guidelines.md) - サウンドガイドライン
- [../world-bible/sound-philosophy.md](../world-bible/sound-philosophy.md) - 音の哲学（アンビエントサウンド含む）

---

## 0) 目的

時間帯（6区分）に応じて、台所の「空気」を静かに変化させる。
ユーザーに気づかれないレベルで、朝は軽くクリア / 昼は生活感 / 夜は音量を落とす / 深夜はほぼ無音を成立させる。

---

## 1) 前提（依存：UX-048, UX-053）

- **段階切替は禁止：時間帯が変わる瞬間にパチンと切り替えない**
- **補間はクロスフェード：更新は最低15分間隔、可能なら連続補間**
- **音源カテゴリは UX-053 に準拠：**
  - **常時ループ（A系）：** `amb_room_air`, `amb_fridge_hum`, `amb_vent_soft`, `amb_outside_far`
  - **時間帯差分ループ（B系）：** `tod_early_morning`, `tod_day`, `tod_evening`, `tod_night`
  - **ワンショット（C系）：** `ritual_saved` 等

---

## 2) 6時間帯のサウンド方針（トーン指針）

| Time Slot | 方針 | キーワード |
|-----------|------|-----------|
| early_morning | 空気音中心。最もクリアで軽い | 透明・静けさ・呼吸 |
| morning | 朝の生活が始まる"気配"を少し足す | 明るい・軽い生活感 |
| day | 生活音がやや増加（ただし遠景） | 日中の粒・密度少し増 |
| evening | 全体音量を落とし、落ち着き寄り | 夕方の柔らかさ |
| night | さらに音量を下げ、低域寄り | 静けさ・暗さ・低域 |
| late_night | ほぼ無音（必要最低限のみ） | 無音に近い・安心 |

---

## 3) 時間帯別：音量係数（ミックス係数）

**基準：** UX-053の「常時ループの体感 -30〜-24dB相当」を 1.00 として扱う（実際のdBは実装側で調整）。

### 3-1. マスター係数（全体の音量）

| Time Slot | MASTER |
|-----------|--------|
| early_morning | 1.00 |
| morning | 1.00 |
| day | 1.05 |
| evening | 0.90 |
| night | 0.75 |
| late_night | 0.15 |

### 3-2. レイヤー別係数（カテゴリごと）

| Time Slot | A:常時ループ | B:時間帯差分 | C:ワンショット |
|-----------|-------------|-------------|---------------|
| early_morning | 1.00 | 0.60 | 1.00 |
| morning | 1.00 | 0.55 | 1.00 |
| day | 1.00 | 0.75 | 1.00 |
| evening | 0.90 | 0.65 | 0.90 |
| night | 0.75 | 0.55 | 0.80 |
| late_night | 0.15 | 0.00 | 0.35 |

---

## 4) 時間帯別：使用音種制限（何を鳴らす／鳴らさない）

### 4-1. 常時ループ（A系）の採用ルール

| Time Slot | amb_room_air | amb_fridge_hum | amb_vent_soft | amb_outside_far |
|-----------|-------------|---------------|--------------|----------------|
| early_morning | ✅ | ✅(弱) | △(極小) | △(極小) |
| morning | ✅ | ✅(弱) | △ | △ |
| day | ✅ | ✅ | △ | ✅(弱) |
| evening | ✅(弱) | ✅ | △(弱) | ✅(弱) |
| night | ✅(極弱) | ✅(極弱) | ✖︎ | △(極弱) |
| late_night | ✅(ほぼ0) | ✖︎ or ✅(ほぼ0) | ✖︎ | ✖︎ |

**ルール:**
- **`amb_outside_far` は 昼〜夕方のみが基本**（夜に外音があると落ち着かない場合があるため）
- **`amb_vent_soft` は"空調っぽさ"が出やすいので、夜は原則オフ**

### 4-2. 時間帯差分（B系）の採用ルール

- **early_morning/morning/day/evening/night は該当Bを使用し、隣接時間帯とクロスフェード**
- **late_night は B系は使用しない（0）**

---

## 5) 深夜の「ほぼ無音」の定義（明文化）

### 定義

**late_night は、以下を満たす状態を「ほぼ無音」とする：**

1. **B系（時間帯差分ループ）は完全停止**（係数 0）
2. **A系（常時ループ）は MASTER=0.15 かつ A係数=0.15 の範囲**
   - **体感として「耳を澄ませばわかるか、わからないか」程度**
3. **外音（`amb_outside_far`）・換気（`amb_vent_soft`）は使用しない**
4. **UIワンショット（C系）は、必要時のみ、かつ 通常の35%（C係数=0.35）まで**
   - **通知音にならないこと**（眠りを妨げない）

---

## 6) 補間（切替）ルール（UX-048整合）

- **時間帯境界では 最短でも 2秒、推奨 6〜12秒でクロスフェード**
- **更新頻度：最低15分間隔で係数を更新**
- **可能なら「現在時刻 → 次の時間帯までの残り割合」で連続補間**
- **体感要件：**
  - **"変化に気づかない"レベル**
  - **変化に気づく場合は、補間時間を延ばす or 係数差を縮める**

**デザイントークン参照:**
- クロスフェード時間: 最短2秒、推奨6–12秒
- 更新頻度: 最低15分間隔

---

## 7) 受け入れ条件チェック（Done条件）

以下の項目をすべて満たすこと:

- [ ] 6時間帯のサウンド方針（トーン指針）が定義されている
- [ ] 時間帯別音量係数（マスター係数、レイヤー別係数）が定義されている
- [ ] 時間帯別使用音種制限（A系、B系）が定義されている
- [ ] 深夜の「ほぼ無音」の定義が明文化されている
- [ ] 補間（切替）ルール（クロスフェード、更新頻度）が定義されている

---

## 実装ガイドライン

### React Native 実装例（参考）

#### 時間帯別音量係数の定義

```tsx
// 時間帯キー
type TimeSlot = 'early_morning' | 'morning' | 'day' | 'evening' | 'night' | 'late_night';

// 音量係数設定
interface SoundVolumeConfig {
  master: number;
  ambient: number; // A系（常時ループ）
  timeOfDay: number; // B系（時間帯差分）
  ui: number; // C系（ワンショット）
}

const TIME_SLOT_VOLUME_CONFIG: Record<TimeSlot, SoundVolumeConfig> = {
  early_morning: {
    master: 1.00,
    ambient: 1.00,
    timeOfDay: 0.60,
    ui: 1.00,
  },
  morning: {
    master: 1.00,
    ambient: 1.00,
    timeOfDay: 0.55,
    ui: 1.00,
  },
  day: {
    master: 1.05,
    ambient: 1.00,
    timeOfDay: 0.75,
    ui: 1.00,
  },
  evening: {
    master: 0.90,
    ambient: 0.90,
    timeOfDay: 0.65,
    ui: 0.90,
  },
  night: {
    master: 0.75,
    ambient: 0.75,
    timeOfDay: 0.55,
    ui: 0.80,
  },
  late_night: {
    master: 0.15,
    ambient: 0.15,
    timeOfDay: 0.00, // B系は使用しない
    ui: 0.35,
  },
};
```

#### 使用音種制限の定義

```tsx
// 常時ループ（A系）の使用ルール
interface AmbientSoundRule {
  roomAir: boolean | 'weak' | 'veryWeak' | 'almostZero';
  fridgeHum: boolean | 'weak' | 'veryWeak' | 'almostZero' | false;
  ventSoft: boolean | 'weak' | false;
  outsideFar: boolean | 'weak' | 'veryWeak' | false;
}

const AMBIENT_SOUND_RULES: Record<TimeSlot, AmbientSoundRule> = {
  early_morning: {
    roomAir: true,
    fridgeHum: 'weak',
    ventSoft: 'veryWeak',
    outsideFar: 'veryWeak',
  },
  morning: {
    roomAir: true,
    fridgeHum: 'weak',
    ventSoft: true,
    outsideFar: true,
  },
  day: {
    roomAir: true,
    fridgeHum: true,
    ventSoft: true,
    outsideFar: 'weak',
  },
  evening: {
    roomAir: 'weak',
    fridgeHum: true,
    ventSoft: 'weak',
    outsideFar: 'weak',
  },
  night: {
    roomAir: 'veryWeak',
    fridgeHum: 'veryWeak',
    ventSoft: false,
    outsideFar: 'veryWeak',
  },
  late_night: {
    roomAir: 'almostZero',
    fridgeHum: false, // or 'almostZero'
    ventSoft: false,
    outsideFar: false,
  },
};
```

#### 時間帯に応じた音量調整

```tsx
import { useEffect, useRef } from 'react';
import { Audio } from 'expo-av';

// 時間帯に応じた音量調整フック
const useTimeBasedSoundVolume = (timeSlot: TimeSlot, sounds: Map<string, Audio.Sound>) => {
  const previousSlot = useRef<TimeSlot | null>(null);
  const fadeDuration = useRef(6000); // 6秒（推奨）

  useEffect(() => {
    const config = TIME_SLOT_VOLUME_CONFIG[timeSlot];
    const rules = AMBIENT_SOUND_RULES[timeSlot];

    // クロスフェードで音量を調整
    const updateVolumes = async () => {
      const isTransition = previousSlot.current !== null && previousSlot.current !== timeSlot;
      
      if (isTransition) {
        // 時間帯切替時はクロスフェード（6–12秒）
        fadeDuration.current = 6000; // 6秒
      } else {
        // 初回または同一時間帯内の更新は短め（2秒）
        fadeDuration.current = 2000;
      }

      // 各音源の音量を調整
      for (const [key, sound] of sounds.entries()) {
        let targetVolume = 0;

        // カテゴリ判定と係数適用
        if (key.startsWith('amb_')) {
          // A系（常時ループ）
          const rule = rules[key as keyof AmbientSoundRule];
          if (rule === false) {
            targetVolume = 0;
          } else if (rule === 'weak') {
            targetVolume = config.master * config.ambient * 0.5;
          } else if (rule === 'veryWeak') {
            targetVolume = config.master * config.ambient * 0.25;
          } else if (rule === 'almostZero') {
            targetVolume = config.master * config.ambient * 0.05;
          } else {
            targetVolume = config.master * config.ambient;
          }
        } else if (key.startsWith('tod_')) {
          // B系（時間帯差分ループ）
          targetVolume = config.master * config.timeOfDay;
        }

        // クロスフェードで音量変更
        await sound.setVolumeAsync(targetVolume, {
          durationMillis: fadeDuration.current,
        });
      }

      previousSlot.current = timeSlot;
    };

    updateVolumes();
  }, [timeSlot, sounds]);
};
```

#### 連続補間（推奨）

```tsx
// 現在時刻から次の時間帯までの残り割合で連続補間
const useContinuousSoundInterpolation = (currentTime: Date) => {
  const [interpolation, setInterpolation] = useState(() =>
    getTimeSlotInterpolation(currentTime)
  );

  useEffect(() => {
    // 可能なら1分間隔で更新（連続補間）
    const interval = setInterval(() => {
      const newInterpolation = getTimeSlotInterpolation(new Date());
      setInterpolation(newInterpolation);
    }, 60 * 1000); // 1分

    return () => clearInterval(interval);
  }, []);

  // 補間率に基づいて音量を計算
  const getInterpolatedVolume = (
    currentSlot: TimeSlot,
    nextSlot: TimeSlot,
    progress: number
  ): number => {
    const currentConfig = TIME_SLOT_VOLUME_CONFIG[currentSlot];
    const nextConfig = TIME_SLOT_VOLUME_CONFIG[nextSlot];

    // 線形補間（実装時はイージングを検討）
    return (
      currentConfig.master * (1 - progress) +
      nextConfig.master * progress
    );
  };

  return { interpolation, getInterpolatedVolume };
};
```

#### 深夜の「ほぼ無音」実装

```tsx
// late_night 時の特別処理
const handleLateNightSound = (sounds: Map<string, Audio.Sound>) => {
  const config = TIME_SLOT_VOLUME_CONFIG.late_night;
  const rules = AMBIENT_SOUND_RULES.late_night;

  // B系（時間帯差分ループ）は完全停止
  for (const [key, sound] of sounds.entries()) {
    if (key.startsWith('tod_')) {
      sound.setVolumeAsync(0, { durationMillis: 2000 });
      setTimeout(() => {
        sound.pauseAsync();
      }, 2000);
    }
  }

  // A系は極小音量に
  for (const [key, sound] of sounds.entries()) {
    if (key.startsWith('amb_')) {
      const rule = rules[key as keyof AmbientSoundRule];
      if (rule === false) {
        sound.setVolumeAsync(0, { durationMillis: 2000 });
      } else {
        sound.setVolumeAsync(
          config.master * config.ambient * 0.05, // ほぼ0
          { durationMillis: 2000 }
        );
      }
    }
  }
};
```

---

## 変更履歴

| 日付 | 更新内容 |
|------|---------|
| 2026-02-01 | 初版作成（UX-SOON P1） |

