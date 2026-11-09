import type {StageExperience} from './contracts';

// Public exploratory teaching material, independently authored from saved assessments.
export const EXPERIENCE_THREE: StageExperience = {
  "classId": "stage-1-class-3",
  "academicVersion": "stage-1-class-3.1.0.0",
  "revision": "stage-1-class-3-experience-1",
  "format": "system",
  "sections": [
    {
      "sectionId": "stage-1-class-3-section-1",
      "hook": "Who is missing when the diagram shows only two phones?",
      "scenario": "Follow a hypothetical payment instruction from Noor through Cedar to Elm and the repair shop.",
      "visual": {
        "kind": "system",
        "nodes": [
          {
            "label": "Noor",
            "detail": "Instructs a hypothetical 40-unit payment."
          },
          {
            "label": "Bank Cedar",
            "detail": "Provides the payer’s account."
          },
          {
            "label": "Bank Elm",
            "detail": "Provides the recipient’s account."
          },
          {
            "label": "Repair shop",
            "detail": "Receives the payment under the system’s rules."
          }
        ],
        "caption": "A simplified relationship map, not a technical specification for every payment."
      },
      "practice": [
        {
          "id": "stage-1-class-3-explore-1",
          "kind": "choice",
          "prompt": "What should be added to a sketch that contains only Noor and the shop?",
          "options": [
            {
              "id": "stage-1-class-3-explore-1-unsupported",
              "label": "A second picture of Noor’s phone"
            },
            {
              "id": "stage-1-class-3-explore-1-supported",
              "label": "The banks and the payment arrangements connecting them"
            }
          ],
          "correct": "stage-1-class-3-explore-1-supported",
          "explanation": "Cedar and Elm are distinct institutions with customer obligations. A phone displays access to the arrangement rather than replacing those institutions.",
          "retry": "Return to the map and identify the actor and obligation named in the question."
        }
      ],
      "explanation": [
        "Cedar and Elm are distinct institutions with customer obligations. A phone displays access to the arrangement rather than replacing those institutions.",
        "Follow the direction of the instruction first. Then ask what rules determine the point at which the shop can rely on completion."
      ],
      "takeaway": "Identify an obligation and its constraint before generalizing from the balance.",
      "demi": "Tell me who owes whom, then name a constraint."
    },
    {
      "sectionId": "stage-1-class-3-section-2",
      "hook": "Can the same balance be an asset and a liability?",
      "scenario": "View one deposit from two sides: customer asset and bank obligation. Then change part of it into cash.",
      "visual": {
        "kind": "system",
        "nodes": [
          {
            "label": "Customer asset",
            "detail": "A 200-unit deposit is a claim on the bank."
          },
          {
            "label": "Bank liability",
            "detail": "The bank owes the customer under account terms."
          },
          {
            "label": "Withdrawal",
            "detail": "A 30-unit cash withdrawal leaves a 170-unit deposit, ignoring fees."
          }
        ],
        "caption": "A simplified relationship map, not a technical specification for every payment."
      },
      "practice": [
        {
          "id": "stage-1-class-3-explore-2",
          "kind": "choice",
          "prompt": "Ignoring fees, after withdrawing 30 from a 200-unit deposit, which total describes deposit plus cash?",
          "options": [
            {
              "id": "stage-1-class-3-explore-2-supported",
              "label": "200 units across two forms"
            },
            {
              "id": "stage-1-class-3-explore-2-unsupported",
              "label": "230 units because cash is new wealth"
            }
          ],
          "correct": "stage-1-class-3-explore-2-supported",
          "explanation": "View the claim from both sides: what the customer owns is an amount the bank owes. This is a relationship, not a contradiction.",
          "retry": "Return to the map and identify the actor and obligation named in the question."
        }
      ],
      "explanation": [
        "View the claim from both sides: what the customer owns is an amount the bank owes. This is a relationship, not a contradiction.",
        "The withdrawal exchanges part of that deposit claim for cash. Count both forms before claiming the customer has gained money."
      ],
      "takeaway": "Identify an obligation and its constraint before generalizing from the balance.",
      "demi": "Tell me who owes whom, then name a constraint."
    },
    {
      "sectionId": "stage-1-class-3-section-3",
      "hook": "Is sending an instruction the same as discharging an obligation?",
      "scenario": "Draw two layers: customer deposits above, interbank settlement below. Trace obligations between the layers.",
      "visual": {
        "kind": "system",
        "nodes": [
          {
            "label": "Instruction",
            "detail": "The payer requests a transfer."
          },
          {
            "label": "Clearing",
            "detail": "Participants establish or reconcile obligations."
          },
          {
            "label": "Settlement",
            "detail": "An agreed asset discharges obligations under system rules."
          },
          {
            "label": "Separate layer",
            "detail": "Customer deposits are not the bank’s own reserve account."
          }
        ],
        "caption": "A simplified relationship map, not a technical specification for every payment."
      },
      "practice": [
        {
          "id": "stage-1-class-3-explore-3",
          "kind": "choice",
          "prompt": "If a service nets many payments before final settlement, what should the map retain?",
          "options": [
            {
              "id": "stage-1-class-3-explore-3-unsupported",
              "label": "A claim that no bank obligation ever arose"
            },
            {
              "id": "stage-1-class-3-explore-3-supported",
              "label": "A distinction between customer transfers and the banks’ discharged obligations"
            }
          ],
          "correct": "stage-1-class-3-explore-3-supported",
          "explanation": "The upper layer records customers’ claims on commercial banks. The lower relationship deals with obligations between institutions.",
          "retry": "Return to the map and identify the actor and obligation named in the question."
        },
        {
          "id": "stage-1-class-3-explore-flow-match",
          "kind": "matching",
          "prompt": "Match the layers of a simplified transfer to the question each answers.",
          "rows": [
            {
              "id": "stage-1-class-3-layer-instruction",
              "label": "Customer instruction"
            },
            {
              "id": "stage-1-class-3-layer-deposit",
              "label": "Customer deposit"
            },
            {
              "id": "stage-1-class-3-layer-settlement",
              "label": "Bank settlement"
            }
          ],
          "options": [
            {
              "id": "stage-1-class-3-role-request",
              "label": "What transfer was requested?"
            },
            {
              "id": "stage-1-class-3-role-claim",
              "label": "What does the bank owe its customer?"
            },
            {
              "id": "stage-1-class-3-role-discharge",
              "label": "How are obligations between institutions discharged?"
            }
          ],
          "answers": {
            "stage-1-class-3-layer-instruction": "stage-1-class-3-role-request",
            "stage-1-class-3-layer-deposit": "stage-1-class-3-role-claim",
            "stage-1-class-3-layer-settlement": "stage-1-class-3-role-discharge"
          },
          "explanation": "A request, a customer claim and an interbank obligation describe different relationships even when the interface shows one action.",
          "retry": "Identify who owes whom at each layer before matching it."
        }
      ],
      "explanation": [
        "The upper layer records customers’ claims on commercial banks. The lower relationship deals with obligations between institutions.",
        "A service may hide these distinctions behind a quick confirmation. The model helps ask about finality without assuming a technical route."
      ],
      "takeaway": "Identify an obligation and its constraint before generalizing from the balance.",
      "demi": "Tell me who owes whom, then name a constraint."
    },
    {
      "sectionId": "stage-1-class-3-section-4",
      "hook": "Why would a lender turn down a profitable-looking project?",
      "scenario": "Place accounts, payments and credit around the commercial bank, then add the risks it must manage.",
      "visual": {
        "kind": "system",
        "nodes": [
          {
            "label": "Accounts",
            "detail": "Customers hold claims on the bank."
          },
          {
            "label": "Payments",
            "detail": "The bank helps customers transfer value."
          },
          {
            "label": "Credit",
            "detail": "The bank evaluates and funds loans."
          },
          {
            "label": "Risk management",
            "detail": "Losses, liquidity needs and regulation constrain operations."
          }
        ],
        "caption": "A simplified relationship map, not a technical specification for every payment."
      },
      "practice": [
        {
          "id": "stage-1-class-3-explore-4",
          "kind": "choice",
          "prompt": "Which missing fact is most relevant to evaluating an equipment loan?",
          "options": [
            {
              "id": "stage-1-class-3-explore-4-supported",
              "label": "The workshop’s capacity to repay under plausible conditions"
            },
            {
              "id": "stage-1-class-3-explore-4-unsupported",
              "label": "Whether the workshop uses the bank’s app every day"
            }
          ],
          "correct": "stage-1-class-3-explore-4-supported",
          "explanation": "The loan decision concerns ability to repay, the bank’s costs and the risks it must carry. Project appeal alone is insufficient.",
          "retry": "Return to the map and identify the actor and obligation named in the question."
        }
      ],
      "explanation": [
        "The loan decision concerns ability to repay, the bank’s costs and the risks it must carry. Project appeal alone is insufficient.",
        "Customer payment accounts and lending are connected services, but a customer need not borrow simply because the bank offers credit."
      ],
      "takeaway": "Identify an obligation and its constraint before generalizing from the balance.",
      "demi": "Tell me who owes whom, then name a constraint."
    },
    {
      "sectionId": "stage-1-class-3-section-5",
      "hook": "Does a public mandate make a central bank everyone’s bank?",
      "scenario": "Put the central bank behind the settlement layer and beside policy, then leave room for other public authorities.",
      "visual": {
        "kind": "system",
        "nodes": [
          {
            "label": "Public mandate",
            "detail": "Objectives and responsibilities are set legally."
          },
          {
            "label": "Monetary policy",
            "detail": "The central bank implements policy with its tools."
          },
          {
            "label": "Settlement support",
            "detail": "Eligible institutions may use central-bank accounts."
          },
          {
            "label": "Other authorities",
            "detail": "Supervisory and stability roles vary across jurisdictions."
          }
        ],
        "caption": "A simplified relationship map, not a technical specification for every payment."
      },
      "practice": [
        {
          "id": "stage-1-class-3-explore-5",
          "kind": "choice",
          "prompt": "Before assigning a supervisory task to an institution in a real country, what should you check?",
          "options": [
            {
              "id": "stage-1-class-3-explore-5-unsupported",
              "label": "Whether the institution’s name contains the word bank"
            },
            {
              "id": "stage-1-class-3-explore-5-supported",
              "label": "The jurisdiction’s actual legal responsibility"
            }
          ],
          "correct": "stage-1-class-3-explore-5-supported",
          "explanation": "Locate the public responsibilities beside the settlement system, not in the workshop’s retail-loan application.",
          "retry": "Return to the map and identify the actor and obligation named in the question."
        }
      ],
      "explanation": [
        "Locate the public responsibilities beside the settlement system, not in the workshop’s retail-loan application.",
        "The exact allocation is legal and institutional. A country may distribute supervision differently while retaining a central bank."
      ],
      "takeaway": "Identify an obligation and its constraint before generalizing from the balance.",
      "demi": "Tell me who owes whom, then name a constraint."
    },
    {
      "sectionId": "stage-1-class-3-section-6",
      "hook": "What obligation remains after the borrower spends the new deposit?",
      "scenario": "Add a loan asset and deposit liability together, then move the payment to another bank and inspect the remaining obligation.",
      "visual": {
        "kind": "system",
        "nodes": [
          {
            "label": "New loan",
            "detail": "A simplified 600-unit bank loan asset is recorded."
          },
          {
            "label": "New deposit",
            "detail": "The bank records a matching 600-unit customer liability."
          },
          {
            "label": "Spending elsewhere",
            "detail": "A transfer to another bank raises settlement needs."
          },
          {
            "label": "Constraints",
            "detail": "Capital, liquidity, risk, demand and policy conditions matter."
          }
        ],
        "caption": "A simplified relationship map, not a technical specification for every payment."
      },
      "practice": [
        {
          "id": "stage-1-class-3-explore-6",
          "kind": "choice",
          "prompt": "A borrower is creditworthy but the lender faces tight capital and liquidity constraints. What follows?",
          "options": [
            {
              "id": "stage-1-class-3-explore-6-supported",
              "label": "Those constraints can still limit the loan"
            },
            {
              "id": "stage-1-class-3-explore-6-unsupported",
              "label": "Creditworthiness alone removes every bank constraint"
            }
          ],
          "correct": "stage-1-class-3-explore-6-supported",
          "explanation": "Read both sides of the new loan entry, then follow the payment out of Cedar. Deposit creation alone does not supply unlimited interbank funding.",
          "retry": "Return to the map and identify the actor and obligation named in the question."
        }
      ],
      "explanation": [
        "Read both sides of the new loan entry, then follow the payment out of Cedar. Deposit creation alone does not supply unlimited interbank funding.",
        "The borrower also owes a debt. Capital absorbs losses while liquidity concerns meeting payments; neither is a synonym for unrestricted lending permission."
      ],
      "takeaway": "Identify an obligation and its constraint before generalizing from the balance.",
      "demi": "Tell me who owes whom, then name a constraint."
    },
    {
      "sectionId": "stage-1-class-3-section-7",
      "hook": "Can you tell the story without skipping a balance?",
      "scenario": "Use the complete map to tell a loan-and-payment story, then state what the diagram leaves out.",
      "visual": {
        "kind": "system",
        "nodes": [
          {
            "label": "Borrower",
            "detail": "Has a deposit and a debt, rather than free wealth."
          },
          {
            "label": "Commercial bank",
            "detail": "Carries lending and payment obligations."
          },
          {
            "label": "Settlement infrastructure",
            "detail": "Connects institutions under specified rules."
          },
          {
            "label": "Model boundary",
            "detail": "Exact routes and protections require system-specific detail."
          }
        ],
        "caption": "A simplified relationship map, not a technical specification for every payment."
      },
      "practice": [
        {
          "id": "stage-1-class-3-explore-7",
          "kind": "choice",
          "prompt": "Which question best tests a complete system explanation?",
          "options": [
            {
              "id": "stage-1-class-3-explore-7-unsupported",
              "label": "Which actor has the most attractive screen?"
            },
            {
              "id": "stage-1-class-3-explore-7-supported",
              "label": "Who owes whom at each step, and what condition constrains the next action?"
            }
          ],
          "correct": "stage-1-class-3-explore-7-supported",
          "explanation": "Start at the borrower, name the new debt and deposit, then trace the supplier payment and the bank relationship.",
          "retry": "Return to the map and identify the actor and obligation named in the question."
        }
      ],
      "explanation": [
        "Start at the borrower, name the new debt and deposit, then trace the supplier payment and the bank relationship.",
        "A complete explanation also stops at its boundary: actual routing, timing and protections require details outside this simplified map."
      ],
      "takeaway": "Identify an obligation and its constraint before generalizing from the balance.",
      "demi": "Tell me who owes whom, then name a constraint."
    }
  ]
};
