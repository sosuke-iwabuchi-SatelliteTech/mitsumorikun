# sessions テーブル

## 概要

ユーザーセッション情報を管理するテーブル。

## テーブル構造

| カラム名      | データ型    | NULL | デフォルト値 | 制約               | 説明                                   |
| ------------- | ----------- | ---- | ------------ | ------------------ | -------------------------------------- |
| id            | VARCHAR     | NO   | -            | PRIMARY KEY        | セッションID                           |
| user_id       | UUID        | YES  | NULL         | FOREIGN KEY, INDEX | ユーザーID                             |
| ip_address    | VARCHAR(45) | YES  | NULL         | -                  | IPアドレス                             |
| user_agent    | TEXT        | YES  | NULL         | -                  | ユーザーエージェント                   |
| payload       | LONGTEXT    | NO   | -            | -                  | セッションペイロード                   |
| last_activity | INTEGER     | NO   | -            | INDEX              | 最終アクティビティ(UNIXタイムスタンプ) |

## インデックス

| インデックス名               | カラム        | タイプ      |
| ---------------------------- | ------------- | ----------- |
| PRIMARY                      | id            | PRIMARY KEY |
| sessions_user_id_index       | user_id       | INDEX       |
| sessions_last_activity_index | last_activity | INDEX       |

## リレーション

### 多対1のリレーション

- `users` テーブル (user_id)

## 備考

- Laravelのセッション管理で使用
- セッションドライバーが 'database' の場合に使用
- システムが自動的に管理するテーブル
