# わたしの台所図鑑 (Watashi no Daidokoro Zukan)

> 料理は静かな自己回復の儀式である

## 概要

感覚的な料理ジャーナルアプリ。
レシピ管理や在庫追跡ではなく、料理を個人的な儀式として記録する体験駆動型アーカイブ。

## 特徴

- **3タップ記録**: レシピ選択 + 写真 + メモ（日付・調理回数は自動記録）
- **Kitchen Signals**: ユーザーをタイプに分類せず、生活の断片を観察し、それらの積み重ねから台所の空気を自然に形作る
- **ライティング温度**: 時間帯に基づいて自然に変化するキッチン世界の空気。ダークモード/ライトモードの切替ではない
- **棚図鑑**: 記録の唯一のアーカイブ。料理は「種類」として棚に並び、同じ料理を作るとカードのグレードが上がる
- **完全プライベート**: 誰かに見せるためではなく、純粋に自分のための記録と回復の場所

## 技術スタック

- **iOS**: Swift
- **Android**: Kotlin
- **設計思想**: ネイティブ開発、クロスプラットフォーム抽象化なし

## プロジェクト構造

```
my-kitchen/
├── docs/
│   ├── issues/          # Issue定義
│   └── world-bible/     # 概念的基盤ドキュメント
├── ios/                 # iOS アプリ (Swift)
├── android/             # Android アプリ (Kotlin)
└── design-system/       # 共有デザインシステム仕様
```

## 開発フェーズ

| フェーズ | 状態 |
|---------|------|
| Phase 0: World-building | 進行中 |
| Phase 1: UX Design | 未着手 |
| Phase 2: System Architecture | 未着手 |
| Phase 3: Feature Implementation | 未着手 |
| Phase 4: Polish | 未着手 |
| Phase 5: Release | 未着手 |

## ドキュメント

- [World Bible](docs/world-bible/) - プロジェクトの概念的基盤となるドキュメント集
  - [用語辞書](docs/world-bible/terminology.md) - 主要概念の日本語名・英語識別子・定義
  - [ドキュメント一覧](docs/world-bible/README.md#ドキュメント一覧) - 全24ドキュメントの概要
