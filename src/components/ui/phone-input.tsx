import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { COUNTRY_CODES, CountryCode } from '@/lib/countryCodes';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';

interface PhoneInputProps {
  value: string;
  countryCode: string;
  onValueChange: (phone: string) => void;
  onCountryCodeChange: (code: string) => void;
  placeholder?: string;
  required?: boolean;
}

export function PhoneInput({
  value,
  countryCode,
  onValueChange,
  onCountryCodeChange,
  placeholder = 'Phone number',
  required = false,
}: PhoneInputProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const selectedCountry = COUNTRY_CODES.find(c => c.dial_code === countryCode) || COUNTRY_CODES[0];

  const filteredCountries = COUNTRY_CODES.filter(
    c => 
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.dial_code.includes(search)
  );

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers
    const numericValue = e.target.value.replace(/[^0-9]/g, '');
    onValueChange(numericValue);
  };

  return (
    <div className="flex gap-2">
      {/* Country Code Selector */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-1 h-12 px-3 border border-border bg-background text-sm hover:bg-secondary transition-colors shrink-0"
          >
            <span className="text-lg">{selectedCountry.flag}</span>
            <span className="text-sm">{selectedCountry.dial_code}</span>
            <ChevronDown className="w-3 h-3 text-muted-foreground" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-0" align="start">
          <div className="p-2 border-b border-border">
            <Input
              placeholder="Search country..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9"
            />
          </div>
          <ScrollArea className="h-64">
            <div className="p-1">
              {filteredCountries.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => {
                    onCountryCodeChange(country.dial_code);
                    setOpen(false);
                    setSearch('');
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-secondary rounded-sm transition-colors ${
                    country.dial_code === countryCode ? 'bg-secondary' : ''
                  }`}
                >
                  <span className="text-lg">{country.flag}</span>
                  <span className="flex-1 text-left">{country.name}</span>
                  <span className="text-muted-foreground">{country.dial_code}</span>
                </button>
              ))}
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>

      {/* Phone Number Input */}
      <Input
        type="tel"
        inputMode="numeric"
        pattern="[0-9]*"
        value={value}
        onChange={handlePhoneChange}
        placeholder={placeholder}
        required={required}
        className="flex-1 h-12"
      />
    </div>
  );
}
