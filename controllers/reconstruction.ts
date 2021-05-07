import express, { Router, Request, Response } from 'express';
import fs from 'fs';
import multer from 'multer';
import { exec } from 'child_process';

import { shellconfig } from '../config/shellconfig';
import { removeDir } from '../helpers/fsHelpers';

let router: Router = express.Router()

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const { userId, modelName } = req.body
        const dir = `uploads/${userId}/${modelName}`;

        fs.access(dir, (err) => {
            if(err) {
                return fs.mkdir(dir, {recursive: true}, (err) => {cb(err, dir)});
            } else {
                return cb(null, dir);
            }
        });
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
})

let upload = multer({storage: storage});

router.post('/', upload.array("files"), (req: Request, res: Response) => {
    console.log(req.files);

    const { userId, modelName } = req.body;
    const inputDir = `${shellconfig.uploadDirPath}/${userId}/${modelName}`;
    const outputDir = `${shellconfig.tempDirPath}/${userId}/${modelName}`;
    const outputPath = `${outputDir}/model.stl`;

    let cmd = `${shellconfig.reconstructionRunnerCmd} ${inputDir} ${outputDir}`;
    exec(cmd, (err, stdout, stderr) => {
        if(err) {
            res.send({
                err : err,
                stderr : stderr,
                stdout : stdout
            })
        } else {
            let stat = fs.statSync(outputPath);

            res.writeHead(200, {
                'Content-Type': 'application/stl',
                'Content-Length': stat.size
            });

            let readstream = fs.createReadStream(outputPath, {emitClose: true});
            readstream.pipe(res);
            readstream.on("close", () => {
                removeDir(outputDir);
                removeDir(inputDir);
            });
        }
    })
});

module.exports = router;