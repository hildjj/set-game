#!/usr/bin/env node
/* eslint-disable no-console */
import {Card, Deck, Hand} from '../lib/index.js';
import chalk from 'chalk';
import {fileURLToPath} from 'node:url';
import fs from 'node:fs';
import {hideBin} from 'yargs/helpers';
import path from 'node:path';
import readline from 'node:readline';
import yargs from 'yargs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const _ignored = yargs(hideBin(process.argv))
  .usage('$0 <cmd> [args]')
  .command({
    command: 'play',
    desc: 'Shuffle, deal, and play a hand',
    builder(y) {
      y.options({
        html: {
          alias: 'H',
          type: 'boolean',
          describe: 'HTML output',
        },
        text: {
          alias: 't',
          type: 'boolean',
          describe: 'Non-color text output',
          conflicts: 'html',
        },
      });
    },
    handler(argv) {
      const hand = new Hand();
      hand.play();
      if (argv.html) {
        console.log(hand.html());
      } else if (argv.text) {
        console.log(hand.text({colors: false}));
      } else {
        console.log(hand);
      }
    },
  })
  .command({
    command: 'icons',
    desc: 'Generate icon SVG files',
    handler(_argv) {
      const deck = new Deck();
      deck.cards.forEach(card => {
        const fn = path.join(
          __dirname, '..', 'icons', `${card.name()}.svg`
        );
        fs.writeFileSync(fn, card.template('svg'));
      });
    },
  })
  .command({
    command: 'solve',
    desc: 'Find the sets in a board',
    handler(_argv) {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false,
      });

      const hand = new Hand();
      const cards = [];
      rl.on('line', line => {
        try {
          const words = line.split(/\s+/g);
          for (const w of words) {
            cards.push(new Card(w));
          }
        } catch (e) {
          console.log('   ', chalk.bgRed(e.message));
        }
      });

      rl.on('close', () => {
        hand.add(cards);
        for (let set = hand.firstSet(); set; set = hand.firstSet()) {
          console.log(set);
          hand.remove(set);
        }
      });
    },
  })
  .strictCommands()
  .demandCommand(1, 1, 'Specify a command')
  .help()
  .alias('help', 'h')
  .argv;
