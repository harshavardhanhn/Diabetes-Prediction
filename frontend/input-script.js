// Base URL for the Flask backend
const API_BASE_URL = 'http://localhost:5000';

// User data object
let userData = {
    Pregnancies: 0,
    Glucose: 120,
    BloodPressure: 70,
    SkinThickness: 20,
    Insulin: 79,
    BMI: 20,
    DiabetesPedigreeFunction: 0.47,
    Age: 33
};

// Store gender separately since it's not part of the ML model
let userGender = 'male';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Set up event listeners for gender radio buttons
    setupGenderSelection();
    
    // Set up event listeners for input fields
    setupInputs();
    
    // Set up submit button
    document.getElementById('submit-btn').addEventListener('click', submitData);
});

function setupGenderSelection() {
    const maleRadio = document.getElementById('male');
    const femaleRadio = document.getElementById('female');
    const pregnanciesInput = document.getElementById('pregnancies');
    
    // Set initial gender state
    userGender = maleRadio.checked ? 'male' : 'female';
    
    maleRadio.addEventListener('change', function() {
        if (this.checked) {
            // Set pregnancies to 0 and disable the input for males
            pregnanciesInput.value = 0;
            pregnanciesInput.disabled = true;
            userData.Pregnancies = 0;
            userGender = 'male';
        }
    });
    
    femaleRadio.addEventListener('change', function() {
        if (this.checked) {
            // Enable pregnancies input for females
            pregnanciesInput.disabled = false;
            userGender = 'female';
        }
    });
}

function setupInputs() {
    // For each input field, update the user data when changed
    const inputs = [
        { id: 'pregnancies', key: 'Pregnancies', min: 0, max: 17 },
        { id: 'glucose', key: 'Glucose', min: 0, max: 200 },
        { id: 'bp', key: 'BloodPressure', min: 0, max: 122 },
        { id: 'skinthickness', key: 'SkinThickness', min: 0, max: 100 },
        { id: 'insulin', key: 'Insulin', min: 0, max: 846 },
        { id: 'bmi', key: 'BMI', min: 0, max: 67, step: 0.1 },
        { id: 'dpf', key: 'DiabetesPedigreeFunction', min: 0.0, max: 2.4, step: 0.01 },
        { id: 'age', key: 'Age', min: 21, max: 88 }
    ];
    
    inputs.forEach(input => {
        const element = document.getElementById(input.id);
        const errorElement = document.getElementById(`${input.id}-error`);
        
        // Set initial values in userData
        if (input.step) {
            userData[input.key] = parseFloat(element.value);
        } else {
            userData[input.key] = parseInt(element.value);
        }
        
        element.addEventListener('input', function() {
            // Validate input
            const value = input.step ? parseFloat(this.value) : parseInt(this.value);
            const isValid = !isNaN(value) && value >= input.min && value <= input.max;
            
            if (isValid) {
                userData[input.key] = value;
                element.classList.remove('input-error');
                errorElement.textContent = '';
            } else {
                element.classList.add('input-error');
                errorElement.textContent = `Please enter a value between ${input.min} and ${input.max}`;
            }
        });
        
        // Validate on blur as well
        element.addEventListener('blur', function() {
            const value = input.step ? parseFloat(this.value) : parseInt(this.value);
            const isValid = !isNaN(value) && value >= input.min && value <= input.max;
            
            if (!isValid) {
                element.classList.add('input-error');
                errorElement.textContent = `Please enter a value between ${input.min} and ${input.max}`;
            }
        });
    });
}

function validateAllInputs() {
    let isValid = true;
    const inputs = [
        { id: 'pregnancies', key: 'Pregnancies', min: 0, max: 17 },
        { id: 'glucose', key: 'Glucose', min: 0, max: 200 },
        { id: 'bp', key: 'BloodPressure', min: 0, max: 122 },
        { id: 'skinthickness', key: 'SkinThickness', min: 0, max: 100 },
        { id: 'insulin', key: 'Insulin', min: 0, max: 846 },
        { id: 'bmi', key: 'BMI', min: 0, max: 67, step: 0.1 },
        { id: 'dpf', key: 'DiabetesPedigreeFunction', min: 0.0, max: 2.4, step: 0.01 },
        { id: 'age', key: 'Age', min: 21, max: 88 }
    ];
    
    inputs.forEach(input => {
        const element = document.getElementById(input.id);
        const errorElement = document.getElementById(`${input.id}-error`);
        const value = input.step ? parseFloat(element.value) : parseInt(element.value);
        
        if (isNaN(value) || value < input.min || value > input.max) {
            element.classList.add('input-error');
            errorElement.textContent = `Please enter a value between ${input.min} and ${input.max}`;
            isValid = false;
        }
    });
    
    return isValid;
}

function submitData() {
    // Validate all inputs before submitting
    if (!validateAllInputs()) {
        document.getElementById('error-message').style.display = 'block';
        document.getElementById('error-message').textContent = 
            'Please fix all input errors before submitting.';
        return;
    }
    
    // Clear any previous errors
    document.getElementById('error-message').style.display = 'none';
    
    // Show loading indicator
    document.getElementById('loading').style.display = 'block';
    document.getElementById('submit-btn').disabled = true;
    
    // Create a copy of userData for sending to backend (without any extra fields)
    const dataToSend = {
        Pregnancies: userData.Pregnancies,
        Glucose: userData.Glucose,
        BloodPressure: userData.BloodPressure,
        SkinThickness: userData.SkinThickness,
        Insulin: userData.Insulin,
        BMI: userData.BMI,
        DiabetesPedigreeFunction: userData.DiabetesPedigreeFunction,
        Age: userData.Age
    };
    
    // Send data to Flask backend
    fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        // Hide loading indicator
        document.getElementById('loading').style.display = 'none';
        document.getElementById('submit-btn').disabled = false;
        
        if (data.error) {
            throw new Error(data.error);
        }
        
        // Store results in sessionStorage and redirect to results page
        sessionStorage.setItem('predictionData', JSON.stringify(data));
        sessionStorage.setItem('userData', JSON.stringify(userData));
        sessionStorage.setItem('userGender', userGender);
        window.location.href = '/results.html';
    })
    .catch(error => {
        // Hide loading indicator and show error
        document.getElementById('loading').style.display = 'none';
        document.getElementById('submit-btn').disabled = false;
        document.getElementById('error-message').style.display = 'block';
        document.getElementById('error-message').textContent = 
            `Error: ${error.message}. Please make sure the Flask server is running.`;
        console.error('Error:', error);
    });
}