
// Declare variables and arrays
const table = document.getElementById("mytable");
const tbody = table.getElementsByTagName("tbody")[0];
const rowsPerPage = 10;
let currentPage = 1;
let tabledata = [];


// Function to insert data into the table
const insertData = (data) => {
    tbody.innerHTML = ""; // Clear the table body first

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, data.length);

    for (let i = startIndex; i < endIndex; i++) {
        const item = data[i];
        let row = tbody.insertRow();
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        let cell3 = row.insertCell(2);
        let cell4 = row.insertCell(3);
        let cell5 = row.insertCell(4);
        cell1.textContent = i + 1;
        cell2.textContent = item.title;
        cell3.textContent = item.body;


        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.classList.add("btn", "btn-primary");
        editButton.addEventListener("click", () => handleEditClick(item));

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("btn", "btn-danger");
        deleteButton.addEventListener("click", () => handleDeleteClick(item));

        cell4.appendChild(editButton);
        cell5.appendChild(deleteButton);
    }
    
    if (data.length < 10) {
        document.getElementById("mytable").style.display.overflowY = "hidden"; // Hide the vertical scrollbar
    }
    if (data.length < 10) {
        document.getElementById("prevPage").style.display = "none";
        document.getElementById("nextPage").style.display = "none";
    }
   
};

// Function to handle "Edit" button click
const handleEditClick = (item) => {
    // Populate the form fields with the data from the clicked row
    document.getElementById("title").value = item.title;
    document.getElementById("textarea").value = item.body;

    // Store the item ID for later reference (for updating)
    document.getElementById("btn").dataset.itemId = item.id;
};

// Function to handle "Delete" button click
const handleDeleteClick = (item) => {
    // Handle delete action here
    console.log("Delete clicked for ID: " + item.id);

    // Remove the item from the data
    tabledata = tabledata.filter((dataItem) => dataItem.id !== item.id);

    // Refresh the table
    insertData(tabledata);
};

// Function to update the pagination buttons
const updatePagination = () => {
    const totalPages = Math.ceil(tabledata.length / rowsPerPage);
    document.getElementById("prevPage").disabled = currentPage === 1;
    document.getElementById("nextPage").disabled = currentPage === totalPages;
};


// Event listener for the "Save" button
document.getElementById("btn").onclick = function (e) {
    e.preventDefault();
    const title_value = document.getElementById("title").value;
    const text_value = document.getElementById("textarea").value;

    // Check if an item ID is stored in the button's data attribute
    const itemId = document.getElementById("btn").dataset.itemId;

    if (itemId) {
        // You're updating an existing item
        const indexToUpdate = tabledata.findIndex((item) => item.id === parseInt(itemId));
        if (indexToUpdate !== -1) {
            // Update the item's title and body
            tabledata[indexToUpdate].title = title_value;
            tabledata[indexToUpdate].body = text_value;

            // Refresh the table and clear the form fields
            insertData(tabledata);
            document.getElementById("title").value = "";
            document.getElementById("textarea").value = "";
            delete document.getElementById("btn").dataset.itemId;
        }
    } else {
        // You're adding a new item
        const newId = tabledata.length > 0 ? tabledata[tabledata.length - 1].id + 1 : 1;
        const formData = {
            userId: 1,
            id: newId,
            title: title_value,
            body: text_value,
        };

        // Add the new item to the data and refresh the table
        tabledata.push(formData);
        insertData(tabledata);

        // Clear the form fields
        document.getElementById("title").value = "";
        document.getElementById("textarea").value = "";
    }
};

// Fetch data from the JSON API on page load
const fetchData = async () => {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts");
        const data = await response.json();
        tabledata = data;
        insertData(tabledata);
    } catch (error) {
        console.error(error);
    }
   
};

const filterTable = (searchTerm) => {
    const filteredData = tabledata.filter((item) => {
        return (
            item.title.toLowerCase().includes(searchTerm) ||
            item.body.toLowerCase().includes(searchTerm)
        );
    });
    insertData(filteredData);
};

// Event listener for the search input
document.getElementById("search-btn").onclick = function (e) {
    e.preventDefault();
    const searchInput = document.getElementById("search-input");
    const searchTerm = searchInput.value.trim().toLowerCase();
    filterTable(searchTerm);
};

// Event listener for "Previous" button
document.getElementById("prevPage").addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        insertData(tabledata);
        updatePagination();
    }
   
});

// Event listener for "Next" button
document.getElementById("nextPage").addEventListener("click", () => {
    const totalPages = Math.ceil(tabledata.length / rowsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        insertData(tabledata);
        updatePagination();
    }
});


// Fetch data on page load
fetchData();


