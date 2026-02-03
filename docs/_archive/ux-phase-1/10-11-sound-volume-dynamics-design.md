> **⚠️ このファイルはアーカイブされました**
>
> このファイルの内容は `docs/ux/phase-1/05-sound.md` に統合されました。
> 最新の情報はそちらを参照してください。
>
> ---

# 10-11: 各サウンドタイプの音量レンジとダイナミクス
_Sound Volume Range & Dynamics Specification_

**UX-SOON P1**

---

## 概要

このドキュメントは、各サウンドタイプの相対音量レンジ（dB相当）と、同時再生時のミックス規則を定義します。

「イヤホンなしで気づかない程度」を基準に、音は演出ではなく「空気」として、主張しないが確かにそこに在る存在感を実現します。

**関連ドキュメント:**
- [10-09-sound-assets-design.md](./10-09-sound-assets-design.md) - 環境音アセットリスト定義
- [10-10-time-based-sound-rules.md](./10-10-time-based-sound-rules.md) - 時間帯に応じたサウンド変化ルール
- [07-sound-guidelines.md](./07-sound-guidelines.md) - サウンドガイドライン
- [../world-bible/sound-philosophy.md](../world-bible/sound-philosophy.md) - 音の哲学

---

## 0) 前提（用語と基準）

### dB相当について

本仕様の「dB相当」は、実装上の正確なdBFS測定ではなく、体感音量を揃えるための目安。
最終的には実機（スピーカー）で耳合わせし、微調整する。

### 基準となる環境

- **iPhone/Android の 本体スピーカー**
- **端末音量：中（50%）**
- **周囲環境：静かな室内**
- **目標：集中していないと気づかない / 気づいても気にならない**

---

## 1) サウンドタイプ定義（UX-053整合）

| Type | 例 | 役割 |
|------|-----|------|
| A: 環境音（Base Ambience） | 冷蔵庫、空気、遠景生活音 | 世界の「床」 |
| B: 動作音（Diegetic Actions） | 食器が触れる、軽い置く音、引き出し | "気配"のアクセント |
| C: 儀式音（Ritual UI） | 記録完了音、保存の気配 | 操作の完了を「静かに」伝える |

---

## 2) 音量レンジ（dB相当）

### 2-1. 推奨レンジ（耳合わせの初期値）

| Type | 平均（RMS相当） | ピーク（瞬間） | 備考 |
|------|----------------|---------------|------|
| A: 環境音 | -40〜-30 dB | -30〜-24 dB | "気づかない"が基準。気づくなら下げる |
| B: 動作音 | -30〜-25 dB | -22〜-18 dB | 小〜中。単発で「そこにある」程度 |
| C: 儀式音 | -28〜-22 dB | -18〜-14 dB | 一瞬だけ少し上げる（0.2〜0.6秒） |

### 2-2. late_night（深夜）の例外

- **A（環境音）：さらに -10dB相当**（体感で半分以下）
- **B（動作音）：原則鳴らさない**（または極小）
- **C（儀式音）：通常の 35%**（先の時間帯ルールに準拠）

---

## 3) マスターボリュームとの関係

### 3-1. マスターの意味

アプリ内「音の演出（ON/OFF）」は マスターとする（個別種別は持たない方針）。

- **ON：以下のミックスが適用される**
- **OFF：全サウンド停止**（例外なし）

### 3-2. マスター×タイプの合成

最終出力は以下の乗算で決める：

```
FinalGain = MasterGain * TimeSlotGain * TypeGain * ClipGain
```

- **MasterGain：** ユーザー設定（ON/OFFのみなら 1 or 0）
- **TimeSlotGain：** 時間帯係数（UX-048/前イシューの表）
- **TypeGain：** Typeごとの固定係数（A/B/Cのバランス）
- **ClipGain：** 素材ごとの微調整（個体差を吸収）

**ポイント：** dBレンジを守るには「素材の録り/生成の段階で揃える」＋「ClipGainで微調整」する。

---

## 4) 同時再生時のミックスルール（重要）

### 4-1. 同時再生の上限（チャンネル数）

- **A（環境音）：同時 最大2トラック**
  - 例：`room_air` + `fridge_hum`
- **B（動作音）：同時 最大1音**（連続トリガーは抑制）
- **C（儀式音）：同時 最大1音**（重ねない）

### 4-2. 優先順位（ダッキング）

**優先順位：C > B > A**

- **C再生中（0.2〜0.6秒）：**
  - **Aを -3〜-6 dB相当ダッキング**（ふっと下げる）
  - **Bは原則鳴らさない**（ぶつかるため）
- **B再生中（単発）：**
  - **Aを -1〜-3 dB相当軽くダッキング**（任意）
