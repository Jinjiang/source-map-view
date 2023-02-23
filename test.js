import fs from 'node:fs'

const getContent = async () => {
  // get the first arg as the source directory
  const source = process.argv[2] || './test'
  // read all files in ./test directory
  const files = await fs.promises.readdir(source)
  // read all content of them
  const content = await Promise.all(files.map(file => fs.promises.readFile(`${source}/${file}`, 'utf-8')))
  // return as a named object
  return files.map((file, index) => ({ id: file, content: content[index] }))
}

const run = async () => {
  // get content
  const content = await getContent()
  // write into ./public/test.json
  await fs.promises.writeFile('./public/test.json', JSON.stringify(content, null, 2))
}

run()
