module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'chore', 'docs', 'refactor', 'test', 'ci', 'perf', 'style'],
    ],
    'scope-enum': [
      2,
      'always',
      ['auth', 'orgs', 'pets', 'discovery', 'queue', 'scheduling', 'ci', 'deps', 'docs'],
    ],
  },
};
