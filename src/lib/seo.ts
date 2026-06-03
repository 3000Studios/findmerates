export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "FindMeRates.com",
    "url": "https://findmerates.com",
    "logo": "https://findmerates.com/logo.jpg",
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "hello@findmerates.com",
      "contactType": "customer service"
    }
  };
}

export function generateBreadcrumbSchema(items: { name: string, item: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `https://findmerates.com${item.item}`
    }))
  };
}

export function generateProductSchema(name: string, description: string, rate: number) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": name,
    "description": description,
    "offers": {
      "@type": "Offer",
      "price": rate,
      "priceCurrency": "USD"
    }
  };
}
