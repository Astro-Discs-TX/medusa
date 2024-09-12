import { snakeCase } from "lodash"
import { NodeSDK } from "@opentelemetry/sdk-node"
import { Resource } from "@opentelemetry/resources"
import { SpanStatusCode } from "@opentelemetry/api"
import { RoutesLoader, Tracer } from "@medusajs/framework"
import {
  type SpanExporter,
  SimpleSpanProcessor,
} from "@opentelemetry/sdk-trace-node"
import { PgInstrumentation } from "@opentelemetry/instrumentation-pg"
import type { Instrumentation } from "@opentelemetry/instrumentation"

import start from "../commands/start"

const EXCLUDED_RESOURCES = [".vite", "virtual:"]

function shouldExcludeResource(resource: string) {
  return EXCLUDED_RESOURCES.some((excludedResource) =>
    resource.includes(excludedResource)
  )
}

/**
 * Instrumenting the first touch point of the Http layer to report traces to
 * OpenTelemetry
 */
export function instrumentHttpLayer() {
  const HTTPTracer = new Tracer("@medusajs/http", "2.0.0")

  start.traceRequestHandler = async (requestHandler, req, res) => {
    if (shouldExcludeResource(req.url!)) {
      return await requestHandler()
    }

    const traceName = `${req.method} ${req.url}`
    await HTTPTracer.trace(traceName, async (span) => {
      span.setAttributes({
        "http.url": req.url,
        "http.method": req.method,
        ...req.headers,
      })

      try {
        await requestHandler()
      } finally {
        span.setAttributes({ "http.statusCode": res.statusCode })
        span.end()
      }
    })
  }

  /**
   * Instrumenting the route handler to report traces to
   * OpenTelemetry
   */
  RoutesLoader.instrument.route((handler) => {
    const traceName = `route: ${
      handler.name ? snakeCase(handler.name) : `anonymous`
    }`

    return async (req, res) => {
      if (shouldExcludeResource(req.originalUrl)) {
        return await handler(req, res)
      }

      await HTTPTracer.trace(traceName, async (span) => {
        try {
          await handler(req, res)
        } catch (error) {
          span.setStatus({
            code: SpanStatusCode.ERROR,
            message: error.message || "Failed",
          })
        } finally {
          span.end()
        }
      })
    }
  })

  /**
   * Instrumenting the middleware handler to report traces to
   * OpenTelemetry
   */
  RoutesLoader.instrument.middleware((handler) => {
    const traceName = `middleware: ${
      handler.name ? snakeCase(handler.name) : `anonymous`
    }`

    return async (req, res, next) => {
      if (shouldExcludeResource(req.originalUrl)) {
        return handler(req, res, next)
      }

      await HTTPTracer.trace(traceName, async (span) => {
        return new Promise<void>((resolve, reject) => {
          const _next = (error?: any) => {
            if (error) {
              span.setStatus({
                code: SpanStatusCode.ERROR,
                message: error.message || "Failed",
              })
              span.end()
              reject(error)
            } else {
              span.end()
              resolve()
            }
          }

          handler(req, res, _next)
        })
      })
        .catch(next)
        .then(next)
    }
  })
}

/**
 * A helper function to configure the OpenTelemetry SDK with some defaults.
 * For better/more control, please configure the SDK manually.
 *
 * You will have to install the following packages within your app for
 * telemetry to work
 *
 * - @opentelemetry/sdk-node
 * - @opentelemetry/resources
 * - @opentelemetry/sdk-trace-node
 * - @opentelemetry/instrumentation-pg
 * - @opentelemetry/instrumentation
 */
export function registerOtel(options: {
  serviceName: string
  exporter: SpanExporter
  instrumentations?: Instrumentation[]
}) {
  const sdk = new NodeSDK({
    serviceName: options.serviceName,
    resource: new Resource({
      "service.name": options.serviceName,
    }),
    spanProcessor: new SimpleSpanProcessor(options.exporter),
    instrumentations: [
      new PgInstrumentation(),
      ...(options.instrumentations || []),
    ],
  })
  sdk.start()
  return sdk
}
