# 幻獣合成プロンプト

画像の人物の周りに幻獣を合成するプロンプトを生成してください。以下はプロンプトのテンプレートです。パラメータの値の例を示しています。人物分析も参考にしながら、各パラメータを設定してください。プロンプト生成後、それを元に画像を編集してください。

## テンプレート

```yaml
# 1. 元画像の人物分析
person_analysis:
  appearance:
    clothing: 黒いレザージャケット、白いTシャツ
    pose: 正面を向いて立つ、リラックスした姿勢
    expression: 穏やかで自信に満ちた表情
    hair: ミディアムレングスの黒髪
  atmosphere:
    mood: クールで洗練された
    style: モダンカジュアル
    character: 自立した知的な印象

# 2. 幻獣の選択と特徴
creature:
  type: 神秘的な白いキツネ # ドラゴン、フェニックス、グリフィン、キツネなど
  personality: 穏やかで知的、古の知恵を宿す
  symbolism: 知恵と守護
  features:
    fur_scales: 柔らかく光沢のある白い毛並み
    color: 純白に淡い銀の光沢
    distinctive_traits: 9本の尾、金色の瞳

# 3. 色調とトーンの統一
# 注意: 人物の色調と幻獣の色温度を統一
color_harmony:
  temperature: cool # warm / cool / neutral
  saturation_level: subdued # natural / moderate / subdued / vibrant
  color_palette:
    primary: 深い青
    secondary: 銀白
    accent: 淡い紫

# 4. スケールと配置
scale_and_placement:
  creature_size: 人物の身長の1.2倍
  position: 右斜め後方1.5メートル

# 5. 相互作用と関係性
interaction:
  relationship: 守護霊として寄り添う
  eye_direction:
    person: 前方を見つめる
    creature: 人物を静かに見守る
  physical_contact: なし # 触れているか、距離があるか
  emotional_bond: 深い信頼と静かな絆

# 6. ライティング
# 注意: 元の画像のライティングに合わせる
lighting:
  main_light:
    position: 左上45度から
    quality: soft # soft / hard
    color: cool # warm / cool / neutral

# 7. 背景環境
background:
  type: 霧のかかった神秘的な森
  color: ディープネイビーとスモーキーグレー
  texture: ソフトで深みのあるテクスチャ

# 8. エフェクト(オプション)
effects:
  type: [光の粒子, 霧]
  placement: 幻獣の周囲
  intensity: subtle # subtle / moderate / strong

# 9. 質感とディテール
texture_detail:
  realism_level: photorealistic # 人物と同程度の写実性
  texture_consistency: consistent # soft-focus / sharp / consistent
  edge_treatment: natural # sharp / soft / natural
```