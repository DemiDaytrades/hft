import 'server-only';
import type {StageClass} from '../stage/contracts';
export const CLASS_S2_6:StageClass = {
  "id": "stage-2-class-6",
  "version": "stage-2-class-6.1.0.0",
  "stageId": "stage-2",
  "number": 6,
  "title": "Sessions, Market Conditions and a Safe Platform Orientation",
  "description": "Convert supplied session windows using date, named timezone and DST context. Verify instrument, account and environment; distinguish observation from submitting an order.",
  "courseId": "hft-school-foundations",
  "lessonId": "hft-school-s2-6",
  "prerequisites": [
    "stage-2-class-5"
  ],
  "liveMinutes": 60,
  "reviewMinutes": 30,
  "objectives": [
    {
      "id": "s2-6-objective-1",
      "text": "Convert supplied session windows using date, named timezone and DST context.",
      "competency": "S2_C6_1"
    },
    {
      "id": "s2-6-objective-2",
      "text": "Verify instrument, account and environment; distinguish observation from submitting an order.",
      "competency": "S2_C6_2"
    }
  ],
  "terms": [
    {
      "term": "Session names are conventions",
      "definition": "Decentralized weekday FX activity is commonly described using regional session labels. A label is not a centralized exchange opening bell or a promise of constant availability. Use supplied windows for an exercise and verify the provider’s actual hours, holiday schedule and product before planning observation."
    },
    {
      "term": "Anchor the date before converting",
      "definition": "On 2026-02-10 London is UTC+0 and New York UTC−5. Under our supplied windows London is 08:00–17:00 UTC, New York 13:00–22:00 UTC, and their intersection is 13:00–17:00 UTC. Intersect intervals only after putting them on one dated timeline."
    },
    {
      "term": "DST transitions do not synchronize",
      "definition": "In 2026 US DST begins March 8, while UK clocks advance March 29. On March 16 London remains UTC+0 and New York is UTC−4: our overlap is 12:00–17:00 UTC. On April 6 London is UTC+1 and New York UTC−4, so the overlap is 12:00–16:00 UTC. A saved winter offset is unsafe for spring dates."
    }
  ],
  "sections": [
    {
      "id": "s2-6-section-1",
      "title": "Session names are conventions",
      "objectiveId": "s2-6-objective-1",
      "competency": "S2_C6_1",
      "paragraphs": [
        "Decentralized weekday FX activity is commonly described using regional session labels. A label is not a centralized exchange opening bell or a promise of constant availability. Use supplied windows for an exercise and verify the provider’s actual hours, holiday schedule and product before planning observation."
      ],
      "example": "For this exercise only, London window is 08:00–17:00 Europe/London and New York window is 08:00–17:00 America/New_York.",
      "misconception": "Every instrument is available throughout any named FX session.",
      "visual": "none",
      "activities": [
        {
          "id": "s2-6-explore-1",
          "kind": "choice",
          "category": "APPLICATION",
          "sectionId": "s2-6-section-1",
          "objectiveId": "s2-6-objective-1",
          "competency": "S2_C6_1",
          "prompt": "Does a session label establish a particular provider’s holiday hours?",
          "critical": true,
          "options": [
            {
              "id": "s2-6-explore-1-a",
              "label": "No; check the dated product/provider schedule"
            },
            {
              "id": "s2-6-explore-1-b",
              "label": "Yes; a session name guarantees availability."
            }
          ],
          "correct": "s2-6-explore-1-a"
        }
      ]
    },
    {
      "id": "s2-6-section-2",
      "title": "Anchor the date before converting",
      "objectiveId": "s2-6-objective-1",
      "competency": "S2_C6_1",
      "paragraphs": [
        "On 2026-02-10 London is UTC+0 and New York UTC−5. Under our supplied windows London is 08:00–17:00 UTC, New York 13:00–22:00 UTC, and their intersection is 13:00–17:00 UTC. Intersect intervals only after putting them on one dated timeline."
      ],
      "example": "2026-02-10 09:00 America/New_York = 14:00 UTC = 14:00 Europe/London.",
      "misconception": "Local clocks can be compared without offsets or date.",
      "visual": "none",
      "activities": [
        {
          "id": "s2-6-explore-2",
          "kind": "choice",
          "category": "APPLICATION",
          "sectionId": "s2-6-section-2",
          "objectiveId": "s2-6-objective-1",
          "competency": "S2_C6_1",
          "prompt": "For 2026-02-10, supplied windows 08–17 London UTC+0 and 08–17 New York UTC−5: give UTC overlap.",
          "critical": true,
          "options": [
            {
              "id": "s2-6-explore-2-a",
              "label": "13:00–17:00 UTC on 2026-02-10"
            },
            {
              "id": "s2-6-explore-2-b",
              "label": "08:00–17:00 UTC, because the local labels are equal."
            }
          ],
          "correct": "s2-6-explore-2-a"
        }
      ]
    },
    {
      "id": "s2-6-section-3",
      "title": "DST transitions do not synchronize",
      "objectiveId": "s2-6-objective-1",
      "competency": "S2_C6_1",
      "paragraphs": [
        "In 2026 US DST begins March 8, while UK clocks advance March 29. On March 16 London remains UTC+0 and New York is UTC−4: our overlap is 12:00–17:00 UTC. On April 6 London is UTC+1 and New York UTC−4, so the overlap is 12:00–16:00 UTC. A saved winter offset is unsafe for spring dates."
      ],
      "example": "Same local windows, different dates: February 10 overlap 13–17 UTC; March 16 overlap 12–17; April 6 overlap 12–16.",
      "misconception": "Both locations change clocks on the same day.",
      "visual": "none",
      "activities": [
        {
          "id": "s2-6-explore-3",
          "kind": "choice",
          "category": "APPLICATION",
          "sectionId": "s2-6-section-3",
          "objectiveId": "s2-6-objective-1",
          "competency": "S2_C6_1",
          "prompt": "On 2026-04-06 London UTC+1 and New York UTC−4, convert 08–17 windows and give overlap.",
          "critical": true,
          "options": [
            {
              "id": "s2-6-explore-3-a",
              "label": "London 07–16 UTC, New York 12–21 UTC, overlap 12–16 UTC"
            },
            {
              "id": "s2-6-explore-3-b",
              "label": "13:00–17:00 UTC for every date."
            }
          ],
          "correct": "s2-6-explore-3-a"
        }
      ]
    },
    {
      "id": "s2-6-section-4",
      "title": "An overlap is context, not a signal",
      "objectiveId": "s2-6-objective-1",
      "competency": "S2_C6_1",
      "paragraphs": [
        "Activity and execution conditions vary within and outside conventional overlaps. An announcement, holiday, outage or provider policy may change spreads and available prices. A calendar time must include date and timezone; a scheduled release does not specify its surprise, direction or a guaranteed fill."
      ],
      "example": "Fictional announcement 2026-03-16 08:30 America/New_York is 12:30 UTC; it lies in this exercise’s 12–17 UTC overlap but predicts no trade outcome.",
      "misconception": "An overlap or announcement guarantees liquidity and profit.",
      "visual": "none",
      "activities": [
        {
          "id": "s2-6-explore-4",
          "kind": "choice",
          "category": "APPLICATION",
          "sectionId": "s2-6-section-4",
          "objectiveId": "s2-6-objective-1",
          "competency": "S2_C6_1",
          "prompt": "A calendar lists a release at 08:30 with no zone. Can you reliably place it on your UTC timeline?",
          "critical": true,
          "options": [
            {
              "id": "s2-6-explore-4-a",
              "label": "No; verify date and source timezone first"
            },
            {
              "id": "s2-6-explore-4-b",
              "label": "Yes; calendar timestamps have a universal zone."
            }
          ],
          "correct": "s2-6-explore-4-a"
        }
      ]
    },
    {
      "id": "s2-6-section-5",
      "title": "Verify a read-only workspace",
      "objectiveId": "s2-6-objective-2",
      "competency": "S2_C6_2",
      "paragraphs": [
        "Before interpreting a screen, confirm demo/live environment, account identifier, symbol, actual product, provider/feed and chart timezone. A demo label is evidence to inspect, not permission to submit. A currency-like symbol can refer to different products or data feeds. Keep any orientation ticket inert and read-only."
      ],
      "example": "Fictional DEMO account A-17 shows EURUSD-CFD from Feed B, chart UTC. Record those exact labels rather than assuming deliverable currency or a different provider.",
      "misconception": "A familiar symbol proves product and account identity.",
      "visual": "none",
      "activities": [
        {
          "id": "s2-6-explore-5",
          "kind": "choice",
          "category": "APPLICATION",
          "sectionId": "s2-6-section-5",
          "objectiveId": "s2-6-objective-2",
          "competency": "S2_C6_2",
          "prompt": "The chart symbol matches but the account environment is unverified. Is opening a live order acceptable?",
          "critical": true,
          "options": [
            {
              "id": "s2-6-explore-5-a",
              "label": "No; verify environment and remain read-only"
            },
            {
              "id": "s2-6-explore-5-b",
              "label": "Submit first to discover the environment."
            }
          ],
          "correct": "s2-6-explore-5-a"
        }
      ]
    },
    {
      "id": "s2-6-section-6",
      "title": "Recognize a ticket without sending it",
      "objectiveId": "s2-6-objective-2",
      "competency": "S2_C6_2",
      "paragraphs": [
        "A ticket may show side, product, quantity with its unit, price fields, margin estimate and submission controls. Reading these is orientation; selecting a side or recognizing a button does not demonstrate execution competence. Demo outcomes differ from live liquidity and fills. If product, quantity units or environment is unclear, record the uncertainty and observe only."
      ],
      "example": "A static ticket shows quantity 1 with no unit and an unverified account badge. The safe record is “not submitted: unit and environment unknown,” not a trial order.",
      "misconception": "Submitting a tiny demo order resolves every uncertainty safely.",
      "visual": "none",
      "activities": [
        {
          "id": "s2-6-explore-6",
          "kind": "choice",
          "category": "APPLICATION",
          "sectionId": "s2-6-section-6",
          "objectiveId": "s2-6-objective-2",
          "competency": "S2_C6_2",
          "prompt": "An inert screenshot omits quantity units and product terms. State the next action.",
          "critical": true,
          "options": [
            {
              "id": "s2-6-explore-6-a",
              "label": "Remain read-only; request missing units/product terms and verify account"
            },
            {
              "id": "s2-6-explore-6-b",
              "label": "Submit a small order to test the missing information."
            }
          ],
          "correct": "s2-6-explore-6-a"
        }
      ]
    }
  ],
  "assessment": [
    {
      "id": "s2-6-check-1",
      "kind": "written",
      "category": "REASONING",
      "sectionId": "s2-6-section-1",
      "objectiveId": "s2-6-objective-1",
      "competency": "S2_C6_1",
      "prompt": "Does a session label establish a particular provider’s holiday hours? Show the governing specification or verification step and explain your conclusion.",
      "rubric": "No; check the dated product/provider schedule Reject the stated misconception: Every instrument is available throughout any named FX session.",
      "critical": true
    },
    {
      "id": "s2-6-check-2",
      "kind": "written",
      "category": "REASONING",
      "sectionId": "s2-6-section-2",
      "objectiveId": "s2-6-objective-1",
      "competency": "S2_C6_1",
      "prompt": "For 2026-02-10, supplied windows 08–17 London UTC+0 and 08–17 New York UTC−5: give UTC overlap. Show the governing specification or verification step and explain your conclusion.",
      "rubric": "13:00–17:00 UTC on 2026-02-10 Reject the stated misconception: Local clocks can be compared without offsets or date.",
      "critical": true
    },
    {
      "id": "s2-6-check-3",
      "kind": "written",
      "category": "REASONING",
      "sectionId": "s2-6-section-3",
      "objectiveId": "s2-6-objective-1",
      "competency": "S2_C6_1",
      "prompt": "On 2026-04-06 London UTC+1 and New York UTC−4, convert 08–17 windows and give overlap. Show the governing specification or verification step and explain your conclusion.",
      "rubric": "London 07–16 UTC, New York 12–21 UTC, overlap 12–16 UTC Reject the stated misconception: Both locations change clocks on the same day.",
      "critical": true
    },
    {
      "id": "s2-6-check-4",
      "kind": "written",
      "category": "REASONING",
      "sectionId": "s2-6-section-4",
      "objectiveId": "s2-6-objective-1",
      "competency": "S2_C6_1",
      "prompt": "A calendar lists a release at 08:30 with no zone. Can you reliably place it on your UTC timeline? Show the governing specification or verification step and explain your conclusion.",
      "rubric": "No; verify date and source timezone first Reject the stated misconception: An overlap or announcement guarantees liquidity and profit.",
      "critical": true
    },
    {
      "id": "s2-6-check-5",
      "kind": "written",
      "category": "REASONING",
      "sectionId": "s2-6-section-5",
      "objectiveId": "s2-6-objective-2",
      "competency": "S2_C6_2",
      "prompt": "The chart symbol matches but the account environment is unverified. Is opening a live order acceptable? Show the governing specification or verification step and explain your conclusion.",
      "rubric": "No; verify environment and remain read-only Reject the stated misconception: A familiar symbol proves product and account identity.",
      "critical": true
    },
    {
      "id": "s2-6-check-6",
      "kind": "written",
      "category": "REASONING",
      "sectionId": "s2-6-section-6",
      "objectiveId": "s2-6-objective-2",
      "competency": "S2_C6_2",
      "prompt": "An inert screenshot omits quantity units and product terms. State the next action. Show the governing specification or verification step and explain your conclusion.",
      "rubric": "Remain read-only; request missing units/product terms and verify account Reject the stated misconception: Submitting a tiny demo order resolves every uncertainty safely.",
      "critical": true
    },
    {
      "id": "stage-2-class-6-fresh-objective-0",
      "kind": "choice",
      "category": "KNOWLEDGE",
      "sectionId": "s2-6-section-1",
      "objectiveId": "s2-6-objective-1",
      "competency": "S2_C6_1",
      "prompt": "Supplied 2026-03-18 windows: London08–17UTC; NewYork12–21UTC. Overlap?",
      "options": [
        {
          "id": "o0",
          "label": "08–12UTC"
        },
        {
          "id": "o1",
          "label": "12–17UTC"
        },
        {
          "id": "o2",
          "label": "17–21UTC"
        }
      ],
      "correct": "o1",
      "critical": true
    },
    {
      "id": "stage-2-class-6-fresh-objective-1",
      "kind": "choice",
      "category": "KNOWLEDGE",
      "sectionId": "s2-6-section-5",
      "objectiveId": "s2-6-objective-2",
      "competency": "S2_C6_2",
      "prompt": "Ticket shows quantity1 but units and demo/live badge are unknown. Correct action?",
      "options": [
        {
          "id": "o0",
          "label": "Submit then inspect result"
        },
        {
          "id": "o1",
          "label": "Assume one micro lot"
        },
        {
          "id": "o2",
          "label": "Do not submit; verify environment, product and quantity units"
        }
      ],
      "correct": "o2",
      "critical": true
    }
  ],
  "homework": [
    {
      "id": "s2-6-homework-1",
      "kind": "written",
      "category": "HOMEWORK",
      "sectionId": "s2-6-section-1",
      "objectiveId": "s2-6-objective-1",
      "competency": "S2_C6_1",
      "prompt": "Dated session worksheet: Use the supplied 08:00–17:00 London and New York local windows. For 2026-10-26 use London UTC+0 and New York UTC−4; for 2026-11-02 use London UTC+0 and New York UTC−5. Convert both windows, calculate each UTC overlap and locate a fictional 09:15 New York announcement. State why overlap does not guarantee conditions.",
      "rubric": "Requires Oct 26 London 08–17, NY 12–21, overlap 12–17, release 13:15 UTC; Nov 2 NY 13–22, overlap 13–17, release 14:15 UTC. Date/zone attached; no liquidity guarantees. Review time skill independently.",
      "critical": true
    },
    {
      "id": "s2-6-homework-2",
      "kind": "written",
      "category": "HOMEWORK",
      "sectionId": "s2-6-section-5",
      "objectiveId": "s2-6-objective-2",
      "competency": "S2_C6_2",
      "prompt": "Read-only orientation and integrated Stage 2 transfer: Complete an integrated fictional mechanics record, with no account creation or submission. Product is EUR/USD CFD, Feed Q, DEMO account D-8, chart UTC, 2026-03-16 12:30 UTC; base EUR/quote USD, bid 1.10320 ask 1.10335, pip 0.0001, display step 0.00001; earlier bid 1.10400. Contract 100,000 EUR/lot, displayed quantity 0.02 lot, simplified initial leverage 20:1. Identify product versus currency conversion, buy/sell quote sides, spread and signed bid movement, units and quote notional using ask, and initial margin. Place the timestamp within supplied windows. Annotate an inert ticket’s environment, feed, units and disabled submission; explain collateral and demo-fill limits. If the quantity unit were hidden, write your refusal.",
      "rubric": "Individually review orientation skill: exact environment/account/product/feed/time checks, observe-only decision, no claim that demo proves live fills. Integrated evidence also requires EUR base/USD quote, buy ask/sell bid, 1.5-pip spread, −8-pip bid movement, 2,000 EUR, 2,206.70 USD notional, 110.335 USD assumed margin (110.34 rounded), 12–17 UTC overlap, collateral not loss cap and safe refusal. Route any weak prior skill to its existing remediation; this is reviewed homework under existing authority, never an extra gate.",
      "critical": true
    }
  ],
  "remediation": [
    {
      "competency": "S2_C6_1",
      "sectionId": "s2-6-section-1",
      "title": "Re-date the timeline",
      "paragraph": "Use the named zones on the supplied date and convert each interval before intersecting. DST rules differ by jurisdiction. Keep the original response and submit this changed case as a new attempt for individual review. Select the fresh worked relationship, then demonstrate your full reasoning in the separately reviewed reassessment.",
      "reinforcement": {
        "id": "s2-6-reinforcement-1",
        "kind": "choice",
        "category": "KNOWLEDGE",
        "sectionId": "s2-6-section-1",
        "objectiveId": "s2-6-objective-1",
        "competency": "S2_C6_1",
        "prompt": "Supplied July13: London UTC+1, NY UTC−4; both local08–17. Overlap?",
        "options": [
          {
            "id": "r0",
            "label": "12–16UTC"
          },
          {
            "id": "r1",
            "label": "13–17UTC"
          },
          {
            "id": "r2",
            "label": "07–21UTC"
          }
        ],
        "correct": "r0",
        "critical": true
      }
    },
    {
      "competency": "S2_C6_2",
      "sectionId": "s2-6-section-5",
      "title": "Observation-only verification",
      "paragraph": "Check environment and product independently of a symbol. Missing labels are reasons to request information, never to test submission. Keep the original response and submit this changed case as a new attempt for individual review. Select the fresh worked relationship, then demonstrate your full reasoning in the separately reviewed reassessment.",
      "reinforcement": {
        "id": "s2-6-reinforcement-2",
        "kind": "choice",
        "category": "KNOWLEDGE",
        "sectionId": "s2-6-section-5",
        "objectiveId": "s2-6-objective-2",
        "competency": "S2_C6_2",
        "prompt": "Badge hidden, quantity1 withoutunits. Submit?",
        "options": [
          {
            "id": "r0",
            "label": "Yes, quantity1is alwayssafe"
          },
          {
            "id": "r1",
            "label": "No: verify demo/live, product and units first"
          },
          {
            "id": "r2",
            "label": "Yes ifchartlooksvalid"
          }
        ],
        "correct": "r1",
        "critical": true
      }
    }
  ],
  "liveGuide": [
    {
      "title": "Session names are conventions",
      "minutes": 10,
      "talkingPoints": [
        "Decentralized weekday FX activity is commonly described using regional session labels. A label is not a centralized exchange opening bell or a promise of constant availability. Use supplied windows for an exercise and verify the provider’s actual hours, holiday schedule and product before planning observation.",
        "Show two fictional providers with different maintenance breaks. Have students mark when their supplied window conflicts with availability before discussing overlaps.",
        "Use minutes 0–3 for explanation and the displayed example; minutes 3–6 for the demonstration: For this exercise only, London window is 08:00–17:00 Europe/London and New York window is 08:00–17:00 America/New_York.",
        "Use minutes 6–8 for an individual response before discussion. Contrast the proposed answer with this claim: Every instrument is available throughout any named FX session.",
        "Use minutes 8–10 to compare reasoning and record a corrected explanation; do not count attendance as mastery."
      ],
      "activity": {
        "kind": "POLL",
        "prompt": "Does a session label establish a particular provider’s holiday hours? Give the reason before the instructor reveals the worked answer.",
        "sectionId": "s2-6-section-1"
      }
    },
    {
      "title": "Anchor the date before converting",
      "minutes": 10,
      "talkingPoints": [
        "On 2026-02-10 London is UTC+0 and New York UTC−5. Under our supplied windows London is 08:00–17:00 UTC, New York 13:00–22:00 UTC, and their intersection is 13:00–17:00 UTC. Intersect intervals only after putting them on one dated timeline.",
        "Draw a 24-hour UTC ruler. Learners translate the New York start before the end, then shade only the intersection; ask whether the overlap is four or nine hours.",
        "Use minutes 0–3 for explanation and the displayed example; minutes 3–6 for the demonstration: 2026-02-10 09:00 America/New_York = 14:00 UTC = 14:00 Europe/London.",
        "Use minutes 6–8 for an individual response before discussion. Contrast the proposed answer with this claim: Local clocks can be compared without offsets or date.",
        "Use minutes 8–10 to compare reasoning and record a corrected explanation; do not count attendance as mastery."
      ],
      "activity": {
        "kind": "WRITTEN",
        "prompt": "For 2026-02-10, supplied windows 08–17 London UTC+0 and 08–17 New York UTC−5: give UTC overlap. Give the reason before the instructor reveals the worked answer.",
        "sectionId": "s2-6-section-2"
      }
    },
    {
      "title": "DST transitions do not synchronize",
      "minutes": 10,
      "talkingPoints": [
        "In 2026 US DST begins March 8, while UK clocks advance March 29. On March 16 London remains UTC+0 and New York is UTC−4: our overlap is 12:00–17:00 UTC. On April 6 London is UTC+1 and New York UTC−4, so the overlap is 12:00–16:00 UTC. A saved winter offset is unsafe for spring dates.",
        "Overlay February, March transition and April timelines. Ask learners to move only the city whose offset changed, then explain why the March overlap is longer under these conventions.",
        "Use minutes 0–3 for explanation and the displayed example; minutes 3–6 for the demonstration: Same local windows, different dates: February 10 overlap 13–17 UTC; March 16 overlap 12–17; April 6 overlap 12–16.",
        "Use minutes 6–8 for an individual response before discussion. Contrast the proposed answer with this claim: Both locations change clocks on the same day.",
        "Use minutes 8–10 to compare reasoning and record a corrected explanation; do not count attendance as mastery."
      ],
      "activity": {
        "kind": "SINGLE",
        "prompt": "On 2026-04-06 London UTC+1 and New York UTC−4, convert 08–17 windows and give overlap. Give the reason before the instructor reveals the worked answer.",
        "sectionId": "s2-6-section-3"
      }
    },
    {
      "title": "An overlap is context, not a signal",
      "minutes": 10,
      "talkingPoints": [
        "Activity and execution conditions vary within and outside conventional overlaps. An announcement, holiday, outage or provider policy may change spreads and available prices. A calendar time must include date and timezone; a scheduled release does not specify its surprise, direction or a guaranteed fill.",
        "Place an unzoned announcement on the desk but refuse to place it on the ruler. After revealing the date and zone, locate it and poll what remains unknown about spreads and outcomes.",
        "Use minutes 0–3 for explanation and the displayed example; minutes 3–6 for the demonstration: Fictional announcement 2026-03-16 08:30 America/New_York is 12:30 UTC; it lies in this exercise’s 12–17 UTC overlap but predicts no trade outcome.",
        "Use minutes 6–8 for an individual response before discussion. Contrast the proposed answer with this claim: An overlap or announcement guarantees liquidity and profit.",
        "Use minutes 8–10 to compare reasoning and record a corrected explanation; do not count attendance as mastery."
      ],
      "activity": {
        "kind": "POLL",
        "prompt": "A calendar lists a release at 08:30 with no zone. Can you reliably place it on your UTC timeline? Give the reason before the instructor reveals the worked answer.",
        "sectionId": "s2-6-section-4"
      }
    },
    {
      "title": "Verify a read-only workspace",
      "minutes": 10,
      "talkingPoints": [
        "Before interpreting a screen, confirm demo/live environment, account identifier, symbol, actual product, provider/feed and chart timezone. A demo label is evidence to inspect, not permission to submit. A currency-like symbol can refer to different products or data feeds. Keep any orientation ticket inert and read-only.",
        "Annotate a static fictional screen. Ask learners to point to each verification field. Hide the account badge and require an observation-only decision rather than a guessed environment.",
        "Use minutes 0–3 for explanation and the displayed example; minutes 3–6 for the demonstration: Fictional DEMO account A-17 shows EURUSD-CFD from Feed B, chart UTC. Record those exact labels rather than assuming deliverable currency or a different provider.",
        "Use minutes 6–8 for an individual response before discussion. Contrast the proposed answer with this claim: A familiar symbol proves product and account identity.",
        "Use minutes 8–10 to compare reasoning and record a corrected explanation; do not count attendance as mastery."
      ],
      "activity": {
        "kind": "WRITTEN",
        "prompt": "The chart symbol matches but the account environment is unverified. Is opening a live order acceptable? Give the reason before the instructor reveals the worked answer.",
        "sectionId": "s2-6-section-5"
      }
    },
    {
      "title": "Recognize a ticket without sending it",
      "minutes": 10,
      "talkingPoints": [
        "A ticket may show side, product, quantity with its unit, price fields, margin estimate and submission controls. Reading these is orientation; selecting a side or recognizing a button does not demonstrate execution competence. Demo outcomes differ from live liquidity and fills. If product, quantity units or environment is unclear, record the uncertainty and observe only.",
        "Show a disabled fictional submit control. Learners annotate recognition fields without choosing a trade. End with an individual written refusal and explain that Stage 8 will teach execution under separate requirements.",
        "Use minutes 0–3 for explanation and the displayed example; minutes 3–6 for the demonstration: A static ticket shows quantity 1 with no unit and an unverified account badge. The safe record is “not submitted: unit and environment unknown,” not a trial order.",
        "Use minutes 6–8 for an individual response before discussion. Contrast the proposed answer with this claim: Submitting a tiny demo order resolves every uncertainty safely.",
        "Use minutes 8–10 to compare reasoning and record a corrected explanation; do not count attendance as mastery."
      ],
      "activity": {
        "kind": "WRITTEN",
        "prompt": "An inert screenshot omits quantity units and product terms. State the next action. Give the reason before the instructor reveals the worked answer.",
        "sectionId": "s2-6-section-6"
      }
    }
  ],
  "studyGuide": {
    "summary": [
      "Use a dated UTC ruler as the shared reference and carry each city’s named zone alongside it. Seasonal differences can change the intersection even when local windows remain fixed.",
      "A calendar helps locate an event, not forecast its outcome. Provider schedules and observed conditions remain separate checks.",
      "Treat the platform as a source to verify: environment, account, product, feed, timestamp and quantity units. A read-only record can demonstrate safe orientation without any order."
    ],
    "bigPicture": "Convert supplied session windows using date, named timezone and DST context. Verify instrument, account and environment; distinguish observation from submitting an order.",
    "fiveThings": [
      "No; check the dated product/provider schedule",
      "13:00–17:00 UTC on 2026-02-10",
      "London 07–16 UTC, New York 12–21 UTC, overlap 12–16 UTC",
      "No; verify date and source timezone first",
      "No; verify environment and remain read-only"
    ],
    "outcomes": [
      "Convert supplied session windows using date, named timezone and DST context.",
      "Verify instrument, account and environment; distinguish observation from submitting an order."
    ],
    "examples": [
      "2026-07-13: London UTC+1, New York UTC−4. Convert local 08–17 windows, overlap and 10:00 New York release. Worked check: London 07–16 UTC; NY 12–21; overlap 12–16; release 14:00 UTC with date.",
      "Fictional screen: GBPUSD, Feed R, account badge hidden, quantity 1 with no unit. List what is known, what must be verified and whether to submit. Worked check: Known symbol/feed only; verify actual product, demo/live, account, quantity units and chart timezone; do not submit; demo is not live-fill evidence."
    ],
    "misconceptions": [
      "Every instrument is available throughout any named FX session.",
      "Local clocks can be compared without offsets or date.",
      "Both locations change clocks on the same day.",
      "An overlap or announcement guarantees liquidity and profit.",
      "A familiar symbol proves product and account identity.",
      "Submitting a tiny demo order resolves every uncertainty safely."
    ],
    "review": [
      {
        "sectionId": "s2-6-section-1",
        "label": "Session names are conventions"
      },
      {
        "sectionId": "s2-6-section-2",
        "label": "Anchor the date before converting"
      },
      {
        "sectionId": "s2-6-section-3",
        "label": "DST transitions do not synchronize"
      },
      {
        "sectionId": "s2-6-section-4",
        "label": "An overlap is context, not a signal"
      },
      {
        "sectionId": "s2-6-section-5",
        "label": "Verify a read-only workspace"
      },
      {
        "sectionId": "s2-6-section-6",
        "label": "Recognize a ticket without sending it"
      }
    ]
  },
  "chart": {
    "required": false,
    "tools": [],
    "stateFormat": "drawing-objects-v1",
    "context": [],
    "reviewStates": [],
    "history": "append-only"
  },
  "references": [
    {
      "title": "NIST: daylight saving time rules",
      "url": "https://www.nist.gov/pml/time-and-frequency-division/popular-links/daylight-saving-time-dst"
    },
    {
      "title": "GOV.UK: when clocks change",
      "url": "https://www.gov.uk/when-do-the-clocks-change"
    },
    {
      "title": "OANDA product disclosure: hours, margin and execution",
      "url": "https://legal.oanda.com/?code=product_disclosure_statement&language=en"
    }
  ],
  "design": {
    "format": "Dated session timeline and inert-platform verification",
    "homeworkTitle": "Dated session worksheet / Read-only orientation and integrated Stage 2 transfer",
    "homeworkIntro": "Submit both tasks as durable written evidence. Each competency receives its own review; preserve original attempts and submit corrections as new evidence.",
    "pacing": {
      "minimum": 50,
      "maximum": 75
    },
    "assessmentCoverage": [
      "S2_C6_1",
      "S2_C6_2"
    ],
    "practicalRequirement": "Saved written calculations and explanations are required for each competency. No funded account, personal allocation, order submission or chart credit is required.",
    "studyGuideChecks": [
      "Why is March 16, 2026 different from April 6 under the supplied windows? Reconstruct both overlaps without copying them.",
      "A chart shows a currency symbol but no account badge: list the evidence needed before even considering an order.",
      "Explain why an accurately converted announcement time and a demo fill still cannot guarantee live conditions."
    ],
    "studyGuideVisual": {
      "kind": "session",
      "nodes": [
        {
          "label": "Dated source clocks",
          "detail": "Record exercise date and both named timezones before converting."
        },
        {
          "label": "One common ruler",
          "detail": "Convert each local window to UTC and intersect the resulting intervals."
        },
        {
          "label": "Independent conditions check",
          "detail": "Add provider hours, holidays and dated announcements without inferring guaranteed fills."
        },
        {
          "label": "Read-only verification",
          "detail": "Record environment/account/product/feed/time/units; unresolved labels mean observe only."
        }
      ],
      "caption": "Review uses dated clocks and an independent observation-only verification trail."
    }
  }
};
