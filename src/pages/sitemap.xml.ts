import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const SITE = 'https://utku.space';

const escapeXml = (value: string) => value
	.replaceAll('&', '&amp;')
	.replaceAll('<', '&lt;')
	.replaceAll('>', '&gt;')
	.replaceAll('"', '&quot;')
	.replaceAll("'", '&apos;');

export const GET: APIRoute = async () => {
	const articles = (await getCollection('articles')).sort(
		(a, b) => b.data.published.valueOf() - a.data.published.valueOf()
	);
	const latestDate = articles[0]?.data.updated ?? articles[0]?.data.published;

	const urls = [
		{
			loc: `${SITE}/`,
			lastmod: latestDate?.toISOString().slice(0, 10),
			changefreq: 'monthly',
			priority: '1.0'
		},
		...articles.map((article) => ({
			loc: `${SITE}/articles/${article.id}/`,
			lastmod: (article.data.updated ?? article.data.published).toISOString().slice(0, 10),
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
