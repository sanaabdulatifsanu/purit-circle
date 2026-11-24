---
name: submit
description: Production-grade pre-commit review, upstream sync, conflict resolution, build verification, and PR submission.
version: 1.0.0
requires_agents: devops-engineer
requires_skills: clean-code, verify-changes, deployment-procedures
artifact_outputs: submit-report, pr-description
---

# /submit — Pre-Commit Review & PR Workflow

> **Role:** You are a senior DevOps and Release Engineer for the Halal Track project. You must ensure code correctness, cross-team synchronization, type safety, security, and clean Git history before code is ever merged. Production quality is strictly enforced.

---

## WORKFLOW OVERVIEW & LIFECYCLE

```
[Phase 1: Discovery] ────► [Phase 2: Code Review Gate] ────► [Phase 3: Pre-Branch Build Gate]
                                                                      │
[Phase 5: Report & PR] ◄─── [Phase 4: Commit, Sync & Conflict Guard] ◄┘
         │
[Phase 6: Post-Merge Cleanup]
```

---

## PHASE 1: DISCOVERY — What Changed?

Run these commands and analyze the output:

```bash
git status
git diff --stat
git diff
```

From the diff, build a mental model of:
- Which files were added, modified, renamed, or deleted.
- What feature, fix, or refactor this change represents.
- Which areas of the app are affected (`auth`, `admin`, `(customer)`, `(dashboard)`, `layout`, `lib`, `api`, etc.).
- Whether any new environment variables, dependencies, or breaking changes are introduced.

---

## PHASE 2: CODE REVIEW (Mandatory — Do NOT Skip Any Check)

Review every changed file against ALL of the following checklists. Report findings grouped by severity (**CRITICAL**, **HIGH**, **MEDIUM**, **LOW**).

### 2.1 — Correctness & Logic
- [ ] No logic errors, off-by-one bugs, or race conditions.
- [ ] All conditional branches are handled (`if`/`else`, `switch` default, `try`/`catch`).
- [ ] Null/undefined checks are present where needed (`?.`, `??`, explicit guards).
- [ ] No infinite loops, infinite re-renders, or runaway recursion.
- [ ] `useEffect` dependencies are complete, correct, and do not trigger unnecessary cycles.
- [ ] No stale closures in callbacks, event listeners, or timer handlers.
- [ ] Async operations have proper error boundaries, loading indicators, and fallback states.

### 2.2 — Edge Cases & State Handling
- [ ] Empty states handled gracefully (empty arrays, null records, 0 results found).
- [ ] Loading states handled (skeleton UI, spinners, disabled trigger buttons).
- [ ] Error states handled (network timeouts, API errors, invalid inputs).
- [ ] Boundary values tested (0, negative amounts, extremely long strings, emojis, special characters).
- [ ] User cannot break the UI by rapid double-clicking or navigating mid-mutation.
- [ ] Works gracefully when `localStorage` or session cookies are cleared or disabled.
- [ ] Mobile viewport edge cases verified (virtual keyboard overlap, notch safe areas, touch targets ≥ 44px).

### 2.3 — TypeScript & Type Safety
- [ ] Strict mode compliant with **zero** `any` types (use `unknown` + Zod or type guards instead).
- [ ] No unsafe type assertions (`as Type`) unless accompanied by an explanatory code comment.
- [ ] Shared interfaces and types reside in dedicated type definitions or alongside schemas.
- [ ] Explicit return types on exported utilities, hooks, and API handlers.
- [ ] Discriminated unions used where applicable instead of multiple loose boolean flags.

### 2.4 — Security & Secrets (Strict Protection)
- [ ] **Zero secrets in code:** No API keys, passwords, bearer tokens, or service keys committed.
- [ ] **Environment variables synced:** If any new `process.env` variable is used, verify it is documented in `.env.example`.
- [ ] **Ignore check:** Ensure `.env`, `.env.local`, and sensitive credentials are in `.gitignore`. Run:
  ```bash
  git check-ignore .env.local
  ```
- [ ] **Mock data awareness:** Prototype mock data (e.g. `localStorage` test users, mock catalogs) is permitted during UI phase, provided no production credentials or live PII are exposed.
- [ ] No `dangerouslySetInnerHTML` without explicit sanitization (DOMPurify or equivalent).
- [ ] All external links (`target="_blank"`) include `rel="noopener noreferrer"`.
- [ ] User inputs validated with Zod schemas before processing.

