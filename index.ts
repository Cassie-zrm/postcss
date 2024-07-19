import postcss from "postcss"
import autoperfixer, { data } from "autoprefixer"
import fs from "node:fs"
import path, { resolve } from "node:path"
import crypto from "crypto"
import type { Plugin } from "postcss"
const postcssPresetEnv = require("postcss-preset-env")
const css = fs.readFileSync("./index.css", "utf8")

const browserList: string[] = [
  "ie >=8",
  "chrome >= 31",
  "firefox >=31",
  "safari >= 7",
  "opera >= 23",
]
const directoryPath = path.join(__dirname);
// vue scope .flex --> [data-v-asdd] .flex
// 实现scope 基于  postcss
// 增加哈希值 读取文件路径生成哈希值
const hash = crypto.createHash("md5").update('index.css').digest('hex').slice(0,8)

const postcssPlugin = (filePath): Plugin => {
  return {
    postcssPlugin: "vue-scoped",
    Rule(rule) {
        const hash = crypto.createHash("md5").update(filePath).digest('hex').slice(0,8)
        rule.selectors = rule.selectors.map((selector) => {
            console.log(selector)
            return `[data-v-${hash}] ${selector}`
        })
    },
  }
}


  fs.readdirSync(directoryPath).forEach(file => {
    // // 确保是CSS文件
    if (file.endsWith('.css')) {

        // 构建文件的完整路径
        const filePath = path.join(directoryPath, file);
        
        // 读取文件内容
        const cssContent = fs.readFileSync(filePath, 'utf8');
        
        // 这里可以对读取到的cssContent进行处理或者输出
        // console.log('cssContent',cssContent);
        postcss([
            autoperfixer(browserList),
            postcssPresetEnv({
              stage: 0,
            }),
            postcssPlugin(filePath)
          ])
            .process(cssContent)
            .then((result) => {
              console.log(result.css)
            })
    }
});