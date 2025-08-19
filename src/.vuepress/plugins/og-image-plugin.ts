import { Plugin } from 'vuepress';
import { generateOGImage } from '../utils/og-image-generator.js';
import { glob } from 'glob';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';

export const ogImagePlugin = (): Plugin => {
  return {
    name: 'og-image-plugin',
    
    async onGenerated(app) {
      try {
        console.log('Generating OG images for blog posts...');
        
        // Find all markdown files in posts directory (both Chinese and English)
        const postFiles = await glob('{posts/**/*.md,en/posts/**/*.md}', { 
          cwd: app.dir.source(),
          absolute: true 
        });
        
        console.log(`Found ${postFiles.length} post files`);
        
        for (const postFile of postFiles) {
          try {
            const content = readFileSync(postFile, 'utf-8');
            
            // Extract frontmatter
            const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
            if (!frontmatterMatch) {
              console.log(`No frontmatter found in ${postFile}`);
              continue;
            }
            
            const frontmatter = frontmatterMatch[1];
            const titleMatch = frontmatter.match(/^title:\s*(.+)$/m);
            const dateMatch = frontmatter.match(/^date:\s*(.+)$/m);
            
            if (!titleMatch) {
              console.log(`No title found in ${postFile}`);
              continue;
            }
            
            const title = titleMatch[1].trim().replace(/^["']|["']$/g, '');
            const date = dateMatch ? dateMatch[1].trim().replace(/^["']|["']$/g, '') : new Date().toLocaleDateString('zh-CN');
            const isEnglish = postFile.includes('/en/posts/');
            console.log(`Processing: ${title} (${isEnglish ? 'EN' : 'CN'})`);
            
            // Generate OG image
            const imagePath = await generateOGImage({
              title,
              siteName: "Pysio's Home",
              author: "Pysio",
              date,
              isEnglish,
              outputDir: join(app.dir.dest(), 'og-images')
            });
            
            console.log(`Generated OG image for: ${title} at ${imagePath}`);
            
          } catch (error) {
            console.error(`Error generating OG image for ${postFile}:`, error);
          }
        }
      } catch (error) {
        console.error('Error in OG image generation:', error);
      }
    },
    
    extendsPage(page) {
      // Add OG meta tags for blog posts (both Chinese and English)
      if (page.path.startsWith('/posts/') || page.path.startsWith('/en/posts/')) {
        const title = page.title || page.frontmatter.title;
        if (title) {
          const imagePath = `/og-images/${title
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .toLowerCase()
            .substring(0, 50)}.png`;
          
          // Add OG meta tags
          page.frontmatter.head = page.frontmatter.head || [];
          page.frontmatter.head.push(
            ['meta', { property: 'og:title', content: title }],
            ['meta', { property: 'og:description', content: page.frontmatter.description || 'Pysio\'s Home - 一个温暖的家' }],
            ['meta', { property: 'og:image', content: `https://www.pysio.online${imagePath}` }],
            ['meta', { property: 'og:url', content: `https://www.pysio.online${page.path}` }],
            ['meta', { property: 'og:type', content: 'article' }],
            ['meta', { property: 'og:site_name', content: 'Pysio\'s Home' }],
            ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
            ['meta', { name: 'twitter:title', content: title }],
            ['meta', { name: 'twitter:description', content: page.frontmatter.description || 'Pysio\'s Home - 一个温暖的家' }],
            ['meta', { name: 'twitter:image', content: `https://www.pysio.online${imagePath}` }]
          );
        }
      }
    }
  };
};
