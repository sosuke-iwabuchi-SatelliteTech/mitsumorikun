# users テーブル

## 概要

システムのユーザー情報を管理するテーブル。

## テーブル構造

| カラム名          | データ型  | NULL | デフォルト値 | 制約               | 説明                           |
| ----------------- | --------- | ---- | ------------ | ------------------ | ------------------------------ |
| id                | UUID      | NO   | -            | PRIMARY KEY        | ユーザーID                     |
| user_group_id     | UUID      | YES  | NULL         | FOREIGN KEY, INDEX | 所属ユーザーグループID         |
| role              | VARCHAR   | NO   | 'general'    | -                  | ユーザーロール (general/admin) |
| name              | VARCHAR   | NO   | -            | -                  | ユーザー名                     |
| email             | VARCHAR   | NO   | -            | UNIQUE             | メールアドレス                 |
| email_verified_at | TIMESTAMP | YES  | NULL         | -                  | メール認証日時                 |
| password          | VARCHAR   | NO   | -            | -                  | パスワード(ハッシュ化)         |
| remember_token    | VARCHAR   | YES  | NULL         | -                  | Remember Meトークン            |
| created_at        | TIMESTAMP | YES  | NULL         | -                  | 作成日時                       |
| updated_at        | TIMESTAMP | YES  | NULL         | -                  | 更新日時                       |
| deleted_at        | TIMESTAMP | YES  | NULL         | -                  | 削除日時 (論理削除用)          |

## インデックス

| インデックス名            | カラム        | タイプ      |
| ------------------------- | ------------- | ----------- |
| PRIMARY                   | id            | PRIMARY KEY |
| users_email_unique        | email         | UNIQUE      |
| users_user_group_id_index | user_group_id | INDEX       |

## リレーション

### 多対1のリレーション

- `user_groups` テーブル (user_group_id)

## 備考

- `role` は 'general'(一般ユーザー) または 'admin'(管理者) を想定
- 管理者は顧客マスタにアクセスできない
- 一般ユーザーは顧客管理や見積作成が可能
