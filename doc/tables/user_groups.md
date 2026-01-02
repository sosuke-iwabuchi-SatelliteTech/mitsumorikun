# user_groups テーブル

## 概要
ユーザーグループ(組織・会社)を管理するテーブル。

## テーブル構造

| カラム名 | データ型 | NULL | デフォルト値 | 制約 | 説明 |
|---------|---------|------|------------|------|------|
| id | UUID | NO | - | PRIMARY KEY | ユーザーグループID |
| name | VARCHAR | NO | - | - | グループ名 |
| created_at | TIMESTAMP | YES | NULL | - | 作成日時 |
| updated_at | TIMESTAMP | YES | NULL | - | 更新日時 |

## インデックス

| インデックス名 | カラム | タイプ |
|--------------|--------|--------|
| PRIMARY | id | PRIMARY KEY |

## リレーション

### 1対多のリレーション
- `users` テーブル (user_group_id)
- `customers` テーブル (user_group_id)
- `invoice_items` テーブル (user_group_id)
- `user_group_details` テーブル (user_group_id)
- `invoices` テーブル (user_group_id)
- `invoice_histories` テーブル (user_group_id)

## 備考
- 各ユーザーグループは複数のユーザーを持つことができる
- グループごとに顧客や見積データを管理する
