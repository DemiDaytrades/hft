import 'server-only';
import type {StageClass} from '../stage/contracts';
export const CLASS_S3_5:StageClass = {
  "id": "stage-3-class-5",
  "version": "chart-foundations-s3-5.1.0.0",
  "stageId": "stage-3",
  "number": 5,
  "title": "Observe Trend, Range and Uncertainty",
  "description": "A statement about movement needs a fixed interval and timeframe. Start with data context and keep the horizon unchanged while comparing descriptions. A crop can omit an earlier decline.",
  "courseId": "hft-school-foundations",
  "lessonId": "hft-school-s3-5",
  "prerequisites": [
    "stage-3-class-4"
  ],
  "liveMinutes": 60,
  "reviewMinutes": 30,
  "objectives": [
    {
      "id": "s3-5-objective-1",
      "text": "Describe upward, downward, overlapping or indeterminate movement within a stated horizon.",
      "competency": "DESCRIPTIVE_STATE"
    },
    {
      "id": "s3-5-objective-2",
      "text": "Defend a bounded chart description with coordinates, an alternative and explicit uncertainty.",
      "competency": "BOUNDED_CHART_EVIDENCE"
    }
  ],
  "terms": [
    {
      "term": "Choose the observation window",
      "definition": "A statement about movement needs a fixed interval and timeframe. Start with data context and keep the horizon unchanged while comparing descriptions. A crop can omit an earlier decline."
    },
    {
      "term": "Compare successive observations",
      "definition": "Increasing confirmed high and low sequences support an upward description over the named window; decreasing sequences support downward. Too few confirmed points warrant an indeterminate answer."
    },
    {
      "term": "Describe overlap and boundaries",
      "definition": "Repeated overlap inside a stated observed band can support a sideways description. Fix the band before the next reveal and retain observations beyond it instead of shifting history to keep a label."
    },
    {
      "term": "Separate volatility from direction",
      "definition": "Large ranges describe dispersion, not directional certainty. Compare net change with the route taken and consider both a short-window rise and a broader overlapping range."
    },
    {
      "term": "Publish a bounded observation record",
      "definition": "Join axes, OHLC validity, aggregation and pivot knowledge-times in one fresh case. State a supported description, an alternative and what additional observations would change your view. No order or strategy is required."
    }
  ],
  "sections": [
    {
      "id": "s3-5-section-1",
      "title": "Choose the observation window",
      "objectiveId": "s3-5-objective-1",
      "competency": "DESCRIPTIVE_STATE",
      "paragraphs": [
        "A statement about movement needs a fixed interval and timeframe. Start with data context and keep the horizon unchanged while comparing descriptions. A crop can omit an earlier decline.",
        "State09:00–09:05 when describing the whole sample and09:03–09:05 when describing the crop. Two valid descriptions can differ because their horizons differ."
      ],
      "example": "Describe 09:00–09:05 one-minute closes before considering a shorter crop.",
      "misconception": "A state label without a horizon is underspecified.",
      "visual": "none",
      "activities": [
        {
          "id": "s3-5-observe-1",
          "kind": "choice",
          "category": "PRACTICAL",
          "sectionId": "s3-5-section-1",
          "objectiveId": "s3-5-objective-1",
          "competency": "DESCRIPTIVE_STATE",
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
          "correct": "observed"
        }
      ]
    },
    {
      "id": "s3-5-section-2",
      "title": "Compare successive observations",
      "objectiveId": "s3-5-objective-1",
      "competency": "DESCRIPTIVE_STATE",
      "paragraphs": [
        "Increasing confirmed high and low sequences support an upward description over the named window; decreasing sequences support downward. Too few confirmed points warrant an indeterminate answer.",
        "Separate net close change from confirmed pivot sequences. When the stated pivot convention yields too few points, use a limited movement description instead of inventing a sequence."
      ],
      "example": "Closes 100,102,101,103 alone suggest net rise but do not establish every pivot relationship.",
      "misconception": "One higher close is not an established trend.",
      "visual": "none",
      "activities": [
        {
          "id": "s3-5-observe-2",
          "kind": "choice",
          "category": "PRACTICAL",
          "sectionId": "s3-5-section-2",
          "objectiveId": "s3-5-objective-1",
          "competency": "DESCRIPTIVE_STATE",
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
          "correct": "observed"
        }
      ]
    },
    {
      "id": "s3-5-section-3",
      "title": "Describe overlap and boundaries",
      "objectiveId": "s3-5-objective-1",
      "competency": "DESCRIPTIVE_STATE",
      "paragraphs": [
        "Repeated overlap inside a stated observed band can support a sideways description. Fix the band before the next reveal and retain observations beyond it instead of shifting history to keep a label.",
        "Choose the observed band from visible coordinates and date the record. If a new bar falls outside it, retain the original band and add the new fact."
      ],
      "example": "Observed highs 104,103,104 and lows 99,100,99 overlap inside 99–104.",
      "misconception": "A descriptive band is not a promise that future prices remain inside it.",
      "visual": "none",
      "activities": [
        {
          "id": "s3-5-observe-3",
          "kind": "choice",
          "category": "PRACTICAL",
          "sectionId": "s3-5-section-3",
          "objectiveId": "s3-5-objective-1",
          "competency": "DESCRIPTIVE_STATE",
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
          "correct": "observed"
        }
      ]
    },
    {
      "id": "s3-5-section-4",
      "title": "Separate volatility from direction",
      "objectiveId": "s3-5-objective-2",
      "competency": "BOUNDED_CHART_EVIDENCE",
      "paragraphs": [
        "Large ranges describe dispersion, not directional certainty. Compare net change with the route taken and consider both a short-window rise and a broader overlapping range.",
        "Compute range as high minus low, and close change as close minus open. A wide range with unchanged close demonstrates why these measures cannot substitute for one another."
      ],
      "example": "A candle spanning 98–106 can finish at its open.",
      "misconception": "A larger candle does not imply a stronger directional forecast.",
      "visual": "none",
      "activities": [
        {
          "id": "s3-5-observe-4",
          "kind": "choice",
          "category": "PRACTICAL",
          "sectionId": "s3-5-section-4",
          "objectiveId": "s3-5-objective-2",
          "competency": "BOUNDED_CHART_EVIDENCE",
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
          "correct": "observed"
        }
      ]
    },
    {
      "id": "s3-5-section-5",
      "title": "Publish a bounded observation record",
      "objectiveId": "s3-5-objective-2",
      "competency": "BOUNDED_CHART_EVIDENCE",
      "paragraphs": [
        "Join axes, OHLC validity, aggregation and pivot knowledge-times in one fresh case. State a supported description, an alternative and what additional observations would change your view. No order or strategy is required.",
        "In the integrated homework, attach evidence to every description. An alternative must fit the same visible rows; uncertainty should identify missing evidence rather than merely say “anything can happen.”"
      ],
      "example": "Use an unchanged convention, preserve original labels, and defer classification when the evidence is insufficient.",
      "misconception": "A practical analysis is not an instruction to trade.",
      "visual": "none",
      "activities": [
        {
          "id": "s3-5-observe-5",
          "kind": "choice",
          "category": "PRACTICAL",
          "sectionId": "s3-5-section-5",
          "objectiveId": "s3-5-objective-2",
          "competency": "BOUNDED_CHART_EVIDENCE",
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
          "correct": "observed"
        }
      ]
    }
  ],
  "assessment": [
    {
      "id": "s3-5-check-1",
      "kind": "written",
      "category": "PRACTICAL",
      "sectionId": "s3-5-section-1",
      "objectiveId": "s3-5-objective-1",
      "competency": "DESCRIPTIVE_STATE",
      "prompt": "Integrated fresh synthetic CASE/USD last-price UTC one-minute start rows14:00 O30 H32 L29 C31;14:01 O31 H34 L30 C33;14:02 O33 H33 L31 C32;14:03 O32 H33 L28 C29;14:04 O29 H32 L29 C31;14:05 O31 H34 L30 C33. Match the whole-window observations. Annotate axes, context and one candle anatomy; aggregate [14:00,14:03); mark strict one-neighbor pivots with confirmation times. Compare whole-window and14:03–14:05 descriptions; supply observed band, two coordinates, alternative description and one uncertainty. Keep original band when revealing a hypothetical next close35. Demonstrate construction or coordinate selection on these fresh values. This is a retrospective reconstruction; do not claim a timestamped blind decision.",
      "rubric": "Require full context; first candle body30–31 extremes29/32; aggregate O30 H34 L29 C32; pivot high14:01 H34 known14:02 close; low14:03 L28 known14:04 close;14:02/14:03 H33 tie fails;14:05 edge unconfirmed; broader overlap28–34 versus short-window rise29→31→33; coordinates/time units; defensible alternative and uncertainty; next35 recorded beyond fixed band rather than retroactive widening. Integrated case is homework with teacher review, not a stage gate. Credit retrospective bounded interpretation and explicit distinction of later data, not recorded blind decision-making.",
      "critical": true
    },
    {
      "id": "s3-5-check-2",
      "kind": "written",
      "category": "PRACTICAL",
      "sectionId": "s3-5-section-5",
      "objectiveId": "s3-5-objective-2",
      "competency": "BOUNDED_CHART_EVIDENCE",
      "prompt": "Integrated fresh synthetic CASE/USD last-price UTC one-minute start rows14:00 O30 H32 L29 C31;14:01 O31 H34 L30 C33;14:02 O33 H33 L31 C32;14:03 O32 H33 L28 C29;14:04 O29 H32 L29 C31;14:05 O31 H34 L30 C33. Match the whole-window observations. Annotate axes, context and one candle anatomy; aggregate [14:00,14:03); mark strict one-neighbor pivots with confirmation times. Compare whole-window and14:03–14:05 descriptions; supply observed band, two coordinates, alternative description and one uncertainty. Keep original band when revealing a hypothetical next close35. State the information limit and explain the bounded interpretation. This is a retrospective reconstruction; do not claim a timestamped blind decision.",
      "rubric": "Require full context; first candle body30–31 extremes29/32; aggregate O30 H34 L29 C32; pivot high14:01 H34 known14:02 close; low14:03 L28 known14:04 close;14:02/14:03 H33 tie fails;14:05 edge unconfirmed; broader overlap28–34 versus short-window rise29→31→33; coordinates/time units; defensible alternative and uncertainty; next35 recorded beyond fixed band rather than retroactive widening. Integrated case is homework with teacher review, not a stage gate. Credit retrospective bounded interpretation and explicit distinction of later data, not recorded blind decision-making.",
      "critical": true
    },
    {
      "id": "stage-3-class-5-fresh-objective-0",
      "kind": "choice",
      "category": "KNOWLEDGE",
      "sectionId": "s3-5-section-1",
      "objectiveId": "s3-5-objective-1",
      "competency": "DESCRIPTIVE_STATE",
      "prompt": "A finite window has closes4,6,4,6 with repeated overlapping ranges. Bounded description?",
      "options": [
        {
          "id": "o0",
          "label": "Overlapping sideways movement in this window"
        },
        {
          "id": "o1",
          "label": "Certain permanent range"
        },
        {
          "id": "o2",
          "label": "Guaranteed next close4"
        }
      ],
      "correct": "o0",
      "critical": true
    },
    {
      "id": "stage-3-class-5-fresh-objective-1",
      "kind": "choice",
      "category": "KNOWLEDGE",
      "sectionId": "s3-5-section-4",
      "objectiveId": "s3-5-objective-2",
      "competency": "BOUNDED_CHART_EVIDENCE",
      "prompt": "An observed band4–7 later receives close8. Honest interpretation?",
      "options": [
        {
          "id": "o0",
          "label": "Move the old band and erase the earlier record"
        },
        {
          "id": "o1",
          "label": "Record the prior observed band and subsequent extension; future uncertain"
        },
        {
          "id": "o2",
          "label": "The extension proves permanent uptrend"
        }
      ],
      "correct": "o1",
      "critical": true
    }
  ],
  "homework": [
    {
      "id": "s3-5-homework-coordinates",
      "kind": "matching",
      "category": "PRACTICAL",
      "sectionId": "s3-5-section-1",
      "objectiveId": "s3-5-objective-1",
      "competency": "DESCRIPTIVE_STATE",
      "prompt": "Integrated fresh synthetic CASE/USD last-price UTC one-minute start rows14:00 O30 H32 L29 C31;14:01 O31 H34 L30 C33;14:02 O33 H33 L31 C32;14:03 O32 H33 L28 C29;14:04 O29 H32 L29 C31;14:05 O31 H34 L30 C33. Match the whole-window observations. Annotate axes, context and one candle anatomy; aggregate [14:00,14:03); mark strict one-neighbor pivots with confirmation times. Compare whole-window and14:03–14:05 descriptions; supply observed band, two coordinates, alternative description and one uncertainty. Keep original band when revealing a hypothetical next close35.",
      "items": [
        {
          "id": "point-0",
          "label": "Whole-window high"
        },
        {
          "id": "point-1",
          "label": "Whole-window low"
        },
        {
          "id": "point-2",
          "label": "First aggregate close"
        },
        {
          "id": "point-3",
          "label": "13-point claim"
        }
      ],
      "targets": [
        {
          "id": "value-0",
          "label": "34"
        },
        {
          "id": "value-1",
          "label": "28"
        },
        {
          "id": "value-2",
          "label": "32"
        },
        {
          "id": "value-3",
          "label": "unsupported"
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
      "id": "s3-5-homework-chart",
      "kind": "written",
      "category": "PRACTICAL",
      "sectionId": "s3-5-section-5",
      "objectiveId": "s3-5-objective-2",
      "competency": "BOUNDED_CHART_EVIDENCE",
      "prompt": "Integrated fresh synthetic CASE/USD last-price UTC one-minute start rows14:00 O30 H32 L29 C31;14:01 O31 H34 L30 C33;14:02 O33 H33 L31 C32;14:03 O32 H33 L28 C29;14:04 O29 H32 L29 C31;14:05 O31 H34 L30 C33. Match the whole-window observations. Annotate axes, context and one candle anatomy; aggregate [14:00,14:03); mark strict one-neighbor pivots with confirmation times. Compare whole-window and14:03–14:05 descriptions; supply observed band, two coordinates, alternative description and one uncertainty. Keep original band when revealing a hypothetical next close35. Submit the labeled coordinates/annotations and short reasoning in this response; use the supplied table as an equal alternative to drawing. Your original submission and teacher review remain in the current class attempt record. This is a retrospective reconstruction; do not claim a timestamped blind decision.",
      "rubric": "Require full context; first candle body30–31 extremes29/32; aggregate O30 H34 L29 C32; pivot high14:01 H34 known14:02 close; low14:03 L28 known14:04 close;14:02/14:03 H33 tie fails;14:05 edge unconfirmed; broader overlap28–34 versus short-window rise29→31→33; coordinates/time units; defensible alternative and uncertainty; next35 recorded beyond fixed band rather than retroactive widening. Integrated case is homework with teacher review, not a stage gate. Credit retrospective bounded interpretation and explicit distinction of later data, not recorded blind decision-making.",
      "critical": true
    }
  ],
  "remediation": [
    {
      "competency": "DESCRIPTIVE_STATE",
      "sectionId": "s3-5-section-1",
      "title": "Rebuild coordinates and construction",
      "paragraph": "Keep the failed attempt. Revisit Choose the observation window; use the changed numeric/context case below, then explain the corrected observation in your own labeled record. Overlapping within this short window; future direction unknown.",
      "reinforcement": {
        "id": "s3-5-retry-1",
        "kind": "choice",
        "category": "PRACTICAL",
        "sectionId": "s3-5-section-1",
        "objectiveId": "s3-5-objective-1",
        "competency": "DESCRIPTIVE_STATE",
        "prompt": "Fresh closes5,7,5,7 with repeated overlap: strongest bounded description?",
        "options": [
          {
            "id": "valid",
            "label": "Overlapping within this short window; future direction unknown."
          },
          {
            "id": "invalid",
            "label": "Guaranteed upward trend."
          }
        ],
        "correct": "valid",
        "critical": true
      }
    },
    {
      "competency": "BOUNDED_CHART_EVIDENCE",
      "sectionId": "s3-5-section-5",
      "title": "Rebuild the evidence boundary",
      "paragraph": "Keep the failed attempt. Revisit Publish a bounded observation record; use the changed numeric/context case below, then explain the corrected observation in your own labeled record. Keep5–8 original band and record9 beyond it.",
      "reinforcement": {
        "id": "s3-5-retry-2",
        "kind": "choice",
        "category": "PRACTICAL",
        "sectionId": "s3-5-section-5",
        "objectiveId": "s3-5-objective-2",
        "competency": "BOUNDED_CHART_EVIDENCE",
        "prompt": "A fixed observed band5–8 is followed by9. What is the honest record?",
        "options": [
          {
            "id": "valid",
            "label": "Keep5–8 original band and record9 beyond it."
          },
          {
            "id": "invalid",
            "label": "Rewrite the old band as5–9."
          }
        ],
        "correct": "valid",
        "critical": true
      }
    }
  ],
  "liveGuide": [
    {
      "title": "Choose the observation window: demonstrate, pause, compare",
      "minutes": 12,
      "talkingPoints": [
        "0–3 min: demonstrate with the labeled shared rows. Describe 09:00–09:05 one-minute closes before considering a shorter crop.",
        "3–6 min: individual response before group discussion. A statement about movement needs a fixed interval and timeframe. Start with data context and keep the horizon unchanged while comparing descriptions. A crop can omit an earlier decline.",
        "6–9 min: compare two learner answers against the data. A state label without a horizon is underspecified.",
        "9–12 min: each learner corrects one coordinate and preserves the original; facilitator checks the stated evidence boundary."
      ],
      "activity": {
        "kind": "POLL",
        "prompt": "Describe 09:00–09:05 one-minute closes before considering a shorter crop. Demonstrate choose the observation window using one labeled coordinate and name an unsupported inference.",
        "sectionId": "s3-5-section-1"
      }
    },
    {
      "title": "Compare successive observations: demonstrate, pause, compare",
      "minutes": 12,
      "talkingPoints": [
        "0–3 min: demonstrate with the labeled shared rows. Closes 100,102,101,103 alone suggest net rise but do not establish every pivot relationship.",
        "3–6 min: individual response before group discussion. Increasing confirmed high and low sequences support an upward description over the named window; decreasing sequences support downward. Too few confirmed points warrant an indeterminate answer.",
        "6–9 min: compare two learner answers against the data. One higher close is not an established trend.",
        "9–12 min: each learner corrects one coordinate and preserves the original; facilitator checks the stated evidence boundary."
      ],
      "activity": {
        "kind": "SINGLE",
        "prompt": "Closes 100,102,101,103 alone suggest net rise but do not establish every pivot relationship. Demonstrate compare successive observations using one labeled coordinate and name an unsupported inference.",
        "sectionId": "s3-5-section-2"
      }
    },
    {
      "title": "Describe overlap and boundaries: demonstrate, pause, compare",
      "minutes": 12,
      "talkingPoints": [
        "0–3 min: demonstrate with the labeled shared rows. Observed highs 104,103,104 and lows 99,100,99 overlap inside 99–104.",
        "3–6 min: individual response before group discussion. Repeated overlap inside a stated observed band can support a sideways description. Fix the band before the next reveal and retain observations beyond it instead of shifting history to keep a label.",
        "6–9 min: compare two learner answers against the data. A descriptive band is not a promise that future prices remain inside it.",
        "9–12 min: each learner corrects one coordinate and preserves the original; facilitator checks the stated evidence boundary."
      ],
      "activity": {
        "kind": "WRITTEN",
        "prompt": "Observed highs 104,103,104 and lows 99,100,99 overlap inside 99–104. Demonstrate describe overlap and boundaries using one labeled coordinate and name an unsupported inference.",
        "sectionId": "s3-5-section-3"
      }
    },
    {
      "title": "Separate volatility from direction: demonstrate, pause, compare",
      "minutes": 12,
      "talkingPoints": [
        "0–3 min: demonstrate with the labeled shared rows. A candle spanning 98–106 can finish at its open.",
        "3–6 min: individual response before group discussion. Large ranges describe dispersion, not directional certainty. Compare net change with the route taken and consider both a short-window rise and a broader overlapping range.",
        "6–9 min: compare two learner answers against the data. A larger candle does not imply a stronger directional forecast.",
        "9–12 min: each learner corrects one coordinate and preserves the original; facilitator checks the stated evidence boundary."
      ],
      "activity": {
        "kind": "WRITTEN",
        "prompt": "A candle spanning 98–106 can finish at its open. Demonstrate separate volatility from direction using one labeled coordinate and name an unsupported inference.",
        "sectionId": "s3-5-section-4"
      }
    },
    {
      "title": "Publish a bounded observation record: demonstrate, pause, compare",
      "minutes": 12,
      "talkingPoints": [
        "0–3 min: demonstrate with the labeled shared rows. Use an unchanged convention, preserve original labels, and defer classification when the evidence is insufficient.",
        "3–6 min: individual response before group discussion. Join axes, OHLC validity, aggregation and pivot knowledge-times in one fresh case. State a supported description, an alternative and what additional observations would change your view. No order or strategy is required.",
        "6–9 min: compare two learner answers against the data. A practical analysis is not an instruction to trade.",
        "9–12 min: each learner corrects one coordinate and preserves the original; facilitator checks the stated evidence boundary."
      ],
      "activity": {
        "kind": "WRITTEN",
        "prompt": "Use an unchanged convention, preserve original labels, and defer classification when the evidence is insufficient. Demonstrate publish a bounded observation record using one labeled coordinate and name an unsupported inference.",
        "sectionId": "s3-5-section-5"
      }
    }
  ],
  "studyGuide": {
    "summary": [
      "A statement about movement needs a fixed interval and timeframe. Start with data context and keep the horizon unchanged while comparing descriptions. A crop can omit an earlier decline.",
      "Increasing confirmed high and low sequences support an upward description over the named window; decreasing sequences support downward. Too few confirmed points warrant an indeterminate answer.",
      "Repeated overlap inside a stated observed band can support a sideways description. Fix the band before the next reveal and retain observations beyond it instead of shifting history to keep a label.",
      "Large ranges describe dispersion, not directional certainty. Compare net change with the route taken and consider both a short-window rise and a broader overlapping range.",
      "Join axes, OHLC validity, aggregation and pivot knowledge-times in one fresh case. State a supported description, an alternative and what additional observations would change your view. No order or strategy is required."
    ],
    "bigPicture": "Observe Trend, Range and Uncertainty turns a chart into a bounded, reproducible observation record rather than a forecast.",
    "fiveThings": [
      "Describe 09:00–09:05 one-minute closes before considering a shorter crop.",
      "Closes 100,102,101,103 alone suggest net rise but do not establish every pivot relationship.",
      "Observed highs 104,103,104 and lows 99,100,99 overlap inside 99–104.",
      "A candle spanning 98–106 can finish at its open.",
      "Use an unchanged convention, preserve original labels, and defer classification when the evidence is insufficient."
    ],
    "outcomes": [
      "Describe upward, downward, overlapping or indeterminate movement within a stated horizon.",
      "Defend a bounded chart description with coordinates, an alternative and explicit uncertainty."
    ],
    "examples": [
      "Describe 09:00–09:05 one-minute closes before considering a shorter crop.",
      "Closes 100,102,101,103 alone suggest net rise but do not establish every pivot relationship.",
      "Observed highs 104,103,104 and lows 99,100,99 overlap inside 99–104.",
      "A candle spanning 98–106 can finish at its open.",
      "Use an unchanged convention, preserve original labels, and defer classification when the evidence is insufficient."
    ],
    "misconceptions": [
      "A state label without a horizon is underspecified.",
      "One higher close is not an established trend.",
      "A descriptive band is not a promise that future prices remain inside it.",
      "A larger candle does not imply a stronger directional forecast.",
      "A practical analysis is not an instruction to trade."
    ],
    "review": [
      {
        "sectionId": "s3-5-section-1",
        "label": "Choose the observation window"
      },
      {
        "sectionId": "s3-5-section-2",
        "label": "Compare successive observations"
      },
      {
        "sectionId": "s3-5-section-3",
        "label": "Describe overlap and boundaries"
      },
      {
        "sectionId": "s3-5-section-4",
        "label": "Separate volatility from direction"
      },
      {
        "sectionId": "s3-5-section-5",
        "label": "Publish a bounded observation record"
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
    "homeworkIntro": "Integrated fresh synthetic CASE/USD last-price UTC one-minute start rows14:00 O30 H32 L29 C31;14:01 O31 H34 L30 C33;14:02 O33 H33 L31 C32;14:03 O32 H33 L28 C29;14:04 O29 H32 L29 C31;14:05 O31 H34 L30 C33. Match the whole-window observations. Annotate axes, context and one candle anatomy; aggregate [14:00,14:03); mark strict one-neighbor pivots with confirmation times. Compare whole-window and14:03–14:05 descriptions; supply observed band, two coordinates, alternative description and one uncertainty. Keep original band when revealing a hypothetical next close35.",
    "pacing": {
      "minimum": 55,
      "maximum": 70
    },
    "assessmentCoverage": [
      "DESCRIPTIVE_STATE",
      "BOUNDED_CHART_EVIDENCE"
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
    "studyGuideChecks": [
      "Can I demonstrate choose the observation window? Check: Describe 09:00–09:05 one-minute closes before considering a shorter crop.",
      "Can I demonstrate compare successive observations? Check: Closes 100,102,101,103 alone suggest net rise but do not establish every pivot relationship.",
      "Can I demonstrate describe overlap and boundaries? Check: Observed highs 104,103,104 and lows 99,100,99 overlap inside 99–104.",
      "Can I demonstrate separate volatility from direction? Check: A candle spanning 98–106 can finish at its open.",
      "Can I demonstrate publish a bounded observation record? Check: Use an unchanged convention, preserve original labels, and defer classification when the evidence is insufficient."
    ]
  }
};
