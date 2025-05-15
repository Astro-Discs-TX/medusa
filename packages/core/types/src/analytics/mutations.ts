export interface TrackAnalyticsEventDTO {
  /**
   * The event name
   */
  event: string
  /**
   * The actor of the event, if there is any
   */
  actor?: {
    id: string
  }
  /**
   * The group that the event is for, such as an organization or team.
   * The "type" defines the name of the group (eg. "organization"), and the "id" is the id of the group.
   */
  group?: {
    type?: string
    id?: string
  }
  /**
   * The properties of the event. The format and content depends on the provider.
   */
  properties?: Record<string, any>
}

// Either actorId or groupId must be provided. Depending on the provided identifier, the properties will be set for the actor or group.
export interface IdentifyAnalyticsEventDTO {
  /**
   * The actor of the event, if there is any
   */
  actor?: {
    id: string
  }
  /**
   * The group that the event is for, such as an organization or team.
   */
  group?: {
    type?: string
    id?: string
  }
  /**
   * The properties that will be set on either the actor or group.
   */
  properties?: Record<string, any>
}
