import 'server-only';
import type { StageExperience } from '../stage/contracts';
export const EXPERIENCE_S3_2: StageExperience = {
  "classId": "stage-3-class-2",
  "academicVersion": "chart-foundations-s3-2.1.0.0",
  "revision": "s3-2-experience.1.0.0",
  "format": "candles",
  "sections": [
    {
      "sectionId": "s3-2-section-1",
      "hook": "O100 H104 L99 C103 is valid; O100 H102 L99 C103 is impossible.",
      "scenario": "High must be at least both open and close; low must be at most both. All four values belong to the same symbol, source and interval. Reject an impossible row before drawing attractive geometry.",
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
        "caption": "Validate before drawing: synthetic EDU/USD last-price; USD/EDU; UTC one-minute interval starts; all supplied bars complete.",
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
          "id": "s3-2-practice-1",
          "kind": "choice",
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
          "correct": "observed",
          "explanation": "High must be at least both open and close; low must be at most both. All four values belong to the same symbol, source and interval. Reject an impossible row before drawing attractive geometry.",
          "retry": "Return to Validate before drawing; compare the stated rule with the labeled coordinates before trying again."
        }
      ],
      "explanation": [
        "High must be at least both open and close; low must be at most both. All four values belong to the same symbol, source and interval. Reject an impossible row before drawing attractive geometry.",
        "A supplied row is not automatically valid."
      ],
      "takeaway": "O100 H104 L99 C103 is valid; O100 H102 L99 C103 is impossible.",
      "demi": "Ask each learner to identify a coordinate before defending a label. A supplied row is not automatically valid."
    },
    {
      "sectionId": "s3-2-section-2",
      "hook": "For O100 H104 L99 C103, body length is 3 and full range is 5 USD per EDU.",
      "scenario": "The body runs between open and close. The high and low define the entire range; wicks connect those extremes to the body. Use numeric labels so that color is optional.",
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
        "caption": "Place body and wicks: synthetic EDU/USD last-price; USD/EDU; UTC one-minute interval starts; all supplied bars complete.",
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
          "id": "s3-2-practice-2",
          "kind": "choice",
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
          "correct": "observed",
          "explanation": "The body runs between open and close. The high and low define the entire range; wicks connect those extremes to the body. Use numeric labels so that color is optional.",
          "retry": "Return to Place body and wicks; compare the stated rule with the labeled coordinates before trying again."
        }
      ],
      "explanation": [
        "The body runs between open and close. The high and low define the entire range; wicks connect those extremes to the body. Use numeric labels so that color is optional.",
        "The top of the body is not necessarily the high."
      ],
      "takeaway": "For O100 H104 L99 C103, body length is 3 and full range is 5 USD per EDU.",
      "demi": "Ask each learner to identify a coordinate before defending a label. The top of the body is not necessarily the high."
    },
    {
      "sectionId": "s3-2-section-3",
      "hook": "O102 H105 L99 C102 has unchanged close and range 6.",
      "scenario": "Compare close with open: higher, lower or unchanged. This describes a completed interval. An unchanged body can coexist with a wide high-low range.",
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
        "caption": "Classify close direction: synthetic EDU/USD last-price; USD/EDU; UTC one-minute interval starts; all supplied bars complete.",
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
          "id": "s3-2-practice-3",
          "kind": "choice",
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
          "correct": "observed",
          "explanation": "Compare close with open: higher, lower or unchanged. This describes a completed interval. An unchanged body can coexist with a wide high-low range.",
          "retry": "Return to Classify close direction; compare the stated rule with the labeled coordinates before trying again."
        }
      ],
      "explanation": [
        "Compare close with open: higher, lower or unchanged. This describes a completed interval. An unchanged body can coexist with a wide high-low range.",
        "An unchanged close does not mean that nothing moved."
      ],
      "takeaway": "O102 H105 L99 C102 has unchanged close and range 6.",
      "demi": "Ask each learner to identify a coordinate before defending a label. An unchanged close does not mean that nothing moved."
    },
    {
      "sectionId": "s3-2-section-4",
      "hook": "Both 100→104→99→103 and 100→99→104→103 fit the same candle.",
      "scenario": "OHLC records extremes but does not encode the order of the high and low. Two continuous paths can share the same open, high, low and close. Neither can be selected without finer evidence.",
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
        "caption": "Construct two possible paths: synthetic EDU/USD last-price; USD/EDU; UTC one-minute interval starts; all supplied bars complete.",
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
          "id": "s3-2-practice-4",
          "kind": "choice",
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
          "correct": "observed",
          "explanation": "OHLC records extremes but does not encode the order of the high and low. Two continuous paths can share the same open, high, low and close. Neither can be selected without finer evidence.",
          "retry": "Return to Construct two possible paths; compare the stated rule with the labeled coordinates before trying again."
        }
      ],
      "explanation": [
        "OHLC records extremes but does not encode the order of the high and low. Two continuous paths can share the same open, high, low and close. Neither can be selected without finer evidence.",
        "A long lower wick does not guarantee a future reversal."
      ],
      "takeaway": "Both 100→104→99→103 and 100→99→104→103 fit the same candle.",
      "demi": "Ask each learner to identify a coordinate before defending a label. A long lower wick does not guarantee a future reversal."
    },
    {
      "sectionId": "s3-2-section-5",
      "hook": "C103 above O100 is observable; the next close remains unknown.",
      "scenario": "A higher close describes the bar that ended. It does not determine the next close or establish an entry trigger. Record what is known and stop where the data stops.",
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
      "practice": [
        {
          "id": "s3-2-practice-5",
          "kind": "choice",
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
          "correct": "observed",
          "explanation": "A higher close describes the bar that ended. It does not determine the next close or establish an entry trigger. Record what is known and stop where the data stops.",
          "retry": "Return to Keep prediction separate; compare the stated rule with the labeled coordinates before trying again."
        }
      ],
      "explanation": [
        "A higher close describes the bar that ended. It does not determine the next close or establish an entry trigger. Record what is known and stop where the data stops.",
        "Color is not a forecast."
      ],
      "takeaway": "C103 above O100 is observable; the next close remains unknown.",
      "demi": "Ask each learner to identify a coordinate before defending a label. Color is not a forecast."
    }
  ]
};
