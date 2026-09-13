import blogData from '../data/blog.json';

export const posts = blogData;

export function getPostBySlug(slug) {
	return posts.find((p) => p.slug === slug);
}
