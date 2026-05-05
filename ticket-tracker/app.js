// Data Storage
let tickets = [];
let currentEditIndex = null;
let filteredTickets = [];
let sortColumn = null;
let sortDirection = 'asc';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    setupEventListeners();
    populateFilters();
    renderTable();
});

// Event Listeners
function setupEventListeners() {
    // File Upload
    document.getElementById('uploadBox').addEventListener('click', () => {
        document.getElementById('fileInput').click();
    });

    document.getElementById('chooseFileBtn').addEventListener('click', (e) => {
        e.stopPropagation();
        document.getElementById('fileInput').click();
    });

    document.getElementById('fileInput').addEventListener('change', handleFileUpload);

    // Drag and Drop
    const uploadBox = document.getElementById('uploadBox');
    uploadBox.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadBox.classList.add('drag-over');
    });
    uploadBox.addEventListener('dragleave', () => {
        uploadBox.classList.remove('drag-over');
    });
    uploadBox.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadBox.classList.remove('drag-over');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });

    // Buttons
    document.getElementById('templateBtn').addEventListener('click', downloadTemplate);
    document.getElementById('exportBtn').addEventListener('click', exportToExcel);
    document.getElementById('addTicketBtn').addEventListener('click', openAddModal);
    document.getElementById('clearFiltersBtn').addEventListener('click', clearFilters);

    // Filters
    document.getElementById('technicianFilter').addEventListener('change', applyFilters);
    document.getElementById('modeFilter').addEventListener('change', applyFilters);
    document.getElementById('conceptFilter').addEventListener('change', applyFilters);
    document.getElementById('typeFilter').addEventListener('change', applyFilters);
    document.getElementById('statusFilter').addEventListener('change', applyFilters);

    // Modal
    setupModalListeners('editModal', 'editForm', 'cancelEditBtn', handleEditSubmit);
    setupModalListeners('addModal', 'addForm', 'cancelAddBtn', handleAddSubmit);

    // Table headers for sorting
    document.querySelectorAll('.tickets-table th').forEach((header, index) => {
        if (index < 10) { // All columns except Actions
            header.addEventListener('click', () => {
                const columns = ['reqId', 'date', 'technician', 'requester', 'subject', 'mode', 'concept', 'type', 'age', 'overdue'];
                sortTable(columns[index]);
            });
        }
    });
}

function setupModalListeners(modalId, formId, cancelBtnId, submitHandler) {
    const modal = document.getElementById(modalId);
    const form = document.getElementById(formId);
    const cancelBtn = document.getElementById(cancelBtnId);
    const closeBtn = modal.querySelector('.close');

    closeBtn.addEventListener('click', () => modal.style.display = 'none');
    cancelBtn.addEventListener('click', () => modal.style.display = 'none');
    form.addEventListener('submit', submitHandler);

    window.addEventListener('click', (e) => {
        if (e.target == modal) {
            modal.style.display = 'none';
        }
    });
}

// File Upload Handler
function handleFileUpload(e) {
    const file = e.target.files[0];
    handleFile(file);
}

function handleFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            
            // Map ServiceNow columns to our format
            tickets = jsonData.map(row => ({
                reqId: row['Request ID'] || row['REQ ID'] || row['Req ID'] || '',
                date: formatDate(row['Date'] || row['DATE'] || new Date().toISOString().split('T')[0]),
                technician: row['Resolver Name'] || row['Technician'] || row['TECHNICIAN'] || '',
                requester: row['Requester'] || row['REQUESTER'] || '',
                subject: row['Subject'] || row['SUBJECT'] || '',
                mode: row['Mode of support'] || row['Mode'] || row['MODE'] || 'Remote Support',
                concept: row['Concept'] || row['CONCEPT'] || '',
                type: row['Type'] || row['TYPE'] || 'Incident',
                age: parseInt(row['Age'] || row['AGE'] || 0),
                overdue: row['Overdue'] || row['OVERDUE'] || 'No'
            }));
            
            saveData();
            populateFilters();
            applyFilters();
            alert(`✅ Successfully uploaded ${tickets.length} tickets!`);
        } catch (error) {
            alert('❌ Error uploading file: ' + error.message);
        }
    };
    reader.readAsArrayBuffer(file);
}

function formatDate(dateStr) {
    if (!dateStr) return new Date().toISOString().split('T')[0];
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
        return new Date().toISOString().split('T')[0];
    }
    return date.toISOString().split('T')[0];
}

