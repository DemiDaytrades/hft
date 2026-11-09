import 'server-only';
import type {StageClass} from '../stage/contracts';
export const CLASS_S3_4:StageClass = {
  "id": "stage-3-class-4",
  "version": "chart-foundations-s3-4.1.0.0",
  "stageId": "stage-3",
  "number": 4,
  "title": "Local Highs, Lows and Price Sequences",
  "description": "For this class use one completed bar on each side. A high pivot has a strictly higher high than both neighbors; a low pivot has a strictly lower low. Ties fail. This is a local classroom convention, not a trading rule.",
  "courseId": "hft-school-foundations",
  "lessonId": "hft-school-s3-4",
  "prerequisites": [
    "stage-3-class-3"
  ],
  "liveMinutes": 60,
  "reviewMinutes": 30,
  "objectives": [
    {
      "id": "s3-4-objective-1",
      "text": "Apply a strict one-completed-neighbor local-pivot convention including ties and edges.",
      "competency": "LOCAL_PIVOT_RULE"
    },
    {
      "id": "s3-4-objective-2",
      "text": "Record pivot coordinates separately from their earliest confirmation times without future data.",
      "competency": "PIVOT_KNOWLEDGE_TIME"
    }
  ],
  "terms": [
    {
      "term": "Specify the comparison rule",
      "definition": "For this class use one completed bar on each side. A high pivot has a strictly higher high than both neighbors; a low pivot has a strictly lower low. Ties fail. This is a local classroom convention, not a trading rule."
    },
    {
      "term": "Separate candidate from confirmation",
      "definition": "A bar exceeding its left neighbor is only a candidate while the right neighbor is absent. The next completed bar may confirm or disqualify it. Never use an unseen bar in a present-time answer."
    },
    {
      "term": "Apply lows independently",
      "definition": "Compare lows with lows and highs with highs. A candle color does not determine either pivot type. An outside bar can satisfy both conventions once its neighbors exist."
    },
    {
      "term": "Handle edges and ties",
      "definition": "The first and last visible bars lack a required neighbor. Mark them unconfirmed within this window. Equal highs do not satisfy strict superiority; preserve the tie rather than silently changing the rule."
    },
    {
      "term": "Record two times",
      "definition": "Store both the pivot coordinate and earliest confirmation time. Then order confirmed highs and lows separately to describe their sequence. Keep the original pre-reveal judgment when later bars arrive."
    }
  ],
  "sections": [
    {
      "id": "s3-4-section-1",
      "title": "Specify the comparison rule",
      "objectiveId": "s3-4-objective-1",
      "competency": "LOCAL_PIVOT_RULE",
      "paragraphs": [
        "For this class use one completed bar on each side. A high pivot has a strictly higher high than both neighbors; a low pivot has a strictly lower low. Ties fail. This is a local classroom convention, not a trading rule.",
        "Apply the rule to highs and lows independently. The convention uses adjacent bar extremes, not the color or location of a candle body."
      ],
      "example": "Highs 102,104,103 make the middle high eligible only after the third bar closes.",
      "misconception": "A label without a window and tie policy is not reproducible.",
      "visual": "none",
      "activities": [
        {
          "id": "s3-4-observe-1",
          "kind": "choice",
          "category": "PRACTICAL",
          "sectionId": "s3-4-section-1",
          "objectiveId": "s3-4-objective-1",
          "competency": "LOCAL_PIVOT_RULE",
          "prompt": "Under strict one-neighbor highs,09:01 H104 versus H102/H103 is what after09:02 closes?",
          "options": [
            {
              "id": "observed",
              "label": "Confirmed local high"
            },
            {
              "id": "unsupported",
              "label": "Disqualified because09:01 closes higher"
            }
          ],
          "correct": "observed"
        }
      ]
    },
    {
      "id": "s3-4-section-2",
      "title": "Separate candidate from confirmation",
      "objectiveId": "s3-4-objective-1",
      "competency": "LOCAL_PIVOT_RULE",
      "paragraphs": [
        "A bar exceeding its left neighbor is only a candidate while the right neighbor is absent. The next completed bar may confirm or disqualify it. Never use an unseen bar in a present-time answer.",
        "Keep09:01 as a candidate in the paused record. The current view supplies no right-neighbor high; a future confirmation must be recorded in a later revision."
      ],
      "example": "At 09:01 close, H104 is a candidate; at 09:02 close H103 confirms it.",
      "misconception": "Placing a historical marker at 09:01 does not make it knowable then.",
      "visual": "none",
      "activities": [
        {
          "id": "s3-4-observe-2",
          "kind": "choice",
          "category": "PRACTICAL",
          "sectionId": "s3-4-section-2",
          "objectiveId": "s3-4-objective-1",
          "competency": "LOCAL_PIVOT_RULE",
          "prompt": "Only09:00 and09:01 are revealed. What is09:01 H104?",
          "options": [
            {
              "id": "observed",
              "label": "Candidate; right neighbor unavailable"
            },
            {
              "id": "unsupported",
              "label": "Confirmed; it exceeds its left neighbor"
            }
          ],
          "correct": "observed"
        }
      ]
    },
    {
      "id": "s3-4-section-3",
      "title": "Apply lows independently",
      "objectiveId": "s3-4-objective-1",
      "competency": "LOCAL_PIVOT_RULE",
      "paragraphs": [
        "Compare lows with lows and highs with highs. A candle color does not determine either pivot type. An outside bar can satisfy both conventions once its neighbors exist.",
        "At09:04 close compare09:03 L98 against09:02 L101 and09:04 L99. Both strict inequalities hold, giving a confirmed local low."
      ],
      "example": "Lows 100,98,99 form a low pivot at the middle bar.",
      "misconception": "Selecting the reddest candle is not applying the rule.",
      "visual": "none",
      "activities": [
        {
          "id": "s3-4-observe-3",
          "kind": "choice",
          "category": "PRACTICAL",
          "sectionId": "s3-4-section-3",
          "objectiveId": "s3-4-objective-1",
          "competency": "LOCAL_PIVOT_RULE",
          "prompt": "09:03 L98 versus adjacent L101/L99 is what after09:04 closes?",
          "options": [
            {
              "id": "observed",
              "label": "Confirmed local low"
            },
            {
              "id": "unsupported",
              "label": "Not a low because its candle closes lower"
            }
          ],
          "correct": "observed"
        }
      ]
    },
    {
      "id": "s3-4-section-4",
      "title": "Handle edges and ties",
      "objectiveId": "s3-4-objective-2",
      "competency": "PIVOT_KNOWLEDGE_TIME",
      "paragraphs": [
        "The first and last visible bars lack a required neighbor. Mark them unconfirmed within this window. Equal highs do not satisfy strict superiority; preserve the tie rather than silently changing the rule.",
        "Write “insufficient neighbor” for a final edge, and “tie” for equal comparison highs. Those are distinct reasons to withhold a confirmed label."
      ],
      "example": "Highs 102,104,104 have no strict middle high pivot.",
      "misconception": "A visible edge is not automatically a pivot.",
      "visual": "none",
      "activities": [
        {
          "id": "s3-4-observe-4",
          "kind": "choice",
          "category": "PRACTICAL",
          "sectionId": "s3-4-section-4",
          "objectiveId": "s3-4-objective-2",
          "competency": "PIVOT_KNOWLEDGE_TIME",
          "prompt": "Highs102,104,104 under this rule yield what for the middle?",
          "options": [
            {
              "id": "observed",
              "label": "No pivot; tie fails strict comparison"
            },
            {
              "id": "unsupported",
              "label": "A pivot because one side is lower"
            }
          ],
          "correct": "observed"
        }
      ]
    },
    {
      "id": "s3-4-section-5",
      "title": "Record two times",
      "objectiveId": "s3-4-objective-2",
      "competency": "PIVOT_KNOWLEDGE_TIME",
      "paragraphs": [
        "Store both the pivot coordinate and earliest confirmation time. Then order confirmed highs and lows separately to describe their sequence. Keep the original pre-reveal judgment when later bars arrive.",
        "Use two columns: event coordinate and first-knowable time. A chart marker drawn at the event coordinate must never be mistaken for information available at that same instant."
      ],
      "example": "Pivot coordinate 09:01 H104; first knowable at 09:02 close.",
      "misconception": "A later revision must not erase the earlier candidate record.",
      "visual": "none",
      "activities": [
        {
          "id": "s3-4-observe-5",
          "kind": "choice",
          "category": "PRACTICAL",
          "sectionId": "s3-4-section-5",
          "objectiveId": "s3-4-objective-2",
          "competency": "PIVOT_KNOWLEDGE_TIME",
          "prompt": "When was09:03 L98 first confirmable?",
          "options": [
            {
              "id": "observed",
              "label": "09:04 close"
            },
            {
              "id": "unsupported",
              "label": "09:03 close"
            }
          ],
          "correct": "observed"
        }
      ]
    }
  ],
  "assessment": [
    {
      "id": "s3-4-check-1",
      "kind": "written",
      "category": "PRACTICAL",
      "sectionId": "s3-4-section-1",
      "objectiveId": "s3-4-objective-1",
      "competency": "LOCAL_PIVOT_RULE",
      "prompt": "Fresh UTC completed bars at13:00–13:05: O8 H10 L7 C9; O9 H13 L8 C12; O12 H12 L6 C7; O7 H12 L7 C11; O11 H12 L8 C9; O9 H11 L7 C8. Use exactly one completed neighbor each side; strict comparisons, ties fail. Match first high and low coordinates and confirmation moments. Mark all eligible pivots, edge limitations and tied highs; reconstruct the candidate status as of13:01 close using only bars that would then have been available. Demonstrate construction or coordinate selection on these fresh values. This is a retrospective as-of analysis. It does not prove a blind pre-reveal decision.",
      "rubric": "Require high13 at13:01 confirmed13:02; low6 at13:02 confirmed13:03; highs12 at13:03/13:04 fail ties; first/last cannot confirm within window;13:01 pre-reveal high remains candidate; no future data used. Numeric OHLC construction is valid despite gaps; preserve original candidate and later revision. Credit accurate as-of coordinates and knowledge-time reasoning only; do not credit independently recorded pre-reveal integrity.",
      "critical": true
    },
    {
      "id": "s3-4-check-2",
      "kind": "written",
      "category": "PRACTICAL",
      "sectionId": "s3-4-section-5",
      "objectiveId": "s3-4-objective-2",
      "competency": "PIVOT_KNOWLEDGE_TIME",
      "prompt": "Fresh UTC completed bars at13:00–13:05: O8 H10 L7 C9; O9 H13 L8 C12; O12 H12 L6 C7; O7 H12 L7 C11; O11 H12 L8 C9; O9 H11 L7 C8. Use exactly one completed neighbor each side; strict comparisons, ties fail. Match first high and low coordinates and confirmation moments. Mark all eligible pivots, edge limitations and tied highs; reconstruct the candidate status as of13:01 close using only bars that would then have been available. State the information limit and explain the bounded interpretation. This is a retrospective as-of analysis. It does not prove a blind pre-reveal decision.",
      "rubric": "Require high13 at13:01 confirmed13:02; low6 at13:02 confirmed13:03; highs12 at13:03/13:04 fail ties; first/last cannot confirm within window;13:01 pre-reveal high remains candidate; no future data used. Numeric OHLC construction is valid despite gaps; preserve original candidate and later revision. Credit accurate as-of coordinates and knowledge-time reasoning only; do not credit independently recorded pre-reveal integrity.",
      "critical": true
    },
    {
      "id": "stage-3-class-4-fresh-objective-0",
      "kind": "choice",
      "category": "KNOWLEDGE",
      "sectionId": "s3-4-section-1",
      "objectiveId": "s3-4-objective-1",
      "competency": "LOCAL_PIVOT_RULE",
      "prompt": "Strict one-neighbour highs9,14,12: earliest confirmation of the middle pivot?",
      "options": [
        {
          "id": "o0",
          "label": "At middle bar close"
        },
        {
          "id": "o1",
          "label": "After right neighbour closes"
        },
        {
          "id": "o2",
          "label": "Before middle bar opens"
        }
      ],
      "correct": "o1",
      "critical": true
    },
    {
      "id": "stage-3-class-4-fresh-objective-1",
      "kind": "choice",
      "category": "KNOWLEDGE",
      "sectionId": "s3-4-section-4",
      "objectiveId": "s3-4-objective-2",
      "competency": "PIVOT_KNOWLEDGE_TIME",
      "prompt": "Strict one-neighbour highs9,14,14: middle high is?",
      "options": [
        {
          "id": "o0",
          "label": "Confirmed strict pivot"
        },
        {
          "id": "o1",
          "label": "Guaranteed reversal"
        },
        {
          "id": "o2",
          "label": "Not a strict pivot: tie fails"
        }
      ],
      "correct": "o2",
      "critical": true
    }
  ],
  "homework": [
    {
      "id": "s3-4-homework-coordinates",
      "kind": "matching",
      "category": "PRACTICAL",
      "sectionId": "s3-4-section-1",
      "objectiveId": "s3-4-objective-1",
      "competency": "LOCAL_PIVOT_RULE",
      "prompt": "Fresh UTC completed bars at13:00–13:05: O8 H10 L7 C9; O9 H13 L8 C12; O12 H12 L6 C7; O7 H12 L7 C11; O11 H12 L8 C9; O9 H11 L7 C8. Use exactly one completed neighbor each side; strict comparisons, ties fail. Match first high and low coordinates and confirmation moments. Mark all eligible pivots, edge limitations and tied highs; reconstruct the candidate status as of13:01 close using only bars that would then have been available.",
      "items": [
        {
          "id": "point-0",
          "label": "First high coordinate"
        },
        {
          "id": "point-1",
          "label": "First high confirmation"
        },
        {
          "id": "point-2",
          "label": "First low coordinate"
        },
        {
          "id": "point-3",
          "label": "First low confirmation"
        }
      ],
      "targets": [
        {
          "id": "value-0",
          "label": "13:01 high13"
        },
        {
          "id": "value-1",
          "label": "13:02 close"
        },
        {
          "id": "value-2",
          "label": "13:02 low6"
        },
        {
          "id": "value-3",
          "label": "13:03 close"
        }
      ],
      "correct": {
        "point-0": "value-0",
        "point-1": "value-1",
        "point-2": "value-2",
        "point-3": "value-3"
      },
      "rubric": "Select each exact labeled coordinate/relationship from the supplied fresh case. All mappings must agree with the data; no partial substitution of a definition for the coordinate task."
    },
    {
      "id": "s3-4-homework-chart",
      "kind": "written",
      "category": "PRACTICAL",
      "sectionId": "s3-4-section-5",
      "objectiveId": "s3-4-objective-2",
      "competency": "PIVOT_KNOWLEDGE_TIME",
      "prompt": "Fresh UTC completed bars at13:00–13:05: O8 H10 L7 C9; O9 H13 L8 C12; O12 H12 L6 C7; O7 H12 L7 C11; O11 H12 L8 C9; O9 H11 L7 C8. Use exactly one completed neighbor each side; strict comparisons, ties fail. Match first high and low coordinates and confirmation moments. Mark all eligible pivots, edge limitations and tied highs; reconstruct the candidate status as of13:01 close using only bars that would then have been available. Submit the labeled coordinates/annotations and short reasoning in this response; use the supplied table as an equal alternative to drawing. Your original submission and teacher review remain in the current class attempt record. This is a retrospective as-of analysis. It does not prove a blind pre-reveal decision.",
      "rubric": "Require high13 at13:01 confirmed13:02; low6 at13:02 confirmed13:03; highs12 at13:03/13:04 fail ties; first/last cannot confirm within window;13:01 pre-reveal high remains candidate; no future data used. Numeric OHLC construction is valid despite gaps; preserve original candidate and later revision. Credit accurate as-of coordinates and knowledge-time reasoning only; do not credit independently recorded pre-reveal integrity.",
      "critical": true
    }
  ],
  "remediation": [
    {
      "competency": "LOCAL_PIVOT_RULE",
      "sectionId": "s3-4-section-1",
      "title": "Rebuild coordinates and construction",
      "paragraph": "Keep the failed attempt. Revisit Specify the comparison rule; use the changed numeric/context case below, then explain the corrected observation in your own labeled record. No, the tie fails.",
      "reinforcement": {
        "id": "s3-4-retry-1",
        "kind": "choice",
        "category": "PRACTICAL",
        "sectionId": "s3-4-section-1",
        "objectiveId": "s3-4-objective-1",
        "competency": "LOCAL_PIVOT_RULE",
        "prompt": "Fresh highs8,11,11 under strict one-neighbor rule: middle pivot?",
        "options": [
          {
            "id": "valid",
            "label": "No, the tie fails."
          },
          {
            "id": "invalid",
            "label": "Yes, it is above the left bar."
          }
        ],
        "correct": "valid",
        "critical": true
      }
    },
    {
      "competency": "PIVOT_KNOWLEDGE_TIME",
      "sectionId": "s3-4-section-5",
      "title": "Rebuild the evidence boundary",
      "paragraph": "Keep the failed attempt. Revisit Record two times; use the changed numeric/context case below, then explain the corrected observation in your own labeled record. After the third bar closes.",
      "reinforcement": {
        "id": "s3-4-retry-2",
        "kind": "choice",
        "category": "PRACTICAL",
        "sectionId": "s3-4-section-5",
        "objectiveId": "s3-4-objective-2",
        "competency": "PIVOT_KNOWLEDGE_TIME",
        "prompt": "Fresh highs8,12,10: when is the middle high confirmable?",
        "options": [
          {
            "id": "valid",
            "label": "After the third bar closes."
          },
          {
            "id": "invalid",
            "label": "When the middle bar closes."
          }
        ],
        "correct": "valid",
        "critical": true
      }
    }
  ],
  "liveGuide": [
    {
      "title": "Specify the comparison rule: demonstrate, pause, compare",
      "minutes": 12,
      "talkingPoints": [
        "0–3 min: demonstrate with the labeled shared rows. Highs 102,104,103 make the middle high eligible only after the third bar closes.",
        "3–6 min: individual response before group discussion. For this class use one completed bar on each side. A high pivot has a strictly higher high than both neighbors; a low pivot has a strictly lower low. Ties fail. This is a local classroom convention, not a trading rule.",
        "6–9 min: compare two learner answers against the data. A label without a window and tie policy is not reproducible.",
        "9–12 min: each learner corrects one coordinate and preserves the original; facilitator checks the stated evidence boundary."
      ],
      "activity": {
        "kind": "POLL",
        "prompt": "Highs 102,104,103 make the middle high eligible only after the third bar closes. Demonstrate specify the comparison rule using one labeled coordinate and name an unsupported inference.",
        "sectionId": "s3-4-section-1"
      }
    },
    {
      "title": "Separate candidate from confirmation: demonstrate, pause, compare",
      "minutes": 12,
      "talkingPoints": [
        "0–3 min: demonstrate with the labeled shared rows. At 09:01 close, H104 is a candidate; at 09:02 close H103 confirms it.",
        "3–6 min: individual response before group discussion. A bar exceeding its left neighbor is only a candidate while the right neighbor is absent. The next completed bar may confirm or disqualify it. Never use an unseen bar in a present-time answer.",
        "6–9 min: compare two learner answers against the data. Placing a historical marker at 09:01 does not make it knowable then.",
        "9–12 min: each learner corrects one coordinate and preserves the original; facilitator checks the stated evidence boundary."
      ],
      "activity": {
        "kind": "SINGLE",
        "prompt": "At 09:01 close, H104 is a candidate; at 09:02 close H103 confirms it. Demonstrate separate candidate from confirmation using one labeled coordinate and name an unsupported inference.",
        "sectionId": "s3-4-section-2"
      }
    },
    {
      "title": "Apply lows independently: demonstrate, pause, compare",
      "minutes": 12,
      "talkingPoints": [
        "0–3 min: demonstrate with the labeled shared rows. Lows 100,98,99 form a low pivot at the middle bar.",
        "3–6 min: individual response before group discussion. Compare lows with lows and highs with highs. A candle color does not determine either pivot type. An outside bar can satisfy both conventions once its neighbors exist.",
        "6–9 min: compare two learner answers against the data. Selecting the reddest candle is not applying the rule.",
        "9–12 min: each learner corrects one coordinate and preserves the original; facilitator checks the stated evidence boundary."
      ],
      "activity": {
        "kind": "WRITTEN",
        "prompt": "Lows 100,98,99 form a low pivot at the middle bar. Demonstrate apply lows independently using one labeled coordinate and name an unsupported inference.",
        "sectionId": "s3-4-section-3"
      }
    },
    {
      "title": "Handle edges and ties: demonstrate, pause, compare",
      "minutes": 12,
      "talkingPoints": [
        "0–3 min: demonstrate with the labeled shared rows. Highs 102,104,104 have no strict middle high pivot.",
        "3–6 min: individual response before group discussion. The first and last visible bars lack a required neighbor. Mark them unconfirmed within this window. Equal highs do not satisfy strict superiority; preserve the tie rather than silently changing the rule.",
        "6–9 min: compare two learner answers against the data. A visible edge is not automatically a pivot.",
        "9–12 min: each learner corrects one coordinate and preserves the original; facilitator checks the stated evidence boundary."
      ],
      "activity": {
        "kind": "WRITTEN",
        "prompt": "Highs 102,104,104 have no strict middle high pivot. Demonstrate handle edges and ties using one labeled coordinate and name an unsupported inference.",
        "sectionId": "s3-4-section-4"
      }
    },
    {
      "title": "Record two times: demonstrate, pause, compare",
      "minutes": 12,
      "talkingPoints": [
        "0–3 min: demonstrate with the labeled shared rows. Pivot coordinate 09:01 H104; first knowable at 09:02 close.",
        "3–6 min: individual response before group discussion. Store both the pivot coordinate and earliest confirmation time. Then order confirmed highs and lows separately to describe their sequence. Keep the original pre-reveal judgment when later bars arrive.",
        "6–9 min: compare two learner answers against the data. A later revision must not erase the earlier candidate record.",
        "9–12 min: each learner corrects one coordinate and preserves the original; facilitator checks the stated evidence boundary."
      ],
      "activity": {
        "kind": "WRITTEN",
        "prompt": "Pivot coordinate 09:01 H104; first knowable at 09:02 close. Demonstrate record two times using one labeled coordinate and name an unsupported inference.",
        "sectionId": "s3-4-section-5"
      }
    }
  ],
  "studyGuide": {
    "summary": [
      "For this class use one completed bar on each side. A high pivot has a strictly higher high than both neighbors; a low pivot has a strictly lower low. Ties fail. This is a local classroom convention, not a trading rule.",
      "A bar exceeding its left neighbor is only a candidate while the right neighbor is absent. The next completed bar may confirm or disqualify it. Never use an unseen bar in a present-time answer.",
      "Compare lows with lows and highs with highs. A candle color does not determine either pivot type. An outside bar can satisfy both conventions once its neighbors exist.",
      "The first and last visible bars lack a required neighbor. Mark them unconfirmed within this window. Equal highs do not satisfy strict superiority; preserve the tie rather than silently changing the rule.",
      "Store both the pivot coordinate and earliest confirmation time. Then order confirmed highs and lows separately to describe their sequence. Keep the original pre-reveal judgment when later bars arrive."
    ],
    "bigPicture": "Local Highs, Lows and Price Sequences turns a chart into a bounded, reproducible observation record rather than a forecast.",
    "fiveThings": [
      "Highs 102,104,103 make the middle high eligible only after the third bar closes.",
      "At 09:01 close, H104 is a candidate; at 09:02 close H103 confirms it.",
      "Lows 100,98,99 form a low pivot at the middle bar.",
      "Highs 102,104,104 have no strict middle high pivot.",
      "Pivot coordinate 09:01 H104; first knowable at 09:02 close."
    ],
    "outcomes": [
      "Apply a strict one-completed-neighbor local-pivot convention including ties and edges.",
      "Record pivot coordinates separately from their earliest confirmation times without future data."
    ],
    "examples": [
      "Highs 102,104,103 make the middle high eligible only after the third bar closes.",
      "At 09:01 close, H104 is a candidate; at 09:02 close H103 confirms it.",
      "Lows 100,98,99 form a low pivot at the middle bar.",
      "Highs 102,104,104 have no strict middle high pivot.",
      "Pivot coordinate 09:01 H104; first knowable at 09:02 close."
    ],
    "misconceptions": [
      "A label without a window and tie policy is not reproducible.",
      "Placing a historical marker at 09:01 does not make it knowable then.",
      "Selecting the reddest candle is not applying the rule.",
      "A visible edge is not automatically a pivot.",
      "A later revision must not erase the earlier candidate record."
    ],
    "review": [
      {
        "sectionId": "s3-4-section-1",
        "label": "Specify the comparison rule"
      },
      {
        "sectionId": "s3-4-section-2",
        "label": "Separate candidate from confirmation"
      },
      {
        "sectionId": "s3-4-section-3",
        "label": "Apply lows independently"
      },
      {
        "sectionId": "s3-4-section-4",
        "label": "Handle edges and ties"
      },
      {
        "sectionId": "s3-4-section-5",
        "label": "Record two times"
      }
    ]
  },
  "chart": {
    "required": true,
    "tools": [
      "point",
      "label",
      "line",
      "rectangle"
    ],
    "stateFormat": "drawing-objects-v1",
    "context": [
      "symbol",
      "source",
      "quoteType",
      "timezone",
      "period",
      "visibleInterval",
      "units",
      "knowledgeTime"
    ],
    "reviewStates": [
      "submitted",
      "reviewed",
      "revision_requested",
      "accepted"
    ],
    "history": "append-only"
  },
  "references": [
    {
      "title": "TradingView: Understanding bar charts",
      "url": "https://www.tradingview.com/support/solutions/43000672403-understanding-bar-charts/"
    },
    {
      "title": "TradingView: Repainting and pivot knowledge-time",
      "url": "https://www.tradingview.com/pine-script-docs/concepts/repainting/"
    },
    {
      "title": "TradingView: Other timeframes and data",
      "url": "https://www.tradingview.com/pine-script-docs/concepts/other-timeframes-and-data/"
    }
  ],
  "design": {
    "format": "deterministic chart and accessible coordinate practical",
    "homeworkTitle": "Fresh chart evidence record",
    "homeworkIntro": "Fresh UTC completed bars at13:00–13:05: O8 H10 L7 C9; O9 H13 L8 C12; O12 H12 L6 C7; O7 H12 L7 C11; O11 H12 L8 C9; O9 H11 L7 C8. Use exactly one completed neighbor each side; strict comparisons, ties fail. Match first high and low coordinates and confirmation moments. Mark all eligible pivots, edge limitations and tied highs; preserve a candidate record made at13:01 close.",
    "pacing": {
      "minimum": 55,
      "maximum": 70
    },
    "assessmentCoverage": [
      "LOCAL_PIVOT_RULE",
      "PIVOT_KNOWLEDGE_TIME"
    ],
    "practicalRequirement": "Submit labeled time/price coordinates and construction/classification in the current homework record; teacher applies private rubric. Chart drawing remains required in the future chart-state contract.",
    "studyGuideVisual": {
      "kind": "chart",
      "nodes": [
        {
          "label": "09:00 UTC",
          "detail": "O100 H102 L99 C101 USD/EDU",
          "value": 101
        },
        {
          "label": "09:01 UTC",
          "detail": "O101 H104 L100 C103 USD/EDU",
          "value": 103
        },
        {
          "label": "09:02 UTC",
          "detail": "O103 H103 L101 C102 USD/EDU",
          "value": 102
        },
        {
          "label": "09:03 UTC",
          "detail": "O102 H103 L98 C99 USD/EDU",
          "value": 99
        },
        {
          "label": "09:04 UTC",
          "detail": "O99 H102 L99 C101 USD/EDU",
          "value": 101
        },
        {
          "label": "09:05 UTC",
          "detail": "O101 H105 L100 C104 USD/EDU",
          "value": 104
        }
      ],
      "caption": "Record two times: synthetic EDU/USD last-price; USD/EDU; UTC one-minute interval starts; all supplied bars complete.",
      "chart": {
        "bars": [
          {
            "time": "2026-01-05T09:00:00Z",
            "open": 100,
            "high": 102,
            "low": 99,
            "close": 101
          },
          {
            "time": "2026-01-05T09:01:00Z",
            "open": 101,
            "high": 104,
            "low": 100,
            "close": 103
          },
          {
            "time": "2026-01-05T09:02:00Z",
            "open": 103,
            "high": 103,
            "low": 101,
            "close": 102
          },
          {
            "time": "2026-01-05T09:03:00Z",
            "open": 102,
            "high": 103,
            "low": 98,
            "close": 99
          },
          {
            "time": "2026-01-05T09:04:00Z",
            "open": 99,
            "high": 102,
            "low": 99,
            "close": 101
          },
          {
            "time": "2026-01-05T09:05:00Z",
            "open": 101,
            "high": 105,
            "low": 100,
            "close": 104
          }
        ],
        "caption": "Use the same rows in chart and table; unseen bars cannot support a present-time claim."
      }
    },
    "studyGuideChecks": [
      "Can I demonstrate specify the comparison rule? Check: Highs 102,104,103 make the middle high eligible only after the third bar closes.",
      "Can I demonstrate separate candidate from confirmation? Check: At 09:01 close, H104 is a candidate; at 09:02 close H103 confirms it.",
      "Can I demonstrate apply lows independently? Check: Lows 100,98,99 form a low pivot at the middle bar.",
      "Can I demonstrate handle edges and ties? Check: Highs 102,104,104 have no strict middle high pivot.",
      "Can I demonstrate record two times? Check: Pivot coordinate 09:01 H104; first knowable at 09:02 close."
    ]
  }
};
