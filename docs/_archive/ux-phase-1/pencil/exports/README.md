# Export Rules

> Pencil からエクスポートした画像ファイルの管理ルール

---

## ディレクトリ構成

```
exports/
├── README.md
├── screens/           # 画面全体のスクリーンショット
│   ├── top@1x.png
│   ├── top@2x.png
│   └── ...
├── flows/             # フロー図
│   ├── main-flow.png
│   └── ...
├── components/        # 個別コンポーネント
│   ├── footer-nav.svg
│   └── ...
└── icons/             # アイコン
    ├── icon-add.svg
    └── ...
```

---

## 命名規則

### 画面エクスポート

```
{screen-name}@{scale}.{ext}
```

例:
- `top@1x.png`
- `top@2x.png`
- `shelf@1x.png`

### フロー図

```
flow-{name}.{ext}
```

例:
- `flow-main.png`
- `flow-recording.pdf`

### コンポーネント

```
{component-name}.{ext}
```

例:
- `footer-nav.svg`
- `button-primary.svg`

---

## エクスポート手順

1. Pencil でファイルを開く
2. エクスポート対象を選択
3. 以下の設定でエクスポート:
   - 画面: PNG, @1x と @2x
   - アイコン: SVG
   - フロー: PNG または PDF

4. 適切なサブディレクトリに配置
5. Git にコミット

---

## 品質チェック

エクスポート後に確認:

- [ ] ファイル名が命名規則に従っている
- [ ] @1x と @2x の両方がある（画面の場合）
- [ ] SVG が正しく表示される（アイコンの場合）
- [ ] ファイルサイズが適切（1枚 500KB 以下目安）

---

## 注意事項

- 未使用のエクスポートファイルは削除
- 大きな変更時は古いファイルをアーカイブではなく削除
- エクスポート画像はあくまで参照用（正は .pen ファイル）
