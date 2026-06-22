import { crawlSiteAsync } from "./crawl";
import { writeJSONReport } from "./report";

async function main(){
    const argv_length  = process.argv.length
    const FIXED_LENGTH = 5

    if(argv_length < 3){
        console.log("There is No website provided");
        process.exit(1)
    }
        
    else if (argv_length > FIXED_LENGTH){
        console.log("There are too many websites provided");
        process.exit(1)
    }

    const baseURL = process.argv[2]
    console.log("Crawl the given website",baseURL);
    
    const maxConcurrency = Number(process.argv[3]);
    if(!Number.isFinite(maxConcurrency)|| maxConcurrency <= 0){
        console.log("Invaid max concurrency")
        process.exit(1);
    }

    const maxPages = Number(process.argv[4])
    if(!Number.isFinite(maxPages)|| maxPages <= 0){
        console.log("Invaid max concurrency")
        process.exit(1);
    }

    const pages = await crawlSiteAsync(baseURL,maxConcurrency, maxPages);
    
    console.log("Finished crawling.");
    // console.log(pages)
    console.log("Pages count:", Object.keys(pages).length);

    writeJSONReport(pages)
    
    process.exit(0);
}

main()

