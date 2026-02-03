# ドキュメント統合レポート

## 実行日
2026-02-01

---

## 現状分析

### 発見された問題

1. **重複が多い領域**
   - **Lighting**: world-bible (2ファイル) + phase-1 (1ファイル) → 内容が重複
   - **Sound**: world-bible (3ファイル) + phase-1 (4ファイル) → 大幅に重複
   - **Microcopy**: world-bible (3ファイル) + phase-1 (1ファイル) → 重複
   - **UI Components**: phase-1/10-ui-components.md + 10-01〜10-12 (12ファイル) → 細分化しすぎ

2. **構造の問題**
   - phase-1/ に多数の細分化されたドキュメント（10-01〜10-12など）
   - world-bible/ と phase-1/ の境界が曖昧
   - 同じトピックが複数ファイルに分散

3. **参照の複雑さ**
   - CLAUDE.md に60以上のドキュメントが列挙されている
   - 新しい貢献者が「どこを読むべきか」が不明確

---

## 統合計画

### 新しい構造（目標）

#### World Bible（概念・哲学のみ）
- `core-philosophy.md` - 核心思想（統合済み: philosophy-speed.md, philosophy-recording.md, philosophy-imperfection.md, philosophy-privacy.md）
- `experience-principles.md` - 体験原則（統合済み: kitchen-signals.md, environment-composition.md, rhythm-philosophy.md）
- `terminology.md` - 用語辞書（維持）
- `visual-foundation.md` - 視覚言語の基礎（統合済み: visual-language-foundation.md + environment-visual-tone.md + photography-guidelines.md）
- `sound-philosophy.md` - 音の哲学（統合済み: sound-philosophy.md + sound-ambient.md + sound-interactions.md）
- `microcopy-philosophy.md` - マイクロコピーの哲学（統合済み: microcopy-voice-tone.md + microcopy-empty-states.md + microcopy-errors.md）

#### Phase 1 UX（実装仕様）
- `01-screen-flows.md` - 画面フロー（維持）
- `02-design-system.md` - デザインシステム（統合予定: 03-design-tokens.md + 04-motion-tokens.md + 10-ui-components.md + 10-01〜10-12）
- `03-assets.md` - 2.5Dアセット仕様（統合予定: 05-2_5d-asset-spec.md + 関連詳細）
- `04-lighting.md` - ライティング仕様（統合予定: 06-lighting-spec.md + world-bible/lighting-*.md）
- `05-sound.md` - サウンド仕様（統合予定: 07-sound-guidelines.md + 10-09〜10-11）
- `06-microcopy.md` - マイクロコピー仕様（統合予定: 08-microcopy-core.md + world-bible/microcopy-*.md）
- `07-accessibility.md` - アクセシビリティ要件（リネーム: 09-accessibility-requirements.md）

---

## 実行された統合

### ✅ 完了

1. **core-philosophy.md** - 以下のファイルを統合：
   - philosophy-speed.md
   - philosophy-recording.md
   - philosophy-imperfection.md
   - philosophy-privacy.md

2. **experience-principles.md** - 以下のファイルを統合：
   - kitchen-signals.md
   - environment-composition.md
   - rhythm-philosophy.md
   - temporality.md

3. **visual-foundation.md** - 以下のファイルを統合：
   - visual-language-foundation.md
   - environment-visual-tone.md
   - photography-guidelines.md

4. **sound-philosophy.md** - 以下のファイルを統合：
   - sound-ambient.md
   - sound-interactions.md

5. **microcopy-philosophy.md** - 以下のファイルを統合：
   - microcopy-voice-tone.md
   - microcopy-empty-states.md
   - microcopy-errors.md

6. **07-accessibility.md** にリネーム：
   - 09-accessibility-requirements.md

7. **03-assets.md** - 以下のファイルを統合：
   - 05-2_5d-asset-spec.md
   - 10-07-performance-budget-design.md

8. **04-lighting.md** - 以下のファイルを統合：
   - 06-lighting-spec.md
   - world-bible/lighting-concept.md
   - world-bible/lighting-time-rules.md
   - 10-08-time-gradient-interpolation-design.md

