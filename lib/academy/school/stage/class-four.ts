import 'server-only';
import type {StageClass} from './contracts';
/** Private immutable curriculum definition; project student transport explicitly. */
export const CLASS_FOUR:StageClass={
  "id": "stage-1-class-4",
  "version": "stage-1-class-4.1.0.0",
  "stageId": "stage-1",
  "number": 4,
  "title": "Inflation, Purchasing Power & Interest Rates",
  "description": "Compare quantities and money separately. State the basket, base and period before interpreting a rate; use conditional explanations for causes and policy.",
  "courseId": "hft-school-foundations",
  "lessonId": "hft-school-class-4",
  "prerequisites": [
    "stage-1-class-3"
  ],
  "liveMinutes": 60,
  "reviewMinutes": 30,
  "objectives": [
    {
      "id": "class-4-objective-1",
      "text": "Compare what a fixed sum can purchase at different prices.",
      "competency": "S1_C4_1"
    },
    {
      "id": "class-4-objective-2",
      "text": "Calculate a fixed basket change using a stated base.",
      "competency": "S1_C4_2"
    },
    {
      "id": "class-4-objective-3",
      "text": "Distinguish the inflation rate from the price level.",
      "competency": "S1_C4_3"
    },
    {
      "id": "class-4-objective-4",
      "text": "Interpret a nominal change after accounting for basket prices.",
      "competency": "S1_C4_4"
    },
    {
      "id": "class-4-objective-5",
      "text": "Calculate simple interest with explicit assumptions.",
      "competency": "S1_C4_5"
    },
    {
      "id": "class-4-objective-6",
      "text": "Explain inflation using multiple influences and conditional policy effects.",
      "competency": "S1_C4_6"
    }
  ],
  "terms": [
    {
      "term": "Purchasing power",
      "definition": "The goods and services a sum of money can buy at stated prices."
    },
    {
      "term": "Inflation rate",
      "definition": "Percentage change in a broad price measure over a specified interval."
    },
    {
      "term": "Price level",
      "definition": "The level of a specified basket or index, distinct from its rate of change."
    },
    {
      "term": "Nominal",
      "definition": "Measured in money units before adjusting for a price measure."
    },
    {
      "term": "Simple interest",
      "definition": "Interest calculated on the original principal for the stated rate and duration."
    }
  ],
  "sections": [
    {
      "id": "class-4-section-1",
      "title": "The same money, a changing purchase",
      "objectiveId": "class-4-objective-1",
      "competency": "S1_C4_1",
      "paragraphs": [
        "Purchasing power describes the goods and services an amount of money can command. A balance can stay unchanged while the quantity it buys changes. Start with quantities and prices before attaching a percentage to the change.",
        "A price change can force substitution: a household may buy fewer journeys or switch products. That response changes its actual spending, so a smaller receipt does not by itself prove prices fell. Keep a fixed purchase separate from the choices people make in response."
      ],
      "example": "Hypothetical: 24 currency units buy six journeys at 4 each, but only four journeys at 6 each. The balance is unchanged; its command over journeys is smaller.",
      "misconception": "An unchanged money balance means unchanged purchasing power.",
      "visual": "none",
      "activities": [
        {
          "id": "class-4-1-explore",
          "kind": "choice",
          "category": "APPLICATION",
          "sectionId": "class-4-section-1",
          "objectiveId": "class-4-objective-1",
          "competency": "S1_C4_1",
          "prompt": "A club has 60 units. Rental rises from 10 to 12 per hour. What changed?",
          "options": [
            {
              "id": "class-4-1-explore-a",
              "label": "It can rent five hours rather than six."
            },
            {
              "id": "class-4-1-explore-b",
              "label": "It can rent more because the balance is unchanged."
            }
          ],
          "correct": "class-4-1-explore-a"
        }
      ]
    },
    {
      "id": "class-4-section-2",
      "title": "Build a basket before measuring change",
      "objectiveId": "class-4-objective-2",
      "competency": "S1_C4_2",
      "paragraphs": [
        "An inflation index summarizes many prices with weights related to spending. Items that occupy more of the budget matter more than small purchases. Our classroom fixed basket is an intuition aid, not a replacement for statistical methods that also handle product and quality changes.",
        "For a fixed basket, first multiply each price by the unchanged quantity and add the costs. Divide the difference between new and old totals by the old total, then multiply by 100. Averaging item percentages without considering weights can misdescribe the basket."
      ],
      "example": "Hypothetical basket: two meals at 10 plus four rides at 5 costs 40. Later meals are 12 and rides 5, so the same basket costs 44: (44 − 40) / 40 × 100 = 10%.",
      "misconception": "A 20% rise in one item means the whole basket rose 20%.",
      "visual": "none",
      "activities": [
        {
          "id": "class-4-2-explore",
          "kind": "choice",
          "category": "APPLICATION",
          "sectionId": "class-4-section-2",
          "objectiveId": "class-4-objective-2",
          "competency": "S1_C4_2",
          "prompt": "The basket moves from 40 to 44. Which calculation gives its percentage change?",
          "options": [
            {
              "id": "class-4-2-explore-b",
              "label": "4 / 44 × 100 = about 9.1%."
            },
            {
              "id": "class-4-2-explore-a",
              "label": "4 / 40 × 100 = 10%."
            }
          ],
          "correct": "class-4-2-explore-a"
        }
      ]
    },
    {
      "id": "class-4-section-3",
      "title": "A slower rise is still a rise",
      "objectiveId": "class-4-objective-3",
      "competency": "S1_C4_3",
      "paragraphs": [
        "The price level is the measured level of a basket or index. The inflation rate describes its percentage change over a specified interval. Always name that interval: an annual comparison and a monthly comparison answer different questions.",
        "If inflation falls but remains positive, prices are still rising on that measure, just more slowly. A negative inflation rate means the measured price level fell over that interval. Neither statement says every product behaved the same way."
      ],
      "example": "Hypothetical index: 100, then 110, then 115.5 in successive years. Annual inflation falls from 10% to 5%, while the level remains above both earlier values.",
      "misconception": "Lower inflation necessarily restores last year’s prices.",
      "visual": "none",
      "activities": [
        {
          "id": "class-4-3-explore",
          "kind": "choice",
          "category": "APPLICATION",
          "sectionId": "class-4-section-3",
          "objectiveId": "class-4-objective-3",
          "competency": "S1_C4_3",
          "prompt": "An annual basket rises from 200 to 206 after rising from 180 to 200. What is defensible?",
          "options": [
            {
              "id": "class-4-3-explore-a",
              "label": "Prices rose again, but the annual rate slowed."
            },
            {
              "id": "class-4-3-explore-b",
              "label": "Prices fell because the annual rate slowed."
            }
          ],
          "correct": "class-4-3-explore-a"
        }
      ]
    },
    {
      "id": "class-4-section-4",
      "title": "Nominal numbers and real command",
      "objectiveId": "class-4-objective-4",
      "competency": "S1_C4_4",
      "paragraphs": [
        "Nominal amounts are measured in money units. A real comparison adjusts for a specified price measure to ask what the money can buy. The right comparison depends on the basket and dates; a national index need not match one household’s expenses.",
        "For an exact simple comparison, divide the factor of nominal growth by the factor of price growth. Subtracting inflation from nominal growth is only an approximation. If money grows 5% and the basket 10%, the real factor is 1.05 / 1.10, below one."
      ],
      "example": "Hypothetical annual allowance rises from 100 to 105, while a basket rises from 100 to 110. The allowance is larger in units but buys only 105 / 110 of the former basket.",
      "misconception": "A larger nominal amount always buys more.",
      "visual": "none",
      "activities": [
        {
          "id": "class-4-4-explore",
          "kind": "choice",
          "category": "APPLICATION",
          "sectionId": "class-4-section-4",
          "objectiveId": "class-4-objective-4",
          "competency": "S1_C4_4",
          "prompt": "An allowance and its basket both rise by 8%. What happens to basket purchasing power?",
          "options": [
            {
              "id": "class-4-4-explore-b",
              "label": "It necessarily grows by 8%."
            },
            {
              "id": "class-4-4-explore-a",
              "label": "It is unchanged in this simplified comparison."
            }
          ],
          "correct": "class-4-4-explore-a"
        }
      ]
    },
    {
      "id": "class-4-section-5",
      "title": "Interest: amount, rate and time",
      "objectiveId": "class-4-objective-5",
      "competency": "S1_C4_5",
      "paragraphs": [
        "Interest is a payment linked to borrowing or placing money under an agreement. A rate needs a period and a base amount. An annual percentage alone does not tell you the final amount without knowing duration, compounding, fees and contractual terms.",
        "Simple interest uses the original principal throughout: principal × annual rate × years. Compound interest adds interest to the balance used in later calculations. Here we isolate one year, assume no fees or tax, and do not treat a hypothetical rate as an offer or policy forecast."
      ],
      "example": "Hypothetical: 300 units at 4% simple annual interest for one year earn 300 × 0.04 × 1 = 12, giving 312. If the relevant basket rises 6%, the larger balance still buys less of it.",
      "misconception": "Interest is a fixed number of units regardless of principal or duration.",
      "visual": "none",
      "activities": [
        {
          "id": "class-4-5-explore",
          "kind": "choice",
          "category": "APPLICATION",
          "sectionId": "class-4-section-5",
          "objectiveId": "class-4-objective-5",
          "competency": "S1_C4_5",
          "prompt": "What is one year’s simple interest on 500 at 3%, ignoring fees and tax?",
          "options": [
            {
              "id": "class-4-5-explore-a",
              "label": "15 units."
            },
            {
              "id": "class-4-5-explore-b",
              "label": "150 units."
            }
          ],
          "correct": "class-4-5-explore-a"
        }
      ]
    },
    {
      "id": "class-4-section-6",
      "title": "Causes, policy and uncertainty",
      "objectiveId": "class-4-objective-6",
      "competency": "S1_C4_6",
      "paragraphs": [
        "Prices can be influenced by spending relative to productive capacity, supply disruptions, input costs, exchange rates and expectations. A disrupted harvest can affect food while broader spending conditions affect many markets. Naming an influence does not prove its size or persistence.",
        "Central banks can influence financial conditions through policy, but changes pass through borrowing, saving, demand and expectations with delays and uncertainty. Raising rates cannot directly produce a missing crop. Institutional mandates and tools differ by jurisdiction; one policy move does not guarantee an immediate price reversal."
      ],
      "example": "Hypothetical: storm damage cuts vegetable supply while shipping costs rise and demand for meals stays strong. Several mechanisms could raise costs. We would need data on weights, duration and spending before assigning responsibility.",
      "misconception": "All inflation has one cause and one immediate cure.",
      "visual": "none",
      "activities": [
        {
          "id": "class-4-6-explore",
          "kind": "choice",
          "category": "APPLICATION",
          "sectionId": "class-4-section-6",
          "objectiveId": "class-4-objective-6",
          "competency": "S1_C4_6",
          "prompt": "Rates rise while an energy shortage continues. Which statement is careful?",
          "options": [
            {
              "id": "class-4-6-explore-b",
              "label": "All prices must immediately return to their old levels."
            },
            {
              "id": "class-4-6-explore-a",
              "label": "Demand may cool over time, but the shortage and uncertain transmission still matter."
            }
          ],
          "correct": "class-4-6-explore-a"
        }
      ]
    }
  ],
  "assessment": [
    {
      "id": "class-4-1-check",
      "kind": "choice",
      "category": "APPLICATION",
      "sectionId": "class-4-section-1",
      "objectiveId": "class-4-objective-1",
      "competency": "S1_C4_1",
      "prompt": "A library has 36 units; copying rises from 3 to 4 per batch. What can it buy now?",
      "options": [
        {
          "id": "class-4-1-check-a",
          "label": "Nine batches instead of twelve."
        },
        {
          "id": "class-4-1-check-b",
          "label": "Twelve batches because 36 is unchanged."
        }
      ],
      "correct": "class-4-1-check-a"
    },
    {
      "id": "class-4-2-check",
      "kind": "choice",
      "category": "APPLICATION",
      "sectionId": "class-4-section-2",
      "objectiveId": "class-4-objective-2",
      "competency": "S1_C4_2",
      "prompt": "A fixed basket costs 80, then 84. What is the increase relative to its base?",
      "options": [
        {
          "id": "class-4-2-check-b",
          "label": "4%."
        },
        {
          "id": "class-4-2-check-a",
          "label": "5%."
        }
      ],
      "correct": "class-4-2-check-a"
    },
    {
      "id": "class-4-3-check",
      "kind": "choice",
      "category": "APPLICATION",
      "sectionId": "class-4-section-3",
      "objectiveId": "class-4-objective-3",
      "competency": "S1_C4_3",
      "prompt": "An index rises from 120 to 122.4. What does 2% inflation describe?",
      "options": [
        {
          "id": "class-4-3-check-a",
          "label": "A rise relative to the earlier level over that interval."
        },
        {
          "id": "class-4-3-check-b",
          "label": "A fall back to the original base year."
        }
      ],
      "correct": "class-4-3-check-a"
    },
    {
      "id": "class-4-4-check",
      "kind": "choice",
      "category": "APPLICATION",
      "sectionId": "class-4-section-4",
      "objectiveId": "class-4-objective-4",
      "competency": "S1_C4_4",
      "prompt": "A fund grows from 200 to 220 while its target basket rises by 5%. Which conclusion follows before fees and tax?",
      "options": [
        {
          "id": "class-4-4-check-b",
          "label": "Its purchasing power must fall because prices rose."
        },
        {
          "id": "class-4-4-check-a",
          "label": "Its basket purchasing power increases."
        }
      ],
      "correct": "class-4-4-check-a"
    },
    {
      "id": "class-4-5-check",
      "kind": "choice",
      "category": "APPLICATION",
      "sectionId": "class-4-section-5",
      "objectiveId": "class-4-objective-5",
      "competency": "S1_C4_5",
      "prompt": "A hypothetical 200-unit loan has 5% simple annual interest for two years. What interest accrues under those assumptions?",
      "options": [
        {
          "id": "class-4-5-check-a",
          "label": "20 units."
        },
        {
          "id": "class-4-5-check-b",
          "label": "10 units."
        }
      ],
      "correct": "class-4-5-check-a"
    },
    {
      "id": "class-4-6-check",
      "kind": "choice",
      "category": "APPLICATION",
      "sectionId": "class-4-section-6",
      "objectiveId": "class-4-objective-6",
      "competency": "S1_C4_6",
      "prompt": "A fuel disruption and strong spending occur together. What evidence would improve the explanation?",
      "options": [
        {
          "id": "class-4-6-check-b",
          "label": "Only the name of the policy maker."
        },
        {
          "id": "class-4-6-check-a",
          "label": "Data on affected costs, spending, basket weights and timing."
        }
      ],
      "correct": "class-4-6-check-a"
    },
    {
      "id": "class-4-reasoning",
      "kind": "written",
      "category": "REASONING",
      "sectionId": "class-4-section-6",
      "objectiveId": "class-4-objective-6",
      "competency": "S1_C4_6",
      "prompt": "A basket rises more slowly this year while borrowing costs rise and a supply disruption continues. Explain why lower inflation is not necessarily falling prices and why the causes and effects need more than one explanation.",
      "rubric": "Distinguish rate from level; name demand and supply/context influences; acknowledge delay and uncertainty. Do not require a single policy judgment."
    }
  ],
  "homework": [
    {
      "id": "class-4-1-homework-check",
      "kind": "choice",
      "category": "HOMEWORK",
      "sectionId": "class-4-section-2",
      "objectiveId": "class-4-objective-2",
      "competency": "S1_C4_2",
      "prompt": "A hypothetical basket moves from 50 to 55. Which percentage uses the correct original base?",
      "options": [
        {
          "id": "class-4-1-homework-check-a",
          "label": "10%, because 5 / 50 × 100 = 10."
        },
        {
          "id": "class-4-1-homework-check-b",
          "label": "About 9.09%, because 5 / 55 × 100 uses the correct original base."
        }
      ],
      "correct": "class-4-1-homework-check-a"
    },
    {
      "id": "class-4-homework-basket-working",
      "kind": "written",
      "category": "HOMEWORK",
      "sectionId": "class-4-section-2",
      "objectiveId": "class-4-objective-2",
      "competency": "S1_C4_2",
      "prompt": "Basket working: a fixed basket has three lunches at 8 and two trips at 3. Later lunches cost 9 and trips still cost 3. Show quantities, both totals, the difference and the original-base percentage change. Explain why changing the lunch quantity would confound a pure price comparison.",
      "rubric": "Require 3×8+2×3=30 and 3×9+2×3=33; (33−30)/30×100=10%. Check original denominator and fixed quantities; return incorrect arithmetic or reasoning for revision."
    },
    {
      "id": "class-4-homework-real-working",
      "kind": "written",
      "category": "HOMEWORK",
      "sectionId": "class-4-section-4",
      "objectiveId": "class-4-objective-4",
      "competency": "S1_C4_4",
      "prompt": "Purchasing-power working: a hypothetical fund grows from 600 to 624 while the fixed basket above rises by 10%. Calculate nominal growth and compare 1.04 / 1.10 with one. Interpret whether the fund buys more or less of that basket, and identify one limitation of applying the basket to every household.",
      "rubric": "Require nominal growth 4%; exact real change about −5.45% (1.04/1.10−1), or a correctly explained comparison below one. Credit sound interpretation with working; require stated basket limitation. A simple −6% subtraction is an approximation and must be labeled accordingly."
    },
    {
      "id": "class-4-homework-interest-working",
      "kind": "written",
      "category": "HOMEWORK",
      "sectionId": "class-4-section-5",
      "objectiveId": "class-4-objective-5",
      "competency": "S1_C4_5",
      "prompt": "Interest working: calculate one year’s simple interest and final nominal balance on 600 units at 4% annually, assuming no fees or tax. Show the rate conversion and multiplication. Explain what additional contractual information you would need for a multi-year compound-interest calculation.",
      "rubric": "Require 600×0.04×1=24 interest and 624 final balance. Distinguish interest from final balance; identify compounding frequency, duration and relevant terms rather than silently extending simple interest."
    },
    {
      "id": "class-4-homework-causal-explanation",
      "kind": "written",
      "category": "HOMEWORK",
      "sectionId": "class-4-section-6",
      "objectiveId": "class-4-objective-6",
      "competency": "S1_C4_6",
      "prompt": "A hypothetical region faces a poor harvest, rising transport costs and strong restaurant spending. Explain two distinct possible price pressures. Describe one channel through which higher policy rates might affect spending, one limitation or delay, and evidence you would need before assigning the relative causes.",
      "rubric": "Require at least two distinct mechanisms grounded in the facts, a conditional policy-demand channel, and a supply or timing limitation. Do not demand a single-cause answer or a prediction that policy immediately restores old prices."
    },
    {
      "id": "class-4-homework-reflection",
      "kind": "reflection",
      "category": "HOMEWORK",
      "sectionId": "class-4-section-6",
      "objectiveId": "class-4-objective-6",
      "competency": "S1_C4_6",
      "prompt": "Which assumption in your explanation are you least certain about? Explain what you would check next and how a different answer could change your conclusion.",
      "rubric": "Review a specific uncertainty and a relevant next check. Honest uncertainty is not an error; return only if no meaningful connection to the task is supplied."
    }
  ],
  "remediation": [
    {
      "competency": "S1_C4_1",
      "sectionId": "class-4-section-1",
      "title": "Revisit: The same money, a changing purchase",
      "paragraph": "Compare what a fixed sum can purchase at different prices. Return to the example, name the assumption that changed, and explain the difference before trying this fresh situation.",
      "reinforcement": {
        "id": "class-4-1-reinforce",
        "kind": "choice",
        "category": "APPLICATION",
        "sectionId": "class-4-section-1",
        "objectiveId": "class-4-objective-1",
        "competency": "S1_C4_1",
        "prompt": "A fixed budget buys fewer unchanged service units after their price rises. What best explains this?",
        "options": [
          {
            "id": "class-4-1-reinforce-a",
            "label": "The service purchasing power of the budget fell."
          },
          {
            "id": "class-4-1-reinforce-b",
            "label": "The number of money units must have fallen."
          }
        ],
        "correct": "class-4-1-reinforce-a"
      }
    },
    {
      "competency": "S1_C4_2",
      "sectionId": "class-4-section-2",
      "title": "Revisit: Build a basket before measuring change",
      "paragraph": "Calculate a fixed basket change using a stated base. Return to the example, name the assumption that changed, and explain the difference before trying this fresh situation.",
      "reinforcement": {
        "id": "class-4-2-reinforce",
        "kind": "choice",
        "category": "APPLICATION",
        "sectionId": "class-4-section-2",
        "objectiveId": "class-4-objective-2",
        "competency": "S1_C4_2",
        "prompt": "Why hold basket quantities fixed in a before-and-after calculation?",
        "options": [
          {
            "id": "class-4-2-reinforce-b",
            "label": "To make every product carry equal weight."
          },
          {
            "id": "class-4-2-reinforce-a",
            "label": "To isolate price changes from changes in purchases."
          }
        ],
        "correct": "class-4-2-reinforce-a"
      }
    },
    {
      "competency": "S1_C4_3",
      "sectionId": "class-4-section-3",
      "title": "Revisit: A slower rise is still a rise",
      "paragraph": "Distinguish the inflation rate from the price level. Return to the example, name the assumption that changed, and explain the difference before trying this fresh situation.",
      "reinforcement": {
        "id": "class-4-3-reinforce",
        "kind": "choice",
        "category": "APPLICATION",
        "sectionId": "class-4-section-3",
        "objectiveId": "class-4-objective-3",
        "competency": "S1_C4_3",
        "prompt": "An index falls from 150 to 147 over a year. What describes that interval?",
        "options": [
          {
            "id": "class-4-3-reinforce-a",
            "label": "Negative inflation on that index."
          },
          {
            "id": "class-4-3-reinforce-b",
            "label": "Positive inflation merely slowing."
          }
        ],
        "correct": "class-4-3-reinforce-a"
      }
    },
    {
      "competency": "S1_C4_4",
      "sectionId": "class-4-section-4",
      "title": "Revisit: Nominal numbers and real command",
      "paragraph": "Interpret a nominal change after accounting for basket prices. Return to the example, name the assumption that changed, and explain the difference before trying this fresh situation.",
      "reinforcement": {
        "id": "class-4-4-reinforce",
        "kind": "choice",
        "category": "APPLICATION",
        "sectionId": "class-4-section-4",
        "objectiveId": "class-4-objective-4",
        "competency": "S1_C4_4",
        "prompt": "A balance rises by 2% while a relevant basket rises by 7%. What is the direction of real change?",
        "options": [
          {
            "id": "class-4-4-reinforce-b",
            "label": "Purchasing power rises because the balance is larger."
          },
          {
            "id": "class-4-4-reinforce-a",
            "label": "Purchasing power falls."
          }
        ],
        "correct": "class-4-4-reinforce-a"
      }
    },
    {
      "competency": "S1_C4_5",
      "sectionId": "class-4-section-5",
      "title": "Revisit: Interest: amount, rate and time",
      "paragraph": "Calculate simple interest with explicit assumptions. Return to the example, name the assumption that changed, and explain the difference before trying this fresh situation.",
      "reinforcement": {
        "id": "class-4-5-reinforce",
        "kind": "choice",
        "category": "APPLICATION",
        "sectionId": "class-4-section-5",
        "objectiveId": "class-4-objective-5",
        "competency": "S1_C4_5",
        "prompt": "Fresh hypothetical case: 240 units earn 5% simple annual interest for two years, with no fees or tax. Which worked result gives the interest, rather than the final balance?",
        "options": [
          {
            "id": "class-4-5-reinforce-a",
            "label": "240 × 0.05 × 2 = 24 units of interest."
          },
          {
            "id": "class-4-5-reinforce-b",
            "label": "240 × 0.05 = 12 units of interest for both years."
          }
        ],
        "correct": "class-4-5-reinforce-a"
      }
    },
    {
      "competency": "S1_C4_6",
      "sectionId": "class-4-section-6",
      "title": "Revisit: Causes, policy and uncertainty",
      "paragraph": "Explain inflation using multiple influences and conditional policy effects. Return to the example, name the assumption that changed, and explain the difference before trying this fresh situation.",
      "reinforcement": {
        "id": "class-4-6-reinforce",
        "kind": "choice",
        "category": "APPLICATION",
        "sectionId": "class-4-section-6",
        "objectiveId": "class-4-objective-6",
        "competency": "S1_C4_6",
        "prompt": "Why might a rate change not immediately reverse a supply-driven price increase?",
        "options": [
          {
            "id": "class-4-6-reinforce-b",
            "label": "A rate rise always cancels supply shortages instantly."
          },
          {
            "id": "class-4-6-reinforce-a",
            "label": "Policy transmission takes time and does not directly replace missing supply."
          }
        ],
        "correct": "class-4-6-reinforce-a"
      }
    }
  ],
  "liveGuide": [
    {
      "title": "The same money, a changing purchase",
      "minutes": 10,
      "talkingPoints": [
        "Opening and prerequisite check: Retrieve the difference between a commercial-bank customer rate and a central-bank policy rate before comparing money amounts and prices.",
        "Today’s purpose: Compare quantities and money separately. State the basket, base and period before interpreting a rate; use conditional explanations for causes and policy.",
        "Purchasing power describes the goods and services an amount of money can command. A balance can stay unchanged while the quantity it buys changes. Start with quantities and prices before attaching a percentage to the change.",
        "Write 24 at the top of the board. Reveal 4 per journey and ask learners to count six journeys. Keep 24 visible; replace 4 with 6 and count four.",
        "Change the condition: if the budget also rises to 36, has journey purchasing power fallen? Have learners show six journeys, distinguishing the new case from an unchanged balance.",
        "Transition to a basket: one service gives a clear example, but a household buys several things.",
        "Resolve this misconception with the demonstration: An unchanged money balance means unchanged purchasing power."
      ],
      "activity": {
        "kind": "SINGLE",
        "prompt": "A club has 60 units. Rental rises from 10 to 12 per hour. What changed? Ask for the reason as well as the selection.",
        "sectionId": "class-4-section-1"
      }
    },
    {
      "title": "Build a basket before measuring change",
      "minutes": 10,
      "talkingPoints": [
        "An inflation index summarizes many prices with weights related to spending. Items that occupy more of the budget matter more than small purchases. Our classroom fixed basket is an intuition aid, not a replacement for statistical methods that also handle product and quality changes.",
        "Reveal quantities first: two meals and four rides. Add old prices 10 and 5; invite learners to produce 20 + 20 = 40 before showing the total.",
        "Reveal new prices 12 and 5 without changing quantities. Build 24 + 20 = 44; circle the increase 4, then the original denominator 40, and only then reveal 10%.",
        "Change the condition: meals rise 20% but represent only half the original spending. Ask why 20% is not the basket answer. Transition from basket cost to index levels.",
        "Resolve this misconception with the demonstration: A 20% rise in one item means the whole basket rose 20%."
      ],
      "activity": {
        "kind": "WRITTEN",
        "prompt": "Write a two-sentence explanation: Hypothetical basket: two meals at 10 plus four rides at 5 costs 40. Later meals are 12 and rides 5, so the same basket costs 44: (44 − 40) / 40 × 100 = 10%. Identify the governing distinction and one assumption that limits the conclusion.",
        "sectionId": "class-4-section-2"
      }
    },
    {
      "title": "A slower rise is still a rise",
      "minutes": 10,
      "talkingPoints": [
        "The price level is the measured level of a basket or index. The inflation rate describes its percentage change over a specified interval. Always name that interval: an annual comparison and a monthly comparison answer different questions.",
        "Draw index points 100, 110 and 115.5 in chronological order. Ask for each year’s original base before calculating 10% and 5%.",
        "Keep the final point above 110 while writing “slower increase.” Change the last point to 108 and ask which case actually has falling prices.",
        "Transition: an index describes prices; next compare it with a changing money amount.",
        "Resolve this misconception with the demonstration: Lower inflation necessarily restores last year’s prices."
      ],
      "activity": {
        "kind": "POLL",
        "prompt": "An annual basket rises from 200 to 206 after rising from 180 to 200. What is defensible? Ask for the reason as well as the selection.",
        "sectionId": "class-4-section-3"
      }
    },
    {
      "title": "Nominal numbers and real command",
      "minutes": 10,
      "talkingPoints": [
        "Nominal amounts are measured in money units. A real comparison adjusts for a specified price measure to ask what the money can buy. The right comparison depends on the basket and dates; a national index need not match one household’s expenses.",
        "Place allowance 100 → 105 beside basket 100 → 110. Ask whether either nominal number fell before discussing purchasing power.",
        "Reveal 1.05 / 1.10. Change the allowance growth to 10% and ask learners to explain why the real factor becomes one.",
        "Transition: nominal growth may come from interest, which needs its own base and period.",
        "Resolve this misconception with the demonstration: A larger nominal amount always buys more."
      ],
      "activity": {
        "kind": "SINGLE",
        "prompt": "An allowance and its basket both rise by 8%. What happens to basket purchasing power? Ask for the reason as well as the selection.",
        "sectionId": "class-4-section-4"
      }
    },
    {
      "title": "Interest: amount, rate and time",
      "minutes": 10,
      "talkingPoints": [
        "Interest is a payment linked to borrowing or placing money under an agreement. A rate needs a period and a base amount. An annual percentage alone does not tell you the final amount without knowing duration, compounding, fees and contractual terms.",
        "Write principal 300, annual rate 4%, duration one year, no fees or tax. Ask learners to convert 4% to 0.04 before multiplying.",
        "Reveal interest 12, then final balance 312. Change the question from “interest earned” to “final balance” so learners must distinguish the two answers.",
        "Change the period to two years under simple interest; contrast 24 interest with a compounding calculation without treating them as identical. Transition to what prices do during the period.",
        "Resolve this misconception with the demonstration: Interest is a fixed number of units regardless of principal or duration."
      ],
      "activity": {
        "kind": "WRITTEN",
        "prompt": "Write a two-sentence explanation: Hypothetical: 300 units at 4% simple annual interest for one year earn 300 × 0.04 × 1 = 12, giving 312. If the relevant basket rises 6%, the larger balance still buys less of it. Identify the governing distinction and one assumption that limits the conclusion.",
        "sectionId": "class-4-section-5"
      }
    },
    {
      "title": "Causes, policy and uncertainty",
      "minutes": 10,
      "talkingPoints": [
        "Prices can be influenced by spending relative to productive capacity, supply disruptions, input costs, exchange rates and expectations. A disrupted harvest can affect food while broader spending conditions affect many markets. Naming an influence does not prove its size or persistence.",
        "Draw three boxes: reduced crop supply, higher shipping cost and strong demand. Have pairs trace a separate path from each to a possible price pressure.",
        "Introduce higher rates while leaving the storm box in place. Ask what may change through spending and what physical constraint is not instantly repaired.",
        "Ask each group to request one discriminating data point, then recap basket measurement, interpretation and uncertainty before previewing market purposes.",
        "Resolve this misconception with the demonstration: All inflation has one cause and one immediate cure."
      ],
      "activity": {
        "kind": "POLL",
        "prompt": "Rates rise while an energy shortage continues. Which statement is careful? Ask for the reason as well as the selection.",
        "sectionId": "class-4-section-6"
      }
    }
  ],
  "studyGuide": {
    "summary": [
      "A fixed basket separates changing prices from a shopper’s decision to change quantities. Start by totaling the same purchases at both sets of prices.",
      "A percentage needs a base and a period. A smaller positive rate means a slower increase, while a negative rate means the measured level fell.",
      "Money growth and purchasing-power growth differ. Compare the money growth factor with the price growth factor; subtraction is only an approximation.",
      "A quoted annual interest rate needs principal, duration and contractual assumptions. Multiple price influences can coexist, and policy effects are conditional."
    ],
    "bigPicture": "Compare quantities and money separately. State the basket, base and period before interpreting a rate; use conditional explanations for causes and policy.",
    "fiveThings": [
      "Hold quantities fixed when isolating price changes.",
      "Use the original total as the percentage-change base.",
      "A lower positive inflation rate still means a rising measured level.",
      "Real command depends on money growth relative to price growth.",
      "Interest and policy explanations both require stated assumptions."
    ],
    "outcomes": [
      "Compare what a fixed sum can purchase at different prices.",
      "Calculate a fixed basket change using a stated base.",
      "Distinguish the inflation rate from the price level.",
      "Interpret a nominal change after accounting for basket prices.",
      "Calculate simple interest with explicit assumptions.",
      "Explain inflation using multiple influences and conditional policy effects."
    ],
    "examples": [
      "Hypothetical review basket: four tickets at 6 and one notebook at 8 cost 32. Later tickets cost 7 and the notebook still costs 8, giving 36. The increase is 4 / 32 × 100 = 12.5%, not 4%.",
      "Hypothetical index: 80 → 88 → 92.4. The annual changes are 10% then 5%; the second increase is slower, but the index never returns to 80.",
      "Hypothetical deposit: 250 at 6% simple annual interest for one year earns 15 before fees and tax. If a relevant basket rises 8%, the real factor is 1.06 / 1.08, about 0.9815: purchasing power falls about 1.85%."
    ],
    "misconceptions": [
      "An unchanged money balance means unchanged purchasing power.",
      "A 20% rise in one item means the whole basket rose 20%.",
      "Lower inflation necessarily restores last year’s prices.",
      "A larger nominal amount always buys more.",
      "Interest is a fixed number of units regardless of principal or duration.",
      "All inflation has one cause and one immediate cure."
    ],
    "review": [
      {
        "sectionId": "class-4-section-1",
        "label": "The same money, a changing purchase"
      },
      {
        "sectionId": "class-4-section-2",
        "label": "Build a basket before measuring change"
      },
      {
        "sectionId": "class-4-section-3",
        "label": "A slower rise is still a rise"
      },
      {
        "sectionId": "class-4-section-4",
        "label": "Nominal numbers and real command"
      },
      {
        "sectionId": "class-4-section-5",
        "label": "Interest: amount, rate and time"
      },
      {
        "sectionId": "class-4-section-6",
        "label": "Causes, policy and uncertainty"
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
      "title": "Bank of England: What is inflation?",
      "url": "https://www.bankofengland.co.uk/explainers/what-is-inflation"
    },
    {
      "title": "Bank of England: Inflation and interest rates",
      "url": "https://www.bankofengland.co.uk/explainers/inflation-and-interest-rates"
    },
    {
      "title": "Bank of England: What are interest rates?",
      "url": "https://www.bankofengland.co.uk/explainers/what-are-interest-rates"
    },
    {
      "title": "Bank of England: How do higher interest rates help to lower inflation?",
      "url": "https://www.bankofengland.co.uk/explainers/how-do-higher-interest-rates-help-to-lower-inflation"
    }
  ],
  "design": {
    "format": "Basket lab: calculate, interpret, qualify",
    "homeworkTitle": "Basket calculations and purchasing-power explanation",
    "homeworkIntro": "Use fictional figures to show basket, purchasing-power and interest working in their separate tasks, then explain a multi-cause situation. Each skill receives its own review.",
    "reflectionItemId": "class-4-homework-reflection",
    "pacing": {
      "minimum": 50,
      "maximum": 75
    },
    "assessmentCoverage": [
      "S1_C4_1",
      "S1_C4_2",
      "S1_C4_3",
      "S1_C4_4",
      "S1_C4_5",
      "S1_C4_6"
    ],
    "practicalRequirement": "No chart or practical credit is required. Apply foundational reasoning through objective checks and individually reviewed written work.",
    "videoOpportunity": "Instructor may select a short official explanation of basket measurement; pause before its conclusion and ask learners to distinguish level from rate.",
    "studyGuideChecks": [
      "Cover the worked example: why is 32 the denominator in the 32-to-36 basket calculation, and what would changing quantities confound?",
      "An index moves from 90 to 94.5 and then 96.39. Explain why annual inflation slowed without saying prices fell. Check: 5% then 2%.",
      "Show why an 8% nominal increase with an 8% basket increase leaves purchasing power unchanged in this simplified comparison.",
      "What extra information would you request before calculating interest over several years? Name duration, compounding and fees or tax assumptions.",
      "A crop failure and higher demand occur together. Give two mechanisms, then name evidence that could distinguish their contributions."
    ],
    "studyGuideVisual": {
      "kind": "basket",
      "nodes": [
        {
          "label": "Count the fixed purchase",
          "detail": "Keep quantities unchanged; multiply quantity by each date’s price."
        },
        {
          "label": "Compare totals",
          "detail": "New total − original total gives the money-unit increase."
        },
        {
          "label": "Choose the base",
          "detail": "Increase ÷ original total × 100 gives the basket percentage change."
        },
        {
          "label": "Interpret separately",
          "detail": "Compare nominal growth with basket growth, then state period and assumptions."
        }
      ],
      "caption": "Review calculation path: fixed quantities → two totals → original-base percentage → purchasing-power interpretation."
    }
  }
};
