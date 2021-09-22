#!/usr/bin/env node

const commandLineArgs = require('command-line-args')
const commandLineUsage = require('command-line-usage')
const fs = require('fs');
const stringifySync = require('subtitle').stringifySync;

const optionDefinitions = [
  {
    name: 'help',
    alias: 'h',
    type: Boolean,
    description: 'Display this usage guide.'
  },
  {
    name: 'src',
    type: String,
    multiple: true,
    description: 'The video file being subtitled',
    typeLabel: '<files>' },
  {
    name: 'text',
    alias: 't',
    type: String,
    description: 'Text to insert'
  }
]

const options = commandLineArgs(optionDefinitions)

if (options.help) {
  const usage = commandLineUsage([
    {
      header: 'Subtitler',
      content: 'Appends subtitles for a given video file'
    },
    {
      header: 'Options',
      optionList: optionDefinitions
    },
    {
      content: 'Project home: {underline https://github.com/WAKlNYAN/subtitler}'
    }
  ])
  console.log(usage)
} else {
  if (options.src) {
    const src = options.src[0];
    const dest = src + '.srt';
    if (src) {
      const creationTime = fs.statSync(src).birthtimeMs;
      const nowTime = (new Date()).getTime();
      const nowMs = nowTime - creationTime;

      const list = []

      list.push({
        type: 'cue',
        data: {
          start: nowMs,
          end: nowMs + 5000,
          text: options.text
        }
      })

      const data = stringifySync(list, { format: 'SRT' }) + "\n";

      fs.appendFile(src+'.srt', data, (err) => {
          if (err) {
              throw err;
          }
          console.log("File is updated.");
      });
    }
  } else {
    console.log(options)
  }
}
