# Pencil Design Files

> Design tool: [Pencil](https://pencil.dev)
> Figma は使用しない

---

## ファイル構成

```
pencil/
├── README.md          # このファイル
├── flows.pen          # 画面遷移・ユーザーフロー
├── wireframes.pen     # ワイヤーフレーム
└── exports/
    ├── README.md      # エクスポートルール
    └── (PNG/SVG files)
```

---

## 命名規則

### ファイル名

| 種類 | フォーマット | 例 |
|------|--------------|-----|
| フロー図 | `flow-{feature}.pen` | `flow-recording.pen` |
| ワイヤー | `wire-{screen}.pen` | `wire-top.pen` |
| コンポーネント | `comp-{name}.pen` | `comp-footer.pen` |

### レイヤー名

- 英語小文字 + ハイフン区切り
- 例: `header`, `content-area`, `footer-nav`

---

## エクスポート設定

### 解像度

| 用途 | スケール | サフィックス |
|------|----------|--------------|
| 開発参照 | @1x | なし |
| Retina | @2x | `@2x` |
| 高解像度 | @3x | `@3x` |

### フォーマット

| 用途 | 形式 |
|------|------|
| 画面全体 | PNG |
| アイコン | SVG |
| フロー図 | PNG or PDF |

---

## バージョン管理

- `.pen` ファイルは Git で管理
- 大きな変更時はコミットメッセージで変更内容を明記
- エクスポート画像は `/exports/` に配置

---

## 参照ドキュメント

作業時は以下を参照:

1. `01-screen-flows.md` - 画面構成
2. `02-core-wireframes.md` - ASCII ワイヤーフレーム
3. `03-design-tokens.json` - カラー・タイポグラフィ
4. `04-motion-tokens.json` - アニメーション
5. `09-accessibility-requirements.md` - アクセシビリティ要件

---

## 注意事項

- Pencil の操作方法は [公式ドキュメント](https://pencil.dev/docs) を参照
- チーム内でのファイル共有方法は別途決定
- デザイントークンは JSON を正とし、Pencil 内でも同じ値を使用
