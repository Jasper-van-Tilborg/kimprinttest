"use server";

import { createServer } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type Collection = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  hero_image: string | null;
  is_featured: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
};

// GET ALL COLLECTIONS
export async function getAllCollections(): Promise<Collection[]> {
  const supabase = await createServer();
  const { data, error } = await supabase
    .from("collections")
    .select("*")
    .order("display_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching collections:", error);
    return [];
  }

  return data || [];
}

// GET COLLECTION BY ID
export async function getCollection(id: string): Promise<Collection | null> {
  const supabase = await createServer();
  const { data, error } = await supabase
    .from("collections")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching collection:", error);
    return null;
  }

  return data;
}

// GET COLLECTION BY SLUG
export async function getCollectionBySlug(slug: string): Promise<Collection | null> {
  const supabase = await createServer();
  const { data, error } = await supabase
    .from("collections")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching collection by slug:", error);
    return null;
  }

  return data;
}

// GET FEATURED COLLECTION
export async function getFeaturedCollection(): Promise<Collection | null> {
  const supabase = await createServer();
  const { data, error } = await supabase
    .from("collections")
    .select("*")
    .eq("is_featured", true)
    .order("display_order", { ascending: true })
    .limit(1)
    .single();

  if (error) {
    // Geen featured collectie gevonden is geen error
    if (error.code === 'PGRST116') {
      return null;
    }
    console.error("Error fetching featured collection:", error);
    return null;
  }

  return data;
}

// CREATE COLLECTION
export async function createCollection(formData: FormData) {
  const supabase = await createServer();
  
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const hero_image = formData.get("hero_image") as string;
  const is_featured = formData.get("is_featured") === "true";
  const display_order = parseInt(formData.get("display_order") as string) || 0;

  if (!name) {
    throw new Error("Naam is verplicht");
  }

  // Genereer slug van naam
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const { data, error } = await supabase.from("collections").insert({
    name,
    slug,
    description: description || null,
    hero_image: hero_image || null,
    is_featured,
    display_order,
  }).select().single();

  if (error) {
    console.error("Create error:", error);
    throw new Error(`Failed to create collection: ${error.message}`);
  }

  // Haal product IDs op uit formData
  const productIdsInput = formData.get("product_ids") as string;
  if (productIdsInput && data) {
    const productIds = productIdsInput.split(",").filter(id => id.trim());
    if (productIds.length > 0) {
      const insertData = productIds.map((productId) => ({
        product_id: productId.trim(),
        collection_id: data.id,
      }));

      const { error: linkError } = await supabase
        .from("product_collections")
        .insert(insertData);

      if (linkError) {
        console.error("Error linking products to collection:", linkError);
        // Niet fatal, collectie is al aangemaakt
      }
    }
  }

  revalidatePath("/admin/collections");
  revalidatePath("/assortiment");
  redirect("/admin/collections");
}

// UPDATE COLLECTION
export async function updateCollection(id: string, formData: FormData) {
  const supabase = await createServer();

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const hero_image = formData.get("hero_image") as string;
  const is_featured = formData.get("is_featured") === "true";
  const display_order = parseInt(formData.get("display_order") as string) || 0;

  if (!name) {
    throw new Error("Naam is verplicht");
  }

  // Genereer slug van naam
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const { error } = await supabase
    .from("collections")
    .update({
      name,
      slug,
      description: description || null,
      hero_image: hero_image || null,
      is_featured,
      display_order,
    })
    .eq("id", id);

  if (error) {
    console.error("Update error:", error);
    throw new Error(`Failed to update collection: ${error.message}`);
  }

  // Update product koppelingen
  const productIdsInput = formData.get("product_ids") as string;
  if (productIdsInput !== null) {
    const productIds = productIdsInput ? productIdsInput.split(",").filter(id => id.trim()) : [];
    
    // Verwijder alle bestaande relaties
    const { error: deleteError } = await supabase
      .from("product_collections")
      .delete()
      .eq("collection_id", id);

    if (deleteError) {
      console.error("Error removing product collections:", deleteError);
    }

    // Voeg nieuwe relaties toe
    if (productIds.length > 0) {
      const insertData = productIds.map((productId) => ({
        product_id: productId.trim(),
        collection_id: id,
      }));

      const { error: insertError } = await supabase
        .from("product_collections")
        .insert(insertData);

      if (insertError) {
        console.error("Error adding product collections:", insertError);
        // Niet fatal, collectie is al bijgewerkt
      }
    }
  }

  revalidatePath("/admin/collections");
  revalidatePath("/assortiment");
  redirect("/admin/collections");
}

