# estimate_templates テーブル

## 概要
見積テンプレートの基本情報を管理するテーブル。

## テーブル構造

| カラム名 | データ型 | NULL | デフォルト値 | 制約 | 説明 |
|---------|---------|------|------------|------|------|
| id | UUID | NO | - | PRIMARY KEY | テンプレートID |
| user_group_id | UUID | NO | - | FOREIGN KEY | 所属ユーザーグループID |
| name | VARCHAR | NO | - | - | テンプレート名 |
| remarks | TEXT | YES | NULL | - | 備考 |
| created_at | TIMESTAMP | YES | NULL | - | 作成日時 |
| updated_at | TIMESTAMP | YES | NULL | - | 更新日時 |

## インデックス

| インデックス名 | カラム | タイプ |
|--------------|--------|--------|
| PRIMARY | id | PRIMARY KEY |

## リレーション

### 多対1のリレーション
- `user_groups` テーブル (user_group_id)

### 1対多のリレーション
- `estimate_template_details` テーブル (estimate_template_id)

## 備考
- ユーザーグループごとにテンプレートを管理
