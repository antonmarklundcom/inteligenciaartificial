-- The "every prompt is human-tested" rule is a database constraint, not a
-- guideline (docs/08 §6, docs/15 T1-02 acceptance criteria).
ALTER TABLE `prompts`
  ADD CONSTRAINT `chk_prompts_probado_before_publish`
  CHECK (`publicado` = false OR (`probado_por` IS NOT NULL AND `probado_at` IS NOT NULL));
