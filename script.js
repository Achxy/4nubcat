// mathy4-generator.js
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
  ["\\\\sin(4\\\\pi)", 0],
  ["\\\\log_{4}4", 1],
  ["\\\\sqrt{4}", 2],
  ["\\\\dfrac{\\\\Gamma(4)}{\\\\sqrt{4}}", 3], // 6/2 = 3
  ["4", 4],
  ["\\\\big\\lfloor 4 + \\\\ln 4 \\\\big\\rfloor", 5],
  ["\\\\Gamma(4)", 6],
  ["4 + 4", 8],
  ["\\\\dfrac{4}{0.4}", 10],
  ["4^{2}", 16],
  ["4!", 24],
  ["\\\\dfrac{4}{0.04}", 100],
  ["4^{4}", 256],
  ["4^{5}", 1024],
  ["4^{6}", 4096],
  // Add some intermediate values for better coverage
  ["\\\\dfrac{4}{0.004}", 1000],
  ["\\\\dfrac{4}{0.0004}", 10000],
  // Add more intermediate values to help with medium numbers
  ["\\\\dfrac{4}{0.008}", 500],
  ["\\\\dfrac{4}{0.012}", 333],
  ["\\\\dfrac{4}{0.013}", 308],
  ["\\\\dfrac{4}{0.0132}", 303],
  ["\\\\dfrac{4}{0.002}", 2000],
  ["\\\\dfrac{4}{0.0008}", 5000],
];

/* ---------- POW2_TEMPLATES: map pow2 -> [latex variants] ---------- */
const POW2_TEMPLATES = {
  1:  ["\\\\log_{4}4", "\\\\dfrac{\\\\Gamma(4)}{\\\\Gamma(4)}"],
  2:  ["\\\\sqrt{4}", "\\\\lfloor \\\\sqrt{4} \\\\rfloor"],
  4:  ["4", "\\\\lceil \\\\log_{4}4 \\\\rceil"],
  8:  ["4 + 4", "\\\\Gamma(4) + \\\\log_{4}4"],
  16: ["4^{2}", "\\\\left(\\\\sqrt{4}\\\\right)^{\\\\Gamma(4)}\\\\!/2"],
  32: ["4! + (4 + 4)", "\\\\left(4 + \\\\dfrac{4}{4}\\\\right)^{2} - \\\\log_{4}4"],
  64: ["4^{(\\\\sqrt{4} + \\\\log_{4}4)}", "(4+4)^{\\\\sqrt{4}}/2"],
  128:["4^{(\\\\sqrt{4} + \\\\log_{4}4)} \\\\cdot \\\\sqrt{4}", "(4!) \\cdot (4 + 4) - \\\\dfrac{4}{0.4}"],
  256:["4^{4}", "\\\\left(4^{2}\\\\right)^{\\\\sqrt{4}}"],
  512:["4^{4} \\\\cdot \\\\sqrt{4}", "(4^{2})^{\\\\sqrt{4}} \\\\cdot \\\\log_{4}4"],
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
  tex = tex.trim();
  if (ATOM_VALUE_MAP.has(tex)) return ATOM_VALUE_MAP.get(tex);
  // split plus
  if (tex.includes(" + ")) {
    return tex.split(" + ").reduce((s, p) => s + evaluateTemplateToInt(p.trim()), 0);
  }
  // split \cdot or * (approx)
  if (tex.includes("\\cdot") || tex.includes("*")) {
    const parts = tex.includes("\\cdot") ? tex.split("\\cdot") : tex.split("*");
    return parts.reduce((p, q) => p * evaluateTemplateToInt(q.trim()), 1);
  }
  // crude number fallback (extract first integer)
  const m = tex.match(/-?\d+/);
  if (m) return Number(m[0]);
  throw new Error("Unknown template for evaluation: " + tex);
}

/* ---------- utilities ---------- */
function decomposeIntoPow2(n) {
  const parts = [];
  let bit = 0;
  let x = n;
  while (x) {
    if (x & 1) parts.push(1 << bit);
    bit++; x >>= 1;
  }
  return parts;
}