// DELETE COLLECTION
export async function deleteCollection(id: string) {
  const supabase = await createServer();

  const { error } = await supabase.from("collections").delete().eq("id", id);

  if (error) {
    console.error("Delete error:", error);
    throw new Error(`Failed to delete collection: ${error.message}`);
  }

  revalidatePath("/admin/collections");
  revalidatePath("/assortiment");
}

// GET PRODUCTS IN COLLECTION
export async function getProductsInCollection(collectionId: string) {
  const supabase = await createServer();
  
  const { data, error } = await supabase
    .from("product_collections")
    .select("product_id, products(*)")
    .eq("collection_id", collectionId);

  if (error) {
    console.error("Error fetching products in collection:", error);
    return [];
  }

  return data || [];
}

// ADD PRODUCT TO COLLECTION
export async function addProductToCollection(productId: string, collectionId: string) {
  const supabase = await createServer();

  const { error } = await supabase.from("product_collections").insert({
    product_id: productId,
    collection_id: collectionId,
  });

  if (error) {
    console.error("Error adding product to collection:", error);
    throw new Error(`Failed to add product to collection: ${error.message}`);
  }

  revalidatePath("/admin/collections");
  revalidatePath("/admin/products");
  revalidatePath("/assortiment");
}

// REMOVE PRODUCT FROM COLLECTION
export async function removeProductFromCollection(productId: string, collectionId: string) {
  const supabase = await createServer();

  const { error } = await supabase
    .from("product_collections")
    .delete()
    .eq("product_id", productId)
    .eq("collection_id", collectionId);

  if (error) {
    console.error("Error removing product from collection:", error);
    throw new Error(`Failed to remove product from collection: ${error.message}`);
  }

  revalidatePath("/admin/collections");
  revalidatePath("/admin/products");
  revalidatePath("/assortiment");
}

// GET COLLECTIONS FOR PRODUCT
export async function getCollectionsForProduct(productId: string): Promise<Collection[]> {
  const supabase = await createServer();
  
  const { data, error } = await supabase
    .from("product_collections")
    .select("collection_id, collections(*)")
    .eq("product_id", productId);

  if (error) {
    console.error("Error fetching collections for product:", error);
    return [];
  }

  return (data || []).map((item: any) => item.collections).filter(Boolean);
}

// UPDATE PRODUCT COLLECTIONS (bulk update)
export async function updateProductCollections(productId: string, collectionIds: string[]) {
  const supabase = await createServer();

  // Verwijder alle bestaande relaties
  const { error: deleteError } = await supabase
    .from("product_collections")
    .delete()
    .eq("product_id", productId);

  if (deleteError) {
    console.error("Error removing product collections:", deleteError);
    throw new Error(`Failed to update product collections: ${deleteError.message}`);
  }

  // Voeg nieuwe relaties toe
  if (collectionIds.length > 0) {
    const insertData = collectionIds.map((collectionId) => ({
      product_id: productId,
      collection_id: collectionId,
    }));

    const { error: insertError } = await supabase
      .from("product_collections")
      .insert(insertData);

    if (insertError) {
      console.error("Error adding product collections:", insertError);
      throw new Error(`Failed to update product collections: ${insertError.message}`);
    }
  }

  revalidatePath("/admin/products");
  revalidatePath("/admin/collections");
  revalidatePath("/assortiment");
}

