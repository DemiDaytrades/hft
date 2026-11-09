import 'server-only';
import type { StageExperience } from '../stage/contracts';
export const EXPERIENCE_S3_4: StageExperience = {
  "classId": "stage-3-class-4",
  "academicVersion": "chart-foundations-s3-4.1.0.0",
  "revision": "s3-4-experience.1.0.0",
  "format": "chart",
  "sections": [
    {
      "sectionId": "s3-4-section-1",
      "hook": "Highs 102,104,103 make the middle high eligible only after the third bar closes.",
      "scenario": "For this class use one completed bar on each side. A high pivot has a strictly higher high than both neighbors; a low pivot has a strictly lower low. Ties fail. This is a local classroom convention, not a trading rule.",
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
        "caption": "Specify the comparison rule: synthetic EDU/USD last-price; USD/EDU; UTC one-minute interval starts; all supplied bars complete.",
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
          "id": "s3-4-practice-1",
          "kind": "choice",
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
          "correct": "observed",
          "explanation": "For this class use one completed bar on each side. A high pivot has a strictly higher high than both neighbors; a low pivot has a strictly lower low. Ties fail. This is a local classroom convention, not a trading rule.",
          "retry": "Return to Specify the comparison rule; compare the stated rule with the labeled coordinates before trying again."
        }
      ],
      "explanation": [
        "For this class use one completed bar on each side. A high pivot has a strictly higher high than both neighbors; a low pivot has a strictly lower low. Ties fail. This is a local classroom convention, not a trading rule.",
        "A label without a window and tie policy is not reproducible."
      ],
      "takeaway": "Highs 102,104,103 make the middle high eligible only after the third bar closes.",
      "demi": "Ask each learner to identify a coordinate before defending a label. A label without a window and tie policy is not reproducible."
    },
    {
      "sectionId": "s3-4-section-2",
      "hook": "Replay paused after09:01 closes: the right-hand comparison bar is not available.",
      "scenario": "A bar exceeding its left neighbor is only a candidate while the right neighbor is absent. The next completed bar may confirm or disqualify it. Never use an unseen bar in a present-time answer.",
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
          }
        ],
        "caption": "Synthetic EDU/USD last-price; USD/EDU; UTC one-minute starts. Replay is paused after09:01 close; no later values may support the answer.",
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
          "revealed": 2,
          "caption": "Use the same rows in chart and table; unseen bars cannot support a present-time claim."
        }
      },
      "practice": [
        {
          "id": "s3-4-practice-2",
          "kind": "choice",
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
          "correct": "observed",
          "explanation": "A bar exceeding its left neighbor is only a candidate while the right neighbor is absent. The next completed bar may confirm or disqualify it. Never use an unseen bar in a present-time answer.",
          "retry": "Return to Separate candidate from confirmation; compare the stated rule with the labeled coordinates before trying again."
        }
      ],
      "explanation": [
        "A bar exceeding its left neighbor is only a candidate while the right neighbor is absent. The next completed bar may confirm or disqualify it. Never use an unseen bar in a present-time answer.",
        "Placing a historical marker at 09:01 does not make it knowable then."
      ],
      "takeaway": "At 09:01 close, H104 is a candidate; at 09:02 close H103 confirms it.",
      "demi": "Ask each learner to identify a coordinate before defending a label. Placing a historical marker at 09:01 does not make it knowable then."
    },
    {
      "sectionId": "s3-4-section-3",
      "hook": "Lows 100,98,99 form a low pivot at the middle bar.",
      "scenario": "Compare lows with lows and highs with highs. A candle color does not determine either pivot type. An outside bar can satisfy both conventions once its neighbors exist.",
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
        "caption": "Apply lows independently: synthetic EDU/USD last-price; USD/EDU; UTC one-minute interval starts; all supplied bars complete.",
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
          "id": "s3-4-practice-3",
          "kind": "choice",
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
          "correct": "observed",
          "explanation": "Compare lows with lows and highs with highs. A candle color does not determine either pivot type. An outside bar can satisfy both conventions once its neighbors exist.",
          "retry": "Return to Apply lows independently; compare the stated rule with the labeled coordinates before trying again."
        }
      ],
      "explanation": [
        "Compare lows with lows and highs with highs. A candle color does not determine either pivot type. An outside bar can satisfy both conventions once its neighbors exist.",
        "Selecting the reddest candle is not applying the rule."
      ],
      "takeaway": "Lows 100,98,99 form a low pivot at the middle bar.",
      "demi": "Ask each learner to identify a coordinate before defending a label. Selecting the reddest candle is not applying the rule."
    },
    {
      "sectionId": "s3-4-section-4",
      "hook": "Highs 102,104,104 have no strict middle high pivot.",
      "scenario": "The first and last visible bars lack a required neighbor. Mark them unconfirmed within this window. Equal highs do not satisfy strict superiority; preserve the tie rather than silently changing the rule.",
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
        "caption": "Handle edges and ties: synthetic EDU/USD last-price; USD/EDU; UTC one-minute interval starts; all supplied bars complete.",
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
          "id": "s3-4-practice-4",
          "kind": "choice",
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
          "correct": "observed",
          "explanation": "The first and last visible bars lack a required neighbor. Mark them unconfirmed within this window. Equal highs do not satisfy strict superiority; preserve the tie rather than silently changing the rule.",
          "retry": "Return to Handle edges and ties; compare the stated rule with the labeled coordinates before trying again."
        }
      ],
      "explanation": [
        "The first and last visible bars lack a required neighbor. Mark them unconfirmed within this window. Equal highs do not satisfy strict superiority; preserve the tie rather than silently changing the rule.",
        "A visible edge is not automatically a pivot."
      ],
      "takeaway": "Highs 102,104,104 have no strict middle high pivot.",
      "demi": "Ask each learner to identify a coordinate before defending a label. A visible edge is not automatically a pivot."
    },
    {
      "sectionId": "s3-4-section-5",
      "hook": "Pivot coordinate 09:01 H104; first knowable at 09:02 close.",
      "scenario": "Store both the pivot coordinate and earliest confirmation time. Then order confirmed highs and lows separately to describe their sequence. Keep the original pre-reveal judgment when later bars arrive.",
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
      "practice": [
        {
          "id": "s3-4-practice-5",
          "kind": "choice",
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
          "correct": "observed",
          "explanation": "Store both the pivot coordinate and earliest confirmation time. Then order confirmed highs and lows separately to describe their sequence. Keep the original pre-reveal judgment when later bars arrive.",
          "retry": "Return to Record two times; compare the stated rule with the labeled coordinates before trying again."
        }
      ],
      "explanation": [
        "Store both the pivot coordinate and earliest confirmation time. Then order confirmed highs and lows separately to describe their sequence. Keep the original pre-reveal judgment when later bars arrive.",
        "A later revision must not erase the earlier candidate record."
      ],
      "takeaway": "Pivot coordinate 09:01 H104; first knowable at 09:02 close.",
      "demi": "Ask each learner to identify a coordinate before defending a label. A later revision must not erase the earlier candidate record."
    }
  ]
};
