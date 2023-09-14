import { REST, Routes } from 'discord.js';
import {token} from './config.js'

const commands = [
  {
    name: 'ppcreateuser',
    description: 'This prompt will create a new user',
    options: [
        {
          name: 'discordusername',
          description: 'Discord username of the new user',
          type: 3,
          required: true,
        },
        {
          name: 'email',
          description: 'Email of the new user',
          type: 3,
          required: true,
        },
        {
          name: 'password',
          description: 'Password for the new user',
          type: 3,
          required: true,
        },
      ]
  },
  {
    name: 'ppcreateservice',
    description: 'This prompt will create a new service',
    options: [
        {
          name: 'servicename',
          description: 'serviceName for the user',
          type: 3,
          required: true,
        },
        {
          name: 'servicelink',
          description: 'serviceLink of the new service',
          type: 3,
          required: true,
        },
        {
          name: 'monthlyfee',
          description: 'monthlyFee for the new service',
          type: 3,
          required: true,
        },
      ],
  },
  {
    name: 'ppgetuser',
    description: 'This prompt will fetch user with subscription information',
    options: [
        {
          name: 'username',
          description: 'username for the user',
          type: 3,
          required: true,
        }
    ]
  }
];

const rest = new REST({ version: '10' }).setToken(token);

try {
  console.log(`Started refreshing application (/${commands.map(x=>x.name)}) commands.`);

  await rest.put(Routes.applicationCommands("1151091532821172274"), { body: commands });

  console.log(`Successfully reloaded application (/${commands.map(x=>x.name)}) commands.`);
} catch (error) {
  console.error(error);
}