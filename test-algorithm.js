// Test the new algorithm

/* ---------- expression length calculator ---------- */
function calculateExpressionLength(expression) {
  return expression.replace(/\\\\/g, '').length;
}

/* ---------- basic mathematical operations using only 4 ---------- */
const OPERATIONS = {
  // Basic arithmetic
  add: (a, b) => ({ latex: `(${a.latex}) + (${b.latex})`, value: a.value + b.value }),
  subtract: (a, b) => ({ latex: `(${a.latex}) - (${b.latex})`, value: a.value - b.value }),
  multiply: (a, b) => ({ latex: `(${a.latex}) \\\\cdot (${b.latex})`, value: a.value * b.value }),
  divide: (a, b) => ({ latex: `\\\\dfrac{${a.latex}}{${b.latex}}`, value: a.value / b.value }),
  power: (a, b) => ({ latex: `(${a.latex})^{${b.latex}}`, value: Math.pow(a.value, b.value) }),
  
  // Mathematical functions
  factorial: (a) => ({ latex: `(${a.latex})!`, value: factorial(a.value) }),
  sqrt: (a) => ({ latex: `\\\\sqrt{${a.latex}}`, value: Math.sqrt(a.value) }),
  ln: (a) => ({ latex: `\\\\ln(${a.latex})`, value: Math.log(a.value) }),
  sin: (a) => ({ latex: `\\\\sin(${a.latex})`, value: Math.sin(a.value) }),
  cos: (a) => ({ latex: `\\\\cos(${a.latex})`, value: Math.cos(a.value) }),
  tan: (a) => ({ latex: `\\\\tan(${a.latex})`, value: Math.tan(a.value) }),
  floor: (a) => ({ latex: `\\\\lfloor ${a.latex} \\\\rfloor`, value: Math.floor(a.value) }),
  ceil: (a) => ({ latex: `\\\\lceil ${a.latex} \\\\rceil`, value: Math.ceil(a.value) }),
  
  // Special functions
  gamma: (a) => ({ latex: `\\\\Gamma(${a.latex})`, value: gamma(a.value) }),
  log4: (a) => ({ latex: `\\\\log_{4}(${a.latex})`, value: Math.log(a.value) / Math.log(4) }),
};

/* ---------- basic values using only 4 ---------- */
const BASIC_VALUES = {
  0: { latex: "\\\\sin(4\\\\pi)", value: 0 },
  1: { latex: "\\\\dfrac{4}{4}", value: 1 },
  2: { latex: "\\\\sqrt{4}", value: 2 },
  3: { latex: "\\\\dfrac{\\\\Gamma(4)}{\\\\sqrt{4}}", value: 3 },
  4: { latex: "4", value: 4 },
  5: { latex: "\\\\lfloor 4 + \\\\ln 4 \\\\rfloor", value: 5 },
  6: { latex: "\\\\Gamma(4)", value: 6 },
  7: { latex: "4 + 4 - \\\\dfrac{4}{4}", value: 7 },
  8: { latex: "4 + 4", value: 8 },
  9: { latex: "4 + 4 + \\\\dfrac{4}{4}", value: 9 },
  10: { latex: "4 + 4 + \\\\sqrt{4}", value: 10 },
  11: { latex: "4 + 4 + \\\\dfrac{4}{4} + \\\\sqrt{4}", value: 11 },
  12: { latex: "4 + 4 + 4", value: 12 },
  13: { latex: "4 + 4 + 4 + \\\\dfrac{4}{4}", value: 13 },
  14: { latex: "4 + 4 + 4 + \\\\sqrt{4}", value: 14 },
  15: { latex: "4 + 4 + 4 + \\\\dfrac{4}{4} + \\\\sqrt{4}", value: 15 },
  16: { latex: "4^{\\\\sqrt{4}}", value: 16 },
  24: { latex: "4!", value: 24 },
  100: { latex: "4! \\\\cdot 4 + 4", value: 100 },
  256: { latex: "4^{4}", value: 256 },
};

