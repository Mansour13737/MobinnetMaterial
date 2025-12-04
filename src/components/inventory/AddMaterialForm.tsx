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

const formSchema = z.object({
  materialCode: z.string().min(1, 'کد متریال الزامی است.'),
  description: z.string().min(1, 'شرح متریال الزامی است.'),
  partNumber: z.string().optional(),
  oldMaterialNumberMCI: z.string().optional(),
  newMaterialNumberMCI: z.string().optional(),
  otherOldMaterialNumber: z.string().optional(),
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
      partNumber: '',
      oldMaterialNumberMCI: '',
      newMaterialNumberMCI: '',
      otherOldMaterialNumber: '',
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
                  <FormLabel>Material</FormLabel>
                  <FormControl>
                    <Input placeholder="مثلا 10001234" {...field} />
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
                  <FormLabel>Material description</FormLabel>
                  <FormControl>
                    <Input placeholder="مثلا TOWER SECTION 20M" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="partNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Part Number</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="oldMaterialNumberMCI"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Old Material Number MCI</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="newMaterialNumberMCI"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Material Number MCI</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="otherOldMaterialNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Other Old Material Number</FormLabel>
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
