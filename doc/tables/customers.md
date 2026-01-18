# customers テーブル

## 概要

顧客情報を管理するテーブル。

## テーブル構造

| カラム名            | データ型  | NULL | デフォルト値 | 制約               | 説明                   |
| ------------------- | --------- | ---- | ------------ | ------------------ | ---------------------- |
| id                  | UUID      | NO   | -            | PRIMARY KEY        | 顧客ID                 |
| user_group_id       | UUID      | NO   | -            | FOREIGN KEY, INDEX | 所属ユーザーグループID |
| name                | VARCHAR   | NO   | -            | -                  | 顧客名(会社名)         |
| contact_person_name | VARCHAR   | YES  | NULL         | -                  | 担当者名               |
| address             | VARCHAR   | YES  | NULL         | -                  | 住所                   |
| phone_number        | VARCHAR   | YES  | NULL         | -                  | 電話番号               |
| fax_number          | VARCHAR   | YES  | NULL         | -                  | FAX番号                |
| email               | VARCHAR   | YES  | NULL         | -                  | メールアドレス         |
| remarks             | TEXT      | YES  | NULL         | -                  | 備考                   |
| created_at          | TIMESTAMP | YES  | NULL         | -                  | 作成日時               |
| updated_at          | TIMESTAMP | YES  | NULL         | -                  | 更新日時               |
| deleted_at          | TIMESTAMP | YES  | NULL         | -                  | 削除日時 (論理削除用)  |

## インデックス

| インデックス名                | カラム        | タイプ      |
| ----------------------------- | ------------- | ----------- |
| PRIMARY                       | id            | PRIMARY KEY |
| customers_user_group_id_index | user_group_id | INDEX       |

## リレーション

### 多対1のリレーション

- `user_groups` テーブル (user_group_id)

### 1対多のリレーション

- `invoices` テーブル (customer_id)
- `finalized_invoices` テーブル (customer_id)

## 備考

- 一般ユーザーのみがアクセス可能
- 管理者ユーザーは顧客マスタにアクセスできない
- ユーザーグループごとに顧客を管理
