import 'server-only';
import type {StageExperience} from '../stage/contracts';
export const EXPERIENCE_S2_1:StageExperience = {
  "classId": "stage-2-class-1",
  "academicVersion": "stage-2-class-1.1.0.0",
  "revision": "fx-pairs-visual.1.0.1",
  "format": "quote",
  "sections": [
    {
      "sectionId": "stage-2-class-1-section-1",
      "hook": "Move a CAD invoice card beside a CHF wallet. Which currency does the invoice require, regardless of screen order?",
      "scenario": "Use fictional cards and pause before revealing the explanation. A club owes EUR 600 and has USD. It needs to obtain euro and give dollars.",
      "visual": {
        "kind": "quote",
        "nodes": [
          {
            "label": "NEED",
            "detail": "Obtain EUR600"
          },
          {
            "label": "HOLD",
            "detail": "Spend USD"
          },
          {
            "label": "PAIR REPRESENTATION",
            "detail": "EUR/USD: USD per one EUR"
          }
        ],
        "caption": "Fictional teaching model: labels and terms matter more than screen appearance."
      },
      "practice": [
        {
          "id": "stage-2-class-1-explore-1",
          "kind": "reflect",
          "prompt": "A visitor owns GBP and owes NOK 700. Build NOK/GBP and label what is acquired and spent.",
          "explanation": "Compare your explanation with the governing distinction: An exchange rate connects two measured amounts. Before looking at a screen, write what must be received and what will be given. An invoice payable in euro remains a euro obligation even if its payer keeps a dollar account.",
          "retry": "Identify the exact label or assumption you changed, then explain its consequence before continuing."
        },
        {
          "id": "s2-1-pair-match",
          "kind": "matching",
          "prompt": "Match the labels for EUR/USD 1.16.",
          "rows": [
            {
              "id": "eur",
              "label": "EUR"
            },
            {
              "id": "usd",
              "label": "USD"
            }
          ],
          "options": [
            {
              "id": "base",
              "label": "Base: one reference unit"
            },
            {
              "id": "quote",
              "label": "Quote: measuring currency"
            }
          ],
          "answers": {
            "eur": "base",
            "usd": "quote"
          },
          "explanation": "EUR is first, so 1.16 is measured in USD per EUR.",
          "retry": "Write one EUR equals how many USD before matching again."
        }
      ],
      "explanation": [
        "Test the example by changing just one condition. Move a CAD invoice card beside a CHF wallet. Which currency does the invoice require, regardless of screen order?",
        "A useful explanation must rule out this shortcut: The currency I own must always be the base."
      ],
      "takeaway": "Start with the obligation — show the relationship and its boundary.",
      "demi": "Pause and explain your reasoning before revealing the next card."
    },
    {
      "sectionId": "stage-2-class-1-section-2",
      "hook": "Place AUD 1 on the left of a balance and NZD 1.08 on the right. Predict the amount for AUD 10.",
      "scenario": "Use fictional cards and pause before revealing the explanation. EUR 50 multiplied by USD 1.20 per EUR gives USD 60; the EUR units cancel.",
      "visual": {
        "kind": "quote",
        "nodes": [
          {
            "label": "1 EUR",
            "detail": "Reference/base unit"
          },
          {
            "label": "1.20 USD",
            "detail": "Measuring/quote amount per EUR"
          },
          {
            "label": "50 EUR ×1.20 USD/EUR",
            "detail": "60 USD · EUR units cancel"
          }
        ],
        "caption": "Fictional teaching model: labels and terms matter more than screen appearance."
      },
      "practice": [
        {
          "id": "stage-2-class-1-explore-2",
          "kind": "choice",
          "prompt": "Which explanation fits the fictional card?",
          "explanation": "Compare your explanation with the governing distinction: In BASE/QUOTE notation, the first code names one base unit and the second names the currency measuring its price. EUR/USD 1.20 means USD 1.20 for EUR 1. The slash is a pair label; write the rate units explicitly as USD per EUR when doing arithmetic.",
          "retry": "Identify the exact label or assumption you changed, then explain its consequence before continuing.",
          "options": [
            {
              "id": "stage-2-class-1-explore-2-sound",
              "label": "EUR 50 multiplied by USD 1.20 per EUR gives USD 60; the EUR units cancel."
            },
            {
              "id": "stage-2-class-1-explore-2-shortcut",
              "label": "A rate of 1.20 means one dollar buys 1.20 euro."
            }
          ],
          "correct": "stage-2-class-1-explore-2-sound"
        },
        {
          "id": "s2-1-convert",
          "kind": "calculate",
          "prompt": "Fictional single rate: EUR/USD 1.16. How many USD for EUR 25, excluding all costs?",
          "expected": 29,
          "tolerance": 0.001,
          "explanation": "25 EUR × 1.16 USD/EUR = 29 USD.",
          "retry": "Cancel EUR units and multiply; do not invert the rate."
        }
      ],
      "explanation": [
        "Test the example by changing just one condition. Place AUD 1 on the left of a balance and NZD 1.08 on the right. Predict the amount for AUD 10.",
        "A useful explanation must rule out this shortcut: A rate of 1.20 means one dollar buys 1.20 euro."
      ],
      "takeaway": "One base unit has a price — show the relationship and its boundary.",
      "demi": "Pause and explain your reasoning before revealing the next card."
    },
    {
      "sectionId": "stage-2-class-1-section-3",
      "hook": "Flip both currency labels before revealing 1/1.25. Does an existing EUR invoice change?",
      "scenario": "Use fictional cards and pause before revealing the explanation. EUR 200 costs USD 250 at 1.25; USD 250 × 0.80 EUR per USD returns EUR 200.",
      "visual": {
        "kind": "quote",
        "nodes": [
          {
            "label": "EUR/USD",
            "detail": "1.25 USD per EUR"
          },
          {
            "label": "USD/EUR",
            "detail": "0.80 EUR per USD"
          },
          {
            "label": "ROUND TRIP UNITS",
            "detail": "EUR200 →USD250 →EUR200, ignoring costs"
          }
        ],
        "caption": "Fictional teaching model: labels and terms matter more than screen appearance."
      },
      "practice": [
        {
          "id": "stage-2-class-1-explore-3",
          "kind": "reflect",
          "prompt": "A CHF 160 invoice uses CHF/USD 1.10. Derive USD/CHF and reconcile USD 176, allowing rounded reciprocal with explanation.",
          "explanation": "Compare your explanation with the governing distinction: Reversing a quotation exchanges the unit roles and takes the reciprocal. If EUR/USD is 1.25 USD per EUR, USD/EUR is 0.80 EUR per USD. Multiplying the two rates gives one because the currency units cancel.",
          "retry": "Identify the exact label or assumption you changed, then explain its consequence before continuing."
        }
      ],
      "explanation": [
        "Test the example by changing just one condition. Flip both currency labels before revealing 1/1.25. Does an existing EUR invoice change?",
        "A useful explanation must rule out this shortcut: Changing the pair order changes the invoice currency."
      ],
      "takeaway": "Reverse the rate without changing the need — show the relationship and its boundary.",
      "demi": "Pause and explain your reasoning before revealing the next card."
    },
    {
      "sectionId": "stage-2-class-1-section-4",
      "hook": "Keep a EUR 100 invoice fixed while raising its USD-per-EUR tag. Ask payer and recipient for opposite reactions.",
      "scenario": "Use fictional cards and pause before revealing the explanation. A EUR 100 purchase rises from USD 110 to USD 115, while EUR 100 receipts convert into more dollars.",
      "visual": {
        "kind": "quote",
        "nodes": [
          {
            "label": "EARLIER",
            "detail": "EUR100 costs USD110"
          },
          {
            "label": "LATER",
            "detail": "EUR100 costs USD115"
          },
          {
            "label": "RELATIVE CHANGE",
            "detail": "Same EUR obligation requires more USD"
          }
        ],
        "caption": "Fictional teaching model: labels and terms matter more than screen appearance."
      },
      "practice": [
        {
          "id": "stage-2-class-1-explore-4",
          "kind": "choice",
          "prompt": "Which explanation fits the fictional card?",
          "explanation": "Compare your explanation with the governing distinction: When EUR/USD rises from 1.10 to 1.15, one euro commands more dollars. Relative to the dollar, the euro appreciated over those observations. The dollar correspondingly buys fewer euro. This describes a pair and interval, not an absolute strength score.",
          "retry": "Identify the exact label or assumption you changed, then explain its consequence before continuing.",
          "options": [
            {
              "id": "stage-2-class-1-explore-4-sound",
              "label": "A EUR 100 purchase rises from USD 110 to USD 115, while EUR 100 receipts convert into more dollars."
            },
            {
              "id": "stage-2-class-1-explore-4-shortcut",
              "label": "A rising pair benefits everyone or proves the base is strong everywhere."
            }
          ],
          "correct": "stage-2-class-1-explore-4-sound"
        }
      ],
      "explanation": [
        "Test the example by changing just one condition. Keep a EUR 100 invoice fixed while raising its USD-per-EUR tag. Ask payer and recipient for opposite reactions.",
        "A useful explanation must rule out this shortcut: A rising pair benefits everyone or proves the base is strong everywhere."
      ],
      "takeaway": "Direction is relative — show the relationship and its boundary.",
      "demi": "Pause and explain your reasoning before revealing the next card."
    },
    {
      "sectionId": "stage-2-class-1-section-5",
      "hook": "Sort pair cards by USD participation, then remove the headings and verify that the rate units remain unchanged.",
      "scenario": "Use fictional cards and pause before revealing the explanation. EUR/JPY is commonly called a cross. That label does not alter its JPY-per-EUR interpretation.",
      "visual": {
        "kind": "quote",
        "nodes": [
          {
            "label": "EUR",
            "detail": "Reference currency"
          },
          {
            "label": "JPY",
            "detail": "Measuring currency"
          },
          {
            "label": "CROSS CONVENTION",
            "detail": "EUR/JPY still means JPY per EUR"
          }
        ],
        "caption": "Fictional teaching model: labels and terms matter more than screen appearance."
      },
      "practice": [
        {
          "id": "stage-2-class-1-explore-5",
          "kind": "reflect",
          "prompt": "Compare GBP/JPY with GBP/USD under the same convention; identify one actual term still needing inspection.",
          "explanation": "Compare your explanation with the governing distinction: Major pairs commonly refer to heavily traded pairs involving the US dollar, while a cross commonly excludes it. Lists vary. Exotic is a market label often applied to less heavily traded currency combinations; it is not a standardized promise about cost, safety or national worth.",
          "retry": "Identify the exact label or assumption you changed, then explain its consequence before continuing."
        }
      ],
      "explanation": [
        "Test the example by changing just one condition. Sort pair cards by USD participation, then remove the headings and verify that the rate units remain unchanged.",
        "A useful explanation must rule out this shortcut: Major means safe and exotic means a fixed measurable risk level."
      ],
      "takeaway": "Labels organize, units decide — show the relationship and its boundary.",
      "demi": "Pause and explain your reasoning before revealing the next card."
    },
    {
      "sectionId": "stage-2-class-1-section-6",
      "hook": "Ask a partner to inspect only your units and another only your arithmetic; compare which mistakes each can detect.",
      "scenario": "Use fictional cards and pause before revealing the explanation. A traveler needs SEK 1,000. SEK/USD 0.10 implies USD 100; its reciprocal is USD/SEK 10.",
      "visual": {
        "kind": "quote",
        "nodes": [
          {
            "label": "SEK/USD",
            "detail": "0.10 USD per SEK"
          },
          {
            "label": "USD/SEK",
            "detail": "10 SEK per USD"
          },
          {
            "label": "INVOICE",
            "detail": "SEK1,000 requires USD100, costs excluded"
          }
        ],
        "caption": "Fictional teaching model: labels and terms matter more than screen appearance."
      },
      "practice": [
        {
          "id": "stage-2-class-1-explore-6",
          "kind": "choice",
          "prompt": "Which explanation fits the fictional card?",
          "explanation": "Compare your explanation with the governing distinction: A reliable currency explanation starts with the obligation, states the displayed pair and units, performs a conversion, then checks whether the result makes sense. Keep an unchanged need separate from a changed rate or representation.",
          "retry": "Identify the exact label or assumption you changed, then explain its consequence before continuing.",
          "options": [
            {
              "id": "stage-2-class-1-explore-6-sound",
              "label": "A traveler needs SEK 1,000. SEK/USD 0.10 implies USD 100; its reciprocal is USD/SEK 10."
            },
            {
              "id": "stage-2-class-1-explore-6-shortcut",
              "label": "Correct arithmetic alone proves the currency story is correct."
            }
          ],
          "correct": "stage-2-class-1-explore-6-sound"
        }
      ],
      "explanation": [
        "Test the example by changing just one condition. Ask a partner to inspect only your units and another only your arithmetic; compare which mistakes each can detect.",
        "A useful explanation must rule out this shortcut: Correct arithmetic alone proves the currency story is correct."
      ],
      "takeaway": "Reconcile a complete currency story — show the relationship and its boundary.",
      "demi": "Pause and explain your reasoning before revealing the next card."
    }
  ]
};
