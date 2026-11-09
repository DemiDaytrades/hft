import 'server-only';
import type {StageClass} from '../stage/contracts';
export const CLASS_S2_5:StageClass = {
  "id": "stage-2-class-5",
  "version": "stage-2-class-5.1.0.0",
  "stageId": "stage-2",
  "number": 5,
  "title": "Units, Lots, Leverage and Margin",
  "description": "Relate supplied units and lot specifications to notional exposure. Distinguish required margin from maximum possible loss and refuse missing specifications.",
  "courseId": "hft-school-foundations",
  "lessonId": "hft-school-s2-5",
  "prerequisites": [
    "stage-2-class-4"
  ],
  "liveMinutes": 60,
  "reviewMinutes": 30,
  "objectives": [
    {
      "id": "s2-5-objective-1",
      "text": "Relate supplied units and lot specifications to notional exposure.",
      "competency": "S2_C5_1"
    },
    {
      "id": "s2-5-objective-2",
      "text": "Distinguish required margin from maximum possible loss and refuse missing specifications.",
      "competency": "S2_C5_2"
    }
  ],
  "terms": [
    {
      "term": "A lot needs a contract",
      "definition": "Units describe a quantity of the specified product. A lot is a contractual grouping of units, not a universal amount. An FX lot specification cannot be silently reused for a metal CFD or another provider’s contract. Missing contract size is missing evidence."
    },
    {
      "term": "Price connects quantity and value",
      "definition": "Notional exposure is the value represented by the position under stated pricing assumptions. Multiplying base currency units by quote currency per base unit gives quote-currency notional. Label both quantities; this is not an account-currency risk calculation."
    },
    {
      "term": "Collateral does not shrink exposure",
      "definition": "Under a deliberately simplified fixed 20:1 initial leverage assumption, required margin is notional divided by 20. Actual provider requirements may involve tiers, currency conversion or changing rates. Initial collateral is a condition of holding exposure; it does not remove that exposure."
    }
  ],
  "sections": [
    {
      "id": "s2-5-section-1",
      "title": "A lot needs a contract",
      "objectiveId": "s2-5-objective-1",
      "competency": "S2_C5_1",
      "paragraphs": [
        "Units describe a quantity of the specified product. A lot is a contractual grouping of units, not a universal amount. An FX lot specification cannot be silently reused for a metal CFD or another provider’s contract. Missing contract size is missing evidence."
      ],
      "example": "Teaching FX contract: one lot = 100,000 EUR. Therefore 0.02 lot = 2,000 EUR, not 2,000 USD.",
      "misconception": "A lot always means the same exposure.",
      "visual": "none",
      "activities": [
        {
          "id": "s2-5-explore-1",
          "kind": "choice",
          "category": "APPLICATION",
          "sectionId": "s2-5-section-1",
          "objectiveId": "s2-5-objective-1",
          "competency": "S2_C5_1",
          "prompt": "One fictional lot is 25,000 base units. How many base units are 0.4 lot?",
          "critical": true,
          "options": [
            {
              "id": "s2-5-explore-1-a",
              "label": "10,000 base units"
            },
            {
              "id": "s2-5-explore-1-b",
              "label": "One lot always means 100,000 units."
            }
          ],
          "correct": "s2-5-explore-1-a"
        }
      ]
    },
    {
      "id": "s2-5-section-2",
      "title": "Price connects quantity and value",
      "objectiveId": "s2-5-objective-1",
      "competency": "S2_C5_1",
      "paragraphs": [
        "Notional exposure is the value represented by the position under stated pricing assumptions. Multiplying base currency units by quote currency per base unit gives quote-currency notional. Label both quantities; this is not an account-currency risk calculation."
      ],
      "example": "2,000 EUR × 1.1000 USD/EUR = 2,200 USD notional.",
      "misconception": "2,000 base units and 2,000 quote units are interchangeable.",
      "visual": "none",
      "activities": [
        {
          "id": "s2-5-explore-2",
          "kind": "choice",
          "category": "APPLICATION",
          "sectionId": "s2-5-section-2",
          "objectiveId": "s2-5-objective-1",
          "competency": "S2_C5_1",
          "prompt": "3,000 EUR at 1.0800 USD/EUR: what is quote-currency notional?",
          "critical": true,
          "options": [
            {
              "id": "s2-5-explore-2-a",
              "label": "3,240 USD"
            },
            {
              "id": "s2-5-explore-2-b",
              "label": "3,000 USD, because quote and base units are identical."
            }
          ],
          "correct": "s2-5-explore-2-a"
        }
      ]
    },
    {
      "id": "s2-5-section-3",
      "title": "Collateral does not shrink exposure",
      "objectiveId": "s2-5-objective-2",
      "competency": "S2_C5_2",
      "paragraphs": [
        "Under a deliberately simplified fixed 20:1 initial leverage assumption, required margin is notional divided by 20. Actual provider requirements may involve tiers, currency conversion or changing rates. Initial collateral is a condition of holding exposure; it does not remove that exposure."
      ],
      "example": "10,000 USD notional / 20 = 500 USD assumed initial margin; at 50:1 it is 200 USD.",
      "misconception": "Lower required margin means a smaller position.",
      "visual": "none",
      "activities": [
        {
          "id": "s2-5-explore-3",
          "kind": "choice",
          "category": "APPLICATION",
          "sectionId": "s2-5-section-3",
          "objectiveId": "s2-5-objective-2",
          "competency": "S2_C5_2",
          "prompt": "12,000 USD notional at assumed 30:1 initial leverage: calculate margin.",
          "critical": true,
          "options": [
            {
              "id": "s2-5-explore-3-a",
              "label": "400 USD"
            },
            {
              "id": "s2-5-explore-3-b",
              "label": "Margin is the maximum possible loss."
            }
          ],
          "correct": "s2-5-explore-3-a"
        }
      ]
    },
    {
      "id": "s2-5-section-4",
      "title": "The same move affects the same exposure",
      "objectiveId": "s2-5-objective-2",
      "competency": "S2_C5_2",
      "paragraphs": [
        "With exposure held constant, increasing leverage reduces the assumed initial collateral, not the price movement’s consequence. For this toy linear exposure, a 2% adverse change on 10,000 USD represents about 200 USD before other effects. It consumes more of 200 collateral than of 500; that observation is not a risk budget."
      ],
      "example": "10,000 × 0.02 = 200 USD adverse change at either initial-margin setting.",
      "misconception": "High leverage improves the economic outcome of the same move.",
      "visual": "none",
      "activities": [
        {
          "id": "s2-5-explore-4",
          "kind": "choice",
          "category": "APPLICATION",
          "sectionId": "s2-5-section-4",
          "objectiveId": "s2-5-objective-2",
          "competency": "S2_C5_2",
          "prompt": "Same 8,000 USD exposure under two collateral settings: a 3% adverse linear move changes value by what amount?",
          "critical": true,
          "options": [
            {
              "id": "s2-5-explore-4-a",
              "label": "240 USD under either setting"
            },
            {
              "id": "s2-5-explore-4-b",
              "label": "The higher leverage setting changes the same exposure by less."
            }
          ],
          "correct": "s2-5-explore-4-a"
        }
      ]
    },
    {
      "id": "s2-5-section-5",
      "title": "Margin calls are not protective promises",
      "objectiveId": "s2-5-objective-2",
      "competency": "S2_C5_2",
      "paragraphs": [
        "Providers may require more collateral or close positions when maintenance conditions fail. Timing, thresholds and liquidation procedures depend on the agreement and jurisdiction. A requested stop is not a guaranteed fill: gaps and thin conditions can produce worse execution, and protections must be verified rather than assumed."
      ],
      "example": "A fictional gap takes a position past an expected exit level before an available price appears. Collateral posted at entry does not specify the final loss.",
      "misconception": "Margin or an ordinary stop caps every possible loss.",
      "visual": "none",
      "activities": [
        {
          "id": "s2-5-explore-5",
          "kind": "choice",
          "category": "APPLICATION",
          "sectionId": "s2-5-section-5",
          "objectiveId": "s2-5-objective-2",
          "competency": "S2_C5_2",
          "prompt": "A ticket shows 300 USD margin but no verified loss protection. May the learner call 300 the maximum possible loss?",
          "critical": true,
          "options": [
            {
              "id": "s2-5-explore-5-a",
              "label": "No; collateral does not establish a loss cap"
            },
            {
              "id": "s2-5-explore-5-b",
              "label": "Yes; posted margin always caps loss."
            }
          ],
          "correct": "s2-5-explore-5-a"
        }
      ]
    },
    {
      "id": "s2-5-section-6",
      "title": "Refuse an incomplete product",
      "objectiveId": "s2-5-objective-2",
      "competency": "S2_C5_2",
      "paragraphs": [
        "A safe mechanics explanation can end with an unresolved question. Verify product type, contract size, price units, leverage/margin rules and account currency before computing. These classroom calculations do not establish personal affordability, permission to trade or an appropriate allocation."
      ],
      "example": "A screen shows 0.5 lot and 100:1 but omits the contract and quote units. No reliable notional or margin calculation follows.",
      "misconception": "A leverage number is sufficient to assess a product.",
      "visual": "none",
      "activities": [
        {
          "id": "s2-5-explore-6",
          "kind": "choice",
          "category": "APPLICATION",
          "sectionId": "s2-5-section-6",
          "objectiveId": "s2-5-objective-2",
          "competency": "S2_C5_2",
          "prompt": "A fictional metal ticket says 0.2 lot but supplies no ounces per lot. What should you do before valuing it?",
          "critical": true,
          "options": [
            {
              "id": "s2-5-explore-6-a",
              "label": "Request contract size and units; do not infer FX units"
            },
            {
              "id": "s2-5-explore-6-b",
              "label": "Assume the usual FX lot specification."
            }
          ],
          "correct": "s2-5-explore-6-a"
        }
      ]
    }
  ],
  "assessment": [
    {
      "id": "s2-5-check-1",
      "kind": "written",
      "category": "REASONING",
      "sectionId": "s2-5-section-1",
      "objectiveId": "s2-5-objective-1",
      "competency": "S2_C5_1",
      "prompt": "One fictional lot is 25,000 base units. How many base units are 0.4 lot? Show the governing specification or verification step and explain your conclusion.",
      "rubric": "10,000 base units Reject the stated misconception: A lot always means the same exposure.",
      "critical": true
    },
    {
      "id": "s2-5-check-2",
      "kind": "written",
      "category": "REASONING",
      "sectionId": "s2-5-section-2",
      "objectiveId": "s2-5-objective-1",
      "competency": "S2_C5_1",
      "prompt": "3,000 EUR at 1.0800 USD/EUR: what is quote-currency notional? Show the governing specification or verification step and explain your conclusion.",
      "rubric": "3,240 USD Reject the stated misconception: 2,000 base units and 2,000 quote units are interchangeable.",
      "critical": true
    },
    {
      "id": "s2-5-check-3",
      "kind": "written",
      "category": "REASONING",
      "sectionId": "s2-5-section-3",
      "objectiveId": "s2-5-objective-2",
      "competency": "S2_C5_2",
      "prompt": "12,000 USD notional at assumed 30:1 initial leverage: calculate margin. Show the governing specification or verification step and explain your conclusion.",
      "rubric": "400 USD Reject the stated misconception: Lower required margin means a smaller position.",
      "critical": true
    },
    {
      "id": "s2-5-check-4",
      "kind": "written",
      "category": "REASONING",
      "sectionId": "s2-5-section-4",
      "objectiveId": "s2-5-objective-2",
      "competency": "S2_C5_2",
      "prompt": "Same 8,000 USD exposure under two collateral settings: a 3% adverse linear move changes value by what amount? Show the governing specification or verification step and explain your conclusion.",
      "rubric": "240 USD under either setting Reject the stated misconception: High leverage improves the economic outcome of the same move.",
      "critical": true
    },
    {
      "id": "s2-5-check-5",
      "kind": "written",
      "category": "REASONING",
      "sectionId": "s2-5-section-5",
      "objectiveId": "s2-5-objective-2",
      "competency": "S2_C5_2",
      "prompt": "A ticket shows 300 USD margin but no verified loss protection. May the learner call 300 the maximum possible loss? Show the governing specification or verification step and explain your conclusion.",
      "rubric": "No; collateral does not establish a loss cap Reject the stated misconception: Margin or an ordinary stop caps every possible loss.",
      "critical": true
    },
    {
      "id": "s2-5-check-6",
      "kind": "written",
      "category": "REASONING",
      "sectionId": "s2-5-section-6",
      "objectiveId": "s2-5-objective-2",
      "competency": "S2_C5_2",
      "prompt": "A fictional metal ticket says 0.2 lot but supplies no ounces per lot. What should you do before valuing it? Show the governing specification or verification step and explain your conclusion.",
      "rubric": "Request contract size and units; do not infer FX units Reject the stated misconception: A leverage number is sufficient to assess a product.",
      "critical": true
    },
    {
      "id": "stage-2-class-5-fresh-objective-0",
      "kind": "choice",
      "category": "KNOWLEDGE",
      "sectionId": "s2-5-section-1",
      "objectiveId": "s2-5-objective-1",
      "competency": "S2_C5_1",
      "prompt": "Supplied contract20,000 EUR/lot; quantity0.25lot. Exposure units?",
      "options": [
        {
          "id": "o0",
          "label": "5,000 EUR"
        },
        {
          "id": "o1",
          "label": "80,000 EUR"
        },
        {
          "id": "o2",
          "label": "0.25 EUR"
        }
      ],
      "correct": "o0",
      "critical": true
    },
    {
      "id": "stage-2-class-5-fresh-objective-1",
      "kind": "choice",
      "category": "KNOWLEDGE",
      "sectionId": "s2-5-section-3",
      "objectiveId": "s2-5-objective-2",
      "competency": "S2_C5_2",
      "prompt": "Same12,000USD exposure, collateral400versus200USD. A hypothetical2% adverse linear move causes what before costs?",
      "options": [
        {
          "id": "o0",
          "label": "Half the loss with less collateral"
        },
        {
          "id": "o1",
          "label": "240USD loss in either case; no loss cap proved"
        },
        {
          "id": "o2",
          "label": "Loss cannot exceed200USD"
        }
      ],
      "correct": "o1",
      "critical": true
    }
  ],
  "homework": [
    {
      "id": "s2-5-homework-1",
      "kind": "written",
      "category": "HOMEWORK",
      "sectionId": "s2-5-section-1",
      "objectiveId": "s2-5-objective-1",
      "competency": "S2_C5_1",
      "prompt": "Contract and exposure ledger: Fictional FX contract: 1 lot = 100,000 EUR; quantity 0.035 lot; quote 1.1200 USD/EUR. Separately, fictional metal contract: 1 lot = 10 ounces; quantity 0.3 lot; price 2,000 USD/ounce. Derive units and quote notional for both, labeling cancellations.",
      "rubric": "Requires 3,500 EUR and 3,920 USD; 3 ounces and 6,000 USD. Explicitly distinguish contracts and currencies; review exposure skill alone.",
      "critical": true
    },
    {
      "id": "s2-5-homework-2",
      "kind": "written",
      "category": "HOMEWORK",
      "sectionId": "s2-5-section-3",
      "objectiveId": "s2-5-objective-2",
      "competency": "S2_C5_2",
      "prompt": "Collateral comparison and refusal: Hold 15,000 USD fictional linear exposure constant. Compare initial margin under simplified 25:1 and 50:1 assumptions, then a 4% adverse change. Explain whether either margin is a loss cap, why an expected stop can fail, and refuse a second product whose contract size is missing.",
      "rubric": "Requires 600 and 300 USD margin, 600 USD adverse change in either case; collateral not loss cap, gap/slippage and agreement caveat, precise missing-contract refusal. Review separately; any margin-as-cap claim requires revision.",
      "critical": true
    }
  ],
  "remediation": [
    {
      "competency": "S2_C5_1",
      "sectionId": "s2-5-section-1",
      "title": "Rebuild units before value",
      "paragraph": "Write lot × units/lot, then multiply by price with a unit cancellation. A familiar lot label supplies no missing contract. Keep the original response and submit this changed case as a new attempt for individual review. Select the fresh worked relationship, then demonstrate your full reasoning in the separately reviewed reassessment.",
      "reinforcement": {
        "id": "s2-5-reinforcement-1",
        "kind": "choice",
        "category": "KNOWLEDGE",
        "sectionId": "s2-5-section-1",
        "objectiveId": "s2-5-objective-1",
        "competency": "S2_C5_1",
        "prompt": "40,000GBP/lot ×0.15lot at1.25USD/GBP gives?",
        "options": [
          {
            "id": "r0",
            "label": "6,000USD exposure"
          },
          {
            "id": "r1",
            "label": "40,000GBP exposure"
          },
          {
            "id": "r2",
            "label": "6,000GBP and7,500USD notional"
          }
        ],
        "correct": "r2",
        "critical": true
      }
    },
    {
      "competency": "S2_C5_2",
      "sectionId": "s2-5-section-3",
      "title": "Keep exposure still",
      "paragraph": "Separate the notional card from the collateral card and apply the same adverse change to each comparison. Keep the original response and submit this changed case as a new attempt for individual review. Select the fresh worked relationship, then demonstrate your full reasoning in the separately reviewed reassessment.",
      "reinforcement": {
        "id": "s2-5-reinforcement-2",
        "kind": "choice",
        "category": "KNOWLEDGE",
        "sectionId": "s2-5-section-3",
        "objectiveId": "s2-5-objective-2",
        "competency": "S2_C5_2",
        "prompt": "18,000USD exposure, leverage30:1versus60:1;5% adverse linear move. Which?",
        "options": [
          {
            "id": "r0",
            "label": "600/300USD margin;900USD loss either before costs"
          },
          {
            "id": "r1",
            "label": "300/600USD margin; loss halved"
          },
          {
            "id": "r2",
            "label": "Loss capped at margin"
          }
        ],
        "correct": "r0",
        "critical": true
      }
    }
  ],
  "liveGuide": [
    {
      "title": "A lot needs a contract",
      "minutes": 10,
      "talkingPoints": [
        "Units describe a quantity of the specified product. A lot is a contractual grouping of units, not a universal amount. An FX lot specification cannot be silently reused for a metal CFD or another provider’s contract. Missing contract size is missing evidence.",
        "Show two cards called one lot: 100,000 currency units and five ounces. Ask which quantities can be compared without a price and which cannot.",
        "Use minutes 0–3 for explanation and the displayed example; minutes 3–6 for the demonstration: Teaching FX contract: one lot = 100,000 EUR. Therefore 0.02 lot = 2,000 EUR, not 2,000 USD.",
        "Use minutes 6–8 for an individual response before discussion. Contrast the proposed answer with this claim: A lot always means the same exposure.",
        "Use minutes 8–10 to compare reasoning and record a corrected explanation; do not count attendance as mastery."
      ],
      "activity": {
        "kind": "POLL",
        "prompt": "One fictional lot is 25,000 base units. How many base units are 0.4 lot? Give the reason before the instructor reveals the worked answer.",
        "sectionId": "s2-5-section-1"
      }
    },
    {
      "title": "Price connects quantity and value",
      "minutes": 10,
      "talkingPoints": [
        "Notional exposure is the value represented by the position under stated pricing assumptions. Multiplying base currency units by quote currency per base unit gives quote-currency notional. Label both quantities; this is not an account-currency risk calculation.",
        "Write units beneath every multiplication term and cancel EUR. Change the rate without changing quantity; have students explain why quote notional changes.",
        "Use minutes 0–3 for explanation and the displayed example; minutes 3–6 for the demonstration: 2,000 EUR × 1.1000 USD/EUR = 2,200 USD notional.",
        "Use minutes 6–8 for an individual response before discussion. Contrast the proposed answer with this claim: 2,000 base units and 2,000 quote units are interchangeable.",
        "Use minutes 8–10 to compare reasoning and record a corrected explanation; do not count attendance as mastery."
      ],
      "activity": {
        "kind": "WRITTEN",
        "prompt": "3,000 EUR at 1.0800 USD/EUR: what is quote-currency notional? Give the reason before the instructor reveals the worked answer.",
        "sectionId": "s2-5-section-2"
      }
    },
    {
      "title": "Collateral does not shrink exposure",
      "minutes": 10,
      "talkingPoints": [
        "Under a deliberately simplified fixed 20:1 initial leverage assumption, required margin is notional divided by 20. Actual provider requirements may involve tiers, currency conversion or changing rates. Initial collateral is a condition of holding exposure; it does not remove that exposure.",
        "Keep a 10,000 exposure card stationary. Replace a 500 collateral card with 200. Poll whether the exposure changed and require a reason before revealing the answer.",
        "Use minutes 0–3 for explanation and the displayed example; minutes 3–6 for the demonstration: 10,000 USD notional / 20 = 500 USD assumed initial margin; at 50:1 it is 200 USD.",
        "Use minutes 6–8 for an individual response before discussion. Contrast the proposed answer with this claim: Lower required margin means a smaller position.",
        "Use minutes 8–10 to compare reasoning and record a corrected explanation; do not count attendance as mastery."
      ],
      "activity": {
        "kind": "SINGLE",
        "prompt": "12,000 USD notional at assumed 30:1 initial leverage: calculate margin. Give the reason before the instructor reveals the worked answer.",
        "sectionId": "s2-5-section-3"
      }
    },
    {
      "title": "The same move affects the same exposure",
      "minutes": 10,
      "talkingPoints": [
        "With exposure held constant, increasing leverage reduces the assumed initial collateral, not the price movement’s consequence. For this toy linear exposure, a 2% adverse change on 10,000 USD represents about 200 USD before other effects. It consumes more of 200 collateral than of 500; that observation is not a risk budget.",
        "Have two volunteers hold equal exposure cards but different collateral cards. Remove an equal adverse-change card from each. Ask why the collateral percentage differs without calling either setup suitable.",
        "Use minutes 0–3 for explanation and the displayed example; minutes 3–6 for the demonstration: 10,000 × 0.02 = 200 USD adverse change at either initial-margin setting.",
        "Use minutes 6–8 for an individual response before discussion. Contrast the proposed answer with this claim: High leverage improves the economic outcome of the same move.",
        "Use minutes 8–10 to compare reasoning and record a corrected explanation; do not count attendance as mastery."
      ],
      "activity": {
        "kind": "POLL",
        "prompt": "Same 8,000 USD exposure under two collateral settings: a 3% adverse linear move changes value by what amount? Give the reason before the instructor reveals the worked answer.",
        "sectionId": "s2-5-section-4"
      }
    },
    {
      "title": "Margin calls are not protective promises",
      "minutes": 10,
      "talkingPoints": [
        "Providers may require more collateral or close positions when maintenance conditions fail. Timing, thresholds and liquidation procedures depend on the agreement and jurisdiction. A requested stop is not a guaranteed fill: gaps and thin conditions can produce worse execution, and protections must be verified rather than assumed.",
        "Draw an intended exit and a lower next available quote with empty space between them. Ask learners to name what is unknown, then read a fictional liquidation rule without simulating an order.",
        "Use minutes 0–3 for explanation and the displayed example; minutes 3–6 for the demonstration: A fictional gap takes a position past an expected exit level before an available price appears. Collateral posted at entry does not specify the final loss.",
        "Use minutes 6–8 for an individual response before discussion. Contrast the proposed answer with this claim: Margin or an ordinary stop caps every possible loss.",
        "Use minutes 8–10 to compare reasoning and record a corrected explanation; do not count attendance as mastery."
      ],
      "activity": {
        "kind": "WRITTEN",
        "prompt": "A ticket shows 300 USD margin but no verified loss protection. May the learner call 300 the maximum possible loss? Give the reason before the instructor reveals the worked answer.",
        "sectionId": "s2-5-section-5"
      }
    },
    {
      "title": "Refuse an incomplete product",
      "minutes": 10,
      "talkingPoints": [
        "A safe mechanics explanation can end with an unresolved question. Verify product type, contract size, price units, leverage/margin rules and account currency before computing. These classroom calculations do not establish personal affordability, permission to trade or an appropriate allocation.",
        "Hand groups an incomplete ticket. Reward a precise missing-information request, then reveal a changed contract and have them explain why their earlier refusal prevented an invalid calculation.",
        "Use minutes 0–3 for explanation and the displayed example; minutes 3–6 for the demonstration: A screen shows 0.5 lot and 100:1 but omits the contract and quote units. No reliable notional or margin calculation follows.",
        "Use minutes 6–8 for an individual response before discussion. Contrast the proposed answer with this claim: A leverage number is sufficient to assess a product.",
        "Use minutes 8–10 to compare reasoning and record a corrected explanation; do not count attendance as mastery."
      ],
      "activity": {
        "kind": "WRITTEN",
        "prompt": "A fictional metal ticket says 0.2 lot but supplies no ounces per lot. What should you do before valuing it? Give the reason before the instructor reveals the worked answer.",
        "sectionId": "s2-5-section-6"
      }
    }
  ],
  "studyGuide": {
    "summary": [
      "Write quantity in the contract’s own units before valuing it. Cross out units during multiplication so the resulting currency is explicit.",
      "Place exposure and initial collateral in separate columns. A smaller collateral requirement can coexist with exactly the same economic exposure.",
      "Liquidation and ordinary stops are governed by agreements and execution conditions. They do not turn initial collateral into a universal loss ceiling."
    ],
    "bigPicture": "Relate supplied units and lot specifications to notional exposure. Distinguish required margin from maximum possible loss and refuse missing specifications.",
    "fiveThings": [
      "10,000 base units",
      "3,240 USD",
      "400 USD",
      "240 USD under either setting",
      "No; collateral does not establish a loss cap"
    ],
    "outcomes": [
      "Relate supplied units and lot specifications to notional exposure.",
      "Distinguish required margin from maximum possible loss and refuse missing specifications."
    ],
    "examples": [
      "Contract 40,000 GBP/lot, quantity 0.15 lot, price 1.25 USD/GBP. Derive units and notional. Worked check: 6,000 GBP and 7,500 USD with unit cancellation.",
      "18,000 USD exposure at 30:1 versus 60:1; 5% adverse linear move. Compare margins and explain a missing loss cap. Worked check: 600 versus 300 USD collateral; 900 USD change in both; margin is not maximum loss."
    ],
    "misconceptions": [
      "A lot always means the same exposure.",
      "2,000 base units and 2,000 quote units are interchangeable.",
      "Lower required margin means a smaller position.",
      "High leverage improves the economic outcome of the same move.",
      "Margin or an ordinary stop caps every possible loss.",
      "A leverage number is sufficient to assess a product."
    ],
    "review": [
      {
        "sectionId": "s2-5-section-1",
        "label": "A lot needs a contract"
      },
      {
        "sectionId": "s2-5-section-2",
        "label": "Price connects quantity and value"
      },
      {
        "sectionId": "s2-5-section-3",
        "label": "Collateral does not shrink exposure"
      },
      {
        "sectionId": "s2-5-section-4",
        "label": "The same move affects the same exposure"
      },
      {
        "sectionId": "s2-5-section-5",
        "label": "Margin calls are not protective promises"
      },
      {
        "sectionId": "s2-5-section-6",
        "label": "Refuse an incomplete product"
      }
    ]
  },
  "chart": {
    "required": false,
    "tools": [],
    "stateFormat": "drawing-objects-v1",
    "context": [],
    "reviewStates": [],
    "history": "append-only"
  },
  "references": [
    {
      "title": "OANDA product disclosure statement: margin and product terms",
      "url": "https://legal.oanda.com/?code=product_disclosure_statement&language=en"
    }
  ],
  "design": {
    "format": "Fixed-exposure collateral comparison and missing-contract refusal",
    "homeworkTitle": "Contract and exposure ledger / Collateral comparison and refusal",
    "homeworkIntro": "Submit both tasks as durable written evidence. Each competency receives its own review; preserve original attempts and submit corrections as new evidence.",
    "pacing": {
      "minimum": 50,
      "maximum": 75
    },
    "assessmentCoverage": [
      "S2_C5_1",
      "S2_C5_2"
    ],
    "practicalRequirement": "Saved written calculations and explanations are required for each competency. No funded account, personal allocation, order submission or chart credit is required.",
    "studyGuideChecks": [
      "If two contracts both say one lot, what information establishes whether their quantities are comparable?",
      "Hold exposure fixed while halving collateral. Explain what changes and what does not change during the same adverse move.",
      "What agreement and execution information is missing from a claim that posted margin is the maximum loss?"
    ],
    "studyGuideVisual": {
      "kind": "decisions",
      "nodes": [
        {
          "label": "Contract quantity",
          "detail": "Lots × stated units/lot produces product units."
        },
        {
          "label": "Value exposure",
          "detail": "Product units × stated price produces quote-currency notional."
        },
        {
          "label": "Separate collateral",
          "detail": "Notional ÷ assumed leverage estimates initial margin only."
        },
        {
          "label": "State the limit",
          "detail": "Same exposure keeps the same adverse-move consequence; margin is not a loss ceiling."
        }
      ],
      "caption": "Review separates contract quantity, valued exposure and collateral; no personal risk allocation."
    }
  }
};
