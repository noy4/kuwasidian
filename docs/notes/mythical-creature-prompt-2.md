画像の人物の雰囲気、服装、ポーズ、色彩を分析し、幻獣を合成するための yaml プロンプトを生成してください。生成後、それを元に画像を編集してください。

## テンプレート

```yaml
# 人物と幻獣の合成プロンプト設定
image_composition:

  # 0. 元画像の人物分析
  person_analysis:
    appearance:
      clothing: # 服装の詳細(色、スタイル、素材感)
      pose: # ポーズ、姿勢
      expression: # 表情
      hair: # 髪型、髪色
    atmosphere:
      mood: # 雰囲気、ムード
      style: # ファッションスタイル、時代感
      character: # キャラクター性

  # 1. 幻獣の選択と特徴
  creature:
    type: # ドラゴン、フェニックス、キツネ、グリフォン、狼、鷹など
    personality: # 威厳ある、穏やか、神秘的、力強いなど
    symbolism: # 人物の「強さ」「神秘性」「個性」を象徴
    features:
      fur_scales: # 毛並み、鱗、羽などの質感
      color: # 幻獣自体の色
      distinctive_traits: # 特徴的な部位(角、翼、尾など)

  # 2. 色調とトーンの統一
  color_harmony:
    temperature: # warm / cool / neutral
    saturation_level: # natural / moderate / subdued
    color_palette:
      primary: # 主要色
      secondary: # 副次色
      accent: # アクセント色
    # 注意: 人物の肌の色調と幻獣の色温度を統一し、彩度レベルを揃える

  # 3. 画像仕様
  image_specs:
    resolution: # 例: 1024x1024, 1920x1080
    aspect_ratio: # 例: 1:1, 16:9, 4:3

  # 4. カメラ設定
  camera:
    focal_length: # 例: 50mm, 85mm (ポートレート向き)
    angle: # 例: eye-level, low-angle, high-angle
    depth_of_field: # shallow / deep

  # 5. スケールと配置
  scale_and_placement:
    creature_size: # 例: 人物の身長の1.2倍
    position: # 例: 右斜め後方1.5メートル
    height: # 例: 人物の肩の高さ
    distance: # 例: 人物から2メートル後方
    # 注意: 奥行きのある構図で、斜め後方や側面に配置

  # 6. 相互作用と関係性
  interaction:
    relationship: # 例: 守護者として寄り添う、パートナーとしての信頼関係
    eye_direction:
      person: # 例: 前方を見つめる
      creature: # 例: 人物を見守る、同じ方向を見る
    physical_contact: # 例: 人物の手が幻獣の頭に触れる
    emotional_bond: # 例: 信頼の絆

  # 7. ライティング
  lighting:
    main_light:
      position: # 例: 左上45度から
      quality: # soft / hard
      color: # warm / cool / neutral
    fill_light:
      ground_reflection: # 例: 地面からの照り返し
      environment_reflection: # 例: 周囲の壁からの反射光
    # 注意: 人物、幻獣、背景すべて同じ光源。影の方向と長さを一致させる

  # 8. 大気と空気感
  atmosphere:
    aerial_perspective:
      haze: # 例: ごく薄い霞
      particles: # 例: 空気中の微粒子
    # 注意: 同じフォーカス深度。人物と幻獣を同じ空間に配置し、同じ空気感を共有

  # 9. 背景環境
  background:
    type: # 例: 古代遺跡、霧のかかった森
    color: # 例: ディープネイビー、スモーキーグレー
    texture: # 単色 / テクスチャ感
    # 注意: 環境光は人物と幻獣の両方に影響し、両方を引き立てる

  # 10. エフェクト(オプション)
  effects:
    type: [] # 例: [光の粒子, 稲妻, 炎]
    placement: # 例: 人物と幻獣の間
    intensity: subtle # 控えめに(合成感を避ける)
    # 注意: 両者を結びつける要素として機能

  # 11. 質感とディテール
  texture_detail:
    realism_level: photorealistic # 人物の写真と同程度の写実性
    texture_consistency: # 例: soft-focus, sharp
    edge_treatment: # sharp / soft / natural
    # 注意: 全体の質感レベルを統一
```

## 出力例

```yaml
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

creature:
  type: 神秘的な白いキツネ
  personality: 穏やかで知的
  symbolism: 知恵と守護
  features:
    fur_scales: 柔らかく光沢のある白い毛並み
    color: 純白に淡い銀の光沢
    distinctive_traits: 9本の尾、金色の瞳

color_harmony:
  temperature: cool
  saturation_level: subdued
  color_palette:
    primary: 深い青
    secondary: 銀白
    accent: 淡い紫

image_specs:
  resolution: 1024x1024
  aspect_ratio: 1:1

camera:
  focal_length: 85mm
  angle: eye-level
  depth_of_field: shallow

scale_and_placement:
  creature_size: 人物の身長の1.2倍
  position: 右斜め後方1.5メートル
  height: 人物の肩の高さ
  distance: 2メートル後方

interaction:
  relationship: 守護霊として寄り添う
  eye_direction:
    person: 前方を見つめる
    creature: 人物を静かに見守る
  physical_contact: なし
  emotional_bond: 深い信頼と静かな絆

lighting:
  main_light:
    position: 左上45度から
    quality: soft
    color: cool
  fill_light:
    ground_reflection: 微かな照り返し
    environment_reflection: 周囲からの淡い反射光

atmosphere:
  aerial_perspective:
    haze: ごく薄い霞
    particles: 光に反射する微粒子

background:
  type: 霧のかかった神秘的な森
  color: ディープネイビーとスモーキーグレー
  texture: ソフトで深みのあるテクスチャ

effects:
  type: [光の粒子]
  placement: 幻獣の周囲
  intensity: subtle

texture_detail:
  realism_level: photorealistic
  texture_consistency: soft-focus
  edge_treatment: natural
```
