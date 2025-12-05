export type Material = {
  id: string;
  materialCode: string;
  description: string;
  partNumber?: string;
  status: 'سالم' | 'معیوب';
  location?: 'بالای دکل' | 'داخل رک' | 'پایین رک';
};
