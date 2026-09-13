// Cloudflare Pages Function — handles POST /api/submit-review
//
// SETUP NEEDED (one-time, in the Cloudflare dashboard, after you deploy):
//   1. Workers & Pages → your project → Settings → Functions → KV namespace bindings
//   2. Create a KV namespace (any name, e.g. "ug-reviews") if you don't have one yet
//   3. Add a binding with variable name exactly: REVIEWS_KV  →  pointing at that namespace
//   4. Redeploy (or it applies on the next deploy) — that's it, no code changes needed here.
//
// Until that binding exists, this endpoint will return a 500 error — the
// site itself still works fine, only review submission is inactive.
//
// Submitted reviews are NOT shown publicly automatically — they're stored
// as "pending" in KV for you to moderate (matching how the WordPress site
// required approval before a review appeared). See functions/api/README.md
// for how to view and approve them.

export async function onRequestPost(context) {
	const { request, env } = context;

	if (!env.REVIEWS_KV) {
		return new Response(
			JSON.stringify({ error: 'Review storage is not set up yet. See functions/api/submit-review.js for setup steps.' }),
			{ status: 500, headers: { 'Content-Type': 'application/json' } }
		);
	}

	let body;
	try {
		body = await request.json();
	} catch {
		return new Response(JSON.stringify({ error: 'Invalid request' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
	}

	const gameSlug = String(body.game_slug || '').trim().slice(0, 200);
	const name = String(body.name || '').trim().slice(0, 60);
	const rating = parseInt(body.rating, 10);
	const text = String(body.text || '').trim().slice(0, 1000);

	if (!gameSlug || !name || !rating || rating < 1 || rating > 5) {
		return new Response(JSON.stringify({ error: 'Missing or invalid fields' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
	}

	const id = `pending:${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
	const review = {
		game_slug: gameSlug,
		name,
		rating,
		text,
		date: new Date().toISOString().slice(0, 10),
	};

	await env.REVIEWS_KV.put(id, JSON.stringify(review));

	return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}
