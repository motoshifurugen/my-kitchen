# ドキュメント統合計画

## 現状分析

### 問題点

1. **重複が多い領域**
   - Lighting: world-bible (2ファイル) + phase-1 (1ファイル) → 内容が重複
   - Sound: world-bible (3ファイル) + phase-1 (4ファイル) → 大幅に重複
   - Microcopy: world-bible (3ファイル) + phase-1 (1ファイル) → 重複
   - UI Components: phase-1/10-ui-components.md + 10-01〜10-12 (12ファイル) → 細分化しすぎ

2. **構造の問題**
   - phase-1/ に多数の細分化されたドキュメント（10-01〜10-12など）
   - world-bible/ と phase-1/ の境界が曖昧
   - 同じトピックが複数ファイルに分散

3. **参照の複雑さ**
   - CLAUDE.md に60以上のドキュメントが列挙されている
   - 新しい貢献者が「どこを読むべきか」が不明確

---

## 新しい構造（目標）

### World Bible（概念・哲学のみ）
- `core-philosophy.md` - 核心思想（既存、維持）
- `experience-principles.md` - 体験原則（既存、維持）
- `terminology.md` - 用語辞書（既存、維持）
- `visual-foundation.md` - 視覚言語の基礎（統合: visual-language-foundation.md + environment-visual-tone.md + photography-guidelines.md）
- `sound-philosophy.md` - 音の哲学（統合: sound-philosophy.md + sound-ambient.md + sound-interactions.md）
- `microcopy-philosophy.md` - マイクロコピーの哲学（統合: microcopy-voice-tone.md + microcopy-empty-states.md + microcopy-errors.md）

**その他のworld-bibleファイル**: アーカイブまたは削除（内容はphase-1に統合）

### Phase 1 UX（実装仕様）
- `01-screen-flows.md` - 画面フロー（既存、維持）
- `02-design-system.md` - デザインシステム（統合: 03-design-tokens.md + 04-motion-tokens.md + 10-ui-components.md + 10-01〜10-12）
- `03-assets.md` - 2.5Dアセット仕様（統合: 05-2_5d-asset-spec.md + 関連詳細）
- `04-lighting.md` - ライティング仕様（統合: 06-lighting-spec.md + world-bible/lighting-*.md）
- `05-sound.md` - サウンド仕様（統合: 07-sound-guidelines.md + 10-09〜10-11）
- `06-microcopy.md` - マイクロコピー仕様（統合: 08-microcopy-core.md + world-bible/microcopy-*.md）
- `07-accessibility.md` - アクセシビリティ要件（既存: 09-accessibility-requirements.md、リネーム）

**その他のphase-1ファイル**: アーカイブまたは削除

---

## マッピング表