// Template Download
function downloadTemplate() {
    const templateData = [
        {
            'Request ID': 'INC0001234',
            'Date': '2026-05-01',
            'Resolver Name': 'John Smith',
            'Requester': 'Alice Johnson',
            'Subject': 'System Login Issue',
            'Mode of support': 'Remote Support',
            'Concept': 'Access Management',
            'Type': 'Incident',
            'Age': 2,
            'Overdue': 'No'
        },
        {
            'Request ID': 'INC0001235',
            'Date': '2026-05-02',
            'Resolver Name': 'Jane Doe',
            'Requester': 'Bob Wilson',
            'Subject': 'Password Reset',
            'Mode of support': 'Store Visit',
            'Concept': 'Access Management',
            'Type': 'Request',
            'Age': 1,
            'Overdue': 'No'
        }
    ];
    
    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template');
    XLSX.writeFile(wb, `ServiceNow_Template_${new Date().toISOString().split('T')[0]}.xlsx`);
}

// Export to Excel
function exportToExcel() {
    const dataToExport = filteredTickets.length > 0 ? filteredTickets : tickets;
    const ws = XLSX.utils.json_to_sheet(dataToExport.map(t => ({
        'Request ID': t.reqId,
        'Date': t.date,
        'Resolver Name': t.technician,
        'Requester': t.requester,
        'Subject': t.subject,
        'Mode of support': t.mode,
        'Concept': t.concept,
        'Type': t.type,
        'Age': t.age,
        'Overdue': t.overdue
    })));
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Tickets');
    XLSX.writeFile(wb, `TicketReview_${new Date().toISOString().split('T')[0]}.xlsx`);
    alert('✅ Exported ' + dataToExport.length + ' tickets');
}

// Filters
function populateFilters() {
    const technicians = [...new Set(tickets.map(t => t.technician))].sort();
    const modes = [...new Set(tickets.map(t => t.mode))].sort();
    const concepts = [...new Set(tickets.map(t => t.concept))].sort();
    const types = [...new Set(tickets.map(t => t.type))].sort();

    populateSelect('technicianFilter', technicians);
    populateSelect('modeFilter', modes);
    populateSelect('conceptFilter', concepts);
    populateSelect('typeFilter', types);
}

function populateSelect(selectId, options) {
    const select = document.getElementById(selectId);
    const currentValue = select.value;
    select.innerHTML = `<option value="">All ${options.length > 0 ? options[0] + 's' : 'Options'}</option>`;
    options.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option;
        opt.textContent = option;
        select.appendChild(opt);
    });
    if (currentValue) select.value = currentValue;
}

