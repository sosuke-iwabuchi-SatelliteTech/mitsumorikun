# user_group_details テーブル

## 概要
ユーザーグループの詳細情報(請求書情報、口座情報など)を管理するテーブル。

## テーブル構造

| カラム名 | データ型 | NULL | デフォルト値 | 制約 | 説明 |
|---------|---------|------|------------|------|------|
| id | UUID | NO | - | PRIMARY KEY | ID |
| user_group_id | UUID | NO | - | FOREIGN KEY, UNIQUE | ユーザーグループID |
| invoice_company_name | VARCHAR | YES | NULL | - | 請求書表示用会社名 |
| invoice_registration_number | VARCHAR | YES | NULL | - | インボイス登録番号 |
| zip_code | VARCHAR | YES | NULL | - | 郵便番号 |
| address1 | VARCHAR | YES | NULL | - | 住所1 |
| address2 | VARCHAR | YES | NULL | - | 住所2 |
| phone_number | VARCHAR | YES | NULL | - | 電話番号 |
| fax_number | VARCHAR | YES | NULL | - | FAX番号 |
| email | VARCHAR | YES | NULL | - | メールアドレス |
| account_method | VARCHAR | YES | NULL | - | 口座種別 (bank/japan_post) |
| use_bank | BOOLEAN | NO | false | - | 銀行口座使用フラグ |
| bank_name | VARCHAR | YES | NULL | - | 銀行名 |
| branch_name | VARCHAR | YES | NULL | - | 支店名 |
| account_type | VARCHAR | YES | NULL | - | 口座種別 |
| account_number | VARCHAR | YES | NULL | - | 口座番号 |
| account_holder | VARCHAR | YES | NULL | - | 口座名義 |
| use_japan_post | BOOLEAN | NO | false | - | ゆうちょ銀行使用フラグ |
| japan_post_bank_symbol | VARCHAR | YES | NULL | - | ゆうちょ銀行記号 |
| japan_post_bank_number | VARCHAR | YES | NULL | - | ゆうちょ銀行番号 |
| japan_post_bank_account_holder | VARCHAR | YES | NULL | - | ゆうちょ銀行口座名義 |
| created_at | TIMESTAMP | YES | NULL | - | 作成日時 |
| updated_at | TIMESTAMP | YES | NULL | - | 更新日時 |

## インデックス

| インデックス名 | カラム | タイプ |
|--------------|--------|--------|
| PRIMARY | id | PRIMARY KEY |
| user_group_details_user_group_id_unique | user_group_id | UNIQUE |

## リレーション

### 1対1のリレーション
- `user_groups` テーブル (user_group_id)

## 備考
- ユーザーグループごとに1レコードのみ存在
- 見積書・請求書に表示される発行者情報として使用
- `account_method` で 'bank' または 'japan_post' を選択
