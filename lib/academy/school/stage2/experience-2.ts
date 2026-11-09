import 'server-only';
import type {StageExperience} from '../stage/contracts';
export const EXPERIENCE_S2_2:StageExperience = {
  "classId": "stage-2-class-2",
  "academicVersion": "stage-2-class-2.1.0.0",
  "revision": "fx-product-routes.1.0.1",
  "format": "system",
  "sections": [
    {
      "sectionId": "stage-2-class-2-section-1",
      "hook": "Place a platform icon between customer and provider; ask what legal relationship the icon alone proves.",
      "scenario": "Use fictional cards and pause before revealing the explanation. An exporter requests a dealer quotation while a fund trades a currency futures contract on an exchange.",
      "visual": {
        "kind": "system",
        "nodes": [
          {
            "label": "EXPORTER",
            "detail": "Requests a quoted exchange for business need"
          },
          {
            "label": "DEALER",
            "detail": "Offers bilateral terms; verify counterparty"
          },
          {
            "label": "FUND / EXCHANGE",
            "detail": "A separate futures route; not the same venue"
          }
        ],
        "caption": "Compare parties, obligations and dates; these are distinct hypothetical routes, not one universal execution chain."
      },
      "practice": [
        {
          "id": "stage-2-class-2-explore-1",
          "kind": "reflect",
          "prompt": "A charity uses bank exchange while a fund uses listed futures. Mark which route is not evidence of a universal FX exchange.",
          "explanation": "Compare your explanation with the governing distinction: The broad FX market connects banks, firms, asset managers, public institutions and other participants through several arrangements. Much activity is over the counter: parties transact through dealer relationships and electronic networks rather than one universal central exchange.",
          "retry": "Identify the exact label or assumption you changed, then explain its consequence before continuing."
        }
      ],
      "explanation": [
        "Test the example by changing just one condition. Place a platform icon between customer and provider; ask what legal relationship the icon alone proves.",
        "A useful explanation must rule out this shortcut: All forex trades pass through a single exchange."
      ],
      "takeaway": "A network rather than one counter — show the relationship and its boundary.",
      "demi": "Pause and explain your reasoning before revealing the next card."
    },
    {
      "sectionId": "stage-2-class-2-section-2",
      "hook": "Role-play an exporter receiving USD and a customer buying USD; ask why they can rationally want opposite exchanges.",
      "scenario": "Use fictional cards and pause before revealing the explanation. A manufacturer locks an exchange rate for a known foreign invoice; a separate trader takes currency exposure without an invoice.",
      "visual": {
        "kind": "system",
        "nodes": [
          {
            "label": "INVOICE OBLIGATION",
            "detail": "Foreign-currency payment at a specified date"
          },
          {
            "label": "HEDGING PURPOSE",
            "detail": "Reduce that exposure under stated terms"
          },
          {
            "label": "SPECULATIVE PURPOSE",
            "detail": "Separate exposure without that invoice; different objective"
          }
        ],
        "caption": "Compare parties, obligations and dates; these are distinct hypothetical routes, not one universal execution chain."
      },
      "practice": [
        {
          "id": "stage-2-class-2-explore-2",
          "kind": "choice",
          "prompt": "Which explanation fits the fictional card?",
          "explanation": "Compare your explanation with the governing distinction: A participant may need currency for imports, receive it from exports, manage investments or seek exposure to price changes. Hedging aims to reduce a specified existing exposure; speculation deliberately takes exposure in pursuit of a favorable change.",
          "retry": "Identify the exact label or assumption you changed, then explain its consequence before continuing.",
          "options": [
            {
              "id": "stage-2-class-2-explore-2-sound",
              "label": "A manufacturer locks an exchange rate for a known foreign invoice; a separate trader takes currency exposure without an invoice."
            },
            {
              "id": "stage-2-class-2-explore-2-shortcut",
              "label": "Every bank transaction is speculation and every business transaction is a hedge."
            }
          ],
          "correct": "stage-2-class-2-explore-2-sound"
        }
      ],
      "explanation": [
        "Test the example by changing just one condition. Role-play an exporter receiving USD and a customer buying USD; ask why they can rationally want opposite exchanges.",
        "A useful explanation must rule out this shortcut: Every bank transaction is speculation and every business transaction is a hedge."
      ],
      "takeaway": "Purpose belongs to the participant — show the relationship and its boundary.",
      "demi": "Pause and explain your reasoning before revealing the next card."
    },
    {
      "sectionId": "stage-2-class-2-section-3",
      "hook": "Separate the agreement clock from the delivery clock; move the delivery marker without moving the deal date.",
      "scenario": "Use fictional cards and pause before revealing the explanation. A business agrees an exchange today with delivery on a specified later business date under its contract.",
      "visual": {
        "kind": "system",
        "nodes": [
          {
            "label": "AGREE TODAY",
            "detail": "Contract fixes the currencies and exchange terms"
          },
          {
            "label": "DELIVERY DATE",
            "detail": "Transfer happens at the stated later business date"
          },
          {
            "label": "CHECK TERMS",
            "detail": "Agreement time is not proof of completed delivery"
          }
        ],
        "caption": "Compare parties, obligations and dates; these are distinct hypothetical routes, not one universal execution chain."
      },
      "practice": [
        {
          "id": "stage-2-class-2-explore-3",
          "kind": "reflect",
          "prompt": "A travel cash exchange and a business spot agreement have different delivery arrangements. Name the term that resolves each.",
          "explanation": "Compare your explanation with the governing distinction: A spot transaction agrees an exchange of currencies for near-term settlement under the pair and agreement conventions. The deal date and the settlement date are distinct. Spot does not necessarily mean handing over banknotes immediately.",
          "retry": "Identify the exact label or assumption you changed, then explain its consequence before continuing."
        }
      ],
      "explanation": [
        "Test the example by changing just one condition. Separate the agreement clock from the delivery clock; move the delivery marker without moving the deal date.",
        "A useful explanation must rule out this shortcut: Anything labeled spot settles instantly or is the same as a rolling retail position."
      ],
      "takeaway": "Spot is an exchange arrangement — show the relationship and its boundary.",
      "demi": "Pause and explain your reasoning before revealing the next card."
    },
    {
      "sectionId": "stage-2-class-2-section-4",
      "hook": "Cover the product title and compare delivery, financing and counterparty clauses before guessing its category.",
      "scenario": "Use fictional cards and pause before revealing the explanation. Fictional Provider A offers a rolling price-difference contract, expressly with no currency delivery. It cannot pay a foreign supplier merely because its chart rises.",
      "visual": {
        "kind": "system",
        "nodes": [
          {
            "label": "CUSTOMER ↔ DEALER",
            "detail": "Fictional rolling price-difference contract"
          },
          {
            "label": "PRICE EXPOSURE",
            "detail": "Result depends on product terms and charges"
          },
          {
            "label": "NO CURRENCY DELIVERY",
            "detail": "Cannot directly pay a supplier merely because chart rises"
          }
        ],
        "caption": "Compare parties, obligations and dates; these are distinct hypothetical routes, not one universal execution chain."
      },
      "practice": [
        {
          "id": "stage-2-class-2-explore-4",
          "kind": "choice",
          "prompt": "Which explanation fits the fictional card?",
          "explanation": "Compare your explanation with the governing distinction: Some retail offerings provide rolling currency exposure or contracts for differences rather than delivery of spending money. Depending on jurisdiction and contract, the provider may be the customer’s counterparty. Position maintenance, financing and close-out follow specific terms.",
          "retry": "Identify the exact label or assumption you changed, then explain its consequence before continuing.",
          "options": [
            {
              "id": "stage-2-class-2-explore-4-sound",
              "label": "Fictional Provider A offers a rolling price-difference contract, expressly with no currency delivery. It cannot pay a foreign supplier merely because its chart rises."
            },
            {
              "id": "stage-2-class-2-explore-4-shortcut",
              "label": "A profitable retail currency chart supplies the currency needed for an invoice."
            }
          ],
          "correct": "stage-2-class-2-explore-4-sound"
        }
      ],
      "explanation": [
        "Test the example by changing just one condition. Cover the product title and compare delivery, financing and counterparty clauses before guessing its category.",
        "A useful explanation must rule out this shortcut: A profitable retail currency chart supplies the currency needed for an invoice."
      ],
      "takeaway": "Retail exposure needs its own terms — show the relationship and its boundary.",
      "demi": "Pause and explain your reasoning before revealing the next card."
    },
    {
      "sectionId": "stage-2-class-2-section-5",
      "hook": "Use two date cards and opposite arrows; remove the first exchange and ask which product description remains.",
      "scenario": "Use fictional cards and pause before revealing the explanation. A firm arranges a future EUR payment using a forward. A bank exchanges currencies now and reverses the exchange later through an FX swap.",
      "visual": {
        "kind": "system",
        "nodes": [
          {
            "label": "FORWARD",
            "detail": "Agree now for a future exchange"
          },
          {
            "label": "FX SWAP: FIRST LEG",
            "detail": "Exchange currencies on one agreed date"
          },
          {
            "label": "FX SWAP: REVERSE LEG",
            "detail": "Reverse the exchange at the later agreed date"
          }
        ],
        "caption": "Compare parties, obligations and dates; these are distinct hypothetical routes, not one universal execution chain."
      },
      "practice": [
        {
          "id": "stage-2-class-2-explore-5",
          "kind": "reflect",
          "prompt": "A fictional agreement has two opposite currency exchanges next week and next month. Explain why it is not merely a single outright forward.",
          "explanation": "Compare your explanation with the governing distinction: An outright forward agrees an exchange for a future date at an agreed rate. An FX swap combines exchanges in opposite directions on different dates. These labels describe commitments; they do not establish a guaranteed profit or a forecast.",
          "retry": "Identify the exact label or assumption you changed, then explain its consequence before continuing."
        }
      ],
      "explanation": [
        "Test the example by changing just one condition. Use two date cards and opposite arrows; remove the first exchange and ask which product description remains.",
        "A useful explanation must rule out this shortcut: A forward rate guarantees where the future spot rate will be."
      ],
      "takeaway": "Future exchange and two linked dates — show the relationship and its boundary.",
      "demi": "Pause and explain your reasoning before revealing the next card."
    },
    {
      "sectionId": "stage-2-class-2-section-6",
      "hook": "Put the same currency label on five envelopes; reveal terms one by one and revise the initial classification.",
      "scenario": "Use fictional cards and pause before revealing the explanation. Two fictional displays both show euro exposure but one names a futures contract month and the other a rolling dealer contract.",
      "visual": {
        "kind": "system",
        "nodes": [
          {
            "label": "FUTURES ROUTE",
            "detail": "Exchange contract with a stated month/specification"
          },
          {
            "label": "ROLLING DEALER ROUTE",
            "detail": "Bilateral contract with its own charges/delivery terms"
          },
          {
            "label": "SAME CURRENCY LABEL",
            "detail": "Does not prove identical product, protection or execution"
          }
        ],
        "caption": "Compare parties, obligations and dates; these are distinct hypothetical routes, not one universal execution chain."
      },
      "practice": [
        {
          "id": "stage-2-class-2-explore-6",
          "kind": "choice",
          "prompt": "Which explanation fits the fictional card?",
          "explanation": "Compare your explanation with the governing distinction: Currency futures are standardized exchange-traded contracts with specified contract terms and clearing arrangements. Their quote conventions and contract sizes must be read directly; a familiar currency name does not make them identical to a dealer’s OTC spot quotation.",
          "retry": "Identify the exact label or assumption you changed, then explain its consequence before continuing.",
          "options": [
            {
              "id": "stage-2-class-2-explore-6-sound",
              "label": "Two fictional displays both show euro exposure but one names a futures contract month and the other a rolling dealer contract."
            },
            {
              "id": "stage-2-class-2-explore-6-shortcut",
              "label": "Same pair label means same product, feed and obligation."
            }
          ],
          "correct": "stage-2-class-2-explore-6-sound"
        }
      ],
      "explanation": [
        "Test the example by changing just one condition. Put the same currency label on five envelopes; reveal terms one by one and revise the initial classification.",
        "A useful explanation must rule out this shortcut: Same pair label means same product, feed and obligation."
      ],
      "takeaway": "Futures and the product comparison record — show the relationship and its boundary.",
      "demi": "Pause and explain your reasoning before revealing the next card."
    }
  ]
};
