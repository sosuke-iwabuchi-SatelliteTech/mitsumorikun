# invoice_details テーブル

## 概要
見積書・請求書の明細行を管理するテーブル。

## テーブル構造

| カラム名 | データ型 | NULL | デフォルト値 | 制約 | 説明 |
|---------|---------|------|------------|------|------|
| id | UUID | NO | - | PRIMARY KEY | 明細ID |
| invoice_id | UUID | NO | - | FOREIGN KEY | 見積・請求書ID |
| item_name | VARCHAR | NO | - | - | 品目名 |
| quantity | DECIMAL(15,2) | NO | 1 | - | 数量 |
| unit_price | DECIMAL(15,2) | NO | 0 | - | 単価 |
| unit | VARCHAR | YES | NULL | - | 単位 |
| tax_rate | DECIMAL(5,2) | NO | 0.10 | - | 税率(小数) |
| tax_classification | VARCHAR | NO | 'exclusive' | - | 税区分 (inclusive/exclusive) |
| amount | DECIMAL(15,2) | NO | 0 | - | 金額 |
| group_name | VARCHAR | YES | NULL | - | グループ名 |
| display_order | INTEGER | NO | 0 | - | 表示順序 |
| remarks | TEXT | YES | NULL | - | 備考 |
| created_at | TIMESTAMP | YES | NULL | - | 作成日時 |
| updated_at | TIMESTAMP | YES | NULL | - | 更新日時 |

## インデックス

| インデックス名 | カラム | タイプ |
|--------------|--------|--------|
| PRIMARY | id | PRIMARY KEY |
| invoice_details_invoice_id_foreign | invoice_id | FOREIGN KEY |

## リレーション

### 多対1のリレーション
- `invoices` テーブル (invoice_id)

## 備考
- 1つの見積・請求書に複数の明細行が紐づく
- `tax_rate` は小数値で保存 (例: 0.10 = 10%)
- `tax_classification` は 'inclusive'(税込) または 'exclusive'(税抜)
- `group_name` で明細をグループ化可能
- `display_order` で明細の表示順序を制御