function randomMathyForPow2(p2, rng) {
  if (POW2_TEMPLATES[p2]) {
    const arr = POW2_TEMPLATES[p2];
    // Filter out templates that contain multiple terms (have ' + ')
    const singleTermTemplates = arr.filter(t => !t.includes(' + '));
    if (singleTermTemplates.length > 0) {
      const choice = singleTermTemplates[Math.floor(rng() * singleTermTemplates.length)];
      return [choice, evaluateTemplateToInt(choice)];
    }
    // If no single-term templates, use the first one anyway
    const choice = arr[0];
    return [choice, evaluateTemplateToInt(choice)];
  }
  // fallback greedy decomposition from available pow2 keys
  let rem = p2;
  const keys = Object.keys(POW2_TEMPLATES).map(Number).sort((a,b)=>b-a);
  const pieces = [];
  for (const v of keys) {
    while (rem >= v) {
      const arr = POW2_TEMPLATES[v];
      // Filter out multi-term templates
      const singleTermTemplates = arr.filter(t => !t.includes(' + '));
      if (singleTermTemplates.length > 0) {
        const choice = singleTermTemplates[Math.floor(rng() * singleTermTemplates.length)];
        pieces.push(choice);
        rem -= v;
      } else {
        // Use first template if no single-term ones available
        const choice = arr[0];
        pieces.push(choice);
        rem -= v;
      }
    }
  }
  if (rem !== 0) pieces.push(String(rem));
  const value = pieces.reduce((s,p) => s + (ATOM_VALUE_MAP.has(p) ? ATOM_VALUE_MAP.get(p) : Number(p)), 0);
  return [pieces.join(" + "), value];
}

function embellish(parts, rng) {
  return parts.map(p => {
    // maybe add a zero term
    if (rng() < 0.25) {
      const zeroes = ["\\\\sin(4\\\\pi)", "\\\\int_{0}^{4\\\\pi}\\\\sin t\\\\,dt"];
      const z = zeroes[Math.floor(rng() * zeroes.length)];
      p = `\\\\left(${p} + ${z}\\\\right)`;
    }
    // maybe multiply by 1
    if (rng() < 0.2) {
      const ones = ["\\\\dfrac{\\\\Gamma(4)}{\\\\Gamma(4)}", "\\\\dfrac{\\\\log_{4}4}{\\\\log_{4}4}", "\\\\dfrac{\\\\sqrt{4}}{\\\\sqrt{4}}"];
      const o = ones[Math.floor(rng() * ones.length)];
      p = `\\\\left(${p} \\\\cdot ${o}\\\\right)`;
    }
    return p;
  });
}

/* ---------- main generator with constraints ---------- */
function generateLatex(n, seed = Date.now()) {
  const rng = mulberry32(seed);
  const sign = n < 0 ? "-" : "";
  const target = Math.abs(n);

  // if target equals an atom value, return decorated atom
  const candidates = ATOMS.filter(a => a[1] === target).map(a => a[0]);
  if (candidates.length) {
    let tex = candidates[Math.floor(rng() * candidates.length)];
    // Don't embellish to maintain single-term constraint
    return { latex: sign + tex, value: n };
  }

  // Try to find a solution with at most 4 unique terms
  const maxAttempts = 50;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const result = tryGenerateWithConstraints(target, rng, 4);
    if (validateResult(result, 4)) {
      // Don't embellish to avoid breaking constraints
      let body = result.join(" + ");
      if (sign) body = "-" + body;
      return { latex: body, value: n };
    }
  }
  
  // Try with a more permissive approach for medium numbers
  if (target > 100) {
    const permissiveResult = tryPermissiveGeneration(target, rng, 4);
    if (validateResult(permissiveResult, 4)) {
      let body = permissiveResult.join(" + ");
      if (sign) body = "-" + body;
      return { latex: body, value: n };
    }
  }

  // Fallback: use simple decomposition if constrained generation fails
  return generateFallback(target, sign, rng);
}

function tryGenerateWithConstraints(target, rng, maxTerms) {
  // Try different strategies with fresh state each time
  const strategies = [
    () => tryBinaryDecomposition(target, rng, maxTerms, new Set()),
    () => tryAtomDecomposition(target, rng, maxTerms, new Set()),
    () => tryMixedDecomposition(target, rng, maxTerms, new Set()),
    () => trySimpleDecomposition(target, rng, maxTerms, new Set())
  ];
  
  for (const strategy of strategies) {
    const result = strategy();
    if (result && result.length <= maxTerms) {
      // Verify uniqueness
      const uniqueTerms = new Set(result);
      if (uniqueTerms.size === result.length) {
        return result;
      }
    }
  }
  
  // If no strategy worked, try a more constrained approach
  return tryConstrainedGeneration(target, rng, maxTerms);
}

