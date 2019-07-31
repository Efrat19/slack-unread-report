#!/usr/bin/env node

import axios from 'axios';

const token = process.env.SLACK_TOKEN || '';
const user = process.env.SLACK_USER || '';
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
    process.stdout.write(`you have ${sumUnread(responses)} unread messages at slack\n`);
  } catch (error) {
    process.stdout.write('error occurred :(\n are you sure SLACK_TOKEN and SLACK_USER environment vars are configured?');
    console.log(error);
  }
}

main();
