import test from 'node:test';
import assert from 'node:assert/strict';
import { reviewLink } from './review-link';
test('review queue routes interactive evidence to its instructor workspace and retains legacy routes',()=>{
 assert.equal(reviewLink({user_id:'student a',learning_lesson_id:'lesson/1',quiz_id:'quiz'}),'/admin/academy/learning?studentId=student%20a&lessonId=lesson%2F1');
 assert.equal(reviewLink({user_id:'student',quiz_id:'quiz'}),'/admin/academy/review/student?quizId=quiz');
 assert.equal(reviewLink({user_id:'student'}),'/admin/academy/review/student');
});
