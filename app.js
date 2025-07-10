// Define every input element global
let oneOffInvestmentInptElement;
let savingIntervalSelectElement;
let savingsRateInptElement;
let interestIntervalInptElement;
let yearsInptElement;

// Define every form element global
let oneOffInvestmentFormElement;
let savingIntervalFormElement;
let savingsRateFormElement;
let interestIntervalFormElement;
let yearsFormElement;

// Define a base value which can be changing if the response is not valid
// This value can only change if the user is confirm his information
let isInptInvalid = false;


function resetErrors() {
    // Reset or delete every error labels and classes
    document.querySelectorAll(".wrong-label").forEach(label => label.remove());

    oneOffInvestmentInptElement.classList.remove("wrong-inpt");
    savingIntervalSelectElement.classList.remove("wrong-inpt");
    savingsRateInptElement.classList.remove("wrong-inpt");
    interestIntervalInptElement.classList.remove("wrong-inpt");
    yearsInptElement.classList.remove("wrong-inpt");
}

function setError(inptElement, formElement, textContent) {
    // Display a error message to the user
    const error_label = document.createElement("label");

    inptElement.classList.add("wrong-inpt");

    error_label.textContent = textContent;
    error_label.classList.add("wrong-label");

    formElement.appendChild(error_label);
}

function removeError(inputElement, formElement) {
    // Remove the display error
    const errorLabel = formElement.querySelector(".wrong-label");

    if (errorLabel) {
        errorLabel.remove();
    };

    inputElement.classList.remove("wrong-inpt");
}

function convertNumbersReadableForErrors(number, message) {
    // Convert the numbers to en spelling
    const formattedNumber = Number(number).toLocaleString("en-US");
    const errorMessage = message.replace(number, formattedNumber);

    return errorMessage;
}

function validateUserInput() {
    // Reset errors
    resetErrors();

    let isValid = true;

    // Validate the user inputs
    const inputsToValidate = [
        [oneOffInvestmentInptElement, oneOffInvestmentFormElement],
        [savingsRateInptElement, savingsRateFormElement],
        [interestIntervalInptElement, interestIntervalFormElement],
        [yearsInptElement, yearsFormElement]
    ]

    // Check that the input fields are filled in correctly.
    for (const [inptElement, formElement] of inputsToValidate) {
        if (inptElement === savingsRateInptElement) {
            if (savingIntervalSelectElement.value === "one-time") {
                break;
            }
        }
        if (!inptElement.checkValidity()) {
            if (inptElement.validity.rangeOverflow) {
                const errorMessage = convertNumbersReadableForErrors(
                    inptElement.max, inptElement.validationMessage
                );
                setError(inptElement, formElement, errorMessage);
            } else {
                const errorMessage = inptElement.validationMessage;
                setError(inptElement, formElement, errorMessage);
            };

            isValid = false;
        }
    }

    return isValid;
}

function calculateFutureValue() {
    // Define required value
    const oneOffInvestmentValue = parseInt(oneOffInvestmentInptElement.value);
    const savingIntervalValue = savingIntervalSelectElement.value;
    const savingAmountValue = parseInt(savingsRateInptElement.value);
    const interestAmountValue = parseFloat(interestIntervalInptElement.value / 100); 
    const timePeriod = parseInt(yearsInptElement.value);

    let futureValue = 0;

    if (savingIntervalValue === "monthly") {
        const monthlyRate = interestAmountValue / 12;
        const months = timePeriod * 12;
        futureValue = oneOffInvestmentValue * Math.pow((1 + monthlyRate), months) +
            savingAmountValue * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    } 
    else if (savingIntervalValue === "yearly") {
        futureValue = oneOffInvestmentValue * Math.pow((1 + interestAmountValue), timePeriod) +
            savingAmountValue * ((Math.pow(1 + interestAmountValue, timePeriod) - 1) / interestAmountValue);
    } else {
        futureValue = oneOffInvestmentValue * Math.pow((1 + interestAmountValue), timePeriod);
    }

    return parseFloat(Math.round(futureValue));
}

function calculateTotalInvestment() {
    const oneOffInvestment = parseInt(oneOffInvestmentInptElement.value);
    const savingIntervalValue = savingIntervalSelectElement.value;

    // Check if the saving interval is just one off
    if (savingIntervalValue === "one-time") {
        return oneOffInvestment;
    }   

    // If the saving interval is not just one off
    const savingAmountValue = parseInt(savingsRateInptElement.value);
    const timePeriod = parseInt(yearsInptElement.value);
    let interval = timePeriod;

    if (savingIntervalValue === "monthly") {
        interval = timePeriod * 12;
    } 

    return parseInt(oneOffInvestment + (savingAmountValue * interval));
}


document.addEventListener("DOMContentLoaded", function(event) {
    // Define every input element
    oneOffInvestmentInptElement = document.getElementById("investment");
    savingIntervalSelectElement = document.getElementById("saving-interval-options");
    savingsRateInptElement = document.getElementById("savings-rate");
    interestIntervalInptElement = document.getElementById("interest-interval");
    yearsInptElement = document.getElementById("years");

    // Define every form element
    oneOffInvestmentFormElement = document.getElementById("investment-form");
    savingIntervalFormElement = document.getElementById("saving-interval-form");
    savingsRateFormElement = document.getElementById("savings-rate-form");
    interestIntervalFormElement = document.getElementById("interest-interval-form");
    yearsFormElement = document.getElementById("years-form");

    // Deactivate the submit with enter in a input field
    const allForms = document.querySelectorAll("form");
    allForms.forEach(form => [
        form.addEventListener("submit", () => {
            event.preventDefault();
        })
    ])

    // Add event listener for the calculate button
    const calculateButtonElement = document.getElementById("calculate-btn");

    calculateButtonElement.addEventListener("click", () => {
        const isValid = validateUserInput();

        if (isValid) {
            const futureValue = calculateFutureValue();
            const totalInvestment = calculateTotalInvestment();
            const profit = parseFloat(Math.round(futureValue - totalInvestment));

            const resultContainer = document.getElementById("result");
            resultContainer.style.display = ""; // Removes display = none
            resultContainer.innerHTML = ""; // Removes every element from the container
            
            const pTag = document.createElement("p");
            pTag.innerHTML = `Total invested: <span class="highlight_result">$${totalInvestment}</span>. <br>
            Future Value: <span class="highlight_result">$${futureValue}</span>. <br>
            Profit: <span class="highlight_result">$${profit}</span>.`

            resultContainer.appendChild(pTag);
        } else {
            isInptInvalid = true;
        }   
    })

    // Add event listener for the select menu
    savingIntervalSelectElement.addEventListener("change", (event) => {
        const selectedValue = event.target.value;

        if (selectedValue === "one-time") {
            savingsRateFormElement.classList.add("disabled-form");
        } else {
            savingsRateFormElement.classList.remove("disabled-form");
        }
    })
})