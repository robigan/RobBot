# PROJECT IN PAUSE
Including this project I would have 3 active, big-medium projects, so therefore I will put this one on hold

# RobBot
Built on the WeatherStack by Daswolke (Currently using the version maintained by [AmandaDiscord](https://github.com/AmandaDiscord)), Rabbit MQ, Redis and MongoDB. And based upon DasWolke's Discord [microservice bots whitepaper](https://gist.github.com/DasWolke/c9d7dfe6a78445011162a12abd32091d). Great for large scale thanks to it's ability to, for example, have the gateway on one server, your cache centralized on another, and then the code distributed across the world on many servers. While not suffering performance. As of May 2021 having everything on my local machine, round trip message latency was taking about 100-300ms on average (but my internet is not the best).

# Installation
As usual download it, make sure to have the latest LTS version of NodeJS, satisfy the dependencies by running `npm i`, and populate /Configs/Secrets.js with this format.
```json
{
    "token": "Your Bot Token Here"
}
```
Then the last required step is to populate the Bot field in with the correct information, so AppID and Bot owner's ID. You may want to go over the other config files quickly, especially if configuring access to Redis, MongoDB and RabbitMQ.

# Renaming
Leading upto to the beta stages, I have been renaming this project to many different things like "RobiBot", "RoBot" and I think I have settled on "RobBot".
