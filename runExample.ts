import { parseArticle } from "Project";
import * as fs from "fs";
const example = fs.readFileSync("./example.txt").toString();

const result = parseArticle(example);
console.log(result);
