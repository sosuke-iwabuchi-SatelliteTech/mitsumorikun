# invoices テーブル

## 概要
見積書・請求書の基本情報を管理するテーブル。

## テーブル構造

| カラム名 | データ型 | NULL | デフォルト値 | 制約 | 説明 |
|---------|---------|------|------------|------|------|
| id | UUID | NO | - | PRIMARY KEY | 見積・請求書ID |
| user_group_id | UUID | NO | - | FOREIGN KEY | 所属ユーザーグループID |
| customer_id | UUID | NO | - | FOREIGN KEY | 顧客ID |
| estimate_number | VARCHAR | NO | - | - | 見積番号(6桁英数字) |
| version | INTEGER | NO | 1 | - | バージョン番号 |
| status | VARCHAR | NO | - | - | ステータス |
| title | VARCHAR | NO | - | - | 件名 |
| estimate_date | DATE | NO | - | - | 見積日 |
| delivery_deadline | DATE | YES | NULL | - | 納期 |
| construction_address | VARCHAR | YES | NULL | - | 工事場所 |
| payment_terms | VARCHAR | YES | NULL | - | 支払条件 |
| expiration_date | DATE | YES | NULL | - | 有効期限 |
| remarks | TEXT | YES | NULL | - | 備考 |
| total_amount | DECIMAL(15,2) | NO | 0 | - | 合計金額 |
| tax_amount | DECIMAL(15,2) | NO | 0 | - | 消費税額 |
| issuer_name | VARCHAR | YES | NULL | - | 発行者名(スナップショット) |
| issuer_registration_number | VARCHAR | YES | NULL | - | インボイス登録番号(スナップショット) |
| issuer_address | VARCHAR | YES | NULL | - | 発行者住所(スナップショット) |
| issuer_tel | VARCHAR | YES | NULL | - | 発行者電話番号(スナップショット) |
| issuer_fax | VARCHAR | YES | NULL | - | 発行者FAX番号(スナップショット) |
| bank_name | VARCHAR | YES | NULL | - | 銀行名(スナップショット) |
| branch_name | VARCHAR | YES | NULL | - | 支店名(スナップショット) |
| account_type | VARCHAR | YES | NULL | - | 口座種別(スナップショット) |
| account_number | VARCHAR | YES | NULL | - | 口座番号(スナップショット) |
| account_holder | VARCHAR | YES | NULL | - | 口座名義(スナップショット) |
| japan_post_bank_symbol | VARCHAR | YES | NULL | - | ゆうちょ銀行記号(スナップショット) |
| japan_post_bank_number | VARCHAR | YES | NULL | - | ゆうちょ銀行番号(スナップショット) |
| japan_post_bank_account_holder | VARCHAR | YES | NULL | - | ゆうちょ銀行口座名義(スナップショット) |
| created_at | TIMESTAMP | YES | NULL | - | 作成日時 |
| updated_at | TIMESTAMP | YES | NULL | - | 更新日時 |

## インデックス

| インデックス名 | カラム | タイプ |
|--------------|--------|--------|
| PRIMARY | id | PRIMARY KEY |
| invoices_user_group_id_estimate_number_version_unique | user_group_id, estimate_number, version | UNIQUE |

## リレーション

### 多対1のリレーション
- `user_groups` テーブル (user_group_id)
- `customers` テーブル (customer_id)

### 1対多のリレーション
- `invoice_details` テーブル (invoice_id)
- `invoice_histories` テーブル (invoice_id)

## ステータス一覧

| ステータス値 | 説明 |
|------------|------|
| creating | 見積作成中 |
| submitted | 見積提出済み |
| order_received | 受注済み |
| invoice_creating | 請求書作成中 |
| invoice_submitted | 請求書提出済み |
| payment_confirmed | 入金確認済み |

## 備考
- `estimate_number` + `version` でユーザーグループ内で一意
- 発行者情報(issuer_*)と口座情報は提出時にスナップショットとして保存
- ステータスが変更されるたびに履歴テーブルにスナップショットを保存
