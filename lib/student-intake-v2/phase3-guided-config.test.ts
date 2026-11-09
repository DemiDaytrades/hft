import { describe, it } from "node:test";
import assert from "node:assert";
import {
  ASSESSMENT_STAGES,
  GUIDED_SCREENS,
  fieldKeyForIssuePath,
  screenForIssuePath,
  screenQuestionCount,
  stageById,
} from "../../app/(app)/admin/student-intake-v2/guided-config";
import { ACKNOWLEDGMENT_KEYS, INTAKE_V2_STUDENT_KEYS } from "./contracts";

describe("Phase 3 guided navigation and focus mapping", () => {
  it("defines the four-stage assessment shell with stable deep links", () => {
    assert.deepEqual(
      ASSESSMENT_STAGES.map((stage) => stage.id),
      ["questions", "readiness", "instructor", "plans"],
    );
    assert.equal(stageById("readiness")?.label, "Readiness Review");
    assert.equal(stageById("unknown"), undefined);
  });

  it("exposes every canonical student answer and acknowledgment in guided capture", () => {
    const captured = new Set(GUIDED_SCREENS.flatMap((screen) => screen.fields ?? []));
    const acknowledged = new Set(GUIDED_SCREENS.flatMap((screen) => screen.ackKeys ?? []));
    assert.deepEqual(
      [...new Set([...captured, "ackChecklist"])].sort(),
      [...INTAKE_V2_STUDENT_KEYS].sort(),
    );
    assert.deepEqual([...acknowledged].sort(), [...ACKNOWLEDGMENT_KEYS].sort());
  });

  it("keeps the schedule-tech screen grouped as four logical questions", () => {
    const screen = GUIDED_SCREENS.find((candidate) => candidate.id === "schedule-tech");
    assert.ok(screen);
    assert.equal(screen.section, "schedule");
    assert.deepEqual(screen.fields, [
      "devicesInternet",
      "platformAccess",
      "supportTechReadiness",
      "techLimitations",
    ]);
    assert.equal(screenQuestionCount(screen), 4);
  });

  it("maps schedule-tech nested issues to the schedule-tech screen", () => {
    for (const path of [
      "student_sections.devicesInternet.devices",
      "student_sections.platformAccess.mt5",
      "student_sections.supportTechReadiness.canScreenShare",
      "student_sections.techLimitations",
    ]) {
      assert.equal(screenForIssuePath(path), "schedule-tech", path);
    }
  });

  it("preserves field anchors for schedule and object fields", () => {
    assert.equal(fieldKeyForIssuePath("student_sections.devicesInternet.devices"), "devicesInternet");
    assert.equal(fieldKeyForIssuePath("student_sections.platformAccess.mt5"), "platformAccess");
    assert.equal(fieldKeyForIssuePath("student_sections.supportTechReadiness.canScreenShare"), "supportTechReadiness");
    assert.equal(fieldKeyForIssuePath("student_sections.weeklyAvailability.monday"), "weeklyAvailability.monday");
  });

  it("maps acknowledgment issues to their exact checkbox anchors", () => {
    assert.equal(screenForIssuePath("acknowledgments.ackRiskOfLoss"), "acknowledgments-1");
    assert.equal(fieldKeyForIssuePath("acknowledgments.ackRiskOfLoss"), "ack:ackRiskOfLoss");
    assert.equal(screenForIssuePath("ack_audit.ackPersonalResponsibility"), "acknowledgments-2");
  });
});
