# jobs テーブル

## 概要

Laravelのキュージョブを管理するテーブル。

## テーブル構造

| カラム名     | データ型         | NULL | デフォルト値   | 制約        | 説明                             |
| ------------ | ---------------- | ---- | -------------- | ----------- | -------------------------------- |
| id           | BIGINT           | NO   | AUTO_INCREMENT | PRIMARY KEY | ジョブID                         |
| queue        | VARCHAR          | NO   | -              | INDEX       | キュー名                         |
| payload      | LONGTEXT         | NO   | -              | -           | ジョブペイロード                 |
| attempts     | TINYINT UNSIGNED | NO   | -              | -           | 試行回数                         |
| reserved_at  | INTEGER UNSIGNED | YES  | NULL           | -           | 予約日時(UNIXタイムスタンプ)     |
| available_at | INTEGER UNSIGNED | NO   | -              | -           | 実行可能日時(UNIXタイムスタンプ) |
| created_at   | INTEGER UNSIGNED | NO   | -              | -           | 作成日時(UNIXタイムスタンプ)     |

## インデックス

| インデックス名   | カラム | タイプ      |
| ---------------- | ------ | ----------- |
| PRIMARY          | id     | PRIMARY KEY |
| jobs_queue_index | queue  | INDEX       |

## 備考

- Laravelのキューシステムで使用
- 非同期処理のジョブを管理
- システムが自動的に管理するテーブル
