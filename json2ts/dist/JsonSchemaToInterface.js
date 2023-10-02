"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonSchemaToInterface = void 0;
/**
 *
 */
const axios_1 = require("axios");
const chalk = require("chalk");
const emojic = require("emojic");
const fs_1 = require("fs");
const json_schema_to_typescript_1 = require("json-schema-to-typescript");
const path = require("path");
const ProgressBar = require("progress");
const rimraf = require("rimraf");
const shell = require("shelljs");
const _ = require("underscore");
const url = require("url");
const constants_1 = require("./constants");
/**
 * Convert json schema files to typescript interface.
 */
class JsonSchemaToInterface {
    static convert(dirsInput, options, config) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const inputPaths = ['../../src/schema'];

                const outputPath = '../../types';
                if (_.isEmpty(inputPaths) || _.isEmpty(outputPath)) {
                    console.info(chalk.yellow(`Nothing to process... ${emojic.confused}`));
                    process.exit(0);
                }
                this._cleanGeneratedFolders(outputPath);
                yield this._addRemoteSchemas(inputPaths, outputPath, config);
                console.info(chalk.green(`Clear output... ${emojic.whiteCheckMark}`));
                inputPaths.forEach((inputPath) => this._processPath(inputPath, outputPath));
                console.info(chalk.green(`Done ...${emojic.whiteCheckMark}`));
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    static _processPath(inputPath, outputPath) {
        console.info(chalk.blue(`Process: ${inputPath}...${emojic.zzz}`));
        const fileNames = (0, fs_1.readdirSync)(path.resolve(inputPath));
        const bar = this._createProgressBar(fileNames.length);
        this._processFiles(fileNames, inputPath, outputPath, bar);
    }
    static _createProgressBar(totalFiles) {
        return new ProgressBar("  generating [:bar] :percent", {
            total: totalFiles,
        });
    }
    static _createRemoteFolder(outputPath) {
        shell.mkdir("-p", path.resolve(`${outputPath}/remote`));
    }
    static _createTempFolder() {
        shell.mkdir("-p", path.resolve(this.tmp_schema));
    }
    static _addRemoteSchemas(inputPaths, outputPath, config) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._hasRemoteSchemas(config)) {
                inputPaths.push(this.tmp_schema);
                this._createTempFolder();
                for (const url_element of config.json2ts.remote)
                    yield this._downloadFile(url_element, this.tmp_schema);
                this._createRemoteFolder(outputPath);
            }
        });
    }
    static _hasRemoteSchemas(config) {
        return (config.json2ts.remote !== undefined && config.json2ts.remote !== null);
    }
    static _processFiles(fileNames, inputPath, outputPath, progressBar) {
        fileNames.forEach((fileName) => __awaiter(this, void 0, void 0, function* () {
            if (path.extname(fileName) === constants_1.JSON_EXTENSION) {
                const ts = yield this._compileJsonToTs(inputPath, fileName);
                (0, fs_1.writeFileSync)(`${this._generateFilePath(outputPath, inputPath)}/${this._generateFileName(fileName)}`, ts);
            }
            progressBar.tick();
        }));
    }
    static _generateFilePath(outputPath, inputPath) {
        return `${path.resolve(outputPath)}${inputPath === this.tmp_schema ? constants_1.REMOTE_FOLDER : ""}`;
    }
    static _cleanGeneratedFolders(outputPath) {
        this._removeFolder(this.tmp_schema);
        this._removeFolder(outputPath);
    }
    static _removeFolder(directory) {
        rimraf.sync(path.resolve(directory));
    }
    static _compileJsonToTs(inputPath, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, json_schema_to_typescript_1.compileFromFile)(path.resolve(`${inputPath}/${fileName}`), {
                unknownAny: false,
                unreachableDefinitions: false,
                declareExternallyReferenced: true,
                enableConstEnums: true,
                cwd: process.cwd(),
                ignoreMinAndMaxItems: true,
                bannerComment: constants_1.BANNER_COMMENT,
            });
        });
    }
    static _generateFileName(filePath) {
        return `${path.basename(filePath, path.extname(filePath))}.d.ts`;
    }
    static _downloadFile(fileUrl, downloadDir) {
        return __awaiter(this, void 0, void 0, function* () {
            const file_name = url.parse(fileUrl).pathname.split("/").pop();
            const full_path = path.resolve(downloadDir);
            const response = yield axios_1.default.get(url.parse(fileUrl).href);
            (0, fs_1.writeFileSync)(`${full_path}/${file_name}`, JSON.stringify(response.data));
            console.log(`${file_name} downloaded to ${full_path}`);
        });
    }
}
exports.JsonSchemaToInterface = JsonSchemaToInterface;
JsonSchemaToInterface.tmp_schema = "../../.kushki/schema";
//# sourceMappingURL=JsonSchemaToInterface.js.map