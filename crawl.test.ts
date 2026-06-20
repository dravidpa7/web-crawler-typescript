import { expect, test} from 'vitest'
import { 
  normalizeURL, 
  getHeadingFromHTML, 
  getFirstParagraphFromHTML,
  getURLsFromHTML,
  getImagesFromHTML,
  extractPageData
} from './src/crawl.ts'

test("normalizeURL protocal",() =>{
  const input = "https://crawler-test.com/path";
  const actual = normalizeURL(input);
  const expected = "crawler-test.com/path";
  expect(actual).toEqual(expected);
});

test("normalizeURL slash", ()=>{
  const input = "https://crawler-test.com/path/";
  const actual = normalizeURL(input);
  const expected = "crawler-test.com/path";
  expect(actual).toEqual(expected);
});

test("normalizeURL capitals", () => {
  const input = "https://CRAWLER-TEST.com/path";
  const actual = normalizeURL(input);
  const expected = "crawler-test.com/path";
  expect(actual).toEqual(expected);
});

test("normalizeURL http", () => {
  const input = "http://CRAWLER-TEST.com/path";
  const actual = normalizeURL(input);
  const expected = "crawler-test.com/path";
  expect(actual).toEqual(expected);
});


test("Get Heading form of HTML",()=>{
  const inputBody = `<html><body><h1>Test Title</h1></body></html>`;
  const actual = getHeadingFromHTML(inputBody);
  const expected = "Test Title";
  expect(actual).toEqual(expected);
});

test("Get First Paragraph From HTML main priority", ()=>{
  const inputBody = `
    <html><body>
      <p>Outside paragraph.</p>
      <main>
        <p>Main paragraph.</p>
      </main>
    </body></html>
  `;
  const actual = getFirstParagraphFromHTML(inputBody);
  const expected = "Main paragraph.";
  expect(actual).toEqual(expected);
});

test("If Element not present in DOM return Empty", ()=> {
  const inputBody = `
    <html>
      <body>
        <main>
        </main>
      </body>
    </html>
    `;
    const actual = getFirstParagraphFromHTML(inputBody);
    const expected = ""
    expect(actual).toEqual(expected);
})

test("Get URLs From HTML absolute", () => {
  const inputURL = "https://crawler-test.com";
  const inputBody = `
    <html>
      <body>
        <a href="https://crawler-test.com">
        <span>Boot.dev</span>
        </a>
      </body>
    </html>`;

  const actual = getURLsFromHTML(inputBody, inputURL);
  const expected = ["https://crawler-test.com/"];

  expect(actual).toEqual(expected);
});

test("Get URLs From HTML relative", () => {
  const inputURL = "https://crawler-test.com";
  const inputBody = `
    <html>
      <body>
        <a href="/path/one">
        <span>Boot.dev</span>
        </a>
      </body>
    </html>`;

  const actual = getURLsFromHTML(inputBody, inputURL);
  const expected = ["https://crawler-test.com/path/one"];

  expect(actual).toEqual(expected);
});


test("Get Images from HTML Relative", ()=>{
  const inputURL = "https://crawler-test.com";
  const inputBody = `
    <html>
      <body>
        <img src="/logo.png" alt="Logo">
      </body>
    </html>`;
  
  const actual = getImagesFromHTML(inputBody, inputURL);
  const expected = ["https://crawler-test.com/logo.png"];

  expect(actual).toEqual(expected);
})

test("Get Images from HTML Absolute", ()=>{
  const inputURL = "https://crawler-test.com";
  const inputBody = `
  <html>
    <body>
      <img src="https://crawler-test.com/logo.png" alt="Logo">
    </body>
  </html>
  `
  const actual = getImagesFromHTML(inputBody,inputURL);
  const expected = ["https://crawler-test.com/logo.png"]

  expect(actual).toEqual(expected);
})

test("Get multiple Image Url from HTML", ()=>{
  const inputURL = "https://crawler-test.com";
  const inputBody = `
  <html>
    <body>
      <img src="/logo.png" alt="Logo">
      <img src="/demo.png" alt="Demo">
    </body>
  </html>
  `
  const actual = getImagesFromHTML(inputBody,inputURL);
  const expected = [
    "https://crawler-test.com/logo.png",
    "https://crawler-test.com/demo.png"
  ]
  expect(actual).toEqual(expected);
})

test("Get URLs multiple From HTML", () => {
  const inputURL = "https://crawler-test.com";
  const inputBody = `
    <html>
      <body>
        <a href="/path/one"></a>
        <span>Boot.dev</span>
        <a href="/path/two"></a>
        <main>
          <a href="/path/three"></a>
        </main>
      </body>
    </html>`;

  const actual = getURLsFromHTML(inputBody, inputURL);
  const expected = [
    "https://crawler-test.com/path/one",
    "https://crawler-test.com/path/two",
    "https://crawler-test.com/path/three"
  ];

  expect(actual).toEqual(expected);
});

test("Extrated Page data basic ",()=>{
  const inputURL = "https://crawler-test.com"
  const inputBody = `
    <html>
      <body>
        <h1>Test Title</h1>
        <p>This is the first paragraph.</p>
        <a href="/link1">Link 1</a>
        <img src="/image1.jpg" alt="Image 1">
      </body>
    </html>
  `;
  const actual = extractPageData(inputBody, inputURL);
  const expected = {
    url: "https://crawler-test.com",
    heading: "Test Title",
    first_paragraph: "This is the first paragraph.",
    outgoing_links: ["https://crawler-test.com/link1"],
    image_urls: ["https://crawler-test.com/image1.jpg"],
  };
  expect(actual).toEqual(expected);
})