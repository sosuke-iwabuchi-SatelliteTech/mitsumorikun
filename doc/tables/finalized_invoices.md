# finalized_invoices テーブル

## 概要
確定済みの見積書・請求書データを管理するテーブル。

## テーブル構造

| カラム名 | データ型 | NULL | デフォルト値 | 制約 | 説明 |
|---------|---------|------|------------|------|------|
| id | UUID | NO | - | PRIMARY KEY | 確定データID |
| invoice_id | UUID | NO | - | FOREIGN KEY | 見積・請求書ID |
| user_group_id | UUID | NO | - | FOREIGN KEY | 所属ユーザーグループID |
| customer_id | UUID | NO | - | FOREIGN KEY | 顧客ID |
| estimate_number | VARCHAR | NO | - | - | 管理番号 |
| version | INTEGER | NO | - | - | バージョン番号 |
| document_type | VARCHAR | NO | 'estimate' | - | 帳票タイプ (estimate/invoice) |
| title | VARCHAR | NO | - | - | 件名 |
| estimate_date | DATE | NO | - | - | 見積日 |
| delivery_deadline | DATE | YES | NULL | - | 納期 |
| construction_address | VARCHAR | YES | NULL | - | 工事場所 |
| payment_terms | VARCHAR | YES | NULL | - | 支払条件 |
| expiration_date | DATE | YES | NULL | - | 有効期限 |
| remarks | TEXT | YES | NULL | - | 備考 |
| total_amount | DECIMAL(15,2) | NO | 0 | - | 合計金額 |
| tax_amount | DECIMAL(15,2) | NO | 0 | - | 消費税額 |
| issuer_name | VARCHAR | YES | NULL | - | 発行者名 |
| issuer_registration_number | VARCHAR | YES | NULL | - | インボイス登録番号 |
| issuer_address | VARCHAR | YES | NULL | - | 発行者住所 |
| issuer_tel | VARCHAR | YES | NULL | - | 発行者電話番号 |
| issuer_fax | VARCHAR | YES | NULL | - | 発行者FAX番号 |
| bank_name | VARCHAR | YES | NULL | - | 銀行名 |
| branch_name | VARCHAR | YES | NULL | - | 支店名 |
| account_type | VARCHAR | YES | NULL | - | 口座種別 |
| account_number | VARCHAR | YES | NULL | - | 口座番号 |
| account_holder | VARCHAR | YES | NULL | - | 口座名義 |
| japan_post_bank_symbol | VARCHAR | YES | NULL | - | ゆうちょ銀行記号 |
| japan_post_bank_number | VARCHAR | YES | NULL | - | ゆうちょ銀行番号 |
| japan_post_bank_account_holder | VARCHAR | YES | NULL | - | ゆうちょ銀行口座名義 |
| created_at | TIMESTAMP | YES | NULL | - | 作成日時 |
| updated_at | TIMESTAMP | YES | NULL | - | 更新日時 |

## インデックス

| インデックス名 | カラム | タイプ |
|--------------|--------|--------|
| PRIMARY | id | PRIMARY KEY |
| finalized_invoices_invoice_id_foreign | invoice_id | FOREIGN KEY |
| finalized_invoices_user_group_id_foreign | user_group_id | FOREIGN KEY |
| finalized_invoices_customer_id_foreign | customer_id | FOREIGN KEY |

## リレーション

### 多対1のリレーション
- `invoices` テーブル (invoice_id)
- `user_groups` テーブル (user_group_id)
- `customers` テーブル (customer_id)

### 1対多のリレーション
- `finalized_invoice_details` テーブル (finalized_invoice_id)

## 備考
- ステータスが「見積提出済み」または「請求書提出済み」に変更されたときに作成（確定される）
- 元の `invoices` テーブルのデータが変更（修正・再提出）されても、過去の確定データは保持される
- 確定時の情報を完全に保存するため、全フィールドをコピー
