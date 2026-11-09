import type {StageExperience} from './contracts';
export const EXPERIENCE_EIGHT:StageExperience={
  "classId": "stage-1-class-8",
  "academicVersion": "stage-1-class-8.1.0.0",
  "revision": "1",
  "format": "fx",
  "sections": [
    {
      "sectionId": "stage-1-class-8-section-1",
      "hook": "A payment crosses a border",
      "scenario": "Hypothetical: Maple Books holds only Canadian dollars and owes the printer euros. It asks a payment provider about exchanging funds and delivering euros.",
      "visual": {
        "kind": "fx",
        "nodes": [
          {
            "label": "Canada: bookshop",
            "detail": "Canadian-dollar receipts"
          },
          {
            "label": "Provider",
            "detail": "May arrange exchange and payment"
          },
          {
            "label": "France: printer",
            "detail": "Euro invoice must be paid"
          }
        ],
        "caption": "Original HFT teaching map; all examples are hypothetical."
      },
      "practice": [
        {
          "id": "stage-1-class-8-explore-1",
          "kind": "choice",
          "prompt": "A Canadian buyer owes euros. What should be checked first?",
          "options": [
            {
              "id": "reasoned",
              "label": "Check the invoice currency and existing balances"
            },
            {
              "id": "shortcut",
              "label": "Assume every French supplier accepts Canadian dollars"
            }
          ],
          "correct": "reasoned",
          "explanation": "Check the invoice currency and existing balances. Foreign exchange connects such currency needs. The border alone does not determine the payment currency: parties can agree on a currency, and a business might already hold it. Read the invoice and available balances before assuming conversion is necessary.",
          "retry": "Revisit the scenario and its conditions. Test this mistaken claim: Every international payment automatically requires a new conversion. Then choose the explanation supported by the information given."
        }
      ],
      "explanation": [
        "A Canadian bookshop orders printing from a French printer whose invoice requires euros. The bookshop receives Canadian dollars from local sales. It needs a way to deliver the currency required by the contract, not merely a smaller or larger number on a screen.",
        "Foreign exchange connects such currency needs. The border alone does not determine the payment currency: parties can agree on a currency, and a business might already hold it. Read the invoice and available balances before assuming conversion is necessary."
      ],
      "takeaway": "Identify the currency need behind a cross-border payment",
      "demi": "Pause and explain: identify the currency need behind a cross-border payment. Which assumption would change your answer?"
    },
    {
      "sectionId": "stage-1-class-8-section-2",
      "hook": "Two currencies, one relationship",
      "scenario": "Hypothetical: the same Canadian-dollar amount obtains more euros on Friday than Monday. With other payment conditions held equal, a fixed euro invoice would require fewer Canadian dollars. No actual exchange quotation is being taught.",
      "visual": {
        "kind": "fx",
        "nodes": [
          {
            "label": "Held amount",
            "detail": "Same Canadian-dollar amount on both days"
          },
          {
            "label": "Monday",
            "detail": "Obtains fewer euros"
          },
          {
            "label": "Friday",
            "detail": "Obtains more euros; relative change only"
          }
        ],
        "caption": "Original HFT teaching map; all examples are hypothetical."
      },
      "practice": [
        {
          "id": "stage-1-class-8-explore-2",
          "kind": "choice",
          "prompt": "The same Canadian-dollar amount obtains more euros. What can be said?",
          "options": [
            {
              "id": "shortcut",
              "label": "Canadian domestic prices must have fallen"
            },
            {
              "id": "reasoned",
              "label": "Canadian dollars strengthened relative to euros in this comparison"
            }
          ],
          "correct": "reasoned",
          "explanation": "Canadian dollars strengthened relative to euros in this comparison. One Canadian dollar obtaining more euros than before means it has strengthened relative to the euro in that comparison. It does not establish that it buys more groceries in Canada, or that it strengthened against every other currency.",
          "retry": "Revisit the scenario and its conditions. Test this mistaken claim: A stronger currency necessarily buys more of everything everywhere. Then choose the explanation supported by the information given."
        },
        {
          "id": "stage-1-class-8-explore-relative",
          "kind": "reflect",
          "prompt": "Compare two days when an equal Canadian-dollar amount obtains different euro amounts. Explain the relative change without claiming anything about Canadian grocery prices.",
          "explanation": "Obtaining more euros indicates strengthening relative to euros for that comparison. Domestic purchasing power and other currency relationships remain unknown.",
          "retry": "Name both currencies and hold the Canadian-dollar amount fixed. Then identify what the comparison cannot tell you."
        }
      ],
      "explanation": [
        "A currency\u2019s exchange value describes what it can obtain in another currency. Saying a currency became stronger is incomplete until we name the currency used for comparison and the period considered. Domestic purchasing power is a related but different question.",
        "One Canadian dollar obtaining more euros than before means it has strengthened relative to the euro in that comparison. It does not establish that it buys more groceries in Canada, or that it strengthened against every other currency."
      ],
      "takeaway": "Explain relative currency value",
      "demi": "Pause and explain: explain relative currency value. Which assumption would change your answer?"
    },
    {
      "sectionId": "stage-1-class-8-section-3",
      "hook": "Exchange follows the obligation",
      "scenario": "Hypothetical: a New Zealand student holds New Zealand dollars and a Swedish university requires kronor. The map must end with the university receiving kronor, not merely with the student seeing a conversion confirmation.",
      "visual": {
        "kind": "fx",
        "nodes": [
          {
            "label": "New Zealand student",
            "detail": "Holds New Zealand dollars"
          },
          {
            "label": "Exchange and payment route",
            "detail": "Conversion is not proof of recipient delivery"
          },
          {
            "label": "Swedish university",
            "detail": "Requires kronor received"
          }
        ],
        "caption": "Original HFT teaching map; all examples are hypothetical."
      },
      "practice": [
        {
          "id": "stage-1-class-8-explore-route",
          "kind": "sequence",
          "prompt": "Order this simplified payment route. The student holds New Zealand dollars and the university requires kronor; actual providers may arrange steps differently.",
          "rows": [
            {
              "id": "recipient",
              "label": "University receives required kronor"
            },
            {
              "id": "obligation",
              "label": "Student identifies invoice currency and available balance"
            },
            {
              "id": "provider",
              "label": "Provider arranges conversion and payment"
            }
          ],
          "options": [
            {
              "id": "first",
              "label": "First"
            },
            {
              "id": "second",
              "label": "Second"
            },
            {
              "id": "third",
              "label": "Third"
            }
          ],
          "answers": {
            "obligation": "first",
            "provider": "second",
            "recipient": "third"
          },
          "explanation": "Start with the obligation and holdings, arrange a route, then verify recipient delivery. A conversion confirmation alone does not prove payment.",
          "retry": "Begin with identifying the need and end with the university receiving the required currency."
        }
      ],
      "explanation": [
        "Conversion exchanges an amount in one currency for an amount in another. Keep three questions separate: what the customer holds, what the recipient requires and which intermediary helps bridge the difference. A successful conversion alone does not prove that the recipient has been paid.",
        "A currency flow map can show the customer giving one currency, a provider arranging exchange, and a recipient receiving the required currency. It is a teaching simplification; actual accounts, payment chains and settlement arrangements vary."
      ],
      "takeaway": "Trace what is given and what is received",
      "demi": "Pause and explain: trace what is given and what is received. Which assumption would change your answer?"
    },
    {
      "sectionId": "stage-1-class-8-section-4",
      "hook": "Participants serve different needs",
      "scenario": "Hypothetical: an Australian museum pays a New Zealand conservator in New Zealand dollars. Its immediate need is paying for conservation work, not proving a speculative strategy.",
      "visual": {
        "kind": "fx",
        "nodes": [
          {
            "label": "Australian museum",
            "detail": "Needs conservation services"
          },
          {
            "label": "Intermediary",
            "detail": "May facilitate conversion/payment"
          },
          {
            "label": "New Zealand conservator",
            "detail": "Receives agreed currency for work"
          }
        ],
        "caption": "Original HFT teaching map; all examples are hypothetical."
      },
      "practice": [
        {
          "id": "stage-1-class-8-explore-purposes",
          "kind": "matching",
          "prompt": "Match these described needs to their immediate purposes; participant labels alone do not determine every motive.",
          "rows": [
            {
              "id": "museum",
              "label": "Museum pays a foreign conservator"
            },
            {
              "id": "traveller",
              "label": "Traveller obtains currency for meals abroad"
            },
            {
              "id": "investor",
              "label": "Fund seeks to reduce uncertainty from an overseas currency exposure"
            }
          ],
          "options": [
            {
              "id": "exposure",
              "label": "Manage currency exposure"
            },
            {
              "id": "service",
              "label": "Pay for a service"
            },
            {
              "id": "spending",
              "label": "Meet travel spending needs"
            }
          ],
          "answers": {
            "museum": "service",
            "traveller": "spending",
            "investor": "exposure"
          },
          "explanation": "FX supports payment, travel and exposure-management needs. None promises a profit or removes every risk.",
          "retry": "Read the stated obligation or objective rather than assuming all participants seek speculative gains."
        }
      ],
      "explanation": [
        "Businesses may exchange currencies to pay suppliers or receive sales proceeds. Travellers may obtain spending money. Investors may change currency exposure when holding assets abroad. Dealers and other intermediaries help counterparties transact; central banks can also participate for policy or reserve purposes.",
        "A participant label does not reveal a single motive. A company may seek to reduce uncertainty rather than profit from a currency move. Hedging means managing an exposure; it does not remove every risk or make a transaction free. Detailed instruments come later."
      ],
      "takeaway": "Match FX participants with purposes",
      "demi": "Pause and explain: match fx participants with purposes. Which assumption would change your answer?"
    },
    {
      "sectionId": "stage-1-class-8-section-5",
      "hook": "A network with real risks",
      "scenario": "Hypothetical: a charity budgets for a future Norwegian-krone invoice using funds held in Swiss francs. If francs later obtain fewer kroner, more francs may be needed, with other conditions held equal.",
      "visual": {
        "kind": "fx",
        "nodes": [
          {
            "label": "Budget today",
            "detail": "Funds held in Swiss francs"
          },
          {
            "label": "Future obligation",
            "detail": "Norwegian kroner required"
          },
          {
            "label": "Uncertainty",
            "detail": "Currency relationship and delivery can change"
          }
        ],
        "caption": "Original HFT teaching map; all examples are hypothetical."
      },
      "practice": [
        {
          "id": "stage-1-class-8-explore-5",
          "kind": "choice",
          "prompt": "A future foreign-currency invoice is budgeted today. What uncertainty remains?",
          "options": [
            {
              "id": "reasoned",
              "label": "Currency changes and payment arrangements can alter the outcome"
            },
            {
              "id": "shortcut",
              "label": "Global trading activity guarantees the budget"
            }
          ],
          "correct": "reasoned",
          "explanation": "Currency changes and payment arrangements can alter the outcome. The currency relationship can change before an obligation is paid. There can also be service charges, delays, counterparty and settlement problems, and operational errors. Which risks matter depends on the arrangement; liquid markets do not guarantee every customer a particular outcome.",
          "retry": "Revisit the scenario and its conditions. Test this mistaken claim: An active global market guarantees a fixed cost and timely delivery. Then choose the explanation supported by the information given."
        }
      ],
      "explanation": [
        "Much FX trading occurs over the counter: participants transact through relationships and trading venues rather than one single universal exchange. BIS describes a complex dealer and customer market. A retail screen offers one route into that wider network, not a view of every available transaction.",
        "The currency relationship can change before an obligation is paid. There can also be service charges, delays, counterparty and settlement problems, and operational errors. Which risks matter depends on the arrangement; liquid markets do not guarantee every customer a particular outcome."
      ],
      "takeaway": "Describe basic organization and relevant uncertainty",
      "demi": "Pause and explain: describe basic organization and relevant uncertainty. Which assumption would change your answer?"
    },
    {
      "sectionId": "stage-1-class-8-section-6",
      "hook": "Connect the money system to FX",
      "scenario": "Hypothetical: a Kenyan arts group earns Kenyan shillings and hires a South African sound engineer paid in rand. Map the payment requirement and an intermediary, then ask about timing and delivery rather than assuming a profit.",
      "visual": {
        "kind": "fx",
        "nodes": [
          {
            "label": "Kenyan arts group",
            "detail": "Earns Kenyan shillings"
          },
          {
            "label": "Possible intermediary",
            "detail": "Ask about currency delivery and timing"
          },
          {
            "label": "South African engineer",
            "detail": "Contract requires rand"
          }
        ],
        "caption": "Original HFT teaching map; all examples are hypothetical."
      },
      "practice": [
        {
          "id": "stage-1-class-8-explore-6",
          "kind": "choice",
          "prompt": "What belongs in an introductory cross-border currency map?",
          "options": [
            {
              "id": "shortcut",
              "label": "Choose a trade because two currency names are known"
            },
            {
              "id": "reasoned",
              "label": "Identify the obligation, currency need, route and uncertainties"
            }
          ],
          "correct": "reasoned",
          "explanation": "Identify the obligation, currency need, route and uncertainties. A complete introductory map names the obligation, currencies held and required, participants, possible conversion and delivery, and uncertainties. It also marks missing information. Detailed quoting conventions and trading mechanics belong to later learning; a foundation map cannot authorize a trading decision.",
          "retry": "Revisit the scenario and its conditions. Test this mistaken claim: Knowing a currency pair makes someone ready to trade it. Then choose the explanation supported by the information given."
        }
      ],
      "explanation": [
        "Money lets obligations be stated and settled, institutions maintain accounts and payments, and markets connect participants with different needs. FX adds the problem that those needs can be expressed in different currencies. Start with the economic purpose before looking at a trading screen.",
        "A complete introductory map names the obligation, currencies held and required, participants, possible conversion and delivery, and uncertainties. It also marks missing information. Detailed quoting conventions and trading mechanics belong to later learning; a foundation map cannot authorize a trading decision."
      ],
      "takeaway": "Synthesize purpose, relative value and limits",
      "demi": "Pause and explain: synthesize purpose, relative value and limits. Which assumption would change your answer?"
    }
  ]
};
