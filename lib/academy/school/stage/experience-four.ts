import type {StageExperience} from './contracts';
/** Public teaching scenes: no private grading or instructor-bank imports. */
export const EXPERIENCE_FOUR:StageExperience={
  "classId": "stage-1-class-4",
  "academicVersion": "stage-1-class-4.1.0.0",
  "revision": "class-4-experience-1",
  "format": "basket",
  "sections": [
    {
      "sectionId": "class-4-section-1",
      "hook": "A club has 60 units. Rental rises from 10 to 12 per hour. What changed?",
      "scenario": "Hypothetical: 24 currency units buy six journeys at 4 each, but only four journeys at 6 each. The balance is unchanged; its command over journeys is smaller.",
      "visual": {
        "kind": "basket",
        "nodes": [
          {
            "label": "Before: 24 units",
            "detail": "Six journeys at 4 units each.",
            "value": 6
          },
          {
            "label": "After: 24 units",
            "detail": "Four journeys at 6 units each.",
            "value": 4
          }
        ],
        "caption": "Hypothetical figures only. Compare the base, quantity and period before interpreting a percentage."
      },
      "practice": [
        {
          "id": "class-4-1-practice",
          "kind": "choice",
          "prompt": "A club has 60 units. Rental rises from 10 to 12 per hour. What changed?",
          "options": [
            {
              "id": "class-4-1-practice-a",
              "label": "It can rent five hours rather than six."
            },
            {
              "id": "class-4-1-practice-b",
              "label": "It can rent more because the balance is unchanged."
            }
          ],
          "correct": "class-4-1-practice-a",
          "explanation": "It can rent five hours rather than six. A price change can force substitution: a household may buy fewer journeys or switch products. That response changes its actual spending, so a smaller receipt does not by itself prove prices fell. Keep a fixed purchase separate from the choices people make in response.",
          "retry": "Re-read the scenario and identify the changed quantity or assumption before choosing again."
        }
      ],
      "explanation": [
        "Purchasing power describes the goods and services an amount of money can command. A balance can stay unchanged while the quantity it buys changes. Start with quantities and prices before attaching a percentage to the change.",
        "A price change can force substitution: a household may buy fewer journeys or switch products. That response changes its actual spending, so a smaller receipt does not by itself prove prices fell. Keep a fixed purchase separate from the choices people make in response."
      ],
      "takeaway": "Compare what a fixed sum can purchase at different prices.",
      "demi": "Before calculating, name the original base and the period. After calculating, say what this basket cannot tell you."
    },
    {
      "sectionId": "class-4-section-2",
      "hook": "Two meals and four rides: which price change matters to the full basket?",
      "scenario": "Hypothetical basket: two meals at 10 plus four rides at 5 costs 40. Later meals are 12 and rides 5, so the same basket costs 44: (44 − 40) / 40 × 100 = 10%.",
      "visual": {
        "kind": "basket",
        "nodes": [
          {
            "label": "Old basket",
            "detail": "Two meals × 10 + four rides × 5 = 40.",
            "value": 40
          },
          {
            "label": "New basket",
            "detail": "Two meals × 12 + four rides × 5 = 44.",
            "value": 44
          },
          {
            "label": "Price change",
            "detail": "Four extra units divided by the old total 40 = 10%.",
            "value": 10
          }
        ],
        "caption": "Hypothetical figures only. Compare the base, quantity and period before interpreting a percentage."
      },
      "practice": [
        {
          "id": "class-4-basket-calculate",
          "kind": "calculate",
          "prompt": "Hypothetical fixed basket: old total 40, new total 44. Enter the percentage increase, using the old total as the base.",
          "expected": 10,
          "tolerance": 0.001,
          "explanation": "The increase is 4; 4 / 40 × 100 = 10%. This describes this basket and period, not every household.",
          "retry": "Subtract the old total first, then divide by 40 before multiplying by 100."
        }
      ],
      "explanation": [
        "An inflation index summarizes many prices with weights related to spending. Items that occupy more of the budget matter more than small purchases. Our classroom fixed basket is an intuition aid, not a replacement for statistical methods that also handle product and quality changes.",
        "For a fixed basket, first multiply each price by the unchanged quantity and add the costs. Divide the difference between new and old totals by the old total, then multiply by 100. Averaging item percentages without considering weights can misdescribe the basket."
      ],
      "takeaway": "Calculate a fixed basket change using a stated base.",
      "demi": "Before calculating, name the original base and the period. After calculating, say what this basket cannot tell you."
    },
    {
      "sectionId": "class-4-section-3",
      "hook": "An annual basket rises from 200 to 206 after rising from 180 to 200. What is defensible?",
      "scenario": "Hypothetical index: 100, then 110, then 115.5 in successive years. Annual inflation falls from 10% to 5%, while the level remains above both earlier values.",
      "visual": {
        "kind": "basket",
        "nodes": [
          {
            "label": "Base year",
            "detail": "Index starts at 100.",
            "value": 100
          },
          {
            "label": "First year",
            "detail": "Index 110: 10% annual increase.",
            "value": 110
          },
          {
            "label": "Second year",
            "detail": "Index 115.5: 5% annual increase, still rising.",
            "value": 115.5
          }
        ],
        "caption": "Hypothetical figures only. Compare the base, quantity and period before interpreting a percentage."
      },
      "practice": [
        {
          "id": "class-4-3-practice",
          "kind": "choice",
          "prompt": "An annual basket rises from 200 to 206 after rising from 180 to 200. What is defensible?",
          "options": [
            {
              "id": "class-4-3-practice-a",
              "label": "Prices rose again, but the annual rate slowed."
            },
            {
              "id": "class-4-3-practice-b",
              "label": "Prices fell because the annual rate slowed."
            }
          ],
          "correct": "class-4-3-practice-a",
          "explanation": "Prices rose again, but the annual rate slowed. If inflation falls but remains positive, prices are still rising on that measure, just more slowly. A negative inflation rate means the measured price level fell over that interval. Neither statement says every product behaved the same way.",
          "retry": "Re-read the scenario and identify the changed quantity or assumption before choosing again."
        }
      ],
      "explanation": [
        "The price level is the measured level of a basket or index. The inflation rate describes its percentage change over a specified interval. Always name that interval: an annual comparison and a monthly comparison answer different questions.",
        "If inflation falls but remains positive, prices are still rising on that measure, just more slowly. A negative inflation rate means the measured price level fell over that interval. Neither statement says every product behaved the same way."
      ],
      "takeaway": "Distinguish the inflation rate from the price level.",
      "demi": "Before calculating, name the original base and the period. After calculating, say what this basket cannot tell you."
    },
    {
      "sectionId": "class-4-section-4",
      "hook": "An allowance and its basket both rise by 8%. What happens to basket purchasing power?",
      "scenario": "Hypothetical annual allowance rises from 100 to 105, while a basket rises from 100 to 110. The allowance is larger in units but buys only 105 / 110 of the former basket.",
      "visual": {
        "kind": "basket",
        "nodes": [
          {
            "label": "Nominal allowance",
            "detail": "100 becomes 105: 5% growth.",
            "value": 105
          },
          {
            "label": "Basket prices",
            "detail": "100 becomes 110: 10% growth.",
            "value": 110
          },
          {
            "label": "Real comparison",
            "detail": "1.05 / 1.10 ≈ 0.9545 of the earlier basket.",
            "value": 95.45
          }
        ],
        "caption": "Hypothetical figures only. Compare the base, quantity and period before interpreting a percentage."
      },
      "practice": [
        {
          "id": "class-4-real-calculate",
          "kind": "calculate",
          "prompt": "Hypothetical annual balance growth is 5% and basket growth is 10%. Enter the purchasing-power change as a percentage to two decimal places: ((1.05 / 1.10) − 1) × 100.",
          "expected": -4.55,
          "tolerance": 0.01,
          "explanation": "The exact change is about −4.55%. The nominal balance grows while its command over this basket falls. Simply subtracting 10 from 5 gives an approximation, not the exact ratio result.",
          "retry": "Divide 1.05 by 1.10 first. Subtract one and multiply by 100; the result should be negative."
        }
      ],
      "explanation": [
        "Nominal amounts are measured in money units. A real comparison adjusts for a specified price measure to ask what the money can buy. The right comparison depends on the basket and dates; a national index need not match one household’s expenses.",
        "For an exact simple comparison, divide the factor of nominal growth by the factor of price growth. Subtracting inflation from nominal growth is only an approximation. If money grows 5% and the basket 10%, the real factor is 1.05 / 1.10, below one."
      ],
      "takeaway": "Interpret a nominal change after accounting for basket prices.",
      "demi": "Before calculating, name the original base and the period. After calculating, say what this basket cannot tell you."
    },
    {
      "sectionId": "class-4-section-5",
      "hook": "An annual rate is not yet an interest amount. What else must you know?",
      "scenario": "Hypothetical: 300 units at 4% simple annual interest for one year earn 300 × 0.04 × 1 = 12, giving 312. If the relevant basket rises 6%, the larger balance still buys less of it.",
      "visual": {
        "kind": "basket",
        "nodes": [
          {
            "label": "Principal",
            "detail": "300 units at the start.",
            "value": 300
          },
          {
            "label": "Interest",
            "detail": "300 × 0.04 × 1 = 12 units.",
            "value": 12
          },
          {
            "label": "Final nominal balance",
            "detail": "312 before fees and tax; real command depends on prices.",
            "value": 312
          }
        ],
        "caption": "Hypothetical figures only. Compare the base, quantity and period before interpreting a percentage."
      },
      "practice": [
        {
          "id": "class-4-interest-calculate",
          "kind": "calculate",
          "prompt": "Hypothetical one-year simple interest: principal 300, annual rate 4%, no fees or tax. Enter interest earned in units.",
          "expected": 12,
          "tolerance": 0.001,
          "explanation": "300 × 0.04 × 1 = 12 units; the final nominal balance is 312. Purchasing power still depends on prices.",
          "retry": "Use 4 / 100 as the rate and calculate interest, not the final balance."
        }
      ],
      "explanation": [
        "Interest is a payment linked to borrowing or placing money under an agreement. A rate needs a period and a base amount. An annual percentage alone does not tell you the final amount without knowing duration, compounding, fees and contractual terms.",
        "Simple interest uses the original principal throughout: principal × annual rate × years. Compound interest adds interest to the balance used in later calculations. Here we isolate one year, assume no fees or tax, and do not treat a hypothetical rate as an offer or policy forecast."
      ],
      "takeaway": "Calculate simple interest with explicit assumptions.",
      "demi": "Before calculating, name the original base and the period. After calculating, say what this basket cannot tell you."
    },
    {
      "sectionId": "class-4-section-6",
      "hook": "Rates rise while an energy shortage continues. Which statement is careful?",
      "scenario": "Hypothetical: storm damage cuts vegetable supply while shipping costs rise and demand for meals stays strong. Several mechanisms could raise costs. We would need data on weights, duration and spending before assigning responsibility.",
      "visual": {
        "kind": "basket",
        "nodes": [
          {
            "label": "Supply disruption",
            "detail": "Storm damage reduces available vegetables."
          },
          {
            "label": "Input costs",
            "detail": "Shipping costs also rise."
          },
          {
            "label": "Policy conditions",
            "detail": "Demand may respond to rates over time; missing supply remains."
          }
        ],
        "caption": "Hypothetical figures only. Compare the base, quantity and period before interpreting a percentage."
      },
      "practice": [
        {
          "id": "class-4-6-practice",
          "kind": "choice",
          "prompt": "Rates rise while an energy shortage continues. Which statement is careful?",
          "options": [
            {
              "id": "class-4-6-practice-b",
              "label": "All prices must immediately return to their old levels."
            },
            {
              "id": "class-4-6-practice-a",
              "label": "Demand may cool over time, but the shortage and uncertain transmission still matter."
            }
          ],
          "correct": "class-4-6-practice-a",
          "explanation": "Demand may cool over time, but the shortage and uncertain transmission still matter. Central banks can influence financial conditions through policy, but changes pass through borrowing, saving, demand and expectations with delays and uncertainty. Raising rates cannot directly produce a missing crop. Institutional mandates and tools differ by jurisdiction; one policy move does not guarantee an immediate price reversal.",
          "retry": "Re-read the scenario and identify the changed quantity or assumption before choosing again."
        },
        {
          "id": "class-4-causes-reflect",
          "kind": "reflect",
          "prompt": "A storm, higher shipping costs and strong restaurant demand occur together. Name two possible mechanisms and one piece of evidence you would need before assigning their relative importance.",
          "explanation": "Supply availability, input costs and spending can interact. Basket weights, timing, quantities and spending data help separate a plausible explanation from a confident assertion.",
          "retry": "Start with the cost or quantity each mechanism changes, then identify a comparison that could test your explanation."
        }
      ],
      "explanation": [
        "Prices can be influenced by spending relative to productive capacity, supply disruptions, input costs, exchange rates and expectations. A disrupted harvest can affect food while broader spending conditions affect many markets. Naming an influence does not prove its size or persistence.",
        "Central banks can influence financial conditions through policy, but changes pass through borrowing, saving, demand and expectations with delays and uncertainty. Raising rates cannot directly produce a missing crop. Institutional mandates and tools differ by jurisdiction; one policy move does not guarantee an immediate price reversal."
      ],
      "takeaway": "Explain inflation using multiple influences and conditional policy effects.",
      "demi": "Before calculating, name the original base and the period. After calculating, say what this basket cannot tell you."
    }
  ]
};
