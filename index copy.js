const username = "coalition";
const password = "skills-test";
const auth = btoa(`${username}:${password}`);

// Fetch the API data
fetch("https://fedskillstest.coalitiontechnologies.workers.dev", {
  headers: {
    Authorization: `Basic ${auth}`,
    "Content-Type": "application/json",
  },
})
  .then((response) => response.json())
  .then((data) => {
    const patient = data[3]; // Assuming the data is for the first patient

    // Update HTML with fetched data
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
    // Blood pressure values over the last months
    const diagnosisHistory = patient.diagnosis_history;

    const months = diagnosisHistory.map(
      (item) => `${item.month}, ${item.year}`
    );
    const systolicValues = diagnosisHistory.map(
      (item) => item.blood_pressure.systolic.value
    );
    const diastolicValues = diagnosisHistory.map(
      (item) => item.blood_pressure.diastolic.value
    );

    // Update the systolic and diastolic numbers on the card
    document.querySelector(".systolic-value").textContent =
      diagnosisHistory[0].blood_pressure.systolic.value;
    document.querySelector(".systolic-level").textContent =
      diagnosisHistory[0].blood_pressure.systolic.levels;

    document.querySelector(".diastolic-value").textContent =
      diagnosisHistory[0].blood_pressure.diastolic.value;
    document.querySelector(".diastolic-level").textContent =
      diagnosisHistory[0].blood_pressure.diastolic.levels;

    // Now fetch respiratory rate data
    const respiratoryRate = diagnosisHistory[0].respiratory_rate.value;
    const respiratoryRateLevel = diagnosisHistory[0].respiratory_rate.levels;
    const tempRate = diagnosisHistory[0].temperature.value;
    const tempRateLevel = diagnosisHistory[0].temperature.levels;
    const heartRate = diagnosisHistory[0].heart_rate.value;
    const heartRateLevel = diagnosisHistory[0].heart_rate.levels;

    // Update the respiratory rate on the card
    document.getElementById("respirator-rate").textContent = respiratoryRate; // Respiratory rate value
    document.getElementById("respirator-status").textContent =
      respiratoryRateLevel; // Respiratory rate
    document.getElementById("temp-rate").textContent = tempRate; // Respiratory rate
    document.getElementById("temp-status").textContent = tempRateLevel; // Respiratory rate
    document.getElementById("heart-rate").textContent = heartRate; // Respiratory rate
    document.getElementById("heart-status").textContent = heartRateLevel; // Respiratory rate

    // Populate the diagnostic list card
    const diagnosticList = patient.diagnostic_list;
    const diagnosticListContainer = document.getElementById("diagnostic-list");

    diagnosticList.forEach((diagnostic) => {
      const diagnosticItem = document.createElement("div");
      diagnosticItem.classList.add("diagnostic-item");

      diagnosticItem.innerHTML = `
                <h4>${diagnostic.name}</h4>
                <p>Description: ${diagnostic.description}</p>
                <p>Status: ${diagnostic.status}</p>
            `;

      diagnosticListContainer.appendChild(diagnosticItem);
    });

    // Fetch the lab results array
    const labResults = patient.lab_results;

    // Get the table body element to populate results
    const labResultsTable = document.getElementById("lab-results-table");

    // Clear any previous content
    labResultsTable.innerHTML = "";

    // Loop through the lab results and add them as rows to the table
    labResults.forEach((result) => {
      const row = document.createElement("tr");

      const resultTextCell = document.createElement("td");
      resultTextCell.className = "result-text";
      resultTextCell.textContent = result;

      const resultIconCell = document.createElement("td");
      resultIconCell.className = "result-icon";
      // You can add icons or indicators here if needed, for now it's left blank

      // Append both cells to the row
      row.appendChild(resultTextCell);
      row.appendChild(resultIconCell);

      // Append the row to the table
      labResultsTable.appendChild(row);
    });

    // Render the chart
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
          y: {
            beginAtZero: false,
            min: 60,
            max: 180,
          },
        },
      },
    });
  })
  .catch((error) => console.error("Error fetching data:", error));
