# World Bible

## 核心思想

料理は、特別なことではない。

うまくできた日も、
少し焦げた日も、
ただキッチンに立ったという事実がある。

このアプリは、
その「立った時間」を静かに残す場所である。

成長とは、
強くなることでも、完璧になることでもない。

昨日より少し、
自分の台所が好きになること。

---

## このWorld Bibleの役割

このディレクトリには、
プロジェクトの概念的基盤となるドキュメントが格納される。

World Bibleは、
機能仕様書ではない。

すべてのUI、音、光、速度、言葉づかいが
この思想と矛盾していないかを確認するための
**最終判断基準**である。

実装上の効率よりも、
世界観の一貫性を優先する。

---

## 判断に迷ったときの優先順位

1. ユーザーの心が疲れないか
2. 記録のハードルが上がっていないか
3. 比較・競争の匂いを出していないか
4. 世界観を壊していないか

上記に反する場合、
機能の削除を検討する。

---

このディレクトリには、プロジェクトの概念的基盤となるドキュメントが格納されます。

## ドキュメント一覧

| ドキュメント | 状態 | Issue |
|-------------|------|-------|
| [core-philosophy.md](./core-philosophy.md) | ✅ 完成 | WB-002 |
| [experience-principles.md](./experience-principles.md) | ✅ 完成 | WB-003 |
| [philosophy-speed.md](./philosophy-speed.md) | ✅ 完成 | WB-004 |
| [philosophy-recording.md](./philosophy-recording.md) | ✅ 完成 | WB-005 |
| [kitchen-signals.md](./kitchen-signals.md) | ✅ 完成 | WB-006 |
| [environment-composition.md](./environment-composition.md) | ✅ 完成 | WB-007 |
| [environment-visual-tone.md](./environment-visual-tone.md) | ✅ 完成 | WB-008 |
| [lighting-concept.md](./lighting-concept.md) | ✅ 完成 | WB-009 |
| [lighting-time-rules.md](./lighting-time-rules.md) | ✅ 完成 | WB-010 |
| [sound-philosophy.md](./sound-philosophy.md) | ✅ 完成 | WB-012 |
| [sound-ambient.md](./sound-ambient.md) | ✅ 完成 | WB-013 |
| [sound-interactions.md](./sound-interactions.md) | ✅ 完成 | WB-014 |
| [microcopy-voice-tone.md](./microcopy-voice-tone.md) | ✅ 完成 | WB-015 |
| [microcopy-empty-states.md](./microcopy-empty-states.md) | ✅ 完成 | WB-016 |
| [microcopy-errors.md](./microcopy-errors.md) | ✅ 完成 | WB-017 |
| [rhythm-philosophy.md](./rhythm-philosophy.md) | ✅ 完成 | WB-018 |
| [rhythm-transitions.md](./rhythm-transitions.md) | ✅ 完成 | WB-019 |
| [photography-guidelines.md](./photography-guidelines.md) | ✅ 完成 | WB-020 |
| [temporality.md](./temporality.md) | ✅ 完成 | WB-021 |
| [philosophy-imperfection.md](./philosophy-imperfection.md) | ✅ 完成 | WB-022 |
| [philosophy-privacy.md](./philosophy-privacy.md) | ✅ 完成 | WB-023 |
| [visual-language-foundation.md](./visual-language-foundation.md) | ✅ 完成 | WB-024 |

**注記：**
- `routes-visual-tone.md` は `environment-visual-tone.md` に統合されました
- `lighting-route-modifiers.md` は作成されませんでした（環境構成は `environment-composition.md` と `lighting-time-rules.md` でカバー）

## 原則

すべてのドキュメントは以下を満たす必要があります：

1. 核心思想「料理は静かな自己回復の儀式である」と整合している
2. 具体的な設計判断に使用できる
3. 違反例が明記されている

---

## Phase 1（UX Design）への引き継ぎ事項

World Bibleで定義された方向性を、UXフェーズで具体化する必要がある項目：

### 視覚設計
- **カラーパレット**: 具体的な色コード（現在は方向性のみ定義）
- **タイポグラフィ**: フォントファミリー、サイズ体系、行間、字間の具体的な値
- **コンポーネント寸法**: ボタン、カード、余白の具体的なサイズ体系
- **アイコン**: 具体的なアイコンセットの選定とスタイルガイド

### モーション設計
- **アニメーション速度**: 具体的なミリ秒値（現在は「180〜320ms前後」などの範囲）
- **イージング関数**: 具体的なイージングカーブの定義
- **遷移パターン**: フェード・スライドの具体的な実装仕様

### 3D表現
- **3Dモデル仕様**: キッチン空間の具体的なモデル構造、テクスチャスタイル
- **ライティング設定**: 時間帯ごとの具体的な色温度・明度・彩度の数値
- **カメラアングル**: 視点の位置と動きの仕様

### 情報設計
- **棚図鑑のUI構造**: カードの配置、グリッド、スクロール方式
- **記録フローの詳細**: 画面遷移、入力UIの具体的なレイアウト
- **検索・フィルタUI**: 探索機能の具体的なインターフェース設計

### サウンド設計
- **音源ファイル**: 具体的な音源の選定と収録仕様
- **音量設定**: 各音種の具体的なdB値
- **再生タイミング**: 環境音の発生間隔の具体的なアルゴリズム

### マイクロコピー
- **文言の最終確定**: 各画面・状態での具体的な文言の決定
- **通知文言**: プッシュ通知の具体的なメッセージ

### その他
- **3層構造の詳細**: 世界・UI・演出の具体的なレイヤー設計
- **レスポンシブ対応**: 画面サイズ別の調整方針
