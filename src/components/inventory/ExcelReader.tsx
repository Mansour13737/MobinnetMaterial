'use client';

import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import * as XLSX from 'xlsx';
import type { Material } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface ExcelReaderProps {
  onFileProcessed: (data: Omit<Material, 'id' | 'status'>[]) => void;
}

export const ExcelReader = forwardRef(({ onFileProcessed }: ExcelReaderProps, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useImperativeHandle(ref, () => ({
    click: () => {
      inputRef.current?.click();
    },
  }));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = event.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        // Assuming headers are: No.,Material,Material description,Part Number
        const materials: Omit<Material, 'id' | 'status'>[] = json.slice(1).map((row: any) => {
          return {
            materialCode: String(row[1] || ''),
            description: String(row[2] || ''),
            partNumber: String(row[3] || ''),
          };
        }).filter(m => m.materialCode && m.description);

        if(materials.length > 0) {
            onFileProcessed(materials);
        } else {
            toast({
                variant: 'destructive',
                title: 'فایل خالی یا نامعتبر',
                description: 'هیچ داده معتبری در فایل اکسل یافت نشد. لطفاً ساختار فایل را بررسی کنید.',
            });
        }
      } catch (error) {
        console.error("Error processing Excel file:", error);
        toast({
            variant: 'destructive',
            title: 'خطا در پردازش فایل',
            description: 'امکان خواندن فایل اکسل وجود ندارد. لطفاً مطمئن شوید فایل معتبر است.',
        });
      } finally {
        if(inputRef.current) {
            inputRef.current.value = '';
        }
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <input
      ref={inputRef}
      type="file"
      accept=".xlsx, .xls, .csv"
      className="hidden"
      onChange={handleFileChange}
    />
  );
});

ExcelReader.displayName = 'ExcelReader';
