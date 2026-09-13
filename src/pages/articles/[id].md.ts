import type { APIRoute, GetStaticPaths } from 'astro';
import { articleMarkdown, getArticles, type Article } from '../../lib/site';

export const getStaticPaths = (async () => {
	const articles = await getArticles();
	return articles.map((article) => ({
		params: { id: article.id },
		props: { article }
	}));
}) satisfies GetStaticPaths;

export const GET: APIRoute<{ article: Article }> = ({ props }) =>
	new Response(articleMarkdown(props.article), {
		headers: { 'Content-Type': 'text/markdown; charset=utf-8' }
	});
