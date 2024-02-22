import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

export const generateFilename = (originalname: string): string => {
    const filename: string = path.parse(originalname).name.replace(/\s/g, '') + uuidv4();
    const extension: string = path.parse(originalname).ext;
    return `${filename}${extension}`;
};

