# slack-unread-report
get unread messages report

## Install

`npm i -g slack-unread-report`

## Use

`slack-unread-report --token [your_slack_token] --user [your_slack_user_id]`

> you have 104 unread messages at slack

## Environment vars are also supported:

- `export SLACK_TOKEN=[your_slack_token]`
- `export SLACK_USER=[your_slack_user_id]`
- `slack-unread-report`

## you can get only the number printed so you can compose your own message:

`slack-unread-report --token [your_slack_token] --user [your_slack_user_id] --num-only`

