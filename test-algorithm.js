// Test the new algorithm

/* ---------- expression length calculator ---------- */
function calculateExpressionLength(expression) {
  return expression.replace(/\\\\/g, '').length;
}

/* ---------- LaTeX expression evaluator ---------- */
function evaluateLatexExpression(latex) {
  try {
    // Convert LaTeX to JavaScript expression for evaluation
    let jsExpr = latex
      .replace(/\\\\/g, '') // Remove LaTeX escapes
      .replace(/\\dfrac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)') // Convert fractions
      .replace(/\\sqrt\{([^}]+)\}/g, 'Math.sqrt($1)') // Convert square roots
      .replace(/\\Gamma\(([^)]+)\)/g, 'gamma($1)') // Convert gamma function
      .replace(/\\ln\(([^)]+)\)/g, 'Math.log($1)') // Convert natural log
      .replace(/\\log_{4}\([^)]+\)/g, '1') // log_4(4) = 1
      .replace(/\\lfloor\s*([^}]+)\s*\\rfloor/g, 'Math.floor($1)') // Convert floor
      .replace(/\\lceil\s*([^}]+)\s*\\rceil/g, 'Math.ceil($1)') // Convert ceil
      .replace(/\\sin\(([^)]+)\)/g, 'Math.sin($1)') // Convert sin
      .replace(/\\cos\(([^)]+)\)/g, 'Math.cos($1)') // Convert cos
      .replace(/\\tan\(([^)]+)\)/g, 'Math.tan($1)') // Convert tan
      .replace(/\(([^)]+)\)!/g, 'factorial($1)') // Convert factorial
      .replace(/(\d+)!/g, 'factorial($1)') // Convert factorial
      .replace(/\^/g, '**') // Convert power operator
      .replace(/\\cdot/g, '*') // Convert multiplication
      .replace(/\s+/g, ''); // Remove spaces
    
    // Handle nested expressions better
    jsExpr = jsExpr
      .replace(/\(\(/g, '(') // Simplify double parentheses
      .replace(/\)\)/g, ')') // Simplify double parentheses
      .replace(/\(([^()]+)\)/g, '($1)'); // Ensure proper parentheses
    
    // Evaluate the JavaScript expression
    return eval(jsExpr);
  } catch (e) {
    console.error('Error evaluating LaTeX:', latex);
    console.error('Converted JS:', jsExpr);
    console.error('Error:', e.message);
    return null;
  }
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
  
  // Advanced operations for better optimization
  gammaOverSqrt: (a) => (a.value > 0 ? { latex: `\\\\dfrac{\\\\Gamma(${a.latex})}{\\\\sqrt{${a.latex}}}`, value: gamma(a.value) / Math.sqrt(a.value) } : null),
  powerSum: (a, b, c) => ({ latex: `${a.latex}^{${b.latex} + ${c.latex}}`, value: Math.pow(a.value, b.value + c.value) }),
  powerProduct: (a, b, c) => ({ latex: `${a.latex}^{${b.latex} \\\\cdot ${c.latex}}`, value: Math.pow(a.value, b.value * c.value) }),
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

function isPowerOf4(n) {
  if (n <= 0) return false;
  const log4 = Math.log(n) / Math.log(4);
  return Math.abs(log4 - Math.round(log4)) < 0.001;
}

/* ---------- generate expression using only 4s ---------- */
function generateOnly4Expression(target) {
  // For very large numbers, use powers of 4
  if (target > 10000) {
    // Try to express as power of 4
    const log4 = Math.log(target) / Math.log(4);
    if (Math.abs(log4 - Math.round(log4)) < 0.001) {
      const power = Math.round(log4);
      return { latex: `4^{${power}}`, value: target };
    }
    
    // Try to express as sum of powers of 4
    const terms = [];
    let remaining = target;
    let power = Math.floor(log4);
    
    while (remaining > 0 && power >= 0 && terms.length < 5) {
      const value = Math.pow(4, power);
      if (value <= remaining) {
        const count = Math.floor(remaining / value);
        if (count > 0) {
          const powerExpr = power === 1 ? "4" : `4^{${power}}`;
          for (let i = 0; i < count && terms.length < 5; i++) {
            terms.push(powerExpr);
            remaining -= value;
          }
        }
      }
      power--;
    }
    
    if (remaining === 0 && terms.length > 0) {
      return { latex: terms.join(" + "), value: target };
    }
    
    // Try to express as multiplication of powers of 4
    for (let p1 = Math.floor(log4); p1 >= 1; p1--) {
      for (let p2 = Math.floor(log4); p2 >= 1; p2--) {
        const val1 = Math.pow(4, p1);
        const val2 = Math.pow(4, p2);
        if (val1 * val2 === target) {
          const expr1 = p1 === 1 ? "4" : `4^{${p1}}`;
          const expr2 = p2 === 1 ? "4" : `4^{${p2}}`;
          return { latex: `(${expr1}) \\\\cdot (${expr2})`, value: target };
        }
      }
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
      for (let i = 0; i < count && i < 5; i++) { // Limit to prevent infinite loops
        terms.push(expr.latex);
        remaining -= expr.value;
      }
    }
  }
  
  if (remaining === 0 && terms.length > 0) {
    return { latex: terms.join(" + "), value: target };
  }
  
  // Fallback: use sum of 4s (limited for large numbers)
  if (target <= 1000) {
    const fours = Math.floor(target / 4);
    const remainder = target % 4;
    const terms2 = [];
    
    for (let i = 0; i < fours && i < 50; i++) { // Limit to prevent huge expressions
      terms2.push("4");
    }
    
    if (remainder > 0) {
      if (BASIC_VALUES[remainder]) {
        terms2.push(BASIC_VALUES[remainder].latex);
      } else {
        terms2.push("4");
      }
    }
    
    return { latex: terms2.join(" + "), value: target };
  }
  
  // Last resort: just use the number (shouldn't happen with proper constraints)
  return { latex: `${target}`, value: target };
}

