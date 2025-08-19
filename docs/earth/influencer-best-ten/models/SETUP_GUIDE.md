# 3Dモデル準備の詳細手順

## 概要
このディレクトリには、各偉人を象徴する3Dモデルファイル（.glb形式）が格納されます。
以下の手順に従って、必要な3Dモデルを取得・配置してください。

## 必要なモデルファイル

1. `quran.glb` - ムハンマド（クルアーン）
2. `apple_tree.glb` - ニュートン（リンゴの木）
3. `cross.glb` - イエス・キリスト（十字架）
4. `bodhi_tree.glb` - ブッダ（菩提樹）
5. `scroll.glb` - 孔子（巻物）
6. `letter_scroll.glb` - 聖パウロ（手紙の巻物）
7. `paper_stack.glb` - 蔡倫（紙の束）
8. `printing_press.glb` - グーテンベルク（活版印刷機）
9. `sailing_ship.glb` - コロンブス（帆船）
10. `atom.glb` - アインシュタイン（原子模型）

## モデルの要件

- ファイル形式: GLB (GL Transmission Format Binary)
- ファイルサイズ: 可能な限り軽量（推奨：1MB以下）
- テクスチャ: 埋め込み形式
- ポリゴン数: 低ポリ（1000ポリゴン以下推奨）

## 手順1: Sketchfabからのモデル取得

### 1.1 [Sketchfab](https://sketchfab.com/) のアカウント作成

### 1.2 モデル検索とダウンロード

- **クルアーン (quran.glb)**: [search 'quran'](https://sketchfab.com/search?q=quran&type=models) (ex. https://sketchfab.com/3d-models/quran-3d-free-63021dc03fa0409ca8392b1eddfcbf18)
- **リンゴの木 (apple_tree.glb)**: [search 'apple tree'](https://sketchfab.com/search?q=apple+tree&type=models) (ex. https://sketchfab.com/3d-models/animal-crossing-apple-tree-2ed2a55eebbb4b4fb60484390f611d20)
- **十字架 (cross.glb)**: [search 'christian cross'](https://sketchfab.com/search?q=christian+cross&type=models)
- **菩提樹 (bodhi_tree.glb)**: [search 'bodhi tree'](https://sketchfab.com/search?q=bodhi+tree&type=models)
- **巻物 (scroll.glb)**: [search 'ancient scroll'](https://sketchfab.com/search?q=ancient+scroll&type=models)
- **手紙の巻物 (letter_scroll.glb)**: [search 'letter scroll'](https://sketchfab.com/search?q=letter+scroll&type=models)
- **紙の束 (paper_stack.glb)**: [search 'paper stack'](https://sketchfab.com/search?q=paper+stack&type=models)
- **活版印刷機 (printing_press.glb)**: [search 'printing press'](https://sketchfab.com/search?q=printing+press&type=models)
- **帆船 (sailing_ship.glb)**: [search 'sailing ship'](https://sketchfab.com/search?q=sailing+ship&type=models)
- **原子模型 (atom.glb)**: [search 'atom model'](https://sketchfab.com/search?q=atom+model&type=models)

**ダウンロード手順**:
1. 適切なライセンス（CC0またはCC Attribution）のモデルを選択
2. 「Download 3D Model」→「Original format」→GLBファイルをダウンロード
3. ファイル名を対応する名前にリネーム

## 手順2: ファイル配置

### 2.1 ダウンロードしたファイルを配置
```bash
# プロジェクトのmodelsディレクトリに配置
cp ~/Downloads/quran.glb docs/earth/influencer-best-ten/models/
cp ~/Downloads/apple_tree.glb docs/earth/influencer-best-ten/models/
cp ~/Downloads/cross.glb docs/earth/influencer-best-ten/models/
cp ~/Downloads/bodhi_tree.glb docs/earth/influencer-best-ten/models/
cp ~/Downloads/scroll.glb docs/earth/influencer-best-ten/models/
cp ~/Downloads/letter_scroll.glb docs/earth/influencer-best-ten/models/
cp ~/Downloads/paper_stack.glb docs/earth/influencer-best-ten/models/
cp ~/Downloads/printing_press.glb docs/earth/influencer-best-ten/models/
cp ~/Downloads/sailing_ship.glb docs/earth/influencer-best-ten/models/
cp ~/Downloads/atom.glb docs/earth/influencer-best-ten/models/
```

### 2.2 influencers.jsonの更新
```json
{
  "name": "ムハンマド",
  "model": "./models/quran.glb",
  "modelScale": 30.0,
  "modelHeight": 80
}
```

## 手順3: 代替手段 - 手動作成

### 3.1 Blenderを使用した自作
1. [Blender](https://www.blender.org/)（無料）をインストール
2. 基本的な形状を組み合わせて象徴的オブジェクトを作成
3. File → Export → glTF 2.0 (.glb) でエクスポート

### 3.2 AI生成ツール
1. [Meshy.ai](https://meshy.ai/) - テキストから3Dモデル生成
2. プロンプト例：「ancient quran book islamic holy scripture」
3. 生成されたモデルをGLB形式でダウンロード

## 無料3Dモデルの入手先

- [Sketchfab](https://sketchfab.com/) (Free models section)
- [Poly Haven](https://polyhaven.com/)
- [OpenGameArt](https://opengameart.org/)
- [Free3D](https://free3d.com/)

## ライセンス注意事項

使用する3Dモデルは、商用利用可能またはCC0ライセンスのものを選択してください。

## 手順4: モデル最適化

### 4.1 ファイルサイズ確認
```bash
# ファイルサイズをチェック
ls -lh docs/earth/influencer-best-ten/models/
```

### 4.2 最適化（必要に応じて）
1. [gltf-pipeline](https://github.com/CesiumGS/gltf-pipeline)を使用
```bash
npm install -g gltf-pipeline
gltf-pipeline -i input.glb -o output.glb --draco.compressionLevel 10
```

## 手順5: 設定調整

### 5.1 スケールとポジション調整
各モデルのサイズと位置を調整：
```json
{
  "modelScale": 50.0,    // モデルの大きさ
  "modelHeight": 100     // 地面からの高さ（メートル）
}
```

### 5.2 テスト実行
```bash
npm run dev
```
ブラウザで確認し、必要に応じてスケールを調整

## 手順6: ライセンス管理

### 6.1 ライセンス情報の記録
使用したモデルのライセンス情報を記録：
```
models/
├── LICENSE.md          # 各モデルのライセンス情報
├── quran.glb          # CC Attribution - Sketchfab user
├── apple_tree.glb     # CC Attribution - Sketchfab user
└── ...
```

## トラブルシューティング

### モデルが表示されない場合
1. ファイルパスが正しいか確認
2. ファイル名の大文字小文字が一致しているか確認
3. ブラウザの開発者ツールでエラーメッセージを確認

### モデルが大きすぎる/小さすぎる場合
1. `modelScale` の値を調整
2. `modelHeight` で地面からの距離を調整

### ファイルサイズが大きすぎる場合
1. gltf-pipelineで圧縮
2. テクスチャサイズを削減
3. ポリゴン数を削減したモデルを選択

## 代替リソース

モデルが見つからない場合の代替入手先：
- [Poly Haven](https://polyhaven.com/models)
- [OpenGameArt](https://opengameart.org/)
- [Free3D](https://free3d.com/)
- [TurboSquid Free](https://www.turbosquid.com/Search/3D-Models/free)
- [CGTrader Free](https://www.cgtrader.com/free-3d-models)