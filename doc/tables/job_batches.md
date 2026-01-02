# job_batches テーブル

## 概要
Laravelのバッチジョブを管理するテーブル。

## テーブル構造

| カラム名 | データ型 | NULL | デフォルト値 | 制約 | 説明 |
|---------|---------|------|------------|------|------|
| id | VARCHAR | NO | - | PRIMARY KEY | バッチID |
| name | VARCHAR | NO | - | - | バッチ名 |
| total_jobs | INTEGER | NO | - | - | 総ジョブ数 |
| pending_jobs | INTEGER | NO | - | - | 保留中ジョブ数 |
| failed_jobs | INTEGER | NO | - | - | 失敗ジョブ数 |
| failed_job_ids | LONGTEXT | NO | - | - | 失敗ジョブIDリスト |
| options | MEDIUMTEXT | YES | NULL | - | オプション |
| cancelled_at | INTEGER | YES | NULL | - | キャンセル日時(UNIXタイムスタンプ) |
| created_at | INTEGER | NO | - | - | 作成日時(UNIXタイムスタンプ) |
| finished_at | INTEGER | YES | NULL | - | 完了日時(UNIXタイムスタンプ) |

## インデックス

| インデックス名 | カラム | タイプ |
|--------------|--------|--------|
| PRIMARY | id | PRIMARY KEY |

## 備考
- Laravelのバッチジョブ機能で使用
- 複数のジョブをバッチとして管理
- システムが自動的に管理するテーブル
