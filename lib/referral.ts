/**
 * Referral attribution constants.
 *
 * Kept out of the "use server" action files: those may only export async
 * functions, so a shared const has to live in a plain module.
 */

export const REFERRAL_COOKIE = "hft_ref";

/** First-touch attribution: the cookie outlives a browsing session so an
 *  affiliate still gets credit if someone returns days later. */
export const REFERRAL_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export const REFERRAL_QUERY_PARAM = "ref";
