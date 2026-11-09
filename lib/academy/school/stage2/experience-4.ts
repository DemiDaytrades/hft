import type {StageExperience} from '../stage/contracts';
/** Public teaching scenes; no private banks or grading rubrics. */
export const EXPERIENCE_S2_4:StageExperience={
  "classId": "stage-2-class-4",
  "academicVersion": "stage-2-class-4.1.0.0",
  "revision": "s2-4-experience-1",
  "format": "quote",
  "sections": [
    {
      "sectionId": "s2-4-section-1",
      "hook": "With pip 0.0001, how many pips is a change of +0.0007?",
      "scenario": "EUR/USD teaching specification: one pip = 0.0001 USD per EUR; display increment = 0.00001.",
      "visual": {
        "kind": "quote",
        "nodes": [
          {
            "label": "Pip",
            "detail": "0.0001 USD/EUR"
          },
          {
            "label": "Display increment",
            "detail": "0.00001 USD/EUR"
          }
        ],
        "caption": "Read the measuring ruler — fictional teaching inputs; specifications and dated context govern interpretation."
      },
      "practice": [
        {
          "id": "s2-4-practice-1",
          "kind": "calculate",
          "prompt": "With pip 0.0001, how many pips is a change of +0.0007? Enter the signed pip number only.",
          "explanation": "+7 pips. A quote is a rate; a pip is a specified price increment used to describe a change in that rate. Read the product specification before counting digits. The familiar 0.0001 convention applies only when supplied, not to every symbol bearing a currency name.",
          "retry": "Rebuild the ruler from the specified increment and keep the sign.",
          "expected": 7,
          "tolerance": 1e-05
        }
      ],
      "explanation": [
        "A quote is a rate; a pip is a specified price increment used to describe a change in that rate. Read the product specification before counting digits. The familiar 0.0001 convention applies only when supplied, not to every symbol bearing a currency name."
      ],
      "takeaway": "+7 pips",
      "demi": "Show your units before trusting the number."
    },
    {
      "sectionId": "s2-4-section-2",
      "hook": "EUR/USD 1.10640 → 1.10710, pip 0.0001: state signed and absolute movement.",
      "scenario": "EUR/USD 1.08420 → 1.08270: −0.00150 / 0.0001 = −15 pips. Absolute movement is 15 pips.",
      "visual": {
        "kind": "quote",
        "nodes": [
          {
            "label": "Start",
            "detail": "1.08420"
          },
          {
            "label": "End",
            "detail": "1.08270"
          },
          {
            "label": "Signed difference",
            "detail": "−0.00150 = −15 pips"
          }
        ],
        "caption": "Keep the sign attached — fictional teaching inputs; specifications and dated context govern interpretation."
      },
      "practice": [
        {
          "id": "s2-4-practice-2",
          "kind": "calculate",
          "prompt": "EUR/USD 1.10640 → 1.10710, pip 0.0001: state signed and absolute movement. Enter the signed pip number only.",
          "explanation": "+7 pips; absolute 7. Compute end quote minus start quote, then divide by the supplied pip increment. A negative result means the quoted base currency buys fewer quote units. Signed movement is not trade profit: direction of a hypothetical holding and costs would also matter.",
          "retry": "Rebuild the ruler from the specified increment and keep the sign.",
          "expected": 7,
          "tolerance": 1e-05
        }
      ],
      "explanation": [
        "Compute end quote minus start quote, then divide by the supplied pip increment. A negative result means the quoted base currency buys fewer quote units. Signed movement is not trade profit: direction of a hypothetical holding and costs would also matter."
      ],
      "takeaway": "+7 pips; absolute 7",
      "demi": "Show your units before trusting the number."
    },
    {
      "sectionId": "s2-4-section-3",
      "hook": "USD/JPY 151.240 → 151.395, pip 0.01: measure signed pips.",
      "scenario": "USD/JPY 149.325 → 149.185: −0.140 / 0.01 = −14 pips.",
      "visual": {
        "kind": "quote",
        "nodes": [
          {
            "label": "Pip",
            "detail": "0.01 JPY/USD"
          },
          {
            "label": "Display increment",
            "detail": "0.001 JPY/USD"
          },
          {
            "label": "Movement",
            "detail": "−14 pips"
          }
        ],
        "caption": "JPY changes the scale — fictional teaching inputs; specifications and dated context govern interpretation."
      },
      "practice": [
        {
          "id": "s2-4-practice-3",
          "kind": "calculate",
          "prompt": "USD/JPY 151.240 → 151.395, pip 0.01: measure signed pips. Enter the signed pip number only.",
          "explanation": "+15.5 pips. For the supplied USD/JPY specification one pip is 0.01 JPY per USD and the fractional display increment is 0.001. Dividing a JPY-style change by 0.0001 would measure it with the wrong ruler. Product specifications remain the authority even where a convention is common.",
          "retry": "Rebuild the ruler from the specified increment and keep the sign.",
          "expected": 15.5,
          "tolerance": 1e-05
        }
      ],
      "explanation": [
        "For the supplied USD/JPY specification one pip is 0.01 JPY per USD and the fractional display increment is 0.001. Dividing a JPY-style change by 0.0001 would measure it with the wrong ruler. Product specifications remain the authority even where a convention is common."
      ],
      "takeaway": "+15.5 pips",
      "demi": "Show your units before trusting the number."
    },
    {
      "sectionId": "s2-4-section-4",
      "hook": "Pip 0.0001 and display 0.00001: express a +0.00003 move in pips and display increments.",
      "scenario": "1.20004 → 1.20009 is +0.00005, or +0.5 pip with pip 0.0001.",
      "visual": {
        "kind": "quote",
        "nodes": [
          {
            "label": "Three display steps",
            "detail": "0.00003"
          },
          {
            "label": "One pip",
            "detail": "Ten display steps"
          }
        ],
        "caption": "A fraction is still measurable — fictional teaching inputs; specifications and dated context govern interpretation."
      },
      "practice": [
        {
          "id": "s2-4-practice-4",
          "kind": "calculate",
          "prompt": "Pip 0.0001 and display 0.00001: express a +0.00003 move in pips and display increments. Enter the signed pip number only.",
          "explanation": "+0.3 pip and three display increments. Displayed precision determines which increments can be shown, not the size of a whole pip. Under a five-decimal EUR/USD display, one final digit is one tenth of a 0.0001 pip. More digits do not establish greater accuracy, liquidity or cheaper execution.",
          "retry": "Rebuild the ruler from the specified increment and keep the sign.",
          "expected": 0.3,
          "tolerance": 1e-05
        }
      ],
      "explanation": [
        "Displayed precision determines which increments can be shown, not the size of a whole pip. Under a five-decimal EUR/USD display, one final digit is one tenth of a 0.0001 pip. More digits do not establish greater accuracy, liquidity or cheaper execution."
      ],
      "takeaway": "+0.3 pip and three display increments",
      "demi": "Show your units before trusting the number."
    },
    {
      "sectionId": "s2-4-section-5",
      "hook": "Fictional X/Y pip 0.005: 8.125 → 8.145. Measure the signed movement.",
      "scenario": "Fictional Q/R: pip 0.001, display step 0.0005; 2.4500 → 2.4475 gives −2.5 pips and five downward display steps.",
      "visual": {
        "kind": "quote",
        "nodes": [
          {
            "label": "Specification",
            "detail": "Pip = 0.001"
          },
          {
            "label": "Difference",
            "detail": "−0.0025"
          },
          {
            "label": "Result",
            "detail": "−2.5 pips"
          }
        ],
        "caption": "Honor an unfamiliar specification — fictional teaching inputs; specifications and dated context govern interpretation."
      },
      "practice": [
        {
          "id": "s2-4-practice-5",
          "kind": "calculate",
          "prompt": "Fictional X/Y pip 0.005: 8.125 → 8.145. Measure the signed movement. Enter the signed pip number only.",
          "explanation": "+4 pips. Pip terminology is not a universal law. A fictional provider may explicitly define a teaching pip of 0.001 and a minimum price increment of 0.0005. Keep that specification visible; if its terms are missing or contradictory, request clarification rather than importing a familiar convention.",
          "retry": "Rebuild the ruler from the specified increment and keep the sign.",
          "expected": 4,
          "tolerance": 1e-05
        }
      ],
      "explanation": [
        "Pip terminology is not a universal law. A fictional provider may explicitly define a teaching pip of 0.001 and a minimum price increment of 0.0005. Keep that specification visible; if its terms are missing or contradictory, request clarification rather than importing a familiar convention."
      ],
      "takeaway": "+4 pips",
      "demi": "Show your units before trusting the number."
    },
    {
      "sectionId": "s2-4-section-6",
      "hook": "Audit a claim that 148.260 → 148.235 with pip 0.01 is +25 pips; correct it.",
      "scenario": "Audit −14 × 0.01 = −0.140 JPY/USD, matching 149.185 − 149.325.",
      "visual": {
        "kind": "quote",
        "nodes": [
          {
            "label": "Subtract",
            "detail": "End − start"
          },
          {
            "label": "Divide",
            "detail": "Use supplied pip"
          },
          {
            "label": "Audit",
            "detail": "Result × pip = difference"
          }
        ],
        "caption": "Audit the calculation trail — fictional teaching inputs; specifications and dated context govern interpretation."
      },
      "practice": [
        {
          "id": "s2-4-practice-6",
          "kind": "reflect",
          "prompt": "Audit a claim that 148.260 → 148.235 with pip 0.01 is +25 pips; correct it.",
          "explanation": "−2.5 pips; subtraction is −0.025 JPY/USD. A useful movement record includes symbol, endpoints in time order, quote units, pip specification, subtraction and signed result. Test the answer by multiplying pips back by the pip increment. This catches scale mistakes before a polished explanation conceals them. Account-currency pip value and sizing wait until Stage 7.",
          "retry": "Rebuild the ruler from the specified increment and keep the sign."
        }
      ],
      "explanation": [
        "A useful movement record includes symbol, endpoints in time order, quote units, pip specification, subtraction and signed result. Test the answer by multiplying pips back by the pip increment. This catches scale mistakes before a polished explanation conceals them. Account-currency pip value and sizing wait until Stage 7."
      ],
      "takeaway": "−2.5 pips; subtraction is −0.025 JPY/USD",
      "demi": "Show your units before trusting the number."
    }
  ]
};
