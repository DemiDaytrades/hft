import 'server-only';
import type {StageClass} from '../stage/contracts';
export const CLASS_S3_1:StageClass = {
  "id": "stage-3-class-1",
  "version": "chart-foundations-s3-1.1.0.0",
  "stageId": "stage-3",
  "number": 1,
  "title": "Read the Chart: Price, Time and Data Context",
  "description": "Time advances from left to right; the vertical coordinate is a price in the named quote unit. Read the timestamp before reading a value. A point without units is incomplete evidence.",
  "courseId": "hft-school-foundations",
  "lessonId": "hft-school-s3-1",
  "prerequisites": [
    "stage-2-class-6"
  ],
  "liveMinutes": 60,
  "reviewMinutes": 30,
  "objectives": [
    {
      "id": "s3-1-objective-1",
      "text": "Identify price/time axes, symbol, feed, unit and period on fresh chart data.",
      "competency": "CHART_CONTEXT"
    },
    {
      "id": "s3-1-objective-2",
      "text": "Separate reproducible chart observations from unsupported causal inference.",
      "competency": "CHART_OBSERVATION"
    }
  ],
  "terms": [
    {
      "term": "Find a coordinate",
      "definition": "Time advances from left to right; the vertical coordinate is a price in the named quote unit. Read the timestamp before reading a value. A point without units is incomplete evidence."
    },
    {
      "term": "Read the data passport",
      "definition": "A chart needs symbol, source, quote type, timezone and bar duration. Our synthetic EDU/USD last-price series is educational, not an executable quote. A bid series and an ask series can differ without either being corrupt."
    },
    {
      "term": "Compare representations",
      "definition": "A close-line connects only closing values. Bars and candles also retain open, high and low. Switch representation without changing the source rows, then identify a fact that disappears on the line."
    },
    {
      "term": "Inspect missing context",
      "definition": "Zoom changes the visible portion and scale, not the observations themselves. A gap in rows is missing evidence; it does not prove that the market remained still. Record the visible interval."
    },
    {
      "term": "Separate fact from story",
      "definition": "A timestamped value can be checked against the table. A story about why participants acted requires evidence beyond these bars. Keep three observations and one explicit unknown in your record."
    }
  ],
  "sections": [
    {
      "id": "s3-1-section-1",
      "title": "Find a coordinate",
      "objectiveId": "s3-1-objective-1",
      "competency": "CHART_CONTEXT",
      "paragraphs": [
        "Time advances from left to right; the vertical coordinate is a price in the named quote unit. Read the timestamp before reading a value. A point without units is incomplete evidence.",
        "Trace one vertical guide from09:02 to its closing price102, then one horizontal guide back to its labeled time. A correct answer includes both values and USD/EDU."
      ],
      "example": "At 09:02 UTC the synthetic EDU/USD close is 102 USD per EDU.",
      "misconception": "The horizontal axis is not the price axis.",
      "visual": "none",
      "activities": [
        {
          "id": "s3-1-observe-1",
          "kind": "choice",
          "category": "PRACTICAL",
          "sectionId": "s3-1-section-1",
          "objectiveId": "s3-1-objective-1",
          "competency": "CHART_CONTEXT",
          "prompt": "Select the coordinate for the second row close.",
          "options": [
            {
              "id": "observed",
              "label": "09:01 UTC; 103 USD/EDU"
            },
            {
              "id": "unsupported",
              "label": "103 UTC; 09:01 USD/EDU"
            }
          ],
          "correct": "observed"
        }
      ]
    },
    {
      "id": "s3-1-section-2",
      "title": "Read the data passport",
      "objectiveId": "s3-1-objective-1",
      "competency": "CHART_CONTEXT",
      "paragraphs": [
        "A chart needs symbol, source, quote type, timezone and bar duration. Our synthetic EDU/USD last-price series is educational, not an executable quote. A bid series and an ask series can differ without either being corrupt.",
        "Changing the feed from last to ask changes the meaning of each observation. Retain the feed label with any copied coordinate so another learner can reproduce the claim."
      ],
      "example": "Write synthetic source; last price; UTC; one minute; USD per EDU.",
      "misconception": "A chart close does not establish the price available to buy.",
      "visual": "none",
      "activities": [
        {
          "id": "s3-1-observe-2",
          "kind": "choice",
          "category": "PRACTICAL",
          "sectionId": "s3-1-section-2",
          "objectiveId": "s3-1-objective-1",
          "competency": "CHART_CONTEXT",
          "prompt": "Which context matches this displayed series?",
          "options": [
            {
              "id": "observed",
              "label": "Synthetic EDU/USD; last price; UTC; one-minute starts"
            },
            {
              "id": "unsupported",
              "label": "Executable ask; New York time; one-hour starts"
            }
          ],
          "correct": "observed"
        }
      ]
    },
    {
      "id": "s3-1-section-3",
      "title": "Compare representations",
      "objectiveId": "s3-1-objective-1",
      "competency": "CHART_CONTEXT",
      "paragraphs": [
        "A close-line connects only closing values. Bars and candles also retain open, high and low. Switch representation without changing the source rows, then identify a fact that disappears on the line.",
        "Compare09:01 H104 with C103. The close-only view retains103 but cannot reconstruct104; recovering a hidden extreme by guess is not observation."
      ],
      "example": "The 09:01 high is 104 although its close is 103.",
      "misconception": "A line does not show every traded or quoted value.",
      "visual": "none",
      "activities": [
        {
          "id": "s3-1-observe-3",
          "kind": "choice",
          "category": "PRACTICAL",
          "sectionId": "s3-1-section-3",
          "objectiveId": "s3-1-objective-1",
          "competency": "CHART_CONTEXT",
          "prompt": "Which value is omitted by a close-only line?",
          "options": [
            {
              "id": "observed",
              "label": "09:01 high104"
            },
            {
              "id": "unsupported",
              "label": "09:01 close103"
            }
          ],
          "correct": "observed"
        }
      ]
    },
    {
      "id": "s3-1-section-4",
      "title": "Inspect missing context",
      "objectiveId": "s3-1-objective-2",
      "competency": "CHART_OBSERVATION",
      "paragraphs": [
        "Zoom changes the visible portion and scale, not the observations themselves. A gap in rows is missing evidence; it does not prove that the market remained still. Record the visible interval.",
        "Record which rows are absent from a cropped window. Compare identical numerical changes on two vertical scales before interpreting apparent steepness."
      ],
      "example": "Cropping to 09:02–09:04 hides the earlier high at 09:01.",
      "misconception": "A steep screen angle is not a unit-independent measure of speed.",
      "visual": "none",
      "activities": [
        {
          "id": "s3-1-observe-4",
          "kind": "choice",
          "category": "PRACTICAL",
          "sectionId": "s3-1-section-4",
          "objectiveId": "s3-1-objective-2",
          "competency": "CHART_OBSERVATION",
          "prompt": "Crop to09:02–09:04. What stays unchanged?",
          "options": [
            {
              "id": "observed",
              "label": "The source values of retained bars"
            },
            {
              "id": "unsupported",
              "label": "The underlying period becomes three minutes"
            }
          ],
          "correct": "observed"
        }
      ]
    },
    {
      "id": "s3-1-section-5",
      "title": "Separate fact from story",
      "objectiveId": "s3-1-objective-2",
      "competency": "CHART_OBSERVATION",
      "paragraphs": [
        "A timestamped value can be checked against the table. A story about why participants acted requires evidence beyond these bars. Keep three observations and one explicit unknown in your record.",
        "Replace “buyers knew something” with a measurable statement such as “09:01 close103 exceeds09:00 close101.” Keep the proposed explanation as an unverified hypothesis."
      ],
      "example": "The close rises from 100 to 103; the identity and motives of participants remain unknown.",
      "misconception": "Movement alone cannot identify its cause.",
      "visual": "none",
      "activities": [
        {
          "id": "s3-1-observe-5",
          "kind": "choice",
          "category": "PRACTICAL",
          "sectionId": "s3-1-section-5",
          "objectiveId": "s3-1-objective-2",
          "competency": "CHART_OBSERVATION",
          "prompt": "Which is an observation rather than inferred cause?",
          "options": [
            {
              "id": "observed",
              "label": "09:03 close99 is below09:02 close102"
            },
            {
              "id": "unsupported",
              "label": "A named institution caused the fall"
            }
          ],
          "correct": "observed"
        }
      ]
    }
  ],
  "assessment": [
    {
      "id": "s3-1-check-1",
      "kind": "written",
      "category": "PRACTICAL",
      "sectionId": "s3-1-section-1",
      "objectiveId": "s3-1-objective-1",
      "competency": "CHART_CONTEXT",
      "prompt": "Fresh synthetic MAP/USD last-price chart; USD per MAP; UTC; one-minute start timestamps. Rows 11:00 O50 H52 L49 C51; 11:01 O51 H54 L50 C53; 11:02 O53 H53 L50 C51; 11:03 O51 H52 L48 C49. Match each requested coordinate, then annotate symbol, source, quote type, unit, period and visible interval. Record three verifiable chart facts and one unknown; explain what a crop to 11:02–11:03 hides. Demonstrate construction or coordinate selection on these fresh values.",
      "rubric": "Require all six context fields; coordinate labels with units/time; three correct source-checkable facts; explicit causal or intraperiod unknown; crop omission of 11:01 H54. Do not award practical credit for terminology alone.",
      "critical": true
    },
    {
      "id": "s3-1-check-2",
      "kind": "written",
      "category": "PRACTICAL",
      "sectionId": "s3-1-section-5",
      "objectiveId": "s3-1-objective-2",
      "competency": "CHART_OBSERVATION",
      "prompt": "Fresh synthetic MAP/USD last-price chart; USD per MAP; UTC; one-minute start timestamps. Rows 11:00 O50 H52 L49 C51; 11:01 O51 H54 L50 C53; 11:02 O53 H53 L50 C51; 11:03 O51 H52 L48 C49. Match each requested coordinate, then annotate symbol, source, quote type, unit, period and visible interval. Record three verifiable chart facts and one unknown; explain what a crop to 11:02–11:03 hides. State the information limit and explain the bounded interpretation.",
      "rubric": "Require all six context fields; coordinate labels with units/time; three correct source-checkable facts; explicit causal or intraperiod unknown; crop omission of 11:01 H54. Do not award practical credit for terminology alone.",
      "critical": true
    },
    {
      "id": "stage-3-class-1-fresh-objective-0",
      "kind": "choice",
      "category": "KNOWLEDGE",
      "sectionId": "s3-1-section-1",
      "objectiveId": "s3-1-objective-1",
      "competency": "CHART_CONTEXT",
      "prompt": "Synthetic AX/BY last-price chart: horizontal axis UTC, vertical BY/AX. Point10:05 at8 means?",
      "options": [
        {
          "id": "o0",
          "label": "8BY per AX at10:05UTC"
        },
        {
          "id": "o1",
          "label": "8AX per BY for every trade"
        },
        {
          "id": "o2",
          "label": "A guaranteed executable ask"
        }
      ],
      "correct": "o0",
      "critical": true
    },
    {
      "id": "stage-3-class-1-fresh-objective-1",
      "kind": "choice",
      "category": "KNOWLEDGE",
      "sectionId": "s3-1-section-4",
      "objectiveId": "s3-1-objective-2",
      "competency": "CHART_OBSERVATION",
      "prompt": "Only four completed closes rise. Which is justified?",
      "options": [
        {
          "id": "o0",
          "label": "The next close must rise"
        },
        {
          "id": "o1",
          "label": "The shown closes rose; next movement and cause are unknown"
        },
        {
          "id": "o2",
          "label": "A dealer bought the entire market"
        }
      ],
      "correct": "o1",
      "critical": true
    }
  ],
  "homework": [
    {
      "id": "s3-1-homework-coordinates",
      "kind": "matching",
      "category": "PRACTICAL",
      "sectionId": "s3-1-section-1",
      "objectiveId": "s3-1-objective-1",
      "competency": "CHART_CONTEXT",
      "prompt": "Fresh synthetic MAP/USD last-price chart; USD per MAP; UTC; one-minute start timestamps. Rows 11:00 O50 H52 L49 C51; 11:01 O51 H54 L50 C53; 11:02 O53 H53 L50 C51; 11:03 O51 H52 L48 C49. Match each requested coordinate, then annotate symbol, source, quote type, unit, period and visible interval. Record three verifiable chart facts and one unknown; explain what a crop to 11:02–11:03 hides.",
      "items": [
        {
          "id": "point-0",
          "label": "11:01 close"
        },
        {
          "id": "point-1",
          "label": "11:03 low"
        },
        {
          "id": "point-2",
          "label": "Time axis"
        },
        {
          "id": "point-3",
          "label": "Price axis"
        }
      ],
      "targets": [
        {
          "id": "value-0",
          "label": "53"
        },
        {
          "id": "value-1",
          "label": "48"
        },
        {
          "id": "value-2",
          "label": "horizontal"
        },
        {
          "id": "value-3",
          "label": "vertical"
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
      "id": "s3-1-homework-chart",
      "kind": "written",
      "category": "PRACTICAL",
      "sectionId": "s3-1-section-5",
      "objectiveId": "s3-1-objective-2",
      "competency": "CHART_OBSERVATION",
      "prompt": "Fresh synthetic MAP/USD last-price chart; USD per MAP; UTC; one-minute start timestamps. Rows 11:00 O50 H52 L49 C51; 11:01 O51 H54 L50 C53; 11:02 O53 H53 L50 C51; 11:03 O51 H52 L48 C49. Match each requested coordinate, then annotate symbol, source, quote type, unit, period and visible interval. Record three verifiable chart facts and one unknown; explain what a crop to 11:02–11:03 hides. Submit the labeled coordinates/annotations and short reasoning in this response; use the supplied table as an equal alternative to drawing. Your original submission and teacher review remain in the current class attempt record.",
      "rubric": "Require all six context fields; coordinate labels with units/time; three correct source-checkable facts; explicit causal or intraperiod unknown; crop omission of 11:01 H54. Do not award practical credit for terminology alone.",
      "critical": true
    }
  ],
  "remediation": [
    {
      "competency": "CHART_CONTEXT",
      "sectionId": "s3-1-section-1",
      "title": "Rebuild coordinates and construction",
      "paragraph": "Keep the failed attempt. Revisit Find a coordinate; use the changed numeric/context case below, then explain the corrected observation in your own labeled record. 15:05, 7 EUR/VIZ",
      "reinforcement": {
        "id": "s3-1-retry-1",
        "kind": "choice",
        "category": "PRACTICAL",
        "sectionId": "s3-1-section-1",
        "objectiveId": "s3-1-objective-1",
        "competency": "CHART_CONTEXT",
        "prompt": "A second map uses VIZ/EUR, ask feed, five-minute starts at15:00; close at15:05 is7 EUR/VIZ. Select its valid coordinate.",
        "options": [
          {
            "id": "valid",
            "label": "15:05, 7 EUR/VIZ"
          },
          {
            "id": "invalid",
            "label": "7 minutes, 15:05 EUR"
          }
        ],
        "correct": "valid",
        "critical": true
      }
    },
    {
      "competency": "CHART_OBSERVATION",
      "sectionId": "s3-1-section-5",
      "title": "Rebuild the evidence boundary",
      "paragraph": "Keep the failed attempt. Revisit Separate fact from story; use the changed numeric/context case below, then explain the corrected observation in your own labeled record. The visible closes rise; earlier behavior and cause are unknown.",
      "reinforcement": {
        "id": "s3-1-retry-2",
        "kind": "choice",
        "category": "PRACTICAL",
        "sectionId": "s3-1-section-5",
        "objectiveId": "s3-1-objective-2",
        "competency": "CHART_OBSERVATION",
        "prompt": "Only15:00–15:10 is visible and closes rise. Which statement is supportable?",
        "options": [
          {
            "id": "valid",
            "label": "The visible closes rise; earlier behavior and cause are unknown."
          },
          {
            "id": "invalid",
            "label": "The market has always risen because buyers are confident."
          }
        ],
        "correct": "valid",
        "critical": true
      }
    }
  ],
  "liveGuide": [
    {
      "title": "Find a coordinate: demonstrate, pause, compare",
      "minutes": 12,
      "talkingPoints": [
        "0–3 min: demonstrate with the labeled shared rows. At 09:02 UTC the synthetic EDU/USD close is 102 USD per EDU.",
        "3–6 min: individual response before group discussion. Time advances from left to right; the vertical coordinate is a price in the named quote unit. Read the timestamp before reading a value. A point without units is incomplete evidence.",
        "6–9 min: compare two learner answers against the data. The horizontal axis is not the price axis.",
        "9–12 min: each learner corrects one coordinate and preserves the original; facilitator checks the stated evidence boundary."
      ],
      "activity": {
        "kind": "POLL",
        "prompt": "At 09:02 UTC the synthetic EDU/USD close is 102 USD per EDU. Demonstrate find a coordinate using one labeled coordinate and name an unsupported inference.",
        "sectionId": "s3-1-section-1"
      }
    },
    {
      "title": "Read the data passport: demonstrate, pause, compare",
      "minutes": 12,
      "talkingPoints": [
        "0–3 min: demonstrate with the labeled shared rows. Write synthetic source; last price; UTC; one minute; USD per EDU.",
        "3–6 min: individual response before group discussion. A chart needs symbol, source, quote type, timezone and bar duration. Our synthetic EDU/USD last-price series is educational, not an executable quote. A bid series and an ask series can differ without either being corrupt.",
        "6–9 min: compare two learner answers against the data. A chart close does not establish the price available to buy.",
        "9–12 min: each learner corrects one coordinate and preserves the original; facilitator checks the stated evidence boundary."
      ],
      "activity": {
        "kind": "SINGLE",
        "prompt": "Write synthetic source; last price; UTC; one minute; USD per EDU. Demonstrate read the data passport using one labeled coordinate and name an unsupported inference.",
        "sectionId": "s3-1-section-2"
      }
    },
    {
      "title": "Compare representations: demonstrate, pause, compare",
      "minutes": 12,
      "talkingPoints": [
        "0–3 min: demonstrate with the labeled shared rows. The 09:01 high is 104 although its close is 103.",
        "3–6 min: individual response before group discussion. A close-line connects only closing values. Bars and candles also retain open, high and low. Switch representation without changing the source rows, then identify a fact that disappears on the line.",
        "6–9 min: compare two learner answers against the data. A line does not show every traded or quoted value.",
        "9–12 min: each learner corrects one coordinate and preserves the original; facilitator checks the stated evidence boundary."
      ],
      "activity": {
        "kind": "WRITTEN",
        "prompt": "The 09:01 high is 104 although its close is 103. Demonstrate compare representations using one labeled coordinate and name an unsupported inference.",
        "sectionId": "s3-1-section-3"
      }
    },
    {
      "title": "Inspect missing context: demonstrate, pause, compare",
      "minutes": 12,
      "talkingPoints": [
        "0–3 min: demonstrate with the labeled shared rows. Cropping to 09:02–09:04 hides the earlier high at 09:01.",
        "3–6 min: individual response before group discussion. Zoom changes the visible portion and scale, not the observations themselves. A gap in rows is missing evidence; it does not prove that the market remained still. Record the visible interval.",
        "6–9 min: compare two learner answers against the data. A steep screen angle is not a unit-independent measure of speed.",
        "9–12 min: each learner corrects one coordinate and preserves the original; facilitator checks the stated evidence boundary."
      ],
      "activity": {
        "kind": "WRITTEN",
        "prompt": "Cropping to 09:02–09:04 hides the earlier high at 09:01. Demonstrate inspect missing context using one labeled coordinate and name an unsupported inference.",
        "sectionId": "s3-1-section-4"
      }
    },
    {
      "title": "Separate fact from story: demonstrate, pause, compare",
      "minutes": 12,
      "talkingPoints": [
        "0–3 min: demonstrate with the labeled shared rows. The close rises from 100 to 103; the identity and motives of participants remain unknown.",
        "3–6 min: individual response before group discussion. A timestamped value can be checked against the table. A story about why participants acted requires evidence beyond these bars. Keep three observations and one explicit unknown in your record.",
        "6–9 min: compare two learner answers against the data. Movement alone cannot identify its cause.",
        "9–12 min: each learner corrects one coordinate and preserves the original; facilitator checks the stated evidence boundary."
      ],
      "activity": {
        "kind": "WRITTEN",
        "prompt": "The close rises from 100 to 103; the identity and motives of participants remain unknown. Demonstrate separate fact from story using one labeled coordinate and name an unsupported inference.",
        "sectionId": "s3-1-section-5"
      }
    }
  ],
  "studyGuide": {
    "summary": [
      "Time advances from left to right; the vertical coordinate is a price in the named quote unit. Read the timestamp before reading a value. A point without units is incomplete evidence.",
      "A chart needs symbol, source, quote type, timezone and bar duration. Our synthetic EDU/USD last-price series is educational, not an executable quote. A bid series and an ask series can differ without either being corrupt.",
      "A close-line connects only closing values. Bars and candles also retain open, high and low. Switch representation without changing the source rows, then identify a fact that disappears on the line.",
      "Zoom changes the visible portion and scale, not the observations themselves. A gap in rows is missing evidence; it does not prove that the market remained still. Record the visible interval.",
      "A timestamped value can be checked against the table. A story about why participants acted requires evidence beyond these bars. Keep three observations and one explicit unknown in your record."
    ],
    "bigPicture": "Read the Chart: Price, Time and Data Context turns a chart into a bounded, reproducible observation record rather than a forecast.",
    "fiveThings": [
      "At 09:02 UTC the synthetic EDU/USD close is 102 USD per EDU.",
      "Write synthetic source; last price; UTC; one minute; USD per EDU.",
      "The 09:01 high is 104 although its close is 103.",
      "Cropping to 09:02–09:04 hides the earlier high at 09:01.",
      "The close rises from 100 to 103; the identity and motives of participants remain unknown."
    ],
    "outcomes": [
      "Identify price/time axes, symbol, feed, unit and period on fresh chart data.",
      "Separate reproducible chart observations from unsupported causal inference."
    ],
    "examples": [
      "At 09:02 UTC the synthetic EDU/USD close is 102 USD per EDU.",
      "Write synthetic source; last price; UTC; one minute; USD per EDU.",
      "The 09:01 high is 104 although its close is 103.",
      "Cropping to 09:02–09:04 hides the earlier high at 09:01.",
      "The close rises from 100 to 103; the identity and motives of participants remain unknown."
    ],
    "misconceptions": [
      "The horizontal axis is not the price axis.",
      "A chart close does not establish the price available to buy.",
      "A line does not show every traded or quoted value.",
      "A steep screen angle is not a unit-independent measure of speed.",
      "Movement alone cannot identify its cause."
    ],
    "review": [
      {
        "sectionId": "s3-1-section-1",
        "label": "Find a coordinate"
      },
      {
        "sectionId": "s3-1-section-2",
        "label": "Read the data passport"
      },
      {
        "sectionId": "s3-1-section-3",
        "label": "Compare representations"
      },
      {
        "sectionId": "s3-1-section-4",
        "label": "Inspect missing context"
      },
      {
        "sectionId": "s3-1-section-5",
        "label": "Separate fact from story"
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
    "homeworkIntro": "Fresh synthetic MAP/USD last-price chart; USD per MAP; UTC; one-minute start timestamps. Rows 11:00 O50 H52 L49 C51; 11:01 O51 H54 L50 C53; 11:02 O53 H53 L50 C51; 11:03 O51 H52 L48 C49. Match each requested coordinate, then annotate symbol, source, quote type, unit, period and visible interval. Record three verifiable chart facts and one unknown; explain what a crop to 11:02–11:03 hides.",
    "pacing": {
      "minimum": 55,
      "maximum": 70
    },
    "assessmentCoverage": [
      "CHART_CONTEXT",
      "CHART_OBSERVATION"
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
      "caption": "Separate fact from story: synthetic EDU/USD last-price; USD/EDU; UTC one-minute interval starts; all supplied bars complete.",
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
      "Can I demonstrate find a coordinate? Check: At 09:02 UTC the synthetic EDU/USD close is 102 USD per EDU.",
      "Can I demonstrate read the data passport? Check: Write synthetic source; last price; UTC; one minute; USD per EDU.",
      "Can I demonstrate compare representations? Check: The 09:01 high is 104 although its close is 103.",
      "Can I demonstrate inspect missing context? Check: Cropping to 09:02–09:04 hides the earlier high at 09:01.",
      "Can I demonstrate separate fact from story? Check: The close rises from 100 to 103; the identity and motives of participants remain unknown."
    ]
  }
};
