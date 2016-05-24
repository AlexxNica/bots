import {RtmClient, WebClient, MemoryDataStore} from '@slack/client';
import {createSlackBot, createConversation, createCommand} from 'chatter';
import config from '../../config';

// define commands
import startCommand from './commands/start';
import stopCommand from './commands/stop';
import iwillCommand from './commands/iwill';
import statusCommand from './commands/status';

// create bot
const bot = createSlackBot({
  name: 'Pombot',
  getSlack() {
    return {
      rtmClient: new RtmClient(config.tokens.pombot, {
        dataStore: new MemoryDataStore(),
        autoReconnect: true,
      }),
      webClient: new WebClient(config.tokens.pombot),
    };
  },
  createMessageHandler(id, {channel}) {
    // Direct message
    if (channel.is_im) {
      return createConversation([
        // Nameless command that encapsulates sub-commands and adds a "help"
        // command and a fallback message handler.
        createCommand({
          isParent: true,
          description: `Hi, I'm pombot!`,
        }, [
          startCommand,
          stopCommand,
          iwillCommand,
          statusCommand,
        ]),
      ]);
    }
    // Public channel
    return createConversation([
      // In public, a top-level command should really be namespaced.
      createCommand({
        name: 'pom',
        isParent: true,
        description: `Hi, I'm pombot!`,
      }, [
        startCommand,
        stopCommand,
        iwillCommand,
        statusCommand,
      ]),
    ]);
  },
});

export default bot;
