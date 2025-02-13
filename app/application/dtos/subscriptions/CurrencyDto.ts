// @@@ pwned by 1m4unkn0wn @@@
export interface CurrencyDto {
  name: string;
  value: string;
  symbol: string;
  default?: boolean;
  disabled?: boolean;
  parities?: { from: string; parity: number }[];
  symbolRight?: boolean;
  thousandSeparator?: string;
  decimalSeparator?: string;
}
