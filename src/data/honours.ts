// honours and associations, one entry each. the cv prints them; llms.txt and the json-ld
// describe them to answer engines. text is sentence case, as the cv sets it.
import { associations } from './associations';

export type Honour = { year: string; title: string; note: string; href?: string };

const org = (key: string) => associations.find((a) => a.key === key)?.url;

export const honours: Honour[] = [
	{ year: '2018 · 2023', title: 'eTwinning Quality Labels', note: 'European Union. The Pupil Quality Label in 2018, and the National Quality Label in 2023 for the project “Particle Physics and CERN”.' },
	{ year: '2025–', title: 'TÜBİTAK', note: 'Backing for LabGPT, his R&D on test result analysis for doctors.', href: 'https://www.tubitak.gov.tr' },
	{ year: '2026', title: 'ODTÜ Teknokent', note: 'turkhukuk.ai’s R&D, accepted as a research and development project at METU Technopolis, Ankara.', href: 'https://odtuteknokent.com.tr' },
	{ year: '2024–', title: 'BİLSEM', note: 'Senior student at the government-led program for gifted children (top 2% IQ), and a voluntary mentor there, teaching primary schoolers robotics, AI and software.', href: org('bilsem') },
	{ year: 'Member', title: 'Mensa International', note: 'The largest and oldest high-IQ society.', href: org('mensa') },
	{ year: 'Member', title: 'IAAIL', note: 'International Association for Artificial Intelligence and Law.', href: org('iaail') },
	{ year: 'Volunteer', title: 'Save the Children', note: 'Global charity for children’s rights, health and education.', href: org('stc') },
	{ year: 'Volunteer', title: 'TEMA Foundation', note: 'Türkiye’s foundation for combating soil erosion, for reforestation and for protecting natural habitats.', href: 'https://www.tema.org.tr' }
];

// the ones that are awards, for schema.org's Person.award
export const awards = [
	'eTwinning Pupil Quality Label, European Union (2018)',
	'eTwinning National Quality Label, European Union (2023), for the project “Particle Physics and CERN”'
];
