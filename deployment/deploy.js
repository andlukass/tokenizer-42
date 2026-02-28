import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { createWalletClient, http } from "viem"
import { mnemonicToAccount } from "viem/accounts"
import { base } from "viem/chains"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const abi = JSON.parse(fs.readFileSync(path.join(__dirname, "./abi.json"), "utf8"))
const bytecode = fs.readFileSync(path.join(__dirname, "./bytecode.txt"), "utf8")

if (!process.env.MNEMONIC) throw new Error("MNEMONIC env variable is not set")
const account = mnemonicToAccount(process.env.MNEMONIC)

const client = createWalletClient({
  account,
  chain: base,
  transport: http()
})

const hash = await client.deployContract({
  abi,
  bytecode,
  args: [1000000n]
})

console.log("Deploy tx:", hash)
