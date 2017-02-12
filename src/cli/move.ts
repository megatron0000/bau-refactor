#!/usr/bin/env node
import { IFileMover } from '../classes/mover/i-file-mover';
import { container } from '../inversify.config';



let fileMover = container.get<IFileMover>('IFileMover');

fileMover.move(process.argv[2], process.argv[3]);
