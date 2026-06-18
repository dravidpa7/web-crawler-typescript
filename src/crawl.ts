import { JSDOM } from 'jsdom'
import pLimit from 'p-limit';


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

class ConcurrentCrawler {
   public baseURL : string;
   public pages : Record<string, number>;
   public limit : <T>(fn:() => Promise<T>)=> Promise<T>;

   constructor( baseURL : string, maxConcurrency : number = 5){
      this.baseURL = baseURL;
      this.pages = {};
      this.limit = pLimit(maxConcurrency);
   }     

   private addPageVisit(normalizedURL: string) : boolean{
      if (this.pages[normalizedURL] > 0) {
         this.pages[normalizedURL]++;
         return false;
      }
      this.pages[normalizedURL] = 1;
      return true; 
   } 

   private async getHTML(currentURL: string): Promise<string>{
      return await this.limit(async () => {
         return await getHTML(currentURL);
      })
   }

   private async crawlPage(currentURL: string = this.baseURL): Promise<void> {
    const basePageHost = new URL(this.baseURL).hostname;
    const currentPageHost = new URL(currentURL).hostname;

    if (basePageHost !== currentPageHost) {
      return;
    }

    const normalizedCurrentURL = normalizeURL(currentURL);

    const isNewPage = this.addPageVisit(normalizedCurrentURL);

    if (!isNewPage) {
      return;
    }

    console.log(`crawling current url ${normalizedCurrentURL}`);

    let html = "";

    try {
      html = await this.getHTML(currentURL);
    } catch (error) {
      console.log(`${error}`);
      return;
    }

    const nextURLs = getURLsFromHTML(html, this.baseURL);

    const crawlPromise = nextURLs.map((nextURL)=>this.crawlPage(nextURL))

    await Promise.all(crawlPromise);
  }

  async crawl() : Promise<Record<string,number>>{
   await this.crawlPage(this.baseURL);
   return this.pages;
  }
}

export async function crawlSiteAsync(
      baseURL:string, maxConcurrency:5
   ):Promise<Record<string,number>> {
   const crawler = new ConcurrentCrawler(baseURL, maxConcurrency);
   return await crawler.crawl();
}
