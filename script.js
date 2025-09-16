// Mathematical formulas using only the number 4
const formulas = {
    0: "\\sin(4\\pi)",
    1: "\\log_{4}4",
    2: "\\sqrt{4}",
    3: "\\dfrac{\\Gamma(4)}{\\sqrt{4}}",
    4: "4",
    5: "\\big\\lfloor 4 + \\ln 4 \\big\\rfloor",
    6: "\\Gamma(4)",
    7: "\\Gamma(4) + \\log_{4}4",
    8: "4 + 4",
    9: "4 + 4 + \\log_{4}4",
    10: "\\dfrac{4}{0.4}",
    11: "\\dfrac{4! + 4}{4} + 4",
    12: "\\dfrac{4!}{\\sqrt{4}}",
    13: "\\dfrac{4!}{\\sqrt{4}} + \\log_{4}4",
    14: "4! - \\dfrac{4}{0.4}",
    15: "4^{2} - \\log_{4}4",
    16: "4^{2}",
    17: "4^{2} + \\log_{4}4",
    18: "4^{2} + \\sqrt{4}",
    19: "4^{2} + \\dfrac{\\Gamma(4)}{\\sqrt{4}}",
    20: "4\\cdot\\big\\lfloor 4 + \\ln 4 \\big\\rfloor",
    21: "4! - \\dfrac{\\Gamma(4)}{\\sqrt{4}}",
    22: "4! - \\sqrt{4}",
    23: "4! - \\log_{4}4",
    24: "4!",
    25: "\\bigl(4 + \\tfrac{4}{4}\\bigr)^{2}",
    26: "\\bigl(4 + \\tfrac{4}{4}\\bigr)^{2} + \\log_{4}4",
    27: "\\Bigl(\\dfrac{\\Gamma(4)}{\\sqrt{4}}\\Bigr)^{3}",
    28: "4! + 4",
    29: "4! + 4 + \\log_{4}4",
    30: "4! + \\Gamma(4)",
    31: "\\bigl(4! + 4 + 4\\bigr) - \\log_{4}4",
    32: "4! + 4 + 4",
    33: "4! + 4 + 4 + \\log_{4}4",
    34: "4! + 4 + \\sqrt{4}",
    35: "4! + 4 + \\dfrac{\\Gamma(4)}{\\sqrt{4}}",
    36: "\\Gamma(4)^{2}",
    37: "\\Gamma(4)^{2} + \\log_{4}4",
    38: "\\Gamma(4)^{2} + \\sqrt{4}",
    39: "\\Gamma(4)^{2} + \\dfrac{\\Gamma(4)}{\\sqrt{4}}",
    40: "4\\cdot\\dfrac{4}{0.4}",
    41: "4\\cdot\\dfrac{4}{0.4} + \\log_{4}4",
    42: "\\Gamma(4)\\cdot\\bigl(\\Gamma(4)+\\log_{4}4\\bigr)",
    43: "\\Gamma(4)\\cdot\\bigl(\\Gamma(4)+\\log_{4}4\\bigr) + \\log_{4}4",
    44: "4\\cdot\\Bigl(\\dfrac{4! + 4}{4} + 4\\Bigr)",
    45: "\\bigl(4 + 4 + \\log_{4}4\\bigr)\\cdot\\big\\lfloor 4 + \\ln 4 \\big\\rfloor",
    46: "\\bigl(4 + 4 + \\log_{4}4\\bigr)\\cdot\\big\\lfloor 4 + \\ln 4 \\big\\rfloor + \\log_{4}4",
    47: "\\bigl(4 + 4 + \\log_{4}4\\bigr)\\cdot\\big\\lfloor 4 + \\ln 4 \\big\\rfloor + \\sqrt{4}",
    48: "4\\cdot\\dfrac{4!}{\\sqrt{4}}",
    49: "\\bigl(\\Gamma(4)+\\log_{4}4\\bigr)^{2}",
    50: "\\dfrac{\\dfrac{4}{0.04}}{\\sqrt{4}}",
    51: "\\dfrac{\\dfrac{4}{0.04}}{\\sqrt{4}} + \\log_{4}4",
    52: "4\\cdot\\Bigl(\\dfrac{4!}{\\sqrt{4}} + \\log_{4}4\\Bigr)",
    53: "4\\cdot\\Bigl(\\dfrac{4!}{\\sqrt{4}} + \\log_{4}4\\Bigr) + \\log_{4}4",
    54: "\\Gamma(4)\\cdot\\bigl(4 + 4 + \\log_{4}4\\bigr)",
    55: "\\Bigl(\\dfrac{4! + 4}{4} + 4\\Bigr)\\cdot\\big\\lfloor 4 + \\ln 4 \\big\\rfloor",
    56: "4\\cdot\\bigl(4! - \\dfrac{4}{0.4}\\bigr)",
    57: "4\\cdot\\bigl(4! - \\dfrac{4}{0.4}\\bigr) + \\log_{4}4",
    58: "4\\cdot\\bigl(4! - \\dfrac{4}{0.4}\\bigr) + \\sqrt{4}",
    59: "4\\cdot\\bigl(4! - \\dfrac{4}{0.4}\\bigr) + \\dfrac{\\Gamma(4)}{\\sqrt{4}}",
    60: "\\big\\lfloor 4 + \\ln 4 \\big\\rfloor\\cdot\\dfrac{4!}{\\sqrt{4}}",
    61: "\\big\\lfloor 4 + \\ln 4 \\big\\rfloor\\cdot\\dfrac{4!}{\\sqrt{4}} + \\log_{4}4",
    62: "\\big\\lfloor 4 + \\ln 4 \\big\\rfloor\\cdot\\dfrac{4!}{\\sqrt{4}} + \\sqrt{4}",
    63: "\\bigl(\\Gamma(4)+\\log_{4}4\\bigr)\\cdot\\bigl(4 + 4 + \\log_{4}4\\bigr)",
    64: "4^{\\,\\bigl(\\sqrt{4} + \\log_{4}4\\bigr)}",
    65: "4^{\\,\\bigl(\\sqrt{4} + \\log_{4}4\\bigr)} + \\log_{4}4",
    66: "4^{\\,\\bigl(\\sqrt{4} + \\log_{4}4\\bigr)} + \\sqrt{4}",
    67: "4^{\\,\\bigl(\\sqrt{4} + \\log_{4}4\\bigr)} + \\dfrac{\\Gamma(4)}{\\sqrt{4}}",
    68: "4^{\\,\\bigl(\\sqrt{4} + \\log_{4}4\\bigr)} + 4",
    69: "4^{\\,\\bigl(\\sqrt{4} + \\log_{4}4\\bigr)} + 4 + \\log_{4}4",
    70: "\\bigl(\\Gamma(4)+\\log_{4}4\\bigr)\\cdot\\dfrac{4}{0.4}",
    71: "\\bigl(\\Gamma(4)+\\log_{4}4\\bigr)\\cdot\\dfrac{4}{0.4} + \\log_{4}4",
    72: "\\Gamma(4)\\cdot\\dfrac{4!}{\\sqrt{4}}",
    73: "\\Gamma(4)\\cdot\\dfrac{4!}{\\sqrt{4}} + \\log_{4}4",
    74: "\\Gamma(4)\\cdot\\dfrac{4!}{\\sqrt{4}} + \\sqrt{4}",
    75: "\\bigl(4^{2} - \\log_{4}4\\bigr)\\cdot\\big\\lfloor 4 + \\ln 4 \\big\\rfloor",
    76: "4\\cdot\\bigl(4^{2} + \\dfrac{\\Gamma(4)}{\\sqrt{4}}\\bigr)",
    77: "4\\cdot\\bigl(4^{2} + \\dfrac{\\Gamma(4)}{\\sqrt{4}}\\bigr) + \\log_{4}4",
    78: "4\\cdot\\bigl(4^{2} + \\dfrac{\\Gamma(4)}{\\sqrt{4}}\\bigr) + \\sqrt{4}",
    79: "4\\cdot\\bigl(4^{2} + \\dfrac{\\Gamma(4)}{\\sqrt{4}}\\bigr) + \\dfrac{\\Gamma(4)}{\\sqrt{4}}",
    80: "(4 + 4)\\cdot\\dfrac{4}{0.4}",
    81: "\\Bigl(\\dfrac{\\Gamma(4)}{\\sqrt{4}}\\Bigr)^{4}",
    82: "\\Bigl(\\dfrac{\\Gamma(4)}{\\sqrt{4}}\\Bigr)^{4} + \\log_{4}4",
    83: "\\Bigl(\\dfrac{\\Gamma(4)}{\\sqrt{4}}\\Bigr)^{4} + \\sqrt{4}",
    84: "\\bigl(\\Gamma(4)+\\log_{4}4\\bigr)\\cdot\\dfrac{4!}{\\sqrt{4}}",
    85: "\\bigl(\\Gamma(4)+\\log_{4}4\\bigr)\\cdot\\dfrac{4!}{\\sqrt{4}} + \\log_{4}4",
    86: "\\bigl(\\Gamma(4)+\\log_{4}4\\bigr)\\cdot\\dfrac{4!}{\\sqrt{4}} + \\sqrt{4}",
    87: "\\bigl(\\Gamma(4)+\\log_{4}4\\bigr)\\cdot\\dfrac{4!}{\\sqrt{4}} + \\dfrac{\\Gamma(4)}{\\sqrt{4}}",
    88: "4\\cdot\\bigl(4! - \\sqrt{4}\\bigr)",
    89: "4\\cdot\\bigl(4! - \\sqrt{4}\\bigr) + \\log_{4}4",
    90: "\\bigl(4 + 4 + \\log_{4}4\\bigr)\\cdot\\dfrac{4}{0.4}",
    91: "\\bigl(\\Gamma(4)+\\log_{4}4\\bigr)\\cdot\\bigl(\\dfrac{4!}{\\sqrt{4}} + \\log_{4}4\\bigr)",
    92: "4\\cdot\\bigl(4! - \\log_{4}4\\bigr)",
    93: "4\\cdot\\bigl(4! - \\log_{4}4\\bigr) + \\log_{4}4",
    94: "4\\cdot\\bigl(4! - \\log_{4}4\\bigr) + \\sqrt{4}",
    95: "\\bigl(4 + 4\\bigr)\\cdot\\dfrac{4!}{\\sqrt{4}} - \\log_{4}4",
    96: "(4 + 4)\\cdot\\dfrac{4!}{\\sqrt{4}}",
    97: "(4 + 4)\\cdot\\dfrac{4!}{\\sqrt{4}} + \\log_{4}4",
    98: "\\bigl(\\Gamma(4)+\\log_{4}4\\bigr)^{2}\\cdot\\sqrt{4}",
    99: "\\bigl(\\Gamma(4)+\\log_{4}4\\bigr)^{2}\\cdot\\sqrt{4} + \\log_{4}4",
    100: "\\dfrac{4}{0.04}"
};

