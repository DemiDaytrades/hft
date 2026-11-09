import type {StageExperience} from '../stage/contracts';
/** Public teaching scenes; no private banks or grading rubrics. */
export const EXPERIENCE_S2_5:StageExperience={
  "classId": "stage-2-class-5",
  "academicVersion": "stage-2-class-5.1.0.0",
  "revision": "s2-5-experience-1",
  "format": "decisions",
  "sections": [
    {
      "sectionId": "s2-5-section-1",
      "hook": "One fictional lot is 25,000 base units. How many base units are 0.4 lot?",
      "scenario": "Teaching FX contract: one lot = 100,000 EUR. Therefore 0.02 lot = 2,000 EUR, not 2,000 USD.",
      "visual": {
        "kind": "decisions",
        "nodes": [
          {
            "label": "Contract",
            "detail": "100,000 EUR/lot"
          },
          {
            "label": "Quantity",
            "detail": "0.02 lot"
          },
          {
            "label": "Units",
            "detail": "2,000 EUR"
          }
        ],
        "caption": "A lot needs a contract — fictional teaching inputs; specifications and dated context govern interpretation."
      },
      "practice": [
        {
          "id": "s2-5-practice-1",
          "kind": "calculate",
          "prompt": "One fictional lot is 25,000 base units. How many base units are 0.4 lot? Enter the numerical amount in the requested units.",
          "explanation": "10,000 base units. Units describe a quantity of the specified product. A lot is a contractual grouping of units, not a universal amount. An FX lot specification cannot be silently reused for a metal CFD or another provider’s contract. Missing contract size is missing evidence.",
          "retry": "Separate quantity, exposure and collateral before interpreting the claim.",
          "expected": 10000,
          "tolerance": 0.001
        }
      ],
      "explanation": [
        "Units describe a quantity of the specified product. A lot is a contractual grouping of units, not a universal amount. An FX lot specification cannot be silently reused for a metal CFD or another provider’s contract. Missing contract size is missing evidence."
      ],
      "takeaway": "10,000 base units",
      "demi": "Keep exposure visible when the collateral figure changes."
    },
    {
      "sectionId": "s2-5-section-2",
      "hook": "3,000 EUR at 1.0800 USD/EUR: what is quote-currency notional?",
      "scenario": "2,000 EUR × 1.1000 USD/EUR = 2,200 USD notional.",
      "visual": {
        "kind": "decisions",
        "nodes": [
          {
            "label": "Base quantity",
            "detail": "2,000 EUR"
          },
          {
            "label": "Rate",
            "detail": "1.1000 USD/EUR"
          },
          {
            "label": "Notional",
            "detail": "2,200 USD"
          }
        ],
        "caption": "Price connects quantity and value — fictional teaching inputs; specifications and dated context govern interpretation."
      },
      "practice": [
        {
          "id": "s2-5-practice-2",
          "kind": "calculate",
          "prompt": "3,000 EUR at 1.0800 USD/EUR: what is quote-currency notional? Enter the numerical amount in the requested units.",
          "explanation": "3,240 USD. Notional exposure is the value represented by the position under stated pricing assumptions. Multiplying base currency units by quote currency per base unit gives quote-currency notional. Label both quantities; this is not an account-currency risk calculation.",
          "retry": "Separate quantity, exposure and collateral before interpreting the claim.",
          "expected": 3240,
          "tolerance": 0.001
        }
      ],
      "explanation": [
        "Notional exposure is the value represented by the position under stated pricing assumptions. Multiplying base currency units by quote currency per base unit gives quote-currency notional. Label both quantities; this is not an account-currency risk calculation."
      ],
      "takeaway": "3,240 USD",
      "demi": "Keep exposure visible when the collateral figure changes."
    },
    {
      "sectionId": "s2-5-section-3",
      "hook": "12,000 USD notional at assumed 30:1 initial leverage: calculate margin.",
      "scenario": "10,000 USD notional / 20 = 500 USD assumed initial margin; at 50:1 it is 200 USD.",
      "visual": {
        "kind": "decisions",
        "nodes": [
          {
            "label": "Exposure unchanged",
            "detail": "10,000 USD"
          },
          {
            "label": "20:1",
            "detail": "500 USD margin"
          },
          {
            "label": "50:1",
            "detail": "200 USD margin"
          }
        ],
        "caption": "Collateral does not shrink exposure — fictional teaching inputs; specifications and dated context govern interpretation."
      },
      "practice": [
        {
          "id": "s2-5-practice-3",
          "kind": "calculate",
          "prompt": "12,000 USD notional at assumed 30:1 initial leverage: calculate margin. Enter the numerical amount in the requested units.",
          "explanation": "400 USD. Under a deliberately simplified fixed 20:1 initial leverage assumption, required margin is notional divided by 20. Actual provider requirements may involve tiers, currency conversion or changing rates. Initial collateral is a condition of holding exposure; it does not remove that exposure.",
          "retry": "Separate quantity, exposure and collateral before interpreting the claim.",
          "expected": 400,
          "tolerance": 0.001
        }
      ],
      "explanation": [
        "Under a deliberately simplified fixed 20:1 initial leverage assumption, required margin is notional divided by 20. Actual provider requirements may involve tiers, currency conversion or changing rates. Initial collateral is a condition of holding exposure; it does not remove that exposure."
      ],
      "takeaway": "400 USD",
      "demi": "Keep exposure visible when the collateral figure changes."
    },
    {
      "sectionId": "s2-5-section-4",
      "hook": "Same 8,000 USD exposure under two collateral settings: a 3% adverse linear move changes value by what amount?",
      "scenario": "10,000 × 0.02 = 200 USD adverse change at either initial-margin setting.",
      "visual": {
        "kind": "decisions",
        "nodes": [
          {
            "label": "Exposure",
            "detail": "8,000 USD each"
          },
          {
            "label": "Adverse move",
            "detail": "3% each"
          },
          {
            "label": "Effect",
            "detail": "240 USD each"
          }
        ],
        "caption": "The same move affects the same exposure — fictional teaching inputs; specifications and dated context govern interpretation."
      },
      "practice": [
        {
          "id": "s2-5-practice-4",
          "kind": "calculate",
          "prompt": "Same 8,000 USD exposure under two collateral settings: a 3% adverse linear move changes value by what amount? Enter the numerical amount in the requested units.",
          "explanation": "240 USD under either setting. With exposure held constant, increasing leverage reduces the assumed initial collateral, not the price movement’s consequence. For this toy linear exposure, a 2% adverse change on 10,000 USD represents about 200 USD before other effects. It consumes more of 200 collateral than of 500; that observation is not a risk budget.",
          "retry": "Separate quantity, exposure and collateral before interpreting the claim.",
          "expected": 240,
          "tolerance": 0.001
        }
      ],
      "explanation": [
        "With exposure held constant, increasing leverage reduces the assumed initial collateral, not the price movement’s consequence. For this toy linear exposure, a 2% adverse change on 10,000 USD represents about 200 USD before other effects. It consumes more of 200 collateral than of 500; that observation is not a risk budget."
      ],
      "takeaway": "240 USD under either setting",
      "demi": "Keep exposure visible when the collateral figure changes."
    },
    {
      "sectionId": "s2-5-section-5",
      "hook": "A ticket shows 300 USD margin but no verified loss protection. May the learner call 300 the maximum possible loss?",
      "scenario": "A fictional gap takes a position past an expected exit level before an available price appears. Collateral posted at entry does not specify the final loss.",
      "visual": {
        "kind": "decisions",
        "nodes": [
          {
            "label": "Entry collateral",
            "detail": "300 USD"
          },
          {
            "label": "Gap",
            "detail": "Expected exit may be skipped"
          },
          {
            "label": "Unknown",
            "detail": "Final loss and applicable protections"
          }
        ],
        "caption": "Margin calls are not protective promises — fictional teaching inputs; specifications and dated context govern interpretation."
      },
      "practice": [
        {
          "id": "s2-5-practice-5",
          "kind": "reflect",
          "prompt": "A ticket shows 300 USD margin but no verified loss protection. May the learner call 300 the maximum possible loss?",
          "explanation": "No; collateral does not establish a loss cap. Providers may require more collateral or close positions when maintenance conditions fail. Timing, thresholds and liquidation procedures depend on the agreement and jurisdiction. A requested stop is not a guaranteed fill: gaps and thin conditions can produce worse execution, and protections must be verified rather than assumed.",
          "retry": "Separate quantity, exposure and collateral before interpreting the claim."
        }
      ],
      "explanation": [
        "Providers may require more collateral or close positions when maintenance conditions fail. Timing, thresholds and liquidation procedures depend on the agreement and jurisdiction. A requested stop is not a guaranteed fill: gaps and thin conditions can produce worse execution, and protections must be verified rather than assumed."
      ],
      "takeaway": "No; collateral does not establish a loss cap",
      "demi": "Keep exposure visible when the collateral figure changes."
    },
    {
      "sectionId": "s2-5-section-6",
      "hook": "A fictional metal ticket says 0.2 lot but supplies no ounces per lot. What should you do before valuing it?",
      "scenario": "A screen shows 0.5 lot and 100:1 but omits the contract and quote units. No reliable notional or margin calculation follows.",
      "visual": {
        "kind": "decisions",
        "nodes": [
          {
            "label": "Verify",
            "detail": "Product and contract"
          },
          {
            "label": "Label",
            "detail": "Units and account currency"
          },
          {
            "label": "Pause",
            "detail": "Missing terms prevent calculation"
          }
        ],
        "caption": "Refuse an incomplete product — fictional teaching inputs; specifications and dated context govern interpretation."
      },
      "practice": [
        {
          "id": "s2-5-practice-6",
          "kind": "reflect",
          "prompt": "A fictional metal ticket says 0.2 lot but supplies no ounces per lot. What should you do before valuing it?",
          "explanation": "Request contract size and units; do not infer FX units. A safe mechanics explanation can end with an unresolved question. Verify product type, contract size, price units, leverage/margin rules and account currency before computing. These classroom calculations do not establish personal affordability, permission to trade or an appropriate allocation.",
          "retry": "Separate quantity, exposure and collateral before interpreting the claim."
        }
      ],
      "explanation": [
        "A safe mechanics explanation can end with an unresolved question. Verify product type, contract size, price units, leverage/margin rules and account currency before computing. These classroom calculations do not establish personal affordability, permission to trade or an appropriate allocation."
      ],
      "takeaway": "Request contract size and units; do not infer FX units",
      "demi": "Keep exposure visible when the collateral figure changes."
    }
  ]
};
