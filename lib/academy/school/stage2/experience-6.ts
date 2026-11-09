import type {StageExperience} from '../stage/contracts';
/** Public teaching scenes; no private banks or grading rubrics. */
export const EXPERIENCE_S2_6:StageExperience={
  "classId": "stage-2-class-6",
  "academicVersion": "stage-2-class-6.1.0.0",
  "revision": "s2-6-experience-1",
  "format": "session",
  "sections": [
    {
      "sectionId": "s2-6-section-1",
      "hook": "Does a session label establish a particular provider’s holiday hours?",
      "scenario": "For this exercise only, London window is 08:00–17:00 Europe/London and New York window is 08:00–17:00 America/New_York.",
      "visual": {
        "kind": "session",
        "nodes": [
          {
            "label": "London convention",
            "detail": "08:00–17:00 Europe/London"
          },
          {
            "label": "New York convention",
            "detail": "08:00–17:00 America/New_York"
          },
          {
            "label": "Provider check",
            "detail": "Hours and holidays still required"
          }
        ],
        "caption": "Session names are conventions — fictional teaching inputs; specifications and dated context govern interpretation."
      },
      "practice": [
        {
          "id": "s2-6-practice-1",
          "kind": "reflect",
          "prompt": "Does a session label establish a particular provider’s holiday hours?",
          "explanation": "No; check the dated product/provider schedule. Decentralized weekday FX activity is commonly described using regional session labels. A label is not a centralized exchange opening bell or a promise of constant availability. Use supplied windows for an exercise and verify the provider’s actual hours, holiday schedule and product before planning observation.",
          "retry": "Record the date, named timezone and verification labels before proceeding."
        }
      ],
      "explanation": [
        "Decentralized weekday FX activity is commonly described using regional session labels. A label is not a centralized exchange opening bell or a promise of constant availability. Use supplied windows for an exercise and verify the provider’s actual hours, holiday schedule and product before planning observation."
      ],
      "takeaway": "No; check the dated product/provider schedule",
      "demi": "A missing verification field means observe and ask; it never means submit."
    },
    {
      "sectionId": "s2-6-section-2",
      "hook": "For 2026-02-10, supplied windows 08–17 London UTC+0 and 08–17 New York UTC−5: give UTC overlap.",
      "scenario": "2026-02-10 09:00 America/New_York = 14:00 UTC = 14:00 Europe/London.",
      "visual": {
        "kind": "session",
        "nodes": [
          {
            "label": "London UTC",
            "detail": "08:00–17:00"
          },
          {
            "label": "New York UTC",
            "detail": "13:00–22:00"
          },
          {
            "label": "Intersection",
            "detail": "13:00–17:00 UTC"
          }
        ],
        "caption": "Anchor the date before converting — fictional teaching inputs; specifications and dated context govern interpretation."
      },
      "practice": [
        {
          "id": "s2-6-practice-2",
          "kind": "reflect",
          "prompt": "For 2026-02-10, supplied windows 08–17 London UTC+0 and 08–17 New York UTC−5: give UTC overlap.",
          "explanation": "13:00–17:00 UTC on 2026-02-10. On 2026-02-10 London is UTC+0 and New York UTC−5. Under our supplied windows London is 08:00–17:00 UTC, New York 13:00–22:00 UTC, and their intersection is 13:00–17:00 UTC. Intersect intervals only after putting them on one dated timeline.",
          "retry": "Record the date, named timezone and verification labels before proceeding."
        }
      ],
      "explanation": [
        "On 2026-02-10 London is UTC+0 and New York UTC−5. Under our supplied windows London is 08:00–17:00 UTC, New York 13:00–22:00 UTC, and their intersection is 13:00–17:00 UTC. Intersect intervals only after putting them on one dated timeline."
      ],
      "takeaway": "13:00–17:00 UTC on 2026-02-10",
      "demi": "A missing verification field means observe and ask; it never means submit."
    },
    {
      "sectionId": "s2-6-section-3",
      "hook": "On 2026-04-06 London UTC+1 and New York UTC−4, convert 08–17 windows and give overlap.",
      "scenario": "Same local windows, different dates: February 10 overlap 13–17 UTC; March 16 overlap 12–17; April 6 overlap 12–16.",
      "visual": {
        "kind": "session",
        "nodes": [
          {
            "label": "2026-02-10",
            "detail": "13:00–17:00 UTC"
          },
          {
            "label": "2026-03-16",
            "detail": "12:00–17:00 UTC"
          },
          {
            "label": "2026-04-06",
            "detail": "12:00–16:00 UTC"
          }
        ],
        "caption": "DST transitions do not synchronize — fictional teaching inputs; specifications and dated context govern interpretation."
      },
      "practice": [
        {
          "id": "s2-6-practice-3",
          "kind": "reflect",
          "prompt": "On 2026-04-06 London UTC+1 and New York UTC−4, convert 08–17 windows and give overlap.",
          "explanation": "London 07–16 UTC, New York 12–21 UTC, overlap 12–16 UTC. In 2026 US DST begins March 8, while UK clocks advance March 29. On March 16 London remains UTC+0 and New York is UTC−4: our overlap is 12:00–17:00 UTC. On April 6 London is UTC+1 and New York UTC−4, so the overlap is 12:00–16:00 UTC. A saved winter offset is unsafe for spring dates.",
          "retry": "Record the date, named timezone and verification labels before proceeding."
        }
      ],
      "explanation": [
        "In 2026 US DST begins March 8, while UK clocks advance March 29. On March 16 London remains UTC+0 and New York is UTC−4: our overlap is 12:00–17:00 UTC. On April 6 London is UTC+1 and New York UTC−4, so the overlap is 12:00–16:00 UTC. A saved winter offset is unsafe for spring dates."
      ],
      "takeaway": "London 07–16 UTC, New York 12–21 UTC, overlap 12–16 UTC",
      "demi": "A missing verification field means observe and ask; it never means submit."
    },
    {
      "sectionId": "s2-6-section-4",
      "hook": "A calendar lists a release at 08:30 with no zone. Can you reliably place it on your UTC timeline?",
      "scenario": "Fictional announcement 2026-03-16 08:30 America/New_York is 12:30 UTC; it lies in this exercise’s 12–17 UTC overlap but predicts no trade outcome.",
      "visual": {
        "kind": "session",
        "nodes": [
          {
            "label": "Calendar",
            "detail": "Date + source timezone"
          },
          {
            "label": "Conditions",
            "detail": "Check observed spread and availability"
          },
          {
            "label": "Inference limit",
            "detail": "No guaranteed direction or fill"
          }
        ],
        "caption": "An overlap is context, not a signal — fictional teaching inputs; specifications and dated context govern interpretation."
      },
      "practice": [
        {
          "id": "s2-6-practice-4",
          "kind": "reflect",
          "prompt": "A calendar lists a release at 08:30 with no zone. Can you reliably place it on your UTC timeline?",
          "explanation": "No; verify date and source timezone first. Activity and execution conditions vary within and outside conventional overlaps. An announcement, holiday, outage or provider policy may change spreads and available prices. A calendar time must include date and timezone; a scheduled release does not specify its surprise, direction or a guaranteed fill.",
          "retry": "Record the date, named timezone and verification labels before proceeding."
        }
      ],
      "explanation": [
        "Activity and execution conditions vary within and outside conventional overlaps. An announcement, holiday, outage or provider policy may change spreads and available prices. A calendar time must include date and timezone; a scheduled release does not specify its surprise, direction or a guaranteed fill."
      ],
      "takeaway": "No; verify date and source timezone first",
      "demi": "A missing verification field means observe and ask; it never means submit."
    },
    {
      "sectionId": "s2-6-section-5",
      "hook": "The chart symbol matches but the account environment is unverified. Is opening a live order acceptable?",
      "scenario": "Fictional DEMO account A-17 shows EURUSD-CFD from Feed B, chart UTC. Record those exact labels rather than assuming deliverable currency or a different provider.",
      "visual": {
        "kind": "session",
        "nodes": [
          {
            "label": "Environment",
            "detail": "DEMO / account A-17"
          },
          {
            "label": "Product/feed",
            "detail": "EURUSD-CFD / Feed B"
          },
          {
            "label": "Time",
            "detail": "Chart timezone UTC"
          }
        ],
        "caption": "Verify a read-only workspace — fictional teaching inputs; specifications and dated context govern interpretation."
      },
      "practice": [
        {
          "id": "s2-6-practice-5",
          "kind": "choice",
          "prompt": "The chart symbol matches but the account environment is unverified. Is opening a live order acceptable?",
          "explanation": "No; verify environment and remain read-only. Before interpreting a screen, confirm demo/live environment, account identifier, symbol, actual product, provider/feed and chart timezone. A demo label is evidence to inspect, not permission to submit. A currency-like symbol can refer to different products or data feeds. Keep any orientation ticket inert and read-only.",
          "retry": "Record the date, named timezone and verification labels before proceeding.",
          "options": [
            {
              "id": "observe",
              "label": "Remain read-only while verifying the environment and account."
            },
            {
              "id": "submit",
              "label": "Submit to discover which account is active."
            }
          ],
          "correct": "observe"
        }
      ],
      "explanation": [
        "Before interpreting a screen, confirm demo/live environment, account identifier, symbol, actual product, provider/feed and chart timezone. A demo label is evidence to inspect, not permission to submit. A currency-like symbol can refer to different products or data feeds. Keep any orientation ticket inert and read-only."
      ],
      "takeaway": "No; verify environment and remain read-only",
      "demi": "A missing verification field means observe and ask; it never means submit."
    },
    {
      "sectionId": "s2-6-section-6",
      "hook": "An inert screenshot omits quantity units and product terms. State the next action.",
      "scenario": "A static ticket shows quantity 1 with no unit and an unverified account badge. The safe record is “not submitted: unit and environment unknown,” not a trial order.",
      "visual": {
        "kind": "session",
        "nodes": [
          {
            "label": "Recognize",
            "detail": "Side, quantity units, price, collateral"
          },
          {
            "label": "Verify",
            "detail": "Product, feed, account and environment"
          },
          {
            "label": "Decision",
            "detail": "Observe only; no submission"
          }
        ],
        "caption": "Recognize a ticket without sending it — fictional teaching inputs; specifications and dated context govern interpretation."
      },
      "practice": [
        {
          "id": "s2-6-practice-6",
          "kind": "reflect",
          "prompt": "An inert screenshot omits quantity units and product terms. State the next action.",
          "explanation": "Remain read-only; request missing units/product terms and verify account. A ticket may show side, product, quantity with its unit, price fields, margin estimate and submission controls. Reading these is orientation; selecting a side or recognizing a button does not demonstrate execution competence. Demo outcomes differ from live liquidity and fills. If product, quantity units or environment is unclear, record the uncertainty and observe only.",
          "retry": "Record the date, named timezone and verification labels before proceeding."
        }
      ],
      "explanation": [
        "A ticket may show side, product, quantity with its unit, price fields, margin estimate and submission controls. Reading these is orientation; selecting a side or recognizing a button does not demonstrate execution competence. Demo outcomes differ from live liquidity and fills. If product, quantity units or environment is unclear, record the uncertainty and observe only."
      ],
      "takeaway": "Remain read-only; request missing units/product terms and verify account",
      "demi": "A missing verification field means observe and ask; it never means submit."
    }
  ]
};
