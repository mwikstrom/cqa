# CQA: Command Query App [![build status][travis-badge]][travis] [![code coverage][coveralls-badge]][coveralls] [![npm package][npm-badge]][npm]

[travis-badge]: https://img.shields.io/travis/mwikstrom/cqa.svg?style=flat-square
[travis]: https://travis-ci.org/mwikstrom/cqa
[coveralls-badge]: https://img.shields.io/coveralls/github/mwikstrom/cqa.svg?style=flat-square
[coveralls]: https://coveralls.io/github/mwikstrom/cqa
[npm-badge]: https://img.shields.io/npm/v/cqa.svg?style=flat-square
[npm]: https://www.npmjs.org/package/cqa

> Remember: Pushing a command; snapshot active queries. Apply locally. Store in local db. Broadcast (cross tabs). Send to server. Track accept/reject. Views need to keep applying command until commit version is reached.

-----

## Backend communication protocol

The CQA protocol is a websocket subprotocol named `CQA/1.0`. Connections MUST be secured using `wss://`.

Messages MUST be transmitted as stringified JSON arrays:

    [ "Message_Type", { ...payload }, ...ignored ]

The first array element MUST be a string that identifies the type of message. The second array element provides the message payload. Any additional elements MUST be ignored.

When receiving a message:

1. If the received message is not a text message then close the connection with status code `1003 Unsupported Data` and abort these steps.

2. If the received message cannot be parsed as a JSON value then close the connection with status `1003 Unsupported Data` and abort these steps.

3. Let *Message Data* be the parsed JSON value.

4. If *Message Data* is not an array with at least two elements then close the connection with status `1002 Protocol Error` and abort these steps.

5. Let *Message Type* be the value of the first array element of *Message Data* and let *Payload* be the value of the second array element of *Message Data*.

6. If *Message Type* is not a recognized client or server message (depending on whether the recipient is acting as client or server) then close the connection with status `1002 Protocol Error` and abort these steps.

7. If *Payload* is not valid according to *Message Type* then close the connection with status `1002 Protocol Error` and abort these steps.

8. Process the message. If an error occurs while processing then close the connection with status `1011 Internal Error`.


### Client messages

#### `Close_Query`

Instructs the server to stop processing a query.

Payload MUST be a string that identifies a query that was sent to the server on the current connection in an `Execute_Query` message.

Example:

    [ "Close_Query", "my-query-123" ]

#### `Execute_Command`
*TODO*


#### `Execute_Query`
*TODO*


#### `Refresh_Authorization`
Sent to update the authorization token for the user identity that was estabilished when the connection was opened using the `Authorization` connection header.

This message is typically sent in response to receiving an `Authorization_Will_Expire` message, but may be sent at any time.

**NOTE:** This message cannot be used to change the estabilished user identity of an open connection.

Payload MUST be a string that provides the new authorization credentials, see [RFC 7235](https://tools.ietf.org/html/rfc7235#section-4.2).

Example:

    [ "Set_Authorization", "Bearer eyJhbGciOiJIUzI1NiIXVCJ9..."]

In case server does not recognize the new authorization data, or if it does not authenticate the same user identity as was previously established on the current connection, then the server MUST close the connection with status `4001 Invalid Authorization`.



### Server messages

#### `Authorization_Will_Expire`
Sent to inform a client that the current authorization credentials is about to expire.

Payload MUST be an object with the following properties (any additional properties MUST be ignored):

* `time_left` MUST be a number specifying the number of seconds remaining until the current authorization credentials are considered invalid.

Example:

    [ "Authorization_Will_Expire", { "time_left": 30 } ]

When a client receives this message, it shall ensure that a `Refresh_Authorization` message reaches the server before the specified time elapses.

**NOTE:** The server is encouraged but NOT required to send an `Authorization_Will_Expire` message before the current authorization credentials are expired.

When the server detects that the current authorization credentials have expired it MUST immediately abort all processing for the current connection and close it with status `4002 Authorization Expired`.

#### `Command_Accepted`
*TODO*

#### `Command_Rejected`
*TODO*

#### `Query_Closed`
*TODO*

#### `Query_Rejected`
*TODO*

#### `Set_Query_Result`
*TODO*

#### `Update_Query_Result`
*TODO*

#### `Upgrade_Query_Result_Version`
*TODO*
