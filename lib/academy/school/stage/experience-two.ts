import type {StageExperience} from './contracts';

// Public exploratory teaching material, independently authored from saved assessments.
export const EXPERIENCE_TWO: StageExperience = {
  "classId": "stage-1-class-2",
  "academicVersion": "stage-1-class-2.1.0.0",
  "revision": "stage-1-class-2-experience-1",
  "format": "timeline",
  "sections": [
    {
      "sectionId": "stage-1-class-2-section-1",
      "hook": "Can two neighbors exchange without agreeing on one payment object?",
      "scenario": "Place two parallel paths beside each other: immediate exchange and recorded obligation. Neither path claims to describe all societies.",
      "visual": {
        "kind": "timeline",
        "nodes": [
          {
            "label": "Immediate exchange",
            "detail": "Two parties transfer goods now; matching wants can be difficult."
          },
          {
            "label": "Recorded obligation",
            "detail": "A delivery may create a debt settled later; memory and enforcement matter."
          },
          {
            "label": "Shared provision",
            "detail": "A group may transfer goods through social obligations rather than a spot trade."
          }
        ],
        "caption": "Selected historical pathways overlap; position is not a ranking of societies."
      },
      "practice": [
        {
          "id": "stage-1-class-2-explore-1",
          "kind": "choice",
          "prompt": "Which additional fact would most help compare the obligation lane with the immediate-swap lane?",
          "options": [
            {
              "id": "stage-1-class-2-explore-1-unsupported",
              "label": "Which neighbor owns the newer phone"
            },
            {
              "id": "stage-1-class-2-explore-1-supported",
              "label": "When and how the recorded debt must be settled"
            }
          ],
          "correct": "stage-1-class-2-explore-1-supported",
          "explanation": "The immediate swap, the recorded debt and the shared provision answer different social questions. Ask when each obligation ends and who can enforce it.",
          "retry": "Revisit the comparison in this chapter and identify the particular problem, not a universal ranking."
        }
      ],
      "explanation": [
        "The immediate swap, the recorded debt and the shared provision answer different social questions. Ask when each obligation ends and who can enforce it.",
        "Their coexistence is the central observation. The picture cannot tell us which arrangement came first elsewhere."
      ],
      "takeaway": "Describe the remaining limitation before claiming a historical improvement.",
      "demi": "Tell me what changed and what still required confidence."
    },
    {
      "sectionId": "stage-1-class-2-section-2",
      "hook": "Would a valuable object travel well?",
      "scenario": "Compare two properties of a hypothetical metal payment: dividing the amount and carrying its weight.",
      "visual": {
        "kind": "timeline",
        "nodes": [
          {
            "label": "Nonmonetary use",
            "detail": "Copper can be useful in manufacture."
          },
          {
            "label": "Payment acceptance",
            "detail": "People must also accept it to settle an obligation."
          },
          {
            "label": "Remaining costs",
            "detail": "Weight, divisibility and quality verification affect usefulness."
          }
        ],
        "caption": "Selected historical pathways overlap; position is not a ranking of societies."
      },
      "practice": [
        {
          "id": "stage-1-class-2-explore-2",
          "kind": "choice",
          "prompt": "For a long-distance copper payment, what would reducing shipment weight directly improve?",
          "options": [
            {
              "id": "stage-1-class-2-explore-2-supported",
              "label": "Transport burden"
            },
            {
              "id": "stage-1-class-2-explore-2-unsupported",
              "label": "Proof that every distant merchant will accept it"
            }
          ],
          "correct": "stage-1-class-2-explore-2-supported",
          "explanation": "Usefulness outside payment can support demand for copper, but the merchant still needs someone willing to accept it.",
          "retry": "Revisit the comparison in this chapter and identify the particular problem, not a universal ranking."
        }
      ],
      "explanation": [
        "Usefulness outside payment can support demand for copper, but the merchant still needs someone willing to accept it.",
        "Being divisible answers the amount problem; being heavy creates a transport problem. Evaluate those properties separately."
      ],
      "takeaway": "Describe the remaining limitation before claiming a historical improvement.",
      "demi": "Tell me what changed and what still required confidence."
    },
    {
      "sectionId": "stage-1-class-2-section-3",
      "hook": "What does a familiar stamp save the seller from doing?",
      "scenario": "Compare a metal weight, a stamped denomination and a purchase: each answers a different question.",
      "visual": {
        "kind": "timeline",
        "nodes": [
          {
            "label": "Weighed metal",
            "detail": "Measure quantity and assess purity."
          },
          {
            "label": "Standard denomination",
            "detail": "A recognized stamp can reduce repeated measurement."
          },
          {
            "label": "Continuing confidence",
            "detail": "Damage and counterfeiting still require attention."
          }
        ],
        "caption": "Selected historical pathways overlap; position is not a ranking of societies."
      },
      "practice": [
        {
          "id": "stage-1-class-2-explore-3",
          "kind": "choice",
          "prompt": "Which observation would show standardization helping without solving everything?",
          "options": [
            {
              "id": "stage-1-class-2-explore-3-unsupported",
              "label": "Every seller refuses to recognize every denomination"
            },
            {
              "id": "stage-1-class-2-explore-3-supported",
              "label": "Most coins are accepted quickly but damaged pieces are inspected"
            }
          ],
          "correct": "stage-1-class-2-explore-3-supported",
          "explanation": "A standard denomination can replace repeated weighing in an ordinary transaction when people trust the coin.",
          "retry": "Revisit the comparison in this chapter and identify the particular problem, not a universal ranking."
        }
      ],
      "explanation": [
        "A standard denomination can replace repeated weighing in an ordinary transaction when people trust the coin.",
        "The worn-coin case tests the boundary of that convenience: recognition and acceptability are different judgments."
      ],
      "takeaway": "Describe the remaining limitation before claiming a historical improvement.",
      "demi": "Tell me what changed and what still required confidence."
    },
    {
      "sectionId": "stage-1-class-2-section-4",
      "hook": "Does the same material imply the same promise?",
      "scenario": "Trace selected Swedish changes in instruments, institutions and issuing authority. Then compare a hypothetical redeemable receipt with modern fiat currency; do not assume all the dated instruments have identical terms.",
      "visual": {
        "kind": "timeline",
        "nodes": [
          {
            "label": "Sweden, 1661",
            "detail": "Stockholms Banco issues banknotes; this is a European example, not an origin claim for all paper money."
          },
          {
            "label": "Sweden, 1668",
            "detail": "The Bank of the Estates, now Riksbank, is established after Stockholms Banco’s failure."
          },
          {
            "label": "Sweden, 1701",
            "detail": "Transport bills allow transfer by signing over the bill."
          },
          {
            "label": "Sweden, 1904",
            "detail": "The Riksbank acquires sole authority to issue Swedish banknotes."
          }
        ],
        "caption": "Selected historical pathways overlap; position is not a ranking of societies."
      },
      "practice": [
        {
          "id": "stage-1-class-2-explore-4",
          "kind": "choice",
          "prompt": "What evidence would you inspect before labeling a museum note redeemable?",
          "options": [
            {
              "id": "stage-1-class-2-explore-4-supported",
              "label": "The issuer’s stated redemption terms"
            },
            {
              "id": "stage-1-class-2-explore-4-unsupported",
              "label": "The fact that the note is printed on paper"
            }
          ],
          "correct": "stage-1-class-2-explore-4-supported",
          "explanation": "The 1661 Swedish example locates an institution and date rather than an origin for paper everywhere.",
          "retry": "Revisit the comparison in this chapter and identify the particular problem, not a universal ranking."
        },
        {
          "id": "stage-1-class-2-explore-dated-order",
          "kind": "sequence",
          "prompt": "Order these three selected Swedish monetary developments from earliest to latest. This chronology applies to the stated examples, not every country.",
          "rows": [
            {
              "id": "stage-1-class-2-dated-sweden",
              "label": "Stockholms Banco banknotes, Sweden 1661"
            },
            {
              "id": "stage-1-class-2-dated-ecb-original",
              "label": "Transport bills introduced, Sweden 1701"
            },
            {
              "id": "stage-1-class-2-dated-ecb-update",
              "label": "Riksbank sole note-issuing authority, Sweden 1904"
            }
          ],
          "options": [
            {
              "id": "stage-1-class-2-position-1",
              "label": "Earliest of these events"
            },
            {
              "id": "stage-1-class-2-position-2",
              "label": "Middle of these events"
            },
            {
              "id": "stage-1-class-2-position-3",
              "label": "Latest of these events"
            }
          ],
          "answers": {
            "stage-1-class-2-dated-sweden": "stage-1-class-2-position-1",
            "stage-1-class-2-dated-ecb-original": "stage-1-class-2-position-2",
            "stage-1-class-2-dated-ecb-update": "stage-1-class-2-position-3"
          },
          "explanation": "1661 precedes 1701, which precedes 1904. Transferability and exclusive issuing authority are different developments, not proof of one universal sequence.",
          "retry": "Order the stated dates, then name what changed at each event."
        }
      ],
      "explanation": [
        "The 1661, 1668, 1701 and 1904 events change different features: paper issuance, institutional organization, transferability and note-issuing authority.",
        "These are selected Swedish developments. Their order does not establish that every society followed this pathway or that paper had no earlier history elsewhere."
      ],
      "takeaway": "Describe the remaining limitation before claiming a historical improvement.",
      "demi": "Tell me what changed and what still required confidence."
    },
    {
      "sectionId": "stage-1-class-2-section-5",
      "hook": "If the phone changes, did the money change?",
      "scenario": "Connect a balance to two access tools: a card and an app. Keep the claim separate from the interface.",
      "visual": {
        "kind": "timeline",
        "nodes": [
          {
            "label": "Deposit balance",
            "detail": "A recorded customer claim on the bank."
          },
          {
            "label": "Card or app",
            "detail": "An access tool that can initiate a payment instruction."
          },
          {
            "label": "Payment system",
            "detail": "Institutions process obligations beyond the visible interface."
          },
          {
            "label": "Initial euro area, 1 January 1999",
            "detail": "The euro launches for accounting and electronic use."
          },
          {
            "label": "Initial euro area, 1 January 2002",
            "detail": "Euro notes and coins enter circulation."
          }
        ],
        "caption": "Selected historical pathways overlap; position is not a ranking of societies."
      },
      "practice": [
        {
          "id": "stage-1-class-2-explore-5",
          "kind": "choice",
          "prompt": "A card stops working but the account remains valid. Which distinction helps explain this?",
          "options": [
            {
              "id": "stage-1-class-2-explore-5-unsupported",
              "label": "A broken card proves the account balance never existed"
            },
            {
              "id": "stage-1-class-2-explore-5-supported",
              "label": "Access to a claim can fail without the claim becoming a different currency"
            }
          ],
          "correct": "stage-1-class-2-explore-5-supported",
          "explanation": "The deposit sits in the bank’s records. The interface can change while the account and currency stay the same.",
          "retry": "Revisit the comparison in this chapter and identify the particular problem, not a universal ranking."
        }
      ],
      "explanation": [
        "The deposit sits in the bank’s records. The interface can change while the account and currency stay the same.",
        "A useful comparison separates the claim, the instruction tool and the institutions that process the instruction.",
        "In the initial euro-area launch, accounting/electronic use began in 1999 and euro cash followed in 2002. The currency and the arrival of its cash form were distinct developments."
      ],
      "takeaway": "Describe the remaining limitation before claiming a historical improvement.",
      "demi": "Tell me what changed and what still required confidence."
    },
    {
      "sectionId": "stage-1-class-2-section-6",
      "hook": "Which payment survives this particular disruption?",
      "scenario": "End the timeline with parallel cash and account lanes rather than a single winner. Ask which problem each addresses.",
      "visual": {
        "kind": "timeline",
        "nodes": [
          {
            "label": "Swedish institutional lane",
            "detail": "1661 notes; 1668 new institution; 1701 transfer bills; 1904 sole note-issuing authority."
          },
          {
            "label": "Initial euro-area launch lane",
            "detail": "1999 accounting/electronic euro; 2002 euro cash."
          },
          {
            "label": "Comparison boundary",
            "detail": "Selected European examples cannot establish the origins or pathways of every monetary system."
          }
        ],
        "caption": "Selected historical pathways overlap; position is not a ranking of societies."
      },
      "practice": [
        {
          "id": "stage-1-class-2-explore-6",
          "kind": "choice",
          "prompt": "Which fact would change the usefulness of cash in this scenario?",
          "options": [
            {
              "id": "stage-1-class-2-explore-6-supported",
              "label": "Whether the shop accepts cash and can complete the sale"
            },
            {
              "id": "stage-1-class-2-explore-6-unsupported",
              "label": "Whether cash is older than an app"
            }
          ],
          "correct": "stage-1-class-2-explore-6-supported",
          "explanation": "The outage is a conditional comparison: a shop that accepts cash may continue taking cash while connectivity is unavailable.",
          "retry": "Revisit the comparison in this chapter and identify the particular problem, not a universal ranking."
        }
      ],
      "explanation": [
        "The outage is a conditional comparison: a shop that accepts cash may continue taking cash while connectivity is unavailable.",
        "This does not rank every form for every person. When the network returns, remote account payment may again solve a different need."
      ],
      "takeaway": "Describe the remaining limitation before claiming a historical improvement.",
      "demi": "Tell me what changed and what still required confidence."
    }
  ]
};
