# ConnectionPoolCreatedEvent

An event published when a connection pool is created

## Hierarchy

- [`ConnectionPoolMonitoringEvent`](ConnectionPoolMonitoringEvent.md)

  ↳ **`ConnectionPoolCreatedEvent`**

## Constructors

### constructor

**new ConnectionPoolCreatedEvent**()

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

### options

 `Optional` **options**: [`ConnectionPoolOptions`](../interfaces/ConnectionPoolOptions.md)

The options used to create this connection pool

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2152

___

### time

 **time**: `Date`

A timestamp when the event was created

#### Inherited from

[ConnectionPoolMonitoringEvent](ConnectionPoolMonitoringEvent.md).[time](ConnectionPoolMonitoringEvent.md#time)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2175
