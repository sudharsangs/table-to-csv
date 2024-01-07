let selectingTable = false;
let selectedTable: HTMLTableElement | null = null;

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(request.action,"6")
        if (request.action === 'startTableSelection') {
            console.info('Please click on the table you want to convert.');
            startTableSelection();
        } 
    }
);

function startTableSelection() {
    selectingTable = true;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('click', handleTableClick, { once: true });
}

function applyCustomStyles(table: HTMLTableElement) {
    table.style.border = '2px solid #4285f4';
    table.style.background = '#f0f0f0';
    table.style.opacity = '0.5'
}

function removeCustomStyles(table: HTMLTableElement) {
    table.style.border = '';
    table.style.background = '';
    table.style.opacity = '';
}

function handleMouseMove(event: MouseEvent) {
    if (selectingTable) {
        const element = event.target as HTMLElement;
        const table = element.closest('table') as HTMLTableElement | null;

        if (table) {
            if (selectedTable) {
                selectedTable.classList.remove('html-table-converter-selected');
            }

            selectedTable = table;
            selectedTable.classList.add('html-table-converter-selected');

            applyCustomStyles(selectedTable); 

            chrome.runtime.sendMessage({ action: 'tableSelected' });
        }
    }
}

function handleTableClick(event: MouseEvent) {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('click', handleTableClick);
    selectingTable = false;
    downloadCsv()
}

function downloadCsv() {
    if (!selectedTable) {
        console.error('No table selected. Please select a table first.');
        return;
    }

    const data: string[][] = [];
    const headerRow = selectedTable!.rows[0];

    for (let cellIndex = 0; cellIndex < headerRow.cells.length; cellIndex++) {
        const headerText = headerRow.cells[cellIndex].textContent!.trim();
        data.push([headerText]);
    }

    for (let rowIndex = 1; rowIndex < selectedTable!.rows.length; rowIndex++) {
        const row = selectedTable!.rows[rowIndex];
        const rowData: string[] = [];

        for (let cellIndex = 0; cellIndex < row.cells.length; cellIndex++) {
            const cellText = row.cells[cellIndex].textContent!.trim();
            rowData.push(cellText);
        }

        data.push(rowData);
    }

    const csvContent = data.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });

    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'table_data.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(a.href);
    removeCustomStyles(selectedTable);
}





