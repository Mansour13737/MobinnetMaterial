'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { Material } from '@/lib/types';

const formSchema = z.object({
  materialCode: z.string().min(1, 'کد متریال الزامی است.'),
  description: z.string().min(1, 'شرح متریال الزامی است.'),
  designation: z.string().optional(),
  technicalIdentifier: z.string().optional(),
  version: z.string().optional(),
});

type AddMaterialFormValues = z.infer<typeof formSchema>;

interface AddMaterialFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onAddMaterial: (data: AddMaterialFormValues) => void;
  isSubmitting: boolean;
}

export function AddMaterialForm({
  isOpen,
  onOpenChange,
  onAddMaterial,
  isSubmitting,
}: AddMaterialFormProps) {
  const form = useForm<AddMaterialFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      materialCode: '',
      description: '',
      designation: '',
      technicalIdentifier: '',
      version: '',
    },
  });

  const onSubmit = (data: AddMaterialFormValues) => {
    onAddMaterial(data);
  };
  
  React.useEffect(() => {
    if (!isOpen) {
      form.reset();
    }
  }, [isOpen, form]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>افزودن متریال جدید</DialogTitle>
          <DialogDescription>
            اطلاعات متریال جدید را در فرم زیر وارد کنید.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="materialCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>کد متریال</FormLabel>
                  <FormControl>
                    <Input placeholder="مثلا M10001234" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>شرح متریال</FormLabel>
                  <FormControl>
                    <Input placeholder="مثلا TOWER SECTION 20M" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="designation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Designation</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="technicalIdentifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Technical Identifier</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="version"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Version</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                لغو
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'در حال ذخیره...' : 'ذخیره'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
