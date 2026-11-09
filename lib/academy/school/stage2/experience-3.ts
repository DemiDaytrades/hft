import 'server-only';
import type {StageExperience} from '../stage/contracts';
export const EXPERIENCE_S2_3:StageExperience = {
  "classId": "stage-2-class-3",
  "academicVersion": "stage-2-class-3.1.0.0",
  "revision": "fx-sides-visual.1.0.1",
  "format": "quote",
  "sections": [
    {
      "sectionId": "stage-2-class-3-section-1",
      "hook": "Give dealer two price cards; ask customer to request base currency and make dealer hand over the correct card.",
      "scenario": "Use fictional cards and pause before revealing the explanation. EUR/USD bid 1.1000 ask 1.1004: a customer buys EUR at 1.1004 USD per EUR.",
      "visual": {
        "kind": "quote",
        "nodes": [
          {
            "label": "BID",
            "detail": "1.1000 USD/EUR · customer sells EUR"
          },
          {
            "label": "ASK",
            "detail": "1.1004 USD/EUR · customer buys EUR"
          },
          {
            "label": "SPREAD",
            "detail": "0.0004 USD/EUR · ask minus bid"
          }
        ],
        "caption": "Fictional two-sided quote model with explicit units; no brokerage execution guarantee."
      },
      "practice": [
        {
          "id": "stage-2-class-3-explore-1",
          "kind": "reflect",
          "prompt": "At AUD/CAD 0.9000/0.9008 choose the customer sides and explain dealer actions.",
          "explanation": "Compare your explanation with the governing distinction: For a two-way quote in quote currency per base unit, bid is the price at which the quoting dealer buys the base and ask is the price at which it sells the base. The customer buying base normally pays ask; selling base normally receives bid.",
          "retry": "Identify the exact label or assumption you changed, then explain its consequence before continuing."
        }
      ],
      "explanation": [
        "Test the example by changing just one condition. Give dealer two price cards; ask customer to request base currency and make dealer hand over the correct card.",
        "A useful explanation must rule out this shortcut: Bid means the customer should use it for every buy."
      ],
      "takeaway": "Read the dealer’s two sides — show the relationship and its boundary.",
      "demi": "Pause and explain your reasoning before revealing the next card."
    },
    {
      "sectionId": "stage-2-class-3-section-2",
      "hook": "Reverse the transaction arrow when closing and predict which price card must change hands.",
      "scenario": "Use fictional cards and pause before revealing the explanation. Unchanged 1.1000/1.1004 produces a long difference 1.1000−1.1004 = −0.0004 USD/EUR before separate fees.",
      "visual": {
        "kind": "quote",
        "nodes": [
          {
            "label": "OPEN LONG",
            "detail": "Buy EUR at ask 1.1004"
          },
          {
            "label": "CLOSE LONG",
            "detail": "Sell EUR at bid 1.1000"
          },
          {
            "label": "UNCHANGED QUOTE RESULT",
            "detail": "−0.0004 USD/EUR before separate fees"
          }
        ],
        "caption": "Fictional two-sided quote model with explicit units; no brokerage execution guarantee."
      },
      "practice": [
        {
          "id": "stage-2-class-3-explore-2",
          "kind": "choice",
          "prompt": "Which explanation fits the fictional card?",
          "explanation": "Compare your explanation with the governing distinction: A conceptual long-base position starts by buying base and closes by selling it. A conceptual short-base position starts by selling base and closes by buying it back. Therefore long uses ask then bid, while short uses bid then ask.",
          "retry": "Identify the exact label or assumption you changed, then explain its consequence before continuing.",
          "options": [
            {
              "id": "stage-2-class-3-explore-2-sound",
              "label": "Unchanged 1.1000/1.1004 produces a long difference 1.1000−1.1004 = −0.0004 USD/EUR before separate fees."
            },
            {
              "id": "stage-2-class-3-explore-2-shortcut",
              "label": "Closing always uses the same side as opening."
            }
          ],
          "correct": "stage-2-class-3-explore-2-sound"
        }
      ],
      "explanation": [
        "Test the example by changing just one condition. Reverse the transaction arrow when closing and predict which price card must change hands.",
        "A useful explanation must rule out this shortcut: Closing always uses the same side as opening."
      ],
      "takeaway": "Opening and closing are both transactions — show the relationship and its boundary.",
      "demi": "Pause and explain your reasoning before revealing the next card."
    },
    {
      "sectionId": "stage-2-class-3-section-3",
      "hook": "Show a ledger with ask paid and bid received; cross out a duplicate spread fee line and explain the correction.",
      "scenario": "Use fictional cards and pause before revealing the explanation. Ask 1.2006 minus bid 1.2000 gives spread 0.0006 USD/EUR. A same-quote buy then sell difference is −0.0006, not −0.0012.",
      "visual": {
        "kind": "quote",
        "nodes": [
          {
            "label": "BID",
            "detail": "1.2000 USD/EUR"
          },
          {
            "label": "ASK",
            "detail": "1.2006 USD/EUR"
          },
          {
            "label": "DIFFERENCE",
            "detail": "0.0006 USD/EUR; not twice this difference"
          }
        ],
        "caption": "Fictional two-sided quote model with explicit units; no brokerage execution guarantee."
      },
      "practice": [
        {
          "id": "stage-2-class-3-explore-3",
          "kind": "reflect",
          "prompt": "At GBP/CAD 1.7000/1.7010 show spread and same-quote round trip, then explain why subtracting 0.0010 twice is wrong.",
          "explanation": "Compare your explanation with the governing distinction: Spread equals ask minus bid in the same quote units. If an exercise already uses actual opening ask and closing bid, the side difference already reflects their spread effect. Subtracting that same spread again double-counts it.",
          "retry": "Identify the exact label or assumption you changed, then explain its consequence before continuing."
        },
        {
          "id": "s2-3-spread",
          "kind": "calculate",
          "prompt": "Fictional EUR/USD bid 1.0800 ask 1.0806: enter ask minus bid in USD per EUR, not pips.",
          "expected": 0.0006,
          "tolerance": 1e-7,
          "explanation": "1.0806 − 1.0800 = 0.0006 USD/EUR. This is a quote difference, not a sized account result.",
          "retry": "Subtract bid from ask in the same quote units."
        }
      ],
      "explanation": [
        "Test the example by changing just one condition. Show a ledger with ask paid and bid received; cross out a duplicate spread fee line and explain the correction.",
        "A useful explanation must rule out this shortcut: Subtract the spread again after using both actual sides."
      ],
      "takeaway": "Spread is a difference, not a second subtraction — show the relationship and its boundary.",
      "demi": "Pause and explain your reasoning before revealing the next card."
    },
    {
      "sectionId": "stage-2-class-3-section-4",
      "hook": "Keep a midpoint marker fixed while moving two side cards apart; ask long and short customers which exit worsened.",
      "scenario": "Use fictional cards and pause before revealing the explanation. Initial 1.1000/1.1004 becomes 1.0997/1.1007. Midpoint stays 1.1002 but a long-base exit now receives less.",
      "visual": {
        "kind": "quote",
        "nodes": [
          {
            "label": "EARLIER QUOTE",
            "detail": "1.1000 / 1.1004"
          },
          {
            "label": "WIDER QUOTE",
            "detail": "1.0997 / 1.1007"
          },
          {
            "label": "SAME MIDPOINT",
            "detail": "1.1002 · executable sides still changed"
          }
        ],
        "caption": "Fictional two-sided quote model with explicit units; no brokerage execution guarantee."
      },
      "practice": [
        {
          "id": "stage-2-class-3-explore-4",
          "kind": "choice",
          "prompt": "Which explanation fits the fictional card?",
          "explanation": "Compare your explanation with the governing distinction: Quotes can change with provider conditions and market conditions. A spread may widen through a lower bid, a higher ask or both. A constant midpoint does not ensure the customer can exit at an unchanged price.",
          "retry": "Identify the exact label or assumption you changed, then explain its consequence before continuing.",
          "options": [
            {
              "id": "stage-2-class-3-explore-4-sound",
              "label": "Initial 1.1000/1.1004 becomes 1.0997/1.1007. Midpoint stays 1.1002 but a long-base exit now receives less."
            },
            {
              "id": "stage-2-class-3-explore-4-shortcut",
              "label": "An unchanged midpoint guarantees an unchanged exit outcome."
            }
          ],
          "correct": "stage-2-class-3-explore-4-sound"
        }
      ],
      "explanation": [
        "Test the example by changing just one condition. Keep a midpoint marker fixed while moving two side cards apart; ask long and short customers which exit worsened.",
        "A useful explanation must rule out this shortcut: An unchanged midpoint guarantees an unchanged exit outcome."
      ],
      "takeaway": "Widening changes the exit even without mid movement — show the relationship and its boundary.",
      "demi": "Pause and explain your reasoning before revealing the next card."
    },
    {
      "sectionId": "stage-2-class-3-section-5",
      "hook": "Reveal commission and financing cards after a zero-commission slogan; ask which evidence is still missing for a complete total.",
      "scenario": "Use fictional cards and pause before revealing the explanation. A fictional completed exchange has gross side-based result USD 12, commission USD 2 and stated holding charge USD 3: net USD 7, excluding any unstated items.",
      "visual": {
        "kind": "quote",
        "nodes": [
          {
            "label": "SIDE-BASED RESULT",
            "detail": "+12 USD"
          },
          {
            "label": "SEPARATE CHARGES",
            "detail": "−2 USD commission; −3 USD holding"
          },
          {
            "label": "NET STATED RESULT",
            "detail": "+7 USD · do not deduct spread twice"
          }
        ],
        "caption": "Fictional two-sided quote model with explicit units; no brokerage execution guarantee."
      },
      "practice": [
        {
          "id": "stage-2-class-3-explore-5",
          "kind": "reflect",
          "prompt": "Fresh ledger: gross −6 USD, commission 2 USD and holding credit 1 USD. Reconcile −7 USD and explain the credit sign.",
          "explanation": "Compare your explanation with the governing distinction: Commission is a separately stated charge under a schedule. Holding or financing adjustments depend on contract, direction, dates and provider terms; they may be charges or credits. Spread and these items must be distinguished rather than hidden inside a word like free.",
          "retry": "Identify the exact label or assumption you changed, then explain its consequence before continuing."
        }
      ],
      "explanation": [
        "Test the example by changing just one condition. Reveal commission and financing cards after a zero-commission slogan; ask which evidence is still missing for a complete total.",
        "A useful explanation must rule out this shortcut: No commission means no trading cost, or financing is always a credit."
      ],
      "takeaway": "Separate the fee ledger — show the relationship and its boundary.",
      "demi": "Pause and explain your reasoning before revealing the next card."
    },
    {
      "sectionId": "stage-2-class-3-section-6",
      "hook": "Hide the chart last-price tag and ask what information a customer still needs to know their actual buying price.",
      "scenario": "Use fictional cards and pause before revealing the explanation. A chart last price of 1.1010 sits beside a dealer quote 1.1007/1.1013; the chart does not guarantee a buy at 1.1010.",
      "visual": {
        "kind": "quote",
        "nodes": [
          {
            "label": "CHART LAST",
            "detail": "1.1010 · not a guaranteed fill"
          },
          {
            "label": "DEALER BID",
            "detail": "1.1007 USD/EUR"
          },
          {
            "label": "DEALER ASK",
            "detail": "1.1013 USD/EUR · conditions still apply"
          }
        ],
        "caption": "Fictional two-sided quote model with explicit units; no brokerage execution guarantee."
      },
      "practice": [
        {
          "id": "stage-2-class-3-explore-6",
          "kind": "choice",
          "prompt": "Which explanation fits the fictional card?",
          "explanation": "Compare your explanation with the governing distinction: An indicative quote or last-traded chart price describes information, not an unconditional promise that a customer can transact there. Executability depends on product, provider, size, time and conditions. Actual recorded sides are needed to assess a hypothetical result.",
          "retry": "Identify the exact label or assumption you changed, then explain its consequence before continuing.",
          "options": [
            {
              "id": "stage-2-class-3-explore-6-sound",
              "label": "A chart last price of 1.1010 sits beside a dealer quote 1.1007/1.1013; the chart does not guarantee a buy at 1.1010."
            },
            {
              "id": "stage-2-class-3-explore-6-shortcut",
              "label": "A chart touch guarantees that every customer was filled there."
            }
          ],
          "correct": "stage-2-class-3-explore-6-sound"
        }
      ],
      "explanation": [
        "Test the example by changing just one condition. Hide the chart last-price tag and ask what information a customer still needs to know their actual buying price.",
        "A useful explanation must rule out this shortcut: A chart touch guarantees that every customer was filled there."
      ],
      "takeaway": "A displayed price is conditional evidence — show the relationship and its boundary.",
      "demi": "Pause and explain your reasoning before revealing the next card."
    }
  ]
};
