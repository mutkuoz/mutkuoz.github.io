import type { APIRoute } from 'astro';
import { AUTHOR_NAME, SITE, articleUrl, escapeXml, getArticles, lastModified } from '../lib/site';

const cdata = (value: string) => `<![CDATA[${value.replaceAll(']]>', ']]]]><![CDATA[>')}]]>`;

export const GET: APIRoute = async () => {
	const articles = await getArticles();
	const lastBuild = articles[0] ? lastModified(articles[0]) : new Date();

	const items = articles.map((article) => {
		const url = articleUrl(article);
		const html = article.rendered?.html;
		return `\t\t<item>
\t\t\t<title>${escapeXml(article.data.title)}</title>
\t\t\t<link>${url}</link>
\t\t\t<guid isPermaLink="true">${url}</guid>
\t\t\t<description>${escapeXml(article.data.description)}</description>
\t\t\t<pubDate>${article.data.published.toUTCString()}</pubDate>
\t\t\t<dc:creator>${escapeXml(AUTHOR_NAME)}</dc:creator>
${article.data.tags.map((tag) => `\t\t\t<category>${escapeXml(tag)}</category>\n`).join('')}${html ? `\t\t\t<content:encoded>${cdata(html)}</content:encoded>\n` : ''}\t\t</item>`;
	});

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/">
\t<channel>
\t\t<title>utku’s space — articles by ${escapeXml(AUTHOR_NAME)}</title>
\t\t<link>${SITE}/</link>
\t\t<atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml" />
\t\t<description>Articles by ${escapeXml(AUTHOR_NAME)}, a machine learning developer and AI researcher in Ankara, Türkiye, on connectomics, artificial consciousness, and AI systems.</description>
\t\t<language>en</language>
\t\t<lastBuildDate>${lastBuild.toUTCString()}</lastBuildDate>
${items.join('\n')}
\t</channel>
</rss>\n`;

	return new Response(body, {
		headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' }
	});
};
