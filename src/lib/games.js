import gamesData from '../data/games.json';
import categoriesData from '../data/categories.json';

export const games = gamesData;
export const categories = categoriesData;

export function getGameBySlug(slug) {
	return games.find((g) => g.slug === slug);
}

export function getCategoryBySlug(slug) {
	return categories.find((c) => c.slug === slug);
}

export function getGamesByCategory(slug) {
	return games.filter((g) => g.categories.includes(slug));
}

export function getCategoryName(slug) {
	return getCategoryBySlug(slug)?.name ?? slug;
}

export function formatCount(n) {
	if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
	if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
	if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
	return String(n);
}
