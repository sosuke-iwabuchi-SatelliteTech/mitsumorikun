# estimate_template_details テーブル

## 概要

見積テンプレートの明細情報を管理するテーブル。

## テーブル構造

| カラム名             | データ型      | NULL | デフォルト値 | 制約        | 説明                        |
| -------------------- | ------------- | ---- | ------------ | ----------- | --------------------------- |
| id                   | UUID          | NO   | -            | PRIMARY KEY | テンプレート明細ID          |
| estimate_template_id | UUID          | NO   | -            | FOREIGN KEY | 親テンプレートID            |
| item_name            | VARCHAR       | NO   | -            | -           | 品名                        |
| quantity             | DECIMAL(15,2) | NO   | 1            | -           | 数量                        |
| unit                 | VARCHAR       | YES  | NULL         | -           | 単位                        |
| unit_price           | DECIMAL(15,2) | NO   | 0            | -           | 単価                        |
| tax_classification   | VARCHAR       | NO   | 'exclusive'  | -           | 税区分(exclusive/inclusive) |
| amount               | DECIMAL(15,2) | NO   | 0            | -           | 金額                        |
| group_name           | VARCHAR       | YES  | NULL         | -           | グループ名（任意）          |
| remarks              | TEXT          | YES  | NULL         | -           | 備考 (仕様、色、サイズなど) |
| created_at           | TIMESTAMP     | YES  | NULL         | -           | 作成日時                    |
| updated_at           | TIMESTAMP     | YES  | NULL         | -           | 更新日時                    |

## インデックス

| インデックス名 | カラム | タイプ      |
| -------------- | ------ | ----------- |
| PRIMARY        | id     | PRIMARY KEY |

## リレーション

### 多対1のリレーション

- `estimate_templates` テーブル (estimate_template_id)

## 備考

- `remarks` は個別の明細項目に対する補足情報（仕様、色、サイズなど）を格納するために使用
