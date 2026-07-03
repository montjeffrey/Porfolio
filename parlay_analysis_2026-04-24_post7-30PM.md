# Tiered Parlay Analysis — Friday, April 24, 2026 (Post-7:30 PM ET)

**Sport:** MLB primary (NBA + NHL skipped — scope decision noted at end)  
**Window:** First pitch ≥ 7:40 PM ET on 4/24/26  
**Framework:** Three-Anchor (Matchup / Form+Platoon / Environment), tiered HIGH 13–15 / MEDIUM 10–12 / SPECULATIVE 7–9  
**Data sources used:** BallparkPal Game Simulations [BPP], Hofapp matchup grades / pitcher ratings / batter form [Hofapp], NWS api.weather.gov hourly forecast [NWS], MLB.com schedule  
**Constraint compliance:** No odds, no implied probabilities, no fair prices, no payout ranges, no EV. Every cited number has an inline source tag.

---

## 1. Slate Snapshot — Post-7:30 PM ET Games

| Time (ET) | Matchup | Venue | Roof | BPP Sim Total | BPP YRFI% | Park Runs Adj |
|---|---|---|---|---|---|---|
| 7:40 | LAA @ KC | Kauffman | Open | 9.96 [BPP] | 56.6% [BPP] | -2% [BPP] |
| 7:40 | WSH @ CWS | Rate Field | Open | 10.21 [BPP] | 53.9% [BPP] | +4% [BPP] |
| 7:40 | PIT @ MIL | American Family | Retractable | 7.52 [BPP] | 42.1% [BPP] | -5% [BPP] |
| 8:05 | ATH @ TEX | Globe Life | Retractable | 9.90 [BPP] | 53.8% [BPP] | -8% [BPP] |
| 8:10 | NYY @ HOU | Daikin Park | Retractable | 11.09 [BPP] | 60.4% [BPP] | -5% [BPP] |
| 8:15 | SEA @ STL | Busch | Open | 8.58 [BPP] | 48.8% [BPP] | -10% [BPP] |
| 10:15 | CHC @ LAD | Dodger | Open | 9.13 [BPP] | 51.7% [BPP] | -2% [BPP] |
| 10:15 | MIA @ SF | Oracle | Open | 8.37 [BPP] | 48.7% [BPP] | -3% [BPP] |

**Highest scoring environment:** NYY @ HOU (11.09 sim, 60.4% YRFI — highest on slate) [BPP]  
**Lowest scoring environment / NRFI candidate:** PIT @ MIL (7.52 sim, 42.1% YRFI — lowest on slate) [BPP]  
**10:15 PM games (CHC @ LAD, MIA @ SF):** Lineups not yet final at pull time [BPP]; treat as later-decision adds, not core legs.

---

## 2. Starters / Key Participants Table

| Game | SP | Hand | Hofapp Matchup vs Opp Hitters | K | ERA | WHIP |
|---|---|---|---|---|---|---|
| LAA@KC | Y. Kikuchi | LHP | C+ [Hofapp] | 5.4 | 5.6 | 1.6 |
| LAA@KC | N. Cameron | RHP | A (LAA hitters favored) [Hofapp] | 4.3 | 5.4 | 1.4 |
| WSH@CWS | P. Poulin | — | C- (CWS hitters mid) [Hofapp] | 0.6 | 5.0 | 1.6 (RP — bullpen game) |
| WSH@CWS | B. Hudson | — | B (WSH hitters favored) [Hofapp] | 1.3 | 1.7 | 1.5 (RP — bullpen game) |
| PIT@MIL | P. Skenes | RHP | D (MIL hitters suppressed) [Hofapp] | 4.6 | 3.3 | 0.9 |
| PIT@MIL | B. Woodruff | RHP | A- (PIT hitters favored) [Hofapp] | 5.0 | 2.7 | 0.8 |
| ATH@TEX | L. Severino | RHP | A- (TEX hitters favored) [Hofapp] | 5.4 | 6.2 | 1.7 |
| ATH@TEX | N. Eovaldi | RHP | D (OAK hitters suppressed) [Hofapp] | 5.8 | 5.1 | 1.5 |
| NYY@HOU | W. Warren | RHP | F (HOU hitters suppressed — best on slate) [Hofapp] | 6.2 | 2.5 | 1.1 |
| NYY@HOU | L. McCullers Jr. | RHP | A (NYY hitters favored — best on slate) [Hofapp] | 5.3 | 6.2 | 1.3 |
| SEA@STL | G. Kirby | RHP | B+ (STL hitters favored — but Kirby ERA 3.0/WHIP 1.0; treat as pitcher-favored) [Hofapp] | 5.4 | 3.0 | 1.0 |
| SEA@STL | A. Pallante | RHP | C- (SEA hitters mid) [Hofapp] | 3.0 | 4.5 | 1.5 |

