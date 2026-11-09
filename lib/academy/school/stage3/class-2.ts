import 'server-only';
import type {StageClass} from '../stage/contracts';
export const CLASS_S3_2:StageClass = {
  "id": "stage-3-class-2",
  "version": "chart-foundations-s3-2.1.0.0",
  "stageId": "stage-3",
  "number": 2,
  "title": "Candles from Open, High, Low and Close",
  "description": "High must be at least both open and close; low must be at most both. All four values belong to the same symbol, source and interval. Reject an impossible row before drawing attractive geometry.",
  "courseId": "hft-school-foundations",
  "lessonId": "hft-school-s3-2",
  "prerequisites": [
    "stage-3-class-1"
  ],
  "liveMinutes": 60,
  "reviewMinutes": 30,
  "objectives": [
    {
      "id": "s3-2-objective-1",
      "text": "Construct and classify candles from valid OHLC and reject invalid rows.",
      "competency": "CANDLE_CONSTRUCTION"
    },
    {
      "id": "s3-2-objective-2",
      "text": "Explain unknown intraperiod path and separate completed close direction from prediction.",
      "competency": "CANDLE_UNCERTAINTY"
    }
  ],
  "terms": [
    {
      "term": "Validate before drawing",
      "definition": "High must be at least both open and close; low must be at most both. All four values belong to the same symbol, source and interval. Reject an impossible row before drawing attractive geometry."
    },
    {
      "term": "Place body and wicks",
      "definition": "The body runs between open and close. The high and low define the entire range; wicks connect those extremes to the body. Use numeric labels so that color is optional."
    },
    {
      "term": "Classify close direction",
      "definition": "Compare close with open: higher, lower or unchanged. This describes a completed interval. An unchanged body can coexist with a wide high-low range."
    },
    {
      "term": "Construct two possible paths",
      "definition": "OHLC records extremes but does not encode the order of the high and low. Two continuous paths can share the same open, high, low and close. Neither can be selected without finer evidence."
    },
    {
      "term": "Keep prediction separate",
      "definition": "A higher close describes the bar that ended. It does not determine the next close or establish an entry trigger. Record what is known and stop where the data stops."
    }
  ],
  "sections": [
    {
      "id": "s3-2-section-1",
      "title": "Validate before drawing",
      "objectiveId": "s3-2-objective-1",
      "competency": "CANDLE_CONSTRUCTION",
      "paragraphs": [
        "High must be at least both open and close; low must be at most both. All four values belong to the same symbol, source and interval. Reject an impossible row before drawing attractive geometry.",
        "Check the largest and smallest values before discussing candle direction. A row with close above high cannot be repaired simply by recoloring its body."
      ],
      "example": "O100 H104 L99 C103 is valid; O100 H102 L99 C103 is impossible.",
      "misconception": "A supplied row is not automatically valid.",
      "visual": "none",
      "activities": [
        {
          "id": "s3-2-observe-1",
          "kind": "choice",
          "category": "PRACTICAL",
          "sectionId": "s3-2-section-1",
          "objectiveId": "s3-2-objective-1",
          "competency": "CANDLE_CONSTRUCTION",
          "prompt": "Which row is impossible?",
          "options": [
            {
              "id": "observed",
              "label": "O100 H102 L99 C103"
            },
            {
              "id": "unsupported",
              "label": "O100 H104 L99 C103"
            }
          ],
          "correct": "observed"
        }
      ]
    },
    {
      "id": "s3-2-section-2",
      "title": "Place body and wicks",
      "objectiveId": "s3-2-objective-1",
      "competency": "CANDLE_CONSTRUCTION",
      "paragraphs": [
        "The body runs between open and close. The high and low define the entire range; wicks connect those extremes to the body. Use numeric labels so that color is optional.",
        "For09:01, locate101 and103 as body endpoints and100/104 as wick extremes. Reading numeric endpoints works even when the color palette is reversed."
      ],
      "example": "For O100 H104 L99 C103, body length is 3 and full range is 5 USD per EDU.",
      "misconception": "The top of the body is not necessarily the high.",
      "visual": "none",
      "activities": [
        {
          "id": "s3-2-observe-2",
          "kind": "choice",
          "category": "PRACTICAL",
          "sectionId": "s3-2-section-2",
          "objectiveId": "s3-2-objective-1",
          "competency": "CANDLE_CONSTRUCTION",
          "prompt": "Where is the09:01 body?",
          "options": [
            {
              "id": "observed",
              "label": "101–103 USD/EDU"
            },
            {
              "id": "unsupported",
              "label": "100–104 USD/EDU"
            }
          ],
          "correct": "observed"
        }
      ]
    },
    {
      "id": "s3-2-section-3",
      "title": "Classify close direction",
      "objectiveId": "s3-2-objective-1",
      "competency": "CANDLE_CONSTRUCTION",
      "paragraphs": [
        "Compare close with open: higher, lower or unchanged. This describes a completed interval. An unchanged body can coexist with a wide high-low range.",
        "For09:02, O103 exceeds C102, so the close is lower even though the earlier bar rose. The comparison belongs inside this interval."
      ],
      "example": "O102 H105 L99 C102 has unchanged close and range 6.",
      "misconception": "An unchanged close does not mean that nothing moved.",
      "visual": "none",
      "activities": [
        {
          "id": "s3-2-observe-3",
          "kind": "choice",
          "category": "PRACTICAL",
          "sectionId": "s3-2-section-3",
          "objectiveId": "s3-2-objective-1",
          "competency": "CANDLE_CONSTRUCTION",
          "prompt": "Classify09:02 O103 C102.",
          "options": [
            {
              "id": "observed",
              "label": "Lower close"
            },
            {
              "id": "unsupported",
              "label": "Higher close"
            }
          ],
          "correct": "observed"
        }
      ]
    },
    {
      "id": "s3-2-section-4",
      "title": "Construct two possible paths",
      "objectiveId": "s3-2-objective-2",
      "competency": "CANDLE_UNCERTAINTY",
      "paragraphs": [
        "OHLC records extremes but does not encode the order of the high and low. Two continuous paths can share the same open, high, low and close. Neither can be selected without finer evidence.",
        "Construct both possible high/low orders on paper using the same endpoints. Neither OHLC geometry nor candle color tells which route actually occurred."
      ],
      "example": "Both 100→104→99→103 and 100→99→104→103 fit the same candle.",
      "misconception": "A long lower wick does not guarantee a future reversal.",
      "visual": "none",
      "activities": [
        {
          "id": "s3-2-observe-4",
          "kind": "choice",
          "category": "PRACTICAL",
          "sectionId": "s3-2-section-4",
          "objectiveId": "s3-2-objective-2",
          "competency": "CANDLE_UNCERTAINTY",
          "prompt": "Which path fits09:01 O101 H104 L100 C103?",
          "options": [
            {
              "id": "observed",
              "label": "101→100→104→103"
            },
            {
              "id": "unsupported",
              "label": "101→99→104→103"
            }
          ],
          "correct": "observed"
        }
      ]
    },
    {
      "id": "s3-2-section-5",
      "title": "Keep prediction separate",
      "objectiveId": "s3-2-objective-2",
      "competency": "CANDLE_UNCERTAINTY",
      "paragraphs": [
        "A higher close describes the bar that ended. It does not determine the next close or establish an entry trigger. Record what is known and stop where the data stops.",
        "Remove the next bar from view before describing the current one. A forecast cannot be scored as a chart fact merely because a later reveal happens to agree."
      ],
      "example": "C103 above O100 is observable; the next close remains unknown.",
      "misconception": "Color is not a forecast.",
      "visual": "none",
      "activities": [
        {
          "id": "s3-2-observe-5",
          "kind": "choice",
          "category": "PRACTICAL",
          "sectionId": "s3-2-section-5",
          "objectiveId": "s3-2-objective-2",
          "competency": "CANDLE_UNCERTAINTY",
          "prompt": "What does09:01 C103 above O101 establish?",
          "options": [
            {
              "id": "observed",
              "label": "Its completed close exceeded its open"
            },
            {
              "id": "unsupported",
              "label": "The next close must exceed103"
            }
          ],
          "correct": "observed"
        }
      ]
    }
  ],
  "assessment": [
    {
      "id": "s3-2-check-1",
      "kind": "written",
      "category": "PRACTICAL",
      "sectionId": "s3-2-section-1",
      "objectiveId": "s3-2-objective-1",
      "competency": "CANDLE_CONSTRUCTION",
      "prompt": "Fresh candle A: O40 H46 L38 C44; B: O44 H45 L39 C40; C: O42 H47 L37 C42; invalid D: O40 H43 L39 C45. Match anatomy for A. Draw or give numeric endpoint coordinates for A/B/C; classify each by open/close; reject D with inequality. Give two possible ordered paths for A and explain why neither predicts the next close. Demonstrate construction or coordinate selection on these fresh values.",
      "rubric": "Require A body40–44 wicks38–40/44–46; B body40–44 wicks39–40/44–45; C body42–42 extremes37/47; classifications higher/lower/unchanged; reject D because high43<close45; paths40→46→38→44 and40→38→46→44 or equivalents; explicitly unknown next close and high/low order.",
      "critical": true
    },
    {
      "id": "s3-2-check-2",
      "kind": "written",
      "category": "PRACTICAL",
      "sectionId": "s3-2-section-5",
      "objectiveId": "s3-2-objective-2",
      "competency": "CANDLE_UNCERTAINTY",
      "prompt": "Fresh candle A: O40 H46 L38 C44; B: O44 H45 L39 C40; C: O42 H47 L37 C42; invalid D: O40 H43 L39 C45. Match anatomy for A. Draw or give numeric endpoint coordinates for A/B/C; classify each by open/close; reject D with inequality. Give two possible ordered paths for A and explain why neither predicts the next close. State the information limit and explain the bounded interpretation.",
      "rubric": "Require A body40–44 wicks38–40/44–46; B body40–44 wicks39–40/44–45; C body42–42 extremes37/47; classifications higher/lower/unchanged; reject D because high43<close45; paths40→46→38→44 and40→38→46→44 or equivalents; explicitly unknown next close and high/low order.",
      "critical": true
    },
    {
      "id": "stage-3-class-2-fresh-objective-0",
      "kind": "choice",
      "category": "KNOWLEDGE",
      "sectionId": "s3-2-section-1",
      "objectiveId": "s3-2-objective-1",
      "competency": "CANDLE_CONSTRUCTION",
      "prompt": "Fresh O20 H25 L18 C23. Where is the candle body?",
      "options": [
        {
          "id": "o0",
          "label": "18–25"
        },
        {
          "id": "o1",
          "label": "20–23"
        },
        {
          "id": "o2",
          "label": "23–25"
        }
      ],
      "correct": "o1",
      "critical": true
    },
    {
      "id": "stage-3-class-2-fresh-objective-1",
      "kind": "choice",
      "category": "KNOWLEDGE",
      "sectionId": "s3-2-section-4",
      "objectiveId": "s3-2-objective-2",
      "competency": "CANDLE_UNCERTAINTY",
      "prompt": "For that OHLC, what is known about which extreme came first?",
      "options": [
        {
          "id": "o0",
          "label": "High first"
        },
        {
          "id": "o1",
          "label": "Low first"
        },
        {
          "id": "o2",
          "label": "Unknown from OHLC alone"
        }
      ],
      "correct": "o2",
      "critical": true
    }
  ],
  "homework": [
    {
      "id": "s3-2-homework-coordinates",
      "kind": "matching",
      "category": "PRACTICAL",
      "sectionId": "s3-2-section-1",
      "objectiveId": "s3-2-objective-1",
      "competency": "CANDLE_CONSTRUCTION",
      "prompt": "Fresh candle A: O40 H46 L38 C44; B: O44 H45 L39 C40; C: O42 H47 L37 C42; invalid D: O40 H43 L39 C45. Match anatomy for A. Draw or give numeric endpoint coordinates for A/B/C; classify each by open/close; reject D with inequality. Give two possible ordered paths for A and explain why neither predicts the next close.",
      "items": [
        {
          "id": "point-0",
          "label": "A body lower"
        },
        {
          "id": "point-1",
          "label": "A body upper"
        },
        {
          "id": "point-2",
          "label": "A upper extreme"
        },
        {
          "id": "point-3",
          "label": "A lower extreme"
        }
      ],
      "targets": [
        {
          "id": "value-0",
          "label": "40"
        },
        {
          "id": "value-1",
          "label": "44"
        },
        {
          "id": "value-2",
          "label": "46"
        },
        {
          "id": "value-3",
          "label": "38"
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
      "id": "s3-2-homework-chart",
      "kind": "written",
      "category": "PRACTICAL",
      "sectionId": "s3-2-section-5",
      "objectiveId": "s3-2-objective-2",
      "competency": "CANDLE_UNCERTAINTY",
      "prompt": "Fresh candle A: O40 H46 L38 C44; B: O44 H45 L39 C40; C: O42 H47 L37 C42; invalid D: O40 H43 L39 C45. Match anatomy for A. Draw or give numeric endpoint coordinates for A/B/C; classify each by open/close; reject D with inequality. Give two possible ordered paths for A and explain why neither predicts the next close. Submit the labeled coordinates/annotations and short reasoning in this response; use the supplied table as an equal alternative to drawing. Your original submission and teacher review remain in the current class attempt record.",
      "rubric": "Require A body40–44 wicks38–40/44–46; B body40–44 wicks39–40/44–45; C body42–42 extremes37/47; classifications higher/lower/unchanged; reject D because high43<close45; paths40→46→38→44 and40→38→46→44 or equivalents; explicitly unknown next close and high/low order.",
      "critical": true
    }
  ],
  "remediation": [
    {
      "competency": "CANDLE_CONSTRUCTION",
      "sectionId": "s3-2-section-1",
      "title": "Rebuild coordinates and construction",
      "paragraph": "Keep the failed attempt. Revisit Validate before drawing; use the changed numeric/context case below, then explain the corrected observation in your own labeled record. 70–72",
      "reinforcement": {
        "id": "s3-2-retry-1",
        "kind": "choice",
        "category": "PRACTICAL",
        "sectionId": "s3-2-section-1",
        "objectiveId": "s3-2-objective-1",
        "competency": "CANDLE_CONSTRUCTION",
        "prompt": "Fresh O70 H74 L68 C72: locate the body.",
        "options": [
          {
            "id": "valid",
            "label": "70–72"
          },
          {
            "id": "invalid",
            "label": "68–74"
          }
        ],
        "correct": "valid",
        "critical": true
      }
    },
    {
      "competency": "CANDLE_UNCERTAINTY",
      "sectionId": "s3-2-section-5",
      "title": "Rebuild the evidence boundary",
      "paragraph": "Keep the failed attempt. Revisit Keep prediction separate; use the changed numeric/context case below, then explain the corrected observation in your own labeled record. Unknown from OHLC alone.",
      "reinforcement": {
        "id": "s3-2-retry-2",
        "kind": "choice",
        "category": "PRACTICAL",
        "sectionId": "s3-2-section-5",
        "objectiveId": "s3-2-objective-2",
        "competency": "CANDLE_UNCERTAINTY",
        "prompt": "Fresh O70 H74 L68 C72: what is the order of high and low?",
        "options": [
          {
            "id": "valid",
            "label": "Unknown from OHLC alone."
          },
          {
            "id": "invalid",
            "label": "High certainly occurred first."
          }
        ],
        "correct": "valid",
        "critical": true
      }
    }
  ],
  "liveGuide": [
    {
      "title": "Validate before drawing: demonstrate, pause, compare",
      "minutes": 12,
      "talkingPoints": [
        "0–3 min: demonstrate with the labeled shared rows. O100 H104 L99 C103 is valid; O100 H102 L99 C103 is impossible.",
        "3–6 min: individual response before group discussion. High must be at least both open and close; low must be at most both. All four values belong to the same symbol, source and interval. Reject an impossible row before drawing attractive geometry.",
        "6–9 min: compare two learner answers against the data. A supplied row is not automatically valid.",
        "9–12 min: each learner corrects one coordinate and preserves the original; facilitator checks the stated evidence boundary."
      ],
      "activity": {
        "kind": "POLL",
        "prompt": "O100 H104 L99 C103 is valid; O100 H102 L99 C103 is impossible. Demonstrate validate before drawing using one labeled coordinate and name an unsupported inference.",
        "sectionId": "s3-2-section-1"
      }
    },
    {
      "title": "Place body and wicks: demonstrate, pause, compare",
      "minutes": 12,
      "talkingPoints": [
        "0–3 min: demonstrate with the labeled shared rows. For O100 H104 L99 C103, body length is 3 and full range is 5 USD per EDU.",
        "3–6 min: individual response before group discussion. The body runs between open and close. The high and low define the entire range; wicks connect those extremes to the body. Use numeric labels so that color is optional.",
        "6–9 min: compare two learner answers against the data. The top of the body is not necessarily the high.",
        "9–12 min: each learner corrects one coordinate and preserves the original; facilitator checks the stated evidence boundary."
      ],
      "activity": {
        "kind": "SINGLE",
        "prompt": "For O100 H104 L99 C103, body length is 3 and full range is 5 USD per EDU. Demonstrate place body and wicks using one labeled coordinate and name an unsupported inference.",
        "sectionId": "s3-2-section-2"
      }
    },
    {
      "title": "Classify close direction: demonstrate, pause, compare",
      "minutes": 12,
      "talkingPoints": [
        "0–3 min: demonstrate with the labeled shared rows. O102 H105 L99 C102 has unchanged close and range 6.",
        "3–6 min: individual response before group discussion. Compare close with open: higher, lower or unchanged. This describes a completed interval. An unchanged body can coexist with a wide high-low range.",
        "6–9 min: compare two learner answers against the data. An unchanged close does not mean that nothing moved.",
        "9–12 min: each learner corrects one coordinate and preserves the original; facilitator checks the stated evidence boundary."
      ],
      "activity": {
        "kind": "WRITTEN",
        "prompt": "O102 H105 L99 C102 has unchanged close and range 6. Demonstrate classify close direction using one labeled coordinate and name an unsupported inference.",
        "sectionId": "s3-2-section-3"
      }
    },
    {
      "title": "Construct two possible paths: demonstrate, pause, compare",
      "minutes": 12,
      "talkingPoints": [
        "0–3 min: demonstrate with the labeled shared rows. Both 100→104→99→103 and 100→99→104→103 fit the same candle.",
        "3–6 min: individual response before group discussion. OHLC records extremes but does not encode the order of the high and low. Two continuous paths can share the same open, high, low and close. Neither can be selected without finer evidence.",
        "6–9 min: compare two learner answers against the data. A long lower wick does not guarantee a future reversal.",
        "9–12 min: each learner corrects one coordinate and preserves the original; facilitator checks the stated evidence boundary."
      ],
      "activity": {
        "kind": "WRITTEN",
        "prompt": "Both 100→104→99→103 and 100→99→104→103 fit the same candle. Demonstrate construct two possible paths using one labeled coordinate and name an unsupported inference.",
        "sectionId": "s3-2-section-4"
      }
    },
    {
      "title": "Keep prediction separate: demonstrate, pause, compare",
      "minutes": 12,
      "talkingPoints": [
        "0–3 min: demonstrate with the labeled shared rows. C103 above O100 is observable; the next close remains unknown.",
        "3–6 min: individual response before group discussion. A higher close describes the bar that ended. It does not determine the next close or establish an entry trigger. Record what is known and stop where the data stops.",
        "6–9 min: compare two learner answers against the data. Color is not a forecast.",
        "9–12 min: each learner corrects one coordinate and preserves the original; facilitator checks the stated evidence boundary."
      ],
      "activity": {
        "kind": "WRITTEN",
        "prompt": "C103 above O100 is observable; the next close remains unknown. Demonstrate keep prediction separate using one labeled coordinate and name an unsupported inference.",
        "sectionId": "s3-2-section-5"
      }
    }
  ],
  "studyGuide": {
    "summary": [
      "High must be at least both open and close; low must be at most both. All four values belong to the same symbol, source and interval. Reject an impossible row before drawing attractive geometry.",
      "The body runs between open and close. The high and low define the entire range; wicks connect those extremes to the body. Use numeric labels so that color is optional.",
      "Compare close with open: higher, lower or unchanged. This describes a completed interval. An unchanged body can coexist with a wide high-low range.",
      "OHLC records extremes but does not encode the order of the high and low. Two continuous paths can share the same open, high, low and close. Neither can be selected without finer evidence.",
      "A higher close describes the bar that ended. It does not determine the next close or establish an entry trigger. Record what is known and stop where the data stops."
    ],
    "bigPicture": "Candles from Open, High, Low and Close turns a chart into a bounded, reproducible observation record rather than a forecast.",
    "fiveThings": [
      "O100 H104 L99 C103 is valid; O100 H102 L99 C103 is impossible.",
      "For O100 H104 L99 C103, body length is 3 and full range is 5 USD per EDU.",
      "O102 H105 L99 C102 has unchanged close and range 6.",
      "Both 100→104→99→103 and 100→99→104→103 fit the same candle.",
      "C103 above O100 is observable; the next close remains unknown."
    ],
    "outcomes": [
      "Construct and classify candles from valid OHLC and reject invalid rows.",
      "Explain unknown intraperiod path and separate completed close direction from prediction."
    ],
    "examples": [
      "O100 H104 L99 C103 is valid; O100 H102 L99 C103 is impossible.",
      "For O100 H104 L99 C103, body length is 3 and full range is 5 USD per EDU.",
      "O102 H105 L99 C102 has unchanged close and range 6.",
      "Both 100→104→99→103 and 100→99→104→103 fit the same candle.",
      "C103 above O100 is observable; the next close remains unknown."
    ],
    "misconceptions": [
      "A supplied row is not automatically valid.",
      "The top of the body is not necessarily the high.",
      "An unchanged close does not mean that nothing moved.",
      "A long lower wick does not guarantee a future reversal.",
      "Color is not a forecast."
    ],
    "review": [
      {
        "sectionId": "s3-2-section-1",
        "label": "Validate before drawing"
      },
      {
        "sectionId": "s3-2-section-2",
        "label": "Place body and wicks"
      },
      {
        "sectionId": "s3-2-section-3",
        "label": "Classify close direction"
      },
      {
        "sectionId": "s3-2-section-4",
        "label": "Construct two possible paths"
      },
      {
        "sectionId": "s3-2-section-5",
        "label": "Keep prediction separate"
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
    "homeworkIntro": "Fresh candle A: O40 H46 L38 C44; B: O44 H45 L39 C40; C: O42 H47 L37 C42; invalid D: O40 H43 L39 C45. Match anatomy for A. Draw or give numeric endpoint coordinates for A/B/C; classify each by open/close; reject D with inequality. Give two possible ordered paths for A and explain why neither predicts the next close.",
    "pacing": {
      "minimum": 55,
      "maximum": 70
    },
    "assessmentCoverage": [
      "CANDLE_CONSTRUCTION",
      "CANDLE_UNCERTAINTY"
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
      "caption": "Keep prediction separate: synthetic EDU/USD last-price; USD/EDU; UTC one-minute interval starts; all supplied bars complete.",
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
      "Can I demonstrate validate before drawing? Check: O100 H104 L99 C103 is valid; O100 H102 L99 C103 is impossible.",
      "Can I demonstrate place body and wicks? Check: For O100 H104 L99 C103, body length is 3 and full range is 5 USD per EDU.",
      "Can I demonstrate classify close direction? Check: O102 H105 L99 C102 has unchanged close and range 6.",
      "Can I demonstrate construct two possible paths? Check: Both 100→104→99→103 and 100→99→104→103 fit the same candle.",
      "Can I demonstrate keep prediction separate? Check: C103 above O100 is observable; the next close remains unknown."
    ]
  }
};
