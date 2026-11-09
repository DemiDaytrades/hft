import 'server-only';
import type {StageClass} from '../stage/contracts';
export const CLASS_S2_4:StageClass = {
  "id": "stage-2-class-4",
  "version": "stage-2-class-4.1.0.0",
  "stageId": "stage-2",
  "number": 4,
  "title": "Pips, Quote Precision and Price Movement",
  "description": "Calculate signed pip movements using the supplied instrument convention. Distinguish pip, fractional pip and displayed precision without universal decimal rules.",
  "courseId": "hft-school-foundations",
  "lessonId": "hft-school-s2-4",
  "prerequisites": [
    "stage-2-class-3"
  ],
  "liveMinutes": 60,
  "reviewMinutes": 30,
  "objectives": [
    {
      "id": "s2-4-objective-1",
      "text": "Calculate signed pip movements using the supplied instrument convention.",
      "competency": "S2_C4_1"
    },
    {
      "id": "s2-4-objective-2",
      "text": "Distinguish pip, fractional pip and displayed precision without universal decimal rules.",
      "competency": "S2_C4_2"
    }
  ],
  "terms": [
    {
      "term": "Read the measuring ruler",
      "definition": "A quote is a rate; a pip is a specified price increment used to describe a change in that rate. Read the product specification before counting digits. The familiar 0.0001 convention applies only when supplied, not to every symbol bearing a currency name."
    },
    {
      "term": "Keep the sign attached",
      "definition": "Compute end quote minus start quote, then divide by the supplied pip increment. A negative result means the quoted base currency buys fewer quote units. Signed movement is not trade profit: direction of a hypothetical holding and costs would also matter."
    },
    {
      "term": "JPY changes the scale",
      "definition": "For the supplied USD/JPY specification one pip is 0.01 JPY per USD and the fractional display increment is 0.001. Dividing a JPY-style change by 0.0001 would measure it with the wrong ruler. Product specifications remain the authority even where a convention is common."
    }
  ],
  "sections": [
    {
      "id": "s2-4-section-1",
      "title": "Read the measuring ruler",
      "objectiveId": "s2-4-objective-1",
      "competency": "S2_C4_1",
      "paragraphs": [
        "A quote is a rate; a pip is a specified price increment used to describe a change in that rate. Read the product specification before counting digits. The familiar 0.0001 convention applies only when supplied, not to every symbol bearing a currency name."
      ],
      "example": "EUR/USD teaching specification: one pip = 0.0001 USD per EUR; display increment = 0.00001.",
      "misconception": "Every final displayed digit is one pip.",
      "visual": "none",
      "activities": [
        {
          "id": "s2-4-explore-1",
          "kind": "choice",
          "category": "APPLICATION",
          "sectionId": "s2-4-section-1",
          "objectiveId": "s2-4-objective-1",
          "competency": "S2_C4_1",
          "prompt": "With pip 0.0001, how many pips is a change of +0.0007?",
          "critical": true,
          "options": [
            {
              "id": "s2-4-explore-1-a",
              "label": "+7 pips"
            },
            {
              "id": "s2-4-explore-1-b",
              "label": "The final displayed digit is always a whole pip."
            }
          ],
          "correct": "s2-4-explore-1-a"
        }
      ]
    },
    {
      "id": "s2-4-section-2",
      "title": "Keep the sign attached",
      "objectiveId": "s2-4-objective-1",
      "competency": "S2_C4_1",
      "paragraphs": [
        "Compute end quote minus start quote, then divide by the supplied pip increment. A negative result means the quoted base currency buys fewer quote units. Signed movement is not trade profit: direction of a hypothetical holding and costs would also matter."
      ],
      "example": "EUR/USD 1.08420 → 1.08270: −0.00150 / 0.0001 = −15 pips. Absolute movement is 15 pips.",
      "misconception": "Movement must always be a positive number.",
      "visual": "none",
      "activities": [
        {
          "id": "s2-4-explore-2",
          "kind": "choice",
          "category": "APPLICATION",
          "sectionId": "s2-4-section-2",
          "objectiveId": "s2-4-objective-1",
          "competency": "S2_C4_1",
          "prompt": "EUR/USD 1.10640 → 1.10710, pip 0.0001: state signed and absolute movement.",
          "critical": true,
          "options": [
            {
              "id": "s2-4-explore-2-a",
              "label": "+7 pips; absolute 7"
            },
            {
              "id": "s2-4-explore-2-b",
              "label": "Signed movement is always positive."
            }
          ],
          "correct": "s2-4-explore-2-a"
        }
      ]
    },
    {
      "id": "s2-4-section-3",
      "title": "JPY changes the scale",
      "objectiveId": "s2-4-objective-1",
      "competency": "S2_C4_1",
      "paragraphs": [
        "For the supplied USD/JPY specification one pip is 0.01 JPY per USD and the fractional display increment is 0.001. Dividing a JPY-style change by 0.0001 would measure it with the wrong ruler. Product specifications remain the authority even where a convention is common."
      ],
      "example": "USD/JPY 149.325 → 149.185: −0.140 / 0.01 = −14 pips.",
      "misconception": "All currency pairs use the fourth decimal place.",
      "visual": "none",
      "activities": [
        {
          "id": "s2-4-explore-3",
          "kind": "choice",
          "category": "APPLICATION",
          "sectionId": "s2-4-section-3",
          "objectiveId": "s2-4-objective-1",
          "competency": "S2_C4_1",
          "prompt": "USD/JPY 151.240 → 151.395, pip 0.01: measure signed pips.",
          "critical": true,
          "options": [
            {
              "id": "s2-4-explore-3-a",
              "label": "+15.5 pips"
            },
            {
              "id": "s2-4-explore-3-b",
              "label": "Every pair uses 0.0001 per pip."
            }
          ],
          "correct": "s2-4-explore-3-a"
        }
      ]
    },
    {
      "id": "s2-4-section-4",
      "title": "A fraction is still measurable",
      "objectiveId": "s2-4-objective-2",
      "competency": "S2_C4_2",
      "paragraphs": [
        "Displayed precision determines which increments can be shown, not the size of a whole pip. Under a five-decimal EUR/USD display, one final digit is one tenth of a 0.0001 pip. More digits do not establish greater accuracy, liquidity or cheaper execution."
      ],
      "example": "1.20004 → 1.20009 is +0.00005, or +0.5 pip with pip 0.0001.",
      "misconception": "Five displayed decimals mean five pips or better fills.",
      "visual": "none",
      "activities": [
        {
          "id": "s2-4-explore-4",
          "kind": "choice",
          "category": "APPLICATION",
          "sectionId": "s2-4-section-4",
          "objectiveId": "s2-4-objective-2",
          "competency": "S2_C4_2",
          "prompt": "Pip 0.0001 and display 0.00001: express a +0.00003 move in pips and display increments.",
          "critical": true,
          "options": [
            {
              "id": "s2-4-explore-4-a",
              "label": "+0.3 pip and three display increments"
            },
            {
              "id": "s2-4-explore-4-b",
              "label": "Three final digits mean three whole pips."
            }
          ],
          "correct": "s2-4-explore-4-a"
        }
      ]
    },
    {
      "id": "s2-4-section-5",
      "title": "Honor an unfamiliar specification",
      "objectiveId": "s2-4-objective-2",
      "competency": "S2_C4_2",
      "paragraphs": [
        "Pip terminology is not a universal law. A fictional provider may explicitly define a teaching pip of 0.001 and a minimum price increment of 0.0005. Keep that specification visible; if its terms are missing or contradictory, request clarification rather than importing a familiar convention."
      ],
      "example": "Fictional Q/R: pip 0.001, display step 0.0005; 2.4500 → 2.4475 gives −2.5 pips and five downward display steps.",
      "misconception": "A familiar symbol lets me guess the increment.",
      "visual": "none",
      "activities": [
        {
          "id": "s2-4-explore-5",
          "kind": "choice",
          "category": "APPLICATION",
          "sectionId": "s2-4-section-5",
          "objectiveId": "s2-4-objective-2",
          "competency": "S2_C4_2",
          "prompt": "Fictional X/Y pip 0.005: 8.125 → 8.145. Measure the signed movement.",
          "critical": true,
          "options": [
            {
              "id": "s2-4-explore-5-a",
              "label": "+4 pips"
            },
            {
              "id": "s2-4-explore-5-b",
              "label": "Ignore the supplied convention and count decimals."
            }
          ],
          "correct": "s2-4-explore-5-a"
        }
      ]
    },
    {
      "id": "s2-4-section-6",
      "title": "Audit the calculation trail",
      "objectiveId": "s2-4-objective-2",
      "competency": "S2_C4_2",
      "paragraphs": [
        "A useful movement record includes symbol, endpoints in time order, quote units, pip specification, subtraction and signed result. Test the answer by multiplying pips back by the pip increment. This catches scale mistakes before a polished explanation conceals them. Account-currency pip value and sizing wait until Stage 7."
      ],
      "example": "Audit −14 × 0.01 = −0.140 JPY/USD, matching 149.185 − 149.325.",
      "misconception": "A correct-looking pip number needs no units or working.",
      "visual": "none",
      "activities": [
        {
          "id": "s2-4-explore-6",
          "kind": "choice",
          "category": "APPLICATION",
          "sectionId": "s2-4-section-6",
          "objectiveId": "s2-4-objective-2",
          "competency": "S2_C4_2",
          "prompt": "Audit a claim that 148.260 → 148.235 with pip 0.01 is +25 pips; correct it.",
          "critical": true,
          "options": [
            {
              "id": "s2-4-explore-6-a",
              "label": "−2.5 pips; subtraction is −0.025 JPY/USD"
            },
            {
              "id": "s2-4-explore-6-b",
              "label": "+25 pips; no correction is needed."
            }
          ],
          "correct": "s2-4-explore-6-a"
        }
      ]
    }
  ],
  "assessment": [
    {
      "id": "s2-4-check-1",
      "kind": "written",
      "category": "REASONING",
      "sectionId": "s2-4-section-1",
      "objectiveId": "s2-4-objective-1",
      "competency": "S2_C4_1",
      "prompt": "With pip 0.0001, how many pips is a change of +0.0007? Show the governing specification or verification step and explain your conclusion.",
      "rubric": "+7 pips Reject the stated misconception: Every final displayed digit is one pip.",
      "critical": true
    },
    {
      "id": "s2-4-check-2",
      "kind": "written",
      "category": "REASONING",
      "sectionId": "s2-4-section-2",
      "objectiveId": "s2-4-objective-1",
      "competency": "S2_C4_1",
      "prompt": "EUR/USD 1.10640 → 1.10710, pip 0.0001: state signed and absolute movement. Show the governing specification or verification step and explain your conclusion.",
      "rubric": "+7 pips; absolute 7 Reject the stated misconception: Movement must always be a positive number.",
      "critical": true
    },
    {
      "id": "s2-4-check-3",
      "kind": "written",
      "category": "REASONING",
      "sectionId": "s2-4-section-3",
      "objectiveId": "s2-4-objective-1",
      "competency": "S2_C4_1",
      "prompt": "USD/JPY 151.240 → 151.395, pip 0.01: measure signed pips. Show the governing specification or verification step and explain your conclusion.",
      "rubric": "+15.5 pips Reject the stated misconception: All currency pairs use the fourth decimal place.",
      "critical": true
    },
    {
      "id": "s2-4-check-4",
      "kind": "written",
      "category": "REASONING",
      "sectionId": "s2-4-section-4",
      "objectiveId": "s2-4-objective-2",
      "competency": "S2_C4_2",
      "prompt": "Pip 0.0001 and display 0.00001: express a +0.00003 move in pips and display increments. Show the governing specification or verification step and explain your conclusion.",
      "rubric": "+0.3 pip and three display increments Reject the stated misconception: Five displayed decimals mean five pips or better fills.",
      "critical": true
    },
    {
      "id": "s2-4-check-5",
      "kind": "written",
      "category": "REASONING",
      "sectionId": "s2-4-section-5",
      "objectiveId": "s2-4-objective-2",
      "competency": "S2_C4_2",
      "prompt": "Fictional X/Y pip 0.005: 8.125 → 8.145. Measure the signed movement. Show the governing specification or verification step and explain your conclusion.",
      "rubric": "+4 pips Reject the stated misconception: A familiar symbol lets me guess the increment.",
      "critical": true
    },
    {
      "id": "s2-4-check-6",
      "kind": "written",
      "category": "REASONING",
      "sectionId": "s2-4-section-6",
      "objectiveId": "s2-4-objective-2",
      "competency": "S2_C4_2",
      "prompt": "Audit a claim that 148.260 → 148.235 with pip 0.01 is +25 pips; correct it. Show the governing specification or verification step and explain your conclusion.",
      "rubric": "−2.5 pips; subtraction is −0.025 JPY/USD Reject the stated misconception: A correct-looking pip number needs no units or working.",
      "critical": true
    },
    {
      "id": "stage-2-class-4-fresh-objective-0",
      "kind": "choice",
      "category": "KNOWLEDGE",
      "sectionId": "s2-4-section-1",
      "objectiveId": "s2-4-objective-1",
      "competency": "S2_C4_1",
      "prompt": "A specified pip is0.0001. EUR/USD1.2460→1.2477. Signed movement?",
      "options": [
        {
          "id": "o0",
          "label": "+1.7 pips"
        },
        {
          "id": "o1",
          "label": "+17 pips"
        },
        {
          "id": "o2",
          "label": "−17 pips"
        }
      ],
      "correct": "o1",
      "critical": true
    },
    {
      "id": "stage-2-class-4-fresh-objective-1",
      "kind": "choice",
      "category": "KNOWLEDGE",
      "sectionId": "s2-4-section-4",
      "objectiveId": "s2-4-objective-2",
      "competency": "S2_C4_2",
      "prompt": "USD/JPY pip0.01, display increment0.001:146.201→146.207. Movement?",
      "options": [
        {
          "id": "o0",
          "label": "+6 pips"
        },
        {
          "id": "o1",
          "label": "+0.06 pip"
        },
        {
          "id": "o2",
          "label": "+0.6 pip"
        }
      ],
      "correct": "o2",
      "critical": true
    }
  ],
  "homework": [
    {
      "id": "s2-4-homework-1",
      "kind": "written",
      "category": "HOMEWORK",
      "sectionId": "s2-4-section-1",
      "objectiveId": "s2-4-objective-1",
      "competency": "S2_C4_1",
      "prompt": "Signed movement worksheet: Using EUR/USD pip 0.0001, calculate 1.09135 → 1.08980; using USD/JPY pip 0.01, calculate 147.815 → 148.060. Show quote-unit subtraction, signed and absolute pips and multiplication checks.",
      "rubric": "Requires −15.5 and +24.5 pips with both denominators, direction, units and inverse checks; assess this calculation independently.",
      "critical": true
    },
    {
      "id": "s2-4-homework-2",
      "kind": "written",
      "category": "HOMEWORK",
      "sectionId": "s2-4-section-4",
      "objectiveId": "s2-4-objective-2",
      "competency": "S2_C4_2",
      "prompt": "Precision correction memo: Fictional C/D specifies pip 0.002, display increment 0.0002. A learner calls 3.5000 → 3.5014 seven pips because seven final increments changed. Correct the claim, show both counts and explain why a missing specification would require clarification.",
      "rubric": "Requires +0.7 pip, seven display increments, distinction between precision and convention, and explicit refusal to guess; assess separately from signed worksheet.",
      "critical": true
    }
  ],
  "remediation": [
    {
      "competency": "S2_C4_1",
      "sectionId": "s2-4-section-1",
      "title": "Direction and divisor clinic",
      "paragraph": "Place the later quote second before subtracting. Write the pip increment with units under the fraction. Keep the original response and submit this changed case as a new attempt for individual review. Select the fresh worked relationship, then demonstrate your full reasoning in the separately reviewed reassessment.",
      "reinforcement": {
        "id": "s2-4-reinforcement-1",
        "kind": "choice",
        "category": "KNOWLEDGE",
        "sectionId": "s2-4-section-1",
        "objectiveId": "s2-4-objective-1",
        "competency": "S2_C4_1",
        "prompt": "EUR/USD pip0.0001:1.07380→1.07260. Signed movement?",
        "options": [
          {
            "id": "r0",
            "label": "−1.2 pips"
          },
          {
            "id": "r1",
            "label": "−12 pips"
          },
          {
            "id": "r2",
            "label": "+12 pips"
          }
        ],
        "correct": "r1",
        "critical": true
      }
    },
    {
      "competency": "S2_C4_2",
      "sectionId": "s2-4-section-4",
      "title": "Rebuild the digit ruler",
      "paragraph": "Draw a whole pip as a bar, then partition it into the specified display increments; do not count digits as whole pips. Keep the original response and submit this changed case as a new attempt for individual review. Select the fresh worked relationship, then demonstrate your full reasoning in the separately reviewed reassessment.",
      "reinforcement": {
        "id": "s2-4-reinforcement-2",
        "kind": "choice",
        "category": "KNOWLEDGE",
        "sectionId": "s2-4-section-4",
        "objectiveId": "s2-4-objective-2",
        "competency": "S2_C4_2",
        "prompt": "USD/JPY pip0.01, increment0.001:153.006→153.011. Movement?",
        "options": [
          {
            "id": "r0",
            "label": "+0.5pip and5increments"
          },
          {
            "id": "r1",
            "label": "+5pips"
          },
          {
            "id": "r2",
            "label": "+0.05pip"
          }
        ],
        "correct": "r0",
        "critical": true
      }
    }
  ],
  "liveGuide": [
    {
      "title": "Read the measuring ruler",
      "minutes": 10,
      "talkingPoints": [
        "A quote is a rate; a pip is a specified price increment used to describe a change in that rate. Read the product specification before counting digits. The familiar 0.0001 convention applies only when supplied, not to every symbol bearing a currency name.",
        "Put 1.08420 on the board. Underline the 0.0001 place, move one pip, then move only the last displayed digit. Invite learners to identify which move was smaller.",
        "Use minutes 0–3 for explanation and the displayed example; minutes 3–6 for the demonstration: EUR/USD teaching specification: one pip = 0.0001 USD per EUR; display increment = 0.00001.",
        "Use minutes 6–8 for an individual response before discussion. Contrast the proposed answer with this claim: Every final displayed digit is one pip.",
        "Use minutes 8–10 to compare reasoning and record a corrected explanation; do not count attendance as mastery."
      ],
      "activity": {
        "kind": "POLL",
        "prompt": "With pip 0.0001, how many pips is a change of +0.0007? Give the reason before the instructor reveals the worked answer.",
        "sectionId": "s2-4-section-1"
      }
    },
    {
      "title": "Keep the sign attached",
      "minutes": 10,
      "talkingPoints": [
        "Compute end quote minus start quote, then divide by the supplied pip increment. A negative result means the quoted base currency buys fewer quote units. Signed movement is not trade profit: direction of a hypothetical holding and costs would also matter.",
        "Reveal start and end separately. Collect a direction vote before permitting arithmetic; reverse the arrow and ask what must change while its magnitude stays fixed.",
        "Use minutes 0–3 for explanation and the displayed example; minutes 3–6 for the demonstration: EUR/USD 1.08420 → 1.08270: −0.00150 / 0.0001 = −15 pips. Absolute movement is 15 pips.",
        "Use minutes 6–8 for an individual response before discussion. Contrast the proposed answer with this claim: Movement must always be a positive number.",
        "Use minutes 8–10 to compare reasoning and record a corrected explanation; do not count attendance as mastery."
      ],
      "activity": {
        "kind": "WRITTEN",
        "prompt": "EUR/USD 1.10640 → 1.10710, pip 0.0001: state signed and absolute movement. Give the reason before the instructor reveals the worked answer.",
        "sectionId": "s2-4-section-2"
      }
    },
    {
      "title": "JPY changes the scale",
      "minutes": 10,
      "talkingPoints": [
        "For the supplied USD/JPY specification one pip is 0.01 JPY per USD and the fractional display increment is 0.001. Dividing a JPY-style change by 0.0001 would measure it with the wrong ruler. Product specifications remain the authority even where a convention is common.",
        "Place EUR/USD and USD/JPY rulers beside one another. Ask students to circle the supplied denominator first, calculate separately, then explain the hundredfold error from reusing 0.0001.",
        "Use minutes 0–3 for explanation and the displayed example; minutes 3–6 for the demonstration: USD/JPY 149.325 → 149.185: −0.140 / 0.01 = −14 pips.",
        "Use minutes 6–8 for an individual response before discussion. Contrast the proposed answer with this claim: All currency pairs use the fourth decimal place.",
        "Use minutes 8–10 to compare reasoning and record a corrected explanation; do not count attendance as mastery."
      ],
      "activity": {
        "kind": "SINGLE",
        "prompt": "USD/JPY 151.240 → 151.395, pip 0.01: measure signed pips. Give the reason before the instructor reveals the worked answer.",
        "sectionId": "s2-4-section-3"
      }
    },
    {
      "title": "A fraction is still measurable",
      "minutes": 10,
      "talkingPoints": [
        "Displayed precision determines which increments can be shown, not the size of a whole pip. Under a five-decimal EUR/USD display, one final digit is one tenth of a 0.0001 pip. More digits do not establish greater accuracy, liquidity or cheaper execution.",
        "Reveal five final-digit steps, one at a time. Ask the room when a whole pip has been traversed. Continue to ten and distinguish a display count from a pip count.",
        "Use minutes 0–3 for explanation and the displayed example; minutes 3–6 for the demonstration: 1.20004 → 1.20009 is +0.00005, or +0.5 pip with pip 0.0001.",
        "Use minutes 6–8 for an individual response before discussion. Contrast the proposed answer with this claim: Five displayed decimals mean five pips or better fills.",
        "Use minutes 8–10 to compare reasoning and record a corrected explanation; do not count attendance as mastery."
      ],
      "activity": {
        "kind": "POLL",
        "prompt": "Pip 0.0001 and display 0.00001: express a +0.00003 move in pips and display increments. Give the reason before the instructor reveals the worked answer.",
        "sectionId": "s2-4-section-4"
      }
    },
    {
      "title": "Honor an unfamiliar specification",
      "minutes": 10,
      "talkingPoints": [
        "Pip terminology is not a universal law. A fictional provider may explicitly define a teaching pip of 0.001 and a minimum price increment of 0.0005. Keep that specification visible; if its terms are missing or contradictory, request clarification rather than importing a familiar convention.",
        "Give pairs different specifications for identical endpoints. Compare their valid but different pip counts, then remove one specification and collect a safe refusal rather than a guess.",
        "Use minutes 0–3 for explanation and the displayed example; minutes 3–6 for the demonstration: Fictional Q/R: pip 0.001, display step 0.0005; 2.4500 → 2.4475 gives −2.5 pips and five downward display steps.",
        "Use minutes 6–8 for an individual response before discussion. Contrast the proposed answer with this claim: A familiar symbol lets me guess the increment.",
        "Use minutes 8–10 to compare reasoning and record a corrected explanation; do not count attendance as mastery."
      ],
      "activity": {
        "kind": "WRITTEN",
        "prompt": "Fictional X/Y pip 0.005: 8.125 → 8.145. Measure the signed movement. Give the reason before the instructor reveals the worked answer.",
        "sectionId": "s2-4-section-5"
      }
    },
    {
      "title": "Audit the calculation trail",
      "minutes": 10,
      "talkingPoints": [
        "A useful movement record includes symbol, endpoints in time order, quote units, pip specification, subtraction and signed result. Test the answer by multiplying pips back by the pip increment. This catches scale mistakes before a polished explanation conceals them. Account-currency pip value and sizing wait until Stage 7.",
        "Display an intentionally wrong +25 result. Give individuals two quiet minutes to diagnose direction and denominator, then have a partner verify the corrected result by multiplication.",
        "Use minutes 0–3 for explanation and the displayed example; minutes 3–6 for the demonstration: Audit −14 × 0.01 = −0.140 JPY/USD, matching 149.185 − 149.325.",
        "Use minutes 6–8 for an individual response before discussion. Contrast the proposed answer with this claim: A correct-looking pip number needs no units or working.",
        "Use minutes 8–10 to compare reasoning and record a corrected explanation; do not count attendance as mastery."
      ],
      "activity": {
        "kind": "WRITTEN",
        "prompt": "Audit a claim that 148.260 → 148.235 with pip 0.01 is +25 pips; correct it. Give the reason before the instructor reveals the worked answer.",
        "sectionId": "s2-4-section-6"
      }
    }
  ],
  "studyGuide": {
    "summary": [
      "Start with an instrument’s measuring convention, then subtract the endpoints in chronological order. The quotient is a signed movement, not an account-currency profit.",
      "A fractional display increment partitions the supplied pip. More decimals describe representation and do not promise execution quality.",
      "Reverse multiplication is a quick scale check. If the product specification is absent, preserve the question rather than inventing a denominator."
    ],
    "bigPicture": "Calculate signed pip movements using the supplied instrument convention. Distinguish pip, fractional pip and displayed precision without universal decimal rules.",
    "fiveThings": [
      "+7 pips",
      "+7 pips; absolute 7",
      "+15.5 pips",
      "+0.3 pip and three display increments",
      "+4 pips"
    ],
    "outcomes": [
      "Calculate signed pip movements using the supplied instrument convention.",
      "Distinguish pip, fractional pip and displayed precision without universal decimal rules."
    ],
    "examples": [
      "EUR/USD pip 0.0001: 1.07380 → 1.07260. Show signed movement and reverse-check. Worked check: −12 pips; −12 × 0.0001 = −0.0012.",
      "USD/JPY pip 0.01, display step 0.001: 153.006 → 153.011. Explain both counts. Worked check: +0.5 pip; five display increments with explicit distinction."
    ],
    "misconceptions": [
      "Every final displayed digit is one pip.",
      "Movement must always be a positive number.",
      "All currency pairs use the fourth decimal place.",
      "Five displayed decimals mean five pips or better fills.",
      "A familiar symbol lets me guess the increment.",
      "A correct-looking pip number needs no units or working."
    ],
    "review": [
      {
        "sectionId": "s2-4-section-1",
        "label": "Read the measuring ruler"
      },
      {
        "sectionId": "s2-4-section-2",
        "label": "Keep the sign attached"
      },
      {
        "sectionId": "s2-4-section-3",
        "label": "JPY changes the scale"
      },
      {
        "sectionId": "s2-4-section-4",
        "label": "A fraction is still measurable"
      },
      {
        "sectionId": "s2-4-section-5",
        "label": "Honor an unfamiliar specification"
      },
      {
        "sectionId": "s2-4-section-6",
        "label": "Audit the calculation trail"
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
      "title": "OANDA: supplied pip conventions and price units",
      "url": "https://www.oanda.com/ca-en/skills-and-insights/education/introduction-trading/basics/what-is-a-pip/"
    },
    {
      "title": "OANDA product disclosure statement",
      "url": "https://legal.oanda.com/?code=product_disclosure_statement&language=en"
    }
  ],
  "design": {
    "format": "Specification-led digit ruler and signed-movement audit",
    "homeworkTitle": "Signed movement worksheet / Precision correction memo",
    "homeworkIntro": "Submit both tasks as durable written evidence. Each competency receives its own review; preserve original attempts and submit corrections as new evidence.",
    "pacing": {
      "minimum": 50,
      "maximum": 75
    },
    "assessmentCoverage": [
      "S2_C4_1",
      "S2_C4_2"
    ],
    "practicalRequirement": "Saved written calculations and explanations are required for each competency. No funded account, personal allocation, order submission or chart credit is required.",
    "studyGuideChecks": [
      "Cover the examples: supply your own declining quote and show why signed movement is negative while magnitude is positive.",
      "Why would a JPY display with three decimals not make 0.001 one whole pip when the contract specifies 0.01?",
      "Given a nonstandard pip of 0.002 and display step 0.0002, explain the ratio without reusing the fourth-decimal rule."
    ],
    "studyGuideVisual": {
      "kind": "quote",
      "nodes": [
        {
          "label": "Specification first",
          "detail": "Write symbol, quote units, whole-pip increment and display step."
        },
        {
          "label": "Direction second",
          "detail": "Keep start → end order; end minus start carries the sign."
        },
        {
          "label": "Measure and audit",
          "detail": "Divide by pip, then multiply back to recover the quote difference."
        },
        {
          "label": "Representation limit",
          "detail": "A display step can be a fraction of a pip; neither is account-currency value."
        }
      ],
      "caption": "Review path from quote specification to auditable signed movement."
    }
  }
};
