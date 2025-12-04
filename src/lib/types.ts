export type Material = {
  id: string;
  materialCode: string;
  description: string;
  baseUnit: string;
  status: 'سالم' | 'معیوب';
};

export type UserRole = 'مدیر' | 'انباردار' | 'مشاهده‌گر';
