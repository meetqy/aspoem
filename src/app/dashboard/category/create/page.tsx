"use client";

import { useForm } from "react-hook-form";
import slugify from "slugify";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/trpc/react";

interface CategoryFormData {
  name: string;
  slug: string;
}

const generateSlug = (name: string): string => slugify(name, { lower: true, strict: true, trim: true });

export default function CreateCategoryPage() {
  const createCategory = api.category.create.useMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CategoryFormData>({
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  const onSubmit = async (data: CategoryFormData) => {
    try {
      await createCategory.mutateAsync({
        name: data.name,
        slug: data.slug,
        token: process.env.NEXT_PUBLIC_ADMIN_TOKEN!,
      });

      alert("Category created successfully!");
      reset();
    } catch (error) {
      console.error("Error creating category:", error);
      alert("Failed to create category. Please try again.");
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setValue("slug", generateSlug(name));
  };

  return (
    <div className="container mx-auto max-w-2xl py-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Category</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Category Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Category Name *</Label>
              <Input
                id="name"
                type="text"
                {...register("name", {
                  required: "Category name is required",
                  minLength: {
                    value: 2,
                    message: "Category name must be at least 2 characters",
                  },
                  maxLength: {
                    value: 50,
                    message: "Category name cannot exceed 50 characters",
                  },
                })}
                onChange={handleNameChange}
                placeholder="Enter category name"
              />
              {errors.name && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.name.message}</AlertDescription>
                </Alert>
              )}
            </div>

            {/* URL Slug */}
            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug *</Label>
              <Input
                id="slug"
                type="text"
                {...register("slug", {
                  required: "URL Slug is required",
                  pattern: {
                    value: /^[a-z0-9-]+$/,
                    message: "URL Slug can only contain lowercase letters, numbers and hyphens",
                  },
                })}
                placeholder="url-slug"
              />
              {errors.slug && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.slug.message}</AlertDescription>
                </Alert>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4">
              <Button type="submit" disabled={createCategory.isPending} className="flex-1">
                {createCategory.isPending ? "Creating..." : "Create Category"}
              </Button>

              <Button type="button" variant="outline" onClick={() => reset()}>
                Reset
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
