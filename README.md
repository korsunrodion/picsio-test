# Pics.io test task app

## 1. Overview
App accepts a request with routing intents on POST /api/events
Example request:

```
  payload: { ... },
  strategy: 'ALL' | 'IMPORTANT' | 'SMALL' | custom function
  routingIntents: [
		{ destinationName: 'destination1', important: true, bytes: 128 },
		{ destinationName: 'destination2', important: true, bytes: 2048 },
		{ destinationName: 'destination3', important: false, bytes: 4096 }
	],
```

App uses strategy to filter routing intents. There are few predefined strategies.

**ALL strategy** — according to this strategy event should be routed to all destinations.

**IMPORTANT strategy** — according to this strategy event should be routed to destination that contains property important: true.

**SMALL strategy** — according to this strategy should be routed to destination that contains property bytes is less than 1024.

**custom strategy** — according to this strategy event should be routed to destination, if specified serialized function returns the destination.
## 2. Build
### Run natively:
1. npm run build
2. (dev) npm run dev
or
2. (production) npm run start


### Run with Docker
1. docker build -t NAME
2. docker run --env-file ./.env -d -p 5000:5000 NAME

#### App will be listening on port 5000

