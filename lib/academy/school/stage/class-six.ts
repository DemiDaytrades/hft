import 'server-only';
import type {StageClass} from './contracts';
/** Private immutable curriculum definition; project student transport explicitly. */
export const CLASS_SIX:StageClass={
  "id": "stage-1-class-6",
  "version": "stage-1-class-6.1.0.0",
  "stageId": "stage-1",
  "number": 6,
  "title": "Investing vs Trading vs Gambling",
  "description": "Judge the purpose, evidence and constraints available at the decision time. Neither a reassuring label nor one favorable result proves quality.",
  "courseId": "hft-school-foundations",
  "lessonId": "hft-school-class-6",
  "prerequisites": [
    "stage-1-class-5"
  ],
  "liveMinutes": 60,
  "reviewMinutes": 30,
  "objectives": [
    {
      "id": "class-6-objective-1",
      "text": "Distinguish a purpose from a hoped-for outcome.",
      "competency": "S1_C6_1"
    },
    {
      "id": "class-6-objective-2",
      "text": "Compare decisions using more than holding duration.",
      "competency": "S1_C6_2"
    },
    {
      "id": "class-6-objective-3",
      "text": "Identify loss capacity, uncertainty and constraints.",
      "competency": "S1_C6_3"
    },
    {
      "id": "class-6-objective-4",
      "text": "Evaluate a claimed advantage without treating outcomes as proof.",
      "competency": "S1_C6_4"
    },
    {
      "id": "class-6-objective-5",
      "text": "Justify action or waiting using evidence and constraints.",
      "competency": "S1_C6_5"
    }
  ],
  "terms": [
    {
      "term": "Time horizon",
      "definition": "The period relevant to an objective and its constraints."
    },
    {
      "term": "Loss capacity",
      "definition": "Ability to absorb adverse consequences while meeting obligations."
    },
    {
      "term": "Edge",
      "definition": "A claimed expected advantage that needs evidence and consideration of costs."
    },
    {
      "term": "Outcome bias",
      "definition": "Judging a decision only by its eventual result."
    },
    {
      "term": "No action",
      "definition": "A decision to wait or abstain for stated reasons, with conditions for review."
    }
  ],
  "sections": [
    {
      "id": "class-6-section-1",
      "title": "Start with the objective",
      "objectiveId": "class-6-objective-1",
      "competency": "S1_C6_1",
      "paragraphs": [
        "Investing commonly means allocating resources to assets for expected future benefits. Trading emphasizes transactions and positions taken or managed under a process. Gambling commonly involves staking value on an uncertain event; legal definitions vary. These descriptions overlap at their boundaries and are not a moral ranking.",
        "Ask what the person is trying to achieve and what claim or exposure they take. The word investment does not make a purchase safe, and the word trade does not prove recklessness. A return target without a mechanism, constraints or evidence is only a hope."
      ],
      "example": "Hypothetical: one person buys an ownership stake for future business returns; another takes a position solely because a stranger promised a quick win. Their decision processes differ even if both buy the same asset.",
      "misconception": "The label investing is enough to establish sound decision making.",
      "visual": "none",
      "activities": [
        {
          "id": "class-6-1-explore",
          "kind": "choice",
          "category": "APPLICATION",
          "sectionId": "class-6-section-1",
          "objectiveId": "class-6-objective-1",
          "competency": "S1_C6_1",
          "prompt": "Two people buy the same asset for different reasons. What should a reviewer ask first?",
          "options": [
            {
              "id": "class-6-1-explore-b",
              "label": "Only which person calls it an investment."
            },
            {
              "id": "class-6-1-explore-a",
              "label": "Their objectives, exposures and reasons."
            }
          ],
          "correct": "class-6-1-explore-a"
        }
      ]
    },
    {
      "id": "class-6-section-2",
      "title": "Horizon and process together",
      "objectiveId": "class-6-objective-2",
      "competency": "S1_C6_2",
      "paragraphs": [
        "Time horizon matters because it shapes liquidity needs, exposure and how an idea can be evaluated. It is not a complete classification rule. A short transaction may manage an existing exposure, while a long-held asset can still have been bought with no coherent rationale.",
        "A process states why an action is considered, what evidence supports it and when it will be reviewed. It also names constraints and reasons to reject the action. A written plan cannot guarantee success, but it makes decisions open to scrutiny before the result is known."
      ],
      "example": "Hypothetical: a treasury team makes a short-lived transaction to manage a payment exposure; a collector holds a risky item for years based solely on a rumor. Duration alone does not tell us whose process is stronger.",
      "misconception": "Every short holding is gambling and every long holding is disciplined investing.",
      "visual": "none",
      "activities": [
        {
          "id": "class-6-2-explore",
          "kind": "choice",
          "category": "APPLICATION",
          "sectionId": "class-6-section-2",
          "objectiveId": "class-6-objective-2",
          "competency": "S1_C6_2",
          "prompt": "Which is the stronger explanation of a short transaction?",
          "options": [
            {
              "id": "class-6-2-explore-a",
              "label": "It addresses a defined exposure under a documented process."
            },
            {
              "id": "class-6-2-explore-b",
              "label": "Its short duration guarantees a favorable result."
            }
          ],
          "correct": "class-6-2-explore-a"
        }
      ]
    },
    {
      "id": "class-6-section-3",
      "title": "Risk is more than being wrong",
      "objectiveId": "class-6-objective-3",
      "competency": "S1_C6_3",
      "paragraphs": [
        "Risk includes outcomes that can frustrate an objective: price loss, inability to exit, counterparty failure or a need for cash at an awkward time. Uncertainty means the future is incompletely known. Neither investing nor trading escapes these conditions.",
        "Risk tolerance is willingness to accept uncertainty; capacity is the ability to bear consequences. A person may feel brave but be unable to absorb a loss without missing an essential payment. Risk controls should be considered before a position; they are not promises that losses will stay within a hoped-for boundary."
      ],
      "example": "Hypothetical: a learner needs 400 units for an essential bill next week. Putting that amount into an uncertain asset creates a timing and loss-capacity problem even if the learner feels confident.",
      "misconception": "Confidence or a protective rule makes losses impossible.",
      "visual": "none",
      "activities": [
        {
          "id": "class-6-3-explore",
          "kind": "choice",
          "category": "APPLICATION",
          "sectionId": "class-6-section-3",
          "objectiveId": "class-6-objective-3",
          "competency": "S1_C6_3",
          "prompt": "A person is willing to take risk but cannot miss a bill due tomorrow. What distinction matters?",
          "options": [
            {
              "id": "class-6-3-explore-b",
              "label": "Confidence creates extra loss capacity."
            },
            {
              "id": "class-6-3-explore-a",
              "label": "Willingness is different from ability to absorb loss."
            }
          ],
          "correct": "class-6-3-explore-a"
        }
      ]
    },
    {
      "id": "class-6-section-4",
      "title": "Edge needs evidence",
      "objectiveId": "class-6-objective-4",
      "competency": "S1_C6_4",
      "paragraphs": [
        "An edge is a claimed advantage in expected outcomes under specified conditions, after relevant costs. A plausible story is a hypothesis, not proof. Evidence needs enough observations, a fair comparison and attention to conditions where the idea might fail.",
        "One profitable result can come from luck; one loss can occur under a defensible process. Evaluate the information available when deciding, not only the outcome. Repeatedly selecting only successful examples hides failures and can create a false impression of reliability."
      ],
      "example": "Hypothetical: a simulated method shows four gains but omits six losses and transaction costs. The selected record cannot establish an advantage; ask for the complete record and the evaluation rules.",
      "misconception": "A winning trade proves skill, while a losing investment proves a bad process.",
      "visual": "none",
      "activities": [
        {
          "id": "class-6-4-explore",
          "kind": "choice",
          "category": "APPLICATION",
          "sectionId": "class-6-section-4",
          "objectiveId": "class-6-objective-4",
          "competency": "S1_C6_4",
          "prompt": "Which evidence best challenges an alleged edge?",
          "options": [
            {
              "id": "class-6-4-explore-a",
              "label": "A complete record including losses, costs and an appropriate comparison."
            },
            {
              "id": "class-6-4-explore-b",
              "label": "A screenshot of the largest winner."
            }
          ],
          "correct": "class-6-4-explore-a"
        }
      ]
    },
    {
      "id": "class-6-section-5",
      "title": "A defensible no-action decision",
      "objectiveId": "class-6-objective-5",
      "competency": "S1_C6_5",
      "paragraphs": [
        "No action is a decision when information is insufficient, the exposure is unsuitable or the consequences cannot be tolerated. It can preserve the ability to act later. It also has opportunity costs, so explain the reason and what new evidence would trigger a review.",
        "A useful checklist asks about objective, time horizon, claim or exposure, supporting evidence, costs, plausible losses, cash needs and review conditions. A checklist supports judgment rather than mechanically authorizing a trade. These classroom cases practice reasoning and do not prescribe personal investments."
      ],
      "example": "Hypothetical: a learner cannot explain an offered product’s payoff and has no reliable cost information. Waiting to clarify the terms is defensible; a later review can follow verified information and a capacity check.",
      "misconception": "Discipline means always taking an opportunity, and waiting means failure.",
      "visual": "none",
      "activities": [
        {
          "id": "class-6-5-explore",
          "kind": "choice",
          "category": "APPLICATION",
          "sectionId": "class-6-section-5",
          "objectiveId": "class-6-objective-5",
          "competency": "S1_C6_5",
          "prompt": "An unfamiliar product has unclear costs and a deadline pressure tactic. Which response has a defensible basis?",
          "options": [
            {
              "id": "class-6-5-explore-b",
              "label": "Buy immediately because pressure proves an edge."
            },
            {
              "id": "class-6-5-explore-a",
              "label": "Wait, verify terms and reconsider only after checking constraints."
            }
          ],
          "correct": "class-6-5-explore-a"
        }
      ]
    }
  ],
  "assessment": [
    {
      "id": "class-6-1-check",
      "kind": "choice",
      "category": "APPLICATION",
      "sectionId": "class-6-section-1",
      "objectiveId": "class-6-objective-1",
      "competency": "S1_C6_1",
      "prompt": "A purchase is described as a guaranteed investment without supporting terms. What should be examined?",
      "options": [
        {
          "id": "class-6-1-check-a",
          "label": "The actual claim, uncertainty and evidence behind the promise."
        },
        {
          "id": "class-6-1-check-b",
          "label": "Only the reassuring label."
        }
      ],
      "correct": "class-6-1-check-a"
    },
    {
      "id": "class-6-2-check",
      "kind": "choice",
      "category": "APPLICATION",
      "sectionId": "class-6-section-2",
      "objectiveId": "class-6-objective-2",
      "competency": "S1_C6_2",
      "prompt": "A position was held for five years with no reason except a rumor. What follows?",
      "options": [
        {
          "id": "class-6-2-check-b",
          "label": "Five years proves the original decision was evidence based."
        },
        {
          "id": "class-6-2-check-a",
          "label": "Long duration alone does not establish a sound process."
        }
      ],
      "correct": "class-6-2-check-a"
    },
    {
      "id": "class-6-3-check",
      "kind": "choice",
      "category": "APPLICATION",
      "sectionId": "class-6-section-3",
      "objectiveId": "class-6-objective-3",
      "competency": "S1_C6_3",
      "prompt": "An asset can only be sold at a deep discount when cash is needed. Which risk is visible?",
      "options": [
        {
          "id": "class-6-3-check-a",
          "label": "Liquidity risk interacting with the cash deadline."
        },
        {
          "id": "class-6-3-check-b",
          "label": "Proof that a long horizon eliminates every risk."
        }
      ],
      "correct": "class-6-3-check-a"
    },
    {
      "id": "class-6-4-check",
      "kind": "choice",
      "category": "APPLICATION",
      "sectionId": "class-6-section-4",
      "objectiveId": "class-6-objective-4",
      "competency": "S1_C6_4",
      "prompt": "A planned decision loses once. What can that single result establish?",
      "options": [
        {
          "id": "class-6-4-check-b",
          "label": "The process was necessarily irrational."
        },
        {
          "id": "class-6-4-check-a",
          "label": "The outcome was unfavorable; it cannot alone settle process quality."
        }
      ],
      "correct": "class-6-4-check-a"
    },
    {
      "id": "class-6-5-check",
      "kind": "choice",
      "category": "APPLICATION",
      "sectionId": "class-6-section-5",
      "objectiveId": "class-6-objective-5",
      "competency": "S1_C6_5",
      "prompt": "A person chooses not to act because the possible loss conflicts with a near-term obligation. What makes the explanation useful?",
      "options": [
        {
          "id": "class-6-5-check-a",
          "label": "It links the constraint to the decision and states when to review."
        },
        {
          "id": "class-6-5-check-b",
          "label": "It promises that waiting can never have opportunity costs."
        }
      ],
      "correct": "class-6-5-check-a"
    },
    {
      "id": "class-6-reasoning",
      "kind": "written",
      "category": "REASONING",
      "sectionId": "class-6-section-5",
      "objectiveId": "class-6-objective-5",
      "competency": "S1_C6_5",
      "prompt": "A short transaction follows a documented risk-management purpose and loses; a long-held purchase based on rumor wins. Explain why duration and outcome alone cannot establish decision quality.",
      "rubric": "Evaluate the information and constraints available before the result; distinguish process from outcome, and avoid equating all short decisions with gambling."
    }
  ],
  "homework": [
    {
      "id": "class-6-1-homework-check",
      "kind": "choice",
      "category": "HOMEWORK",
      "sectionId": "class-6-section-5",
      "objectiveId": "class-6-objective-5",
      "competency": "S1_C6_5",
      "prompt": "A learner cannot verify the payoff or costs before a pressured deadline. Which checklist response is defensible?",
      "options": [
        {
          "id": "class-6-1-homework-check-a",
          "label": "Wait, seek reliable terms and assess loss capacity before reconsidering."
        },
        {
          "id": "class-6-1-homework-check-b",
          "label": "Treat the deadline as proof of an advantage."
        }
      ],
      "correct": "class-6-1-homework-check-a"
    },
    {
      "id": "class-6-homework-working",
      "kind": "written",
      "category": "HOMEWORK",
      "sectionId": "class-6-section-5",
      "objectiveId": "class-6-objective-5",
      "competency": "S1_C6_5",
      "prompt": "Compare Casey, who buys a business stake for a multiyear goal after researching risks and costs, with Morgan, who buys the same stake for a quick gain on an unverified tip while needing the money next week. Explain objective, horizon, process and loss capacity without making duration a complete definition of gambling. Justify a no-action decision for Morgan and write a reusable decision checklist with a review trigger.",
      "rubric": "Require contextual comparisons rather than moral labels; acknowledge both can lose; explain why near-term need and unsupported evidence matter; justify waiting without promising it always wins; checklist must cover objective, evidence, costs, exposure, loss capacity and conditions for reconsideration."
    },
    {
      "id": "class-6-homework-reflection",
      "kind": "reflection",
      "category": "HOMEWORK",
      "sectionId": "class-6-section-5",
      "objectiveId": "class-6-objective-5",
      "competency": "S1_C6_5",
      "prompt": "Which assumption in your explanation are you least certain about? Explain what you would check next and how a different answer could change your conclusion.",
      "rubric": "Review a specific uncertainty and a relevant next check. Honest uncertainty is not an error; return only if no meaningful connection to the task is supplied."
    }
  ],
  "remediation": [
    {
      "competency": "S1_C6_1",
      "sectionId": "class-6-section-1",
      "title": "Revisit: Start with the objective",
      "paragraph": "Distinguish a purpose from a hoped-for outcome. Return to the example, name the assumption that changed, and explain the difference before trying this fresh situation.",
      "reinforcement": {
        "id": "class-6-1-reinforce",
        "kind": "choice",
        "category": "APPLICATION",
        "sectionId": "class-6-section-1",
        "objectiveId": "class-6-objective-1",
        "competency": "S1_C6_1",
        "prompt": "What is missing from a decision defended only by the word investor?",
        "options": [
          {
            "id": "class-6-1-reinforce-a",
            "label": "An explanation of purpose, evidence and exposure."
          },
          {
            "id": "class-6-1-reinforce-b",
            "label": "A longer label."
          }
        ],
        "correct": "class-6-1-reinforce-a"
      }
    },
    {
      "competency": "S1_C6_2",
      "sectionId": "class-6-section-2",
      "title": "Revisit: Horizon and process together",
      "paragraph": "Compare decisions using more than holding duration. Return to the example, name the assumption that changed, and explain the difference before trying this fresh situation.",
      "reinforcement": {
        "id": "class-6-2-reinforce",
        "kind": "choice",
        "category": "APPLICATION",
        "sectionId": "class-6-section-2",
        "objectiveId": "class-6-objective-2",
        "competency": "S1_C6_2",
        "prompt": "What should accompany a time-horizon comparison?",
        "options": [
          {
            "id": "class-6-2-reinforce-b",
            "label": "A rule that duration guarantees quality."
          },
          {
            "id": "class-6-2-reinforce-a",
            "label": "The reason, evidence and constraints behind each decision."
          }
        ],
        "correct": "class-6-2-reinforce-a"
      }
    },
    {
      "competency": "S1_C6_3",
      "sectionId": "class-6-section-3",
      "title": "Revisit: Risk is more than being wrong",
      "paragraph": "Identify loss capacity, uncertainty and constraints. Return to the example, name the assumption that changed, and explain the difference before trying this fresh situation.",
      "reinforcement": {
        "id": "class-6-3-reinforce",
        "kind": "choice",
        "category": "APPLICATION",
        "sectionId": "class-6-section-3",
        "objectiveId": "class-6-objective-3",
        "competency": "S1_C6_3",
        "prompt": "Why check cash commitments before accepting uncertain returns?",
        "options": [
          {
            "id": "class-6-3-reinforce-a",
            "label": "Consequences may exceed the person’s capacity to bear loss."
          },
          {
            "id": "class-6-3-reinforce-b",
            "label": "Willingness always removes liquidity needs."
          }
        ],
        "correct": "class-6-3-reinforce-a"
      }
    },
    {
      "competency": "S1_C6_4",
      "sectionId": "class-6-section-4",
      "title": "Revisit: Edge needs evidence",
      "paragraph": "Evaluate a claimed advantage without treating outcomes as proof. Return to the example, name the assumption that changed, and explain the difference before trying this fresh situation.",
      "reinforcement": {
        "id": "class-6-4-reinforce",
        "kind": "choice",
        "category": "APPLICATION",
        "sectionId": "class-6-section-4",
        "objectiveId": "class-6-objective-4",
        "competency": "S1_C6_4",
        "prompt": "What does a complete evaluation record include?",
        "options": [
          {
            "id": "class-6-4-reinforce-b",
            "label": "Only examples selected after they succeeded."
          },
          {
            "id": "class-6-4-reinforce-a",
            "label": "Unfavorable outcomes and relevant costs as well as gains."
          }
        ],
        "correct": "class-6-4-reinforce-a"
      }
    },
    {
      "competency": "S1_C6_5",
      "sectionId": "class-6-section-5",
      "title": "Revisit: A defensible no-action decision",
      "paragraph": "Justify action or waiting using evidence and constraints. Return to the example, name the assumption that changed, and explain the difference before trying this fresh situation.",
      "reinforcement": {
        "id": "class-6-5-reinforce",
        "kind": "choice",
        "category": "APPLICATION",
        "sectionId": "class-6-section-5",
        "objectiveId": "class-6-objective-5",
        "competency": "S1_C6_5",
        "prompt": "How can waiting remain accountable?",
        "options": [
          {
            "id": "class-6-5-reinforce-a",
            "label": "State the constraint and the evidence that would justify review."
          },
          {
            "id": "class-6-5-reinforce-b",
            "label": "Never revisit the decision regardless of new information."
          }
        ],
        "correct": "class-6-5-reinforce-a"
      }
    }
  ],
  "liveGuide": [
    {
      "title": "Start with the objective",
      "minutes": 12,
      "talkingPoints": [
        "Opening and prerequisite check: Retrieve financing, ownership, lending and hedging purposes before comparing decision labels.",
        "Today’s purpose: Judge the purpose, evidence and constraints available at the decision time. Neither a reassuring label nor one favorable result proves quality.",
        "Investing commonly means allocating resources to assets for expected future benefits. Trading emphasizes transactions and positions taken or managed under a process. Gambling commonly involves staking value on an uncertain event; legal definitions vary. These descriptions overlap at their boundaries and are not a moral ranking.",
        "Hide both outcomes. Place the two same-asset purchases side by side and request objective, claim and evidence for each before allowing a label.",
        "Change the condition: the unsupported-tip purchase wins while the researched purchase loses. Ask which facts about the original reasoning changed and which did not.",
        "Transition from labels to the role of horizon and process.",
        "Resolve this misconception with the demonstration: The label investing is enough to establish sound decision making."
      ],
      "activity": {
        "kind": "SINGLE",
        "prompt": "Two people buy the same asset for different reasons. What should a reviewer ask first? Ask for the reason as well as the selection.",
        "sectionId": "class-6-section-1"
      }
    },
    {
      "title": "Horizon and process together",
      "minutes": 12,
      "talkingPoints": [
        "Time horizon matters because it shapes liquidity needs, exposure and how an idea can be evaluated. It is not a complete classification rule. A short transaction may manage an existing exposure, while a long-held asset can still have been bought with no coherent rationale.",
        "Place the treasury transaction on a short timeline and the rumor purchase on a long timeline. Add each purpose under its line.",
        "Change the condition: give the short transaction a documented exposure and the long transaction no review rule. Ask why the duration alone cannot do the classification work.",
        "Transition: both processes still need an examination of consequences.",
        "Resolve this misconception with the demonstration: Every short holding is gambling and every long holding is disciplined investing."
      ],
      "activity": {
        "kind": "WRITTEN",
        "prompt": "Write a two-sentence explanation: Hypothetical: a treasury team makes a short-lived transaction to manage a payment exposure; a collector holds a risky item for years based solely on a rumor. Duration alone does not tell us whose process is stronger. Identify the governing distinction and one assumption that limits the conclusion.",
        "sectionId": "class-6-section-2"
      }
    },
    {
      "title": "Risk is more than being wrong",
      "minutes": 12,
      "talkingPoints": [
        "Risk includes outcomes that can frustrate an objective: price loss, inability to exit, counterparty failure or a need for cash at an awkward time. Uncertainty means the future is incompletely known. Neither investing nor trading escapes these conditions.",
        "Draw willingness and capacity as two separate columns. Put confidence in the first and the 400-unit essential bill in the second.",
        "Change the condition: the learner feels twice as confident, but the bill is still due next week. Ask what changed about capacity; then introduce a discounted exit.",
        "Transition: confidence is not evidence of an advantage either.",
        "Resolve this misconception with the demonstration: Confidence or a protective rule makes losses impossible."
      ],
      "activity": {
        "kind": "POLL",
        "prompt": "A person is willing to take risk but cannot miss a bill due tomorrow. What distinction matters? Ask for the reason as well as the selection.",
        "sectionId": "class-6-section-3"
      }
    },
    {
      "title": "Edge needs evidence",
      "minutes": 12,
      "talkingPoints": [
        "An edge is a claimed advantage in expected outcomes under specified conditions, after relevant costs. A plausible story is a hypothesis, not proof. Evidence needs enough observations, a fair comparison and attention to conditions where the idea might fail.",
        "Reveal four advertised gains first and request a conclusion. Then reveal six omitted losses and costs; ask learners to revise the evidence request rather than guess a profitable method.",
        "Change the condition: a complete record has one new loss. Ask why one observation cannot settle the process and what comparison or conditions should be examined.",
        "Transition: incomplete evidence can lead to a reasoned decision to wait.",
        "Resolve this misconception with the demonstration: A winning trade proves skill, while a losing investment proves a bad process."
      ],
      "activity": {
        "kind": "SINGLE",
        "prompt": "Which evidence best challenges an alleged edge? Ask for the reason as well as the selection.",
        "sectionId": "class-6-section-4"
      }
    },
    {
      "title": "A defensible no-action decision",
      "minutes": 12,
      "talkingPoints": [
        "No action is a decision when information is insufficient, the exposure is unsuitable or the consequences cannot be tolerated. It can preserve the ability to act later. It also has opportunity costs, so explain the reason and what new evidence would trigger a review.",
        "Have learners fill three boxes: missing payoff/cost information, possible consequence, and a review trigger. Ask for a no-action statement connecting the boxes.",
        "Change the condition: reliable terms arrive, but the near-term bill remains. Ask why new information removes one obstacle without automatically removing loss-capacity constraints.",
        "Recap using only pre-outcome facts; ask learners to acknowledge the opportunity cost of waiting, then preview price formation and uncertainty.",
        "Resolve this misconception with the demonstration: Discipline means always taking an opportunity, and waiting means failure."
      ],
      "activity": {
        "kind": "WRITTEN",
        "prompt": "Write a two-sentence explanation: Hypothetical: a learner cannot explain an offered product’s payoff and has no reliable cost information. Waiting to clarify the terms is defensible; a later review can follow verified information and a capacity check. Identify the governing distinction and one assumption that limits the conclusion.",
        "sectionId": "class-6-section-5"
      }
    }
  ],
  "studyGuide": {
    "summary": [
      "A financial label is a starting description, not evidence of a sound decision. Examine the objective, claim and reason for acting.",
      "Holding duration affects constraints, but process and purpose are needed to interpret it. Short duration alone is not a complete definition of gambling.",
      "Willingness to accept uncertainty differs from the capacity to bear its consequences. Cash deadlines and exit conditions can dominate confidence.",
      "An advantage needs a complete record and relevant costs. A single favorable result can be luck, and a defensible process can lose.",
      "Waiting deserves reasons and a review trigger. It can preserve options while still carrying opportunity costs."
    ],
    "bigPicture": "Judge the purpose, evidence and constraints available at the decision time. Neither a reassuring label nor one favorable result proves quality.",
    "fiveThings": [
      "Labels alone do not establish decision quality.",
      "Duration needs purpose and process for context.",
      "Confidence cannot replace the ability to bear loss.",
      "A claimed edge needs complete evidence and relevant costs.",
      "A reasoned choice to wait states a constraint and a review trigger."
    ],
    "outcomes": [
      "Distinguish a purpose from a hoped-for outcome.",
      "Compare decisions using more than holding duration.",
      "Identify loss capacity, uncertainty and constraints.",
      "Evaluate a claimed advantage without treating outcomes as proof.",
      "Justify action or waiting using evidence and constraints."
    ],
    "examples": [
      "Hypothetical review: a warehouse operator uses a short transaction to reduce a known business exposure, while an individual holds a token for years solely on a rumor. The calendar alone cannot rank the decision processes.",
      "A hypothetical method advertises three winning demonstrations but conceals nine other trials and all costs. Ask for the complete observations and a fair comparison before treating the claim as an edge.",
      "A learner needs cash for course fees in ten days and cannot explain an offered product’s payoff. Waiting for verified terms and checking loss capacity is defensible, though the learner may miss a favorable move."
    ],
    "misconceptions": [
      "The label investing is enough to establish sound decision making.",
      "Every short holding is gambling and every long holding is disciplined investing.",
      "Confidence or a protective rule makes losses impossible.",
      "A winning trade proves skill, while a losing investment proves a bad process.",
      "Discipline means always taking an opportunity, and waiting means failure."
    ],
    "review": [
      {
        "sectionId": "class-6-section-1",
        "label": "Start with the objective"
      },
      {
        "sectionId": "class-6-section-2",
        "label": "Horizon and process together"
      },
      {
        "sectionId": "class-6-section-3",
        "label": "Risk is more than being wrong"
      },
      {
        "sectionId": "class-6-section-4",
        "label": "Edge needs evidence"
      },
      {
        "sectionId": "class-6-section-5",
        "label": "A defensible no-action decision"
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
      "title": "SEC Investor.gov: Asset Allocation and Diversification",
      "url": "https://www.investor.gov/introduction-investing/getting-started/asset-allocation"
    },
    {
      "title": "SEC Investor.gov: Research Before You Invest",
      "url": "https://www.investor.gov/research-you-invest"
    },
    {
      "title": "SEC Investor.gov: Investor Bulletin — Performance Claims",
      "url": "https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-47"
    }
  ],
  "design": {
    "format": "Decision studio: compare reasons before results",
    "homeworkTitle": "Decision review and personal checklist",
    "homeworkIntro": "Use the fictional cases to judge a process before seeing an outcome; no personal account information is needed.",
    "reflectionItemId": "class-6-homework-reflection",
    "pacing": {
      "minimum": 50,
      "maximum": 75
    },
    "assessmentCoverage": [
      "S1_C6_1",
      "S1_C6_2",
      "S1_C6_3",
      "S1_C6_4",
      "S1_C6_5"
    ],
    "practicalRequirement": "No chart or practical credit is required. Apply foundational reasoning through objective checks and individually reviewed written work.",
    "videoOpportunity": "Instructor may select an official investor-education scenario; pause before the outcome and ask learners to justify action or waiting.",
    "studyGuideChecks": [
      "Two people buy the same asset. What information beyond its name and eventual profit would let you compare their decisions?",
      "Can a short transaction serve risk management? Can a long-held asset have been bought without a reasoned process? Explain both.",
      "Give a case where willingness is high but loss capacity is low, without using personal account information.",
      "A method wins once. List three missing pieces before you could assess its claimed advantage: full outcomes, costs and a suitable comparison are examples.",
      "Write a no-action statement that names a constraint, an opportunity cost and a condition for review."
    ],
    "studyGuideVisual": {
      "kind": "decisions",
      "nodes": [
        {
          "label": "Before acting",
          "detail": "State objective, claim, horizon and cash constraints."
        },
        {
          "label": "Evidence gate",
          "detail": "Check mechanism, full record, costs and what could disprove the idea."
        },
        {
          "label": "Consequence gate",
          "detail": "Check loss capacity and uncertain exit conditions."
        },
        {
          "label": "Act or wait, then review",
          "detail": "Give a reason and a trigger; evaluate process separately from outcome."
        }
      ],
      "caption": "Decision review path: purpose → evidence → consequences → justified action or waiting. No step guarantees profit."
    }
  }
};