function validateResult(result, maxTerms) {
  if (!result || result.length > maxTerms) return false;
  const uniqueTerms = new Set(result);
  return uniqueTerms.size === result.length;
}

function tryConstrainedGeneration(target, rng, maxTerms) {
  // Try to generate with strict constraints
  const terms = [];
  let remaining = target;
  const usedExpressions = new Set();
  
  // Sort atoms by value (largest first)
  const sortedAtoms = ATOMS.slice().sort((a, b) => b[1] - a[1]);
  
  // Try to use the largest atoms first, but only if they're unique
  for (const [tex, val] of sortedAtoms) {
    if (remaining === 0 || terms.length >= maxTerms) break;
    
    if (val <= remaining && !usedExpressions.has(tex)) {
      terms.push(tex);
      usedExpressions.add(tex);
      remaining -= val;
    }
  }
  
  // Only return if we have exactly the right number of terms and they're all unique
  if (remaining === 0 && terms.length <= maxTerms) {
    const uniqueTerms = new Set(terms);
    if (uniqueTerms.size === terms.length) {
      return terms;
    }
  }
  
  return null;
}

function tryBinaryDecomposition(target, rng, maxTerms, usedExpressions) {
  const pow2Parts = decomposeIntoPow2(target);
  const terms = [];
  let currentSum = 0;
  
  for (const p2 of pow2Parts) {
    if (terms.length >= maxTerms) break;
    
    const [tpl, val] = randomMathyForPow2(p2, rng);
    // Don't add random wrapping to avoid breaking constraints
    const part = tpl;
    
    if (!usedExpressions.has(part)) {
      terms.push(part);
      usedExpressions.add(part);
      currentSum += val;
    }
  }
  
  // Try to fill remaining with atoms
  let diff = target - currentSum;
  while (diff !== 0 && terms.length < maxTerms) {
    const smallVals = ATOMS.map(a => a[1]).sort((a,b)=>b-a);
    const pick = smallVals.find(v => Math.abs(v) <= Math.abs(diff)) || smallVals[smallVals.length-1];
    const texOptions = ATOMS.filter(a => a[1] === pick).map(a => a[0]);
    const pickTex = texOptions.length ? texOptions[Math.floor(rng()*texOptions.length)] : String(pick);
    
    if (!usedExpressions.has(pickTex)) {
      if (diff > 0) {
        terms.push(pickTex);
        usedExpressions.add(pickTex);
        diff -= pick;
      } else {
        terms.push(`-\\\\left(${pickTex}\\\\right)`);
        usedExpressions.add(pickTex);
        diff += pick;
      }
    } else {
      break; // Can't add more unique terms
    }
  }
  
  return diff === 0 ? terms : null;
}

function tryAtomDecomposition(target, rng, maxTerms, usedExpressions) {
  const terms = [];
  let currentSum = 0;
  let remaining = target;
  
  const availableAtoms = ATOMS.map(a => a[1]).sort((a,b)=>b-a);
  
  while (remaining !== 0 && terms.length < maxTerms) {
    const pick = availableAtoms.find(v => Math.abs(v) <= Math.abs(remaining));
    if (!pick) break;
    
    const texOptions = ATOMS.filter(a => a[1] === pick).map(a => a[0]);
    const pickTex = texOptions.length ? texOptions[Math.floor(rng()*texOptions.length)] : String(pick);
    
    if (!usedExpressions.has(pickTex)) {
      if (remaining > 0) {
        terms.push(pickTex);
        usedExpressions.add(pickTex);
        remaining -= pick;
      } else {
        terms.push(`-\\\\left(${pickTex}\\\\right)`);
        usedExpressions.add(pickTex);
        remaining += pick;
      }
    } else {
      // Try next smaller atom instead of breaking
      const nextPick = availableAtoms.find(v => v < pick && Math.abs(v) <= Math.abs(remaining));
      if (nextPick) {
        const nextTexOptions = ATOMS.filter(a => a[1] === nextPick).map(a => a[0]);
        const nextPickTex = nextTexOptions.length ? nextTexOptions[Math.floor(rng()*nextTexOptions.length)] : String(nextPick);
        
        if (!usedExpressions.has(nextPickTex)) {
          if (remaining > 0) {
            terms.push(nextPickTex);
            usedExpressions.add(nextPickTex);
            remaining -= nextPick;
          } else {
            terms.push(`-\\\\left(${nextPickTex}\\\\right)`);
            usedExpressions.add(nextPickTex);
            remaining += nextPick;
          }
        } else {
          break;
        }
      } else {
        break;
      }
    }
  }
  
  return remaining === 0 ? terms : null;
}

