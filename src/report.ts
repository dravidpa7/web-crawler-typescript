import { ExtractPageData } from "./crawl";
import * as fs from 'fs';
import * as path from 'path';


export function writeJSONReport(
    pageData : Record<string,ExtractPageData>,
    fileName = "report.json",
):void{
    const sorted = Object.values(pageData).sort((a,b)=>a.url.localeCompare(b.url))
    const data = JSON.stringify(sorted,null,2);

    const dirPath = path.join(process.cwd(), "reports");
    const filePath = path.join(dirPath, fileName);

    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath,{recursive:true})
    }
    
    try {
        fs.writeFileSync(filePath,data,'utf8');
        console.log("File written on the report");
    } catch (error) {
        console.log(error)
    }
}