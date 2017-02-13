#!/usr/bin/env node
import { IFileMover } from '../classes/mover/i-file-mover';
import { ContainerBuilder } from '../inversify.config';

let container = new ContainerBuilder().build();

let fileMover = container.get<IFileMover>('IFileMover');

fileMover.move(process.argv[2], process.argv[3]);
