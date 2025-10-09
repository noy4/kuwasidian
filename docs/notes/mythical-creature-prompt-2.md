画像の人物の雰囲気、服装、ポーズ、色彩を分析し、幻獣を合成するための yaml プロンプトを生成してください。生成後、それを元に画像を編集してください。

## テンプレート

```yaml
# 0. 元画像の人物分析
person_analysis:
  appearance:
    clothing: 黒いレザージャケット、白いTシャツ # 服装の詳細(色、スタイル、素材感)
    pose: 正面を向いて立つ、リラックスした姿勢 # ポーズ、姿勢
    expression: 穏やかで自信に満ちた表情 # 表情
    hair: ミディアムレングスの黒髪 # 髪型、髪色
  atmosphere:
    mood: クールで洗練された # 雰囲気、ムード
    style: モダンカジュアル # ファッションスタイル、時代感
    character: 自立した知的な印象 # キャラクター性

# 1. 幻獣の選択と特徴
creature:
  type: 神秘的な白いキツネ # ドラゴン、フェニックス、キツネ、グリフォン、狼、鷹など
  personality: 穏やかで知的 # 威厳ある、穏やか、神秘的、力強いなど
  symbolism: 知恵と守護 # 人物の「強さ」「神秘性」「個性」を象徴
  features:
    fur_scales: 柔らかく光沢のある白い毛並み # 毛並み、鱗、羽などの質感
    color: 純白に淡い銀の光沢 # 幻獣自体の色
    distinctive_traits: 9本の尾、金色の瞳 # 特徴的な部位(角、翼、尾など)

# 2. 色調とトーンの統一
# 注意: 人物の肌の色調と幻獣の色温度を統一し、彩度レベルを揃える
color_harmony:
  temperature: cool # warm / cool / neutral
  saturation_level: subdued # natural / moderate / subdued
  color_palette:
    primary: 深い青 # 主要色
    secondary: 銀白 # 副次色
    accent: 淡い紫 # アクセント色

# 3. 画像仕様
image_specs:
  resolution: 1024x1024 # 例: 1024x1024, 1920x1080
  aspect_ratio: 1:1 # 例: 1:1, 16:9, 4:3

# 4. カメラ設定
camera:
  focal_length: 85mm # 例: 50mm, 85mm (ポートレート向き)
  angle: eye-level # 例: eye-level, low-angle, high-angle
  depth_of_field: shallow # shallow / deep

# 5. スケールと配置
# 注意: 奥行きのある構図で、斜め後方や側面に配置
scale_and_placement:
  creature_size: 人物の身長の1.2倍 # 例: 人物の身長の1.2倍
  position: 右斜め後方1.5メートル # 例: 右斜め後方1.5メートル
  height: 人物の肩の高さ # 例: 人物の肩の高さ
  distance: 2メートル後方 # 例: 人物から2メートル後方

# 6. 相互作用と関係性
interaction:
  relationship: 守護霊として寄り添う # 例: 守護者として寄り添う、パートナーとしての信頼関係
  eye_direction:
    person: 前方を見つめる # 例: 前方を見つめる
    creature: 人物を静かに見守る # 例: 人物を見守る、同じ方向を見る
  physical_contact: なし # 例: 人物の手が幻獣の頭に触れる
  emotional_bond: 深い信頼と静かな絆 # 例: 信頼の絆

# 7. ライティング
# 注意: 人物、幻獣、背景すべて同じ光源。影の方向と長さを一致させる
lighting:
  main_light:
    position: 左上45度から # 例: 左上45度から
    quality: soft # soft / hard
    color: cool # warm / cool / neutral
  fill_light:
    ground_reflection: 微かな照り返し # 例: 地面からの照り返し
    environment_reflection: 周囲からの淡い反射光 # 例: 周囲の壁からの反射光

# 8. 大気と空気感
# 注意: 同じフォーカス深度。人物と幻獣を同じ空間に配置し、同じ空気感を共有
atmosphere:
  aerial_perspective:
    haze: ごく薄い霞 # 例: ごく薄い霞
    particles: 光に反射する微粒子 # 例: 空気中の微粒子

# 9. 背景環境
# 注意: 環境光は人物と幻獣の両方に影響し、両方を引き立てる
background:
  type: 霧のかかった神秘的な森 # 例: 古代遺跡、霧のかかった森
  color: ディープネイビーとスモーキーグレー # 例: ディープネイビー、スモーキーグレー
  texture: ソフトで深みのあるテクスチャ # 単色 / テクスチャ感

# 10. エフェクト(オプション)
# 注意: 両者を結びつける要素として機能。控えめに(合成感を避ける)
effects:
  type: [光の粒子] # 例: [光の粒子, 稲妻, 炎]
  placement: 幻獣の周囲 # 例: 人物と幻獣の間
  intensity: subtle # subtle / moderate / strong

# 11. 質感とディテール
# 注意: 全体の質感レベルを統一
texture_detail:
  realism_level: photorealistic # 人物の写真と同程度の写実性
  texture_consistency: soft-focus # 例: soft-focus, sharp
  edge_treatment: natural # sharp / soft / natural
```
