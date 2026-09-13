const SITE_URL = 'https://ukrainiangames.com';
const SITE_NAME = 'Ukrainian Games';

/**
 * Builds schema.org structured data for a game page so Google can show
 * rich results (star rating, price, etc.) directly in search results.
 * This is generated automatically from the game's own data — nothing
 * to fill in by hand, ever.
 */
export function gameJsonLd(game) {
	return {
		'@context': 'https://schema.org',
		'@type': 'SoftwareApplication',
		name: game.title,
		operatingSystem: 'ANDROID',
		applicationCategory: 'GameApplication',
		author: { '@type': 'Organization', name: game.developer },
		image: game.icon,
		softwareVersion: game.version,
		aggregateRating: game.rating_count > 0 ? {
			'@type': 'AggregateRating',
			ratingValue: game.rating,
			ratingCount: game.rating_count,
		} : undefined,
		offers: {
			'@type': 'Offer',
			price: '0',
			priceCurrency: 'USD',
		},
	};
}

/**
 * Structured data for a blog post — auto-derived from the post's own
 * data, so every post gets valid Article markup with no manual entry.
 */
export function articleJsonLd(post) {
	return {
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: post.title,
		description: post.excerpt,
		image: post.thumbnail,
		datePublished: post.date,
		author: { '@type': 'Organization', name: SITE_NAME },
	};
}

export function absoluteUrl(path) {
	return SITE_URL.replace(/\/$/, '') + path;
}

export function truncateDescription(text, max = 160) {
	const clean = text.replace(/\s+/g, ' ').trim();
	if (clean.length <= max) return clean;
	return clean.slice(0, max - 1).trim() + '…';
}

export { SITE_URL, SITE_NAME };
