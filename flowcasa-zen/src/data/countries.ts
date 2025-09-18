export interface Country {
  code: string;
  name: string;
  timezones: string[];
}

export const countries: Country[] = [
  {
    code: 'AR',
    name: 'Argentina',
    timezones: ['America/Argentina/Buenos_Aires', 'America/Argentina/Cordoba', 'America/Argentina/Mendoza']
  },
  {
    code: 'MX',
    name: 'México',
    timezones: ['America/Mexico_City', 'America/Cancun', 'America/Merida', 'America/Monterrey']
  },
  {
    code: 'ES',
    name: 'España',
    timezones: ['Europe/Madrid', 'Europe/Barcelona']
  },
  {
    code: 'CO',
    name: 'Colombia',
    timezones: ['America/Bogota']
  },
  {
    code: 'PE',
    name: 'Perú',
    timezones: ['America/Lima']
  },
  {
    code: 'CL',
    name: 'Chile',
    timezones: ['America/Santiago']
  },
  {
    code: 'VE',
    name: 'Venezuela',
    timezones: ['America/Caracas']
  },
  {
    code: 'EC',
    name: 'Ecuador',
    timezones: ['America/Guayaquil']
  },
  {
    code: 'UY',
    name: 'Uruguay',
    timezones: ['America/Montevideo']
  },
  {
    code: 'PY',
    name: 'Paraguay',
    timezones: ['America/Asuncion']
  },
  {
    code: 'BO',
    name: 'Bolivia',
    timezones: ['America/La_Paz']
  },
  {
    code: 'US',
    name: 'Estados Unidos',
    timezones: ['America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles']
  },
  {
    code: 'CA',
    name: 'Canadá',
    timezones: ['America/Toronto', 'America/Vancouver', 'America/Montreal']
  },
  {
    code: 'BR',
    name: 'Brasil',
    timezones: ['America/Sao_Paulo', 'America/Rio_Branco', 'America/Manaus']
  }
];

export const getTimezonesForCountry = (countryCode: string): string[] => {
  const country = countries.find(c => c.code === countryCode);
  return country ? country.timezones : [];
};

export const formatTimezone = (timezone: string): string => {
  return timezone.replace('_', ' ').replace('/', ' - ');
};