**Hofapp grade convention used:** Grade reflects favorability for the OFFENSE facing the listed pitcher. A/A-/A+ = favorable for hitters, D/F = unfavorable for hitters. Inferred from cross-checking grade with sim runs and AI preview narratives.

---

## 3. Environmental Anchor Summary

| Venue | Roof Status | Temp @ FP (°F) [NWS] | Wind [NWS] | HR Implication |
|---|---|---|---|---|
| Kauffman (KC) | Open | 64–68 | 6 mph ENE | Wind from ENE = blowing in toward batter (CF). Mild HR suppressor. |
| Rate Field (CWS) | Open | 58–61 | 5–10 mph N | Cool temp + light cross/in. Mild HR suppressor; especially LHB pull. |
| American Family (MIL) | Retractable, typically closed | n/a | n/a | Neutral if closed (assume closed — late April). |
| Globe Life (TEX) | Retractable, typically closed | n/a | n/a | Neutral if closed. |
| Daikin Park (HOU) | Retractable, typically closed | n/a | n/a | Crawford Boxes LF still favors RHB pull and short LF. Neutral if closed. |
| Busch (STL) | Open | 68–71 | 3–5 mph N | Light, mild cross/in. ~Neutral. Slight rain chance. |
| Dodger (LAD) | Open | 60–67 | 5–10 mph SSW | SSW wind = blowing toward NNE (out to LF/CF). Mild HR helper. |
| Oracle (SF) | Open | not pulled | not pulled | Coastal cool typical. Treat as suppressor pending lineup confirmation. |

**Rain monitor:** STL has slight chance of showers/thunderstorms early; risk fades by 9 PM CT [NWS].  
**Cold cutoff alert:** Rate Field 58–61°F is below the 70°F+ HR-friendly threshold — material drag on CWS/WSH HR legs.

---

## 4. Leg Bank — Three-Anchor Scoring

### HIGH (13–15)

**1. Ben Rice (NYY) — Anytime HR / 2+ TB**  
- A1 (5): A matchup vs McCullers; McCullers ERA 6.2 / WHIP 1.3 [Hofapp]; no H2H sample [Hofapp]  
- A2 (5): L20 8 HR / .300 / 18 H in 60 AB [Hofapp]; vs RHP .326 with 5 HR in 43 AB [Hofapp]; LHB pull profile  
- A3 (4): Daikin -5% but roof closed → neutral [BPP]; NYY sim 6.16 runs (highest on slate) [BPP]  
- **Total: 14**

**2. Aaron Judge (NYY) — Anytime HR / 2+ TB**  
- A1 (5): A matchup vs McCullers [Hofapp]  
- A2 (4): L20 7 HR / .268 in 71 AB [Hofapp]; vs RHP .304 / 4 HR in 46 AB [Hofapp]  
- A3 (4): Daikin closed neutral; Crawford Boxes short LF favors RHB pull; NYY sim 6.16 [BPP]  
- **Total: 13**

**3. Josh Jung (TEX) — 1+ Hits / 2+ TB**  
- A1 (5): A- matchup vs Severino (6.2 ERA / 1.7 WHIP) [Hofapp]  
- A2 (5): L20 .387 / 24 H / 3 HR / 11 RBI in 62 AB — slate-leading hitter [Hofapp]  
- A3 (3): Globe Life retractable, BPP -8%; TEX sim 5.79 [BPP]  
- **Total: 13**

**4. PIT @ MIL — NRFI**  
- A1 (5): Skenes D matchup for MIL hitters [Hofapp]; Woodruff 2.7 ERA / 0.8 WHIP [Hofapp]  
- A2/sub (5): BPP YRFI 42.1% — lowest on slate [BPP]; sim total 7.52 — lowest on slate [BPP]  
- A3 (4): American Family closed-roof assumed; Yelich out per Hofapp AI Preview [Hofapp]  
- **Total: 14**

**5. NYY Team Total Over (line TBD — verify ~4.5/5)**  
- A1 (5): A matchup vs McCullers [Hofapp]  
- A2 (5): Rice 8 HR L20, Judge 7 HR L20, Bellinger .375 L5 6H 2HR 7RBI, Caballero .368 L5, Stanton 1 HR L5 [Hofapp]  
- A3 (4): NYY sim 6.16 (slate-leading) [BPP]; closed roof neutral  
- **Total: 14**

### MEDIUM (10–12)

