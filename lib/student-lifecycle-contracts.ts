/** Public vocabulary only; private events and service authorization remain server-side. */
export type LifecycleStatus='ACTIVE'|'DEACTIVATED';
export const LIFECYCLE_REASONS=['Program ended','Student requested','Non-payment','Mutual decision','Policy/administrative','Other'] as const;
