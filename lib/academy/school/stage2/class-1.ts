import type {StageClass} from '../stage/contracts';
// Private academic definition: reviewed evidence criteria and exact source URLs.
export const CLASS_S2_1: StageClass = {
  "id": "stage-2-class-1",
  "version": "stage-2-class-1.1.0.0",
  "stageId": "stage-2",
  "number": 1,
  "title": "Currency Pairs and Exchange-Rate Meaning",
  "description": "Translate currency obligations into unit-labeled pairs and reciprocal interpretations.",
  "courseId": "hft-school-foundations",
  "lessonId": "hft-school-s2-1",
  "prerequisites": [
    "stage-1-class-8"
  ],
  "liveMinutes": 60,
  "reviewMinutes": 30,
  "objectives": [
    {
      "id": "stage-2-class-1-objective-1",
      "text": "Start with the obligation",
      "competency": "S2_C1_1"
    },
    {
      "id": "stage-2-class-1-objective-2",
      "text": "One base unit has a price",
      "competency": "S2_C1_2"
    },
    {
      "id": "stage-2-class-1-objective-3",
      "text": "Reverse the rate without changing the need",
      "competency": "S2_C1_3"
    },
    {
      "id": "stage-2-class-1-objective-4",
      "text": "Direction is relative",
      "competency": "S2_C1_4"
    },
    {
      "id": "stage-2-class-1-objective-5",
      "text": "Labels organize, units decide",
      "competency": "S2_C1_5"
    },
    {
      "id": "stage-2-class-1-objective-6",
      "text": "Reconcile a complete currency story",
      "competency": "S2_C1_6"
    }
  ],
  "terms": [
    {
      "term": "Start with the obligation",
      "definition": "An exchange rate connects two measured amounts."
    },
    {
      "term": "One base unit has a price",
      "definition": "In BASE/QUOTE notation, the first code names one base unit and the second names the currency measuring its price."
    },
    {
      "term": "Reverse the rate without changing the need",
      "definition": "Reversing a quotation exchanges the unit roles and takes the reciprocal."
    },
    {
      "term": "Direction is relative",
      "definition": "When EUR/USD rises from 1.10 to 1.15, one euro commands more dollars."
    },
    {
      "term": "Labels organize, units decide",
      "definition": "Major pairs commonly refer to heavily traded pairs involving the US dollar, while a cross commonly excludes it."
    },
    {
      "term": "Reconcile a complete currency story",
      "definition": "A reliable currency explanation starts with the obligation, states the displayed pair and units, performs a conversion, then checks whether the result makes sense."
    }
  ],
  "sections": [
    {
      "id": "stage-2-class-1-section-1",
      "title": "Start with the obligation",
      "objectiveId": "stage-2-class-1-objective-1",
      "competency": "S2_C1_1",
      "paragraphs": [
        "An exchange rate connects two measured amounts. Before looking at a screen, write what must be received and what will be given. An invoice payable in euro remains a euro obligation even if its payer keeps a dollar account.",
        "The account currency does not automatically become the first currency in every displayed pair. Choose a representation deliberately and keep the underlying need visible."
      ],
      "example": "A club owes EUR 600 and has USD. It needs to obtain euro and give dollars.",
      "misconception": "The currency I own must always be the base.",
      "visual": "none",
      "activities": [
        {
          "id": "stage-2-class-1-check-1",
          "kind": "choice",
          "category": "REASONING",
          "sectionId": "stage-2-class-1-section-1",
          "objectiveId": "stage-2-class-1-objective-1",
          "competency": "S2_C1_1",
          "prompt": "Which explanation preserves the distinction in this chapter?",
          "critical": true,
          "options": [
            {
              "id": "stage-2-class-1-check-1-a",
              "label": "A club owes EUR 600 and has USD. It needs to obtain euro and give dollars."
            },
            {
              "id": "stage-2-class-1-check-1-b",
              "label": "The currency I own must always be the base."
            }
          ],
          "correct": "stage-2-class-1-check-1-a"
        }
      ]
    },
    {
      "id": "stage-2-class-1-section-2",
      "title": "One base unit has a price",
      "objectiveId": "stage-2-class-1-objective-2",
      "competency": "S2_C1_2",
      "paragraphs": [
        "In BASE/QUOTE notation, the first code names one base unit and the second names the currency measuring its price. EUR/USD 1.20 means USD 1.20 for EUR 1. The slash is a pair label; write the rate units explicitly as USD per EUR when doing arithmetic.",
        "A number without units is incomplete. Equal-looking numbers in JPY per USD and USD per JPY express entirely different relationships."
      ],
      "example": "EUR 50 multiplied by USD 1.20 per EUR gives USD 60; the EUR units cancel.",
      "misconception": "A rate of 1.20 means one dollar buys 1.20 euro.",
      "visual": "none",
      "activities": [
        {
          "id": "stage-2-class-1-check-2",
          "kind": "choice",
          "category": "REASONING",
          "sectionId": "stage-2-class-1-section-2",
          "objectiveId": "stage-2-class-1-objective-2",
          "competency": "S2_C1_2",
          "prompt": "Which explanation preserves the distinction in this chapter?",
          "critical": true,
          "options": [
            {
              "id": "stage-2-class-1-check-2-a",
              "label": "EUR 50 multiplied by USD 1.20 per EUR gives USD 60; the EUR units cancel."
            },
            {
              "id": "stage-2-class-1-check-2-b",
              "label": "A rate of 1.20 means one dollar buys 1.20 euro."
            }
          ],
          "correct": "stage-2-class-1-check-2-a"
        }
      ]
    },
    {
      "id": "stage-2-class-1-section-3",
      "title": "Reverse the rate without changing the need",
      "objectiveId": "stage-2-class-1-objective-3",
      "competency": "S2_C1_3",
      "paragraphs": [
        "Reversing a quotation exchanges the unit roles and takes the reciprocal. If EUR/USD is 1.25 USD per EUR, USD/EUR is 0.80 EUR per USD. Multiplying the two rates gives one because the currency units cancel.",
        "This reciprocal exercise uses a single hypothetical rate. Reversing a real two-way dealer quote also requires handling bid and ask; that comes in the cost class."
      ],
      "example": "EUR 200 costs USD 250 at 1.25; USD 250 × 0.80 EUR per USD returns EUR 200.",
      "misconception": "Changing the pair order changes the invoice currency.",
      "visual": "none",
      "activities": [
        {
          "id": "stage-2-class-1-check-3",
          "kind": "choice",
          "category": "REASONING",
          "sectionId": "stage-2-class-1-section-3",
          "objectiveId": "stage-2-class-1-objective-3",
          "competency": "S2_C1_3",
          "prompt": "Which explanation preserves the distinction in this chapter?",
          "critical": true,
          "options": [
            {
              "id": "stage-2-class-1-check-3-a",
              "label": "EUR 200 costs USD 250 at 1.25; USD 250 × 0.80 EUR per USD returns EUR 200."
            },
            {
              "id": "stage-2-class-1-check-3-b",
              "label": "Changing the pair order changes the invoice currency."
            }
          ],
          "correct": "stage-2-class-1-check-3-a"
        }
      ]
    },
    {
      "id": "stage-2-class-1-section-4",
      "title": "Direction is relative",
      "objectiveId": "stage-2-class-1-objective-4",
      "competency": "S2_C1_4",
      "paragraphs": [
        "When EUR/USD rises from 1.10 to 1.15, one euro commands more dollars. Relative to the dollar, the euro appreciated over those observations. The dollar correspondingly buys fewer euro. This describes a pair and interval, not an absolute strength score.",
        "A currency can rise against one counterpart while falling against another. A change alone gives neither a causal explanation nor an economic forecast."
      ],
      "example": "A EUR 100 purchase rises from USD 110 to USD 115, while EUR 100 receipts convert into more dollars.",
      "misconception": "A rising pair benefits everyone or proves the base is strong everywhere.",
      "visual": "none",
      "activities": [
        {
          "id": "stage-2-class-1-check-4",
          "kind": "choice",
          "category": "REASONING",
          "sectionId": "stage-2-class-1-section-4",
          "objectiveId": "stage-2-class-1-objective-4",
          "competency": "S2_C1_4",
          "prompt": "Which explanation preserves the distinction in this chapter?",
          "critical": true,
          "options": [
            {
              "id": "stage-2-class-1-check-4-a",
              "label": "A EUR 100 purchase rises from USD 110 to USD 115, while EUR 100 receipts convert into more dollars."
            },
            {
              "id": "stage-2-class-1-check-4-b",
              "label": "A rising pair benefits everyone or proves the base is strong everywhere."
            }
          ],
          "correct": "stage-2-class-1-check-4-a"
        }
      ]
    },
    {
      "id": "stage-2-class-1-section-5",
      "title": "Labels organize, units decide",
      "objectiveId": "stage-2-class-1-objective-5",
      "competency": "S2_C1_5",
      "paragraphs": [
        "Major pairs commonly refer to heavily traded pairs involving the US dollar, while a cross commonly excludes it. Lists vary. Exotic is a market label often applied to less heavily traded currency combinations; it is not a standardized promise about cost, safety or national worth.",
        "A category cannot replace checking the actual product, quote source and terms. Even familiar pairs may have changing spreads and availability."
      ],
      "example": "EUR/JPY is commonly called a cross. That label does not alter its JPY-per-EUR interpretation.",
      "misconception": "Major means safe and exotic means a fixed measurable risk level.",
      "visual": "none",
      "activities": [
        {
          "id": "stage-2-class-1-check-5",
          "kind": "choice",
          "category": "REASONING",
          "sectionId": "stage-2-class-1-section-5",
          "objectiveId": "stage-2-class-1-objective-5",
          "competency": "S2_C1_5",
          "prompt": "Which explanation preserves the distinction in this chapter?",
          "critical": true,
          "options": [
            {
              "id": "stage-2-class-1-check-5-a",
              "label": "EUR/JPY is commonly called a cross. That label does not alter its JPY-per-EUR interpretation."
            },
            {
              "id": "stage-2-class-1-check-5-b",
              "label": "Major means safe and exotic means a fixed measurable risk level."
            }
          ],
          "correct": "stage-2-class-1-check-5-a"
        }
      ]
    },
    {
      "id": "stage-2-class-1-section-6",
      "title": "Reconcile a complete currency story",
      "objectiveId": "stage-2-class-1-objective-6",
      "competency": "S2_C1_6",
      "paragraphs": [
        "A reliable currency explanation starts with the obligation, states the displayed pair and units, performs a conversion, then checks whether the result makes sense. Keep an unchanged need separate from a changed rate or representation.",
        "These are fictional single-rate exchanges without fees. No live account, trade, sizing or price prediction is required. If a rate or unit is missing, request it instead of guessing."
      ],
      "example": "A traveler needs SEK 1,000. SEK/USD 0.10 implies USD 100; its reciprocal is USD/SEK 10.",
      "misconception": "Correct arithmetic alone proves the currency story is correct.",
      "visual": "none",
      "activities": [
        {
          "id": "stage-2-class-1-check-6",
          "kind": "choice",
          "category": "REASONING",
          "sectionId": "stage-2-class-1-section-6",
          "objectiveId": "stage-2-class-1-objective-6",
          "competency": "S2_C1_6",
          "prompt": "Which explanation preserves the distinction in this chapter?",
          "critical": true,
          "options": [
            {
              "id": "stage-2-class-1-check-6-a",
              "label": "A traveler needs SEK 1,000. SEK/USD 0.10 implies USD 100; its reciprocal is USD/SEK 10."
            },
            {
              "id": "stage-2-class-1-check-6-b",
              "label": "Correct arithmetic alone proves the currency story is correct."
            }
          ],
          "correct": "stage-2-class-1-check-6-a"
        }
      ]
    }
  ],
  "assessment": [
    {
      "id": "stage-2-class-1-assessment-1",
      "kind": "written",
      "category": "APPLICATION",
      "sectionId": "stage-2-class-1-section-1",
      "objectiveId": "stage-2-class-1-objective-1",
      "competency": "S2_C1_1",
      "prompt": "A firm holds CHF but owes CAD 900. Construct a CAD/CHF representation and describe the exchange needed.",
      "rubric": "Require CAD base, CHF quote, units CHF per CAD, acquisition of CAD using CHF. Separately judge construction and need; no unsupported forecast.",
      "critical": true
    },
    {
      "id": "stage-2-class-1-assessment-2",
      "kind": "written",
      "category": "APPLICATION",
      "sectionId": "stage-2-class-1-section-2",
      "objectiveId": "stage-2-class-1-objective-2",
      "competency": "S2_C1_2",
      "prompt": "Interpret AUD/NZD 1.08 and convert AUD 250 under a stated no-fee single-rate assumption.",
      "rubric": "Require NZD 1.08 per AUD 1 and NZD 270 with unit cancellation. Record interpretation independently of arithmetic.",
      "critical": true
    },
    {
      "id": "stage-2-class-1-assessment-3",
      "kind": "written",
      "category": "APPLICATION",
      "sectionId": "stage-2-class-1-section-3",
      "objectiveId": "stage-2-class-1-objective-3",
      "competency": "S2_C1_3",
      "prompt": "An EUR 300 invoice is shown first at EUR/USD 1.25, then USD/EUR 0.80. Reconcile the same dollar cost using both displays.",
      "rubric": "Require USD 375 by multiplication in the first display or 300/0.80 in the second; invoice stays EUR 300. Do not accept reciprocal without units.",
      "critical": true
    },
    {
      "id": "stage-2-class-1-assessment-4",
      "kind": "written",
      "category": "APPLICATION",
      "sectionId": "stage-2-class-1-section-4",
      "objectiveId": "stage-2-class-1-objective-4",
      "competency": "S2_C1_4",
      "prompt": "GBP/USD rises from 1.20 to 1.26. Explain the changed dollar cost of GBP 400 and compare payer with recipient.",
      "rubric": "Require USD 480 to 504; pound appreciates relative to dollar; payer needs USD 24 more while fixed GBP recipient obtains more USD. Reject absolute-strength inference.",
      "critical": true
    },
    {
      "id": "stage-2-class-1-assessment-5",
      "kind": "written",
      "category": "APPLICATION",
      "sectionId": "stage-2-class-1-section-5",
      "objectiveId": "stage-2-class-1-objective-5",
      "competency": "S2_C1_5",
      "prompt": "Classify EUR/JPY and EUR/USD using stated common conventions, then state what these labels cannot establish.",
      "rubric": "Require cross versus commonly major respectively; explain nonuniversal labels and inability to infer guaranteed safety, liquidity or cost.",
      "critical": true
    },
    {
      "id": "stage-2-class-1-assessment-6",
      "kind": "written",
      "category": "APPLICATION",
      "sectionId": "stage-2-class-1-section-6",
      "objectiveId": "stage-2-class-1-objective-6",
      "competency": "S2_C1_6",
      "prompt": "Prepare three pair stories: a EUR invoice paid from USD at 1.20 USD/EUR; a JPY receipt converted at 0.007 USD/JPY; and the first invoice shown in reverse. Label unchanged needs.",
      "rubric": "Require independent original unit-labeled constructions, conversion working, reciprocal on the first story and explicit unchanged invoice. Review reasoning separately; return missing amounts or assumptions for completion.",
      "critical": true
    },
    {
      "category": "APPLICATION",
      "sectionId": "stage-2-class-1-section-1",
      "objectiveId": "stage-2-class-1-objective-1",
      "competency": "S2_C1_1",
      "id": "stage-2-class-1-assessment-objective-1",
      "kind": "choice",
      "critical": true,
      "prompt": "At GBP/USD 1.40, what does one GBP represent?",
      "options": [
        {
          "id": "stage-2-class-1-assessment-objective-1-sound",
          "label": "USD 1.40"
        },
        {
          "id": "stage-2-class-1-assessment-objective-1-error",
          "label": "GBP 1.40 per USD"
        }
      ],
      "correct": "stage-2-class-1-assessment-objective-1-sound"
    },
    {
      "category": "APPLICATION",
      "sectionId": "stage-2-class-1-section-2",
      "objectiveId": "stage-2-class-1-objective-2",
      "competency": "S2_C1_2",
      "id": "stage-2-class-1-assessment-objective-2",
      "kind": "choice",
      "critical": true,
      "prompt": "EUR/CHF changes from 0.90 to 0.95. What happened over this interval?",
      "options": [
        {
          "id": "stage-2-class-1-assessment-objective-2-sound",
          "label": "EUR appreciated relative to CHF"
        },
        {
          "id": "stage-2-class-1-assessment-objective-2-error",
          "label": "EUR is now strong against every currency"
        }
      ],
      "correct": "stage-2-class-1-assessment-objective-2-sound"
    }
  ],
  "homework": [
    {
      "id": "stage-2-class-1-homework-1",
      "kind": "written",
      "category": "HOMEWORK",
      "sectionId": "stage-2-class-1-section-1",
      "objectiveId": "stage-2-class-1-objective-1",
      "competency": "S2_C1_1",
      "prompt": "A school holds USD and owes EUR 720. Build the pair representation with euro first and label the acquisition and funding currencies. Save individual labeled working; this is fictional paper work with no real-money requirement.",
      "rubric": "Require EUR/USD, USD per EUR and acquiring EUR by giving USD. Individually review saved evidence; preserve original attempts and return failed skill for fresh targeted reassessment.",
      "critical": true
    },
    {
      "id": "stage-2-class-1-homework-2",
      "kind": "written",
      "category": "HOMEWORK",
      "sectionId": "stage-2-class-1-section-2",
      "objectiveId": "stage-2-class-1-objective-2",
      "competency": "S2_C1_2",
      "prompt": "Use CAD/JPY 110 JPY per CAD to convert CAD 35. Show units and explain why 110 is not CAD per JPY. Save individual labeled working; this is fictional paper work with no real-money requirement.",
      "rubric": "Require JPY 3,850 with CAD cancellation and one CAD as reference unit. Individually review saved evidence; preserve original attempts and return failed skill for fresh targeted reassessment.",
      "critical": true
    },
    {
      "id": "stage-2-class-1-homework-3",
      "kind": "written",
      "category": "HOMEWORK",
      "sectionId": "stage-2-class-1-section-3",
      "objectiveId": "stage-2-class-1-objective-3",
      "competency": "S2_C1_3",
      "prompt": "A CAD 400 invoice is quoted at CAD/GBP 0.60. Reverse the quote, then reconcile its unchanged GBP cost using each representation. Save individual labeled working; this is fictional paper work with no real-money requirement.",
      "rubric": "Require GBP/CAD 1.666… CAD per GBP, GBP 240 and unchanged CAD obligation; rounding labeled. Individually review saved evidence; preserve original attempts and return failed skill for fresh targeted reassessment.",
      "critical": true
    },
    {
      "id": "stage-2-class-1-homework-4",
      "kind": "written",
      "category": "HOMEWORK",
      "sectionId": "stage-2-class-1-section-4",
      "objectiveId": "stage-2-class-1-objective-4",
      "competency": "S2_C1_4",
      "prompt": "AUD/USD falls from 0.70 to 0.65. Compare a fixed AUD 200 payer and recipient who each measure cost or proceeds in USD. Save individual labeled working; this is fictional paper work with no real-money requirement.",
      "rubric": "Require USD 140 to 130, AUD depreciates relative to USD; USD payer cost falls and USD proceeds of fixed AUD receipt fall. Individually review saved evidence; preserve original attempts and return failed skill for fresh targeted reassessment.",
      "critical": true
    },
    {
      "id": "stage-2-class-1-homework-5",
      "kind": "written",
      "category": "HOMEWORK",
      "sectionId": "stage-2-class-1-section-5",
      "objectiveId": "stage-2-class-1-objective-5",
      "competency": "S2_C1_5",
      "prompt": "Compare USD/CHF with EUR/CHF under common major/cross conventions. Explain why neither label establishes a safe or cheap transaction. Save individual labeled working; this is fictional paper work with no real-money requirement.",
      "rubric": "Require qualified commonly major versus cross, actual terms and conditions needed; no category safety guarantee. Individually review saved evidence; preserve original attempts and return failed skill for fresh targeted reassessment.",
      "critical": true
    },
    {
      "id": "stage-2-class-1-homework-6",
      "kind": "written",
      "category": "HOMEWORK",
      "sectionId": "stage-2-class-1-section-6",
      "objectiveId": "stage-2-class-1-objective-6",
      "competency": "S2_C1_6",
      "prompt": "Submit three original pair stories using fictional amounts: one invoice, one receipt and one reversed display of an unchanged need. Include units, working, a direction change and an explicit no-fee assumption. Save individual labeled working; this is fictional paper work with no real-money requirement.",
      "rubric": "Require all three distinct constructions, reciprocal with correct units, unchanged obligation and conditional relative direction. Review reasoning separately from arithmetic. Individually review saved evidence; preserve original attempts and return failed skill for fresh targeted reassessment.",
      "critical": true
    }
  ],
  "remediation": [
    {
      "competency": "S2_C1_1",
      "sectionId": "stage-2-class-1-section-1",
      "title": "Repair: Start with the obligation",
      "paragraph": "Diagnose the failed distinction: The currency I own must always be the base. Use a labeled diagram or ledger to expose it. Retain the original attempt, teach only the failed skill, then assess the changed case below; completion alone is not mastery.",
      "reinforcement": {
        "id": "stage-2-class-1-reassess-1",
        "kind": "choice",
        "category": "APPLICATION",
        "sectionId": "stage-2-class-1-section-1",
        "objectiveId": "stage-2-class-1-objective-1",
        "competency": "S2_C1_1",
        "prompt": "A visitor owns GBP and owes NOK 700. Build NOK/GBP and label what is acquired and spent. Which worked explanation repairs the failed distinction?",
        "rubric": "Require NOK/GBP, NOK base, GBP quote and GBP per NOK; visitor acquires NOK and gives GBP. Individually inspect fresh saved reasoning; preserve original and reassessment attempts, and return the failed skill if still unproven. Deterministic answer identifies the repair; the existing written assessment retake must separately demonstrate reasoning transfer.",
        "critical": true,
        "options": [
          {
            "id": "stage-2-class-1-reassess-1-repair",
            "label": "NOK/GBP, NOK base, GBP quote and GBP per NOK; visitor acquires NOK and gives GBP."
          },
          {
            "id": "stage-2-class-1-reassess-1-error",
            "label": "GBP is base and NOK quote because the visitor owns GBP."
          }
        ],
        "correct": "stage-2-class-1-reassess-1-repair"
      }
    },
    {
      "competency": "S2_C1_2",
      "sectionId": "stage-2-class-1-section-2",
      "title": "Repair: One base unit has a price",
      "paragraph": "Diagnose the failed distinction: A rate of 1.20 means one dollar buys 1.20 euro. Use a labeled diagram or ledger to expose it. Retain the original attempt, teach only the failed skill, then assess the changed case below; completion alone is not mastery.",
      "reinforcement": {
        "id": "stage-2-class-1-reassess-2",
        "kind": "choice",
        "category": "APPLICATION",
        "sectionId": "stage-2-class-1-section-2",
        "objectiveId": "stage-2-class-1-objective-2",
        "competency": "S2_C1_2",
        "prompt": "Interpret GBP/CHF 1.12 and convert GBP 75, labeling CHF 84. Which worked explanation repairs the failed distinction?",
        "rubric": "Require GBP/CHF 1.12 CHF per GBP and GBP 75 × 1.12 = CHF 84; cancel GBP units. Individually inspect fresh saved reasoning; preserve original and reassessment attempts, and return the failed skill if still unproven. Deterministic answer identifies the repair; the existing written assessment retake must separately demonstrate reasoning transfer.",
        "critical": true,
        "options": [
          {
            "id": "stage-2-class-1-reassess-2-repair",
            "label": "GBP/CHF 1.12 CHF per GBP and GBP 75 × 1.12 = CHF 84; cancel GBP units."
          },
          {
            "id": "stage-2-class-1-reassess-2-error",
            "label": "CHF 75 because a currency conversion never changes the number."
          }
        ],
        "correct": "stage-2-class-1-reassess-2-repair"
      }
    },
    {
      "competency": "S2_C1_3",
      "sectionId": "stage-2-class-1-section-3",
      "title": "Repair: Reverse the rate without changing the need",
      "paragraph": "Diagnose the failed distinction: Changing the pair order changes the invoice currency. Use a labeled diagram or ledger to expose it. Retain the original attempt, teach only the failed skill, then assess the changed case below; completion alone is not mastery.",
      "reinforcement": {
        "id": "stage-2-class-1-reassess-3",
        "kind": "choice",
        "category": "APPLICATION",
        "sectionId": "stage-2-class-1-section-3",
        "objectiveId": "stage-2-class-1-objective-3",
        "competency": "S2_C1_3",
        "prompt": "A CHF 160 invoice uses CHF/USD 1.10. Derive USD/CHF and reconcile USD 176, allowing rounded reciprocal with explanation. Which worked explanation repairs the failed distinction?",
        "rubric": "Require USD/CHF about 0.90909 CHF per USD; CHF 160 × 1.10 USD/CHF = USD 176. Invoice remains CHF 160; reconcile reciprocal division. Individually inspect fresh saved reasoning; preserve original and reassessment attempts, and return the failed skill if still unproven. Deterministic answer identifies the repair; the existing written assessment retake must separately demonstrate reasoning transfer.",
        "critical": true,
        "options": [
          {
            "id": "stage-2-class-1-reassess-3-repair",
            "label": "USD/CHF about 0.90909 CHF per USD; CHF 160 × 1.10 USD/CHF = USD 176. Invoice remains CHF 160; reconcile reciprocal division."
          },
          {
            "id": "stage-2-class-1-reassess-3-error",
            "label": "USD 160 because reversing a quote changes the invoice into dollars."
          }
        ],
        "correct": "stage-2-class-1-reassess-3-repair"
      }
    },
    {
      "competency": "S2_C1_4",
      "sectionId": "stage-2-class-1-section-4",
      "title": "Repair: Direction is relative",
      "paragraph": "Diagnose the failed distinction: A rising pair benefits everyone or proves the base is strong everywhere. Use a labeled diagram or ledger to expose it. Retain the original attempt, teach only the failed skill, then assess the changed case below; completion alone is not mastery.",
      "reinforcement": {
        "id": "stage-2-class-1-reassess-4",
        "kind": "choice",
        "category": "APPLICATION",
        "sectionId": "stage-2-class-1-section-4",
        "objectiveId": "stage-2-class-1-objective-4",
        "competency": "S2_C1_4",
        "prompt": "NZD/CAD falls from 0.84 to 0.80. Explain CAD cost of NZD 500 and both currency directions. Which worked explanation repairs the failed distinction?",
        "rubric": "Require CAD cost falls from 420 to 400; NZD depreciates relative to CAD, CAD appreciates relative to NZD; fixed NZD receipt yields fewer CAD. Individually inspect fresh saved reasoning; preserve original and reassessment attempts, and return the failed skill if still unproven. Deterministic answer identifies the repair; the existing written assessment retake must separately demonstrate reasoning transfer.",
        "critical": true,
        "options": [
          {
            "id": "stage-2-class-1-reassess-4-repair",
            "label": "CAD cost falls from 420 to 400; NZD depreciates relative to CAD, CAD appreciates relative to NZD; fixed NZD receipt yields fewer CAD."
          },
          {
            "id": "stage-2-class-1-reassess-4-error",
            "label": "NZD appreciated relative to CAD and CAD cost increased."
          }
        ],
        "correct": "stage-2-class-1-reassess-4-repair"
      }
    },
    {
      "competency": "S2_C1_5",
      "sectionId": "stage-2-class-1-section-5",
      "title": "Repair: Labels organize, units decide",
      "paragraph": "Diagnose the failed distinction: Major means safe and exotic means a fixed measurable risk level. Use a labeled diagram or ledger to expose it. Retain the original attempt, teach only the failed skill, then assess the changed case below; completion alone is not mastery.",
      "reinforcement": {
        "id": "stage-2-class-1-reassess-5",
        "kind": "choice",
        "category": "APPLICATION",
        "sectionId": "stage-2-class-1-section-5",
        "objectiveId": "stage-2-class-1-objective-5",
        "competency": "S2_C1_5",
        "prompt": "Compare GBP/JPY with GBP/USD under the same convention; identify one actual term still needing inspection. Which worked explanation repairs the failed distinction?",
        "rubric": "Require commonly cross for GBP/JPY and major for GBP/USD under stated convention; request actual cost/product terms and reject category safety inference. Individually inspect fresh saved reasoning; preserve original and reassessment attempts, and return the failed skill if still unproven. Deterministic answer identifies the repair; the existing written assessment retake must separately demonstrate reasoning transfer.",
        "critical": true,
        "options": [
          {
            "id": "stage-2-class-1-reassess-5-repair",
            "label": "commonly cross for GBP/JPY and major for GBP/USD under stated convention; request actual cost/product terms and reject category safety inference."
          },
          {
            "id": "stage-2-class-1-reassess-5-error",
            "label": "Every major pair is safe and every cross is expensive."
          }
        ],
        "correct": "stage-2-class-1-reassess-5-repair"
      }
    },
    {
      "competency": "S2_C1_6",
      "sectionId": "stage-2-class-1-section-6",
      "title": "Repair: Reconcile a complete currency story",
      "paragraph": "Diagnose the failed distinction: Correct arithmetic alone proves the currency story is correct. Use a labeled diagram or ledger to expose it. Retain the original attempt, teach only the failed skill, then assess the changed case below; completion alone is not mastery.",
      "reinforcement": {
        "id": "stage-2-class-1-reassess-6",
        "kind": "choice",
        "category": "APPLICATION",
        "sectionId": "stage-2-class-1-section-6",
        "objectiveId": "stage-2-class-1-objective-6",
        "competency": "S2_C1_6",
        "prompt": "Use CAD invoice paid in GBP at 0.60 GBP/CAD, then reverse it. Explain why a lower displayed reciprocal does not mean the invoice shrank. Which worked explanation repairs the failed distinction?",
        "rubric": "Require CAD/GBP at 0.60 GBP per CAD; reciprocal GBP/CAD about 1.6667 CAD per GBP. Same CAD invoice amount; lower reciprocal number alone establishes no shrinking obligation. Individually inspect fresh saved reasoning; preserve original and reassessment attempts, and return the failed skill if still unproven. Deterministic answer identifies the repair; the existing written assessment retake must separately demonstrate reasoning transfer.",
        "critical": true,
        "options": [
          {
            "id": "stage-2-class-1-reassess-6-repair",
            "label": "CAD/GBP at 0.60 GBP per CAD; reciprocal GBP/CAD about 1.6667 CAD per GBP. Same CAD invoice amount; lower reciprocal number alone establishes no shrinking obligation."
          },
          {
            "id": "stage-2-class-1-reassess-6-error",
            "label": "A smaller reciprocal number proves the invoice shrank."
          }
        ],
        "correct": "stage-2-class-1-reassess-6-repair"
      }
    }
  ],
  "liveGuide": [
    {
      "title": "Start with the obligation",
      "minutes": 10,
      "talkingPoints": [
        "0–2 min: ask learners to retrieve the prerequisite distinction needed for start with the obligation. Collect individual responses before discussion.",
        "2–5 min demonstration: Move a CAD invoice card beside a CHF wallet. Which currency does the invoice require, regardless of screen order?",
        "5–7 min: show A club owes EUR 600 and has USD. It needs to obtain euro and give dollars. Ask one learner to explain and another to challenge the stated assumption.",
        "7–9 min: address the specific misconception “The currency I own must always be the base.” with a counterexample, then change one number or term and ask everyone to predict.",
        "9–10 min: save each learner’s response; flag individual follow-up rather than treating group agreement as evidence."
      ],
      "activity": {
        "kind": "WRITTEN",
        "prompt": "A firm holds CHF but owes CAD 900. Construct a CAD/CHF representation and describe the exchange needed.",
        "sectionId": "stage-2-class-1-section-1"
      }
    },
    {
      "title": "One base unit has a price",
      "minutes": 10,
      "talkingPoints": [
        "0–2 min: ask learners to retrieve the prerequisite distinction needed for one base unit has a price. Collect individual responses before discussion.",
        "2–5 min demonstration: Place AUD 1 on the left of a balance and NZD 1.08 on the right. Predict the amount for AUD 10.",
        "5–7 min: show EUR 50 multiplied by USD 1.20 per EUR gives USD 60; the EUR units cancel. Ask one learner to explain and another to challenge the stated assumption.",
        "7–9 min: address the specific misconception “A rate of 1.20 means one dollar buys 1.20 euro.” with a counterexample, then change one number or term and ask everyone to predict.",
        "9–10 min: save each learner’s response; flag individual follow-up rather than treating group agreement as evidence."
      ],
      "activity": {
        "kind": "SINGLE",
        "prompt": "Interpret AUD/NZD 1.08 and convert AUD 250 under a stated no-fee single-rate assumption.",
        "sectionId": "stage-2-class-1-section-2"
      }
    },
    {
      "title": "Reverse the rate without changing the need",
      "minutes": 10,
      "talkingPoints": [
        "0–2 min: ask learners to retrieve the prerequisite distinction needed for reverse the rate without changing the need. Collect individual responses before discussion.",
        "2–5 min demonstration: Flip both currency labels before revealing 1/1.25. Does an existing EUR invoice change?",
        "5–7 min: show EUR 200 costs USD 250 at 1.25; USD 250 × 0.80 EUR per USD returns EUR 200. Ask one learner to explain and another to challenge the stated assumption.",
        "7–9 min: address the specific misconception “Changing the pair order changes the invoice currency.” with a counterexample, then change one number or term and ask everyone to predict.",
        "9–10 min: save each learner’s response; flag individual follow-up rather than treating group agreement as evidence."
      ],
      "activity": {
        "kind": "POLL",
        "prompt": "An EUR 300 invoice is shown first at EUR/USD 1.25, then USD/EUR 0.80. Reconcile the same dollar cost using both displays.",
        "sectionId": "stage-2-class-1-section-3"
      }
    },
    {
      "title": "Direction is relative",
      "minutes": 10,
      "talkingPoints": [
        "0–2 min: ask learners to retrieve the prerequisite distinction needed for direction is relative. Collect individual responses before discussion.",
        "2–5 min demonstration: Keep a EUR 100 invoice fixed while raising its USD-per-EUR tag. Ask payer and recipient for opposite reactions.",
        "5–7 min: show A EUR 100 purchase rises from USD 110 to USD 115, while EUR 100 receipts convert into more dollars. Ask one learner to explain and another to challenge the stated assumption.",
        "7–9 min: address the specific misconception “A rising pair benefits everyone or proves the base is strong everywhere.” with a counterexample, then change one number or term and ask everyone to predict.",
        "9–10 min: save each learner’s response; flag individual follow-up rather than treating group agreement as evidence."
      ],
      "activity": {
        "kind": "WRITTEN",
        "prompt": "GBP/USD rises from 1.20 to 1.26. Explain the changed dollar cost of GBP 400 and compare payer with recipient.",
        "sectionId": "stage-2-class-1-section-4"
      }
    },
    {
      "title": "Labels organize, units decide",
      "minutes": 10,
      "talkingPoints": [
        "0–2 min: ask learners to retrieve the prerequisite distinction needed for labels organize, units decide. Collect individual responses before discussion.",
        "2–5 min demonstration: Sort pair cards by USD participation, then remove the headings and verify that the rate units remain unchanged.",
        "5–7 min: show EUR/JPY is commonly called a cross. That label does not alter its JPY-per-EUR interpretation. Ask one learner to explain and another to challenge the stated assumption.",
        "7–9 min: address the specific misconception “Major means safe and exotic means a fixed measurable risk level.” with a counterexample, then change one number or term and ask everyone to predict.",
        "9–10 min: save each learner’s response; flag individual follow-up rather than treating group agreement as evidence."
      ],
      "activity": {
        "kind": "SINGLE",
        "prompt": "Classify EUR/JPY and EUR/USD using stated common conventions, then state what these labels cannot establish.",
        "sectionId": "stage-2-class-1-section-5"
      }
    },
    {
      "title": "Reconcile a complete currency story",
      "minutes": 10,
      "talkingPoints": [
        "0–2 min: ask learners to retrieve the prerequisite distinction needed for reconcile a complete currency story. Collect individual responses before discussion.",
        "2–5 min demonstration: Ask a partner to inspect only your units and another only your arithmetic; compare which mistakes each can detect.",
        "5–7 min: show A traveler needs SEK 1,000. SEK/USD 0.10 implies USD 100; its reciprocal is USD/SEK 10. Ask one learner to explain and another to challenge the stated assumption.",
        "7–9 min: address the specific misconception “Correct arithmetic alone proves the currency story is correct.” with a counterexample, then change one number or term and ask everyone to predict.",
        "9–10 min: save each learner’s response; flag individual follow-up rather than treating group agreement as evidence."
      ],
      "activity": {
        "kind": "POLL",
        "prompt": "Prepare three pair stories: a EUR invoice paid from USD at 1.20 USD/EUR; a JPY receipt converted at 0.007 USD/JPY; and the first invoice shown in reverse. Label unchanged needs.",
        "sectionId": "stage-2-class-1-section-6"
      }
    }
  ],
  "studyGuide": {
    "summary": [
      "Start with the obligation: A club owes EUR 600 and has USD. It needs to obtain euro and give dollars.",
      "One base unit has a price: EUR 50 multiplied by USD 1.20 per EUR gives USD 60; the EUR units cancel.",
      "Reverse the rate without changing the need: EUR 200 costs USD 250 at 1.25; USD 250 × 0.80 EUR per USD returns EUR 200.",
      "Direction is relative: A EUR 100 purchase rises from USD 110 to USD 115, while EUR 100 receipts convert into more dollars.",
      "Labels organize, units decide: EUR/JPY is commonly called a cross. That label does not alter its JPY-per-EUR interpretation.",
      "Reconcile a complete currency story: A traveler needs SEK 1,000. SEK/USD 0.10 implies USD 100; its reciprocal is USD/SEK 10."
    ],
    "bigPicture": "Start with the required currency, then choose a representation and audit the units.",
    "fiveThings": [
      "Start with the obligation",
      "One base unit has a price",
      "Reverse the rate without changing the need",
      "Direction is relative",
      "Labels organize, units decide"
    ],
    "outcomes": [
      "Start with the obligation",
      "One base unit has a price",
      "Reverse the rate without changing the need",
      "Direction is relative",
      "Labels organize, units decide",
      "Reconcile a complete currency story"
    ],
    "examples": [
      "A club owes EUR 600 and has USD. It needs to obtain euro and give dollars.",
      "EUR 50 multiplied by USD 1.20 per EUR gives USD 60; the EUR units cancel.",
      "EUR 200 costs USD 250 at 1.25; USD 250 × 0.80 EUR per USD returns EUR 200.",
      "A EUR 100 purchase rises from USD 110 to USD 115, while EUR 100 receipts convert into more dollars.",
      "EUR/JPY is commonly called a cross. That label does not alter its JPY-per-EUR interpretation.",
      "A traveler needs SEK 1,000. SEK/USD 0.10 implies USD 100; its reciprocal is USD/SEK 10."
    ],
    "misconceptions": [
      "The currency I own must always be the base.",
      "A rate of 1.20 means one dollar buys 1.20 euro.",
      "Changing the pair order changes the invoice currency.",
      "A rising pair benefits everyone or proves the base is strong everywhere.",
      "Major means safe and exotic means a fixed measurable risk level.",
      "Correct arithmetic alone proves the currency story is correct."
    ],
    "review": [
      {
        "sectionId": "stage-2-class-1-section-1",
        "label": "Reconstruct: Start with the obligation"
      },
      {
        "sectionId": "stage-2-class-1-section-2",
        "label": "Reconstruct: One base unit has a price"
      },
      {
        "sectionId": "stage-2-class-1-section-3",
        "label": "Reconstruct: Reverse the rate without changing the need"
      },
      {
        "sectionId": "stage-2-class-1-section-4",
        "label": "Reconstruct: Direction is relative"
      },
      {
        "sectionId": "stage-2-class-1-section-5",
        "label": "Reconstruct: Labels organize, units decide"
      },
      {
        "sectionId": "stage-2-class-1-section-6",
        "label": "Reconstruct: Reconcile a complete currency story"
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
      "title": "CME Group: Understanding FX Quote Conventions",
      "url": "https://www.cmegroup.com/education/courses/introduction-to-fx/understanding-fx-quote-conventions"
    }
  ],
  "design": {
    "format": "Unit-labeled pair construction",
    "homeworkTitle": "Three currency stories",
    "homeworkIntro": "Submit individual saved explanations, assumptions and working. Incomplete evidence is returned for targeted revision; group participation does not substitute for review.",
    "pacing": {
      "minimum": 45,
      "maximum": 90
    },
    "assessmentCoverage": [
      "S2_C1_1",
      "S2_C1_2",
      "S2_C1_3",
      "S2_C1_4",
      "S2_C1_5",
      "S2_C1_6"
    ],
    "practicalRequirement": "Individually reviewed saved work for every objective; fresh targeted reassessment after failed skills, with original evidence preserved.",
    "studyGuideVisual": {
      "kind": "quote",
      "nodes": [
        {
          "label": "Start with the obligation",
          "detail": "A club owes EUR 600 and has USD. It needs to obtain euro and give dollars."
        },
        {
          "label": "Inspect",
          "detail": "Move a CAD invoice card beside a CHF wallet. Which currency does the invoice require, regardless of screen order?"
        },
        {
          "label": "Boundary",
          "detail": "The account currency does not automatically become the first currency in every displayed pair. Choose a representation deliberately and keep the underlying need visible."
        }
      ],
      "caption": "Fictional teaching model: labels and terms matter more than screen appearance."
    },
    "studyGuideChecks": [
      "A visitor owns GBP and owes NOK 700. Build NOK/GBP and label what is acquired and spent.",
      "Interpret GBP/CHF 1.12 and convert GBP 75, labeling CHF 84.",
      "A CHF 160 invoice uses CHF/USD 1.10. Derive USD/CHF and reconcile USD 176, allowing rounded reciprocal with explanation.",
      "NZD/CAD falls from 0.84 to 0.80. Explain CAD cost of NZD 500 and both currency directions.",
      "Compare GBP/JPY with GBP/USD under the same convention; identify one actual term still needing inspection.",
      "Use CAD invoice paid in GBP at 0.60 GBP/CAD, then reverse it. Explain why a lower displayed reciprocal does not mean the invoice shrank."
    ]
  }
};