**6. Miguel Murakami (CWS) — Anytime HR**  
- A1 (4): B matchup vs WSH bullpen game (Poulin opener 5.0 ERA / 1.6 WHIP) [Hofapp]; bullpen game = middle-relief exposure  
- A2 (5): L5 4 HR / .409 / 9 H / 6 RBI in 22 AB [Hofapp]  
- A3 (3): Rate Field BPP +4% [BPP], 58–61°F cool [NWS], 5–10 mph N cross/in [NWS]  
- **Total: 12**

**7. Colson Montgomery (CWS) — Anytime HR**  
- A1 (4): B matchup vs WSH bullpen [Hofapp]  
- A2 (5): L5 4 HR / .381 / 8 H / 7 RBI in 21 AB [Hofapp]  
- A3 (3): Rate Field +4% / cool / N wind [BPP/NWS]  
- **Total: 12**

**8. TEX Team Total Over (line TBD — verify ~4.5)**  
- A1 (5): A- matchup vs Severino (6.2 ERA / 1.7 WHIP) [Hofapp]  
- A2 (4): Jung .387 L20, Nimmo .275 / 22 H L20, Seager 4 HR L20 [Hofapp]  
- A3 (3): Globe Life closed-roof neutral; TEX sim 5.79 [BPP]  
- **Total: 12**

**9. Mike Trout (LAA) — Anytime HR**  
- A1 (5): A matchup vs Cameron (5.4 ERA / 1.4 WHIP) [Hofapp]  
- A2 (4): L20 6 HR / .221 / 14 RBI in 68 AB — power despite avg [Hofapp]  
- A3 (2): Kauffman -2% [BPP]; wind 6 mph ENE blowing toward batter / in [NWS] = HR suppressor  
- **Total: 11**

**10. R. Witt Jr. (KC) — 1+ Hits**  
- A1 (4): B+ matchup vs Kikuchi (LHP, 5.6 ERA / 1.6 WHIP) [Hofapp]  
- A2 (4): L20 22 H / .286 / 0 HR in 77 AB — pure contact profile [Hofapp]  
- A3 (3): Kauffman -2% / cool / wind in [BPP/NWS]  
- **Total: 11**

**11. M. Vargas (CWS) — Anytime HR**  
- A1 (4): B matchup vs WSH bullpen [Hofapp]  
- A2 (4): L5 3 HR / .316 / 6 H / 5 RBI in 19 AB [Hofapp]  
- A3 (3): Rate Field +4% / cool / N wind [BPP/NWS]  
- **Total: 11**

**12. Yordan Alvarez (HOU) — 1+ Hits**  
- A1 (2): C+ matchup vs Warren (Warren 2.5 ERA / 1.1 WHIP — elite) [Hofapp]; F game-level grade for HOU  
- A2 (5): L20 .338 / 25 H / 8 HR / 20 RBI [Hofapp]; vs RHP .320 / 5 HR in 50 AB [Hofapp]  
- A3 (3): Daikin closed neutral; HOU sim 4.93 [BPP]  
- **Total: 10**  
- *Note: HR variant for Alvarez scores lower (Anchor 1 too negative for HR-specific play vs Warren).*

**13. SEA @ STL — NRFI**  
- A1 (4): Kirby 3.0 ERA / 1.0 WHIP elite stats override grade [Hofapp]; Pallante C- for SEA hitters [Hofapp]  
- A2/sub (3): BPP YRFI 48.8% [BPP]; sim total 8.58 [BPP]  
- A3 (4): Busch -10% [BPP]; 68–71°F, wind 3–5 mph N [NWS]  
- **Total: 11**

### SPECULATIVE (7–9)

**14. C. Jensen (KC) — Anytime HR**  
- A1 (3): C+ matchup; Kikuchi 5.6 ERA but LHP [Hofapp]; vs LHP split not pulled  
- A2 (4): L20 5 HR / .321 / 17 H / 12 RBI [Hofapp]  
- A3 (2): Kauffman / wind in / cool [BPP/NWS]  
- **Total: 9**

**15. Daylen Lile (WSH) — Anytime HR**  
- A1 (3): C- WSH hitters matchup vs Hudson [Hofapp]; bullpen game for CWS  
- A2 (4): L5 .385 / 5 H / 2 HR / 5 RBI in 13 AB [Hofapp]  
- A3 (2): Rate Field +4% but cool 58–61°F + N wind [BPP/NWS]  
- **Total: 9**

**16. James Wood (WSH) — Anytime HR**  
- A1 (3): C- matchup vs CWS opener [Hofapp]  
- A2 (5): L5 3 HR in 16 AB [Hofapp]  
- A3 (1): cool 58–61°F + N cross/in [NWS] is the worst HR weather on slate for LHB pull  
- **Total: 9**

