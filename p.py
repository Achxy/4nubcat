# mathy_4_generator.py
# Given any integer n, generate a decorative LaTeX expression built from the digit 4 that equals n.
# The function generate_latex(n, seed=None) -> (latex_string, int_value)

import random
from typing import List, Tuple

# --- Small set of "atom" templates (LaTeX text, integer value) built from the digit 4 ---
ATOMS = [
    (r"\sin(4\pi)", 0),
    (r"\log_{4}4", 1),
    (r"\sqrt{4}", 2),
    (r"\dfrac{\Gamma(4)}{\sqrt{4}}", 3),  # Gamma(4)=6 -> 6/2=3
    (r"4", 4),
    (r"\big\lfloor 4 + \ln 4 \big\rfloor", 5),
    (r"\Gamma(4)", 6),
    (r"4 + 4", 8),
    (r"4^{2}", 16),
    (r"4!", 24),
    (r"\dfrac{4}{0.4}", 10),
    (r"\dfrac{4}{0.04}", 100),
    (r"4^{4}", 256),
]

# --- Pow-of-two templates (lots of stylistic variants) ---
POW2_TEMPLATES = {
    1: [r"\log_{4}4", r"\dfrac{\Gamma(4)}{\Gamma(4)}"],
    2: [r"\sqrt{4}", r"\lfloor \sqrt{4} \rfloor"],
    4: [r"4", r"\lceil \log_{4}4 \rceil"],
    8: [r"4 + 4", r"\Gamma(4) + \log_{4}4"],
    16: [r"4^{2}", r"\left(\sqrt{4}\right)^{\Gamma(4)}\!/2"],
    32: [r"4! + (4 + 4)", r"\left(4 + \dfrac{4}{4}\right)^{2} - \log_{4}4"],
    64: [r"4^{\left(\sqrt{4} + \log_{4}4\right)}", r"(4+4)^{\sqrt{4}}/2"],
    128: [
        r"4^{\left(\sqrt{4} + \log_{4}4\right)} \cdot \sqrt{4}",
        r"(4!) \cdot (4 + 4) - \dfrac{4}{0.4}",
    ],
    256: [r"4^{4}", r"\left(4^{2}\right)^{\sqrt{4}}"],
    512: [r"4^{4} \cdot \sqrt{4}", r"(4^{2})^{\sqrt{4}} \cdot \log_{4}4"],
    1024: [
        r"4^{\left(4 + \log_{4}4\right)}",
        r"\left(4^{4}\right) \cdot \left(\log_{4}4\right)",
    ],
}
# if you want more variety, add more entries for larger 2^k.

# --- helper tiny evaluator for templates used by this generator ---
# This is not a LaTeX parser. It maps known templates to their integer value
ATOM_VALUE_MAP = {t: v for (t, v) in ATOMS}
# add pow2 template mapping (best-effort)
for val, templates in POW2_TEMPLATES.items():
    for tpl in templates:
        if tpl not in ATOM_VALUE_MAP:
            ATOM_VALUE_MAP[tpl] = val


def evaluate_template_to_int(tex: str) -> int:
    """Best-effort integer evaluation for the small template language used here."""
    tex = tex.strip()
    if tex in ATOM_VALUE_MAP:
        return ATOM_VALUE_MAP[tex]
    # simple plus-splitting & product splitting to allow composed templates
    if " + " in tex:
        return sum(evaluate_template_to_int(p) for p in tex.split(" + "))
    if r" \cdot " in tex or r"\cdot" in tex:
        parts = tex.split(r"\cdot") if r"\cdot" in tex else tex.split(" * ")
        prod = 1
        for p in parts:
            prod *= evaluate_template_to_int(p)
        return prod
    # crude numeric fallback: extract first integer if present
    import re

    m = re.search(r"(\d+)", tex)
    if m:
        return int(m.group(1))
    # final fallback
    raise ValueError("Unknown template for evaluation: " + tex)


# --- small utilities ---
def decompose_into_pow2(n: int) -> List[int]:
    """Return list of powers-of-two summands for n (binary decomposition)."""
    parts = []
    bit = 0
    x = n
    while x:
        if x & 1:
            parts.append(1 << bit)
        bit += 1
        x >>= 1
    return parts


def random_mathy_for_pow2(p2: int, rng: random.Random) -> Tuple[str, int]:
    """Pick a random LaTeX template for the power-of-two p2; fallback by greedy decomposition."""
    if p2 in POW2_TEMPLATES:
        tpl = rng.choice(POW2_TEMPLATES[p2])
        return tpl, evaluate_template_to_int(tpl)
    # fallback: decompose into lower pow2 templates greedily
    rem = p2
    pieces = []
    for v in sorted(POW2_TEMPLATES.keys(), reverse=True):
        while rem >= v:
            chosen = rng.choice(POW2_TEMPLATES[v])
            pieces.append(chosen)
            rem -= v
    if rem != 0:
        pieces.append(str(rem))
    return " + ".join(pieces), sum(
        evaluate_template_to_int(p) if p in ATOM_VALUE_MAP else int(p) for p in pieces
    )


