export type Material = {
  id: string;
  materialCode: string;
  description: string;
  status: 'سالم' | 'معیوب';
  partNumber?: string;
};