- **Aは常に床：前に出ない**

### 4-3. 連続トリガー抑制（せわしない防止）

- **B（動作音）は 1.2秒クールダウン**（連打で鳴らない）
- **C（儀式音）は 2.0秒クールダウン**
- **連続操作でも「音が増えない」設計にする**

---

## 5) ダイナミクス（時間変化・ゆらぎの方針）

### 5-1. A（環境音）

- **ループは完全固定ではなく、微小な揺れを許容**
- **例：±1dB相当を 30〜90秒周期で緩やかに**
- **ただし"うねり"が目立つなら固定に戻す**

### 5-2. B（動作音）

- **1回の発音は短く（80〜250ms中心）**
- **連続時に"カタカタ"にならないよう、抑制を優先**

### 5-3. C（儀式音）

- **立ち上がり：速い**（認知できる）
- **余韻：短い**（浸食しない）
- **音色：金属的・電子的を避け、やわらかい素材感**（木/布/陶器/紙）

---

## 6) 端末音量との連動方針

- **端末のメディア音量に従う**（iOS/Android標準）
- **アプリ内に スライダーは置かない**（設定疲れを増やさない）
- **無音でも成立する：音は「必須情報」を担わない**
- **音がOFFでもUXが欠損しない**（視覚・触覚で完結）

---

## 7) 受け入れ条件チェック（Done条件）

以下の項目をすべて満たすこと:

- [ ] サウンドタイプ定義（A/B/C）が定義されている
- [ ] 音量レンジ（dB相当、推奨レンジ、深夜例外）が定義されている
- [ ] マスターボリュームとの関係（合成式、係数）が定義されている
- [ ] 同時再生時のミックスルール（上限、優先順位、連続トリガー抑制）が定義されている
- [ ] ダイナミクス（時間変化・ゆらぎの方針）が定義されている
- [ ] 端末音量との連動方針が明記されている

---

## 実装ガイドライン

### React Native 実装例（参考）

#### 音量レンジの定義

```tsx
// サウンドタイプ
type SoundType = 'ambient' | 'action' | 'ritual';

// 音量レンジ設定
interface VolumeRange {
  average: number; // RMS相当（dB）
  peak: number; // ピーク（dB）
}

const VOLUME_RANGES: Record<SoundType, VolumeRange> = {
  ambient: {
    average: -35, // -40〜-30 dB
    peak: -27, // -30〜-24 dB
  },
  action: {
    average: -27.5, // -30〜-25 dB
    peak: -20, // -22〜-18 dB
  },
  ritual: {
    average: -25, // -28〜-22 dB
    peak: -16, // -18〜-14 dB
  },
};

// dBから線形ゲインへの変換（簡易版）
const dbToGain = (db: number): number => {
  return Math.pow(10, db / 20);
};

// 深夜時の例外
const getLateNightVolume = (type: SoundType, baseGain: number): number => {
  if (type === 'ambient') {
    return baseGain * dbToGain(-10); // さらに -10dB相当
  } else if (type === 'action') {
    return 0; // 原則鳴らさない
  } else if (type === 'ritual') {
    return baseGain * 0.35; // 通常の35%
  }
  return baseGain;
};
```

#### マスター×タイプの合成

```tsx
// 最終ゲイン計算
const calculateFinalGain = (
  masterGain: number, // 1 or 0（ON/OFF）
  timeSlotGain: number, // 時間帯係数（10-10から）
  typeGain: number, // Typeごとの固定係数
  clipGain: number = 1.0 // 素材ごとの微調整
): number => {
  return masterGain * timeSlotGain * typeGain * clipGain;
};

// Typeごとの固定係数（A/B/Cのバランス）
const TYPE_GAINS: Record<SoundType, number> = {
  ambient: 1.0, // 基準
  action: 1.2, // 少し前に出る
  ritual: 1.5, // 一瞬だけ前に出る
};

// 使用例
const finalGain = calculateFinalGain(
  1.0, // Master ON
  0.75, // night 時間帯係数
  TYPE_GAINS.ambient, // A系
  1.0 // クリップゲイン（微調整なし）
);
```

#### 同時再生時のミックス管理

