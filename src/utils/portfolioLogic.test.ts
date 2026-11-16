import test from 'node:test';
import assert from 'node:assert/strict';
import { PROJECTS_DATA, SKILLS_DATA } from '../data/portfolioData';
import {
  filterProjects,
  filterSkills,
  formatGwaliorTime,
  getNextBugSquashRank,
  hasInjectionThreat,
  isSafeExternalUrl,
  pickDevExcuse,
  sanitizeTextInput,
  stepTrainingEpoch,
  validateContactForm,
} from './portfolioLogic';

test('filterSkills filters Python Data Science, AI/ML, and DevOps categories cleanly', () => {
  const all = filterSkills(SKILLS_DATA, 'all');
  assert.equal(all.length, SKILLS_DATA.length);

  const aiMl = filterSkills(SKILLS_DATA, 'ai-ml');
  assert.ok(aiMl.some((s) => s.id === 'genai'));
  assert.ok(aiMl.every((s) => s.category === 'ai-ml'));

  const ds = filterSkills(SKILLS_DATA, 'data-science');
  assert.ok(ds.some((s) => s.id === 'pandas'));
  assert.ok(ds.some((s) => s.id === 'numpy'));

  const devops = filterSkills(SKILLS_DATA, 'databases-devops');
  assert.ok(devops.some((s) => s.id === 'docker'));
  assert.ok(devops.some((s) => s.id === 'postgresql'));
});

test('filterProjects filters accurately without mutating source', () => {
  const fullstack = filterProjects(PROJECTS_DATA, 'fullstack');
  assert.ok(fullstack.some((p) => p.id === 'agrinext'));
  assert.ok(fullstack.every((p) => p.category === 'fullstack'));
});

test('validateContactForm rejects invalid email, short messages, and injection threats', () => {
  const emptyResult = validateContactForm('', '');
  assert.equal(emptyResult.valid, false);
  assert.ok(emptyResult.errors.email);
  assert.ok(emptyResult.errors.message);

  const xssResult = validateContactForm(
    'attacker@evil.com',
    '<script>alert("xss")</script> UNION SELECT * FROM users',
  );
  assert.equal(xssResult.valid, false);
  assert.ok(xssResult.errors.message);

  assert.equal(hasInjectionThreat('javascript:alert(1)'), true);
  assert.equal(hasInjectionThreat('{"$ne": null}'), true);
  assert.equal(sanitizeTextInput('<b>Hello</b>\0 World'), 'Hello World');
  assert.equal(isSafeExternalUrl('https://agrinext-frontend.vercel.app'), true);
  assert.equal(isSafeExternalUrl('/Harsh_Bhadoria_Resume.pdf'), true);
  assert.equal(isSafeExternalUrl('javascript:alert(1)'), false);
  assert.equal(isSafeExternalUrl('//evil.example.com'), false);

  const validResult = validateContactForm('recruiter@company.com', 'Loved AgriNext, let us connect!');
  assert.equal(validResult.valid, true);
  assert.equal(validResult.sanitizedEmail, 'recruiter@company.com');
  assert.deepEqual(validResult.errors, {});
});

test('stepTrainingEpoch reduces loss and increments epoch/accuracy deterministically', () => {
  const start = stepTrainingEpoch(
    { epoch: 1, lossHistory: [0.92], accuracy: 54.2, chaiCups: 1, statusNote: '' },
    'reset',
  );
  assert.equal(start.epoch, 1);

  const trained = stepTrainingEpoch(start, 'train');
  assert.equal(trained.epoch, 2);
  assert.ok(trained.lossHistory[1] < start.lossHistory[0]);
  assert.ok(trained.accuracy > start.accuracy);

  const chaiBoosted = stepTrainingEpoch(trained, 'chai');
  assert.equal(chaiBoosted.chaiCups, 2);
  assert.ok(chaiBoosted.accuracy > trained.accuracy);
});

test('pickDevExcuse cycles smoothly and getNextBugSquashRank scales', () => {
  const excuse = pickDevExcuse(0);
  assert.equal(excuse.index, 1);
  assert.ok(excuse.text.length > 10);

  assert.equal(getNextBugSquashRank(0), 'Untested Prod');
  assert.equal(getNextBugSquashRank(10), 'Pandas Wrangler');
  assert.equal(getNextBugSquashRank(30), 'Zero-Bug Grandmaster');
});

test('formatGwaliorTime returns non-empty IST time string', () => {
  const formatted = formatGwaliorTime(new Date('2026-11-16T10:30:00Z'));
  assert.ok(formatted.length >= 8);
});