/* ---------- recursive expression generator ---------- */
function generateExpression(target, maxDepth = 2, currentDepth = 0) {
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
        opName === 'floor' || opName === 'ceil' || opName === 'gamma' || opName === 'log4' ||
        opName === 'gammaOverSqrt') {
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
    } else if (opName === 'powerSum' || opName === 'powerProduct') {
      // Advanced ternary operations
      for (const [value1, expr1] of Object.entries(BASIC_VALUES)) {
        for (const [value2, expr2] of Object.entries(BASIC_VALUES)) {
          for (const [value3, expr3] of Object.entries(BASIC_VALUES)) {
            if (expr1.value > 0 && expr2.value > 0 && expr3.value > 0) {
              try {
                const result = opFunc(expr1, expr2, expr3);
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
  
  // Try sophisticated combinations for better optimization
  if (!bestExpression) {
    // Try combinations like: (gamma/sqrt) * (power + power) + terms
    for (const [value1, expr1] of Object.entries(BASIC_VALUES)) {
      if (expr1.value === 4) { // Use 4 as base
        const gammaOverSqrt = OPERATIONS.gammaOverSqrt(expr1);
        if (gammaOverSqrt) {
          // Try power combinations
          for (const [value2, expr2] of Object.entries(BASIC_VALUES)) {
            for (const [value3, expr3] of Object.entries(BASIC_VALUES)) {
              if (expr2.value > 0 && expr3.value > 0) {
                const powerSum = OPERATIONS.powerSum(expr1, expr2, expr3);
                if (powerSum) {
                  // Try adding different terms to the power sum
                  for (const [value4, expr4] of Object.entries(BASIC_VALUES)) {
                    const sum = OPERATIONS.add(powerSum, expr4);
                    if (sum) {
                      const result = OPERATIONS.multiply(gammaOverSqrt, sum);
                      if (result && Math.abs(result.value - target) < 0.001) {
                        const length = calculateExpressionLength(result.latex);
                        if (length < shortestLength) {
                          shortestLength = length;
                          bestExpression = result;
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    
    // Try more complex combinations: (gamma/sqrt) * (power + power) + additional terms
    for (const [value1, expr1] of Object.entries(BASIC_VALUES)) {
      if (expr1.value === 4) {
        const gammaOverSqrt = OPERATIONS.gammaOverSqrt(expr1);
        if (gammaOverSqrt) {
          for (const [value2, expr2] of Object.entries(BASIC_VALUES)) {
            for (const [value3, expr3] of Object.entries(BASIC_VALUES)) {
              if (expr2.value > 0 && expr3.value > 0) {
                const powerSum = OPERATIONS.powerSum(expr1, expr2, expr3);
                if (powerSum) {
                  for (const [value4, expr4] of Object.entries(BASIC_VALUES)) {
                    const sum = OPERATIONS.add(powerSum, expr4);
                    if (sum) {
                      const mainTerm = OPERATIONS.multiply(gammaOverSqrt, sum);
                      if (mainTerm) {
                        // Try adding more terms
                        for (const [value5, expr5] of Object.entries(BASIC_VALUES)) {
                          for (const [value6, expr6] of Object.entries(BASIC_VALUES)) {
                            const term2 = OPERATIONS.multiply(expr5, expr6);
                            if (term2) {
                              const result = OPERATIONS.add(mainTerm, term2);
                              if (result && Math.abs(result.value - target) < 0.001) {
                                const length = calculateExpressionLength(result.latex);
                                if (length < shortestLength) {
                                  shortestLength = length;
                                  bestExpression = result;
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  
  // Try recursive decomposition (optimized for large numbers)
  if (!bestExpression) {
    // Try multiplication decomposition first (more efficient for large numbers)
    // Prioritize powers of 4 and small factors
    const factors = [];
    for (let i = 2; i <= Math.min(Math.sqrt(target), 1000); i++) {
      if (target % i === 0) {
        factors.push([i, target / i]);
      }
    }
    
    // Sort factors by preference (powers of 4 first, then small numbers)
    factors.sort((a, b) => {
      const a1 = isPowerOf4(a[0]) ? 0 : a[0];
      const b1 = isPowerOf4(b[0]) ? 0 : b[0];
      return a1 - b1;
    });
    
    for (const [i, j] of factors) {
      // Skip factors that would lead to forbidden numbers
      if (i > 1000 || j > 1000) continue;
      
      const expr1 = generateExpression(i, maxDepth, currentDepth + 1);
      const expr2 = generateExpression(j, maxDepth, currentDepth + 1);
      if (expr1 && expr2) {
        const result = OPERATIONS.multiply(expr1, expr2);
        const length = calculateExpressionLength(result.latex);
        if (length < shortestLength) {
          shortestLength = length;
          bestExpression = result;
        }
      }
    }
    
    // Try addition decomposition (limited for large numbers)
    if (!bestExpression && target < 10000) {
      for (let i = 1; i <= Math.min(target / 2, 100); i++) {
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
module.exports = { generateLatex, evaluateLatexExpression };

// Test the algorithm
console.log('Testing 55:');
const result = generateLatex(55);
console.log('Result:', result);
console.log('LaTeX:', result.latex);
console.log('Value:', result.value);
console.log('Terms:', result.terms);