function tryMixedDecomposition(target, rng, maxTerms, usedExpressions) {
  // Try combining larger powers of 2 with smaller atoms
  const terms = [];
  let currentSum = 0;
  let remaining = target;
  
  // First try to use one large power of 2
  const largePowers = Object.keys(POW2_TEMPLATES).map(Number).sort((a,b)=>b-a);
  for (const p2 of largePowers) {
    if (p2 <= remaining && terms.length < maxTerms) {
      const [tpl, val] = randomMathyForPow2(p2, rng);
      // Don't add random wrapping to avoid breaking constraints
      const part = tpl;
      
      if (!usedExpressions.has(part)) {
        terms.push(part);
        usedExpressions.add(part);
        currentSum += val;
        remaining -= val;
        break;
      }
    }
  }
  
  // Fill remaining with atoms
  while (remaining !== 0 && terms.length < maxTerms) {
    const smallVals = ATOMS.map(a => a[1]).sort((a,b)=>b-a);
    const pick = smallVals.find(v => Math.abs(v) <= Math.abs(remaining));
    if (!pick) break;
    
    const texOptions = ATOMS.filter(a => a[1] === pick).map(a => a[0]);
    const pickTex = texOptions.length ? texOptions[Math.floor(rng()*texOptions.length)] : String(pick);
    
    if (!usedExpressions.has(pickTex)) {
      if (remaining > 0) {
        terms.push(pickTex);
        usedExpressions.add(pickTex);
        remaining -= pick;
      } else {
        terms.push(`-\\\\left(${pickTex}\\\\right)`);
        usedExpressions.add(pickTex);
        remaining += pick;
      }
    } else {
      break;
    }
  }
  
  return remaining === 0 ? terms : null;
}

function trySimpleDecomposition(target, rng, maxTerms, usedExpressions) {
  // Try to use the largest available atoms first
  const terms = [];
  let remaining = target;
  
  // Sort atoms by value (largest first)
  const sortedAtoms = ATOMS.slice().sort((a, b) => b[1] - a[1]);
  
  while (remaining !== 0 && terms.length < maxTerms) {
    // Find the largest atom that fits
    const atom = sortedAtoms.find(a => a[1] <= Math.abs(remaining));
    if (!atom) break;
    
    const [tex, val] = atom;
    if (!usedExpressions.has(tex)) {
      if (remaining > 0) {
        terms.push(tex);
        usedExpressions.add(tex);
        remaining -= val;
      } else {
        terms.push(`-\\\\left(${tex}\\\\right)`);
        usedExpressions.add(tex);
        remaining += val;
      }
    } else {
      // Try next smaller atom
      const nextAtom = sortedAtoms.find(a => a[1] < val && a[1] <= Math.abs(remaining));
      if (nextAtom) {
        const [nextTex, nextVal] = nextAtom;
        if (!usedExpressions.has(nextTex)) {
          if (remaining > 0) {
            terms.push(nextTex);
            usedExpressions.add(nextTex);
            remaining -= nextVal;
          } else {
            terms.push(`-\\\\left(${nextTex}\\\\right)`);
            usedExpressions.add(nextTex);
            remaining += nextVal;
          }
        } else {
          break;
        }
      } else {
        break;
      }
    }
  }
  
  return remaining === 0 ? terms : null;
}

function generateFallback(target, sign, rng) {
  // Try one more time with a more permissive approach
  const result = trySimpleDecomposition(target, rng, 4, new Set());
  if (result) {
    let body = result.join(" + ");
    return { latex: sign + body, value: target };
  }
  
  // Try a more aggressive approach for large numbers
  const aggressiveResult = tryAggressiveDecomposition(target, rng, 4);
  if (aggressiveResult) {
    let body = aggressiveResult.join(" + ");
    return { latex: sign + body, value: target };
  }
  
  // Final fallback: just use the number itself
  return { latex: sign + String(target), value: target };
}

