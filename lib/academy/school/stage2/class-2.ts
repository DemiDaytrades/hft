import type {StageClass} from '../stage/contracts';
// Private academic definition: reviewed evidence criteria and exact source URLs.
export const CLASS_S2_2: StageClass = {
  "id": "stage-2-class-2",
  "version": "stage-2-class-2.1.0.0",
  "stageId": "stage-2",
  "number": 2,
  "title": "The FX Market, Participants and Trading Products",
  "description": "Trace participants and distinguish the product behind a currency display.",
  "courseId": "hft-school-foundations",
  "lessonId": "hft-school-s2-2",
  "prerequisites": [
    "stage-2-class-1"
  ],
  "liveMinutes": 60,
  "reviewMinutes": 30,
  "objectives": [
    {
      "id": "stage-2-class-2-objective-1",
      "text": "A network rather than one counter",
      "competency": "S2_C2_1"
    },
    {
      "id": "stage-2-class-2-objective-2",
      "text": "Purpose belongs to the participant",
      "competency": "S2_C2_2"
    },
    {
      "id": "stage-2-class-2-objective-3",
      "text": "Spot is an exchange arrangement",
      "competency": "S2_C2_3"
    },
    {
      "id": "stage-2-class-2-objective-4",
      "text": "Retail exposure needs its own terms",
      "competency": "S2_C2_4"
    },
    {
      "id": "stage-2-class-2-objective-5",
      "text": "Future exchange and two linked dates",
      "competency": "S2_C2_5"
    },
    {
      "id": "stage-2-class-2-objective-6",
      "text": "Futures and the product comparison record",
      "competency": "S2_C2_6"
    }
  ],
  "terms": [
    {
      "term": "A network rather than one counter",
      "definition": "The broad FX market connects banks, firms, asset managers, public institutions and other participants through several arrangements."
    },
    {
      "term": "Purpose belongs to the participant",
      "definition": "A participant may need currency for imports, receive it from exports, manage investments or seek exposure to price changes."
    },
    {
      "term": "Spot is an exchange arrangement",
      "definition": "A spot transaction agrees an exchange of currencies for near-term settlement under the pair and agreement conventions."
    },
    {
      "term": "Retail exposure needs its own terms",
      "definition": "Some retail offerings provide rolling currency exposure or contracts for differences rather than delivery of spending money."
    },
    {
      "term": "Future exchange and two linked dates",
      "definition": "An outright forward agrees an exchange for a future date at an agreed rate."
    },
    {
      "term": "Futures and the product comparison record",
      "definition": "Currency futures are standardized exchange-traded contracts with specified contract terms and clearing arrangements."
    }
  ],
  "sections": [
    {
      "id": "stage-2-class-2-section-1",
      "title": "A network rather than one counter",
      "objectiveId": "stage-2-class-2-objective-1",
      "competency": "S2_C2_1",
      "paragraphs": [
        "The broad FX market connects banks, firms, asset managers, public institutions and other participants through several arrangements. Much activity is over the counter: parties transact through dealer relationships and electronic networks rather than one universal central exchange.",
        "Exchange-traded currency futures also exist. A platform interface may provide access to a venue or dealer without being that venue or counterparty itself."
      ],
      "example": "An exporter requests a dealer quotation while a fund trades a currency futures contract on an exchange.",
      "misconception": "All forex trades pass through a single exchange.",
      "visual": "none",
      "activities": [
        {
          "id": "stage-2-class-2-check-1",
          "kind": "choice",
          "category": "REASONING",
          "sectionId": "stage-2-class-2-section-1",
          "objectiveId": "stage-2-class-2-objective-1",
          "competency": "S2_C2_1",
          "prompt": "Which explanation preserves the distinction in this chapter?",
          "critical": true,
          "options": [
            {
              "id": "stage-2-class-2-check-1-a",
              "label": "An exporter requests a dealer quotation while a fund trades a currency futures contract on an exchange."
            },
            {
              "id": "stage-2-class-2-check-1-b",
              "label": "All forex trades pass through a single exchange."
            }
          ],
          "correct": "stage-2-class-2-check-1-a"
        }
      ]
    },
    {
      "id": "stage-2-class-2-section-2",
      "title": "Purpose belongs to the participant",
      "objectiveId": "stage-2-class-2-objective-2",
      "competency": "S2_C2_2",
      "paragraphs": [
        "A participant may need currency for imports, receive it from exports, manage investments or seek exposure to price changes. Hedging aims to reduce a specified existing exposure; speculation deliberately takes exposure in pursuit of a favorable change.",
        "Intent cannot be read from a candle or participant label. The same institution can hedge one obligation and take a separate speculative position."
      ],
      "example": "A manufacturer locks an exchange rate for a known foreign invoice; a separate trader takes currency exposure without an invoice.",
      "misconception": "Every bank transaction is speculation and every business transaction is a hedge.",
      "visual": "none",
      "activities": [
        {
          "id": "stage-2-class-2-check-2",
          "kind": "choice",
          "category": "REASONING",
          "sectionId": "stage-2-class-2-section-2",
          "objectiveId": "stage-2-class-2-objective-2",
          "competency": "S2_C2_2",
          "prompt": "Which explanation preserves the distinction in this chapter?",
          "critical": true,
          "options": [
            {
              "id": "stage-2-class-2-check-2-a",
              "label": "A manufacturer locks an exchange rate for a known foreign invoice; a separate trader takes currency exposure without an invoice."
            },
            {
              "id": "stage-2-class-2-check-2-b",
              "label": "Every bank transaction is speculation and every business transaction is a hedge."
            }
          ],
          "correct": "stage-2-class-2-check-2-a"
        }
      ]
    },
    {
      "id": "stage-2-class-2-section-3",
      "title": "Spot is an exchange arrangement",
      "objectiveId": "stage-2-class-2-objective-3",
      "competency": "S2_C2_3",
      "paragraphs": [
        "A spot transaction agrees an exchange of currencies for near-term settlement under the pair and agreement conventions. The deal date and the settlement date are distinct. Spot does not necessarily mean handing over banknotes immediately.",
        "Do not impose one settlement timetable on every currency pair, holiday calendar or product marketed as forex. Obtain the actual terms."
      ],
      "example": "A business agrees an exchange today with delivery on a specified later business date under its contract.",
      "misconception": "Anything labeled spot settles instantly or is the same as a rolling retail position.",
      "visual": "none",
      "activities": [
        {
          "id": "stage-2-class-2-check-3",
          "kind": "choice",
          "category": "REASONING",
          "sectionId": "stage-2-class-2-section-3",
          "objectiveId": "stage-2-class-2-objective-3",
          "competency": "S2_C2_3",
          "prompt": "Which explanation preserves the distinction in this chapter?",
          "critical": true,
          "options": [
            {
              "id": "stage-2-class-2-check-3-a",
              "label": "A business agrees an exchange today with delivery on a specified later business date under its contract."
            },
            {
              "id": "stage-2-class-2-check-3-b",
              "label": "Anything labeled spot settles instantly or is the same as a rolling retail position."
            }
          ],
          "correct": "stage-2-class-2-check-3-a"
        }
      ]
    },
    {
      "id": "stage-2-class-2-section-4",
      "title": "Retail exposure needs its own terms",
      "objectiveId": "stage-2-class-2-objective-4",
      "competency": "S2_C2_4",
      "paragraphs": [
        "Some retail offerings provide rolling currency exposure or contracts for differences rather than delivery of spending money. Depending on jurisdiction and contract, the provider may be the customer’s counterparty. Position maintenance, financing and close-out follow specific terms.",
        "This overview does not claim all retail products have identical legal form or protections. Demo balances and simulated fills are not evidence of live safeguards or available execution."
      ],
      "example": "Fictional Provider A offers a rolling price-difference contract, expressly with no currency delivery. It cannot pay a foreign supplier merely because its chart rises.",
      "misconception": "A profitable retail currency chart supplies the currency needed for an invoice.",
      "visual": "none",
      "activities": [
        {
          "id": "stage-2-class-2-check-4",
          "kind": "choice",
          "category": "REASONING",
          "sectionId": "stage-2-class-2-section-4",
          "objectiveId": "stage-2-class-2-objective-4",
          "competency": "S2_C2_4",
          "prompt": "Which explanation preserves the distinction in this chapter?",
          "critical": true,
          "options": [
            {
              "id": "stage-2-class-2-check-4-a",
              "label": "Fictional Provider A offers a rolling price-difference contract, expressly with no currency delivery. It cannot pay a foreign supplier merely because its chart rises."
            },
            {
              "id": "stage-2-class-2-check-4-b",
              "label": "A profitable retail currency chart supplies the currency needed for an invoice."
            }
          ],
          "correct": "stage-2-class-2-check-4-a"
        }
      ]
    },
    {
      "id": "stage-2-class-2-section-5",
      "title": "Future exchange and two linked dates",
      "objectiveId": "stage-2-class-2-objective-5",
      "competency": "S2_C2_5",
      "paragraphs": [
        "An outright forward agrees an exchange for a future date at an agreed rate. An FX swap combines exchanges in opposite directions on different dates. These labels describe commitments; they do not establish a guaranteed profit or a forecast.",
        "An FX swap is not interchangeable with every instrument called a currency swap. Contract definitions and amounts matter; derivative pricing and arbitrage are deferred."
      ],
      "example": "A firm arranges a future EUR payment using a forward. A bank exchanges currencies now and reverses the exchange later through an FX swap.",
      "misconception": "A forward rate guarantees where the future spot rate will be.",
      "visual": "none",
      "activities": [
        {
          "id": "stage-2-class-2-check-5",
          "kind": "choice",
          "category": "REASONING",
          "sectionId": "stage-2-class-2-section-5",
          "objectiveId": "stage-2-class-2-objective-5",
          "competency": "S2_C2_5",
          "prompt": "Which explanation preserves the distinction in this chapter?",
          "critical": true,
          "options": [
            {
              "id": "stage-2-class-2-check-5-a",
              "label": "A firm arranges a future EUR payment using a forward. A bank exchanges currencies now and reverses the exchange later through an FX swap."
            },
            {
              "id": "stage-2-class-2-check-5-b",
              "label": "A forward rate guarantees where the future spot rate will be."
            }
          ],
          "correct": "stage-2-class-2-check-5-a"
        }
      ]
    },
    {
      "id": "stage-2-class-2-section-6",
      "title": "Futures and the product comparison record",
      "objectiveId": "stage-2-class-2-objective-6",
      "competency": "S2_C2_6",
      "paragraphs": [
        "Currency futures are standardized exchange-traded contracts with specified contract terms and clearing arrangements. Their quote conventions and contract sizes must be read directly; a familiar currency name does not make them identical to a dealer’s OTC spot quotation.",
        "At overview level, compare purpose, delivery or settlement, counterparty route, dates and missing terms. Do not use this comparison as detailed broker selection, margin instruction or a liquidity inference system."
      ],
      "example": "Two fictional displays both show euro exposure but one names a futures contract month and the other a rolling dealer contract.",
      "misconception": "Same pair label means same product, feed and obligation.",
      "visual": "none",
      "activities": [
        {
          "id": "stage-2-class-2-check-6",
          "kind": "choice",
          "category": "REASONING",
          "sectionId": "stage-2-class-2-section-6",
          "objectiveId": "stage-2-class-2-objective-6",
          "competency": "S2_C2_6",
          "prompt": "Which explanation preserves the distinction in this chapter?",
          "critical": true,
          "options": [
            {
              "id": "stage-2-class-2-check-6-a",
              "label": "Two fictional displays both show euro exposure but one names a futures contract month and the other a rolling dealer contract."
            },
            {
              "id": "stage-2-class-2-check-6-b",
              "label": "Same pair label means same product, feed and obligation."
            }
          ],
          "correct": "stage-2-class-2-check-6-a"
        }
      ]
    }
  ],
  "assessment": [
    {
      "id": "stage-2-class-2-assessment-1",
      "kind": "written",
      "category": "APPLICATION",
      "sectionId": "stage-2-class-2-section-1",
      "objectiveId": "stage-2-class-2-objective-1",
      "competency": "S2_C2_1",
      "prompt": "Draw distinct routes for an exporter asking a bank for exchange and a futures customer using an exchange arrangement.",
      "rubric": "Require separate customer/dealer OTC route and exchange route; platform must not silently become universal exchange. Label missing execution/clearing details unknown.",
      "critical": true
    },
    {
      "id": "stage-2-class-2-assessment-2",
      "kind": "written",
      "category": "APPLICATION",
      "sectionId": "stage-2-class-2-section-2",
      "objectiveId": "stage-2-class-2-objective-2",
      "competency": "S2_C2_2",
      "prompt": "Compare a foreign-tuition payer, an exporter with a fixed receipt and a trader seeking currency gains. Identify purposes and one uncertainty.",
      "rubric": "Require payment need, receipt exposure and speculative intent respectively; hedging requires stated exposure and action, not occupation alone.",
      "critical": true
    },
    {
      "id": "stage-2-class-2-assessment-3",
      "kind": "written",
      "category": "APPLICATION",
      "sectionId": "stage-2-class-2-section-3",
      "objectiveId": "stage-2-class-2-objective-3",
      "competency": "S2_C2_3",
      "prompt": "A fictional term sheet specifies currency delivery on a stated value date. Explain why this differs from a price-exposure contract without currency delivery.",
      "rubric": "Require obligation to exchange amounts and specified settlement versus exposure-only terms; state that marketing label or chart alone is insufficient.",
      "critical": true
    },
    {
      "id": "stage-2-class-2-assessment-4",
      "kind": "written",
      "category": "APPLICATION",
      "sectionId": "stage-2-class-2-section-4",
      "objectiveId": "stage-2-class-2-objective-4",
      "competency": "S2_C2_4",
      "prompt": "Annotate Provider A’s no-delivery rolling contract: purpose, counterparty, holding terms and two missing terms needed before understanding it.",
      "rubric": "Require price exposure rather than invoice delivery; named fictional provider counterparty; request financing/close-out or pricing terms where absent. No provider recommendation or live funding.",
      "critical": true
    },
    {
      "id": "stage-2-class-2-assessment-5",
      "kind": "written",
      "category": "APPLICATION",
      "sectionId": "stage-2-class-2-section-5",
      "objectiveId": "stage-2-class-2-objective-5",
      "competency": "S2_C2_5",
      "prompt": "Compare one future exchange with a near-date exchange plus a reverse far-date exchange; identify forward versus FX swap and what neither predicts.",
      "rubric": "Require one-date outright forward versus two linked opposite exchanges for FX swap; reject guaranteed future spot or profit inference.",
      "critical": true
    },
    {
      "id": "stage-2-class-2-assessment-6",
      "kind": "written",
      "category": "APPLICATION",
      "sectionId": "stage-2-class-2-section-6",
      "objectiveId": "stage-2-class-2-objective-6",
      "competency": "S2_C2_6",
      "prompt": "Submit an annotated fictional comparison of spot delivery, rolling retail exposure, forward, FX swap and listed futures, including purposes and explicit unknowns.",
      "rubric": "Individually require all five distinctions, route and timing, delivery/settlement uncertainties and at least two specific missing terms. Require no invented protection or universal dealer behavior.",
      "critical": true
    },
    {
      "category": "APPLICATION",
      "sectionId": "stage-2-class-2-section-1",
      "objectiveId": "stage-2-class-2-objective-1",
      "competency": "S2_C2_1",
      "id": "stage-2-class-2-assessment-objective-1",
      "kind": "choice",
      "critical": true,
      "prompt": "Fictional Orchid promises one exchange of currency amounts on a future date at a rate agreed today. Which overview fits?",
      "options": [
        {
          "id": "stage-2-class-2-assessment-objective-1-sound",
          "label": "Outright forward"
        },
        {
          "id": "stage-2-class-2-assessment-objective-1-error",
          "label": "Guaranteed forecast of future spot"
        }
      ],
      "correct": "stage-2-class-2-assessment-objective-1-sound"
    },
    {
      "category": "APPLICATION",
      "sectionId": "stage-2-class-2-section-2",
      "objectiveId": "stage-2-class-2-objective-2",
      "competency": "S2_C2_2",
      "id": "stage-2-class-2-assessment-objective-2",
      "kind": "choice",
      "critical": true,
      "prompt": "Fictional Meadow quotes a no-delivery rolling contract through its own dealer relationship. What can its chart alone establish?",
      "options": [
        {
          "id": "stage-2-class-2-assessment-objective-2-sound",
          "label": "Neither physical currency delivery nor a universal exchange route"
        },
        {
          "id": "stage-2-class-2-assessment-objective-2-error",
          "label": "Every participant trades through the same central exchange"
        }
      ],
      "correct": "stage-2-class-2-assessment-objective-2-sound"
    }
  ],
  "homework": [
    {
      "id": "stage-2-class-2-homework-1",
      "kind": "written",
      "category": "HOMEWORK",
      "sectionId": "stage-2-class-2-section-1",
      "objectiveId": "stage-2-class-2-objective-1",
      "competency": "S2_C2_1",
      "prompt": "Draw two fictional customer routes: direct dealer exchange and exchange-traded currency futures. Identify which organization provides the interface versus the contract route. Save individual labeled working; this is fictional paper work with no real-money requirement.",
      "rubric": "Require separate OTC/dealer and exchange routes; interface not equated with universal exchange. Individually review saved evidence; preserve original attempts and return failed skill for fresh targeted reassessment.",
      "critical": true
    },
    {
      "id": "stage-2-class-2-homework-2",
      "kind": "written",
      "category": "HOMEWORK",
      "sectionId": "stage-2-class-2-section-2",
      "objectiveId": "stage-2-class-2-objective-2",
      "competency": "S2_C2_2",
      "prompt": "A university pays foreign fees; a fund reduces currency exposure from foreign assets; a person deliberately seeks currency gains. Compare purposes without inferring them from chart shapes. Save individual labeled working; this is fictional paper work with no real-money requirement.",
      "rubric": "Require payment, specified-exposure hedge and speculation; name evidence of intent needed. Individually review saved evidence; preserve original attempts and return failed skill for fresh targeted reassessment.",
      "critical": true
    },
    {
      "id": "stage-2-class-2-homework-3",
      "kind": "written",
      "category": "HOMEWORK",
      "sectionId": "stage-2-class-2-section-3",
      "objectiveId": "stage-2-class-2-objective-3",
      "competency": "S2_C2_3",
      "prompt": "Fictional Cedar Bank agrees today to deliver CAD 2,000 on a specified value date. Annotate agreement, delivery and what else the terms must identify. Save individual labeled working; this is fictional paper work with no real-money requirement.",
      "rubric": "Require deliverable amounts and distinct agreement/value dates; identify rate, counterpart currencies or calendar uncertainties. Individually review saved evidence; preserve original attempts and return failed skill for fresh targeted reassessment.",
      "critical": true
    },
    {
      "id": "stage-2-class-2-homework-4",
      "kind": "written",
      "category": "HOMEWORK",
      "sectionId": "stage-2-class-2-section-4",
      "objectiveId": "stage-2-class-2-objective-4",
      "competency": "S2_C2_4",
      "prompt": "Fictional Slate offers rolling EUR/USD price exposure without currency delivery; financing and close-out terms are absent. Annotate what it can and cannot do for an importer. Save individual labeled working; this is fictional paper work with no real-money requirement.",
      "rubric": "Require no invoice currency delivery, provider relationship questions, financing and close-out unknowns; no invented protections. Individually review saved evidence; preserve original attempts and return failed skill for fresh targeted reassessment.",
      "critical": true
    },
    {
      "id": "stage-2-class-2-homework-5",
      "kind": "written",
      "category": "HOMEWORK",
      "sectionId": "stage-2-class-2-section-5",
      "objectiveId": "stage-2-class-2-objective-5",
      "competency": "S2_C2_5",
      "prompt": "Compare a single future USD-for-CHF exchange with two linked opposite exchanges on different dates. Draw both date structures and reject a future-spot guarantee. Save individual labeled working; this is fictional paper work with no real-money requirement.",
      "rubric": "Require forward versus FX swap and one versus two exchange structures; agreed price not a forecast guarantee. Individually review saved evidence; preserve original attempts and return failed skill for fresh targeted reassessment.",
      "critical": true
    },
    {
      "id": "stage-2-class-2-homework-6",
      "kind": "written",
      "category": "HOMEWORK",
      "sectionId": "stage-2-class-2-section-6",
      "objectiveId": "stage-2-class-2-objective-6",
      "competency": "S2_C2_6",
      "prompt": "Build a five-row fictional product/purpose matrix: spot, rolling retail exposure, outright forward, FX swap, listed futures. Include route, dates, delivery/settlement and explicit unknowns. Save individual labeled working; this is fictional paper work with no real-money requirement.",
      "rubric": "Individually require all five, meaningful purpose and contractual distinctions, at least two missing terms and qualified route/counterparty conclusions. Individually review saved evidence; preserve original attempts and return failed skill for fresh targeted reassessment.",
      "critical": true
    }
  ],
  "remediation": [
    {
      "competency": "S2_C2_1",
      "sectionId": "stage-2-class-2-section-1",
      "title": "Repair: A network rather than one counter",
      "paragraph": "Diagnose the failed distinction: All forex trades pass through a single exchange. Use a labeled diagram or ledger to expose it. Retain the original attempt, teach only the failed skill, then assess the changed case below; completion alone is not mastery.",
      "reinforcement": {
        "id": "stage-2-class-2-reassess-1",
        "kind": "choice",
        "category": "APPLICATION",
        "sectionId": "stage-2-class-2-section-1",
        "objectiveId": "stage-2-class-2-objective-1",
        "competency": "S2_C2_1",
        "prompt": "A charity uses bank exchange while a fund uses listed futures. Mark which route is not evidence of a universal FX exchange. Which worked explanation repairs the failed distinction?",
        "rubric": "Require charity customer-to-bank OTC route distinguished from listed futures route; neither proves all FX passes through one exchange. Individually inspect fresh saved reasoning; preserve original and reassessment attempts, and return the failed skill if still unproven. Deterministic answer identifies the repair; the existing written assessment retake must separately demonstrate reasoning transfer.",
        "critical": true,
        "options": [
          {
            "id": "stage-2-class-2-reassess-1-repair",
            "label": "charity customer-to-bank OTC route distinguished from listed futures route; neither proves all FX passes through one exchange."
          },
          {
            "id": "stage-2-class-2-reassess-1-error",
            "label": "All FX must pass through the charity’s bank as a universal exchange."
          }
        ],
        "correct": "stage-2-class-2-reassess-1-repair"
      }
    },
    {
      "competency": "S2_C2_2",
      "sectionId": "stage-2-class-2-section-2",
      "title": "Repair: Purpose belongs to the participant",
      "paragraph": "Diagnose the failed distinction: Every bank transaction is speculation and every business transaction is a hedge. Use a labeled diagram or ledger to expose it. Retain the original attempt, teach only the failed skill, then assess the changed case below; completion alone is not mastery.",
      "reinforcement": {
        "id": "stage-2-class-2-reassess-2",
        "kind": "choice",
        "category": "APPLICATION",
        "sectionId": "stage-2-class-2-section-2",
        "objectiveId": "stage-2-class-2-objective-2",
        "competency": "S2_C2_2",
        "prompt": "A pension fund has foreign assets; distinguish currency-risk reduction from increasing currency exposure in an unrelated position. Which worked explanation repairs the failed distinction?",
        "rubric": "Require hedge linked to existing foreign-asset currency exposure, contrasted with deliberately added unrelated exposure; name missing intention/position evidence. Individually inspect fresh saved reasoning; preserve original and reassessment attempts, and return the failed skill if still unproven. Deterministic answer identifies the repair; the existing written assessment retake must separately demonstrate reasoning transfer.",
        "critical": true,
        "options": [
          {
            "id": "stage-2-class-2-reassess-2-repair",
            "label": "hedge linked to existing foreign-asset currency exposure, contrasted with deliberately added unrelated exposure; name missing intention/position evidence."
          },
          {
            "id": "stage-2-class-2-reassess-2-error",
            "label": "Every position held by a pension fund is necessarily a hedge."
          }
        ],
        "correct": "stage-2-class-2-reassess-2-repair"
      }
    },
    {
      "competency": "S2_C2_3",
      "sectionId": "stage-2-class-2-section-3",
      "title": "Repair: Spot is an exchange arrangement",
      "paragraph": "Diagnose the failed distinction: Anything labeled spot settles instantly or is the same as a rolling retail position. Use a labeled diagram or ledger to expose it. Retain the original attempt, teach only the failed skill, then assess the changed case below; completion alone is not mastery.",
      "reinforcement": {
        "id": "stage-2-class-2-reassess-3",
        "kind": "choice",
        "category": "APPLICATION",
        "sectionId": "stage-2-class-2-section-3",
        "objectiveId": "stage-2-class-2-objective-3",
        "competency": "S2_C2_3",
        "prompt": "A travel cash exchange and a business spot agreement have different delivery arrangements. Name the term that resolves each. Which worked explanation repairs the failed distinction?",
        "rubric": "Require actual delivery/settlement date and terms in each agreement, rather than asserting universal instant or two-day settlement. Individually inspect fresh saved reasoning; preserve original and reassessment attempts, and return the failed skill if still unproven. Deterministic answer identifies the repair; the existing written assessment retake must separately demonstrate reasoning transfer.",
        "critical": true,
        "options": [
          {
            "id": "stage-2-class-2-reassess-3-repair",
            "label": "actual delivery/settlement date and terms in each agreement, rather than asserting universal instant or two-day settlement."
          },
          {
            "id": "stage-2-class-2-reassess-3-error",
            "label": "Every spot arrangement has immediate physical cash delivery."
          }
        ],
        "correct": "stage-2-class-2-reassess-3-repair"
      }
    },
    {
      "competency": "S2_C2_4",
      "sectionId": "stage-2-class-2-section-4",
      "title": "Repair: Retail exposure needs its own terms",
      "paragraph": "Diagnose the failed distinction: A profitable retail currency chart supplies the currency needed for an invoice. Use a labeled diagram or ledger to expose it. Retain the original attempt, teach only the failed skill, then assess the changed case below; completion alone is not mastery.",
      "reinforcement": {
        "id": "stage-2-class-2-reassess-4",
        "kind": "choice",
        "category": "APPLICATION",
        "sectionId": "stage-2-class-2-section-4",
        "objectiveId": "stage-2-class-2-objective-4",
        "competency": "S2_C2_4",
        "prompt": "Provider B says forex exposure but omits delivery and counterparty clauses. List questions rather than classifying it from the logo. Which worked explanation repairs the failed distinction?",
        "rubric": "Require explicit questions about deliverability, legal counterparty, financing and close-out; no classification from forex branding alone. Individually inspect fresh saved reasoning; preserve original and reassessment attempts, and return the failed skill if still unproven. Deterministic answer identifies the repair; the existing written assessment retake must separately demonstrate reasoning transfer.",
        "critical": true,
        "options": [
          {
            "id": "stage-2-class-2-reassess-4-repair",
            "label": "explicit questions about deliverability, legal counterparty, financing and close-out; no classification from forex branding alone."
          },
          {
            "id": "stage-2-class-2-reassess-4-error",
            "label": "The forex logo proves delivery, counterparty protections and financing terms."
          }
        ],
        "correct": "stage-2-class-2-reassess-4-repair"
      }
    },
    {
      "competency": "S2_C2_5",
      "sectionId": "stage-2-class-2-section-5",
      "title": "Repair: Future exchange and two linked dates",
      "paragraph": "Diagnose the failed distinction: A forward rate guarantees where the future spot rate will be. Use a labeled diagram or ledger to expose it. Retain the original attempt, teach only the failed skill, then assess the changed case below; completion alone is not mastery.",
      "reinforcement": {
        "id": "stage-2-class-2-reassess-5",
        "kind": "choice",
        "category": "APPLICATION",
        "sectionId": "stage-2-class-2-section-5",
        "objectiveId": "stage-2-class-2-objective-5",
        "competency": "S2_C2_5",
        "prompt": "A fictional agreement has two opposite currency exchanges next week and next month. Explain why it is not merely a single outright forward. Which worked explanation repairs the failed distinction?",
        "rubric": "Require two linked opposite exchanges at distinct dates, hence FX swap rather than single outright forward; no price prediction. Individually inspect fresh saved reasoning; preserve original and reassessment attempts, and return the failed skill if still unproven. Deterministic answer identifies the repair; the existing written assessment retake must separately demonstrate reasoning transfer.",
        "critical": true,
        "options": [
          {
            "id": "stage-2-class-2-reassess-5-repair",
            "label": "two linked opposite exchanges at distinct dates, hence FX swap rather than single outright forward; no price prediction."
          },
          {
            "id": "stage-2-class-2-reassess-5-error",
            "label": "Two opposite exchanges on separate dates are one single outright forward."
          }
        ],
        "correct": "stage-2-class-2-reassess-5-repair"
      }
    },
    {
      "competency": "S2_C2_6",
      "sectionId": "stage-2-class-2-section-6",
      "title": "Repair: Futures and the product comparison record",
      "paragraph": "Diagnose the failed distinction: Same pair label means same product, feed and obligation. Use a labeled diagram or ledger to expose it. Retain the original attempt, teach only the failed skill, then assess the changed case below; completion alone is not mastery.",
      "reinforcement": {
        "id": "stage-2-class-2-reassess-6",
        "kind": "choice",
        "category": "APPLICATION",
        "sectionId": "stage-2-class-2-section-6",
        "objectiveId": "stage-2-class-2-objective-6",
        "competency": "S2_C2_6",
        "prompt": "A new sheet names exchange and expiry but omits settlement method. Classify provisionally, explain uncertainty and request contract specification. Which worked explanation repairs the failed distinction?",
        "rubric": "Require provisional exchange-traded futures classification based on exchange/expiry, request settlement specification and avoid claiming known physical delivery. Individually inspect fresh saved reasoning; preserve original and reassessment attempts, and return the failed skill if still unproven. Deterministic answer identifies the repair; the existing written assessment retake must separately demonstrate reasoning transfer.",
        "critical": true,
        "options": [
          {
            "id": "stage-2-class-2-reassess-6-repair",
            "label": "provisional exchange-traded futures classification based on exchange/expiry, request settlement specification and avoid claiming known physical delivery."
          },
          {
            "id": "stage-2-class-2-reassess-6-error",
            "label": "Expiry guarantees physical delivery without inspecting settlement terms."
          }
        ],
        "correct": "stage-2-class-2-reassess-6-repair"
      }
    }
  ],
  "liveGuide": [
    {
      "title": "A network rather than one counter",
      "minutes": 10,
      "talkingPoints": [
        "0–2 min: ask learners to retrieve the prerequisite distinction needed for a network rather than one counter. Collect individual responses before discussion.",
        "2–5 min demonstration: Place a platform icon between customer and provider; ask what legal relationship the icon alone proves.",
        "5–7 min: show An exporter requests a dealer quotation while a fund trades a currency futures contract on an exchange. Ask one learner to explain and another to challenge the stated assumption.",
        "7–9 min: address the specific misconception “All forex trades pass through a single exchange.” with a counterexample, then change one number or term and ask everyone to predict.",
        "9–10 min: save each learner’s response; flag individual follow-up rather than treating group agreement as evidence."
      ],
      "activity": {
        "kind": "WRITTEN",
        "prompt": "Draw distinct routes for an exporter asking a bank for exchange and a futures customer using an exchange arrangement.",
        "sectionId": "stage-2-class-2-section-1"
      }
    },
    {
      "title": "Purpose belongs to the participant",
      "minutes": 10,
      "talkingPoints": [
        "0–2 min: ask learners to retrieve the prerequisite distinction needed for purpose belongs to the participant. Collect individual responses before discussion.",
        "2–5 min demonstration: Role-play an exporter receiving USD and a customer buying USD; ask why they can rationally want opposite exchanges.",
        "5–7 min: show A manufacturer locks an exchange rate for a known foreign invoice; a separate trader takes currency exposure without an invoice. Ask one learner to explain and another to challenge the stated assumption.",
        "7–9 min: address the specific misconception “Every bank transaction is speculation and every business transaction is a hedge.” with a counterexample, then change one number or term and ask everyone to predict.",
        "9–10 min: save each learner’s response; flag individual follow-up rather than treating group agreement as evidence."
      ],
      "activity": {
        "kind": "SINGLE",
        "prompt": "Compare a foreign-tuition payer, an exporter with a fixed receipt and a trader seeking currency gains. Identify purposes and one uncertainty.",
        "sectionId": "stage-2-class-2-section-2"
      }
    },
    {
      "title": "Spot is an exchange arrangement",
      "minutes": 10,
      "talkingPoints": [
        "0–2 min: ask learners to retrieve the prerequisite distinction needed for spot is an exchange arrangement. Collect individual responses before discussion.",
        "2–5 min demonstration: Separate the agreement clock from the delivery clock; move the delivery marker without moving the deal date.",
        "5–7 min: show A business agrees an exchange today with delivery on a specified later business date under its contract. Ask one learner to explain and another to challenge the stated assumption.",
        "7–9 min: address the specific misconception “Anything labeled spot settles instantly or is the same as a rolling retail position.” with a counterexample, then change one number or term and ask everyone to predict.",
        "9–10 min: save each learner’s response; flag individual follow-up rather than treating group agreement as evidence."
      ],
      "activity": {
        "kind": "POLL",
        "prompt": "A fictional term sheet specifies currency delivery on a stated value date. Explain why this differs from a price-exposure contract without currency delivery.",
        "sectionId": "stage-2-class-2-section-3"
      }
    },
    {
      "title": "Retail exposure needs its own terms",
      "minutes": 10,
      "talkingPoints": [
        "0–2 min: ask learners to retrieve the prerequisite distinction needed for retail exposure needs its own terms. Collect individual responses before discussion.",
        "2–5 min demonstration: Cover the product title and compare delivery, financing and counterparty clauses before guessing its category.",
        "5–7 min: show Fictional Provider A offers a rolling price-difference contract, expressly with no currency delivery. It cannot pay a foreign supplier merely because its chart rises. Ask one learner to explain and another to challenge the stated assumption.",
        "7–9 min: address the specific misconception “A profitable retail currency chart supplies the currency needed for an invoice.” with a counterexample, then change one number or term and ask everyone to predict.",
        "9–10 min: save each learner’s response; flag individual follow-up rather than treating group agreement as evidence."
      ],
      "activity": {
        "kind": "WRITTEN",
        "prompt": "Annotate Provider A’s no-delivery rolling contract: purpose, counterparty, holding terms and two missing terms needed before understanding it.",
        "sectionId": "stage-2-class-2-section-4"
      }
    },
    {
      "title": "Future exchange and two linked dates",
      "minutes": 10,
      "talkingPoints": [
        "0–2 min: ask learners to retrieve the prerequisite distinction needed for future exchange and two linked dates. Collect individual responses before discussion.",
        "2–5 min demonstration: Use two date cards and opposite arrows; remove the first exchange and ask which product description remains.",
        "5–7 min: show A firm arranges a future EUR payment using a forward. A bank exchanges currencies now and reverses the exchange later through an FX swap. Ask one learner to explain and another to challenge the stated assumption.",
        "7–9 min: address the specific misconception “A forward rate guarantees where the future spot rate will be.” with a counterexample, then change one number or term and ask everyone to predict.",
        "9–10 min: save each learner’s response; flag individual follow-up rather than treating group agreement as evidence."
      ],
      "activity": {
        "kind": "SINGLE",
        "prompt": "Compare one future exchange with a near-date exchange plus a reverse far-date exchange; identify forward versus FX swap and what neither predicts.",
        "sectionId": "stage-2-class-2-section-5"
      }
    },
    {
      "title": "Futures and the product comparison record",
      "minutes": 10,
      "talkingPoints": [
        "0–2 min: ask learners to retrieve the prerequisite distinction needed for futures and the product comparison record. Collect individual responses before discussion.",
        "2–5 min demonstration: Put the same currency label on five envelopes; reveal terms one by one and revise the initial classification.",
        "5–7 min: show Two fictional displays both show euro exposure but one names a futures contract month and the other a rolling dealer contract. Ask one learner to explain and another to challenge the stated assumption.",
        "7–9 min: address the specific misconception “Same pair label means same product, feed and obligation.” with a counterexample, then change one number or term and ask everyone to predict.",
        "9–10 min: save each learner’s response; flag individual follow-up rather than treating group agreement as evidence."
      ],
      "activity": {
        "kind": "POLL",
        "prompt": "Submit an annotated fictional comparison of spot delivery, rolling retail exposure, forward, FX swap and listed futures, including purposes and explicit unknowns.",
        "sectionId": "stage-2-class-2-section-6"
      }
    }
  ],
  "studyGuide": {
    "summary": [
      "A network rather than one counter: An exporter requests a dealer quotation while a fund trades a currency futures contract on an exchange.",
      "Purpose belongs to the participant: A manufacturer locks an exchange rate for a known foreign invoice; a separate trader takes currency exposure without an invoice.",
      "Spot is an exchange arrangement: A business agrees an exchange today with delivery on a specified later business date under its contract.",
      "Retail exposure needs its own terms: Fictional Provider A offers a rolling price-difference contract, expressly with no currency delivery. It cannot pay a foreign supplier merely because its chart rises.",
      "Future exchange and two linked dates: A firm arranges a future EUR payment using a forward. A bank exchanges currencies now and reverses the exchange later through an FX swap.",
      "Futures and the product comparison record: Two fictional displays both show euro exposure but one names a futures contract month and the other a rolling dealer contract."
    ],
    "bigPicture": "Read the obligations behind the interface before naming the market route.",
    "fiveThings": [
      "A network rather than one counter",
      "Purpose belongs to the participant",
      "Spot is an exchange arrangement",
      "Retail exposure needs its own terms",
      "Future exchange and two linked dates"
    ],
    "outcomes": [
      "A network rather than one counter",
      "Purpose belongs to the participant",
      "Spot is an exchange arrangement",
      "Retail exposure needs its own terms",
      "Future exchange and two linked dates",
      "Futures and the product comparison record"
    ],
    "examples": [
      "An exporter requests a dealer quotation while a fund trades a currency futures contract on an exchange.",
      "A manufacturer locks an exchange rate for a known foreign invoice; a separate trader takes currency exposure without an invoice.",
      "A business agrees an exchange today with delivery on a specified later business date under its contract.",
      "Fictional Provider A offers a rolling price-difference contract, expressly with no currency delivery. It cannot pay a foreign supplier merely because its chart rises.",
      "A firm arranges a future EUR payment using a forward. A bank exchanges currencies now and reverses the exchange later through an FX swap.",
      "Two fictional displays both show euro exposure but one names a futures contract month and the other a rolling dealer contract."
    ],
    "misconceptions": [
      "All forex trades pass through a single exchange.",
      "Every bank transaction is speculation and every business transaction is a hedge.",
      "Anything labeled spot settles instantly or is the same as a rolling retail position.",
      "A profitable retail currency chart supplies the currency needed for an invoice.",
      "A forward rate guarantees where the future spot rate will be.",
      "Same pair label means same product, feed and obligation."
    ],
    "review": [
      {
        "sectionId": "stage-2-class-2-section-1",
        "label": "Reconstruct: A network rather than one counter"
      },
      {
        "sectionId": "stage-2-class-2-section-2",
        "label": "Reconstruct: Purpose belongs to the participant"
      },
      {
        "sectionId": "stage-2-class-2-section-3",
        "label": "Reconstruct: Spot is an exchange arrangement"
      },
      {
        "sectionId": "stage-2-class-2-section-4",
        "label": "Reconstruct: Retail exposure needs its own terms"
      },
      {
        "sectionId": "stage-2-class-2-section-5",
        "label": "Reconstruct: Future exchange and two linked dates"
      },
      {
        "sectionId": "stage-2-class-2-section-6",
        "label": "Reconstruct: Futures and the product comparison record"
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
      "title": "BIS: Forwards and swaps glossary",
      "url": "https://data.bis.org/help/glossary?item=Forwards+and+swaps"
    },
    {
      "title": "SEC Investor.gov: Foreign Currency Exchange Trading For Individual Investors",
      "url": "https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins/foreign"
    }
  ],
  "design": {
    "format": "Product route comparison",
    "homeworkTitle": "Fictional product comparison",
    "homeworkIntro": "Submit individual saved explanations, assumptions and working. Incomplete evidence is returned for targeted revision; group participation does not substitute for review.",
    "pacing": {
      "minimum": 45,
      "maximum": 90
    },
    "assessmentCoverage": [
      "S2_C2_1",
      "S2_C2_2",
      "S2_C2_3",
      "S2_C2_4",
      "S2_C2_5",
      "S2_C2_6"
    ],
    "practicalRequirement": "Individually reviewed saved work for every objective; fresh targeted reassessment after failed skills, with original evidence preserved.",
    "studyGuideVisual": {
      "kind": "system",
      "nodes": [
        {
          "label": "A network rather than one counter",
          "detail": "An exporter requests a dealer quotation while a fund trades a currency futures contract on an exchange."
        },
        {
          "label": "Inspect",
          "detail": "Place a platform icon between customer and provider; ask what legal relationship the icon alone proves."
        },
        {
          "label": "Boundary",
          "detail": "Exchange-traded currency futures also exist. A platform interface may provide access to a venue or dealer without being that venue or counterparty itself."
        }
      ],
      "caption": "Fictional teaching model: labels and terms matter more than screen appearance."
    },
    "studyGuideChecks": [
      "A charity uses bank exchange while a fund uses listed futures. Mark which route is not evidence of a universal FX exchange.",
      "A pension fund has foreign assets; distinguish currency-risk reduction from increasing currency exposure in an unrelated position.",
      "A travel cash exchange and a business spot agreement have different delivery arrangements. Name the term that resolves each.",
      "Provider B says forex exposure but omits delivery and counterparty clauses. List questions rather than classifying it from the logo.",
      "A fictional agreement has two opposite currency exchanges next week and next month. Explain why it is not merely a single outright forward.",
      "A new sheet names exchange and expiry but omits settlement method. Classify provisionally, explain uncertainty and request contract specification."
    ]
  }
};
