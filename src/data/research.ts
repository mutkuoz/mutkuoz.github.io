// research papers. rendered on the homepage and described to answer engines
// through json-ld and llms.txt, so the facts live in exactly one place.
export type Paper = {
	name: string;
	venue: string;
	year: string;
	summary: string;
	abstract: string;
	links: { label: string; url: string }[];
	coAuthors?: string[];
	journal?: string;
	publisher?: string;
	doi?: string;
};

export const papers: Paper[] = [
	{
		name: 'HukukBERT: Domain-Specific Language Model for Turkish Law',
		venue: 'turkhukuk.ai',
		year: '2026',
		journal: 'Journal of Computational Law and Legal Technology',
		publisher: 'Bon View Publishing',
		doi: '10.47852/bonviewJCLLT620210346',
		coAuthors: ['Tansu Türkoğlu', 'Buse Buz-Yalug'],
		summary: 'The most comprehensive legal language model for Turkish, trained on an 18 GB cleaned legal corpus with advanced masking strategies and a 48K WordPiece tokenizer plus Domain-Adaptive Pre-Training. Achieves 84.40% Top-1 accuracy on a novel Legal Cloze Test benchmark, outperforming BERTurk-Legal.',
		abstract: "Recent advances in natural language processing (NLP) have opened significant doors for LegalTech applications; however, existing studies specific to Turkish law have been severely limited by data constraints. While extensive models like LEGAL-BERT have been developed for English legal texts, the Turkish legal domain lacks a high-volume, domain-specific counterpart. In this paper, we introduce HukukBERT, the most comprehensive legal language model for Turkish, trained on an 18 GB cleaned legal corpus using advanced masking strategies. We systematically compare our 48K WordPiece tokenizer and Domain-Adaptive Pre-Training (DAPT) approach against general-purpose and existing domain-specific Turkish models. Evaluated on a novel Legal Cloze Test benchmark, HukukBERT achieves state-of-the-art performance with 84.40% Top-1 accuracy, substantially outperforming existing models such as BERTurk-Legal. We release HukukBERT to serve as a foundational model for downstream Turkish legal tasks.",
		links: [
			{ label: 'jcllt', url: 'https://doi.org/10.47852/bonviewJCLLT620210346' },
			{ label: 'arxiv', url: 'https://arxiv.org/abs/2604.04790' }
		]
	},
	{
		name: 'Octapar: A Framework for Multi-Modal, Balanced User Grouping using Weighted Attentional Embeddings and Assignment-Based Clustering',
		venue: '23rd the company',
		year: '2025',
		summary: 'Conversational LLM onboarding extracts semantic user tags; a weighted attention mechanism combines global tag rarity (IDF) with local intra-user tag uniqueness; the Hungarian method guarantees perfectly balanced clusters.',
		abstract: "The formation of coherent, effective, and equitably sized user groups is a critical and persistent challenge in the design of online social platforms, collaborative learning environments, and enterprise-level teamwork tools. Existing automated methods, while scalable, often fail to produce groups of a consistent, predetermined size, leading to significant logistical issues and imbalanced user experiences. Furthermore, they often rely on shallow or easily manipulated user data. This paper introduces Octapar, a novel, multi-stage algorithmic framework designed to generate semantically coherent, perfectly balanced user clusters from deep, multi-modal user profiles. The framework pioneers a conversational onboarding process, using specialized chatbots and Large Language Models (LLMs) to extract nuanced user characteristics across both skill and philosophical domains. These characteristics are formalized as a rich set of semantic tags. The core technical innovation is a custom weighted attention mechanism that generates a sophisticated user vector by incorporating not only global tag rarity (IDF) but also a novel metric of local, intra-user tag uniqueness. This allows the model to identify and amplify a user's most distinctive traits. Final group formation is achieved via an iterative, assignment-based clustering algorithm that utilizes the Hungarian method to guarantee perfectly balanced clusters. This approach ensures structural consistency and fairness in group formation, a critical and often unmet requirement for many practical applications. We provide a detailed walkthrough of the architecture, the mathematical foundations of its components, and a discussion of its implications for the future of computational group formation.",
		links: [{ label: 'zenodo', url: 'https://zenodo.org/records/17360220' }]
	},
	{
		name: 'Streaming Intelligence: Harnessing AI and Big Data in the Competitive Landscape of Digital Content Platforms',
		venue: 'Plawlabs',
		year: '2024',
		summary: 'How major streaming platforms use AI and Big Data for recommendation, presentation, and personalization, with strategy for an emerging Turkish digital platform.',
		abstract: "In the rapidly evolving realm of digital entertainment, Artificial Intelligence (AI) and Big Data stand at the forefront, reshaping the future of content consumption and curation. Esteemed global streaming giants such as Netflix, YouTube, Hulu, Amazon Prime Video, HBO Max, Disney+, and even social platforms like Instagram and TikTok, are skillfully leveraging these technologies to transform content recommendation, presentation, and personalization processes. This not only elevates the user experience but also sets unprecedented standards for operational efficiency across the industry. Our article delves into the intricate use of AI and Big Data by these leading platforms, highlighting their critical role in captivating audiences and streamlining content strategies. Furthermore, our research offers concrete insights and forward-looking strategies for one of the Turkey's emerging digital platform, in collaboration with PlawLabs, on surpassing its global competitors with the development of advanced AI technology. This initiative is aimed at overcoming unique challenges brought forth by these technological advancements and seizing expansive opportunities. By capitalizing on the technological expertise and strategic foresights of current industry leaders, this platform is poised to gain a significant competitive edge in the rapidly growing market of digital streaming services, both domestically and internationally. Adopting our technology foresights will not only enhance the quality of content and increase user engagement but will also seamlessly align with the changing preferences and demands of today's diverse digital audience, supporting the platform's financial outcomes. Through this comprehensive analysis, we aim to illuminate a path for our national platform to leverage AI and Big Data, catalyze its growth, and redefine content maturity in the digital space.",
		links: []
	}
];