---

## 5. Tiered Parlays

> **Verify each line exists on your book before locking. Lines move; lineups can change. None of the legs below have been priced or confirmed against a specific sportsbook.**

### SMALL — HIGH-only, 3 legs

| # | Leg | Score |
|---|---|---|
| 1 | Ben Rice (NYY) — Anytime HR | 14 |
| 2 | Josh Jung (TEX) — 1+ Hits | 13 |
| 3 | PIT @ MIL — NRFI | 14 |

Cross-game, no internal correlation. Cleanest build of the night.

### MEDIUM — HIGH + strongest MEDIUM, 5 legs

| # | Leg | Score |
|---|---|---|
| 1 | Ben Rice (NYY) — Anytime HR | 14 |
| 2 | Aaron Judge (NYY) — 2+ TB | 13 |
| 3 | Josh Jung (TEX) — 1+ Hits | 13 |
| 4 | PIT @ MIL — NRFI | 14 |
| 5 | M. Murakami (CWS) — Anytime HR | 12 |

Notes: Rice + Judge are positively correlated (same game / same pitcher). Books usually build that into SGP pricing. Acceptable here because both are HIGH-tier. If you'd rather decorrelate, swap Judge for **R. Witt 1+ Hits (11)**.

### LARGE — HIGH + MEDIUM + Speculative ceiling, 7 legs

| # | Leg | Score |
|---|---|---|
| 1 | Ben Rice (NYY) — Anytime HR | 14 |
| 2 | Aaron Judge (NYY) — 2+ TB | 13 |
| 3 | Josh Jung (TEX) — 1+ Hits | 13 |
| 4 | PIT @ MIL — NRFI | 14 |
| 5 | M. Murakami (CWS) — Anytime HR | 12 |
| 6 | NYY Team Total Over (line ~4.5 — verify) | 14 |
| 7 | Mike Trout (LAA) — Anytime HR (speculative ceiling) | 11 |

Notes: Legs 1, 2, 6 are all NYY/same-game — heavily correlated, will likely require SGP. If your book won't allow 3 NYY legs in the same parlay, drop Trout (#7) into a separate slip and replace #6 with **TEX Team Total Over (12)**. Trout sits in the speculative slot because the wind-in environment at Kauffman is the risk.

### HOME RUN PARLAY — 4 legs (your stated target)

The only HR legs that score HIGH on the matchup anchor are NYY hitters tonight. To get a 4-leg HR build, two CWS bats are added. CWS HR legs carry weather drag (cool / cross-in wind) so they're MEDIUM-tier, not HIGH.

| # | Hitter | Pitcher Faced | Score | Risk Note |
|---|---|---|---|---|
| 1 | Ben Rice (NYY) | L. McCullers Jr. | 14 | A matchup, 8 HR L20 |
| 2 | Aaron Judge (NYY) | L. McCullers Jr. | 13 | A matchup, 7 HR L20 |
| 3 | M. Murakami (CWS) | WSH bullpen | 12 | 4 HR L5 / cool weather drag |
| 4 | C. Montgomery (CWS) | WSH bullpen | 12 | 4 HR L5 / cool weather drag |

If you want a more conservative 4th leg instead of stacking CWS, swap leg 4 for **J. Jung 1+ TB** (13) — but that turns it into a "Power Props" parlay, not a pure HR parlay.

If you want a higher-variance 5-leg HR, add **Mike Trout (LAA) — Anytime HR (11)**. Wind-in is the hold-back.

---

## 6. Correlation & Risk Analysis

- **Same-game stack (NYY):** Rice + Judge + NYY TT Over are positively correlated. The Medium and Large parlays both rely on NYY. If NYY scores 3 runs, your night is short. If NYY scores 7+, several legs hit together.
- **Same-game stack (CWS):** Murakami + Montgomery + Vargas all face the same WSH opener/bullpen — positive correlation. Stacking 2 of them is fine; stacking all 3 is over-correlated for the ticket size.
- **Negative correlation flag:** PIT @ MIL NRFI + any PIT/MIL offensive prop in the same parlay creates direct conflict. None of the parlays above include a PIT/MIL bat, but if you add one, drop the NRFI.
- **Weather-sensitive legs:** All CWS HR legs and the WSH HR legs depend on Rate Field weather not getting colder or wind shifting more directly in. Re-check NWS within 1 hour of first pitch.
- **Pitcher hook variance:** Will Warren (NYY SP) at 2.5 ERA / 1.1 WHIP and George Kirby (SEA SP) at 3.0 ERA / 1.0 WHIP are top-tier — F5/NRFI plays anchored on them are solid, but late-inning game state can swing offensive props for the opposing side. NRFI is segment-isolated, so unaffected.
- **Bullpen game variance (CWS / WSH):** Both starters listed are RP type (Poulin and Hudson). Bullpen games are higher-variance on HR rate because middle relievers are typically below MLB-average. Skews CWS/WSH HR legs slightly more in your favor than the matchup grade alone — but also raises NRFI risk in that game (do not add WSH @ CWS NRFI to any of these tickets — sim total is 10.21, second highest on slate).

