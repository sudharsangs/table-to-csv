let selectingTable = false;
let selectedTable: HTMLTableElement | null = null;
let overlayDiv: HTMLDivElement | null = null;

function sendMessageToBackground(message: any) {
    if (chrome && chrome.runtime) {
        chrome.runtime.sendMessage(message);
    } else if (browser && browser.runtime) {
        browser.runtime.sendMessage(message);
    } else {
        console.error("Cannot send message to background script. Browser extension APIs not available.");
    }
}
if (chrome.runtime) {
    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            if (request.action === 'startTableSelection') {
                console.info('Please click on the table you want to convert.');
                startTableSelection();
            } else if (request.action === 'downloadCsv') {
                if (!selectedTable) {
                    alert('No table selected. Please select a table first.');
                } else {
                    downloadCsv();
                }
            }
        }
    );

} else if (browser.runtime) {
    browser.runtime.onMessage.addListener((message, sender) => {
        if (message.action === 'startTableSelection') {
            console.info('Please click on the table you want to convert.');
            startTableSelection();
        } else if (message.action === 'downloadCsv') {
            if (!selectedTable) {
                alert('No table selected. Please select a table first.');
            } else {
                downloadCsv();
            }
        }
    });
}



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


            sendMessageToBackground({ action: 'tableSelected' });
        }
    }
}

function handleTableClick(event: MouseEvent) {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('click', handleTableClick);
    selectingTable = false;
    showOverlay();
}

const buttonStyles = {
    backgroundColor: "#0065A1",
    border: "1px solid #0065A1",
    color: "#fff",
    width: "auto",
    padding: "12px",
    borderRadius: "21px"
}


function showOverlay() {
    if (!overlayDiv) {
        overlayDiv = document.createElement('div');
        overlayDiv.id = "extension"
        overlayDiv.style.position = 'absolute';
        overlayDiv.style.display = "flex";
        overlayDiv.style.alignItems = "center";
        overlayDiv.style.justifyContent = "center";
        overlayDiv.style.top = '50%';
        overlayDiv.style.right = '50%';
        overlayDiv.style.width = 'auto';
        overlayDiv.style.height = 'auto';
        overlayDiv.style.background = 'rgba(0,0,0,0.9)';
        overlayDiv.style.borderRadius = '5px';
        overlayDiv.style.padding = '12px'
        overlayDiv.style.zIndex = '9999';

        const downloadButton = document.createElement('button');
        downloadButton.id = 'downloadCsvButton';
        for (const property in buttonStyles) {
            if (buttonStyles.hasOwnProperty(property)) {
                (downloadButton.style as any)[property] = (buttonStyles as any)[property];
            }
        }
        downloadButton.style.marginRight = '10px'
        downloadButton.addEventListener('click', downloadCsv);
        downloadButton.innerText = "Download CSV"
        overlayDiv.appendChild(downloadButton);

        const downloadJsonButton = document.createElement('button');
        downloadJsonButton.id = 'downloadJsonButton';
        downloadJsonButton.innerText = "Download JSON"
        downloadJsonButton.addEventListener('click', downloadJson)
        for (const property in buttonStyles) {
            if (buttonStyles.hasOwnProperty(property)) {
                (downloadJsonButton.style as any)[property] = (buttonStyles as any)[property];
            }
        }
        overlayDiv.appendChild(downloadJsonButton);
        selectedTable!.style.position = "relative"
        document.body.appendChild(overlayDiv);
        document.addEventListener('click', function (event) {
            if (!overlayDiv!.contains(event.target as Node)) {
                closeOverlay();
            }
        });
    } else {
        overlayDiv.style.display = 'block';
    }
}

function closeOverlay() {
    if (overlayDiv) {
        overlayDiv.style.display = 'none';
    }
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
    a.download = `${document.title}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(a.href);
    removeCustomStyles(selectedTable);
}

function downloadJson() {
    if (!selectedTable) {
        console.error('No table selected. Please select a table first.');
        return;
    }

    const data: any[] = [];
    const headerRow = selectedTable!.rows[0];

    for (let rowIndex = 1; rowIndex < selectedTable!.rows.length; rowIndex++) {
        const row = selectedTable!.rows[rowIndex];
        const rowData: { [key: string]: string } = {};

        for (let cellIndex = 0; cellIndex < row.cells.length; cellIndex++) {
            const headerText = headerRow.cells[cellIndex].textContent!.trim();
            const cellText = row.cells[cellIndex].textContent!.trim();
            rowData[headerText] = cellText;
        }

        data.push(rowData);
    }

    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });

    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${document.title}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(a.href);
    removeCustomStyles(selectedTable);
}







