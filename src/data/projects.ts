// every project, in display order. the homepage's (some) work section and the cv page
// both render from this list, so a project is added or changed here once.
// `body` is trusted html (links are written inline), `role` is plain text.
export type ProjectCategory = 'open-source' | 'work' | 'unpublished';
export type ProjectStatus = 'live' | 'paused' | 'shelved';
export type Project = {
	name: string;
	category: ProjectCategory;
	status: ProjectStatus;
	role: string;
	body: string;
};

export const categories: ProjectCategory[] = ['open-source', 'work', 'unpublished'];
// small single-colour glyphs for the category headings: a penguin, a briefcase, a ghost
export const categoryIcon: Record<ProjectCategory, string> = {
	'open-source': '<svg class="work-cat-icon" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M12 1.8c-3.1 0-5.2 2.4-5.2 5.6v2.9c-1.9 1.9-3.4 4.6-3.4 7.3 0 2.9 2.4 4.6 5.6 4.6h6c3.2 0 5.6-1.7 5.6-4.6 0-2.7-1.5-5.4-3.4-7.3V7.4c0-3.2-2.1-5.6-5.2-5.6zM12 11.3c-2.2 0-3.9 2.4-3.9 5.2 0 2.5 1.7 4.1 3.9 4.1s3.9-1.6 3.9-4.1c0-2.8-1.7-5.2-3.9-5.2zM10.3 6.1a.95.95 0 1 0 0 1.9.95.95 0 0 0 0-1.9zm3.4 0a.95.95 0 1 0 0 1.9.95.95 0 0 0 0-1.9zM12 8.6l-1.5 1.1 1.5 1 1.5-1z"/><path d="M7.6 21.2h3.3l-.4 1.3H7.2zM13.1 21.2h3.3l.4 1.3h-3.3z"/></svg>',
	'work': '<svg class="work-cat-icon" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M9.4 3.5h5.2c.9 0 1.6.7 1.6 1.6V7h3.3c1.2 0 2.2 1 2.2 2.2v9.6c0 1.2-1 2.2-2.2 2.2H4.5c-1.2 0-2.2-1-2.2-2.2V9.2C2.3 8 3.3 7 4.5 7h3.3V5.1c0-.9.7-1.6 1.6-1.6zm.2 1.8V7h4.8V5.3zM2.3 12.6h8.1v.6c0 .4.3.7.7.7h1.8c.4 0 .7-.3.7-.7v-.6h8.1v1.4h-8.1v.2c0 .4-.3.7-.7.7h-1.8c-.4 0-.7-.3-.7-.7V14H2.3z"/></svg>',
	'unpublished': '<svg class="work-cat-icon" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M12 2.2c-4.1 0-7.3 3.3-7.3 7.4v11.6c0 .5.6.8 1 .5l1.9-1.4 2.1 1.6c.3.2.6.2.9 0L12 20.3l1.4 1.6c.3.2.6.2.9 0l2.1-1.6 1.9 1.4c.4.3 1 0 1-.5V9.6c0-4.1-3.2-7.4-7.3-7.4zM9.4 8.2a1.35 1.6 0 1 0 0 3.2 1.35 1.6 0 0 0 0-3.2zm5.2 0a1.35 1.6 0 1 0 0 3.2 1.35 1.6 0 0 0 0-3.2zM10.6 13.6c0 .8.6 1.5 1.4 1.5s1.4-.7 1.4-1.5z"/></svg>'
};
export const statusLabel: Record<ProjectStatus, string> = { live: 'active', paused: 'paused', shelved: 'shelved' };

