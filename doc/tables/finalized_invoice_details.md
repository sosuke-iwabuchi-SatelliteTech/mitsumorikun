# finalized_invoice_details テーブル

## 概要

確定済みの見積書・請求書データの明細を管理するテーブル。

## テーブル構造

| カラム名             | データ型      | NULL | デフォルト値 | 制約        | 説明                         |
| -------------------- | ------------- | ---- | ------------ | ----------- | ---------------------------- |
| id                   | UUID          | NO   | -            | PRIMARY KEY | 確定明細ID                   |
| finalized_invoice_id | UUID          | NO   | -            | FOREIGN KEY | 確定請求書情報ID             |
| item_name            | VARCHAR       | NO   | -            | -           | 品目名                       |
| quantity             | DECIMAL(15,2) | NO   | 1            | -           | 数量                         |
| unit_price           | DECIMAL(15,2) | NO   | 0            | -           | 単価                         |
| unit                 | VARCHAR       | YES  | NULL         | -           | 単位                         |
| tax_rate             | DECIMAL(5,2)  | NO   | 0.10         | -           | 税率(小数)                   |
| tax_classification   | VARCHAR       | NO   | 'exclusive'  | -           | 税区分 (inclusive/exclusive) |
| amount               | DECIMAL(15,2) | NO   | 0            | -           | 金額                         |
| group_name           | VARCHAR       | YES  | NULL         | -           | グループ名                   |
| display_order        | INTEGER       | NO   | 0            | -           | 表示順序                     |
| remarks              | TEXT          | YES  | NULL         | -           | 備考                         |
| created_at           | TIMESTAMP     | YES  | NULL         | -           | 作成日時                     |
| updated_at           | TIMESTAMP     | YES  | NULL         | -           | 更新日時                     |

## インデックス

| インデックス名                                         | カラム               | タイプ      |
| ------------------------------------------------------ | -------------------- | ----------- |
| PRIMARY                                                | id                   | PRIMARY KEY |
| finalized_invoice_details_finalized_invoice_id_foreign | finalized_invoice_id | FOREIGN KEY |

## リレーション

### 多対1のリレーション

- `finalized_invoices` テーブル (finalized_invoice_id)

## 備考

- `finalized_invoices` テーブルに紐づく明細のスナップショット
- 元の `invoice_details` テーブルのデータが変更されても、過去の確定データは保持される
- 確定時の情報を完全に保存するため、全フィールドをコピー
