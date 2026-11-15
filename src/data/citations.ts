// papers that cite my work. the utku index on the homepage prints the count and, on hover,
// the list. add an entry here and both update.
export type Citation = { title: string; venue: string; doi: string };

export const citations: Citation[] = [
	{
		title: 'Deep-Learning-Based Named Entity Recognition for Turkish Industrial Property Law: Dataset Creation and Parameter Optimization',
		venue: 'Appl. Sci.',
		doi: '10.3390/app16199942'
	},
	{
		title: 'Leveraging Task-Adaptive Continual Pre-Training to Enhance the Classification Ability of Language Models',
		venue: 'IEEE Access',
		doi: '10.1109/ACCESS.2026.3715915'
	},
	{
		title: 'A Short Survey of Viewing Large Language Models in Legal Aspect',
		venue: 'arXiv',
		doi: '10.48550/arXiv.2303.09136'
	}
];
