import 'server-only';
import type { StageExperience } from '../stage/contracts';
export const EXPERIENCE_S3_5: StageExperience = {
  "classId": "stage-3-class-5",
  "academicVersion": "chart-foundations-s3-5.1.0.0",
  "revision": "s3-5-experience.1.0.0",
  "format": "chart",
  "sections": [
    {
      "sectionId": "s3-5-section-1",
      "hook": "Describe 09:00–09:05 one-minute closes before considering a shorter crop.",
      "scenario": "A statement about movement needs a fixed interval and timeframe. Start with data context and keep the horizon unchanged while comparing descriptions. A crop can omit an earlier decline.",
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
        "caption": "Choose the observation window: synthetic EDU/USD last-price; USD/EDU; UTC one-minute interval starts; all supplied bars complete.",
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
          "id": "s3-5-practice-1",
          "kind": "choice",
          "prompt": "Which description states its horizon?",
          "options": [
            {
              "id": "observed",
              "label": "09:03–09:05 one-minute closes rise99→101→104"
            },
            {
              "id": "unsupported",
              "label": "The market is upward forever"
            }
          ],
          "correct": "observed",
          "explanation": "A statement about movement needs a fixed interval and timeframe. Start with data context and keep the horizon unchanged while comparing descriptions. A crop can omit an earlier decline.",
          "retry": "Return to Choose the observation window; compare the stated rule with the labeled coordinates before trying again."
        }
      ],
      "explanation": [
        "A statement about movement needs a fixed interval and timeframe. Start with data context and keep the horizon unchanged while comparing descriptions. A crop can omit an earlier decline.",
        "A state label without a horizon is underspecified."
      ],
      "takeaway": "Describe 09:00–09:05 one-minute closes before considering a shorter crop.",
      "demi": "Ask each learner to identify a coordinate before defending a label. A state label without a horizon is underspecified."
    },
    {
      "sectionId": "s3-5-section-2",
      "hook": "Closes 100,102,101,103 alone suggest net rise but do not establish every pivot relationship.",
      "scenario": "Increasing confirmed high and low sequences support an upward description over the named window; decreasing sequences support downward. Too few confirmed points warrant an indeterminate answer.",
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
        "caption": "Compare successive observations: synthetic EDU/USD last-price; USD/EDU; UTC one-minute interval starts; all supplied bars complete.",
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
          "id": "s3-5-practice-2",
          "kind": "choice",
          "prompt": "What supports a short-window rise in the displayed data?",
          "options": [
            {
              "id": "observed",
              "label": "Closes99,101,104 at09:03–09:05"
            },
            {
              "id": "unsupported",
              "label": "The green candle guarantees continuation"
            }
          ],
          "correct": "observed",
          "explanation": "Increasing confirmed high and low sequences support an upward description over the named window; decreasing sequences support downward. Too few confirmed points warrant an indeterminate answer.",
          "retry": "Return to Compare successive observations; compare the stated rule with the labeled coordinates before trying again."
        }
      ],
      "explanation": [
        "Increasing confirmed high and low sequences support an upward description over the named window; decreasing sequences support downward. Too few confirmed points warrant an indeterminate answer.",
        "One higher close is not an established trend."
      ],
      "takeaway": "Closes 100,102,101,103 alone suggest net rise but do not establish every pivot relationship.",
      "demi": "Ask each learner to identify a coordinate before defending a label. One higher close is not an established trend."
    },
    {
      "sectionId": "s3-5-section-3",
      "hook": "Observed highs 104,103,104 and lows 99,100,99 overlap inside 99–104.",
      "scenario": "Repeated overlap inside a stated observed band can support a sideways description. Fix the band before the next reveal and retain observations beyond it instead of shifting history to keep a label.",
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
        "caption": "Describe overlap and boundaries: synthetic EDU/USD last-price; USD/EDU; UTC one-minute interval starts; all supplied bars complete.",
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
          "id": "s3-5-practice-3",
          "kind": "choice",
          "prompt": "If an observed band98–105 is followed by106, what record is valid?",
          "options": [
            {
              "id": "observed",
              "label": "Keep98–105 and record106 beyond it"
            },
            {
              "id": "unsupported",
              "label": "Rewrite the original band as98–106"
            }
          ],
          "correct": "observed",
          "explanation": "Repeated overlap inside a stated observed band can support a sideways description. Fix the band before the next reveal and retain observations beyond it instead of shifting history to keep a label.",
          "retry": "Return to Describe overlap and boundaries; compare the stated rule with the labeled coordinates before trying again."
        }
      ],
      "explanation": [
        "Repeated overlap inside a stated observed band can support a sideways description. Fix the band before the next reveal and retain observations beyond it instead of shifting history to keep a label.",
        "A descriptive band is not a promise that future prices remain inside it."
      ],
      "takeaway": "Observed highs 104,103,104 and lows 99,100,99 overlap inside 99–104.",
      "demi": "Ask each learner to identify a coordinate before defending a label. A descriptive band is not a promise that future prices remain inside it."
    },
    {
      "sectionId": "s3-5-section-4",
      "hook": "A candle spanning 98–106 can finish at its open.",
      "scenario": "Large ranges describe dispersion, not directional certainty. Compare net change with the route taken and consider both a short-window rise and a broader overlapping range.",
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
        "caption": "Separate volatility from direction: synthetic EDU/USD last-price; USD/EDU; UTC one-minute interval starts; all supplied bars complete.",
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
          "id": "s3-5-practice-4",
          "kind": "choice",
          "prompt": "Which candle has wider range, O10 H16 L6 C10 or O10 H12 L9 C11?",
          "options": [
            {
              "id": "observed",
              "label": "The first; direction is still unchanged close"
            },
            {
              "id": "unsupported",
              "label": "The first; it guarantees upward direction"
            }
          ],
          "correct": "observed",
          "explanation": "Large ranges describe dispersion, not directional certainty. Compare net change with the route taken and consider both a short-window rise and a broader overlapping range.",
          "retry": "Return to Separate volatility from direction; compare the stated rule with the labeled coordinates before trying again."
        }
      ],
      "explanation": [
        "Large ranges describe dispersion, not directional certainty. Compare net change with the route taken and consider both a short-window rise and a broader overlapping range.",
        "A larger candle does not imply a stronger directional forecast."
      ],
      "takeaway": "A candle spanning 98–106 can finish at its open.",
      "demi": "Ask each learner to identify a coordinate before defending a label. A larger candle does not imply a stronger directional forecast."
    },
    {
      "sectionId": "s3-5-section-5",
      "hook": "Use an unchanged convention, preserve original labels, and defer classification when the evidence is insufficient.",
      "scenario": "Join axes, OHLC validity, aggregation and pivot knowledge-times in one fresh case. State a supported description, an alternative and what additional observations would change your view. No order or strategy is required.",
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
        "caption": "Publish a bounded observation record: synthetic EDU/USD last-price; USD/EDU; UTC one-minute interval starts; all supplied bars complete.",
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
          "id": "s3-5-practice-5",
          "kind": "choice",
          "prompt": "How should a final-edge high be described under a one-neighbor rule?",
          "options": [
            {
              "id": "observed",
              "label": "Unconfirmed because its right neighbor is absent"
            },
            {
              "id": "unsupported",
              "label": "Confirmed because it is the latest high"
            }
          ],
          "correct": "observed",
          "explanation": "Join axes, OHLC validity, aggregation and pivot knowledge-times in one fresh case. State a supported description, an alternative and what additional observations would change your view. No order or strategy is required.",
          "retry": "Return to Publish a bounded observation record; compare the stated rule with the labeled coordinates before trying again."
        }
      ],
      "explanation": [
        "Join axes, OHLC validity, aggregation and pivot knowledge-times in one fresh case. State a supported description, an alternative and what additional observations would change your view. No order or strategy is required.",
        "A practical analysis is not an instruction to trade."
      ],
      "takeaway": "Use an unchanged convention, preserve original labels, and defer classification when the evidence is insufficient.",
      "demi": "Ask each learner to identify a coordinate before defending a label. A practical analysis is not an instruction to trade."
    }
  ]
};
