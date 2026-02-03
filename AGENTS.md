# Claude Code への指示

このプロジェクトで作業する際は、**必ず以下のドキュメントを参照し、その内容を頭に入れた上で作業してください**。

## プロジェクト概要

**わたしの台所図鑑 (Watashi no Daidokoro Zukan)** は、感覚的な料理ジャーナルアプリです。
レシピ管理や在庫追跡ではなく、料理を個人的な儀式として記録する体験駆動型アーカイブです。

核心思想: **「料理は静かな自己回復の儀式である」**

---

## ⚠️ 実装前に必ず読む

**以下のドキュメントを実装前に必ず読んでください。実装を開始する前に、これらの内容を理解している必要があります。**

### 1. World Bible（概念的基盤）

World Bibleは機能仕様書ではなく、すべてのUI、音、光、速度、言葉づかいがこの思想と矛盾していないかを確認するための**最終判断基準**です。

1. **[core-philosophy.md](docs/world-bible/core-philosophy.md)** - 核心思想「料理は静かな自己回復の儀式である」の定義と、UI・音・速度・言葉づかい・演出への影響
2. **[experience-principles.md](docs/world-bible/experience-principles.md)** - 核心思想から導かれる具体的な体験設計原則
3. **[terminology.md](docs/world-bible/terminology.md)** - 用語辞書（主要概念の日本語名・英語識別子・定義）

### 2. Phase 1 UX（実装仕様）

Phase 1 UXは、World Bibleで定義された方向性を具体的な実装仕様に落とし込んだものです。

1. **[01-screen-flows.md](docs/ux/phase-1/01-screen-flows.md)** - 画面フロー定義
2. **[02-design-system.md](docs/ux/phase-1/02-design-system.md)** - デザインシステム（トークン、コンポーネント、モーション）
3. **[03-assets.md](docs/ux/phase-1/03-assets.md)** - 2.5Dアセット仕様
4. **[04-lighting.md](docs/ux/phase-1/04-lighting.md)** - ライティング仕様
5. **[05-sound.md](docs/ux/phase-1/05-sound.md)** - サウンド仕様
6. **[06-microcopy.md](docs/ux/phase-1/06-microcopy.md)** - マイクロコピー仕様
7. **[07-accessibility.md](docs/ux/phase-1/07-accessibility.md)** - アクセシビリティ要件

---

## 変更時のチェックリスト

実装や仕様変更を行う際は、以下の順序で作業してください：

1. **✅ 正規ドキュメントを更新**
   - World Bible（概念・哲学の変更の場合）
   - Phase 1 UX（実装仕様の変更の場合）
   - 重複したドキュメントを作らない

2. **✅ コードを実装**
   - 更新したドキュメントに基づいて実装
   - ドキュメントと実装の整合性を保つ

3. **✅ イシューの受け入れ条件を更新**
   - 必要に応じて、関連イシューの受け入れ条件を更新
   - 正規ドキュメントへのリンクを追加

---

## ドキュメントの単一の真実の源（Single Source of Truth）

### 原則

- **World Bible**: 概念・哲学のみ。実装詳細は含めない。
- **Phase 1 UX**: 実装仕様のみ。哲学はWorld Bibleを参照。
- **重複を避ける**: 同じ情報を複数のドキュメントに書かない。
- **正規ドキュメントを更新**: 変更時は正規ドキュメントを先に更新する。

### イシューでの参照方法

イシューやPRでドキュメントを参照する際は、正規ドキュメントへのリンクを使用してください：

- ✅ `docs/world-bible/core-philosophy.md`
- ✅ `docs/ux/phase-1/02-design-system.md`
- ❌ `docs/ux/phase-1/10-01-button-visual-design.md`（統合済み）

---

## 詳細ドキュメント一覧（参考）

以下は参考情報です。実装時は上記の正規ドキュメントを参照してください。

### World Bible（概念的基盤）

**注**: 以下のドキュメントは統合中です。詳細は `docs/_consolidation-report.md` を参照してください。

#### 統合済みドキュメント

- **[core-philosophy.md](docs/world-bible/core-philosophy.md)** - 核心思想（速さ・記録・不完全・プライバシーの哲学を含む）
- **[experience-principles.md](docs/world-bible/experience-principles.md)** - 体験設計原則
- **[terminology.md](docs/world-bible/terminology.md)** - 用語辞書

#### 統合予定ドキュメント（段階的に統合中）

以下のドキュメントは、上記の正規ドキュメントに統合予定です：

