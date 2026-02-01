# Claude Code への指示

このプロジェクトで作業する際は、**必ず以下のドキュメントを参照し、その内容を頭に入れた上で作業してください**。

## プロジェクト概要

**わたしの台所図鑑 (Watashi no Daidokoro Zukan)** は、感覚的な料理ジャーナルアプリです。
レシピ管理や在庫追跡ではなく、料理を個人的な儀式として記録する体験駆動型アーカイブです。

核心思想: **「料理は静かな自己回復の儀式である」**

## 必須参照ドキュメント

### World Bible（概念的基盤）

`docs/world-bible/` 配下には、プロジェクトの概念的基盤となるドキュメントが格納されています。
World Bibleは機能仕様書ではなく、すべてのUI、音、光、速度、言葉づかいがこの思想と矛盾していないかを確認するための**最終判断基準**です。

#### 主要ドキュメント

- **[README.md](docs/world-bible/README.md)** - World Bibleの概要と全ドキュメント一覧
- **[terminology.md](docs/world-bible/terminology.md)** - 用語辞書（主要概念の日本語名・英語識別子・定義）
- **[core-philosophy.md](docs/world-bible/core-philosophy.md)** - 核心思想の定義とUI・音・速度・言葉づかい・演出への影響
- **[experience-principles.md](docs/world-bible/experience-principles.md)** - 核心思想から導かれる具体的な体験設計原則
- **[philosophy-speed.md](docs/world-bible/philosophy-speed.md)** - 速さの哲学
- **[philosophy-recording.md](docs/world-bible/philosophy-recording.md)** - 記録の哲学
- **[philosophy-imperfection.md](docs/world-bible/philosophy-imperfection.md)** - 不完全でよいという原則
- **[philosophy-privacy.md](docs/world-bible/philosophy-privacy.md)** - 完全にプライベートな空間の原則
- **[kitchen-signals.md](docs/world-bible/kitchen-signals.md)** - Kitchen Signalsの仕組み
- **[environment-composition.md](docs/world-bible/environment-composition.md)** - 環境構成ルール
- **[environment-visual-tone.md](docs/world-bible/environment-visual-tone.md)** - 視覚トーンの方向性とムード
- **[lighting-concept.md](docs/world-bible/lighting-concept.md)** - ライティング温度システムの概念
- **[lighting-time-rules.md](docs/world-bible/lighting-time-rules.md)** - 時間帯ライティング変化ルール
- **[sound-philosophy.md](docs/world-bible/sound-philosophy.md)** - 音の哲学
- **[sound-ambient.md](docs/world-bible/sound-ambient.md)** - アンビエントサウンド設計方針
- **[sound-interactions.md](docs/world-bible/sound-interactions.md)** - インタラクションサウンド設計方針
- **[microcopy-voice-tone.md](docs/world-bible/microcopy-voice-tone.md)** - マイクロコピーの声と調子
- **[microcopy-empty-states.md](docs/world-bible/microcopy-empty-states.md)** - 空状態メッセージの哲学
- **[microcopy-errors.md](docs/world-bible/microcopy-errors.md)** - エラーメッセージの哲学
- **[rhythm-philosophy.md](docs/world-bible/rhythm-philosophy.md)** - インタラクションリズムの哲学
- **[rhythm-transitions.md](docs/world-bible/rhythm-transitions.md)** - 画面遷移アニメーションの方向性
- **[photography-guidelines.md](docs/world-bible/photography-guidelines.md)** - 料理写真のガイドライン
- **[temporality.md](docs/world-bible/temporality.md)** - 季節と時間の表現
- **[visual-language-foundation.md](docs/world-bible/visual-language-foundation.md)** - 視覚言語の基礎方向性

### UX Design（Phase 1）

`docs/ux/phase-1/` 配下には、UX設計に関する具体的な仕様が格納されています。

#### 主要ドキュメント

- **[01-screen-flows.md](docs/ux/phase-1/01-screen-flows.md)** - 画面フロー定義
- **[02-core-wireframes.md](docs/ux/phase-1/02-core-wireframes.md)** - コアワイヤーフレーム
- **[03-design-tokens.md](docs/ux/phase-1/03-design-tokens.md)** - デザイントークン定義
- **[04-motion-tokens.md](docs/ux/phase-1/04-motion-tokens.md)** - モーショントークン定義
- **[05-2_5d-asset-spec.md](docs/ux/phase-1/05-2_5d-asset-spec.md)** - 2.5Dアセット仕様
- **[06-lighting-spec.md](docs/ux/phase-1/06-lighting-spec.md)** - ライティング仕様
- **[07-sound-guidelines.md](docs/ux/phase-1/07-sound-guidelines.md)** - サウンドガイドライン
- **[08-microcopy-core.md](docs/ux/phase-1/08-microcopy-core.md)** - コアマイクロコピー
- **[09-accessibility-requirements.md](docs/ux/phase-1/09-accessibility-requirements.md)** - アクセシビリティ要件
- **[phase-1-mvp.md](docs/ux/phase-1-mvp.md)** - Phase 1 MVP定義
- **[phase-1-issues.md](docs/ux/phase-1-issues.md)** - Phase 1 課題

## 重要な注意事項

### ドキュメントの増加について

**`docs/` 配下のドキュメントは今後も増える可能性があります。**

作業を開始する前に、必ず以下を確認してください：

1. **最新のドキュメント構造を確認**: `docs/` 配下のディレクトリ構造を確認し、新しいドキュメントがないかチェックしてください
2. **関連ドキュメントを探索**: 作業内容に関連する可能性のあるドキュメントを探し、必ず参照してください
3. **World Bibleとの整合性**: すべての実装は、World Bibleで定義された核心思想と矛盾していないか確認してください

### 判断に迷ったときの優先順位

1. ユーザーの心が疲れないか
2. 記録のハードルが上がっていないか
3. 比較・競争の匂いを出していないか
4. 世界観を壊していないか

上記に反する場合、機能の削除を検討してください。

### 実装時の原則

- **実装上の効率よりも、世界観の一貫性を優先する**
- **すべてのUI、音、光、速度、言葉づかいは、核心思想と整合している必要がある**
- **World Bibleで定義された方向性に反する実装は行わない**

## 作業フロー

1. **ドキュメント確認**: 作業内容に関連する `docs/` 配下のドキュメントを確認
2. **World Bibleとの整合性チェック**: 実装が核心思想と矛盾していないか確認
3. **実装**: ドキュメントに基づいて実装
4. **最終確認**: 実装がすべての原則を満たしているか確認

---

**重要**: このプロジェクトでは、機能の完成度よりも、世界観の一貫性とユーザー体験の質を優先します。
すべての判断は、World Bibleで定義された核心思想「料理は静かな自己回復の儀式である」に基づいて行ってください。

