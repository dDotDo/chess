import { v4 as uuidv4 } from 'uuid';

import userCache from '../cache/user';
import matchCache from '../cache/match';
import { UserId, Username } from '../cache/user/types';
import { extractAuthInfo } from '../utils/socket';
import { EventAdder } from './types';

const addChallengeEvents: EventAdder = (io, socket) => {
  const { username, userId: id } = extractAuthInfo(socket);

  socket.on('challenge_request', (challengee) => {
    const error = validateChallengee(challengee, username);
    if (error) return socket.emit('challenge_response', error);

    const challengeeId = userCache.getId(challengee) as UserId;
    console.log(`${username} challenges ${challengee}`);
    // delay on development to give me time to switch tabs before chrome suppresses the prompt
    return setTimeout(
      () => socket.to(challengeeId).emit('challenge_request', username),
      process.env.NODE_ENV === 'development' ? 500 : 0
    );
  });

  socket.on(
    'challenge_response',
    (challengeResponseInfo: { challenger: string; accepted: boolean }) => {
      const { challenger, accepted } = challengeResponseInfo;
      const challengerId = userCache.getId(challenger);
      if (!challengerId) return;
      if (!accepted) {
        socket.to(challengerId).emit('challenge_response', 'rejected');
        return;
      }

      const matchId = uuidv4();
      matchCache.set(matchId, { players: [id, challengerId] });
      userCache.addMatchInfo(id, { id: matchId });
      userCache.addMatchInfo(challengerId, { id: matchId });

      socket.join(matchId);
      const challengerConnId = userCache.getConnectionId(challengerId);
      if (challengerConnId)
        io.of('/').sockets.get(challengerConnId)?.join(matchId);

      socket.to(challengerId).emit('challenge_response', 'accepted', {
        matchId,
        opponent: { username },
      });
      socket.emit('challenge_response', 'accepted', {
        matchId,
        opponent: { username: challenger },
      });
    }
  );
};
export default addChallengeEvents;

export function validateChallengee(challengee: Username, username: Username) {
  if (typeof challengee !== 'string') return 'userNotFound';
  if (challengee === username) return 'userNotFound';
  if (!userCache.existsByUsername(challengee)) return 'userNotFound';
  if (userCache.getByUsername(challengee)?.match) return 'userInMatch';

  return null;
}
