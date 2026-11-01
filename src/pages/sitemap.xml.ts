import type { APIRoute } from 'astro';
import { SITE, articleUrl, escapeXml, getArticles, isoDate, lastModified } from '../lib/site';

export const GET: APIRoute = async () => {
	const articles = await getArticles();
	const latestDate = articles[0] && lastModified(articles[0]);

	const urls = [
		{
			loc: `${SITE}/`,
			lastmod: latestDate && isoDate(latestDate),
			changefreq: 'monthly',
			priority: '1.0'
		},
		...articles.map((article) => ({
			loc: articleUrl(article),
			lastmod: isoDate(lastModified(article)),
			changefreq: 'monthly',
			priority: '0.8'
		}))
	];

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `\t<url>
\t\t<loc>${escapeXml(url.loc)}</loc>
${url.lastmod ? `\t\t<lastmod>${url.lastmod}</lastmod>\n` : ''}\t\t<changefreq>${url.changefreq}</changefreq>
\t\t<priority>${url.priority}</priority>
\t</url>`).join('\n')}
</urlset>\n`;

	return new Response(body, {
		headers: { 'Content-Type': 'application/xml; charset=utf-8' }
	});
};