function applyFilters() {
    const techFilter = document.getElementById('technicianFilter').value;
    const modeFilter = document.getElementById('modeFilter').value;
    const conceptFilter = document.getElementById('conceptFilter').value;
    const typeFilter = document.getElementById('typeFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;

    filteredTickets = tickets.filter(ticket => {
        const techMatch = !techFilter || ticket.technician === techFilter;
        const modeMatch = !modeFilter || ticket.mode === modeFilter;
        const conceptMatch = !conceptFilter || ticket.concept === conceptFilter;
        const typeMatch = !typeFilter || ticket.type === typeFilter;
        const statusMatch = !statusFilter || (statusFilter === 'Overdue' && ticket.overdue === 'Yes') ||
                           (statusFilter === 'Pending' && ticket.overdue === 'No');
        
        return techMatch && modeMatch && conceptMatch && typeMatch && statusMatch;
    });

    renderTable();
}

function clearFilters() {
    document.getElementById('technicianFilter').value = '';
    document.getElementById('modeFilter').value = '';
    document.getElementById('conceptFilter').value = '';
    document.getElementById('typeFilter').value = '';
    document.getElementById('statusFilter').value = '';
    filteredTickets = [];
    sortColumn = null;
    renderTable();
}

// Sorting
function sortTable(column) {
    if (sortColumn === column) {
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        sortColumn = column;
        sortDirection = 'asc';
    }

    const dataToSort = filteredTickets.length > 0 ? filteredTickets : tickets;
    dataToSort.sort((a, b) => {
        const valA = a[column];
        const valB = b[column];
        
        if (typeof valA === 'number') {
            return sortDirection === 'asc' ? valA - valB : valB - valA;
        }
        
        const strA = String(valA).toLowerCase();
        const strB = String(valB).toLowerCase();
        return sortDirection === 'asc' ? strA.localeCompare(strB) : strB.localeCompare(strA);
    });

    renderTable();
}

// Render Table
function renderTable() {
    const tbody = document.getElementById('ticketsBody');
    const dataToRender = filteredTickets.length > 0 ? filteredTickets : tickets;
    
    tbody.innerHTML = '';
    
    if (dataToRender.length === 0) {
        tbody.innerHTML = '<tr><td colspan="11" style="text-align: center; padding: 40px; color: #999;">📭 No tickets found. Upload a file to get started.</td></tr>';
        return;
    }

    dataToRender.forEach((ticket, index) => {
        const actualIndex = tickets.indexOf(ticket);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${ticket.reqId}</td>
            <td>${ticket.date}</td>
            <td>${ticket.technician}</td>
            <td>${ticket.requester}</td>
            <td>${ticket.subject}</td>
            <td>${ticket.mode}</td>
            <td>${ticket.concept}</td>
            <td>${ticket.type}</td>
            <td>${ticket.age}</td>
            <td class="${ticket.overdue === 'Yes' ? 'status-overdue' : 'status-ok'}">${ticket.overdue}</td>
            <td class="actions">
                <button class="btn btn-edit" onclick="openEditModal(${actualIndex})">✏️ Edit</button>
                <button class="btn btn-delete" onclick="deleteTicket(${actualIndex})">🗑️ Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Edit Modal
function openEditModal(index) {
    currentEditIndex = index;
    const ticket = tickets[index];
    
    document.getElementById('editReqId').value = ticket.reqId;
    document.getElementById('editDate').value = ticket.date;
    document.getElementById('editTechnician').value = ticket.technician;
    document.getElementById('editRequester').value = ticket.requester;
    document.getElementById('editSubject').value = ticket.subject;
    document.getElementById('editMode').value = ticket.mode;
    document.getElementById('editConcept').value = ticket.concept;
    document.getElementById('editType').value = ticket.type;
    document.getElementById('editAge').value = ticket.age;
    document.getElementById('editOverdue').value = ticket.overdue;
    
    document.getElementById('editModal').style.display = 'block';
}

function handleEditSubmit(e) {
    e.preventDefault();
    
    tickets[currentEditIndex] = {
        reqId: document.getElementById('editReqId').value,
        date: document.getElementById('editDate').value,
        technician: document.getElementById('editTechnician').value,
        requester: document.getElementById('editRequester').value,
        subject: document.getElementById('editSubject').value,
        mode: document.getElementById('editMode').value,
        concept: document.getElementById('editConcept').value,
        type: document.getElementById('editType').value,
        age: parseInt(document.getElementById('editAge').value),
        overdue: document.getElementById('editOverdue').value
    };
    
    saveData();
    populateFilters();
    applyFilters();
    document.getElementById('editModal').style.display = 'none';
    alert('✅ Ticket updated successfully!');
}

// Add Modal
function openAddModal() {
    document.getElementById('addReqId').value = '';
    document.getElementById('addDate').value = new Date().toISOString().split('T')[0];
    document.getElementById('addTechnician').value = '';
    document.getElementById('addRequester').value = '';
    document.getElementById('addSubject').value = '';
    document.getElementById('addMode').value = 'Remote Support';
    document.getElementById('addConcept').value = '';
    document.getElementById('addType').value = 'Incident';
    document.getElementById('addAge').value = 0;
    document.getElementById('addOverdue').value = 'No';
    
    document.getElementById('addModal').style.display = 'block';
}

function handleAddSubmit(e) {
    e.preventDefault();
    
    const newTicket = {
        reqId: document.getElementById('addReqId').value,
        date: document.getElementById('addDate').value,
        technician: document.getElementById('addTechnician').value,
        requester: document.getElementById('addRequester').value,
        subject: document.getElementById('addSubject').value,
        mode: document.getElementById('addMode').value,
        concept: document.getElementById('addConcept').value,
        type: document.getElementById('addType').value,
        age: parseInt(document.getElementById('addAge').value),
        overdue: document.getElementById('addOverdue').value
    };
    
    tickets.push(newTicket);
    saveData();
    populateFilters();
    applyFilters();
    document.getElementById('addModal').style.display = 'none';
    alert('✅ New ticket added successfully!');
}

// Delete Ticket
function deleteTicket(index) {
    if (confirm('Are you sure you want to delete this ticket?')) {
        tickets.splice(index, 1);
        saveData();
        populateFilters();
        applyFilters();
        alert('✅ Ticket deleted successfully!');
    }
}

// Local Storage
function saveData() {
    localStorage.setItem('ticketData', JSON.stringify(tickets));
}

function loadData() {
    const saved = localStorage.getItem('ticketData');
    if (saved) {
        tickets = JSON.parse(saved);
    }
}
