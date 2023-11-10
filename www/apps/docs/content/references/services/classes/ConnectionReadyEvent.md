# ConnectionReadyEvent

An event published when a connection is ready for use

## Hierarchy

- [`ConnectionPoolMonitoringEvent`](ConnectionPoolMonitoringEvent.md)

  ↳ **`ConnectionReadyEvent`**

## Constructors

### constructor

**new ConnectionReadyEvent**()

#### Inherited from

[ConnectionPoolMonitoringEvent](ConnectionPoolMonitoringEvent.md).[constructor](ConnectionPoolMonitoringEvent.md#constructor)

## Properties

### address

 **address**: `string`

The address (host/port pair) of the pool

#### Inherited from

[ConnectionPoolMonitoringEvent](ConnectionPoolMonitoringEvent.md).[address](ConnectionPoolMonitoringEvent.md#address)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2177

___

### connectionId

 **connectionId**: `number` \| ``"<monitor>"``

The id of the connection

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2208

___

### time

 **time**: `Date`

A timestamp when the event was created

#### Inherited from

[ConnectionPoolMonitoringEvent](ConnectionPoolMonitoringEvent.md).[time](ConnectionPoolMonitoringEvent.md#time)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2175
