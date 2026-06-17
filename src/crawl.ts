import { JSDOM } from 'jsdom'

export function normalizeURL(url: string){
  const urlObj = new URL(url);
  let fullPath = `${urlObj.host}${urlObj.pathname}`;
  if (fullPath.slice(-1) === "/"){
  fullPath = fullPath.slice(0,-1);
  }
  return fullPath; 
}

export function getHeadingFromHTML(html: string): string{
   try {
      const dom = new JSDOM(html);
      const doc = dom.window.document
      const h1 = doc.querySelector("h1") ?? doc.querySelector("h2")
      return (h1?.textContent ?? "").trim()
   } catch (error) {
      return ""
   }
}

export function getFirstParagraphFromHTML( html : string) :string{
   try {
      const dom = new JSDOM(html)
      const doc = dom.window.document
      const main = doc.querySelector('main')
      const p = main?.querySelector('p')?? doc.querySelector('p');
      return (p?.textContent ?? "").trim()
   } catch {
      return ""
   }
}

export function getURLsFromHTML(html :string, baseURL :string) :string[]{
   const urls: string[] = [];
   try {
      const dom = new JSDOM(html)
      const doc = dom.window.document
      const anchors = doc.querySelectorAll('a')
      
      anchors.forEach((anchor)=>{
         const href = anchor.getAttribute('href');
         if(!href) return ;
         try{
            const absoluteURL = new URL(href,baseURL).toString();
            urls.push(absoluteURL);
         }
         catch(error){
            console.log(`invalid href ${href}`, error)
         }
      })
   } catch {
      console.log("Failed to Parse HTML")
   }
   return urls;
}

export function getImagesFromHTML(html: string, baseURL: string) :string[]{
   const imageURLs: string[] = [];
   try {
      const dom = new JSDOM(html)
      const doc = dom.window.document
      const images = doc.querySelectorAll('img')
      images.forEach((img)=>{
         const src = img.getAttribute('src');
         if(!src) return ;
         try {
            const absoluteURL = new URL(src,baseURL).toString();
            imageURLs.push(absoluteURL);
         } catch (error) {
            console.log(`invalid href ${src}`, error);
         }
      })
   } catch (error) {
      console.log(error);
   }
   return imageURLs;
}

export interface ExtractPageData{
   url: string,
   heading: string,
   first_paragraph: string,
   outgoing_links: string[],
   image_urls: string[]
}

export function extractPageData(html : string, pageURL :string): ExtractPageData{

   return{
      url: pageURL,
      heading: getHeadingFromHTML(html),
      first_paragraph: getFirstParagraphFromHTML(html),
      outgoing_links: getURLsFromHTML(html,pageURL),
      image_urls: getImagesFromHTML(html,pageURL)
   }
}

export async function getHTML(url:string){
   console.log(`crawling ${url}`);
   let response;
   try {
      response = await fetch(url,{
            headers:{
               'User-Agent':'BootCrawler/1.0'
            }
      });
   }  
   catch (error) {
      throw new Error(`Got Network error: ${(error as Error).message}`);
   }
   
   if(!response.ok){
      console.log(`HTTP error! Status: ${response.status}`);
      return;
   }

   const content_type = response.headers.get("content-type");

   if (!content_type || !content_type?.includes("text/html")){
      console.log("This is not a html") 
      return;
   }

   const html = response.text();
   return html;
}

export async function crawlPage(
  baseURL: string,
  currentURL: string = baseURL,
  pages: Record<string, number> ={}
){
   let html = '';
   const basePageHost = new URL(baseURL).hostname;
   const currentPageHost = new URL(currentURL).hostname;

   if (basePageHost !== currentPageHost){
      return pages;
   }

   const normalizedCurrentURL = normalizeURL(currentURL);

   if(pages[normalizedCurrentURL]>0){
      pages[normalizedCurrentURL]++;
      return pages
   }

   pages[normalizedCurrentURL] = 1

   console.log(`crawling current url ${normalizedCurrentURL}`);

   try {
      html = await getHTML(currentURL);
   } catch (error) {
      console.log(`${error}`)
      return pages;
   }

   const nextURLs = getURLsFromHTML(html,baseURL);

   for(const nextURL of nextURLs){
      pages = await crawlPage(baseURL, nextURL, pages)
   }

   return pages;
}

