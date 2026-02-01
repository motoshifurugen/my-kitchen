# 09: Accessibility Requirements (Mobile)

> WCAG 2.1 AA を最低基準とし、すべてのユーザーが「記録する喜び」を体験できること  
> **対象プラットフォーム:** iOS / Android（React Native）  
> **配信形態:** モバイルアプリのみ（Web配信なし）

---

## 1. スコープ & 基準

### 1.1 準拠レベル

| レベル | 対応 | 備考 |
|--------|------|------|
| WCAG 2.1 A | 必須 | MVP で完全準拠 |
| WCAG 2.1 AA | 必須 | MVP で完全準拠 |
| WCAG 2.1 AAA | 推奨 | 可能な範囲で対応 |

### 1.2 対象環境

本アプリは**モバイルアプリのみ**を対象とする。Web配信は行わない。

| 環境 | 対応 | 備考 |
|------|------|------|
| iOS VoiceOver | 必須 | iOS 12.0+ |
| Android TalkBack | 必須 | Android 8.0+ (API 26+) |
| 動的タイプ（Dynamic Type） | 必須 | iOS Content Size Category / Android fontScale |
| フォント拡大（200%まで） | 必須 | OS設定に従う |
| 色反転モード | 必須 | iOS Smart Invert / Android Color Inversion |
| Reduced Motion | 必須 | iOS Reduce Motion / Android Animation Scale |
| iPad + 外部キーボード | 推奨 | キーボードナビゲーション対応（オプション） |

### 1.3 参照ガイドライン

