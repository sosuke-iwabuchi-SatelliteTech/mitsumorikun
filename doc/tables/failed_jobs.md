# failed_jobs テーブル

## 概要

失敗したキュージョブを記録するテーブル。

## テーブル構造

| カラム名   | データ型  | NULL | デフォルト値      | 制約        | 説明             |
| ---------- | --------- | ---- | ----------------- | ----------- | ---------------- |
| id         | BIGINT    | NO   | AUTO_INCREMENT    | PRIMARY KEY | ID               |
| uuid       | VARCHAR   | NO   | -                 | UNIQUE      | ジョブUUID       |
| connection | TEXT      | NO   | -                 | -           | 接続名           |
| queue      | TEXT      | NO   | -                 | -           | キュー名         |
| payload    | LONGTEXT  | NO   | -                 | -           | ジョブペイロード |
| exception  | LONGTEXT  | NO   | -                 | -           | 例外情報         |
| failed_at  | TIMESTAMP | NO   | CURRENT_TIMESTAMP | -           | 失敗日時         |

## インデックス

| インデックス名          | カラム | タイプ      |
| ----------------------- | ------ | ----------- |
| PRIMARY                 | id     | PRIMARY KEY |
| failed_jobs_uuid_unique | uuid   | UNIQUE      |

## 備考

- Laravelのキューシステムで失敗したジョブを記録
- デバッグや再試行のために使用
- システムが自動的に管理するテーブル
