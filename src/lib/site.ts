import { getCollection, type CollectionEntry } from 'astro:content';

export const SITE = 'https://utku.space';
export const AUTHOR_NAME = 'Mehmet Utku Öztürk';
export const PERSON_ID = `${SITE}/#person`;

export type Article = CollectionEntry<'articles'>;

export const getArticles = async () =>
	(await getCollection('articles')).sort(
		(a, b) => b.data.published.valueOf() - a.data.published.valueOf()
	);

export const articleUrl = (article: Article) => `${SITE}/articles/${article.id}/`;
export const articleMarkdownUrl = (article: Article) => `${SITE}/articles/${article.id}.md`;
export const lastModified = (article: Article) => article.data.updated ?? article.data.published;

export const isoDate = (date: Date) => date.toISOString().slice(0, 10);
export const formatDate = (date: Date) => date.toLocaleDateString('en-GB', {
	day: 'numeric',
	month: 'long',
	year: 'numeric',
	timeZone: 'UTC'
});

export const wordCount = (article: Article) => (article.body ?? '').split(/\s+/).filter(Boolean).length;

export const escapeXml = (value: string) => value
	.replaceAll('&', '&amp;')
	.replaceAll('<', '&lt;')
	.replaceAll('>', '&gt;')
	.replaceAll('"', '&quot;')
	.replaceAll("'", '&apos;');

// the plain-markdown twin of an article page. served at /articles/<id>.md and
// inlined into llms-full.txt, so language models can read it without parsing html.
export const articleMarkdown = (article: Article) => {
	const { title, description, published, updated, tags } = article.data;
	return [
		`# ${title}`,
		'',
		`> ${description}`,
		'',
		`- Author: [${AUTHOR_NAME}](${SITE}/)`,
		`- Published: ${isoDate(published)}`,
		...(updated ? [`- Updated: ${isoDate(updated)}`] : []),
		...(tags.length ? [`- Tags: ${tags.join(', ')}`] : []),
		`- Canonical URL: ${articleUrl(article)}`,
		'',
		(article.body ?? '').trim(),
		''
	].join('\n');
};
