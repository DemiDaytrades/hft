import type {StageExperience} from './contracts';
/** Public teaching scenes: no private grading or instructor-bank imports. */
export const EXPERIENCE_FIVE:StageExperience={
  "classId": "stage-1-class-5",
  "academicVersion": "stage-1-class-5.1.0.0",
  "revision": "class-5-experience-1",
  "format": "market",
  "sections": [
    {
      "sectionId": "class-5-section-1",
      "hook": "Who needs funds, who wants a claim, and who needs an exit?",
      "scenario": "Hypothetical: a community energy company seeks capital while a long-term fund seeks assets. A market may connect these needs, subject to terms and risk assessment.",
      "visual": {
        "kind": "market",
        "nodes": [
          {
            "label": "Company",
            "detail": "Needs funds; offers a financial claim."
          },
          {
            "label": "Investor",
            "detail": "Provides resources; takes an uncertain exposure."
          },
          {
            "label": "Market arrangements",
            "detail": "Connect participants and support transfers under rules."
          }
        ],
        "caption": "Follow participant → need → exchange → retained risk. The arrows describe purpose, not guaranteed results."
      },
      "practice": [
        {
          "id": "class-5-roles-match",
          "kind": "matching",
          "prompt": "Match each stated need to the participant seeking it in this hypothetical funding connection.",
          "options": [
            {
              "id": "class-5-role-firm",
              "label": "Company seeking expansion capital"
            },
            {
              "id": "class-5-role-fund",
              "label": "Fund seeking long-term assets"
            },
            {
              "id": "class-5-role-seller",
              "label": "Existing holder meeting an expense"
            }
          ],
          "rows": [
            {
              "id": "class-5-need-funds",
              "label": "Raise new financing"
            },
            {
              "id": "class-5-need-assets",
              "label": "Acquire a financial claim"
            },
            {
              "id": "class-5-need-cash",
              "label": "Sell an existing claim for cash"
            }
          ],
          "answers": {
            "class-5-need-funds": "class-5-role-firm",
            "class-5-need-assets": "class-5-role-fund",
            "class-5-need-cash": "class-5-role-seller"
          },
          "explanation": "Different purposes can coexist in one market. New issuance funds a firm; secondary transfer pays a selling holder; investors accept claims with risk.",
          "retry": "Begin with whose need is described. Do not assume all buyers are raising money or all trades finance the issuer."
        }
      ],
      "explanation": [
        "Financial markets provide arrangements for exchanging financial claims. Participants arrive with different needs: raising funds, investing resources, obtaining liquidity or managing exposures. The same transaction can therefore serve different purposes on its two sides.",
        "A market needs rules and infrastructure as well as willing participants. Brokers, venues and settlement arrangements can help connect people and complete transfers. Their existence does not remove fraud, operational risk or the possibility of a poor price."
      ],
      "takeaway": "Identify participants and the needs a market can connect.",
      "demi": "Follow the funds first: who receives them, what claim changes hands, and what risk stays with each actor?"
    },
    {
      "sectionId": "class-5-section-2",
      "hook": "Which transaction directly raises new funds for a hypothetical issuer?",
      "scenario": "Hypothetical: a workshop issues new shares to pay for a kiln. A later sale of those shares between two investors transfers ownership; it does not pay for a second kiln.",
      "visual": {
        "kind": "market",
        "nodes": [
          {
            "label": "New issue",
            "detail": "Investor → funds → workshop; workshop → new claim → investor."
          },
          {
            "label": "Productive project",
            "detail": "Workshop uses issue proceeds to buy a kiln."
          },
          {
            "label": "Later resale",
            "detail": "New holder → funds → selling holder; existing claim changes hands."
          }
        ],
        "caption": "Follow participant → need → exchange → retained risk. The arrows describe purpose, not guaranteed results."
      },
      "practice": [
        {
          "id": "class-5-2-practice",
          "kind": "choice",
          "prompt": "Which transaction directly raises new funds for a hypothetical issuer?",
          "options": [
            {
              "id": "class-5-2-practice-b",
              "label": "Two holders trading its existing bonds."
            },
            {
              "id": "class-5-2-practice-a",
              "label": "Investors buying its newly issued bonds."
            }
          ],
          "correct": "class-5-2-practice-a",
          "explanation": "Investors buying its newly issued bonds. When investors later trade an existing security with each other, the sale proceeds normally go to the selling holder, rather than directly financing the original issuer again. Secondary trading can still support financing indirectly by making claims easier to transfer and helping reveal valuations.",
          "retry": "Re-read the scenario and identify the changed quantity or assumption before choosing again."
        }
      ],
      "explanation": [
        "A company can issue new shares or bonds to obtain funds for activity such as equipment or expansion. Investors receive a claim whose rights and risks depend on the instrument. Raising funds does not prove the project will be productive or profitable.",
        "When investors later trade an existing security with each other, the sale proceeds normally go to the selling holder, rather than directly financing the original issuer again. Secondary trading can still support financing indirectly by making claims easier to transfer and helping reveal valuations."
      ],
      "takeaway": "Distinguish issuing claims from exchanging existing claims.",
      "demi": "Follow the funds first: who receives them, what claim changes hands, and what risk stays with each actor?"
    },
    {
      "sectionId": "class-5-section-3",
      "hook": "A company cancels dividends after a difficult year. Which claim fits ordinary share ownership?",
      "scenario": "Hypothetical: a fund buys a stake in a bicycle manufacturer. Strong sales could help the business, but input costs, debt and the price paid for the stake still influence the investment outcome.",
      "visual": {
        "kind": "market",
        "nodes": [
          {
            "label": "Owner",
            "detail": "Holds an interest in a bicycle manufacturer."
          },
          {
            "label": "Business results",
            "detail": "Sales and input costs influence profits."
          },
          {
            "label": "Investor outcome",
            "detail": "Distributions and resale value remain uncertain."
          }
        ],
        "caption": "Follow participant → need → exchange → retained risk. The arrows describe purpose, not guaranteed results."
      },
      "practice": [
        {
          "id": "class-5-3-practice",
          "kind": "choice",
          "prompt": "A company cancels dividends after a difficult year. Which claim fits ordinary share ownership?",
          "options": [
            {
              "id": "class-5-3-practice-a",
              "label": "Distributions and resale value were uncertain."
            },
            {
              "id": "class-5-3-practice-b",
              "label": "The share must still pay a fixed coupon."
            }
          ],
          "correct": "class-5-3-practice-a",
          "explanation": "Distributions and resale value were uncertain. Ownership differs from a creditor’s contractual claim. In failure, shareholders generally stand behind creditors, with precise rights depending on law and the instrument. A recognizable business or useful product does not establish that its share is good value at every price.",
          "retry": "Re-read the scenario and identify the changed quantity or assumption before choosing again."
        }
      ],
      "explanation": [
        "A share represents an ownership interest in a company. Holders may benefit from distributions or a higher resale value, but neither is assured. Ownership exposes the investor to business performance and changing valuations, rather than creating a guaranteed savings balance.",
        "Ownership differs from a creditor’s contractual claim. In failure, shareholders generally stand behind creditors, with precise rights depending on law and the instrument. A recognizable business or useful product does not establish that its share is good value at every price."
      ],
      "takeaway": "Explain ownership claims and their uncertainty.",
      "demi": "Follow the funds first: who receives them, what claim changes hands, and what risk stays with each actor?"
    },
    {
      "sectionId": "class-5-section-4",
      "hook": "A lender worries that an issuer may fail to repay. What risk is this?",
      "scenario": "Hypothetical: a city issues debt for water infrastructure. A lender has a claim under the bond terms, not ownership of the city; repayment capacity and market conditions remain relevant.",
      "visual": {
        "kind": "market",
        "nodes": [
          {
            "label": "Issuer",
            "detail": "Receives funding subject to repayment terms."
          },
          {
            "label": "Lender",
            "detail": "Holds a contractual claim; accepts possible default."
          },
          {
            "label": "Early exit",
            "detail": "Resale value can differ from the purchase price."
          }
        ],
        "caption": "Follow participant → need → exchange → retained risk. The arrows describe purpose, not guaranteed results."
      },
      "practice": [
        {
          "id": "class-5-4-practice",
          "kind": "choice",
          "prompt": "A lender worries that an issuer may fail to repay. What risk is this?",
          "options": [
            {
              "id": "class-5-4-practice-b",
              "label": "Proof that the lender owns the issuer."
            },
            {
              "id": "class-5-4-practice-a",
              "label": "Credit risk."
            }
          ],
          "correct": "class-5-4-practice-a",
          "explanation": "Credit risk. The price of a tradable bond may change before maturity as market rates, credit conditions and other expectations change. Holding a debt claim therefore does not mean its resale value is fixed. Instrument terms, currency and the issuer all matter.",
          "retry": "Re-read the scenario and identify the changed quantity or assumption before choosing again."
        }
      ],
      "explanation": [
        "A bond is a debt claim with specified terms, such as scheduled interest and repayment. Borrowers obtain financing; lenders accept an exposure to repayment and other risks. Contractual promises are different from certain outcomes: issuers can default.",
        "The price of a tradable bond may change before maturity as market rates, credit conditions and other expectations change. Holding a debt claim therefore does not mean its resale value is fixed. Instrument terms, currency and the issuer all matter."
      ],
      "takeaway": "Distinguish a debt claim from ownership and identify credit risk.",
      "demi": "Follow the funds first: who receives them, what claim changes hands, and what risk stays with each actor?"
    },
    {
      "sectionId": "class-5-section-5",
      "hook": "An input buyer fixes a future purchase price and the spot price later falls. What is a reasonable interpretation?",
      "scenario": "Hypothetical: a food producer worries about future grain costs and considers a contract tied to grain prices. The relevant question is whether that contract offsets its actual needs, not whether the contract wins in isolation.",
      "visual": {
        "kind": "market",
        "nodes": [
          {
            "label": "Underlying need",
            "detail": "Food producer must buy grain later."
          },
          {
            "label": "Offsetting arrangement",
            "detail": "Contract seeks to reduce exposure to rising grain costs."
          },
          {
            "label": "Residual risks",
            "detail": "Timing, product or quantity mismatch can leave exposure."
          }
        ],
        "caption": "Follow participant → need → exchange → retained risk. The arrows describe purpose, not guaranteed results."
      },
      "practice": [
        {
          "id": "class-5-5-practice",
          "kind": "choice",
          "prompt": "An input buyer fixes a future purchase price and the spot price later falls. What is a reasonable interpretation?",
          "options": [
            {
              "id": "class-5-5-practice-a",
              "label": "The arrangement traded some favorable-price opportunity for predictability."
            },
            {
              "id": "class-5-5-practice-b",
              "label": "The hedge had no economic purpose because the contract looks unfavorable alone."
            }
          ],
          "correct": "class-5-5-practice-a",
          "explanation": "The arrangement traded some favorable-price opportunity for predictability. A hedge can limit benefits from a favorable move and introduce costs or new risks. Quantity, timing or product differences may leave an imperfect offset; counterparty and operational risks can remain. Detailed derivative mechanics belong to later study.",
          "retry": "Re-read the scenario and identify the changed quantity or assumption before choosing again."
        },
        {
          "id": "class-5-hedge-reflect",
          "kind": "reflect",
          "prompt": "The food producer fixes a grain price, then the spot price falls. Explain why the contract alone does not tell you whether the original risk-management decision served its purpose.",
          "explanation": "Evaluate the original cost exposure and desire for predictability alongside the contract. A hedge can surrender a favorable price move while reducing an unfavorable one; mismatches and costs still need review.",
          "retry": "Name the underlying business need first, then compare the combined position rather than only the contract outcome."
        }
      ],
      "explanation": [
        "A business may want a more predictable input cost rather than a bet on direction. Financial contracts can transfer aspects of price risk to another willing party. A hedge is understood by comparing the contract with the exposure it is meant to offset.",
        "A hedge can limit benefits from a favorable move and introduce costs or new risks. Quantity, timing or product differences may leave an imperfect offset; counterparty and operational risks can remain. Detailed derivative mechanics belong to later study."
      ],
      "takeaway": "Explain a hedge as a response to a pre-existing exposure.",
      "demi": "Follow the funds first: who receives them, what claim changes hands, and what risk stays with each actor?"
    },
    {
      "sectionId": "class-5-section-6",
      "hook": "Can you trace both sides without turning every sale into fresh company funding?",
      "scenario": "Hypothetical: a new issuer raises funds, a long-term fund holds its claim, and an older holder sells to meet an expense. Financing, investment and liquidity are related but distinct needs.",
      "visual": {
        "kind": "market",
        "nodes": [
          {
            "label": "Firm → financing",
            "detail": "New debt proceeds support expansion."
          },
          {
            "label": "Investor → lending",
            "detail": "Debt claim brings repayment exposure."
          },
          {
            "label": "Holder → liquidity",
            "detail": "Resale raises cash on available terms."
          }
        ],
        "caption": "Follow participant → need → exchange → retained risk. The arrows describe purpose, not guaranteed results."
      },
      "practice": [
        {
          "id": "class-5-needs-match",
          "kind": "matching",
          "prompt": "Connect each fictional participant to the stated need.",
          "options": [
            {
              "id": "class-5-funding",
              "label": "Raise new funds"
            },
            {
              "id": "class-5-lending",
              "label": "Receive a debt claim"
            },
            {
              "id": "class-5-liquidity",
              "label": "Turn an existing claim into cash"
            }
          ],
          "rows": [
            {
              "id": "class-5-issuer",
              "label": "Firm issues new debt"
            },
            {
              "id": "class-5-lender",
              "label": "Investor buys newly issued debt"
            },
            {
              "id": "class-5-holder",
              "label": "Existing holder sells"
            }
          ],
          "answers": {
            "class-5-issuer": "class-5-funding",
            "class-5-lender": "class-5-lending",
            "class-5-holder": "class-5-liquidity"
          },
          "explanation": "Trace who receives the proceeds: the issuer on issuance, the selling holder on resale. A debt investor receives a claim subject to repayment risk.",
          "retry": "Separate the issuer, investor and selling holder before naming the purpose."
        }
      ],
      "explanation": [
        "A participant-needs map starts with a named actor, a need, a claim or arrangement, and a risk retained. This keeps purpose separate from product names. One product can serve several purposes, and people using the same venue may have very different horizons.",
        "Liquidity is the ability to transact on available terms, not an unconditional right to exit at yesterday’s price. In stress, counterparties may demand a discount or be hard to find. A complete map asks what happens if funding, repayment or exit assumptions fail."
      ],
      "takeaway": "Build a participant-needs map with a realistic limitation.",
      "demi": "Follow the funds first: who receives them, what claim changes hands, and what risk stays with each actor?"
    }
  ]
};
