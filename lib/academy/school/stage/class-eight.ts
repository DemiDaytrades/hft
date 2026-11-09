import type {StageClass} from './contracts';
export const CLASS_EIGHT:StageClass={
  "id": "stage-1-class-8",
  "version": "stage-1-class-8.1.0.0",
  "stageId": "stage-1",
  "number": 8,
  "title": "Welcome to the Foreign Exchange Market",
  "description": "Follow currency needs across borders and explain participants, relative value and uncertainty.",
  "courseId": "hft-school-foundations",
  "lessonId": "hft-school-class-8",
  "prerequisites": [
    "stage-1-class-7"
  ],
  "liveMinutes": 60,
  "reviewMinutes": 30,
  "objectives": [
    {
      "id": "stage-1-class-8-objective-1",
      "text": "Identify the currency need behind a cross-border payment",
      "competency": "stage-1-class-8-competency-1"
    },
    {
      "id": "stage-1-class-8-objective-2",
      "text": "Explain relative currency value",
      "competency": "stage-1-class-8-competency-2"
    },
    {
      "id": "stage-1-class-8-objective-3",
      "text": "Trace what is given and what is received",
      "competency": "stage-1-class-8-competency-3"
    },
    {
      "id": "stage-1-class-8-objective-4",
      "text": "Match FX participants with purposes",
      "competency": "stage-1-class-8-competency-4"
    },
    {
      "id": "stage-1-class-8-objective-5",
      "text": "Describe basic organization and relevant uncertainty",
      "competency": "stage-1-class-8-competency-5"
    },
    {
      "id": "stage-1-class-8-objective-6",
      "text": "Synthesize purpose, relative value and limits",
      "competency": "stage-1-class-8-competency-6"
    }
  ],
  "terms": [
    {
      "term": "Foreign exchange",
      "definition": "Exchanging one currency for another."
    },
    {
      "term": "Relative value",
      "definition": "What one currency obtains in a named other currency."
    },
    {
      "term": "Over the counter",
      "definition": "Trading through counterparties and venues rather than a single universal exchange."
    }
  ],
  "sections": [
    {
      "id": "stage-1-class-8-section-1",
      "title": "A payment crosses a border",
      "objectiveId": "stage-1-class-8-objective-1",
      "competency": "stage-1-class-8-competency-1",
      "paragraphs": [
        "A Canadian bookshop orders printing from a French printer whose invoice requires euros. The bookshop receives Canadian dollars from local sales. It needs a way to deliver the currency required by the contract, not merely a smaller or larger number on a screen.",
        "Foreign exchange connects such currency needs. The border alone does not determine the payment currency: parties can agree on a currency, and a business might already hold it. Read the invoice and available balances before assuming conversion is necessary."
      ],
      "example": "Hypothetical: Maple Books holds only Canadian dollars and owes the printer euros. It asks a payment provider about exchanging funds and delivering euros.",
      "misconception": "Every international payment automatically requires a new conversion.",
      "visual": "none",
      "activities": [
        {
          "id": "stage-1-class-8-activity-1",
          "kind": "choice",
          "category": "KNOWLEDGE",
          "sectionId": "stage-1-class-8-section-1",
          "objectiveId": "stage-1-class-8-objective-1",
          "competency": "stage-1-class-8-competency-1",
          "prompt": "A Canadian buyer owes euros. What should be checked first?",
          "options": [
            {
              "id": "supported",
              "label": "Check the invoice currency and existing balances"
            },
            {
              "id": "unsupported",
              "label": "Assume every French supplier accepts Canadian dollars"
            }
          ],
          "correct": "supported"
        }
      ]
    },
    {
      "id": "stage-1-class-8-section-2",
      "title": "Two currencies, one relationship",
      "objectiveId": "stage-1-class-8-objective-2",
      "competency": "stage-1-class-8-competency-2",
      "paragraphs": [
        "A currency\u2019s exchange value describes what it can obtain in another currency. Saying a currency became stronger is incomplete until we name the currency used for comparison and the period considered. Domestic purchasing power is a related but different question.",
        "One Canadian dollar obtaining more euros than before means it has strengthened relative to the euro in that comparison. It does not establish that it buys more groceries in Canada, or that it strengthened against every other currency."
      ],
      "example": "Hypothetical: the same Canadian-dollar amount obtains more euros on Friday than Monday. With other payment conditions held equal, a fixed euro invoice would require fewer Canadian dollars. No actual exchange quotation is being taught.",
      "misconception": "A stronger currency necessarily buys more of everything everywhere.",
      "visual": "none",
      "activities": [
        {
          "id": "stage-1-class-8-activity-2",
          "kind": "choice",
          "category": "KNOWLEDGE",
          "sectionId": "stage-1-class-8-section-2",
          "objectiveId": "stage-1-class-8-objective-2",
          "competency": "stage-1-class-8-competency-2",
          "prompt": "The same Canadian-dollar amount obtains more euros. What can be said?",
          "options": [
            {
              "id": "supported",
              "label": "Canadian dollars strengthened relative to euros in this comparison"
            },
            {
              "id": "unsupported",
              "label": "Canadian domestic prices must have fallen"
            }
          ],
          "correct": "supported"
        }
      ]
    },
    {
      "id": "stage-1-class-8-section-3",
      "title": "Exchange follows the obligation",
      "objectiveId": "stage-1-class-8-objective-3",
      "competency": "stage-1-class-8-competency-3",
      "paragraphs": [
        "Conversion exchanges an amount in one currency for an amount in another. Keep three questions separate: what the customer holds, what the recipient requires and which intermediary helps bridge the difference. A successful conversion alone does not prove that the recipient has been paid.",
        "A currency flow map can show the customer giving one currency, a provider arranging exchange, and a recipient receiving the required currency. It is a teaching simplification; actual accounts, payment chains and settlement arrangements vary."
      ],
      "example": "Hypothetical: a New Zealand student holds New Zealand dollars and a Swedish university requires kronor. The map must end with the university receiving kronor, not merely with the student seeing a conversion confirmation.",
      "misconception": "Converting money always completes the underlying payment.",
      "visual": "none",
      "activities": [
        {
          "id": "stage-1-class-8-activity-3",
          "kind": "choice",
          "category": "KNOWLEDGE",
          "sectionId": "stage-1-class-8-section-3",
          "objectiveId": "stage-1-class-8-objective-3",
          "competency": "stage-1-class-8-competency-3",
          "prompt": "A student has arranged conversion for university fees. What remaining outcome matters?",
          "options": [
            {
              "id": "supported",
              "label": "Confirm the university receives the required kronor"
            },
            {
              "id": "unsupported",
              "label": "Stop once a conversion is requested"
            }
          ],
          "correct": "supported"
        }
      ]
    },
    {
      "id": "stage-1-class-8-section-4",
      "title": "Participants serve different needs",
      "objectiveId": "stage-1-class-8-objective-4",
      "competency": "stage-1-class-8-competency-4",
      "paragraphs": [
        "Businesses may exchange currencies to pay suppliers or receive sales proceeds. Travellers may obtain spending money. Investors may change currency exposure when holding assets abroad. Dealers and other intermediaries help counterparties transact; central banks can also participate for policy or reserve purposes.",
        "A participant label does not reveal a single motive. A company may seek to reduce uncertainty rather than profit from a currency move. Hedging means managing an exposure; it does not remove every risk or make a transaction free. Detailed instruments come later."
      ],
      "example": "Hypothetical: an Australian museum pays a New Zealand conservator in New Zealand dollars. Its immediate need is paying for conservation work, not proving a speculative strategy.",
      "misconception": "FX exists only for retail speculation.",
      "visual": "none",
      "activities": [
        {
          "id": "stage-1-class-8-activity-4",
          "kind": "choice",
          "category": "KNOWLEDGE",
          "sectionId": "stage-1-class-8-section-4",
          "objectiveId": "stage-1-class-8-objective-4",
          "competency": "stage-1-class-8-competency-4",
          "prompt": "Why might a museum exchange currency to pay a foreign conservator?",
          "options": [
            {
              "id": "supported",
              "label": "A payment need for a service"
            },
            {
              "id": "unsupported",
              "label": "A guaranteed currency-profit opportunity"
            }
          ],
          "correct": "supported"
        }
      ]
    },
    {
      "id": "stage-1-class-8-section-5",
      "title": "A network with real risks",
      "objectiveId": "stage-1-class-8-objective-5",
      "competency": "stage-1-class-8-competency-5",
      "paragraphs": [
        "Much FX trading occurs over the counter: participants transact through relationships and trading venues rather than one single universal exchange. BIS describes a complex dealer and customer market. A retail screen offers one route into that wider network, not a view of every available transaction.",
        "The currency relationship can change before an obligation is paid. There can also be service charges, delays, counterparty and settlement problems, and operational errors. Which risks matter depends on the arrangement; liquid markets do not guarantee every customer a particular outcome."
      ],
      "example": "Hypothetical: a charity budgets for a future Norwegian-krone invoice using funds held in Swiss francs. If francs later obtain fewer kroner, more francs may be needed, with other conditions held equal.",
      "misconception": "An active global market guarantees a fixed cost and timely delivery.",
      "visual": "none",
      "activities": [
        {
          "id": "stage-1-class-8-activity-5",
          "kind": "choice",
          "category": "KNOWLEDGE",
          "sectionId": "stage-1-class-8-section-5",
          "objectiveId": "stage-1-class-8-objective-5",
          "competency": "stage-1-class-8-competency-5",
          "prompt": "A future foreign-currency invoice is budgeted today. What uncertainty remains?",
          "options": [
            {
              "id": "supported",
              "label": "Currency changes and payment arrangements can alter the outcome"
            },
            {
              "id": "unsupported",
              "label": "Global trading activity guarantees the budget"
            }
          ],
          "correct": "supported"
        }
      ]
    },
    {
      "id": "stage-1-class-8-section-6",
      "title": "Connect the money system to FX",
      "objectiveId": "stage-1-class-8-objective-6",
      "competency": "stage-1-class-8-competency-6",
      "paragraphs": [
        "Money lets obligations be stated and settled, institutions maintain accounts and payments, and markets connect participants with different needs. FX adds the problem that those needs can be expressed in different currencies. Start with the economic purpose before looking at a trading screen.",
        "A complete introductory map names the obligation, currencies held and required, participants, possible conversion and delivery, and uncertainties. It also marks missing information. Detailed quoting conventions and trading mechanics belong to later learning; a foundation map cannot authorize a trading decision."
      ],
      "example": "Hypothetical: a Kenyan arts group earns Kenyan shillings and hires a South African sound engineer paid in rand. Map the payment requirement and an intermediary, then ask about timing and delivery rather than assuming a profit.",
      "misconception": "Knowing a currency pair makes someone ready to trade it.",
      "visual": "none",
      "activities": [
        {
          "id": "stage-1-class-8-activity-6",
          "kind": "choice",
          "category": "KNOWLEDGE",
          "sectionId": "stage-1-class-8-section-6",
          "objectiveId": "stage-1-class-8-objective-6",
          "competency": "stage-1-class-8-competency-6",
          "prompt": "What belongs in an introductory cross-border currency map?",
          "options": [
            {
              "id": "supported",
              "label": "Identify the obligation, currency need, route and uncertainties"
            },
            {
              "id": "unsupported",
              "label": "Choose a trade because two currency names are known"
            }
          ],
          "correct": "supported"
        }
      ]
    }
  ],
  "assessment": [
    {
      "id": "stage-1-class-8-check-1",
      "kind": "choice",
      "category": "APPLICATION",
      "sectionId": "stage-1-class-8-section-1",
      "objectiveId": "stage-1-class-8-objective-1",
      "competency": "stage-1-class-8-competency-1",
      "prompt": "A Moroccan design studio holds dirhams but an agreed invoice requires euros. What determines the immediate currency need?",
      "options": [
        {
          "id": "supported",
          "label": "The invoice requirement and existing balances"
        },
        {
          "id": "unsupported",
          "label": "The nationality of the website alone"
        }
      ],
      "correct": "supported"
    },
    {
      "id": "stage-1-class-8-check-2",
      "kind": "choice",
      "category": "APPLICATION",
      "sectionId": "stage-1-class-8-section-2",
      "objectiveId": "stage-1-class-8-objective-2",
      "competency": "stage-1-class-8-competency-2",
      "prompt": "A fixed Australian-dollar amount obtains fewer Singapore dollars than last week. What is established?",
      "options": [
        {
          "id": "supported",
          "label": "It weakened relative to the Singapore dollar for that comparison"
        },
        {
          "id": "unsupported",
          "label": "Every Australian good became more expensive"
        }
      ],
      "correct": "supported"
    },
    {
      "id": "stage-1-class-8-check-3",
      "kind": "choice",
      "category": "APPLICATION",
      "sectionId": "stage-1-class-8-section-3",
      "objectiveId": "stage-1-class-8-objective-3",
      "competency": "stage-1-class-8-competency-3",
      "prompt": "A Brazilian student exchanges reais for pesos but the college has not received funds. What remains?",
      "options": [
        {
          "id": "supported",
          "label": "Delivery of the required payment still needs confirmation"
        },
        {
          "id": "unsupported",
          "label": "The educational obligation is automatically settled"
        }
      ],
      "correct": "supported"
    },
    {
      "id": "stage-1-class-8-check-4",
      "kind": "choice",
      "category": "APPLICATION",
      "sectionId": "stage-1-class-8-section-4",
      "objectiveId": "stage-1-class-8-objective-4",
      "competency": "stage-1-class-8-competency-4",
      "prompt": "A fund holds overseas assets and seeks less currency uncertainty. Which purpose fits?",
      "options": [
        {
          "id": "supported",
          "label": "Managing an exposure rather than necessarily pursuing a new speculative gain"
        },
        {
          "id": "unsupported",
          "label": "A promise of riskless profit"
        }
      ],
      "correct": "supported"
    },
    {
      "id": "stage-1-class-8-check-5",
      "kind": "choice",
      "category": "APPLICATION",
      "sectionId": "stage-1-class-8-section-5",
      "objectiveId": "stage-1-class-8-objective-5",
      "competency": "stage-1-class-8-competency-5",
      "prompt": "A dealer offers a conversion service. Does that represent the whole global FX market?",
      "options": [
        {
          "id": "supported",
          "label": "No; it is one route in a wider counterparty and venue network"
        },
        {
          "id": "unsupported",
          "label": "Yes; every FX participant uses one global exchange"
        }
      ],
      "correct": "supported"
    },
    {
      "id": "stage-1-class-8-check-6",
      "kind": "choice",
      "category": "APPLICATION",
      "sectionId": "stage-1-class-8-section-6",
      "objectiveId": "stage-1-class-8-objective-6",
      "competency": "stage-1-class-8-competency-6",
      "prompt": "A Ghanaian publisher must pay a Swiss translator in francs. Which foundation explanation is strongest?",
      "options": [
        {
          "id": "supported",
          "label": "Trace holdings, obligation, possible conversion and delivery, and name uncertainties"
        },
        {
          "id": "unsupported",
          "label": "Treat the two currency names as a complete trading plan"
        }
      ],
      "correct": "supported"
    },
    {
      "id": "stage-1-class-8-reasoning",
      "kind": "written",
      "category": "REASONING",
      "sectionId": "stage-1-class-8-section-6",
      "objectiveId": "stage-1-class-8-objective-6",
      "competency": "stage-1-class-8-competency-6",
      "prompt": "A Danish gallery holds kroner and owes a Polish frame maker zloty. Explain the currency relationship, possible participants and why conversion alone does not settle every risk.",
      "rubric": "Individual review required: identify the mechanism, qualify assumptions, use the named context, and distinguish observation from inference. Return overconfident or incomplete reasoning for revision."
    }
  ],
  "homework": [
    {
      "id": "stage-1-class-8-homework-map-1",
      "kind": "choice",
      "category": "HOMEWORK",
      "sectionId": "stage-1-class-8-section-1",
      "objectiveId": "stage-1-class-8-objective-1",
      "competency": "stage-1-class-8-competency-1",
      "prompt": "An Irish theatre holds euros and owes a British costume maker pounds. Which map respects the payment need?",
      "options": [
        {
          "id": "supported",
          "label": "Euros held \u2192 provider arranging exchange if needed \u2192 pounds delivered to costume maker"
        },
        {
          "id": "unsupported",
          "label": "Assume the costume maker must accept euros"
        }
      ],
      "correct": "supported"
    },
    {
      "id": "stage-1-class-8-homework-written-2",
      "kind": "written",
      "category": "HOMEWORK",
      "sectionId": "stage-1-class-8-section-3",
      "objectiveId": "stage-1-class-8-objective-3",
      "competency": "stage-1-class-8-competency-3",
      "prompt": "Map a Portuguese theatre holding euros and owing a Czech set designer koruna: identify obligation, balances, possible intermediary, conversion and recipient delivery. Then explain why a conversion confirmation alone may leave the payment incomplete. Use no personal account details.",
      "rubric": "Individually review coherent euro-to-koruna need, customer/provider/recipient roles and the distinction between exchange and delivery. Return an incomplete recipient path for revision."
    },
    {
      "id": "stage-1-class-8-homework-written-5",
      "kind": "written",
      "category": "HOMEWORK",
      "sectionId": "stage-1-class-8-section-6",
      "objectiveId": "stage-1-class-8-objective-6",
      "competency": "stage-1-class-8-competency-6",
      "prompt": "A fictional Malaysian publisher has a future Singapore-dollar invoice. The same ringgit amount would obtain fewer Singapore dollars today than when it budgeted. Explain the relative-value change and the possible effect on the ringgit needed for the fixed invoice, holding other conditions equal. Name a separate payment risk and one detail requiring later learning.",
      "rubric": "Individually review that ringgit weakened relative to Singapore dollars in the stated comparison and that more ringgit may be needed for the fixed invoice, all else equal. Require a separate payment risk and a specific learning boundary; do not infer domestic inflation or a guaranteed future move."
    },
    {
      "id": "stage-1-class-8-homework-reflection",
      "kind": "reflection",
      "category": "HOMEWORK",
      "sectionId": "stage-1-class-8-section-6",
      "objectiveId": "stage-1-class-8-objective-6",
      "competency": "stage-1-class-8-competency-6",
      "prompt": "Which assumption in your explanation is least secure? Name one observation or question that would help you revise it.",
      "rubric": "Individually review whether uncertainty is specific and the proposed follow-up is relevant. Honest uncertainty is not an error."
    }
  ],
  "remediation": [
    {
      "competency": "stage-1-class-8-competency-1",
      "sectionId": "stage-1-class-8-section-1",
      "title": "Revisit: A payment crosses a border",
      "paragraph": "Identify the currency need behind a cross-border payment. Return to the example, name the observation, and distinguish it from an assumption. Foreign exchange connects such currency needs. The border alone does not determine the payment currency: parties can agree on a currency, and a business might already hold it. Read the invoice and available balances before assuming conversion is necessary.",
      "reinforcement": {
        "id": "stage-1-class-8-reinforcement-1",
        "kind": "choice",
        "category": "APPLICATION",
        "sectionId": "stage-1-class-8-section-1",
        "objectiveId": "stage-1-class-8-objective-1",
        "competency": "stage-1-class-8-competency-1",
        "prompt": "A Turkish researcher already holds the euros needed for a conference invoice. Is a fresh conversion necessarily required?",
        "options": [
          {
            "id": "supported",
            "label": "No; inspect holdings and the obligation first"
          },
          {
            "id": "unsupported",
            "label": "Yes; crossing a border always forces a new exchange"
          }
        ],
        "correct": "supported"
      }
    },
    {
      "competency": "stage-1-class-8-competency-2",
      "sectionId": "stage-1-class-8-section-2",
      "title": "Revisit: Two currencies, one relationship",
      "paragraph": "Explain relative currency value. Return to the example, name the observation, and distinguish it from an assumption. One Canadian dollar obtaining more euros than before means it has strengthened relative to the euro in that comparison. It does not establish that it buys more groceries in Canada, or that it strengthened against every other currency.",
      "reinforcement": {
        "id": "stage-1-class-8-reinforcement-2",
        "kind": "choice",
        "category": "APPLICATION",
        "sectionId": "stage-1-class-8-section-2",
        "objectiveId": "stage-1-class-8-objective-2",
        "competency": "stage-1-class-8-competency-2",
        "prompt": "The same amount of Norwegian kroner obtains more Swiss francs. What is the bounded conclusion?",
        "options": [
          {
            "id": "supported",
            "label": "Kroner strengthened relative to francs in this comparison"
          },
          {
            "id": "unsupported",
            "label": "Norwegian domestic prices must have fallen"
          }
        ],
        "correct": "supported"
      }
    },
    {
      "competency": "stage-1-class-8-competency-3",
      "sectionId": "stage-1-class-8-section-3",
      "title": "Revisit: Exchange follows the obligation",
      "paragraph": "Trace what is given and what is received. Return to the example, name the observation, and distinguish it from an assumption. A currency flow map can show the customer giving one currency, a provider arranging exchange, and a recipient receiving the required currency. It is a teaching simplification; actual accounts, payment chains and settlement arrangements vary.",
      "reinforcement": {
        "id": "stage-1-class-8-reinforcement-3",
        "kind": "choice",
        "category": "APPLICATION",
        "sectionId": "stage-1-class-8-section-3",
        "objectiveId": "stage-1-class-8-objective-3",
        "competency": "stage-1-class-8-competency-3",
        "prompt": "A Mexican gallery arranges conversion but its foreign supplier reports no receipt. What distinction matters?",
        "options": [
          {
            "id": "supported",
            "label": "Exchange and delivery of the payment are different steps"
          },
          {
            "id": "unsupported",
            "label": "A conversion receipt proves supplier receipt"
          }
        ],
        "correct": "supported"
      }
    },
    {
      "competency": "stage-1-class-8-competency-4",
      "sectionId": "stage-1-class-8-section-4",
      "title": "Revisit: Participants serve different needs",
      "paragraph": "Match FX participants with purposes. Return to the example, name the observation, and distinguish it from an assumption. A participant label does not reveal a single motive. A company may seek to reduce uncertainty rather than profit from a currency move. Hedging means managing an exposure; it does not remove every risk or make a transaction free. Detailed instruments come later.",
      "reinforcement": {
        "id": "stage-1-class-8-reinforcement-4",
        "kind": "choice",
        "category": "APPLICATION",
        "sectionId": "stage-1-class-8-section-4",
        "objectiveId": "stage-1-class-8-objective-4",
        "competency": "stage-1-class-8-competency-4",
        "prompt": "A New Zealand company receives revenue in Australian dollars and has bills at home. Which purpose is plausible?",
        "options": [
          {
            "id": "supported",
            "label": "Converting receipts to meet operating obligations"
          },
          {
            "id": "unsupported",
            "label": "Only speculative retail trading"
          }
        ],
        "correct": "supported"
      }
    },
    {
      "competency": "stage-1-class-8-competency-5",
      "sectionId": "stage-1-class-8-section-5",
      "title": "Revisit: A network with real risks",
      "paragraph": "Describe basic organization and relevant uncertainty. Return to the example, name the observation, and distinguish it from an assumption. The currency relationship can change before an obligation is paid. There can also be service charges, delays, counterparty and settlement problems, and operational errors. Which risks matter depends on the arrangement; liquid markets do not guarantee every customer a particular outcome.",
      "reinforcement": {
        "id": "stage-1-class-8-reinforcement-5",
        "kind": "choice",
        "category": "APPLICATION",
        "sectionId": "stage-1-class-8-section-5",
        "objectiveId": "stage-1-class-8-objective-5",
        "competency": "stage-1-class-8-competency-5",
        "prompt": "A customer expects a foreign-currency payment next month. Which risk can remain despite active FX markets?",
        "options": [
          {
            "id": "supported",
            "label": "Currency changes or payment problems can alter the outcome"
          },
          {
            "id": "unsupported",
            "label": "Active markets guarantee delivery and cost"
          }
        ],
        "correct": "supported"
      }
    },
    {
      "competency": "stage-1-class-8-competency-6",
      "sectionId": "stage-1-class-8-section-6",
      "title": "Revisit: Connect the money system to FX",
      "paragraph": "Synthesize purpose, relative value and limits. Return to the example, name the observation, and distinguish it from an assumption. A complete introductory map names the obligation, currencies held and required, participants, possible conversion and delivery, and uncertainties. It also marks missing information. Detailed quoting conventions and trading mechanics belong to later learning; a foundation map cannot authorize a trading decision.",
      "reinforcement": {
        "id": "stage-1-class-8-reinforcement-6",
        "kind": "choice",
        "category": "APPLICATION",
        "sectionId": "stage-1-class-8-section-6",
        "objectiveId": "stage-1-class-8-objective-6",
        "competency": "stage-1-class-8-competency-6",
        "prompt": "A Czech theatre owes a Hungarian composer for music. What is the useful first map?",
        "options": [
          {
            "id": "supported",
            "label": "The obligation, currencies held and required, participants and uncertain delivery conditions"
          },
          {
            "id": "unsupported",
            "label": "A prediction of guaranteed currency profit"
          }
        ],
        "correct": "supported"
      }
    }
  ],
  "liveGuide": [
    {
      "title": "A payment crosses a border",
      "minutes": 10,
      "talkingPoints": [
        "Hook: Hypothetical: Maple Books holds only Canadian dollars and owes the printer euros. It asks a payment provider about exchanging funds and delivering euros.",
        "Teach: A Canadian bookshop orders printing from a French printer whose invoice requires euros. The bookshop receives Canadian dollars from local sales. It needs a way to deliver the currency required by the contract, not merely a smaller or larger number on a screen.",
        "Qualify: Foreign exchange connects such currency needs. The border alone does not determine the payment currency: parties can agree on a currency, and a business might already hold it. Read the invoice and available balances before assuming conversion is necessary.",
        "Check misconception: Every international payment automatically requires a new conversion.",
        "Demonstrate: Write the Canadian bookshop balance in one box and the French euro invoice in another. Add a second case where euros are already held; ask which case needs a new conversion.",
        "Transition: The obligation identifies what is needed; now describe the relationship between the two currencies."
      ],
      "activity": {
        "kind": "POLL",
        "prompt": "A Canadian buyer owes euros. What should be checked first?",
        "sectionId": "stage-1-class-8-section-1"
      }
    },
    {
      "title": "Two currencies, one relationship",
      "minutes": 10,
      "talkingPoints": [
        "Hook: Hypothetical: the same Canadian-dollar amount obtains more euros on Friday than Monday. With other payment conditions held equal, a fixed euro invoice would require fewer Canadian dollars. No actual exchange quotation is being taught.",
        "Teach: A currency\u2019s exchange value describes what it can obtain in another currency. Saying a currency became stronger is incomplete until we name the currency used for comparison and the period considered. Domestic purchasing power is a related but different question.",
        "Qualify: One Canadian dollar obtaining more euros than before means it has strengthened relative to the euro in that comparison. It does not establish that it buys more groceries in Canada, or that it strengthened against every other currency.",
        "Check misconception: A stronger currency necessarily buys more of everything everywhere.",
        "Demonstrate: Use two equal Canadian-dollar cards labelled Monday and Friday. Place a smaller euro pile beside Monday and a larger one beside Friday. Ask what changed relative to euros and what remains unknown about Canadian groceries.",
        "Transition: Relative value tells us about the exchange; next trace whether the recipient actually receives payment."
      ],
      "activity": {
        "kind": "SINGLE",
        "prompt": "The same Canadian-dollar amount obtains more euros. What can be said?",
        "sectionId": "stage-1-class-8-section-2"
      }
    },
    {
      "title": "Exchange follows the obligation",
      "minutes": 10,
      "talkingPoints": [
        "Hook: Hypothetical: a New Zealand student holds New Zealand dollars and a Swedish university requires kronor. The map must end with the university receiving kronor, not merely with the student seeing a conversion confirmation.",
        "Teach: Conversion exchanges an amount in one currency for an amount in another. Keep three questions separate: what the customer holds, what the recipient requires and which intermediary helps bridge the difference. A successful conversion alone does not prove that the recipient has been paid.",
        "Qualify: A currency flow map can show the customer giving one currency, a provider arranging exchange, and a recipient receiving the required currency. It is a teaching simplification; actual accounts, payment chains and settlement arrangements vary.",
        "Check misconception: Converting money always completes the underlying payment.",
        "Demonstrate: Arrange student, provider and university cards. Move a conversion-confirmed card to the provider but leave payment-received absent at the university. Ask students to locate the unfinished obligation.",
        "Transition: The route contains different participants; next compare why each might enter FX."
      ],
      "activity": {
        "kind": "WRITTEN",
        "prompt": "Trace what is given and what is received. Give a conditional explanation using the hypothetical case and name missing information.",
        "sectionId": "stage-1-class-8-section-3"
      }
    },
    {
      "title": "Participants serve different needs",
      "minutes": 10,
      "talkingPoints": [
        "Hook: Hypothetical: an Australian museum pays a New Zealand conservator in New Zealand dollars. Its immediate need is paying for conservation work, not proving a speculative strategy.",
        "Teach: Businesses may exchange currencies to pay suppliers or receive sales proceeds. Travellers may obtain spending money. Investors may change currency exposure when holding assets abroad. Dealers and other intermediaries help counterparties transact; central banks can also participate for policy or reserve purposes.",
        "Qualify: A participant label does not reveal a single motive. A company may seek to reduce uncertainty rather than profit from a currency move. Hedging means managing an exposure; it does not remove every risk or make a transaction free. Detailed instruments come later.",
        "Check misconception: FX exists only for retail speculation.",
        "Demonstrate: Give groups museum, traveller and overseas investor cards. Match each to a payment, spending or exposure-management purpose; allow multiple motives and ask what evidence would clarify a participant\u2019s purpose.",
        "Transition: Those participants connect through a market network; examine what a single provider screen leaves out."
      ],
      "activity": {
        "kind": "POLL",
        "prompt": "Why might a museum exchange currency to pay a foreign conservator?",
        "sectionId": "stage-1-class-8-section-4"
      }
    },
    {
      "title": "A network with real risks",
      "minutes": 10,
      "talkingPoints": [
        "Hook: Hypothetical: a charity budgets for a future Norwegian-krone invoice using funds held in Swiss francs. If francs later obtain fewer kroner, more francs may be needed, with other conditions held equal.",
        "Teach: Much FX trading occurs over the counter: participants transact through relationships and trading venues rather than one single universal exchange. BIS describes a complex dealer and customer market. A retail screen offers one route into that wider network, not a view of every available transaction.",
        "Qualify: The currency relationship can change before an obligation is paid. There can also be service charges, delays, counterparty and settlement problems, and operational errors. Which risks matter depends on the arrangement; liquid markets do not guarantee every customer a particular outcome.",
        "Check misconception: An active global market guarantees a fixed cost and timely delivery.",
        "Demonstrate: Draw the Swiss-franc charity connected to one provider, then add other providers and counterparties. Mark future krone need and a delayed-payment symbol separately, so learners distinguish currency risk from operational risk.",
        "Transition: Bring purpose, relative value, route and uncertainty into a complete foundation map."
      ],
      "activity": {
        "kind": "SINGLE",
        "prompt": "A future foreign-currency invoice is budgeted today. What uncertainty remains?",
        "sectionId": "stage-1-class-8-section-5"
      }
    },
    {
      "title": "Connect the money system to FX",
      "minutes": 10,
      "talkingPoints": [
        "Hook: Hypothetical: a Kenyan arts group earns Kenyan shillings and hires a South African sound engineer paid in rand. Map the payment requirement and an intermediary, then ask about timing and delivery rather than assuming a profit.",
        "Teach: Money lets obligations be stated and settled, institutions maintain accounts and payments, and markets connect participants with different needs. FX adds the problem that those needs can be expressed in different currencies. Start with the economic purpose before looking at a trading screen.",
        "Qualify: A complete introductory map names the obligation, currencies held and required, participants, possible conversion and delivery, and uncertainties. It also marks missing information. Detailed quoting conventions and trading mechanics belong to later learning; a foundation map cannot authorize a trading decision.",
        "Check misconception: Knowing a currency pair makes someone ready to trade it.",
        "Demonstrate: Build the Kenyan arts group to South African engineer route with learners. Ask one learner to audit currency requirements, another delivery, and a third missing information; leave unknown terms visibly blank.",
        "Transition: Recap the Stage 1 chain from money and institutions to markets and FX. Later learning addresses quotation and trading mechanics; this map alone is not trading readiness."
      ],
      "activity": {
        "kind": "WRITTEN",
        "prompt": "Synthesize purpose, relative value and limits. Give a conditional explanation using the hypothetical case and name missing information.",
        "sectionId": "stage-1-class-8-section-6"
      }
    }
  ],
  "studyGuide": {
    "summary": [
      "Read the obligation before assuming a conversion: the required payment currency and balances already held determine the need. Country names alone do not determine the route.",
      "Currency strength is a comparison between named currencies over a stated interval. It does not establish domestic purchasing power or strength against every other currency.",
      "Follow the route beyond exchange to recipient delivery. Different participants meet different needs through a wider market network, with currency and payment uncertainties still present."
    ],
    "bigPicture": "An introductory FX explanation follows a real purpose from the currency held to the currency required, through a possible intermediary, and ends by asking whether the recipient receives payment and which uncertainties remain.",
    "fiveThings": [
      "Identify what the contract requires.",
      "Check balances before assuming conversion.",
      "Name both currencies in any relative-value statement.",
      "Distinguish exchange confirmation from delivered payment.",
      "Separate currency uncertainty from payment and operational risks."
    ],
    "outcomes": [
      "Draw a complete currency-needs route for a new cross-border obligation.",
      "Explain a relative currency change without making unsupported claims about domestic prices.",
      "Describe participant purposes and unanswered questions before later trading mechanics."
    ],
    "examples": [
      "Review case: a Finnish orchestra holds euros and owes a Norwegian instrument repairer kroner. If it already holds sufficient kroner in another balance, a new conversion may be unnecessary; payment delivery still matters.",
      "Review case: the same Polish-zloty amount obtains more Danish kroner on one date than another. Zloty strengthened relative to kroner in that comparison; Polish grocery prices remain unknown.",
      "Review case: an Egyptian museum pays a Tunisian archivist in an agreed currency. Confirming an exchange with a provider does not alone prove the archivist received the required amount on time."
    ],
    "misconceptions": [
      "An overseas invoice does not by itself prove a fresh currency exchange is needed.",
      "Relative strengthening does not imply greater buying power for every good and currency.",
      "A deep global market does not guarantee an individual payment\u2019s timing, cost or completion."
    ],
    "review": [
      {
        "sectionId": "stage-1-class-8-section-1",
        "label": "A payment crosses a border"
      },
      {
        "sectionId": "stage-1-class-8-section-2",
        "label": "Two currencies, one relationship"
      },
      {
        "sectionId": "stage-1-class-8-section-3",
        "label": "Exchange follows the obligation"
      },
      {
        "sectionId": "stage-1-class-8-section-4",
        "label": "Participants serve different needs"
      },
      {
        "sectionId": "stage-1-class-8-section-5",
        "label": "A network with real risks"
      },
      {
        "sectionId": "stage-1-class-8-section-6",
        "label": "Connect the money system to FX"
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
      "title": "BIS Working Paper 1094 \u2014 The foreign exchange market",
      "url": "https://www.bis.org/publications/working-paper-1094-foreign-exchange-market"
    },
    {
      "title": "Federal Reserve Bank of New York \u2014 Foreign Exchange Committee: About",
      "url": "https://www.newyorkfed.org/fxc/about"
    },
    {
      "title": "Bank of England \u2014 Who sets exchange rates?",
      "url": "https://www.bankofengland.co.uk/explainers/who-sets-exchange-rates"
    }
  ],
  "design": {
    "format": "Cross-border currency journey",
    "homeworkTitle": "Map a currency need",
    "homeworkIntro": "Use original hypothetical evidence and make your assumptions visible. Written reasoning receives individual instructor review.",
    "reflectionItemId": "stage-1-class-8-homework-reflection",
    "pacing": {
      "minimum": 50,
      "maximum": 75
    },
    "assessmentCoverage": [
      "stage-1-class-8-competency-1",
      "stage-1-class-8-competency-2",
      "stage-1-class-8-competency-3",
      "stage-1-class-8-competency-4",
      "stage-1-class-8-competency-5",
      "stage-1-class-8-competency-6"
    ],
    "practicalRequirement": "No chart or trading practical is required; objective evidence and individually reviewed reasoning remain separate.",
    "videoOpportunity": "An instructor may choose a short institutional explainer on price discovery or currency exchange, pause before its conclusion, and ask students to identify assumptions. No playback is required.",
    "studyGuideVisual": {
      "kind": "fx",
      "nodes": [
        {
          "label": "Purpose and obligation",
          "detail": "Who must be paid, in which currency, and when?"
        },
        {
          "label": "Balances and route",
          "detail": "What currency is held; is exchange needed; which provider may arrange delivery?"
        },
        {
          "label": "Recipient and uncertainty",
          "detail": "Verify required currency received; identify currency changes, delays and missing terms."
        }
      ],
      "caption": "Review currency-needs map: obligation \u2192 holdings and possible conversion \u2192 recipient delivery. Actual payment arrangements vary."
    },
    "studyGuideChecks": [
      "A buyer already holds the foreign currency required by an invoice. Why might a fresh conversion be unnecessary? What must still happen?",
      "The same held-currency amount obtains less of the invoice currency. All else equal, how might that affect funding a fixed invoice?",
      "Give one practical payment purpose and one exposure-management purpose for FX participation.",
      "What does a conversion confirmation fail to establish about the recipient? Name a risk distinct from currency movement."
    ]
  }
};
