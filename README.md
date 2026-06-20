# TypeScript Concurrent Web Crawler

A command-line web crawler built with TypeScript that crawls websites, follows internal links, and generates a report of visited pages.

## Features

* Crawls pages recursively
* Follows only links within the same domain
* Concurrent crawling with configurable limits
* Prevents duplicate page visits
* Tracks page visit counts
* Configurable maximum page limit
* Generates crawl reports

---

## How It Works

1. Start crawling from a base URL.
2. Download the HTML content of the page.
3. Extract all links from the page.
4. Normalize URLs to avoid duplicates.
5. Skip external domains.
6. Visit new pages recursively.
7. Track how many times each page is discovered.
8. Stop when the maximum page limit is reached.
9. Generate a report of all crawled pages.

### Example Flow

```text
https://example.com
        │
        ▼
     Home Page
        │
 ┌──────┼──────┐
 ▼      ▼      ▼
About  Blog  Contact
          │
     ┌────┴────┐
     ▼         ▼
 Post 1     Post 2
```

---

## Installation

Clone the repository:

```bash
git clone https://github.com/dravidpa7/web-crawler-typescript.git
cd web-crawler-typescript
```

Install dependencies:

```bash
npm install
```

---

## Running the Crawler

Crawl a website:

```bash
npm run start https://example.com
```

Example:

```bash
npm run start https://www.dravidpa.dev
```

---

## Configuration

You can configure:

* Maximum concurrent requests
* Maximum pages to crawl

Example:

```ts
crawlSiteAsync(
  "https://example.com",
  5,   // max concurrency
  100  // max pages
);
```

---

## Tech Stack

* TypeScript
* Node.js
* p-limit
* JSDOM

---

## Learning Concepts

This project demonstrates:

* Recursion
* Async/Await
* Concurrency
* Web Scraping
* URL Normalization
* HTML Parsing
* Promise Management
* Graph Traversal Concepts
* Command Line Applications
