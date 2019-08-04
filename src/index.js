#!/usr/bin/env node

import axios from 'axios';
import minimist from 'minimist';

const args = minimist(process.argv.slice(2));


function missingArg(arg) {
  process.stdout.write(`missing required argument ${arg}\n`);
  process.exit(2);
}

const token = args.token || process.env.SLACK_TOKEN || missingArg('token');
const user = args.user || process.env.SLACK_USER || missingArg('user');
const numOnly = args.numOnly || false;
const GET_CHANNELS = 'https://slack.com/api/users.conversations';
const GET_UNREAD = 'https://slack.com/api/channels.history';

async function getUnread() {
  const response = await axios.get(GET_CHANNELS, {
    params: {
      user,
      token,
      types: 'public_channel,private_channel,mpim,im',
      exclude_archived: true,
    },
  });
  return response && response.data && response.data.channels && Promise
    .all(response.data.channels
      .map(async channel => axios.get(GET_UNREAD, {
        params: {
          user,
          token,
          channel: channel.id,
          unreads: true,
        },
      })));
}
function sumUnread(responses) {
  return responses && responses
    .map(response => response.data && response.data.unread_count_display)
    .reduce((totalUnread, perChannel) => totalUnread + (perChannel || 0), 0);
}

async function main() {
  try {
    const responses = await getUnread();
    if (numOnly) {
      process.stdout.write(sumUnread(responses));
      process.exit(0);
    } else {
      process.stdout.write(`you have ${sumUnread(responses)} unread messages at slack\n`);
      process.exit(0);
    }
  } catch (error) {
    process.stdout.write('error occurred :(\n are you sure SLACK_TOKEN and SLACK_USER environment vars are configured?');
    process.exit(1);
  }
}

main();
