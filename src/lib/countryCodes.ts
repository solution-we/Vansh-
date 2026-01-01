export interface CountryCode {
  code: string;
  name: string;
  dial_code: string;
  flag: string;
}

export const COUNTRY_CODES: CountryCode[] = [
  { code: 'IN', name: 'India', dial_code: '+91', flag: '🇮🇳' },
  { code: 'US', name: 'United States', dial_code: '+1', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', dial_code: '+44', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', dial_code: '+1', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', dial_code: '+61', flag: '🇦🇺' },
  { code: 'DE', name: 'Germany', dial_code: '+49', flag: '🇩🇪' },
  { code: 'FR', name: 'France', dial_code: '+33', flag: '🇫🇷' },
  { code: 'IT', name: 'Italy', dial_code: '+39', flag: '🇮🇹' },
  { code: 'ES', name: 'Spain', dial_code: '+34', flag: '🇪🇸' },
  { code: 'JP', name: 'Japan', dial_code: '+81', flag: '🇯🇵' },
  { code: 'CN', name: 'China', dial_code: '+86', flag: '🇨🇳' },
  { code: 'KR', name: 'South Korea', dial_code: '+82', flag: '🇰🇷' },
  { code: 'SG', name: 'Singapore', dial_code: '+65', flag: '🇸🇬' },
  { code: 'AE', name: 'UAE', dial_code: '+971', flag: '🇦🇪' },
  { code: 'SA', name: 'Saudi Arabia', dial_code: '+966', flag: '🇸🇦' },
  { code: 'BR', name: 'Brazil', dial_code: '+55', flag: '🇧🇷' },
  { code: 'MX', name: 'Mexico', dial_code: '+52', flag: '🇲🇽' },
  { code: 'RU', name: 'Russia', dial_code: '+7', flag: '🇷🇺' },
  { code: 'ZA', name: 'South Africa', dial_code: '+27', flag: '🇿🇦' },
  { code: 'NZ', name: 'New Zealand', dial_code: '+64', flag: '🇳🇿' },
  { code: 'TH', name: 'Thailand', dial_code: '+66', flag: '🇹🇭' },
  { code: 'MY', name: 'Malaysia', dial_code: '+60', flag: '🇲🇾' },
  { code: 'ID', name: 'Indonesia', dial_code: '+62', flag: '🇮🇩' },
  { code: 'PH', name: 'Philippines', dial_code: '+63', flag: '🇵🇭' },
  { code: 'VN', name: 'Vietnam', dial_code: '+84', flag: '🇻🇳' },
  { code: 'BD', name: 'Bangladesh', dial_code: '+880', flag: '🇧🇩' },
  { code: 'PK', name: 'Pakistan', dial_code: '+92', flag: '🇵🇰' },
  { code: 'LK', name: 'Sri Lanka', dial_code: '+94', flag: '🇱🇰' },
  { code: 'NP', name: 'Nepal', dial_code: '+977', flag: '🇳🇵' },
  { code: 'NG', name: 'Nigeria', dial_code: '+234', flag: '🇳🇬' },
  { code: 'EG', name: 'Egypt', dial_code: '+20', flag: '🇪🇬' },
  { code: 'KE', name: 'Kenya', dial_code: '+254', flag: '🇰🇪' },
  { code: 'GH', name: 'Ghana', dial_code: '+233', flag: '🇬🇭' },
  { code: 'TR', name: 'Turkey', dial_code: '+90', flag: '🇹🇷' },
  { code: 'IL', name: 'Israel', dial_code: '+972', flag: '🇮🇱' },
  { code: 'NL', name: 'Netherlands', dial_code: '+31', flag: '🇳🇱' },
  { code: 'BE', name: 'Belgium', dial_code: '+32', flag: '🇧🇪' },
  { code: 'SE', name: 'Sweden', dial_code: '+46', flag: '🇸🇪' },
  { code: 'NO', name: 'Norway', dial_code: '+47', flag: '🇳🇴' },
  { code: 'DK', name: 'Denmark', dial_code: '+45', flag: '🇩🇰' },
  { code: 'FI', name: 'Finland', dial_code: '+358', flag: '🇫🇮' },
  { code: 'CH', name: 'Switzerland', dial_code: '+41', flag: '🇨🇭' },
  { code: 'AT', name: 'Austria', dial_code: '+43', flag: '🇦🇹' },
  { code: 'PL', name: 'Poland', dial_code: '+48', flag: '🇵🇱' },
  { code: 'PT', name: 'Portugal', dial_code: '+351', flag: '🇵🇹' },
  { code: 'GR', name: 'Greece', dial_code: '+30', flag: '🇬🇷' },
  { code: 'IE', name: 'Ireland', dial_code: '+353', flag: '🇮🇪' },
  { code: 'CZ', name: 'Czech Republic', dial_code: '+420', flag: '🇨🇿' },
  { code: 'HU', name: 'Hungary', dial_code: '+36', flag: '🇭🇺' },
  { code: 'RO', name: 'Romania', dial_code: '+40', flag: '🇷🇴' },
  { code: 'UA', name: 'Ukraine', dial_code: '+380', flag: '🇺🇦' },
  { code: 'AR', name: 'Argentina', dial_code: '+54', flag: '🇦🇷' },
  { code: 'CL', name: 'Chile', dial_code: '+56', flag: '🇨🇱' },
  { code: 'CO', name: 'Colombia', dial_code: '+57', flag: '🇨🇴' },
  { code: 'PE', name: 'Peru', dial_code: '+51', flag: '🇵🇪' },
  { code: 'VE', name: 'Venezuela', dial_code: '+58', flag: '🇻🇪' },
  { code: 'QA', name: 'Qatar', dial_code: '+974', flag: '🇶🇦' },
  { code: 'KW', name: 'Kuwait', dial_code: '+965', flag: '🇰🇼' },
  { code: 'BH', name: 'Bahrain', dial_code: '+973', flag: '🇧🇭' },
  { code: 'OM', name: 'Oman', dial_code: '+968', flag: '🇴🇲' },
  { code: 'HK', name: 'Hong Kong', dial_code: '+852', flag: '🇭🇰' },
  { code: 'TW', name: 'Taiwan', dial_code: '+886', flag: '🇹🇼' },
];

export function getCountryByCode(code: string): CountryCode | undefined {
  return COUNTRY_CODES.find(c => c.code === code);
}

export function getCountryByDialCode(dialCode: string): CountryCode | undefined {
  return COUNTRY_CODES.find(c => c.dial_code === dialCode);
}
