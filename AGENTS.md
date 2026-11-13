# Agent notes for react-spinkit

<!-- BEGIN @tanstack/oracles (template 4) -->

## Oracle tests

This repository tests its design with `@tanstack/oracles`. An oracle
captures the code's design as laws and enforces them against an independent
model. Work oracle first, production second.

**Who owns what.** The laws belong to the people who maintain this
repository: what the code promises, the authority for each promise, and its
limits. Propose a law, but do not adopt or change one without their
approval. The production code that the oracles own is yours. Whenever you
change it, do a good job, not a minimal or lazy one: the fast, small,
elegant version, as an optimizing compiler for the oracle would write it.
Anything that keeps every oracle passing is allowed, so a big refactor is
fine when it makes the code better; the oracle is the review. Keep it in
proportion to the task: improve the code the work touches, and when you see
a larger win elsewhere, offer it instead of turning the task into a long
optimization project.

**How the work goes.**

- **Probe first.** Before you propose anything, call the real code with
  small scripts and show what they print. Every law and every finding comes
  with a probe that can be rerun.
- **Propose the laws, then build only the approved ones.** Each law is a
  "For every …" sentence with where its promise is written: the docs, a
  test, or a maintainer's decision. A question nobody has decided is fine:
  state it as a limit.
- **Red first, like TDD, but the oracle goes red.** A bug becomes a law and
  a history that fail on the unchanged code. Then fix production at once,
  and show the run going green.
- **Never weaken or quarantine an oracle:** no skip, no `test.fails`, no
  loosened expectation, no switch that turns a check off.
- **Build the strongest model the laws need.** Compare every observable
  result they speak about. The model states the rule a user relies on,
  never the code's algorithm, even when the docs describe that algorithm.
  Give each law a calibration: a wrong answer the check must reject.
- **Run the oracles only through the gap check, never Vitest alone.** It
  prints each test file's result first, then each gap as it is judged. A run
  can take minutes: start it in the background with output to a log, and
  read the new lines every few seconds, acting on a failure first. Stop a
  run only by the process ID you recorded, never by name.
- **Green is not done.** A gap is a change to the owned code that no law
  notices. There are no equivalent mutants: never call one equivalent.
  Widen the histories or the check until the oracle sees it, and keep going
  until a bug or a design question turns up.
- **Report classes of bugs:** the rule broken, and the measured share of
  generated inputs that break it. Never call one minor.

**Skills.**

- To explore an area of the code (or the whole repository), find where an
  oracle would help, or propose a new one, read
  `node_modules/@tanstack/oracles/skills/oracles-explore/SKILL.md` in full
  and follow it.
- Before you create or change an oracle, or change production code that an
  oracle owns, read `node_modules/@tanstack/oracles/skills/oracles-design/SKILL.md`
  in full and follow it.
- Before you review oracle work, read
  `node_modules/@tanstack/oracles/skills/oracles-review/SKILL.md` in full.
- Before you act on review findings, read
  `node_modules/@tanstack/oracles/skills/oracles-evaluate-review/SKILL.md` in
  full.
- Lint each oracle file and each changed production file after you edit it.
  Fix every report. Do not disable a rule.
- Oracle files: `test/**/*.oracle.property.test.{ts,tsx}`. Gap check: `pnpm gaps` (React 19, every owned file) and `pnpm gaps:react18` (React 18, which alone checks PropTypes); a mutant counts as killed when either run kills it. Hand-written mutants live in `test/oracle-mutants/`.

<!-- END @tanstack/oracles -->
