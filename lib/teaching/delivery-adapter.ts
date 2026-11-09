import 'server-only';
import {canSendEmail,canSendSms,sendEmail,sendSms,type SendResult} from '../communications';
import type {TeachingDeliveryPayload} from './delivery';
/** Only called by the signed, explicitly enabled dispatcher. Tests inject fakes. */
export async function deliverTeachingMessage(payload:TeachingDeliveryPayload):Promise<SendResult>{
 if(payload.channel==='email'){
  if(!await canSendEmail(payload.recipientId))return {channel:'email',status:'skipped',idempotencyKey:payload.idempotencyKey};
  return sendEmail({to:payload.to,userId:payload.recipientId,subject:payload.message.subject,html:payload.message.html,text:payload.message.text,eventType:'teaching',idempotencyKey:payload.idempotencyKey});
 }
 if(!await canSendSms(payload.recipientId))return {channel:'sms',status:'skipped',idempotencyKey:payload.idempotencyKey};
 return sendSms({to:payload.to,userId:payload.recipientId,body:payload.message.body,eventType:'teaching',idempotencyKey:payload.idempotencyKey});
}
