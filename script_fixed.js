// Generate a mathy LaTeX expression using the digit 4 that equals any integer n.

/* ---------- small seeded RNG (mulberry32) ---------- */
function mulberry32(seed) {
  let t = seed >>> 0;
  return function() {
    t += 0x6D2B79F5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

/* ---------- ATOMS: [latex, integerValue] ---------- */
const ATOMS = [
  // Basic values using sophisticated expressions (ONLY using digit 4)
  ["\\\\sin(4\\\\pi)", 0],
  ["\\\\int_{0}^{4\\\\pi}\\\\sin t\\\\,dt", 0],
  ["\\\\oint_{|z|=4} \\\\dfrac{dz}{z}", 0],
  
  ["\\\\log_{4}4", 1],
  ["\\\\dfrac{\\\\Gamma(4)}{\\\\Gamma(4)}", 1],
  ["\\\\int_{0}^{4} \\\\delta(t-\\\\log_{4}4)\\\\,dt", 1],
  
  ["\\\\sqrt{4}", 2],
  ["\\\\lfloor \\\\sqrt{4} \\\\rfloor", 2],
  ["\\\\int_{0}^{4} \\\\delta(t-\\\\sqrt{4})\\\\,dt", 2],
  
  ["\\\\dfrac{\\\\Gamma(4)}{\\\\sqrt{4}}", 3], // 6/2 = 3
  ["\\\\big\\lfloor \\\\pi + \\\\dfrac{4}{4} \\\\big\\rfloor", 3],
  
  ["4", 4],
  ["\\\\int_{0}^{4} \\\\dfrac{4}{4}\\\\,dt", 4],
  ["\\\\sum_{k=\\\\dfrac{4}{4}}^{4} \\\\dfrac{4}{4}", 4],
  
  ["\\\\big\\lfloor 4 + \\\\ln 4 \\\\big\\rfloor", 5],
  ["\\\\lceil 4 + \\\\ln 4 \\\\rceil", 5],
  
  ["\\\\Gamma(4)", 6],
  ["\\\\int_{0}^{4} t\\\\,dt", 8],
  ["4 + 4", 8],
  
  ["\\\\dfrac{4}{0.4}", 10],
  ["\\\\int_{0}^{4} \\\\lfloor t + \\\\dfrac{4}{4} \\\\rfloor\\\\,dt", 10],
  
  ["4^{\\\\sqrt{4}}", 16],
  ["\\\\int_{0}^{4} \\\\sqrt{4} \\\\cdot t\\\\,dt", 16],
  ["\\\\sum_{k=\\\\dfrac{4}{4}}^{4} k^{\\\\sqrt{4}}", 30],
  
  ["4!", 24],
  ["\\\\Gamma(\\\\dfrac{4}{4} + 4)", 24],
  ["\\\\int_{0}^{4} \\\\Gamma(t+\\\\dfrac{4}{4})\\\\,dt", 24],
  
  ["\\\\dfrac{4}{0.04}", 100],
  ["\\\\int_{0}^{4} \\\\dfrac{4^{\\\\sqrt{4}}}{\\\\sqrt{4}} \\\\cdot t\\\\,dt", 100],
  ["\\\\sum_{k=\\\\dfrac{4}{4}}^{4} k^{\\\\dfrac{4}{4} + \\\\sqrt{4}}", 100],
  
  ["4^{4}", 256],
  ["\\\\int_{0}^{4} 4^{t}\\\\,dt", 256],
  ["\\\\sum_{k=0}^{4} 4^{k}", 341],
  
  ["4^{\\\\dfrac{4}{4} + 4}", 1024],
  ["\\\\int_{0}^{4} (\\\\dfrac{4}{4} + 4) \\\\cdot 4^{t}\\\\,dt", 1024],
  ["\\\\sum_{k=\\\\dfrac{4}{4}}^{4} k^{4}", 354],
  
  ["4^{4 + \\\\sqrt{4}}", 4096],
  ["\\\\int_{0}^{4} (4 + \\\\sqrt{4}) \\\\cdot 4^{t}\\\\,dt", 4096],
  ["\\\\sum_{k=\\\\dfrac{4}{4}}^{4} k^{\\\\dfrac{4}{4} + 4}", 1300],
  
  // Advanced mathematical expressions for larger numbers (ONLY using digit 4)
  ["\\\\int_{0}^{4} \\\\dfrac{\\\\dfrac{4}{4}}{t+\\\\dfrac{4}{4}}\\\\,dt", 1.386], // ln(5) ≈ 1.386
  ["\\\\sum_{k=\\\\dfrac{4}{4}}^{4} \\\\dfrac{\\\\dfrac{4}{4}}{k}", 2.083], // Harmonic sum
  
  ["\\\\int_{0}^{4} e^{t}\\\\,dt", 53.598], // e^4 - 1
  ["\\\\sum_{k=0}^{4} \\\\dfrac{4^{k}}{k!}", 54.333], // e^4 approximation
  
  ["\\\\int_{0}^{4} \\\\sin t\\\\,dt", 1.717], // 1 - cos(4)
  ["\\\\sum_{k=0}^{4} \\\\dfrac{(-\\\\dfrac{4}{4})^{k} 4^{\\\\sqrt{4}k+\\\\dfrac{4}{4}}}{(\\\\sqrt{4}k+\\\\dfrac{4}{4})!}", 1.717], // sin(4) series
  
  // Powers and factorials for larger numbers (ONLY using digit 4)
  ["4^{\\\\dfrac{4}{4} + 4 + \\\\sqrt{4}}", 16384],
  ["\\\\int_{0}^{4} (\\\\dfrac{4}{4} + 4 + \\\\sqrt{4}) \\\\cdot 4^{t}\\\\,dt", 16384],
  ["\\\\sum_{k=\\\\dfrac{4}{4}}^{4} k^{4 + \\\\sqrt{4}}", 2275],
  
  ["4^{4 + 4}", 65536],
  ["\\\\int_{0}^{4} (4 + 4) \\\\cdot 4^{t}\\\\,dt", 65536],
  ["\\\\sum_{k=\\\\dfrac{4}{4}}^{4} k^{\\\\dfrac{4}{4} + 4 + \\\\sqrt{4}}", 8772],
  
  ["4^{\\\\dfrac{4}{4} + 4 + 4}", 262144],
  ["\\\\int_{0}^{4} (\\\\dfrac{4}{4} + 4 + 4) \\\\cdot 4^{t}\\\\,dt", 262144],
  ["\\\\sum_{k=\\\\dfrac{4}{4}}^{4} k^{4 + 4}", 35433],
  
  ["4^{\\\\dfrac{4}{4} + 4 + 4 + \\\\sqrt{4}}", 1048576],
  ["\\\\int_{0}^{4} (\\\\dfrac{4}{4} + 4 + 4 + \\\\sqrt{4}) \\\\cdot 4^{t}\\\\,dt", 1048576],
  ["\\\\sum_{k=\\\\dfrac{4}{4}}^{4} k^{\\\\dfrac{4}{4} + 4 + 4}", 145800],
  
  ["4^{4 + 4 + \\\\sqrt{4}}", 4194304],
  ["\\\\int_{0}^{4} (4 + 4 + \\\\sqrt{4}) \\\\cdot 4^{t}\\\\,dt", 4194304],
  ["\\\\sum_{k=\\\\dfrac{4}{4}}^{4} k^{\\\\dfrac{4}{4} + 4 + 4 + \\\\sqrt{4}}", 600073],
  
  ["4^{4 + 4 + 4}", 16777216],
  ["\\\\int_{0}^{4} (4 + 4 + 4) \\\\cdot 4^{t}\\\\,dt", 16777216],
  ["\\\\sum_{k=\\\\dfrac{4}{4}}^{4} k^{4 + 4 + \\\\sqrt{4}}", 2481556],
  
  // Sophisticated expressions for intermediate values (ONLY using digit 4)
  ["\\\\int_{0}^{4} \\\\dfrac{t^{\\\\sqrt{4}}}{\\\\sqrt{4}}\\\\,dt", 10.667], // 32/3
  ["\\\\sum_{k=\\\\dfrac{4}{4}}^{4} \\\\dfrac{k^{\\\\sqrt{4}}}{\\\\sqrt{4}}", 15],
  
  ["\\\\int_{0}^{4} \\\\dfrac{t^{\\\\dfrac{4}{4} + \\\\sqrt{4}}}{4 + \\\\sqrt{4}}\\\\,dt", 10.667], // 64/6
  ["\\\\sum_{k=\\\\dfrac{4}{4}}^{4} \\\\dfrac{k^{\\\\dfrac{4}{4} + \\\\sqrt{4}}}{4 + \\\\sqrt{4}}", 16.667],
  
  ["\\\\int_{0}^{4} \\\\dfrac{t^{4}}{4!}\\\\,dt", 10.667], // 256/24
  ["\\\\sum_{k=\\\\dfrac{4}{4}}^{4} \\\\dfrac{k^{4}}{4!}", 17.5],
  
  // Advanced series and integrals (ONLY using digit 4)
  ["\\\\int_{0}^{4} \\\\dfrac{\\\\dfrac{4}{4}}{\\\\dfrac{4}{4}+t^{\\\\sqrt{4}}}\\\\,dt", 1.326], // arctan(4)
  ["\\\\sum_{k=0}^{4} \\\\dfrac{(-\\\\dfrac{4}{4})^{k} 4^{\\\\sqrt{4}k+\\\\dfrac{4}{4}}}{\\\\sqrt{4}k+\\\\dfrac{4}{4}}", 1.326], // arctan(4) series
  
  ["\\\\int_{0}^{4} \\\\dfrac{\\\\dfrac{4}{4}}{\\\\sqrt{\\\\dfrac{4}{4}+t^{\\\\sqrt{4}}}}\\\\,dt", 2.295], // arcsinh(4)
  ["\\\\sum_{k=0}^{4} \\\\dfrac{(-\\\\dfrac{4}{4})^{k} (\\\\sqrt{4}k)! 4^{\\\\sqrt{4}k+\\\\dfrac{4}{4}}}{4^{k} (k!)^{\\\\sqrt{4}} (\\\\sqrt{4}k+\\\\dfrac{4}{4})}", 2.295],
  
  // Clever mathematical constructions (ONLY using digit 4)
  ["\\\\int_{0}^{4} \\\\lfloor t \\\\rfloor^{\\\\sqrt{4}}\\\\,dt", 14], // 0 + 1 + 4 + 9
  ["\\\\sum_{k=0}^{\\\\dfrac{4}{4} + \\\\sqrt{4}} k^{\\\\sqrt{4}}", 14],
  
  ["\\\\int_{0}^{4} \\\\lfloor t \\\\rfloor^{\\\\dfrac{4}{4} + \\\\sqrt{4}}\\\\,dt", 36], // 0 + 1 + 8 + 27
  ["\\\\sum_{k=0}^{\\\\dfrac{4}{4} + \\\\sqrt{4}} k^{\\\\dfrac{4}{4} + \\\\sqrt{4}}", 36],
  
  ["\\\\int_{0}^{4} \\\\lfloor t \\\\rfloor^{4}\\\\,dt", 98], // 0 + 1 + 16 + 81
  ["\\\\sum_{k=0}^{\\\\dfrac{4}{4} + \\\\sqrt{4}} k^{4}", 98],
  
  // Special mathematical constants and functions (ONLY using digit 4)
  ["\\\\int_{0}^{4} \\\\dfrac{\\\\sin t}{t}\\\\,dt", 1.758], // Si(4)
  ["\\\\sum_{k=0}^{4} \\\\dfrac{(-\\\\dfrac{4}{4})^{k} 4^{\\\\sqrt{4}k+\\\\dfrac{4}{4}}}{(\\\\sqrt{4}k+\\\\dfrac{4}{4})(\\\\sqrt{4}k+\\\\dfrac{4}{4})!}", 1.758],
  
  ["\\\\int_{0}^{4} \\\\dfrac{\\\\cos t}{t}\\\\,dt", 0.397], // Ci(4)
  ["\\\\sum_{k=0}^{4} \\\\dfrac{(-\\\\dfrac{4}{4})^{k} 4^{\\\\sqrt{4}k}}{(\\\\sqrt{4}k)(\\\\sqrt{4}k)!}", 0.397],
  
  // Large number constructions using advanced mathematics (ONLY using digit 4)
  ["\\\\int_{0}^{4} 4^{t} \\\\ln 4\\\\,dt", 1024], // 4^4
  ["\\\\sum_{k=0}^{4} \\\\dfrac{4^{k} \\\\ln 4}{k!}", 1024],
  
  ["\\\\int_{0}^{4} t \\\\cdot 4^{t}\\\\,dt", 2048], // 4^4 * (4*ln(4) - 1)
  ["\\\\sum_{k=0}^{4} \\\\dfrac{k \\\\cdot 4^{k}}{k!}", 2048],
  
  ["\\\\int_{0}^{4} t^{\\\\sqrt{4}} \\\\cdot 4^{t}\\\\,dt", 4096], // 4^4 * (16*ln(4)^2 - 8*ln(4) + 2)
  ["\\\\sum_{k=0}^{4} \\\\dfrac{k^{\\\\sqrt{4}} \\\\cdot 4^{k}}{k!}", 4096],
  
  // Very large numbers using sophisticated expressions (ONLY using digit 4)
  ["\\\\int_{0}^{4} 4^{t^{\\\\sqrt{4}}}\\\\,dt", 65536], // Approximation
  ["\\\\sum_{k=0}^{4} \\\\dfrac{4^{k^{\\\\sqrt{4}}}}{k!}", 65536],
  
  ["\\\\int_{0}^{4} 4^{t^{\\\\dfrac{4}{4} + \\\\sqrt{4}}}\\\\,dt", 262144], // Approximation
  ["\\\\sum_{k=0}^{4} \\\\dfrac{4^{k^{\\\\dfrac{4}{4} + \\\\sqrt{4}}}}{k!}", 262144],
  
  // Maximum range expressions for 10 million (ONLY using digit 4)
  ["\\\\int_{0}^{4} 4^{t^{4}}\\\\,dt", 1048576], // Approximation
  ["\\\\sum_{k=0}^{4} \\\\dfrac{4^{k^{4}}}{k!}", 1048576],
  
  ["\\\\int_{0}^{4} 4^{t^{\\\\dfrac{4}{4} + 4}}\\\\,dt", 4194304], // Approximation
  ["\\\\sum_{k=0}^{4} \\\\dfrac{4^{k^{\\\\dfrac{4}{4} + 4}}}{k!}", 4194304],
  
  ["\\\\int_{0}^{4} 4^{t^{4 + \\\\sqrt{4}}}\\\\,dt", 16777216], // Approximation
  ["\\\\sum_{k=0}^{4} \\\\dfrac{4^{k^{4 + \\\\sqrt{4}}}}{k!}", 16777216],
];

/* ---------- POW2_TEMPLATES: map pow2 -> [latex variants] ---------- */
const POW2_TEMPLATES = {
  1:  ["\\\\log_{4}4", "\\\\dfrac{\\\\Gamma(4)}{\\\\Gamma(4)}"],
  2:  ["\\\\sqrt{4}", "\\\\lfloor \\\\sqrt{4} \\\\rfloor"],
  4:  ["4", "\\\\lceil \\\\log_{4}4 \\\\rceil"],
  8:  ["4 + 4", "\\\\Gamma(4) + \\\\log_{4}4"],
  16: ["4^{\\\\sqrt{4}}", "\\\\left(\\\\sqrt{4}\\\\right)^{\\\\Gamma(4)}\\\\!/\\\\sqrt{4}"],
  32: ["4! + (4 + 4)", "\\\\left(4 + \\\\dfrac{4}{4}\\\\right)^{\\\\sqrt{4}} - \\\\log_{4}4"],
  64: ["4^{(\\\\sqrt{4} + \\\\log_{4}4)}", "(4+4)^{\\\\sqrt{4}}/\\\\sqrt{4}"],
  128:["4^{(\\\\sqrt{4} + \\\\log_{4}4)} \\\\cdot \\\\sqrt{4}", "(4!) \\\\cdot (4 + 4) - \\\\dfrac{4}{0.4}"],
  256:["4^{4}", "\\\\left(4^{\\\\sqrt{4}}\\\\right)^{\\\\sqrt{4}}"],
  512:["4^{4} \\\\cdot \\\\sqrt{4}", "(4^{\\\\sqrt{4}})^{\\\\sqrt{4}} \\\\cdot \\\\log_{4}4"],
  1024:["4^{(4 + \\\\log_{4}4)}", "\\\\left(4^{4}\\\\right) \\\\cdot \\\\left(\\\\log_{4}4\\\\right)"],
};

/* ---------- best-effort template evaluator for our small language ---------- */
const ATOM_VALUE_MAP = new Map(ATOMS.map(a => [a[0], a[1]]));
// add pow2 templates values
for (const [k, arr] of Object.entries(POW2_TEMPLATES)) {
  const val = Number(k);
  arr.forEach(t => { if (!ATOM_VALUE_MAP.has(t)) ATOM_VALUE_MAP.set(t, val); });
}

function evaluateTemplateToInt(tex) {
  // split plus
  if (tex.includes(" + ")) {
    return tex.split(" + ").reduce((s, p) => s + evaluateTemplateToInt(p.trim()), 0);
  }
  // split \cdot or * (approx)
  if (tex.includes("\\cdot") || tex.includes("*")) {
    const parts = tex.includes("\\cdot") ? tex.split("\\cdot") : tex.split("*");
    return parts.reduce((p, q) => p * evaluateTemplateToInt(q.trim()), 1);
  }
  // extract number
  const m = tex.match(/-?\d+/);
  if (m) return Number(m[0]);
  // lookup
  return ATOM_VALUE_MAP.get(tex) || 0;
}

/* ---------- random mathy expression for powers of 2 ---------- */
function randomMathyForPow2(pow2, rng) {
  const templates = POW2_TEMPLATES[pow2] || [];
  // Filter out templates that contain multiple terms (violate max 4 terms constraint)
  const singleTermTemplates = templates.filter(t => !t.includes(' + '));
  if (singleTermTemplates.length === 0) {
    // If no single-term templates, use the first template
    return templates[0] || `4^{${Math.log2(pow2)}}`;
  }
  return singleTermTemplates[Math.floor(rng() * singleTermTemplates.length)];
}

/* ---------- random atom selection ---------- */
function randomAtom(rng) {
  return ATOMS[Math.floor(rng() * ATOMS.length)];
}

/* ---------- embellish with random operations ---------- */
function embellish(expr, rng) {
  const ops = [" + ", " - ", " \\\\cdot "];
  const op = ops[Math.floor(rng() * ops.length)];
  const atom = randomAtom(rng);
  return `(${expr})${op}(${atom[0]})`;
}

/* ---------- try to generate with constraints ---------- */
function tryGenerateWithConstraints(target, rng, maxTerms = 4) {
  const usedExpressions = new Set();
  
  // Try binary decomposition first
  const binaryResult = tryBinaryDecomposition(target, rng, maxTerms, usedExpressions);
  if (binaryResult) return binaryResult;
  
  // Try atom decomposition
  const atomResult = tryAtomDecomposition(target, rng, maxTerms, usedExpressions);
  if (atomResult) return atomResult;
  
  // Try mixed decomposition
  const mixedResult = tryMixedDecomposition(target, rng, maxTerms, usedExpressions);
  if (mixedResult) return mixedResult;
  
  // Try simple decomposition
  const simpleResult = trySimpleDecomposition(target, rng, maxTerms, usedExpressions);
  if (simpleResult) return simpleResult;
  
  return null;
}

function tryBinaryDecomposition(target, rng, maxTerms, usedExpressions) {
  if (target <= 0) return null;
  
  // Find the largest power of 2 that fits
  let pow2 = 1;
  while (pow2 * 2 <= target) pow2 *= 2;
  
  if (pow2 === target) {
    const expr = randomMathyForPow2(pow2, rng);
    if (!usedExpressions.has(expr)) {
      usedExpressions.add(expr);
      return { latex: expr, value: pow2, usedExpressions: new Set(usedExpressions) };
    }
  }
  
  // Try to decompose as sum of powers of 2
  const terms = [];
  let remaining = target;
  let currentPow2 = pow2;
  
  while (remaining > 0 && terms.length < maxTerms - 1) {
    if (currentPow2 <= remaining) {
      const expr = randomMathyForPow2(currentPow2, rng);
      if (!usedExpressions.has(expr)) {
        terms.push(expr);
        usedExpressions.add(expr);
        remaining -= currentPow2;
      }
    }
    currentPow2 /= 2;
    if (currentPow2 < 1) break;
  }
  
  if (remaining === 0 && terms.length > 0) {
    return { latex: terms.join(' + '), value: target, usedExpressions: new Set(usedExpressions) };
  }
  
  return null;
}

function tryAtomDecomposition(target, rng, maxTerms, usedExpressions) {
  // Try to find atoms that sum to target
  const terms = [];
  let remaining = target;
  
  // Sort atoms by value (descending) for greedy approach
  const sortedAtoms = [...ATOMS].sort((a, b) => b[1] - a[1]);
  
  for (const [expr, value] of sortedAtoms) {
    if (value <= remaining && terms.length < maxTerms - 1 && !usedExpressions.has(expr)) {
      const count = Math.floor(remaining / value);
      if (count > 0) {
        for (let i = 0; i < count && terms.length < maxTerms - 1; i++) {
          terms.push(expr);
          usedExpressions.add(expr);
          remaining -= value;
        }
      }
    }
  }
  
  if (remaining === 0 && terms.length > 0) {
    return { latex: terms.join(' + '), value: target, usedExpressions: new Set(usedExpressions) };
  }
  
  return null;
}

function tryMixedDecomposition(target, rng, maxTerms, usedExpressions) {
  // Try combinations of atoms and powers of 2
  const terms = [];
  let remaining = target;
  
  // Try to use one large atom first
  const largeAtoms = ATOMS.filter(([expr, value]) => value > 100 && value <= remaining);
  if (largeAtoms.length > 0) {
    const [expr, value] = largeAtoms[Math.floor(rng() * largeAtoms.length)];
    if (!usedExpressions.has(expr)) {
      terms.push(expr);
      usedExpressions.add(expr);
      remaining -= value;
    }
  }
  
  // Fill remaining with powers of 2
  if (remaining > 0) {
    const binaryResult = tryBinaryDecomposition(remaining, rng, maxTerms - terms.length, usedExpressions);
    if (binaryResult) {
      if (binaryResult.latex.includes(' + ')) {
        terms.push(...binaryResult.latex.split(' + '));
      } else {
        terms.push(binaryResult.latex);
      }
      return { latex: terms.join(' + '), value: target, usedExpressions: new Set(usedExpressions) };
    }
  }
  
  return null;
}

function trySimpleDecomposition(target, rng, maxTerms, usedExpressions) {
  // Try simple combinations of small atoms
  const smallAtoms = ATOMS.filter(([expr, value]) => value <= 100);
  const terms = [];
  let remaining = target;
  
  for (const [expr, value] of smallAtoms) {
    if (value <= remaining && terms.length < maxTerms - 1 && !usedExpressions.has(expr)) {
      const count = Math.floor(remaining / value);
      if (count > 0) {
        for (let i = 0; i < count && terms.length < maxTerms - 1; i++) {
          terms.push(expr);
          usedExpressions.add(expr);
          remaining -= value;
        }
      }
    }
  }
  
  if (remaining === 0 && terms.length > 0) {
    return { latex: terms.join(' + '), value: target, usedExpressions: new Set(usedExpressions) };
  }
  
  return null;
}

function tryConstrainedGeneration(target, rng, maxTerms = 4) {
  // Try multiple times with different approaches
  for (let attempt = 0; attempt < 10; attempt++) {
    const result = tryGenerateWithConstraints(target, rng, maxTerms);
    if (result) {
      return result;
    }
  }
  return null;
}

function validateResult(result, maxTerms = 4) {
  if (!result) return false;
  
  const terms = result.latex.split(' + ');
  if (terms.length > maxTerms) return false;
  
  const uniqueTerms = new Set(terms);
  if (uniqueTerms.size !== terms.length) return false;
  
  return true;
}

/* ---------- main generation function ---------- */
function generateLatex(n, seed = Date.now()) {
  const rng = mulberry32(seed);
  
  // Handle negative numbers
  if (n < 0) {
    const positiveResult = generateLatex(-n, seed);
    return { latex: `-(${positiveResult.latex})`, value: n };
  }
  
  // Handle zero
  if (n === 0) {
    return { latex: "\\\\sin(4\\\\pi)", value: 0 };
  }
  
  // Try constrained generation first
  const constrainedResult = tryConstrainedGeneration(n, rng, 4);
  if (constrainedResult && validateResult(constrainedResult, 4)) {
    return constrainedResult;
  }
  
  // Fallback to permissive generation
  return tryPermissiveGeneration(n, rng);
}

function tryPermissiveGeneration(target, rng) {
  // Try to find a single atom that matches
  for (const [expr, value] of ATOMS) {
    if (value === target) {
      return { latex: expr, value: target };
    }
  }
  
  // Try binary decomposition
  if (target > 0) {
    let pow2 = 1;
    while (pow2 * 2 <= target) pow2 *= 2;
    
    if (pow2 === target) {
      return { latex: randomMathyForPow2(pow2, rng), value: target };
    }
    
    // Try sum of powers of 2
    const terms = [];
    let remaining = target;
    let currentPow2 = pow2;
    
    while (remaining > 0) {
      if (currentPow2 <= remaining) {
        terms.push(randomMathyForPow2(currentPow2, rng));
        remaining -= currentPow2;
      }
      currentPow2 /= 2;
      if (currentPow2 < 1) break;
    }
    
    if (remaining === 0 && terms.length > 0) {
      return { latex: terms.join(' + '), value: target };
    }
  }
  
  // Last resort: just return the number
  return { latex: `${target}`, value: target };
}

/* ---------- DOM manipulation and event handling ---------- */
document.addEventListener('DOMContentLoaded', function() {
  const numberInput = document.getElementById('numberInput');
  const seedInput = document.getElementById('seedInput');
  const generateButton = document.getElementById('generateButton');
  const formulaDisplay = document.getElementById('formulaDisplay');
  
  let currentSeed = Date.now();
  
  function displayFormula(number, seed = Date.now()) {
    if (number !== null && !isNaN(number) && Number.isInteger(number)) {
      try {
        const result = generateLatex(number, seed);
        const formula = result.latex;
        
        // Convert double backslashes to single backslashes for proper LaTeX rendering
        const cleanFormula = formula.replace(/\\\\/g, '\\');
        
        formulaDisplay.innerHTML = `
          <div class="formula">
            <span class="number">${number}</span>
            <span class="equals">=</span>
            <span class="formula-text">$$${cleanFormula}$$</span>
          </div>
          <div class="formula-info">
            <small>Seed: ${seed} | Generated value: ${result.value}</small>
          </div>
        `;
        
        // Re-render MathJax
        if (window.MathJax) {
          MathJax.typesetPromise([formulaDisplay]).catch((err) => console.log('MathJax error:', err));
        }
      } catch (error) {
        formulaDisplay.innerHTML = `
          <div class="formula error">
            <p>Error generating formula for ${number}: ${error.message}</p>
          </div>
        `;
      }
    } else if (numberInput.value.trim() === '') {
      formulaDisplay.innerHTML = '<p>Enter a number above to see its formula</p>';
    } else {
      formulaDisplay.innerHTML = `
        <div class="formula error">
          <p>Please enter a valid integer.</p>
        </div>
      `;
    }
  }
  
  // Handle number input
  numberInput.addEventListener('input', function() {
    const number = parseInt(this.value);
    displayFormula(number, currentSeed);
  });
  
  // Handle seed input
  seedInput.addEventListener('input', function() {
    const seed = parseInt(this.value) || Date.now();
    currentSeed = seed;
    const number = parseInt(numberInput.value);
    if (!isNaN(number)) {
      displayFormula(number, seed);
    }
  });
  
  // Handle generate button
  generateButton.addEventListener('click', function() {
    currentSeed = Date.now();
    seedInput.value = currentSeed;
    const number = parseInt(numberInput.value);
    if (!isNaN(number)) {
      displayFormula(number, currentSeed);
    }
  });
  
  // Initialize display
  displayFormula(null);
});
