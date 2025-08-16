# Influencer Best Ten プロジェクト置き換えプラン

## 概要
現在の `influencer-best-ten` ディレクトリは `evil-dictators` をコピペした状態になっており、「史上最も影響を与えた人物ベスト100ランキング」（M.H.ハート氏の本より）の上位10人に置き換える必要がある。

## 対象となる上位10人（M.H.ハート氏のランキング）

1. **ムハンマド（Muhammad）** - イスラム教の預言者
2. **アイザック・ニュートン（Isaac Newton）** - 物理学者・数学者
3. **イエス・キリスト（Jesus Christ）** - キリスト教の創始者
4. **ブッダ（Buddha）** - 仏教の創始者
5. **孔子（Confucius）** - 中国の思想家
6. **聖パウロ（St. Paul）** - キリスト教の使徒
7. **蔡倫（Ts'ai Lun）** - 紙の発明者
8. **ヨハン・グーテンベルク（Johann Gutenberg）** - 活版印刷術の発明者
9. **クリストファー・コロンブス（Christopher Columbus）** - 探検家
10. **アルバート・アインシュタイン（Albert Einstein）** - 理論物理学者

## 必要な変更作業

### 1. ファイル名・構造の変更
- `evil-dictators.json` → `influencers.json` に改名
- ファイル内容を上位10人のデータに完全置き換え

### 2. データ構造の変更
現在の独裁者データ構造：
```typescript
interface DictatorLocation {
  name: string
  country: string
  longitude: number
  latitude: number
  min_death_count: number
  max_death_count: number
  icon: string
  description: string
}
```

新しい影響力のある人物データ構造：
```typescript
interface InfluencerLocation {
  name: string
  birth_year: number
  death_year?: number
  field: string // 分野（宗教、科学、哲学、発明など）
  longitude: number
  latitude: number
  icon: string
  description: string
  major_achievement: string // 主な功績
}
```

### 3. コードファイルの更新

#### 3.1 Earth.ts
- `DictatorLocation` → `InfluencerLocation` に型名変更
- インポート先ファイル名を `influencers.json` に変更
- コメントや変数名を適切に更新

#### 3.2 EarthCard.vue
- タイトルを「史上最も影響を与えた人物ベスト10」に変更
- 説明文を影響力のある人物に関する内容に変更
- ソース表記を参照ウェブサイト（https://www.aokiuva.com/b100influpers.html）に変更

#### 3.3 LocationItem.vue
- `DictatorLocation` → `InfluencerLocation` に型名変更
- 死者数表示部分を生年・没年や主な功績の表示に変更
- デザインを影響力のある人物に適したものに調整

#### 3.4 index.md
- ページタイトルと説明を更新
- インポート先ファイル名を `influencers.json` に変更

### 4. 各人物の詳細データ収集

各人物について以下の情報を収集・整理する必要がある：

1. **正確な位置情報**（出生地または最も関連の深い場所）
2. **生年・没年**
3. **主な分野・功績**
4. **適切な肖像画・写真のURL**
5. **簡潔で分かりやすい説明文**

### 5. 実装の優先順位

1. **Phase 1**: データ構造とTypeScript型定義の更新
2. **Phase 2**: 各人物の基本情報収集とJSONファイル作成
3. **Phase 3**: UIコンポーネントの更新（表示内容の変更）
4. **Phase 4**: 肖像画・画像の収集と設定
5. **Phase 5**: 最終調整と動作確認

### 6. 注意事項

- 宗教的人物（ムハンマド、イエス、ブッダ）については、肖像画の扱いに文化的配慮が必要
- 位置情報は各人物が最も活動した場所、または最も関連の深い場所を選定
- 説明文は中立的で教育的な内容にする
- 各人物の功績を適切に表現し、影響力の大きさを伝える

### 7. 期待される成果

- 教育的価値の高いインタラクティブな歴史学習ツール
- Cesium 3D地球儀を使った視覚的に魅力的な体験
- 世界史における重要人物の理解促進

## 実装スケジュール

1. **データ収集・整理**: 1-2日
2. **コード更新**: 1日
3. **UI調整**: 1日
4. **テスト・調整**: 1日

合計：4-5日程度の作業量を想定