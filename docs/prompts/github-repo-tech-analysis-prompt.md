# GitHubリポジトリ技術構成レポート作成プロンプト

指定されたGitHubリポジトリの技術構成を分析し、詳細なレポート(.html)を作成する。

## 使い方
```
{このプロンプト}
metatool-ai/metamcp # 対象リポジトリ（URLも可）
```

## 実行ステップ

### 1. リポジトリ基本情報の取得
execute_command:
```bash
curl -s https://api.github.com/repos/{owner}/{repo} | jq '{
  name,
  full_name,
  description,
  owner: {
    login: .owner.login,
    avatar_url: .owner.avatar_url
  },
  language,
  size,
  stargazers_count,
  forks_count,
  watchers_count,
  license: {
    key: .license.key,
    name: .license.name,
    spdx_id: .license.spdx_id
  },
  topics,
  created_at,
  updated_at,
  pushed_at,
  default_branch
}'
```

### 2. `README.md` の取得
`https://raw.githubusercontent.com/{owner}/{repo}/{default_branch}/README.md`

### 3. `package.json` の取得
`https://raw.githubusercontent.com/{owner}/{repo}/{default_branch}/package.json`

### 4. ファイル構造の取得
execute_command:
```bash
# まずルート階層のみ取得
curl -s https://api.github.com/repos/{owner}/{repo}/git/trees/{default_branch} | jq -r '.tree | sort_by(.type == "blob") | .[] | .path + (if .type == "tree" then "/" else "" end)'

# 次に全ファイルを取得
curl -s https://api.github.com/repos/{owner}/{repo}/git/trees/{default_branch}?recursive=1 | jq -r '.tree | sort_by(.type == "blob") | .[0:1000] | .[] | .path + (if .type == "tree" then "/" else "" end)'
```

### 5. 技術構成の分析
以下の観点から技術スタックを分析：

#### フロントエンド
- 使用フレームワーク（React, Vue, Angularなど）
- UIライブラリ
- ビルドツール（Vite, Webpack, Rollupなど）
- スタイリング（CSS, Tailwind, Styled Componentsなど）

#### バックエンド
- ランタイム/プラットフォーム
- フレームワーク
- データベース
- API設計

#### 開発ツール
- パッケージマネージャー
- リンター/フォーマッタ
- テストフレームワーク
- CI/CDツール

#### インフラ/デプロイ
- ホスティングプラットフォーム
- クラウドサービス
- コンテナ化

#### {その他}

### 6. レポートの作成
絵文字、カード、タイルなどを活用し、視覚的にわかりやすい形式でレポートを作成する。

- container.max-width: 720px
- 各セクションをカードで分ける
- 各セクション名先頭にアイコン表示
- リンク先が明らかな要素はリンク化

#### アイコン表示
`Iconify Icon` を活用する。

```html
<script src="https://code.iconify.design/iconify-icon/3.0.0/iconify-icon.min.js"></script>

<iconify-icon icon="logos:react" width="48"></iconify-icon>
```

#### 形式
```md
# {repo_name}技術構成レポート

{description}

<!-- バッジ表示（アイコン、値） -->
- {owner.avatar} {owner}/{repo}（リンク）
- ライセンス
- スター数

## 技術構成
### {各セクション名}
{各ライブラリ（タイル表示、アイコン{width,height=48}、タイルはライブラリのリポジトリにリンク）}

## プロジェクト構造
{各主要フォルダ、ファイルの説明（ツリー表示、アイコン）}

## 特徴
{アイコン、タイトル、説明（タイル表示、ポイント太字）}
```

## 注意
- ツールの指定がある場合、**必ず**そのツールを使うこと。