import type {StageClass} from './contracts';

// Private academic definition: answer keys, review rubrics and authoring references.
export const CLASS_TWO: StageClass = {
  "id": "stage-1-class-2",
  "version": "stage-1-class-2.1.0.0",
  "stageId": "stage-1",
  "number": 2,
  "title": "How Money Evolved",
  "description": "Compare selected monetary pathways through problems, responses and remaining limitations without imposing a universal history.",
  "courseId": "hft-school-foundations",
  "lessonId": "hft-school-class-2",
  "prerequisites": [
    "stage-1-class-1"
  ],
  "liveMinutes": 60,
  "reviewMinutes": 30,
  "objectives": [
    {
      "id": "stage-1-class-2-objective-1",
      "text": "Compare exchange arrangements without inventing a universal starting point",
      "competency": "stage-1-class-2-competency-1"
    },
    {
      "id": "stage-1-class-2-objective-2",
      "text": "Explain a commodity example through its usefulness and limitations",
      "competency": "stage-1-class-2-competency-2"
    },
    {
      "id": "stage-1-class-2-objective-3",
      "text": "Distinguish standardization from a guarantee of value",
      "competency": "stage-1-class-2-competency-3"
    },
    {
      "id": "stage-1-class-2-objective-4",
      "text": "Separate historical redeemable claims from contemporary fiat currency",
      "competency": "stage-1-class-2-competency-4"
    },
    {
      "id": "stage-1-class-2-objective-5",
      "text": "Distinguish a monetary balance from the tool used to transfer it",
      "competency": "stage-1-class-2-competency-5"
    },
    {
      "id": "stage-1-class-2-objective-6",
      "text": "Compare improvements and continuing dependencies across forms",
      "competency": "stage-1-class-2-competency-6"
    }
  ],
  "terms": [
    {
      "term": "Commodity money",
      "definition": "An accepted payment object also valued for a nonmonetary use."
    },
    {
      "term": "Denomination",
      "definition": "A stated monetary amount assigned to an instrument."
    },
    {
      "term": "Redeemable claim",
      "definition": "A claim whose terms promise a specified asset or payment in exchange."
    },
    {
      "term": "Fiat currency",
      "definition": "Currency whose monetary arrangement is not a fixed commodity-redemption promise."
    },
    {
      "term": "Coexistence",
      "definition": "Different monetary forms or exchange arrangements operating in the same setting."
    }
  ],
  "sections": [
    {
      "id": "stage-1-class-2-section-1",
      "title": "Exchange before a single story",
      "objectiveId": "stage-1-class-2-objective-1",
      "competency": "stage-1-class-2-competency-1",
      "paragraphs": [
        "Begin with a problem rather than a date: how can people obtain something when their wants, locations or payment times differ? Direct exchange is one possible arrangement. Gifts, obligations and recorded debts can also organize transfers. A classroom barter story isolates a coordination difficulty; it is not evidence that every society first lived in a pure barter economy.",
        "History needs place, period and evidence. When comparing two arrangements, ask who accepts the payment, how an obligation is remembered and what happens if somebody refuses. These questions reveal institutional differences that a simple progression arrow hides. Our timeline contains selected examples and overlapping pathways, not a universal ladder."
      ],
      "example": "In a hypothetical harbor, one trader swaps cloth directly, another records a delivery debt and a household shares provisions. These arrangements could operate together; their coexistence does not put each person in a different historical age.",
      "misconception": "An easy-to-imagine barter difficulty proves the chronological origin of all money.",
      "visual": "none",
      "activities": [
        {
          "id": "stage-1-class-2-check-1",
          "kind": "choice",
          "category": "KNOWLEDGE",
          "sectionId": "stage-1-class-2-section-1",
          "objectiveId": "stage-1-class-2-objective-1",
          "competency": "stage-1-class-2-competency-1",
          "prompt": "What can the harbor example establish?",
          "correct": "stage-1-class-2-check-1-supported",
          "options": [
            {
              "id": "stage-1-class-2-check-1-unsupported",
              "label": "Every society began with identical barter markets"
            },
            {
              "id": "stage-1-class-2-check-1-supported",
              "label": "Different exchange arrangements can coexist"
            }
          ]
        }
      ]
    },
    {
      "id": "stage-1-class-2-section-2",
      "title": "Objects accepted as payment",
      "objectiveId": "stage-1-class-2-objective-2",
      "competency": "stage-1-class-2-competency-2",
      "paragraphs": [
        "A commodity used as money has uses or desirability beyond the monetary role. A metal may be valued for manufacture as well as payment. That does not make every valuable object money: acceptance by other people and a usable way to measure quantities still matter.",
        "Commodity arrangements answer some problems while retaining others. Durability, transport, divisibility and quality verification affect how well an object works. Compare a payment problem with the specific property that helps; then name a limitation that remains. Avoid calling any commodity perfect or treating commodity use as a required stage for every society."
      ],
      "example": "Imagine merchants accepting measured copper. It can be divided into smaller amounts, but a heavy shipment remains costly to transport and somebody must check its quality.",
      "misconception": "An object with a useful nonmonetary purpose automatically becomes generally accepted money.",
      "visual": "none",
      "activities": [
        {
          "id": "stage-1-class-2-check-2",
          "kind": "choice",
          "category": "KNOWLEDGE",
          "sectionId": "stage-1-class-2-section-2",
          "objectiveId": "stage-1-class-2-objective-2",
          "competency": "stage-1-class-2-competency-2",
          "prompt": "Which trade-off fits measured copper?",
          "correct": "stage-1-class-2-check-2-supported",
          "options": [
            {
              "id": "stage-1-class-2-check-2-supported",
              "label": "Divisibility can help while weight and quality checks remain problems"
            },
            {
              "id": "stage-1-class-2-check-2-unsupported",
              "label": "Acceptance removes all transport costs"
            }
          ]
        }
      ]
    },
    {
      "id": "stage-1-class-2-section-3",
      "title": "Weighing, stamping and confidence",
      "objectiveId": "stage-1-class-2-objective-3",
      "competency": "stage-1-class-2-competency-3",
      "paragraphs": [
        "Weighed metal requires agreement about amount and purity. Coins can add a recognizable stamp and standardized denomination, reducing some repeated measurement work when users trust the issuer and the coin. A stamp is therefore part of an institutional arrangement as well as a physical design.",
        "Standardization does not abolish verification or changing purchasing power. Wear, counterfeiting and doubts about an issuer can still matter. Do not confuse a stated denomination, the metal content and what the coin buys: these are different questions. The important historical change here is a response to transaction costs, not proof that trust disappeared."
      ],
      "example": "A hypothetical seller recognizes a coin denomination but inspects a badly worn piece before accepting it. Recognition speeds ordinary transactions without preventing every dispute.",
      "misconception": "A stamped coin guarantees constant purchasing power and never needs verification.",
      "visual": "none",
      "activities": [
        {
          "id": "stage-1-class-2-check-3",
          "kind": "choice",
          "category": "KNOWLEDGE",
          "sectionId": "stage-1-class-2-section-3",
          "objectiveId": "stage-1-class-2-objective-3",
          "competency": "stage-1-class-2-competency-3",
          "prompt": "What problem can a trusted standard coin reduce?",
          "correct": "stage-1-class-2-check-3-supported",
          "options": [
            {
              "id": "stage-1-class-2-check-3-unsupported",
              "label": "Every future change in purchasing power"
            },
            {
              "id": "stage-1-class-2-check-3-supported",
              "label": "Repeated weighing and identification in ordinary payments"
            }
          ]
        }
      ]
    },
    {
      "id": "stage-1-class-2-section-4",
      "title": "Paper, promises and issuers",
      "objectiveId": "stage-1-class-2-objective-4",
      "competency": "stage-1-class-2-competency-4",
      "paragraphs": [
        "A paper claim can be easier to carry than the asset or payment obligation it represents. Its acceptance depends on confidence in the issuer and the rules of redemption or payment. Ask what the holder is entitled to receive rather than assuming all paper instruments mean the same thing.",
        "Stockholms Banco issued banknotes in Sweden in 1661, a specific European example documented by the Riksbank. This is not a claim that Sweden invented every form of paper money. Contemporary euro banknotes are fiat currency and are not promises to redeem a fixed weight of gold. Similar-looking paper can therefore embody different monetary arrangements.",
        "The Swedish institutional pathway continued: the Bank of the Estates of the Realm, today’s Riksbank, was founded in 1668 after Stockholms Banco failed. In 1701, transport bills allowed a holder to sign a bill over to another owner. In 1904 the Riksbank became Sweden’s sole banknote issuer. These developments concern institutions, transferability and issuing authority; they are not one invention repeated or a necessary path for every country."
      ],
      "example": "Compare a hypothetical receipt redeemable for stored metal with a modern euro note. Both are light to carry, but only the receipt in this example promises the specified metal.",
      "misconception": "All paper money is a warehouse receipt that can always be exchanged for gold.",
      "visual": "none",
      "activities": [
        {
          "id": "stage-1-class-2-check-4",
          "kind": "choice",
          "category": "KNOWLEDGE",
          "sectionId": "stage-1-class-2-section-4",
          "objectiveId": "stage-1-class-2-objective-4",
          "competency": "stage-1-class-2-competency-4",
          "prompt": "Which question best distinguishes the two paper instruments?",
          "correct": "stage-1-class-2-check-4-supported",
          "options": [
            {
              "id": "stage-1-class-2-check-4-supported",
              "label": "What obligation or currency arrangement stands behind each?"
            },
            {
              "id": "stage-1-class-2-check-4-unsupported",
              "label": "Which paper sheet is heavier?"
            }
          ]
        }
      ]
    },
    {
      "id": "stage-1-class-2-section-5",
      "title": "Accounts and payment instructions",
      "objectiveId": "stage-1-class-2-objective-5",
      "competency": "stage-1-class-2-competency-5",
      "paragraphs": [
        "When a bank records a customer deposit, the balance is a claim on that bank. Payments can transfer value through changes in records and arrangements among institutions. The physical movement of a particular bundle of notes is not necessary for every payment.",
        "A card or banking app normally supplies instructions or access; it is not a new currency merely because its interface is new. Account systems reduce some distance and handling difficulties while introducing dependencies on records, institutions and operational access. The next class will trace the participants in those systems rather than treating a screen as the entire money system.",
        "A different regional pathway separates a currency’s launch from its cash form. In the initial euro-area changeover, the euro began on 1 January 1999 for accounting and electronic payments; euro notes and coins arrived on 1 January 2002. This counterexample to a cash-first assumption does not imply that the euro was the world’s first account money, or that every currency follows this launch sequence."
      ],
      "example": "A hypothetical customer uses a debit card for a 24-unit purchase. The card initiates a payment using an account balance; the plastic is not itself 24 units of money.",
      "misconception": "Every new payment device creates a distinct new currency.",
      "visual": "none",
      "activities": [
        {
          "id": "stage-1-class-2-check-5",
          "kind": "choice",
          "category": "KNOWLEDGE",
          "sectionId": "stage-1-class-2-section-5",
          "objectiveId": "stage-1-class-2-objective-5",
          "competency": "stage-1-class-2-competency-5",
          "prompt": "What is the clearest distinction?",
          "correct": "stage-1-class-2-check-5-supported",
          "options": [
            {
              "id": "stage-1-class-2-check-5-unsupported",
              "label": "The card itself is the deposit"
            },
            {
              "id": "stage-1-class-2-check-5-supported",
              "label": "A bank balance is a claim; a debit card is a way to instruct payment"
            }
          ]
        }
      ]
    },
    {
      "id": "stage-1-class-2-section-6",
      "title": "Coexistence and historical judgment",
      "objectiveId": "stage-1-class-2-objective-6",
      "competency": "stage-1-class-2-competency-6",
      "paragraphs": [
        "Cash and account payments coexist in contemporary economies. A newer mechanism may solve a particular difficulty without replacing every older form. Access, cost, acceptance, resilience and privacy can influence which arrangement people choose in a given setting.",
        "Build a defensible historical explanation with four parts: context, problem, response and remaining limitation. A timeline orders selected dated events; it does not rank societies or guarantee that the newest system is safest. Across different forms, people still need confidence that payment will be accepted and obligations will be honored.",
        "Compare the Swedish issuer-and-transferability lane with the euro-area launch lane. Ordering events within each gives chronology. It does not establish that one lane caused the other, or that all monetary history fits these European examples. Large parts of the world’s monetary history are outside this introductory selection."
      ],
      "example": "In a hypothetical town, a shop accepts cash during a network outage and account payments when service returns. Two forms meet different practical needs within the same present-day economy.",
      "misconception": "Digital access makes confidence, institutions and older payment forms unnecessary.",
      "visual": "none",
      "activities": [
        {
          "id": "stage-1-class-2-check-6",
          "kind": "choice",
          "category": "KNOWLEDGE",
          "sectionId": "stage-1-class-2-section-6",
          "objectiveId": "stage-1-class-2-objective-6",
          "competency": "stage-1-class-2-competency-6",
          "prompt": "Which conclusion is supported by the outage example?",
          "correct": "stage-1-class-2-check-6-supported",
          "options": [
            {
              "id": "stage-1-class-2-check-6-supported",
              "label": "Coexisting forms can provide different practical options"
            },
            {
              "id": "stage-1-class-2-check-6-unsupported",
              "label": "Cash users belong to an earlier historical period"
            }
          ]
        }
      ]
    }
  ],
  "assessment": [
    {
      "id": "stage-1-class-2-assessment-1",
      "kind": "choice",
      "category": "APPLICATION",
      "sectionId": "stage-1-class-2-section-1",
      "objectiveId": "stage-1-class-2-objective-1",
      "competency": "stage-1-class-2-competency-1",
      "prompt": "A community uses both neighborly obligations and cash sales. Which conclusion follows?",
      "correct": "stage-1-class-2-assessment-1-supported",
      "options": [
        {
          "id": "stage-1-class-2-assessment-1-unsupported",
          "label": "One of the arrangements cannot really exist"
        },
        {
          "id": "stage-1-class-2-assessment-1-supported",
          "label": "There is more than one arrangement for transferring goods"
        }
      ]
    },
    {
      "id": "stage-1-class-2-assessment-2",
      "kind": "choice",
      "category": "APPLICATION",
      "sectionId": "stage-1-class-2-section-2",
      "objectiveId": "stage-1-class-2-objective-2",
      "competency": "stage-1-class-2-competency-2",
      "prompt": "A bulky useful commodity is accepted locally. What still limits a distant payment?",
      "correct": "stage-1-class-2-assessment-2-supported",
      "options": [
        {
          "id": "stage-1-class-2-assessment-2-supported",
          "label": "Moving and verifying the commodity may be costly"
        },
        {
          "id": "stage-1-class-2-assessment-2-unsupported",
          "label": "Its usefulness guarantees worldwide acceptance"
        }
      ]
    },
    {
      "id": "stage-1-class-2-assessment-3",
      "kind": "choice",
      "category": "APPLICATION",
      "sectionId": "stage-1-class-2-section-3",
      "objectiveId": "stage-1-class-2-objective-3",
      "competency": "stage-1-class-2-competency-3",
      "prompt": "A familiar coin appears damaged. Which response is consistent with standardization?",
      "correct": "stage-1-class-2-assessment-3-supported",
      "options": [
        {
          "id": "stage-1-class-2-assessment-3-unsupported",
          "label": "Assume the stamp makes damage irrelevant"
        },
        {
          "id": "stage-1-class-2-assessment-3-supported",
          "label": "Recognize the denomination but still assess acceptability"
        }
      ]
    },
    {
      "id": "stage-1-class-2-assessment-4",
      "kind": "choice",
      "category": "APPLICATION",
      "sectionId": "stage-1-class-2-section-4",
      "objectiveId": "stage-1-class-2-objective-4",
      "competency": "stage-1-class-2-competency-4",
      "prompt": "A museum displays a historical metal-redeemable note. What must a visitor avoid assuming?",
      "correct": "stage-1-class-2-assessment-4-supported",
      "options": [
        {
          "id": "stage-1-class-2-assessment-4-supported",
          "label": "A modern fiat note has the same redemption promise"
        },
        {
          "id": "stage-1-class-2-assessment-4-unsupported",
          "label": "Paper can make large payments easier to carry"
        }
      ]
    },
    {
      "id": "stage-1-class-2-assessment-5",
      "kind": "choice",
      "category": "APPLICATION",
      "sectionId": "stage-1-class-2-section-5",
      "objectiveId": "stage-1-class-2-objective-5",
      "competency": "stage-1-class-2-competency-5",
      "prompt": "A person changes banking apps but keeps the same account currency. What changed?",
      "correct": "stage-1-class-2-assessment-5-supported",
      "options": [
        {
          "id": "stage-1-class-2-assessment-5-unsupported",
          "label": "The currency must have become a different money"
        },
        {
          "id": "stage-1-class-2-assessment-5-supported",
          "label": "The access interface, not necessarily the currency"
        }
      ]
    },
    {
      "id": "stage-1-class-2-assessment-6",
      "kind": "choice",
      "category": "APPLICATION",
      "sectionId": "stage-1-class-2-section-6",
      "objectiveId": "stage-1-class-2-objective-6",
      "competency": "stage-1-class-2-competency-6",
      "prompt": "A new payment tool works quickly but requires connectivity. Which evaluation is strongest?",
      "correct": "stage-1-class-2-assessment-6-supported",
      "options": [
        {
          "id": "stage-1-class-2-assessment-6-supported",
          "label": "Name the speed benefit and the access limitation"
        },
        {
          "id": "stage-1-class-2-assessment-6-unsupported",
          "label": "Call it universally superior because it is newer"
        }
      ]
    },
    {
      "id": "stage-1-class-2-assessment-explanation",
      "kind": "written",
      "category": "REASONING",
      "sectionId": "stage-1-class-2-section-6",
      "objectiveId": "stage-1-class-2-objective-6",
      "competency": "stage-1-class-2-competency-6",
      "prompt": "A museum labels a display “the inevitable replacement of barter by digital money.” Explain two reasons to revise that label and propose a more careful caption.",
      "rubric": "Individually review nonuniversal chronology and coexistence; require an original qualified caption with an explained limitation."
    }
  ],
  "homework": [
    {
      "id": "stage-1-class-2-homework-map",
      "kind": "matching",
      "category": "HOMEWORK",
      "sectionId": "stage-1-class-2-section-3",
      "objectiveId": "stage-1-class-2-objective-3",
      "competency": "stage-1-class-2-competency-3",
      "prompt": "Order these selected regional developments by their stated dates. Then use the written task to explain why a chronological order alone cannot prove a universal monetary history.",
      "correct": {
        "stage-1-class-2-homework-row-0": "stage-1-class-2-homework-target-0",
        "stage-1-class-2-homework-row-1": "stage-1-class-2-homework-target-1",
        "stage-1-class-2-homework-row-2": "stage-1-class-2-homework-target-2"
      },
      "items": [
        {
          "id": "stage-1-class-2-homework-row-0",
          "label": "Bank of the Estates established in Sweden, 1668"
        },
        {
          "id": "stage-1-class-2-homework-row-1",
          "label": "Initial euro-area accounting/electronic launch, 1 January 1999"
        },
        {
          "id": "stage-1-class-2-homework-row-2",
          "label": "Initial euro-area notes and coins introduced, 1 January 2002"
        }
      ],
      "targets": [
        {
          "id": "stage-1-class-2-homework-target-0",
          "label": "Earliest stated event"
        },
        {
          "id": "stage-1-class-2-homework-target-1",
          "label": "Second stated event"
        },
        {
          "id": "stage-1-class-2-homework-target-2",
          "label": "Latest stated event"
        }
      ]
    },
    {
      "id": "stage-1-class-2-homework-reasoning",
      "kind": "written",
      "category": "HOMEWORK",
      "sectionId": "stage-1-class-2-section-6",
      "objectiveId": "stage-1-class-2-objective-6",
      "competency": "stage-1-class-2-competency-6",
      "prompt": "Choose two arrangements from different chapters. For each, state its context, one payment problem, the response and one remaining limitation. Then explain why putting these examples on a timeline does not prove a universal barter-to-digital ladder.",
      "rubric": "Individually review both problem–response–limitation explanations. Require a qualified context and a reason the examples cannot establish universal origins; return unsupported universal claims for revision. Do not award reasoning from length alone."
    },
    {
      "id": "stage-1-class-2-homework-comparison",
      "kind": "written",
      "category": "HOMEWORK",
      "sectionId": "stage-1-class-2-section-4",
      "objectiveId": "stage-1-class-2-objective-4",
      "competency": "stage-1-class-2-competency-4",
      "prompt": "Compare a hypothetical metal-redeemable receipt with a modern euro banknote. Explain the different entitlement and why portable paper alone does not identify the monetary arrangement.",
      "rubric": "Individually review the comparison of entitlements: the hypothetical receipt promises specified metal under its terms, while the contemporary euro note is fiat currency without fixed gold redemption. Require an explanation that portability and paper material do not establish the same promise. Return claims that all notes remain gold receipts; judge the explanation rather than its length."
    },
    {
      "id": "stage-1-class-2-homework-reflection",
      "kind": "reflection",
      "category": "HOMEWORK",
      "sectionId": "stage-1-class-2-section-6",
      "objectiveId": "stage-1-class-2-objective-6",
      "competency": "stage-1-class-2-competency-6",
      "prompt": "Which part of your own story about money’s history changed? Name one question whose answer would require evidence from a particular place and period.",
      "rubric": "Individually review a specific conceptual change and an intelligible remaining question. Uncertainty is acceptable; request clarification if no connection to the class is explained."
    }
  ],
  "remediation": [
    {
      "competency": "stage-1-class-2-competency-1",
      "sectionId": "stage-1-class-2-section-1",
      "title": "Revisit: Exchange before a single story",
      "paragraph": "Return to the worked example. History needs place, period and evidence. When comparing two arrangements, ask who accepts the payment, how an obligation is remembered and what happens if somebody refuses. These questions reveal institutional differences that a simple progression arrow hides. Our timeline contains selected examples and overlapping pathways, not a universal ladder. Explain which actor or condition the mistaken claim overlooked before trying this new check.",
      "reinforcement": {
        "id": "stage-1-class-2-reinforcement-1",
        "kind": "choice",
        "category": "KNOWLEDGE",
        "sectionId": "stage-1-class-2-section-1",
        "objectiveId": "stage-1-class-2-objective-1",
        "competency": "stage-1-class-2-competency-1",
        "prompt": "A village records grain debts while market visitors use coins. What can an observer responsibly infer?",
        "correct": "stage-1-class-2-reinforcement-1-a",
        "options": [
          {
            "id": "stage-1-class-2-reinforcement-1-b",
            "label": "Debt records prove that coins have not yet been invented there"
          },
          {
            "id": "stage-1-class-2-reinforcement-1-c",
            "label": "Every household must use one identical method"
          },
          {
            "id": "stage-1-class-2-reinforcement-1-a",
            "label": "The village uses overlapping arrangements; this observation does not date the origin of either"
          }
        ]
      }
    },
    {
      "competency": "stage-1-class-2-competency-2",
      "sectionId": "stage-1-class-2-section-2",
      "title": "Revisit: Objects accepted as payment",
      "paragraph": "Return to the worked example. Commodity arrangements answer some problems while retaining others. Durability, transport, divisibility and quality verification affect how well an object works. Compare a payment problem with the specific property that helps; then name a limitation that remains. Avoid calling any commodity perfect or treating commodity use as a required stage for every society. Explain which actor or condition the mistaken claim overlooked before trying this new check.",
      "reinforcement": {
        "id": "stage-1-class-2-reinforcement-2",
        "kind": "choice",
        "category": "KNOWLEDGE",
        "sectionId": "stage-1-class-2-section-2",
        "objectiveId": "stage-1-class-2-objective-2",
        "competency": "stage-1-class-2-competency-2",
        "prompt": "A metal is valuable to craft workers but distant sellers refuse it. What is missing from the monetary case?",
        "correct": "stage-1-class-2-reinforcement-2-a",
        "options": [
          {
            "id": "stage-1-class-2-reinforcement-2-a",
            "label": "Acceptance for the intended payment is not established"
          },
          {
            "id": "stage-1-class-2-reinforcement-2-b",
            "label": "The metal must have no nonmonetary usefulness"
          },
          {
            "id": "stage-1-class-2-reinforcement-2-c",
            "label": "High transport weight proves universal acceptance"
          }
        ]
      }
    },
    {
      "competency": "stage-1-class-2-competency-3",
      "sectionId": "stage-1-class-2-section-3",
      "title": "Revisit: Weighing, stamping and confidence",
      "paragraph": "Return to the worked example. Standardization does not abolish verification or changing purchasing power. Wear, counterfeiting and doubts about an issuer can still matter. Do not confuse a stated denomination, the metal content and what the coin buys: these are different questions. The important historical change here is a response to transaction costs, not proof that trust disappeared. Explain which actor or condition the mistaken claim overlooked before trying this new check.",
      "reinforcement": {
        "id": "stage-1-class-2-reinforcement-3",
        "kind": "choice",
        "category": "KNOWLEDGE",
        "sectionId": "stage-1-class-2-section-3",
        "objectiveId": "stage-1-class-2-objective-3",
        "competency": "stage-1-class-2-competency-3",
        "prompt": "A market recognizes standard coins but discounts a badly worn piece. Which explanation fits?",
        "correct": "stage-1-class-2-reinforcement-3-a",
        "options": [
          {
            "id": "stage-1-class-2-reinforcement-3-a",
            "label": "Standardization can save routine checks without making condition irrelevant"
          },
          {
            "id": "stage-1-class-2-reinforcement-3-b",
            "label": "A denomination fixes the purchasing power of every damaged piece"
          },
          {
            "id": "stage-1-class-2-reinforcement-3-c",
            "label": "A standard coin removes every reason to assess quality"
          }
        ]
      }
    },
    {
      "competency": "stage-1-class-2-competency-4",
      "sectionId": "stage-1-class-2-section-4",
      "title": "Revisit: Paper, promises and issuers",
      "paragraph": "Return to the worked example. Stockholms Banco issued banknotes in Sweden in 1661, a specific European example documented by the Riksbank. This is not a claim that Sweden invented every form of paper money. Contemporary euro banknotes are fiat currency and are not promises to redeem a fixed weight of gold. Similar-looking paper can therefore embody different monetary arrangements. Explain which actor or condition the mistaken claim overlooked before trying this new check.",
      "reinforcement": {
        "id": "stage-1-class-2-reinforcement-4",
        "kind": "choice",
        "category": "KNOWLEDGE",
        "sectionId": "stage-1-class-2-section-4",
        "objectiveId": "stage-1-class-2-objective-4",
        "competency": "stage-1-class-2-competency-4",
        "prompt": "A historical note promises metal on specified terms; a euro note does not promise a fixed gold amount. What comparison is justified?",
        "correct": "stage-1-class-2-reinforcement-4-a",
        "options": [
          {
            "id": "stage-1-class-2-reinforcement-4-b",
            "label": "Both must be identical warehouse receipts"
          },
          {
            "id": "stage-1-class-2-reinforcement-4-a",
            "label": "Similar physical form can carry different entitlements"
          },
          {
            "id": "stage-1-class-2-reinforcement-4-c",
            "label": "Paper alone identifies the redemption terms"
          }
        ]
      }
    },
    {
      "competency": "stage-1-class-2-competency-5",
      "sectionId": "stage-1-class-2-section-5",
      "title": "Revisit: Accounts and payment instructions",
      "paragraph": "Return to the worked example. A card or banking app normally supplies instructions or access; it is not a new currency merely because its interface is new. Account systems reduce some distance and handling difficulties while introducing dependencies on records, institutions and operational access. The next class will trace the participants in those systems rather than treating a screen as the entire money system. Explain which actor or condition the mistaken claim overlooked before trying this new check.",
      "reinforcement": {
        "id": "stage-1-class-2-reinforcement-5",
        "kind": "choice",
        "category": "KNOWLEDGE",
        "sectionId": "stage-1-class-2-section-5",
        "objectiveId": "stage-1-class-2-objective-5",
        "competency": "stage-1-class-2-competency-5",
        "prompt": "A customer replaces a lost debit card while keeping the same account. What has changed?",
        "correct": "stage-1-class-2-reinforcement-5-a",
        "options": [
          {
            "id": "stage-1-class-2-reinforcement-5-b",
            "label": "The replacement necessarily creates another national currency"
          },
          {
            "id": "stage-1-class-2-reinforcement-5-c",
            "label": "The previous balance must have been stored inside the lost plastic"
          },
          {
            "id": "stage-1-class-2-reinforcement-5-a",
            "label": "An access instrument has changed while the underlying account may remain"
          }
        ]
      }
    },
    {
      "competency": "stage-1-class-2-competency-6",
      "sectionId": "stage-1-class-2-section-6",
      "title": "Revisit: Coexistence and historical judgment",
      "paragraph": "Return to the worked example. Build a defensible historical explanation with four parts: context, problem, response and remaining limitation. A timeline orders selected dated events; it does not rank societies or guarantee that the newest system is safest. Across different forms, people still need confidence that payment will be accepted and obligations will be honored. Explain which actor or condition the mistaken claim overlooked before trying this new check.",
      "reinforcement": {
        "id": "stage-1-class-2-reinforcement-6",
        "kind": "choice",
        "category": "KNOWLEDGE",
        "sectionId": "stage-1-class-2-section-6",
        "objectiveId": "stage-1-class-2-objective-6",
        "competency": "stage-1-class-2-competency-6",
        "prompt": "A remote seller accepts transfers; a local stall accepts cash during an outage. What evaluation fits both cases?",
        "correct": "stage-1-class-2-reinforcement-6-a",
        "options": [
          {
            "id": "stage-1-class-2-reinforcement-6-b",
            "label": "Historical newness alone identifies the best option everywhere"
          },
          {
            "id": "stage-1-class-2-reinforcement-6-a",
            "label": "The appropriate form depends on access and acceptance in the setting"
          },
          {
            "id": "stage-1-class-2-reinforcement-6-c",
            "label": "Older and newer payment arrangements cannot operate in one economy"
          }
        ]
      }
    }
  ],
  "liveGuide": [
    {
      "title": "Exchange before a single story",
      "minutes": 8,
      "talkingPoints": [
        "Prerequisite and objective: Compare exchange arrangements without inventing a universal starting point.",
        "Draw three harbor lanes: immediate cloth exchange, a recorded delivery debt and shared provisions. Ask who owes what at the end of each lane.",
        "Now the cloth trader no longer wants the offered grain. Move only that trade into the unresolved column; do not declare every other arrangement broken.",
        "Discuss this specific misconception: An easy-to-imagine barter difficulty proves the chronological origin of all money.",
        "Keep the coordination problem visible as we compare a possible payment object."
      ],
      "activity": {
        "kind": "POLL",
        "prompt": "Which lane requires simultaneous matching wants, and which may instead rely on a future obligation? Explain your choice.",
        "sectionId": "stage-1-class-2-section-1"
      }
    },
    {
      "title": "Objects accepted as payment",
      "minutes": 9,
      "talkingPoints": [
        "Prerequisite and objective: Explain a commodity example through its usefulness and limitations.",
        "Put a copper piece on the diagram twice: once as material for manufacture, once as a proposed payment. Ask what additional acceptance is needed.",
        "Double the distance and increase shipment weight. Ask which benefit of copper remains and which cost becomes more important.",
        "Discuss this specific misconception: An object with a useful nonmonetary purpose automatically becomes generally accepted money.",
        "Carry the verification problem into the coin discussion."
      ],
      "activity": {
        "kind": "WRITTEN",
        "prompt": "Write one benefit and one cost of using a heavy metal for a distant payment; explain why usefulness alone does not guarantee acceptance.",
        "sectionId": "stage-1-class-2-section-2"
      }
    },
    {
      "title": "Weighing, stamping and confidence",
      "minutes": 9,
      "talkingPoints": [
        "Prerequisite and objective: Distinguish standardization from a guarantee of value.",
        "Sketch an unstamped weight, a recognized coin and a damaged coin. Have students identify what a denomination tells them and what it cannot guarantee.",
        "Replace the undamaged coin with a suspicious worn piece. Invite the seller to explain why recognition alone may be insufficient.",
        "Discuss this specific misconception: A stamped coin guarantees constant purchasing power and never needs verification.",
        "The next comparison changes the instrument’s material and asks what promise remains."
      ],
      "activity": {
        "kind": "SINGLE",
        "prompt": "A recognized stamp speeds routine acceptance. Does that establish constant purchasing power? Give the missing reason.",
        "sectionId": "stage-1-class-2-section-3"
      }
    },
    {
      "title": "Paper, promises and issuers",
      "minutes": 12,
      "talkingPoints": [
        "Prerequisite and objective: Separate historical redeemable claims from contemporary fiat currency.",
        "Build a Sweden lane with 1661 banknotes, 1668 foundation of the Bank of the Estates, and 1701 transferable bills. Explain that these are selected institutional events. Add 1904 note-issue monopoly as a change in issuer authority, not a paper invention.",
        "Replace a metal-redeemable receipt with a modern euro note. Ask which redemption assumption must be removed while portability remains.",
        "Discuss this specific misconception: All paper money is a warehouse receipt that can always be exchanged for gold.",
        "A paper instrument can move claims; account payments make the underlying record even more visible."
      ],
      "activity": {
        "kind": "WRITTEN",
        "prompt": "Write a museum caption comparing the two instruments by entitlement. Include a dated Swedish example without calling it the origin of all paper money.",
        "sectionId": "stage-1-class-2-section-4"
      }
    },
    {
      "title": "Accounts and payment instructions",
      "minutes": 10,
      "talkingPoints": [
        "Prerequisite and objective: Distinguish a monetary balance from the tool used to transfer it.",
        "Add a separate euro-area lane: euro accounting/electronic use begins 1 January 1999; euro cash follows 1 January 2002. Ask why the cash form’s later arrival does not mean the currency was previously absent.",
        "Change only the access device from card to app while keeping the bank account and currency fixed. Require students to identify exactly what changed.",
        "Discuss this specific misconception: Every new payment device creates a distinct new currency.",
        "Now place both forms side by side and test a disruption rather than crown a historical winner."
      ],
      "activity": {
        "kind": "SINGLE",
        "prompt": "In the initial euro-area transition, euro cash followed accounting/electronic use. Which blanket claim about cash always preceding account money does this challenge?",
        "sectionId": "stage-1-class-2-section-5"
      }
    },
    {
      "title": "Coexistence and historical judgment",
      "minutes": 12,
      "talkingPoints": [
        "Prerequisite and objective: Compare improvements and continuing dependencies across forms.",
        "Display the Sweden institutional lane and euro-area launch lane together. Ask students to distinguish a chronological claim within a lane from an unsupported causal arrow between lanes.",
        "Disable connectivity at a hypothetical shop that accepts cash, then restore it and introduce a remote customer. Compare which option addresses each need.",
        "Discuss this specific misconception: Digital access makes confidence, institutions and older payment forms unnecessary.",
        "Recap context→problem→response→limitation; preview the banks and settlement institutions behind account payments."
      ],
      "activity": {
        "kind": "POLL",
        "prompt": "Which conclusion survives both changed conditions: one newest form always wins, or usefulness depends on the setting? Defend it with one limitation.",
        "sectionId": "stage-1-class-2-section-6"
      }
    }
  ],
  "studyGuide": {
    "summary": [
      "Read a historical claim by asking where, when and what evidence supports it. A useful classroom model is not itself evidence of universal origins.",
      "Compare what an arrangement changes: carrying cost, verification, transferability or authority to issue. Keep the remaining dependency in view.",
      "The Swedish examples and initial euro-area changeover show different kinds of change. They do not cover the whole world’s history."
    ],
    "bigPicture": "Historical explanation needs more than an ordered list. A dated event locates a change; a comparison explains its significance and its limits.",
    "fiveThings": [
      "A barter thought experiment identifies a coordination problem, not the starting point of every society.",
      "Valuable material still needs payment acceptance.",
      "A trusted stamp can reduce routine verification without fixing purchasing power.",
      "Paper instruments must be compared by entitlement and issuer, not material.",
      "A currency, an account claim and an access device are different concepts."
    ],
    "outcomes": [
      "Construct a qualified historical comparison with a remaining limitation.",
      "Separate a chronology from a universal or causal claim."
    ],
    "examples": [
      "Sweden’s 1661 banknotes, 1668 institutional reorganization, 1701 transport bills and 1904 note-issue monopoly represent distinct changes in a selected national pathway.",
      "In the initial euro-area launch, 1999 accounting/electronic use preceded 2002 cash. The cash form’s arrival was not the currency’s first existence."
    ],
    "misconceptions": [
      "Do not infer that everyone passed through a single barter, coin, paper and app ladder.",
      "Do not equate a historical metal-redemption promise with the terms of modern euro currency.",
      "Do not call an app a new currency solely because it is newer technology."
    ],
    "review": [
      {
        "sectionId": "stage-1-class-2-section-1",
        "label": "Evidence and alternative arrangements"
      },
      {
        "sectionId": "stage-1-class-2-section-2",
        "label": "Acceptance and physical trade-offs"
      },
      {
        "sectionId": "stage-1-class-2-section-3",
        "label": "Standardization and verification"
      },
      {
        "sectionId": "stage-1-class-2-section-4",
        "label": "Swedish issuer and transferability pathway"
      },
      {
        "sectionId": "stage-1-class-2-section-5",
        "label": "Euro launch and access tools"
      },
      {
        "sectionId": "stage-1-class-2-section-6",
        "label": "Compare overlapping pathways"
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
      "title": "European Central Bank: What is money? (updated 19 June 2024)",
      "url": "https://www.ecb.europa.eu/ecb-and-you/explainers/tell-me-more/html/what_is_money.en.html"
    },
    {
      "title": "Sveriges Riksbank: First banknotes in Europe",
      "url": "https://www.riksbank.se/en-gb/about-the-riksbank/history/historical-timeline/1600-1699/first-banknotes-in-europe/"
    },
    {
      "title": "Sveriges Riksbank: Sveriges Riksbank is founded",
      "url": "https://www.riksbank.se/en-gb/about-the-riksbank/history/historical-timeline/1600-1699/sveriges-riksbank-is-founded/"
    },
    {
      "title": "Sveriges Riksbank: Transport bills are introduced",
      "url": "https://www.riksbank.se/en-gb/about-the-riksbank/history/historical-timeline/1700-1799/transport-bills-are-introduced/"
    },
    {
      "title": "Sveriges Riksbank: Sole right to issue banknotes",
      "url": "https://www.riksbank.se/en-gb/about-the-riksbank/history/historical-timeline/1900-1999/sole-right-to-issue-banknotes/"
    },
    {
      "title": "ECB: Our money — euro launch and cash changeover",
      "url": "https://www.ecb.europa.eu/euro/intro/html/index.en.html"
    }
  ],
  "design": {
    "format": "Parallel historical pathways with problem–response–limitation comparisons",
    "homeworkTitle": "A qualified history, not a ladder",
    "homeworkIntro": "Order dated monetary developments with their regional qualifications, then compare arrangements in your own words. Explain what changed and what the selected evidence cannot establish.",
    "reflectionItemId": "stage-1-class-2-homework-reflection",
    "pacing": {
      "minimum": 50,
      "maximum": 75
    },
    "assessmentCoverage": [
      "stage-1-class-2-competency-1",
      "stage-1-class-2-competency-2",
      "stage-1-class-2-competency-3",
      "stage-1-class-2-competency-4",
      "stage-1-class-2-competency-5",
      "stage-1-class-2-competency-6"
    ],
    "practicalRequirement": "No chart or trade execution requirement. Foundational explanations and comparisons are individually reviewed; no practical credit is implied.",
    "videoOpportunity": "Instructor may select a short institutional museum explanation of a particular historical monetary form; pause to identify place, date and the limits of the example.",
    "studyGuideVisual": {
      "kind": "timeline",
      "nodes": [
        {
          "label": "Sweden: 1661 → 1668",
          "detail": "Banknotes at Stockholms Banco; later a new public banking institution."
        },
        {
          "label": "Sweden: 1701 → 1904",
          "detail": "Transferable transport bills; later sole Riksbank note-issue authority."
        },
        {
          "label": "Initial euro area: 1999 → 2002",
          "detail": "Accounting/electronic euro before euro notes and coins."
        }
      ],
      "caption": "Separate regional lanes. Arrows order the selected events; they do not claim a universal monetary ladder or causation between lanes."
    },
    "studyGuideChecks": [
      "What changed in Sweden in 1904: paper’s invention, or authority to issue banknotes? Explain the distinction.",
      "Why is the 1999/2002 euro sequence a useful challenge to an automatic cash-first story?",
      "If a payment object is portable, what do you still need to know about acceptance or entitlement?",
      "Write a two-sentence comparison containing context, benefit and remaining limitation. Which statement would require more historical evidence?"
    ]
  }
};
