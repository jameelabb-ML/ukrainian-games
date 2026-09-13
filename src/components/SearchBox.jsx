import { useMemo, useState } from 'react';

export default function SearchBox({ games }) {
	const [query, setQuery] = useState('');

	const results = useMemo(() => {
		const q = query.trim().toLowerCase();
		if (q === '') return [];
		return games.filter((g) => {
			return (
				g.title.toLowerCase().includes(q) ||
				g.developer.toLowerCase().includes(q) ||
				g.categories.some((c) => c.toLowerCase().includes(q))
			);
		});
	}, [query, games]);

	return (
		<div>
			<input
				type="search"
				className="ug-search-input"
				placeholder="Search games, developers, categories…"
				value={query}
				onChange={(e) => setQuery(e.target.value)}
				style={{
					width: '100%',
					maxWidth: '32rem',
					padding: '0.625rem 1rem',
					borderRadius: '9999px',
					border: '1px solid var(--ug-border)',
					fontSize: '0.9rem',
					fontFamily: 'inherit',
				}}
			/>

			{query.trim() !== '' && (
				<p style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--ug-foreground-muted)' }}>
					{results.length} result{results.length === 1 ? '' : 's'} for &ldquo;{query}&rdquo;
				</p>
			)}

			<ul style={{ listStyle: 'none', padding: 0, margin: '1rem 0 0', display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '32rem' }}>
				{results.map((game) => (
					<li key={game.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', border: '1px solid var(--ug-border)', borderRadius: '0.75rem' }}>
						<img src={game.icon} alt="" width={40} height={40} style={{ borderRadius: '0.5rem', objectFit: 'cover', flexShrink: 0 }} />
						<a href={`/game/${game.slug}/`} style={{ flex: 1, minWidth: 0, fontWeight: 600, color: 'var(--ug-foreground)', textDecoration: 'none' }}>
							{game.title}
						</a>
						<span style={{ fontSize: '0.75rem', color: 'var(--ug-foreground-muted)', flexShrink: 0 }}>
							&#9733; {game.rating}
						</span>
					</li>
				))}
			</ul>
		</div>
	);
}
