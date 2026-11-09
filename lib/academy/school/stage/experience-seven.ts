import type {StageExperience} from './contracts';
export const EXPERIENCE_SEVEN:StageExperience={
  "classId": "stage-1-class-7",
  "academicVersion": "stage-1-class-7.1.0.0",
  "revision": "1",
  "format": "prices",
  "sections": [
    {
      "sectionId": "stage-1-class-7-section-1",
      "hook": "A price requires agreement",
      "scenario": "Hypothetical: one buyer takes three crates from one seller at 20 tokens each. There are three units traded and two counterparties; the next seller may ask a different price.",
      "visual": {
        "kind": "prices",
        "nodes": [
          {
            "label": "Buyer",
            "detail": "Willing to exchange 20 tokens for a crate"
          },
          {
            "label": "Agreement",
            "detail": "Three crates exchange at 20 tokens each"
          },
          {
            "label": "Seller",
            "detail": "Willing to deliver crates at agreed terms"
          }
        ],
        "caption": "Original HFT teaching map; all examples are hypothetical."
      },
      "practice": [
        {
          "id": "stage-1-class-7-explore-1",
          "kind": "choice",
          "prompt": "One seller and one buyer exchange five crates. What must be true?",
          "options": [
            {
              "id": "reasoned",
              "label": "Both a buyer and seller agree to transact"
            },
            {
              "id": "shortcut",
              "label": "More completed buyers than completed sellers create every rise"
            }
          ],
          "correct": "reasoned",
          "explanation": "Both a buyer and seller agree to transact. A hundred completed trades do not mean there were a hundred more buyers than sellers. Every completed purchase had a corresponding sale. Pressure concerns willingness, urgency and available quantities, not a literal excess of buying trades.",
          "retry": "Revisit the scenario and its conditions. Test this mistaken claim: A completed trade can have only a buyer. Then choose the explanation supported by the information given."
        }
      ],
      "explanation": [
        "At a produce auction, one person offers to buy a crate while another offers to sell it. A displayed intention is not yet a transaction. A trade records agreement over both price and quantity at a particular time.",
        "A hundred completed trades do not mean there were a hundred more buyers than sellers. Every completed purchase had a corresponding sale. Pressure concerns willingness, urgency and available quantities, not a literal excess of buying trades."
      ],
      "takeaway": "Explain how an executed trade connects two sides",
      "demi": "Pause and explain: explain how an executed trade connects two sides. Which assumption would change your answer?"
    },
    {
      "sectionId": "stage-1-class-7-section-2",
      "hook": "Willingness becomes an order",
      "scenario": "Hypothetical: Lina will buy a ticket for no more than 40 tokens, but the only seller asks 45. They can both participate without completing a trade.",
      "visual": {
        "kind": "prices",
        "nodes": [
          {
            "label": "Buyer boundary",
            "detail": "Maximum 40 tokens"
          },
          {
            "label": "No overlap",
            "detail": "No agreement is assured"
          },
          {
            "label": "Seller boundary",
            "detail": "Minimum 45 tokens"
          }
        ],
        "caption": "Original HFT teaching map; all examples are hypothetical."
      },
      "practice": [
        {
          "id": "stage-1-class-7-explore-2",
          "kind": "choice",
          "prompt": "A buyer offers at most 30 and a seller asks at least 34. What follows?",
          "options": [
            {
              "id": "shortcut",
              "label": "The seller must accept the buyer\u2019s limit"
            },
            {
              "id": "reasoned",
              "label": "No trade is assured because their acceptable prices do not overlap"
            }
          ],
          "correct": "reasoned",
          "explanation": "No trade is assured because their acceptable prices do not overlap. A price limit expresses a boundary, not an appointment with a willing seller. The SEC explains this for stock limit orders; the general lesson here is to separate a desired price from a completed exchange. We are not practising order entry.",
          "retry": "Revisit the scenario and its conditions. Test this mistaken claim: Stating a price guarantees a trade. Then choose the explanation supported by the information given."
        }
      ],
      "explanation": [
        "Wanting an asset is different from submitting an instruction that can meet a counterparty. An order communicates willingness subject to conditions such as quantity and acceptable price. Conditions and market rules affect whether an instruction can execute.",
        "A price limit expresses a boundary, not an appointment with a willing seller. The SEC explains this for stock limit orders; the general lesson here is to separate a desired price from a completed exchange. We are not practising order entry."
      ],
      "takeaway": "Distinguish an intention from an executable instruction",
      "demi": "Pause and explain: distinguish an intention from an executable instruction. Which assumption would change your answer?"
    },
    {
      "sectionId": "stage-1-class-7-section-3",
      "hook": "Quantity changes the path",
      "scenario": "Hypothetical: two units are offered at 10 and four at 12. Taking three units from these unchanged offers uses two at 10 and one at 12. The last unit costs 12; that does not reprice every historical trade.",
      "visual": {
        "kind": "prices",
        "nodes": [
          {
            "label": "Offer 10",
            "detail": "Two units available",
            "value": 2
          },
          {
            "label": "Offer 12",
            "detail": "Four units available",
            "value": 4
          },
          {
            "label": "Purchase three",
            "detail": "Two units at 10; the third at 12",
            "value": 3
          }
        ],
        "caption": "Original HFT teaching map; all examples are hypothetical."
      },
      "practice": [
        {
          "id": "stage-1-class-7-explore-depth",
          "kind": "calculate",
          "prompt": "Hypothetical unchanged offers: two units at 10 tokens and four at 12. A purchase takes three units in price order. What is the token price of the third unit?",
          "expected": 12,
          "tolerance": 0,
          "explanation": "The first two units use the offer at 10; the third reaches the available offer at 12. This is a conditional illustration, not a forecast.",
          "retry": "Count units available at the first offer before moving to the next price. Enter the third unit\u2019s price, not the total purchase cost."
        }
      ],
      "explanation": [
        "Supply and demand are schedules of willingness at different prices, not just head counts. Available quantity near a current price helps determine how much interest can be accommodated without reaching other prices. We call that local availability depth.",
        "A simplified offer ladder holds other conditions still so we can see one mechanism. Real offers can arrive, disappear or change while transactions occur. A static illustration is therefore conditional evidence, not a forecast."
      ],
      "takeaway": "Interpret available quantities without a universal price rule",
      "demi": "Pause and explain: interpret available quantities without a universal price rule. Which assumption would change your answer?"
    },
    {
      "sectionId": "stage-1-class-7-section-4",
      "hook": "Information meets expectations",
      "scenario": "Hypothetical: a harvest improves, but traders had expected a still larger improvement. The observation alone does not determine the next transaction price.",
      "visual": {
        "kind": "prices",
        "nodes": [
          {
            "label": "Prior belief",
            "detail": "Participants expected a larger harvest improvement"
          },
          {
            "label": "Report",
            "detail": "Harvest improves, less than anticipated"
          },
          {
            "label": "Revision",
            "detail": "Different beliefs and other conditions still matter"
          }
        ],
        "caption": "Original HFT teaching map; all examples are hypothetical."
      },
      "practice": [
        {
          "id": "stage-1-class-7-explore-4",
          "kind": "choice",
          "prompt": "A positive report arrives and the price falls. What is the stronger first inquiry?",
          "options": [
            {
              "id": "shortcut",
              "label": "Buy automatically because the headline sounds positive"
            },
            {
              "id": "reasoned",
              "label": "Compare the report with prior expectations and other conditions"
            }
          ],
          "correct": "reasoned",
          "explanation": "Compare the report with prior expectations and other conditions. An apparently favourable report need not produce a rise. Some favourable outcome may already have been anticipated; other news, quantities and motives may dominate. A headline alone is not enough to reconstruct what each participant expected.",
          "retry": "Revisit the scenario and its conditions. Test this mistaken claim: Good news guarantees a rising price. Then choose the explanation supported by the information given."
        }
      ],
      "explanation": [
        "A report matters through how it changes beliefs about future conditions and acceptable prices. The event itself and the surprise relative to prior expectations are different questions. Participants can read the same announcement differently.",
        "An apparently favourable report need not produce a rise. Some favourable outcome may already have been anticipated; other news, quantities and motives may dominate. A headline alone is not enough to reconstruct what each participant expected."
      ],
      "takeaway": "Separate new information from what participants expected",
      "demi": "Pause and explain: separate new information from what participants expected. Which assumption would change your answer?"
    },
    {
      "sectionId": "stage-1-class-7-section-5",
      "hook": "Surprise is not certainty",
      "scenario": "Hypothetical: a price jumps after a transport disruption. Lower available supply is one hypothesis; urgent purchasing or withdrawn offers are alternatives to investigate.",
      "visual": {
        "kind": "prices",
        "nodes": [
          {
            "label": "Observation",
            "detail": "A transaction price jumps"
          },
          {
            "label": "Hypothesis A",
            "detail": "Available supply has fallen"
          },
          {
            "label": "Hypothesis B",
            "detail": "Urgency rises or offers are withdrawn"
          }
        ],
        "caption": "Original HFT teaching map; all examples are hypothetical."
      },
      "practice": [
        {
          "id": "stage-1-class-7-explore-hypotheses",
          "kind": "matching",
          "prompt": "Match each additional observation to the explanation it would help investigate. Evidence can support a hypothesis without proving it is the sole cause.",
          "rows": [
            {
              "id": "offers",
              "label": "Nearby offered quantities shrink before the price jump"
            },
            {
              "id": "deadline",
              "label": "Buyers face a new immediate delivery deadline"
            }
          ],
          "options": [
            {
              "id": "urgency",
              "label": "Greater urgency to purchase"
            },
            {
              "id": "availability",
              "label": "Reduced nearby availability"
            }
          ],
          "answers": {
            "offers": "availability",
            "deadline": "urgency"
          },
          "explanation": "Shrinking offers helps investigate availability; a deadline helps investigate urgency. Either mechanism may coexist with others.",
          "retry": "Ask whether the observation describes available quantity or a participant\u2019s reason for acting quickly."
        }
      ],
      "explanation": [
        "Uncertainty means that several future outcomes remain possible. A surprise can cause participants to revise willingness quickly, but neither its direction nor its size supplies a dependable rule for the next move.",
        "A price change is an observation. A proposed cause is an explanation that needs supporting evidence. When timing, expectations or available quantities are missing, say what is unknown rather than filling the gap with a confident story."
      ],
      "takeaway": "State what evidence cannot establish",
      "demi": "Pause and explain: state what evidence cannot establish. Which assumption would change your answer?"
    },
    {
      "sectionId": "stage-1-class-7-section-6",
      "hook": "Different reasons, same transaction",
      "scenario": "Hypothetical: a bakery buys grain for tomorrow\u2019s production while a farm sells to meet payroll. Both can meet practical needs without betting on tomorrow\u2019s grain price.",
      "visual": {
        "kind": "prices",
        "nodes": [
          {
            "label": "Bakery",
            "detail": "Needs grain for tomorrow\u2019s production"
          },
          {
            "label": "Transaction",
            "detail": "Grain changes hands at agreed terms"
          },
          {
            "label": "Farm",
            "detail": "Needs cash to meet payroll"
          }
        ],
        "caption": "Original HFT teaching map; all examples are hypothetical."
      },
      "practice": [
        {
          "id": "stage-1-class-7-explore-6",
          "kind": "choice",
          "prompt": "A bakery buys grain from a farm meeting payroll. Which interpretation respects the evidence?",
          "options": [
            {
              "id": "shortcut",
              "label": "One side must have a mistaken forecast"
            },
            {
              "id": "reasoned",
              "label": "Operational needs can explain both sides"
            }
          ],
          "correct": "reasoned",
          "explanation": "Operational needs can explain both sides. Urgency can change acceptable terms. Someone meeting a payment deadline may trade even while believing a later price could be better. The transaction reveals agreement, not a complete biography or a reliable motive label.",
          "retry": "Revisit the scenario and its conditions. Test this mistaken claim: Every seller predicts a fall and every buyer predicts a rise. Then choose the explanation supported by the information given."
        }
      ],
      "explanation": [
        "Two participants can exchange the same asset for different reasons. A business may need inventory, an investor may rebalance, and another participant may need cash. Their decisions need not be opposite forecasts.",
        "Urgency can change acceptable terms. Someone meeting a payment deadline may trade even while believing a later price could be better. The transaction reveals agreement, not a complete biography or a reliable motive label."
      ],
      "takeaway": "Compare participant motives without inferring them from direction",
      "demi": "Pause and explain: compare participant motives without inferring them from direction. Which assumption would change your answer?"
    },
    {
      "sectionId": "stage-1-class-7-section-7",
      "hook": "Build a conditional explanation",
      "scenario": "Hypothetical: theatre ticket transactions rise from 25 to 28 tokens. New visitors and fewer sellers are competing explanations. Offer quantities and event timing would help distinguish them; the price series alone cannot.",
      "visual": {
        "kind": "prices",
        "nodes": [
          {
            "label": "Observed rise",
            "detail": "Tickets transact at 28 rather than 25"
          },
          {
            "label": "Demand explanation",
            "detail": "New visitors want tickets"
          },
          {
            "label": "Supply explanation",
            "detail": "Fewer sellers offer tickets"
          }
        ],
        "caption": "Original HFT teaching map; all examples are hypothetical."
      },
      "practice": [
        {
          "id": "stage-1-class-7-explore-7",
          "kind": "choice",
          "prompt": "Tickets rise after a festival announcement. What would improve the explanation?",
          "options": [
            {
              "id": "reasoned",
              "label": "Compare offer quantities and timing before choosing a cause"
            },
            {
              "id": "shortcut",
              "label": "Treat the price increase alone as proof of new visitors"
            }
          ],
          "correct": "reasoned",
          "explanation": "Compare offer quantities and timing before choosing a cause. Conditional language makes the reasoning testable: if offers stay unchanged and urgent purchases consume nearby quantity, later units may transact at higher available offers. New supply or cancelled demand could change that outcome. This is market literacy, not an HFT setup.",
          "retry": "Revisit the scenario and its conditions. Test this mistaken claim: A plausible story is a guaranteed trading rule. Then choose the explanation supported by the information given."
        },
        {
          "id": "stage-1-class-7-explore-explanation",
          "kind": "reflect",
          "prompt": "Explain how new ticket visitors and fewer sellers could each fit the same price rise. Which observation would help separate the explanations?",
          "explanation": "A useful comparison names demand and availability mechanisms and asks for timing or quantity evidence; the price alone does not identify a unique cause.",
          "retry": "State one mechanism for each hypothesis, then identify the missing evidence. This reflection is exploration, not automatic assessed credit."
        }
      ],
      "explanation": [
        "A useful explanation connects an observation to a mechanism and names assumptions. Start with what changed, then distinguish willingness, available quantities, information and participant needs. Compare at least two explanations when the evidence allows more than one.",
        "Conditional language makes the reasoning testable: if offers stay unchanged and urgent purchases consume nearby quantity, later units may transact at higher available offers. New supply or cancelled demand could change that outcome. This is market literacy, not an HFT setup."
      ],
      "takeaway": "Compare mechanisms and qualify a price explanation",
      "demi": "Pause and explain: compare mechanisms and qualify a price explanation. Which assumption would change your answer?"
    }
  ]
};