- [WCAG 2.1 日本語訳](https://waic.jp/docs/WCAG21/)
- [Apple Human Interface Guidelines - Accessibility](https://developer.apple.com/accessibility/)
- [Android Accessibility](https://developer.android.com/guide/topics/ui/accessibility)
- [React Native Accessibility](https://reactnative.dev/docs/accessibility)

---

## 2. サポート環境

### 2.1 スクリーンリーダー

| プラットフォーム | ツール | テスト必須 |
|----------------|--------|-----------|
| iOS | VoiceOver | ✅ MVP必須 |
| Android | TalkBack | ✅ MVP必須 |

### 2.2 システム設定

| 設定 | iOS | Android | 対応必須 |
|------|-----|---------|---------|
| 動的タイプ拡大 | Content Size Category | fontScale | ✅ |
| Reduced Motion | Reduce Motion | Animation Scale | ✅ |
| 色反転 | Smart Invert | Color Inversion | ✅ |
| コントラスト強化 | Increase Contrast | High Contrast | 推奨 |

### 2.3 フォントスケーリングポリシー

**React Native 実装方針:**

- **デフォルト:** `allowFontScaling={true}` を全テキストコンポーネントに適用
- **例外:** 以下の場合のみ `allowFontScaling={false}` を許可
  - ロゴ・ブランディング要素
  - アイコン内テキスト（装飾的）
  - 2.5Dワールド内の装飾テキスト（非インタラクティブ）

**要件:**

- 200%拡大（またはOS最大値）でも機能が失われないこと
- レイアウトの折り返し・スクロールは許可
- テキストの切り詰め（truncation）は最小限に

**参照:** `03-design-tokens.md` のタイポグラフィサイズ定義

---

## 3. 視覚アクセシビリティ

### 3.1 色のコントラスト

| 要素 | 最小比率 | 備考 |
|------|----------|------|
| 本文テキスト | 4.5:1 | 16pt未満 |
| 大きいテキスト | 3:1 | 18pt以上 or 14pt Bold |
| UI コンポーネント | 3:1 | ボタン、アイコン境界 |
| フォーカスインジケータ | 3:1 | 背景に対して |

**参照:** `03-design-tokens.md` のカラーパレット定義とWCAG準拠確認表

### 3.2 色だけに依存しない情報伝達

```
❌ 悪い例
- 赤いアイコン = エラー（色のみで伝達）

✓ 良い例
- 赤いアイコン + ⚠️マーク + テキストラベル
- エラーメッセージは色 + アイコン + テキストで伝達
```

**参照:** `08-microcopy-core.md` のエラーメッセージ定義

### 3.3 テキストサイズ

**最小フォントサイズ:** `typography.size.xs` (11pt) - 補足テキストのみ  
**推奨本文サイズ:** `typography.size.md` (15pt)  
**ユーザー設定による拡大:** 必須対応（動的タイプ参照）

**参照:** `03-design-tokens.md` のタイポグラフィスケール

### 3.4 フォーカスインジケータ

| プロパティ | 値 | 備考 |
|-----------|-----|------|
| 色 | `focus.ring.color` (#C17A50) | `color.border.focused` と同一 |
| 太さ | `focus.ring.width` (2pt) | 視認性確保 |
| オフセット | `focus.ring.offset` (2pt) | 要素との間隔 |

**参照:** `03-design-tokens.md` のフォーカスリング仕様

---

## 4. 運動・操作アクセシビリティ

### 4.1 タップターゲット

| 要素 | 最小サイズ | 推奨サイズ |
|------|-----------|-----------|
| ボタン | `size.tap.minimum` (44pt) | `size.tap.recommended` (48pt) |
| リストアイテム | 44pt高 | 48pt高 |
| アイコンボタン | 44×44pt | 48×48pt |
| 要素間隔 | `spacing.sm` (8pt) | `spacing.md` (16pt) |

**参照:** `03-design-tokens.md` のタップターゲット定義

### 4.2 ジェスチャー代替手段

| 操作 | 必須代替手段 | 実装方法 |
|------|--------------|---------|
| スワイプ | ボタンタップ | 明示的な「次へ」「前へ」ボタン |
| 長押し | メニューボタン | コンテキストメニューまたは専用ボタン |
| ピンチ | +/- ボタン | ズームイン/アウトボタン |
| ドラッグ | タップで選択 → 移動ボタン | 選択状態 + 移動アクション |

**注:** MVPでは複雑なジェスチャー操作は最小限。主要操作はタップのみで完結すること。

### 4.3 タイムアウト

- **自動タイムアウト:** なし（または無効化オプション）
- **入力途中データ:** 自動保存（ローカルストレージ）
- **セッション切れ警告:** Phase 2以降（クラウド同期時）

---

## 5. スクリーンリーダーセマンティクス

### 5.1 React Native 必須アクセシビリティプロパティ

#### 基本プロパティ

| プロパティ | 用途 | 必須条件 |
|-----------|------|---------|
| `accessibilityLabel` | 要素の読み上げテキスト | すべてのインタラクティブ要素 |
| `accessibilityHint` | 操作の説明 | フォーム入力、複雑な操作 |
| `accessibilityRole` | 要素の役割 | ボタン、リンク、ヘッダー、画像等 |
| `accessibilityState` | 状態（選択/無効等） | トグル、チェックボックス、無効ボタン |
| `accessibilityValue` | 値（進捗、範囲等） | スライダー、進捗バー |

#### プロパティ詳細

**`accessibilityRole` 推奨値:**

```typescript
// ボタン
accessibilityRole="button"

// ヘッダー
accessibilityRole="header"

// 画像（意味のある画像）
accessibilityRole="image"

// テキスト入力
accessibilityRole="none" // TextInputは自動検出

// リンク
accessibilityRole="link"

// リスト
accessibilityRole="list"

// リストアイテム
accessibilityRole="listitem"
```

**`accessibilityState` 使用例:**

```typescript
// 無効状態
accessibilityState={{ disabled: true }}

// 選択状態
accessibilityState={{ selected: true }}

// チェック状態
accessibilityState={{ checked: true }}
```

**`accessibilityLiveRegion` (Android):**

動的な状態変化を通知する場合に使用。

```typescript
// 保存完了通知
accessibilityLiveRegion="polite"

// エラー通知
accessibilityLiveRegion="assertive"
```

### 5.2 ラベリングルール

#### ボタン

```typescript
// ✅ 良い例
<Button
  accessibilityLabel="記録を追加"
  accessibilityHint="新しい料理の記録画面を開きます"
/>

// ❌ 悪い例
<Button accessibilityLabel="追加" /> // 文脈が不明確
```

#### 画像

```typescript
// 意味のある画像
<Image
  accessibilityLabel="2024年1月15日に記録したカレーライス"
  accessibilityRole="image"
/>

// 装飾画像
<Image
  accessibilityRole="none"
  accessibilityElementsHidden={true}
/>
```

#### フォーム入力

```typescript
<TextInput
  accessibilityLabel="料理名"
  accessibilityHint="料理の名前を入力してください"
  accessibilityRequired={true} // 必須項目
/>
```

#### 時間表示・状態

```typescript
<Text accessibilityLabel="現在の時間帯: 夕方" />
```

#### 空状態

```typescript
<Text accessibilityLabel="まだ記録がありません。下の追加ボタンから最初の記録を始められます" />
```

**参照:** `08-microcopy-core.md` の画面別マイクロコピー定義

### 5.3 画面構造のセマンティクス

React NativeではHTMLのランドマーク相当を `accessibilityRole` で表現。

| 要素 | RN実装 | 備考 |
|------|--------|------|
| ヘッダー | `accessibilityRole="header"` | 画面タイトル |
| メインコンテンツ | `accessibilityRole="none"` | デフォルト（明示不要） |
| フッター | `accessibilityRole="tabbar"` または `"none"` | ナビゲーション要素 |
| 見出し | `accessibilityRole="header"` + `accessibilityLevel={1-6}` | 階層構造 |

**画面構造例:**

```
画面構造:
├─ Header（accessibilityRole="header"）
├─ Main（デフォルト、明示不要）
│   ├─ Heading Level 1（accessibilityRole="header" accessibilityLevel={1}）
│   ├─ Section
│   │   └─ Heading Level 2（accessibilityRole="header" accessibilityLevel={2}）
│   └─ Section
│       └─ Heading Level 2
└─ Footer（accessibilityRole="tabbar"）
```

### 5.4 読み上げ順序

- **論理的な順序:** 上→下、左→右（RNのレイアウト順序に従う）
- **重要度順:** インタラクティブ要素を先に、装飾要素は後
- **フッターナビゲーション:** 常に最後に到達可能

---

## 6. 2.5Dワールドアクセシビリティ（S-01）

### 6.1 基本方針

**2.5Dキッチンワールド（S-01）は非インタラクティブな装飾要素**として扱う。

### 6.2 実装要件

| 要素 | アクセシビリティ対応 | 実装方法 |
|------|-------------------|---------|
| キッチン全体 | オプション: 要約ラベル | 単一の `accessibilityLabel` で要約 |
| 装飾オブジェクト（皿、植物等） | フォーカス不可 | `accessibilityElementsHidden={true}` |
| 時間帯照明 | 読み上げない | 視覚演出のみ |
| インタラクティブ要素 | 個別にラベル付与 | 設定ボタン等は通常通り |

### 6.3 推奨実装パターン

```typescript
// ワールドコンテナ（オプション: 要約ラベル）
<View
  accessibilityLabel="あなたのキッチン。3個の料理が飾られています"
  accessibilityRole="none"
  accessibilityElementsHidden={false} // 子要素は個別に制御
>
  {/* 装飾オブジェクトは個別に hidden */}
  <DecorativeDish accessibilityElementsHidden={true} />
  <DecorativePlant accessibilityElementsHidden={true} />
  
  {/* インタラクティブ要素は通常通り */}
  <SettingsButton accessibilityLabel="設定" />
</View>
```

### 6.4 ユーザー体験要件

- **スクリーンリーダーユーザー:** ワールドをスキップして、すぐにインタラクティブUI（フッター、設定）に到達可能
- **フォーカス順序:** ワールド要素はフォーカス順序から除外（`importantForAccessibility="no"` または `accessibilityElementsHidden={true}`）
- **パフォーマンス:** ワールドレンダリングがスクリーンリーダーのパフォーマンスに影響しないこと

---

## 7. モーションアクセシビリティ

### 7.1 Reduced Motion 対応

**参照:** `04-motion-tokens.json` の `reducedMotion` 定義

#### 遷移の変換ルール

| 通常遷移 | Reduced Motion時 | 実装 |
|---------|-----------------|------|
| Slide遷移 | Fade遷移 | `duration.transition.slide` → `duration.transition.fade` |
| Overlay遷移 | Fade遷移 | `duration.transition.overlay` → `duration.transition.fade` |

#### セレブレーション

| 通常 | Reduced Motion時 |
|------|-----------------|
| 光の広がり + メッセージ | メッセージのみ |

**参照:** `04-motion-tokens.json` の `reducedMotion.celebration`

#### ワールドアンビエント

| 通常 | Reduced Motion時 |
|------|-----------------|
| 呼吸・揺らぎアニメーション | 静止（static） |

**参照:** `04-motion-tokens.json` の `reducedMotion.world`

#### タップフィードバック

| 通常 | Reduced Motion時 |
|------|-----------------|
| 短いスケール/オパシティ変化 | 維持（keep） |

**参照:** `04-motion-tokens.json` の `reducedMotion.tapFeedback`

### 7.2 実装方法

**React Native での検出:**

```typescript
import { AccessibilityInfo } from 'react-native';

// Reduced Motion設定の検出
const isReduceMotionEnabled = await AccessibilityInfo.isReduceMotionEnabled();

// アニメーション条件分岐
const transitionDuration = isReduceMotionEnabled 
  ? motionTokens.duration.transition.fade 
  : motionTokens.duration.transition.slide;
```

### 7.3 禁止事項

| 禁止 | 理由 |
|------|------|
| 点滅（3回/秒以上） | てんかん発作のリスク |
| 自動再生ループ動画 | 注意散漫、停止困難 |
| 急激な色変化 | 視覚的不快感 |
| 回転・拡縮の連続 | めまいのリスク |

---

## 8. フォーカス管理

### 8.1 モーダルフォーカストラップ

**要件:**

- モーダル表示時、フォーカスをモーダル内にトラップ
- モーダル外の要素はフォーカス不可
- モーダル閉じたら、元の位置にフォーカスを復元

**実装例:**

```typescript
// モーダル表示時
<Modal
  accessibilityViewIsModal={true} // iOS
  importantForAccessibility="yes" // Android
>
  {/* モーダルコンテンツ */}
</Modal>
```

### 8.2 状態変化のアナウンス

**保存完了、エラー発生等の状態変化を通知:**

```typescript
// iOS: accessibilityLabel の更新で自動読み上げ
// Android: accessibilityLiveRegion を使用

<View accessibilityLiveRegion="polite">
  {isSaved && <Text accessibilityLabel="保存しました" />}
</View>
```

**参照:** `08-microcopy-core.md` のエラーメッセージ・セレブレーションメッセージ

### 8.3 フッターナビゲーション

- **常に到達可能:** スクリーンリーダーで最後に到達可能
- **装飾要素による妨害なし:** ワールド要素がフッターのフォーカスを「奪わない」
- **明確なラベル:** 各フッターアイテムに `accessibilityLabel` を設定

**参照:** `08-microcopy-core.md` のフッターラベル定義

### 8.4 iPad + 外部キーボード（オプション）

**要件（推奨）:**

- Tabキーでフォーカス移動可能
- Enter/Spaceでアクティベート
- フォーカスインジケータが視認可能

**注:** MVPでは必須ではないが、実装可能な範囲で対応を推奨。

---

## 9. テスト & QA

### 9.1 自動テスト

#### React Native コンポーネントテスト

**ツール:** `@testing-library/react-native`

```typescript
import { render } from '@testing-library/react-native';

test('ボタンに適切なaccessibilityLabelが設定されている', () => {
  const { getByLabelText } = render(<Button accessibilityLabel="記録を追加" />);
  expect(getByLabelText('記録を追加')).toBeTruthy();
});

test('フォーム入力にaccessibilityHintが設定されている', () => {
  const { getByLabelText } = render(
    <TextInput 
      accessibilityLabel="料理名"
      accessibilityHint="料理の名前を入力してください"
    />
  );
  expect(getByLabelText('料理名')).toBeTruthy();
});
```

#### 必須チェック項目（自動テスト）

- [ ] すべてのインタラクティブ要素に `accessibilityLabel` が設定されている
- [ ] フォーム入力に `accessibilityHint` が設定されている
- [ ] 画像に適切な `accessibilityRole` が設定されている（または `accessibilityElementsHidden={true}`）
- [ ] 無効状態の要素に `accessibilityState={{ disabled: true }}` が設定されている

### 9.2 手動テストツール

#### iOS

**ツール:** Xcode Accessibility Inspector

**テスト手順:**

1. Xcode → Open Developer Tool → Accessibility Inspector
2. アプリを起動
3. 各画面で以下を確認:
   - すべてのインタラクティブ要素が検出される
   - ラベルが適切に読み上げられる
   - フォーカス順序が論理的

#### Android

**ツール:** Accessibility Scanner（推奨）または TalkBack

**Accessibility Scanner テスト手順:**

1. Google Play から Accessibility Scanner をインストール
2. アプリを起動
3. 各画面でスキャンを実行
4. 以下の問題を確認:
   - タップターゲットサイズ不足
   - コントラスト比不足
   - ラベル欠如

**TalkBack テスト手順:**

1. 設定 → アクセシビリティ → TalkBack を有効化
2. アプリを起動
3. スワイプで全画面を走査
4. すべての操作が可能であることを確認

### 9.3 画面別テストチェックリスト

#### S-01: トップ（2.5Dワールド）

- [ ] ワールド要素がフォーカスを妨害しない
- [ ] 設定ボタンに到達可能
- [ ] フッターナビゲーションに到達可能
- [ ] （オプション）ワールド要約ラベルが読み上げられる

#### S-02: アーカイブ

- [ ] 空状態メッセージが適切に読み上げられる
- [ ] リストアイテムが個別にフォーカス可能
- [ ] 各アイテムに適切なラベルが設定されている

#### S-03: カード詳細

- [ ] 写真がない場合のメッセージが適切
- [ ] 閉じるボタンに到達可能
- [ ] 編集ボタン（将来実装）に到達可能

#### S-04: 記録フロー

**S-04a: 写真撮影/選択**
- [ ] 「写真を撮る」ボタンにラベルあり
- [ ] 「ライブラリから選ぶ」ボタンにラベルあり
- [ ] 「写真なしで続ける」ボタンにラベルあり

**S-04b: 入力フォーム**
- [ ] 料理名入力に `accessibilityLabel` + `accessibilityHint` あり
- [ ] 必須項目が `accessibilityRequired={true}` で明示
- [ ] エラーメッセージが適切にアナウンスされる

**S-04c: 確認・保存**
- [ ] 保存ボタンにラベルあり
- [ ] 保存完了時にアナウンスあり

#### S-05: 探索（検索）

- [ ] 検索入力にラベル + ヒントあり
- [ ] 検索結果なしメッセージが適切

#### S-06: 設定

- [ ] 各トグル項目にラベルあり
- [ ] トグル状態が `accessibilityState` で表現されている

#### S-07: オンボーディング

- [ ] 各ステップのメッセージが適切に読み上げられる
- [ ] 「次へ」「スキップ」ボタンにラベルあり

#### S-08: セレブレーション

- [ ] メッセージが適切に読み上げられる
- [ ] Reduced Motion時はメッセージのみ表示

### 9.4 環境別テスト

#### 動的タイプ / フォント拡大

- [ ] iOS: Content Size Category を最大（Accessibility Extra Extra Extra Large）に設定
- [ ] Android: fontScale を 2.0 に設定
- [ ] 200%拡大時も機能が失われない
- [ ] レイアウトが適切に折り返される

#### Reduced Motion

- [ ] iOS: 設定 → アクセシビリティ → モーションを減らす
- [ ] Android: 設定 → アクセシビリティ → アニメーションを削除
- [ ] Slide遷移がFade遷移に変換される
- [ ] セレブレーションがメッセージのみになる
- [ ] ワールドアニメーションが停止する

#### 色反転

- [ ] iOS: Smart Invert を有効化
- [ ] Android: Color Inversion を有効化
- [ ] すべてのUI要素が視認可能
- [ ] コントラストが維持される

---

## 10. Definition of Done（MVPリリースチェックリスト）

### 10.1 必須要件（P0）

#### 視覚

- [ ] すべてのテキストがコントラスト比 4.5:1 以上（大テキストは 3:1）
- [ ] すべてのUI要素がコントラスト比 3:1 以上
- [ ] 色だけに依存しない情報伝達（アイコン + テキスト）

#### 操作

- [ ] すべてのインタラクティブ要素が 44×44pt 以上
- [ ] 要素間隔が 8pt 以上
- [ ] 主要操作がタップのみで完結

#### スクリーンリーダー

- [ ] すべてのインタラクティブ要素に `accessibilityLabel` が設定されている
- [ ] フォーム入力に `accessibilityHint` が設定されている
- [ ] 画像に適切な `accessibilityRole` または `accessibilityElementsHidden` が設定されている
- [ ] VoiceOver で全画面操作可能
- [ ] TalkBack で全画面操作可能

#### 動的タイプ

- [ ] `allowFontScaling={true}` が全テキストに適用されている（例外は最小限）
- [ ] 200%拡大時も機能が失われない
- [ ] レイアウトが適切に折り返される

#### Reduced Motion

- [ ] Slide遷移がFade遷移に変換される
- [ ] セレブレーションがメッセージのみになる
- [ ] ワールドアニメーションが停止する

#### 2.5Dワールド

- [ ] ワールド要素がフォーカスを妨害しない
- [ ] フッターナビゲーションに常に到達可能

#### フォーカス管理

- [ ] モーダル表示時にフォーカストラップが機能する
- [ ] モーダル閉じたら元の位置にフォーカスが復元される
- [ ] 状態変化（保存完了、エラー）が適切にアナウンスされる

### 10.2 推奨要件（P1）

- [ ] iPad + 外部キーボードで操作可能
- [ ] コントラスト強化モードで視認可能
- [ ] すべての画面で自動テストが実装されている

### 10.3 テスト完了確認

- [ ] Xcode Accessibility Inspector で全画面をテスト済み
- [ ] Android Accessibility Scanner で全画面をスキャン済み
- [ ] TalkBack で全画面を手動テスト済み
- [ ] VoiceOver で全画面を手動テスト済み
- [ ] 動的タイプ最大設定で全画面をテスト済み
- [ ] Reduced Motion設定で全画面をテスト済み
- [ ] 色反転モードで全画面をテスト済み

---

## 11. 参考リソース

### 11.1 公式ドキュメント

- [WCAG 2.1 日本語訳](https://waic.jp/docs/WCAG21/)
- [Apple Human Interface Guidelines - Accessibility](https://developer.apple.com/accessibility/)
- [Android Accessibility](https://developer.android.com/guide/topics/ui/accessibility)
- [React Native Accessibility](https://reactnative.dev/docs/accessibility)

### 11.2 テストツール

- [Xcode Accessibility Inspector](https://developer.apple.com/library/archive/documentation/Accessibility/Conceptual/AccessibilityMacOSX/OSXAXTestingApps.html)
- [Android Accessibility Scanner](https://play.google.com/store/apps/details?id=com.google.android.apps.accessibility.auditor)
- [@testing-library/react-native](https://callstack.github.io/react-native-testing-library/)

### 11.3 関連ドキュメント

- `03-design-tokens.md` — タップサイズ、フォーカスリング、タイポグラフィ、コントラスト値
- `04-motion-tokens.json` — Reduced Motion動作定義
- `08-microcopy-core.md` — エラーメッセージ、空状態メッセージ、セレブレーションメッセージ

---

## 変更履歴

| 日付 | 更新内容 |
|------|---------|
| 2026-02-01 | 初版作成（Web向け） |
| 2026-02-01 | モバイル専用に全面改訂: Web参照削除、React Native実装指向、動的タイプ追加、2.5Dワールド戦略追加、モーショントークン参照追加、モバイルテストツール追加 |
