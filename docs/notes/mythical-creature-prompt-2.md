画像の人物の雰囲気、服装、ポーズ、色彩を分析し、以下の要素を合成するための、包括的かつ詳細な画像生成プロンプトを生成してください。生成後、それを元に画像を編集してください。

```yaml
# 人物と幻獣の合成プロンプト設定
image_composition:

  # 1. 幻獣/動物の選択
  creature:
    type: "" # ドラゴン、フェニックス、キツネ、グリフォン、狼、鷹など
    personality: "" # 威厳ある、穏やか、神秘的、力強いなど
    symbolism: "" # 人物の「強さ」「神秘性」「個性」を象徴
    realism_level: "photorealistic" # フォトリアリスティック

  # 2. 色調とトーンの統一
  color_harmony:
    temperature: "" # warm / cool / neutral
    saturation_level: "" # natural / moderate / subdued
    color_palette:
      primary: ""
      secondary: ""
      accent: ""
      limit: "3-5色" # カラーパレットの制限
    matching_rules:
      - "人物の肌の色調と幻獣の色温度を統一"
      - "人物と幻獣の彩度レベルを揃える"

  # 3. スケールと配置
  scale_and_placement:
    creature_size: "" # 例: "人物の身長の1.2倍"
    position: "" # 例: "右斜め後方1.5メートル"
    height: "" # 例: "人物の肩の高さ"
    depth: "斜め後方や側面に配置" # 奥行きのある構図
    distance: "" # 例: "人物から2メートル後方"

  # 4. 相互作用と関係性
  interaction:
    relationship: "" # 例: "守護者として寄り添う"、"パートナーとしての信頼関係"
    eye_direction:
      person: "" # 例: "前方を見つめる"
      creature: "" # 例: "人物を見守る"、"同じ方向を見る"
    physical_contact: "" # 例: "人物の手が幻獣の頭に触れる"
    emotional_bond: "" # 例: "信頼の絆"

  # 5. ライティング
  lighting:
    main_light:
      position: "" # 例: "左上45度から"
      quality: "" # soft / hard
      color: "" # warm / cool / neutral
    shadows:
      direction: "人物と幻獣で一致"
      length: "同じ長さ"
    fill_light:
      ground_reflection: "" # 例: "地面からの照り返し"
      environment_reflection: "" # 例: "周囲の壁からの反射光"
    unity: "人物、幻獣、背景すべて同じ光源"

  # 6. 大気と空気感
  atmosphere:
    aerial_perspective:
      haze: "" # 例: "ごく薄い霞"
      particles: "" # 例: "空気中の微粒子"
    focus_depth: "同じフォーカス深度" # 両方シャープまたは両方にボケ
    brightness_contrast: "人物と幻獣を同じ空間に配置"
    spatial_unity: "同じ空気感を共有"

  # 7. 背景環境
  background:
    type: "" # 例: "古代遺跡"、"霧のかかった森"
    color: "" # 例: "ディープネイビー"、"スモーキーグレー"
    texture: "" # 単色 / テクスチャ感
    environment_light: "人物と幻獣の両方に影響"
    enhancement: "人物と幻獣の両方を引き立てる"

  # 8. エフェクト
  effects:
    type: [] # 例: ["光の粒子", "稲妻", "炎"]
    source: "人物と幻獣の両方から発する"
    intensity: "控えめ" # 合成感を避ける
    function: "両者を結びつける要素"
    placement: "" # 例: "人物と幻獣の間"

  # 9. 質感とディテール
  texture_detail:
    realism_level: "人物の写真と同程度の写実性"
    texture_consistency: "" # 例: "ソフトフォーカス"
    edge_treatment: "" # sharp / soft
    detail_level: "統一"

# 出力フォーマット
output:
  format: "包括的な画像生成プロンプト"
  style: "フォトリアリスティック"
  purpose: "元の画像を編集"
```

## 使い方

1. 上記YAMLの各項目を人物の特徴に基づいて具体的に埋める
2. すべての要素が調和するよう整合性を確認

## 具体例

```yaml
creature:
  type: "神秘的な白いキツネ"
  personality: "穏やかで知的"

color_harmony:
  temperature: "cool"
  saturation_level: "subdued"
  color_palette:
    primary: "深い青"
    secondary: "銀白"
    accent: "淡い紫"

scale_and_placement:
  creature_size: "人物の身長の1.2倍"
  position: "右斜め後方1.5メートル"
  height: "人物の肩の高さ"

lighting:
  main_light:
    position: "左上45度から"
    quality: "soft"
    color: "cool"
```
