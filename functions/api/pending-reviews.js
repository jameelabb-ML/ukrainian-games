// Cloudflare Pages Function — GET /api/pending-reviews?secret=YOUR_SECRET
//
// Lists reviews waiting for your approval. Protected by a secret so
// randoms can't read submitted review text.
//
// SETUP NEEDED (same dashboard screen as REVIEWS_KV, one extra step):
//   Settings → Functions → Environment Variables → add ADMIN_SECRET
//   set it to any long random password you choose.
//
// Then visit: https://yoursite.com/api/pending-reviews?secret=<that password>
// to see everything waiting for approval, each with its own KV key.
//
// TO APPROVE a review: copy its fields into src/data/reviews.json (same
// format the site already reads) and rebuild/redeploy — exactly the same
// manual step as adding any other review by hand.
//
// TO DISCARD a review without approving it: DELETE /api/pending-reviews
// with { "key": "<the pending: key>", "secret": "..." } in the body —
// or just delete it directly from the KV namespace in the dashboard.

export async function onRequestGet(context) {
	const { request, env } = context;
	const url = new URL(request.url);
	const secret = url.searchParams.get('secret');

	if (!env.ADMIN_SECRET || secret !== env.ADMIN_SECRET) {
		return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
	}
	if (!env.REVIEWS_KV) {
		return new Response(JSON.stringify({ error: 'REVIEWS_KV is not bound yet' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
	}

	const list = await env.REVIEWS_KV.list({ prefix: 'pending:' });
	const items = [];
	for (const key of list.keys) {
		const value = await env.REVIEWS_KV.get(key.name);
		if (value) items.push({ key: key.name, ...JSON.parse(value) });
	}

	return new Response(JSON.stringify({ count: items.length, reviews: items }, null, 2), {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
	});
}

export async function onRequestDelete(context) {
	const { request, env } = context;
	let body;
	try {
		body = await request.json();
	} catch {
		return new Response(JSON.stringify({ error: 'Invalid request' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
	}

	if (!env.ADMIN_SECRET || body.secret !== env.ADMIN_SECRET) {
		return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
	}
	if (!env.REVIEWS_KV || !body.key) {
		return new Response(JSON.stringify({ error: 'Missing key or REVIEWS_KV not bound' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
	}

	await env.REVIEWS_KV.delete(body.key);
	return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}
