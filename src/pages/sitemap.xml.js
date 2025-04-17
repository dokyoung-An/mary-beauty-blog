import { getCollection } from 'astro:content';

export async function get({ site }) {
  // import.meta.glob을 사용하여 Markdown/MDX 파일 가져오기
  const postsImportResult = import.meta.glob('../posts/*.{md,mdx}', { eager: true });
  const posts = Object.values(postsImportResult);

  return {
    body: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${site}about</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
  </url>
  <url>
    <loc>${site}contact</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
  </url>
  <url>
    <loc>${site}privacy-policy</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>yearly</changefreq>
  </url>
  ${posts.map((post) => {
    const postPath = post.file.split('/').pop()?.replace(/\.(md|mdx)$/, '');
    const pubDate = new Date(post.frontmatter.date).toISOString();
    return `
  <url>
    <loc>${site}posts/${postPath}</loc>
    <lastmod>${pubDate}</lastmod>
    <changefreq>monthly</changefreq>
  </url>`;
  }).join('')}
</urlset>`,
  };
} 