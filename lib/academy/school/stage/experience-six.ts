import type {StageExperience} from './contracts';
/** Public teaching scenes: no private grading or instructor-bank imports. */
export const EXPERIENCE_SIX:StageExperience={
  "classId": "stage-1-class-6",
  "academicVersion": "stage-1-class-6.1.0.0",
  "revision": "class-6-experience-1",
  "format": "decisions",
  "sections": [
    {
      "sectionId": "class-6-section-1",
      "hook": "Same asset, different reasons: what would you ask before judging either decision?",
      "scenario": "Hypothetical: one person buys an ownership stake for future business returns; another takes a position solely because a stranger promised a quick win. Their decision processes differ even if both buy the same asset.",
      "visual": {
        "kind": "decisions",
        "nodes": [
          {
            "label": "Same asset, first purpose",
            "detail": "Business ownership for expected future benefits."
          },
          {
            "label": "Same asset, second purpose",
            "detail": "Quick gain based on an unverified promise."
          },
          {
            "label": "Review question",
            "detail": "What purpose, claim and evidence underlie each choice?"
          }
        ],
        "caption": "Compare what was known before the outcome. The review question concerns process and constraints."
      },
      "practice": [
        {
          "id": "class-6-1-decision-reflect",
          "kind": "reflect",
          "prompt": "Two people buy the same ownership stake: one researches expected business returns, while the other follows an unsupported promise. Explain what you can compare before either outcome is known and what the asset label cannot settle.",
          "explanation": "Compare the objective, evidence, exposure and constraints. A shared asset does not make the decisions equivalent; an unfavorable outcome alone will not establish that either process was sound or unsound.",
          "retry": "Use the facts available before the outcome. Connect a stated reason to a consequence, then name what further information matters."
        }
      ],
      "explanation": [
        "Investing commonly means allocating resources to assets for expected future benefits. Trading emphasizes transactions and positions taken or managed under a process. Gambling commonly involves staking value on an uncertain event; legal definitions vary. These descriptions overlap at their boundaries and are not a moral ranking.",
        "Ask what the person is trying to achieve and what claim or exposure they take. The word investment does not make a purchase safe, and the word trade does not prove recklessness. A return target without a mechanism, constraints or evidence is only a hope."
      ],
      "takeaway": "Distinguish a purpose from a hoped-for outcome.",
      "demi": "Pause before revealing the result. Could you defend this decision using only the information available at the time?"
    },
    {
      "sectionId": "class-6-section-2",
      "hook": "Which is the stronger explanation of a short transaction?",
      "scenario": "Hypothetical: a treasury team makes a short-lived transaction to manage a payment exposure; a collector holds a risky item for years based solely on a rumor. Duration alone does not tell us whose process is stronger.",
      "visual": {
        "kind": "decisions",
        "nodes": [
          {
            "label": "Short horizon",
            "detail": "Treasury transaction manages a payment exposure."
          },
          {
            "label": "Long horizon",
            "detail": "Rumor-based purchase is held for years."
          },
          {
            "label": "Comparison",
            "detail": "Duration and process answer different questions."
          }
        ],
        "caption": "Compare what was known before the outcome. The review question concerns process and constraints."
      },
      "practice": [
        {
          "id": "class-6-2-practice",
          "kind": "choice",
          "prompt": "Which is the stronger explanation of a short transaction?",
          "options": [
            {
              "id": "class-6-2-practice-b",
              "label": "Its short duration guarantees a favorable result."
            },
            {
              "id": "class-6-2-practice-a",
              "label": "It addresses a defined exposure under a documented process."
            }
          ],
          "correct": "class-6-2-practice-a",
          "explanation": "It addresses a defined exposure under a documented process. A process states why an action is considered, what evidence supports it and when it will be reviewed. It also names constraints and reasons to reject the action. A written plan cannot guarantee success, but it makes decisions open to scrutiny before the result is known.",
          "retry": "Re-read the scenario and identify the changed quantity or assumption before choosing again."
        }
      ],
      "explanation": [
        "Time horizon matters because it shapes liquidity needs, exposure and how an idea can be evaluated. It is not a complete classification rule. A short transaction may manage an existing exposure, while a long-held asset can still have been bought with no coherent rationale.",
        "A process states why an action is considered, what evidence supports it and when it will be reviewed. It also names constraints and reasons to reject the action. A written plan cannot guarantee success, but it makes decisions open to scrutiny before the result is known."
      ],
      "takeaway": "Compare decisions using more than holding duration.",
      "demi": "Pause before revealing the result. Could you defend this decision using only the information available at the time?"
    },
    {
      "sectionId": "class-6-section-3",
      "hook": "A person is willing to take risk but cannot miss a bill due tomorrow. What distinction matters?",
      "scenario": "Hypothetical: a learner needs 400 units for an essential bill next week. Putting that amount into an uncertain asset creates a timing and loss-capacity problem even if the learner feels confident.",
      "visual": {
        "kind": "decisions",
        "nodes": [
          {
            "label": "Willingness",
            "detail": "The learner feels comfortable accepting risk."
          },
          {
            "label": "Capacity",
            "detail": "An essential 400-unit bill is due next week.",
            "value": 400
          },
          {
            "label": "Consequence",
            "detail": "A loss or delayed exit could prevent payment."
          }
        ],
        "caption": "Compare what was known before the outcome. The review question concerns process and constraints."
      },
      "practice": [
        {
          "id": "class-6-3-practice",
          "kind": "choice",
          "prompt": "A person is willing to take risk but cannot miss a bill due tomorrow. What distinction matters?",
          "options": [
            {
              "id": "class-6-3-practice-a",
              "label": "Willingness is different from ability to absorb loss."
            },
            {
              "id": "class-6-3-practice-b",
              "label": "Confidence creates extra loss capacity."
            }
          ],
          "correct": "class-6-3-practice-a",
          "explanation": "Willingness is different from ability to absorb loss. Risk tolerance is willingness to accept uncertainty; capacity is the ability to bear consequences. A person may feel brave but be unable to absorb a loss without missing an essential payment. Risk controls should be considered before a position; they are not promises that losses will stay within a hoped-for boundary.",
          "retry": "Re-read the scenario and identify the changed quantity or assumption before choosing again."
        },
        {
          "id": "class-6-risk-match",
          "kind": "matching",
          "prompt": "Match the fictional observation to the distinction it illustrates.",
          "rows": [
            {
              "id": "class-6-feels",
              "label": "The learner feels comfortable accepting volatility"
            },
            {
              "id": "class-6-bill",
              "label": "A loss would prevent an essential payment"
            },
            {
              "id": "class-6-exit",
              "label": "Sale is available only at a large discount"
            }
          ],
          "options": [
            {
              "id": "class-6-willingness",
              "label": "Willingness to take risk"
            },
            {
              "id": "class-6-capacity",
              "label": "Ability to absorb consequences"
            },
            {
              "id": "class-6-liquidity",
              "label": "Exit terms and liquidity"
            }
          ],
          "answers": {
            "class-6-feels": "class-6-willingness",
            "class-6-bill": "class-6-capacity",
            "class-6-exit": "class-6-liquidity"
          },
          "explanation": "Confidence does not create cash or loss capacity. Available exit terms can matter even when the original objective was long term.",
          "retry": "Separate feelings, consequences and market exit conditions before matching."
        }
      ],
      "explanation": [
        "Risk includes outcomes that can frustrate an objective: price loss, inability to exit, counterparty failure or a need for cash at an awkward time. Uncertainty means the future is incompletely known. Neither investing nor trading escapes these conditions.",
        "Risk tolerance is willingness to accept uncertainty; capacity is the ability to bear consequences. A person may feel brave but be unable to absorb a loss without missing an essential payment. Risk controls should be considered before a position; they are not promises that losses will stay within a hoped-for boundary."
      ],
      "takeaway": "Identify loss capacity, uncertainty and constraints.",
      "demi": "Pause before revealing the result. Could you defend this decision using only the information available at the time?"
    },
    {
      "sectionId": "class-6-section-4",
      "hook": "Which evidence best challenges an alleged edge?",
      "scenario": "Hypothetical: a simulated method shows four gains but omits six losses and transaction costs. The selected record cannot establish an advantage; ask for the complete record and the evaluation rules.",
      "visual": {
        "kind": "decisions",
        "nodes": [
          {
            "label": "Selected record",
            "detail": "Four gains are advertised.",
            "value": 4
          },
          {
            "label": "Omitted record",
            "detail": "Six losses and costs are not shown.",
            "value": 6
          },
          {
            "label": "Evidence check",
            "detail": "Request the full record and evaluation rules."
          }
        ],
        "caption": "Compare what was known before the outcome. The review question concerns process and constraints."
      },
      "practice": [
        {
          "id": "class-6-4-practice",
          "kind": "choice",
          "prompt": "Which evidence best challenges an alleged edge?",
          "options": [
            {
              "id": "class-6-4-practice-b",
              "label": "A screenshot of the largest winner."
            },
            {
              "id": "class-6-4-practice-a",
              "label": "A complete record including losses, costs and an appropriate comparison."
            }
          ],
          "correct": "class-6-4-practice-a",
          "explanation": "A complete record including losses, costs and an appropriate comparison. One profitable result can come from luck; one loss can occur under a defensible process. Evaluate the information available when deciding, not only the outcome. Repeatedly selecting only successful examples hides failures and can create a false impression of reliability.",
          "retry": "Re-read the scenario and identify the changed quantity or assumption before choosing again."
        }
      ],
      "explanation": [
        "An edge is a claimed advantage in expected outcomes under specified conditions, after relevant costs. A plausible story is a hypothesis, not proof. Evidence needs enough observations, a fair comparison and attention to conditions where the idea might fail.",
        "One profitable result can come from luck; one loss can occur under a defensible process. Evaluate the information available when deciding, not only the outcome. Repeatedly selecting only successful examples hides failures and can create a false impression of reliability."
      ],
      "takeaway": "Evaluate a claimed advantage without treating outcomes as proof.",
      "demi": "Pause before revealing the result. Could you defend this decision using only the information available at the time?"
    },
    {
      "sectionId": "class-6-section-5",
      "hook": "What makes waiting a defensible decision rather than an unexplained habit?",
      "scenario": "Hypothetical: a learner cannot explain an offered product’s payoff and has no reliable cost information. Waiting to clarify the terms is defensible; a later review can follow verified information and a capacity check.",
      "visual": {
        "kind": "decisions",
        "nodes": [
          {
            "label": "Unknown terms",
            "detail": "Payoff and costs cannot yet be explained."
          },
          {
            "label": "No action",
            "detail": "Wait while verifying the missing information."
          },
          {
            "label": "Review trigger",
            "detail": "Reconsider after terms and loss capacity are understood."
          }
        ],
        "caption": "Compare what was known before the outcome. The review question concerns process and constraints."
      },
      "practice": [
        {
          "id": "class-6-5-decision-reflect",
          "kind": "reflect",
          "prompt": "You cannot explain a product’s payoff or verify its costs before a pressured deadline. Write a reasoned no-action decision, one opportunity cost of waiting and a condition that would justify reviewing it.",
          "explanation": "Waiting can be justified by missing information or unsuitable consequences. It is stronger when linked to a specific constraint, an acknowledged opportunity cost and a review trigger; waiting is not guaranteed to produce the best financial outcome.",
          "retry": "Use the facts available before the outcome. Connect a stated reason to a consequence, then name what further information matters."
        }
      ],
      "explanation": [
        "No action is a decision when information is insufficient, the exposure is unsuitable or the consequences cannot be tolerated. It can preserve the ability to act later. It also has opportunity costs, so explain the reason and what new evidence would trigger a review.",
        "A useful checklist asks about objective, time horizon, claim or exposure, supporting evidence, costs, plausible losses, cash needs and review conditions. A checklist supports judgment rather than mechanically authorizing a trade. These classroom cases practice reasoning and do not prescribe personal investments."
      ],
      "takeaway": "Justify action or waiting using evidence and constraints.",
      "demi": "Pause before revealing the result. Could you defend this decision using only the information available at the time?"
    }
  ]
};
