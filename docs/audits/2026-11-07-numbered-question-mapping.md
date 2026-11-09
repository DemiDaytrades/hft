# Verified historical numbered intake mapping

Recovered from retained Worker version 39, not inferred from student answers. Evidence hashes and conservative recognition rules are in the companion JSON. The old schema extends through q30; q26–q30 were explicitly instructor-only. `whyJoin` is a separate v38 field retained in the mixed historical record.

| Key | Exact historical prompt | Control / options | Classification | Canonical destination | Guard / limitation |
|---|---|---|---|---|---|
| q1 | Why do you want to learn trading? | textarea | PARTIAL / REQUIRES REVIEW | motivationAndWhyNow | Motivation is known; the newer why-now scope is not established. |
| q2 | What do you want trading education to help you accomplish? | textarea | PARTIAL / REQUIRES REVIEW | goalImmediate | No immediate timeframe was asked. |
| q3 | What would you like to accomplish in the next 90 days? | textarea | EXACT MATCH | goals30_60_90.goal90 | Copy only the 90-day goal; never fill the 30/60-day goals. |
| q4 | What are your longer-term goals? | textarea | SAFE COMPATIBLE MATCH | goalBig | Retain the original long-term narrative without inventing dates. |
| q5 | Have you traded before? | select / Yes, No | NO CANONICAL EQUIVALENT | Context only | Overall historical use does not identify demo/live history or proficiency. |
| q6 | Which markets have you traded or are interested in? | multiselect / Forex, Indices, Crypto, Stocks, Options, Futures, Other | PARTIAL / REQUIRES REVIEW | marketsExperience | Interest cannot be promoted to actual markets traded. |
| q7 | Which platforms have you used? | multiselect / MT4, MT5, TradingView, Other, None | EXACT MATCH | platformsBrokerExperience.platforms | Literal approved historical array only; no access, broker or proficiency inference. |
| q8 | Have you traded demo, live, both, or neither? | select / Demo, Live, Both, Neither | SAFE COMPATIBLE MATCH | demoLiveExperience | Translate only the four explicit exclusive history choices to demo/live Yes/No. |
| q9 | Have you taken trading courses/coaching before? | select / Yes, No | SAFE COMPATIBLE MATCH | priorEducation.type | Yes/No history only. Missing details remain required for Yes; no course proficiency is inferred. |
| q10 | Have you experienced a significant trading/investment loss or scam? | select / Yes, No | SAFE COMPATIBLE MATCH | majorNegativeExperience.type | Yes/No reported history only. A required reflection remains unanswered; optional old notes do not imply reflection. |
| q11 | Preferred learning methods | multiselect / Hands-on, Video, Reading, Notes, Quizzes, Repetition, Other | SAFE COMPATIBLE MATCH | learningStyles | Preserve literal preferences; no conflicting enum translation. |
| q12 | Patience (1–10) | number-string, min 1 max 10 | PARTIAL / REQUIRES REVIEW | Context only | No conversion from a numeric self-rating to a behavioral enum or demonstrated skill. |
| q13 | Discipline (1–10) | number-string, min 1 max 10 | PARTIAL / REQUIRES REVIEW | Context only | Retain original context; no unsupported modern answer is inferred. |
| q14 | What areas do you struggle with most? | textarea | PARTIAL / REQUIRES REVIEW | Context only | Broad barriers are not automatically knowledge gaps, discipline or financial pressure. |
| q15 | Preferred coaching/session availability | textarea | PARTIAL / REQUIRES REVIEW | weeklyAvailability | Retain scheduling narrative without inventing days, hours, timezone or consistency. |
| q16 | Approximate monthly take-home income | free-text input (approximate dollar amounts) | SAFE COMPATIBLE MATCH | monthlyTakeHomeRange | Identity reuse only if already exactly an approved modern range; raw amounts require confirmation, no bucketing. |
| q17 | Approximate monthly essential expenses | free-text input (approximate dollar amounts) | PARTIAL / REQUIRES REVIEW | Context only | Essential expenses do not equal all recurring/variable obligations. |
| q18 | Monthly family/support obligations | free-text input (approximate dollar amounts) | PARTIAL / REQUIRES REVIEW | dependentSupportObligation | Family support does not establish dependent status or a modern range. |
| q19 | Savings/emergency reserves | free-text input (approximate dollar amounts) | PARTIAL / REQUIRES REVIEW | Context only | Combined amounts cannot fill separate savings/emergency fields. |
| q20 | Investments/assets | free-text input (approximate dollar amounts) | NO CANONICAL EQUIVALENT | Context only | Retain original context; no unsupported modern answer is inferred. |
| q21 | Debt balances | free-text input (approximate dollar amounts) | SAFE COMPATIBLE MATCH | totalDebtRange | Identity reuse only for an exact approved modern debt range, never infer debt status or payments. |
| q22 | Vehicle payment and remaining balance, if applicable | free-text input (approximate dollar amounts) | PARTIAL / REQUIRES REVIEW | Context only | Do not split payment and balance into invented values. |
| q23 | Approximate monthly disposable income | free-text input (approximate dollar amounts) | PARTIAL / REQUIRES REVIEW | disposableIncomeRange | The old prompt did not specify after essential bills/obligations; confirm that scope before treating it as modern remaining cash flow. |
| q24 | Amount that could responsibly be allocated to trading/trading education without affecting necessities | free-text input (approximate dollar amounts) | PARTIAL / REQUIRES REVIEW | Context only | Combined education/trading allocation is not available trading capital or affordable loss. |
| q25 | Risk comfort | select / Low, Moderate, High | NO CANONICAL EQUIVALENT | Context only | Comfort is not financial risk capacity, competence or permission for live trading. |
| q26 | Instructor notes | textarea | NO CANONICAL EQUIVALENT | Context only | Historical instructor context only; never student report, current placement authority or automatic approval. |
| q27 | Recommended HFT track/level | input | NO CANONICAL EQUIVALENT | Context only | Historical instructor context only; never student report, current placement authority or automatic approval. |
| q28 | Primary focus areas | textarea | NO CANONICAL EQUIVALENT | Context only | Historical instructor context only; never student report, current placement authority or automatic approval. |
| q29 | Risks/concerns | textarea | NO CANONICAL EQUIVALENT | Context only | Historical instructor context only; never student report, current placement authority or automatic approval. |
| q30 | Next steps | textarea | NO CANONICAL EQUIVALENT | Context only | Historical instructor context only; never student report, current placement authority or automatic approval. |
| q9details | Details (prior trading courses/coaching) | textarea | SAFE COMPATIBLE MATCH | priorEducation.notes | Copy details only when the same source explicitly reports prior education Yes. |
| q10notes | Optional notes (significant loss or scam) | textarea | PARTIAL / REQUIRES REVIEW | Context only | Notes do not necessarily answer the newer reflection question. |
| whyJoin | Why join HFT? | textarea; adjacent worker_v38 form | PARTIAL / REQUIRES REVIEW | Context only | Retain the known adjacent-form prompt; HFT membership motivation does not answer why trading now. |

No original form-version identifier was stored. Automatic recognition is deliberately limited to the verified source family/capture window. Unknown historical versions fail closed. Version upload times bound the source evidence; they are not represented as original per-answer form metadata.

Financial range reuse is identity-only against existing approved range options. No raw-amount bucketing, rating conversion, consent inference or mastery inference occurs.

Source retrieval used the documented read-only [Cloudflare version API](https://developers.cloudflare.com/api/resources/workers/subresources/beta/subresources/workers/subresources/versions/methods/get/) with bundled modules. Only the non-sensitive questionnaire component is copied into the audit; credentials and full Worker response remain outside source control.
