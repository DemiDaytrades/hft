import type {StageClass} from '../stage/contracts';
// Private academic definition: reviewed evidence criteria and exact source URLs.
export const CLASS_S2_3: StageClass = {
  "id": "stage-2-class-3",
  "version": "stage-2-class-3.1.0.0",
  "stageId": "stage-2",
  "number": 3,
  "title": "Bid, Ask, Spread and Trading Costs",
  "description": "Read transaction sides and reconcile distinct sources of hypothetical cost.",
  "courseId": "hft-school-foundations",
  "lessonId": "hft-school-s2-3",
  "prerequisites": [
    "stage-2-class-2"
  ],
  "liveMinutes": 60,
  "reviewMinutes": 30,
  "objectives": [
    {
      "id": "stage-2-class-3-objective-1",
      "text": "Read the dealer’s two sides",
      "competency": "S2_C3_1"
    },
    {
      "id": "stage-2-class-3-objective-2",
      "text": "Opening and closing are both transactions",
      "competency": "S2_C3_2"
    },
    {
      "id": "stage-2-class-3-objective-3",
      "text": "Spread is a difference, not a second subtraction",
      "competency": "S2_C3_3"
    },
    {
      "id": "stage-2-class-3-objective-4",
      "text": "Widening changes the exit even without mid movement",
      "competency": "S2_C3_4"
    },
    {
      "id": "stage-2-class-3-objective-5",
      "text": "Separate the fee ledger",
      "competency": "S2_C3_5"
    },
    {
      "id": "stage-2-class-3-objective-6",
      "text": "A displayed price is conditional evidence",
      "competency": "S2_C3_6"
    }
  ],
  "terms": [
    {
      "term": "Read the dealer’s two sides",
      "definition": "For a two-way quote in quote currency per base unit, bid is the price at which the quoting dealer buys the base and ask is the price at which it sells the base."
    },
    {
      "term": "Opening and closing are both transactions",
      "definition": "A conceptual long-base position starts by buying base and closes by selling it."
    },
    {
      "term": "Spread is a difference, not a second subtraction",
      "definition": "Spread equals ask minus bid in the same quote units."
    },
    {
      "term": "Widening changes the exit even without mid movement",
      "definition": "Quotes can change with provider conditions and market conditions."
    },
    {
      "term": "Separate the fee ledger",
      "definition": "Commission is a separately stated charge under a schedule."
    },
    {
      "term": "A displayed price is conditional evidence",
      "definition": "An indicative quote or last-traded chart price describes information, not an unconditional promise that a customer can transact there."
    }
  ],
  "sections": [
    {
      "id": "stage-2-class-3-section-1",
      "title": "Read the dealer’s two sides",
      "objectiveId": "stage-2-class-3-objective-1",
      "competency": "S2_C3_1",
      "paragraphs": [
        "For a two-way quote in quote currency per base unit, bid is the price at which the quoting dealer buys the base and ask is the price at which it sells the base. The customer buying base normally pays ask; selling base normally receives bid.",
        "Always establish whose perspective is being described. Prices shown in this class are fictional conditional quotes, not promises of actual execution."
      ],
      "example": "EUR/USD bid 1.1000 ask 1.1004: a customer buys EUR at 1.1004 USD per EUR.",
      "misconception": "Bid means the customer should use it for every buy.",
      "visual": "none",
      "activities": [
        {
          "id": "stage-2-class-3-check-1",
          "kind": "choice",
          "category": "REASONING",
          "sectionId": "stage-2-class-3-section-1",
          "objectiveId": "stage-2-class-3-objective-1",
          "competency": "S2_C3_1",
          "prompt": "Which explanation preserves the distinction in this chapter?",
          "critical": true,
          "options": [
            {
              "id": "stage-2-class-3-check-1-a",
              "label": "EUR/USD bid 1.1000 ask 1.1004: a customer buys EUR at 1.1004 USD per EUR."
            },
            {
              "id": "stage-2-class-3-check-1-b",
              "label": "Bid means the customer should use it for every buy."
            }
          ],
          "correct": "stage-2-class-3-check-1-a"
        }
      ]
    },
    {
      "id": "stage-2-class-3-section-2",
      "title": "Opening and closing are both transactions",
      "objectiveId": "stage-2-class-3-objective-2",
      "competency": "S2_C3_2",
      "paragraphs": [
        "A conceptual long-base position starts by buying base and closes by selling it. A conceptual short-base position starts by selling base and closes by buying it back. Therefore long uses ask then bid, while short uses bid then ask.",
        "These are side-reading exercises, not instructions to open positions. Product permissions and obligations differ; sizing and detailed order handling are deferred."
      ],
      "example": "Unchanged 1.1000/1.1004 produces a long difference 1.1000−1.1004 = −0.0004 USD/EUR before separate fees.",
      "misconception": "Closing always uses the same side as opening.",
      "visual": "none",
      "activities": [
        {
          "id": "stage-2-class-3-check-2",
          "kind": "choice",
          "category": "REASONING",
          "sectionId": "stage-2-class-3-section-2",
          "objectiveId": "stage-2-class-3-objective-2",
          "competency": "S2_C3_2",
          "prompt": "Which explanation preserves the distinction in this chapter?",
          "critical": true,
          "options": [
            {
              "id": "stage-2-class-3-check-2-a",
              "label": "Unchanged 1.1000/1.1004 produces a long difference 1.1000−1.1004 = −0.0004 USD/EUR before separate fees."
            },
            {
              "id": "stage-2-class-3-check-2-b",
              "label": "Closing always uses the same side as opening."
            }
          ],
          "correct": "stage-2-class-3-check-2-a"
        }
      ]
    },
    {
      "id": "stage-2-class-3-section-3",
      "title": "Spread is a difference, not a second subtraction",
      "objectiveId": "stage-2-class-3-objective-3",
      "competency": "S2_C3_3",
      "paragraphs": [
        "Spread equals ask minus bid in the same quote units. If an exercise already uses actual opening ask and closing bid, the side difference already reflects their spread effect. Subtracting that same spread again double-counts it.",
        "The mid-price is the arithmetic midpoint of two quotes; it is not automatically an available execution price. We keep calculations per one base unit here."
      ],
      "example": "Ask 1.2006 minus bid 1.2000 gives spread 0.0006 USD/EUR. A same-quote buy then sell difference is −0.0006, not −0.0012.",
      "misconception": "Subtract the spread again after using both actual sides.",
      "visual": "none",
      "activities": [
        {
          "id": "stage-2-class-3-check-3",
          "kind": "choice",
          "category": "REASONING",
          "sectionId": "stage-2-class-3-section-3",
          "objectiveId": "stage-2-class-3-objective-3",
          "competency": "S2_C3_3",
          "prompt": "Which explanation preserves the distinction in this chapter?",
          "critical": true,
          "options": [
            {
              "id": "stage-2-class-3-check-3-a",
              "label": "Ask 1.2006 minus bid 1.2000 gives spread 0.0006 USD/EUR. A same-quote buy then sell difference is −0.0006, not −0.0012."
            },
            {
              "id": "stage-2-class-3-check-3-b",
              "label": "Subtract the spread again after using both actual sides."
            }
          ],
          "correct": "stage-2-class-3-check-3-a"
        }
      ]
    },
    {
      "id": "stage-2-class-3-section-4",
      "title": "Widening changes the exit even without mid movement",
      "objectiveId": "stage-2-class-3-objective-4",
      "competency": "S2_C3_4",
      "paragraphs": [
        "Quotes can change with provider conditions and market conditions. A spread may widen through a lower bid, a higher ask or both. A constant midpoint does not ensure the customer can exit at an unchanged price.",
        "A single quote change does not establish motive, manipulation or future direction. Identify the actual side needed before comparing snapshots."
      ],
      "example": "Initial 1.1000/1.1004 becomes 1.0997/1.1007. Midpoint stays 1.1002 but a long-base exit now receives less.",
      "misconception": "An unchanged midpoint guarantees an unchanged exit outcome.",
      "visual": "none",
      "activities": [
        {
          "id": "stage-2-class-3-check-4",
          "kind": "choice",
          "category": "REASONING",
          "sectionId": "stage-2-class-3-section-4",
          "objectiveId": "stage-2-class-3-objective-4",
          "competency": "S2_C3_4",
          "prompt": "Which explanation preserves the distinction in this chapter?",
          "critical": true,
          "options": [
            {
              "id": "stage-2-class-3-check-4-a",
              "label": "Initial 1.1000/1.1004 becomes 1.0997/1.1007. Midpoint stays 1.1002 but a long-base exit now receives less."
            },
            {
              "id": "stage-2-class-3-check-4-b",
              "label": "An unchanged midpoint guarantees an unchanged exit outcome."
            }
          ],
          "correct": "stage-2-class-3-check-4-a"
        }
      ]
    },
    {
      "id": "stage-2-class-3-section-5",
      "title": "Separate the fee ledger",
      "objectiveId": "stage-2-class-3-objective-5",
      "competency": "S2_C3_5",
      "paragraphs": [
        "Commission is a separately stated charge under a schedule. Holding or financing adjustments depend on contract, direction, dates and provider terms; they may be charges or credits. Spread and these items must be distinguished rather than hidden inside a word like free.",
        "A zero-commission claim does not establish zero total cost. Missing financing details prevent a complete cost conclusion; do not assume every product or direction receives the same adjustment."
      ],
      "example": "A fictional completed exchange has gross side-based result USD 12, commission USD 2 and stated holding charge USD 3: net USD 7, excluding any unstated items.",
      "misconception": "No commission means no trading cost, or financing is always a credit.",
      "visual": "none",
      "activities": [
        {
          "id": "stage-2-class-3-check-5",
          "kind": "choice",
          "category": "REASONING",
          "sectionId": "stage-2-class-3-section-5",
          "objectiveId": "stage-2-class-3-objective-5",
          "competency": "S2_C3_5",
          "prompt": "Which explanation preserves the distinction in this chapter?",
          "critical": true,
          "options": [
            {
              "id": "stage-2-class-3-check-5-a",
              "label": "A fictional completed exchange has gross side-based result USD 12, commission USD 2 and stated holding charge USD 3: net USD 7, excluding any unstated items."
            },
            {
              "id": "stage-2-class-3-check-5-b",
              "label": "No commission means no trading cost, or financing is always a credit."
            }
          ],
          "correct": "stage-2-class-3-check-5-a"
        }
      ]
    },
    {
      "id": "stage-2-class-3-section-6",
      "title": "A displayed price is conditional evidence",
      "objectiveId": "stage-2-class-3-objective-6",
      "competency": "S2_C3_6",
      "paragraphs": [
        "An indicative quote or last-traded chart price describes information, not an unconditional promise that a customer can transact there. Executability depends on product, provider, size, time and conditions. Actual recorded sides are needed to assess a hypothetical result.",
        "A demo is an educational environment; simulated fills cannot certify live liquidity or profit. No live transaction, deposit or forecast is part of this assignment."
      ],
      "example": "A chart last price of 1.1010 sits beside a dealer quote 1.1007/1.1013; the chart does not guarantee a buy at 1.1010.",
      "misconception": "A chart touch guarantees that every customer was filled there.",
      "visual": "none",
      "activities": [
        {
          "id": "stage-2-class-3-check-6",
          "kind": "choice",
          "category": "REASONING",
          "sectionId": "stage-2-class-3-section-6",
          "objectiveId": "stage-2-class-3-objective-6",
          "competency": "S2_C3_6",
          "prompt": "Which explanation preserves the distinction in this chapter?",
          "critical": true,
          "options": [
            {
              "id": "stage-2-class-3-check-6-a",
              "label": "A chart last price of 1.1010 sits beside a dealer quote 1.1007/1.1013; the chart does not guarantee a buy at 1.1010."
            },
            {
              "id": "stage-2-class-3-check-6-b",
              "label": "A chart touch guarantees that every customer was filled there."
            }
          ],
          "correct": "stage-2-class-3-check-6-a"
        }
      ]
    }
  ],
  "assessment": [
    {
      "id": "stage-2-class-3-assessment-1",
      "kind": "written",
      "category": "APPLICATION",
      "sectionId": "stage-2-class-3-section-1",
      "objectiveId": "stage-2-class-3-objective-1",
      "competency": "S2_C3_1",
      "prompt": "At GBP/USD 1.2500/1.2506, choose and explain the side for a customer buying GBP and selling GBP.",
      "rubric": "Require ask 1.2506 for buying base and bid 1.2500 for selling base, units USD/GBP and dealer/customer perspective.",
      "critical": true
    },
    {
      "id": "stage-2-class-3-assessment-2",
      "kind": "written",
      "category": "APPLICATION",
      "sectionId": "stage-2-class-3-section-2",
      "objectiveId": "stage-2-class-3-objective-2",
      "competency": "S2_C3_2",
      "prompt": "For unchanged NZD/USD 0.6200/0.6205, write opening/closing sides and quote differences for long and short base.",
      "rubric": "Require long ask→bid and bid−ask −0.0005; short bid→ask and opening bid minus closing ask −0.0005, units USD/NZD.",
      "critical": true
    },
    {
      "id": "stage-2-class-3-assessment-3",
      "kind": "written",
      "category": "APPLICATION",
      "sectionId": "stage-2-class-3-section-3",
      "objectiveId": "stage-2-class-3-objective-3",
      "competency": "S2_C3_3",
      "prompt": "At EUR/CHF 0.9500/0.9508, reconcile the spread and unchanged-quote round-trip difference per EUR without double-counting.",
      "rubric": "Require spread 0.0008 CHF/EUR and difference −0.0008 CHF/EUR; explicitly reject another spread subtraction or guaranteed midpoint fill.",
      "critical": true
    },
    {
      "id": "stage-2-class-3-assessment-4",
      "kind": "written",
      "category": "APPLICATION",
      "sectionId": "stage-2-class-3-section-4",
      "objectiveId": "stage-2-class-3-objective-4",
      "competency": "S2_C3_4",
      "prompt": "A long opens at ask 1.3004. Later quotes widen from 1.3000/1.3004 to 1.2995/1.3009. Compare available long exit side differences.",
      "rubric": "Require old difference −0.0004 and widened −0.0009 quote/base; midpoint unchanged 1.3002; no causal allegation from snapshots.",
      "critical": true
    },
    {
      "id": "stage-2-class-3-assessment-5",
      "kind": "written",
      "category": "APPLICATION",
      "sectionId": "stage-2-class-3-section-5",
      "objectiveId": "stage-2-class-3-objective-5",
      "competency": "S2_C3_5",
      "prompt": "Reconcile stated gross side-based USD 18, USD 4 total commission and USD 5 holding charge. Explain why another spread subtraction is unwarranted and name a missing assumption.",
      "rubric": "Require USD 9 under stated assumptions; distinguish commission and holding from embedded side effect; identify timing, taxes, currency conversion or other omitted charges without inventing amounts.",
      "critical": true
    },
    {
      "id": "stage-2-class-3-assessment-6",
      "kind": "written",
      "category": "APPLICATION",
      "sectionId": "stage-2-class-3-section-6",
      "objectiveId": "stage-2-class-3-objective-6",
      "competency": "S2_C3_6",
      "prompt": "Create a fictional execution-side ledger: long entry 1.2004 at ask, later widened bid/ask 1.1995/1.2013, commission and holding terms stated separately. Explain missing executability evidence.",
      "rubric": "Require long exit bid 1.1995 and side difference −0.0009 quote/base; explicit fee assumptions; distinguish indicative or demo values from guaranteed fills. Individually review units, sides and uncertainty.",
      "critical": true
    },
    {
      "category": "APPLICATION",
      "sectionId": "stage-2-class-3-section-1",
      "objectiveId": "stage-2-class-3-objective-1",
      "competency": "S2_C3_1",
      "id": "stage-2-class-3-assessment-objective-1",
      "kind": "choice",
      "critical": true,
      "prompt": "At USD/CHF 0.8800/0.8806, which price does a customer normally pay to buy USD?",
      "options": [
        {
          "id": "stage-2-class-3-assessment-objective-1-sound",
          "label": "0.8806 CHF per USD ask"
        },
        {
          "id": "stage-2-class-3-assessment-objective-1-error",
          "label": "0.8800 CHF per USD bid"
        }
      ],
      "correct": "stage-2-class-3-assessment-objective-1-sound"
    },
    {
      "category": "APPLICATION",
      "sectionId": "stage-2-class-3-section-5",
      "objectiveId": "stage-2-class-3-objective-5",
      "competency": "S2_C3_5",
      "id": "stage-2-class-3-assessment-objective-2",
      "kind": "choice",
      "critical": true,
      "prompt": "A stated side-based gain is USD 15, commission USD 2 and holding charge USD 1. What is net under these assumptions?",
      "options": [
        {
          "id": "stage-2-class-3-assessment-objective-2-sound",
          "label": "USD 12; do not subtract the embedded spread again"
        },
        {
          "id": "stage-2-class-3-assessment-objective-2-error",
          "label": "USD 14 because holding charges never count"
        }
      ],
      "correct": "stage-2-class-3-assessment-objective-2-sound"
    }
  ],
  "homework": [
    {
      "id": "stage-2-class-3-homework-1",
      "kind": "written",
      "category": "HOMEWORK",
      "sectionId": "stage-2-class-3-section-1",
      "objectiveId": "stage-2-class-3-objective-1",
      "competency": "S2_C3_1",
      "prompt": "Fictional EUR/GBP bid 0.8500 ask 0.8507. Record which side a customer uses to obtain EUR and to give EUR; explain dealer perspective. Save individual labeled working; this is fictional paper work with no real-money requirement.",
      "rubric": "Require ask 0.8507 buy EUR and bid 0.8500 sell EUR, units GBP per EUR. Individually review saved evidence; preserve original attempts and return failed skill for fresh targeted reassessment.",
      "critical": true
    },
    {
      "id": "stage-2-class-3-homework-2",
      "kind": "written",
      "category": "HOMEWORK",
      "sectionId": "stage-2-class-3-section-2",
      "objectiveId": "stage-2-class-3-objective-2",
      "competency": "S2_C3_2",
      "prompt": "Create opening and closing arrows for conceptual long and short base at unchanged GBP/CHF 1.1000/1.1009. Show side differences only; do not size a position. Save individual labeled working; this is fictional paper work with no real-money requirement.",
      "rubric": "Require long ask/bid and short bid/ask, both −0.0009 CHF/GBP, no pip-value calculation. Individually review saved evidence; preserve original attempts and return failed skill for fresh targeted reassessment.",
      "critical": true
    },
    {
      "id": "stage-2-class-3-homework-3",
      "kind": "written",
      "category": "HOMEWORK",
      "sectionId": "stage-2-class-3-section-3",
      "objectiveId": "stage-2-class-3-objective-3",
      "competency": "S2_C3_3",
      "prompt": "A EUR/CAD board shows 1.4500/1.4512. Reconcile spread and unchanged-quote customer round trip in a ledger, explaining why a second spread line is wrong. Save individual labeled working; this is fictional paper work with no real-money requirement.",
      "rubric": "Require spread 0.0012 CAD/EUR, side difference −0.0012 and no duplicate subtraction. Individually review saved evidence; preserve original attempts and return failed skill for fresh targeted reassessment.",
      "critical": true
    },
    {
      "id": "stage-2-class-3-homework-4",
      "kind": "written",
      "category": "HOMEWORK",
      "sectionId": "stage-2-class-3-section-4",
      "objectiveId": "stage-2-class-3-objective-4",
      "competency": "S2_C3_4",
      "prompt": "A conceptual long opened at 0.7006 ask. Quotes then move from 0.7000/0.7006 to 0.6996/0.7010. Compare long exits and midpoint without inferring motive. Save individual labeled working; this is fictional paper work with no real-money requirement.",
      "rubric": "Require bid exits 0.7000 versus 0.6996, differences −0.0006 versus −0.0010; midpoint unchanged 0.7003. Individually review saved evidence; preserve original attempts and return failed skill for fresh targeted reassessment.",
      "critical": true
    },
    {
      "id": "stage-2-class-3-homework-5",
      "kind": "written",
      "category": "HOMEWORK",
      "sectionId": "stage-2-class-3-section-5",
      "objectiveId": "stage-2-class-3-objective-5",
      "competency": "S2_C3_5",
      "prompt": "Fictional completed side-based result is USD 21, total commission USD 3 and holding charge USD 4. Build a separate cost ledger and list remaining unknowns. Save individual labeled working; this is fictional paper work with no real-money requirement.",
      "rubric": "Require net USD 14 under stated assumptions; spread already embedded; specific omitted tax/conversion/timing terms acknowledged. Individually review saved evidence; preserve original attempts and return failed skill for fresh targeted reassessment.",
      "critical": true
    },
    {
      "id": "stage-2-class-3-homework-6",
      "kind": "written",
      "category": "HOMEWORK",
      "sectionId": "stage-2-class-3-section-6",
      "objectiveId": "stage-2-class-3-objective-6",
      "competency": "S2_C3_6",
      "prompt": "Submit a fictional long-base ledger opening at ask 1.0505, later bid/ask 1.0498/1.0512. A separate completed-account illustration reports gross USD −8, commission USD 2 and holding credit USD 1. Keep per-base quote differences separate from account currency totals; state demo/indicative limitations. Save individual labeled working; this is fictional paper work with no real-money requirement.",
      "rubric": "Require exit bid 1.0498, −0.0007 quote/base; separate account net −9 USD; no combining unlike units or double spread; no fill guarantee, explicit fee assumptions. Individually review saved evidence; preserve original attempts and return failed skill for fresh targeted reassessment.",
      "critical": true
    }
  ],
  "remediation": [
    {
      "competency": "S2_C3_1",
      "sectionId": "stage-2-class-3-section-1",
      "title": "Repair: Read the dealer’s two sides",
      "paragraph": "Diagnose the failed distinction: Bid means the customer should use it for every buy. Use a labeled diagram or ledger to expose it. Retain the original attempt, teach only the failed skill, then assess the changed case below; completion alone is not mastery.",
      "reinforcement": {
        "id": "stage-2-class-3-reassess-1",
        "kind": "choice",
        "category": "APPLICATION",
        "sectionId": "stage-2-class-3-section-1",
        "objectiveId": "stage-2-class-3-objective-1",
        "competency": "S2_C3_1",
        "prompt": "At AUD/CAD 0.9000/0.9008 choose the customer sides and explain dealer actions. Which worked explanation repairs the failed distinction?",
        "rubric": "Require ask 0.9008 CAD per AUD to buy AUD and bid 0.9000 to sell AUD; dealer does opposite customer action. Individually inspect fresh saved reasoning; preserve original and reassessment attempts, and return the failed skill if still unproven. Deterministic answer identifies the repair; the existing written assessment retake must separately demonstrate reasoning transfer.",
        "critical": true,
        "options": [
          {
            "id": "stage-2-class-3-reassess-1-repair",
            "label": "ask 0.9008 CAD per AUD to buy AUD and bid 0.9000 to sell AUD; dealer does opposite customer action."
          },
          {
            "id": "stage-2-class-3-reassess-1-error",
            "label": "Customer buys AUD at bid 0.9000 because bid always means customer buy."
          }
        ],
        "correct": "stage-2-class-3-reassess-1-repair"
      }
    },
    {
      "competency": "S2_C3_2",
      "sectionId": "stage-2-class-3-section-2",
      "title": "Repair: Opening and closing are both transactions",
      "paragraph": "Diagnose the failed distinction: Closing always uses the same side as opening. Use a labeled diagram or ledger to expose it. Retain the original attempt, teach only the failed skill, then assess the changed case below; completion alone is not mastery.",
      "reinforcement": {
        "id": "stage-2-class-3-reassess-2",
        "kind": "choice",
        "category": "APPLICATION",
        "sectionId": "stage-2-class-3-section-2",
        "objectiveId": "stage-2-class-3-objective-2",
        "competency": "S2_C3_2",
        "prompt": "Use CAD/CHF 0.6500/0.6507 for fresh long/short arrows with unchanged quote; no pip-value calculation. Which worked explanation repairs the failed distinction?",
        "rubric": "Require long buy ask then sell bid; short sell bid then buy ask; both unchanged differences −0.0007 CHF/CAD. Individually inspect fresh saved reasoning; preserve original and reassessment attempts, and return the failed skill if still unproven. Deterministic answer identifies the repair; the existing written assessment retake must separately demonstrate reasoning transfer.",
        "critical": true,
        "options": [
          {
            "id": "stage-2-class-3-reassess-2-repair",
            "label": "long buy ask then sell bid; short sell bid then buy ask; both unchanged differences −0.0007 CHF/CAD."
          },
          {
            "id": "stage-2-class-3-reassess-2-error",
            "label": "Long opens and closes at ask; short opens and closes at bid."
          }
        ],
        "correct": "stage-2-class-3-reassess-2-repair"
      }
    },
    {
      "competency": "S2_C3_3",
      "sectionId": "stage-2-class-3-section-3",
      "title": "Repair: Spread is a difference, not a second subtraction",
      "paragraph": "Diagnose the failed distinction: Subtract the spread again after using both actual sides. Use a labeled diagram or ledger to expose it. Retain the original attempt, teach only the failed skill, then assess the changed case below; completion alone is not mastery.",
      "reinforcement": {
        "id": "stage-2-class-3-reassess-3",
        "kind": "choice",
        "category": "APPLICATION",
        "sectionId": "stage-2-class-3-section-3",
        "objectiveId": "stage-2-class-3-objective-3",
        "competency": "S2_C3_3",
        "prompt": "At GBP/CAD 1.7000/1.7010 show spread and same-quote round trip, then explain why subtracting 0.0010 twice is wrong. Which worked explanation repairs the failed distinction?",
        "rubric": "Require spread 0.0010 CAD/GBP and same-quote difference −0.0010 CAD/GBP; reject duplicate subtraction of same spread. Individually inspect fresh saved reasoning; preserve original and reassessment attempts, and return the failed skill if still unproven. Deterministic answer identifies the repair; the existing written assessment retake must separately demonstrate reasoning transfer.",
        "critical": true,
        "options": [
          {
            "id": "stage-2-class-3-reassess-3-repair",
            "label": "spread 0.0010 CAD/GBP and same-quote difference −0.0010 CAD/GBP; reject duplicate subtraction of same spread."
          },
          {
            "id": "stage-2-class-3-reassess-3-error",
            "label": "The spread must be subtracted twice, giving −0.0020 CAD per GBP."
          }
        ],
        "correct": "stage-2-class-3-reassess-3-repair"
      }
    },
    {
      "competency": "S2_C3_4",
      "sectionId": "stage-2-class-3-section-4",
      "title": "Repair: Widening changes the exit even without mid movement",
      "paragraph": "Diagnose the failed distinction: An unchanged midpoint guarantees an unchanged exit outcome. Use a labeled diagram or ledger to expose it. Retain the original attempt, teach only the failed skill, then assess the changed case below; completion alone is not mastery.",
      "reinforcement": {
        "id": "stage-2-class-3-reassess-4",
        "kind": "choice",
        "category": "APPLICATION",
        "sectionId": "stage-2-class-3-section-4",
        "objectiveId": "stage-2-class-3-objective-4",
        "competency": "S2_C3_4",
        "prompt": "A short opens at bid 0.8000, then ask rises from 0.8004 to 0.8009 while midpoint stays fixed. Explain changed close cost. Which worked explanation repairs the failed distinction?",
        "rubric": "Require short closes buying at ask; opening bid 0.8000 gives old difference −0.0004 and new −0.0009 quote/base, a worsening of 0.0005. Individually inspect fresh saved reasoning; preserve original and reassessment attempts, and return the failed skill if still unproven. Deterministic answer identifies the repair; the existing written assessment retake must separately demonstrate reasoning transfer.",
        "critical": true,
        "options": [
          {
            "id": "stage-2-class-3-reassess-4-repair",
            "label": "short closes buying at ask; opening bid 0.8000 gives old difference −0.0004 and new −0.0009 quote/base, a worsening of 0.0005."
          },
          {
            "id": "stage-2-class-3-reassess-4-error",
            "label": "The short close is unchanged because only bid matters for shorts."
          }
        ],
        "correct": "stage-2-class-3-reassess-4-repair"
      }
    },
    {
      "competency": "S2_C3_5",
      "sectionId": "stage-2-class-3-section-5",
      "title": "Repair: Separate the fee ledger",
      "paragraph": "Diagnose the failed distinction: No commission means no trading cost, or financing is always a credit. Use a labeled diagram or ledger to expose it. Retain the original attempt, teach only the failed skill, then assess the changed case below; completion alone is not mastery.",
      "reinforcement": {
        "id": "stage-2-class-3-reassess-5",
        "kind": "choice",
        "category": "APPLICATION",
        "sectionId": "stage-2-class-3-section-5",
        "objectiveId": "stage-2-class-3-objective-5",
        "competency": "S2_C3_5",
        "prompt": "Fresh ledger: gross −6 USD, commission 2 USD and holding credit 1 USD. Reconcile −7 USD and explain the credit sign. Which worked explanation repairs the failed distinction?",
        "rubric": "Require −6−2+1 = −7 USD, holding credit adds one; commission remains separate charge, not duplicate spread. Individually inspect fresh saved reasoning; preserve original and reassessment attempts, and return the failed skill if still unproven. Deterministic answer identifies the repair; the existing written assessment retake must separately demonstrate reasoning transfer.",
        "critical": true,
        "options": [
          {
            "id": "stage-2-class-3-reassess-5-repair",
            "label": "−6−2+1 = −7 USD, holding credit adds one; commission remains separate charge, not duplicate spread."
          },
          {
            "id": "stage-2-class-3-reassess-5-error",
            "label": "Net is −9 USD because the holding credit must be subtracted."
          }
        ],
        "correct": "stage-2-class-3-reassess-5-repair"
      }
    },
    {
      "competency": "S2_C3_6",
      "sectionId": "stage-2-class-3-section-6",
      "title": "Repair: A displayed price is conditional evidence",
      "paragraph": "Diagnose the failed distinction: A chart touch guarantees that every customer was filled there. Use a labeled diagram or ledger to expose it. Retain the original attempt, teach only the failed skill, then assess the changed case below; completion alone is not mastery.",
      "reinforcement": {
        "id": "stage-2-class-3-reassess-6",
        "kind": "choice",
        "category": "APPLICATION",
        "sectionId": "stage-2-class-3-section-6",
        "objectiveId": "stage-2-class-3-objective-6",
        "competency": "S2_C3_6",
        "prompt": "A chart last is 150.10 while USD/JPY dealer quote is 150.05/150.15. Explain customer buy/sell sides and why last is insufficient. Which worked explanation repairs the failed distinction?",
        "rubric": "Require customer buying USD uses ask 150.15 JPY/USD, selling USD uses bid 150.05; chart last 150.10 is not guaranteed executable or a promised fill. Individually inspect fresh saved reasoning; preserve original and reassessment attempts, and return the failed skill if still unproven. Deterministic answer identifies the repair; the existing written assessment retake must separately demonstrate reasoning transfer.",
        "critical": true,
        "options": [
          {
            "id": "stage-2-class-3-reassess-6-repair",
            "label": "customer buying USD uses ask 150.15 JPY/USD, selling USD uses bid 150.05; chart last 150.10 is not guaranteed executable or a promised fill."
          },
          {
            "id": "stage-2-class-3-reassess-6-error",
            "label": "The last chart price 150.10 guarantees both buying and selling there."
          }
        ],
        "correct": "stage-2-class-3-reassess-6-repair"
      }
    }
  ],
  "liveGuide": [
    {
      "title": "Read the dealer’s two sides",
      "minutes": 10,
      "talkingPoints": [
        "0–2 min: ask learners to retrieve the prerequisite distinction needed for read the dealer’s two sides. Collect individual responses before discussion.",
        "2–5 min demonstration: Give dealer two price cards; ask customer to request base currency and make dealer hand over the correct card.",
        "5–7 min: show EUR/USD bid 1.1000 ask 1.1004: a customer buys EUR at 1.1004 USD per EUR. Ask one learner to explain and another to challenge the stated assumption.",
        "7–9 min: address the specific misconception “Bid means the customer should use it for every buy.” with a counterexample, then change one number or term and ask everyone to predict.",
        "9–10 min: save each learner’s response; flag individual follow-up rather than treating group agreement as evidence."
      ],
      "activity": {
        "kind": "WRITTEN",
        "prompt": "At GBP/USD 1.2500/1.2506, choose and explain the side for a customer buying GBP and selling GBP.",
        "sectionId": "stage-2-class-3-section-1"
      }
    },
    {
      "title": "Opening and closing are both transactions",
      "minutes": 10,
      "talkingPoints": [
        "0–2 min: ask learners to retrieve the prerequisite distinction needed for opening and closing are both transactions. Collect individual responses before discussion.",
        "2–5 min demonstration: Reverse the transaction arrow when closing and predict which price card must change hands.",
        "5–7 min: show Unchanged 1.1000/1.1004 produces a long difference 1.1000−1.1004 = −0.0004 USD/EUR before separate fees. Ask one learner to explain and another to challenge the stated assumption.",
        "7–9 min: address the specific misconception “Closing always uses the same side as opening.” with a counterexample, then change one number or term and ask everyone to predict.",
        "9–10 min: save each learner’s response; flag individual follow-up rather than treating group agreement as evidence."
      ],
      "activity": {
        "kind": "SINGLE",
        "prompt": "For unchanged NZD/USD 0.6200/0.6205, write opening/closing sides and quote differences for long and short base.",
        "sectionId": "stage-2-class-3-section-2"
      }
    },
    {
      "title": "Spread is a difference, not a second subtraction",
      "minutes": 10,
      "talkingPoints": [
        "0–2 min: ask learners to retrieve the prerequisite distinction needed for spread is a difference, not a second subtraction. Collect individual responses before discussion.",
        "2–5 min demonstration: Show a ledger with ask paid and bid received; cross out a duplicate spread fee line and explain the correction.",
        "5–7 min: show Ask 1.2006 minus bid 1.2000 gives spread 0.0006 USD/EUR. A same-quote buy then sell difference is −0.0006, not −0.0012. Ask one learner to explain and another to challenge the stated assumption.",
        "7–9 min: address the specific misconception “Subtract the spread again after using both actual sides.” with a counterexample, then change one number or term and ask everyone to predict.",
        "9–10 min: save each learner’s response; flag individual follow-up rather than treating group agreement as evidence."
      ],
      "activity": {
        "kind": "POLL",
        "prompt": "At EUR/CHF 0.9500/0.9508, reconcile the spread and unchanged-quote round-trip difference per EUR without double-counting.",
        "sectionId": "stage-2-class-3-section-3"
      }
    },
    {
      "title": "Widening changes the exit even without mid movement",
      "minutes": 10,
      "talkingPoints": [
        "0–2 min: ask learners to retrieve the prerequisite distinction needed for widening changes the exit even without mid movement. Collect individual responses before discussion.",
        "2–5 min demonstration: Keep a midpoint marker fixed while moving two side cards apart; ask long and short customers which exit worsened.",
        "5–7 min: show Initial 1.1000/1.1004 becomes 1.0997/1.1007. Midpoint stays 1.1002 but a long-base exit now receives less. Ask one learner to explain and another to challenge the stated assumption.",
        "7–9 min: address the specific misconception “An unchanged midpoint guarantees an unchanged exit outcome.” with a counterexample, then change one number or term and ask everyone to predict.",
        "9–10 min: save each learner’s response; flag individual follow-up rather than treating group agreement as evidence."
      ],
      "activity": {
        "kind": "WRITTEN",
        "prompt": "A long opens at ask 1.3004. Later quotes widen from 1.3000/1.3004 to 1.2995/1.3009. Compare available long exit side differences.",
        "sectionId": "stage-2-class-3-section-4"
      }
    },
    {
      "title": "Separate the fee ledger",
      "minutes": 10,
      "talkingPoints": [
        "0–2 min: ask learners to retrieve the prerequisite distinction needed for separate the fee ledger. Collect individual responses before discussion.",
        "2–5 min demonstration: Reveal commission and financing cards after a zero-commission slogan; ask which evidence is still missing for a complete total.",
        "5–7 min: show A fictional completed exchange has gross side-based result USD 12, commission USD 2 and stated holding charge USD 3: net USD 7, excluding any unstated items. Ask one learner to explain and another to challenge the stated assumption.",
        "7–9 min: address the specific misconception “No commission means no trading cost, or financing is always a credit.” with a counterexample, then change one number or term and ask everyone to predict.",
        "9–10 min: save each learner’s response; flag individual follow-up rather than treating group agreement as evidence."
      ],
      "activity": {
        "kind": "SINGLE",
        "prompt": "Reconcile stated gross side-based USD 18, USD 4 total commission and USD 5 holding charge. Explain why another spread subtraction is unwarranted and name a missing assumption.",
        "sectionId": "stage-2-class-3-section-5"
      }
    },
    {
      "title": "A displayed price is conditional evidence",
      "minutes": 10,
      "talkingPoints": [
        "0–2 min: ask learners to retrieve the prerequisite distinction needed for a displayed price is conditional evidence. Collect individual responses before discussion.",
        "2–5 min demonstration: Hide the chart last-price tag and ask what information a customer still needs to know their actual buying price.",
        "5–7 min: show A chart last price of 1.1010 sits beside a dealer quote 1.1007/1.1013; the chart does not guarantee a buy at 1.1010. Ask one learner to explain and another to challenge the stated assumption.",
        "7–9 min: address the specific misconception “A chart touch guarantees that every customer was filled there.” with a counterexample, then change one number or term and ask everyone to predict.",
        "9–10 min: save each learner’s response; flag individual follow-up rather than treating group agreement as evidence."
      ],
      "activity": {
        "kind": "POLL",
        "prompt": "Create a fictional execution-side ledger: long entry 1.2004 at ask, later widened bid/ask 1.1995/1.2013, commission and holding terms stated separately. Explain missing executability evidence.",
        "sectionId": "stage-2-class-3-section-6"
      }
    }
  ],
  "studyGuide": {
    "summary": [
      "Read the dealer’s two sides: EUR/USD bid 1.1000 ask 1.1004: a customer buys EUR at 1.1004 USD per EUR.",
      "Opening and closing are both transactions: Unchanged 1.1000/1.1004 produces a long difference 1.1000−1.1004 = −0.0004 USD/EUR before separate fees.",
      "Spread is a difference, not a second subtraction: Ask 1.2006 minus bid 1.2000 gives spread 0.0006 USD/EUR. A same-quote buy then sell difference is −0.0006, not −0.0012.",
      "Widening changes the exit even without mid movement: Initial 1.1000/1.1004 becomes 1.0997/1.1007. Midpoint stays 1.1002 but a long-base exit now receives less.",
      "Separate the fee ledger: A fictional completed exchange has gross side-based result USD 12, commission USD 2 and stated holding charge USD 3: net USD 7, excluding any unstated items.",
      "A displayed price is conditional evidence: A chart last price of 1.1010 sits beside a dealer quote 1.1007/1.1013; the chart does not guarantee a buy at 1.1010."
    ],
    "bigPicture": "A transaction needs the correct side and a separate ledger of stated charges.",
    "fiveThings": [
      "Read the dealer’s two sides",
      "Opening and closing are both transactions",
      "Spread is a difference, not a second subtraction",
      "Widening changes the exit even without mid movement",
      "Separate the fee ledger"
    ],
    "outcomes": [
      "Read the dealer’s two sides",
      "Opening and closing are both transactions",
      "Spread is a difference, not a second subtraction",
      "Widening changes the exit even without mid movement",
      "Separate the fee ledger",
      "A displayed price is conditional evidence"
    ],
    "examples": [
      "EUR/USD bid 1.1000 ask 1.1004: a customer buys EUR at 1.1004 USD per EUR.",
      "Unchanged 1.1000/1.1004 produces a long difference 1.1000−1.1004 = −0.0004 USD/EUR before separate fees.",
      "Ask 1.2006 minus bid 1.2000 gives spread 0.0006 USD/EUR. A same-quote buy then sell difference is −0.0006, not −0.0012.",
      "Initial 1.1000/1.1004 becomes 1.0997/1.1007. Midpoint stays 1.1002 but a long-base exit now receives less.",
      "A fictional completed exchange has gross side-based result USD 12, commission USD 2 and stated holding charge USD 3: net USD 7, excluding any unstated items.",
      "A chart last price of 1.1010 sits beside a dealer quote 1.1007/1.1013; the chart does not guarantee a buy at 1.1010."
    ],
    "misconceptions": [
      "Bid means the customer should use it for every buy.",
      "Closing always uses the same side as opening.",
      "Subtract the spread again after using both actual sides.",
      "An unchanged midpoint guarantees an unchanged exit outcome.",
      "No commission means no trading cost, or financing is always a credit.",
      "A chart touch guarantees that every customer was filled there."
    ],
    "review": [
      {
        "sectionId": "stage-2-class-3-section-1",
        "label": "Reconstruct: Read the dealer’s two sides"
      },
      {
        "sectionId": "stage-2-class-3-section-2",
        "label": "Reconstruct: Opening and closing are both transactions"
      },
      {
        "sectionId": "stage-2-class-3-section-3",
        "label": "Reconstruct: Spread is a difference, not a second subtraction"
      },
      {
        "sectionId": "stage-2-class-3-section-4",
        "label": "Reconstruct: Widening changes the exit even without mid movement"
      },
      {
        "sectionId": "stage-2-class-3-section-5",
        "label": "Reconstruct: Separate the fee ledger"
      },
      {
        "sectionId": "stage-2-class-3-section-6",
        "label": "Reconstruct: A displayed price is conditional evidence"
      }
    ]
  },
  "chart": {
    "required": false,
    "tools": [],
    "stateFormat": "drawing-objects-v1",
    "context": [
      "Fictional paper cases only; no real-money requirement."
    ],
    "reviewStates": [
      "draft",
      "submitted",
      "reviewed"
    ],
    "history": "append-only"
  },
  "references": [
    {
      "title": "SEC Investor.gov: Foreign Currency Exchange Trading For Individual Investors",
      "url": "https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins/foreign"
    }
  ],
  "design": {
    "format": "Two-sided execution ledger",
    "homeworkTitle": "Execution-side and cost ledger",
    "homeworkIntro": "Submit individual saved explanations, assumptions and working. Incomplete evidence is returned for targeted revision; group participation does not substitute for review.",
    "pacing": {
      "minimum": 45,
      "maximum": 90
    },
    "assessmentCoverage": [
      "S2_C3_1",
      "S2_C3_2",
      "S2_C3_3",
      "S2_C3_4",
      "S2_C3_5",
      "S2_C3_6"
    ],
    "practicalRequirement": "Individually reviewed saved work for every objective; fresh targeted reassessment after failed skills, with original evidence preserved.",
    "studyGuideVisual": {
      "kind": "quote",
      "nodes": [
        {
          "label": "Read the dealer’s two sides",
          "detail": "EUR/USD bid 1.1000 ask 1.1004: a customer buys EUR at 1.1004 USD per EUR."
        },
        {
          "label": "Inspect",
          "detail": "Give dealer two price cards; ask customer to request base currency and make dealer hand over the correct card."
        },
        {
          "label": "Boundary",
          "detail": "Always establish whose perspective is being described. Prices shown in this class are fictional conditional quotes, not promises of actual execution."
        }
      ],
      "caption": "Fictional teaching model: labels and terms matter more than screen appearance."
    },
    "studyGuideChecks": [
      "At AUD/CAD 0.9000/0.9008 choose the customer sides and explain dealer actions.",
      "Use CAD/CHF 0.6500/0.6507 for fresh long/short arrows with unchanged quote; no pip-value calculation.",
      "At GBP/CAD 1.7000/1.7010 show spread and same-quote round trip, then explain why subtracting 0.0010 twice is wrong.",
      "A short opens at bid 0.8000, then ask rises from 0.8004 to 0.8009 while midpoint stays fixed. Explain changed close cost.",
      "Fresh ledger: gross −6 USD, commission 2 USD and holding credit 1 USD. Reconcile −7 USD and explain the credit sign.",
      "A chart last is 150.10 while USD/JPY dealer quote is 150.05/150.15. Explain customer buy/sell sides and why last is insufficient."
    ]
  }
};