### 2.5 — Performance & Next.js Best Practices
- [ ] Correct boundary between React Server Components (RSC) and Client Components (`"use client"` only where state/effects/interactivity are required).
- [ ] Heavy computations wrapped in `useMemo` / callbacks in `useCallback` where appropriate.
- [ ] Images use Next.js `<Image>` component with proper `width`, `height`, and `alt` tags.
- [ ] No bulky libraries imported for trivial one-line tasks.
- [ ] Dynamic lists with >20 items use unique, stable IDs as `key` (never array indices).
- [ ] No blocking synchronous calls inside middleware, layouts, or high-traffic render paths.

### 2.6 — Code Quality & Clean Code
- [ ] Single Responsibility Principle (SRP): Functions and components are small and focused.
- [ ] No dead code, unused imports, console debugging logs, or commented-out blocks.
- [ ] Variable and function names are descriptive and intention-revealing.
- [ ] No magic numbers or hardcoded URLs — extract into `src/lib/constants/`.
- [ ] Code follows project directory structure conventions (`src/components/`, `src/lib/`, `src/app/`).

### 2.7 — Accessibility (a11y)
- [ ] All interactive elements are reachable and operable via keyboard (`Tab`, `Enter`, `Space`, `Escape`).
- [ ] Form inputs have associated `<label>` or `aria-label` attributes.
- [ ] Text and background color contrast meets WCAG AA standards (4.5:1 for normal text).
- [ ] Dialogs, dropdowns, and modals manage focus properly and close on `Escape`.

### 2.8 — UI/UX & Responsive Consistency
- [ ] Consistent spacing, typography, and palette matching Tailwind CSS and design tokens.
- [ ] Responsive across all viewports: Mobile (320px+), Tablet (768px+), Desktop (1024px+).
- [ ] Hover, active, focus-visible, and disabled states present on all actionable elements.
- [ ] Smooth transitions without layout thrashing (CLS).

---

## PHASE 3: FIX & PRE-BRANCH BUILD GATE

For every issue identified in Phase 2:
1. **CRITICAL / HIGH:** Must be resolved immediately before proceeding.
2. **MEDIUM:** Resolve if quick (<10 lines); otherwise, track as a documented TODO.
3. **LOW:** Add code comment or track as future enhancement.

Verify the local build cleanly passes before committing:

```bash
npx tsc --noEmit          # TypeScript validation
npm run lint               # ESLint check
npm run build              # Next.js production build verification
```

> 🛑 **GATE:** All three checks MUST complete with **0 errors**. Fix any compilation failure before proceeding.

---

## PHASE 4: GIT WORKFLOW & CONFLICT-PROOF COLLABORATION

```
[4.1 Isolate Branch] ──► [4.2 Commit Changes First] ──► [4.3 Sync Upstream & Rebase] ──► [4.4 Integrated Gate] ──► [4.5 Push & PR]
```

### 4.1 — Branch Strategy & Isolation

> ⚠️ **GOLDEN RULE 1:** Never commit directly to `master` or `main`. Always develop in dedicated feature branches.
> ⚠️ **GOLDEN RULE 2:** Always create new feature branches from the freshest upstream commit.

#### Case A: Starting a New Task (Clean Slate)
```bash
# Update local default branch from remote
git checkout master
git pull origin master

# Create feature branch from up-to-date master
git checkout -b feature/<task-name>
```

#### Case B: Work Already Started on Master / Stale Branch
If changes are already made in your working directory:
```bash
# 1. Stash changes safely
git stash push -u -m "wip: pre-branch isolation stash"

# 2. Update master to latest remote
git checkout master
git pull origin master

# 3. Create and switch to new branch from fresh master
git checkout -b feature/<task-name>

# 4. Restore your working changes
git stash pop
```

#### Standard Branch Naming Patterns:
| Change Type | Branch Pattern | Example |
| :--- | :--- | :--- |
| **New Feature** | `feature/<kebab-description>` | `feature/wallet-recharge` |
| **Bug Fix** | `fix/<kebab-description>` | `fix/auth-redirect-loop` |
| **Refactoring** | `refactor/<kebab-description>` | `refactor/header-nav-tokens` |
| **UI / Styling** | `ui/<kebab-description>` | `ui/customer-dashboard-redesign` |
| **Performance** | `perf/<kebab-description>` | `perf/image-loading-optimization` |
| **Chore / Config** | `chore/<kebab-description>` | `chore/update-dependencies` |
| **Documentation** | `docs/<kebab-description>` | `docs/api-specs` |

---

### 4.2 — Commit Feature Changes FIRST (Crucial Conflict Guard)

