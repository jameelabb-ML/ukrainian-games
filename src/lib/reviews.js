import reviewsData from '../data/reviews.json';

export const reviews = reviewsData;

export function getReviewsForGame(slug) {
	return reviews.filter((r) => r.game_slug === slug);
}
