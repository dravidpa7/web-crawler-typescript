# TypeScript Web Crawler

A simple command-line web crawler built with **TypeScript** and **Node.js**.

This project crawls websites, makes HTTP requests, parses HTML pages, extracts links, and generates useful reports. It is designed to help understand how web crawlers work and how Node.js can be used to build command-line tools.

## Features

* Crawl web pages from a starting URL
* Normalize URLs
* Extract links from HTML content
* Count internal page visits
* Handle crawling with async/await
* Support concurrent crawling
* Generate readable reports
* Export crawling results as JSON

## Tech Stack

* TypeScript
* Node.js
* JSDOM
* Vitest

## Project Chapters

### 1. Setup

Set up the TypeScript environment and create basic utility functions.

Topics covered:

* TypeScript project setup
* URL normalization
* HTML parsing
* Extracting links from a page

### 2. Crawling

Build the core crawling logic.

Topics covered:

* Making HTTP requests
* Reading HTML pages
* Finding links
* Recursively crawling pages
* Tracking visited pages

### 3. Concurrency

Improve crawler performance by crawling multiple pages at the same time.

Topics covered:

* Async/await
* Promise-based crawling
* Concurrent requests
* Configurable concurrency limits

### 4. Reporting

Analyze and export the crawler results.

Topics covered:

* Page visit counts
* Human-readable reports
* JSON output
* Saving reports to standard output or files

## Installation

```bash
npm install
```

## Run the Project

```bash
npm start <website-url>
```

Example:

```bash
npm start https://example.com
```

## Run Tests

```bash
npm test
```

## Example Output

```txt
REPORT
======
Found 10 internal links to example.com/about
Found 7 internal links to example.com/blog
Found 3 internal links to example.com/contact
```

## Why This Project?

This project is useful for learning:

* How web crawlers work
* How to make HTTP requests in Node.js
* How to parse HTML
* How to build command-line tools
* How async JavaScript works
* How concurrency improves performance
* How SEO tools collect website data

## Future Improvements

* Add sitemap generation
* Add broken link detection
* Add page title and meta description extraction
* Add CSV export
* Add robots.txt support
* Add better error handling

## License

This project is for learning purposes.
