// Average return on investment per year
const annualRate = 0.07;

function validateUserInput(investmentAmountElement, periodElement, yearsElement) {
    // Reset errors
    document.querySelectorAll(".wrong-label").forEach(label => label.remove());
    investmentAmountElement.classList.remove("wrong-inpt");
    periodElement.classList.remove("wrong-inpt");
    yearsElement.classList.remove("wrong-inpt");

    let isInptValid = true;

    if (!investmentAmountElement.checkValidity()) {
        const investmentForm = document.getElementById("investment-form");
        const error_label = document.createElement("label");

        investmentAmountElement.classList.add("wrong-inpt");
        error_label.textContent = investmentAmountElement.validationMessage;
        error_label.classList.add("wrong-label");
        
        investmentForm.appendChild(error_label);
        isInptValid = false;
    } 
    if (!periodElement.checkValidity()) {
        const periodForm = document.getElementById("period-form");
        const error_label = document.createElement("label");

        periodElement.classList.add("wrong-inpt");
        error_label.textContent = periodElement.validationMessage;
        error_label.classList.add("wrong-label");

        periodForm.appendChild(error_label);
        isInptValid = false;
    } 
    if (!yearsElement.checkValidity()) {
        const yearsForm = document.getElementById("years-form");
        const error_label = document.createElement("label");

        yearsElement.classList.add("wrong-inpt");
        error_label.textContent = yearsElement.validationMessage;
        error_label.classList.add("wrong-label");

        yearsForm.appendChild(error_label);
        isInptValid = false;
    }

    return isInptValid;
}

function calculateFutureValue(investmentAmountElement, periodElement, yearsElement) {
    // Define the values
    const investmentAmount = parseFloat(investmentAmountElement.value);
    const periodsPerYear = parseInt(periodElement.value);
    const years = parseInt(yearsElement.value);

    // Calculate total payments
    const totalPayments = periodsPerYear * years

    // Calculate future value
    let futureValue = 0

    if (periodsPerYear != null && totalPayments !== 1) {
        futureValue = investmentAmount * (Math.pow(1 + annualRate / periodsPerYear, periodsPerYear * years) - 1) / (annualRate / periodsPerYear);
    } else {
        futureValue = investmentAmount * Math.pow(1 + annualRate, years);
    }

    // Round the future value and convert it to US spelling
    const rounded = Math.round(futureValue * 100) / 100
    return rounded.toLocaleString("en-US");
}


document.addEventListener("DOMContentLoaded", function(event) {
    // Deactivates the submit with Enter
    const allForms = document.querySelectorAll("form");
    allForms.forEach(form => [
        form.addEventListener("submit", function(event) {
            event.preventDefault();
        })
    ])

    // Gets the button element and create a event listener of button click
    const buttonElement = document.getElementById("calculate-btn");

    buttonElement.addEventListener("click", function(event) {
        // Define the elements
        const investmentAmountElement = document.getElementById("investment");
        const periodElement = document.getElementById("period");
        const yearsElement = document.getElementById("years");

        // Check if the input is valid or not
        const isInptValid = validateUserInput(investmentAmountElement, periodElement, yearsElement);

        if (isInptValid) {
            // Calculate the future value
            calculatedValue = calculateFutureValue(investmentAmountElement, periodElement, yearsElement);
            
            // Remove every element in the result container
            const resultContainer = document.getElementById("result");
            resultContainer.innerHTML = ""
            resultContainer.style.display = "";

            // Create a response for the user
            if (periodElement.value !== "" && !Number.isNaN(period)) {
                text = `Your investment will be <span class="highlight_result">$${calculatedValue}</span> 
                with <span class="highlight_result">${periodElement.value}</span> investment periods 
                per year over <span class="highlight_result">${yearsElement.value}</span> years.`
            } else {
                text = `Your investment will be <span class="highlight_result">$${calculatedValue}</span> 
                in <span class="highlight_result">${yearsElement.value}</span> years.`
            }
            
            // Create and add a new p tag to the result container
            pTag = document.createElement("p");
            pTag.innerHTML = text;
            
            resultContainer.appendChild(pTag);
        }
    })
})