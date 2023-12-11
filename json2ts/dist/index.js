"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 */
const commander_1 = require("commander");
const rcfile = require("rcfile");
const JsonSchemaToInterface_1 = require("./JsonSchemaToInterface");
const DEFAULT_CONFIG = {
    json2ts: {
        output: null,
        dirs: null,
        remote: null,
    },
};
const CONFIG = Object.assign(Object.assign({}, DEFAULT_CONFIG), rcfile("kushki"));
commander_1.program.version("1.0.2").description("Kushki CLI toolbox.");
commander_1.program
    .command("json2ts [dirs...]")
    .description("Generate Typescript Interfaces from json Schemas.")
    .option("-o, --output <output>", "Output path.")
    .action((dirsInput, options) => {
    JsonSchemaToInterface_1.JsonSchemaToInterface.convert(dirsInput, options, CONFIG);
});
commander_1.program.parse(process.argv);
//# sourceMappingURL=index.js.map