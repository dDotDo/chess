import NodeCache from 'node-cache';

import { UserCacheById, UserCacheByUsername, UserInfo } from './types/user';

const idCache: UserCacheById = new NodeCache();
const nameCache: UserCacheByUsername = new NodeCache();

function set(userInfo: UserInfo) {
  const { id, username } = userInfo;

  idCache.set(id, userInfo);
  nameCache.set(username, id);
}

function getById(id: string) {
  return idCache.get(id);
}

function getId(username: string) {
  return nameCache.get(username);
}

function getByUsername(username: string) {
  const userId = nameCache.get(username);
  if (userId == null) return;
  return getById(userId);
}

function getUsername(id: string) {
  const user = idCache.get(id);
  return (user || {}).username;
}

function existsbyId(id: string) {
  return idCache.has(id);
}

function existsByUsername(username: string) {
  const { id } = getByUsername(username) || {};
  if (!id) return false;
  return existsbyId(id);
}

function usernameExists(username: string) {
  return nameCache.has(username);
}

function removeById(id: string) {
  const { username } = getById(id) || {};
  if (username) nameCache.del(username);
  idCache.del(id);
}

function removeByUsername(username: string) {
  const { id } = getByUsername(username) || {};
  if (id) idCache.del(id);
  nameCache.del(username);
}

function count() {
  return idCache.stats.keys;
}

function clear() {
  idCache.flushAll();
  nameCache.flushAll();
}

export default {
  set,

  getById,
  getByUsername,
  getId,
  getUsername,

  existsbyId,
  existsByUsername,
  usernameExists,

  removeById,
  removeByUsername,

  count,
  clear,
};
