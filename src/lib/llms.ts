import { papers, type Paper } from '../data/research';
import {
	AUTHOR_NAME,
	SITE,
	articleMarkdown,
	articleMarkdownUrl,
	articleUrl,
	formatDate,
	getArticles,
	type Article
} from './site';

// llms.txt (https://llmstxt.org): a markdown map of who i am and what i've made.
// research and articles are generated, so new writing appears without hand edits.

const intro = `# ${AUTHOR_NAME}

> Machine learning developer and AI researcher based in Ankara, Türkiye. Focused on
> artificial consciousness, neuro-symbolic AI, connectomics, and agentic "thinking"
> systems. Technical co-founder of turkhukuk.ai, creator of FlyDOOM and the open-source
> 007captcha, first author of HukukBERT, founder of 23rd the company. Mensa
> International member and Save the Children volunteer.

Started programming at 8, picked up C++ and C# by 11, began working on machine
learning at 13, and fine-tuned a first LLM at 14. Also a competitive Class II
powerlifter, and interested in strongman, martial arts, cognitive science,
kinesiology, chess, sudoku, and coffee.

Several people share this name. This ${AUTHOR_NAME} is the one at ${SITE}/,
GitHub @mutkuoz, and ORCID 0009-0008-2400-5646.`;

const work = `## Work

- [turkhukuk.ai](https://www.turkhukuk.ai): LegalTech platform for Turkish lawyers —
  case research and litigation strategy. Trained and fine-tuned domain-specific
  language models on Turkish legal corpora; experimented with neuro-symbolic
  representations bridging statistical learning and structured legal reasoning.
  Technical co-founder, 2026 — present. Active.
- [FlyDOOM](https://github.com/mutkuoz/flydoom): A real fruit fly connectome playing
  Doom. Feeds game frames through the visual pathway of 139,255 reconstructed neurons
  and roughly 2.7 million synapses, then maps biological motor output back to game
  controls. Nothing is trained. Creator, 2026. Active.
- Clade AI: Personal AI assistant with task execution, integrations, and
  personalized interaction. Self-deciding multi-agent framework built in the early
  days of AI agents; fine-tuned an LLM for natural interaction; custom systems for
  smart memory and decision-making. Co-founder and AI developer, 2023–24. Shelved.
- Sorubot: AI platform generating exam questions and managing study sessions.
  Developer, 2022–23. Shelved.
- [007captcha](https://github.com/mutkuoz/007captcha): Open-source robophobic
  verification framework defending websites against AI agents — a CAPTCHA built for
  the post-LLM web. TypeScript, MIT licensed. Creator, 2026. Shelved.
- Octapar: AI platform clustering people into balanced 8-person "tribes" via a
  multi-stage clustering algorithm over weighted attentional embeddings and the
  Hungarian method. Founder and core developer, 2025. Paused.
- Styrk: Sports supplements with AI-driven personalization and AI-generated
  packaging. Co-founder and backend developer, 2025. Shelved.
- [Topazius](https://github.com/mutkuoz/topazius): Browser-based Markdown notes app
  backed by a private GitHub repository. Offline-first editing, background commits,
  wikilinks, backlinks, and optional client-side encryption. No backend or third-party
  storage. Creator, 2026. Active.`;

const contact = `## Contact

- Email: m@utku.space
- Mensa: utku.ozturk@member.mensa.org
- GitHub: https://github.com/mutkuoz
- X: https://x.com/mutkuoz
- LinkedIn: https://linkedin.com/in/mutkuoz
- Hugging Face: https://huggingface.co/mutkuoz
- ORCID: https://orcid.org/0009-0008-2400-5646
- Location: Ankara, Türkiye (GMT+3)`;

const listJoin = (items: string[]) =>
	items.length > 1 ? `${items.slice(0, -1).join(', ')} and ${items.at(-1)}` : items.join('');

const paperEntry = (paper: Paper) => {
	const [primary, ...more] = paper.links;
	const name = primary ? `[${paper.name}](${primary.url})` : paper.name;
	const context = [
		paper.journal ?? paper.venue,
		paper.year,
		...(paper.coAuthors ? [`with ${listJoin(paper.coAuthors)}`] : [])
	].join(', ');
	const also = more.length ? ` Also on ${more.map((link) => `[${link.label}](${link.url})`).join(', ')}.` : '';
	return `- ${name}\n  (${context}): ${paper.summary}${also}`;
};

const articleEntry = (article: Article) =>
	`- [${article.data.title}](${articleUrl(article)})\n  (${formatDate(article.data.published)}; markdown: ${articleMarkdownUrl(article)}): ${article.data.description}`;

export const llmsTxt = async () => {
	const articles = await getArticles();
	return [
		intro,
		work,
		`## Research\n\n${papers.map(paperEntry).join('\n')}`,
		`## Articles\n\n${articles.map(articleEntry).join('\n')}`,
		contact,
		`## Optional\n\n- [Full text of every article and research abstract](${SITE}/llms-full.txt)\n- [RSS feed](${SITE}/rss.xml)\n- [Sitemap](${SITE}/sitemap.xml)`
	].join('\n\n') + '\n';
};

export const llmsFullTxt = async () => {
	const articles = await getArticles();
	const abstracts = papers.map((paper) => `### ${paper.name}\n\n${paper.abstract}`).join('\n\n');
	return [
		(await llmsTxt()).trimEnd(),
		`## Research abstracts\n\n${abstracts}`,
		`## Articles, full text\n\n${articles.map((article) => articleMarkdown(article).trimEnd()).join('\n\n---\n\n')}`
	].join('\n\n---\n\n') + '\n';
};
