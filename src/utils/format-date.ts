export function formatDate(date: any): string | null {
    if (date == null)
        return null

    if (!(date instanceof Date))
        return null

    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long' }
    return date.toLocaleDateString('en-US', options)
}