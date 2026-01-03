# invoice_items テーブル

## 概要
見積・請求書で使用する品目マスタを管理するテーブル。

## テーブル構造

| カラム名 | データ型 | NULL | デフォルト値 | 制約 | 説明 |
|---------|---------|------|------------|------|------|
| id | BIGINT | NO | AUTO_INCREMENT | PRIMARY KEY | 品目ID |
| user_group_id | BIGINT | NO | - | FOREIGN KEY | 所属ユーザーグループID |
| name | VARCHAR | NO | - | - | 品目名 |
| quantity | DECIMAL(10,2) | NO | 1 | - | 数量 |
| unit_price | DECIMAL(15,2) | NO | - | - | 単価 |
| unit | VARCHAR | YES | NULL | - | 単位 |
| tax_type | ENUM | NO | 'exc' | - | 税区分 (inc:税込, exc:税抜) |
| tax_rate | INTEGER | NO | 10 | - | 税率(%) |
| remarks | TEXT | YES | NULL | - | 備考 |
| created_at | TIMESTAMP | YES | NULL | - | 作成日時 |
| updated_at | TIMESTAMP | YES | NULL | - | 更新日時 |
| deleted_at | TIMESTAMP | YES | NULL | - | 削除日時 (論理削除用) |

## インデックス

| インデックス名 | カラム | タイプ |
|--------------|--------|--------|
| PRIMARY | id | PRIMARY KEY |
| invoice_items_user_group_id_foreign | user_group_id | FOREIGN KEY |

## リレーション

### 多対1のリレーション
- `user_groups` テーブル (user_group_id)

## 備考
- ユーザーグループごとに品目マスタを管理
- 見積書・請求書作成時に品目を選択して使用
- `tax_type` は 'inc'(税込) または 'exc'(税抜) を指定
- `tax_rate` は整数値でパーセンテージを保存 (例: 10 = 10%)
