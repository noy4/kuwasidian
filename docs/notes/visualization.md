


[Anthony Fu's Yak Map](https://yak.antfu.me/?clicks=1&mode=all)
- [visjs/vis-data](https://github.com/visjs/vis-data)

[[github url hacks]]

[Submarine Cable Map](https://www.submarinecablemap.com/)

sunburst
Circle Packing
Circular Treemap
[GitHub Commit History Visualization](https://nbremer.github.io/ORCA/commit-history/?repo=d3)

---

software city
[MaibornWolff/codecharta](https://github.com/MaibornWolff/codecharta)
[cjayawickrema/city-blocks](https://github.com/cjayawickrema/city-blocks)
[aserg-ufmg/JSCity](https://github.com/aserg-ufmg/JSCity?tab=readme-ov-file)

deps network
[gabotechs/dep-tree](https://github.com/gabotechs/dep-tree)
[glato/emerge](https://github.com/glato/emerge)
[vasturiano/3d-force-graph](https://github.com/vasturiano/3d-force-graph)

change animation
[acaudwell/Gource](https://github.com/acaudwell/Gource) - requires SDL, etc. hard to setup
[utensils/Envisaged](https://github.com/utensils/Envisaged)
[nshcr/git-commits-threadline](https://github.com/nshcr/git-commits-threadline)

circle packing
[git-truck/git-truck](https://github.com/git-truck/git-truck) - node cli
[GitHub Next | Visualizing a Codebase](https://githubnext.com/projects/repo-visualization/)
- [githubocto/repo-visualizer](https://github.com/githubocto/repo-visualizer)
- [Amelia Wattenberger](https://wattenberger.com/)
[Visualize Repository - Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=JasonMark.visualize-repository)



# リポジトリ・コード構造の視覚化プロジェクト まとめ

コードベースの構造、複雑性、依存関係、および開発履歴を空間的にマッピングして視覚化するプロジェクトをまとめました。

---

## 1. ソフトウェア都市（Software City）メタファー
パッケージを「区画」、クラスやファイルを「建物」に見立てて、その高さや面積でコードメトリクスを表現する手法です。

| プロジェクト名 | 視覚化スタイル | 特徴・メリット | 導入・実行方法 |
| :--- | :--- | :--- | :--- |
| **[CodeCharta](https://codecharta.com/)** | 矩形 (Treemap) | コード行数や複雑度を建物の高さや面積にマッピング。最も多機能で実用的。 | Web版 / CLI / 各種プラグイン |
| **[JSCity](https://github.com/aserg-ufmg/JSCity)** | 矩形 / 円形 | JavaScriptコードを3D都市として視覚化。フォルダを地区、ファイルを建物として配置。 | Three.jsベースのWebアプリ |
| **[CodeCity](https://wettel.github.io/codecity.html)** | 矩形 (Treemap) | この分野の先駆け。Javaなどの解析に対応し、3D都市視覚化の基礎を確立。 | Smalltalkベース (Moose) |
| **[City Blocks](https://github.com/cjayawickrema/city-blocks)** | 矩形 (Treemap) | Gitリポジトリを3D都市化。ファイルサイズやコミット頻度を建物の属性に反映。 | Node.js / Git環境 |
| **[VariCity](https://github.com/DeathStar3/varicity)** | クラスタリング | ソフトウェアの「変動性」に特化。特定の機能がどこに集中しているかを把握。 | 研究プロジェクト |

---

## 2. 依存関係・エントロピーの空間視覚化
ファイル間の「つながり」を3D空間上のネットワークや力学モデルとして表現するアプローチです。

| プロジェクト名 | 視覚化スタイル | 特徴・メリット | 導入・実行方法 |
| :--- | :--- | :--- | :--- |
| **[dep-tree](https://github.com/gabotechs/dep-tree)** | 3D 球体グラフ | コードの「エントロピー（乱雑さ）」を視覚化。円形（球体）のノードが有機的に配置される。 | `npx @dep-tree/cli entropy <file>` |
| **[emerge](https://github.com/glato/emerge)** | 2D/3D グラフ | 依存関係やメトリクスをインタラクティブに描画。多くの言語に対応。 | Python / pip |
| **[3d-force-graph](https://github.com/vasturiano/3d-force-graph)** | 3D ネットワーク | 多くの3Dコード視覚化ツールの基盤となるライブラリ。自作の際に最適。 | JavaScript ライブラリ |

---

## 3. 開発履歴・進化の視覚化
コードの「構造」だけでなく、「時間的な変化」を空間的に表現します。

| プロジェクト名 | 視覚化スタイル | 特徴・メリット | 導入・実行方法 |
| :--- | :--- | :--- | :--- |
| **[Git Truck](https://github.com/git-truck/git-truck)** | 2D/3D マップ | 誰がどのファイルを触ったか、構造の変遷をブラウザで即座に確認可能。 | `npx -y git-truck` |
| **[Gource](https://gource.io/)** | 成長する樹木 | 開発履歴をアニメーションで表現。チームの動きを視覚化するのに最適。 | OSごとのバイナリ |
| **[Git Commits Threadline](https://github.com/nshcr/git-commits-threadline)** | 3D 糸状グラフ | コミット履歴が糸のように繋がって成長していく様子をアニメーション化。 | Webデモ / ローカルビルド |

---

## 技術的なキーワード
*   **次元圧縮・配置**: UMAP, t-SNE, Circle Packing, Force-directed layout
*   **描画エンジン**: Three.js, D3.js, WebGL
*   **解析対象**: Git履歴, 抽象構文木 (AST), 依存関係グラフ
