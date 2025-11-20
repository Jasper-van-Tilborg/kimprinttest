"use server";

import { createServer } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Helper to upload image to Supabase Storage
async function uploadImage(file: File, productName: string): Promise<string | null> {
  const supabase = await createServer();

  // Generate unique filename
  const fileExt = file.name.split(".").pop();
  const sanitizedName = productName.toLowerCase().replace(/[^a-z0-9]/g, "-");
  const fileName = `${sanitizedName}-${Date.now()}.${fileExt}`;
  const filePath = `products/${fileName}`;

  const { data, error } = await supabase.storage
    .from("product-images")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Upload error:", error);
    return null;
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("product-images").getPublicUrl(data.path);

  return publicUrl;
}

// Helper to delete image from Supabase Storage
async function deleteImage(url: string): Promise<void> {
  const supabase = await createServer();

  // Extract file path from URL
  // URL format: https://[project].supabase.co/storage/v1/object/public/product-images/products/filename.jpg
  const urlParts = url.split("/storage/v1/object/public/product-images/");
  if (urlParts.length < 2) {
    console.warn("Invalid image URL format:", url);
    return;
  }

  const filePath = urlParts[1];
  const { error } = await supabase.storage.from("product-images").remove([filePath]);

  if (error) {
    console.error("Error deleting image:", error);
  }
}

// Helper to delete multiple images
async function deleteImages(urls: string[]): Promise<void> {
  const supabase = await createServer();

  const filePaths: string[] = [];
  for (const url of urls) {
    const urlParts = url.split("/storage/v1/object/public/product-images/");
    if (urlParts.length >= 2) {
      filePaths.push(urlParts[1]);
    }
  }

  if (filePaths.length > 0) {
    const { error } = await supabase.storage.from("product-images").remove(filePaths);
    if (error) {
      console.error("Error deleting images:", error);
    }
  }
}

export type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  stock: number;
  image_url: string | null;
  images: string[] | null;
  sales_count: number;
  created_at: string;
  updated_at: string;
};

// GET ALL PRODUCTS
export async function getAllProducts(): Promise<Product[]> {
  const supabase = await createServer();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Fetch error:", error);
    throw new Error(`Failed to fetch products: ${error.message}`);
  }

  return data || [];
}

// GET ONE PRODUCT
export async function getProduct(id: string): Promise<Product | null> {
  const supabase = await createServer();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Fetch error:", error);
    return null;
  }

  return data;
}

// CREATE PRODUCT
export async function createProduct(formData: FormData) {
  const supabase = await createServer();

  // Check authentication
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  // Extract form data
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = formData.get("price") as string;
  const category = formData.get("category") as string;
  const stock = formData.get("stock") as string;
  const imageFile = formData.get("image") as File | null;
  const imagesInput = formData.get("images") as string;

  // Validation
  if (!name || !price || !category) {
    throw new Error("Naam, prijs en categorie zijn verplicht");
  }

  // Upload image if provided
  let image_url: string | null = null;
  let images: string[] | null = null;

  if (imageFile && imageFile.size > 0) {
    // Single image upload
    image_url = await uploadImage(imageFile, name);
    if (image_url) {
      images = [image_url];
    }
  } else if (imagesInput) {
    // Multiple images from JSON array
    try {
      images = JSON.parse(imagesInput);
      image_url = images && images.length > 0 ? images[0] : null;
    } catch {
      // If not JSON, treat as single image URL
      image_url = imagesInput || null;
      images = image_url ? [image_url] : null;
    }
  }

  // Insert into database
  const { error } = await supabase.from("products").insert({
    name,
    description: description || null,
    price: parseFloat(price),
    category,
    stock: parseInt(stock) || 0,
    image_url: image_url || null,
    images: images,
    sales_count: 0,
  });

  if (error) {
    console.error("Create error:", error);
    throw new Error(`Failed to create product: ${error.message}`);
  }

  // Revalidate pages that show products
  revalidatePath("/assortiment");
  revalidatePath("/admin/products");
  revalidatePath("/");

  // Redirect back to admin page
  redirect("/admin/products");
}

// UPDATE PRODUCT
export async function updateProduct(id: string, formData: FormData) {
  const supabase = await createServer();

  // Check authentication
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  // Get current product to check existing images
  const { data: currentProduct } = await supabase
    .from("products")
    .select("image_url, images")
    .eq("id", id)
    .single();

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = formData.get("price") as string;
  const category = formData.get("category") as string;
  const stock = formData.get("stock") as string;
  const imageFile = formData.get("image") as File | null;
  const imagesInput = formData.get("images") as string;
  const removeImage = formData.get("removeImage") === "true";

  // Validation
  if (!name || !price || !category) {
    throw new Error("Naam, prijs en categorie zijn verplicht");
  }

  let image_url: string | null = null;
  let images: string[] | null = null;

  // Handle image changes
  if (removeImage) {
    // Remove image - delete old images from storage
    if (currentProduct?.image_url) {
      await deleteImage(currentProduct.image_url);
    }
    if (currentProduct?.images && currentProduct.images.length > 0) {
      await deleteImages(currentProduct.images);
    }
    image_url = null;
    images = null;
  } else if (imageFile && imageFile.size > 0) {
    // New image uploaded - delete old images first
    if (currentProduct?.image_url) {
      await deleteImage(currentProduct.image_url);
    }
    if (currentProduct?.images && currentProduct.images.length > 0) {
      await deleteImages(currentProduct.images);
    }
    // Upload new image
    image_url = await uploadImage(imageFile, name);
    if (image_url) {
      images = [image_url];
    }
  } else if (imagesInput) {
    // Images provided as JSON array or string
    try {
      images = JSON.parse(imagesInput);
      image_url = images && images.length > 0 ? images[0] : null;
    } catch {
      image_url = imagesInput || null;
      images = image_url ? [image_url] : null;
    }
  } else {
    // Keep existing images
    image_url = currentProduct?.image_url || null;
    images = currentProduct?.images || null;
  }

  const { error } = await supabase
    .from("products")
    .update({
      name,
      description: description || null,
      price: parseFloat(price),
      category,
      stock: parseInt(stock) || 0,
      image_url: image_url || null,
      images: images,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Update error:", error);
    throw new Error(`Failed to update product: ${error.message}`);
  }

  // Revalidate affected pages
  revalidatePath("/assortiment");
  revalidatePath("/admin/products");
  revalidatePath(`/product/${id}`);
  revalidatePath("/");

  redirect("/admin/products");
}

// DELETE PRODUCT
export async function deleteProduct(id: string) {
  const supabase = await createServer();

  // Check authentication
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  // Get product to delete associated images
  const { data: product } = await supabase
    .from("products")
    .select("image_url, images")
    .eq("id", id)
    .single();

  // Delete images from storage if they exist
  if (product) {
    if (product.image_url) {
      await deleteImage(product.image_url);
    }
    if (product.images && product.images.length > 0) {
      await deleteImages(product.images);
    }
  }

  // Delete product from database
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    console.error("Delete error:", error);
    throw new Error(`Failed to delete product: ${error.message}`);
  }

  // Revalidate pages
  revalidatePath("/assortiment");
  revalidatePath("/admin/products");
  revalidatePath("/");
}

// GET PRODUCTS BY CATEGORY
export async function getProductsByCategory(category: string): Promise<Product[]> {
  const supabase = await createServer();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category", category)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Fetch error:", error);
    return [];
  }

  return data || [];
}

