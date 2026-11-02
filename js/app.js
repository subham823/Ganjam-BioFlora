// ========================================
// GANJAM BIOFLORA - PLANT DATABASE
// ========================================

let plants = [];

// HTML elements
const plantGrid = document.getElementById("plantGrid");
const searchInput = document.getElementById("searchInput");
const typeFilter = document.getElementById("typeFilter");
const resultCount = document.getElementById("resultCount");

// ----------------------------------------
// Load plant database
// ----------------------------------------

async function loadPlants() {
    try {
        const response = await fetch("data/plants.json");

        if (!response.ok) {
            throw new Error("plants.json could not be loaded");
        }

        plants = await response.json();

        displayPlants(plants);

    } catch (error) {
        console.error(error);

        if (plantGrid) {
            plantGrid.innerHTML = `
                <div class="error-box">
                    <h3>⚠️ Plant database load nahi hua</h3>
                    <p>Check karo ki <b>data/plants.json</b> file correctly saved hai.</p>
                </div>
            `;
        }
    }
}

// ----------------------------------------
// Display plants
// ----------------------------------------

function displayPlants(list) {

    if (!plantGrid) return;

    plantGrid.innerHTML = "";

    if (list.length === 0) {
        plantGrid.innerHTML = `
            <div class="no-result">
                <h3>🌿 No plant found</h3>
                <p>Try another plant name.</p>
            </div>
        `;

        if (resultCount) {
            resultCount.textContent = "0 plants found";
        }

        return;
    }

    list.forEach((plant) => {

        const card = document.createElement("div");

        card.className = "plant-card";

        card.innerHTML = `
            <div class="plant-icon">
                🌿
            </div>

            <div class="plant-content">

                <span class="plant-type">
                    ${plant.type || "Plant"}
                </span>

                <h2>
                    ${plant.localName || "Unknown"}
                </h2>

                <p class="scientific-name">
                    ${plant.scientificName || ""}
                </p>

                <p>
                    <strong>Family:</strong>
                    ${plant.family || "Not available"}
                </p>

                <p>
                    <strong>Location:</strong>
                    ${plant.location || "Ganjam, Odisha"}
                </p>

                <button
                    class="details-btn"
                    onclick="showPlantDetails(${plant.id})">
                    View Details →
                </button>

            </div>
        `;

        plantGrid.appendChild(card);
    });

    if (resultCount) {
        resultCount.textContent =
            `${list.length} plant${list.length !== 1 ? "s" : ""} found`;
    }
}

// ----------------------------------------
// Search plants
// ----------------------------------------

function searchPlants() {

    const searchText =
        searchInput?.value.toLowerCase().trim() || "";

    const selectedType =
        typeFilter?.value || "all";

    const filteredPlants = plants.filter((plant) => {

        const searchMatch =
            plant.localName?.toLowerCase().includes(searchText) ||
            plant.scientificName?.toLowerCase().includes(searchText) ||
            plant.family?.toLowerCase().includes(searchText) ||
            plant.location?.toLowerCase().includes(searchText);

        const typeMatch =
            selectedType === "all" ||
            plant.type === selectedType;

        return searchMatch && typeMatch;
    });

    displayPlants(filteredPlants);
}

// ----------------------------------------
// Plant details popup
// ----------------------------------------

function showPlantDetails(id) {

    const plant = plants.find((p) => p.id === id);

    if (!plant) return;

    const overlay = document.createElement("div");

    overlay.className = "plant-modal";

    overlay.innerHTML = `

        <div class="modal-content">

            <button
                class="close-modal"
                onclick="this.closest('.plant-modal').remove()">
                ×
            </button>

            <div class="modal-icon">
                🌿
            </div>

            <span class="plant-type">
                ${plant.type || "Plant"}
            </span>

            <h1>
                ${plant.localName}
            </h1>

            <p class="scientific-name">
                ${plant.scientificName}
            </p>

            <hr>

            <div class="detail-section">

                <h3>🔬 Botanical Information</h3>

                <p>
                    <strong>Family:</strong>
                    ${plant.family || "Not available"}
                </p>

                <p>
                    <strong>Plant Type:</strong>
                    ${plant.type || "Not available"}
                </p>

                <p>
                    <strong>Ganjam Location:</strong>
                    ${plant.location || "Not available"}
                </p>

            </div>

            <div class="detail-section">

                <h3>🌱 Parts Used</h3>

                <div class="tag-container">

                    ${(plant.partsUsed || [])
                        .map(part => `<span class="tag">${part}</span>`)
                        .join("")}

                </div>

            </div>

            <div class="detail-section">

                <h3>🧪 Documented Traditional Uses</h3>

                <ul>

                    ${(plant.traditionalUses || [])
                        .map(use => `<li>${use}</li>`)
                        .join("")}

                </ul>

                <p class="warning-note">
                    ⚠️ These entries describe documented traditional
                    uses and are not medical treatment instructions.
                </p>

            </div>

            <div class="detail-section">

                <h3>🧬 Biotechnology / Research Relevance</h3>

                <p>
                    ${plant.researchRelevance || "Research information not available."}
                </p>

            </div>

            <div class="detail-section">

                <h3>📚 Evidence</h3>

                <p>
                    ${plant.evidenceType || "Source information available"}
                </p>

                <p>
                    <strong>Source:</strong>
                    ${plant.source || "Not available"}
                </p>

            </div>

        </div>
    `;

    document.body.appendChild(overlay);

    overlay.addEventListener("click", (event) => {

        if (event.target === overlay) {
            overlay.remove();
        }

    });
}

// ----------------------------------------
// Search events
// ----------------------------------------

if (searchInput) {
    searchInput.addEventListener("input", searchPlants);
}

if (typeFilter) {
    typeFilter.addEventListener("change", searchPlants);
}

// ----------------------------------------
// Start application
// ----------------------------------------

loadPlants();