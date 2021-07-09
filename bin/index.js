#! /usr/bin/env node

const states = require("../util/states")
const districts = require("../util/districts")
const slots = require("../util/slots")

const program = require('commander');
// states();
program
  .command('states')
  .description('List down all the states')
  .action(states);

  program
  .command('districts <stateid>')
  .description('List down all the Districts')
  .action(districts);

  program
  .command('slots <districtid>')
  .description('List down all the Centers')
  .action(slots);

  program.parse();