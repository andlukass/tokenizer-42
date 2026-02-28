import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import solc from "solc"

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
const contract = output.contracts["Token.sol"].TicTacToe42

fs.writeFileSync(path.join(__dirname, "./abi.json"), JSON.stringify(contract.abi, null, 2))
fs.writeFileSync(path.join(__dirname, "./bytecode.txt"), contract.evm.bytecode.object)

console.log("Compiled successfully. abi.json and bytecode.txt written to deployment/")
