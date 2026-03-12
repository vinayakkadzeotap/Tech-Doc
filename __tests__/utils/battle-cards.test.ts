import { describe, it, expect } from 'vitest';
import { BATTLE_CARDS, searchBattleCards } from '@/lib/utils/battle-cards';

describe('Battle Cards', () => {
  it('should have at least 5 competitor cards', () => {
    expect(BATTLE_CARDS.length).toBeGreaterThanOrEqual(5);
  });

  it('each card should have required fields', () => {
    for (const card of BATTLE_CARDS) {
      expect(card.id).toBeTruthy();
      expect(card.competitor).toBeTruthy();
      expect(card.overview).toBeTruthy();
      expect(card.differentiators.length).toBeGreaterThan(0);
      expect(card.weaknesses.length).toBeGreaterThan(0);
      expect(card.talkingPoints.length).toBeGreaterThan(0);
      expect(card.headToHead.length).toBeGreaterThan(0);
    }
  });

  it('each head-to-head row should have valid winner', () => {
    for (const card of BATTLE_CARDS) {
      for (const row of card.headToHead) {
        expect(['zeotap', 'competitor', 'tie']).toContain(row.winner);
      }
    }
  });

  it('should have unique card IDs', () => {
    const ids = BATTLE_CARDS.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('searchBattleCards should find cards by competitor name', () => {
    const results = searchBattleCards('Treasure');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].competitor).toContain('Treasure Data');
  });

  it('searchBattleCards should find cards by feature', () => {
    const results = searchBattleCards('identity resolution');
    expect(results.length).toBeGreaterThan(0);
  });

  it('searchBattleCards should return empty for nonsense query', () => {
    const results = searchBattleCards('xyznonexistent12345');
    expect(results.length).toBe(0);
  });
});
