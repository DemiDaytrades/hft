import {
  ACKNOWLEDGMENT_KEYS,
  INTAKE_V2_FORM_VERSION,
  INTAKE_V2_SCHEMA_VERSION,
  type AckAuditRecord,
  type AcknowledgmentKey,
  type CaptureMode,
} from "./contracts";

export const ACKNOWLEDGMENT_REGISTRY: Record<AcknowledgmentKey, { version_id: string; text: string }> = {
  ackRiskOfLoss: { version_id: "ack_risk_of_loss_v1", text: "I understand trading involves risk of loss, including the possible loss of trading capital." },
  ackEducationOnly: { version_id: "ack_education_only_v1", text: "I understand HFT provides educational and mentorship services only and does not provide personalized financial, investment, legal, or tax advice." },
  ackNoGuarantees: { version_id: "ack_no_guarantees_v1", text: "I understand HFT does not guarantee profits, income, or specific trading results." },
  ackPastPerformance: { version_id: "ack_past_performance_v1", text: "I understand past performance, examples, or demonstrations do not guarantee future results." },
  ackEssentialFunds: { version_id: "ack_essential_funds_v1", text: "I understand I should not trade money needed for rent, food, bills, debt payments, or essential living expenses." },
  ackDemoMayBeRequired: { version_id: "ack_demo_may_be_required_v1", text: "I understand demo practice may be required before live trading based on readiness and risk." },
  ackPersonalResponsibility: { version_id: "ack_personal_responsibility_v1", text: "I understand I am responsible for my own trading decisions and actions." },
};

export function buildAckAuditRecords(params: {
  intake_id: string;
  confirmed_by_user_id: string;
  confirmed_by_role: string;
  capture_mode: CaptureMode;
  confirmations: Partial<Record<AcknowledgmentKey, boolean>>;
  confirmed_at?: string;
  form_version?: string;
  schema_version?: string;
}): { acknowledgments: Record<AcknowledgmentKey, boolean>; records: AckAuditRecord[] } {
  const confirmed_at = params.confirmed_at || new Date().toISOString();
  const acknowledgments = {} as Record<AcknowledgmentKey, boolean>;
  const records: AckAuditRecord[] = [];
  for (const ack_key of ACKNOWLEDGMENT_KEYS) {
    const confirmed = params.confirmations[ack_key] === true;
    acknowledgments[ack_key] = confirmed;
    if (confirmed) {
      records.push({
        ack_key,
        ack_text_version_id: ACKNOWLEDGMENT_REGISTRY[ack_key].version_id,
        confirmed: true,
        confirmed_at,
        confirmed_by_user_id: params.confirmed_by_user_id,
        confirmed_by_role: params.confirmed_by_role,
        intake_id: params.intake_id,
        form_version: params.form_version || INTAKE_V2_FORM_VERSION,
        schema_version: params.schema_version || INTAKE_V2_SCHEMA_VERSION,
        capture_mode: params.capture_mode,
      });
    }
  }
  return { acknowledgments, records };
}

export function getAcknowledgmentRegistry() {
  return ACKNOWLEDGMENT_KEYS.map((key) => ({ key, ...ACKNOWLEDGMENT_REGISTRY[key] }));
}
