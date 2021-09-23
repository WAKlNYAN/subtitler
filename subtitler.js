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

if (options.help || Object.keys(options).length < 1) {
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
} else if (options.src) {
  const src = options.src[0];
  if (src) {
    const text = options.text || '...';
    const dest = src + '.srt';
    const creationTime = fs.statSync(src).birthtimeMs;
    const nowTime = (new Date()).getTime();
    const nowMs = nowTime - creationTime;

    const list = [{
      type: 'cue',
      data: {
        start: nowMs,
        end: nowMs + 5000,
        text: text
      }
    }];

    const data = stringifySync(list, { format: 'SRT' }) + "\n";

    fs.appendFile(dest, data, (err) => {
        if (err) {
            throw err;
        }
        console.log(`Subtitle file has been updated: ${dest}`);
    });
  } else {
    console.error(`Source file invalid: ${src}`);
  }
} else {
  console.log(options)
}