/* ---------- helper functions ---------- */
function factorial(n) {
  if (n < 0 || !Number.isInteger(n)) return NaN;
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

function gamma(n) {
  if (n === 1) return 1;
  if (n === 2) return 1;
  if (n === 3) return 2;
  if (n === 4) return 6;
  if (n === 5) return 24;
  return factorial(n - 1);
}

/* ---------- generate expression using only 4s ---------- */
function generateOnly4Expression(target) {
  // Try to express as sum of 4s
  if (target % 4 === 0) {
    const count = target / 4;
    if (count <= 10) { // Reasonable limit
      const terms = Array(count).fill("4");
      return { latex: terms.join(" + "), value: target };
    }
  }
  
  // Try to express as sum of 4s and other basic values
  const terms = [];
  let remaining = target;
  
  // Use largest available basic values first
  const sortedValues = Object.entries(BASIC_VALUES)
    .sort((a, b) => b[1] - a[1]);
  
  for (const [value, expr] of sortedValues) {
    if (expr.value <= remaining) {
      const count = Math.floor(remaining / expr.value);
      for (let i = 0; i < count && i < 10; i++) { // Limit to prevent infinite loops
        terms.push(expr.latex);
        remaining -= expr.value;
      }
    }
  }
  
  if (remaining === 0 && terms.length > 0) {
    return { latex: terms.join(" + "), value: target };
  }
  
  // Fallback: use sum of 4s
  const fours = Math.floor(target / 4);
  const remainder = target % 4;
  const terms2 = [];
  
  for (let i = 0; i < fours; i++) {
    terms2.push("4");
  }
  
  if (remainder > 0) {
    if (BASIC_VALUES[remainder]) {
      terms2.push(BASIC_VALUES[remainder].latex);
    } else {
      // This shouldn't happen, but just in case
      terms2.push("4");
    }
  }
  
  return { latex: terms2.join(" + "), value: target };
}

/* ---------- recursive expression generator ---------- */
function generateExpression(target, maxDepth = 3, currentDepth = 0) {
  // Base case: exact match with basic values
  if (BASIC_VALUES[target]) {
    return BASIC_VALUES[target];
  }
  
  // Base case: maximum depth reached - must use only 4s
  if (currentDepth >= maxDepth) {
    // Generate expression using only 4s
    return generateOnly4Expression(target);
  }
  
  let bestExpression = null;
  let shortestLength = Infinity;
  
  // Try all possible operations
  for (const [opName, opFunc] of Object.entries(OPERATIONS)) {
    if (opName === 'factorial' || opName === 'sqrt' || opName === 'ln' || 
        opName === 'sin' || opName === 'cos' || opName === 'tan' || 
        opName === 'floor' || opName === 'ceil' || opName === 'gamma' || opName === 'log4') {
      // Unary operations
      for (const [value, expr] of Object.entries(BASIC_VALUES)) {
        if (expr.value <= target && expr.value > 0) {
          try {
            const result = opFunc(expr);
            if (Math.abs(result.value - target) < 0.001) {
              const length = calculateExpressionLength(result.latex);
              if (length < shortestLength) {
                shortestLength = length;
                bestExpression = result;
              }
            }
          } catch (e) {
            // Skip invalid operations
          }
        }
      }
    } else {
      // Binary operations
      for (const [value1, expr1] of Object.entries(BASIC_VALUES)) {
        for (const [value2, expr2] of Object.entries(BASIC_VALUES)) {
          if (expr1.value > 0 && expr2.value > 0) {
            try {
              const result = opFunc(expr1, expr2);
              if (Math.abs(result.value - target) < 0.001) {
                const length = calculateExpressionLength(result.latex);
                if (length < shortestLength) {
                  shortestLength = length;
                  bestExpression = result;
                }
              }
            } catch (e) {
              // Skip invalid operations
            }
          }
        }
      }
    }
  }
  
  // Try recursive decomposition
  if (!bestExpression) {
    // Try addition decomposition
    for (let i = 1; i <= target / 2; i++) {
      const expr1 = generateExpression(i, maxDepth, currentDepth + 1);
      const expr2 = generateExpression(target - i, maxDepth, currentDepth + 1);
      if (expr1 && expr2) {
        const result = OPERATIONS.add(expr1, expr2);
        const length = calculateExpressionLength(result.latex);
        if (length < shortestLength) {
          shortestLength = length;
          bestExpression = result;
        }
      }
    }
    
    // Try multiplication decomposition
    for (let i = 2; i <= Math.sqrt(target); i++) {
      if (target % i === 0) {
        const expr1 = generateExpression(i, maxDepth, currentDepth + 1);
        const expr2 = generateExpression(target / i, maxDepth, currentDepth + 1);
        if (expr1 && expr2) {
          const result = OPERATIONS.multiply(expr1, expr2);
          const length = calculateExpressionLength(result.latex);
          if (length < shortestLength) {
            shortestLength = length;
            bestExpression = result;
          }
        }
      }
    }
  }
  
  return bestExpression || generateOnly4Expression(target);
}

/* ---------- main generation function ---------- */
function generateLatex(n, maxTerms = 4) {
  // Handle negative numbers
  if (n < 0) {
    const positiveResult = generateLatex(-n, maxTerms);
    return { latex: `-(${positiveResult.latex})`, value: n, terms: positiveResult.terms };
  }
  
  // Handle zero
  if (n === 0) {
    return { latex: "\\\\sin(4\\\\pi)", value: 0, terms: 1 };
  }
  
  // Generate expression
  const result = generateExpression(n, 3);
  const termCount = result.latex.split(' + ').length;
  
  return { 
    latex: result.latex, 
    value: result.value, 
    terms: termCount 
  };
}

// Export for testing
module.exports = { generateLatex };

// Test the algorithm
console.log('Testing 55:');
const result = generateLatex(55);
console.log('Result:', result);
console.log('LaTeX:', result.latex);
console.log('Value:', result.value);
console.log('Terms:', result.terms);
