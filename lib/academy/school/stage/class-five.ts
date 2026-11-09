import 'server-only';
import type {StageClass} from './contracts';
/** Private immutable curriculum definition; project student transport explicitly. */
export const CLASS_FIVE:StageClass={
  "id": "stage-1-class-5",
  "version": "stage-1-class-5.1.0.0",
  "stageId": "stage-1",
  "number": 5,
  "title": "Why Financial Markets Exist",
  "description": "Begin with a participant need, follow funds and claims, then identify the risk that remains. Markets connect purposes without guaranteeing success.",
  "courseId": "hft-school-foundations",
  "lessonId": "hft-school-class-5",
  "prerequisites": [
    "stage-1-class-4"
  ],
  "liveMinutes": 60,
  "reviewMinutes": 30,
  "objectives": [
    {
      "id": "class-5-objective-1",
      "text": "Identify participants and the needs a market can connect.",
      "competency": "S1_C5_1"
    },
    {
      "id": "class-5-objective-2",
      "text": "Distinguish issuing claims from exchanging existing claims.",
      "competency": "S1_C5_2"
    },
    {
      "id": "class-5-objective-3",
      "text": "Explain ownership claims and their uncertainty.",
      "competency": "S1_C5_3"
    },
    {
      "id": "class-5-objective-4",
      "text": "Distinguish a debt claim from ownership and identify credit risk.",
      "competency": "S1_C5_4"
    },
    {
      "id": "class-5-objective-5",
      "text": "Explain a hedge as a response to a pre-existing exposure.",
      "competency": "S1_C5_5"
    },
    {
      "id": "class-5-objective-6",
      "text": "Build a participant-needs map with a realistic limitation.",
      "competency": "S1_C5_6"
    }
  ],
  "terms": [
    {
      "term": "Primary issuance",
      "definition": "Creation and sale of new financial claims to raise issuer funds."
    },
    {
      "term": "Secondary market",
      "definition": "Exchange of existing claims between holders."
    },
    {
      "term": "Equity",
      "definition": "An ownership interest with uncertain returns."
    },
    {
      "term": "Debt",
      "definition": "A contractual claim on repayment under specified terms."
    },
    {
      "term": "Liquidity",
      "definition": "Ability to transact on available terms without assuming a guaranteed exit price."
    },
    {
      "term": "Hedge",
      "definition": "An arrangement intended to offset an identified existing exposure."
    }
  ],
  "sections": [
    {
      "id": "class-5-section-1",
      "title": "Connect different needs",
      "objectiveId": "class-5-objective-1",
      "competency": "S1_C5_1",
      "paragraphs": [
        "Financial markets provide arrangements for exchanging financial claims. Participants arrive with different needs: raising funds, investing resources, obtaining liquidity or managing exposures. The same transaction can therefore serve different purposes on its two sides.",
        "A market needs rules and infrastructure as well as willing participants. Brokers, venues and settlement arrangements can help connect people and complete transfers. Their existence does not remove fraud, operational risk or the possibility of a poor price."
      ],
      "example": "Hypothetical: a community energy company seeks capital while a long-term fund seeks assets. A market may connect these needs, subject to terms and risk assessment.",
      "misconception": "Every participant is simply trying to guess tomorrow’s price.",
      "visual": "none",
      "activities": [
        {
          "id": "class-5-1-explore",
          "kind": "choice",
          "category": "APPLICATION",
          "sectionId": "class-5-section-1",
          "objectiveId": "class-5-objective-1",
          "competency": "S1_C5_1",
          "prompt": "A fund seeks long-term assets and a firm seeks capital. What purpose might connect them?",
          "options": [
            {
              "id": "class-5-1-explore-a",
              "label": "Financing in exchange for a financial claim."
            },
            {
              "id": "class-5-1-explore-b",
              "label": "Eliminating every participant’s risk."
            }
          ],
          "correct": "class-5-1-explore-a"
        }
      ]
    },
    {
      "id": "class-5-section-2",
      "title": "Finance productive activity",
      "objectiveId": "class-5-objective-2",
      "competency": "S1_C5_2",
      "paragraphs": [
        "A company can issue new shares or bonds to obtain funds for activity such as equipment or expansion. Investors receive a claim whose rights and risks depend on the instrument. Raising funds does not prove the project will be productive or profitable.",
        "When investors later trade an existing security with each other, the sale proceeds normally go to the selling holder, rather than directly financing the original issuer again. Secondary trading can still support financing indirectly by making claims easier to transfer and helping reveal valuations."
      ],
      "example": "Hypothetical: a workshop issues new shares to pay for a kiln. A later sale of those shares between two investors transfers ownership; it does not pay for a second kiln.",
      "misconception": "Every purchase of a share sends fresh funds to its company.",
      "visual": "none",
      "activities": [
        {
          "id": "class-5-2-explore",
          "kind": "choice",
          "category": "APPLICATION",
          "sectionId": "class-5-section-2",
          "objectiveId": "class-5-objective-2",
          "competency": "S1_C5_2",
          "prompt": "Which transaction directly raises new funds for a hypothetical issuer?",
          "options": [
            {
              "id": "class-5-2-explore-b",
              "label": "Two holders trading its existing bonds."
            },
            {
              "id": "class-5-2-explore-a",
              "label": "Investors buying its newly issued bonds."
            }
          ],
          "correct": "class-5-2-explore-a"
        }
      ]
    },
    {
      "id": "class-5-section-3",
      "title": "Ownership and investment",
      "objectiveId": "class-5-objective-3",
      "competency": "S1_C5_3",
      "paragraphs": [
        "A share represents an ownership interest in a company. Holders may benefit from distributions or a higher resale value, but neither is assured. Ownership exposes the investor to business performance and changing valuations, rather than creating a guaranteed savings balance.",
        "Ownership differs from a creditor’s contractual claim. In failure, shareholders generally stand behind creditors, with precise rights depending on law and the instrument. A recognizable business or useful product does not establish that its share is good value at every price."
      ],
      "example": "Hypothetical: a fund buys a stake in a bicycle manufacturer. Strong sales could help the business, but input costs, debt and the price paid for the stake still influence the investment outcome.",
      "misconception": "Owning a share guarantees a dividend and recovery of the purchase price.",
      "visual": "none",
      "activities": [
        {
          "id": "class-5-3-explore",
          "kind": "choice",
          "category": "APPLICATION",
          "sectionId": "class-5-section-3",
          "objectiveId": "class-5-objective-3",
          "competency": "S1_C5_3",
          "prompt": "A company cancels dividends after a difficult year. Which claim fits ordinary share ownership?",
          "options": [
            {
              "id": "class-5-3-explore-a",
              "label": "Distributions and resale value were uncertain."
            },
            {
              "id": "class-5-3-explore-b",
              "label": "The share must still pay a fixed coupon."
            }
          ],
          "correct": "class-5-3-explore-a"
        }
      ]
    },
    {
      "id": "class-5-section-4",
      "title": "Borrowing and lending",
      "objectiveId": "class-5-objective-4",
      "competency": "S1_C5_4",
      "paragraphs": [
        "A bond is a debt claim with specified terms, such as scheduled interest and repayment. Borrowers obtain financing; lenders accept an exposure to repayment and other risks. Contractual promises are different from certain outcomes: issuers can default.",
        "The price of a tradable bond may change before maturity as market rates, credit conditions and other expectations change. Holding a debt claim therefore does not mean its resale value is fixed. Instrument terms, currency and the issuer all matter."
      ],
      "example": "Hypothetical: a city issues debt for water infrastructure. A lender has a claim under the bond terms, not ownership of the city; repayment capacity and market conditions remain relevant.",
      "misconception": "A repayment promise removes the chance of loss.",
      "visual": "none",
      "activities": [
        {
          "id": "class-5-4-explore",
          "kind": "choice",
          "category": "APPLICATION",
          "sectionId": "class-5-section-4",
          "objectiveId": "class-5-objective-4",
          "competency": "S1_C5_4",
          "prompt": "A lender worries that an issuer may fail to repay. What risk is this?",
          "options": [
            {
              "id": "class-5-4-explore-b",
              "label": "Proof that the lender owns the issuer."
            },
            {
              "id": "class-5-4-explore-a",
              "label": "Credit risk."
            }
          ],
          "correct": "class-5-4-explore-a"
        }
      ]
    },
    {
      "id": "class-5-section-5",
      "title": "Transfer a risk, retain others",
      "objectiveId": "class-5-objective-5",
      "competency": "S1_C5_5",
      "paragraphs": [
        "A business may want a more predictable input cost rather than a bet on direction. Financial contracts can transfer aspects of price risk to another willing party. A hedge is understood by comparing the contract with the exposure it is meant to offset.",
        "A hedge can limit benefits from a favorable move and introduce costs or new risks. Quantity, timing or product differences may leave an imperfect offset; counterparty and operational risks can remain. Detailed derivative mechanics belong to later study."
      ],
      "example": "Hypothetical: a food producer worries about future grain costs and considers a contract tied to grain prices. The relevant question is whether that contract offsets its actual needs, not whether the contract wins in isolation.",
      "misconception": "Hedging makes every loss impossible.",
      "visual": "none",
      "activities": [
        {
          "id": "class-5-5-explore",
          "kind": "choice",
          "category": "APPLICATION",
          "sectionId": "class-5-section-5",
          "objectiveId": "class-5-objective-5",
          "competency": "S1_C5_5",
          "prompt": "An input buyer fixes a future purchase price and the spot price later falls. What is a reasonable interpretation?",
          "options": [
            {
              "id": "class-5-5-explore-a",
              "label": "The arrangement traded some favorable-price opportunity for predictability."
            },
            {
              "id": "class-5-5-explore-b",
              "label": "The hedge had no economic purpose because the contract looks unfavorable alone."
            }
          ],
          "correct": "class-5-5-explore-a"
        }
      ]
    },
    {
      "id": "class-5-section-6",
      "title": "One market, several purposes",
      "objectiveId": "class-5-objective-6",
      "competency": "S1_C5_6",
      "paragraphs": [
        "A participant-needs map starts with a named actor, a need, a claim or arrangement, and a risk retained. This keeps purpose separate from product names. One product can serve several purposes, and people using the same venue may have very different horizons.",
        "Liquidity is the ability to transact on available terms, not an unconditional right to exit at yesterday’s price. In stress, counterparties may demand a discount or be hard to find. A complete map asks what happens if funding, repayment or exit assumptions fail."
      ],
      "example": "Hypothetical: a new issuer raises funds, a long-term fund holds its claim, and an older holder sells to meet an expense. Financing, investment and liquidity are related but distinct needs.",
      "misconception": "A busy market promises every holder an immediate exit at the expected price.",
      "visual": "none",
      "activities": [
        {
          "id": "class-5-6-explore",
          "kind": "choice",
          "category": "APPLICATION",
          "sectionId": "class-5-section-6",
          "objectiveId": "class-5-objective-6",
          "competency": "S1_C5_6",
          "prompt": "A holder needs cash during market stress. Which map includes a limitation?",
          "options": [
            {
              "id": "class-5-6-explore-b",
              "label": "Seller → liquidity need → guaranteed sale at original cost."
            },
            {
              "id": "class-5-6-explore-a",
              "label": "Seller → liquidity need → sale of existing claim → uncertain exit price."
            }
          ],
          "correct": "class-5-6-explore-a"
        }
      ]
    }
  ],
  "assessment": [
    {
      "id": "class-5-1-check",
      "kind": "choice",
      "category": "APPLICATION",
      "sectionId": "class-5-section-1",
      "objectiveId": "class-5-objective-1",
      "competency": "S1_C5_1",
      "prompt": "A holder needs cash and a new investor wants an existing claim. What purpose can the exchange serve?",
      "options": [
        {
          "id": "class-5-1-check-a",
          "label": "Liquidity and transfer of ownership."
        },
        {
          "id": "class-5-1-check-b",
          "label": "A guaranteed new payment to the original issuer."
        }
      ],
      "correct": "class-5-1-check-a"
    },
    {
      "id": "class-5-2-check",
      "kind": "choice",
      "category": "APPLICATION",
      "sectionId": "class-5-section-2",
      "objectiveId": "class-5-objective-2",
      "competency": "S1_C5_2",
      "prompt": "A new investor buys an existing share from another holder. Who normally receives the sale money?",
      "options": [
        {
          "id": "class-5-2-check-b",
          "label": "The company automatically."
        },
        {
          "id": "class-5-2-check-a",
          "label": "The selling holder."
        }
      ],
      "correct": "class-5-2-check-a"
    },
    {
      "id": "class-5-3-check",
      "kind": "choice",
      "category": "APPLICATION",
      "sectionId": "class-5-section-3",
      "objectiveId": "class-5-objective-3",
      "competency": "S1_C5_3",
      "prompt": "A successful company’s shares were purchased at an extremely high valuation. What remains possible?",
      "options": [
        {
          "id": "class-5-3-check-a",
          "label": "The investor can lose despite a useful underlying business."
        },
        {
          "id": "class-5-3-check-b",
          "label": "Business success guarantees every buyer a profit."
        }
      ],
      "correct": "class-5-3-check-a"
    },
    {
      "id": "class-5-4-check",
      "kind": "choice",
      "category": "APPLICATION",
      "sectionId": "class-5-section-4",
      "objectiveId": "class-5-objective-4",
      "competency": "S1_C5_4",
      "prompt": "An investor must sell a bond before maturity. What cannot be assumed?",
      "options": [
        {
          "id": "class-5-4-check-b",
          "label": "That the bond has contractual terms."
        },
        {
          "id": "class-5-4-check-a",
          "label": "That the sale price equals the original purchase price."
        }
      ],
      "correct": "class-5-4-check-a"
    },
    {
      "id": "class-5-5-check",
      "kind": "choice",
      "category": "APPLICATION",
      "sectionId": "class-5-section-5",
      "objectiveId": "class-5-objective-5",
      "competency": "S1_C5_5",
      "prompt": "A hedge covers wheat but a firm actually needs a different grain at another date. What needs checking?",
      "options": [
        {
          "id": "class-5-5-check-a",
          "label": "Whether the mismatch leaves important exposure."
        },
        {
          "id": "class-5-5-check-b",
          "label": "Only whether both are called agricultural products."
        }
      ],
      "correct": "class-5-5-check-a"
    },
    {
      "id": "class-5-6-check",
      "kind": "choice",
      "category": "APPLICATION",
      "sectionId": "class-5-section-6",
      "objectiveId": "class-5-objective-6",
      "competency": "S1_C5_6",
      "prompt": "A manufacturer borrows and an investor buys its new debt. Which distinction belongs on the map?",
      "options": [
        {
          "id": "class-5-6-check-b",
          "label": "Both participants receive guaranteed profits."
        },
        {
          "id": "class-5-6-check-a",
          "label": "Funding for the issuer; repayment and credit exposure for the investor."
        }
      ],
      "correct": "class-5-6-check-a"
    },
    {
      "id": "class-5-reasoning",
      "kind": "written",
      "category": "REASONING",
      "sectionId": "class-5-section-6",
      "objectiveId": "class-5-objective-6",
      "competency": "S1_C5_6",
      "prompt": "Explain how a company, a debt investor and an existing holder can use the same market for different needs. Distinguish issuance from resale and identify two retained risks.",
      "rubric": "Explain financing, investing/lending and liquidity as distinct purposes; identify credit and exit-price risks without claiming all risks disappear."
    }
  ],
  "homework": [
    {
      "id": "class-5-1-homework-check",
      "kind": "choice",
      "category": "HOMEWORK",
      "sectionId": "class-5-section-2",
      "objectiveId": "class-5-objective-2",
      "competency": "S1_C5_2",
      "prompt": "A firm issues new debt and an old shareholder separately sells to another holder. Which distinction belongs in your map?",
      "options": [
        {
          "id": "class-5-1-homework-check-a",
          "label": "New debt funds the issuer; the existing-share sale normally funds the seller."
        },
        {
          "id": "class-5-1-homework-check-b",
          "label": "Both payments automatically go to the issuer."
        }
      ],
      "correct": "class-5-1-homework-check-a"
    },
    {
      "id": "class-5-homework-working",
      "kind": "written",
      "category": "HOMEWORK",
      "sectionId": "class-5-section-6",
      "objectiveId": "class-5-objective-6",
      "competency": "S1_C5_6",
      "prompt": "Build a participant-needs map for a solar-equipment firm seeking expansion funds, an investor considering its newly issued debt, and a holder seeking to sell an existing claim for cash. Show who exchanges funds or claims with whom. Explain two different purposes, distinguish new financing from secondary transfer, and identify credit risk plus an uncertain exit-price limitation.",
      "rubric": "Require three actor→need→arrangement→retained-risk paths; distinguish issuer funding from seller proceeds; explain creditor rather than ownership rights, default possibility and liquidity limitation. Accept different sound arrangements when explicitly qualified."
    },
    {
      "id": "class-5-homework-reflection",
      "kind": "reflection",
      "category": "HOMEWORK",
      "sectionId": "class-5-section-6",
      "objectiveId": "class-5-objective-6",
      "competency": "S1_C5_6",
      "prompt": "Which assumption in your explanation are you least certain about? Explain what you would check next and how a different answer could change your conclusion.",
      "rubric": "Review a specific uncertainty and a relevant next check. Honest uncertainty is not an error; return only if no meaningful connection to the task is supplied."
    }
  ],
  "remediation": [
    {
      "competency": "S1_C5_1",
      "sectionId": "class-5-section-1",
      "title": "Revisit: Connect different needs",
      "paragraph": "Identify participants and the needs a market can connect. Return to the example, name the assumption that changed, and explain the difference before trying this fresh situation.",
      "reinforcement": {
        "id": "class-5-1-reinforce",
        "kind": "choice",
        "category": "APPLICATION",
        "sectionId": "class-5-section-1",
        "objectiveId": "class-5-objective-1",
        "competency": "S1_C5_1",
        "prompt": "Why can both sides accept one financial transaction?",
        "options": [
          {
            "id": "class-5-1-reinforce-a",
            "label": "They can have different needs and exposures."
          },
          {
            "id": "class-5-1-reinforce-b",
            "label": "Both must expect exactly the same outcome."
          }
        ],
        "correct": "class-5-1-reinforce-a"
      }
    },
    {
      "competency": "S1_C5_2",
      "sectionId": "class-5-section-2",
      "title": "Revisit: Finance productive activity",
      "paragraph": "Distinguish issuing claims from exchanging existing claims. Return to the example, name the assumption that changed, and explain the difference before trying this fresh situation.",
      "reinforcement": {
        "id": "class-5-2-reinforce",
        "kind": "choice",
        "category": "APPLICATION",
        "sectionId": "class-5-section-2",
        "objectiveId": "class-5-objective-2",
        "competency": "S1_C5_2",
        "prompt": "A firm sells newly issued shares for equipment finance. How does this differ from a holder’s resale?",
        "options": [
          {
            "id": "class-5-2-reinforce-b",
            "label": "Both automatically finance new equipment."
          },
          {
            "id": "class-5-2-reinforce-a",
            "label": "The issue raises issuer funds; the resale normally pays the holder."
          }
        ],
        "correct": "class-5-2-reinforce-a"
      }
    },
    {
      "competency": "S1_C5_3",
      "sectionId": "class-5-section-3",
      "title": "Revisit: Ownership and investment",
      "paragraph": "Explain ownership claims and their uncertainty. Return to the example, name the assumption that changed, and explain the difference before trying this fresh situation.",
      "reinforcement": {
        "id": "class-5-3-reinforce",
        "kind": "choice",
        "category": "APPLICATION",
        "sectionId": "class-5-section-3",
        "objectiveId": "class-5-objective-3",
        "competency": "S1_C5_3",
        "prompt": "What distinguishes an ordinary ownership claim from a promised fixed repayment?",
        "options": [
          {
            "id": "class-5-3-reinforce-a",
            "label": "Ownership returns depend on business outcomes and valuation."
          },
          {
            "id": "class-5-3-reinforce-b",
            "label": "Ordinary shares guarantee the initial purchase sum."
          }
        ],
        "correct": "class-5-3-reinforce-a"
      }
    },
    {
      "competency": "S1_C5_4",
      "sectionId": "class-5-section-4",
      "title": "Revisit: Borrowing and lending",
      "paragraph": "Distinguish a debt claim from ownership and identify credit risk. Return to the example, name the assumption that changed, and explain the difference before trying this fresh situation.",
      "reinforcement": {
        "id": "class-5-4-reinforce",
        "kind": "choice",
        "category": "APPLICATION",
        "sectionId": "class-5-section-4",
        "objectiveId": "class-5-objective-4",
        "competency": "S1_C5_4",
        "prompt": "Why review the issuer before lending?",
        "options": [
          {
            "id": "class-5-4-reinforce-b",
            "label": "Every debt is government guaranteed."
          },
          {
            "id": "class-5-4-reinforce-a",
            "label": "Contractual repayment can fail."
          }
        ],
        "correct": "class-5-4-reinforce-a"
      }
    },
    {
      "competency": "S1_C5_5",
      "sectionId": "class-5-section-5",
      "title": "Revisit: Transfer a risk, retain others",
      "paragraph": "Explain a hedge as a response to a pre-existing exposure. Return to the example, name the assumption that changed, and explain the difference before trying this fresh situation.",
      "reinforcement": {
        "id": "class-5-5-reinforce",
        "kind": "choice",
        "category": "APPLICATION",
        "sectionId": "class-5-section-5",
        "objectiveId": "class-5-objective-5",
        "competency": "S1_C5_5",
        "prompt": "Why review a hedge alongside the underlying business exposure?",
        "options": [
          {
            "id": "class-5-5-reinforce-a",
            "label": "A contract loss can accompany an offsetting benefit elsewhere."
          },
          {
            "id": "class-5-5-reinforce-b",
            "label": "The contract result alone always measures success."
          }
        ],
        "correct": "class-5-5-reinforce-a"
      }
    },
    {
      "competency": "S1_C5_6",
      "sectionId": "class-5-section-6",
      "title": "Revisit: One market, several purposes",
      "paragraph": "Build a participant-needs map with a realistic limitation. Return to the example, name the assumption that changed, and explain the difference before trying this fresh situation.",
      "reinforcement": {
        "id": "class-5-6-reinforce",
        "kind": "choice",
        "category": "APPLICATION",
        "sectionId": "class-5-section-6",
        "objectiveId": "class-5-objective-6",
        "competency": "S1_C5_6",
        "prompt": "A thin market offers only a low sale price. Which assumption failed?",
        "options": [
          {
            "id": "class-5-6-reinforce-b",
            "label": "Every financial claim always has a fixed resale value."
          },
          {
            "id": "class-5-6-reinforce-a",
            "label": "An exit was possible only on less favorable terms."
          }
        ],
        "correct": "class-5-6-reinforce-a"
      }
    }
  ],
  "liveGuide": [
    {
      "title": "Connect different needs",
      "minutes": 10,
      "talkingPoints": [
        "Opening and prerequisite check: Retrieve nominal versus purchasing-power growth before asking why participants seek financial claims.",
        "Today’s purpose: Begin with a participant need, follow funds and claims, then identify the risk that remains. Markets connect purposes without guaranteeing success.",
        "Financial markets provide arrangements for exchanging financial claims. Participants arrive with different needs: raising funds, investing resources, obtaining liquidity or managing exposures. The same transaction can therefore serve different purposes on its two sides.",
        "Place company, investor and selling holder on the board. Give each a need card before allowing any product labels.",
        "Change the condition: the investor now needs cash rather than a new asset. Ask which relationship changes and why the company need may stay unchanged.",
        "Transition: follow funds to distinguish new financing from an existing claim’s transfer.",
        "Resolve this misconception with the demonstration: Every participant is simply trying to guess tomorrow’s price."
      ],
      "activity": {
        "kind": "SINGLE",
        "prompt": "A fund seeks long-term assets and a firm seeks capital. What purpose might connect them? Ask for the reason as well as the selection.",
        "sectionId": "class-5-section-1"
      }
    },
    {
      "title": "Finance productive activity",
      "minutes": 10,
      "talkingPoints": [
        "A company can issue new shares or bonds to obtain funds for activity such as equipment or expansion. Investors receive a claim whose rights and risks depend on the instrument. Raising funds does not prove the project will be productive or profitable.",
        "Draw investor → funds → workshop and workshop → new shares → investor. Add the kiln purchase only after locating issue proceeds.",
        "Draw a second investor paying the first holder for the existing shares. Change the buyer but keep the original issuer out of the funds arrow; ask why no second kiln is financed directly.",
        "Transition: inspect what rights the new share actually gives its holder.",
        "Resolve this misconception with the demonstration: Every purchase of a share sends fresh funds to its company."
      ],
      "activity": {
        "kind": "WRITTEN",
        "prompt": "Write a two-sentence explanation: Hypothetical: a workshop issues new shares to pay for a kiln. A later sale of those shares between two investors transfers ownership; it does not pay for a second kiln. Identify the governing distinction and one assumption that limits the conclusion.",
        "sectionId": "class-5-section-2"
      }
    },
    {
      "title": "Ownership and investment",
      "minutes": 10,
      "talkingPoints": [
        "A share represents an ownership interest in a company. Holders may benefit from distributions or a higher resale value, but neither is assured. Ownership exposes the investor to business performance and changing valuations, rather than creating a guaranteed savings balance.",
        "Show a bicycle firm’s sales, input costs and debt as separate influences. Place an ownership claim beside the business rather than a fixed repayment schedule.",
        "Change the condition: sales increase but the share was bought at an extremely high price. Ask why useful products and business growth do not guarantee this buyer a profit.",
        "Transition: compare uncertain ownership benefits with contractual debt promises.",
        "Resolve this misconception with the demonstration: Owning a share guarantees a dividend and recovery of the purchase price."
      ],
      "activity": {
        "kind": "POLL",
        "prompt": "A company cancels dividends after a difficult year. Which claim fits ordinary share ownership? Ask for the reason as well as the selection.",
        "sectionId": "class-5-section-3"
      }
    },
    {
      "title": "Borrowing and lending",
      "minutes": 10,
      "talkingPoints": [
        "A bond is a debt claim with specified terms, such as scheduled interest and repayment. Borrowers obtain financing; lenders accept an exposure to repayment and other risks. Contractual promises are different from certain outcomes: issuers can default.",
        "Draw city ← funds ← bond investor, then a separate arrow for scheduled repayment under the terms. Label the investor creditor, not city owner.",
        "Change the condition: the investor must sell early after market rates or credit expectations change. Ask why the original purchase price is not an assured exit value.",
        "Transition: financing is one market purpose; the next station starts with an existing business exposure.",
        "Resolve this misconception with the demonstration: A repayment promise removes the chance of loss."
      ],
      "activity": {
        "kind": "SINGLE",
        "prompt": "A lender worries that an issuer may fail to repay. What risk is this? Ask for the reason as well as the selection.",
        "sectionId": "class-5-section-4"
      }
    },
    {
      "title": "Transfer a risk, retain others",
      "minutes": 10,
      "talkingPoints": [
        "A business may want a more predictable input cost rather than a bet on direction. Financial contracts can transfer aspects of price risk to another willing party. A hedge is understood by comparing the contract with the exposure it is meant to offset.",
        "Place the producer’s future grain purchase beside its proposed price contract. Cover the contract result and ask what business risk existed before it.",
        "Reveal a lower spot price and ask learners to judge the combined position. Then change the quantity or delivery date to expose an imperfect offset.",
        "Transition: map the need, exchange and retained risk for several actors together.",
        "Resolve this misconception with the demonstration: Hedging makes every loss impossible."
      ],
      "activity": {
        "kind": "WRITTEN",
        "prompt": "Write a two-sentence explanation: Hypothetical: a food producer worries about future grain costs and considers a contract tied to grain prices. The relevant question is whether that contract offsets its actual needs, not whether the contract wins in isolation. Identify the governing distinction and one assumption that limits the conclusion.",
        "sectionId": "class-5-section-5"
      }
    },
    {
      "title": "One market, several purposes",
      "minutes": 10,
      "talkingPoints": [
        "A participant-needs map starts with a named actor, a need, a claim or arrangement, and a risk retained. This keeps purpose separate from product names. One product can serve several purposes, and people using the same venue may have very different horizons.",
        "Ask pairs to draw issuer → financing, investor → claim and holder → cash branches. Require a separate funds arrow and claim arrow for each relevant exchange.",
        "Change the condition: the holder can find buyers only at a discount during stress. Ask which need is urgent and which liquidity assumption failed.",
        "Recap how issuance, ownership, lending, hedging and exit differ; preview judging individual decisions through process and constraints.",
        "Resolve this misconception with the demonstration: A busy market promises every holder an immediate exit at the expected price."
      ],
      "activity": {
        "kind": "POLL",
        "prompt": "A holder needs cash during market stress. Which map includes a limitation? Ask for the reason as well as the selection.",
        "sectionId": "class-5-section-6"
      }
    }
  ],
  "studyGuide": {
    "summary": [
      "Start with an actor’s need rather than an instrument’s name: a firm may seek funding, an investor a claim, and an existing holder cash.",
      "New issuance can finance an issuer directly. A later transfer normally pays the selling holder; its contribution to financing is indirect.",
      "Ownership exposes a holder to business results and valuation. Debt creates contractual repayment rights that can still fail.",
      "A hedge must be compared with its underlying exposure. Liquidity, counterparty risk, costs and mismatches can remain even when one risk is reduced."
    ],
    "bigPicture": "Begin with a participant need, follow funds and claims, then identify the risk that remains. Markets connect purposes without guaranteeing success.",
    "fiveThings": [
      "A need and a product name are different things.",
      "Issue proceeds normally go to the issuer; resale proceeds to the selling holder.",
      "Ownership and debt confer different rights and exposures.",
      "A hedge addresses a prior risk and may leave mismatches.",
      "A liquid market does not promise a particular exit price."
    ],
    "outcomes": [
      "Identify participants and the needs a market can connect.",
      "Distinguish issuing claims from exchanging existing claims.",
      "Explain ownership claims and their uncertainty.",
      "Distinguish a debt claim from ownership and identify credit risk.",
      "Explain a hedge as a response to a pre-existing exposure.",
      "Build a participant-needs map with a realistic limitation."
    ],
    "examples": [
      "Hypothetical review map: a packaging firm issues new shares for machinery; an investor receives ownership. A year later the investor sells to another fund. The first payment supports the issuer; the second normally pays the selling holder.",
      "A hypothetical transport cooperative issues a bond for a depot. The investor is a creditor under the terms, rather than an owner of the cooperative; a promise to repay does not rule out default.",
      "A hypothetical bakery fixes a future flour price to stabilize input costs. Falling spot prices could make the contract look unfavorable in isolation, while predictability was the original purpose. Product or date mismatches still need examination."
    ],
    "misconceptions": [
      "Every participant is simply trying to guess tomorrow’s price.",
      "Every purchase of a share sends fresh funds to its company.",
      "Owning a share guarantees a dividend and recovery of the purchase price.",
      "A repayment promise removes the chance of loss.",
      "Hedging makes every loss impossible.",
      "A busy market promises every holder an immediate exit at the expected price."
    ],
    "review": [
      {
        "sectionId": "class-5-section-1",
        "label": "Connect different needs"
      },
      {
        "sectionId": "class-5-section-2",
        "label": "Finance productive activity"
      },
      {
        "sectionId": "class-5-section-3",
        "label": "Ownership and investment"
      },
      {
        "sectionId": "class-5-section-4",
        "label": "Borrowing and lending"
      },
      {
        "sectionId": "class-5-section-5",
        "label": "Transfer a risk, retain others"
      },
      {
        "sectionId": "class-5-section-6",
        "label": "One market, several purposes"
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
      "title": "SEC Investor.gov: Stocks",
      "url": "https://www.investor.gov/introduction-investing/investing-basics/investment-products/stocks"
    },
    {
      "title": "SEC Investor.gov: Bonds",
      "url": "https://www.investor.gov/introduction-investing/investing-basics/investment-products/bonds-or-fixed-income-products/bonds"
    },
    {
      "title": "CFTC: Basics of Futures Trading",
      "url": "https://www.cftc.gov/LearnAndProtect/AdvisoriesAndArticles/FuturesMarketBasics/index.htm"
    }
  ],
  "design": {
    "format": "Participant-purpose stations",
    "homeworkTitle": "Participant-needs map",
    "homeworkIntro": "Map needs before naming products; use fictional actors and include what can go wrong.",
    "reflectionItemId": "class-5-homework-reflection",
    "pacing": {
      "minimum": 50,
      "maximum": 75
    },
    "assessmentCoverage": [
      "S1_C5_1",
      "S1_C5_2",
      "S1_C5_3",
      "S1_C5_4",
      "S1_C5_5",
      "S1_C5_6"
    ],
    "practicalRequirement": "No chart or practical credit is required. Apply foundational reasoning through objective checks and individually reviewed written work.",
    "videoOpportunity": "Instructor may select an official market-purpose animation; pause to map who receives funds and who retains risk.",
    "studyGuideChecks": [
      "Draw two arrows for a new bond issue: where do the funds go, and where does the claim go? Then redraw them for a holder’s resale.",
      "Explain why a buyer of existing shares does not normally provide fresh company funds in that transaction.",
      "For a creditor and an owner of the same firm, name one difference in rights and one risk each retains.",
      "What would you compare before deciding whether a bakery’s flour contract is an effective hedge? Include quantity, date, product and the underlying need.",
      "A holder can sell only at a steep discount. Explain why the existence of a market did not guarantee the expected exit price."
    ],
    "studyGuideVisual": {
      "kind": "market",
      "nodes": [
        {
          "label": "Issuer → financing need",
          "detail": "New claims go to investors; issue proceeds go to the issuer."
        },
        {
          "label": "Investor → asset need",
          "detail": "Receives ownership or debt rights, with different risks."
        },
        {
          "label": "Holder → cash need",
          "detail": "Sells an existing claim to another holder on available terms."
        },
        {
          "label": "Business → risk-management need",
          "detail": "Seeks an offset to an existing exposure; checks residual risks."
        }
      ],
      "caption": "Participant-needs map: distinguish the actor, purpose, exchange and retained risk on every branch."
    }
  }
};
