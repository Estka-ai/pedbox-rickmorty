const PUBLIC_API_URL = 'https://rickandmortyapi.com/api';

// A fixed, varied set of character ids used purely as decoration on the
// auth pages. Fetched directly from the public Rick and Morty API (no
// auth needed) — the same source already used for character images
// throughout the app.
const SHOWCASE_IDS = [1, 2, 3, 4, 5, 8, 12, 19, 23, 35, 63, 71];

export interface ShowcaseCharacter {
  id: number;
  name: string;
  image: string;
}

export async function fetchShowcaseCharacters(): Promise<
  ShowcaseCharacter[]
> {
  const response = await fetch(
    `${PUBLIC_API_URL}/character/${SHOWCASE_IDS.join(',')}`,
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch showcase characters: ${response.status}`);
  }
  return response.json() as Promise<ShowcaseCharacter[]>;
}
