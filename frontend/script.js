// Base URL for the Flask backend - adjust if needed
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

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Set up event listeners for gender radio buttons
    setupGenderSelection();
    
    // Set up event listeners for input fields
    setupInputs();
    
    // Display initial patient data
    updatePatientData();
    
    // Set up submit button
    document.getElementById('submit-btn').addEventListener('click', submitData);
});

function setupGenderSelection() {
    const maleRadio = document.getElementById('male');
    const femaleRadio = document.getElementById('female');
    const pregnanciesInput = document.getElementById('pregnancies');
    
    maleRadio.addEventListener('change', function() {
        if (this.checked) {
            // Set pregnancies to 0 and disable the input for males
            pregnanciesInput.value = 0;
            pregnanciesInput.disabled = true;
            userData.Pregnancies = 0;
            updatePatientData();
        }
    });
    
    femaleRadio.addEventListener('change', function() {
        if (this.checked) {
            // Enable pregnancies input for females
            pregnanciesInput.disabled = false;
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
        
        element.addEventListener('input', function() {
            // Validate input
            const value = parseFloat(this.value);
            const isValid = !isNaN(value) && value >= input.min && value <= input.max;
            
            if (isValid) {
                userData[input.key] = value;
                element.classList.remove('input-error');
                errorElement.textContent = '';
                
                // Update patient data display
                updatePatientData();
            } else {
                element.classList.add('input-error');
                errorElement.textContent = `Please enter a value between ${input.min} and ${input.max}`;
            }
        });
        
        // Validate on blur as well
        element.addEventListener('blur', function() {
            const value = parseFloat(this.value);
            const isValid = !isNaN(value) && value >= input.min && value <= input.max;
            
            if (!isValid) {
                element.classList.add('input-error');
                errorElement.textContent = `Please enter a value between ${input.min} and ${input.max}`;
            }
        });
    });
}

function updatePatientData() {
    const gender = document.querySelector('input[name="gender"]:checked').value;
    const genderDisplay = gender === 'male' ? 'Male' : 'Female';
    
    const patientDataHtml = `
        <table>
            <tr>
                <th>Feature</th>
                <th>Value</th>
            </tr>
            <tr>
                <td>Gender</td>
                <td>${genderDisplay}</td>
            </tr>
            <tr>
                <td>Pregnancies</td>
                <td>${userData.Pregnancies}</td>
            </tr>
            <tr>
                <td>Glucose</td>
                <td>${userData.Glucose}</td>
            </tr>
            <tr>
                <td>BloodPressure</td>
                <td>${userData.BloodPressure}</td>
            </tr>
            <tr>
                <td>SkinThickness</td>
                <td>${userData.SkinThickness}</td>
            </tr>
            <tr>
                <td>Insulin</td>
                <td>${userData.Insulin}</td>
            </tr>
            <tr>
                <td>BMI</td>
                <td>${userData.BMI}</td>
            </tr>
            <tr>
                <td>DiabetesPedigreeFunction</td>
                <td>${userData.DiabetesPedigreeFunction}</td>
            </tr>
            <tr>
                <td>Age</td>
                <td>${userData.Age}</td>
            </tr>
        </table>
    `;
    
    document.getElementById('patient-data').innerHTML = patientDataHtml;
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
        const value = parseFloat(element.value);
        
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
    document.getElementById('results-section').style.display = 'none';
    document.getElementById('submit-btn').disabled = true;
    
    // Send data to Flask backend
    fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            },
        body: JSON.stringify(userData)
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
        
        // Display results
        displayResults(data);
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

function displayResults(data) {
    // Show results section
    document.getElementById('results-section').style.display = 'block';
    
    // Display prediction result
    const resultElement = document.getElementById('result');
    if (data.prediction === 1) {
        resultElement.textContent = 'You are Diabetic';
        resultElement.className = 'result diabetic';
    } else {
        resultElement.textContent = 'You are not Diabetic';
        resultElement.className = 'result healthy';
    }
    
    // Display accuracy if available
    if (data.accuracy) {
        document.getElementById('accuracy').textContent = `Accuracy: ${data.accuracy}%`;
    }
    
    // Load plot images
    if (data.plots && data.plots.length === 7) {
        for (let i = 0; i < 7; i++) {
            const plotElement = document.getElementById(`plot${i+1}`);
            // Add timestamp to prevent caching
            plotElement.src = `${API_BASE_URL}${data.plots[i]}?t=${new Date().getTime()}`;
        }
    }
}