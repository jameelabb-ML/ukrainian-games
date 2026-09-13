// Turns plain text into safe HTML, supporting ONE deliberate exception:
// markdown-style links written as [link text](https://example.com) become
// real, clickable <a> tags. Everything else is escaped as plain text, so
// this never opens up arbitrary HTML/script injection — only that one
// controlled pattern is allowed through, and only for http(s)/relative URLs.
//
// Use this anywhere you want blog/description text to support links —
// write [Check out this game](/game/some-slug/) in the JSON content and
// it becomes clickable automatically.

function escapeHtml(str) {
	return str
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

export function renderTextWithLinks(text) {
	const escaped = escapeHtml(text);
	return escaped.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, label, url) => {
		const safeUrl = /^(https?:\/\/|\/)/i.test(url) ? url : null;
		if (!safeUrl) return match; // unrecognized URL scheme — leave as literal text, don't link it
		const external = /^https?:\/\//i.test(safeUrl);
		const rel = external ? ' rel="noopener noreferrer"' : '';
		const target = external ? ' target="_blank"' : '';
		return `<a href="${safeUrl}"${target}${rel}>${label}</a>`;
	});
}
