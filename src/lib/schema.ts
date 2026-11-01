// structured data (schema.org json-ld) for the homepage, which describes the person.
// answer engines (chatgpt, perplexity, google ai overviews) read schema.org far more reliably than they
// read prose, so the facts are stated explicitly, in one @graph whose entities reference each other by @id.
import { papers } from '../data/research';
import { awards } from '../data/honours';
import { AUTHOR_NAME, PERSON_ID, SITE, articleUrl, formatDate, lastModified, type Article } from './site';

export const OG_IMAGE = `${SITE}/portrait.png`;
export const SAME_AS = [
	'https://github.com/mutkuoz',
	'https://x.com/mutkuoz',
	'https://linkedin.com/in/mutkuoz',
	'https://huggingface.co/mutkuoz',
	'https://orcid.org/0009-0008-2400-5646'
];

export function buildSchema({ canonical, title, description, articles }: { canonical: string; title: string; description: string; articles: Article[] }) {
	const WEBSITE_ID = `${SITE}/#website`;

	const person = {
		'@type': 'Person',
		'@id': PERSON_ID,
		name: AUTHOR_NAME,
		alternateName: ['Utku Öztürk', 'mutkuoz', 'Mehmet Utku Ozturk', 'Utku Ozturk'],
		url: `${SITE}/`,
		image: OG_IMAGE,
		jobTitle: 'Machine Learning Developer & AI Researcher',
		description:
			'Machine learning developer and AI researcher focused on artificial consciousness, neuro-symbolic AI, and agentic "thinking" systems. Started programming at 8, working on machine learning since 13.',
		disambiguatingDescription:
			'Machine learning developer from Ankara, Türkiye; technical co-founder of turkhukuk.ai, R&D on LabGPT, creator of FlyDOOM, LLM Electrodes, 007captcha and Topazius, and first author of HukukBERT.',
		email: 'mailto:m@utku.space',
		address: {
			'@type': 'PostalAddress',
			addressLocality: 'Ankara',
			addressCountry: 'TR'
		},
		knowsAbout: [
			'Artificial Consciousness',
			'Machine Learning',
			'Natural Language Processing',
			'Large Language Models',
			'Neuro-Symbolic AI',
			'Agentic Systems',
			'LegalTech',
			'Cognitive Science',
			'Connectomics',
			'Interpretability',
			'Turkish NLP',
			'Medical AI',
			'Neuromorphic Computing',
			'Powerlifting'
		],
		knowsLanguage: ['Turkish', 'English'],
		memberOf: [
			{ '@type': 'Organization', name: 'Mensa International', url: 'https://www.mensa.org' },
			{ '@type': 'Organization', name: 'International Association for Artificial Intelligence and Law', alternateName: 'IAAIL', url: 'https://iaail.org' },
			{
				'@type': 'EducationalOrganization',
				name: 'BİLSEM (Bilim ve Sanat Merkezleri)',
				url: 'https://turkmaarifansiklopedisi.org.tr/bilim-ve-sanat-merkezleri-bilsem',
				description: 'Government-led special education program for gifted children in Türkiye; senior student and volunteer mentor.'
			}
		],
		affiliation: [
			{ '@type': 'Organization', name: 'turkhukuk.ai', url: 'https://www.turkhukuk.ai' },
			{ '@type': 'Organization', name: '23rd the company' }
		],
		volunteerFor: [
			{ '@type': 'Organization', name: 'Save the Children', url: 'https://www.savethechildren.org' },
			{ '@type': 'Organization', name: 'TEMA Foundation', url: 'https://www.tema.org.tr' }
		],
		award: awards,
		sameAs: SAME_AS
	};

	const website = {
		'@type': 'WebSite',
		'@id': WEBSITE_ID,
		url: `${SITE}/`,
		name: "utku's space",
		description,
		inLanguage: 'en',
		publisher: { '@id': PERSON_ID }
	};

	const profilePage = {
		'@type': 'ProfilePage',
		'@id': `${canonical}#profile`,
		url: canonical,
		name: title,
		description,
		inLanguage: 'en',
		isPartOf: { '@id': WEBSITE_ID },
		mainEntity: { '@id': PERSON_ID },
		...(articles[0] ? { dateModified: lastModified(articles[0]).toISOString() } : {})
	};

	// each shipped project, so an answer engine can name them without guessing.
	const projects = [
		{
			'@type': 'SoftwareApplication',
			name: 'turkhukuk.ai',
			url: 'https://www.turkhukuk.ai',
			applicationCategory: 'LegalTech',
			description:
				'A LegalTech platform for Turkish lawyers covering case research and litigation strategy, built on domain-specific language models trained on Turkish legal corpora.'
		},
		{
			'@type': 'SoftwareSourceCode',
			name: 'LLM Electrodes',
			codeRepository: 'https://github.com/mutkuoz/llm-electrodes',
			programmingLanguage: 'Python',
			description:
				'An interpretability study and toolkit showing that stimulating a single MLP neuron of Qwen3.5-4B can give the model a new, nameable personality, with no system prompt or fine-tuning. Releases the full screen of 294,912 neurons, a catalog of 214 interventions and a local app for trying them.'
		},
		{
			'@type': 'SoftwareSourceCode',
			name: 'FlyDOOM',
			codeRepository: 'https://github.com/mutkuoz/flydoom',
			programmingLanguage: 'Python',
			description:
				'A simulator that feeds Doom into the visual pathway of a 139,255-neuron fruit fly connectome and maps its biological motor output back to game controls.'
		},
		{
			'@type': 'SoftwareApplication',
			name: 'Clade AI',
			applicationCategory: 'Personal Assistant',
			description:
				'A personal AI assistant with task execution, extensive integrations, and personalized interaction, built on a self-deciding multi-agent framework.'
		},
		{
			'@type': 'SoftwareApplication',
			name: 'Sorubot',
			applicationCategory: 'Education',
			description: 'An AI platform that generates exam questions and manages student study sessions.'
		},
		{
			'@type': 'SoftwareSourceCode',
			name: '007captcha',
			codeRepository: 'https://github.com/mutkuoz/007captcha',
			programmingLanguage: 'TypeScript',
			license: 'https://opensource.org/licenses/MIT',
			description:
				'An open-source robophobic verification framework that defends websites against AI agents — a CAPTCHA built for the post-LLM web.'
		},
		{
			'@type': 'SoftwareApplication',
			name: 'Octapar',
			applicationCategory: 'Social Platform',
			description:
				'An AI platform that clusters people into balanced 8-person groups using weighted attentional embeddings and the Hungarian method.'
		},
		{
			'@type': 'SoftwareSourceCode',
			name: 'Topazius',
			codeRepository: 'https://github.com/mutkuoz/topazius',
			programmingLanguage: 'TypeScript',
			description:
				'A browser-based Markdown notes app that uses a private GitHub repository as its database, with offline editing and optional client-side encryption.'
		},
		{
			'@type': 'SoftwareSourceCode',
			name: 'trstemmer',
			codeRepository: 'https://github.com/mutkuoz/trstemmer',
			programmingLanguage: 'Python',
			description: 'A simple Turkish word stemmer for Python that strips suffixes from verbs, published on PyPI.'
		},
		{
			'@type': 'SoftwareSourceCode',
			name: 'turkic-relevance-laya-multilingual',
			codeRepository: 'https://huggingface.co/mutkuoz/turkic-relevance-laya-multilingual',
			programmingLanguage: 'Python',
			license: 'https://www.apache.org/licenses/LICENSE-2.0',
			description:
				'A Turkish text classifier, fine-tuned from Laya-multilingual, that labels a Turkish Wikipedia article as core Turkic heritage, modern Turkey, or unrelated.'
		},
		{
			'@type': 'SoftwareApplication',
			name: 'LabGPT',
			applicationCategory: 'Medical',
			description:
				'Test result analysis for doctors with trend analysis, clinical finding extraction, and a corpus spanning years of medical research. TÜBİTAK-backed.'
		},
		// unpublished
		{
			'@type': 'SoftwareApplication',
			name: 'A.D.A',
			alternateName: "ADA's Damn Awesome",
			applicationCategory: 'Personal Assistant',
			dateCreated: '2020',
			description: 'An unpublished parser-based, deterministic personal assistant; the recursive name honours Ada Lovelace.'
		},
		{
			'@type': 'Organization',
			name: 'Ananas Studios',
			foundingDate: '2019',
			dissolutionDate: '2022',
			description: 'An indie game development studio.'
		},
		{
			'@type': 'CreativeWork',
			name: 'Shoelace',
			dateCreated: '2020',
			description: 'An unpublished peer-based encryption algorithm.'
		}
	];

	const work = {
		'@type': 'ItemList',
		'@id': `${SITE}/#work`,
		name: `Selected work of ${AUTHOR_NAME}`,
		itemListElement: projects.map((project, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			item: { ...project, ...(project['@type'] === 'Organization' ? { founder: { '@id': PERSON_ID } } : { creator: { '@id': PERSON_ID } }) }
		}))
	};

	const research = {
		'@type': 'ItemList',
		'@id': `${SITE}/#research`,
		name: `Research by ${AUTHOR_NAME}`,
		itemListElement: papers.map((paper, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			item: {
				'@type': 'ScholarlyArticle',
				name: paper.name,
				headline: paper.name,
				abstract: paper.abstract,
				datePublished: paper.year,
				author: [
					{ '@id': PERSON_ID },
					...(paper.coAuthors ?? []).map((name) => ({ '@type': 'Person', name }))
				],
				publisher: { '@type': 'Organization', name: paper.publisher ?? paper.venue },
				...(paper.journal ? { isPartOf: { '@type': 'Periodical', name: paper.journal } } : {}),
				...(paper.doi ? { identifier: { '@type': 'PropertyValue', propertyID: 'DOI', value: paper.doi } } : {}),
				...(paper.links.length ? { url: paper.links[0].url, sameAs: paper.links.map((link) => link.url) } : {})
			}
		}))
	};

	const blog = {
		'@type': 'Blog',
		'@id': `${SITE}/#articles`,
		name: `Articles by ${AUTHOR_NAME}`,
		url: `${SITE}/#articles`,
		inLanguage: 'en',
		author: { '@id': PERSON_ID },
		blogPost: articles.map((article) => ({
			'@type': 'BlogPosting',
			'@id': `${articleUrl(article)}#article`,
			headline: article.data.title,
			description: article.data.description,
			url: articleUrl(article),
			datePublished: article.data.published.toISOString(),
			dateModified: lastModified(article).toISOString(),
			keywords: article.data.tags,
			author: { '@id': PERSON_ID }
		}))
	};

	// plain question/answer pairs — the shape answer engines quote from directly.
	const faq = {
		'@type': 'FAQPage',
		'@id': `${SITE}/#faq`,
		isPartOf: { '@id': WEBSITE_ID },
		mainEntity: [
			{
				'@type': 'Question',
				name: 'Who is Mehmet Utku Öztürk?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: 'Mehmet Utku Öztürk is a machine learning developer and AI researcher based in Ankara, Türkiye. He started programming at 8, began working on machine learning at 13, and now focuses on artificial consciousness and "thinking" systems. He is the technical co-founder of turkhukuk.ai, the creator of the open-source 007captcha, and the founder of 23rd the company.'
				}
			},
			{
				'@type': 'Question',
				name: 'What does Mehmet Utku Öztürk work on?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: 'He works on artificial consciousness and agentic "thinking" systems: domain-specific language models, neuro-symbolic AI, multi-agent frameworks, production NLP, connectomics, and neuromorphic computing. His current projects include turkhukuk.ai, a LegalTech platform for Turkish lawyers, and FlyDOOM, a fruit fly connectome playing Doom.'
				}
			},
			{
				'@type': 'Question',
				name: 'What is FlyDOOM?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: 'FlyDOOM is an open-source experiment by Mehmet Utku Öztürk that runs Doom through a real fruit fly connectome. Game frames enter the visual pathway of 139,255 reconstructed neurons and roughly 2.7 million synapses from the FAFB dataset, and the fly\'s motor output is mapped back to game controls. Nothing is trained; the wiring is the fly\'s own. The code is at https://github.com/mutkuoz/flydoom and the story is at https://utku.space/articles/flydoom/.'
				}
			},
			{
				'@type': 'Question',
				name: 'What research has Mehmet Utku Öztürk published?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: 'Mehmet Utku Öztürk is the first author of HukukBERT, the most comprehensive legal language model for Turkish, published in the Journal of Computational Law and Legal Technology (2026; arXiv:2604.04790), which reaches 84.40% Top-1 accuracy on a Legal Cloze Test benchmark. He also wrote LLM Electrodes (2026), which shows that stimulating a single neuron of Qwen3.5-4B can give the model a new personality: 130 single neurons passed blind judging (https://github.com/mutkuoz/llm-electrodes). Other research includes Octapar, a framework for balanced multi-modal user grouping using weighted attentional embeddings and the Hungarian method, and Streaming Intelligence, a study of AI and Big Data in digital content platforms.'
				}
			},
			{
				'@type': 'Question',
				name: 'What articles has Mehmet Utku Öztürk written?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: `Articles by Mehmet Utku Öztürk on utku.space include ${articles.map((article) => `"${article.data.title}" (${formatDate(article.data.published)}, ${articleUrl(article)})`).join('; ')}. All articles are listed at ${SITE}/#articles and published as an RSS feed at ${SITE}/rss.xml.`
				}
			},
			{
				'@type': 'Question',
				name: 'How can I contact Mehmet Utku Öztürk?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: 'By email at m@utku.space or utku.ozturk@member.mensa.org, on GitHub at @mutkuoz, on LinkedIn at @mutkuoz, and via ORCID at 0009-0008-2400-5646. He is based in Ankara, Türkiye (GMT+3) and is open to collaboration and research.'
				}
			}
		]
	};

	return {
		'@context': 'https://schema.org',
		'@graph': [website, profilePage, person, work, research, blog, faq]
	};
}