export const projects: Project[] = [
	{
		name: 'flydoom',
		category: 'open-source',
		status: 'live',
		role: 'creator · 2026',
		body: '<p>a real fruit fly connectome playing doom. feeds the game through the visual pathway of 139,255 reconstructed neurons and roughly 2.7 million synapses, then maps biological motor output back to game controls. nothing is trained; the wiring is the fly&rsquo;s. <a href="https://github.com/mutkuoz/flydoom" target="_blank" rel="noopener" class="chip">github ↗</a> <a href="/articles/flydoom/" class="chip">story ↗</a></p>'
	},
	{
		name: '007captcha',
		category: 'open-source',
		status: 'shelved',
		role: 'creator · 2026',
		body: '<p>a robophobic verification framework that defends websites against ai agents. an open-source take on captcha built for the post-llm web, where classical challenges no longer hold. typescript. mit licensed. <a href="https://github.com/mutkuoz/007captcha" target="_blank" rel="noopener" class="chip">github ↗</a></p>'
	},
	{
		name: 'octapar',
		category: 'open-source',
		status: 'paused',
		role: 'founder & core dev · 2025',
		body: '<p>an ai platform that clusters people into 8-person &ldquo;tribes&rdquo; — balanced, semantically coherent groups for authentic connection and mutual growth. designed a multi-stage clustering algorithm around weighted attentional embeddings and the hungarian method. paper published via 23rd.</p>'
	},
	{
		name: 'topazius',
		category: 'open-source',
		status: 'live',
		role: 'creator · 2026',
		body: '<p>a browser-based markdown notes app whose database is a private github repository you own. works offline, commits edits in the background, supports wikilinks and backlinks, and can encrypt individual notes entirely on the client. no server, account, analytics, or third-party storage. <a href="https://github.com/mutkuoz/topazius" target="_blank" rel="noopener" class="chip">github ↗</a></p>'
	},
	{
		name: 'trstemmer',
		category: 'open-source',
		status: 'shelved',
		role: 'creator · 2023',
		body: '<p>a simple turkish word stemmer for python. it strips the suffixes off verbs: &ldquo;seviyorum, yapmışım, koşarlar&rdquo; comes out as &ldquo;sev yap koş&rdquo;. early and verb-only, but on pypi. <a href="https://github.com/mutkuoz/trstemmer" target="_blank" rel="noopener" class="chip">github ↗</a> <a href="https://pypi.org/project/trstemmer/" target="_blank" rel="noopener" class="chip">pypi ↗</a></p>'
	},
	{
		name: 'turkic-relevance-laya',
		category: 'open-source',
		status: 'live',
		role: 'creator · 2026',
		body: '<p>a classifier that reads a turkish wikipedia article and says how it relates to the turkic world: core, modern, or unrelated. laya-multilingual fine-tuned for project: turkic blue, where it sifted ~59,000 articles down to 14,244 core ones. <a href="https://huggingface.co/mutkuoz/turkic-relevance-laya-multilingual" target="_blank" rel="noopener" class="chip">hugging face ↗</a></p>'
	},
	{
		name: 'turkhukuk.ai',
		category: 'work',
		status: 'live',
		role: 'technical co-founder · 2026 —',
		body: '<p>a legaltech platform for turkish lawyers — case research and litigation strategy. trained and fine-tuned domain-specific language models on turkish legal corpora, and experimented with neuro-symbolic representations to bridge statistical learning with structured legal reasoning. <a href="https://www.turkhukuk.ai" target="_blank" rel="noopener" class="chip">turkhukuk.ai ↗</a></p>'
	},
	{
		name: 'labgpt',
		category: 'work',
		status: 'live',
		role: 'r&d, neurosymbolic ai · 2025 —',
		body: '<p>test result analysis for doctors with trend analysis, clinical finding extraction and a corpus with years of medical research. tübitak-backed.</p>'
	},
	{
		name: 'clade ai',
		category: 'work',
		status: 'shelved',
		role: 'co-founder, ai dev · 2023–24',
		body: '<p>a personal ai assistant with task execution, extensive integrations, and personalized interaction. held a $21m round. built a self-deciding multi-agent framework in the early days of ai agents, fine-tuned an llm for natural interaction, and shipped custom systems for smart memory, decision-making, and seamless integrations. left in july 2024; shelved shortly after.</p>'
	},
	{
		name: 'mentoring @ bilsem',
		category: 'work',
		status: 'live',
		role: 'senior student & instructor · 2024 —',
		body: '<p>senior student &amp; instructor at bilsem, a government-led supplementary education program for gifted students (top 2% iq). voluntarily mentoring and instructing primary schoolers there in project management, robotics, artificial intelligence, and software development. <a href="https://turkmaarifansiklopedisi.org.tr/bilim-ve-sanat-merkezleri-bilsem" target="_blank" rel="noopener" class="chip">about bilsem ↗</a></p>'
	},
	{
		name: 'sorubot',
		category: 'work',
		status: 'shelved',
		role: 'developer · 2022–23',
		body: '<p>an ai platform that generates exam questions and manages students&rsquo; study sessions. very unsuccessfully fine-tuned an llm. amateur work — but not bad for a 14-year-old.</p>'
	},
	{
		name: 'a.d.a',
		category: 'unpublished',
		status: 'shelved',
		role: 'creator · 2020',
		body: '<p>ada&rsquo;s damn awesome &mdash; a recursive name, with respect to lady lovelace. a parser-based, deterministic personal assistant.</p>'
	},
	{
		name: 'founder @ ananas studios',
		category: 'unpublished',
		status: 'shelved',
		role: '2019–22',
		body: '<p>an indie game development studio.</p>'
	},
	{
		name: 'shoelace',
		category: 'unpublished',
		status: 'shelved',
		role: 'creator · 2020',
		body: '<p>a peer-based encryption algorithm.</p>'
	}
];
