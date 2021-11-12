import crypto = require('crypto');
import { ResultSetHeader } from 'mysql2';

import { pool } from './connection';

import { Result } from '../models/result';

const BITES_LENGTH = 4;
const APP_DOMAIN = process.env.APP_DOMAIN;
if (!APP_DOMAIN) {
   throw new Error('APP_DOMAIN enviroment variable is not set');
}
try {
   new URL(APP_DOMAIN);
} catch {
   throw new Error('APP_DOMAIN enviroment variable is not a valid URL');
}

const generateHash = () => crypto.randomBytes(BITES_LENGTH).toString('base64url');

export interface ILink {
   ID: number;
   link: string;
   hash: string;
}

export const getLinks = (): Promise<ILink[]> => {
   // @ts-ignore
   return pool.query<ILink[]>(
      'select * from links',
   )
      .then((result) => result[0]);
};

export const getEntryByHash = async (hash: string): Promise<ILink | undefined> => {
   // @ts-ignore
   const result = await pool.query<ILink[]>(
      'select * from links where hash = ?',
      [hash],
   );
   return result[0]?.[0];
};

export const getEntryByLink = async (link: string): Promise<ILink | undefined> => {
   // @ts-ignore
   const result = await pool.query<ILink[]>(
      'select * from links where link = ?',
      [link],
   );
   return result[0]?.[0];
};

export const getLinkByHash = async (hash: string): Promise<string | undefined> => {
   const entry = await getEntryByHash(hash);
   return entry?.link;
};

export const getHashByLink = async (link: string): Promise<string | undefined> => {
   const entry = await getEntryByLink(link);
   return entry?.hash;
};

const generateUniqueHash = async (): Promise<string> => {
   const hash = generateHash();
   const existingEntry = await getEntryByHash(hash);
   return existingEntry === undefined
      ? hash
      : generateUniqueHash();
};

const insertNewLink = async (link: string, hash: string): Promise<void> => {
   const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO links (hash, link) VALUES(?, ?)',
      [hash, link],
   );
   if (result.affectedRows !== 1 || result.serverStatus !== 2) {
      throw new Error('Some problem with adding a new short link');
   }
};

export const createNewLink = async (link: string): Promise<Result> => {
   const newLinkUrl = new URL(APP_DOMAIN);
   const existingHash = await getHashByLink(link);

   if (existingHash !== undefined) {
      newLinkUrl.pathname = existingHash;
   }
   else {
      const hash = await generateUniqueHash();
      await insertNewLink(link, hash);

      newLinkUrl.pathname = hash;
   }

   return new Result(newLinkUrl);
};