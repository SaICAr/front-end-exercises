#! /usr/bin/env node

import createFn from "./create.mjs";
import { program } from "commander";
// const program = require("commander");

program
  .command("create [my-app]")
  // 命名的描述
  .description("create a new project")
  // create命令的选项
  .option("-f, --force", "overwrite target if it exist")
  .action((name, cmdObj) => {
    // 执行'./create.js'，传入项目名称和 用户选项
    console.log("name", name);
    createFn(name, cmdObj);
  });

program.parse(process.argv);
