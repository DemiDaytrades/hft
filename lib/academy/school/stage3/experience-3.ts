import 'server-only';
import type {StageExperience} from '../stage/contracts';
export const EXPERIENCE_S3_3:StageExperience = {
  "classId": "stage-3-class-3",
  "academicVersion": "chart-foundations-s3-3.1.0.0",
  "revision": "s3-timeframe-visual.1.0.1",
  "format": "candles",
  "sections": [
    {
      "sectionId": "s3-3-section-1",
      "hook": "Use the half-open interval [09:00,09:03) UTC.",
      "scenario": "State timezone and whether timestamps denote interval starts. Here one-minute rows begin at the labeled UTC time. A 09:00 three-minute bar contains 09:00, 09:01 and 09:02, excluding 09:03.",
      "visual": {
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
        "caption": "Fix interval boundaries: synthetic EDU/USD last-price; USD/EDU; UTC one-minute interval starts; all supplied bars complete.",
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
          "caption": "Use the same rows in chart and table; unseen bars cannot support a present-time claim.",
          "aggregateEvery": 3
        }
      },
      "practice": [
        {
          "id": "s3-3-practice-1",
          "kind": "choice",
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
          "correct": "observed",
          "explanation": "State timezone and whether timestamps denote interval starts. Here one-minute rows begin at the labeled UTC time. A 09:00 three-minute bar contains 09:00, 09:01 and 09:02, excluding 09:03.",
          "retry": "Return to Fix interval boundaries; compare the stated rule with the labeled coordinates before trying again."
        }
      ],
      "explanation": [
        "State timezone and whether timestamps denote interval starts. Here one-minute rows begin at the labeled UTC time. A 09:00 three-minute bar contains 09:00, 09:01 and 09:02, excluding 09:03.",
        "Three adjacent rows need not form a correctly aligned bar."
      ],
      "takeaway": "Use the half-open interval [09:00,09:03) UTC.",
      "demi": "Ask each learner to identify a coordinate before defending a label. Three adjacent rows need not form a correctly aligned bar."
    },
    {
      "sectionId": "s3-3-section-2",
      "hook": "Rows 09:00–09:02 aggregate to O100 H104 L99 C102.",
      "scenario": "The larger bar uses the first open, maximum high, minimum low and last close. These rules preserve endpoints and extremes; averaging destroys the candle meaning.",
      "visual": {
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
        "caption": "Aggregate without averaging: synthetic EDU/USD last-price; USD/EDU; UTC one-minute interval starts; all supplied bars complete.",
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
          "caption": "Use the same rows in chart and table; unseen bars cannot support a present-time claim.",
          "aggregateEvery": 3
        }
      },
      "practice": [
        {
          "id": "s3-3-practice-2",
          "kind": "choice",
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
          "correct": "observed",
          "explanation": "The larger bar uses the first open, maximum high, minimum low and last close. These rules preserve endpoints and extremes; averaging destroys the candle meaning.",
          "retry": "Return to Aggregate without averaging; compare the stated rule with the labeled coordinates before trying again."
        }
      ],
      "explanation": [
        "The larger bar uses the first open, maximum high, minimum low and last close. These rules preserve endpoints and extremes; averaging destroys the candle meaning.",
        "The average close is not the aggregate close."
      ],
      "takeaway": "Rows 09:00–09:02 aggregate to O100 H104 L99 C102.",
      "demi": "Ask each learner to identify a coordinate before defending a label. The average close is not the aggregate close."
    },
    {
      "sectionId": "s3-3-section-3",
      "hook": "The aggregate hides the 09:01 close of 103 followed by 09:02 close of 102.",
      "scenario": "One larger candle loses the ordering of the component closes and the positions of intermediate moves. Keep the source rows beside the aggregate when comparing accounts.",
      "visual": {
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
        "caption": "Recover what is hidden: synthetic EDU/USD last-price; USD/EDU; UTC one-minute interval starts; all supplied bars complete.",
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
          "caption": "Use the same rows in chart and table; unseen bars cannot support a present-time claim.",
          "aggregateEvery": 3
        }
      },
      "practice": [
        {
          "id": "s3-3-practice-3",
          "kind": "choice",
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
          "correct": "observed",
          "explanation": "One larger candle loses the ordering of the component closes and the positions of intermediate moves. Keep the source rows beside the aggregate when comparing accounts.",
          "retry": "Return to Recover what is hidden; compare the stated rule with the labeled coordinates before trying again."
        }
      ],
      "explanation": [
        "One larger candle loses the ordering of the component closes and the positions of intermediate moves. Keep the source rows beside the aggregate when comparing accounts.",
        "A smooth large-period picture does not prove a smooth path."
      ],
      "takeaway": "The aggregate hides the 09:01 close of 103 followed by 09:02 close of 102.",
      "demi": "Ask each learner to identify a coordinate before defending a label. A smooth large-period picture does not prove a smooth path."
    },
    {
      "sectionId": "s3-3-section-4",
      "hook": "Displaying only three one-minute rows is still a one-minute chart.",
      "scenario": "Zoom crops or rescales the same bars. A timeframe change recomputes bars over different boundaries. Verify the number and timestamps of rows before interpreting a visual difference.",
      "visual": {
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
        "caption": "Distinguish zoom from period: synthetic EDU/USD last-price; USD/EDU; UTC one-minute interval starts; all supplied bars complete.",
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
          "caption": "Use the same rows in chart and table; unseen bars cannot support a present-time claim.",
          "aggregateEvery": 3
        }
      },
      "practice": [
        {
          "id": "s3-3-practice-4",
          "kind": "choice",
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
          "correct": "observed",
          "explanation": "Zoom crops or rescales the same bars. A timeframe change recomputes bars over different boundaries. Verify the number and timestamps of rows before interpreting a visual difference.",
          "retry": "Return to Distinguish zoom from period; compare the stated rule with the labeled coordinates before trying again."
        }
      ],
      "explanation": [
        "Zoom crops or rescales the same bars. A timeframe change recomputes bars over different boundaries. Verify the number and timestamps of rows before interpreting a visual difference.",
        "Fewer visible candles do not necessarily mean a larger timeframe."
      ],
      "takeaway": "Displaying only three one-minute rows is still a one-minute chart.",
      "demi": "Ask each learner to identify a coordinate before defending a label. Fewer visible candles do not necessarily mean a larger timeframe."
    },
    {
      "sectionId": "s3-3-section-5",
      "hook": "At 09:01 close, the [09:00,09:03) bar still lacks 09:02.",
      "scenario": "Until the final component closes, the aggregate close, high and low may change. Label partial data and the last included time. Do not compare a developing bar as though it were final.",
      "visual": {
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
          "caption": "Use the same rows in chart and table; unseen bars cannot support a present-time claim.",
          "aggregateEvery": 3
        }
      },
      "practice": [
        {
          "id": "s3-3-practice-5",
          "kind": "choice",
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
          "correct": "observed",
          "explanation": "Until the final component closes, the aggregate close, high and low may change. Label partial data and the last included time. Do not compare a developing bar as though it were final.",
          "retry": "Return to Mark an unfinished interval; compare the stated rule with the labeled coordinates before trying again."
        }
      ],
      "explanation": [
        "Until the final component closes, the aggregate close, high and low may change. Label partial data and the last included time. Do not compare a developing bar as though it were final.",
        "A developing high or close can change without a data error."
      ],
      "takeaway": "At 09:01 close, the [09:00,09:03) bar still lacks 09:02.",
      "demi": "Ask each learner to identify a coordinate before defending a label. A developing high or close can change without a data error."
    }
  ]
};
