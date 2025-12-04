'use client';

import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import * as XLSX from 'xlsx';
import type { Material } from '@/lib/types';
import { getStatusFromCode } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

interface ExcelReaderProps {
  onFileProcessed: (data: Material[]) => void;
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
        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        // Assuming headers are: 'Material Code', 'Description', 'Base Unit'
        // And data starts from the second row
        const materials: Material[] = json.slice(1).map((row: any, index: number) => {
          const materialCode = String(row[0] || '');
          return {
            id: `imported-${Date.now()}-${index}`,
            materialCode,
            description: String(row[1] || ''),
            baseUnit: String(row[2] || 'PC'),
            status: getStatusFromCode(materialCode),
          };
        }).filter(m => m.materialCode && m.description); // Filter out empty rows

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
        // Reset file input to allow selecting the same file again
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
