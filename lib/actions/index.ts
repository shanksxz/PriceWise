"use server";

import { revalidatePath } from "next/cache";
import Product from "../models/product.model";
import { connectToDB } from "../mongoose";
import { scrapeAmazonProduct } from "../scraper/index";
import { getHighestPrice, getLowestPrice, getAveragePrice } from "../utils";

export async function scrapeAndStoreProduct(prodcutUrl: string) {
  if (!prodcutUrl) return;
  try {
    connectToDB();

    const scrapedProduct = await scrapeAmazonProduct(prodcutUrl);

    if (!scrapedProduct) return;

    let product = scrapedProduct;
    const existingProduct = await Product.findOne({ url: scrapedProduct.url });
    if (existingProduct) {
      const updatedPriceHistory: any = [
        ...existingProduct.priceHistory,
        {
          price: scrapedProduct.currentPrice,
        },
      ];

      product = {
        ...scrapedProduct,
        priceHistory: updatedPriceHistory,
        lowestPrice: getLowestPrice(updatedPriceHistory),
        highestPrice: getHighestPrice(updatedPriceHistory),
        averagePrice: getAveragePrice(updatedPriceHistory),
      };
    }

    const newProduct = await Product.findOneAndUpdate(
      { url: scrapedProduct.url },
      product,
      { upsert: true, new: true }
    );

    revalidatePath(`/products/${newProduct._id}`)

  } catch (error: any) {
    throw new Error(`Failed to create/update product: ${error.message}`);
  }
}


export async function getProductById(productId : string) {
    try {
        connectToDB()
        const product = await Product.findOne({_id : productId})
        if(!product) return null;
        return product;
    } catch (error) {
        console.log(error)
    }
}


export async function getAllProduct() {
    try {
        connectToDB()
        const product = await Product.find()
        return product
    } catch (error) {
        console.log(error)
    }
}