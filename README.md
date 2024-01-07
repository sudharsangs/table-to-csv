
# Table to CSV

## Overview

The Table to CSV Chrome Extension is a tool that simplifies the process of converting HTML tables into CSV or JSON files. This extension provides a user-friendly interface for selecting a table on a webpage and performing these actions.

## Features

- **Table Selection:** Click on the extension icon and then select the HTML table on the webpage that you want to convert.

- **Download CSV:** Convert the selected table into a CSV file and download it to your computer.

- **Download JSON:** Convert the selected table into a JSON file and download it to your computer.

![](demo.gif)

## How to Use

1. **Installation:**
   - Download the extension folder or clone the repository to your local machine.
   - Run npm install
   - Then run npm run build
   - Open Google Chrome and go to `chrome://extensions/`.
   - Enable "Developer mode" in the top right.
   - Click "Load unpacked" and select the extension folder and then select the dist folder

2. **Usage:**
   - Click on the extension icon in the Chrome toolbar.
   - Select "Start Table Selection" from the menu.
   - Click on the HTML table you want to convert.
   - Choose between the "Download CSV" or "Download JSON" options.

3. **Download CSV:**
   - Click on "Download CSV" to convert the selected table into a CSV file.
   - The CSV file will be downloaded to your computer.

4. **Download JSON:**
   - Click on "Download JSON" to convert the selected table into a JSON file.
   - The JSON file will be downloaded to your computer.

## Development

- This project is written in TypeScript.
- The main logic is split into content.ts, popup.ts, and background.ts.