- `visual-foundation.md`（統合予定: visual-language-foundation.md + environment-visual-tone.md + photography-guidelines.md）
- `sound-philosophy.md`（統合予定: sound-philosophy.md + sound-ambient.md + sound-interactions.md）
- `microcopy-philosophy.md`（統合予定: microcopy-voice-tone.md + microcopy-empty-states.md + microcopy-errors.md）

### Phase 1 UX（実装仕様）

**注**: 以下のドキュメントは統合中です。詳細は `docs/_consolidation-report.md` を参照してください。

#### 正規ドキュメント（統合予定）

- **[01-screen-flows.md](docs/ux/phase-1/01-screen-flows.md)** - 画面フロー定義
- **[02-design-system.md](docs/ux/phase-1/02-design-system.md)** - デザインシステム（統合予定: 03-design-tokens.md + 04-motion-tokens.md + 10-ui-components.md + 10-01〜10-12）
- **[03-assets.md](docs/ux/phase-1/03-assets.md)** - 2.5Dアセット仕様（統合予定: 05-2_5d-asset-spec.md + 関連詳細）
- **[04-lighting.md](docs/ux/phase-1/04-lighting.md)** - ライティング仕様（統合予定: 06-lighting-spec.md + world-bible/lighting-*.md）
- **[05-sound.md](docs/ux/phase-1/05-sound.md)** - サウンド仕様（統合予定: 07-sound-guidelines.md + 10-09〜10-11）
- **[06-microcopy.md](docs/ux/phase-1/06-microcopy.md)** - マイクロコピー仕様（統合予定: 08-microcopy-core.md + world-bible/microcopy-*.md）
- **[07-accessibility.md](docs/ux/phase-1/07-accessibility.md)** - アクセシビリティ要件（リネーム予定: 09-accessibility-requirements.md）

#### 旧ドキュメント（統合予定）

以下のドキュメントは、上記の正規ドキュメントに統合予定です：

- `03-design-tokens.md` → `02-design-system.md`
- `04-motion-tokens.md` → `02-design-system.md`
- `05-2_5d-asset-spec.md` → `03-assets.md`
- `06-lighting-spec.md` → `04-lighting.md`
- `07-sound-guidelines.md` → `05-sound.md`
- `08-microcopy-core.md` → `06-microcopy.md`
- `09-accessibility-requirements.md` → `07-accessibility.md`
- `10-ui-components.md` + `10-01〜10-12` → `02-design-system.md`

## 重要な注意事項

### ドキュメントの統合について

**`docs/` 配下のドキュメントは統合中です。**

作業を開始する前に、必ず以下を確認してください：

1. **正規ドキュメントを確認**: 上記の「実装前に必ず読む」セクションに記載されている正規ドキュメントを確認してください
2. **統合レポートを参照**: `docs/_consolidation-report.md` で統合状況を確認してください
3. **World Bibleとの整合性**: すべての実装は、World Bibleで定義された核心思想と矛盾していないか確認してください
4. **重複を避ける**: 同じ情報を複数のドキュメントに書かないでください。正規ドキュメントを更新してください

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
- **`docs/ux/phase-1/` 配下の正規ドキュメントに定義された仕様は、実装の際に必ず参照し、その内容に基づいて実装すること**
  - デザインシステム（UIコンポーネント、ボタン、フォーム、モーダル、アニメーション、レスポンシブ）は `02-design-system.md` を参照
  - 2.5Dアセット（パフォーマンス含む）は `03-assets.md` を参照
  - ライティング（時間帯グラデーション含む）は `04-lighting.md` を参照
  - サウンド（アセット、時間帯変化、音量含む）は `05-sound.md` を参照
  - マイクロコピーは `06-microcopy.md` を参照
  - アクセシビリティは `07-accessibility.md` を参照

## 作業フロー

1. **正規ドキュメント確認**: 上記の「実装前に必ず読む」セクションに記載されている正規ドキュメントを確認
2. **World Bibleとの整合性チェック**: 実装が核心思想と矛盾していないか確認
3. **実装**: 正規ドキュメントに基づいて実装
4. **ドキュメント更新**: 変更がある場合は、正規ドキュメントを更新（重複を作らない）
5. **最終確認**: 実装がすべての原則を満たしているか確認

---

**重要**: このプロジェクトでは、機能の完成度よりも、世界観の一貫性とユーザー体験の質を優先します。
すべての判断は、World Bibleで定義された核心思想「料理は静かな自己回復の儀式である」に基づいて行ってください。

