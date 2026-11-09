import test from 'node:test';import assert from 'node:assert/strict';
import * as presentation from '../../components/classroom/presentation';
test('fresh authorized realtime snapshots suppress duplicate polls but retain periodic HTTP verification',()=>{
 const due=(presentation as any).classroomPollDue;assert.equal(typeof due,'function');
 assert.equal(due(12000,10000,11000,true),false);assert.equal(due(41000,10000,40000,true),true);
 assert.equal(due(12000,10000,11000,false),true);assert.equal(due(25000,10000,11000,true),true);
 assert.equal(due(12000,0,0,false),true);assert.equal(presentation.heartbeatDue(15000,0),true);
});
