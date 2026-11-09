import type {StageClass} from './contracts';

// Private academic definition: answer keys, review rubrics and authoring references.
export const CLASS_THREE: StageClass = {
  "id": "stage-1-class-3",
  "version": "stage-1-class-3.1.0.0",
  "stageId": "stage-1",
  "number": 3,
  "title": "Banks, Central Banks & the Money System",
  "description": "Trace customer claims, commercial-bank services, central-bank responsibilities and constrained deposit creation through a connected system.",
  "courseId": "hft-school-foundations",
  "lessonId": "hft-school-class-3",
  "prerequisites": [
    "stage-1-class-2"
  ],
  "liveMinutes": 60,
  "reviewMinutes": 30,
  "objectives": [
    {
      "id": "stage-1-class-3-objective-1",
      "text": "Identify the participants behind an account payment",
      "competency": "stage-1-class-3-competency-1"
    },
    {
      "id": "stage-1-class-3-objective-2",
      "text": "Explain the relationship between a customer balance and a bank obligation",
      "competency": "stage-1-class-3-competency-2"
    },
    {
      "id": "stage-1-class-3-objective-3",
      "text": "Trace a simplified cross-bank payment without conflating balances",
      "competency": "stage-1-class-3-competency-3"
    },
    {
      "id": "stage-1-class-3-objective-4",
      "text": "Relate deposit, payment and credit services to commercial banking",
      "competency": "stage-1-class-3-competency-4"
    },
    {
      "id": "stage-1-class-3-objective-5",
      "text": "Distinguish central-bank roles with jurisdiction qualifications",
      "competency": "stage-1-class-3-competency-5"
    },
    {
      "id": "stage-1-class-3-objective-6",
      "text": "Explain simplified deposit creation and the constraints on lending",
      "competency": "stage-1-class-3-competency-6"
    },
    {
      "id": "stage-1-class-3-objective-7",
      "text": "Synthesize customer money, bank services and public infrastructure",
      "competency": "stage-1-class-3-competency-7"
    }
  ],
  "terms": [
    {
      "term": "Deposit",
      "definition": "A customer’s monetary claim on a bank under account terms."
    },
    {
      "term": "Settlement",
      "definition": "Discharging payment obligations using an agreed asset and rules."
    },
    {
      "term": "Reserves",
      "definition": "Central-bank balances held by eligible institutions, used in the simplified interbank example."
    },
    {
      "term": "Capital",
      "definition": "Resources that absorb losses; distinct from funds immediately available for payments."
    },
    {
      "term": "Liquidity",
      "definition": "The capacity to meet payment obligations when due."
    },
    {
      "term": "Loan principal",
      "definition": "The borrowed amount outstanding, distinguished here from interest."
    }
  ],
  "sections": [
    {
      "id": "stage-1-class-3-section-1",
      "title": "From a screen to a system",
      "objectiveId": "stage-1-class-3-objective-1",
      "competency": "stage-1-class-3-competency-1",
      "paragraphs": [
        "A balance displayed in an app is an entry within an institution’s records. It becomes useful because an account holder can give an authorized payment instruction and other participants can process it. Looking only at the screen hides the bank, the recipient and the payment arrangements connecting them.",
        "Use a simple map: payer, payer’s bank, recipient’s bank and recipient. Other providers may carry messages or supply interfaces. A successful-looking instruction and completed settlement are conceptually different steps; exact timing and protections depend on the payment system and jurisdiction."
      ],
      "example": "In our hypothetical domestic payment, Noor tells Bank Cedar to pay 40 units to a repair shop using Bank Elm. The map must include both banks, not just the two apps.",
      "misconception": "The visible app alone holds and completes every part of a payment.",
      "visual": "none",
      "activities": [
        {
          "id": "stage-1-class-3-check-1",
          "kind": "choice",
          "category": "KNOWLEDGE",
          "sectionId": "stage-1-class-3-section-1",
          "objectiveId": "stage-1-class-3-objective-1",
          "competency": "stage-1-class-3-competency-1",
          "prompt": "Who belongs on the basic cross-bank payment map?",
          "correct": "stage-1-class-3-check-1-supported",
          "options": [
            {
              "id": "stage-1-class-3-check-1-unsupported",
              "label": "Only the payer’s phone"
            },
            {
              "id": "stage-1-class-3-check-1-supported",
              "label": "Payer, both banks and recipient"
            }
          ]
        }
      ]
    },
    {
      "id": "stage-1-class-3-section-2",
      "title": "Deposits are claims",
      "objectiveId": "stage-1-class-3-objective-2",
      "competency": "stage-1-class-3-competency-2",
      "paragraphs": [
        "A customer deposit is money the bank owes its customer under the account terms. On the customer’s side it is an asset; on the bank’s side it is a liability. A balance is not a label attached to particular notes permanently stored in a personal box.",
        "The distinction helps explain why a cash withdrawal changes the form in which a customer holds money. Deposits and physical currency are related but different claims and instruments. Deposit protection and account rules vary; this lesson does not promise that every account in every country has identical protection."
      ],
      "example": "A hypothetical customer withdraws 30 units from a 200-unit deposit. Ignoring fees, the deposit becomes 170 and cash held becomes 30. The customer did not gain 30 extra units simply by changing form.",
      "misconception": "A deposit balance means the bank keeps the customer’s identical notes untouched in a drawer.",
      "visual": "none",
      "activities": [
        {
          "id": "stage-1-class-3-check-2",
          "kind": "choice",
          "category": "KNOWLEDGE",
          "sectionId": "stage-1-class-3-section-2",
          "objectiveId": "stage-1-class-3-objective-2",
          "competency": "stage-1-class-3-competency-2",
          "prompt": "How should a customer deposit be described?",
          "correct": "stage-1-class-3-check-2-supported",
          "options": [
            {
              "id": "stage-1-class-3-check-2-supported",
              "label": "A claim on the bank and an obligation of the bank"
            },
            {
              "id": "stage-1-class-3-check-2-unsupported",
              "label": "A personal box of identical notes"
            }
          ]
        }
      ]
    },
    {
      "id": "stage-1-class-3-section-3",
      "title": "Messages, clearing and settlement",
      "objectiveId": "stage-1-class-3-objective-3",
      "competency": "stage-1-class-3-competency-3",
      "paragraphs": [
        "A payment instruction tells participants what transfer is requested. Clearing can organize and reconcile obligations; settlement discharges them using the agreed settlement asset. These are useful distinctions even when a service combines steps rapidly or its user sees only one confirmation.",
        "In a simplified domestic example, commercial banks settle obligations using balances held at the central bank, often called reserves. A customer deposit and a bank’s reserve balance are not the same account. Some arrangements net payments or use intermediaries, so the map is an explanation of relationships rather than a universal technical sequence."
      ],
      "example": "For a hypothetical 40-unit payment from Cedar to Elm, Noor’s deposit falls and the shop’s rises. Settlement between the banks is a separate relationship; Noor does not log into a reserve account.",
      "misconception": "A customer’s deposit and the bank’s central-bank settlement balance are interchangeable account names.",
      "visual": "none",
      "activities": [
        {
          "id": "stage-1-class-3-check-3",
          "kind": "choice",
          "category": "KNOWLEDGE",
          "sectionId": "stage-1-class-3-section-3",
          "objectiveId": "stage-1-class-3-objective-3",
          "competency": "stage-1-class-3-competency-3",
          "prompt": "Which relationship describes reserves in this model?",
          "correct": "stage-1-class-3-check-3-supported",
          "options": [
            {
              "id": "stage-1-class-3-check-3-unsupported",
              "label": "Every household’s ordinary shopping account"
            },
            {
              "id": "stage-1-class-3-check-3-supported",
              "label": "Balances banks use for settlement with one another"
            }
          ]
        }
      ]
    },
    {
      "id": "stage-1-class-3-section-4",
      "title": "What commercial banks do",
      "objectiveId": "stage-1-class-3-objective-4",
      "competency": "stage-1-class-3-competency-4",
      "paragraphs": [
        "Commercial banks commonly provide deposit accounts, payment services and loans. These functions connect saving, spending and borrowing, but the bank also manages risks and must meet its obligations. It earns income through arrangements such as interest and fees while incurring funding, operating and loss costs.",
        "A bank evaluates borrowers and manages liquidity and capital; it is not simply a passive vault passing one customer’s identical note to another. Nor does offering a loan make the bank a central bank. Distinguish the customer-facing services from public monetary-system responsibilities, while remembering that business models and permitted activities differ."
      ],
      "example": "A hypothetical small workshop applies to Cedar for equipment finance. Cedar evaluates repayment ability and loan terms; another customer may use Cedar solely for wages and payments.",
      "misconception": "A commercial bank’s only task is storing notes until the same notes are lent onward.",
      "visual": "none",
      "activities": [
        {
          "id": "stage-1-class-3-check-4",
          "kind": "choice",
          "category": "KNOWLEDGE",
          "sectionId": "stage-1-class-3-section-4",
          "objectiveId": "stage-1-class-3-objective-4",
          "competency": "stage-1-class-3-competency-4",
          "prompt": "Which activity fits a commercial bank in this lesson?",
          "correct": "stage-1-class-3-check-4-supported",
          "options": [
            {
              "id": "stage-1-class-3-check-4-supported",
              "label": "Assessing a workshop loan and providing payment accounts"
            },
            {
              "id": "stage-1-class-3-check-4-unsupported",
              "label": "Setting the national monetary-policy mandate"
            }
          ]
        }
      ]
    },
    {
      "id": "stage-1-class-3-section-5",
      "title": "What central banks do",
      "objectiveId": "stage-1-class-3-objective-5",
      "competency": "stage-1-class-3-competency-5",
      "paragraphs": [
        "A central bank has public monetary responsibilities defined by its legal mandate. These may include implementing monetary policy, supplying central-bank money and supporting payment-system functioning. Financial-stability and supervisory responsibilities differ across countries and may be shared with other authorities.",
        "Central banks are generally not ordinary retail banks offering the public a standard commercial checking account. Setting or implementing policy also differs from deciding every loan or every shop price. Policy affects financial conditions through a wider system; the institution’s exact tools and objectives require jurisdiction-specific study."
      ],
      "example": "In a simplified jurisdiction, the central bank operates settlement accounts for eligible banks and implements monetary policy. The workshop still applies to Cedar for its ordinary business loan.",
      "misconception": "The central bank supplies every household’s normal retail account and directly approves every business loan.",
      "visual": "none",
      "activities": [
        {
          "id": "stage-1-class-3-check-5",
          "kind": "choice",
          "category": "KNOWLEDGE",
          "sectionId": "stage-1-class-3-section-5",
          "objectiveId": "stage-1-class-3-objective-5",
          "competency": "stage-1-class-3-competency-5",
          "prompt": "Which description needs the fewest corrections?",
          "correct": "stage-1-class-3-check-5-supported",
          "options": [
            {
              "id": "stage-1-class-3-check-5-unsupported",
              "label": "Every central bank performs exactly the same retail services"
            },
            {
              "id": "stage-1-class-3-check-5-supported",
              "label": "A central bank has a public mandate; specific responsibilities differ by jurisdiction"
            }
          ]
        }
      ]
    },
    {
      "id": "stage-1-class-3-section-6",
      "title": "Lending creates a deposit, with limits",
      "objectiveId": "stage-1-class-3-objective-6",
      "competency": "stage-1-class-3-competency-6",
      "paragraphs": [
        "When a commercial bank makes a loan by crediting the borrower’s account, it records a loan asset and a matching deposit liability. The borrower gains a spendable balance and also owes a debt. This creates deposit money in the simplified example; it does not create free wealth for the borrower or remove the bank’s obligations.",
        "The bank cannot lend without limit. Creditworthy demand, profitability, capital requirements, liquidity needs, regulation and monetary conditions constrain lending. When the borrower pays someone at another bank, the lender must meet resulting settlement or funding needs. Repayment of loan principal reduces the loan and the associated deposit money; interest and other flows require separate analysis."
      ],
      "example": "Ignoring fees and interest, Cedar grants a 600-unit loan and credits 600 to the borrower’s deposit. If the borrower spends it at Elm, Cedar faces an interbank payment obligation. The accounting entry did not supply limitless settlement resources.",
      "misconception": "Creating a deposit lets a bank make unlimited risk-free loans or makes the borrower richer by the loan amount.",
      "visual": "none",
      "activities": [
        {
          "id": "stage-1-class-3-check-6",
          "kind": "choice",
          "category": "KNOWLEDGE",
          "sectionId": "stage-1-class-3-section-6",
          "objectiveId": "stage-1-class-3-objective-6",
          "competency": "stage-1-class-3-competency-6",
          "prompt": "Why is deposit creation constrained?",
          "correct": "stage-1-class-3-check-6-supported",
          "options": [
            {
              "id": "stage-1-class-3-check-6-supported",
              "label": "Banks must manage credit risk, capital, liquidity and settlement needs"
            },
            {
              "id": "stage-1-class-3-check-6-unsupported",
              "label": "Typing a balance eliminates all obligations"
            }
          ]
        }
      ]
    },
    {
      "id": "stage-1-class-3-section-7",
      "title": "Read the connected map",
      "objectiveId": "stage-1-class-3-objective-7",
      "competency": "stage-1-class-3-competency-7",
      "paragraphs": [
        "A useful money-system explanation connects three viewpoints: the customer’s claim, the commercial bank’s obligations and the infrastructure for payments and settlement. It also names a limit to the simplified model. This avoids both the vault-only story and the unlimited-money story.",
        "When evaluating a claim, identify the actor, action, balance affected and constraint. Ask whether it describes a customer instruction, commercial-bank credit or public policy. A disruption in one link can affect others, but a diagram alone does not predict a crisis or prove that every payment follows identical routing."
      ],
      "example": "A hypothetical equipment buyer borrows at Cedar and pays a supplier at Elm. Explain the new deposit, the debt, the payment instruction and the banks’ settlement relationship before claiming the system has created wealth.",
      "misconception": "One diagram explains all countries and proves that any new loan has no remaining risk.",
      "visual": "none",
      "activities": [
        {
          "id": "stage-1-class-3-check-7",
          "kind": "choice",
          "category": "KNOWLEDGE",
          "sectionId": "stage-1-class-3-section-7",
          "objectiveId": "stage-1-class-3-objective-7",
          "competency": "stage-1-class-3-competency-7",
          "prompt": "Which explanation is most complete?",
          "correct": "stage-1-class-3-check-7-supported",
          "options": [
            {
              "id": "stage-1-class-3-check-7-unsupported",
              "label": "Describe only the borrower’s larger app balance"
            },
            {
              "id": "stage-1-class-3-check-7-supported",
              "label": "Separate the loan, customer balances and settlement, and name a constraint"
            }
          ]
        }
      ]
    }
  ],
  "assessment": [
    {
      "id": "stage-1-class-3-assessment-1",
      "kind": "choice",
      "category": "APPLICATION",
      "sectionId": "stage-1-class-3-section-1",
      "objectiveId": "stage-1-class-3-objective-1",
      "competency": "stage-1-class-3-competency-1",
      "prompt": "A shop receives a payment notification. What question still matters?",
      "correct": "stage-1-class-3-assessment-1-supported",
      "options": [
        {
          "id": "stage-1-class-3-assessment-1-unsupported",
          "label": "Which phone color guarantees settlement?"
        },
        {
          "id": "stage-1-class-3-assessment-1-supported",
          "label": "What completion and settlement rules apply?"
        }
      ]
    },
    {
      "id": "stage-1-class-3-assessment-2",
      "kind": "choice",
      "category": "APPLICATION",
      "sectionId": "stage-1-class-3-section-2",
      "objectiveId": "stage-1-class-3-objective-2",
      "competency": "stage-1-class-3-competency-2",
      "prompt": "A customer moves 15 units from deposit into cash. What follows before fees?",
      "correct": "stage-1-class-3-assessment-2-supported",
      "options": [
        {
          "id": "stage-1-class-3-assessment-2-supported",
          "label": "The form changes without creating extra customer wealth"
        },
        {
          "id": "stage-1-class-3-assessment-2-unsupported",
          "label": "Total customer money necessarily increases by 15"
        }
      ]
    },
    {
      "id": "stage-1-class-3-assessment-3",
      "kind": "choice",
      "category": "APPLICATION",
      "sectionId": "stage-1-class-3-section-3",
      "objectiveId": "stage-1-class-3-objective-3",
      "competency": "stage-1-class-3-competency-3",
      "prompt": "Two banks offset many obligations before settling a net amount. What changed?",
      "correct": "stage-1-class-3-assessment-3-supported",
      "options": [
        {
          "id": "stage-1-class-3-assessment-3-unsupported",
          "label": "Customer deposits became household central-bank accounts"
        },
        {
          "id": "stage-1-class-3-assessment-3-supported",
          "label": "The settlement arrangement, not the need to discharge obligations"
        }
      ]
    },
    {
      "id": "stage-1-class-3-assessment-4",
      "kind": "choice",
      "category": "APPLICATION",
      "sectionId": "stage-1-class-3-section-4",
      "objectiveId": "stage-1-class-3-objective-4",
      "competency": "stage-1-class-3-competency-4",
      "prompt": "A lender rejects an unviable business plan. Which function is visible?",
      "correct": "stage-1-class-3-assessment-4-supported",
      "options": [
        {
          "id": "stage-1-class-3-assessment-4-supported",
          "label": "Credit-risk assessment"
        },
        {
          "id": "stage-1-class-3-assessment-4-unsupported",
          "label": "A guarantee that deposits never change"
        }
      ]
    },
    {
      "id": "stage-1-class-3-assessment-5",
      "kind": "choice",
      "category": "APPLICATION",
      "sectionId": "stage-1-class-3-section-5",
      "objectiveId": "stage-1-class-3-objective-5",
      "competency": "stage-1-class-3-competency-5",
      "prompt": "A country assigns bank supervision to a separate regulator. What should the system map do?",
      "correct": "stage-1-class-3-assessment-5-supported",
      "options": [
        {
          "id": "stage-1-class-3-assessment-5-unsupported",
          "label": "Delete supervision because the central bank does not perform it"
        },
        {
          "id": "stage-1-class-3-assessment-5-supported",
          "label": "Show the actual allocation rather than assume one universal central-bank role"
        }
      ]
    },
    {
      "id": "stage-1-class-3-assessment-6",
      "kind": "choice",
      "category": "APPLICATION",
      "sectionId": "stage-1-class-3-section-6",
      "objectiveId": "stage-1-class-3-objective-6",
      "competency": "stage-1-class-3-competency-6",
      "prompt": "A new loan is spent immediately at another bank. Which issue remains for the lender?",
      "correct": "stage-1-class-3-assessment-6-supported",
      "options": [
        {
          "id": "stage-1-class-3-assessment-6-supported",
          "label": "Meeting the resulting settlement and funding needs"
        },
        {
          "id": "stage-1-class-3-assessment-6-unsupported",
          "label": "Nothing, because creating a deposit also creates unlimited reserves"
        }
      ]
    },
    {
      "id": "stage-1-class-3-assessment-7",
      "kind": "choice",
      "category": "APPLICATION",
      "sectionId": "stage-1-class-3-section-7",
      "objectiveId": "stage-1-class-3-objective-7",
      "competency": "stage-1-class-3-competency-7",
      "prompt": "A payment delay occurs while both customer balances remain visible. What is the strongest next step?",
      "correct": "stage-1-class-3-assessment-7-supported",
      "options": [
        {
          "id": "stage-1-class-3-assessment-7-unsupported",
          "label": "Assume the delay proves unlimited bank lending"
        },
        {
          "id": "stage-1-class-3-assessment-7-supported",
          "label": "Identify the affected instruction, processing or settlement link before concluding why"
        }
      ]
    },
    {
      "id": "stage-1-class-3-assessment-explanation",
      "kind": "written",
      "category": "REASONING",
      "sectionId": "stage-1-class-3-section-7",
      "objectiveId": "stage-1-class-3-objective-7",
      "competency": "stage-1-class-3-competency-7",
      "prompt": "A borrower says “my bank created my loan deposit, so it can lend forever and I am wealthier by the full balance.” Explain the accounting and the constraints that this statement misses.",
      "rubric": "Individually review paired loan and deposit, borrower debt, and genuine credit/capital/liquidity or settlement constraints. Require causal reasoning, not a list of terms."
    }
  ],
  "homework": [
    {
      "id": "stage-1-class-3-homework-map",
      "kind": "matching",
      "category": "HOMEWORK",
      "sectionId": "stage-1-class-3-section-7",
      "objectiveId": "stage-1-class-3-objective-7",
      "competency": "stage-1-class-3-competency-7",
      "prompt": "Match each simplified payment role to its description. This is a domestic two-bank example, not a claim about every payment system.",
      "correct": {
        "stage-1-class-3-homework-row-0": "stage-1-class-3-homework-target-0",
        "stage-1-class-3-homework-row-1": "stage-1-class-3-homework-target-1",
        "stage-1-class-3-homework-row-2": "stage-1-class-3-homework-target-2"
      },
      "items": [
        {
          "id": "stage-1-class-3-homework-row-0",
          "label": "Noor"
        },
        {
          "id": "stage-1-class-3-homework-row-1",
          "label": "Bank Cedar"
        },
        {
          "id": "stage-1-class-3-homework-row-2",
          "label": "Central-bank settlement balances"
        }
      ],
      "targets": [
        {
          "id": "stage-1-class-3-homework-target-0",
          "label": "Customer who instructs payment"
        },
        {
          "id": "stage-1-class-3-homework-target-1",
          "label": "Commercial bank providing the payer account"
        },
        {
          "id": "stage-1-class-3-homework-target-2",
          "label": "One asset eligible banks may use to settle obligations"
        }
      ]
    },
    {
      "id": "stage-1-class-3-homework-reasoning",
      "kind": "written",
      "category": "HOMEWORK",
      "sectionId": "stage-1-class-3-section-7",
      "objectiveId": "stage-1-class-3-objective-7",
      "competency": "stage-1-class-3-competency-7",
      "prompt": "Using invented names and amounts only, trace a payment from a customer at one commercial bank to a supplier at another. Distinguish the instruction, customer deposit changes and settlement relationship. State one detail that would depend on the actual payment system.",
      "rubric": "Individually review the two customer roles, both banks, deposit direction and distinct settlement relationship. Require one explicit simplification. Return accounts that equate customer deposits with reserves or treat a notification as universal finality."
    },
    {
      "id": "stage-1-class-3-homework-comparison",
      "kind": "written",
      "category": "HOMEWORK",
      "sectionId": "stage-1-class-3-section-6",
      "objectiveId": "stage-1-class-3-objective-6",
      "competency": "stage-1-class-3-competency-6",
      "prompt": "A hypothetical bank grants a 900-unit loan by crediting a deposit. Explain the bank’s loan asset and deposit liability, the borrower’s debt, and what happens conceptually when the funds are paid to another bank. Name at least two constraints, including a settlement or liquidity constraint. Explain why money creation is not free wealth.",
      "rubric": "Review the stated difference and its consequence; require a supported comparison rather than a label. For banking, require the paired loan/deposit entries, borrower debt and two genuine constraints. No automatic pass for completion."
    },
    {
      "id": "stage-1-class-3-homework-reflection",
      "kind": "reflection",
      "category": "HOMEWORK",
      "sectionId": "stage-1-class-3-section-7",
      "objectiveId": "stage-1-class-3-objective-7",
      "competency": "stage-1-class-3-competency-7",
      "prompt": "Which actor or obligation was missing from your first mental picture of banking? Explain how adding it changes a question you would ask about a payment or loan.",
      "rubric": "Individually review a specific conceptual change and an intelligible remaining question. Uncertainty is acceptable; request clarification if no connection to the class is explained."
    }
  ],
  "remediation": [
    {
      "competency": "stage-1-class-3-competency-1",
      "sectionId": "stage-1-class-3-section-1",
      "title": "Revisit: From a screen to a system",
      "paragraph": "Return to the worked example. Use a simple map: payer, payer’s bank, recipient’s bank and recipient. Other providers may carry messages or supply interfaces. A successful-looking instruction and completed settlement are conceptually different steps; exact timing and protections depend on the payment system and jurisdiction. Explain which actor or condition the mistaken claim overlooked before trying this new check.",
      "reinforcement": {
        "id": "stage-1-class-3-reinforcement-1",
        "kind": "choice",
        "category": "KNOWLEDGE",
        "sectionId": "stage-1-class-3-section-1",
        "objectiveId": "stage-1-class-3-objective-1",
        "competency": "stage-1-class-3-competency-1",
        "prompt": "A sketch links a buyer’s app directly to a shop’s app across two banks. What important relationship should be restored?",
        "correct": "stage-1-class-3-reinforcement-1-a",
        "options": [
          {
            "id": "stage-1-class-3-reinforcement-1-b",
            "label": "Only the brands of both handsets"
          },
          {
            "id": "stage-1-class-3-reinforcement-1-a",
            "label": "The account institutions and the arrangements that process the payment"
          },
          {
            "id": "stage-1-class-3-reinforcement-1-c",
            "label": "An assumption that a visible instruction proves final settlement"
          }
        ]
      }
    },
    {
      "competency": "stage-1-class-3-competency-2",
      "sectionId": "stage-1-class-3-section-2",
      "title": "Revisit: Deposits are claims",
      "paragraph": "Return to the worked example. The distinction helps explain why a cash withdrawal changes the form in which a customer holds money. Deposits and physical currency are related but different claims and instruments. Deposit protection and account rules vary; this lesson does not promise that every account in every country has identical protection. Explain which actor or condition the mistaken claim overlooked before trying this new check.",
      "reinforcement": {
        "id": "stage-1-class-3-reinforcement-2",
        "kind": "choice",
        "category": "KNOWLEDGE",
        "sectionId": "stage-1-class-3-section-2",
        "objectiveId": "stage-1-class-3-objective-2",
        "competency": "stage-1-class-3-competency-2",
        "prompt": "A 90-unit deposit becomes 70 after a 20-unit cash withdrawal, before fees. How should the change be read?",
        "correct": "stage-1-class-3-reinforcement-2-a",
        "options": [
          {
            "id": "stage-1-class-3-reinforcement-2-b",
            "label": "The bank has given the customer 20 units of additional wealth"
          },
          {
            "id": "stage-1-class-3-reinforcement-2-c",
            "label": "The remaining deposit must identify particular notes in a private box"
          },
          {
            "id": "stage-1-class-3-reinforcement-2-a",
            "label": "The customer now holds the same total in deposit and cash forms"
          }
        ]
      }
    },
    {
      "competency": "stage-1-class-3-competency-3",
      "sectionId": "stage-1-class-3-section-3",
      "title": "Revisit: Messages, clearing and settlement",
      "paragraph": "Return to the worked example. In a simplified domestic example, commercial banks settle obligations using balances held at the central bank, often called reserves. A customer deposit and a bank’s reserve balance are not the same account. Some arrangements net payments or use intermediaries, so the map is an explanation of relationships rather than a universal technical sequence. Explain which actor or condition the mistaken claim overlooked before trying this new check.",
      "reinforcement": {
        "id": "stage-1-class-3-reinforcement-3",
        "kind": "choice",
        "category": "KNOWLEDGE",
        "sectionId": "stage-1-class-3-section-3",
        "objectiveId": "stage-1-class-3-objective-3",
        "competency": "stage-1-class-3-competency-3",
        "prompt": "Banks reconcile opposing payments and settle an agreed net amount. Which distinction matters?",
        "correct": "stage-1-class-3-reinforcement-3-a",
        "options": [
          {
            "id": "stage-1-class-3-reinforcement-3-a",
            "label": "Customer transfer records and interbank discharge are related but separate layers"
          },
          {
            "id": "stage-1-class-3-reinforcement-3-b",
            "label": "Netting means the customer claims were reserve accounts all along"
          },
          {
            "id": "stage-1-class-3-reinforcement-3-c",
            "label": "Only the app message matters to completion"
          }
        ]
      }
    },
    {
      "competency": "stage-1-class-3-competency-4",
      "sectionId": "stage-1-class-3-section-4",
      "title": "Revisit: What commercial banks do",
      "paragraph": "Return to the worked example. A bank evaluates borrowers and manages liquidity and capital; it is not simply a passive vault passing one customer’s identical note to another. Nor does offering a loan make the bank a central bank. Distinguish the customer-facing services from public monetary-system responsibilities, while remembering that business models and permitted activities differ. Explain which actor or condition the mistaken claim overlooked before trying this new check.",
      "reinforcement": {
        "id": "stage-1-class-3-reinforcement-4",
        "kind": "choice",
        "category": "KNOWLEDGE",
        "sectionId": "stage-1-class-3-section-4",
        "objectiveId": "stage-1-class-3-objective-4",
        "competency": "stage-1-class-3-competency-4",
        "prompt": "A shop uses payroll payments but has no loan. Which interpretation fits?",
        "correct": "stage-1-class-3-reinforcement-4-a",
        "options": [
          {
            "id": "stage-1-class-3-reinforcement-4-b",
            "label": "Every payment customer must borrow to hold an account"
          },
          {
            "id": "stage-1-class-3-reinforcement-4-c",
            "label": "Payroll processing sets the national policy mandate"
          },
          {
            "id": "stage-1-class-3-reinforcement-4-a",
            "label": "Commercial-bank services include functions that customers can use separately"
          }
        ]
      }
    },
    {
      "competency": "stage-1-class-3-competency-5",
      "sectionId": "stage-1-class-3-section-5",
      "title": "Revisit: What central banks do",
      "paragraph": "Return to the worked example. Central banks are generally not ordinary retail banks offering the public a standard commercial checking account. Setting or implementing policy also differs from deciding every loan or every shop price. Policy affects financial conditions through a wider system; the institution’s exact tools and objectives require jurisdiction-specific study. Explain which actor or condition the mistaken claim overlooked before trying this new check.",
      "reinforcement": {
        "id": "stage-1-class-3-reinforcement-5",
        "kind": "choice",
        "category": "KNOWLEDGE",
        "sectionId": "stage-1-class-3-section-5",
        "objectiveId": "stage-1-class-3-objective-5",
        "competency": "stage-1-class-3-competency-5",
        "prompt": "A country gives prudential supervision to a separate agency. What is the appropriate conclusion?",
        "correct": "stage-1-class-3-reinforcement-5-a",
        "options": [
          {
            "id": "stage-1-class-3-reinforcement-5-b",
            "label": "The country cannot have monetary policy"
          },
          {
            "id": "stage-1-class-3-reinforcement-5-c",
            "label": "Its central bank must supply every retail loan"
          },
          {
            "id": "stage-1-class-3-reinforcement-5-a",
            "label": "Identify the actual division of public responsibilities in that jurisdiction"
          }
        ]
      }
    },
    {
      "competency": "stage-1-class-3-competency-6",
      "sectionId": "stage-1-class-3-section-6",
      "title": "Revisit: Lending creates a deposit, with limits",
      "paragraph": "Return to the worked example. The bank cannot lend without limit. Creditworthy demand, profitability, capital requirements, liquidity needs, regulation and monetary conditions constrain lending. When the borrower pays someone at another bank, the lender must meet resulting settlement or funding needs. Repayment of loan principal reduces the loan and the associated deposit money; interest and other flows require separate analysis. Explain which actor or condition the mistaken claim overlooked before trying this new check.",
      "reinforcement": {
        "id": "stage-1-class-3-reinforcement-6",
        "kind": "choice",
        "category": "KNOWLEDGE",
        "sectionId": "stage-1-class-3-section-6",
        "objectiveId": "stage-1-class-3-objective-6",
        "competency": "stage-1-class-3-competency-6",
        "prompt": "A lender credits a 450-unit loan deposit, and the borrower pays a different bank’s customer. What remains relevant?",
        "correct": "stage-1-class-3-reinforcement-6-a",
        "options": [
          {
            "id": "stage-1-class-3-reinforcement-6-a",
            "label": "The borrower owes a debt and the lender must meet payment, risk and resource constraints"
          },
          {
            "id": "stage-1-class-3-reinforcement-6-b",
            "label": "The lender has automatically created unlimited settlement resources"
          },
          {
            "id": "stage-1-class-3-reinforcement-6-c",
            "label": "The borrower has gained 450 units of debt-free wealth"
          }
        ]
      }
    },
    {
      "competency": "stage-1-class-3-competency-7",
      "sectionId": "stage-1-class-3-section-7",
      "title": "Revisit: Read the connected map",
      "paragraph": "Return to the worked example. When evaluating a claim, identify the actor, action, balance affected and constraint. Ask whether it describes a customer instruction, commercial-bank credit or public policy. A disruption in one link can affect others, but a diagram alone does not predict a crisis or prove that every payment follows identical routing. Explain which actor or condition the mistaken claim overlooked before trying this new check.",
      "reinforcement": {
        "id": "stage-1-class-3-reinforcement-7",
        "kind": "choice",
        "category": "KNOWLEDGE",
        "sectionId": "stage-1-class-3-section-7",
        "objectiveId": "stage-1-class-3-objective-7",
        "competency": "stage-1-class-3-competency-7",
        "prompt": "A transfer is delayed and the customer asks why. What should a system explanation do first?",
        "correct": "stage-1-class-3-reinforcement-7-a",
        "options": [
          {
            "id": "stage-1-class-3-reinforcement-7-b",
            "label": "Conclude from the app alone that every bank is insolvent"
          },
          {
            "id": "stage-1-class-3-reinforcement-7-a",
            "label": "Locate the affected processing relationship and seek system-specific evidence"
          },
          {
            "id": "stage-1-class-3-reinforcement-7-c",
            "label": "Assume every jurisdiction uses one identical route"
          }
        ]
      }
    }
  ],
  "liveGuide": [
    {
      "title": "From a screen to a system",
      "minutes": 6,
      "talkingPoints": [
        "Prerequisite and objective: Identify the participants behind an account payment.",
        "Start with Noor and the repair shop, then ask students to insert Cedar and Elm before drawing a payment arrow. Label the phone as interface.",
        "Replace the shop’s bank with Cedar. Ask which two-bank relationship the original map no longer needs to illustrate.",
        "Discuss this specific misconception: The visible app alone holds and completes every part of a payment.",
        "Move from the map’s actors to the meaning of each account balance."
      ],
      "activity": {
        "kind": "POLL",
        "prompt": "Which actor disappears from the simplified map if both customers use Cedar, and which customer obligations remain?",
        "sectionId": "stage-1-class-3-section-1"
      }
    },
    {
      "title": "Deposits are claims",
      "minutes": 7,
      "talkingPoints": [
        "Prerequisite and objective: Explain the relationship between a customer balance and a bank obligation.",
        "Write 200 on the customer side as an asset and on the bank side as a liability. Have two students speak the same relationship from opposing viewpoints.",
        "Withdraw 30 in cash and count deposit plus cash. Then introduce a hypothetical 2-unit fee separately to expose the original no-fee assumption.",
        "Discuss this specific misconception: A deposit balance means the bank keeps the customer’s identical notes untouched in a drawer.",
        "Customer claims are only one layer; next trace obligations between institutions."
      ],
      "activity": {
        "kind": "SINGLE",
        "prompt": "Before fees, does a 30-unit withdrawal increase total holdings? Explain the two resulting amounts.",
        "sectionId": "stage-1-class-3-section-2"
      }
    },
    {
      "title": "Messages, clearing and settlement",
      "minutes": 10,
      "talkingPoints": [
        "Prerequisite and objective: Trace a simplified cross-bank payment without conflating balances.",
        "Draw customer deposits above an interbank settlement layer. Trace a 40-unit payment without letting the customer arrow enter a reserve account.",
        "Add a reverse 25-unit payment. Compare gross instructions with a hypothetical net 15-unit settlement, explicitly conditional on netting rules.",
        "Discuss this specific misconception: A customer’s deposit and the bank’s central-bank settlement balance are interchangeable account names.",
        "Payment handling is one commercial-bank service; add the credit function next."
      ],
      "activity": {
        "kind": "WRITTEN",
        "prompt": "Explain why two customer payments and one possible net settlement are not contradictory. Name the assumed settlement arrangement.",
        "sectionId": "stage-1-class-3-section-3"
      }
    },
    {
      "title": "What commercial banks do",
      "minutes": 8,
      "talkingPoints": [
        "Prerequisite and objective: Relate deposit, payment and credit services to commercial banking.",
        "Place accounts, payments and equipment lending around Cedar. Ask which service a wage customer uses without taking a loan.",
        "Give the workshop an attractive product but unreliable repayment cash flow. Ask why project appeal and credit approval can diverge.",
        "Discuss this specific misconception: A commercial bank’s only task is storing notes until the same notes are lent onward.",
        "Distinguish these business services from a public monetary mandate."
      ],
      "activity": {
        "kind": "POLL",
        "prompt": "What additional evidence should a bank seek before approving the equipment loan? Connect it to repayment risk.",
        "sectionId": "stage-1-class-3-section-4"
      }
    },
    {
      "title": "What central banks do",
      "minutes": 8,
      "talkingPoints": [
        "Prerequisite and objective: Distinguish central-bank roles with jurisdiction qualifications.",
        "Place monetary policy and settlement support beside a central-bank box. Put supervision on a movable card because its legal allocation varies.",
        "Move supervision to a separate regulator in the hypothetical jurisdiction. Keep the central bank’s stated policy mandate unchanged.",
        "Discuss this specific misconception: The central bank supplies every household’s normal retail account and directly approves every business loan.",
        "Now return to Cedar and inspect a new loan as a paired accounting relationship."
      ],
      "activity": {
        "kind": "SINGLE",
        "prompt": "Can this jurisdiction still have a central bank? Explain why institutional roles must be checked rather than copied across countries.",
        "sectionId": "stage-1-class-3-section-5"
      }
    },
    {
      "title": "Lending creates a deposit, with limits",
      "minutes": 12,
      "talkingPoints": [
        "Prerequisite and objective: Explain simplified deposit creation and the constraints on lending.",
        "Write loan asset +600 and deposit liability +600 for Cedar; give the borrower both a deposit and a debt. Then direct the purchase to Elm.",
        "Keep borrower creditworthiness unchanged but tighten Cedar’s liquidity and capital capacity. Ask why the initial accounting entry does not authorize unlimited further loans.",
        "Discuss this specific misconception: Creating a deposit lets a bank make unlimited risk-free loans or makes the borrower richer by the loan amount.",
        "Join the entries and payment layers into one final explanation."
      ],
      "activity": {
        "kind": "WRITTEN",
        "prompt": "Explain one lending constraint and the payment obligation after the borrower spends at Elm. Distinguish capital from liquidity.",
        "sectionId": "stage-1-class-3-section-6"
      }
    },
    {
      "title": "Read the connected map",
      "minutes": 9,
      "talkingPoints": [
        "Prerequisite and objective: Synthesize customer money, bank services and public infrastructure.",
        "Ask a student to narrate a new 350-unit loan-and-payment story while classmates mark each actor, asset and obligation. Stop at any missing relationship.",
        "The app shows a pending transfer. Ask what additional system information would be needed before concluding that settlement has completed or diagnosing the delay.",
        "Discuss this specific misconception: One diagram explains all countries and proves that any new loan has no remaining risk.",
        "Recap claims, services, public roles and constraints; preview purchasing power and interest."
      ],
      "activity": {
        "kind": "WRITTEN",
        "prompt": "Give a four-step system explanation and one explicit limit of the model. Do not infer free wealth from the borrower’s displayed deposit.",
        "sectionId": "stage-1-class-3-section-7"
      }
    }
  ],
  "studyGuide": {
    "summary": [
      "A customer sees a claim and a payment interface; banks and payment arrangements sit behind that experience.",
      "Lending can create a bank deposit while also creating a debt. The paired entries and subsequent payment obligations prevent a free-wealth interpretation.",
      "Public mandates, settlement arrangements and protection rules must be located in a jurisdiction rather than assumed worldwide."
    ],
    "bigPicture": "To explain the system, keep the customer layer, commercial-bank balance sheet and interbank settlement relationship distinct, then connect them.",
    "fiveThings": [
      "A deposit is an asset for the customer and a liability for the bank.",
      "An instruction requests a transfer; settlement discharges an obligation under specified rules.",
      "Commercial banks provide customer accounts, payments and credit services.",
      "Central banks have public mandates; responsibility for supervision varies.",
      "Capital, liquidity, risk and creditworthy demand constrain lending."
    ],
    "outcomes": [
      "Narrate a payment using actors, claims and obligations.",
      "Explain why a credited loan balance is neither debt-free wealth nor unlimited lending authority."
    ],
    "examples": [
      "A hypothetical 80-unit payment between two banks changes customer claims and creates obligations within a payment arrangement. The exact settlement route needs further system detail.",
      "A hypothetical 500-unit loan creates a bank loan asset and deposit liability. Payment to another bank still requires the lender to meet its resulting obligations."
    ],
    "misconceptions": [
      "Do not place household shopping balances in the bank’s reserve account.",
      "Do not treat a bank as merely a vault forwarding identical notes.",
      "Do not equate loss-absorbing capital with liquidity available to meet payments.",
      "Do not assign every public task to every central bank."
    ],
    "review": [
      {
        "sectionId": "stage-1-class-3-section-1",
        "label": "Name the actors"
      },
      {
        "sectionId": "stage-1-class-3-section-2",
        "label": "Read the claim from both sides"
      },
      {
        "sectionId": "stage-1-class-3-section-3",
        "label": "Separate the payment layers"
      },
      {
        "sectionId": "stage-1-class-3-section-4",
        "label": "Locate customer-facing services"
      },
      {
        "sectionId": "stage-1-class-3-section-5",
        "label": "Check the public mandate"
      },
      {
        "sectionId": "stage-1-class-3-section-6",
        "label": "Pair loan entries with constraints"
      },
      {
        "sectionId": "stage-1-class-3-section-7",
        "label": "Narrate and qualify the map"
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
      "title": "Bank of England: Money creation in the modern economy (2014)",
      "url": "https://www.bankofengland.co.uk/quarterly-bulletin/2014/q1/money-creation-in-the-modern-economy"
    },
    {
      "title": "Bank of England: How is money created?",
      "url": "https://www.bankofengland.co.uk/explainers/how-is-money-created"
    },
    {
      "title": "European Central Bank: What is money?",
      "url": "https://www.ecb.europa.eu/ecb-and-you/explainers/tell-me-more/html/what_is_money.en.html"
    },
    {
      "title": "Bank of England: How do card payments work?",
      "url": "https://www.bankofengland.co.uk/explainers/how-do-card-payments-work"
    },
    {
      "title": "Bank of England: What does the Bank of England do? (updated 12 March 2026)",
      "url": "https://www.bankofengland.co.uk/about"
    }
  ],
  "design": {
    "format": "Connected system map with actor, claim and settlement tracing",
    "homeworkTitle": "Trace the money-system relationships",
    "homeworkIntro": "Map a hypothetical payment and explain constrained lending. Use invented accounts and amounts; explain relationships rather than providing personal bank information.",
    "reflectionItemId": "stage-1-class-3-homework-reflection",
    "pacing": {
      "minimum": 50,
      "maximum": 75
    },
    "assessmentCoverage": [
      "stage-1-class-3-competency-1",
      "stage-1-class-3-competency-2",
      "stage-1-class-3-competency-3",
      "stage-1-class-3-competency-4",
      "stage-1-class-3-competency-5",
      "stage-1-class-3-competency-6",
      "stage-1-class-3-competency-7"
    ],
    "practicalRequirement": "No chart or trade execution requirement. Foundational explanations and comparisons are individually reviewed; no practical credit is implied.",
    "videoOpportunity": "Instructor may select an official central-bank payment or deposit-creation explanation; pause to distinguish customer deposits from interbank balances.",
    "studyGuideVisual": {
      "kind": "system",
      "nodes": [
        {
          "label": "Customer layer",
          "detail": "Payer and recipient hold claims on their commercial banks."
        },
        {
          "label": "Commercial-bank layer",
          "detail": "Banks process instructions, hold loan assets and owe deposits."
        },
        {
          "label": "Settlement relationship",
          "detail": "Institutions discharge obligations using agreed assets and rules."
        },
        {
          "label": "Public mandate and constraints",
          "detail": "Policy, legal responsibilities, capital, liquidity and credit risk shape the system."
        }
      ],
      "caption": "Read vertically to distinguish layers, then trace a payment across them; this is a relationship aid rather than a universal routing diagram."
    },
    "studyGuideChecks": [
      "A 120-unit deposit becomes 100 after a 20-unit cash withdrawal. Before fees, where are the 120 units now?",
      "Why could two opposing customer payments produce a different net interbank settlement amount? State the assumed netting arrangement.",
      "For a new 500-unit loan, identify the bank asset, bank liability and borrower debt. What changes when the borrower pays another bank’s customer?",
      "Give one capital constraint and one liquidity concern without treating them as identical.",
      "Which legal or payment-system detail would you need before extending this model to a real jurisdiction?"
    ]
  }
};
