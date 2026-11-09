import {addDays,localDate} from './time';

type BookingWindow = {timezone:string;minimum_notice_hours:number;booking_horizon_days:number};
export function bookingHorizonDate(config:Pick<BookingWindow,'timezone'|'booking_horizon_days'>,now=Date.now()) {
 return addDays(localDate(new Date(now).toISOString(),config.timezone),config.booking_horizon_days);
}
function civilTime(ms:number,zone:string) {
 const parts=new Intl.DateTimeFormat('en-CA',{timeZone:zone,hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(ms);
 return ['hour','minute','second'].map(key=>parts.find(p=>p.type===key)!.value).join(':')+'.'+String(new Date(ms).getUTCMilliseconds()).padStart(3,'0');
}
/** Notice is elapsed time; the inclusive horizon uses the instructor's calendar and wall clock. */
export function bookingTimeAllowed(start:string,config:BookingWindow,now=Date.now()) {
 const ms=Date.parse(start);
 if(!Number.isFinite(ms)||ms<now+config.minimum_notice_hours*3600000)return false;
 const candidate=localDate(start,config.timezone)+'T'+civilTime(ms,config.timezone);
 return candidate<=bookingHorizonDate(config,now)+'T'+civilTime(now,config.timezone);
}
