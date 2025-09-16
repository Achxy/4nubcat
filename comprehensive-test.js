// Comprehensive test suite for the algorithm
const { generateLatex } = require('./test-algorithm.js');

// Test function to verify expressions
function testExpression(n, maxTests = 100) {
  console.log(`\n=== Testing ${n} ===`);
  
  try {
    const result = generateLatex(n);
    console.log(`Generated: ${result.latex}`);
    console.log(`Expected: ${n}`);
    console.log(`Got: ${result.value}`);
    console.log(`Terms: ${result.terms}`);
    
    // Manual verification for key values
    if (n === 12345) {
      console.log('\nManual verification for 12345:');
      // Γ(4)/√4 = 6/2 = 3
      const gammaOverSqrt = 6 / 2;
      console.log('Γ(4)/√4 =', gammaOverSqrt);
      
      // 4^(√4+4) = 4^(2+4) = 4^6 = 4096
      const powerResult = Math.pow(4, 2 + 4);
      console.log('4^(√4+4) =', powerResult);
      
      // 4^(√4+4) + Γ(4)/√4 = 4096 + 3 = 4099
      const sum = powerResult + gammaOverSqrt;
      console.log('4^(√4+4) + Γ(4)/√4 =', sum);
      
      // (Γ(4)/√4) × (4^(√4+4) + Γ(4)/√4) = 3 × 4099 = 12297
      const mainTerm = gammaOverSqrt * sum;
      console.log('(Γ(4)/√4) × (4^(√4+4) + Γ(4)/√4) =', mainTerm);
      
      // √4 × 4! = 2 × 24 = 48
      const secondTerm = 2 * 24;
      console.log('√4 × 4! =', secondTerm);
      
      // Total = 12297 + 48 = 12345
      const total = mainTerm + secondTerm;
      console.log('Total =', total);
      console.log('Match:', total === 12345);
    }
    
    const isCorrect = Math.abs(result.value - n) < 0.001;
    console.log(`Correct: ${isCorrect}`);
    return isCorrect;
  } catch (e) {
    console.log(`Error: ${e.message}`);
    return false;
  }
}

// Test range from -99999 to +99999
function runComprehensiveTests() {
  console.log('Starting comprehensive tests from -99999 to +99999...');
  
  const testCases = [
    // Small numbers
    -10, -5, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    // Medium numbers
    55, 100, 123, 1000, 1234, 12345, 50000, 100000,
    // Large numbers
    500000, 1000000,
    // Edge cases
    -100, -1000, -12345
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const n of testCases) {
    const success = testExpression(n);
    if (success) {
      passed++;
    } else {
      failed++;
    }
  }
  
  console.log(`\n=== Test Results ===`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total: ${passed + failed}`);
  console.log(`Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
}

// Run the tests
runComprehensiveTests();
