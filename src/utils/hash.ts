import CryptoJS from "crypto-js";

const create = async (data: string): Promise<string> => 
  CryptoJS.SHA256(data).toString(CryptoJS.enc.Hex);

const compare = async (data: string, hashedData: string): Promise<boolean> => {
  const newHash = await create(data);
  return newHash === hashedData;
};

export const Hash = {
  create,
  compare,
};
