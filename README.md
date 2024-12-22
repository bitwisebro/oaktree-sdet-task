# Playwright Framework - Quick Start Guide

This guide provides the essential commands and steps to get up and running with the Playwright framework for end-to-end testing. This was created for the SDET assessment at Oaktree Software.

## Prerequisites

- Ensure that you have Node.js installed on your machine. You can download it from [nodejs.org](https://nodejs.org/).

## Installation and Setup

1. **Install Project Dependencies**

   Open your terminal and navigate to your project directory. Run the following command to install the necessary dependencies defined in `package.json`:

   ```bash
   npm install
   ```

2. **Install browser binaries**

   After installing Playwright, you need to install the browser binaries:

   ```bash
   npx playwright install
   ```

## Running Tests

1. **Run Playwright Tests**

   Use the following command to run your Playwright tests:

   ```bash
   npx playwright test
   ```

2. **Generate Test Report**

   To generate and view the test report, run:

   ```bash
   npm run report
   ```

   Here is a sample Report: [Report](sample-report.html)
