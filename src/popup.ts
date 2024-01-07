document.getElementById('selectTableButton')!.addEventListener('click', function () {
    if (typeof browser !== 'undefined') {
        browser.tabs.query({ active: true, currentWindow: true }).then(function (tabs) {
            browser.tabs.sendMessage(tabs[0].id ?? 0, { action: 'startTableSelection' });
        }).catch(function (error) {
            console.error('Error querying tabs:', error);
        });
    } else if (typeof chrome !== 'undefined') {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id ?? 0, { action: 'startTableSelection' });
        });
    }
});