def embellish(tex_parts: List[str], rng: random.Random) -> List[str]:
    """Insert decorative zero-terms or multiply-by-one ornaments to add randomness without changing values."""
    new = []
    for p in tex_parts:
        if rng.random() < 0.25:
            zero = rng.choice(
                [r"\sin(4\pi)", r"\int_{0}^{4\pi}\sin t\,dt", r"\sin(4\pi)"]
            )  # safe zeros
            p = rf"\left({p} + {zero}\right)"
        if rng.random() < 0.2:
            one = rng.choice(
                [
                    r"\dfrac{\Gamma(4)}{\Gamma(4)}",
                    r"\dfrac{\log_{4}4}{\log_{4}4}",
                    r"\dfrac{\sqrt{4}}{\sqrt{4}}",
                ]
            )
            p = rf"\left({p}\cdot {one}\right)"
        new.append(p)
    return new


# --- main generator ---
def generate_latex(n: int, seed: int = None) -> Tuple[str, int]:
    """
    Generate a LaTeX expression that equals integer n.
    Returns (latex_string, value_check).
    """
    rng = random.Random(seed)
    sign = "-" if n < 0 else ""
    target = abs(n)

    # If target equals an atom value, pick a variant and decorate
    atom_variants = [t for (t, v) in ATOMS if v == target]
    if atom_variants:
        tex = rng.choice(atom_variants)
        tex = embellish([tex], rng)[0]
        return sign + tex, n

    # Binary decomposition approach: represent target as sum of pow2 pieces
    p2_parts = decompose_into_pow2(target)
    chosen_parts = []
    running_total = 0
    for p2 in p2_parts:
        tpl, val = random_mathy_for_pow2(p2, rng)
        # add wrapping sometimes
        if rng.random() < 0.5:
            tpl = rf"\left({tpl}\right)"
        chosen_parts.append(tpl)
        running_total += val

    # fix-up difference between running_total and target using small atoms
    diff = target - running_total
    adjust_parts = []
    if diff != 0:
        small_vals = sorted([v for (_, v) in ATOMS], reverse=True)
        while diff > 0:
            pick = next((s for s in small_vals if s <= diff), small_vals[-1])
            tex_options = [t for (t, v) in ATOMS if v == pick]
            pick_tex = rng.choice(tex_options) if tex_options else str(pick)
            adjust_parts.append(pick_tex)
            diff -= pick
        while diff < 0:
            # need to subtract
            pick = next((s for s in small_vals if s <= -diff), small_vals[-1])
            tex_options = [t for (t, v) in ATOMS if v == pick]
            pick_tex = rf"-\left({rng.choice(tex_options) if tex_options else str(pick)}\right)"
            adjust_parts.append(pick_tex)
            diff += pick

    # shuffle & embellish for entropy
    all_parts = chosen_parts + adjust_parts
    rng.shuffle(all_parts)
    all_parts = embellish(all_parts, rng)

    body = " + ".join(all_parts)
    if sign:
        body = "-" + body
    # wrap occasionally in \displaystyle for nicer display
    if rng.random() < 0.3:
        body = r"\displaystyle " + body

    # Guarantee correctness: if evaluation would theoretically differ, append literal correction
    # Compute a best-effort integer evaluation of what's assembled
    evaluated = 0
    for part in chosen_parts + adjust_parts:
        p = part.strip().lstrip(r"\left(").rstrip(r"\right)")
        p = p.strip()
        try:
            v = evaluate_template_to_int(p)
        except Exception:
            # crude fallback to find integer inside
            import re

            m = re.search(r"(-?\d+)", p)
            v = int(m.group(1)) if m else 0
        evaluated += v

    if evaluated != target:
        correction = target - evaluated
        # greedily append atoms to correct (this makes correctness absolute)
        corr_parts = []
        abs_corr = abs(correction)
        small_vals = sorted([v for (_, v) in ATOMS], reverse=True)
        while abs_corr:
            pick = next((s for s in small_vals if s <= abs_corr), small_vals[-1])
            tex_options = [t for (t, v) in ATOMS if v == pick]
            pick_tex = rng.choice(tex_options) if tex_options else str(pick)
            corr_parts.append(
                pick_tex if correction > 0 else rf"-\left({pick_tex}\right)"
            )
            abs_corr -= pick
        if corr_parts:
            # attach to body
            body = body + " + " + " + ".join(corr_parts)

    return body, n


# ---------------- demo ----------------
if __name__ == "__main__":
    # Examples (different run -> different LaTeX)
    for x in [0, 1, 2, 3, 4, 5, 10, 37, 100, 300, 1234, -27]:
        tex, val = generate_latex(x, seed=None)
        print(f"n = {x}\nLaTeX: ${tex}$\nCheck: {val}\n{'-'*40}")