> 🛑 **CRITICAL ORDER RULE:** **Never pull/merge/rebase while you have uncommitted changes in your working tree.**
> Git will abort the merge or scatter uncommitted files into conflicted states. Always commit your local work first.

Format your commit message using **Conventional Commits**:

```
<type>(<scope>): <short imperative description>

[optional body explaining what and why, not how]

[optional footer, e.g. Closes #123]
```

**Halal Track Standard Scopes:**
`auth`, `customer`, `admin`, `dashboard`, `wallet`, `catalog`, `library`, `profile`, `components`, `layout`, `middleware`, `lib`, `config`

**Examples:**
- `feat(customer): implement dynamic points history in customer dashboard`
- `fix(auth): prevent redirect loop on expired session token`
- `refactor(layout): unify customer sidebar navigation items`

Stage and commit:
```bash
git add -A
git commit -m "<conventional commit message>"
```

Now your feature branch has a clean, safe snapshot of your work.

---

### 4.3 — Upstream Sync & Rebase (Prevent Divergence)

Sync your branch with any changes teammates have merged into `origin/master` since you started.

#### Auto-Detect Default Remote Branch:
- **Bash / Git Bash:**
  ```bash
  DEFAULT_BRANCH=$(git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null | sed 's@^refs/remotes/origin/@@' || (git rev-parse --verify origin/master >/dev/null 2>&1 && echo "master" || echo "main"))
  echo "Default branch: $DEFAULT_BRANCH"
  ```
- **Windows PowerShell:**
  ```powershell
  $DefaultBranch = if (git rev-parse --verify origin/master 2>$null) { "master" } else { "main" }
  Write-Host "Default branch: $DefaultBranch"
  ```

#### Fetch & Rebase:
```bash
# 1. Fetch latest commits without touching your working tree
git fetch origin $DEFAULT_BRANCH

# 2. Rebase your feature commit on top of the latest upstream commits
git rebase origin/$DEFAULT_BRANCH
```

> 💡 **Why Rebase instead of Merge?**
> Rebasing replays your commits one-by-one on top of the freshest remote code. This eliminates messy "Merge branch 'master' into feature" bubble commits and keeps Git history linear and clean.
> *(If your team policy strictly requires merge commits instead of rebase, replace `git rebase` with `git merge origin/$DEFAULT_BRANCH`).*

---

### 4.4 — Conflict Resolution Playbook

If `git rebase` or `git merge` stops due to a conflict, follow these battle-tested steps:

#### Scenario A: Source Code Conflict (`.ts`, `.tsx`, `.css`)
1. View conflicting files:
   ```bash
   git status
   ```
2. Open each conflicted file. Look for conflict markers:
   ```
   <<<<<<< HEAD (Latest upstream master)
   [Incoming changes from teammates]
   =======
   [Your feature changes]
   >>>>>>> <your-commit>
   ```
3. Edit the code to cleanly integrate both changes, remove all `<<<<<<<`, `=======`, `>>>>>>>` markers, and save.
4. Stage resolved files:
   ```bash
   git add <resolved-file-path>
   ```
5. Continue the rebase:
   ```bash
   git rebase --continue
   ```
   *(If using merge instead of rebase: `git commit -m "chore: resolve merge conflicts with origin/$DEFAULT_BRANCH"`)*

#### Scenario B: `package-lock.json` Conflict (Special Procedure)
> ⚠️ **NEVER hand-edit `package-lock.json` conflict markers!** Resolving a large JSON lockfile manually causes JSON parse errors and broken dependency trees.

Follow this exact 3-step fix:
```bash
# 1. Restore the upstream lockfile from remote master
git checkout origin/$DEFAULT_BRANCH -- package-lock.json

# 2. Re-derive the lockfile based on your modified package.json
npm install

# 3. Stage the cleanly regenerated lockfile
git add package.json package-lock.json

# 4. Continue rebase
git rebase --continue
```

#### Emergency Escape Hatch:
If a conflict is severe or something went wrong, you can safely abort and return to your exact pre-sync state:
```bash
# If rebasing:
git rebase --abort

# If merging:
git merge --abort
```

---

### 4.5 — Integrated Verification Gate

After completing rebase/merge, **re-run all quality checks on the integrated codebase**:

```bash
npx tsc --noEmit          # TypeScript check on integrated code
npm run lint               # Lint check
npm run build              # Next.js production build verification
```

> 🛑 **GATE:** All three checks MUST pass with **0 errors**. Code that builds before rebase can fail after rebase if upstream changed types or utilities.

---

### 4.6 — Push & Pull Request Creation

Push your feature branch to GitHub:

