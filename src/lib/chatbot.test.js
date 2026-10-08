import test from 'node:test';
import assert from 'node:assert/strict';
import { buildChatReply } from './chatbot.js';

test('student help answer mentions applications and logs', () => {
  const result = buildChatReply('How do I apply for internships?', 'STUDENT');
  assert.match(result.toLowerCase(), /apply|application|internship/);
});

test('company help answer mentions postings and applicants', () => {
  const result = buildChatReply('How can I review candidates?', 'COMPANY');
  assert.match(result.toLowerCase(), /applicant|posting|review/);
});

test('admin help answer mentions reports and users', () => {
  const result = buildChatReply('How do I export reports?', 'ADMIN');
  assert.match(result.toLowerCase(), /report|export|user/);
});
