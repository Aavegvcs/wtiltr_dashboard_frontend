// utils/uploadToS3.ts or wherever this lives
import { AxiosRequestConfig } from 'axios';
import { AwsBucketUrl } from 'src/config-global';
import axios from 'axios';
import { decryptData } from './crypto.utils';

interface UploadEvent extends React.ChangeEvent<HTMLInputElement> {}
export const CONFIG_ENCRYPT = {
  port: import.meta.env.VITE_PORT || '3000',
  appSecret: import.meta.env.VITE_APP_SECRET || '',
  encKey: import.meta.env.VITE_ENC_KEY || '',
};

const imageUploadApi = async (config: AxiosRequestConfig): Promise<string> => {
  const responseData = await axios.request(config);
  const decryptedData = await decryptData((responseData.data.string) || '{}');
// console.log("decrtp data", decryptedData.data.name)

  return decryptedData.data.name;
};

export const UploadDocumenttos3Bucket = async (
  e: UploadEvent,
  container: string
): Promise<string> => {
  const reader = new FormData();
  if (!e.target.files || e.target.files.length === 0) {
    throw new Error('No file selected');
  }
  // console.log('IN the handle document photo', e.target.files[0].name);
  reader.append('file', e.target.files[0]);
  const token = localStorage.getItem('token');
  const config: AxiosRequestConfig = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${AwsBucketUrl}/s3/upload/${container}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: reader,
  };

  const imageName = await imageUploadApi(config);
   console.log('in ..........', imageName);

  const totalUrl = `${AwsBucketUrl}/s3/getDocument/${container}/${imageName}`;
  console.log('totalUrl', totalUrl);
  return totalUrl;
};


export const UploadFiletos3Bucket = async (
  file: File,
  container: string
): Promise<string> => {
  const reader = new FormData();
  reader.append('file', file);

  const token = localStorage.getItem('token');
  const config: AxiosRequestConfig = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${AwsBucketUrl}/s3/upload/${container}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: reader,
  };

  const imageName = await imageUploadApi(config);
  const totalUrl = `${AwsBucketUrl}/s3/getDocument/${container}/${imageName}`;
  return totalUrl;
};
