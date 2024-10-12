
export function formatDateStr(dateStr: string): string {
    let result = '';
    const now = new Date();
    const date = new Date(dateStr);

    if (now.getTime() - date.getTime() < 1000 * 60 * 60 * 24) {
        // Less than 24 hours
        result += String(date.getHours()).padStart(2, '0') + ':';
        result += String(date.getMinutes()).padStart(2, '0')
    } else {
        
        
        
        result += String(date.getHours()).padStart(2, '0') + ':';
        result += String(date.getMinutes()).padStart(2, '0') + ' ';
        result += String(date.getDate()).padStart(2, '0') + '-';
        result += String(date.getMonth() + 1).padStart(2, '0') + '-';
        result += date.getFullYear();
    }
    return result;
}