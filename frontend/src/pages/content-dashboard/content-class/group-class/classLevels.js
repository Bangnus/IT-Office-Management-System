// The three study levels. `match` is the text that a year group's name (vc.classroom, e.g. "ปวช.1") contains.
export const CLASS_LEVELS = {
    vc: { match: 'ปวช', label: 'ปวช.', path: '/home/Vocational-Certificate' },
    hvc: { match: 'ปวส', label: 'ปวส.', path: '/home/Higher-Vocational-Certificate' },
    ba: { match: 'ป.ตรี', label: 'ป.ตรี', path: '/home/Bachelors-Degree' },
};

/** The level a class or year-group name belongs to, e.g. "ปวส.1/2" gives the hvc level. */
export const levelOfName = (name = '') =>
    Object.values(CLASS_LEVELS).find((level) => name.includes(level.match)) ?? null;

export const byThaiName = (a = '', b = '') => (a ?? '').localeCompare(b ?? '', 'th', { numeric: true });
