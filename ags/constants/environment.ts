import { exec } from 'astal/process';

export const USER = exec('whoami');
export const HOME = exec(['bash', '-c', 'echo $HOME']);
export const CONFIG = `${HOME}/.config`;
export const CACHE = `${HOME}/.cache`;
