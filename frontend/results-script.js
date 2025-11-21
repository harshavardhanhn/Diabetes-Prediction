// Base URL for the Flask backend
const API_BASE_URL = 'http://localhost:5000';

// Graph descriptions
const graphDescriptions = {
    1: {
        title: "Pregnancy Count Graph",
        description: "This graph shows the relationship between age and number of pregnancies, comparing your data point with the dataset. Healthy individuals are shown in green, while those with diabetes are shown in red."
    },
    2: {
        title: "Glucose Value Graph", 
        description: "This visualization displays glucose levels across different ages. Your glucose level is highlighted for comparison with the dataset patterns."
    },
    3: {
        title: "BloodPressure Value Graph",
        description: "This chart illustrates blood pressure readings by age, showing how your measurement compares to others in the dataset."
    },
    4: {
        title: "Skin Thickness Graph",
        description: "This graph shows skin thickness measurements across different age groups, with your data point highlighted for context."
    },
    5: {
        title: "Insulin Value Graph",
        description: "Visualization of insulin levels by age, comparing your reading with the broader dataset patterns."
    },
    6: {
        title: "BMI Value Graph", 
        description: "This chart displays Body Mass Index (BMI) values across ages, showing where your BMI falls in relation to the dataset."
    },
    7: {
        title: "DPF Value Graph",
        description: "This graph shows Diabetes Pedigree Function values by age, highlighting your genetic risk factor in context."
    }
};

// Initialize the results page
document.addEventListener('DOMContentLoaded', function() {
    // Get stored data
    const predictionData = JSON.parse(sessionStorage.getItem('predictionData'));
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    const userGender = sessionStorage.getItem('userGender');
    
    // Check if we have the required data
    if (!predictionData || !userData || !userGender) {
        // Redirect back to input page if no data
        window.location.href = '/';
        return;
    }
    
    // Display results
    displayResults(predictionData, userData, userGender);
    
    // Set up graph selector
    setupGraphSelector(predictionData);
});

function displayResults(predictionData, userData, userGender) {
    console.log("Displaying results with data:", userData);
    console.log("Gender:", userGender);
    
    // Display prediction result
    const resultElement = document.getElementById('result');
    if (predictionData.prediction === 1) {
        resultElement.textContent = 'You are Diabetic';
        resultElement.className = 'result diabetic';
    } else {
        resultElement.textContent = 'You are not Diabetic';
        resultElement.className = 'result healthy';
    }
    
    // Display accuracy if available
    if (predictionData.accuracy) {
        document.getElementById('accuracy').textContent = `Model Accuracy: ${predictionData.accuracy}%`;
    }
    
    // Display patient data
    const genderDisplay = userGender === 'male' ? 'Male' : 'Female';
    
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
                <td>${userData.Glucose} mg/dL</td>
            </tr>
            <tr>
                <td>BloodPressure</td>
                <td>${userData.BloodPressure} mm/Hg</td>
            </tr>
            <tr>
                <td>SkinThickness</td>
                <td>${userData.SkinThickness} mm</td>
            </tr>
            <tr>
                <td>Insulin</td>
                <td>${userData.Insulin} pmol/L</td>
            </tr>
            <tr>
                <td>BMI</td>
                <td>${userData.BMI} kg/m²</td>
            </tr>
            <tr>
                <td>DiabetesPedigreeFunction</td>
                <td>${userData.DiabetesPedigreeFunction}</td>
            </tr>
            <tr>
                <td>Age</td>
                <td>${userData.Age} years</td>
            </tr>
        </table>
    `;
    
    document.getElementById('patient-data').innerHTML = patientDataHtml;
}

function setupGraphSelector(predictionData) {
    const graphSelector = document.getElementById('graph-selector');
    const currentGraph = document.getElementById('current-graph');
    const graphTitle = document.getElementById('graph-title');
    const graphDescription = document.getElementById('graph-description');
    
    // Load initial graph
    loadGraph(1, predictionData);
    
    // Handle graph selection changes
    graphSelector.addEventListener('change', function() {
        const selectedGraph = this.value;
        loadGraph(selectedGraph, predictionData);
    });
    
    function loadGraph(graphNumber, predictionData) {
        if (predictionData.plots && predictionData.plots.length >= graphNumber) {
            // Add timestamp to prevent caching
            const timestamp = new Date().getTime();
            currentGraph.src = `${API_BASE_URL}${predictionData.plots[graphNumber-1]}?t=${timestamp}`;
            
            // Update graph info
            const graphInfo = graphDescriptions[graphNumber];
            if (graphInfo) {
                graphTitle.textContent = graphInfo.title;
                graphDescription.textContent = graphInfo.description;
            }
            
            // Handle image loading errors
            currentGraph.onerror = function() {
                console.error(`Failed to load graph ${graphNumber}`);
                currentGraph.alt = `Graph ${graphNumber} failed to load`;
            };
        }
    }
}