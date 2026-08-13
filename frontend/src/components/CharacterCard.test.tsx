import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { CharacterCard } from './CharacterCard';
import type { Character } from '../api/types';

const character: Character = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  gender: 'Male',
  image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
  originId: 1,
  locationId: 3,
};

function renderCard(props: Partial<Character> = {}) {
  return render(
    <MemoryRouter>
      <CharacterCard character={{ ...character, ...props }} />
    </MemoryRouter>,
  );
}

describe('CharacterCard', () => {
  it('renders the character name, status and species', () => {
    renderCard();

    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    expect(screen.getByText('Alive')).toBeInTheDocument();
    expect(screen.getByText('Human')).toBeInTheDocument();
  });

  it('links to the character detail route', () => {
    renderCard();

    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      '/characters/1',
    );
  });

  it('falls back to "unknown" when species is missing', () => {
    renderCard({ species: null });

    expect(screen.getByText('unknown')).toBeInTheDocument();
  });
});
