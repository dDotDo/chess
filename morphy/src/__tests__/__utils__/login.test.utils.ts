import { produce } from 'immer';
import isFunction from 'lodash/isFunction';

import useUserStore, { Username, UserState, UserStore } from '../../store/user';
import { screen, waitFor } from '@testing-library/react';
import { APP_NAME } from '../../utils/constants/app.constants';

import { socket } from '../../backend/ws/instance';

interface TestLoginDetails {
  username: Username;
}

export async function test_login(loginDetails: TestLoginDetails) {
  const { username } = loginDetails;
  const { isLoggedIn } = useUserStore.getState();
  if (isLoggedIn) throw new Error('Already logged in.');

  jest.spyOn(window, 'prompt').mockReturnValueOnce(username);
  const loginButton = screen.getByRole('button', { name: 'Login' });
  loginButton.click();

  await waitFor(() => expect(socket.connected).toBe(true));
}

export async function test_loginUsernameTaken(
  failUsername: string,
  retryUsername: string
) {
  return new Promise<void>((resolve) => {
    let shouldResolve = false;
    jest.spyOn(window, 'prompt').mockImplementation((message) => {
      if (message === 'Username is taken.') {
        shouldResolve = true;
        return retryUsername;
      }
      if (shouldResolve) resolve();
      return failUsername;
    });
    const loginButton = screen.getByRole('button', { name: 'Login' });
    loginButton.click();
  });
}

export async function test_logout() {
  const { isLoggedIn } = useUserStore.getState();
  if (!isLoggedIn) throw new Error('Already logged out.');

  jest.spyOn(window, 'confirm').mockReturnValueOnce(true);
  const loginButton = screen.getByRole('button', { name: 'Logout' });
  loginButton.click();

  await waitFor(() => expect(socket.connected).toBe(false));
}

export function getLocalUserState(): UserState {
  const userStore = useUserStore.getState();
  return produce(userStore, (draft) => {
    Object.keys(userStore).forEach((field) => {
      const _field = field as keyof UserStore;
      if (isFunction(userStore[_field])) delete draft[_field];
    });
  });
}

export function getPersistentUserState(): UserState {
  const userStringified = localStorage.getItem(`${APP_NAME}-user`);
  if (userStringified === null) throw new Error('User is null in localStorage');
  return JSON.parse(userStringified).state;
}
