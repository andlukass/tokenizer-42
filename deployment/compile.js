import solc from "solc"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const source = fs.readFileSync(path.join(__dirname, "../code/Token.sol"), "utf8")

const input = {
  language: "Solidity",
  sources: {
    "Token.sol": { content: source }
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["abi", "evm.bytecode"]
      }
    }
  }
}

const output = JSON.parse(solc.compile(JSON.stringify(input)))
const contract = output.contracts["Token.sol"]["MyToken"]

fs.writeFileSync(path.join(__dirname, "./abi.json"), JSON.stringify(contract.abi, null, 2))
fs.writeFileSync(path.join(__dirname, "./bytecode.txt"), contract.evm.bytecode.object)

console.log("Compiled successfully. abi.json and bytecode.txt written to deployment/")
