import { PriceHistoryItem } from "@/types";

// extract the price from amazon product
export function extractPrice(...elements: any) {
  for (const element of elements) {
    const priceText = element.text().trim();

    if(priceText) {
      const cleanPrice = priceText.replace(/[^\d.]/g, '');

      let firstPrice; 

      if (cleanPrice) {
        firstPrice = cleanPrice.match(/\d+\.\d{2}/)?.[0];
      } 
      return firstPrice || cleanPrice;
    }
  }
  return '';
}

//extracting currency
export function extractCurrency(element: any) {
  const currencyText = element.text().trim().slice(0,1);
  return currencyText ? currencyText : "";
}

//decription
export function extractDescription($: any) {
  // these are possible elements holding description of the product
  const selectors = [
    ".a-unordered-list .a-list-item",
    ".a-expander-content p",
    // Add more selectors here if needed
  ];

  for (const selector of selectors) {
    const elements = $(selector);
    if (elements.length > 0) {
      const textContent = elements
        .map((_: any, element: any) => $(element).text().trim())
        .get()
        .join("\n");
      return textContent;
    }
  }

  // If no matching elements were found, return an empty string
  return "";
}


export function getHighestPrice(priceList : PriceHistoryItem[]){
  return 1;
}

export function getLowestPrice(priceList : PriceHistoryItem[]){
  return 1;
}

export function getAveragePrice(priceList : PriceHistoryItem[]){
  return 1;
}

export const formatNumber = (num: number = 0) => {
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};