// import { crawlPage, getHTML } from "./crawl";
import { crawlSiteAsync } from "./crawl";
import pLimit from 'p-limit';

async function main(){
    const argv_length  = process.argv.length
    const FIXED_LENGTH = 3

    if(argv_length < FIXED_LENGTH){
        console.log("There is No website provided");
        process.exit(1)
    }
        
    else if (argv_length > FIXED_LENGTH){
        console.log("There are too many websites provided");
        process.exit(1)
    }

    const baseURL = process.argv[2]
    console.log("Crawl the given website",baseURL);
    
    const pages = await crawlSiteAsync(baseURL,5);
    console.log(pages)
    
    process.exit(0);
}

main()