| 旧ファイル | 新ファイル | アクション | 理由 |
|----------|----------|----------|------|
| **World Bible** |
| core-philosophy.md | core-philosophy.md | 維持 | 核心思想、変更なし |
| experience-principles.md | experience-principles.md | 維持 | 体験原則、変更なし |
| terminology.md | terminology.md | 維持 | 用語辞書、変更なし |
| visual-language-foundation.md | visual-foundation.md | 統合 | 視覚言語の基礎に統合 |
| environment-visual-tone.md | visual-foundation.md | 統合 | 視覚トーンを統合 |
| photography-guidelines.md | visual-foundation.md | 統合 | 写真ガイドラインを統合 |
| sound-philosophy.md | sound-philosophy.md | 統合 | 音の哲学に統合 |
| sound-ambient.md | sound-philosophy.md | 統合 | アンビエントを統合 |
| sound-interactions.md | sound-philosophy.md | 統合 | インタラクションを統合 |
| microcopy-voice-tone.md | microcopy-philosophy.md | 統合 | マイクロコピー哲学に統合 |
| microcopy-empty-states.md | microcopy-philosophy.md | 統合 | 空状態を統合 |
| microcopy-errors.md | microcopy-philosophy.md | 統合 | エラーを統合 |
| lighting-concept.md | _archive/ | アーカイブ | phase-1/04-lighting.mdに統合済み |
| lighting-time-rules.md | _archive/ | アーカイブ | phase-1/04-lighting.mdに統合済み |
| philosophy-speed.md | core-philosophy.md | 統合 | 核心思想に統合 |
| philosophy-recording.md | core-philosophy.md | 統合 | 核心思想に統合 |
| philosophy-imperfection.md | core-philosophy.md | 統合 | 核心思想に統合 |
| philosophy-privacy.md | core-philosophy.md | 統合 | 核心思想に統合 |
| kitchen-signals.md | experience-principles.md | 統合 | 体験原則に統合 |
| environment-composition.md | experience-principles.md | 統合 | 体験原則に統合 |
| rhythm-philosophy.md | experience-principles.md | 統合 | 体験原則に統合 |
| rhythm-transitions.md | phase-1/02-design-system.md | 統合 | デザインシステムに統合 |
| temporality.md | phase-1/04-lighting.md | 統合 | ライティング仕様に統合 |
| **Phase 1 UX** |
| 01-screen-flows.md | 01-screen-flows.md | 維持 | 画面フロー、変更なし |
| 02-core-wireframes.md | _archive/ | アーカイブ | Figma参照に置き換え可能 |
| 03-design-tokens.md | 02-design-system.md | 統合 | デザインシステムに統合 |
| 04-motion-tokens.md | 02-design-system.md | 統合 | デザインシステムに統合 |
| 05-2_5d-asset-spec.md | 03-assets.md | 統合 | アセット仕様に統合 |
| 06-lighting-spec.md | 04-lighting.md | 統合 | ライティング仕様に統合 |
| 07-sound-guidelines.md | 05-sound.md | 統合 | サウンド仕様に統合 |
| 08-microcopy-core.md | 06-microcopy.md | 統合 | マイクロコピー仕様に統合 |
| 09-accessibility-requirements.md | 07-accessibility.md | リネーム | アクセシビリティ要件 |
| 10-ui-components.md | 02-design-system.md | 統合 | デザインシステムに統合 |
| 10-01-button-visual-design.md | 02-design-system.md | 統合 | デザインシステムに統合 |
| 10-02-form-elements-design.md | 02-design-system.md | 統合 | デザインシステムに統合 |
| 10-03-modal-overlay-design.md | 02-design-system.md | 統合 | デザインシステムに統合 |
| 10-04-shelf-card-animation-design.md | 02-design-system.md | 統合 | デザインシステムに統合 |
| 10-05-card-grade-up-animation-design.md | 02-design-system.md | 統合 | デザインシステムに統合 |
| 10-06-loading-states-design.md | 02-design-system.md | 統合 | デザインシステムに統合 |
| 10-07-performance-budget-design.md | 03-assets.md | 統合 | アセット仕様に統合 |
| 10-08-time-gradient-interpolation-design.md | 04-lighting.md | 統合 | ライティング仕様に統合 |
| 10-09-sound-assets-design.md | 05-sound.md | 統合 | サウンド仕様に統合 |
| 10-10-time-based-sound-rules.md | 05-sound.md | 統合 | サウンド仕様に統合 |
| 10-11-sound-volume-dynamics-design.md | 05-sound.md | 統合 | サウンド仕様に統合 |
| 10-12-responsive-layout-design.md | 02-design-system.md | 統合 | デザインシステムに統合 |
| phase-1-mvp.md | _archive/ | アーカイブ | プロジェクト管理用、参照のみ |
| phase-1-issues.md | _archive/ | アーカイブ | プロジェクト管理用、参照のみ |

---

## 統合後の構造

```
docs/
├── world-bible/
│   ├── README.md
│   ├── core-philosophy.md
│   ├── experience-principles.md
│   ├── terminology.md
│   ├── visual-foundation.md (新規統合)
│   ├── sound-philosophy.md (統合)
│   └── microcopy-philosophy.md (新規統合)
├── ux/
│   └── phase-1/
│       ├── 01-screen-flows.md
│       ├── 02-design-system.md (新規統合)
│       ├── 03-assets.md (統合)
│       ├── 04-lighting.md (統合)
│       ├── 05-sound.md (統合)
│       ├── 06-microcopy.md (統合)
│       └── 07-accessibility.md (リネーム)
└── _archive/
    └── (古いファイル)
```

---

## 統合ルール

1. **World Bible**: 概念・哲学のみ。実装詳細は含めない。
2. **Phase 1**: 実装仕様のみ。哲学はWorld Bibleを参照。
3. **アーカイブ**: 削除は避け、`docs/_archive/`に移動。各ファイルに「このファイルはアーカイブされました」ヘッダーを追加。
4. **リンク更新**: すべての内部リンクを新しい構造に更新。

---

## 次のステップ

1. ✅ インベントリ完了
2. ⏳ 統合実行
3. ⏳ リンク更新
4. ⏳ CLAUDE.md更新
5. ⏳ レポート作成

