import { Injectable, Logger } from '@nestjs/common';
import { Express } from 'express';
import { Readable } from 'stream';

import {
    S3Client,
    PutObjectCommand,
    PutObjectCommandInput,
    PutObjectCommandOutput,
    GetObjectCommand,
    GetObjectCommandInput,
    GetObjectCommandOutput,
    CopyObjectCommand,
    DeleteObjectCommand,
    DeleteObjectCommandInput,
    DeleteObjectsCommand,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
    private region: any;
    private s3: S3Client;
    private logger = new Logger(S3Service.name);

    constructor(private configService: ConfigService) {

        this.region = this.configService.get<string>('AWS_REGION');
        this.s3 = new S3Client({
            // region: this.region,
            // credentials: {
            //   accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
            //   secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
            // },

            region: this.configService.get('AWS_REGION'),
        });
        // console.log(this.s3, 's3', this.configService.get('AWS_REGION'), "this.configService.get('AWS_REGION')");

    }

    // async uploadUserFile(file: Express.Multer.File, key: string) {
    //   // console.log(
    //   //   'Access Key',
    //   //   this.configService.get<string>('AWS_ACCESS_KEY_ID'),
    //   // );

    //   // console.log('file', file);

    //   // console.log('key', key);
    //   const bucket = this.configService.get<string>('AWS_BUCKET_NAME');
    //   const input: PutObjectCommandInput = {
    //     Body: file.buffer,
    //     Bucket: bucket,
    //     Key: key,
    //     ContentType: file.mimetype,
    //     // ACL: 'public-read',
    //   };
    //   try {
    //     const response: PutObjectCommandOutput = await this.s3.send(
    //       new PutObjectCommand(input),
    //     );
    //     // console.log('response from s3', response);
    //     if (response.$metadata.httpStatusCode === 200) {
    //       return `https://${bucket}.s3.${this.region}.amazonaws.com/${key}`;
    //     }
    //     throw new Error('Image not saved in s3!');
    //   } catch (err) {
    //     this.logger.error('Cannot save file to s3,', err);
    //     throw err;
    //   }
    // }

    async uploadFile(file: Express.Multer.File, folder: string, fileName: string): Promise<string> {
        const bucket = this.configService.get<string>('AWS_BUCKET_NAME');
        const key = `${folder}/${fileName}`;
        const input: PutObjectCommandInput = {
            Body: file.buffer,
            Bucket: bucket,
            Key: key,
            ContentType: file.mimetype,
            // ACL: 'public-read',
        };
        try {
            // console.log(input);
            const response: PutObjectCommandOutput = await this.s3.send(
                new PutObjectCommand(input),
            );
            // console.log(input);
            if (response.$metadata.httpStatusCode === 200) {
                // console.log(`https://${bucket}.s3.${this.region}.amazonaws.com/${key}`);

                return `https://${bucket}.s3.${this.region}.amazonaws.com/${key}`;
            }
            throw new Error('File not saved in S3!');
        } catch (err) {
            this.logger.error('Cannot save file to S3:', err);
            throw err;
        }
    }

}
