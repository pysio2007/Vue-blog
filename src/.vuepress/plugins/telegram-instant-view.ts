import type { Plugin } from "@vuepress/core";
import type { Page } from "@vuepress/core";

export const telegramInstantViewPlugin = (): Plugin => ({
  name: "telegram-instant-view",
  
  onInitialized(app) {
    // Add global meta tags that are set in config.ts
  },
  
  extendsPage(page: Page) {
    // Only process blog posts and articles
    if (page.path.includes('/posts/') || page.path.includes('/en/posts/')) {
      const frontmatter = page.frontmatter as Record<string, any>;
      
      // Set article-specific meta tags
      if (!page.frontmatter.head) {
        page.frontmatter.head = [];
      }
      
      const headArray = page.frontmatter.head as Array<[string, Record<string, string>, string?]>;
      
      // Add publication date if available
      if (frontmatter.date) {
        const publishedDate = new Date(String(frontmatter.date)).toISOString();
        headArray.push([
          "meta", 
          { property: "article:published_time", content: publishedDate }
        ]);
        headArray.push([
          "meta", 
          { name: "article:published_time", content: publishedDate }
        ]);
      }
      
      // Add article tags
      if (frontmatter.tag && Array.isArray(frontmatter.tag)) {
        frontmatter.tag.forEach((tag: any) => {
          headArray.push([
            "meta", 
            { property: "article:tag", content: String(tag) }
          ]);
        });
      }
      
      // Add article category
      if (frontmatter.category) {
        headArray.push([
          "meta", 
          { property: "article:section", content: String(frontmatter.category) }
        ]);
      }
      
      // Enhanced Open Graph for articles
      headArray.push([
        "meta", 
        { property: "og:title", content: String(frontmatter.title || page.title) }
      ]);
      
      headArray.push([
        "meta", 
        { property: "og:url", content: `https://www.pysio.online${page.path}` }
      ]);
      
      // Add article description if available
      if (frontmatter.description) {
        headArray.push([
          "meta", 
          { property: "og:description", content: String(frontmatter.description) }
        ]);
        headArray.push([
          "meta", 
          { name: "description", content: String(frontmatter.description) }
        ]);
      }
      
      // Add Twitter Card meta
      headArray.push([
        "meta", 
        { name: "twitter:title", content: String(frontmatter.title || page.title) }
      ]);
      
      if (frontmatter.description) {
        headArray.push([
          "meta", 
          { name: "twitter:description", content: String(frontmatter.description) }
        ]);
      }
      
      // Add structured data for better Telegram parsing
      const structuredData = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": String(frontmatter.title || page.title),
        "author": {
          "@type": "Person",
          "name": "Pysio",
          "url": "https://github.com/pysio2007"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Pysio's Home",
          "url": "https://www.pysio.online"
        },
        "url": `https://www.pysio.online${page.path}`,
        "datePublished": frontmatter.date ? new Date(String(frontmatter.date)).toISOString() : undefined,
        "dateModified": frontmatter.date ? new Date(String(frontmatter.date)).toISOString() : undefined,
        "description": frontmatter.description ? String(frontmatter.description) : "",
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `https://www.pysio.online${page.path}`
        }
      };
      
      // Add JSON-LD structured data
      headArray.push([
        "script",
        { type: "application/ld+json" },
        JSON.stringify(structuredData)
      ]);
      
      // Add canonical link
      headArray.push([
        "link",
        { rel: "canonical", href: `https://www.pysio.online${page.path}` }
      ]);
      
      // Add RSS link for blog posts
      if (page.path.includes('/posts/')) {
        headArray.push([
          "link",
          { 
            rel: "alternate", 
            type: "application/rss+xml", 
            title: "Pysio's Home RSS Feed",
            href: "https://www.pysio.online/rss.xml"
          }
        ]);
      }
    }
  }
});