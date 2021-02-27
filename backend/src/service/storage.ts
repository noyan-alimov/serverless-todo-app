import { CreateSignedURLRequest } from '../requests/CreateSignedURLRequest'
import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

class StorageService {
  constructor(
    private readonly todosStorage = process.env.S3_BUCKET,
    private readonly s3 = new XAWS.S3({ signatureVersion: 'v4' })
  ) {}

  getBucketName(): string {
    return this.todosStorage
  }

  getPresignedUploadURL(
    createSignedUrlRequest: CreateSignedURLRequest
  ): string {
    return this.s3.getSignedUrl('putObject', createSignedUrlRequest)
  }
}

export const storageService = new StorageService()
