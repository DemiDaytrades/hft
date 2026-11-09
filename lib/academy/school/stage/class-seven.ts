import type {StageClass} from './contracts';
export const CLASS_SEVEN:StageClass={
  "id": "stage-1-class-7",
  "version": "stage-1-class-7.1.0.0",
  "stageId": "stage-1",
  "number": 7,
  "title": "What Makes Prices Move?",
  "description": "Investigate conditional price discovery through willingness, quantities, information and competing explanations.",
  "courseId": "hft-school-foundations",
  "lessonId": "hft-school-class-7",
  "prerequisites": [
    "stage-1-class-6"
  ],
  "liveMinutes": 60,
  "reviewMinutes": 30,
  "objectives": [
    {
      "id": "stage-1-class-7-objective-1",
      "text": "Explain how an executed trade connects two sides",
      "competency": "stage-1-class-7-competency-1"
    },
    {
      "id": "stage-1-class-7-objective-2",
      "text": "Distinguish an intention from an executable instruction",
      "competency": "stage-1-class-7-competency-2"
    },
    {
      "id": "stage-1-class-7-objective-3",
      "text": "Interpret available quantities without a universal price rule",
      "competency": "stage-1-class-7-competency-3"
    },
    {
      "id": "stage-1-class-7-objective-4",
      "text": "Separate new information from what participants expected",
      "competency": "stage-1-class-7-competency-4"
    },
    {
      "id": "stage-1-class-7-objective-5",
      "text": "State what evidence cannot establish",
      "competency": "stage-1-class-7-competency-5"
    },
    {
      "id": "stage-1-class-7-objective-6",
      "text": "Compare participant motives without inferring them from direction",
      "competency": "stage-1-class-7-competency-6"
    },
    {
      "id": "stage-1-class-7-objective-7",
      "text": "Compare mechanisms and qualify a price explanation",
      "competency": "stage-1-class-7-competency-7"
    }
  ],
  "terms": [
    {
      "term": "Price discovery",
      "definition": "The process through which participants\u2019 willingness and transactions contribute to prices."
    },
    {
      "term": "Depth",
      "definition": "Available quantity near particular prices, conditional on the market and observation."
    },
    {
      "term": "Expectation",
      "definition": "A belief about an outcome before it is known."
    }
  ],
  "sections": [
    {
      "id": "stage-1-class-7-section-1",
      "title": "A price requires agreement",
      "objectiveId": "stage-1-class-7-objective-1",
      "competency": "stage-1-class-7-competency-1",
      "paragraphs": [
        "At a produce auction, one person offers to buy a crate while another offers to sell it. A displayed intention is not yet a transaction. A trade records agreement over both price and quantity at a particular time.",
        "A hundred completed trades do not mean there were a hundred more buyers than sellers. Every completed purchase had a corresponding sale. Pressure concerns willingness, urgency and available quantities, not a literal excess of buying trades."
      ],
      "example": "Hypothetical: one buyer takes three crates from one seller at 20 tokens each. There are three units traded and two counterparties; the next seller may ask a different price.",
      "misconception": "A completed trade can have only a buyer.",
      "visual": "none",
      "activities": [
        {
          "id": "stage-1-class-7-activity-1",
          "kind": "choice",
          "category": "KNOWLEDGE",
          "sectionId": "stage-1-class-7-section-1",
          "objectiveId": "stage-1-class-7-objective-1",
          "competency": "stage-1-class-7-competency-1",
          "prompt": "One seller and one buyer exchange five crates. What must be true?",
          "options": [
            {
              "id": "supported",
              "label": "Both a buyer and seller agree to transact"
            },
            {
              "id": "unsupported",
              "label": "More completed buyers than completed sellers create every rise"
            }
          ],
          "correct": "supported"
        }
      ]
    },
    {
      "id": "stage-1-class-7-section-2",
      "title": "Willingness becomes an order",
      "objectiveId": "stage-1-class-7-objective-2",
      "competency": "stage-1-class-7-competency-2",
      "paragraphs": [
        "Wanting an asset is different from submitting an instruction that can meet a counterparty. An order communicates willingness subject to conditions such as quantity and acceptable price. Conditions and market rules affect whether an instruction can execute.",
        "A price limit expresses a boundary, not an appointment with a willing seller. The SEC explains this for stock limit orders; the general lesson here is to separate a desired price from a completed exchange. We are not practising order entry."
      ],
      "example": "Hypothetical: Lina will buy a ticket for no more than 40 tokens, but the only seller asks 45. They can both participate without completing a trade.",
      "misconception": "Stating a price guarantees a trade.",
      "visual": "none",
      "activities": [
        {
          "id": "stage-1-class-7-activity-2",
          "kind": "choice",
          "category": "KNOWLEDGE",
          "sectionId": "stage-1-class-7-section-2",
          "objectiveId": "stage-1-class-7-objective-2",
          "competency": "stage-1-class-7-competency-2",
          "prompt": "A buyer offers at most 30 and a seller asks at least 34. What follows?",
          "options": [
            {
              "id": "supported",
              "label": "No trade is assured because their acceptable prices do not overlap"
            },
            {
              "id": "unsupported",
              "label": "The seller must accept the buyer\u2019s limit"
            }
          ],
          "correct": "supported"
        }
      ]
    },
    {
      "id": "stage-1-class-7-section-3",
      "title": "Quantity changes the path",
      "objectiveId": "stage-1-class-7-objective-3",
      "competency": "stage-1-class-7-competency-3",
      "paragraphs": [
        "Supply and demand are schedules of willingness at different prices, not just head counts. Available quantity near a current price helps determine how much interest can be accommodated without reaching other prices. We call that local availability depth.",
        "A simplified offer ladder holds other conditions still so we can see one mechanism. Real offers can arrive, disappear or change while transactions occur. A static illustration is therefore conditional evidence, not a forecast."
      ],
      "example": "Hypothetical: two units are offered at 10 and four at 12. Taking three units from these unchanged offers uses two at 10 and one at 12. The last unit costs 12; that does not reprice every historical trade.",
      "misconception": "The same purchase quantity always moves price by the same amount.",
      "visual": "none",
      "activities": [
        {
          "id": "stage-1-class-7-activity-3",
          "kind": "choice",
          "category": "KNOWLEDGE",
          "sectionId": "stage-1-class-7-section-3",
          "objectiveId": "stage-1-class-7-objective-3",
          "competency": "stage-1-class-7-competency-3",
          "prompt": "With two units offered at 10 and more at 12, where does the third unit come from if offers remain fixed?",
          "options": [
            {
              "id": "supported",
              "label": "The third unit reaches the next available offer"
            },
            {
              "id": "unsupported",
              "label": "All three units must cost the first displayed price"
            }
          ],
          "correct": "supported"
        }
      ]
    },
    {
      "id": "stage-1-class-7-section-4",
      "title": "Information meets expectations",
      "objectiveId": "stage-1-class-7-objective-4",
      "competency": "stage-1-class-7-competency-4",
      "paragraphs": [
        "A report matters through how it changes beliefs about future conditions and acceptable prices. The event itself and the surprise relative to prior expectations are different questions. Participants can read the same announcement differently.",
        "An apparently favourable report need not produce a rise. Some favourable outcome may already have been anticipated; other news, quantities and motives may dominate. A headline alone is not enough to reconstruct what each participant expected."
      ],
      "example": "Hypothetical: a harvest improves, but traders had expected a still larger improvement. The observation alone does not determine the next transaction price.",
      "misconception": "Good news guarantees a rising price.",
      "visual": "none",
      "activities": [
        {
          "id": "stage-1-class-7-activity-4",
          "kind": "choice",
          "category": "KNOWLEDGE",
          "sectionId": "stage-1-class-7-section-4",
          "objectiveId": "stage-1-class-7-objective-4",
          "competency": "stage-1-class-7-competency-4",
          "prompt": "A positive report arrives and the price falls. What is the stronger first inquiry?",
          "options": [
            {
              "id": "supported",
              "label": "Compare the report with prior expectations and other conditions"
            },
            {
              "id": "unsupported",
              "label": "Buy automatically because the headline sounds positive"
            }
          ],
          "correct": "supported"
        }
      ]
    },
    {
      "id": "stage-1-class-7-section-5",
      "title": "Surprise is not certainty",
      "objectiveId": "stage-1-class-7-objective-5",
      "competency": "stage-1-class-7-competency-5",
      "paragraphs": [
        "Uncertainty means that several future outcomes remain possible. A surprise can cause participants to revise willingness quickly, but neither its direction nor its size supplies a dependable rule for the next move.",
        "A price change is an observation. A proposed cause is an explanation that needs supporting evidence. When timing, expectations or available quantities are missing, say what is unknown rather than filling the gap with a confident story."
      ],
      "example": "Hypothetical: a price jumps after a transport disruption. Lower available supply is one hypothesis; urgent purchasing or withdrawn offers are alternatives to investigate.",
      "misconception": "A price jump proves a single hidden cause.",
      "visual": "none",
      "activities": [
        {
          "id": "stage-1-class-7-activity-5",
          "kind": "choice",
          "category": "KNOWLEDGE",
          "sectionId": "stage-1-class-7-section-5",
          "objectiveId": "stage-1-class-7-objective-5",
          "competency": "stage-1-class-7-competency-5",
          "prompt": "Only a before/after price is available. What conclusion is warranted?",
          "options": [
            {
              "id": "supported",
              "label": "Several explanations remain possible without further evidence"
            },
            {
              "id": "unsupported",
              "label": "The jump proves every seller knows the same fact"
            }
          ],
          "correct": "supported"
        }
      ]
    },
    {
      "id": "stage-1-class-7-section-6",
      "title": "Different reasons, same transaction",
      "objectiveId": "stage-1-class-7-objective-6",
      "competency": "stage-1-class-7-competency-6",
      "paragraphs": [
        "Two participants can exchange the same asset for different reasons. A business may need inventory, an investor may rebalance, and another participant may need cash. Their decisions need not be opposite forecasts.",
        "Urgency can change acceptable terms. Someone meeting a payment deadline may trade even while believing a later price could be better. The transaction reveals agreement, not a complete biography or a reliable motive label."
      ],
      "example": "Hypothetical: a bakery buys grain for tomorrow\u2019s production while a farm sells to meet payroll. Both can meet practical needs without betting on tomorrow\u2019s grain price.",
      "misconception": "Every seller predicts a fall and every buyer predicts a rise.",
      "visual": "none",
      "activities": [
        {
          "id": "stage-1-class-7-activity-6",
          "kind": "choice",
          "category": "KNOWLEDGE",
          "sectionId": "stage-1-class-7-section-6",
          "objectiveId": "stage-1-class-7-objective-6",
          "competency": "stage-1-class-7-competency-6",
          "prompt": "A bakery buys grain from a farm meeting payroll. Which interpretation respects the evidence?",
          "options": [
            {
              "id": "supported",
              "label": "Operational needs can explain both sides"
            },
            {
              "id": "unsupported",
              "label": "One side must have a mistaken forecast"
            }
          ],
          "correct": "supported"
        }
      ]
    },
    {
      "id": "stage-1-class-7-section-7",
      "title": "Build a conditional explanation",
      "objectiveId": "stage-1-class-7-objective-7",
      "competency": "stage-1-class-7-competency-7",
      "paragraphs": [
        "A useful explanation connects an observation to a mechanism and names assumptions. Start with what changed, then distinguish willingness, available quantities, information and participant needs. Compare at least two explanations when the evidence allows more than one.",
        "Conditional language makes the reasoning testable: if offers stay unchanged and urgent purchases consume nearby quantity, later units may transact at higher available offers. New supply or cancelled demand could change that outcome. This is market literacy, not an HFT setup."
      ],
      "example": "Hypothetical: theatre ticket transactions rise from 25 to 28 tokens. New visitors and fewer sellers are competing explanations. Offer quantities and event timing would help distinguish them; the price series alone cannot.",
      "misconception": "A plausible story is a guaranteed trading rule.",
      "visual": "none",
      "activities": [
        {
          "id": "stage-1-class-7-activity-7",
          "kind": "choice",
          "category": "KNOWLEDGE",
          "sectionId": "stage-1-class-7-section-7",
          "objectiveId": "stage-1-class-7-objective-7",
          "competency": "stage-1-class-7-competency-7",
          "prompt": "Tickets rise after a festival announcement. What would improve the explanation?",
          "options": [
            {
              "id": "supported",
              "label": "Compare offer quantities and timing before choosing a cause"
            },
            {
              "id": "unsupported",
              "label": "Treat the price increase alone as proof of new visitors"
            }
          ],
          "correct": "supported"
        }
      ]
    }
  ],
  "assessment": [
    {
      "id": "stage-1-class-7-check-1",
      "kind": "choice",
      "category": "APPLICATION",
      "sectionId": "stage-1-class-7-section-1",
      "objectiveId": "stage-1-class-7-objective-1",
      "competency": "stage-1-class-7-competency-1",
      "prompt": "A pension fund purchases 40 shares from three sellers. Which statement follows from those executions?",
      "options": [
        {
          "id": "supported",
          "label": "Each purchase also has a seller; counts do not establish buying pressure"
        },
        {
          "id": "unsupported",
          "label": "Forty shares prove forty more buyers than sellers"
        }
      ],
      "correct": "supported"
    },
    {
      "id": "stage-1-class-7-check-2",
      "kind": "choice",
      "category": "APPLICATION",
      "sectionId": "stage-1-class-7-section-2",
      "objectiveId": "stage-1-class-7-objective-2",
      "competency": "stage-1-class-7-competency-2",
      "prompt": "An art collector offers at most 70 tokens while all available sellers require 75. What can the offer establish?",
      "options": [
        {
          "id": "supported",
          "label": "A willingness boundary, without an assured transaction"
        },
        {
          "id": "unsupported",
          "label": "An obligation for sellers to accept 70"
        }
      ],
      "correct": "supported"
    },
    {
      "id": "stage-1-class-7-check-3",
      "kind": "choice",
      "category": "APPLICATION",
      "sectionId": "stage-1-class-7-section-3",
      "objectiveId": "stage-1-class-7-objective-3",
      "competency": "stage-1-class-7-competency-3",
      "prompt": "Five units are offered at 18 and the next two at 21. A purchase takes six units with offers unchanged. What happens to the sixth unit?",
      "options": [
        {
          "id": "supported",
          "label": "It uses the next available offer at 21"
        },
        {
          "id": "unsupported",
          "label": "Its price must remain 18 regardless of quantity"
        }
      ],
      "correct": "supported"
    },
    {
      "id": "stage-1-class-7-check-4",
      "kind": "choice",
      "category": "APPLICATION",
      "sectionId": "stage-1-class-7-section-4",
      "objectiveId": "stage-1-class-7-objective-4",
      "competency": "stage-1-class-7-competency-4",
      "prompt": "Output rises 3% after participants expected 6%. What should an explanation distinguish?",
      "options": [
        {
          "id": "supported",
          "label": "The reported increase from the smaller result relative to expectations"
        },
        {
          "id": "unsupported",
          "label": "Any positive output number from all uncertainty"
        }
      ],
      "correct": "supported"
    },
    {
      "id": "stage-1-class-7-check-5",
      "kind": "choice",
      "category": "APPLICATION",
      "sectionId": "stage-1-class-7-section-5",
      "objectiveId": "stage-1-class-7-objective-5",
      "competency": "stage-1-class-7-competency-5",
      "prompt": "A price declines during a rumour. Which conclusion is justified?",
      "options": [
        {
          "id": "supported",
          "label": "The coincidence suggests questions, but does not prove the rumour caused the move"
        },
        {
          "id": "unsupported",
          "label": "The decline proves the rumour is true"
        }
      ],
      "correct": "supported"
    },
    {
      "id": "stage-1-class-7-check-6",
      "kind": "choice",
      "category": "APPLICATION",
      "sectionId": "stage-1-class-7-section-6",
      "objectiveId": "stage-1-class-7-objective-6",
      "competency": "stage-1-class-7-competency-6",
      "prompt": "A charity sells an asset to fund an imminent grant. What can explain selling?",
      "options": [
        {
          "id": "supported",
          "label": "A payment need, even without expecting a lower future price"
        },
        {
          "id": "unsupported",
          "label": "Only a belief that the asset will fall"
        }
      ],
      "correct": "supported"
    },
    {
      "id": "stage-1-class-7-check-7",
      "kind": "choice",
      "category": "APPLICATION",
      "sectionId": "stage-1-class-7-section-7",
      "objectiveId": "stage-1-class-7-objective-7",
      "competency": "stage-1-class-7-competency-7",
      "prompt": "Two shops have the same price increase, but one loses suppliers and the other gains visitors. What follows?",
      "options": [
        {
          "id": "supported",
          "label": "Similar outcomes can arise through different mechanisms"
        },
        {
          "id": "unsupported",
          "label": "Identical price changes prove identical causes"
        }
      ],
      "correct": "supported"
    },
    {
      "id": "stage-1-class-7-reasoning",
      "kind": "written",
      "category": "REASONING",
      "sectionId": "stage-1-class-7-section-7",
      "objectiveId": "stage-1-class-7-objective-7",
      "competency": "stage-1-class-7-competency-7",
      "prompt": "A fictional auction price increases while a delivery delay is announced. Compare two possible mechanisms and identify evidence needed before attributing the move.",
      "rubric": "Individual review required: identify the mechanism, qualify assumptions, use the named context, and distinguish observation from inference. Return overconfident or incomplete reasoning for revision."
    }
  ],
  "homework": [
    {
      "id": "stage-1-class-7-homework-map-1",
      "kind": "choice",
      "category": "HOMEWORK",
      "sectionId": "stage-1-class-7-section-1",
      "objectiveId": "stage-1-class-7-objective-1",
      "competency": "stage-1-class-7-competency-1",
      "prompt": "A price rises after an event but offer quantities are unknown. Which approach is justified?",
      "options": [
        {
          "id": "supported",
          "label": "Compare changed demand with reduced available supply; seek evidence before choosing"
        },
        {
          "id": "unsupported",
          "label": "Declare the event a guaranteed cause"
        }
      ],
      "correct": "supported"
    },
    {
      "id": "stage-1-class-7-homework-written-2",
      "kind": "written",
      "category": "HOMEWORK",
      "sectionId": "stage-1-class-7-section-3",
      "objectiveId": "stage-1-class-7-objective-3",
      "competency": "stage-1-class-7-competency-3",
      "prompt": "Construct a hypothetical fixed offer ladder with quantities at two prices. Show which offers a stated purchase would use, then change one available quantity and explain how the outcome could differ. State the unchanged-offer assumption; do not present the result as a forecast.",
      "rubric": "Individually review quantities and offer use, the changed-depth comparison, and the explicit fixed-offer boundary. Return inconsistent quantities or a guaranteed prediction for revision."
    },
    {
      "id": "stage-1-class-7-homework-written-6",
      "kind": "written",
      "category": "HOMEWORK",
      "sectionId": "stage-1-class-7-section-7",
      "objectiveId": "stage-1-class-7-objective-7",
      "competency": "stage-1-class-7-competency-7",
      "prompt": "A fictional ticket price rises after a transport announcement. Develop two competing explanations using different mechanisms, identify a participant motive for each, and propose evidence that would distinguish them. Explain what the price alone cannot establish.",
      "rubric": "Individually review the mechanism, assumptions, two competing explanations and evidence limitations. Return unsupported certainty for revision; do not grade length or predicted profit."
    },
    {
      "id": "stage-1-class-7-homework-reflection",
      "kind": "reflection",
      "category": "HOMEWORK",
      "sectionId": "stage-1-class-7-section-7",
      "objectiveId": "stage-1-class-7-objective-7",
      "competency": "stage-1-class-7-competency-7",
      "prompt": "Which assumption in your explanation is least secure? Name one observation or question that would help you revise it.",
      "rubric": "Individually review whether uncertainty is specific and the proposed follow-up is relevant. Honest uncertainty is not an error."
    }
  ],
  "remediation": [
    {
      "competency": "stage-1-class-7-competency-1",
      "sectionId": "stage-1-class-7-section-1",
      "title": "Revisit: A price requires agreement",
      "paragraph": "Explain how an executed trade connects two sides. Return to the example, name the observation, and distinguish it from an assumption. A hundred completed trades do not mean there were a hundred more buyers than sellers. Every completed purchase had a corresponding sale. Pressure concerns willingness, urgency and available quantities, not a literal excess of buying trades.",
      "reinforcement": {
        "id": "stage-1-class-7-reinforcement-1",
        "kind": "choice",
        "category": "APPLICATION",
        "sectionId": "stage-1-class-7-section-1",
        "objectiveId": "stage-1-class-7-objective-1",
        "competency": "stage-1-class-7-competency-1",
        "prompt": "A wholesaler sells 12 units to two retailers. Do those trades prove more buyers than sellers caused the price?",
        "options": [
          {
            "id": "supported",
            "label": "No; each executed purchase has a selling side and head counts do not explain terms"
          },
          {
            "id": "unsupported",
            "label": "Yes; buyer head count alone determines price"
          }
        ],
        "correct": "supported"
      }
    },
    {
      "competency": "stage-1-class-7-competency-2",
      "sectionId": "stage-1-class-7-section-2",
      "title": "Revisit: Willingness becomes an order",
      "paragraph": "Distinguish an intention from an executable instruction. Return to the example, name the observation, and distinguish it from an assumption. A price limit expresses a boundary, not an appointment with a willing seller. The SEC explains this for stock limit orders; the general lesson here is to separate a desired price from a completed exchange. We are not practising order entry.",
      "reinforcement": {
        "id": "stage-1-class-7-reinforcement-2",
        "kind": "choice",
        "category": "APPLICATION",
        "sectionId": "stage-1-class-7-section-2",
        "objectiveId": "stage-1-class-7-objective-2",
        "competency": "stage-1-class-7-competency-2",
        "prompt": "An order says buy only at 55 or less, but nobody sells below 58. What is supported?",
        "options": [
          {
            "id": "supported",
            "label": "The instruction can remain unfilled"
          },
          {
            "id": "unsupported",
            "label": "The desired price guarantees execution"
          }
        ],
        "correct": "supported"
      }
    },
    {
      "competency": "stage-1-class-7-competency-3",
      "sectionId": "stage-1-class-7-section-3",
      "title": "Revisit: Quantity changes the path",
      "paragraph": "Interpret available quantities without a universal price rule. Return to the example, name the observation, and distinguish it from an assumption. A simplified offer ladder holds other conditions still so we can see one mechanism. Real offers can arrive, disappear or change while transactions occur. A static illustration is therefore conditional evidence, not a forecast.",
      "reinforcement": {
        "id": "stage-1-class-7-reinforcement-3",
        "kind": "choice",
        "category": "APPLICATION",
        "sectionId": "stage-1-class-7-section-3",
        "objectiveId": "stage-1-class-7-objective-3",
        "competency": "stage-1-class-7-competency-3",
        "prompt": "A stall offers one item at 7 and ten at 9. With unchanged offers, a second immediate purchase reaches which offer?",
        "options": [
          {
            "id": "supported",
            "label": "The next available offer at 9"
          },
          {
            "id": "unsupported",
            "label": "The first price forever"
          }
        ],
        "correct": "supported"
      }
    },
    {
      "competency": "stage-1-class-7-competency-4",
      "sectionId": "stage-1-class-7-section-4",
      "title": "Revisit: Information meets expectations",
      "paragraph": "Separate new information from what participants expected. Return to the example, name the observation, and distinguish it from an assumption. An apparently favourable report need not produce a rise. Some favourable outcome may already have been anticipated; other news, quantities and motives may dominate. A headline alone is not enough to reconstruct what each participant expected.",
      "reinforcement": {
        "id": "stage-1-class-7-reinforcement-4",
        "kind": "choice",
        "category": "APPLICATION",
        "sectionId": "stage-1-class-7-section-4",
        "objectiveId": "stage-1-class-7-objective-4",
        "competency": "stage-1-class-7-competency-4",
        "prompt": "A company reports a gain smaller than analysts anticipated. What comparison matters?",
        "options": [
          {
            "id": "supported",
            "label": "Actual news versus prior expectations, alongside other conditions"
          },
          {
            "id": "unsupported",
            "label": "Only whether the gain is positive"
          }
        ],
        "correct": "supported"
      }
    },
    {
      "competency": "stage-1-class-7-competency-5",
      "sectionId": "stage-1-class-7-section-5",
      "title": "Revisit: Surprise is not certainty",
      "paragraph": "State what evidence cannot establish. Return to the example, name the observation, and distinguish it from an assumption. A price change is an observation. A proposed cause is an explanation that needs supporting evidence. When timing, expectations or available quantities are missing, say what is unknown rather than filling the gap with a confident story.",
      "reinforcement": {
        "id": "stage-1-class-7-reinforcement-5",
        "kind": "choice",
        "category": "APPLICATION",
        "sectionId": "stage-1-class-7-section-5",
        "objectiveId": "stage-1-class-7-objective-5",
        "competency": "stage-1-class-7-competency-5",
        "prompt": "A chart shows a jump but no news or quantity data. What should the explanation acknowledge?",
        "options": [
          {
            "id": "supported",
            "label": "Missing evidence leaves several possible causes"
          },
          {
            "id": "unsupported",
            "label": "The shape proves a unique cause"
          }
        ],
        "correct": "supported"
      }
    },
    {
      "competency": "stage-1-class-7-competency-6",
      "sectionId": "stage-1-class-7-section-6",
      "title": "Revisit: Different reasons, same transaction",
      "paragraph": "Compare participant motives without inferring them from direction. Return to the example, name the observation, and distinguish it from an assumption. Urgency can change acceptable terms. Someone meeting a payment deadline may trade even while believing a later price could be better. The transaction reveals agreement, not a complete biography or a reliable motive label.",
      "reinforcement": {
        "id": "stage-1-class-7-reinforcement-6",
        "kind": "choice",
        "category": "APPLICATION",
        "sectionId": "stage-1-class-7-section-6",
        "objectiveId": "stage-1-class-7-objective-6",
        "competency": "stage-1-class-7-competency-6",
        "prompt": "A manufacturer buys metal needed for a contract due tomorrow. What motive is plausible?",
        "options": [
          {
            "id": "supported",
            "label": "Meeting a production obligation"
          },
          {
            "id": "unsupported",
            "label": "Only a forecast of rising metal prices"
          }
        ],
        "correct": "supported"
      }
    },
    {
      "competency": "stage-1-class-7-competency-7",
      "sectionId": "stage-1-class-7-section-7",
      "title": "Revisit: Build a conditional explanation",
      "paragraph": "Compare mechanisms and qualify a price explanation. Return to the example, name the observation, and distinguish it from an assumption. Conditional language makes the reasoning testable: if offers stay unchanged and urgent purchases consume nearby quantity, later units may transact at higher available offers. New supply or cancelled demand could change that outcome. This is market literacy, not an HFT setup.",
      "reinforcement": {
        "id": "stage-1-class-7-reinforcement-7",
        "kind": "choice",
        "category": "APPLICATION",
        "sectionId": "stage-1-class-7-section-7",
        "objectiveId": "stage-1-class-7-objective-7",
        "competency": "stage-1-class-7-competency-7",
        "prompt": "Visitors increase while sellers also bring more inventory. Can higher prices be guaranteed?",
        "options": [
          {
            "id": "supported",
            "label": "No; the interaction and available quantities still matter"
          },
          {
            "id": "unsupported",
            "label": "Yes; any increase in visitors guarantees a rise"
          }
        ],
        "correct": "supported"
      }
    }
  ],
  "liveGuide": [
    {
      "title": "A price requires agreement",
      "minutes": 9,
      "talkingPoints": [
        "Hook: Hypothetical: one buyer takes three crates from one seller at 20 tokens each. There are three units traded and two counterparties; the next seller may ask a different price.",
        "Teach: At a produce auction, one person offers to buy a crate while another offers to sell it. A displayed intention is not yet a transaction. A trade records agreement over both price and quantity at a particular time.",
        "Qualify: A hundred completed trades do not mean there were a hundred more buyers than sellers. Every completed purchase had a corresponding sale. Pressure concerns willingness, urgency and available quantities, not a literal excess of buying trades.",
        "Check misconception: A completed trade can have only a buyer.",
        "Demonstrate: Place BUYER and SELLER cards on opposite sides of three crate tokens. Move the tokens only after both sides accept 20 tokens; count purchases and sales together.",
        "Transition: We have observed agreement; next ask how willingness reaches a market before agreement."
      ],
      "activity": {
        "kind": "POLL",
        "prompt": "One seller and one buyer exchange five crates. What must be true?",
        "sectionId": "stage-1-class-7-section-1"
      }
    },
    {
      "title": "Willingness becomes an order",
      "minutes": 9,
      "talkingPoints": [
        "Hook: Hypothetical: Lina will buy a ticket for no more than 40 tokens, but the only seller asks 45. They can both participate without completing a trade.",
        "Teach: Wanting an asset is different from submitting an instruction that can meet a counterparty. An order communicates willingness subject to conditions such as quantity and acceptable price. Conditions and market rules affect whether an instruction can execute.",
        "Qualify: A price limit expresses a boundary, not an appointment with a willing seller. The SEC explains this for stock limit orders; the general lesson here is to separate a desired price from a completed exchange. We are not practising order entry.",
        "Check misconception: Stating a price guarantees a trade.",
        "Demonstrate: Draw buyer maximum 40 and seller minimum 45 on a line. Ask whether either card forces the other person to trade. Move the seller minimum to 39 and distinguish possible from guaranteed execution.",
        "Transition: Now add quantities: agreement at one price does not tell us how many units are available there."
      ],
      "activity": {
        "kind": "SINGLE",
        "prompt": "A buyer offers at most 30 and a seller asks at least 34. What follows?",
        "sectionId": "stage-1-class-7-section-2"
      }
    },
    {
      "title": "Quantity changes the path",
      "minutes": 9,
      "talkingPoints": [
        "Hook: Hypothetical: two units are offered at 10 and four at 12. Taking three units from these unchanged offers uses two at 10 and one at 12. The last unit costs 12; that does not reprice every historical trade.",
        "Teach: Supply and demand are schedules of willingness at different prices, not just head counts. Available quantity near a current price helps determine how much interest can be accommodated without reaching other prices. We call that local availability depth.",
        "Qualify: A simplified offer ladder holds other conditions still so we can see one mechanism. Real offers can arrive, disappear or change while transactions occur. A static illustration is therefore conditional evidence, not a forecast.",
        "Check misconception: The same purchase quantity always moves price by the same amount.",
        "Demonstrate: Put two counters beside offer 10 and four beside offer 12. Remove three counters in order. Ask which price belongs to the third unit, then restore the counters and add a new offer to expose the fixed-offer assumption.",
        "Transition: Depth explains one mechanism; next consider why participants might change those offers."
      ],
      "activity": {
        "kind": "WRITTEN",
        "prompt": "Interpret available quantities without a universal price rule. Give a conditional explanation using the hypothetical case and name missing information.",
        "sectionId": "stage-1-class-7-section-3"
      }
    },
    {
      "title": "Information meets expectations",
      "minutes": 9,
      "talkingPoints": [
        "Hook: Hypothetical: a harvest improves, but traders had expected a still larger improvement. The observation alone does not determine the next transaction price.",
        "Teach: A report matters through how it changes beliefs about future conditions and acceptable prices. The event itself and the surprise relative to prior expectations are different questions. Participants can read the same announcement differently.",
        "Qualify: An apparently favourable report need not produce a rise. Some favourable outcome may already have been anticipated; other news, quantities and motives may dominate. A headline alone is not enough to reconstruct what each participant expected.",
        "Check misconception: Good news guarantees a rising price.",
        "Demonstrate: Reveal EXPECTED harvest improvement before revealing ACTUAL smaller improvement. Ask learners to compare the surprise with the positive headline; collect two possible interpretations rather than a directional vote alone.",
        "Transition: Changed expectations do not eliminate uncertainty; separate a plausible account from proof."
      ],
      "activity": {
        "kind": "POLL",
        "prompt": "A positive report arrives and the price falls. What is the stronger first inquiry?",
        "sectionId": "stage-1-class-7-section-4"
      }
    },
    {
      "title": "Surprise is not certainty",
      "minutes": 8,
      "talkingPoints": [
        "Hook: Hypothetical: a price jumps after a transport disruption. Lower available supply is one hypothesis; urgent purchasing or withdrawn offers are alternatives to investigate.",
        "Teach: Uncertainty means that several future outcomes remain possible. A surprise can cause participants to revise willingness quickly, but neither its direction nor its size supplies a dependable rule for the next move.",
        "Qualify: A price change is an observation. A proposed cause is an explanation that needs supporting evidence. When timing, expectations or available quantities are missing, say what is unknown rather than filling the gap with a confident story.",
        "Check misconception: A price jump proves a single hidden cause.",
        "Demonstrate: Show only a before/after price jump. Collect a supply explanation and an urgency explanation on separate cards; under each write the missing observation that would strengthen it.",
        "Transition: Evidence can be missing because participants have different needs as well as different information."
      ],
      "activity": {
        "kind": "SINGLE",
        "prompt": "Only a before/after price is available. What conclusion is warranted?",
        "sectionId": "stage-1-class-7-section-5"
      }
    },
    {
      "title": "Different reasons, same transaction",
      "minutes": 8,
      "talkingPoints": [
        "Hook: Hypothetical: a bakery buys grain for tomorrow\u2019s production while a farm sells to meet payroll. Both can meet practical needs without betting on tomorrow\u2019s grain price.",
        "Teach: Two participants can exchange the same asset for different reasons. A business may need inventory, an investor may rebalance, and another participant may need cash. Their decisions need not be opposite forecasts.",
        "Qualify: Urgency can change acceptable terms. Someone meeting a payment deadline may trade even while believing a later price could be better. The transaction reveals agreement, not a complete biography or a reliable motive label.",
        "Check misconception: Every seller predicts a fall and every buyer predicts a rise.",
        "Demonstrate: Give one student a bakery production deadline and another a farm payroll deadline. Let both explain a grain transaction without making a price prediction.",
        "Transition: Use these different motives when evaluating the final competing price explanations."
      ],
      "activity": {
        "kind": "WRITTEN",
        "prompt": "Compare participant motives without inferring them from direction. Give a conditional explanation using the hypothetical case and name missing information.",
        "sectionId": "stage-1-class-7-section-6"
      }
    },
    {
      "title": "Build a conditional explanation",
      "minutes": 8,
      "talkingPoints": [
        "Hook: Hypothetical: theatre ticket transactions rise from 25 to 28 tokens. New visitors and fewer sellers are competing explanations. Offer quantities and event timing would help distinguish them; the price series alone cannot.",
        "Teach: A useful explanation connects an observation to a mechanism and names assumptions. Start with what changed, then distinguish willingness, available quantities, information and participant needs. Compare at least two explanations when the evidence allows more than one.",
        "Qualify: Conditional language makes the reasoning testable: if offers stay unchanged and urgent purchases consume nearby quantity, later units may transact at higher available offers. New supply or cancelled demand could change that outcome. This is market literacy, not an HFT setup.",
        "Check misconception: A plausible story is a guaranteed trading rule.",
        "Demonstrate: Draw two columns: visitors increased and sellers withdrew. Place the same ticket-price observation above both. Ask which quantity and timing records would discriminate between them, and change one assumption together.",
        "Transition: Recap agreement, willingness, depth, expectations, uncertainty and motives. Preview how cross-border currency needs create another reason to exchange."
      ],
      "activity": {
        "kind": "POLL",
        "prompt": "Tickets rise after a festival announcement. What would improve the explanation?",
        "sectionId": "stage-1-class-7-section-7"
      }
    }
  ],
  "studyGuide": {
    "summary": [
      "Think of a transaction as a meeting of acceptable terms, not a vote in which buyers outnumber sellers. Unexecuted willingness matters because it affects which terms can be met next.",
      "Quantity and urgency interact: the same purchase can have different effects when nearby availability changes. Always state which offers you are holding fixed in a simplified comparison.",
      "A price records an outcome; explaining the outcome requires evidence about information, expectations, needs and available quantities. Several mechanisms can fit the same observation."
    ],
    "bigPicture": "Reconstruct a price explanation in three steps: observe the outcome, compare plausible mechanisms, then mark the evidence and assumptions that keep the explanation conditional.",
    "fiveThings": [
      "Count both sides of every executed transaction.",
      "Separate desired terms from assured execution.",
      "Read quantities beside prices, not prices alone.",
      "Compare an announcement with expectations that preceded it.",
      "Ask what evidence would distinguish competing explanations."
    ],
    "outcomes": [
      "Trace a conditional transaction through a small offer ladder.",
      "Explain why a headline or price path alone cannot establish a unique cause.",
      "Compare practical motives without assigning everyone an opposite forecast."
    ],
    "examples": [
      "Review case: a fictional market offers four units at 16 tokens and two at 19. If a buyer takes five units while offers stay unchanged, the fifth uses 19. If three new units arrive at 16 first, that conclusion changes.",
      "Review case: a shop\u2019s transaction price falls on a busy day. More shoppers alone cannot explain the outcome; additional sellers, inventory changes or altered willingness remain candidates.",
      "Review case: a cooperative sells grain before a debt payment is due. The cash obligation can explain timing even if the cooperative expects a better grain price later."
    ],
    "misconceptions": [
      "Counting buying trades against selling trades cannot reveal an excess of one side: each execution connects both.",
      "A positive report is not a universal upward-price rule; expectations and other conditions matter.",
      "A plausible mechanism is a hypothesis until supporting evidence and alternatives are considered."
    ],
    "review": [
      {
        "sectionId": "stage-1-class-7-section-1",
        "label": "A price requires agreement"
      },
      {
        "sectionId": "stage-1-class-7-section-2",
        "label": "Willingness becomes an order"
      },
      {
        "sectionId": "stage-1-class-7-section-3",
        "label": "Quantity changes the path"
      },
      {
        "sectionId": "stage-1-class-7-section-4",
        "label": "Information meets expectations"
      },
      {
        "sectionId": "stage-1-class-7-section-5",
        "label": "Surprise is not certainty"
      },
      {
        "sectionId": "stage-1-class-7-section-6",
        "label": "Different reasons, same transaction"
      },
      {
        "sectionId": "stage-1-class-7-section-7",
        "label": "Build a conditional explanation"
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
      "title": "SEC \u2014 Limit Orders (stock-market example; no execution guarantee)",
      "url": "https://www.sec.gov/answers/limit.htm"
    },
    {
      "title": "Bank of England \u2014 Who sets exchange rates?",
      "url": "https://www.bankofengland.co.uk/explainers/who-sets-exchange-rates"
    }
  ],
  "design": {
    "format": "Conditional price-discovery workshop",
    "homeworkTitle": "Compare price hypotheses",
    "homeworkIntro": "Use original hypothetical evidence and make your assumptions visible. Written reasoning receives individual instructor review.",
    "reflectionItemId": "stage-1-class-7-homework-reflection",
    "pacing": {
      "minimum": 50,
      "maximum": 75
    },
    "assessmentCoverage": [
      "stage-1-class-7-competency-1",
      "stage-1-class-7-competency-2",
      "stage-1-class-7-competency-3",
      "stage-1-class-7-competency-4",
      "stage-1-class-7-competency-5",
      "stage-1-class-7-competency-6",
      "stage-1-class-7-competency-7"
    ],
    "practicalRequirement": "No chart or trading practical is required; objective evidence and individually reviewed reasoning remain separate.",
    "videoOpportunity": "An instructor may choose a short institutional explainer on price discovery or currency exchange, pause before its conclusion, and ask students to identify assumptions. No playback is required.",
    "studyGuideVisual": {
      "kind": "prices",
      "nodes": [
        {
          "label": "Observed outcome",
          "detail": "A transaction price changes; this does not identify its cause."
        },
        {
          "label": "Compare mechanisms",
          "detail": "Changed willingness, nearby quantities, information or participant needs."
        },
        {
          "label": "Test the explanation",
          "detail": "Ask for timing and quantities; state assumptions and competing accounts."
        }
      ],
      "caption": "Review pathway: observation \u2192 candidate mechanisms \u2192 evidence and limits. This is a reasoning map, not a prediction rule."
    },
    "studyGuideChecks": [
      "Four units are offered at 16 and the next at 19. With offers unchanged, where does the fifth unit transact? Which assumption could undo that answer?",
      "A report is favourable but weaker than expected. What two comparisons must you keep separate before explaining a price move?",
      "Name two mechanisms that could fit a price rise. What observation would help distinguish them?",
      "Why might a seller act without predicting a future price fall?"
    ]
  }
};
