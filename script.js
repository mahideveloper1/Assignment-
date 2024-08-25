const username = "coalition";
const password = "skills-test";
const auth = btoa(`${username}:${password}`);

// Fetch the API data
async function fetchData() {
  try {
    const response = await fetch(
      "https://fedskillstest.coalitiontechnologies.workers.dev",
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const patient = data[3];

    updateProfile(patient);
    updateDiagnosisHistory(patient);
    populateDiagnosticTable(patient.diagnostic_list);
    updateLabResults(patient);
    renderBloodPressureChart(patient.diagnosis_history);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Update profile section
function updateProfile(patient) {
  document.getElementById("profile-photo").src = patient.profile_picture;
  document.getElementById("profile-name").textContent = patient.name;
  document.getElementById("dob").textContent = new Date(
    patient.date_of_birth
  ).toLocaleDateString("en-US");
  document.getElementById("gender").textContent = patient.gender;
  document.getElementById("contact-info").textContent = patient.phone_number;
  document.getElementById("emergency-contact").textContent =
    patient.emergency_contact;
  document.getElementById("insurance-provider").textContent =
    patient.insurance_type;
}

// Update diagnosis history
function updateDiagnosisHistory(patient) {
  const diagnosisHistory = patient.diagnosis_history;

  document.querySelector(".systolic-level").textContent =
    diagnosisHistory[0].blood_pressure.systolic.levels;
  document.querySelector(".systolic-value").textContent =
    diagnosisHistory[0].blood_pressure.systolic.value;

  document.querySelector(".diastolic-value").textContent =
    diagnosisHistory[0].blood_pressure.diastolic.value;
  document.querySelector(".diastolic-level").textContent =
    diagnosisHistory[0].blood_pressure.diastolic.levels;

  document.getElementById("respirator-rate").textContent =
    diagnosisHistory[0].respiratory_rate.value;
  document.getElementById("respirator-status").textContent =
    diagnosisHistory[0].respiratory_rate.levels;
  document.getElementById("temp-rate").textContent =
    diagnosisHistory[0].temperature.value;
  document.getElementById("temp-status").textContent =
    diagnosisHistory[0].temperature.levels;
  document.getElementById("heart-rate").textContent =
    diagnosisHistory[0].heart_rate.value;
  document.getElementById("heart-status").textContent =
    diagnosisHistory[0].heart_rate.levels;
}

// Populate diagnostic list
function populateDiagnosticTable(diagnosticList) {
  const tbody = document.querySelector("#diagnostic-list tbody");
  tbody.innerHTML = ""; // Clear any existing rows

  diagnosticList.forEach((diagnostic) => {
    const row = document.createElement("tr");

    const nameCell = document.createElement("td");
    nameCell.textContent = diagnostic.name;
    row.appendChild(nameCell);

    const descriptionCell = document.createElement("td");
    descriptionCell.textContent = diagnostic.description;
    row.appendChild(descriptionCell);

    const statusCell = document.createElement("td");
    statusCell.textContent = diagnostic.status;
    row.appendChild(statusCell);

    tbody.appendChild(row);
  });
}

// Update lab results table
function updateLabResults(patient) {
  const labResults = patient.lab_results;
  const labResultsTable = document.getElementById("lab-results-table");
  labResultsTable.innerHTML = ""; // Clear any previous content

  labResults.forEach((result) => {
    const row = document.createElement("tr");

    const resultTextCell = document.createElement("td");
    resultTextCell.className = "result-text";
    resultTextCell.textContent = result;

    const resultIconCell = document.createElement("td");
    resultIconCell.className = "result-icon";
    // You can add icons or indicators here if needed

    row.appendChild(resultTextCell);
    row.appendChild(resultIconCell);
    labResultsTable.appendChild(row);
  });
}

// Render blood pressure chart
// Function to format month numbers to abbreviated month names
function formatMonth(monthName) {
  const monthMap = {
    January: "Jan",
    February: "Feb",
    March: "Mar",
    April: "Apr",
    May: "May",
    June: "Jun",
    July: "Jul",
    August: "Aug",
    September: "Sep",
    October: "Oct",
    November: "Nov",
    December: "Dec",
  };
  return monthMap[monthName] || monthName; // Return abbreviated form or the same month if not found
}
// Render blood pressure chart
function renderBloodPressureChart(diagnosisHistory) {
  const months = diagnosisHistory.map(
    (item) => `${formatMonth(item.month)}, ${item.year}`
  );
  const systolicValues = diagnosisHistory.map(
    (item) => item.blood_pressure.systolic.value
  );
  const diastolicValues = diagnosisHistory.map(
    (item) => item.blood_pressure.diastolic.value
  );

  const ctx = document.getElementById("bloodPressureChart").getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: months,
      datasets: [
        {
          label: "Systolic",
          data: systolicValues,
          borderColor: "#f56565",
          fill: false,
          tension: 0.4,
          pointBackgroundColor: "#f56565",
        },
        {
          label: "Diastolic",
          data: diastolicValues,
          borderColor: "#4299e1",
          fill: false,
          tension: 0.4,
          pointBackgroundColor: "#4299e1",
        },
      ],
    },
    options: {
      scales: {
        x: {
          ticks: {
            maxTicksLimit: 7,
            autoSkip: true,
            maxRotation: 0,
            minRotation: 0,
          },
        },
        y: {
          beginAtZero: false,
          min: 60,
          max: 180,
        },
      },
    },
  });
}

// Fetch and render data on page load
document.addEventListener("DOMContentLoaded", fetchData);