```tsx
import { Audio } from 'expo-av';

// 同時再生管理
class SoundMixer {
  private ambientSounds: Map<string, Audio.Sound> = new Map();
  private actionSound: Audio.Sound | null = null;
  private ritualSound: Audio.Sound | null = null;
  
  private lastActionTime: number = 0;
  private lastRitualTime: number = 0;
  
  private readonly ACTION_COOLDOWN = 1200; // 1.2秒
  private readonly RITUAL_COOLDOWN = 2000; // 2.0秒

  // A（環境音）の再生
  async playAmbient(key: string, sound: Audio.Sound, volume: number) {
    // 最大2トラックまで
    if (this.ambientSounds.size >= 2 && !this.ambientSounds.has(key)) {
      // 既存の音を停止（FIFO）
      const firstKey = Array.from(this.ambientSounds.keys())[0];
      const firstSound = this.ambientSounds.get(firstKey);
      firstSound?.setVolumeAsync(0, { durationMillis: 1000 });
      setTimeout(() => {
        firstSound?.unloadAsync();
        this.ambientSounds.delete(firstKey);
      }, 1000);
    }

    await sound.setVolumeAsync(volume);
    await sound.playAsync();
    this.ambientSounds.set(key, sound);
  }

  // B（動作音）の再生
  async playAction(sound: Audio.Sound, volume: number) {
    const now = Date.now();
    
    // クールダウンチェック
    if (now - this.lastActionTime < this.ACTION_COOLDOWN) {
      return; // 連続トリガー抑制
    }

    // C再生中は原則鳴らさない
    if (this.ritualSound) {
      return;
    }

    // Aを軽くダッキング（-1〜-3 dB相当）
    const duckingGain = dbToGain(-2); // -2dB相当
    for (const ambientSound of this.ambientSounds.values()) {
      const currentVolume = await ambientSound.getStatusAsync().then(s => s.volume || 0);
      await ambientSound.setVolumeAsync(currentVolume * duckingGain, {
        durationMillis: 100,
      });
    }

    await sound.setVolumeAsync(volume);
    await sound.playAsync();
    this.actionSound = sound;
    this.lastActionTime = now;

    // 再生完了後にAを戻す
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish) {
        for (const ambientSound of this.ambientSounds.values()) {
          const currentVolume = await ambientSound.getStatusAsync().then(s => s.volume || 0);
          await ambientSound.setVolumeAsync(currentVolume / duckingGain, {
            durationMillis: 200,
          });
        }
        sound.unloadAsync();
        this.actionSound = null;
      }
    });
  }

  // C（儀式音）の再生
  async playRitual(sound: Audio.Sound, volume: number) {
    const now = Date.now();
    
    // クールダウンチェック
    if (now - this.lastRitualTime < this.RITUAL_COOLDOWN) {
      return; // 連続トリガー抑制
    }

    // Aをダッキング（-3〜-6 dB相当）
    const duckingGain = dbToGain(-4.5); // -4.5dB相当
    for (const ambientSound of this.ambientSounds.values()) {
      const currentVolume = await ambientSound.getStatusAsync().then(s => s.volume || 0);
      await ambientSound.setVolumeAsync(currentVolume * duckingGain, {
        durationMillis: 150,
      });
    }

    await sound.setVolumeAsync(volume);
    await sound.playAsync();
    this.ritualSound = sound;
    this.lastRitualTime = now;

    // 再生完了後にAを戻す
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish) {
        for (const ambientSound of this.ambientSounds.values()) {
          const currentVolume = await ambientSound.getStatusAsync().then(s => s.volume || 0);
          await ambientSound.setVolumeAsync(currentVolume / duckingGain, {
            durationMillis: 300,
          });
        }
        sound.unloadAsync();
        this.ritualSound = null;
      }
    });
  }
}
```

#### ダイナミクス（ゆらぎ）の実装

```tsx
// A（環境音）の微小な揺れ
const applyAmbientVariation = async (sound: Audio.Sound, baseVolume: number) => {
  const variationPeriod = 60000; // 60秒周期
  const variationAmount = dbToGain(1); // ±1dB相当

  const animate = () => {
    const time = Date.now() % variationPeriod;
    const progress = time / variationPeriod;
    
    // サイン波でゆらぎ
    const variation = Math.sin(progress * Math.PI * 2) * variationAmount;
    const currentVolume = baseVolume * (1 + variation);
    
    sound.setVolumeAsync(currentVolume, { durationMillis: 100 });
  };

  const interval = setInterval(animate, 100); // 100msごとに更新

  return () => clearInterval(interval);
};
```

#### 端末音量との連動

```tsx
import { Audio } from 'expo-av';

// 端末音量に従う（iOS/Android標準）
const setupAudioMode = async () => {
  await Audio.setAudioModeAsync({
    playsInSilentModeIOS: true,
    staysActiveInBackground: false,
    // 端末のメディア音量に従う（デフォルト動作）
  });
};

// アプリ内スライダーは置かない
// 音は「必須情報」を担わないため、OFFでもUXが完結する
```

---

## 変更履歴

| 日付 | 更新内容 |
|------|---------|
| 2026-02-01 | 初版作成（UX-SOON P1） |