9. **05-sound.md** - 以下のファイルを統合：
   - 07-sound-guidelines.md
   - 10-09-sound-assets-design.md
   - 10-10-time-based-sound-rules.md
   - 10-11-sound-volume-dynamics-design.md

10. **06-microcopy.md** - 以下のファイルを統合：
    - 08-microcopy-core.md

11. **02-design-system.md** - 以下のファイルを統合：
    - 03-design-tokens.md
    - 04-motion-tokens.md
    - 10-ui-components.md
    - 10-01-button-visual-design.md
    - 10-02-form-elements-design.md
    - 10-03-modal-overlay-design.md
    - 10-04-shelf-card-animation-design.md
    - 10-05-card-grade-up-animation-design.md
    - 10-06-loading-states-design.md
    - 10-12-responsive-layout-design.md

12. **アーカイブ作業** - すべての統合元ファイルを `docs/_archive/` に移動し、ヘッダーを追加：
    - World Bible統合元ファイル → `docs/_archive/world-bible/`
    - Phase 1 UX統合元ファイル → `docs/_archive/ux-phase-1/`
    - 各ファイルに「このファイルはアーカイブされました」ヘッダーと新しいファイルへの参照を追加

---

## 推奨される次のステップ

1. **段階的な統合**
   - 各統合ファイルを順次作成
   - 古いファイルをアーカイブに移動
   - 内部リンクを更新

2. **CLAUDE.mdの更新**
   - 新しい構造に合わせて参照を更新
   - 「Read before implementation」セクションを追加
   - 「When making changes」チェックリストを追加

3. **リンクチェック**
   - すべての内部リンクを新しい構造に更新
   - 壊れたリンクを修正

---

## アーカイブされたファイル

以下のファイルは `docs/_archive/` に移動し、ヘッダーを追加しました：

### World Bible
- philosophy-speed.md（core-philosophy.mdに統合済み）✅
- philosophy-recording.md（core-philosophy.mdに統合済み）✅
- philosophy-imperfection.md（core-philosophy.mdに統合済み）✅
- philosophy-privacy.md（core-philosophy.mdに統合済み）✅
- lighting-concept.md（phase-1/04-lighting.mdに統合済み）✅
- lighting-time-rules.md（phase-1/04-lighting.mdに統合済み）✅
- kitchen-signals.md（experience-principles.mdに統合済み）✅
- environment-composition.md（experience-principles.mdに統合済み）✅
- rhythm-philosophy.md（experience-principles.mdに統合済み）✅
- rhythm-transitions.md（phase-1/02-design-system.mdに統合済み）✅
- temporality.md（experience-principles.mdに統合済み）✅
- visual-language-foundation.md（visual-foundation.mdに統合済み）✅
- environment-visual-tone.md（visual-foundation.mdに統合済み）✅
- photography-guidelines.md（visual-foundation.mdに統合済み）✅
- sound-ambient.md（sound-philosophy.mdに統合済み）✅
- sound-interactions.md（sound-philosophy.mdに統合済み）✅
- microcopy-voice-tone.md（microcopy-philosophy.mdに統合済み）✅
- microcopy-empty-states.md（microcopy-philosophy.mdに統合済み）✅
- microcopy-errors.md（microcopy-philosophy.mdに統合済み）✅

