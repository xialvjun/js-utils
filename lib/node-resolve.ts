import { resolve as path_resolve } from 'path';
import { access, accessSync } from 'fs';

const existSync = (p: string) => {
  try {
    accessSync(p);
    return true;
  } catch (error) {
    return false;
  }
};

const existAsync = (p: string) => new Promise<boolean>(res => access(p, e => (e ? res(false) : res(true))));

export const resolveSync = (p: string) => {
  if (p.startsWith('/')) {
    throw new Error("You shouldn't resolve an absolute path.");
  }
  let do_exist = false;
  let this_path = '';
  let last_path = '';
  let cd_up: string[] = [];
  while (true) {
    this_path = path_resolve(__dirname, ...cd_up, p);
    if (this_path === last_path) {
      return '';
    }
    do_exist = existSync(this_path);
    if (do_exist) {
      return this_path;
    }
    cd_up.push('../');
  }
};

export const resolve = async (p: string) => {
  if (p.startsWith('/')) {
    throw new Error("You shouldn't resolve an absolute path.");
  }
  let do_exist = false;
  let this_path = '';
  let last_path = '';
  let cd_up: string[] = [];
  while (true) {
    this_path = path_resolve(__dirname, ...cd_up, p);
    if (this_path === last_path) {
      return '';
    }
    do_exist = await existAsync(this_path);
    if (do_exist) {
      return this_path;
    }
    cd_up.push('../');
  }
};