// DOM elements
const numberInput = document.getElementById('numberInput');
const formulaDisplay = document.getElementById('formulaDisplay');

// Function to display formula
function displayFormula(number) {
    if (number >= 0 && number <= 100 && Number.isInteger(number)) {
        const formula = formulas[number];
        if (formula) {
            formulaDisplay.innerHTML = `
                <div class="formula">
                    <span class="number">${number}</span>
                    <span class="equals">=</span>
                    <span class="formula-text">$$${formula}$$</span>
                </div>
            `;
            // Re-render MathJax
            if (window.MathJax) {
                MathJax.typesetPromise([formulaDisplay]).catch((err) => console.log('MathJax error:', err));
            }
        } else {
            formulaDisplay.innerHTML = `
                <div class="formula error">
                    <p>Formula not available for ${number}</p>
                </div>
            `;
        }
    } else if (numberInput.value.trim() === '') {
        formulaDisplay.innerHTML = '<p>Enter a number above to see its formula</p>';
    } else {
        formulaDisplay.innerHTML = `
            <div class="formula error">
                <p>Please enter a valid integer between 0 and 100</p>
            </div>
        `;
    }
}

// Event listener for input changes
numberInput.addEventListener('input', function() {
    const value = parseInt(this.value);
    displayFormula(value);
});

// Event listener for Enter key
numberInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const value = parseInt(this.value);
        displayFormula(value);
    }
});

// Initialize with empty state
displayFormula(null);
