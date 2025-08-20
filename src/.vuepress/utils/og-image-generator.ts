import puppeteer from 'puppeteer';
import { mkdirSync, existsSync, writeFileSync } from 'fs';
import { join } from 'path';

/**
 * Options for generating OG images
 */
export interface OGImageOptions {
  title: string;
  siteName?: string;
  author?: string;
  date?: string;
  isEnglish?: boolean;
  width?: number;
  height?: number;
  backgroundColor?: string;
  titleColor?: string;
  siteNameColor?: string;
  outputDir?: string;
}

/**
 * Generates an OG image for a blog post using Puppeteer
 * @param options - Configuration options for the OG image
 * @returns Promise resolving to the relative path of the generated image
 */
export async function generateOGImage(options: OGImageOptions): Promise<string> {
  const {
    title,
    siteName = "Pysio's Home",
    author = "Pysio",
    date = new Date().toLocaleDateString('zh-CN'),
    isEnglish = false,
    width = 1200,
    height = 630,
    backgroundColor = '#ffffff',
    titleColor = '#000000',
    siteNameColor = '#666666',
    outputDir = 'src/.vuepress/public/og-images'
  } = options;

  // Generate filename from title
  // Support Chinese characters, remove special symbols, merge spaces directly
  const filename = `${title
    .replace(/[<>:"/\\|?*!@#$%^&()+=\[\]{}';,.~`！？。，、；：""''（）【】《》〈〉]/g, '') // Remove special symbols and Chinese punctuation
    .replace(/\s+/g, '')           // Merge spaces directly without dashes
    .substring(0, 100)            // Increase length limit for Chinese characters
    .toLowerCase()}.png`;

  // Ensure output directory exists
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = join(outputDir, filename);

  // Calculate font size based on title length
  let fontSize = 64;
  if (title.length > 30) fontSize = 48;
  if (title.length > 50) fontSize = 36;
  if (title.length > 80) fontSize = 28;

  // Create HTML template for the OG image
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap');
        body {
          margin: 0;
          padding: 0;
          width: ${width}px;
          height: ${height}px;
          background: linear-gradient(135deg, ${backgroundColor} 0%, #f5f5f5 100%);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          font-family: 'JetBrains Mono', monospace;
          position: relative;
          overflow: hidden;
        }
        .site-name {
          position: absolute;
          top: 50px;
          left: 50px;
          color: ${siteNameColor};
          font-size: 32px;
          font-weight: bold;
        }
        .title {
          color: ${titleColor};
          font-size: ${fontSize}px;
          font-weight: bold;
          text-align: center;
          line-height: 1.2;
          max-width: ${width - 100}px;
          word-wrap: break-word;
          padding: 0 50px;
        }
        .decorative-line {
          position: absolute;
          bottom: 100px;
          left: 50px;
          right: 50px;
          height: 2px;
          background: #cccccc;
        }
        .bottom-info {
          position: absolute;
          bottom: 20px;
          left: 50px;
          color: ${siteNameColor};
          font-size: 16px;
          font-weight: normal;
          line-height: 1.4;
        }
        .bg-pattern {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0.03;
          background-image: radial-gradient(circle at 1px 1px, #ddd 1px, transparent 0);
          background-size: 20px 20px;
        }
      </style>
    </head>
    <body>
      <div class="bg-pattern"></div>
      <div class="site-name">${siteName}</div>
      <div class="title">${title}</div>
      <div class="decorative-line"></div>
      <div class="bottom-info">
        ${isEnglish ? 'Author' : '作者'}: ${author}<br>
        ${isEnglish ? 'Date' : '日期'}: ${date}<br>
        Copyright © 2025 Pysio
      </div>
    </body>
    </html>
  `;

  try {
    // Launch browser and create screenshot
    const browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    await page.setViewport({ width, height });
    await page.setContent(html);
    
    // Wait for fonts to load
    await page.evaluateHandle('document.fonts.ready');
    
    const screenshot = await page.screenshot({ 
      type: 'png',
      fullPage: false
    });
    
    await browser.close();
    
    // Save image
    writeFileSync(outputPath, screenshot);
    
    console.log(`Generated OG image: ${filename}`);
    return `/og-images/${filename}`;
    
  } catch (error) {
    console.error(`Failed to generate OG image for "${title}":`, error);
    return '';
  }
}
