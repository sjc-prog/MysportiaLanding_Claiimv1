/**
 * Category-campaign configuration (founder decision 2026-07-19).
 *
 * A campaign only controls search filtering, landing copy/visual treatment,
 * and attribution. It never limits the claim seed: after selection the full
 * venue record is always loaded regardless of the entry campaign.
 *
 * A venue matches a campaign when at least one of its canonical activity
 * codes is in the campaign's `includedActivities`; a venue may match several
 * campaigns. Campaign `all` matches every eligible venue.
 *
 * Copy/imagery per campaign is NOT defined here — marketing claims live in
 * approved content configuration, never in the domain layer.
 */

export type CampaignId = 'all' | 'combat-sports' | 'yoga-wellness' | 'fitness';

export interface CampaignConfig {
  id: CampaignId;
  route: string;
  /** Canonical activity codes; empty = match everything. */
  includedActivities: string[];
}

export const CAMPAIGNS: Record<CampaignId, CampaignConfig> = {
  all: { id: 'all', route: '/', includedActivities: [] },
  'combat-sports': {
    id: 'combat-sports',
    route: '/combat-sports',
    includedActivities: ['MUAY_THAI', 'BOXING', 'KICKBOXING', 'MMA', 'BJJ', 'WRESTLING'],
  },
  'yoga-wellness': {
    id: 'yoga-wellness',
    route: '/yoga-wellness',
    includedActivities: ['YOGA', 'PILATES', 'MEDITATION', 'WELLNESS'],
  },
  fitness: {
    id: 'fitness',
    route: '/fitness',
    includedActivities: ['FITNESS', 'GYM', 'CROSSFIT', 'HYROX'],
  },
};

/** True when a venue with the given activity codes belongs to the campaign. */
export function campaignMatches(
  activities: string[] | undefined,
  campaign: CampaignId
): boolean {
  const config = CAMPAIGNS[campaign];
  if (!config || config.includedActivities.length === 0) return true;
  if (!activities || activities.length === 0) return false;
  return activities.some((a) => config.includedActivities.includes(a));
}
