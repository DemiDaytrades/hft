import 'server-only';
import type { StageExperience } from '../stage/contracts';
export const EXPERIENCE_S3_1: StageExperience = {
  "classId": "stage-3-class-1",
  "academicVersion": "chart-foundations-s3-1.1.0.0",
  "revision": "s3-1-experience.1.0.0",
  "format": "chart",
  "sections": [
    {
      "sectionId": "s3-1-section-1",
      "hook": "At 09:02 UTC the synthetic EDU/USD close is 102 USD per EDU.",
      "scenario": "Time advances from left to right; the vertical coordinate is a price in the named quote unit. Read the timestamp before reading a value. A point without units is incomplete evidence.",
      "visual": {
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
        "caption": "Find a coordinate: synthetic EDU/USD last-price; USD/EDU; UTC one-minute interval starts; all supplied bars complete.",
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
      "practice": [
        {
          "id": "s3-1-practice-1",
          "kind": "choice",
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
          "correct": "observed",
          "explanation": "Time advances from left to right; the vertical coordinate is a price in the named quote unit. Read the timestamp before reading a value. A point without units is incomplete evidence.",
          "retry": "Return to Find a coordinate; compare the stated rule with the labeled coordinates before trying again."
        }
      ],
      "explanation": [
        "Time advances from left to right; the vertical coordinate is a price in the named quote unit. Read the timestamp before reading a value. A point without units is incomplete evidence.",
        "The horizontal axis is not the price axis."
      ],
      "takeaway": "At 09:02 UTC the synthetic EDU/USD close is 102 USD per EDU.",
      "demi": "Ask each learner to identify a coordinate before defending a label. The horizontal axis is not the price axis."
    },
    {
      "sectionId": "s3-1-section-2",
      "hook": "Write synthetic source; last price; UTC; one minute; USD per EDU.",
      "scenario": "A chart needs symbol, source, quote type, timezone and bar duration. Our synthetic EDU/USD last-price series is educational, not an executable quote. A bid series and an ask series can differ without either being corrupt.",
      "visual": {
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
        "caption": "Read the data passport: synthetic EDU/USD last-price; USD/EDU; UTC one-minute interval starts; all supplied bars complete.",
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
      "practice": [
        {
          "id": "s3-1-practice-2",
          "kind": "choice",
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
          "correct": "observed",
          "explanation": "A chart needs symbol, source, quote type, timezone and bar duration. Our synthetic EDU/USD last-price series is educational, not an executable quote. A bid series and an ask series can differ without either being corrupt.",
          "retry": "Return to Read the data passport; compare the stated rule with the labeled coordinates before trying again."
        }
      ],
      "explanation": [
        "A chart needs symbol, source, quote type, timezone and bar duration. Our synthetic EDU/USD last-price series is educational, not an executable quote. A bid series and an ask series can differ without either being corrupt.",
        "A chart close does not establish the price available to buy."
      ],
      "takeaway": "Write synthetic source; last price; UTC; one minute; USD per EDU.",
      "demi": "Ask each learner to identify a coordinate before defending a label. A chart close does not establish the price available to buy."
    },
    {
      "sectionId": "s3-1-section-3",
      "hook": "The 09:01 high is 104 although its close is 103.",
      "scenario": "A close-line connects only closing values. Bars and candles also retain open, high and low. Switch representation without changing the source rows, then identify a fact that disappears on the line.",
      "visual": {
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
        "caption": "Compare representations: synthetic EDU/USD last-price; USD/EDU; UTC one-minute interval starts; all supplied bars complete.",
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
      "practice": [
        {
          "id": "s3-1-practice-3",
          "kind": "choice",
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
          "correct": "observed",
          "explanation": "A close-line connects only closing values. Bars and candles also retain open, high and low. Switch representation without changing the source rows, then identify a fact that disappears on the line.",
          "retry": "Return to Compare representations; compare the stated rule with the labeled coordinates before trying again."
        }
      ],
      "explanation": [
        "A close-line connects only closing values. Bars and candles also retain open, high and low. Switch representation without changing the source rows, then identify a fact that disappears on the line.",
        "A line does not show every traded or quoted value."
      ],
      "takeaway": "The 09:01 high is 104 although its close is 103.",
      "demi": "Ask each learner to identify a coordinate before defending a label. A line does not show every traded or quoted value."
    },
    {
      "sectionId": "s3-1-section-4",
      "hook": "Cropping to 09:02–09:04 hides the earlier high at 09:01.",
      "scenario": "Zoom changes the visible portion and scale, not the observations themselves. A gap in rows is missing evidence; it does not prove that the market remained still. Record the visible interval.",
      "visual": {
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
        "caption": "Inspect missing context: synthetic EDU/USD last-price; USD/EDU; UTC one-minute interval starts; all supplied bars complete.",
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
      "practice": [
        {
          "id": "s3-1-practice-4",
          "kind": "choice",
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
          "correct": "observed",
          "explanation": "Zoom changes the visible portion and scale, not the observations themselves. A gap in rows is missing evidence; it does not prove that the market remained still. Record the visible interval.",
          "retry": "Return to Inspect missing context; compare the stated rule with the labeled coordinates before trying again."
        }
      ],
      "explanation": [
        "Zoom changes the visible portion and scale, not the observations themselves. A gap in rows is missing evidence; it does not prove that the market remained still. Record the visible interval.",
        "A steep screen angle is not a unit-independent measure of speed."
      ],
      "takeaway": "Cropping to 09:02–09:04 hides the earlier high at 09:01.",
      "demi": "Ask each learner to identify a coordinate before defending a label. A steep screen angle is not a unit-independent measure of speed."
    },
    {
      "sectionId": "s3-1-section-5",
      "hook": "The close rises from 100 to 103; the identity and motives of participants remain unknown.",
      "scenario": "A timestamped value can be checked against the table. A story about why participants acted requires evidence beyond these bars. Keep three observations and one explicit unknown in your record.",
      "visual": {
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
      "practice": [
        {
          "id": "s3-1-practice-5",
          "kind": "choice",
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
          "correct": "observed",
          "explanation": "A timestamped value can be checked against the table. A story about why participants acted requires evidence beyond these bars. Keep three observations and one explicit unknown in your record.",
          "retry": "Return to Separate fact from story; compare the stated rule with the labeled coordinates before trying again."
        }
      ],
      "explanation": [
        "A timestamped value can be checked against the table. A story about why participants acted requires evidence beyond these bars. Keep three observations and one explicit unknown in your record.",
        "Movement alone cannot identify its cause."
      ],
      "takeaway": "The close rises from 100 to 103; the identity and motives of participants remain unknown.",
      "demi": "Ask each learner to identify a coordinate before defending a label. Movement alone cannot identify its cause."
    }
  ]
};
