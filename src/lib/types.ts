export type Material = {
  id: string;
  name: string;
  type: string;
  category: string;
  healthyCode: string;
  defectiveCode: string;
  status: 'سالم' | 'معیوب';
  quantity: number;
  lastUpdated: string;
};

export type UserRole = 'مدیر' | 'انباردار' | 'مشاهده‌گر';