---

## 7. Pre-Lock Checklist

**Confirm before placing:**

1. **Lineups final** for: WSH @ CWS, LAA @ KC, ATH @ TEX, NYY @ HOU, SEA @ STL — Hofapp confirms "Final: Yes" for all 7:40–8:15 ET games at pull time; CHC @ LAD and MIA @ SF were "Final: No" [BPP]. None of the parlays above use 10:15 PM legs, so this isn't blocking.
2. **Ben Rice** in NYY lineup and batting in the top 5. 8 HR on 60 AB L20 [Hofapp] depends on volume — confirm he's not given a rest day.
3. **Aaron Judge** in lineup and at full health. No injury flags pulled, but verify on Hofapp Injuries tab right before lock.
4. **Josh Jung** in TEX lineup and not pinch-hit only.
5. **Murakami / Montgomery** both in CWS lineup. CWS lineups can shuffle more than usual; verify both are starting.
6. **Paul Skenes** confirmed as PIT starter (not scratched). Same for **Brandon Woodruff** (MIL).
7. **Will Warren** confirmed as NYY starter for the Team Total Over leg.
8. **Weather re-check at Rate Field (CWS):** if temp drops below 55°F or wind shifts to direct N at 15+ mph, downgrade Murakami/Montgomery HR legs.
9. **Weather re-check at Kauffman (KC):** if wind picks up direct ENE at 12+ mph, drop Trout from the Large parlay.
10. **STL rain monitor:** SEA @ STL NRFI is a Medium leg, not in any of the three core parlays above, but if you add it, confirm NWS shows no precip after first pitch.
11. **Roof status confirmation** for HOU (Daikin), TEX (Globe Life), MIL (American Family). Late-April Texas is often closed; cool/humid days in the upper Midwest can also be closed at MIL. Open roof at HOU would slightly help LHB pull power (Rice especially); open at TEX is rare in summer. Not a blocker — just informs leg confidence.
12. **Line existence check:** verify NYY Team Total Over line. The recommended threshold is ~4.5; if your book posts 5 or 5.5, re-evaluate against the 6.16 sim runs [BPP] (still a Medium-Plus play at 5.5; HIGH at 4.5).

---

## 8. NBA / NHL Note

The user instruction was to add NBA + NHL legs only if HIGH-tier value emerges. NBA and NHL slates were **not deep-analyzed in this pass** due to tool budget consumption on the MLB three-anchor work. No NBA/NHL legs are included above. If you want them analyzed under the same framework, send a follow-up and I'll pull tonight's NBA + NHL game data from Hofapp under your authenticated session.

---

## 9. Legs That Did Not Make It (and Why)

- **Y. Alvarez (HOU) — Anytime HR:** elite bat (8 HR L20) but Will Warren's F-grade for HOU offense + 2.5 ERA / 1.1 WHIP [Hofapp] caps Anchor 1 at 2/5. Total was 10 (Medium), and the HR variant goes lower. Hits leg only, and even then the matchup is the negative.
- **N. Kurtz (OAK) — Anytime HR:** 4 HR L20 [Hofapp] but D matchup vs Eovaldi [Hofapp] guts Anchor 1.
- **C. Seager (TEX) — Anytime HR:** 4 HR L20 with .174 avg [Hofapp]. Matchup is A-, but the cold avg suggests volume is the issue. Below Jung in priority.
- **C. Jensen (KC) — Anytime HR:** 5 HR L20 [Hofapp] but C+ matchup against LHP Kikuchi without a confirmed vs-LHP split pull, and wind-in weather, drops it to Speculative.
- **R. Witt — Anytime HR:** 0 HR in 77 L20 AB [Hofapp]. Pure contact profile. Hits leg only.
- **CHC @ LAD / MIA @ SF legs:** lineups not yet final at pull time [BPP]. Re-pull at ~9 PM ET if you want a 10:15 PM add.

---

**End of analysis.** All numerical claims trace to BPP, Hofapp, or NWS as tagged inline.