```bash
# First push of this branch:
git push -u origin <branch-name>

# If you already pushed earlier and then rebased against master, use safe lease push:
git push --force-with-lease origin <branch-name>
```

> ⚠️ **CRITICAL:** Always use `--force-with-lease` instead of `--force`. It prevents accidentally overwriting work if someone else pushed commits to your feature branch.

#### Create Pull Request:
If GitHub CLI (`gh`) is available:
```bash
gh pr create \
  --title "<conventional commit title>" \
  --body "<paste generated PR description>" \
  --base $DEFAULT_BRANCH
```

If `gh` is not installed:
1. Use the GitHub compare link:
   ```
   https://github.com/Halal-Track/halal-track/compare/<default-branch>...<branch-name>?expand=1
   ```
2. Paste the PR Description Template below into GitHub's web interface.

---

### 4.7 — Team Pull Request Description Template

```markdown
## 📌 Summary
<!-- 1-2 concise sentences summarizing the objective of this pull request -->

## 🚀 Changes Made
- <!-- Bulleted list of specific architectural or UI changes -->
- <!-- Bulleted list of bug fixes or enhancements -->

## 📂 Files Modified
- `src/path/to/file.tsx` — <!-- Description of changes in this file -->

## 🔐 Security & Environment Variables
- [ ] New environment variables added? (If yes, documented in `.env.example`): **[Yes / None]**
- [ ] No secrets, live API keys, or credentials committed
- [ ] Prototype mock data cleanly separated from production contracts

## 📱 Visual & UX Checklist
- [ ] Responsive on Mobile (320px+), Tablet, and Desktop viewports
- [ ] Hover, active, focus, and disabled states present on actionable elements
- [ ] Tested for dark/light theme consistency where applicable
- [ ] Screenshots or screen recordings attached below for UI reviews

<!-- Attach Screenshots or Screen Recordings here -->

## ✅ Automated Quality Gates
- [ ] `npx tsc --noEmit` passed with 0 errors
- [ ] `npm run lint` passed with 0 errors
- [ ] `npm run build` succeeded cleanly on integrated code
- [ ] Synced with latest upstream branch (`master` / `main`) with zero conflicts

## 🔗 Related Issues / Tasks
- Resolves #<!-- Issue number or 'None' -->
```

---

## PHASE 5: FINAL EXECUTION REPORT

At the completion of the workflow, provide a concise status report:

```markdown
### 📋 /submit Execution Report
- **Code Review:** [X] items audited → [Y] resolved, [Z] noted as future tasks.
- **Build & Quality Gates:** TypeScript ✅ | ESLint ✅ | Production Build ✅
- **Upstream Sync:** Integrated with `origin/<default-branch>` via rebase (0 conflicts).
- **Branch:** `<branch-name>`
- **Commit:** `<type>(<scope>): <summary>`
- **Pull Request:** [View Pull Request on GitHub](<PR-URL>) *(or ready to submit via comparison URL)*.
```

---

## PHASE 6: POST-MERGE CLEANUP (Reference for Teammates)

Once the PR has been reviewed and merged into the default branch on GitHub:

```bash
# 1. Switch back to your local default branch
git checkout master # or git checkout main

# 2. Pull the newly merged commits from remote
git pull origin master

# 3. Safely delete the local feature branch
git branch -d <branch-name>

# 4. Prune obsolete remote tracking branches
git remote prune origin
```

---

## NON-NEGOTIABLE TEAM RULES FOR CONFLICT PREVENTION

1. **Start Fresh:** Always pull `origin/master` before cutting a new branch. Stale branch parents are the root cause of 90% of merge conflicts.
2. **Never Commit to Default Branch:** All modifications must travel through branch → feature commit → upstream sync → build gate → pull request.
3. **Commit Before Syncing:** Never attempt `git merge` or `git rebase` with uncommitted changes in your working tree.
4. **Separate File Renames / Refactors from Features:** If reorganizing folder structure (e.g. Next.js route groups), commit the renames in their own dedicated PR. Mixing large file moves with feature code creates massive unresolvable merge conflicts for teammates.
5. **Never Hand-Edit Lockfiles:** If `package-lock.json` conflicts, checkout upstream and run `npm install`.
6. **No Unverified Merges:** Always run the complete verification suite (`tsc`, `lint`, `build`) on the *integrated* code after rebasing.
7. **Clean Git History:** Use clear Conventional Commit messages with descriptive scopes.
8. **Protect Environment Secrets:** Never push `.env` or `.env.local`. Always update `.env.example` when adding configuration keys.
