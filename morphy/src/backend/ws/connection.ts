import { socket } from './instance';
import { Username } from '../../store/user';

export function connect(username: Username) {
  socket.auth = { username };
  socket.connect();
}

export function disconnect() {
  socket.disconnect();
}
