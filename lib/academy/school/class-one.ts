import 'server-only';
import type {ClassDefinition} from './contracts';
/** Immutable authored definition: private grading material never crosses the student projection. */
export const CLASS_ONE:ClassDefinition={
  "id": "stage-1-class-1",
  "version": "money-foundations.1.0.0",
  "stageId": "stage-1",
  "number": 1,
  "title": "What Is Money?",
  "description": "Explain how a commonly accepted payment system helps people exchange, compare values and carry spending ability through time.",
  "courseId": "hft-school-foundations",
  "lessonId": "hft-school-money-1",
  "prerequisites": [],
  "liveMinutes": 60,
  "reviewMinutes": 25,
  "objectives": [
    {
      "id": "obj-world",
      "text": "Identify the coordination problem in exchange.",
      "competency": "MONEY_BARTER"
    },
    {
      "id": "obj-barter",
      "text": "Explain compatible wants in direct barter.",
      "competency": "MONEY_BARTER"
    },
    {
      "id": "obj-bridge",
      "text": "Explain money as an exchange bridge.",
      "competency": "MONEY_BARTER"
    },
    {
      "id": "obj-exchange",
      "text": "Identify medium of exchange in a payment.",
      "competency": "MEDIUM_OF_EXCHANGE"
    },
    {
      "id": "obj-account",
      "text": "Identify unit of account in a price comparison.",
      "competency": "UNIT_OF_ACCOUNT"
    },
    {
      "id": "obj-store",
      "text": "Explain store of value and variable purchasing power.",
      "competency": "STORE_OF_VALUE"
    },
    {
      "id": "obj-acceptance",
      "text": "Explain acceptance, confidence and monetary usefulness.",
      "competency": "MONEY_ACCEPTANCE"
    },
    {
      "id": "obj-digital",
      "text": "Distinguish account balances from cash and payment tools.",
      "competency": "MONEY_DIGITAL"
    },
    {
      "id": "obj-flow",
      "text": "Trace connected payments and real economic activity.",
      "competency": "MONEY_CIRCULATION"
    },
    {
      "id": "obj-review",
      "text": "Integrate the functions in a reasoned explanation.",
      "competency": "MONEY_ACCEPTANCE"
    }
  ],
  "terms": [
    {
      "term": "Money",
      "definition": "A commonly accepted means of payment that also supports pricing and carrying spending ability into the future."
    },
    {
      "term": "Barter",
      "definition": "Direct exchange of a good or service for another good or service."
    },
    {
      "term": "Medium of exchange",
      "definition": "An accepted intermediary used to pay for goods and services."
    },
    {
      "term": "Unit of account",
      "definition": "A common unit used to state and compare prices and obligations."
    },
    {
      "term": "Store of value",
      "definition": "A way to retain value for later use; future purchasing power is not guaranteed."
    },
    {
      "term": "Purchasing power",
      "definition": "The goods and services an amount can buy."
    },
    {
      "term": "Double coincidence of wants",
      "definition": "Both parties want what the other offers in a direct exchange."
    },
    {
      "term": "Bank deposit",
      "definition": "A monetary balance recorded by a bank; a card or app is a tool for accessing payment arrangements."
    }
  ],
  "sections": [
    {
      "id": "world",
      "title": "Imagine a World Without Money",
      "objectiveId": "obj-world",
      "competency": "MONEY_BARTER",
      "paragraphs": [
        "Imagine finishing a long day of work and receiving a basket of eggs instead of a wage. You need dinner, a bus ride and shoes. The food seller wants help fixing a sink, the bus driver needs fuel, and the shoemaker already has eggs. You have produced something useful, but usefulness alone does not make every exchange easy. You must find a person who wants what you offer at the same time that you want what they offer.",
        "This is the first problem to notice: an economy can contain useful goods and willing workers yet still make it difficult to trade. Without a commonly accepted way to pay, people spend time searching, bargaining and arranging chains of swaps. A carpenter might be excellent at building tables but unable to buy groceries from someone who does not need a table. The obstacle is coordinating the exchange, not proving that carpentry has no value.",
        "Money provides a shared tool that helps people exchange, compare prices and carry spending ability into the future. It does not create every useful thing in the economy. People still need to produce food, transport, shelter and services. As you study this class, separate the payment tool from the real goods and work it helps exchange. Ask: what does each person have, what do they need, and what is preventing the trade?"
      ],
      "example": "You can have valuable eggs and still be unable to pay a particular shoemaker.",
      "misconception": "Without money, all useful goods would have no value.",
      "visual": "barter",
      "activities": [
        {
          "id": "check-world",
          "kind": "choice",
          "category": "KNOWLEDGE",
          "sectionId": "world",
          "objectiveId": "obj-world",
          "competency": "MONEY_BARTER",
          "prompt": "What is the obstacle when useful goods exist but the people cannot exchange directly?",
          "options": [
            {
              "id": "a",
              "label": "Nothing in the economy has value"
            },
            {
              "id": "b",
              "label": "Their wants may not match"
            },
            {
              "id": "c",
              "label": "Money makes food unnecessary"
            }
          ],
          "correct": "b",
          "critical": false
        }
      ]
    },
    {
      "id": "barter",
      "title": "The Problem With Direct Barter",
      "objectiveId": "obj-barter",
      "competency": "MONEY_BARTER",
      "paragraphs": [
        "Barter means exchanging a good or service directly for another good or service. It can work: you help a neighbor repair a fence and receive vegetables in return. No cash needs to change hands when both people want the exchange. The difficulty appears when your wants do not line up. Having eggs is not enough if the shoemaker you need does not want eggs.",
        "Economists call this the double coincidence of wants. In everyday language, both sides must want what the other side offers for the direct swap to work. The shoemaker may want bread, but the baker may want firewood. You could search for someone who wants eggs and offers firewood, then arrange several trades. Each additional person adds time, uncertainty and questions about quantities and fairness.",
        "Other practical difficulties appear too. Eggs spoil; a pair of shoes cannot easily be split into tiny pieces; a large repair job may not neatly match one grocery basket. People can use favors, credit or other arrangements, so barter is not the only possible alternative to cash. Our example illustrates a coordination problem rather than claiming every society followed one simple historical path. Money helps by letting you sell to one person and buy from another without requiring those people to want each other’s products."
      ],
      "example": "The baker wants eggs, pays you, and the shoemaker accepts that payment tool even though they do not want eggs.",
      "misconception": "Barter never works, or all societies developed money through an identical sequence.",
      "visual": "barter",
      "activities": [
        {
          "id": "check-barter",
          "kind": "choice",
          "category": "KNOWLEDGE",
          "sectionId": "barter",
          "objectiveId": "obj-barter",
          "competency": "MONEY_BARTER",
          "prompt": "You have eggs; the shoemaker wants bread. What is missing?",
          "options": [
            {
              "id": "a",
              "label": "Compatible wants for a direct swap"
            },
            {
              "id": "b",
              "label": "A valuable product of any kind"
            },
            {
              "id": "c",
              "label": "A promise that shoes are free"
            }
          ],
          "correct": "a",
          "critical": false
        }
      ]
    },
    {
      "id": "bridge",
      "title": "What Money Solves",
      "objectiveId": "obj-bridge",
      "competency": "MONEY_BARTER",
      "paragraphs": [
        "Think of money as a bridge between two separate exchanges. First, you sell eggs to someone who wants eggs and receive a commonly accepted payment. Later, you use that payment to buy shoes. The person who bought the eggs does not need to make shoes. The shoemaker does not need to eat eggs. The bridge lets each exchange happen with the person who actually wants the product.",
        "This changes what you need to search for. Instead of searching for one perfect partner with matching wants, you can find a buyer for your work and a seller of what you need. The seller accepts payment because it can be used in other exchanges. Money therefore depends on a wider network of acceptance, not just on the two people currently trading.",
        "The bridge has limits. A payment does not guarantee that shoes exist, that the price is affordable, or that the product is good. A community still needs production, functioning payments and confidence in the payment medium. Separate those real constraints from the specific exchange problem money reduces. In the carpenter example, money helps the carpenter receive payment from a customer and then buy groceries from a different business; it does not force the grocery owner to want carpentry or make groceries free."
      ],
      "example": "Carpenter → customer payment → groceries. The grocery owner can use the received payment elsewhere.",
      "misconception": "Money eliminates scarcity or guarantees that every desired purchase can be made.",
      "visual": "bridge",
      "activities": [
        {
          "id": "check-bridge",
          "kind": "choice",
          "category": "KNOWLEDGE",
          "sectionId": "bridge",
          "objectiveId": "obj-bridge",
          "competency": "MONEY_BARTER",
          "prompt": "How does an accepted payment tool help the carpenter buy groceries?",
          "options": [
            {
              "id": "a",
              "label": "It forces the shop to need carpentry"
            },
            {
              "id": "b",
              "label": "It makes production unnecessary"
            },
            {
              "id": "c",
              "label": "It separates selling work from buying groceries"
            }
          ],
          "correct": "c",
          "critical": false
        }
      ]
    },
    {
      "id": "exchange",
      "title": "Money as a Medium of Exchange",
      "objectiveId": "obj-exchange",
      "competency": "MEDIUM_OF_EXCHANGE",
      "paragraphs": [
        "A medium of exchange is something people commonly accept in payment for goods and services. “Medium” here means an intermediary: it sits between what you sell and what you buy. When you pay for a bus ride with accepted currency, the driver or transport business does not need to receive your particular skills or possessions in return.",
        "Focus on the job money is doing in the example. Paying for a sandwich is an exchange. Receiving wages for work is another exchange. Paying by transfer from a bank account can perform the same function as handing over cash, even though the payment method looks different. The important idea is that the seller receives an accepted monetary payment in exchange for a product or service.",
        "Not every object that can be swapped is widely used as money. A rare collectible might be valuable to a few people but inconvenient for buying groceries because most sellers do not accept it directly. Acceptance is also contextual: a shop may accept one currency or payment method but not another. Money can make exchange easier without being accepted in every place or circumstance. In your explanations, identify the buyer, the seller and the good or service, then describe the accepted payment connecting them."
      ],
      "example": "Paying $8 for lunch demonstrates exchange; merely reading the $8 price is a different function.",
      "misconception": "Anything with a high price is automatically a commonly accepted medium of exchange.",
      "visual": "functions",
      "activities": [
        {
          "id": "check-exchange",
          "kind": "choice",
          "category": "KNOWLEDGE",
          "sectionId": "exchange",
          "objectiveId": "obj-exchange",
          "competency": "MEDIUM_OF_EXCHANGE",
          "prompt": "Which action emphasizes medium of exchange?",
          "options": [
            {
              "id": "a",
              "label": "Comparing two price labels"
            },
            {
              "id": "b",
              "label": "Paying for a bus ride"
            },
            {
              "id": "c",
              "label": "Keeping funds for next week"
            }
          ],
          "correct": "b",
          "critical": false
        }
      ]
    },
    {
      "id": "account",
      "title": "Money as a Unit of Account",
      "objectiveId": "obj-account",
      "competency": "UNIT_OF_ACCOUNT",
      "paragraphs": [
        "A unit of account is a common measure used to state and compare prices. A menu might list soup at $6 and a sandwich at $10. The shared dollar unit lets you compare them without first deciding how many eggs equal each meal. Like measuring two tables in centimeters, using the same unit makes their measurements easier to understand together.",
        "The comparison does not require an immediate purchase. A business can record wages owed, list inventory prices or compare costs using a monetary unit before any payment occurs. This is why reading price tags demonstrates unit of account, while paying at the counter demonstrates medium of exchange. One everyday event can involve both functions, but describing them separately helps explain what money is doing at each moment.",
        "Numbers are useful only when their units and context are clear. A price of 100 dollars is not the same as 100 yen, and a price from years ago may not buy the same quantity today. This class does not teach exchange-rate calculations; it teaches why a common measuring unit matters. When answering a scenario, ask whether the person is comparing or recording values rather than exchanging something now or setting funds aside for later. A larger price also does not automatically mean a better product: a unit makes comparison possible, not the decision for you."
      ],
      "example": "A student compares a $20 notebook with a $35 notebook without buying either.",
      "misconception": "Unit of account means an account number or simply having a bank account.",
      "visual": "functions",
      "activities": [
        {
          "id": "check-account",
          "kind": "choice",
          "category": "KNOWLEDGE",
          "sectionId": "account",
          "objectiveId": "obj-account",
          "competency": "UNIT_OF_ACCOUNT",
          "prompt": "Which action emphasizes unit of account?",
          "options": [
            {
              "id": "a",
              "label": "Comparing $20 and $35 notebook prices"
            },
            {
              "id": "b",
              "label": "Handing over payment"
            },
            {
              "id": "c",
              "label": "Saving a wage for next month"
            }
          ],
          "correct": "a",
          "critical": false
        },
        {
          "id": "match-functions",
          "kind": "matching",
          "category": "APPLICATION",
          "sectionId": "account",
          "objectiveId": "obj-account",
          "competency": "UNIT_OF_ACCOUNT",
          "prompt": "Match each action to the function it emphasizes. A function may be used more than once.",
          "items": [
            {
              "id": "lunch",
              "label": "Paying for lunch"
            },
            {
              "id": "prices",
              "label": "Comparing price tags"
            },
            {
              "id": "later",
              "label": "Keeping wages for next week"
            },
            {
              "id": "bus",
              "label": "Paying the bus fare"
            }
          ],
          "targets": [
            {
              "id": "exchange",
              "label": "Medium of exchange"
            },
            {
              "id": "account",
              "label": "Unit of account"
            },
            {
              "id": "store",
              "label": "Store of value"
            }
          ],
          "correct": {
            "lunch": "exchange",
            "prices": "account",
            "later": "store",
            "bus": "exchange"
          }
        }
      ]
    },
    {
      "id": "store",
      "title": "Money as a Store of Value",
      "objectiveId": "obj-store",
      "competency": "STORE_OF_VALUE",
      "paragraphs": [
        "A store of value lets you carry purchasing ability from now into the future. Suppose you earn $50 today and keep it to buy supplies next week. You have separated the time when you worked from the time when you spend. This is different from a basket of fresh food that may spoil before you need to use it.",
        "Do not confuse a stable face amount with guaranteed purchasing power. Purchasing power means the goods and services an amount can buy. If the supplies become more expensive, the same $50 may buy fewer of them. Money can serve as a store of value while doing that job imperfectly. Inflation, fees, loss and other circumstances can affect how much future use someone actually gets from stored funds.",
        "This is an explanation of a function, not a recommendation about which asset to hold or how to invest. Other assets can store value too, but they may be harder to spend directly or may change in price. To classify an everyday example, look at its purpose: setting aside payment for a later purchase emphasizes store of value; comparing the price of that purchase emphasizes unit of account; making the payment emphasizes exchange. One person may use the same funds in all three ways over time."
      ],
      "example": "Saving $30 for next week’s transport stores spending ability; it does not guarantee unchanged bus fares.",
      "misconception": "Store of value promises that the same amount will always buy exactly the same goods.",
      "visual": "functions",
      "activities": [
        {
          "id": "check-store",
          "kind": "choice",
          "category": "KNOWLEDGE",
          "sectionId": "store",
          "objectiveId": "obj-store",
          "competency": "STORE_OF_VALUE",
          "prompt": "Keeping $30 for next week illustrates what, without guaranteeing unchanged prices?",
          "options": [
            {
              "id": "a",
              "label": "Unit of account only"
            },
            {
              "id": "b",
              "label": "Store of value"
            },
            {
              "id": "c",
              "label": "Guaranteed investment profit"
            }
          ],
          "correct": "b",
          "critical": false
        }
      ]
    },
    {
      "id": "acceptance",
      "title": "Why People Accept Money",
      "objectiveId": "obj-acceptance",
      "competency": "MONEY_ACCEPTANCE",
      "paragraphs": [
        "Why can a $100 banknote usually purchase more than the paper and ink used to make it? The seller is not normally buying the paper as a craft material. They accept a recognized payment instrument because they expect to use its monetary value in other payments. That expectation rests on a functioning network of people, businesses and institutions, not only on the physical object.",
        "Confidence matters at several levels. People need confidence that the payment is genuine, that payments can be completed, and that the monetary system will remain useful. Laws, public institutions, banking arrangements, economic activity and established pricing practices all help support this network. Saying “the government says so” leaves out how people actually receive, spend, price and trust payments in everyday life.",
        "Supply matters, but scarcity alone does not make an object good money. A one-of-a-kind drawing may be scarce while most shops will not accept it as payment. Likewise, creating more payment units does not by itself create more goods and services. Later classes examine monetary institutions and purchasing power more deeply. Here, explain value through accepted use, confidence and the economic system around the payment tool. If everyone stopped accepting a currency, the exchange bridge would be damaged even if every note still had the same printed number."
      ],
      "example": "The shop accepts a note expecting suppliers, workers or others to accept monetary payment later.",
      "misconception": "Scarcity or a legal declaration by itself fully explains why a currency works.",
      "visual": "bridge",
      "activities": [
        {
          "id": "check-acceptance",
          "kind": "choice",
          "category": "KNOWLEDGE",
          "sectionId": "acceptance",
          "objectiveId": "obj-acceptance",
          "competency": "MONEY_ACCEPTANCE",
          "prompt": "True or false: monetary value is explained only by the value of the paper.",
          "options": [
            {
              "id": "a",
              "label": "True"
            },
            {
              "id": "b",
              "label": "False"
            }
          ],
          "correct": "b",
          "critical": false
        }
      ]
    },
    {
      "id": "digital",
      "title": "Money Is More Than Cash",
      "objectiveId": "obj-digital",
      "competency": "MONEY_DIGITAL",
      "paragraphs": [
        "Cash is familiar because you can hold a note or coin. But many everyday monetary balances are recorded electronically as bank deposits. A worker can receive wages into an account, buy groceries using an account-based payment and pay a bill without physically handling the cash amount. A payment can be real even when no paper moves between the buyer and seller.",
        "Distinguish the money from a tool used to access or transfer it. A debit card is not a pile of money; it helps initiate a payment using an account. A phone application can provide a way to request or receive a payment. The screen shows information about balances or transfers; the physical phone is not itself the monetary balance. These distinctions keep us from defining money only by its visible packaging.",
        "Credit adds another distinction. A credit card can let someone make a purchase using borrowed funds, with repayment owed under the agreement. It is not the same as having extra personal savings. This class is not a banking-product or borrowing recommendation. The learning goal is to recognize that modern money can exist as account records, that different payment methods operate differently, and that spending ability should not be confused with ownership of a card or with available credit. Ask what balance or arrangement is behind a payment rather than judging it only by the device used."
      ],
      "example": "An employer transfers wages into an account; the employee later uses a debit payment for groceries.",
      "misconception": "Only physical notes are money, or a credit limit is the same thing as savings.",
      "visual": "account",
      "activities": [
        {
          "id": "check-digital",
          "kind": "choice",
          "category": "KNOWLEDGE",
          "sectionId": "digital",
          "objectiveId": "obj-digital",
          "competency": "MONEY_DIGITAL",
          "prompt": "Which statement is accurate?",
          "options": [
            {
              "id": "a",
              "label": "A debit card itself is the monetary balance"
            },
            {
              "id": "b",
              "label": "A credit limit equals savings"
            },
            {
              "id": "c",
              "label": "Account deposits can support payments without physical cash"
            }
          ],
          "correct": "c",
          "critical": false
        }
      ]
    },
    {
      "id": "flow",
      "title": "Money Moving Through an Economy",
      "objectiveId": "obj-flow",
      "competency": "MONEY_CIRCULATION",
      "paragraphs": [
        "Follow a simple path. A worker provides a service and receives wages. The wages are recorded in a bank account. The worker buys groceries. The grocery business receives payment and uses some receipts to pay employees, suppliers, rent or other costs. Those recipients can make further payments. The flow shows how one person’s spending can become another person’s receipt.",
        "Now separate two kinds of movement in the example. Goods and services move: the worker performs work, the supplier provides food, and the shop serves a customer. Monetary payments move in connection with that activity. The payment flow helps coordinate real economic exchange, but following a dollar alone does not tell us whether every business is profitable or whether every person has enough income.",
        "The diagram is deliberately simplified. People can save, pay taxes, repay debt or transact with other countries, and businesses face timing differences and costs. Money does not travel in one perfectly closed loop, nor does every payment create a new unit of money. Use the diagram to identify roles and connections rather than to predict the entire economy. Explain one link at a time: who pays whom, what good or service or obligation is involved, and which function of money is most visible at that link."
      ],
      "example": "Work → wages → account → purchase → business → employee/supplier payments, with real production alongside.",
      "misconception": "Every payment creates new money, or all business receipts are profit.",
      "visual": "flow",
      "activities": [
        {
          "id": "check-flow",
          "kind": "choice",
          "category": "KNOWLEDGE",
          "sectionId": "flow",
          "objectiveId": "obj-flow",
          "competency": "MONEY_CIRCULATION",
          "prompt": "A business uses receipts to pay suppliers. What does the simplified flow show?",
          "options": [
            {
              "id": "a",
              "label": "Every receipt is profit"
            },
            {
              "id": "b",
              "label": "Payments connect participants in economic activity"
            },
            {
              "id": "c",
              "label": "Each payment creates new money"
            }
          ],
          "correct": "b",
          "critical": false
        }
      ]
    },
    {
      "id": "review",
      "title": "Apply, Explain and Review",
      "objectiveId": "obj-review",
      "competency": "MONEY_ACCEPTANCE",
      "paragraphs": [
        "Bring the ideas together with the carpenter who needs groceries. The direct swap fails because the grocery owner does not currently need carpentry. If a customer pays the carpenter in commonly accepted money, the carpenter can pay the grocery owner without arranging a carpentry job for that owner. This explanation connects the barter mismatch, money as a bridge and the medium-of-exchange function.",
        "Now change the question. If the carpenter compares two grocery prices, money is acting as a unit of account. If some earnings are kept for next week, money is acting as a store of value, while the amount it can buy may change. If the groceries are purchased by debit payment, the exchange need not involve physical cash. Do not memorize the example only as one label; explain which action in the story supports each label.",
        "Before taking the knowledge and reasoning check, try explaining the central idea without using the word “money.” A strong explanation might describe a commonly accepted way to pay that lets people trade without matching wants, compare prices in one unit and retain spending ability for later. Your own wording is welcome. Review the section links for concepts you cannot yet explain. Completing reading is one part of this class; instructor-reviewed reasoning and substantive homework provide different evidence, and none of them is a promise that you have mastered trading."
      ],
      "example": "Explain the $100 note using acceptance and usefulness, then contrast its face amount with purchasing power.",
      "misconception": "Finishing reading or earning one correct answer proves every competency in this class.",
      "visual": "none",
      "activities": [
        {
          "id": "check-review",
          "kind": "choice",
          "category": "KNOWLEDGE",
          "sectionId": "review",
          "objectiveId": "obj-review",
          "competency": "MONEY_ACCEPTANCE",
          "prompt": "Which explanation of a $100 note is stronger?",
          "options": [
            {
              "id": "a",
              "label": "Its paper must be worth $100"
            },
            {
              "id": "b",
              "label": "Accepted use and confidence support its monetary function"
            },
            {
              "id": "c",
              "label": "Scarcity alone guarantees acceptance"
            }
          ],
          "correct": "b",
          "critical": false
        }
      ]
    }
  ],
  "assessment": [
    {
      "id": "assess-world",
      "kind": "choice",
      "category": "KNOWLEDGE",
      "sectionId": "world",
      "objectiveId": "obj-world",
      "competency": "MONEY_BARTER",
      "prompt": "What is the obstacle when useful goods exist but the people cannot exchange directly?",
      "options": [
        {
          "id": "a",
          "label": "Nothing in the economy has value"
        },
        {
          "id": "b",
          "label": "Their wants may not match"
        },
        {
          "id": "c",
          "label": "Money makes food unnecessary"
        }
      ],
      "correct": "b",
      "critical": false
    },
    {
      "id": "assess-barter",
      "kind": "choice",
      "category": "KNOWLEDGE",
      "sectionId": "barter",
      "objectiveId": "obj-barter",
      "competency": "MONEY_BARTER",
      "prompt": "You have eggs; the shoemaker wants bread. What is missing?",
      "options": [
        {
          "id": "a",
          "label": "Compatible wants for a direct swap"
        },
        {
          "id": "b",
          "label": "A valuable product of any kind"
        },
        {
          "id": "c",
          "label": "A promise that shoes are free"
        }
      ],
      "correct": "a",
      "critical": false
    },
    {
      "id": "assess-bridge",
      "kind": "choice",
      "category": "KNOWLEDGE",
      "sectionId": "bridge",
      "objectiveId": "obj-bridge",
      "competency": "MONEY_BARTER",
      "prompt": "How does an accepted payment tool help the carpenter buy groceries?",
      "options": [
        {
          "id": "a",
          "label": "It forces the shop to need carpentry"
        },
        {
          "id": "b",
          "label": "It makes production unnecessary"
        },
        {
          "id": "c",
          "label": "It separates selling work from buying groceries"
        }
      ],
      "correct": "c",
      "critical": false
    },
    {
      "id": "assess-exchange",
      "kind": "choice",
      "category": "KNOWLEDGE",
      "sectionId": "exchange",
      "objectiveId": "obj-exchange",
      "competency": "MEDIUM_OF_EXCHANGE",
      "prompt": "Which action emphasizes medium of exchange?",
      "options": [
        {
          "id": "a",
          "label": "Comparing two price labels"
        },
        {
          "id": "b",
          "label": "Paying for a bus ride"
        },
        {
          "id": "c",
          "label": "Keeping funds for next week"
        }
      ],
      "correct": "b",
      "critical": false
    },
    {
      "id": "assess-account",
      "kind": "choice",
      "category": "KNOWLEDGE",
      "sectionId": "account",
      "objectiveId": "obj-account",
      "competency": "UNIT_OF_ACCOUNT",
      "prompt": "Which action emphasizes unit of account?",
      "options": [
        {
          "id": "a",
          "label": "Comparing $20 and $35 notebook prices"
        },
        {
          "id": "b",
          "label": "Handing over payment"
        },
        {
          "id": "c",
          "label": "Saving a wage for next month"
        }
      ],
      "correct": "a",
      "critical": false
    },
    {
      "id": "assess-store",
      "kind": "choice",
      "category": "KNOWLEDGE",
      "sectionId": "store",
      "objectiveId": "obj-store",
      "competency": "STORE_OF_VALUE",
      "prompt": "Keeping $30 for next week illustrates what, without guaranteeing unchanged prices?",
      "options": [
        {
          "id": "a",
          "label": "Unit of account only"
        },
        {
          "id": "b",
          "label": "Store of value"
        },
        {
          "id": "c",
          "label": "Guaranteed investment profit"
        }
      ],
      "correct": "b",
      "critical": false
    },
    {
      "id": "assess-acceptance",
      "kind": "choice",
      "category": "KNOWLEDGE",
      "sectionId": "acceptance",
      "objectiveId": "obj-acceptance",
      "competency": "MONEY_ACCEPTANCE",
      "prompt": "True or false: monetary value is explained only by the value of the paper.",
      "options": [
        {
          "id": "a",
          "label": "True"
        },
        {
          "id": "b",
          "label": "False"
        }
      ],
      "correct": "b",
      "critical": false
    },
    {
      "id": "explain-barter",
      "kind": "written",
      "category": "REASONING",
      "sectionId": "bridge",
      "objectiveId": "obj-bridge",
      "competency": "MONEY_BARTER",
      "prompt": "Explain how an accepted payment tool solves the carpenter/grocery mismatch.",
      "rubric": "Identify incompatible direct wants and selling to a customer then purchasing from a different seller.",
      "critical": true
    },
    {
      "id": "explain-functions",
      "kind": "written",
      "category": "REASONING",
      "sectionId": "store",
      "objectiveId": "obj-store",
      "competency": "STORE_OF_VALUE",
      "prompt": "Use separate everyday examples to explain exchange, unit of account and store of value. Explain why future purchasing power is not guaranteed.",
      "rubric": "Correctly distinguish all three actions; saving does not promise unchanged purchasing power.",
      "critical": true
    },
    {
      "id": "explain-value",
      "kind": "written",
      "category": "REASONING",
      "sectionId": "acceptance",
      "objectiveId": "obj-acceptance",
      "competency": "MONEY_ACCEPTANCE",
      "prompt": "Why can a $100 bill generally purchase more than the physical paper itself is worth?",
      "rubric": "Explain accepted use, confidence and the surrounding payment/economic system; material or government declaration alone is insufficient.",
      "critical": true
    },
    {
      "id": "explain-digital",
      "kind": "written",
      "category": "REASONING",
      "sectionId": "digital",
      "objectiveId": "obj-digital",
      "competency": "MONEY_DIGITAL",
      "prompt": "Explain the core idea without using the word money, then explain how a bank-account payment can fit your definition.",
      "rubric": "Describe commonly accepted exchange, price measure and retained spending ability; distinguish an account balance from the card/device.",
      "critical": true
    }
  ],
  "homework": [
    {
      "id": "hw-assess-world",
      "kind": "choice",
      "category": "HOMEWORK",
      "sectionId": "world",
      "objectiveId": "obj-world",
      "competency": "MONEY_BARTER",
      "prompt": "What is the obstacle when useful goods exist but the people cannot exchange directly?",
      "options": [
        {
          "id": "a",
          "label": "Nothing in the economy has value"
        },
        {
          "id": "b",
          "label": "Their wants may not match"
        },
        {
          "id": "c",
          "label": "Money makes food unnecessary"
        }
      ],
      "correct": "b",
      "critical": false
    },
    {
      "id": "hw-assess-barter",
      "kind": "choice",
      "category": "HOMEWORK",
      "sectionId": "barter",
      "objectiveId": "obj-barter",
      "competency": "MONEY_BARTER",
      "prompt": "You have eggs; the shoemaker wants bread. What is missing?",
      "options": [
        {
          "id": "a",
          "label": "Compatible wants for a direct swap"
        },
        {
          "id": "b",
          "label": "A valuable product of any kind"
        },
        {
          "id": "c",
          "label": "A promise that shoes are free"
        }
      ],
      "correct": "a",
      "critical": false
    },
    {
      "id": "hw-assess-bridge",
      "kind": "choice",
      "category": "HOMEWORK",
      "sectionId": "bridge",
      "objectiveId": "obj-bridge",
      "competency": "MONEY_BARTER",
      "prompt": "How does an accepted payment tool help the carpenter buy groceries?",
      "options": [
        {
          "id": "a",
          "label": "It forces the shop to need carpentry"
        },
        {
          "id": "b",
          "label": "It makes production unnecessary"
        },
        {
          "id": "c",
          "label": "It separates selling work from buying groceries"
        }
      ],
      "correct": "c",
      "critical": false
    },
    {
      "id": "hw-assess-exchange",
      "kind": "choice",
      "category": "HOMEWORK",
      "sectionId": "exchange",
      "objectiveId": "obj-exchange",
      "competency": "MEDIUM_OF_EXCHANGE",
      "prompt": "Which action emphasizes medium of exchange?",
      "options": [
        {
          "id": "a",
          "label": "Comparing two price labels"
        },
        {
          "id": "b",
          "label": "Paying for a bus ride"
        },
        {
          "id": "c",
          "label": "Keeping funds for next week"
        }
      ],
      "correct": "b",
      "critical": false
    },
    {
      "id": "hw-assess-account",
      "kind": "choice",
      "category": "HOMEWORK",
      "sectionId": "account",
      "objectiveId": "obj-account",
      "competency": "UNIT_OF_ACCOUNT",
      "prompt": "Which action emphasizes unit of account?",
      "options": [
        {
          "id": "a",
          "label": "Comparing $20 and $35 notebook prices"
        },
        {
          "id": "b",
          "label": "Handing over payment"
        },
        {
          "id": "c",
          "label": "Saving a wage for next month"
        }
      ],
      "correct": "a",
      "critical": false
    },
    {
      "id": "hw-assess-store",
      "kind": "choice",
      "category": "HOMEWORK",
      "sectionId": "store",
      "objectiveId": "obj-store",
      "competency": "STORE_OF_VALUE",
      "prompt": "Keeping $30 for next week illustrates what, without guaranteeing unchanged prices?",
      "options": [
        {
          "id": "a",
          "label": "Unit of account only"
        },
        {
          "id": "b",
          "label": "Store of value"
        },
        {
          "id": "c",
          "label": "Guaranteed investment profit"
        }
      ],
      "correct": "b",
      "critical": false
    },
    {
      "id": "hw-assess-acceptance",
      "kind": "choice",
      "category": "HOMEWORK",
      "sectionId": "acceptance",
      "objectiveId": "obj-acceptance",
      "competency": "MONEY_ACCEPTANCE",
      "prompt": "True or false: monetary value is explained only by the value of the paper.",
      "options": [
        {
          "id": "a",
          "label": "True"
        },
        {
          "id": "b",
          "label": "False"
        }
      ],
      "correct": "b",
      "critical": false
    },
    {
      "id": "hw-match",
      "kind": "matching",
      "category": "HOMEWORK",
      "sectionId": "account",
      "objectiveId": "obj-account",
      "competency": "UNIT_OF_ACCOUNT",
      "prompt": "Match each action to the function it emphasizes. A function may be used more than once.",
      "items": [
        {
          "id": "lunch",
          "label": "Paying for lunch"
        },
        {
          "id": "prices",
          "label": "Comparing price tags"
        },
        {
          "id": "later",
          "label": "Keeping wages for next week"
        },
        {
          "id": "bus",
          "label": "Paying the bus fare"
        }
      ],
      "targets": [
        {
          "id": "exchange",
          "label": "Medium of exchange"
        },
        {
          "id": "account",
          "label": "Unit of account"
        },
        {
          "id": "store",
          "label": "Store of value"
        }
      ],
      "correct": {
        "lunch": "exchange",
        "prices": "account",
        "later": "store",
        "bus": "exchange"
      }
    },
    {
      "id": "hw-apply",
      "kind": "written",
      "category": "HOMEWORK",
      "sectionId": "bridge",
      "objectiveId": "obj-bridge",
      "competency": "MONEY_BARTER",
      "prompt": "Part C · You are a carpenter and need groceries. The grocery owner does not need carpentry. Explain how money solves the exchange problem.",
      "rubric": "Explain both exchanges with different willing partners and an accepted intermediary."
    },
    {
      "id": "hw-reason",
      "kind": "written",
      "category": "HOMEWORK",
      "sectionId": "acceptance",
      "objectiveId": "obj-acceptance",
      "competency": "MONEY_ACCEPTANCE",
      "prompt": "Part D · Why can a $100 bill generally purchase more than its physical material is worth?",
      "rubric": "Explain acceptance, confidence and economic usefulness, not material price alone."
    },
    {
      "id": "hw-life",
      "kind": "written",
      "category": "HOMEWORK",
      "sectionId": "store",
      "objectiveId": "obj-store",
      "competency": "STORE_OF_VALUE",
      "prompt": "Part E · Identify three real or hypothetical ways you used money today. For each, name the function and explain why it fits. Do not include private account details.",
      "rubric": "Three concrete examples with accurate function classifications and explanations; hypothetical examples are equally acceptable."
    },
    {
      "id": "hw-reflection",
      "kind": "reflection",
      "category": "HOMEWORK",
      "sectionId": "review",
      "objectiveId": "obj-review",
      "competency": "MONEY_ACCEPTANCE",
      "prompt": "Part F · What concept is still unclear? Explain your uncertainty or a question you can now explain more confidently. Do not include financial account information.",
      "rubric": "Meaningful reflection; uncertainty itself is not an error."
    }
  ],
  "remediation": [
    {
      "competency": "MONEY_BARTER",
      "sectionId": "barter",
      "title": "Matching wants",
      "paragraph": "Economists call this the double coincidence of wants. In everyday language, both sides must want what the other side offers for the direct swap to work. The shoemaker may want bread, but the baker may want firewood. You could search for someone who wants eggs and offers firewood, then arrange several trades. Each additional person adds time, uncertainty and questions about quantities and fairness.",
      "reinforcement": {
        "id": "reinforce-MONEY_BARTER",
        "kind": "choice",
        "category": "KNOWLEDGE",
        "sectionId": "barter",
        "objectiveId": "obj-barter",
        "competency": "MONEY_BARTER",
        "prompt": "A gardener needs a bicycle repair; the mechanic wants a haircut. What makes direct barter difficult?",
        "options": [
          {
            "id": "a",
            "label": "The gardener’s work is worthless"
          },
          {
            "id": "b",
            "label": "Their immediate wants do not match"
          },
          {
            "id": "c",
            "label": "Repairs cannot be exchanged"
          }
        ],
        "correct": "b",
        "critical": false
      }
    },
    {
      "competency": "MEDIUM_OF_EXCHANGE",
      "sectionId": "exchange",
      "title": "An accepted intermediary",
      "paragraph": "Focus on the job money is doing in the example. Paying for a sandwich is an exchange. Receiving wages for work is another exchange. Paying by transfer from a bank account can perform the same function as handing over cash, even though the payment method looks different. The important idea is that the seller receives an accepted monetary payment in exchange for a product or service.",
      "reinforcement": {
        "id": "reinforce-MEDIUM_OF_EXCHANGE",
        "kind": "choice",
        "category": "KNOWLEDGE",
        "sectionId": "exchange",
        "objectiveId": "obj-exchange",
        "competency": "MEDIUM_OF_EXCHANGE",
        "prompt": "A tutor receives payment from a family and buys a train ticket elsewhere. Which job is the payment doing?",
        "options": [
          {
            "id": "a",
            "label": "Exchange bridge"
          },
          {
            "id": "b",
            "label": "Measuring physical distance"
          },
          {
            "id": "c",
            "label": "Guaranteeing future prices"
          }
        ],
        "correct": "a",
        "critical": false
      }
    },
    {
      "competency": "UNIT_OF_ACCOUNT",
      "sectionId": "account",
      "title": "One measuring unit",
      "paragraph": "The comparison does not require an immediate purchase. A business can record wages owed, list inventory prices or compare costs using a monetary unit before any payment occurs. This is why reading price tags demonstrates unit of account, while paying at the counter demonstrates medium of exchange. One everyday event can involve both functions, but describing them separately helps explain what money is doing at each moment.",
      "reinforcement": {
        "id": "reinforce-UNIT_OF_ACCOUNT",
        "kind": "choice",
        "category": "KNOWLEDGE",
        "sectionId": "account",
        "objectiveId": "obj-account",
        "competency": "UNIT_OF_ACCOUNT",
        "prompt": "A repair shop lists jobs at $30, $50 and $80 before anyone pays. What function is emphasized?",
        "options": [
          {
            "id": "a",
            "label": "Store of value"
          },
          {
            "id": "b",
            "label": "Unit of account"
          },
          {
            "id": "c",
            "label": "Exchange already completed"
          }
        ],
        "correct": "b",
        "critical": false
      }
    },
    {
      "competency": "STORE_OF_VALUE",
      "sectionId": "store",
      "title": "Spending later",
      "paragraph": "Do not confuse a stable face amount with guaranteed purchasing power. Purchasing power means the goods and services an amount can buy. If the supplies become more expensive, the same $50 may buy fewer of them. Money can serve as a store of value while doing that job imperfectly. Inflation, fees, loss and other circumstances can affect how much future use someone actually gets from stored funds.",
      "reinforcement": {
        "id": "reinforce-STORE_OF_VALUE",
        "kind": "choice",
        "category": "KNOWLEDGE",
        "sectionId": "store",
        "objectiveId": "obj-store",
        "competency": "STORE_OF_VALUE",
        "prompt": "A student keeps $40 for next month, but fares rise. Which statement fits?",
        "options": [
          {
            "id": "a",
            "label": "Saving guarantees the same travel"
          },
          {
            "id": "b",
            "label": "It carries spending ability, but purchasing power can change"
          },
          {
            "id": "c",
            "label": "Money cannot store value at all"
          }
        ],
        "correct": "b",
        "critical": false
      }
    },
    {
      "competency": "MONEY_ACCEPTANCE",
      "sectionId": "acceptance",
      "title": "Accepted use",
      "paragraph": "Confidence matters at several levels. People need confidence that the payment is genuine, that payments can be completed, and that the monetary system will remain useful. Laws, public institutions, banking arrangements, economic activity and established pricing practices all help support this network. Saying “the government says so” leaves out how people actually receive, spend, price and trust payments in everyday life.",
      "reinforcement": {
        "id": "reinforce-MONEY_ACCEPTANCE",
        "kind": "choice",
        "category": "KNOWLEDGE",
        "sectionId": "acceptance",
        "objectiveId": "obj-acceptance",
        "competency": "MONEY_ACCEPTANCE",
        "prompt": "A shop declines a rare token despite its scarcity. What does that show?",
        "options": [
          {
            "id": "a",
            "label": "Scarcity alone does not guarantee monetary acceptance"
          },
          {
            "id": "b",
            "label": "All rare things are common payment"
          },
          {
            "id": "c",
            "label": "Prices measure only material cost"
          }
        ],
        "correct": "a",
        "critical": false
      }
    },
    {
      "competency": "MONEY_DIGITAL",
      "sectionId": "digital",
      "title": "Balance and tool",
      "paragraph": "Distinguish the money from a tool used to access or transfer it. A debit card is not a pile of money; it helps initiate a payment using an account. A phone application can provide a way to request or receive a payment. The screen shows information about balances or transfers; the physical phone is not itself the monetary balance. These distinctions keep us from defining money only by its visible packaging.",
      "reinforcement": {
        "id": "reinforce-MONEY_DIGITAL",
        "kind": "choice",
        "category": "KNOWLEDGE",
        "sectionId": "digital",
        "objectiveId": "obj-digital",
        "competency": "MONEY_DIGITAL",
        "prompt": "A debit card initiates a purchase from a bank balance. Which is the best distinction?",
        "options": [
          {
            "id": "a",
            "label": "The card itself is the balance"
          },
          {
            "id": "b",
            "label": "The balance supports payment; the card is an access tool"
          },
          {
            "id": "c",
            "label": "Borrowing and savings are identical"
          }
        ],
        "correct": "b",
        "critical": false
      }
    },
    {
      "competency": "MONEY_CIRCULATION",
      "sectionId": "flow",
      "title": "Follow the payment",
      "paragraph": "Now separate two kinds of movement in the example. Goods and services move: the worker performs work, the supplier provides food, and the shop serves a customer. Monetary payments move in connection with that activity. The payment flow helps coordinate real economic exchange, but following a dollar alone does not tell us whether every business is profitable or whether every person has enough income.",
      "reinforcement": {
        "id": "reinforce-MONEY_CIRCULATION",
        "kind": "choice",
        "category": "KNOWLEDGE",
        "sectionId": "flow",
        "objectiveId": "obj-flow",
        "competency": "MONEY_CIRCULATION",
        "prompt": "A shop pays a delivery firm from sales receipts. What can you conclude?",
        "options": [
          {
            "id": "a",
            "label": "All receipts were profit"
          },
          {
            "id": "b",
            "label": "A payment connects businesses, but does not by itself establish profit"
          },
          {
            "id": "c",
            "label": "New currency was necessarily created"
          }
        ],
        "correct": "b",
        "critical": false
      }
    }
  ],
  "liveGuide": [
    {
      "title": "Opening: a world without accepted dollars",
      "minutes": 5,
      "talkingPoints": [
        "Ask what would happen if everyone refused dollars tomorrow. Separate losing acceptance from losing useful goods.",
        "Collect two examples without declaring attendance or confidence to be mastery."
      ],
      "activity": {
        "kind": "POLL",
        "prompt": "What is the obstacle when useful goods exist but the people cannot exchange directly?",
        "sectionId": "world"
      }
    },
    {
      "title": "What the payment tool does",
      "minutes": 10,
      "talkingPoints": [
        "Explain exchange, price comparison and spending later with one evolving wage story.",
        "Use the three-function visual and ask learners to identify the specific action, not just label the whole story."
      ],
      "activity": {
        "kind": "POLL",
        "prompt": "Which action emphasizes medium of exchange?",
        "sectionId": "exchange"
      }
    },
    {
      "title": "Direct barter and compatible wants",
      "minutes": 10,
      "talkingPoints": [
        "Walk through eggs, shoes, bread and the extra search needed.",
        "Show the mismatch, then replace the chain with two separate monetary exchanges. Ask who now needs to want what."
      ],
      "activity": {
        "kind": "POLL",
        "prompt": "You have eggs; the shoemaker wants bread. What is missing?",
        "sectionId": "barter"
      }
    },
    {
      "title": "Acceptance, confidence and institutions",
      "minutes": 10,
      "talkingPoints": [
        "Use the $100 paper question and distinguish the material from recognized monetary use.",
        "Discuss genuine payments, established pricing, public institutions and payment arrangements; qualify scarcity."
      ],
      "activity": {
        "kind": "POLL",
        "prompt": "True or false: monetary value is explained only by the value of the paper.",
        "sectionId": "acceptance"
      }
    },
    {
      "title": "Everyday economic flow",
      "minutes": 8,
      "talkingPoints": [
        "Trace work, wages, account, purchase and business expenses alongside real services.",
        "Ask where saving, taxes and other payments could branch from this deliberately simplified picture."
      ],
      "activity": {
        "kind": "POLL",
        "prompt": "A business uses receipts to pay suppliers. What does the simplified flow show?",
        "sectionId": "flow"
      }
    },
    {
      "title": "Varied comprehension",
      "minutes": 7,
      "talkingPoints": [
        "Run the unit-of-account MCQ, repeated-function matching and material-value misconception check.",
        "Discuss wrong classifications rather than praising a single correct answer as mastery."
      ],
      "activity": {
        "kind": "SINGLE",
        "prompt": "Which action emphasizes unit of account?",
        "sectionId": "account"
      }
    },
    {
      "title": "Explain it in your own words",
      "minutes": 7,
      "talkingPoints": [
        "Ask for a definition without the word money. Invite a bank-account example and a purchasing-power qualification.",
        "Use private rubrics to identify evidence and uncertainty; review written responses individually."
      ],
      "activity": {
        "kind": "WRITTEN",
        "prompt": "Explain the concept without using its name, including a bank-account example.",
        "sectionId": "review"
      }
    },
    {
      "title": "Recap and next-class preview",
      "minutes": 3,
      "talkingPoints": [
        "Recap the exchange bridge, three functions, acceptance and money beyond cash.",
        "Point to the permanent guide and homework; preview the question of historical change without teaching Class2."
      ],
      "activity": {
        "kind": "POLL",
        "prompt": "Which explanation of a $100 note is stronger?",
        "sectionId": "review"
      }
    }
  ],
  "studyGuide": {
    "summary": [
      "Exchange becomes easier when a seller can receive a payment that other people also accept. This separates the person who buys your work from the person who sells what you need. Direct swaps can still work, but coordinating matching wants makes them less convenient in many situations.",
      "The same monetary amount can do different jobs. Making a payment uses an intermediary. Listing and comparing prices uses a shared measure. Holding funds for a later purpose carries spending ability forward. Identify the action in a scenario before naming the function; one story may contain all three.",
      "The usefulness of a currency rests on acceptance and a functioning economic and institutional setting. Its printed amount is not the price of its raw material, and rarity by itself does not create widespread acceptance. Electronic account balances can also support real payments. Cash, bank balances, payment cards and credit arrangements should not be treated as identical objects.",
      "Keeping an amount unchanged does not promise that it buys the same basket later. Purchasing power concerns the actual goods and services available for that amount. Following payments through workers and businesses helps explain exchange, but it does not alone explain production, profit or every movement in the economy."
    ],
    "bigPicture": "Work produces useful services; accepted payments connect exchanges; a shared unit makes prices understandable; retaining funds separates earning from spending. Acceptance, payment arrangements and purchasing power connect all of these ideas.",
    "fiveThings": [
      "Matching wants are needed for a direct swap, not for two separate monetary exchanges.",
      "Paying, comparing and saving emphasize different functions.",
      "Monetary value is not simply the raw-material price of a note.",
      "Account balances can support payments without physical cash changing hands.",
      "A fixed number does not guarantee fixed purchasing power."
    ],
    "outcomes": [
      "Identify the coordination problem in exchange.",
      "Explain compatible wants in direct barter.",
      "Explain money as an exchange bridge.",
      "Identify medium of exchange in a payment.",
      "Identify unit of account in a price comparison.",
      "Explain store of value and variable purchasing power.",
      "Explain acceptance, confidence and monetary usefulness.",
      "Distinguish account balances from cash and payment tools.",
      "Trace connected payments and real economic activity.",
      "Integrate the functions in a reasoned explanation."
    ],
    "examples": [
      "Eggs sold to a willing buyer can fund shoes from a different seller.",
      "A price comparison uses a common measure even before a purchase.",
      "A saved wage can fund a future fare, but a higher fare changes what it buys."
    ],
    "misconceptions": [
      "Without money, all useful goods would have no value.",
      "Barter never works, or all societies developed money through an identical sequence.",
      "Money eliminates scarcity or guarantees that every desired purchase can be made.",
      "Anything with a high price is automatically a commonly accepted medium of exchange.",
      "Unit of account means an account number or simply having a bank account.",
      "Store of value promises that the same amount will always buy exactly the same goods.",
      "Scarcity or a legal declaration by itself fully explains why a currency works.",
      "Only physical notes are money, or a credit limit is the same thing as savings.",
      "Every payment creates new money, or all business receipts are profit.",
      "Finishing reading or earning one correct answer proves every competency in this class."
    ],
    "review": [
      {
        "sectionId": "world",
        "label": "Imagine a World Without Money"
      },
      {
        "sectionId": "barter",
        "label": "The Problem With Direct Barter"
      },
      {
        "sectionId": "bridge",
        "label": "What Money Solves"
      },
      {
        "sectionId": "exchange",
        "label": "Money as a Medium of Exchange"
      },
      {
        "sectionId": "account",
        "label": "Money as a Unit of Account"
      },
      {
        "sectionId": "store",
        "label": "Money as a Store of Value"
      },
      {
        "sectionId": "acceptance",
        "label": "Why People Accept Money"
      },
      {
        "sectionId": "digital",
        "label": "Money Is More Than Cash"
      },
      {
        "sectionId": "flow",
        "label": "Money Moving Through an Economy"
      },
      {
        "sectionId": "review",
        "label": "Apply, Explain and Review"
      }
    ]
  },
  "chart": {
    "required": false,
    "tools": [
      "horizontal_line",
      "trendline",
      "rectangle_zone",
      "ray",
      "arrow",
      "label_text",
      "erase",
      "undo",
      "reset"
    ],
    "stateFormat": "drawing-objects-v1",
    "context": [
      "instrument",
      "timeframe",
      "price_time_coordinates",
      "data_reference",
      "drawing_objects",
      "revision"
    ],
    "reviewStates": [
      "draft",
      "submitted",
      "reviewed",
      "approved",
      "returned_for_revision"
    ],
    "history": "append-only"
  },
  "references": [
    {
      "title": "Bank of England: What is money?",
      "url": "https://www.bankofengland.co.uk/explainers/what-is-money"
    },
    {
      "title": "IMF: Money at the center of transactions",
      "url": "https://www.imf.org/en/publications/fandd/issues/series/back-to-basics/money"
    },
    {
      "title": "Bundesbank: What is money?",
      "url": "https://www.bundesbank.de/en/service/school-service/animation-videos/what-is-money-860024"
    }
  ]
};
