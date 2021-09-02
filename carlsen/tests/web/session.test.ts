import { test, expect, newIncognitoPage } from '../__utils__/playwright.utils';
import waitForExpect from 'wait-for-expect';

import { TEST_USER_NAME } from '../../mockServer/config';
import { login, logout } from '../__utils__/auth.utils';
import { localStorageGet } from '../__utils__/browser/localStorage.utils';

test.describe('session#', () => {
  test('can use taken username once previous user logs out', async ({
    page,
    browser,
    io,
  }) => {
    await page.goto('/');
    const incognitoPage = await newIncognitoPage(browser, '/');

    const socket = await login(page, {
      username: TEST_USER_NAME,
      server: io.server,
    });
    await logout(page, { socket });
    await expect(
      login(incognitoPage, { username: TEST_USER_NAME, server: io.server })
    ).resolves.not.toThrow();
  });

  test('user joins room corresponding to their userId', async ({
    page,
    io,
  }) => {
    await page.goto('/');

    await expect((await io.server.allSockets()).size).toBe(0);
    await login(page, {
      username: TEST_USER_NAME,
      server: io.server,
    });
    const userId = (await localStorageGet(page, 'chessapp-user')).state.userId;
    const socketsInRoom = await io.server.in(userId).allSockets();
    expect(socketsInRoom.size).toBe(1);
  });

  test('session persistents across refreshes', async ({ page, io }) => {
    await page.goto('/');

    await login(page, {
      username: TEST_USER_NAME,
      server: io.server,
    });
    const userId = (await localStorageGet(page, 'chessapp-user')).state.userId;
    expect(userId).toBeDefined();
    await page.reload();

    await waitForExpect(async () => {
      const socketsInRoom = await io.server.in(userId).allSockets();
      expect(socketsInRoom.size).toBe(1);
    });
  });

  // test('session persistents across new tabs');

  // test('ui logs out if reconnection error');
});
