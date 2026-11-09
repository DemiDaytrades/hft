import 'server-only';
import type {StageClass} from '../stage/contracts';
export const CLASS_S3_3:StageClass = {
  "id": "stage-3-class-3",
  "version": "chart-foundations-s3-3.1.0.0",
  "stageId": "stage-3",
  "number": 3,
  "title": "Timeframes: One Price Path, Different Views",
  "description": "State timezone and whether timestamps denote interval starts. Here one-minute rows begin at the labeled UTC time. A 09:00 three-minute bar contains 09:00, 09:01 and 09:02, excluding 09:03.",
  "courseId": "hft-school-foundations",
  "lessonId": "hft-school-s3-3",
  "prerequisites": [
    "stage-3-class-2"
  ],
  "liveMinutes": 60,
  "reviewMinutes": 30,
  "objectives": [
    {
      "id": "s3-3-objective-1",
      "text": "Aggregate adjacent bars using aligned first-open, maximum-high, minimum-low and last-close.",
      "competency": "BAR_AGGREGATION"
    },
    {
      "id": "s3-3-objective-2",
      "text": "Identify information lost by aggregation and distinguish incomplete bars, zoom and timeframe.",
      "competency": "TIMEFRAME_LIMITS"
    }
  ],
  "terms": [
    {
      "term": "Fix interval boundaries",
      "definition": "State timezone and whether timestamps denote interval starts. Here one-minute rows begin at the labeled UTC time. A 09:00 three-minute bar contains 09:00, 09:01 and 09:02, excluding 09:03."
    },
    {
      "term": "Aggregate without averaging",
      "definition": "The larger bar uses the first open, maximum high, minimum low and last close. These rules preserve endpoints and extremes; averaging destroys the candle meaning."
    },
    {
      "term": "Recover what is hidden",
      "definition": "One larger candle loses the ordering of the component closes and the positions of intermediate moves. Keep the source rows beside the aggregate when comparing accounts."
    },
    {
      "term": "Distinguish zoom from period",
      "definition": "Zoom crops or rescales the same bars. A timeframe change recomputes bars over different boundaries. Verify the number and timestamps of rows before interpreting a visual difference."
    },
    {
      "term": "Mark an unfinished interval",
      "definition": "Until the final component closes, the aggregate close, high and low may change. Label partial data and the last included time. Do not compare a developing bar as though it were final."
    }
  ],
  "sections": [
    {
      "id": "s3-3-section-1",
      "title": "Fix interval boundaries",
      "objectiveId": "s3-3-objective-1",
      "competency": "BAR_AGGREGATION",
      "paragraphs": [
        "State timezone and whether timestamps denote interval starts. Here one-minute rows begin at the labeled UTC time. A 09:00 three-minute bar contains 09:00, 09:01 and 09:02, excluding 09:03.",
        "Write membership as09:00≤t<09:03. This boundary convention prevents double-counting09:03 in neighboring aggregate bars."
      ],
      "example": "Use the half-open interval [09:00,09:03) UTC.",
      "misconception": "Three adjacent rows need not form a correctly aligned bar.",
      "visual": "none",
      "activities": [
        {
          "id": "s3-3-observe-1",
          "kind": "choice",
          "category": "PRACTICAL",
          "sectionId": "s3-3-section-1",
          "objectiveId": "s3-3-objective-1",
          "competency": "BAR_AGGREGATION",
          "prompt": "Which rows form [09:00,09:03) UTC?",
          "options": [
            {
              "id": "observed",
              "label": "09:00,09:01,09:02"
            },
            {
              "id": "unsupported",
              "label": "09:01,09:02,09:03"
            }
          ],
          "correct": "observed"
        }
      ]
    },
    {
      "id": "s3-3-section-2",
      "title": "Aggregate without averaging",
      "objectiveId": "s3-3-objective-1",
      "competency": "BAR_AGGREGATION",
      "paragraphs": [
        "The larger bar uses the first open, maximum high, minimum low and last close. These rules preserve endpoints and extremes; averaging destroys the candle meaning.",
        "Compute four separate functions rather than one average: first open100, max high104, min low99, last close102. Keep each function labeled."
      ],
      "example": "Rows 09:00–09:02 aggregate to O100 H104 L99 C102.",
      "misconception": "The average close is not the aggregate close.",
      "visual": "none",
      "activities": [
        {
          "id": "s3-3-observe-2",
          "kind": "choice",
          "category": "PRACTICAL",
          "sectionId": "s3-3-section-2",
          "objectiveId": "s3-3-objective-1",
          "competency": "BAR_AGGREGATION",
          "prompt": "Select the aggregate of09:00–09:02.",
          "options": [
            {
              "id": "observed",
              "label": "O100 H104 L99 C102"
            },
            {
              "id": "unsupported",
              "label": "O102 H103 L100 C102"
            }
          ],
          "correct": "observed"
        }
      ]
    },
    {
      "id": "s3-3-section-3",
      "title": "Recover what is hidden",
      "objectiveId": "s3-3-objective-1",
      "competency": "BAR_AGGREGATION",
      "paragraphs": [
        "One larger candle loses the ordering of the component closes and the positions of intermediate moves. Keep the source rows beside the aggregate when comparing accounts.",
        "A larger bar retains104 and99 but not when those extremes occurred. Consult lower-period rows for bar order, while recognizing that even those rows omit tick order."
      ],
      "example": "The aggregate hides the 09:01 close of 103 followed by 09:02 close of 102.",
      "misconception": "A smooth large-period picture does not prove a smooth path.",
      "visual": "none",
      "activities": [
        {
          "id": "s3-3-observe-3",
          "kind": "choice",
          "category": "PRACTICAL",
          "sectionId": "s3-3-section-3",
          "objectiveId": "s3-3-objective-1",
          "competency": "BAR_AGGREGATION",
          "prompt": "What source detail disappears in that aggregate?",
          "options": [
            {
              "id": "observed",
              "label": "09:01 close103 then09:02 close102"
            },
            {
              "id": "unsupported",
              "label": "The aggregate high104"
            }
          ],
          "correct": "observed"
        }
      ]
    },
    {
      "id": "s3-3-section-4",
      "title": "Distinguish zoom from period",
      "objectiveId": "s3-3-objective-2",
      "competency": "TIMEFRAME_LIMITS",
      "paragraphs": [
        "Zoom crops or rescales the same bars. A timeframe change recomputes bars over different boundaries. Verify the number and timestamps of rows before interpreting a visual difference.",
        "Count the rows and inspect timestamps after changing the display. The same one-minute rows at a different scale are still one-minute observations."
      ],
      "example": "Displaying only three one-minute rows is still a one-minute chart.",
      "misconception": "Fewer visible candles do not necessarily mean a larger timeframe.",
      "visual": "none",
      "activities": [
        {
          "id": "s3-3-observe-4",
          "kind": "choice",
          "category": "PRACTICAL",
          "sectionId": "s3-3-section-4",
          "objectiveId": "s3-3-objective-2",
          "competency": "TIMEFRAME_LIMITS",
          "prompt": "Cropping to09:00–09:02 without recomputing rows does what?",
          "options": [
            {
              "id": "observed",
              "label": "Changes visible history only"
            },
            {
              "id": "unsupported",
              "label": "Creates a three-minute candle"
            }
          ],
          "correct": "observed"
        }
      ]
    },
    {
      "id": "s3-3-section-5",
      "title": "Mark an unfinished interval",
      "objectiveId": "s3-3-objective-2",
      "competency": "TIMEFRAME_LIMITS",
      "paragraphs": [
        "Until the final component closes, the aggregate close, high and low may change. Label partial data and the last included time. Do not compare a developing bar as though it were final.",
        "At09:01 close the latest available aggregate close is103, not the eventual102. Preserve that partial snapshot rather than rewriting it after09:02 arrives."
      ],
      "example": "At 09:01 close, the [09:00,09:03) bar still lacks 09:02.",
      "misconception": "A developing high or close can change without a data error.",
      "visual": "none",
      "activities": [
        {
          "id": "s3-3-observe-5",
          "kind": "choice",
          "category": "PRACTICAL",
          "sectionId": "s3-3-section-5",
          "objectiveId": "s3-3-objective-2",
          "competency": "TIMEFRAME_LIMITS",
          "prompt": "At09:01 close is the [09:00,09:03) aggregate final?",
          "options": [
            {
              "id": "observed",
              "label": "No;09:02 has not closed"
            },
            {
              "id": "unsupported",
              "label": "Yes;two component bars suffice"
            }
          ],
          "correct": "observed"
        }
      ]
    }
  ],
  "assessment": [
    {
      "id": "s3-3-check-1",
      "kind": "written",
      "category": "PRACTICAL",
      "sectionId": "s3-3-section-1",
      "objectiveId": "s3-3-objective-1",
      "competency": "BAR_AGGREGATION",
      "prompt": "Fresh UTC one-minute start rows:12:00 O20 H23 L19 C22;12:01 O22 H24 L21 C23;12:02 O23 H23 L18 C19;12:03 O19 H22 L18 C21. Match the [12:00,12:03) aggregate. Construct its OHLC coordinates; compare with source closes; state what is still missing if observed only at12:01 close. Explain why cropping to three one-minute bars does not change timeframe. Demonstrate construction or coordinate selection on these fresh values.",
      "rubric": "Require O20 H24 L18 C19 from first/max/min/last; exclude12:03; hidden intermediate close22/23 before19; at12:01 close missing12:02 so aggregate incomplete; crop remains one minute; preserve UTC start labels. Averaging OHLC fails construction.",
      "critical": true
    },
    {
      "id": "s3-3-check-2",
      "kind": "written",
      "category": "PRACTICAL",
      "sectionId": "s3-3-section-5",
      "objectiveId": "s3-3-objective-2",
      "competency": "TIMEFRAME_LIMITS",
      "prompt": "Fresh UTC one-minute start rows:12:00 O20 H23 L19 C22;12:01 O22 H24 L21 C23;12:02 O23 H23 L18 C19;12:03 O19 H22 L18 C21. Match the [12:00,12:03) aggregate. Construct its OHLC coordinates; compare with source closes; state what is still missing if observed only at12:01 close. Explain why cropping to three one-minute bars does not change timeframe. State the information limit and explain the bounded interpretation.",
      "rubric": "Require O20 H24 L18 C19 from first/max/min/last; exclude12:03; hidden intermediate close22/23 before19; at12:01 close missing12:02 so aggregate incomplete; crop remains one minute; preserve UTC start labels. Averaging OHLC fails construction.",
      "critical": true
    },
    {
      "id": "stage-3-class-3-fresh-objective-0",
      "kind": "choice",
      "category": "KNOWLEDGE",
      "sectionId": "s3-3-section-1",
      "objectiveId": "s3-3-objective-1",
      "competency": "BAR_AGGREGATION",
      "prompt": "Two completed adjacent bars: O30 H35 L29 C34; O34 H36 L31 C32. Combined OHLC?",
      "options": [
        {
          "id": "o0",
          "label": "O30 H36 L29 C32"
        },
        {
          "id": "o1",
          "label": "O32 H35.5 L30 C33"
        },
        {
          "id": "o2",
          "label": "O34 H36 L29 C34"
        }
      ],
      "correct": "o0",
      "critical": true
    },
    {
      "id": "stage-3-class-3-fresh-objective-1",
      "kind": "choice",
      "category": "KNOWLEDGE",
      "sectionId": "s3-3-section-4",
      "objectiveId": "s3-3-objective-2",
      "competency": "TIMEFRAME_LIMITS",
      "prompt": "At the first minute close of a two-minute interval, its final close is?",
      "options": [
        {
          "id": "o0",
          "label": "Already final"
        },
        {
          "id": "o1",
          "label": "The average of visible ticks"
        },
        {
          "id": "o2",
          "label": "Not yet known; the interval is incomplete"
        }
      ],
      "correct": "o2",
      "critical": true
    }
  ],
  "homework": [
    {
      "id": "s3-3-homework-coordinates",
      "kind": "matching",
      "category": "PRACTICAL",
      "sectionId": "s3-3-section-1",
      "objectiveId": "s3-3-objective-1",
      "competency": "BAR_AGGREGATION",
      "prompt": "Fresh UTC one-minute start rows:12:00 O20 H23 L19 C22;12:01 O22 H24 L21 C23;12:02 O23 H23 L18 C19;12:03 O19 H22 L18 C21. Match the [12:00,12:03) aggregate. Construct its OHLC coordinates; compare with source closes; state what is still missing if observed only at12:01 close. Explain why cropping to three one-minute bars does not change timeframe.",
      "items": [
        {
          "id": "point-0",
          "label": "Aggregate open"
        },
        {
          "id": "point-1",
          "label": "Aggregate high"
        },
        {
          "id": "point-2",
          "label": "Aggregate low"
        },
        {
          "id": "point-3",
          "label": "Aggregate close"
        }
      ],
      "targets": [
        {
          "id": "value-0",
          "label": "20"
        },
        {
          "id": "value-1",
          "label": "24"
        },
        {
          "id": "value-2",
          "label": "18"
        },
        {
          "id": "value-3",
          "label": "19"
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
      "id": "s3-3-homework-chart",
      "kind": "written",
      "category": "PRACTICAL",
      "sectionId": "s3-3-section-5",
      "objectiveId": "s3-3-objective-2",
      "competency": "TIMEFRAME_LIMITS",
      "prompt": "Fresh UTC one-minute start rows:12:00 O20 H23 L19 C22;12:01 O22 H24 L21 C23;12:02 O23 H23 L18 C19;12:03 O19 H22 L18 C21. Match the [12:00,12:03) aggregate. Construct its OHLC coordinates; compare with source closes; state what is still missing if observed only at12:01 close. Explain why cropping to three one-minute bars does not change timeframe. Submit the labeled coordinates/annotations and short reasoning in this response; use the supplied table as an equal alternative to drawing. Your original submission and teacher review remain in the current class attempt record.",
      "rubric": "Require O20 H24 L18 C19 from first/max/min/last; exclude12:03; hidden intermediate close22/23 before19; at12:01 close missing12:02 so aggregate incomplete; crop remains one minute; preserve UTC start labels. Averaging OHLC fails construction.",
      "critical": true
    }
  ],
  "remediation": [
    {
      "competency": "BAR_AGGREGATION",
      "sectionId": "s3-3-section-1",
      "title": "Rebuild coordinates and construction",
      "paragraph": "Keep the failed attempt. Revisit Fix interval boundaries; use the changed numeric/context case below, then explain the corrected observation in your own labeled record. O10 H14 L9 C13",
      "reinforcement": {
        "id": "s3-3-retry-1",
        "kind": "choice",
        "category": "PRACTICAL",
        "sectionId": "s3-3-section-1",
        "objectiveId": "s3-3-objective-1",
        "competency": "BAR_AGGREGATION",
        "prompt": "Fresh two rows O10 H13 L9 C12; O12 H14 L11 C13. Aggregate?",
        "options": [
          {
            "id": "valid",
            "label": "O10 H14 L9 C13"
          },
          {
            "id": "invalid",
            "label": "O11 H13.5 L10 C12.5"
          }
        ],
        "correct": "valid",
        "critical": true
      }
    },
    {
      "competency": "TIMEFRAME_LIMITS",
      "sectionId": "s3-3-section-5",
      "title": "Rebuild the evidence boundary",
      "paragraph": "Keep the failed attempt. Revisit Mark an unfinished interval; use the changed numeric/context case below, then explain the corrected observation in your own labeled record. No; the second row is absent.",
      "reinforcement": {
        "id": "s3-3-retry-2",
        "kind": "choice",
        "category": "PRACTICAL",
        "sectionId": "s3-3-section-5",
        "objectiveId": "s3-3-objective-2",
        "competency": "TIMEFRAME_LIMITS",
        "prompt": "At the first row close, is the two-row aggregate final?",
        "options": [
          {
            "id": "valid",
            "label": "No; the second row is absent."
          },
          {
            "id": "invalid",
            "label": "Yes; the latest close is final for every timeframe."
          }
        ],
        "correct": "valid",
        "critical": true
      }
    }
  ],
  "liveGuide": [
    {
      "title": "Fix interval boundaries: demonstrate, pause, compare",
      "minutes": 12,
      "talkingPoints": [
        "0–3 min: demonstrate with the labeled shared rows. Use the half-open interval [09:00,09:03) UTC.",
        "3–6 min: individual response before group discussion. State timezone and whether timestamps denote interval starts. Here one-minute rows begin at the labeled UTC time. A 09:00 three-minute bar contains 09:00, 09:01 and 09:02, excluding 09:03.",
        "6–9 min: compare two learner answers against the data. Three adjacent rows need not form a correctly aligned bar.",
        "9–12 min: each learner corrects one coordinate and preserves the original; facilitator checks the stated evidence boundary."
      ],
      "activity": {
        "kind": "POLL",
        "prompt": "Use the half-open interval [09:00,09:03) UTC. Demonstrate fix interval boundaries using one labeled coordinate and name an unsupported inference.",
        "sectionId": "s3-3-section-1"
      }
    },
    {
      "title": "Aggregate without averaging: demonstrate, pause, compare",
      "minutes": 12,
      "talkingPoints": [
        "0–3 min: demonstrate with the labeled shared rows. Rows 09:00–09:02 aggregate to O100 H104 L99 C102.",
        "3–6 min: individual response before group discussion. The larger bar uses the first open, maximum high, minimum low and last close. These rules preserve endpoints and extremes; averaging destroys the candle meaning.",
        "6–9 min: compare two learner answers against the data. The average close is not the aggregate close.",
        "9–12 min: each learner corrects one coordinate and preserves the original; facilitator checks the stated evidence boundary."
      ],
      "activity": {
        "kind": "SINGLE",
        "prompt": "Rows 09:00–09:02 aggregate to O100 H104 L99 C102. Demonstrate aggregate without averaging using one labeled coordinate and name an unsupported inference.",
        "sectionId": "s3-3-section-2"
      }
    },
    {
      "title": "Recover what is hidden: demonstrate, pause, compare",
      "minutes": 12,
      "talkingPoints": [
        "0–3 min: demonstrate with the labeled shared rows. The aggregate hides the 09:01 close of 103 followed by 09:02 close of 102.",
        "3–6 min: individual response before group discussion. One larger candle loses the ordering of the component closes and the positions of intermediate moves. Keep the source rows beside the aggregate when comparing accounts.",
        "6–9 min: compare two learner answers against the data. A smooth large-period picture does not prove a smooth path.",
        "9–12 min: each learner corrects one coordinate and preserves the original; facilitator checks the stated evidence boundary."
      ],
      "activity": {
        "kind": "WRITTEN",
        "prompt": "The aggregate hides the 09:01 close of 103 followed by 09:02 close of 102. Demonstrate recover what is hidden using one labeled coordinate and name an unsupported inference.",
        "sectionId": "s3-3-section-3"
      }
    },
    {
      "title": "Distinguish zoom from period: demonstrate, pause, compare",
      "minutes": 12,
      "talkingPoints": [
        "0–3 min: demonstrate with the labeled shared rows. Displaying only three one-minute rows is still a one-minute chart.",
        "3–6 min: individual response before group discussion. Zoom crops or rescales the same bars. A timeframe change recomputes bars over different boundaries. Verify the number and timestamps of rows before interpreting a visual difference.",
        "6–9 min: compare two learner answers against the data. Fewer visible candles do not necessarily mean a larger timeframe.",
        "9–12 min: each learner corrects one coordinate and preserves the original; facilitator checks the stated evidence boundary."
      ],
      "activity": {
        "kind": "WRITTEN",
        "prompt": "Displaying only three one-minute rows is still a one-minute chart. Demonstrate distinguish zoom from period using one labeled coordinate and name an unsupported inference.",
        "sectionId": "s3-3-section-4"
      }
    },
    {
      "title": "Mark an unfinished interval: demonstrate, pause, compare",
      "minutes": 12,
      "talkingPoints": [
        "0–3 min: demonstrate with the labeled shared rows. At 09:01 close, the [09:00,09:03) bar still lacks 09:02.",
        "3–6 min: individual response before group discussion. Until the final component closes, the aggregate close, high and low may change. Label partial data and the last included time. Do not compare a developing bar as though it were final.",
        "6–9 min: compare two learner answers against the data. A developing high or close can change without a data error.",
        "9–12 min: each learner corrects one coordinate and preserves the original; facilitator checks the stated evidence boundary."
      ],
      "activity": {
        "kind": "WRITTEN",
        "prompt": "At 09:01 close, the [09:00,09:03) bar still lacks 09:02. Demonstrate mark an unfinished interval using one labeled coordinate and name an unsupported inference.",
        "sectionId": "s3-3-section-5"
      }
    }
  ],
  "studyGuide": {
    "summary": [
      "State timezone and whether timestamps denote interval starts. Here one-minute rows begin at the labeled UTC time. A 09:00 three-minute bar contains 09:00, 09:01 and 09:02, excluding 09:03.",
      "The larger bar uses the first open, maximum high, minimum low and last close. These rules preserve endpoints and extremes; averaging destroys the candle meaning.",
      "One larger candle loses the ordering of the component closes and the positions of intermediate moves. Keep the source rows beside the aggregate when comparing accounts.",
      "Zoom crops or rescales the same bars. A timeframe change recomputes bars over different boundaries. Verify the number and timestamps of rows before interpreting a visual difference.",
      "Until the final component closes, the aggregate close, high and low may change. Label partial data and the last included time. Do not compare a developing bar as though it were final."
    ],
    "bigPicture": "Timeframes: One Price Path, Different Views turns a chart into a bounded, reproducible observation record rather than a forecast.",
    "fiveThings": [
      "Use the half-open interval [09:00,09:03) UTC.",
      "Rows 09:00–09:02 aggregate to O100 H104 L99 C102.",
      "The aggregate hides the 09:01 close of 103 followed by 09:02 close of 102.",
      "Displaying only three one-minute rows is still a one-minute chart.",
      "At 09:01 close, the [09:00,09:03) bar still lacks 09:02."
    ],
    "outcomes": [
      "Aggregate adjacent bars using aligned first-open, maximum-high, minimum-low and last-close.",
      "Identify information lost by aggregation and distinguish incomplete bars, zoom and timeframe."
    ],
    "examples": [
      "Use the half-open interval [09:00,09:03) UTC.",
      "Rows 09:00–09:02 aggregate to O100 H104 L99 C102.",
      "The aggregate hides the 09:01 close of 103 followed by 09:02 close of 102.",
      "Displaying only three one-minute rows is still a one-minute chart.",
      "At 09:01 close, the [09:00,09:03) bar still lacks 09:02."
    ],
    "misconceptions": [
      "Three adjacent rows need not form a correctly aligned bar.",
      "The average close is not the aggregate close.",
      "A smooth large-period picture does not prove a smooth path.",
      "Fewer visible candles do not necessarily mean a larger timeframe.",
      "A developing high or close can change without a data error."
    ],
    "review": [
      {
        "sectionId": "s3-3-section-1",
        "label": "Fix interval boundaries"
      },
      {
        "sectionId": "s3-3-section-2",
        "label": "Aggregate without averaging"
      },
      {
        "sectionId": "s3-3-section-3",
        "label": "Recover what is hidden"
      },
      {
        "sectionId": "s3-3-section-4",
        "label": "Distinguish zoom from period"
      },
      {
        "sectionId": "s3-3-section-5",
        "label": "Mark an unfinished interval"
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
    "homeworkIntro": "Fresh UTC one-minute start rows:12:00 O20 H23 L19 C22;12:01 O22 H24 L21 C23;12:02 O23 H23 L18 C19;12:03 O19 H22 L18 C21. Match the [12:00,12:03) aggregate. Construct its OHLC coordinates; compare with source closes; state what is still missing if observed only at12:01 close. Explain why cropping to three one-minute bars does not change timeframe.",
    "pacing": {
      "minimum": 55,
      "maximum": 70
    },
    "assessmentCoverage": [
      "BAR_AGGREGATION",
      "TIMEFRAME_LIMITS"
    ],
    "practicalRequirement": "Submit labeled time/price coordinates and construction/classification in the current homework record; teacher applies private rubric. Chart drawing remains required in the future chart-state contract.",
    "studyGuideVisual": {
      "kind": "candles",
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
      "caption": "Mark an unfinished interval: synthetic EDU/USD last-price; USD/EDU; UTC one-minute interval starts; all supplied bars complete.",
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
      "Can I demonstrate fix interval boundaries? Check: Use the half-open interval [09:00,09:03) UTC.",
      "Can I demonstrate aggregate without averaging? Check: Rows 09:00–09:02 aggregate to O100 H104 L99 C102.",
      "Can I demonstrate recover what is hidden? Check: The aggregate hides the 09:01 close of 103 followed by 09:02 close of 102.",
      "Can I demonstrate distinguish zoom from period? Check: Displaying only three one-minute rows is still a one-minute chart.",
      "Can I demonstrate mark an unfinished interval? Check: At 09:01 close, the [09:00,09:03) bar still lacks 09:02."
    ]
  }
};
