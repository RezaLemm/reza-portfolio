import "server-only"

import { createClient } from "next-sanity"

import { dataset, projectId } from "../env"

export const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-10-01",
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN || undefined,
  perspective: "published",
})