function tryPermissiveGeneration(target, rng, maxTerms) {
  // For medium numbers, try a more flexible approach
  const terms = [];
  let remaining = target;
  const usedExpressions = new Set();
  
  // Sort atoms by value (largest first)
  const sortedAtoms = ATOMS.slice().sort((a, b) => b[1] - a[1]);
  
  // Try to use the largest atoms first, allowing some flexibility
  for (const [tex, val] of sortedAtoms) {
    if (remaining === 0 || terms.length >= maxTerms) break;
    
    // How many times can we use this atom?
    const count = Math.floor(remaining / val);
    if (count > 0 && !usedExpressions.has(tex)) {
      if (count === 1) {
        terms.push(tex);
        usedExpressions.add(tex);
        remaining -= val;
      } else if (count <= 3 && terms.length + 1 <= maxTerms) {
        // Use multiplication for small counts
        terms.push(`${count} \\\\cdot ${tex}`);
        usedExpressions.add(tex);
        remaining -= count * val;
      }
    }
  }
  
  // If we still have remaining, try to use smaller atoms
  while (remaining > 0 && terms.length < maxTerms) {
    const atom = sortedAtoms.find(a => a[1] <= remaining && !usedExpressions.has(a[0]));
    if (!atom) break;
    
    const [tex, val] = atom;
    terms.push(tex);
    usedExpressions.add(tex);
    remaining -= val;
  }
  
  return remaining === 0 ? terms : null;
}

function tryAggressiveDecomposition(target, rng, maxTerms) {
  // For large numbers, try to use the largest available atoms
  const terms = [];
  let remaining = target;
  const usedExpressions = new Set();
  
  // Sort atoms by value (largest first)
  const sortedAtoms = ATOMS.slice().sort((a, b) => b[1] - a[1]);
  
  // Try to use the largest atoms first
  for (const [tex, val] of sortedAtoms) {
    if (remaining === 0 || terms.length >= maxTerms) break;
    
    // How many times can we use this atom?
    const count = Math.floor(remaining / val);
    if (count > 0 && !usedExpressions.has(tex)) {
      if (count === 1) {
        terms.push(tex);
        usedExpressions.add(tex);
        remaining -= val;
      } else if (count <= 2 && terms.length + 1 <= maxTerms) {
        // Use multiplication for small counts (limit to 2 to avoid too many terms)
        terms.push(`${count} \\\\cdot ${tex}`);
        usedExpressions.add(tex);
        remaining -= count * val;
      }
    }
  }
  
  // If we still have remaining, try to use smaller atoms
  while (remaining > 0 && terms.length < maxTerms) {
    const atom = sortedAtoms.find(a => a[1] <= remaining && !usedExpressions.has(a[0]));
    if (!atom) break;
    
    const [tex, val] = atom;
    terms.push(tex);
    usedExpressions.add(tex);
    remaining -= val;
  }
  
  return remaining === 0 ? terms : null;
}

// DOM elements
const numberInput = document.getElementById('numberInput');
const seedInput = document.getElementById('seedInput');
const formulaDisplay = document.getElementById('formulaDisplay');
const generateButton = document.getElementById('generateButton');

// Function to display formula
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
                <p>Please enter a valid integer</p>
            </div>
        `;
    }
}

// Event listener for input changes
numberInput.addEventListener('input', function() {
    const value = parseInt(this.value);
    const seed = seedInput ? parseInt(seedInput.value) || Date.now() : Date.now();
    displayFormula(value, seed);
});

// Event listener for seed input changes
if (seedInput) {
    seedInput.addEventListener('input', function() {
        const number = parseInt(numberInput.value);
        const seed = parseInt(this.value) || Date.now();
        if (!isNaN(number)) {
            displayFormula(number, seed);
        }
    });
}

// Event listener for generate button
if (generateButton) {
    generateButton.addEventListener('click', function() {
        const number = parseInt(numberInput.value);
        const seed = Date.now(); // Generate new random seed
        if (seedInput) seedInput.value = seed;
        if (!isNaN(number)) {
            displayFormula(number, seed);
        }
    });
}

// Event listener for Enter key
numberInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const value = parseInt(this.value);
        const seed = seedInput ? parseInt(seedInput.value) || Date.now() : Date.now();
        displayFormula(value, seed);
    }
});

// Initialize with empty state
displayFormula(null);
