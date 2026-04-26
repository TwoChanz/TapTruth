/** Mirror of `sponsored_prophecies` table — fake in-character ads. */
export interface SponsoredProphecy {
  id: string;
  product_name: string;
  body: string;
  tagline: string | null;
  /** Higher = more likely in weighted random selection. */
  weight: number;
  is_active: boolean;
  active_from: string | null;
  active_until: string | null;
  impressions: number;
  created_at: string;
}
