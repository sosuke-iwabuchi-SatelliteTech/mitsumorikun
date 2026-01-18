import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

/**
 * タイムゾーンの影響を受けずに日付をフォーマットします。
 * @param dateString YYYY-MM-DD または ISO形式の文字列
 * @param formatStr date-fns のフォーマット文字列
 * @returns フォーマットされた文字列
 */
export const formatDate = (
    dateString: string | null | undefined,
    formatStr: string = 'yyyy/MM/dd'
) => {
    if (!dateString) return '-';

    // YYYY-MM-DD または YYYY/MM/DD の形式（時刻なし）をチェック
    if (/^\d{4}[-/]\d{1,2}[-/]\d{1,2}$/.test(dateString)) {
        const [year, month, day] = dateString.split(/[-/]/).map(Number);
        const date = new Date(year, month - 1, day);
        return format(date, formatStr, { locale: ja });
    }

    // それ以外の形式（ISO形式など）は通常の Date オブジェクトとして扱う
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '-';
        return format(date, formatStr, { locale: ja });
    } catch (e) {
        return '-';
    }
};
