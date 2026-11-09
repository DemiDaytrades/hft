import type {LiveKitEnvironment} from './livekit';
export interface ClassroomEnvironment extends LiveKitEnvironment {
 DB:D1Database;BETTER_AUTH_URL:string;
 CLASSROOM_CONTROL_SECRET?:string;CLASSROOM_CONTROL_URL?:string;CLASSROOM_HUB?:Fetcher;
}