### Phase 1 UX
- 02-core-wireframes.md（Figma参照に置き換え可能）✅
- 02-01-common-components.md（02-design-system.mdに統合済み）✅
- 02-02-s01-top.md（Figma参照に置き換え可能）✅
- 02-03-s02-shelf.md（Figma参照に置き換え可能）✅
- 02-04-card-grade.md（Figma参照に置き換え可能）✅
- 02-05-s03-detail.md（Figma参照に置き換え可能）✅
- 02-06-s04-record.md（Figma参照に置き換え可能）✅
- 02-07-s05-explore.md（Figma参照に置き換え可能）✅
- 02-08-s06-settings.md（Figma参照に置き換え可能）✅
- 02-09-s07-onboarding.md（Figma参照に置き換え可能）✅
- 02-10-figma-todo.md（Figma参照に置き換え可能）✅
- 03-design-tokens.md（02-design-system.mdに統合済み）✅
- 04-motion-tokens.md（02-design-system.mdに統合済み）✅
- 05-2_5d-asset-spec.md（03-assets.mdに統合済み）✅
- 06-lighting-spec.md（04-lighting.mdに統合済み）✅
- 07-sound-guidelines.md（05-sound.mdに統合済み）✅
- 08-microcopy-core.md（06-microcopy.mdに統合済み）✅
- 10-ui-components.md（02-design-system.mdに統合済み）✅
- 10-01-button-visual-design.md（02-design-system.mdに統合済み）✅
- 10-02-form-elements-design.md（02-design-system.mdに統合済み）✅
- 10-03-modal-overlay-design.md（02-design-system.mdに統合済み）✅
- 10-04-shelf-card-animation-design.md（02-design-system.mdに統合済み）✅
- 10-05-card-grade-up-animation-design.md（02-design-system.mdに統合済み）✅
- 10-06-loading-states-design.md（02-design-system.mdに統合済み）✅
- 10-07-performance-budget-design.md（03-assets.mdに統合済み）✅
- 10-08-time-gradient-interpolation-design.md（04-lighting.mdに統合済み）✅
- 10-09-sound-assets-design.md（05-sound.mdに統合済み）✅
- 10-10-time-based-sound-rules.md（05-sound.mdに統合済み）✅
- 10-11-sound-volume-dynamics-design.md（05-sound.mdに統合済み）✅
- 10-12-responsive-layout-design.md（07-accessibility.mdに統合済み）✅
- figma-action-items.md（Figma参照に置き換え可能）✅
- issue-status.md（プロジェクト管理用）✅
- phase-1-mvp.md（プロジェクト管理用）✅
- phase-1-issues.md（プロジェクト管理用）✅
- pencil/（古いワイヤーフレームツール関連ファイル）✅

---

## 統合後の構造

```
docs/
├── world-bible/
│   ├── README.md
│   ├── core-philosophy.md ✅（統合済み）
│   ├── experience-principles.md ✅（統合済み）
│   ├── terminology.md ✅（維持）
│   ├── visual-foundation.md ✅（統合済み）
│   ├── sound-philosophy.md ✅（統合済み）
│   └── microcopy-philosophy.md ✅（統合済み）
├── ux/
│   └── phase-1/
│       ├── 01-screen-flows.md ✅（維持）
│       ├── 02-design-system.md ✅（統合済み）
│       ├── 03-assets.md ✅（統合済み）
│       ├── 04-lighting.md ✅（統合済み）
│       ├── 05-sound.md ✅（統合済み）
│       ├── 06-microcopy.md ✅（統合済み）
│       └── 07-accessibility.md ✅（リネーム済み）
└── _archive/
    ├── world-bible/
    │   └── (古いファイル)
    └── ux-phase-1/
        └── (古いファイル)
```

---

## 統合ルール

1. **World Bible**: 概念・哲学のみ。実装詳細は含めない。
2. **Phase 1**: 実装仕様のみ。哲学はWorld Bibleを参照。
3. **アーカイブ**: 削除は避け、`docs/_archive/`に移動。各ファイルに「このファイルはアーカイブされました」ヘッダーを追加。
4. **リンク更新**: すべての内部リンクを新しい構造に更新。

---

## 次のアクション

1. ✅ インベントリ完了
2. ✅ 統合計画作成
3. ✅ core-philosophy.md統合完了
4. ✅ 残りの統合ファイル作成完了
5. ✅ 古いファイルをアーカイブに移動完了
6. ✅ アーカイブファイルにヘッダー追加完了
7. ⏳ リンク更新（必要に応じて）
8. ✅ CLAUDE.md更新完了
9. ✅ レポート作成（本ファイル）

---

## 注意事項

- 統合は段階的に実行することを推奨します
- 各統合ファイルを作成する際は、元のファイルの内容をすべて含めるようにしてください
- アーカイブファイルには、新しいファイルへの参照を追加してください
- すべての内部リンクを更新する前に、統合を完了してください

