// DOM Elements
const amountInput = document.getElementById('amount');
const termInput = document.getElementById('term');
const rateInput = document.getElementById('rate');
const amountWrapper = document.getElementById('amountWrapper');
const termWrapper = document.getElementById('termWrapper');
const rateWrapper = document.getElementById('rateWrapper');
const repaymentOption = document.getElementById('repaymentOption');
const interestOption = document.getElementById('interestOption');
const calculateBtn = document.getElementById('calculateBtn');
const clearAllBtn = document.getElementById('clearAll');
const emptyState = document.getElementById('emptyState');
const resultsContent = document.getElementById('resultsContent');
const monthlyPaymentEl = document.getElementById('monthlyPayment');
const totalRepaymentEl = document.getElementById('totalRepayment');

// State
let mortgageType = null;

// Utility Functions
function formatNumber(value) {
  const number = value.replace(/[^\d]/g, '');
  if (!number) return '';
  return parseInt(number, 10).toLocaleString('en-GB');
}

function parseNumber(value) {
  return parseFloat(value.replace(/,/g, '')) || 0;
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

// Input Handlers
amountInput.addEventListener('input', function(e) {
  const formatted = formatNumber(e.target.value);
  e.target.value = formatted;
  if (formatted) {
    clearError('amount');
  }
});

termInput.addEventListener('input', function(e) {
  const value = e.target.value.replace(/[^\d]/g, '');
  e.target.value = value;
  if (value) {
    clearError('term');
  }
});

rateInput.addEventListener('input', function(e) {
  let value = e.target.value.replace(/[^\d.]/g, '');
  // Only allow one decimal point
  const parts = value.split('.');
  if (parts.length > 2) {
    value = parts[0] + '.' + parts.slice(1).join('');
  }
  e.target.value = value;
  if (value) {
    clearError('rate');
  }
});

// Radio Option Handlers
repaymentOption.addEventListener('click', function() {
  selectMortgageType('repayment');
});

interestOption.addEventListener('click', function() {
  selectMortgageType('interest-only');
});

function selectMortgageType(type) {
  mortgageType = type;
  
  // Update UI
  repaymentOption.classList.toggle('selected', type === 'repayment');
  interestOption.classList.toggle('selected', type === 'interest-only');
  
  clearError('type');
}

// Error Handling
function setError(field) {
  const wrapper = document.getElementById(field + 'Wrapper');
  const formGroup = wrapper ? wrapper.closest('.form-group') : null;
  
  if (wrapper) {
    wrapper.classList.add('error');
  }
  if (formGroup) {
    formGroup.classList.add('has-error');
  }
}

function clearError(field) {
  if (field === 'type') {
    document.getElementById('typeError').closest('.form-group').classList.remove('has-error');
    return;
  }
  
  const wrapper = document.getElementById(field + 'Wrapper');
  const formGroup = wrapper ? wrapper.closest('.form-group') : null;
  
  if (wrapper) {
    wrapper.classList.remove('error');
  }
  if (formGroup) {
    formGroup.classList.remove('has-error');
  }
}

function clearAllErrors() {
  ['amount', 'term', 'rate'].forEach(field => clearError(field));
  clearError('type');
}

// Calculate Mortgage
function calculateMortgage() {
  let hasErrors = false;
  
  // Validate amount
  if (!amountInput.value) {
    setError('amount');
    hasErrors = true;
  }
  
  // Validate term
  if (!termInput.value) {
    setError('term');
    hasErrors = true;
  }
  
  // Validate rate
  if (!rateInput.value) {
    setError('rate');
    hasErrors = true;
  }
  
  // Validate mortgage type
  if (!mortgageType) {
    document.getElementById('typeError').closest('.form-group').classList.add('has-error');
    hasErrors = true;
  }
  
  if (hasErrors) return;
  
  // Calculate
  const principal = parseNumber(amountInput.value);
  const years = parseInt(termInput.value, 10);
  const annualRate = parseFloat(rateInput.value) / 100;
  const monthlyRate = annualRate / 12;
  const numberOfPayments = years * 12;
  
  let monthlyPayment, totalRepayment;
  
  if (mortgageType === 'repayment') {
    // Standard mortgage formula: M = P[r(1+r)^n]/[(1+r)^n-1]
    if (monthlyRate === 0) {
      monthlyPayment = principal / numberOfPayments;
    } else {
      monthlyPayment =
        (principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    }
    totalRepayment = monthlyPayment * numberOfPayments;
  } else {
    // Interest only: Monthly = Principal × (Annual Rate / 12)
    monthlyPayment = principal * monthlyRate;
    totalRepayment = monthlyPayment * numberOfPayments + principal;
  }
  
  // Display results
  monthlyPaymentEl.textContent = formatCurrency(monthlyPayment);
  totalRepaymentEl.textContent = formatCurrency(totalRepayment);
  
  emptyState.style.display = 'none';
  resultsContent.style.display = 'block';
}

// Clear All
function clearAll() {
  amountInput.value = '';
  termInput.value = '';
  rateInput.value = '';
  mortgageType = null;
  
  repaymentOption.classList.remove('selected');
  interestOption.classList.remove('selected');
  
  clearAllErrors();
  
  emptyState.style.display = 'block';
  resultsContent.style.display = 'none';
}

// Event Listeners
calculateBtn.addEventListener('click', calculateMortgage);
clearAllBtn.addEventListener('click', clearAll);